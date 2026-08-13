function calcOfflineProgress() {const state = getBreakthroughState();
            if (state.active) {
                let now = Date.now();
                let elapsedSecs = (now - state.lastTick) / 1000;
                if (elapsedSecs > 0) {
                    let actualSecs = Math.max(1, Math.floor(elapsedSecs));
                    p.wood += actualSecs * (p.estate.woodLv * 2);
                    p.herb += actualSecs * (p.estate.herbLv * 1);
                    p.iron += actualSecs * (p.estate.ironLv * 0.5);
                    state.lastTick = now;
                    p.meditation.lastTick = now;
                    if (elapsedSecs > 60) logMsg(`🧘 Trở lại sau ${Math.floor(elapsedSecs/60)} phút đột phá. Động Phủ thu thập đầy ắp.`, "text-cyan-300 font-bold");
                }
            }
        }

        function checkDeath() {
            if (p.hp <= 0) {
                let maxExp = getMaxExp(p.lv); let loss = Math.floor(maxExp * 0.1);
                p.exp = Math.max(0, p.exp - loss); p.hp = Math.floor(getTotalStats().hp * 0.1); 
                logMsg(`💀 Trọng thương! Mất ${formatNum(loss)} EXP để bảo toàn nguyên thần.`, "text-rose-500 font-bold bg-rose-950/50 px-2 py-1 rounded inline-block");
                playSfx('hurt'); updateUI();
                if (isAutoExploring) { 
                    if (isAutoExploring) toggleAutoExplore(); 
                    logMsg("🛑 Auto Lịch Luyện đã tự động ngắt do trọng thương!", "text-rose-300 italic"); 
                }
                if (isAutoTower) { 
                    if (isAutoTower) toggleAutoTower(); 
                    logMsg("🛑 Auto Leo Tháp đã tự động ngắt do trọng thương!", "text-rose-300 italic"); 
                }
                return true;
            }
            return false;
        }

        window.addEventListener('beforeunload', () => {
            syncOfflineAutoState();
            saveGame();
        });

        setInterval(() => {
            if (getActiveAutoMode()) {
                syncOfflineAutoState();
                saveGame();
            }
        }, 5000);

        window.onload = () => { loadGame(); };

        const SERVER_IP = window.location.hostname || "localhost"; 
        let socket = { readyState: 3, send: function(){} }; 
        
        try {
            const isCanvasEnv = window.self !== window.top || window.location.hostname === '' || window.location.hostname.includes('google');
            
            if (!isCanvasEnv) {
                socket = new WebSocket(`ws://${SERVER_IP}:8080`);

                socket.onopen = function(e) {
                    console.log("[open] Đã thiết lập kết nối");
                    logMsg("🔗 Đã kết nối tới máy chủ cục bộ.", "text-green-400");
                    socket.send(JSON.stringify({ type: 'join', name: p.name || 'Vô Danh' }));
                };

                socket.onmessage = function(event) {
                    const data = JSON.parse(event.data);

                    if (data.type === 'bossUpdate' && data.boss) {
                        renderWorldBossUI(data.boss);
                    }
                    
                    if (data.type === 'log') {
                        logMsg(data.message, data.color || 'text-slate-300');
                    }
                };

                socket.onclose = function(event) {
                    logMsg("🔌 Mất kết nối tới máy chủ.", "text-red-500");
                    const bossUI = document.getElementById('world-boss-ui');
                    if (bossUI) bossUI.classList.add('hidden');
                };

                socket.onerror = function(error) {
                    logMsg("❌ Lỗi kết nối WebSocket. Hãy chắc chắn server đang chạy và đúng địa chỉ IP.", "text-red-500");
                };
            } else {
                console.log("Môi trường Canvas: Tạm ngưng kết nối WebSocket để tránh vi phạm bảo mật.");
            }
        } catch(e) {
            console.log("Chế độ chơi đơn: WebSocket không khả dụng trong môi trường này.");
        }