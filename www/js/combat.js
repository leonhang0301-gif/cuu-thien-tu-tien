const ELEMENTS = ['kim', 'moc', 'thuy', 'hoa', 'tho'];
const ELEMENT_NAMES = { kim: 'Kim', moc: 'Mộc', thuy: 'Thủy', hoa: 'Hỏa', tho: 'Thổ' };

function getPlayerStrongestElement() {
    let maxLv = 0; let maxEl = 'kim';
    if (!p.roots) return maxEl;
    for (let e of ELEMENTS) {
        if ((p.roots[e] || 0) >= maxLv) { maxLv = p.roots[e] || 0; maxEl = e; }
    }
    return maxEl;
}

function getElementalMultiplier(atkEl, defEl) {
    if (atkEl === defEl) return 1.0;
    if ((atkEl === 'kim' && defEl === 'moc') ||
        (atkEl === 'moc' && defEl === 'tho') ||
        (atkEl === 'tho' && defEl === 'thuy') ||
        (atkEl === 'thuy' && defEl === 'hoa') ||
        (atkEl === 'hoa' && defEl === 'kim')) {
        return 1.2;
    }
    return 0.8;
}

function toggleAutoTower() {playSfx('click');
            if (isBreakthroughActive()) return logMsg("❌ Đang đột phá cảnh giới, không thể leo tháp!", "text-cyan-400 font-bold");
            
            isAutoTower = !isAutoTower;
            let btnAuto = document.getElementById('btn-auto-tower');
            
            if (isAutoTower) {
                if (isAutoExploring) toggleAutoExplore(); 
                btnAuto.classList.remove('bg-gradient-to-r', 'from-red-800');
                btnAuto.classList.add('bg-red-800', 'ring-2', 'ring-red-400');
                document.getElementById('auto-tower-icon').innerText = "⏳";
                document.getElementById('auto-tower-text').innerText = "Đang Auto...";
                logMsg("🗼 Bắt đầu Auto Trấn Yêu Tháp...", "text-amber-400 font-bold");
                runAutoTowerLoop(); 
                syncOfflineAutoState();
            } else {
                btnAuto.classList.add('bg-gradient-to-r', 'from-red-800');
                btnAuto.classList.remove('bg-red-800', 'ring-2', 'ring-red-400');
                document.getElementById('auto-tower-icon').innerText = "🤖";
                document.getElementById('auto-tower-text').innerText = "Auto Leo Tháp";
                logMsg("🛑 Đã dừng Auto Leo Tháp.", "text-slate-400");
                if (autoTowerInterval) clearTimeout(autoTowerInterval);
                syncOfflineAutoState();
            }
        }

        async function runAutoTowerLoop() {
            if (!isAutoTower) return;
            if (isBreakthroughActive()) { 
                if (isAutoTower) toggleAutoTower(); 
                return; 
            }
            if (p.hp <= 0) {
                logMsg("🛑 Auto Leo Tháp tự động ngắt do trọng thương!", "text-rose-400 font-bold");
                if (isAutoTower) toggleAutoTower();
                return;
            } 
            if (!isCombat) {
                let success = await fightTower(true);
                if (!isAutoTower) return; 
                if (!success) {
                    if (isAutoTower) toggleAutoTower(); 
                    return;
                }
            }
            if (!isAutoTower) return; 
            autoTowerInterval = setTimeout(runAutoTowerLoop, 2500); 
        }

        async function fightTower(isAuto = false) {
            if (isCombat || checkDeath()) return false;
            if (isBreakthroughActive()) {
                if(!isAuto) logMsg("❌ Đang đột phá cảnh giới, không thể leo tháp!", "text-cyan-400 font-bold");
                return false;
            }
            if (isAutoExploring) toggleAutoExplore(); 
            
            isCombat = true; toggleButtons(true);
            
            let floor = p.towerFloor || 1;
            if (floor > 99999) {
                logMsg("🏆 Ngài đã vượt qua đỉnh cao nhất của Trấn Yêu Tháp!", "text-amber-400 font-bold");
                endCombat(); 
                return false;
            }

            let tStats = getTotalStats();
            let floorStats = getBaseStats(floor);
            let bossAtk = floorStats.atk * 1.5;
            let bossDef = floorStats.def * 1.5;
            let bossHp = floorStats.hp * 2;
            
            let enemyElem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
            let playerElem = getPlayerStrongestElement();
            let pMult = getElementalMultiplier(playerElem, enemyElem);
            let eMult = getElementalMultiplier(enemyElem, playerElem);
            
            let bossName = `Tháp Ma Tầng ${floor} [Hệ ${ELEMENT_NAMES[enemyElem]}]`;
            await simulateBossEncounterVisuals(bossName, true);
            
            let effects = getCombatSkillEffects();
            let playerDmg = Math.max(1, Math.floor(tStats.atk * pMult) - bossDef);
            if (Math.random() < tStats.crit) playerDmg *= 2;
            if (effects.tranChance > 0 && Math.random() < effects.tranChance) {
                playerDmg = Math.max(1, Math.floor(playerDmg * (1 + effects.tranDamage)));
            }
            
            let bossDmg = Math.max(1, Math.floor(bossAtk * eMult) - tStats.def);
            if (Math.random() < tStats.dodge) bossDmg = 0;
            
            let turnsToKillBoss = Math.ceil(bossHp / playerDmg);
            let totalDmgTaken = bossDmg * turnsToKillBoss;
            
            p.hp -= totalDmgTaken;
            let success = false;
            
            if (p.hp > 0) {
                success = true;
                let expGain = Math.max(1, Math.floor(calculateTowerExpGain(floor, p.lv) * tStats.expRate));
                let coinGain = Math.floor(floor * 500);
                
                let resGain = floor * 15;
                p.wood += resGain; p.herb += resGain; p.iron += resGain;

                const reward = grantCombatRewards(expGain, coinGain);
                const primalGain = reward.primalGain;
                const tuviGain = reward.tuviGain;
                p.towerFloor++;
                let stealMsg = applyHitLifeSteal(playerDmg * turnsToKillBoss);
                let restoreMsg = applyKillRestore();
                
                let dropMsg = `(+${formatNum(resGain)} M/T/Th). `;
                if (restoreMsg) dropMsg += `${restoreMsg} `;
                if (stealMsg) dropMsg += `${stealMsg} `;
                
                if(Math.random() < 0.5 + (tStats.luck * 0.05)) {
                    let kmdAmount = Math.floor(Math.random()*15) + 5 + Math.floor(floor/10);
                    p.inv['kmd'] = (p.inv['kmd'] || 0) + kmdAmount;
                    dropMsg += `🎁 +${kmdAmount} K.Mạch Đan! `;
                }
                if(Math.random() < 0.2 + (tStats.luck * 0.05)) {
                    p.inv['hgd'] = (p.inv['hgd'] || 0) + 1;
                    dropMsg += `🔥 +1 H.Giám Đan! `;
                }

                let dropTier = Math.min(9, Math.floor(floor / 30)); 
                let dropChance = 0.3 * tStats.luck;
                
                if (Math.random() < dropChance) {
                    let possibleDrops = Object.keys(DB_ITEMS).filter(k => {
                        let item = DB_ITEMS[k];
                        return item.tierIdx !== undefined && Math.abs(item.tierIdx - dropTier) <= 1 && !item.type.includes('book') && item.type !== 'pet' && item.type !== 'mount';
                    });
                    
                    if (possibleDrops.length > 0) {
                        let dropItem = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
                        p.inv[dropItem] = (p.inv[dropItem] || 0) + 1;
                        dropMsg += `✨ Rớt: ${DB_ITEMS[dropItem].name}!`;
                    }
                }
                
                logMsg(`🗼 [VƯỢT THÁP] Tầng ${floor}: Trảm sát [${bossName}]. Chịu ${formatNum(totalDmgTaken)} ST. (+${formatNum(expGain)} EXP, +${formatNum(coinGain)} LT, +${formatNum(primalGain)} CN, +${formatNum(tuviGain)} TV). ${dropMsg}`, "text-rose-400 font-bold");
                playSfx('lvlup');
            } else {
                logMsg(`🗼 [THẤT BẠI] [${bossName}] quá mạnh! Bị đánh trọng thương (Chịu ${formatNum(totalDmgTaken)} ST).`, "text-red-500 font-bold");
                playSfx('hurt');
            }
            
            endCombat();
            renderTower();
            return success;
        }

        function toggleAutoExplore() {
            playSfx('click');
            if (isBreakthroughActive()) return logMsg("❌ Đang đột phá cảnh giới, không thể phân tâm ngự kiếm lịch luyện!", "text-cyan-400 font-bold");
            
            isAutoExploring = !isAutoExploring;
            let btnAuto = document.getElementById('btn-auto-explore');
            
            if (isAutoExploring) {
                if (autoExploreInterval) clearTimeout(autoExploreInterval);
                if (isAutoTower) toggleAutoTower(); 
                btnAuto.classList.add('ring-2', 'ring-blue-400', 'bg-blue-800');
                document.getElementById('explore-text').innerHTML = "Đang<br>Auto";
                logMsg("⚔️ Đạo hữu xuất khiếu, ngự kiếm bắt đầu Auto Lịch Luyện...", "text-blue-400 font-bold");
                runAutoExploreLoop(); 
                syncOfflineAutoState();
            } else {
                btnAuto.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-800');
                document.getElementById('explore-text').innerHTML = "Auto<br>Lịch Luyện";
                logMsg("🛑 Đã thu hồi phi kiếm, dừng Lịch Luyện.", "text-slate-400");
                if (autoExploreInterval) clearTimeout(autoExploreInterval);
                autoExploreInterval = null;
                syncOfflineAutoState();
            }
        }

        async function runAutoExploreLoop() {
            if (!isAutoExploring) return;
            if (isBreakthroughActive()) { if(isAutoExploring) toggleAutoExplore(); return; }
            if (p.hp <= 0) {
                if (isAutoExploring) toggleAutoExplore();
                return; 
            } 
            if (!isCombat) {
                await actionExploreMap();
                if (!isAutoExploring) return; // Khoá an toàn
            }
            if (!isAutoExploring) return;
            autoExploreInterval = setTimeout(runAutoExploreLoop, 3000); 
        }

        async function actionExploreMap() {
            if (isCombat || checkDeath()) return;

            // --- THÊM: KỲ NGỘ ---
            if (Math.random() < 0.05) {
                let eventRoll = Math.random();
                if (eventRoll < 0.33) {
                    let tv = Math.max(10, p.lv * 100); let cn = Math.max(5, p.lv * 50);
                    p.tuvi += tv; p.primal += cn;
                    logMsg(`✨ KỲ NGỘ: Đạo hữu gặp cao nhân truyền công! Nhận ${formatNum(tv)} Tu Vị và ${formatNum(cn)} Chân Nguyên.`, "text-fuchsia-400 font-bold");
                } else if (eventRoll < 0.66) {
                    let res = Math.max(5, p.lv * 20);
                    p.wood += res; p.herb += res; p.iron += res;
                    logMsg(`🌿 KỲ NGỘ: Vô tình phát hiện Động Phủ bí mật! Nhận ${formatNum(res)} Mộc, Thảo, Thiết.`, "text-emerald-400 font-bold");
                } else {
                    let pills = ['hp1', 'mp1'];
                    let drop = pills[Math.floor(Math.random() * pills.length)];
                    p.inv[drop] = (p.inv[drop] || 0) + 1;
                    logMsg(`🎁 KỲ NGỘ: Nhặt được bảo vật rơi vãi: ${DB_ITEMS[drop].name}!`, "text-amber-400 font-bold");
                }
                return;
            }

            isCombat = true; toggleButtons(true);
            let map = DB_MAPS[p.mapId]; let tStats = getTotalStats();
            let mapLevelBias = 1 + Math.max(0, map.minLv - 1) / 1200;
            let bossRoll = Math.random();
            let encounterType = bossRoll < 0.72 ? 'mob' : bossRoll < 0.9 ? 'elite' : 'golden';
            let bossPool = Array.isArray(map.bosses) && map.bosses.length ? map.bosses : [map.boss];
            
            let enemyElem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
            let playerElem = getPlayerStrongestElement();
            let pMult = getElementalMultiplier(playerElem, enemyElem);
            let eMult = getElementalMultiplier(enemyElem, playerElem);
            
            let mobName = (encounterType === 'mob' ? map.mobs[Math.floor(Math.random() * map.mobs.length)] : bossPool[Math.floor(Math.random() * bossPool.length)]) + ` [Hệ ${ELEMENT_NAMES[enemyElem]}]`;
            let bossScale = encounterType === 'golden' ? 3.3 : encounterType === 'elite' ? 2.2 : 1;
            let mapMultiplier = (p.mapId + 1) * 1.5;
            let mobAtk = tStats.atk * (0.18 + Math.random() * 0.22) * mapLevelBias * bossScale;
            let effects = getCombatSkillEffects();
            let tranMsg = '';

            if (encounterType !== 'mob') {
                simulateSlashVisuals("CHÉM BOSS!", "text-amber-400");
                playSfx('boss');
            } else {
                simulateSlashVisuals("Trảm!", "text-cyan-300");
            }
            await sleep(400);

            let isBossEncounter = encounterType !== 'mob';
            let isDodge = Math.random() < tStats.dodge;
            let dmgTaken = isDodge ? 0 : Math.max(0, Math.floor((mobAtk * eMult - tStats.def) * (0.55 + Math.random() * 0.45)));
            let dmgDealt = Math.max(1, Math.floor(tStats.atk * pMult * (0.85 + Math.random() * 0.25) * (mapLevelBias * (encounterType === 'golden' ? 1.25 : encounterType === 'elite' ? 1.1 : 1))));
            if (effects.tranChance > 0 && Math.random() < effects.tranChance) {
                dmgDealt = Math.max(1, Math.floor(dmgDealt * (1 + effects.tranDamage)));
                tranMsg = ' [TRẤN]';
            }

            if (dmgTaken > 0) p.hp -= dmgTaken;

            if (p.hp > 0) {
                let stealMsg = applyHitLifeSteal(dmgDealt);
                let restoreMsg = applyKillRestore();
                let expGain = Math.max(1, Math.floor(calculateMapExpGain(map, isBossEncounter, p.lv) * tStats.expRate));
                let coinGain = Math.floor((Math.floor(p.lv * mapMultiplier) + Math.floor(Math.random() * (10 * mapMultiplier))) * (isBossEncounter ? 6 : 1));
                const reward = grantCombatRewards(expGain, coinGain);
                const primalGain = reward.primalGain;
                const tuviGain = reward.tuviGain;
                let dropMsg = "";
                if (restoreMsg) dropMsg += ` ${restoreMsg}`;
                if (stealMsg) dropMsg += ` ${stealMsg}`;

                let dropChance = (isBossEncounter ? 0.35 : 0.08) + (p.mapId * 0.005) * tStats.luck;
                if (isBossEncounter) {
                    p.inv['kmd'] = (p.inv['kmd'] || 0) + Math.floor(Math.random() * 5) + 3;
                    if (Math.random() < 0.45) { p.inv['hgd'] = (p.inv['hgd'] || 0) + 1; dropMsg += "🔥 Nhận Huyền Giám Đan! "; }
                } else {
                    if (Math.random() < 0.2) p.inv['kmd'] = (p.inv['kmd'] || 0) + Math.floor(Math.random() * 2) + 1;
                }

                if (Math.random() < dropChance) {
                    let isHigherTier = false;
                    let dPool = map.dropPool;
                    if (isBossEncounter && Math.random() < 0.4) {
                        dPool = map.bossDropPool;
                        isHigherTier = true;
                    }
                    if (!dPool || dPool.length === 0) dPool = map.dropPool;
                    let dropItem = dPool[Math.floor(Math.random() * dPool.length)] || 'hp1';
                    if (!DB_ITEMS[dropItem]) dropItem = 'hp1';
                    p.inv[dropItem] = (p.inv[dropItem] || 0) + 1; 
                    dropMsg += `🎁 Nhặt được ${DB_ITEMS[dropItem].name}${isHigherTier ? ' (Vượt Cấp)' : ''}!`;
                }
                
                let dmgStr = dmgTaken > 0 ? `Bị phản phệ ${formatNum(dmgTaken)} HP.` : `Hoàn toàn né tránh.`;
                if (isBossEncounter) {
                    logMsg(`👹 [${encounterType.toUpperCase()} BOSS] Hạ gục [${mobName}]! ${dmgStr}${tranMsg} (+${formatNum(expGain)} EXP, +${coinGain} LT, +${formatNum(primalGain)} CN, +${formatNum(tuviGain)} TV).${dropMsg}`, "text-amber-300 font-bold");
                } else {
                    logMsg(`⚔️ Ngự kiếm trảm [${mobName}]. ${dmgStr}${tranMsg} (+${formatNum(expGain)} EXP, +${coinGain} LT, +${formatNum(primalGain)} CN, +${formatNum(tuviGain)} TV).${dropMsg}`, "text-cyan-300");
                }
            }
            endCombat();
        }

        function toggleAutoWorldBoss() {
            playSfx('click');
            if (isBreakthroughActive()) return logMsg("❌ Đang đột phá cảnh giới, không thể khiêu chiến Boss!", "text-cyan-400 font-bold");
            
            isAutoWorldBoss = !isAutoWorldBoss;
            let btnAuto = document.getElementById('btn-world-boss');
            
            if (isAutoWorldBoss) {
                if (isAutoExploring) toggleAutoExplore(); 
                if (isAutoTower) toggleAutoTower();
                btnAuto.classList.add('ring-2', 'ring-amber-400', 'bg-amber-800');
                btnAuto.querySelector('span:last-child').innerHTML = "Đang<br>Đánh Boss";
                logMsg("👹 Bắt đầu tự động khiêu chiến Boss Thế Giới...", "text-amber-400 font-bold");
                runAutoWorldBossLoop(); 
            } else {
                btnAuto.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-800');
                btnAuto.querySelector('span:last-child').innerHTML = "Boss<br>Thế Giới";
                logMsg("🛑 Đã dừng khiêu chiến Boss.", "text-slate-400");
                if (autoWorldBossInterval) clearTimeout(autoWorldBossInterval);
                autoWorldBossInterval = null;
                document.getElementById('world-boss-ui').classList.add('hidden');
                window.offlineBoss = null;
            }
        }

        async function runAutoWorldBossLoop() {
            if (!isAutoWorldBoss) return;
            if (isBreakthroughActive() || p.hp <= 0) { 
                if (isAutoWorldBoss) toggleAutoWorldBoss(); 
                return; 
            }
            if (!isCombat) {
                await actionFightWorldBoss();
            }
            if (!isAutoWorldBoss) return;
            if (!window.offlineBoss || window.offlineBoss.hp <= 0) {
                if (isAutoWorldBoss) toggleAutoWorldBoss();
                return;
            }
            autoWorldBossInterval = setTimeout(runAutoWorldBossLoop, 2500); 
        }

        async function actionFightWorldBoss() {
            if (isCombat || checkDeath()) return;
            if (isAutoExploring) toggleAutoExplore();

            isCombat = true;
            toggleButtons(true);

            const playerStats = getTotalStats();
            let isOffline = (typeof socket === 'undefined' || socket.readyState !== WebSocket.OPEN);

            if (!isOffline) {
                socket.send(JSON.stringify({
                    type: 'attackBoss',
                    payload: {
                        atk: playerStats.atk,
                        crit: playerStats.crit,
                        name: p.name || 'Vô Danh'
                    }
                }));
                await simulateBossEncounterVisuals("Khiêu Chiến Boss", false);
                logMsg("👹 Gửi lời khiêu chiến đến Boss Thế Giới qua Thiên Đạo...", "text-amber-300");
            } else {
                if (!window.offlineBoss) {
                    let bossHpStr = 50000000 * (1 + p.lv/1000);
                    window.offlineBoss = { hp: bossHpStr, maxHp: bossHpStr, name: "Ma Thần Hỗn Độn (Offline)" };
                    await simulateBossEncounterVisuals(window.offlineBoss.name, false);
                } else {
                    simulateSlashVisuals("CHÉM BOSS!", "text-amber-400");
                    await sleep(400);
                }
                
                let dmg = Math.floor(playerStats.atk * (Math.random() < playerStats.crit ? 2 : 1) * (1 + Math.random() * 0.2));
                window.offlineBoss.hp = Math.max(0, window.offlineBoss.hp - dmg);
                renderWorldBossUI({ currentHp: window.offlineBoss.hp, maxHp: window.offlineBoss.maxHp, name: window.offlineBoss.name });
                
                let coinGain = Math.max(1, Math.floor(dmg * 0.05));
                let primalGain = Math.max(1, Math.floor(dmg * 0.001));
                p.coins += coinGain; p.primal += primalGain;
                
                logMsg(`👹 [OFFLINE] Gây ${formatNum(dmg)} ST lên ${window.offlineBoss.name}! Nhận ${formatNum(coinGain)} LT, ${formatNum(primalGain)} CN.`, "text-amber-300 font-bold");
                if (window.offlineBoss.hp <= 0) {
                    logMsg(`🏆 Đã tiêu diệt Boss Thế Giới Offline! Nhận phần thưởng khổng lồ.`, "text-amber-400 font-extrabold");
                    p.tuvi += Math.max(1000, p.lv * 100); p.wood += p.lv * 20; p.herb += p.lv * 20; p.iron += p.lv * 20;
                    window.offlineBoss = null;
                    document.getElementById('world-boss-ui').classList.add('hidden');
                }
            }
            endCombat();
        }

        async function actionFightDemon() {
            if (isCombat || checkDeath()) return;
            if (isBreakthroughActive()) return logMsg("❌ Đang đột phá cảnh giới, không thể khiêu chiến Tâm Ma!", "text-cyan-400 font-bold");
            if (isAutoExploring) toggleAutoExplore(); 
            isCombat = true; toggleButtons(true);
            
            let tStats = getTotalStats();
            let bossNames = ["Tâm Ma Dục Vọng", "Tâm Ma Phẫn Nộ", "Tâm Ma Chấp Niệm", "Huyễn Ảnh Tiền Kiếp", "Chướng Khí Cửu U"];
            let bossName = bossNames[new Date().getDay() % bossNames.length];
            
            await simulateBossEncounterVisuals(bossName, true);
            logMsg(`☠️ Bắt đầu trận chiến sinh tử với [${bossName}]!`, "text-rose-400 font-bold");

            let demonHp = tStats.hp * 2;
            let demonAtk = tStats.hp * 0.25;
            let effects = getCombatSkillEffects();
            let turnCount = 0;
            let totalDmgDealt = 0;

            while (demonHp > 0 && p.hp > 0 && turnCount < 15) {
                turnCount++;
                await sleep(500);
                
                // Player attacks
                let isCrit = Math.random() < tStats.crit;
                let dmgDealt = Math.floor(tStats.atk * (isCrit ? 2 : 1) * (1 + Math.random() * 0.2)); 
                if (effects.tranChance > 0 && Math.random() < effects.tranChance) {
                    dmgDealt = Math.max(1, Math.floor(dmgDealt * (1 + effects.tranDamage)));
                }
                demonHp -= dmgDealt;
                totalDmgDealt += dmgDealt;
                simulateSlashVisuals(`-${formatNum(dmgDealt)}`, isCrit ? "text-amber-400" : "text-white");
                
                if (demonHp <= 0) break;
                
                await sleep(500);
                
                // Demon attacks
                let isDodge = Math.random() < tStats.dodge;
                let dmgTaken = isDodge ? 0 : Math.max(1, Math.floor(demonAtk - tStats.def)); 
                p.hp -= dmgTaken;
                
                let uiPl = document.getElementById('player-char');
                uiPl.style.transform = "scale(0.9)";
                uiPl.style.filter = "brightness(0.5) drop-shadow(0 0 10px #ef4444)";
                playSfx('hurt');
                showDmg('player-dmg-text', `-${formatNum(dmgTaken)}`, isDodge ? "text-cyan-300" : "text-rose-500");
                
                setTimeout(() => { 
                    if (uiPl) {
                        uiPl.style.transform = "scale(1)"; 
                        uiPl.style.filter = `drop-shadow(0 0 20px ${getRealmAuraColor()}) brightness(1.15)`;
                    }
                }, 250);
                updateUI();
                if (p.hp <= 0) break;
            }
            
            if (p.hp > 0 && demonHp <= 0) {
                let stealMsg = applyHitLifeSteal(totalDmgDealt);
                let restoreMsg = applyKillRestore();
                let expGain = Math.max(1, Math.floor(Math.max(1, Math.floor(getMaxExp(p.lv) * 0.03)) * tStats.expRate));
                let coinGain = Math.max(p.lv * 100, Math.floor(totalDmgDealt * 0.05));
                const reward = grantCombatRewards(expGain, coinGain);
                const primalGain = reward.primalGain;
                const tuviGain = reward.tuviGain;

                p.inv['kmd'] = (p.inv['kmd'] || 0) + 15;
                p.inv['hgd'] = (p.inv['hgd'] || 0) + (Math.random() < 0.5 ? 2 : 1);

                let dropMsg = "💊 Thu được nhiều Kinh Mạch Đan & Huyền Giám Đan. "; 
                if (restoreMsg) dropMsg += `${restoreMsg} `;
                if (stealMsg) dropMsg += `${stealMsg} `;
                let dropChance = 0.8 * tStats.luck;
                if(Math.random() < dropChance) {
                    let map = DB_MAPS[p.mapId]; let pool = map.dropPool;
                    let dropItem = pool[Math.floor(Math.random() * pool.length)]; p.inv[dropItem] = (p.inv[dropItem] || 0) + 1; 
                    dropMsg += `🎁 Phá giải, nhận được: ${DB_ITEMS[dropItem].name}!`; playSfx('lvlup');
                }
                logMsg(`☠️ [VƯỢT TÂM MA] Trấn áp thành công [${bossName}] sau ${turnCount} hiệp! (+${formatNum(expGain)} EXP, +${coinGain} LT, +${formatNum(primalGain)} CN, +${formatNum(tuviGain)} TV). ${dropMsg}`, "text-rose-400 font-bold");
            } else if (p.hp <= 0) {
                logMsg(`☠️ Bị [${bossName}] cắn nuốt! Thất bại vượt tâm ma.`, "text-red-500 font-bold");
            } else {
                logMsg(`☠️ [HÒA] Trận chiến kéo dài quá 15 hiệp, tâm ma tạm thời rút lui!`, "text-amber-400 font-bold");
            }
            endCombat();
        }

        function toggleButtons(disabled) { document.querySelectorAll('.btn-combat-lock').forEach(btn => btn.disabled = disabled); }
        function endCombat() { isCombat = false; toggleButtons(false); checkDeath(); updateUI(); }

        function showDmg(elId, txt, colorClass = "") {
            let el = document.getElementById(elId); el.innerText = txt;
            if(colorClass) el.className = `dmg-text ${colorClass} text-xl sm:text-2xl anim-dmg`;
            else { el.style.animation = 'none'; el.offsetHeight; el.style.animation = null; el.classList.add('anim-dmg'); }
            setTimeout(() => { el.classList.remove('anim-dmg'); }, 800);
        }

        function renderWorldBossUI(boss) {
            const bossUI = document.getElementById('world-boss-ui');
            if (!bossUI) return;
            const hpRatio = Math.max(0, Math.min(100, (boss.currentHp / Math.max(1, boss.maxHp)) * 100));
            document.getElementById('world-boss-name').innerText = boss.name || 'Boss Thế Giới';
            document.getElementById('world-boss-hp-text').innerText = `${formatNum(boss.currentHp)} / ${formatNum(boss.maxHp)}`;
            document.getElementById('world-boss-hp-bar').style.width = `${hpRatio}%`;
            bossUI.classList.remove('hidden');
        }

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        function simulateSlashVisuals(text, color) {
            let uiPl = document.getElementById('player-char'); let fxPl = document.getElementById('player-fx');
            uiPl.classList.remove('anim-meditate'); uiPl.classList.add('battle-attack');
            uiPl.style.transform = "scale(1.12) rotate(4deg)";
            uiPl.style.filter = `brightness(1.5) drop-shadow(0 0 30px ${getRealmAuraColor()})`;
            playSfx('hit'); 
            fxPl.style.display = 'flex'; fxPl.firstElementChild.classList.add('animate-ping');
            showDmg('player-dmg-text', text, color);

            // Spawn VFX chém
            let vfx = document.createElement('img');
            vfx.src = 'assets/images/vfx/slash.jpg';
            vfx.className = 'vfx-slash';
            uiPl.appendChild(vfx);
            setTimeout(() => { if (vfx.parentNode) vfx.parentNode.removeChild(vfx); }, 400);

            setTimeout(() => {
                uiPl.style.transform = "scale(1)"; uiPl.style.filter = `drop-shadow(0 0 20px ${getRealmAuraColor()}) brightness(1.15)`;
                uiPl.classList.remove('battle-attack'); uiPl.classList.add('anim-meditate');
                fxPl.style.display = 'none'; fxPl.firstElementChild.classList.remove('animate-ping');
            }, 400);
        }

        async function simulateBossEncounterVisuals(bossName, isDemon = false) {
            let uiPl = document.getElementById('player-char'); let fxPl = document.getElementById('player-fx');
            
            uiPl.classList.remove('anim-meditate');
            uiPl.style.transform = "scale(0.9) rotate(-3deg)";
            uiPl.style.filter = isDemon ? "brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5) drop-shadow(0 0 30px #ef4444)" : "brightness(0.5) drop-shadow(0 0 30px #f59e0b)";
            playSfx('hurt'); 
            
            fxPl.style.display = 'flex';
            fxPl.firstElementChild.classList.replace('text-cyan-300', isDemon ? 'text-rose-500' : 'text-amber-500');
            fxPl.firstElementChild.classList.add('animate-ping');
            
            // Spawn vòng phép hào quang
            let vfx = document.createElement('img');
            vfx.src = 'assets/images/vfx/magic_circle.jpg';
            vfx.className = 'vfx-magic-circle';
            uiPl.appendChild(vfx);
            setTimeout(() => { if (vfx.parentNode) vfx.parentNode.removeChild(vfx); }, 1200);

            showDmg('player-dmg-text', `${bossName.toUpperCase()} XUẤT HIỆN!`, isDemon ? "text-rose-500" : "text-amber-500");

            await sleep(500);
            
            uiPl.style.transform = "scale(1.2)";
            uiPl.style.filter = "brightness(1.8) drop-shadow(0 0 40px #0ea5e9)";
            playSfx('boss');
            showDmg('player-dmg-text', "THẦN PHẠT!", "text-cyan-300");
            
            await sleep(400);

            uiPl.style.transform = "scale(1)"; uiPl.style.filter = "";
            uiPl.classList.add('anim-meditate');
            fxPl.style.display = 'none'; 
            fxPl.firstElementChild.classList.remove('animate-ping');
            fxPl.firstElementChild.classList.replace(isDemon ? 'text-rose-500' : 'text-amber-500', 'text-cyan-300');
        }

        // Quá trình đột phá (tụ khí ~3s rồi mới roll kết quả) được điều khiển bởi
        // startBreakthrough/resolveBreakthrough trong ui.js. Interval này chỉ cộng
        // tài nguyên Động Phủ thụ động trong lúc chờ đột phá, không can thiệp vòng đời.
        setInterval(() => {
            const state = getBreakthroughState();
            if (state.active) {
                let now = Date.now(); let elapsedSecs = (now - state.lastTick) / 1000;
                if (elapsedSecs >= 1) {
                    p.wood += (p.estate.woodLv * 2);
                    p.herb += (p.estate.herbLv * 1);
                    p.iron += (p.estate.ironLv * 0.5);
                    state.lastTick = now;
                    p.meditation.active = true;
                    p.meditation.lastTick = now;
                    updateUI();
                    updateBreakthroughDisplay();
                }
            }
        }, 1000);
