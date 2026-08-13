let dialogResolve = null;function showDialog({ title, msg, type = 'alert', defaultInput = '' }) {
            return new Promise(resolve => {
                const overlay = document.getElementById('custom-dialog-overlay');
                const input = document.getElementById('dialog-input');
                const btnCancel = document.getElementById('dialog-btn-cancel');
                
                document.getElementById('dialog-title').innerText = title;
                document.getElementById('dialog-msg').innerText = msg;
                
                if (type === 'prompt') {
                    input.classList.remove('hidden');
                    input.value = defaultInput;
                    btnCancel.classList.remove('hidden');
                } else if (type === 'confirm') {
                    input.classList.add('hidden');
                    btnCancel.classList.remove('hidden');
                } else {
                    input.classList.add('hidden');
                    btnCancel.classList.add('hidden');
                }
                
                overlay.classList.remove('hidden');
                overlay.classList.add('flex');
                dialogResolve = resolve;
            });
        }

        function closeDialog(result) {
            const overlay = document.getElementById('custom-dialog-overlay');
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
            if (dialogResolve) {
                dialogResolve(result);
                dialogResolve = null;
            }
        }

        function exportSave() {
            playSfx('click');
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "CuuThienTuTien_Save_" + p.name + ".json");
            document.body.appendChild(downloadAnchorNode); // Bắt buộc cho Firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            logMsg("💾 Đã tải file lưu trữ [Save] xuống thiết bị thành công!", "text-green-400 font-bold");
        }

        function importSave(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData && importedData.lv !== undefined) {
                        p = deepMergeState(defaultState, importedData);
                        saveGame();
                        logMsg("📂 Đã nạp file lưu trữ thành công! Hệ thống đang đồng bộ...", "text-green-400 font-bold");
                        setTimeout(() => location.reload(), 1000); // Reload để đồng bộ toàn bộ game
                    } else {
                        logMsg("❌ File JSON không hợp lệ hoặc bị hỏng!", "text-rose-400");
                    }
                } catch (err) {
                    logMsg("❌ Lỗi khi đọc file JSON!", "text-rose-400");
                }
            };
            reader.readAsText(file);
            event.target.value = ''; // Reset input để có thể load lại cùng file
        }

        function openAdminModal() {
            playSfx('click');
            document.getElementById('admin-lv').value = p.lv;
            document.getElementById('admin-sp').value = p.sp;
            document.getElementById('admin-coins').value = p.coins;
            const primalInput = document.getElementById('admin-primal');
            if (primalInput) primalInput.value = p.primal;
            const tuviInput = document.getElementById('admin-tuvi');
            if (tuviInput) tuviInput.value = p.tuvi;
            document.getElementById('admin-tower').value = p.towerFloor;
            document.getElementById('admin-wood').value = Math.floor(p.wood);
            document.getElementById('admin-herb').value = Math.floor(p.herb);
            document.getElementById('admin-iron').value = Math.floor(p.iron);
            
            let modal = document.getElementById('modal-admin');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        function applyAdminChanges() {
            playSfx('buy');
            p.lv = Math.max(1, Math.min(99999, parseInt(document.getElementById('admin-lv').value) || 1));
            p.highestLv = Math.max(p.highestLv, p.lv);
            p.sp = Math.max(0, parseInt(document.getElementById('admin-sp').value) || 0);
            p.coins = Math.max(0, parseInt(document.getElementById('admin-coins').value) || 0);
            const primalInput = document.getElementById('admin-primal');
            if (primalInput) p.primal = Math.max(0, parseInt(primalInput.value) || 0);
            const tuviInput = document.getElementById('admin-tuvi');
            if (tuviInput) p.tuvi = Math.max(0, parseInt(tuviInput.value) || 0);
            p.towerFloor = Math.max(1, parseInt(document.getElementById('admin-tower').value) || 1);
            p.wood = Math.max(0, parseInt(document.getElementById('admin-wood').value) || 0);
            p.herb = Math.max(0, parseInt(document.getElementById('admin-herb').value) || 0);
            p.iron = Math.max(0, parseInt(document.getElementById('admin-iron').value) || 0);
            
            p.exp = 0; 
            normalizeRealmStage();
            closeAdminModal();
            updateUI();
            logMsg("⚙️ Đã áp dụng thay đổi từ quyền Admin Thiên Đạo!", "text-fuchsia-400 font-bold");
        }

        function closeAdminModal() {
            playSfx('click');
            let modal = document.getElementById('modal-admin');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function adminGiveAllItems() {
            playSfx('lvlup');
            for (let key in DB_ITEMS) {
                p.inv[key] = (p.inv[key] || 0) + 10;
            }
            logMsg("⚙️ Đã phát trọn bộ đạo cụ (x10 mỗi loại) vào túi đồ!", "text-amber-400 font-bold");
            if (document.getElementById('view-inv').classList.contains('active')) renderInv();
        }

        function adminMaxEstate() {
            playSfx('lvlup');
            p.estate.woodLv += 100;
            p.estate.herbLv += 100;
            p.estate.ironLv += 100;
            p.estate.furnaceLv += 100;
            logMsg("⚙️ Động Phủ & Đỉnh Lô đã được buff thêm 100 cấp độ!", "text-emerald-400 font-bold");
            if (document.getElementById('view-dongphu').classList.contains('active')) renderDongPhu();
        }

        function adminUnlockMeridians() {
            playSfx('boss');
            p.meridians.level = MERIDIANS.length;
            p.meridians.node = 0;
            logMsg("⚙️ Đã khai mở Đại Viên Mãn toàn bộ hệ thống Kinh Mạch!", "text-blue-400 font-bold");
            updateUI();
            if (document.getElementById('view-char').classList.contains('active')) renderMeridians();
        }

        document.getElementById('dialog-btn-confirm').addEventListener('click', () => {
            const input = document.getElementById('dialog-input');
            if (!input.classList.contains('hidden')) {
                closeDialog(input.value);
            } else {
                closeDialog(true);
            }
        });
        document.getElementById('dialog-btn-cancel').addEventListener('click', () => closeDialog(false));

        function getActiveAutoMode() {
            if (isAutoExploring) return 'explore';
            if (isAutoTower) return 'tower';
            if (isAutoMeridian) return 'meridian';
            if (isBreakthroughActive()) return 'breakthrough';
            return null;
        }

        function syncOfflineAutoState() {
            if (!p.autoOffline) {
                p.autoOffline = { activeMode: null, lastSavedAt: Date.now() };
            }
            p.autoOffline.activeMode = getActiveAutoMode();
            p.autoOffline.lastSavedAt = Date.now();
        }

        function saveGame() {
            syncOfflineAutoState();
            localStorage.setItem(SAVE_KEY, JSON.stringify(p));
            let ind = document.getElementById('save-indicator');
            ind.style.opacity = 1; setTimeout(() => { ind.style.opacity = 0; }, 500);
        }

        function applyOfflineAutoProgress() {
            const state = p.autoOffline || { activeMode: null, lastSavedAt: Date.now() };
            const lastSavedAt = Number(state.lastSavedAt) || Date.now();
            const elapsedSecs = Math.max(0, Math.floor((Date.now() - lastSavedAt) / 1000));
            if (!elapsedSecs || !state.activeMode) return;

            const tStats = getTotalStats();
            let offlineExp = 0;
            let offlineCoins = 0;
            let offlineWood = 0;
            let offlineHerb = 0;
            let offlineIron = 0;
            let offlineKmd = 0;
            let offlineHgd = 0;

            if (state.activeMode === 'explore') {
                offlineExp = Math.floor(elapsedSecs * Math.max(5, Math.floor(getMaxExp(p.lv) / 900)) * tStats.expRate);
                offlineCoins = Math.floor(elapsedSecs * Math.max(2, p.lv * 0.4 + tStats.atk * 0.02));
                offlineWood = Math.floor(elapsedSecs * Math.max(1, p.estate.woodLv * 0.6));
                offlineHerb = Math.floor(elapsedSecs * Math.max(1, p.estate.herbLv * 0.4));
                offlineIron = Math.floor(elapsedSecs * Math.max(1, p.estate.ironLv * 0.25));
                if (Math.random() < 0.08 * tStats.luck) offlineKmd += Math.max(1, Math.floor(elapsedSecs / 20));
                if (Math.random() < 0.015 * tStats.luck) offlineHgd += 1;
            } else if (state.activeMode === 'tower') {
                const clears = Math.max(1, Math.floor(elapsedSecs / 4));
                const floor = Math.max(1, p.towerFloor || 1);
                offlineExp = Math.floor(clears * Math.max(150, getMaxExp(floor) * 0.04));
                offlineCoins = Math.floor(clears * floor * 250);
                offlineWood = Math.floor(clears * floor * 6);
                offlineHerb = Math.floor(clears * floor * 6);
                offlineIron = Math.floor(clears * floor * 6);
                offlineKmd += Math.floor(clears * 3 + Math.random() * 2);
                if (Math.random() < 0.25) offlineHgd += 1;
            } else if (state.activeMode === 'meridian') {
                offlineKmd += Math.max(5, Math.floor(elapsedSecs / 5) * 8);
                offlineHgd += Math.max(0, Math.floor(elapsedSecs / 60));
                offlineExp = Math.floor(elapsedSecs * Math.max(2, Math.floor(getMaxExp(p.lv) / 1500)));
            }

            p.exp += offlineExp;
            p.coins += offlineCoins;
            p.wood += offlineWood;
            p.herb += offlineHerb;
            p.iron += offlineIron;
            p.inv['kmd'] = (p.inv['kmd'] || 0) + offlineKmd;
            p.inv['hgd'] = (p.inv['hgd'] || 0) + offlineHgd;

            state.lastSavedAt = Date.now();
            logMsg(`🕒 Hệ thống đã cộng phần thưởng Auto Offline trong ${elapsedSecs}s ở chế độ ${state.activeMode}. (+${formatNum(offlineExp)} TV, +${formatNum(offlineCoins)} LT).`, 'text-cyan-300 font-bold');
        }

        async function loadGame() {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                try {
                    let parsed = JSON.parse(saved);
                    p = deepMergeState(defaultState, parsed);
                    
                    if(p.sp === undefined) p.sp = 0;
                    if(p.attributePoints === undefined) p.attributePoints = 0;
                    if(!p.attributes) p.attributes = { atk: 0, hp: 0, def: 0 };
                    if(!p.towerFloor) p.towerFloor = 1;
                    if(!p.skillLevels) p.skillLevels = {};
                    if(!p.natalWeapon) p.natalWeapon = { unlocked: false, lv: 0 };
                    
                    if(!p.meridians) p.meridians = { level: 0, node: 0 };
                    p.meridians.level = parseInt(p.meridians.level) || 0;
                    p.meridians.node = parseInt(p.meridians.node) || 0;
                    
                    if(!p.bodhiTree) p.bodhiTree = { level: 0, exp: 0 }; 
                    if (!p.clan) p.clan = null;
                    if (p.sect && p.sect.id && p.sect.id !== 'none') {
                        p.sect = { ...createSectState(p.sect.id), ...p.sect };
                        p.sect.level = Math.max(1, parseInt(p.sect.level) || 1);
                        p.sect.breakthrough = Math.max(0, parseInt(p.sect.breakthrough) || 0);
                        p.sect.reputation = Math.max(0, parseInt(p.sect.reputation) || 0);
                        p.sect.members = Math.max(1, parseInt(p.sect.members) || 1);
                        p.sect.bossDefeated = Boolean(p.sect.bossDefeated);
                        p.sect.recruitmentOpen = Boolean(p.sect.recruitmentOpen);
                    } else {
                        p.sect = null;
                    }
                    if (p.clan) {
                        if (!p.clan.members) p.clan.members = [];
                        if (!p.clan.manager) p.clan.manager = { name: 'Quản Gia', role: 'Quản Gia' };
                        p.clan.level = Math.max(1, Math.min(99999, parseInt(p.clan.level) || 1));
                        p.clan.exists = Boolean(p.clan.name && p.clan.name.trim());
                    }
                    if(p.lv > 99999) p.lv = 99999; 
                    if (p.realmStage === undefined || p.realmStage === null) p.realmStage = 1;
                    normalizeRealmStage();

                    if (!p.name) {
                        let newName = await showDialog({ title: 'Cập nhật tên', msg: 'Nhập tên cho Đạo Hữu:', type: 'prompt', defaultInput: 'Vô Danh' });
                        p.name = newName || "Vô Danh";
                    }
                    
                    if (!p.autoOffline) p.autoOffline = { activeMode: null, lastSavedAt: Date.now() };
                    p.autoOffline.activeMode = p.autoOffline.activeMode || null;
                    p.autoOffline.lastSavedAt = Number(p.autoOffline.lastSavedAt) || Date.now();

                    p.learnedSkills = [...new Set((p.learnedSkills || []).filter(Boolean))];
                    p.pets = [...new Set((p.pets || []).filter(Boolean))];
                    p.mounts = [...new Set((p.mounts || []).filter(Boolean))];
                    if(!p.enhanceLevels) p.enhanceLevels = {};
                    if(!p.starLevels) p.starLevels = {};
                    if(!p.petLevels) p.petLevels = {};
                    if(!p.mountLevels) p.mountLevels = {};
                    if(!p.petEnhanceLevels) p.petEnhanceLevels = {};
                    if(!p.mountEnhanceLevels) p.mountEnhanceLevels = {};
                    if(!p.petStarLevels) p.petStarLevels = {};
                    if(!p.mountStarLevels) p.mountStarLevels = {};
                    if(!p.petPassives) p.petPassives = {};
                    if(!p.mountPassives) p.mountPassives = {};
                    p.pets.forEach(id => {
                        if (!p.petLevels[id]) p.petLevels[id] = 1;
                        if (!p.petEnhanceLevels[id]) p.petEnhanceLevels[id] = 0;
                        if (!p.petStarLevels[id]) p.petStarLevels[id] = 0;
                        if (!p.petPassives[id]) p.petPassives[id] = {};
                    });
                    p.mounts.forEach(id => {
                        if (!p.mountLevels[id]) p.mountLevels[id] = 1;
                        if (!p.mountEnhanceLevels[id]) p.mountEnhanceLevels[id] = 0;
                        if (!p.mountStarLevels[id]) p.mountStarLevels[id] = 0;
                        if (!p.mountPassives[id]) p.mountPassives[id] = {};
                    });
                    if(!p.breakthrough) p.breakthrough = { active:false, start:0, lastTick:0, cycles:0, targetCycles:1, auto:false };
                    p.breakthrough.active = Boolean(p.breakthrough.active);
                    p.breakthrough.start = parseInt(p.breakthrough.start) || 0;
                    p.breakthrough.lastTick = parseInt(p.breakthrough.lastTick) || 0;
                    p.breakthrough.cycles = parseInt(p.breakthrough.cycles) || 0;
                    p.breakthrough.targetCycles = Math.max(1, parseInt(p.breakthrough.targetCycles) || 1);
                    p.breakthrough.auto = Boolean(p.breakthrough.auto);
                    if (p.meditation && p.meditation.active && !p.breakthrough.active) {
                        p.breakthrough.active = true;
                        p.breakthrough.start = p.meditation.start || Date.now();
                        p.breakthrough.lastTick = p.meditation.lastTick || Date.now();
                        p.breakthrough.targetCycles = Math.max(1, parseInt(p.meditation.hours) || 1);
                    }

                    // Nếu đang đột phá dở dang từ lần trước → hoàn tất ngay để không kẹt active
                    if (getBreakthroughState().active) {
                        setTimeout(() => resolveBreakthrough(true), 100);
                    }

                    logMsg("✨ Đã tải tiến trình tu luyện.", "text-cyan-300");
                } catch(e) { console.error("Lỗi load save", e); }
            } else {
                let newName = await showDialog({ title: 'Tạo Nhân Vật', msg: 'Nhập tên cho Đạo Hữu:', type: 'prompt', defaultInput: 'Vô Danh' });
                p.name = newName || "Vô Danh";
                logMsg(`🌟 Chào mừng Đạo Hữu ${p.name} tới Cửu Thiên Tu Tiên. Nhấn Auto Lịch Luyện để tu hành!`, "text-amber-300 font-bold");
            }
            document.getElementById('ui-name').innerText = p.name;
            calcOfflineProgress();
            applyOfflineAutoProgress();
            
            renderInvTabs();
            updateUI();
        }

        function clearAllGameStorage() {
            const prefixes = ['cuuthien', 'tu_tien', 'game_save', 'save_', 'cuu_thien'];
            const keys = [...Object.keys(localStorage)];
            keys.forEach(key => {
                const shouldRemove = key === SAVE_KEY || prefixes.some(prefix => key.toLowerCase().includes(prefix.toLowerCase()));
                if (shouldRemove) localStorage.removeItem(key);
            });
            try {
                sessionStorage.clear();
            } catch (e) {
                console.warn('Không thể xóa sessionStorage:', e);
            }
        }

        function stopAllGameLoops() {
            if (autoExploreInterval) clearInterval(autoExploreInterval);
            if (autoTowerInterval) clearInterval(autoTowerInterval);
            if (autoMeridianInterval) clearInterval(autoMeridianInterval);
            if (autoBreakthroughInterval) clearInterval(autoBreakthroughInterval);
            if (breakthroughInterval) clearInterval(breakthroughInterval);
            if (autoWorldBossInterval) clearTimeout(autoWorldBossInterval);

            isAutoExploring = false;
            isAutoTower = false;
            isAutoMeridian = false;
            isAutoBreakthrough = false;
            isAutoWorldBoss = false;
            autoExploreInterval = null;
            autoTowerInterval = null;
            autoMeridianInterval = null;
            autoBreakthroughInterval = null;
            breakthroughInterval = null;
            autoWorldBossInterval = null;
            
            const bossUI = document.getElementById('world-boss-ui');
            if (bossUI) bossUI.classList.add('hidden');
        }

        async function hardReset() { 
            const confirmed = await showDialog({ title: 'Cảnh Báo', msg: 'Bạn có chắc chắn muốn xóa toàn bộ tiến trình tu luyện?', type: 'confirm' });
            if (!confirmed) return;

            stopAllGameLoops();
            clearAllGameStorage();
            p = deepMergeState(defaultState, {});
            p.name = 'Vô Danh';
            p.autoOffline = { activeMode: null, lastSavedAt: Date.now() };

            logMsg('♻️ Dữ liệu đã được làm mới. Trang sẽ tải lại để bắt đầu lại từ đầu.', 'text-rose-400 font-bold');
            setTimeout(() => location.reload(), 150);
        }

        function formatNum(num) {
            if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
            if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
            if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
            if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
            return Math.floor(num);
        }

        function getMaxExp(lv) { return Math.floor(100 * Math.pow(lv, 1.62)); }
        function getRealmInfo(lv) { for (let i = DB_REALMS.length - 1; i >= 0; i--) if (lv >= DB_REALMS[i].level) return DB_REALMS[i]; return DB_REALMS[0]; }
        /** Đồng bộ realmStage với level hiện tại (cho save cũ / admin chỉnh level). */
        function normalizeRealmStage() {
            if (p.realmStage === undefined || p.realmStage === null) p.realmStage = 1;
            let guard = 0;
            let cap = getRealmStageLevelCap(p.lv, p.realmStage);
            while (p.lv > cap && (p.realmStage || 1) < 4 && guard < 20) {
                p.realmStage = Math.min(4, (p.realmStage || 1) + 1);
                cap = getRealmStageLevelCap(p.lv, p.realmStage);
                guard++;
            }
        }
        function getRealmTierIndex(lv) { for (let i = DB_REALMS.length - 1; i >= 0; i--) if (lv >= DB_REALMS[i].level) return i; return 0; }
        /** Lấy thông tin giai đoạn hiện tại trong cảnh giới (Sơ/Trung/Hậu/Đại Viên Mãn). */
        function getRealmStageInfo(stageId = p.realmStage || 1) {
            const s = Math.max(1, Math.min(4, parseInt(stageId) || 1));
            return DB_REALM_STAGES.find(st => st.id === s) || DB_REALM_STAGES[0];
        }
        function getRealmStageColor(stageId = p.realmStage || 1) { return getRealmStageInfo(stageId).color; }
        /** Chỉ số cảnh giới hiện tại trong DB_REALMS (dựa theo level). */
        function getRealmIndex(lv = p.lv) { return getRealmTierIndex(lv); }
        /** Cảnh giới kế tiếp, hoặc null nếu đã ở Đạo Tổ. */
        function getNextRealm(lv = p.lv) {
            const idx = getRealmIndex(lv);
            return DB_REALMS[idx + 1] || null;
        }
        /** Mốc level tối đa của giai đoạn hiện tại trong cảnh giới (chia đều 4 giai đoạn). */
        function getRealmStageLevelCap(lv = p.lv, stage = p.realmStage || 1) {
            const idx = getRealmIndex(lv);
            const realm = DB_REALMS[idx];
            const next = DB_REALMS[idx + 1] || null;
            if (!next) return 99999;
            const s = Math.max(1, Math.min(4, parseInt(stage) || 1));
            const L_start = realm.level;
            const L_end = next.level - 1;
            const span = L_end - L_start;
            if (s >= 4) return L_end;
            return L_start + Math.floor(span * s / 4);
        }
        /** Mục tiêu đột phá tiếp theo: giai đoạn sau trong cảnh giới, hoặc cảnh giới mới nếu đang Đại Viên Mãn. */
        function getBreakthroughTargetText(lv = p.lv) {
            const realm = getRealmInfo(lv);
            const next = getNextRealm(lv);
            const stage = getRealmStageInfo(p.realmStage);
            if (stage.id >= 4) {
                return next ? `[${next.name}] • Sơ Kỳ` : `Đỉnh phong [${realm.name}]`;
            }
            return `[${realm.name}] • ${getRealmStageInfo(stage.id + 1).name}`;
        }
        /** Thăng tiến giai đoạn; nếu đang Đại Viên Mãn sẽ tấn thăng lên cảnh giới kế tiếp. */
        function promoteRealmStage() {
            const next = getNextRealm(p.lv);
            const stage = getRealmStageInfo(p.realmStage);
            if (stage.id >= 4) {
                if (next) {
                    p.lv = next.level;
                    p.realmStage = 1;
                    p.highestLv = Math.max(p.highestLv || 1, p.lv);
                    return { realm: next, stage: getRealmStageInfo(1) };
                }
                return { maxed: true };
            }
            p.realmStage = stage.id + 1;
            return { stage: getRealmStageInfo(p.realmStage) };
        }
        function getEnhanceLevel(id) { if (!id) return 0; return Math.max(0, Math.min(9999, parseInt((p.enhanceLevels && p.enhanceLevels[id]) || 0))); }
        function getStarLevel(id) { if (!id) return 0; return Math.max(0, Math.min(5, parseInt((p.starLevels && p.starLevels[id]) || 0))); }
        function getPetEnhanceLevel(id) { if (!id) return 0; return Math.max(0, Math.min(9999, parseInt((p.petEnhanceLevels && p.petEnhanceLevels[id]) || 0))); }
        function getMountEnhanceLevel(id) { if (!id) return 0; return Math.max(0, Math.min(9999, parseInt((p.mountEnhanceLevels && p.mountEnhanceLevels[id]) || 0))); }
        function getPetStarLevel(id) { if (!id) return 0; return Math.max(0, Math.min(5, parseInt((p.petStarLevels && p.petStarLevels[id]) || 0))); }
        function getMountStarLevel(id) { if (!id) return 0; return Math.max(0, Math.min(5, parseInt((p.mountStarLevels && p.mountStarLevels[id]) || 0))); }
        function getStarText(star = 0) { if (star <= 0) return '☆'; if (star >= 5) return '🌈'; return '★'.repeat(star); }
        function getBreakthroughStageInfo(lv = p.lv) {
            return BREAKTHROUGH_STAGES.find((stage) => lv >= stage.minLv && lv <= stage.maxLv) || BREAKTHROUGH_STAGES[BREAKTHROUGH_STAGES.length - 1];
        }
        function getBreakthroughStageSuccessRate(lv = p.lv) {
            const tier = getRealmIndex(lv);
            // Luyện Khí (tier 1) ~ 90%, Độ Kiếp (tier 8) ~ 10%
            let rate = 1.0 - (tier * 0.1);
            
            // Phạt tỷ lệ cho các giai đoạn nhỏ trong cùng cảnh giới
            const stageId = p.realmStage || 1;
            const stagePenalty = (stageId - 1) * 0.05;
            rate -= stagePenalty;
            
            return Math.max(0.05, rate); // Tối thiểu 5%
        }
        function getBreakthroughCosts(lv = p.lv) {
            const tier = getRealmIndex(lv);
            const isMajorBreakthrough = (p.realmStage >= 4);
            
            // Yêu cầu Tu Vị (thanh phần trăm)
            const stageIndex = (p.realmStage || 1) - 1;
            const tuviMultiplier = stageIndex === 0 ? 0.12 : stageIndex === 1 ? 0.28 : 0.45;
            let tuviReq = Math.max(1, Math.floor(getMaxExp(lv) * tuviMultiplier * 1.5));
            if (isMajorBreakthrough) tuviReq *= 2;
            
            // Tiêu hao Chân Nguyên cơ bản
            let primalBase = 20 + (lv * 0.1) + (tier * 50);
            if (isMajorBreakthrough) {
                primalBase *= 8; // Gấp 8 lần cho đột phá đại cảnh giới
            }
            
            return {
                tuviCost: tuviReq, // Yêu cầu Tu Vi tối đa (100%)
                primalCost: Math.max(1, Math.floor(primalBase))
            };
        }
        function getMapRewardProfile(map = DB_MAPS[p.mapId], playerLv = p.lv) {
            const stage = getBreakthroughStageInfo(playerLv);
            const stageWeight = stage.id === 'so_ky' ? 1 : stage.id === 'trung_ky' ? 0.72 : 0.48;
            const mapDifficultyBias = map.minLv <= 1000 ? 1.05 : map.minLv <= 10000 ? 0.95 : map.minLv <= 25000 ? 0.82 : map.minLv <= 50000 ? 0.66 : 0.48;
            const gap = Math.max(0, playerLv - map.minLv);
            const gapPenalty = 1 / (1 + gap / 2000);
            const base = Math.max(1, Math.floor(getMaxExp(playerLv) * 0.0012 * stageWeight * mapDifficultyBias * gapPenalty));
            return {
                normal: Math.max(1, Math.floor(base * 0.9)),
                boss: Math.max(1, Math.floor(base * 3.2)),
                dropBias: Math.max(0.03, 0.06 + (mapDifficultyBias - 0.45) * 0.08),
                successRate: getBreakthroughStageSuccessRate(playerLv)
            };
        }
        function calculateMapExpGain(map, isBoss = false, playerLv = p.lv) {
            const profile = getMapRewardProfile(map, playerLv);
            return isBoss ? profile.boss : profile.normal;
        }
        function calculateTowerExpGain(floor, playerLv = p.lv) {
            const floorBias = Math.max(0.35, 1 - Math.max(0, playerLv - floor) / 5000);
            const base = Math.max(1, Math.floor(getMaxExp(Math.max(1, floor)) * 0.012 * floorBias));
            return Math.max(1, Math.floor(base * 0.5));
        }
        function canUseItemByRealm(item, level = p.lv) {
            if (!item) return true;
            if (!item.reqLv) return true;
            const itemTier = getRealmTierIndex(item.reqLv);
            const playerTier = getRealmTierIndex(level);
            return itemTier <= playerTier && item.reqLv <= level;
        }
        function getClanBonuses() {
            if (!p.clan || !p.clan.exists) return { expRate: 1, luck: 1, atkBonus: 0, hpBonus: 0, resourceBonus: 1 };
            const clanLevel = Math.max(1, parseInt(p.clan.level) || 1);
            const members = Array.isArray(p.clan.members) ? p.clan.members.length : 0;
            const managerBonus = p.clan.manager && p.clan.manager.name ? 0.02 : 0;
            return {
                expRate: 1 + (clanLevel - 1) * 0.01 + members * 0.003 + managerBonus,
                luck: 1 + (clanLevel - 1) * 0.002 + members * 0.001 + (managerBonus * 0.5),
                atkBonus: (clanLevel - 1) * 80 + members * 30 + (p.clan.manager ? 150 : 0),
                hpBonus: (clanLevel - 1) * 120 + members * 40 + (p.clan.manager ? 200 : 0),
                resourceBonus: 1 + (clanLevel - 1) * 0.01 + members * 0.005
            };
        }

        function getItemImageHtml(id, item, extraClasses = "w-10 h-10 object-cover rounded shadow-sm border border-white/20 anim-float") {
            if (!item) return '';
            let categoryImg = 'assets/images/armor.jpg';
            let folder = 'items';
            
            if (item.type === 'consumable' || item.type === 'material') {
                categoryImg = 'assets/images/pill.jpg';
            } else if (item.type === 'weapon') {
                categoryImg = 'assets/images/sword.jpg';
            } else if (item.type === 'pet') {
                categoryImg = 'assets/images/dragon.jpg';
                folder = 'pets';
            } else if (item.type === 'mount') {
                categoryImg = 'assets/images/dragon.jpg';
                folder = 'mounts';
            } else if (item.type.includes('book')) {
                categoryImg = 'assets/images/pill.jpg';
                folder = 'skills';
            }
            
            const url = `assets/images/${folder}/${id}.jpg`;
            return `<img src="${url}" onerror="this.onerror=null; this.src='${categoryImg}';" class="${extraClasses}">`;
        }
