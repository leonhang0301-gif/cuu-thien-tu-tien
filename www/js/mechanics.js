function getBaseStats(lv) {let mult = getRealmInfo(lv).mult;
            const attrs = p && p.attributes ? p.attributes : { atk: 0, hp: 0, def: 0 };
            return {
                hp: (100 * lv * mult) + (attrs.hp || 0) * 30,
                mp: 50 + (lv * 10 * mult),
                atk: (10 * lv * mult) + (attrs.atk || 0) * 12,
                def: (lv * 5 * mult) + (attrs.def || 0) * 14
            };
        }

        function addAttribute(stat) {
            const key = ['atk', 'hp', 'def'].includes(stat) ? stat : 'atk';
            if ((p.attributePoints || 0) <= 0) {
                logMsg('❌ Không đủ Điểm Thuộc Tính để cộng thêm.', 'text-rose-400');
                return;
            }
            if (!p.attributes) p.attributes = { atk: 0, hp: 0, def: 0 };
            p.attributes[key] = (p.attributes[key] || 0) + 1;
            p.attributePoints -= 1;
            updateUI();
            logMsg(`➕ +1 ${key === 'atk' ? 'Lực Chiến' : key === 'hp' ? 'Sinh Lực' : 'Phòng Thủ'}!`, 'text-emerald-300 font-bold');
        }

        function removeAttribute(stat) {
            const key = ['atk', 'hp', 'def'].includes(stat) ? stat : 'atk';
            if (!p.attributes || (p.attributes[key] || 0) <= 0) {
                logMsg('❌ Không thể giảm thuộc tính thấp hơn 0.', 'text-rose-400');
                return;
            }
            p.attributes[key] -= 1;
            p.attributePoints += 1;
            updateUI();
            logMsg(`➖ -1 ${key === 'atk' ? 'Lực Chiến' : key === 'hp' ? 'Sinh Lực' : 'Phòng Thủ'}!`, 'text-amber-300 font-bold');
        }

        function getSectBonuses() {
            if (!p.sect || !p.sect.id || p.sect.id === 'none') return { hpBonus: 0, atkBonus: 0, crit: 0, dodge: 0, expRate: 1, luck: 1, resourceBonus: 1 };
            const sect = DB_SECTS.find(s => s.id === p.sect.id);
            if (!sect) return { hpBonus: 0, atkBonus: 0, crit: 0, dodge: 0, expRate: 1, luck: 1, resourceBonus: 1 };
            const bonus = sect.bonus || {};
            const rankIndex = getSectRankIndex(p.sect.rank);
            const rankMult = 1 + rankIndex * 0.03 + (p.sect.level - 1) * 0.01 + (p.sect.breakthrough || 0) * 0.02;
            return {
                hpBonus: Math.floor((bonus.hpBonus || 0) * rankMult),
                atkBonus: Math.floor((bonus.atkBonus || 0) * rankMult),
                crit: (bonus.crit || 0) + rankIndex * 0.005,
                dodge: (bonus.dodge || 0) + Math.min(0.02, rankIndex * 0.002),
                expRate: 1 + ((bonus.expRate || 0) * rankMult),
                luck: 1 + ((bonus.luck || 0) * rankMult),
                resourceBonus: 1 + ((bonus.resourceBonus || 0) * rankMult)
            };
        }

        function getMeridianStats() {
            let st = { hp: 0, atk: 0, def: 0, dodge: 0, crit: 0, hpM: 0, atkM: 0 };
            if(!p.meridians) return st;
            
            let mLevel = parseInt(p.meridians.level) || 0;
            let mNode = parseInt(p.meridians.node) || 0;

            for(let i=0; i<MERIDIANS.length; i++) {
                if (i < mLevel) {
                    for(let k in MERIDIANS[i].stat) st[k] += MERIDIANS[i].stat[k] * 10;
                } else if (i === mLevel) {
                    for(let k in MERIDIANS[i].stat) st[k] += MERIDIANS[i].stat[k] * mNode;
                }
            }
            return st;
        }

        function getTotalStats() {
            let base = getBaseStats(p.lv);
            let total = { hp: base.hp, mp: base.mp, atk: base.atk, def: base.def, hpBonus: 0, atkBonus: 0, crit: 0.05, dodge: 0.02, expRate: 1.0, luck: 1.0 }; 
            
            let mStats = getMeridianStats();
            total.hpBonus += mStats.hp; total.atkBonus += mStats.atk;
            total.def += mStats.def; total.dodge += mStats.dodge; total.crit += mStats.crit;

            for (let r in p.roots) {
                let lv = p.roots[r]; let def = DB_ROOTS[r];
                if (def.statKey === 'atk') total.atkBonus += (lv * def.valPerLv);
                if (def.statKey === 'hp') total.hpBonus += (lv * def.valPerLv);
                if (def.statKey === 'def') total.def += (lv * def.valPerLv);
                if (def.statKey === 'dodge') total.dodge += (lv * def.valPerLv);
                if (def.statKey === 'crit') total.crit += (lv * def.valPerLv);
            }

            if (p.pillsEaten) {
                for(let id in p.pillsEaten) {
                    let count = p.pillsEaten[id]; let item = DB_ITEMS[id];
                    if(item) { if(item.atk) total.atkBonus += item.atk * count; if(item.hp) total.hpBonus += item.hp * count; if(item.expR) total.expRate += item.expR * count; if(item.luckR) total.luck += item.luckR * count; }
                }
            }

            ['weapon', 'armor', 'cloth', 'helmet', 'glove', 'boots', 'pet', 'mount', 'talisman'].forEach(slot => {
                if (p.equip[slot] && DB_ITEMS[p.equip[slot]]) {
                    let itm = DB_ITEMS[p.equip[slot]];
                    let baseMult = 1;
                    let enhanceLevel = getEnhanceLevel(p.equip[slot]);
                    let starLevel = getStarLevel(p.equip[slot]);
                    if (slot === 'pet') {
                        let petLv = (p.petLevels[p.equip.pet] || 1);
                        let petEnh = getPetEnhanceLevel(p.equip.pet);
                        let petStar = getPetStarLevel(p.equip.pet);
                        baseMult = (1 + ((petLv - 1) * 0.1)) * (1 + (petEnh * 0.03)) * (1 + (petStar * 0.1));
                    } else if (slot === 'mount') {
                        let mountLv = (p.mountLevels[p.equip.mount] || 1);
                        let mountEnh = getMountEnhanceLevel(p.equip.mount);
                        let mountStar = getMountStarLevel(p.equip.mount);
                        baseMult = (1 + ((mountLv - 1) * 0.1)) * (1 + (mountEnh * 0.03)) * (1 + (mountStar * 0.1));
                    } else {
                        baseMult = (1 + (enhanceLevel * 0.05)) * (1 + (starLevel * 0.12));
                    }
                    if(itm.atk) total.atkBonus += Math.floor(itm.atk * baseMult);
                    if(itm.hp) total.hpBonus += Math.floor(itm.hp * baseMult);
                    if(itm.def) total.def += Math.floor(itm.def * baseMult);
                    if(itm.crit) total.crit += (itm.crit * baseMult);
                    if(itm.dodge) total.dodge += (itm.dodge * baseMult);
                }
            });
            total.atk += total.atkBonus; total.hp += total.hpBonus;

            let skillHpM = 1 + mStats.hpM; let skillAtkM = 1 + mStats.atkM;
            if (p.learnedSkills) {
                p.learnedSkills.forEach(id => {
                    let t = DB_ITEMS[id];
                    if (t) { 
                        let slv = p.skillLevels[id] || 1;
                        let m = 1 + ((slv - 1) * 0.02); 
                        if (t.hpM) skillHpM += (t.baseVal * m); 
                        if (t.atkM) skillAtkM += (t.baseVal * m); 
                        if (t.crit) total.crit += (t.baseVal * m); 
                        if (t.dodge) total.dodge += (t.baseVal * m); 
                    }
                });
            }
            
            ['talisman'].forEach(slot => {
                if (p.equip[slot] && DB_ITEMS[p.equip[slot]]) {
                    let t = DB_ITEMS[p.equip[slot]];
                    let enhMult = 1 + (getEnhanceLevel(p.equip[slot]) * 0.05);
                    let starMult = 1 + (getStarLevel(p.equip[slot]) * 0.12);
                    enhMult *= starMult;
                    if(t.hpM) skillHpM += ((t.hpM - 1) * enhMult); 
                    if(t.atkM) skillAtkM += ((t.atkM - 1) * enhMult);
                    if(t.crit) total.crit += (t.crit * enhMult); 
                    if(t.dodge) total.dodge += (t.dodge * enhMult);
                }
            });
            
            let natalMult = 1;
            if (p.natalWeapon && p.natalWeapon.unlocked) {
                natalMult += (p.natalWeapon.lv * 0.01);
            }

            let treeMult = 1;
            if (p.bodhiTree && p.bodhiTree.level > 0) {
                treeMult += (p.bodhiTree.level * 0.01);
                total.expRate += (p.bodhiTree.level * 0.01);
            }

            let clanBonuses = getClanBonuses();
            let sectBonuses = getSectBonuses();
            total.expRate += clanBonuses.expRate - 1;
            total.luck += clanBonuses.luck - 1;
            total.atkBonus += clanBonuses.atkBonus + sectBonuses.atkBonus;
            total.hpBonus += clanBonuses.hpBonus + sectBonuses.hpBonus;
            total.crit += sectBonuses.crit;
            total.dodge += sectBonuses.dodge;
            total.expRate += sectBonuses.expRate - 1;
            total.luck += sectBonuses.luck - 1;

            total.hp = Math.floor(total.hp * skillHpM * natalMult * treeMult); 
            total.atk = Math.floor(total.atk * skillAtkM * natalMult * treeMult);
            total.def = Math.floor(total.def * treeMult);
            total.dodge = Math.min(0.6, total.dodge); total.crit = Math.min(1.0, total.crit);
            return total;
        }

        function getCombatSkillEffects() {
            let effects = { killRestoreHp: 0, killRestoreMp: 0, hitHpSteal: 0, hitMpSteal: 0, tranChance: 0, tranDamage: 0 };
            if (!p.learnedSkills || !Array.isArray(p.learnedSkills)) return effects;
            p.learnedSkills.forEach(id => {
                const item = DB_ITEMS[id];
                if (!item) return;
                if (item.killRestoreHp) effects.killRestoreHp += item.killRestoreHp;
                if (item.killRestoreMp) effects.killRestoreMp += item.killRestoreMp;
                if (item.hitHpSteal) effects.hitHpSteal += item.hitHpSteal;
                if (item.hitMpSteal) effects.hitMpSteal += item.hitMpSteal;
                if (item.tranChance) effects.tranChance += item.tranChance;
                if (item.tranDamage) effects.tranDamage += item.tranDamage;
            });
            return effects;
        }

        function grantCombatRewards(expGain, coinGain) {
            expGain = Math.max(0, Math.floor(expGain || 0));
            coinGain = Math.max(0, Math.floor(coinGain || 0));
            const stage = getBreakthroughStageInfo(p.lv);
            const primalGain = Math.max(1, Math.floor(expGain * 0.03 + coinGain * 0.004 + stage.successRate * 1.2));
            const tuviGain = Math.max(1, Math.floor(expGain * 0.025 + coinGain * 0.0025 + stage.successRate * 0.8));
            p.exp += expGain;
            p.coins += coinGain;
            p.primal += primalGain;
            p.tuvi += tuviGain;
            return { primalGain, tuviGain };
        }

        function applyHitLifeSteal(dmgDealt) {
            if (!dmgDealt || dmgDealt <= 0) return '';
            const effects = getCombatSkillEffects();
            if (effects.hitHpSteal <= 0 && effects.hitMpSteal <= 0) return '';
            const stats = getTotalStats();
            const restoreHp = Math.floor(dmgDealt * effects.hitHpSteal);
            const restoreMp = Math.floor(dmgDealt * effects.hitMpSteal);
            let msg = '';
            if (restoreHp > 0) {
                p.hp = Math.min(stats.hp, p.hp + restoreHp);
                msg += ` +Hồi ${formatNum(restoreHp)} HP`;
            }
            if (restoreMp > 0) {
                p.mp = Math.min(stats.mp, p.mp + restoreMp);
                msg += ` +Hồi ${formatNum(restoreMp)} MP`;
            }
            return msg.trim();
        }

        function applyKillRestore() {
            const effects = getCombatSkillEffects();
            if (effects.killRestoreHp <= 0 && effects.killRestoreMp <= 0) return '';
            const stats = getTotalStats();
            const restoreHp = Math.floor(stats.hp * effects.killRestoreHp);
            const restoreMp = Math.floor(stats.mp * effects.killRestoreMp);
            let msg = '';
            if (restoreHp > 0) {
                p.hp = Math.min(stats.hp, p.hp + restoreHp);
                msg += ` +Hồi ${formatNum(restoreHp)} HP`;
            }
            if (restoreMp > 0) {
                p.mp = Math.min(stats.mp, p.mp + restoreMp);
                msg += ` +Hồi ${formatNum(restoreMp)} MP`;
            }
            return msg.trim();
        }

        function logMsg(msg, color = "text-slate-300") {
            const div = document.createElement('div');
            div.className = `border-b border-white/5 pb-1 mb-1 ${color} animate-[fadeIn_0.3s_ease] break-words`;
            div.innerHTML = `> ${msg}`;
            const logEl = document.getElementById('game-log');
            logEl.prepend(div);
            if (logEl.children.length > 50) logEl.removeChild(logEl.lastChild);
        }
        
        function formatTime(seconds) {
            let h = Math.floor(seconds / 3600); let m = Math.floor((seconds % 3600) / 60); let s = Math.floor(seconds % 60);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        function getRealmAuraColor(level = p.lv) {
            const realm = getRealmInfo(level);
            const map = {
                'Phàm Nhân': '#94a3b8',
                'Luyện Khí': '#4ade80',
                'Trúc Cơ': '#60a5fa',
                'Kết Đan': '#a855f7',
                'Nguyên Anh': '#f472b6',
                'Hóa Thần': '#fb923c',
                'Luyện Hư': '#2dd4bf',
                'Hợp Thể': '#818cf8',
                'Đại Thừa': '#fb7185',
                'Độ Kiếp': '#ef4444',
                'Chân Tiên': '#facc15',
                'Kim Tiên': '#fde68a',
                'Thái Ất': '#e879f9',
                'Đại La': '#c084fc',
                'Đạo Tổ': '#f59e0b'
            };
            return map[realm.name] || '#38bdf8';
        }

        function applyBattleAura() {
            const aura = getRealmAuraColor();
            const player = document.getElementById('player-char');
            const fx = document.getElementById('player-fx');
            if (player) {
                player.style.filter = `drop-shadow(0 0 20px ${aura}) brightness(1.15)`;
                player.style.boxShadow = `0 0 20px ${aura}55`;
            }
            if (fx && fx.firstElementChild) {
                fx.firstElementChild.style.color = aura;
            }
        }

        function renderBattleCompanions() {
            const wrap = document.getElementById('battle-companions');
            if (!wrap) return;
            wrap.innerHTML = '';
        }

        function autoUseRecoveryPills() {
            const tStats = getTotalStats();
            const lowHp = p.hp < tStats.hp * 0.30;
            const lowMp = p.mp < tStats.mp * 0.45;
            if (!lowHp && !lowMp) return;

            const candidates = Object.keys(p.inv).filter(id => p.inv[id] > 0 && DB_ITEMS[id] && DB_ITEMS[id].type === 'consumable' && ['hp', 'mp'].includes(DB_ITEMS[id].sub) && canUseItemByRealm(DB_ITEMS[id], p.lv));
            const pickBest = (sub) => candidates
                .filter(id => DB_ITEMS[id].sub === sub)
                .sort((a, b) => {
                    const A = DB_ITEMS[a], B = DB_ITEMS[b];
                    const reqA = A.reqLv || 1; const reqB = B.reqLv || 1;
                    const valA = (A.val || 0) + (A.tierIdx || 0) * 100; const valB = (B.val || 0) + (B.tierIdx || 0) * 100;
                    if (reqA !== reqB) return reqB - reqA;
                    return valB - valA;
                })[0];

            let attempts = 0;
            while (attempts < 4) {
                if (p.hp < tStats.hp * 0.30) {
                    const hpId = pickBest('hp');
                    if (!hpId) break;
                    useItem(hpId);
                }
                if (p.mp < tStats.mp * 0.45) {
                    const mpId = pickBest('mp');
                    if (!mpId) break;
                    useItem(mpId);
                }
                attempts++;
                if (p.hp >= tStats.hp * 0.30 && p.mp >= tStats.mp * 0.45) break;
            }
        }