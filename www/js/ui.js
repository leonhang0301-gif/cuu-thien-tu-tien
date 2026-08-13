        function updateUI() {let maxExp = getMaxExp(p.lv);
            let leveledUp = false; let oldRealmLevel = getRealmInfo(p.lv).level;
            
            // Giới hạn level theo giai đoạn hiện tại (Phải đột phá mới lên tiếp được)
            let stageCap = getRealmStageLevelCap(p.lv, p.realmStage);
            while (p.exp >= maxExp && p.lv < stageCap) {
                p.exp -= maxExp; p.lv++; p.highestLv = Math.max(p.highestLv || 1, p.lv);
                p.sp += 1;
                p.attributePoints = (p.attributePoints || 0) + 3;
                maxExp = getMaxExp(p.lv); leveledUp = true;
            }
            // Nếu đã đạt giới hạn giai đoạn, giữ lại EXP thừa (không mất, chờ đột phá)
            if (p.lv >= stageCap && p.exp >= maxExp) {
                p.exp = Math.min(p.exp, maxExp * 2); // Giới hạn tránh tràn số
            }
            if (p.lv >= 99999) p.exp = maxExp; 
            
            if (leveledUp) {
                let tStats = getTotalStats(); p.hp = tStats.hp; p.mp = tStats.mp; 
                let r = getRealmInfo(p.lv);
                if (r.level > oldRealmLevel) { logMsg(`⚡ ĐỘT PHÁ THÀNH CÔNG! Thăng lên [${r.name}]`, r.color + " font-bold text-xs bg-white/10 px-2 py-1 rounded inline-block my-1 shadow-sm"); playSfx('boss'); } 
                else { logMsg(`⬆️ Thăng cấp Level ${formatNum(p.lv)}. Nhận 1 SP và 3 điểm thuộc tính.`, "text-cyan-200"); playSfx('lvlup'); }
                renderMapList(); 
                
                if (p.lv >= 100 && !p.natalWeapon.unlocked) {
                    p.natalWeapon.unlocked = true;
                    logMsg("✨ Đạt Kết Đan Cảnh! Khai mở [Bản Mệnh Pháp Bảo] trong Động Phủ.", "text-amber-300 font-bold");
                }
            }
            
            let tStats = getTotalStats();
            if (p.hp > tStats.hp) p.hp = tStats.hp; if (p.mp > tStats.mp) p.mp = tStats.mp;
            if (p.hp < 0) p.hp = 0; if (p.mp < 0) p.mp = 0;

            let realm = getRealmInfo(p.lv);
            document.getElementById('ui-name').innerText = p.name || 'Vô Danh Thiếu Niên';
            let stageInfo = getRealmStageInfo();
            document.getElementById('ui-realm').innerHTML = `<span class="${realm.color} drop-shadow text-xs">${realm.name}</span> <span class="${stageInfo.color} font-bold text-xs">• ${stageInfo.name}</span> <span class="text-white opacity-80">(Lv ${formatNum(p.lv)})</span>`;
            document.getElementById('ui-hp').innerText = formatNum(p.hp); document.getElementById('ui-hp-bar').style.width = `${Math.max(0, (p.hp/tStats.hp)*100)}%`;
            document.getElementById('ui-mp').innerText = formatNum(p.mp); document.getElementById('ui-mp-bar').style.width = `${Math.max(0, (p.mp/tStats.mp)*100)}%`;
            document.getElementById('ui-coins').innerText = formatNum(p.coins);
            document.getElementById('ui-primal').innerText = formatNum(p.primal);
            let tuviReq = getBreakthroughCosts(p.lv).tuviCost;
            document.getElementById('ui-tuvi').innerText = `${Math.min(100, ((p.tuvi/tuviReq)*100)).toFixed(1)}%`;
            document.getElementById('ui-tuvi-bar').style.width = `${Math.min(100, (p.tuvi/tuviReq)*100)}%`;
            document.getElementById('ui-exp').innerText = p.lv>=99999 ? 'MAX' : `${((p.exp/maxExp)*100).toFixed(1)}%`;
            document.getElementById('ui-exp-bar').style.width = p.lv>=99999 ? '100%' : `${(p.exp/maxExp)*100}%`;

            let curMap = DB_MAPS[p.mapId];
            document.getElementById('ui-map-name').innerText = `${curMap.name} (Lv ${formatNum(curMap.minLv)}+)`;
            document.getElementById('map-bg').style.backgroundImage = `url('${MAP_IMAGES[curMap.img]}')`;
            applyBattleAura();
            autoUseRecoveryPills();

            if (document.getElementById('view-char').classList.contains('active')) {
                let infoCont = document.getElementById('char-info-container');
                if (infoCont && !infoCont.classList.contains('hidden')) renderCharStats();
                else renderMeridians();
            }
            if (document.getElementById('view-dongphu').classList.contains('active')) renderDongPhu();
            saveGame();
        }

        function switchTab(tabId, btnElement) {
            playSfx('click');
            if(isCombat && tabId !== 'combat') return logMsg("❌ Đang xuất khiếu chiến đấu, không thể phân tâm!", "text-rose-400 font-bold");
            
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`view-${tabId}`).classList.add('active');
            
            document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
            if(btnElement) btnElement.classList.add('active');
            document.getElementById('main-scroll-area').scrollTop = 0;

            renderViews();
        }

        function switchCharTab(tab) {
            playSfx('click');
            const btnInfo = document.getElementById('btn-char-info');
            const btnMeridian = document.getElementById('btn-char-meridian');
            const contInfo = document.getElementById('char-info-container');
            const contMeridian = document.getElementById('char-meridian-container');

            if (tab === 'info') {
                btnInfo.className = "text-base font-bold text-cyan-400 flex items-center gap-2 border-b-2 border-cyan-400 pb-1 transition-colors";
                btnMeridian.className = "text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                contInfo.classList.remove('hidden'); contInfo.classList.add('flex');
                contMeridian.classList.add('hidden'); contMeridian.classList.remove('flex');
                renderCharStats();
            } else {
                btnMeridian.className = "text-base font-bold text-cyan-400 flex items-center gap-2 border-b-2 border-cyan-400 pb-1 transition-colors";
                btnInfo.className = "text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                contMeridian.classList.remove('hidden'); contMeridian.classList.add('flex');
                contInfo.classList.add('hidden'); contInfo.classList.remove('flex');
                renderMeridians();
            }
        }

        function switchDongPhuTab(tab) {
            playSfx('click');
            const btnBase = document.getElementById('btn-dp-base');
            const btnTree = document.getElementById('btn-dp-tree');
            const btnClan = document.getElementById('btn-dp-clan');
            const btnSect = document.getElementById('btn-dp-sect');
            const contBase = document.getElementById('dp-base-container');
            const contTree = document.getElementById('dp-tree-container');
            const contClan = document.getElementById('dp-clan-container');
            const contSect = document.getElementById('dp-sect-container');

            [btnBase, btnTree, btnClan, btnSect].forEach(btn => btn.className = "text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors");
            [contBase, contTree, contClan, contSect].forEach(cont => { cont.classList.add('hidden'); cont.classList.remove('flex'); });

            if (tab === 'base') {
                btnBase.className = "text-base font-bold text-teal-400 flex items-center gap-2 border-b-2 border-teal-400 pb-1 transition-colors";
                contBase.classList.remove('hidden'); contBase.classList.add('flex');
            } else if (tab === 'tree') {
                btnTree.className = "text-base font-bold text-emerald-400 flex items-center gap-2 border-b-2 border-emerald-400 pb-1 transition-colors";
                contTree.classList.remove('hidden'); contTree.classList.add('flex');
            } else if (tab === 'clan') {
                btnClan.className = "text-base font-bold text-fuchsia-400 flex items-center gap-2 border-b-2 border-fuchsia-400 pb-1 transition-colors";
                contClan.classList.remove('hidden'); contClan.classList.add('flex');
            } else if (tab === 'sect') {
                btnSect.className = "text-base font-bold text-amber-400 flex items-center gap-2 border-b-2 border-amber-400 pb-1 transition-colors";
                contSect.classList.remove('hidden'); contSect.classList.add('flex');
            }
            renderDongPhu();
        }
        
        function switchMapTab(tab) {
            playSfx('click');
            const btnMap = document.getElementById('btn-map-tab');
            const btnTower = document.getElementById('btn-tower-tab');
            const contMap = document.getElementById('map-container');
            const contTower = document.getElementById('tower-container');

            if (tab === 'map') {
                btnMap.className = "text-base font-bold text-orange-400 flex items-center gap-2 border-b-2 border-orange-400 pb-1 transition-colors";
                btnTower.className = "text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                contMap.classList.remove('hidden'); contMap.classList.add('flex');
                contTower.classList.add('hidden'); contTower.classList.remove('flex');
                renderMapList();
            } else {
                btnTower.className = "text-base font-bold text-red-400 flex items-center gap-2 border-b-2 border-red-400 pb-1 transition-colors";
                btnMap.className = "text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                contTower.classList.remove('hidden'); contTower.classList.add('flex');
                contMap.classList.add('hidden'); contMap.classList.remove('flex');
                renderTower();
            }
        }

        function renderViews() { renderCharStats(); renderMeridians(); renderDongPhu(); renderInv(); renderPetList(); renderMountList(); renderShop(); renderMapList(); renderTower(); }

        function getBreakthroughState() {
            if (!p.breakthrough) {
                p.breakthrough = { active: false, start: 0, lastTick: 0, cycles: 0, targetCycles: 1, auto: false };
            }
            return p.breakthrough;
        }

        function isBreakthroughActive() {
            return Boolean(getBreakthroughState().active);
        }

        function openBreakthroughModal() {
            const modal = document.getElementById('modal-meditate');
            const setup = document.getElementById('meditate-setup');
            const activeUi = document.getElementById('meditate-active-ui');
            if (!modal || !setup || !activeUi) return;

            if (isBreakthroughActive()) {
                setup.classList.add('hidden');
                activeUi.classList.remove('hidden');
                activeUi.classList.add('flex');
                updateBreakthroughDisplay();
            } else {
                setup.classList.remove('hidden');
                activeUi.classList.add('hidden');
                activeUi.classList.remove('flex');
            }

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeBreakthroughModal() {
            const modal = document.getElementById('modal-meditate');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        function startBreakthrough(targetCycles = 1, auto = false) {
            const cycles = Math.max(1, parseInt(targetCycles) || 1);
            const state = getBreakthroughState();
            const stage = getBreakthroughStageInfo(p.lv);
            const successRate = getBreakthroughStageSuccessRate(p.lv);
            if (state.active) {
                openBreakthroughModal();
                return logMsg('⚡ Đạo hữu đang đột phá, hãy chờ kết thúc trước khi bắt đầu lần mới.', 'text-cyan-300');
            }

            // Không thể đột phá khi chưa đạt tối đa cấp độ của giai đoạn
            const stageCap = getRealmStageLevelCap(p.lv, p.realmStage);
            if (p.lv < stageCap) {
                return logMsg(`❌ Chưa đạt đỉnh của giai đoạn! Cần đạt Lv ${formatNum(stageCap)} trước khi đột phá. Hiện tại Lv ${formatNum(p.lv)}.`, 'text-rose-400');
            }

            const costs = getBreakthroughCosts(p.lv);
            if (p.tuvi < costs.tuviCost) {
                return logMsg(`❌ Tiến Độ Tu Vi chưa đạt 100%! Cần thu thập thêm Tu Vi.`, 'text-rose-400');
            }
            if (p.primal < costs.primalCost) {
                return logMsg(`❌ Không đủ Chân Nguyên! Cần ${formatNum(costs.primalCost)} Chân Nguyên để đột phá.`, 'text-rose-400');
            }
            // Chỉ trừ Chân Nguyên lúc bắt đầu, Tu Vi sẽ trừ khi có kết quả
            p.primal = Math.max(0, p.primal - costs.primalCost);

            state.active = true;
            state.start = Date.now();
            state.lastTick = Date.now();
            state.cycles = 0;
            state.targetCycles = auto ? 999999 : cycles;
            state.auto = Boolean(auto);
            state.isDone = false;

            p.meditation = {
                active: true,
                start: state.start,
                lastTick: state.lastTick,
                hours: state.targetCycles,
                rates: { expRate: Math.max(1, Math.floor(getMaxExp(p.lv) / 1200)), hpRate: 1, mpRate: 1 },
                cost: costs
            };

            playSfx('heal');
            const targetText = getBreakthroughTargetText();
            logMsg(`⚡ Bắt đầu đột phá: Thử thách trùng kích -> ${targetText}, tỷ lệ thành công ${(successRate * 100).toFixed(1)}%. Tiêu hao ${formatNum(costs.primalCost)} Chân Nguyên.`, 'text-cyan-300 font-bold');
            openBreakthroughModal();
            updateBreakthroughDisplay();

            // Đột phá mất ~3 giây tụ khí rồi mới kết quả
            if (breakthroughInterval) clearInterval(breakthroughInterval);
            breakthroughInterval = setTimeout(() => {
                breakthroughInterval = null;
                resolveBreakthrough(true);
            }, 3000);
        }

        /** Xử lý roll kết quả đột phá và thăng tiến giai đoạn/cảnh giới. */
        function resolveBreakthrough(fromTimer = false) {
            const state = getBreakthroughState();
            if (!state.active) return;
            const stage = getBreakthroughStageInfo(p.lv);
            const stageRate = getBreakthroughStageSuccessRate(p.lv);

            state.cycles += 1;
            const rewardExp = Math.max(1, Math.floor(getMaxExp(p.lv)));
            const isSuccess = Math.random() <= stageRate;

            const costs = getBreakthroughCosts(p.lv);

            if (isSuccess) {
                // Thành công -> Trừ đi lượng Tu Vi yêu cầu (100%)
                p.tuvi = Math.max(0, p.tuvi - costs.tuviCost);
                // Đột phá thành công → thăng tiến giai đoạn hoặc lên cảnh giới mới
                const result = promoteRealmStage();
                if (result && result.maxed) {
                    p.exp += rewardExp;
                    logMsg(`🏆 Đã đạt Đỉnh Phong [${getRealmInfo(p.lv).name}]! Không còn cảnh giới nào cao hơn để đột phá.`, 'text-amber-400 font-extrabold');
                    playSfx('lvlup');
                } else if (result && result.realm) {
                    p.exp += rewardExp;
                    logMsg(`✨ ĐẠI ĐỘT PHÁ! Tấn thăng lên [${result.realm.name}] • ${result.stage.name}! (Lv ${formatNum(p.lv)})`, 'text-amber-400 font-extrabold bg-amber-900/30 px-2 py-1 rounded inline-block my-1 shadow-sm');
                    playSfx('boss');
                } else {
                    p.exp += rewardExp;
                    logMsg(`⚡ Đột phá thành công! Tu vi tiến lên [${getRealmInfo(p.lv).name}] • ${getRealmStageInfo().name}! (Lv ${formatNum(p.lv)})`, 'text-emerald-300 font-bold');
                    playSfx('lvlup');
                }
            } else {
                // Thất bại -> Tẩu Hỏa Nhập Ma
                const penaltyRatio = 0.10 + (Math.random() * 0.20); // Mất 10-30% lượng yêu cầu
                const lostTuvi = Math.floor(costs.tuviCost * penaltyRatio);
                p.tuvi = Math.max(0, p.tuvi - lostTuvi);
                p.hp = 1; // Rút cạn HP về 1
                logMsg(`⚠️ TẨU HỎA NHẬP MA! Đột phá thất bại, năng lượng phản phệ! Trọng thương (HP tụt còn 1) và tiêu tán ${formatNum(lostTuvi)} Tu Vi.`, 'text-rose-500 font-bold');
                playSfx('hurt');
            }

            state.isDone = true;

            // Auto: tiếp tục chu kỳ nếu còn nguyên liệu; Manual: hoàn tất
            if (state.auto) {
                const costs = getBreakthroughCosts(p.lv);
                const stageCap = getRealmStageLevelCap(p.lv, p.realmStage);
                if (p.lv >= 99999 && (p.realmStage || 1) >= 4) {
                    logMsg('🏆 Đã đạt Đỉnh Cao Nhất Cửu Thiên! Dừng Auto Đột Phá.', 'text-amber-400 font-bold');
                    stopBreakthrough(true);
                    return;
                }
                if (p.tuvi < costs.tuviCost || p.primal < costs.primalCost) {
                    logMsg('🛑 Hết Chân Nguyên/Tu Vị, Auto Đột Phá tự dừng.', 'text-rose-400');
                    stopBreakthrough(true);
                    return;
                }
                if (p.lv < stageCap) {
                    logMsg('🛑 Đã đột phá xong, chờ tu luyện lên cấp trước khi đột phá tiếp.', 'text-cyan-300');
                    stopBreakthrough(true);
                    return;
                }
                // Chu kỳ tiếp theo
                p.tuvi = Math.max(0, p.tuvi - costs.tuviCost);
                p.primal = Math.max(0, p.primal - costs.primalCost);
                state.start = Date.now();
                state.lastTick = Date.now();
                state.isDone = false;
                if (breakthroughInterval) clearInterval(breakthroughInterval);
                breakthroughInterval = setTimeout(() => {
                    breakthroughInterval = null;
                    resolveBreakthrough(true);
                }, 2500);
                updateBreakthroughDisplay();
                updateUI();
                return;
            }

            stopBreakthrough(true);
        }

        function stopBreakthrough(auto = false) {
            const state = getBreakthroughState();
            if (!state.active) return;
            if (!auto && !state.isDone) {
                return logMsg('⚡ Đang tụ khí đột phá, hãy chờ kết quả...', 'text-cyan-300');
            }

            state.active = false;
            state.start = 0;
            state.lastTick = 0;
            state.cycles = 0;
            state.targetCycles = 1;
            state.auto = false;
            state.isDone = false;
            if (breakthroughInterval) clearInterval(breakthroughInterval);
            breakthroughInterval = null;
            p.meditation.active = false;
            p.meditation.start = 0;
            p.meditation.lastTick = 0;
            p.meditation.hours = 0;
            p.meditation.rates = null;
            p.meditation.cost = null;

            closeBreakthroughModal();
            updateUI();
        }

        function updateBreakthroughDisplay() {
            const modal = document.getElementById('modal-meditate');
            const timerEl = document.getElementById('meditate-timer');
            const yieldEl = document.getElementById('meditate-yield');
            const targetEl = document.getElementById('meditate-target');
            if (!modal || !timerEl || !yieldEl) return;
            const state = getBreakthroughState();
            if (!state.active) {
                timerEl.innerText = '00:00:00';
                yieldEl.innerText = 'Tiêu hao: 0 CN, 0 TV';
                return;
            }

            const stage = getBreakthroughStageInfo(p.lv);
            const now = Date.now();
            const elapsed = Math.floor((now - state.start) / 1000);
            const remaining = Math.max(0, state.targetCycles - state.cycles);
            timerEl.innerText = `Đang tụ khí... • ${state.auto ? `Auto: ${formatNum(state.cycles)} lần` : `Lần ${formatNum(state.cycles + 1)}`}`;
            const cost = p.meditation && p.meditation.cost ? p.meditation.cost : { primalCost: 0, tuviCost: 0 };
            yieldEl.innerText = `Tiêu hao: ${formatNum(cost.primalCost)} Chân Nguyên (Khi thất bại mất 10-30% Tu Vi)`;
            if (targetEl) targetEl.classList.add('hidden');
        }

        function updateBreakthroughTarget() {
            // Cập nhật mục tiêu đột phá trong modal trước khi bắt đầu
            const targetEl = document.getElementById('meditate-target');
            if (!targetEl) return;
            const state = getBreakthroughState();
            if (state && state.active) { targetEl.classList.add('hidden'); return; }
            const stage = getBreakthroughStageInfo(p.lv);
            const successRate = getBreakthroughStageSuccessRate(p.lv);
            const costs = getBreakthroughCosts(p.lv);
            const stageCap = getRealmStageLevelCap(p.lv, p.realmStage);
            const target = getBreakthroughTargetText();
            const ready = p.lv >= stageCap;
            targetEl.classList.remove('hidden');
            targetEl.innerHTML = `
                <div>Mục tiêu: <span class="font-bold text-cyan-100">${target}</span></div>
                <div class="text-slate-300 mt-0.5">Yêu cầu Level: Đạt Lv <span class="font-bold ${ready ? 'text-emerald-300' : 'text-rose-300'}">${formatNum(stageCap)}</span> (hiện tại Lv <span class="font-bold">${formatNum(p.lv)}</span>)</div>
                <div class="text-slate-300 mt-0.5">Yêu cầu Tu Vi: Đạt 100% (hiện tại ${((p.tuvi/costs.tuviCost)*100).toFixed(1)}%)</div>
                <div class="mt-1.5 text-[9px] text-emerald-200 bg-emerald-950/40 rounded px-1.5 py-1">Tỷ lệ thành công: <span class="font-bold">${(successRate*100).toFixed(0)}%</span> • Tiêu hao: <span class="font-bold">${formatNum(costs.primalCost)} Chân Nguyên</span></div>
            `;
        }

        function startMeditate(hours) { startBreakthrough(hours, false); }
        function stopMeditate(auto = false) { stopBreakthrough(auto); }
        function openMeditateModal() { updateBreakthroughTarget(); openBreakthroughModal(); }
        function closeMeditateModal() { closeBreakthroughModal(); }
        function updateMeditateDisplay() { updateBreakthroughDisplay(); }

        setInterval(() => {
            p.wood += p.estate.woodLv * 2;
            p.herb += p.estate.herbLv * 1;
            p.iron += p.estate.ironLv * 0.5;
            
            if (document.getElementById('view-dongphu').classList.contains('active')) {
                document.getElementById('ui-wood').innerText = formatNum(Math.floor(p.wood));
                document.getElementById('ui-herb').innerText = formatNum(Math.floor(p.herb));
                document.getElementById('ui-iron').innerText = formatNum(Math.floor(p.iron));
            }
        }, 1000);

        function renderClanCard() {
            const container = document.getElementById('clan-container');
            if (!container) return;
            if (!p.clan || !p.clan.exists) {
                container.innerHTML = `
                    <div class="bg-black/40 p-2.5 rounded border border-fuchsia-900/30 text-[10px] text-slate-300 leading-relaxed">
                        <div class="font-bold text-fuchsia-300 mb-1">Chưa lập gia tộc</div>
                        <div class="text-slate-400 mb-2">Tạo gia tộc để thu hút thân nhân, tăng hiệu quả tu hành và biến động phủ thành thế lực lớn.</div>
                        <button onclick="createClan()" class="w-full py-2 bg-fuchsia-900/80 hover:bg-fuchsia-800 text-fuchsia-100 rounded text-[10px] font-bold border border-fuchsia-500/50 shadow transition-colors">Lập Gia Tộc</button>
                    </div>`;
                return;
            }

            const clan = p.clan;
            const members = Array.isArray(clan.members) ? clan.members : [];
            const maxMembers = 3 + clan.level;
            const nextCostCoins = Math.floor(10000 * Math.pow(1.35, clan.level));
            const nextCostWood = Math.floor(3000 * Math.pow(1.25, clan.level));
            const nextCostHerb = Math.floor(2500 * Math.pow(1.25, clan.level));
            const nextCostIron = Math.floor(2000 * Math.pow(1.25, clan.level));
            const canUpgrade = p.coins >= nextCostCoins && p.wood >= nextCostWood && p.herb >= nextCostHerb && p.iron >= nextCostIron;
            const canRecruit = members.length < maxMembers && p.coins >= Math.floor(4000 + clan.level * 200) && p.wood >= Math.floor(800 + clan.level * 100) && p.herb >= Math.floor(600 + clan.level * 80) && p.iron >= Math.floor(400 + clan.level * 60);

            container.innerHTML = `
                <div class="bg-black/40 p-2.5 rounded border border-fuchsia-900/30 space-y-2">
                    <div class="flex justify-between items-start gap-2">
                        <div>
                            <div class="text-[11px] font-bold text-fuchsia-200">${clan.name}</div>
                            <div class="text-[9px] text-slate-400">Cấp ${clan.level} • Quản Gia: ${clan.manager ? clan.manager.name : 'Quản Gia'}</div>
                        </div>
                        <div class="text-[9px] text-amber-300 font-bold bg-amber-900/30 px-2 py-0.5 rounded">Thân Nhân ${members.length}/${maxMembers}</div>
                    </div>
                    <div class="text-[9px] text-slate-400 leading-relaxed">
                        Gia tộc đang phát triển từ tầng thấp thành thế lực tu tiên. Thành viên và quản gia tăng bonus EXP, Cơ Duyên, HP/ATK và sản lượng tài nguyên.
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[9px]">
                        <div class="bg-slate-900/60 p-2 rounded border border-white/5">
                            <div class="text-slate-400">Tăng cường</div>
                            <div class="font-bold text-cyan-300">+${((getClanBonuses().expRate - 1) * 100).toFixed(1)}% EXP</div>
                        </div>
                        <div class="bg-slate-900/60 p-2 rounded border border-white/5">
                            <div class="text-slate-400">Cơ duyên</div>
                            <div class="font-bold text-amber-300">+${((getClanBonuses().luck - 1) * 100).toFixed(1)}% Nhặt</div>
                        </div>
                    </div>
                    <div class="space-y-1">
                        ${members.length > 0 ? members.map(member => `<div class="flex justify-between text-[9px] bg-slate-900/60 px-2 py-1 rounded border border-white/5"><span>${member.name} <span class="text-slate-500">(${member.role || 'Thân Nhân'})</span></span><span class="text-emerald-300">Lv ${member.level || 1}</span></div>`).join('') : '<div class="text-[9px] text-slate-500 italic">Gia tộc chưa có thân nhân.</div>'}
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="recruitClanMember()" class="${canRecruit ? 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-500'} py-2 rounded text-[9px] font-bold border border-emerald-500/50 shadow transition-colors">Mời Thân Nhân</button>
                        <button onclick="renameClanManager()" class="bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 py-2 rounded text-[9px] font-bold border border-indigo-500/50 shadow transition-colors">Đổi Quản Gia</button>
                    </div>
                    <button onclick="upgradeClan()" class="w-full py-2 ${canUpgrade ? 'bg-fuchsia-900/80 hover:bg-fuchsia-800 text-fuchsia-100' : 'bg-slate-800 text-slate-500'} rounded text-[9px] font-bold border border-fuchsia-500/50 shadow transition-colors">Tăng Cấp Gia Tộc • ${formatNum(nextCostCoins)} LT / ${formatNum(nextCostWood)} M / ${formatNum(nextCostHerb)} T / ${formatNum(nextCostIron)} Th</button>
                </div>`;
        }

        async function createClan() {
            if (p.clan && p.clan.exists) return logMsg("⚠️ Gia tộc đã tồn tại, không thể lập thêm.", "text-amber-300");
            const name = await showDialog({ title: 'Lập Gia Tộc', msg: 'Đặt tên cho gia tộc của ngươi:', type: 'prompt', defaultInput: 'Đại Đồng Gia Tộc' });
            if (!name || !name.trim()) return;
            const costCoins = 50000;
            const costWood = 3000;
            const costHerb = 3000;
            const costIron = 2000;
            if (p.coins < costCoins || p.wood < costWood || p.herb < costHerb || p.iron < costIron) {
                playSfx('error');
                return logMsg(`❌ Không đủ tài nguyên để lập gia tộc! Cần ${formatNum(costCoins)} LT, ${formatNum(costWood)} M, ${formatNum(costHerb)} T, ${formatNum(costIron)} Th.`, "text-rose-400");
            }
            p.coins -= costCoins; p.wood -= costWood; p.herb -= costHerb; p.iron -= costIron;
            p.clan = {
                exists: true,
                name: name.trim(),
                level: 1,
                exp: 0,
                members: [{ name: p.name || 'Thân Nhân', role: 'Thân Nhân', level: 1 }],
                manager: { name: 'Quản Gia', role: 'Quản Gia' }
            };
            playSfx('lvlup');
            logMsg(`👨‍👩‍👧‍👦 Gia tộc ${p.clan.name} đã thành lập! Quản gia và thân nhân đã nhập cư.`, "text-fuchsia-300 font-bold");
            updateUI(); renderDongPhu();
        }

        async function renameClanManager() {
            if (!p.clan || !p.clan.exists) return logMsg("❌ Chưa lập gia tộc.", "text-rose-400");
            const name = await showDialog({ title: 'Đổi Quản Gia', msg: 'Đặt tên cho người quản lý gia tộc:', type: 'prompt', defaultInput: p.clan.manager?.name || 'Quản Gia' });
            if (!name || !name.trim()) return;
            p.clan.manager = { name: name.trim(), role: 'Quản Gia' };
            playSfx('click');
            logMsg(`🧑‍💼 Quản gia gia tộc đã đổi thành ${p.clan.manager.name}.`, "text-indigo-300");
            updateUI(); renderDongPhu();
        }

        function recruitClanMember() {
            if (!p.clan || !p.clan.exists) return logMsg("❌ Chưa lập gia tộc.", "text-rose-400");
            const members = Array.isArray(p.clan.members) ? p.clan.members : [];
            const maxMembers = 3 + p.clan.level;
            if (members.length >= maxMembers) { playSfx('error'); return logMsg(`❌ Gia tộc đã đầy ${maxMembers} thân nhân.`, "text-rose-400"); }
            const costCoins = Math.floor(4000 + p.clan.level * 200);
            const costWood = Math.floor(800 + p.clan.level * 100);
            const costHerb = Math.floor(600 + p.clan.level * 80);
            const costIron = Math.floor(400 + p.clan.level * 60);
            if (p.coins < costCoins || p.wood < costWood || p.herb < costHerb || p.iron < costIron) {
                playSfx('error'); return logMsg(`❌ Không đủ tài nguyên để mời thêm thân nhân! Cần ${formatNum(costCoins)} LT, ${formatNum(costWood)} M, ${formatNum(costHerb)} T, ${formatNum(costIron)} Th.`, "text-rose-400");
            }
            p.coins -= costCoins; p.wood -= costWood; p.herb -= costHerb; p.iron -= costIron;
            members.push({ name: `Thân Nhân ${members.length + 1}`, role: 'Thân Nhân', level: 1 });
            p.clan.members = members;
            playSfx('heal');
            logMsg(`👨‍👩‍👧‍👦 Gia tộc đã mời thêm một thân nhân. Thế lực ngày càng lớn mạnh.`, "text-emerald-300");
            updateUI(); renderDongPhu();
        }

        function upgradeClan() {
            if (!p.clan || !p.clan.exists) return logMsg("❌ Chưa lập gia tộc.", "text-rose-400");
            const nextCostCoins = Math.floor(10000 * Math.pow(1.35, p.clan.level));
            const nextCostWood = Math.floor(3000 * Math.pow(1.25, p.clan.level));
            const nextCostHerb = Math.floor(2500 * Math.pow(1.25, p.clan.level));
            const nextCostIron = Math.floor(2000 * Math.pow(1.25, p.clan.level));
            if (p.coins < nextCostCoins || p.wood < nextCostWood || p.herb < nextCostHerb || p.iron < nextCostIron) {
                playSfx('error'); return logMsg(`❌ Không đủ tài nguyên để tăng cấp gia tộc! Cần ${formatNum(nextCostCoins)} LT, ${formatNum(nextCostWood)} M, ${formatNum(nextCostHerb)} T, ${formatNum(nextCostIron)} Th.`, "text-rose-400");
            }
            p.coins -= nextCostCoins; p.wood -= nextCostWood; p.herb -= nextCostHerb; p.iron -= nextCostIron;
            p.clan.level = Math.min(99999, (p.clan.level || 1) + 1);
            p.clan.members = Array.isArray(p.clan.members) ? p.clan.members.map(member => ({ ...member, level: Math.max(1, parseInt(member.level) || 1) })) : [];
            playSfx('boss');
            logMsg(`🌟 Gia tộc thăng cấp lên Lv ${p.clan.level}! Địa vị và ưu đãi tăng mạnh.`, "text-fuchsia-300 font-bold");
            updateUI(); renderDongPhu();
        }

        function getSectRankInfo(rankId = '') {
            const rank = SECT_RANKS.find(r => r.id === rankId);
            return rank || SECT_RANKS[0];
        }

        function getSectRankIndex(rankId = '') {
            const idx = SECT_RANKS.findIndex(r => r.id === rankId);
            return idx >= 0 ? idx : 0;
        }

        function createSectState(sectId) {
            const sect = DB_SECTS.find(s => s.id === sectId);
            return {
                id: sect ? sect.id : 'none',
                name: sect ? sect.name : 'Không Thuộc Môn Phái',
                level: 1,
                rank: 'misc_disciple',
                breakthrough: 0,
                bossDefeated: false,
                recruitmentOpen: false,
                members: 1,
                reputation: 0,
                joinedAt: Date.now()
            };
        }

        function getCurrentSectEntry() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return null;
            return DB_SECTS.find(s => s.id === p.sect.id) || null;
        }

        function renderSectCard() {
            const status = document.getElementById('sect-status');
            const list = document.getElementById('sect-list');
            if (!status || !list) return;
            const current = getCurrentSectEntry();
            const entry = current || DB_SECTS[0];
            const joinCost = Math.floor(5000 + (entry.reqLv || 1) * 150);
            const currentRank = getSectRankInfo(p.sect && p.sect.rank ? p.sect.rank : 'misc_disciple');
            const stage = Math.max(1, (p.sect && p.sect.breakthrough ? p.sect.breakthrough : 0) + 1);
            status.innerHTML = `
                <div class="bg-black/40 p-3 rounded border border-amber-900/30">
                    <div class="text-[11px] font-bold ${entry.color}">${entry.name}</div>
                    <div class="text-[9px] text-slate-400 mt-1">${entry.desc}</div>
                    <div class="text-[9px] text-slate-400 mt-2">Tình trạng: ${p.sect && p.sect.id && p.sect.id !== 'none' ? 'Đã nhập môn' : 'Chưa thử luyện'}</div>
                    ${p.sect && p.sect.id && p.sect.id !== 'none' ? `
                        <div class="text-[9px] text-amber-300 mt-1">Chức vị: ${currentRank.name} • Cảnh tầng ${stage} • Danh vọng ${formatNum(p.sect.reputation || 0)}</div>
                        <div class="text-[9px] ${p.sect.bossDefeated ? 'text-emerald-300' : 'text-rose-300'} mt-1">Boss: ${p.sect.bossDefeated ? 'Đã hạ' : 'Chưa hạ'} • ${entry.bossName || 'Boss'}</div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <button onclick="challengeSectPromotion()" class="bg-amber-700 hover:bg-amber-600 text-amber-100 px-2 py-1 rounded text-[9px] font-bold border border-amber-500/50 transition-colors">Thăng Chức</button>
                            <button onclick="breakthroughSect()" class="bg-cyan-800 hover:bg-cyan-700 text-cyan-100 px-2 py-1 rounded text-[9px] font-bold border border-cyan-500/50 transition-colors">Đột Phá</button>
                            <button onclick="challengeSectBoss()" class="bg-rose-900 hover:bg-rose-800 text-rose-100 px-2 py-1 rounded text-[9px] font-bold border border-rose-500/50 transition-colors">Đánh Boss</button>
                            <button onclick="toggleSectRecruitment()" class="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-2 py-1 rounded text-[9px] font-bold border border-emerald-500/50 transition-colors">${p.sect.recruitmentOpen ? 'Thử Luyện Chiêu Mộ' : 'Mở Chiêu Mộ'}</button>
                        </div>
                    ` : `<div class="text-[9px] text-amber-300 mt-1">Tốn ${formatNum(joinCost)} LT để mở thử luyện tuyển tông môn.</div>`}
                </div>`;

            let html = '';
            DB_SECTS.filter(s => s.id !== 'none').forEach(sect => {
                const unlocked = p.lv >= sect.reqLv;
                const joinedHere = p.sect && p.sect.id === sect.id;
                const canSwitch = p.sect && p.sect.id && p.sect.id !== 'none' && p.sect.id !== sect.id && p.sect.bossDefeated;
                const canJoin = unlocked && (!p.sect || !p.sect.id || p.sect.id === 'none' || canSwitch) && p.coins >= Math.floor(5000 + sect.reqLv * 150);
                const label = joinedHere ? 'Đang Thuộc' : (canSwitch ? 'Đổi Môn' : (unlocked ? 'Thử Luyện' : 'Khóa'));
                html += `
                    <div class="bg-black/40 p-2.5 rounded border border-white/5">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <div class="text-[11px] font-bold ${sect.color}">${sect.name}</div>
                                <div class="text-[9px] text-slate-400 mt-1">${sect.desc}</div>
                                <div class="text-[9px] text-slate-500 mt-1">Yêu cầu: Lv ${formatNum(sect.reqLv)}</div>
                                <div class="text-[9px] text-slate-500 mt-1">Boss: ${sect.bossName}</div>
                            </div>
                            <button onclick="joinSect('${sect.id}')" class="${canJoin ? 'bg-amber-700 hover:bg-amber-600 text-amber-100' : 'bg-slate-800 text-slate-500'} px-2.5 py-1.5 rounded text-[9px] font-bold border border-amber-500/50 transition-colors">${label}</button>
                        </div>
                    </div>`;
            });
            list.innerHTML = html;
        }

        function challengeSectPromotion() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return logMsg('❌ Chưa gia nhập môn phái.', 'text-rose-400');
            const sect = getCurrentSectEntry();
            const currentRankIndex = getSectRankIndex(p.sect.rank);
            if (currentRankIndex >= SECT_RANKS.length - 1) return logMsg(`🏆 ${sect.name} đã đạt đỉnh cao, không còn chỗ thăng chức nữa.`, 'text-amber-300');
            const nextRank = SECT_RANKS[currentRankIndex + 1];
            const reqLv = Math.max(sect.reqLv + currentRankIndex * 40, nextRank.minLv);
            if (p.lv < reqLv) return logMsg(`❌ Cảnh giới chưa đủ để thăng lên ${nextRank.name}. Cần Lv ${formatNum(reqLv)}.`, 'text-rose-400');
            const requiredFights = Math.min(4, currentRankIndex + 2);
            let winCount = 0;
            for (let i = 0; i < requiredFights; i++) {
                const enemyLevel = Math.max(1, p.lv + i * 15 + (p.sect.level || 1) * 4);
                const playerStrength = getTotalStats().atk * (1 + (p.sect.level || 1) * 0.08) + p.lv * 4 + (p.sect.reputation || 0) * 0.05;
                const enemyStrength = enemyLevel * (8 + i);
                if (playerStrength >= enemyStrength) winCount++;
            }
            if (winCount < requiredFights) {
                p.hp = Math.max(1, p.hp - Math.floor(getBaseStats(p.lv).hp * 0.03));
                p.sect.reputation = Math.max(0, (p.sect.reputation || 0) - 5);
                playSfx('hurt');
                return logMsg(`⚔️ Thất bại trong thi đấu với đệ tử khác, không thể thăng chức.`, 'text-rose-400');
            }
            p.sect.rank = nextRank.id;
            p.sect.level = Math.min(999, (p.sect.level || 1) + 1);
            p.sect.reputation = (p.sect.reputation || 0) + 20;
            playSfx('boss');
            logMsg(`🏆 ${p.name} đã thăng lên ${nextRank.name} của ${sect.name}!`, 'text-amber-300 font-bold');
            updateUI(); renderDongPhu();
        }

        function breakthroughSect() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return logMsg('❌ Chưa gia nhập môn phái.', 'text-rose-400');
            const sect = getCurrentSectEntry();
            const nextReqLv = Math.max(sect.reqLv + (p.sect.breakthrough || 0) * 300 + (p.sect.level || 1) * 50, 50);
            if (p.lv < nextReqLv) return logMsg(`❌ Cảnh giới chưa đủ để đột phá ${sect.name}. Cần Lv ${formatNum(nextReqLv)}.`, 'text-rose-400');
            const costCoins = Math.floor(20000 + (p.sect.breakthrough || 0) * 15000);
            const costWood = Math.floor(5000 + (p.sect.breakthrough || 0) * 4000);
            const costHerb = Math.floor(4000 + (p.sect.breakthrough || 0) * 3000);
            const costIron = Math.floor(3000 + (p.sect.breakthrough || 0) * 2500);
            if (p.coins < costCoins || p.wood < costWood || p.herb < costHerb || p.iron < costIron) {
                playSfx('error');
                return logMsg(`❌ Không đủ tài nguyên để đột phá ${sect.name}! Cần ${formatNum(costCoins)} LT, ${formatNum(costWood)} M, ${formatNum(costHerb)} T, ${formatNum(costIron)} Th.`, 'text-rose-400');
            }
            p.coins -= costCoins; p.wood -= costWood; p.herb -= costHerb; p.iron -= costIron;
            p.sect.breakthrough = (p.sect.breakthrough || 0) + 1;
            p.sect.bossDefeated = false;
            p.sect.reputation = (p.sect.reputation || 0) + 25;
            playSfx('boss');
            logMsg(`⚡ ${p.name} đã đột phá môn phái ${sect.name}, chuẩn bị đối đầu Boss mới!`, 'text-cyan-300 font-bold');
            updateUI(); renderDongPhu();
        }

        function challengeSectBoss() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return logMsg('❌ Chưa gia nhập môn phái.', 'text-rose-400');
            const sect = getCurrentSectEntry();
            if ((p.sect.breakthrough || 0) < 1) return logMsg(`❌ Cần đột phá ${sect.name} trước khi đánh Boss.`, 'text-rose-400');
            if (p.sect.bossDefeated) return logMsg(`✅ Boss ${sect.bossName} của ${sect.name} đã bị hạ; có thể đổi sang môn phái khác.`, 'text-emerald-300');
            const bossLevel = Math.max(sect.reqLv + 200, p.lv + 120 + (p.sect.breakthrough || 0) * 70 + (p.sect.level || 1) * 20);
            const playerStrength = getTotalStats().atk * 1.2 + (p.sect.reputation || 0) * 0.4 + p.lv * 5;
            const bossStrength = bossLevel * 14;
            if (playerStrength < bossStrength) {
                p.hp = Math.max(1, p.hp - Math.floor(bossLevel * 3));
                playSfx('hurt');
                return logMsg(`☠️ Boss ${sect.bossName} quá mạnh, ngươi bị thương nặng!`, 'text-rose-400');
            }
            p.sect.bossDefeated = true;
            p.sect.reputation = (p.sect.reputation || 0) + 40;
            playSfx('boss');
            logMsg(`👹 ${p.name} đã hạ gục ${sect.bossName} của ${sect.name}! Có thể chuyển sang môn phái khác.`, 'text-amber-300 font-bold');
            updateUI(); renderDongPhu();
        }

        function toggleSectRecruitment() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return logMsg('❌ Chưa gia nhập môn phái.', 'text-rose-400');
            const sect = getCurrentSectEntry();
            const rankIndex = getSectRankIndex(p.sect.rank);
            if (rankIndex < getSectRankIndex('inner_elder')) return logMsg('❌ Chỉ trưởng lão nội môn trở lên mới có thể mở chiêu mộ.', 'text-rose-400');
            if (p.sect.recruitmentOpen) {
                const costCoins = Math.floor(10000 + (p.sect.level || 1) * 1500);
                const costWood = Math.floor(2000 + (p.sect.level || 1) * 300);
                const costHerb = Math.floor(1500 + (p.sect.level || 1) * 250);
                const costIron = Math.floor(1200 + (p.sect.level || 1) * 200);
                if (p.coins < costCoins || p.wood < costWood || p.herb < costHerb || p.iron < costIron) {
                    playSfx('error');
                    return logMsg(`❌ Không đủ tài nguyên để thử luyện đệ tử mới cho ${sect.name}!`, 'text-rose-400');
                }
                p.coins -= costCoins; p.wood -= costWood; p.herb -= costHerb; p.iron -= costIron;
                p.sect.recruitmentOpen = false;
                p.sect.members = (p.sect.members || 0) + 1;
                p.sect.reputation = (p.sect.reputation || 0) + 10;
                playSfx('heal');
                logMsg(`🌿 ${p.name} đã thử luyện một đệ tử mới và đưa họ vào ${sect.name}.`, 'text-emerald-300');
            } else {
                const costCoins = Math.floor(8000 + (p.sect.level || 1) * 1000);
                const costWood = Math.floor(1500 + (p.sect.level || 1) * 250);
                const costHerb = Math.floor(1200 + (p.sect.level || 1) * 200);
                const costIron = Math.floor(1000 + (p.sect.level || 1) * 180);
                if (p.coins < costCoins || p.wood < costWood || p.herb < costHerb || p.iron < costIron) {
                    playSfx('error');
                    return logMsg(`❌ Không đủ tài nguyên để mở chiêu mộ cho ${sect.name}!`, 'text-rose-400');
                }
                p.coins -= costCoins; p.wood -= costWood; p.herb -= costHerb; p.iron -= costIron;
                p.sect.recruitmentOpen = true;
                playSfx('click');
                logMsg(`🪷 ${sect.name} đã mở đợt chiêu mộ mới, đệ tử thử luyện đã tới cửa.`, 'text-cyan-300');
            }
            updateUI(); renderDongPhu();
        }

        async function joinSect(sectId) {
            const sect = DB_SECTS.find(s => s.id === sectId);
            if (!sect || sect.id === 'none') return;
            if (p.lv < sect.reqLv) return logMsg(`❌ Chưa đủ cảnh giới để gia nhập ${sect.name}.`, 'text-rose-400');
            const cost = Math.floor(5000 + sect.reqLv * 150);
            if (p.coins < cost) return logMsg(`❌ Không đủ Linh Thạch để thử luyện ${sect.name}!`, 'text-rose-400');
            const current = p.sect && p.sect.id && p.sect.id !== 'none' ? p.sect : null;
            if (current && current.id !== sect.id) {
                const currentSect = DB_SECTS.find(s => s.id === current.id);
                if (!current.bossDefeated) return logMsg(`❌ Chưa hạ Boss ${currentSect ? currentSect.bossName : 'cũ'} nên chưa thể đổi sang ${sect.name}.`, 'text-rose-400');
                p.coins -= cost;
                p.sect = createSectState(sect.id);
                p.sect.name = sect.name;
                p.sect.level = 1;
                p.sect.reputation = 0;
                p.sect.members = 1;
                p.sect.joinedAt = Date.now();
                playSfx('lvlup');
                logMsg(`🪷 ${p.name} đã rời ${currentSect ? currentSect.name : 'môn phái cũ'} và nhập ${sect.name}.`, 'text-amber-300 font-bold');
            } else {
                p.coins -= cost;
                p.sect = createSectState(sect.id);
                p.sect.name = sect.name;
                p.sect.level = 1;
                p.sect.reputation = 0;
                p.sect.members = 1;
                p.sect.joinedAt = Date.now();
                playSfx('lvlup');
                logMsg(`🪷 ${p.name} đã gia nhập ${sect.name} và nhận được ưu thế riêng!`, 'text-amber-300 font-bold');
            }
            updateUI(); renderDongPhu();
        }

        function renderDongPhu() {
            document.getElementById('ui-wood').innerText = formatNum(Math.floor(p.wood));
            document.getElementById('ui-herb').innerText = formatNum(Math.floor(p.herb));
            document.getElementById('ui-iron').innerText = formatNum(Math.floor(p.iron));
            
            document.getElementById('lvl-wood').innerText = p.estate.woodLv;
            document.getElementById('prod-wood').innerText = formatNum(p.estate.woodLv * 2);
            document.getElementById('cost-wood').innerText = `(${formatNum(Math.floor(1000 * Math.pow(p.estate.woodLv, 1.8)))} LT)`;
            
            document.getElementById('lvl-herb').innerText = p.estate.herbLv;
            document.getElementById('prod-herb').innerText = formatNum(p.estate.herbLv * 1);
            document.getElementById('cost-herb').innerText = `(${formatNum(Math.floor(1000 * Math.pow(p.estate.herbLv, 1.8)))} LT)`;
            
            document.getElementById('lvl-iron').innerText = p.estate.ironLv;
            document.getElementById('prod-iron').innerText = formatNum(p.estate.ironLv * 0.5);
            document.getElementById('cost-iron').innerText = `(${formatNum(Math.floor(1000 * Math.pow(p.estate.ironLv, 1.8)))} LT)`;

            let fLv = p.estate.furnaceLv || 1;
            document.getElementById('furnace-lv').innerText = fLv;
            document.getElementById('furnace-cost').innerText = formatNum(Math.floor(1000 * Math.pow(fLv, 1.8)));
            document.getElementById('craft-pill-cost').innerHTML = `${formatNum(Math.floor(500 * Math.pow(fLv, 1.3)))} Thảo<br>${formatNum(Math.floor(300 * Math.pow(fLv, 1.3)))} Mộc`;
            renderClanCard();
            renderSectCard();
            document.getElementById('craft-equip-cost').innerHTML = `${formatNum(Math.floor(500 * Math.pow(fLv, 1.3)))} Thiết<br>${formatNum(Math.floor(300 * Math.pow(fLv, 1.3)))} Mộc`;

            let nwContainer = document.getElementById('natal-weapon-content');
            if (p.natalWeapon && p.natalWeapon.unlocked) {
                let nLv = p.natalWeapon.lv;
                let costWood = Math.floor(1000 * Math.pow(nLv + 1, 1.5));
                let costHerb = Math.floor(1000 * Math.pow(nLv + 1, 1.5));
                let costIron = Math.floor(1000 * Math.pow(nLv + 1, 1.5));
                let canUpg = p.wood >= costWood && p.herb >= costHerb && p.iron >= costIron;
                
                nwContainer.innerHTML = `
                    <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-amber-900/50 relative z-10">
                        <div class="flex items-center gap-3">
                            <img src="assets/images/sword.jpg" class="w-12 h-12 object-cover rounded shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-500/50 anim-float">
                            <div>
                                <div class="text-[11px] text-amber-300 font-bold">Thái Cực Đồ <span class="text-white text-[9px]">(Lv ${nLv})</span></div>
                                <div class="text-[9px] text-emerald-300 font-bold">Hiệu quả: X${(1 + nLv * 0.01).toFixed(2)} Tổng HP & ATK</div>
                                <div class="text-[8px] text-slate-400 mt-1">Tốn: ${formatNum(costWood)} M, ${formatNum(costHerb)} T, ${formatNum(costIron)} Th</div>
                            </div>
                        </div>
                        <button onclick="upgradeNatalWeapon()" class="${canUpg ? 'bg-amber-700 hover:bg-amber-600' : 'bg-slate-800 text-slate-500'} text-amber-100 px-3 py-1.5 rounded text-[10px] font-bold border border-amber-500/50 shadow transition-colors shrink-0">Tế Luyện</button>
                    </div>`;
            } else {
                nwContainer.innerHTML = `<div class="text-[10px] text-slate-500 italic text-center py-2">Yêu cầu đạt Kết Đan Cảnh (Lv 100) để khai mở.</div>`;
            }

            let forgeHtml = '';
            ['weapon', 'talisman', 'armor', 'cloth', 'helmet', 'glove', 'boots'].forEach(slot => {
                let eqId = p.equip[slot];
                if (eqId && DB_ITEMS[eqId]) {
                    let item = DB_ITEMS[eqId];
                    let enhLv = getEnhanceLevel(eqId);
                    let starLv = getStarLevel(eqId);
                    
                    let refineCostIron = Math.floor(100 * Math.pow(enhLv + 1, 1.1) * (item.tierIdx + 1));
                    let refineCostWood = Math.floor(50 * Math.pow(enhLv + 1, 1.1) * (item.tierIdx + 1));
                    let canRefine = p.iron >= refineCostIron && p.wood >= refineCostWood;

                    let starCostIron = Math.floor(300 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
                    let starCostWood = Math.floor(200 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
                    let starCostHerb = Math.floor(100 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
                    let canStar = p.iron >= starCostIron && p.wood >= starCostWood && p.herb >= starCostHerb;

                    let isMaxTier = item.tierIdx >= 9;
                    let upgradeCostIron = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));
                    let upgradeCostWood = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));
                    let upgradeCostHerb = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));
                    let canUpgrade = p.iron >= upgradeCostIron && p.wood >= upgradeCostWood && p.herb >= upgradeCostHerb;

                    forgeHtml += `
                    <div class="bg-black/40 p-2 rounded border border-white/5">
                        <div class="flex justify-between items-center mb-2 border-b border-white/5 pb-1">
                            <div class="font-bold text-[11px] ${item.tierClass}">${item.name} <span class="text-amber-400 drop-shadow ml-1">+${enhLv}</span> <span class="text-fuchsia-300">${getStarText(starLv)}</span></div>
                        </div>
                        <div class="grid grid-cols-2 gap-1.5">
                            <button onclick="refineItem('${slot}')" class="w-full ${canRefine ? 'bg-cyan-900/80 hover:bg-cyan-800 text-cyan-100' : 'bg-slate-800 text-slate-500'} px-2 py-1.5 rounded text-[9px] font-bold border border-cyan-700/50 transition-colors shadow">
                                Cường Hóa (+1)<br><span class="text-[7px] font-normal">${formatNum(refineCostIron)} Th, ${formatNum(refineCostWood)} M</span>
                            </button>
                            <button onclick="upgradeStarLevel('${slot}')" class="w-full ${canStar ? 'bg-amber-900/80 hover:bg-amber-800 text-amber-100' : 'bg-slate-800 text-slate-500'} px-2 py-1.5 rounded text-[9px] font-bold border border-amber-700/50 transition-colors shadow">
                                Nâng Sao<br><span class="text-[7px] font-normal">${formatNum(starCostIron)} Th, ${formatNum(starCostWood)} M, ${formatNum(starCostHerb)} T</span>
                            </button>
                            <button onclick="upgradeItemTier('${slot}')" ${isMaxTier ? 'disabled' : ''} class="col-span-2 w-full ${isMaxTier ? 'bg-slate-800 text-slate-600' : (canUpgrade ? 'bg-fuchsia-900/80 hover:bg-fuchsia-800 text-fuchsia-100' : 'bg-slate-800 text-slate-500')} px-2 py-1.5 rounded text-[9px] font-bold border border-fuchsia-700/50 transition-colors shadow">
                                Thăng Cấp Trang Bị<br><span class="text-[7px] font-normal">${isMaxTier ? 'CẤP ĐẠI ĐẠO' : `${formatNum(upgradeCostIron)}Th,${formatNum(upgradeCostWood)}M,${formatNum(upgradeCostHerb)}T`}</span>
                            </button>
                        </div>
                    </div>`;
                }
            });
            if (forgeHtml === '') forgeHtml = `<div class="text-center text-[10px] text-slate-500 italic py-2">Hãy trang bị Vũ Khí, Bùa Chú, Giáp, Áo, Nón, Tay hoặc Giày để bắt đầu Lò Rèn.</div>`;
            let forgeContainer = document.getElementById('forge-container');
            if (forgeContainer) forgeContainer.innerHTML = forgeHtml;

            let rootHtml = '';
            for (let r in DB_ROOTS) {
                let def = DB_ROOTS[r]; let lv = p.roots[r];
                let wCost = Math.floor(100 * Math.pow(lv, 1.5)); let hCost = Math.floor(50 * Math.pow(lv, 1.5)); let iCost = Math.floor(20 * Math.pow(lv, 1.5));
                let canUpgrade = p.wood >= wCost && p.herb >= hCost && p.iron >= iCost;
                let bonusStr = def.isPercent ? `+${(lv * def.valPerLv * 100).toFixed(1)}%` : `+${formatNum(lv * def.valPerLv)}`;
                
                rootHtml += `
                    <div class="bg-black/40 p-2 rounded flex justify-between items-center border border-white/5">
                        <div class="flex items-center gap-2">
                            <div class="text-xl drop-shadow ${def.color}">${def.icon}</div>
                            <div>
                                <div class="text-[11px] font-bold ${def.color}">${def.name} <span class="text-white text-[9px]">(Lv ${lv})</span></div>
                                <div class="text-[9px] text-slate-400">Hiệu quả: ${def.statName} ${bonusStr}</div>
                            </div>
                        </div>
                        <button onclick="upgradeRoot('${r}')" class="btn-action shrink-0 w-24 ${canUpgrade ? 'bg-indigo-900/80 text-indigo-100 border-indigo-500/50 hover:bg-indigo-800' : 'bg-slate-800 text-slate-500 border-slate-700'} px-2 py-1 rounded border shadow flex flex-col items-center">
                            <span class="text-[10px] font-bold">Tẩy Tủy</span>
                            <span class="text-[7px] font-normal leading-tight text-center mt-0.5">${formatNum(wCost)} M, ${formatNum(hCost)} T, ${formatNum(iCost)} Th</span>
                        </button>
                    </div>`;
            }
            document.getElementById('roots-container').innerHTML = rootHtml;

            if (document.getElementById('dp-tree-container') && !document.getElementById('dp-tree-container').classList.contains('hidden')) {
                if (!p.bodhiTree) p.bodhiTree = { level: 0, exp: 0 };
                let bLv = p.bodhiTree.level;
                let bExp = p.bodhiTree.exp;
                let maxExp = Math.floor(1000 * Math.pow(1.5, bLv));
                
                let wCost = Math.floor(100 * Math.pow(1.2, bLv));
                let hCost = Math.floor(100 * Math.pow(1.2, bLv));
                let iCost = Math.floor(50 * Math.pow(1.2, bLv));
                let canWater = p.wood >= wCost && p.herb >= hCost && p.iron >= iCost;

                document.getElementById('bodhi-lv').innerText = bLv;
                document.getElementById('bodhi-stat-bonus').innerText = `+${bLv}%`;
                document.getElementById('bodhi-exp-text').innerText = `${formatNum(bExp)} / ${formatNum(maxExp)}`;
                document.getElementById('bodhi-exp-bar').style.width = `${Math.min(100, (bExp / maxExp) * 100)}%`;
                
                let btnWater = document.getElementById('btn-water-tree');
                if (canWater) {
                    btnWater.className = "w-full py-3 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 border border-emerald-500/50 rounded-xl text-white font-bold shadow-[0_4px_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex flex-col items-center justify-center gap-1";
                } else {
                    btnWater.className = "w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500 font-bold transition-all flex flex-col items-center justify-center gap-1 pointer-events-none";
                }
                document.getElementById('bodhi-cost-text').innerText = `Tiêu hao: ${formatNum(wCost)} M, ${formatNum(hCost)} T, ${formatNum(iCost)} Th`;
            }
        }

        function waterBodhiTree() {
            if (!p.bodhiTree) p.bodhiTree = { level: 0, exp: 0 };
            let bLv = p.bodhiTree.level;
            let wCost = Math.floor(100 * Math.pow(1.2, bLv));
            let hCost = Math.floor(100 * Math.pow(1.2, bLv));
            let iCost = Math.floor(50 * Math.pow(1.2, bLv));

            if (p.wood >= wCost && p.herb >= hCost && p.iron >= iCost) {
                p.wood -= wCost; p.herb -= hCost; p.iron -= iCost;
                playSfx('heal');
                
                let expGained = Math.floor(100 * (1 + Math.random() * 0.5));
                if (Math.random() < 0.1) {
                    expGained *= 2;
                    logMsg(`💧 Tưới nước Bộc Kích! Bồ Đề Thụ hấp thụ mạnh mẽ (+${expGained} EXP).`, "text-emerald-300 font-bold");
                } else {
                    logMsg(`💧 Tưới Tiên Lộ cho Bồ Đề Thụ (+${expGained} EXP).`, "text-emerald-400");
                }

                p.bodhiTree.exp += expGained;
                let maxExp = Math.floor(1000 * Math.pow(1.5, p.bodhiTree.level));
                
                if (p.bodhiTree.exp >= maxExp) {
                    p.bodhiTree.exp -= maxExp;
                    p.bodhiTree.level++;
                    playSfx('lvlup');
                    logMsg(`🌳 BỒ ĐỀ THỤ TIẾN HÓA! Lên cấp ${p.bodhiTree.level}. Toàn bộ Chỉ Số +${p.bodhiTree.level}%!`, "text-amber-400 font-extrabold text-xs bg-amber-900/30 px-2 py-1 rounded inline-block my-1 shadow-sm");
                }
                
                updateUI(); renderDongPhu();
            } else {
                playSfx('error'); logMsg("❌ Không đủ tài nguyên (Mộc, Thảo, Thiết) để tưới nước!", "text-rose-400");
            }
        }

        function upgradeNatalWeapon() {
            let nLv = p.natalWeapon.lv;
            let cost = Math.floor(1000 * Math.pow(nLv + 1, 1.5));
            if (p.wood >= cost && p.herb >= cost && p.iron >= cost) {
                p.wood -= cost; p.herb -= cost; p.iron -= cost;
                p.natalWeapon.lv++;
                logMsg(`🔮 Tế luyện Bản Mệnh Pháp Bảo thành công! Đạt Level ${p.natalWeapon.lv}. Sức mạnh vô biên!`, "text-amber-400 font-bold");
                playSfx('boss'); updateUI(); renderDongPhu();
            } else { playSfx('error'); logMsg("❌ Không đủ tài nguyên Động Phủ để tế luyện!", "text-rose-400"); }
        }

        function upgradeEstate(type) {
            let lvKey = type + 'Lv';
            let cost = Math.floor(1000 * Math.pow(p.estate[lvKey], 1.8));
            if (p.coins >= cost) {
                p.coins -= cost; p.estate[lvKey]++;
                logMsg(`🏡 Động Phủ: Nâng cấp thành công Linh Trận ${type.toUpperCase()} lên Lv ${p.estate[lvKey]}`, "text-green-400 font-bold");
                playSfx('buy'); updateUI(); renderDongPhu();
            } else logMsg(`❌ Không đủ Linh Thạch! Cần ${formatNum(cost)} LT để nâng cấp.`, "text-rose-400");
        }

        function upgradeFurnace() {
            let fLv = p.estate.furnaceLv || 1;
            let cost = Math.floor(1000 * Math.pow(fLv, 1.8));
            if (p.wood >= cost && p.herb >= cost && p.iron >= cost) {
                p.wood -= cost; p.herb -= cost; p.iron -= cost;
                p.estate.furnaceLv = fLv + 1;
                logMsg(`🔥 Đỉnh Lô thăng cấp lên Lv ${p.estate.furnaceLv}! Có thể luyện chế đồ vật cấp cao hơn.`, "text-rose-400 font-bold");
                playSfx('lvlup'); updateUI(); renderDongPhu();
            } else { logMsg(`❌ Không đủ tài nguyên Động Phủ! Cần ${formatNum(cost)} Mộc, Thảo, Thiết.`, "text-slate-400"); playSfx('error'); }
        }

        function craftItem(type) {
            let fLv = p.estate.furnaceLv || 1;
            let cost1, cost2;
            if (type === 'pill') {
                cost1 = Math.floor(500 * Math.pow(fLv, 1.3)); cost2 = Math.floor(300 * Math.pow(fLv, 1.3)); 
                if (p.herb >= cost1 && p.wood >= cost2) { p.herb -= cost1; p.wood -= cost2; } 
                else { playSfx('error'); return logMsg(`❌ Thiếu linh thảo hoặc linh mộc để luyện đan!`, "text-rose-400"); }
            } else {
                cost1 = Math.floor(500 * Math.pow(fLv, 1.3)); cost2 = Math.floor(300 * Math.pow(fLv, 1.3)); 
                if (p.iron >= cost1 && p.wood >= cost2) { p.iron -= cost1; p.wood -= cost2; } 
                else { playSfx('error'); return logMsg(`❌ Thiếu huyền thiết hoặc linh mộc để luyện khí!`, "text-rose-400"); }
            }
            
            let targetTier = Math.min(9, Math.floor((fLv - 1) / 3)); 
            let pool = Object.keys(DB_ITEMS).filter(k => {
                let itm = DB_ITEMS[k]; let tIdx = itm.tierIdx || 0;
                if (Math.abs(tIdx - targetTier) > 1) return false; 
                if (type === 'pill') return itm.type === 'consumable';
                if (type === 'equip') return ['weapon', 'talisman', 'armor', 'cloth', 'helmet', 'glove', 'boots'].includes(itm.type);
                return false;
            });
            if (pool.length === 0) pool = type === 'pill' ? ['hp1'] : ['wgen_1'];
            
            let crafted = pool[Math.floor(Math.random() * pool.length)];
            p.inv[crafted] = (p.inv[crafted] || 0) + 1;
            logMsg(`🔥 Đỉnh Lô luyện thành công: <span class="${DB_ITEMS[crafted].tierClass}">${DB_ITEMS[crafted].name}</span>! Đã đưa vào Túi Đồ.`, "text-white font-bold");
            playSfx('heal'); updateUI(); renderDongPhu();
        }

        function upgradeRoot(r) {
            let lv = p.roots[r];
            let wCost = Math.floor(100 * Math.pow(lv, 1.5)); let hCost = Math.floor(50 * Math.pow(lv, 1.5)); let iCost = Math.floor(20 * Math.pow(lv, 1.5));
            if (p.wood >= wCost && p.herb >= hCost && p.iron >= iCost) {
                p.wood -= wCost; p.herb -= hCost; p.iron -= iCost; p.roots[r]++;
                logMsg(`✨ Tẩy Tủy: ${DB_ROOTS[r].name} đột phá lên Lv ${p.roots[r]}! Căn cơ vững chắc!`, "text-cyan-300 font-bold");
                playSfx('lvlup'); updateUI(); renderDongPhu();
            } else { logMsg(`❌ Không đủ tài nguyên Động Phủ để tẩy tủy!`, "text-rose-400"); playSfx('error'); }
        }

        function refineItem(slot) {
            if (!p.equip[slot]) return;
            let eqId = p.equip[slot]; let item = DB_ITEMS[eqId];
            if (!p.enhanceLevels) p.enhanceLevels = {};
            let enhLv = getEnhanceLevel(eqId);
            
            if (enhLv >= 9999) return logMsg("❌ Vật phẩm đã đạt cảnh giới cường hóa tối đa (+9999)!", "text-rose-400");

            let refineCostIron = Math.floor(100 * Math.pow(enhLv + 1, 1.1) * (item.tierIdx + 1));
            let refineCostWood = Math.floor(50 * Math.pow(enhLv + 1, 1.1) * (item.tierIdx + 1));

            if (p.iron >= refineCostIron && p.wood >= refineCostWood) {
                p.iron -= refineCostIron; p.wood -= refineCostWood;
                p.enhanceLevels[eqId] = enhLv + 1;
                playSfx('hit');
                logMsg(`🔨 Cường hóa thành công! [${item.name}] lên <span class="text-amber-400 font-bold">+${enhLv + 1}</span>. Chỉ số cơ bản +5%.`, "text-cyan-300");
                updateUI(); renderDongPhu();
            } else { playSfx('error'); logMsg("❌ Không đủ Thiết và Mộc để cường hóa!", "text-rose-400"); }
        }

        function upgradeStarLevel(slot) {
            if (!p.equip[slot]) return;
            let eqId = p.equip[slot]; let item = DB_ITEMS[eqId];
            if (!p.starLevels) p.starLevels = {};
            let starLv = getStarLevel(eqId);
            if (starLv >= 5) return logMsg("❌ Đồ đã đạt ngưỡng sao tối đa, hoàn thiện thành sao 7 màu!", "text-fuchsia-300");

            let starCostIron = Math.floor(300 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
            let starCostWood = Math.floor(200 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
            let starCostHerb = Math.floor(100 * Math.pow(starLv + 1, 1.2) * (item.tierIdx + 1));
            if (p.iron >= starCostIron && p.wood >= starCostWood && p.herb >= starCostHerb) {
                p.iron -= starCostIron; p.wood -= starCostWood; p.herb -= starCostHerb;
                p.starLevels[eqId] = starLv + 1;
                playSfx('lvlup');
                logMsg(`🌟 Nâng sao thành công! [${item.name}] lên ${getStarText(starLv + 1)}. Thuộc tính tăng theo hệ số sao!`, "text-fuchsia-300");
                updateUI(); renderDongPhu();
            } else { playSfx('error'); logMsg("❌ Không đủ Thiết, Mộc và Thảo để nâng sao!", "text-rose-400"); }
        }

        function refineCompanion(type, id) {
            if (!id) return;
            if (type === 'pet') {
                let level = getPetEnhanceLevel(id);
                let item = DB_ITEMS[id];
                if (level >= 9999) return logMsg(`❌ ${item.name} đã đạt cường hóa tối đa (+9999)!`, 'text-rose-400');
                let cost = Math.floor(150 * Math.pow(level + 1, 1.1) * ((item.tierIdx || 1) + 1));
                if (p.iron < cost || p.herb < cost || p.wood < cost) return logMsg('❌ Không đủ tài nguyên để cường hóa linh thú.', 'text-rose-400');
                p.iron -= cost; p.herb -= cost; p.wood -= cost;
                p.petEnhanceLevels[id] = level + 1;
                logMsg(`🔨 ${item.name} được cường hóa lên +${level + 1}.`, 'text-emerald-300');
            } else {
                let level = getMountEnhanceLevel(id);
                let item = DB_ITEMS[id];
                if (level >= 9999) return logMsg(`❌ ${item.name} đã đạt cường hóa tối đa (+9999)!`, 'text-rose-400');
                let cost = Math.floor(180 * Math.pow(level + 1, 1.1) * ((item.tierIdx || 1) + 1));
                if (p.iron < cost || p.herb < cost || p.wood < cost) return logMsg('❌ Không đủ tài nguyên để cường hóa tọa kỵ.', 'text-rose-400');
                p.iron -= cost; p.herb -= cost; p.wood -= cost;
                p.mountEnhanceLevels[id] = level + 1;
                logMsg(`🔨 ${item.name} được cường hóa lên +${level + 1}.`, 'text-indigo-300');
            }
            playSfx('hit'); updateUI(); renderPetList(); renderMountList();
        }

        function upgradeCompanionStar(type, id) {
            if (!id) return;
            if (type === 'pet') {
                let starLv = getPetStarLevel(id);
                if (starLv >= 5) return logMsg('❌ Linh thú đã đạt sao tối đa, thành phẩm sẽ trở thành 7 màu hoàn chỉnh.', 'text-fuchsia-300');
                let item = DB_ITEMS[id];
                let cost = Math.floor(350 * Math.pow(starLv + 1, 1.2) * ((item.tierIdx || 1) + 1));
                if (p.iron < cost || p.herb < cost || p.wood < cost) return logMsg('❌ Không đủ tài nguyên để nâng sao linh thú.', 'text-rose-400');
                p.iron -= cost; p.herb -= cost; p.wood -= cost;
                p.petStarLevels[id] = starLv + 1;
                logMsg(`🌟 ${item.name} nâng lên ${getStarText(starLv + 1)} sao.`, 'text-emerald-300');
            } else {
                let starLv = getMountStarLevel(id);
                if (starLv >= 5) return logMsg('❌ Tọa kỵ đã đạt sao tối đa, thành phẩm sẽ trở thành 7 màu hoàn chỉnh.', 'text-fuchsia-300');
                let item = DB_ITEMS[id];
                let cost = Math.floor(380 * Math.pow(starLv + 1, 1.2) * ((item.tierIdx || 1) + 1));
                if (p.iron < cost || p.herb < cost || p.wood < cost) return logMsg('❌ Không đủ tài nguyên để nâng sao tọa kỵ.', 'text-rose-400');
                p.iron -= cost; p.herb -= cost; p.wood -= cost;
                p.mountStarLevels[id] = starLv + 1;
                logMsg(`🌟 ${item.name} nâng lên ${getStarText(starLv + 1)} sao.`, 'text-indigo-300');
            }
            playSfx('lvlup'); updateUI(); renderPetList(); renderMountList();
        }

        function upgradeItemTier(slot) {
            if (!p.equip[slot]) return;
            let eqId = p.equip[slot]; let item = DB_ITEMS[eqId];
            if (item.tierIdx >= 9) return logMsg("❌ Vật phẩm đã ở cấp tối cao của Cửu Thiên Giới!", "text-rose-400");

            let upgradeCostIron = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));
            let upgradeCostWood = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));
            let upgradeCostHerb = Math.floor(50000 * Math.pow(item.tierIdx + 1, 2.5));

            if (p.iron >= upgradeCostIron && p.wood >= upgradeCostWood && p.herb >= upgradeCostHerb) {
                const slotPrefixMap = {
                    weapon: 'wgen_',
                    talisman: 'tgen_',
                    armor: 'agen_',
                    cloth: 'cgen_',
                    helmet: 'hgen_',
                    glove: 'ggen_',
                    boots: 'bgen_'
                };
                let prefix = slotPrefixMap[slot] || 'wgen_';
                let nextId = prefix + (item.tierIdx + 1);

                if (!DB_ITEMS[nextId]) return;

                p.iron -= upgradeCostIron; p.wood -= upgradeCostWood; p.herb -= upgradeCostHerb;

                if (!p.enhanceLevels) p.enhanceLevels = {};
                let currentEnhLv = p.enhanceLevels[eqId] || 0;
                p.enhanceLevels[nextId] = currentEnhLv;
                
                if (p.inv[eqId] > 0) p.inv[eqId]--; 
                p.inv[nextId] = (p.inv[nextId] || 0) + 1;
                p.equip[slot] = nextId;

                playSfx('lvlup');
                logMsg(`✨ Đột phá pháp bảo! Trang bị thăng cấp thành <span class="${DB_ITEMS[nextId].tierClass} font-bold">${DB_ITEMS[nextId].name}</span>! (Giữ nguyên cấp Tinh Luyện)`, "text-fuchsia-300");
                updateUI(); renderDongPhu();
            } else { playSfx('error'); logMsg("❌ Không đủ tài nguyên (Thiết, Mộc, Thảo) để thăng cấp pháp bảo!", "text-rose-400"); }
        }

        function renderCharStats() {
            let base = getBaseStats(p.lv); let total = getTotalStats();
            document.getElementById('ui-sp-display').innerText = `SP: ${formatNum(p.sp)}`;
            document.getElementById('ui-attr-display').innerText = `Điểm: ${formatNum(p.attributePoints || 0)}`;

            const attributeMeta = {
                atk: { label: 'Lực Chiến', icon: '⚔️', color: 'text-cyan-300' },
                hp: { label: 'Sinh Lực', icon: '❤️', color: 'text-rose-300' },
                def: { label: 'Phòng Thủ', icon: '🛡️', color: 'text-slate-300' }
            };
            const attrHtml = Object.entries(attributeMeta).map(([key, meta]) => {
                const val = (p.attributes && p.attributes[key]) || 0;
                return `
                    <div class="flex items-center justify-between bg-black/30 p-2 rounded border border-white/5">
                        <div class="flex items-center gap-2">
                            <span class="text-sm">${meta.icon}</span>
                            <div>
                                <div class="font-bold ${meta.color}">${meta.label}</div>
                                <div class="text-[9px] text-slate-400">Hiện có: ${formatNum(val)}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button onclick="removeAttribute('${key}')" class="w-6 h-6 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 ${val <= 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${val <= 0 ? 'disabled' : ''}>-</button>
                            <span class="min-w-[26px] text-center font-mono text-[10px] text-white">${formatNum(val)}</span>
                            <button onclick="addAttribute('${key}')" class="w-6 h-6 rounded bg-emerald-700 text-white hover:bg-emerald-600 ${(p.attributePoints || 0) <= 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${(p.attributePoints || 0) <= 0 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                `;
            }).join('');
            document.getElementById('char-attr-list').innerHTML = attrHtml;

            let clanBonuses = getClanBonuses();
            document.getElementById('char-stats-list').innerHTML = `
                <li class="flex justify-between items-center bg-black/30 p-2 rounded"><span>Chân Khí (ATK Căn Bản):</span> <span class="font-mono text-cyan-300">${formatNum(base.atk)}</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded"><span>Từ Trang Bị & Đan:</span> <span class="font-mono text-emerald-300">+${formatNum(total.atkBonus)}</span></li>
                <li class="flex justify-between items-center bg-amber-900/40 p-2 rounded border border-amber-500/30 font-bold text-amber-400 mt-2 shadow-inner"><span class="text-xs">TỔNG LỰC CHIẾN:</span> <span class="font-mono text-sm">${formatNum(total.atk)}</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded mt-3"><span>Thể Phách (HP Tối Đa):</span> <span class="font-mono text-rose-300">${formatNum(total.hp)}</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded"><span>Linh Khí (MP Tối Đa):</span> <span class="font-mono text-blue-300">${formatNum(total.mp)}</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded mt-3 border-l-2 border-slate-500 pl-2"><span>Căn Cốt (Phòng Thủ):</span> <span class="font-mono text-slate-300">${formatNum(total.def)}</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded border-l-2 border-emerald-500 pl-2"><span>Thân Pháp (Né Tránh):</span> <span class="font-mono text-emerald-300">${(total.dodge * 100).toFixed(1)}%</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded border-l-2 border-fuchsia-500 pl-2"><span>Chân Ngôn (Bạo Kích):</span> <span class="font-mono text-fuchsia-300">${(total.crit * 100).toFixed(1)}%</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded mt-3 border-l-2 border-cyan-500 pl-2"><span>Ngộ Tính (Tốc Độ EXP):</span> <span class="font-mono text-cyan-300">+${((total.expRate - 1)*100).toFixed(1)}%</span></li>
                <li class="flex justify-between items-center bg-black/30 p-2 rounded border-l-2 border-amber-500 pl-2"><span>Cơ Duyên (Tỷ Lệ Nhặt):</span> <span class="font-mono text-amber-300">+${((total.luck - 1)*100).toFixed(1)}%</span></li>
                <li class="flex justify-between items-center bg-fuchsia-950/30 p-2 rounded border-l-2 border-fuchsia-500 pl-2"><span>Gia Tộc (Phụ Khích):</span> <span class="font-mono text-fuchsia-300">+${((clanBonuses.expRate - 1)*100).toFixed(1)}% EXP / +${((clanBonuses.luck - 1)*100).toFixed(1)}% Cơ Duyên</span></li>
            `;

            const genSlot = (type, icon, label, id, colorClass) => {
                let enhStr = '';
                if (id && (type === 'weapon' || type === 'talisman')) {
                    let enhLv = (p.enhanceLevels && p.enhanceLevels[id]) || 0;
                    if (enhLv > 0) enhStr = `<span class="text-amber-400 drop-shadow ml-1">+${enhLv}</span>`;
                }
                let iconHtml = `<div class="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-sm shadow-inner group-hover:bg-rose-900/30">${icon}</div>`;
                if (id && DB_ITEMS[id]) {
                    iconHtml = getItemImageHtml(id, DB_ITEMS[id], "w-8 h-8 object-cover rounded shadow-sm border border-white/20");
                }
                return `
                <div class="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 cursor-pointer hover:border-rose-500 transition-colors group" onclick="unequip('${type}')">
                    ${iconHtml}
                    <div class="flex-1">
                        <div class="text-[9px] text-slate-400 uppercase tracking-wider">${label}</div>
                        <div class="font-bold text-[11px] ${id ? colorClass : 'text-slate-500'}">${id ? DB_ITEMS[id].name + enhStr : 'Chưa trang bị'}</div>
                    </div>
                </div>`;
            };
            document.getElementById('char-equip-list').innerHTML = `${genSlot('weapon', '⚔️', 'Vũ Khí', p.equip.weapon, 'text-cyan-300')}${genSlot('talisman', '📜', 'Bùa Chú', p.equip.talisman, 'text-purple-300')}${genSlot('armor', '🛡️', 'Giáp', p.equip.armor, 'text-amber-300')}${genSlot('cloth', '🧥', 'Áo', p.equip.cloth, 'text-emerald-300')}${genSlot('helmet', '👑', 'Nón', p.equip.helmet, 'text-fuchsia-300')}${genSlot('glove', '🧤', 'Tay', p.equip.glove, 'text-sky-300')}${genSlot('boots', '🥾', 'Giày', p.equip.boots, 'text-indigo-300')}${genSlot('pet', '🐾', `Linh Thú (Lv ${p.equip.pet ? (p.petLevels[p.equip.pet] || 1) : 0})`, p.equip.pet, 'text-emerald-300')}${genSlot('mount', '🐎', `Thú Cưỡi (Lv ${p.equip.mount ? (p.mountLevels[p.equip.mount] || 1) : 0})`, p.equip.mount, 'text-indigo-300')}<div class="text-[9px] text-slate-500 text-center italic mt-2">Nhấp vào một khe để tháo trang bị</div>`;

            let pillsHtml = ''; let hasPills = false;
            for(let id in p.pillsEaten) { if(p.pillsEaten[id] > 0) { hasPills = true; pillsHtml += `<div class="flex justify-between bg-black/40 px-2 py-1 rounded"><span>${DB_ITEMS[id].name}</span> <span class="text-amber-400 font-mono">x${p.pillsEaten[id]}</span></div>`; } }
            document.getElementById('char-pills-list').innerHTML = hasPills ? pillsHtml : `<div class="text-center text-slate-500 italic py-2">Chưa luyện hóa đan dược nào.</div>`;

            let skillsHtml = ''; let currentRealm = getRealmInfo(p.lv).name; let realmIndex = DB_REALMS.findIndex(r => r.name === currentRealm);
            DB_SKILLS.forEach(skill => {
                let unlocked = realmIndex >= DB_REALMS.findIndex(r => r.name === skill.req);
                skillsHtml += `<div class="bg-black/30 p-2 rounded border-l-2 ${unlocked ? 'border-sky-500' : 'border-slate-700 opacity-50'}"><div class="font-bold ${unlocked ? 'text-sky-300' : 'text-slate-500'} flex justify-between"><span>${skill.name}</span> <span class="text-[9px] bg-black/50 px-1 rounded">${skill.req}</span></div><div class="text-[9px] text-slate-400 mt-1">${skill.desc}</div></div>`;
            });
            
            if (p.learnedSkills && p.learnedSkills.length > 0) {
                skillsHtml += `<div class="w-full h-px bg-white/10 my-2"></div><div class="text-xs font-bold text-fuchsia-400 mb-2 mt-2">📚 Tàng Kinh Các (Đã Lĩnh Ngộ)</div>`;
                p.learnedSkills.forEach(id => { 
                    let b = DB_ITEMS[id]; 
                    if (!b) return;
                    let slv = p.skillLevels[id] || 1;
                    let currentBonus = (b.baseVal * (1 + ((slv - 1) * 0.02)) * 100).toFixed(1);
                    
                    skillsHtml += `
                    <div class="bg-black/40 p-2 rounded border border-fuchsia-900/30 flex flex-col gap-1 mb-1 relative overflow-hidden">
                        <div class="flex justify-between items-center">
                            <span class="font-bold ${b.tierClass} text-[10px]">${b.name} <span class="text-white">Lv.${slv}</span></span> 
                            <span class="text-[9px] text-emerald-300">+${currentBonus}% ${b.descStr ? b.descStr.replace('Tăng ','') : ''}</span>
                        </div>
                        <div class="flex gap-1 mt-1 border-t border-white/5 pt-1">
                            <button onclick="upgradeSkill('${id}', 1)" class="flex-1 bg-fuchsia-900/50 hover:bg-fuchsia-800 text-fuchsia-100 text-[9px] py-1 rounded border border-fuchsia-700/50 transition-colors ${p.sp < 1 || slv >= 20000 ? 'opacity-50 cursor-not-allowed' : ''}">Nâng 1 Cấp (1 SP)</button>
                            <button onclick="upgradeSkill('${id}', 'max')" class="flex-1 bg-fuchsia-700/80 hover:bg-fuchsia-600 text-white text-[9px] py-1 rounded border border-fuchsia-500/50 transition-colors ${p.sp < 1 || slv >= 20000 ? 'opacity-50 cursor-not-allowed' : ''}">Nâng MAX</button>
                        </div>
                    </div>`; 
                });
            } else skillsHtml += `<div class="text-[9px] text-slate-500 text-center italic mt-3">Chưa lĩnh ngộ Bí Cấp nào.</div>`;
            document.getElementById('char-skills-list').innerHTML = skillsHtml;
        }

        function renderMeridians() {
            let container = document.getElementById('char-meridian-container');
            if(!container) return;
            if(!p.meridians) p.meridians = { level: 0, node: 0 };
            
            let mLevel = parseInt(p.meridians.level) || 0; 
            let mNode = parseInt(p.meridians.node) || 0;
            let isMaxed = mLevel >= MERIDIANS.length;
            
            let currentM = isMaxed ? MERIDIANS[MERIDIANS.length - 1] : MERIDIANS[mLevel];
            let reqLv = isMaxed ? 0 : currentM.reqLv; let canUnlock = p.lv >= reqLv;
            
            let kmdCost = isMaxed ? 0 : Math.floor(10 * Math.pow(2, mLevel) * Math.pow(1.2, mNode));
            let hgdCost = isMaxed ? 0 : Math.floor(5 * Math.pow(2.5, mLevel));
            
            let kmdCount = p.inv['kmd'] || 0; let hgdCount = p.inv['hgd'] || 0;

            let nodesHtml = '<div class="relative flex justify-between items-center px-3 py-8 overflow-x-auto no-scrollbar">';
            nodesHtml += '<div class="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1.5 bg-slate-800/80 rounded-full z-0 border border-slate-700/50 shadow-inner"></div>';
            
            let progressWidth = isMaxed ? 100 : Math.max(0, (mNode / 10) * 100);
            nodesHtml += `<div class="absolute left-3 top-1/2 -translate-y-1/2 h-1.5 ${currentM.bg} rounded-full z-0 transition-all duration-700 shadow-[0_0_12px_currentColor]" style="width: calc(${progressWidth}% - 1.5rem)"></div>`;

            for(let i = 0; i <= 10; i++) {
                let status = isMaxed || i < mNode ? 'unlocked' : (i === mNode && !isMaxed ? 'active' : 'locked');
                let dotClass = status === 'unlocked' ? `${currentM.bg} shadow-[0_0_8px_currentColor] scale-110` : 
                               status === 'active' ? `${currentM.bg} animate-pulse ring-4 ring-white/30 shadow-[0_0_20px_currentColor] scale-125` : 'bg-slate-700 border-2 border-slate-900 opacity-50';
                
                let isBig = i === 0 || i === 10;
                let sizeClass = isBig ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-2.5 h-2.5 sm:w-3 sm:h-3';
                
                nodesHtml += `
                    <div class="relative z-10 flex flex-col items-center gap-1 shrink-0">
                        <div class="${sizeClass} rounded-full ${dotClass} transition-all duration-300"></div>
                        ${isBig ? `<span class="absolute -bottom-6 text-[8px] font-bold ${status === 'unlocked' || status === 'active' ? currentM.color : 'text-slate-500'} whitespace-nowrap drop-shadow">${i === 0 ? 'Khởi Huyệt' : 'Quy Mạch'}</span>` : ''}
                    </div>
                `;
            }
            nodesHtml += '</div>';

            let actionHtml = '';
            if (isMaxed) {
                actionHtml = `<div class="text-center text-amber-400 font-bold p-3 glass-panel rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)]">Kinh Mạch Đại Viên Mãn! Chân Ngã Hợp Nhất!</div>`;
            } else if (!canUnlock) {
                actionHtml = `<div class="text-center text-rose-400 font-bold p-3 glass-panel border-rose-500/30 rounded-xl flex items-center justify-center gap-2"><span class="text-xl">🔒</span> Cần EXP ${formatNum(reqLv)} (${currentM.reqName}) để đả thông!</div>`;
            } else {
                if (mNode < 10) {
                    let canAfford = kmdCount >= kmdCost;
                    actionHtml = `
                        <div class="flex justify-between items-center bg-black/60 p-3.5 rounded-xl border border-rose-900/50 shadow-lg">
                            <div>
                                <div class="text-[10px] text-rose-300 font-bold mb-1 uppercase tracking-wider">Xung Kích Huyệt Vị (${mNode + 1}/10)</div>
                                <div class="text-[11px] font-bold flex items-center gap-1">
                                    <span class="text-slate-400">Tiêu hao:</span> <span class="${canAfford ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-rose-500'}">${formatNum(kmdCost)} K.M.Đan</span> <span class="text-[9px] text-slate-500 ml-1">(Có: ${formatNum(kmdCount)})</span>
                                </div>
                            </div>
                            <button onclick="upgradeMeridianNode()" class="btn-action relative overflow-hidden ${canAfford ? 'text-rose-50 shadow-[0_4px_15px_rgba(225,29,72,0.5)] border border-rose-500/80 active:scale-95' : 'text-slate-500 bg-slate-800/80 border border-slate-700/50 cursor-not-allowed'} px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all group">
                                ${canAfford ? `<div class="absolute inset-0 bg-gradient-to-r from-rose-900 via-rose-700 to-rose-950 group-hover:scale-105 transition-transform duration-500"></div><div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>` : ''}
                                <span class="relative z-10 flex items-center gap-1 drop-shadow-md"><span>⚡</span> Kích Mạch</span>
                            </button>
                        </div>
                    `;
                } else {
                    let canAfford = hgdCount >= hgdCost;
                    actionHtml = `
                        <div class="flex justify-between items-center bg-black/60 p-3.5 rounded-xl border border-amber-500/40 shadow-lg">
                            <div>
                                <div class="text-[10px] text-amber-400 font-bold mb-1 uppercase tracking-wider">Đột Phá ${currentM.name}</div>
                                <div class="text-[11px] font-bold flex items-center gap-1">
                                    <span class="text-slate-400">Tiêu hao:</span> <span class="${canAfford ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-rose-500'}">${formatNum(hgdCost)} H.G.Đan</span> <span class="text-[9px] text-slate-500 ml-1">(Có: ${formatNum(hgdCount)})</span>
                                </div>
                            </div>
                            <button onclick="breakthroughMeridian()" class="btn-action relative overflow-hidden ${canAfford ? 'text-amber-50 shadow-[0_4px_15px_rgba(245,158,11,0.5)] border border-amber-500/80 active:scale-95' : 'text-slate-500 bg-slate-800/80 border border-slate-700/50 cursor-not-allowed'} px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all group">
                                ${canAfford ? `<div class="absolute inset-0 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-950 group-hover:scale-105 transition-transform duration-500"></div><div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>` : ''}
                                <span class="relative z-10 flex items-center gap-1 drop-shadow-md"><span>🔥</span> Đột Phá</span>
                            </button>
                        </div>
                    `;
                }
            }

            container.innerHTML = `
                <div class="glass-panel p-4 rounded-xl border border-white/5 shadow-xl relative overflow-hidden transition-transform duration-200" id="meridian-visual-panel">
                    <div class="absolute -right-6 -top-6 text-7xl opacity-5 blur-sm pointer-events-none">🌌</div>
                    <h3 class="font-bold ${currentM.color} text-sm mb-2 flex items-center justify-between">
                        <span class="flex items-center gap-2"><span class="text-lg">☄️</span> ${isMaxed ? 'Đại Viên Mãn' : `Đang Mở: ${currentM.name}`}</span>
                        <div class="flex items-center gap-2">
                            ${!isMaxed ? `<button onclick="toggleAutoMeridian()" class="text-[9px] ${isAutoMeridian ? 'bg-red-800 animate-pulse text-white' : 'bg-indigo-900/80 text-indigo-200'} hover:bg-indigo-800 px-2 py-0.5 rounded border border-indigo-500/50 shadow transition-colors">${isAutoMeridian ? 'Đang Auto...' : 'Auto Kích'}</button>` : ''}
                            <span class="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Tầng ${mLevel + (isMaxed?0:1)}/${MERIDIANS.length}</span>
                        </div>
                    </h3>
                    ${nodesHtml}
                </div>
                ${actionHtml}
                <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                    <h3 class="font-bold text-emerald-400 text-xs mb-3 border-b border-white/10 pb-2 flex items-center gap-2"><span class="text-sm">🧬</span> Tổng Thuộc Tính Kinh Mạch</h3>
                    <div class="grid grid-cols-2 gap-2 text-[10px]" id="meridian-stats-list"></div>
                </div>
            `;
            
            renderMeridianStats();
        }

        function renderMeridianStats() {
            let st = getMeridianStats(); let html = '';
            if (st.hp > 0) html += `<div class="bg-black/30 p-2 rounded flex justify-between border-l-2 border-rose-500"><span>Sinh Lực:</span> <span class="text-rose-300 font-mono font-bold">+${formatNum(st.hp)}</span></div>`;
            if (st.atk > 0) html += `<div class="bg-black/30 p-2 rounded flex justify-between border-l-2 border-cyan-500"><span>Lực Chiến:</span> <span class="text-cyan-300 font-mono font-bold">+${formatNum(st.atk)}</span></div>`;
            if (st.def > 0) html += `<div class="bg-black/30 p-2 rounded flex justify-between border-l-2 border-slate-500"><span>Phòng Thủ:</span> <span class="text-amber-300 font-mono font-bold">+${formatNum(st.def)}</span></div>`;
            if (st.dodge > 0) html += `<div class="bg-black/30 p-2 rounded flex justify-between border-l-2 border-emerald-500"><span>Né Tránh:</span> <span class="text-emerald-300 font-mono font-bold">+${(st.dodge*100).toFixed(1)}%</span></div>`;
            if (st.crit > 0) html += `<div class="bg-black/30 p-2 rounded flex justify-between border-l-2 border-fuchsia-500"><span>Bạo Kích:</span> <span class="text-fuchsia-300 font-mono font-bold">+${(st.crit*100).toFixed(1)}%</span></div>`;
            if (st.hpM > 0) html += `<div class="bg-rose-900/20 p-2 rounded flex justify-between border border-rose-500/30"><span>TỔNG HP:</span> <span class="text-rose-400 font-mono font-bold">+${(st.hpM*100).toFixed(1)}%</span></div>`;
            if (st.atkM > 0) html += `<div class="bg-cyan-900/20 p-2 rounded flex justify-between border border-cyan-500/30"><span>TỔNG ATK:</span> <span class="text-cyan-400 font-mono font-bold">+${(st.atkM*100).toFixed(1)}%</span></div>`;
            
            if (html === '') html = `<div class="col-span-full text-center text-slate-500 italic py-2">Chưa khai mở kinh mạch nào. Auto lịch luyện để tìm Kinh Mạch Đan.</div>`;
            document.getElementById('meridian-stats-list').innerHTML = html;
        }

        function upgradeMeridianNode() {
            let mLevel = parseInt(p.meridians.level) || 0; 
            let mNode = parseInt(p.meridians.node) || 0;
            if (mLevel >= MERIDIANS.length || mNode >= 10) return;
            
            let kmdCost = Math.floor(10 * Math.pow(2, mLevel) * Math.pow(1.2, mNode));
            if ((p.inv['kmd'] || 0) >= kmdCost) {
                p.inv['kmd'] -= kmdCost;
                p.meridians.node = mNode + 1;
                playSfx('hit');
                logMsg(`💥 Kích Mạch: Đả thông huyệt vị ${p.meridians.node}/10 của [${MERIDIANS[mLevel].name}] thành công! Khí huyết dâng trào!`, MERIDIANS[mLevel].color + " font-bold");
                updateUI();
                
                let panel = document.getElementById('meridian-visual-panel');
                if(panel) {
                    panel.style.transform = "scale(0.98)";
                    setTimeout(() => panel.style.transform = "scale(1)", 150);
                }
            } else {
                playSfx('error'); logMsg(`❌ Kích mạch thất bại! Không đủ ${formatNum(kmdCost)} Kinh Mạch Đan.`, "text-rose-400");
            }
        }

        function breakthroughMeridian() {
            let mLevel = parseInt(p.meridians.level) || 0;
            let mNode = parseInt(p.meridians.node) || 0;
            if (mLevel >= MERIDIANS.length || mNode < 10) return;
            
            let hgdCost = Math.floor(5 * Math.pow(2.5, mLevel));
            if ((p.inv['hgd'] || 0) >= hgdCost) {
                p.inv['hgd'] -= hgdCost;
                p.meridians.level = mLevel + 1;
                p.meridians.node = 0;
                playSfx('boss');
                logMsg(`✨ ĐỘT PHÁ KINH MẠCH! [${MERIDIANS[mLevel].name}] đã khai mở hoàn toàn! Cảnh giới vươn lên tầm cao mới!`, "text-amber-400 font-extrabold text-xs bg-amber-900/30 px-2 py-1 rounded inline-block my-1 shadow-sm");
                updateUI();
                
                let panel = document.getElementById('meridian-visual-panel');
                if(panel) {
                    panel.style.transform = "scale(1.05)";
                    panel.style.filter = "brightness(1.5) drop-shadow(0 0 20px #f59e0b)";
                    setTimeout(() => {
                        panel.style.transform = "scale(1)";
                        panel.style.filter = "";
                    }, 300);
                }
            } else {
                playSfx('error'); logMsg(`❌ Đột phá thất bại! Cần ${formatNum(hgdCost)} Huyền Giám Đan để ổn định tâm ma.`, "text-rose-400");
            }
        }

        function toggleAutoMeridian() {
            playSfx('click');
            isAutoMeridian = !isAutoMeridian;
            if (isAutoMeridian) {
                logMsg("🌌 Bắt đầu Auto Xung Mạch...", "text-indigo-300 font-bold");
                runAutoMeridianLoop(); 
                syncOfflineAutoState();
            } else {
                logMsg("🛑 Đã dừng Auto Xung Mạch.", "text-slate-400");
                if (autoMeridianInterval) clearTimeout(autoMeridianInterval);
                syncOfflineAutoState();
            }
            if (document.getElementById('view-char').classList.contains('active')) renderMeridians();
        }

        function runAutoMeridianLoop() {
            if (!isAutoMeridian) return;
            
            let mLevel = parseInt(p.meridians.level) || 0; 
            let mNode = parseInt(p.meridians.node) || 0;
            
            if (mLevel >= MERIDIANS.length) {
                if (isAutoMeridian) toggleAutoMeridian();
                return;
            }
            
            if (mNode < 10) {
                let kmdCost = Math.floor(10 * Math.pow(2, mLevel) * Math.pow(1.2, mNode));
                if ((p.inv['kmd'] || 0) >= kmdCost) {
                    upgradeMeridianNode();
                } else {
                    logMsg("❌ Không đủ Kinh Mạch Đan, dừng Auto.", "text-rose-400");
                    if (isAutoMeridian) toggleAutoMeridian();
                    return;
                }
            } else {
                let hgdCost = Math.floor(5 * Math.pow(2.5, mLevel));
                if ((p.inv['hgd'] || 0) >= hgdCost) {
                    breakthroughMeridian();
                } else {
                    logMsg("❌ Không đủ Huyền Giám Đan, dừng Auto.", "text-rose-400");
                    if (isAutoMeridian) toggleAutoMeridian();
                    return;
                }
            }
            
            if (isAutoMeridian) autoMeridianInterval = setTimeout(runAutoMeridianLoop, 300);
        }

        function upgradeSkill(id, amount) {
            let slv = p.skillLevels[id] || 1;
            if (slv >= 20000) return logMsg("❌ Kỹ năng đã đạt mức cao nhất (Đại Viên Mãn).", "text-rose-400");
            if (p.sp <= 0) return logMsg("❌ Không đủ Điểm Kỹ Năng (SP). Cần thăng cấp Level để nhận SP.", "text-rose-400");
            
            playSfx('lvlup');
            if (amount === 'max') {
                let canUpgrade = Math.min(p.sp, 20000 - slv);
                p.sp -= canUpgrade;
                p.skillLevels[id] = slv + canUpgrade;
                logMsg(`📚 Lĩnh ngộ bộc phát! [${DB_ITEMS[id].name}] tăng ${canUpgrade} cấp, đạt Level ${p.skillLevels[id]}.`, "text-fuchsia-300 font-bold");
            } else {
                p.sp -= 1;
                p.skillLevels[id] = slv + 1;
                logMsg(`📚 Lĩnh ngộ [${DB_ITEMS[id].name}] lên Level ${p.skillLevels[id]}.`, "text-fuchsia-300");
            }
            updateUI();
        }

        function renderInvTabs() {
            if (!invCategories.some(cat => cat.id === activeInvCategory)) {
                activeInvCategory = 'all';
            }
            let html = invCategories.map(cat => {
                let isActive = activeInvCategory === cat.id;
                let bgClass = isActive ? 'bg-cyan-700 text-white border-cyan-400' : 'bg-slate-800/80 text-slate-400 border-slate-600';
                return `<button onclick="changeInvCategory('${cat.id}')" class="shrink-0 px-3 py-1 rounded-full border ${bgClass} text-[10px] font-bold transition-colors whitespace-nowrap drop-shadow">${cat.title}</button>`;
            }).join('');
            document.getElementById('inv-categories').innerHTML = html;
        }

        function changeInvCategory(id) {
            playSfx('click');
            activeInvCategory = id;
            renderInvTabs();
            renderInv();
        }

        function equipItem(id) {
            let item = DB_ITEMS[id];
            if (!item) return;
            ensureCompanionState();
            if (!canUseItemByRealm(item, p.lv)) { playSfx('error'); return logMsg(`❌ Cảnh giới hiện tại chưa mở loại này!`, "text-rose-400"); }
            if (item.reqLv && p.lv < item.reqLv) { playSfx('error'); return logMsg(`❌ Cảnh giới chưa đủ! Cần đạt Level ${formatNum(item.reqLv)} để dùng.`, "text-rose-400"); }

            const equipTypes = ['weapon', 'talisman', 'armor', 'cloth', 'helmet', 'glove', 'boots'];
            const companionTypes = ['pet', 'mount'];

            if (equipTypes.includes(item.type)) {
                if (p.equip[item.type] === id) return unequip(item.type);
                p.equip[item.type] = id;
                playSfx('click');
                logMsg(`Trang bị thành công: ${item.name}`, "text-cyan-300");
                updateUI(); renderInv(); renderPetList(); renderMountList(); renderCharStats();
                return;
            }

            if (companionTypes.includes(item.type)) {
                if (p.equip[item.type] === id) return unequip(item.type);
                const ownedList = item.type === 'pet' ? p.pets : p.mounts;
                if (!ownedList || !ownedList.includes(id)) {
                    playSfx('error');
                    return logMsg(`❌ ${item.name} chưa thuộc sở hữu của bạn!`, "text-rose-400");
                }
                p.equip[item.type] = id;
                playSfx('click');
                logMsg(`Xuất chiến ${item.type === 'pet' ? 'Linh Thú' : 'Tọa Kỵ'} thành công: ${item.name}`, "text-cyan-300");
                updateUI(); renderInv(); renderPetList(); renderMountList(); renderCharStats();
                return;
            }
        }

        function unequip(type) {
            if (p.equip[type]) {
                p.equip[type] = null;
                playSfx('click');
                updateUI(); renderInv(); renderPetList(); renderMountList(); renderCharStats();
            }
        }
        
        async function useItem(id) {
            let item = DB_ITEMS[id];
            if (!item || !p.inv[id]) return;
            ensureCompanionState();
            if (!canUseItemByRealm(item, p.lv)) { playSfx('error'); return logMsg(`❌ Cảnh giới hiện tại chưa mở loại này!`, "text-rose-400"); }
            if (item.reqLv && p.lv < item.reqLv) { playSfx('error'); return logMsg(`❌ Cảnh giới chưa đủ! Cần đạt Level ${formatNum(item.reqLv)} để dùng.`, "text-rose-400"); }
            
            if (item.type === 'consumable') {
                p.inv[id]--;
                playSfx('heal');
                if (item.sub === 'hp') { p.hp = Math.min(getTotalStats().hp, p.hp + item.val); logMsg(`Dùng ${item.name}, hồi ${formatNum(item.val)} HP`, "text-rose-400"); }
                else if (item.sub === 'mp') { p.mp = Math.min(getTotalStats().mp, p.mp + item.val); logMsg(`Dùng ${item.name}, hồi ${formatNum(item.val)} MP`, "text-blue-400"); }
                else if (item.sub && item.sub.startsWith('perm_')) {
                    p.pillsEaten[id] = (p.pillsEaten[id] || 0) + 1;
                    logMsg(`Nuốt ${item.name}, thuộc tính vĩnh viễn tăng trưởng!`, "text-fuchsia-300 font-bold");
                }
            } 
            else if (item.type === 'skill_book') {
                if (p.learnedSkills.includes(id)) { playSfx('error'); return logMsg(`❌ Đã lĩnh ngộ ${item.name} rồi!`, "text-rose-400"); }
                p.inv[id]--;
                p.learnedSkills.push(id);
                playSfx('lvlup');
                logMsg(`📚 Lĩnh ngộ thành công bí cấp: ${item.name}!`, "text-fuchsia-300 font-bold");
            }
            else if (item.type === 'pet_item') {
                let isMount = item.sub === 'mount';
                let targetId = isMount ? p.equip.mount : p.equip.pet;
                if (!targetId) { playSfx('error'); return logMsg(`❌ Vui lòng xuất chiến ${isMount ? 'Tọa Kỵ' : 'Linh Thú'} trước khi dùng!`, "text-rose-400"); }
                if (!p.petLevels && !isMount) p.petLevels = {};
                if (!p.mountLevels && isMount) p.mountLevels = {};
                
                p.inv[id]--;
                if (isMount) {
                    p.mountLevels[targetId] = (p.mountLevels[targetId] || 1) + item.val;
                    logMsg(`🐎 Tọa Kỵ [${DB_ITEMS[targetId].name}] được bồi dưỡng tăng ${item.val} cấp!`, "text-indigo-300 font-bold");
                } else {
                    p.petLevels[targetId] = (p.petLevels[targetId] || 1) + item.val;
                    logMsg(`🐾 Linh Thú [${DB_ITEMS[targetId].name}] được bồi dưỡng tăng ${item.val} cấp!`, "text-emerald-300 font-bold");
                }
                playSfx('heal');
            }
            else if (item.type === 'pet_skill_book' || item.type === 'pet_passive_book' || item.type === 'mount_passive_book') {
                let isMount = item.type === 'mount_passive_book';
                let targetId = isMount ? p.equip.mount : p.equip.pet;
                
                if (item.type === 'pet_skill_book') {
                    if (!targetId) { playSfx('error'); return logMsg(`❌ Vui lòng xuất chiến Linh Thú trước khi dùng!`, "text-rose-400"); }
                    p.inv[id]--;
                    p.petLevels[targetId] = (p.petLevels[targetId] || 1) + item.val;
                    logMsg(`🐾 Linh Thú lĩnh ngộ thú quyết, cấp độ tăng lên!`, "text-emerald-300 font-bold");
                } else if (item.type === 'pet_passive_book') {
                    if (!targetId) { playSfx('error'); return logMsg(`❌ Vui lòng xuất chiến Linh Thú trước khi dạy học!`, "text-rose-400"); }
                    p.inv[id]--;
                    if (!p.petPassives) p.petPassives = {};
                    if (!p.petPassives[targetId]) p.petPassives[targetId] = {};
                    p.petPassives[targetId][id] = (p.petPassives[targetId][id] || 0) + 1;
                    logMsg(`🐾 Linh Thú lĩnh ngộ Bị Động mới: ${item.name}!`, "text-emerald-300 font-bold");
                } else if (item.type === 'mount_passive_book') {
                    if (!targetId) { playSfx('error'); return logMsg(`❌ Vui lòng xuất chiến Tọa Kỵ trước khi dạy học!`, "text-rose-400"); }
                    p.inv[id]--;
                    if (!p.mountPassives) p.mountPassives = {};
                    if (!p.mountPassives[targetId]) p.mountPassives[targetId] = {};
                    p.mountPassives[targetId][id] = (p.mountPassives[targetId][id] || 0) + 1;
                    logMsg(`🐎 Tọa Kỵ lĩnh ngộ Bị Động mới: ${item.name}!`, "text-indigo-300 font-bold");
                }
                playSfx('lvlup');
            }
            else if (item.type === 'material') {
                if (item.sub === 'meridian') {
                    switchCharTab('meridian'); switchTab('char', document.querySelectorAll('.nav-btn')[1]);
                    logMsg(`Vào giao diện Kinh Mạch để sử dụng Kinh Mạch Đan.`, "text-rose-300");
                } else if (item.sub === 'breakthrough') {
                    switchCharTab('meridian'); switchTab('char', document.querySelectorAll('.nav-btn')[1]);
                    logMsg(`Vào giao diện Kinh Mạch để sử dụng Huyền Giám Đan.`, "text-fuchsia-300");
                }
            }
            updateUI(); renderInv(); renderPetList(); renderMountList();
        }

        function renderInv() {
            let grid = document.getElementById('inv-grid');
            grid.innerHTML = ''; 
            let hasItems = false;
            

            for (let id in p.inv) {
                if (p.inv[id] > 0) {
                    let item = DB_ITEMS[id];
                    if (!item) continue;
                    if (activeInvCategory !== 'all') {
                        if (activeInvCategory === 'weapon' && item.type !== 'weapon') continue;
                        if (activeInvCategory === 'talisman' && item.type !== 'talisman') continue;
                        if (activeInvCategory === 'armor' && item.type !== 'armor') continue;
                        if (activeInvCategory === 'cloth' && item.type !== 'cloth') continue;
                        if (activeInvCategory === 'helmet' && item.type !== 'helmet') continue;
                        if (activeInvCategory === 'glove' && item.type !== 'glove') continue;
                        if (activeInvCategory === 'boots' && item.type !== 'boots') continue;
                        if (activeInvCategory === 'pet' && item.type !== 'pet') continue;
                        if (activeInvCategory === 'mount' && item.type !== 'mount') continue;
                        if (activeInvCategory === 'consumable' && (item.type !== 'consumable' && item.type !== 'material')) continue;
                        if (activeInvCategory === 'skill_book' && item.type !== 'skill_book') continue;
                        if (activeInvCategory === 'pet_item' && item.type !== 'pet_item') continue;
                        if (activeInvCategory === 'pet_book' && !['pet_skill_book', 'pet_passive_book', 'mount_passive_book'].includes(item.type)) continue;
                    }

                    hasItems = true; 
                    let isEq = (p.equip.weapon === id || p.equip.talisman === id || p.equip.armor === id || p.equip.cloth === id || p.equip.helmet === id || p.equip.glove === id || p.equip.boots === id); 
                    let isConsumableAction = ['consumable', 'skill_book', 'material', 'pet_item', 'pet_skill_book', 'pet_passive_book', 'mount_passive_book'].includes(item.type);
                    let color = item.tierClass || (item.type==='weapon' ? 'text-cyan-300' : (item.type.includes('book') ? 'text-fuchsia-300' : 'text-purple-300')); 
                    let isLocked = !canUseItemByRealm(item, p.lv) || (item.reqLv && p.lv < item.reqLv);
                    let enhStr = '';
                    
                    if (item.type === 'weapon' || item.type === 'talisman') {
                        let enhLv = (p.enhanceLevels && p.enhanceLevels[id]) || 0;
                        if (enhLv > 0) enhStr = ` <span class="text-amber-400 drop-shadow ml-1">+${enhLv}</span>`;
                    }
                    
                    let imgHtml = `<div class="flex justify-center mb-1">${getItemImageHtml(id, item)}</div>`;

                    grid.innerHTML += `<div class="item-card ${isEq ? 'equipped' : ''} ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : (isConsumableAction ? `useItem('${id}')` : `equipItem('${id}')`)}">
                        ${imgHtml}
                        <div class="font-bold text-[11px] ${color} drop-shadow-md leading-tight mb-1 text-center">${item.name}${enhStr}</div>
                        <div class="text-[9px] text-slate-400 flex-1 text-center">${item.desc}</div>
                        <div class="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
                            ${isLocked ? `<div class="text-[8px] text-rose-400 font-bold bg-rose-900/30 px-1 py-0.5 rounded text-center">Cần Lv ${formatNum(item.reqLv)}</div>` : ''}
                            <div class="flex justify-between items-center"><span class="text-[10px] font-bold text-amber-400">SL: ${p.inv[id]}</span> <span class="text-[9px] ${isEq ? 'bg-amber-600 text-white' : isConsumableAction ? 'bg-emerald-700/80' : 'bg-slate-700'} px-1.5 py-1 rounded font-semibold">${isEq ? 'Đang mặc' : isConsumableAction ? (item.type==='material'?'Sử dụng':'Dùng') : 'Mặc'}</span></div>
                        </div>
                    </div>`;
                }
            }
            if(!hasItems) grid.innerHTML = `<div class="col-span-full text-center text-[10px] text-slate-500 py-6 bg-black/20 rounded border border-white/5 border-dashed">Danh mục này hiện không có vật phẩm.</div>`;
        }

        function renderPetList() {
            ensureCompanionState();
            let grid = document.getElementById('pet-grid');
            let countEl = document.getElementById('pet-count');
            if (!grid) return;
            if (countEl) countEl.innerText = `${p.pets.length} con`;
            grid.innerHTML = '';
            if(p.pets.length === 0) return grid.innerHTML = `<div class="col-span-full text-center text-[10px] text-slate-500 py-6 bg-black/20 rounded border border-white/5 border-dashed">Chưa thu phục linh thú.</div>`;
            p.pets.forEach(id => {
                let item = DB_ITEMS[id]; let isEq = p.equip.pet === id; let pLevel = (p.petLevels && p.petLevels[id]) || 1; let isLocked = !canUseItemByRealm(item, p.lv) || (item.reqLv && p.lv < item.reqLv);
                let petEnh = getPetEnhanceLevel(id); let petStar = getPetStarLevel(id);
                let imgHtml = `<div class="flex justify-center mb-1">${getItemImageHtml(id, item, "w-12 h-12 object-cover rounded shadow-sm border border-white/20 anim-float")}</div>`;
                
                let passivesHtml = '';
                if (p.petPassives && p.petPassives[id]) {
                    passivesHtml += `<div class="w-full h-px bg-white/10 my-1"></div><div class="text-[8px] text-cyan-300 font-bold w-full text-left">Bị Động:</div>`;
                    for(let pId in p.petPassives[id]) {
                        let pItem = DB_ITEMS[pId];
                        if (pItem) passivesHtml += `<div class="text-[8px] text-emerald-300 w-full text-left truncate flex justify-between"><span>${pItem.name.split(':')[1] || pItem.name}</span> <span class="text-white">Lv.${p.petPassives[id][pId]}</span></div>`;
                    }
                }

                grid.innerHTML += `<div class="item-card ${isEq ? 'equipped' : ''} ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `equipItem('${id}')`}">
                    ${imgHtml}
                    <div class="font-bold text-[11px] ${item.tierClass} drop-shadow-md mb-0.5 text-center">${item.name}</div>
                    <div class="text-[9px] text-amber-300 text-center font-bold mb-1 shadow-sm bg-black/50 rounded py-0.5 border border-amber-900/50">Cấp: ${pLevel} • +${petEnh} • ${getStarText(petStar)}</div>
                    <div class="text-[9px] text-slate-400 bg-black/30 p-1.5 rounded flex-1 text-center border border-white/5 shadow-inner flex flex-col items-center gap-1">
                        <span class="text-emerald-400 font-bold block">+${formatNum(item.atk)} ATK | +${formatNum(item.hp)} HP</span>
                        <span>Kỹ năng: ${item.skill.name}</span>
                        ${passivesHtml}
                    </div>
                    <div class="mt-2 pt-1 border-t border-white/10 flex flex-col gap-1">
                        ${isLocked ? `<div class="text-[8px] text-rose-400 font-bold bg-rose-900/30 px-1 py-0.5 rounded text-center w-full">Cần Lv ${formatNum(item.reqLv)}</div>` : ''}
                        <div class="grid grid-cols-2 gap-1">
                            <button onclick="event.stopPropagation(); refineCompanion('pet', '${id}')" class="text-[8px] bg-emerald-900/80 px-1 py-1 rounded font-bold text-emerald-100">Cường Hóa</button>
                            <button onclick="event.stopPropagation(); upgradeCompanionStar('pet', '${id}')" class="text-[8px] bg-fuchsia-900/80 px-1 py-1 rounded font-bold text-fuchsia-100">Nâng Sao</button>
                        </div>
                        <span class="text-[9px] block w-full text-center ${isEq ? 'bg-amber-600 text-white' : 'bg-emerald-700/80'} px-2 py-1 rounded font-semibold">${isEq ? 'Thu Hồi' : 'Xuất Chiến'}</span>
                    </div>
                </div>`;
            });
        }

        function renderMountList() {
            ensureCompanionState();
            let grid = document.getElementById('mount-grid');
            let countEl = document.getElementById('mount-count');
            if (!grid) return;
            if (countEl) countEl.innerText = `${p.mounts.length} con`;
            grid.innerHTML = '';
            if(p.mounts.length === 0) return grid.innerHTML = `<div class="col-span-full text-center text-[10px] text-slate-500 py-6 bg-black/20 rounded border border-white/5 border-dashed">Chưa sở hữu thú cưỡi.</div>`;
            p.mounts.forEach(id => {
                let item = DB_ITEMS[id]; let isEq = p.equip.mount === id; let isLocked = !canUseItemByRealm(item, p.lv) || (item.reqLv && p.lv < item.reqLv);
                let mountEnh = getMountEnhanceLevel(id); let mountStar = getMountStarLevel(id);
                let imgHtml = `<div class="flex justify-center mb-1">${getItemImageHtml(id, item, "w-12 h-12 object-cover rounded shadow-sm border border-white/20 anim-float")}</div>`;
                
                let passivesHtml = '';
                if (p.mountPassives && p.mountPassives[id]) {
                    passivesHtml += `<div class="w-full h-px bg-white/10 my-1"></div><div class="text-[8px] text-cyan-300 font-bold w-full text-left">Bị Động:</div>`;
                    for(let pId in p.mountPassives[id]) {
                        let pItem = DB_ITEMS[pId];
                        if (pItem) passivesHtml += `<div class="text-[8px] text-indigo-300 w-full text-left truncate flex justify-between"><span>${pItem.name.split(':')[1] || pItem.name}</span> <span class="text-white">Lv.${p.mountPassives[id][pId]}</span></div>`;
                    }
                }

                grid.innerHTML += `<div class="item-card ${isEq ? 'equipped' : ''} ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `equipItem('${id}')`}">
                    ${imgHtml}
                    <div class="font-bold text-[11px] ${item.tierClass || 'text-indigo-400'} drop-shadow-md mb-1 text-center">${item.name}</div>
                    <div class="text-[9px] text-amber-300 text-center font-bold mb-1 shadow-sm bg-black/50 rounded py-0.5 border border-amber-900/50">+${mountEnh} • ${getStarText(mountStar)}</div>
                    <div class="text-[9px] text-slate-400 bg-black/30 p-1 rounded flex-1 flex flex-col items-center">
                        <span class="mb-1">${item.desc}</span>
                        ${passivesHtml}
                    </div>
                    <div class="mt-2 pt-1 border-t border-white/10 flex flex-col gap-1">
                        ${isLocked ? `<div class="text-[8px] text-rose-400 font-bold bg-rose-900/30 px-1 py-0.5 rounded text-center w-full">Cần Lv ${formatNum(item.reqLv)}</div>` : ''}
                        <div class="grid grid-cols-2 gap-1">
                            <button onclick="event.stopPropagation(); refineCompanion('mount', '${id}')" class="text-[8px] bg-indigo-900/80 px-1 py-1 rounded font-bold text-indigo-100">Cường Hóa</button>
                            <button onclick="event.stopPropagation(); upgradeCompanionStar('mount', '${id}')" class="text-[8px] bg-fuchsia-900/80 px-1 py-1 rounded font-bold text-fuchsia-100">Nâng Sao</button>
                        </div>
                        <span class="text-[9px] block w-full text-center ${isEq ? 'bg-amber-600 text-white' : 'bg-indigo-700/80'} px-2 py-1 rounded font-semibold">${isEq ? 'Xuống Ngựa' : 'Cưỡi'}</span>
                    </div>
                </div>`;
            });
        }

        function changeShopCategory(catId) { playSfx('click'); activeShopCategory = catId; renderShop(); }
        
        function renderShop() {
            let catContainer = document.getElementById('shop-categories');
            let container = document.getElementById('shop-container');
            if (!catContainer || !container) return; 

            if (typeof activeShopCategory === 'undefined') {
                window.activeShopCategory = 'skill_book'; 
            }

            const categories = [
                { id: 'skill_book', title: "📚 Tàng Kinh", types: ["skill_book"], color: "text-fuchsia-400", border: "border-fuchsia-500/50", bgActive: "bg-fuchsia-900/50" },
                { id: 'consumable', title: "💊 Tiên Đan", types: ["consumable", "material"], color: "text-rose-400", border: "border-rose-500/50", bgActive: "bg-rose-900/50" },
                { id: 'weapon', title: "⚔️ Khí Cụ", types: ["weapon"], color: "text-cyan-400", border: "border-cyan-500/50", bgActive: "bg-cyan-900/50" },
                { id: 'talisman', title: "📜 Bùa Chú", types: ["talisman"], color: "text-purple-400", border: "border-purple-500/50", bgActive: "bg-purple-900/50" },
                { id: 'armor', title: "🛡️ Giáp", types: ["armor"], color: "text-amber-400", border: "border-amber-500/50", bgActive: "bg-amber-900/50" },
                { id: 'cloth', title: "🧥 Áo", types: ["cloth"], color: "text-emerald-400", border: "border-emerald-500/50", bgActive: "bg-emerald-900/50" },
                { id: 'helmet', title: "👑 Nón", types: ["helmet"], color: "text-fuchsia-400", border: "border-fuchsia-500/50", bgActive: "bg-fuchsia-900/50" },
                { id: 'glove', title: "🧤 Tay", types: ["glove"], color: "text-sky-400", border: "border-sky-500/50", bgActive: "bg-sky-900/50" },
                { id: 'boots', title: "🥾 Giày", types: ["boots"], color: "text-indigo-400", border: "border-indigo-500/50", bgActive: "bg-indigo-900/50" },
                { id: 'pet', title: "🐣 Trứng Thú", types: ["pet"], color: "text-emerald-400", border: "border-emerald-500/50", bgActive: "bg-emerald-900/50" },
                { id: 'mount', title: "🐎 Tọa Kỵ", types: ["mount"], color: "text-indigo-400", border: "border-indigo-500/50", bgActive: "bg-indigo-900/50" },
                { id: 'pet_item', title: "✨ Tiên Thú Đan", types: ["pet_item", "pet_skill_book", "pet_passive_book", "mount_passive_book"], color: "text-cyan-400", border: "border-cyan-500/50", bgActive: "bg-cyan-900/50" }
            ];
            
            catContainer.innerHTML = categories.map(cat => `<button onclick="changeShopCategory('${cat.id}')" class="shrink-0 px-3 py-1.5 rounded-full border ${cat.id === activeShopCategory ? `${cat.border} ${cat.bgActive} ${cat.color} drop-shadow-md` : 'border-slate-700 bg-slate-800/50 text-slate-400'} text-[10px] font-bold transition-all">${cat.title}</button>`).join('');
            
            let activeCat = categories.find(c => c.id === activeShopCategory);
            if (!activeCat) {
                activeShopCategory = categories[0].id;
                activeCat = categories[0];
            }
            
            let uniqueItemsMap = new Map();
            
            let highestLevel = p.highestLv || p.lv || 1; 

            for(let id in DB_ITEMS) {
                let item = DB_ITEMS[id];
                if(activeCat.types.includes(item.type)) {
                    let isOwned = (item.type === 'pet' && p.pets && p.pets.includes(id)) || 
                                  (item.type === 'mount' && p.mounts && p.mounts.includes(id)) || 
                                  (item.type === 'skill_book' && p.learnedSkills && p.learnedSkills.includes(id));
                    
                    if (!isOwned && item.reqLv) {
                        if (!canUseItemByRealm(item, p.lv)) continue;
                        if (item.reqLv > highestLevel + 50000 || item.reqLv < highestLevel - 30000) continue;
                    }

                    let nameKey = item.name;

                    if (!uniqueItemsMap.has(nameKey)) {
                        uniqueItemsMap.set(nameKey, { id: id, item: item, isOwned: isOwned });
                    } else {
                        let existingEntry = uniqueItemsMap.get(nameKey);
                        let existingItem = existingEntry.item;
                        
                        if (isOwned && !existingEntry.isOwned) {
                            uniqueItemsMap.set(nameKey, { id: id, item: item, isOwned: isOwned });
                        } 
                        else if (isOwned === existingEntry.isOwned) {
                            let canBuyNew = item.reqLv <= highestLevel;
                            let canBuyExisting = existingItem.reqLv <= highestLevel;

                            if (canBuyNew && !canBuyExisting) {
                                uniqueItemsMap.set(nameKey, { id: id, item: item, isOwned: isOwned });
                            }
                            else if (canBuyNew && canBuyExisting) {
                                if (item.reqLv > existingItem.reqLv) {
                                    uniqueItemsMap.set(nameKey, { id: id, item: item, isOwned: isOwned });
                                }
                            }
                            else if (!canBuyNew && !canBuyExisting) {
                                if (item.reqLv < existingItem.reqLv) {
                                    uniqueItemsMap.set(nameKey, { id: id, item: item, isOwned: isOwned });
                                }
                            }
                        }
                    }
                }
            }

            let itemsHtml = '';
            let sortedItems = Array.from(uniqueItemsMap.values()).sort((a, b) => (a.item.reqLv || 0) - (b.item.reqLv || 0));

            sortedItems.forEach(entry => {
                let id = entry.id;
                let item = entry.item;
                let isOwned = entry.isOwned;

                let lockColor = (item.reqLv && highestLevel < item.reqLv) ? 'opacity-60 grayscale' : '';
                let btnText = isOwned ? 'Đã có' : (item.type.includes('book') ? 'Lĩnh ngộ' : 'Mua');
                
                let imgHtml = getItemImageHtml(id, item, "w-10 h-10 object-cover rounded shadow-sm border border-white/20 mr-2 shrink-0");

                itemsHtml += `<div class="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between items-center group ${lockColor}">
                    ${imgHtml}
                    <div class="flex-1 pr-1 min-w-0">
                        <div class="font-bold text-[10px] ${item.tierClass || (item.type.includes('book') ? 'text-fuchsia-300' : 'text-slate-200')} truncate">${item.name}</div>
                        <div class="text-[8px] text-slate-400 mt-0.5 leading-tight line-clamp-2">${item.desc}</div>
                    </div>
                    <button onclick="promptBuyQuantity('${id}')" ${isOwned ? 'disabled' : ''} class="${isOwned ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-b from-amber-600/30 to-amber-900/60 text-amber-400 border border-amber-600/50 active:scale-95'} px-2 py-1.5 rounded text-[9px] font-bold whitespace-nowrap btn-action shadow-sm min-w-[50px] text-center ml-2 transition-transform shrink-0">
                        <div class="mb-0.5">${btnText}</div>
                        <div class="text-[7px] text-amber-200 font-normal">${isOwned ? '' : formatNum(item.price) + ' LT'}</div>
                    </button>
                </div>`;
            });

            if(itemsHtml === '') itemsHtml = `<div class="text-center text-slate-500 py-4 text-[10px]">Chưa có vật phẩm phù hợp ở cảnh giới hiện tại.</div>`;
            document.getElementById('shop-container').innerHTML = `<div class="glass-panel p-2 rounded-xl border border-white/5 animate-[fadeIn_0.2s_ease]"><div class="grid grid-cols-1 gap-1.5 content-start auto-rows-max">${itemsHtml}</div></div>`;
        }
        
        function promptBuyQuantity(id) {
            const item = DB_ITEMS[id];
            if (!item) return;
            showDialog({
                title: `Mua ${item.name}`,
                msg: `Nhập số lượng muốn mua (1 - 9999):`,
                type: 'prompt',
                defaultInput: '1'
            }).then(value => {
                if (value === false || value === null || value === '') return;
                const qty = Number.parseInt(value, 10);
                if (!Number.isInteger(qty) || qty < 1 || qty > 9999) {
                    playSfx('error');
                    logMsg('❌ Số lượng mua không hợp lệ. Chỉ được nhập từ 1 đến 9999.', 'text-rose-400');
                    return;
                }
                buyItem(id, qty);
            });
        }

        async function buyItem(id, quantity = 1) {
            let item = DB_ITEMS[id];
            if (!item) return;
            const qty = Math.max(1, Math.min(9999, Math.floor(Number(quantity) || 1)));
            if (!canUseItemByRealm(item, p.lv)) { playSfx('error'); return logMsg(`❌ Cảnh giới hiện tại không thể mua loại đồ này.`, "text-rose-400"); }
            if (item.reqLv && p.lv < item.reqLv) { playSfx('error'); return logMsg(`❌ Chưa đủ cảnh giới để mua! Cần Lv ${formatNum(item.reqLv)}`, "text-rose-400"); }
            const totalCost = item.price * qty;
            if (p.coins >= totalCost) {
                p.coins -= totalCost;
                if (item.type === 'skill_book') {
                    if (p.learnedSkills.includes(id)) {
                        playSfx('error');
                        return logMsg(`❌ Bạn đã lĩnh ngộ ${item.name} rồi.`, "text-rose-400");
                    }
                    p.learnedSkills.push(id);
                    playSfx('lvlup');
                    logMsg(`Đã lĩnh ngộ: ${item.name}`, "text-fuchsia-300");
                }
                else if (item.type === 'pet') {
                    if (!p.pets.includes(id)) p.pets.push(id);
                    playSfx('lvlup'); logMsg(`Mua thành công trứng linh thú: ${item.name}`, "text-emerald-300");
                }
                else if (item.type === 'mount') {
                    if (!p.mounts.includes(id)) p.mounts.push(id);
                    playSfx('lvlup'); logMsg(`Thu phục tọa kỵ: ${item.name}`, "text-indigo-300");
                }
                else if (['pet_item', 'pet_skill_book', 'pet_passive_book', 'mount_passive_book'].includes(item.type)) {
                    p.inv[id] = (p.inv[id] || 0) + qty;
                    playSfx('buy');
                    logMsg(`Đã mua ${formatNum(qty)} ${item.name} cho linh thú / tọa kỵ.`, "text-cyan-300");
                }
                else {
                    p.inv[id] = (p.inv[id] || 0) + qty;
                    playSfx('buy');
                    logMsg(`Đã mua ${formatNum(qty)} ${item.name} với tổng ${formatNum(totalCost)} LT.`, "text-amber-300");
                }
                
                updateUI(); renderShop(); renderPetList(); renderMountList();
            } else { playSfx('error'); logMsg(`❌ Không đủ Linh Thạch! Cần ${formatNum(totalCost)} LT cho ${formatNum(qty)} món.`, "text-rose-400"); }
        }

        function renderMapList() {
            let grid = document.getElementById('map-grid'); grid.innerHTML = ''; let renderCount = 0;
            DB_MAPS.forEach((map, index) => {
                let unlocked = p.highestLv >= map.minLv;
                if (!unlocked) renderCount++; if (renderCount > 10) return; 
                let isCurrent = p.mapId === index;
                
                let baseTierName = GEN_TIERS[map.baseTier] ? GEN_TIERS[map.baseTier].n : "Chưa Rõ";
                let bossTierName = GEN_TIERS[Math.min(GEN_TIERS.length - 1, map.baseTier + 1)] ? GEN_TIERS[Math.min(GEN_TIERS.length - 1, map.baseTier + 1)].n : "Chưa Rõ";
                
                grid.innerHTML += `<div class="item-card ${!unlocked ? 'locked' : ''} ${isCurrent ? 'ring-1 ring-cyan-500 bg-cyan-950/40' : ''}" onclick="${unlocked ? `changeMap(${index})` : `alertMapLocked(${map.minLv})`}">
                    <div class="font-bold text-[11px] ${unlocked ? 'text-amber-300' : 'text-slate-400'} drop-shadow-md mb-1">${map.name}</div>
                    <div class="flex-1 flex flex-col gap-1.5">
                        <div class="text-[9px] text-slate-400">Yêu cầu: Lv ${formatNum(map.minLv)} <span class="text-white opacity-80">(${getRealmInfo(map.minLv).name})</span></div>
                        <div class="text-[8px] text-slate-400 bg-black/40 p-1.5 rounded border border-white/5 leading-tight">Quái: <span class="text-slate-300">${map.mobs.join(", ")}</span></div>
                        <div class="text-[8px] text-rose-300 bg-rose-950/20 p-1.5 rounded border border-rose-900/30 leading-tight">Boss: <span class="text-rose-400 font-bold">${map.boss}</span></div>
                        <div class="text-[8px] text-fuchsia-300 bg-fuchsia-950/20 p-1.5 rounded border border-fuchsia-900/30 leading-tight">Rớt: <span class="text-fuchsia-400 font-bold">${baseTierName}</span> <span class="text-white opacity-60">(Boss: ${bossTierName})</span></div>
                    </div>
                    <div class="mt-2 pt-2 border-t border-white/10 flex items-center justify-center shrink-0">
                        ${isCurrent ? `<span class="text-[9px] text-cyan-300 font-bold bg-cyan-900/50 px-2 py-1 rounded shadow-sm w-full text-center">📍 Đang ở đây</span>` : ''}
                        ${!unlocked ? `<span class="text-[9px] text-rose-400 bg-rose-900/30 px-2 py-1 rounded w-full text-center">🔒 Khóa</span>` : ''}
                        ${unlocked && !isCurrent ? `<span class="text-[9px] text-slate-300 bg-slate-700/80 hover:bg-slate-600 px-2 py-1 rounded w-full text-center transition-colors">Đến đây</span>` : ''}
                    </div>
                </div>`;
            });
        }
        
        function alertMapLocked(lv) {
            playSfx('error');
            logMsg(`❌ Cảnh giới chưa đủ! Yêu cầu Level ${formatNum(lv)} để vào map này.`, "text-rose-400");
        }

        function changeMap(id) {
            playSfx('click');
            if(p.mapId !== id) {
                p.mapId = id; logMsg(`Đã di chuyển tới: ${DB_MAPS[id].name}`, "text-cyan-300 font-bold");
                updateUI();
                renderMapList();
            }
        }

        function renderTower() {
            let floor = p.towerFloor || 1;
            document.getElementById('tower-current-floor').innerText = formatNum(floor);
            
            let floorStats = getBaseStats(floor);
            let recAtk = floorStats.atk * 1.5;
            let recDef = floorStats.def * 1.5;
            let expReward = Math.floor(getMaxExp(floor) * 0.1);
            
            document.getElementById('tower-boss-name').innerText = "Tháp Ma Tầng " + formatNum(floor);
            document.getElementById('tower-rec-atk').innerText = formatNum(recAtk);
            document.getElementById('tower-rec-def').innerText = formatNum(recDef);
            document.getElementById('tower-reward-preview').innerText = formatNum(expReward) + " EXP";

            let manualBtnText = document.getElementById('manual-tower-text');
            if (manualBtnText) manualBtnText.innerText = "Đánh Tầng " + formatNum(floor);
        }
