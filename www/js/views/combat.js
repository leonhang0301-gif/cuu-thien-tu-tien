const TPL_COMBAT = `<div id="view-combat" class="tab-content active flex-col min-h-full relative pb-4">
                    <div id="map-bg" class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen transition-all duration-1000" style="background-image: url('https://images.unsplash.com/photo-1543158181-e6f496752194?q=80&w=800');"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                    
                    <div class="text-center pt-3 relative z-10">
                        <span id="ui-map-name" class="px-5 py-1.5 glass-panel border-white/20 text-cyan-300 text-xs font-bold tracking-widest rounded-full shadow-[0_0_15px_rgba(8,145,178,0.6)] backdrop-blur-md">Thanh Vân Thôn</span>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
                        <div class="relative flex items-center justify-center gap-2 sm:gap-4">
                            <div id="player-char" class="w-40 h-40 sm:w-48 sm:h-48 anim-meditate relative transition-transform duration-300 battle-attack">
                                <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/80 rounded-[100%] blur-[3px]"></div>
                                
                                <div id="player-fx" class="absolute inset-0 z-50 pointer-events-none hidden items-center justify-center">
                                    <svg viewBox="0 0 100 100" class="w-[150%] h-[150%] text-cyan-300 opacity-60">
                                        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="2" stroke-dasharray="10 20" fill="none" class="animate-spin" style="animation-duration: 2s;"/>
                                    </svg>
                                </div>

                                <div class="relative w-full h-full flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] z-0 pointer-events-none">
                                        <defs>
                                            <filter id="glowLight"><feGaussianBlur stdDeviation="1.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                                            <filter id="strongGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                                        </defs>
                                        <!-- Outer pulsing ring -->
                                        <circle cx="50" cy="50" r="49" fill="none" stroke="#0891b2" stroke-width="0.5" class="anim-aura" />
                                        <!-- Dashed rotating ring -->
                                        <circle cx="50" cy="50" r="46" fill="none" stroke="#22d3ee" stroke-width="1.5" class="animate-[spin_8s_linear_infinite]" stroke-dasharray="6 4" filter="url(#glowLight)"/>
                                        <!-- Inner fast reverse rotating ring -->
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#38bdf8" stroke-width="1.2" class="animate-[spin_5s_linear_infinite_reverse] opacity-80" stroke-dasharray="15 10" filter="url(#strongGlow)"/>
                                        <!-- Complex inner dots -->
                                        <circle cx="50" cy="50" r="38" fill="none" stroke="#e0f2fe" stroke-width="2.5" class="animate-[spin_12s_linear_infinite] opacity-60" stroke-dasharray="1 15" filter="url(#glowLight)"/>
                                    </svg>
                                    <img src="assets/images/cultivator.jpg" id="meditate-img" class="w-[85%] h-[85%] object-cover rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] border-2 border-cyan-400/50 relative z-10 anim-float">
                                </div>
                                <div id="player-dmg-text" class="dmg-text text-cyan-300 text-2xl sm:text-3xl"></div>
                            </div>
                        </div>

                        <div id="world-boss-ui" class="hidden w-full max-w-xs mx-auto glass-panel rounded-2xl border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)] p-2 text-center backdrop-blur-md">
                            <div class="text-[10px] font-bold text-amber-300 uppercase tracking-[0.25em]">Boss Thế Giới</div>
                            <div class="flex justify-center mt-2 mb-1">
                                <img src="assets/images/boss.jpg" id="world-boss-img" class="w-24 h-24 object-cover rounded-lg border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)] anim-breathe">
                            </div>
                            <div class="text-[11px] text-slate-200 mt-1" id="world-boss-name">Boss Thế Giới</div>
                            <div class="mt-2 flex items-center justify-between text-[10px] text-amber-100">
                                <span>HP</span>
                                <span id="world-boss-hp-text">0</span>
                            </div>
                            <div class="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div id="world-boss-hp-bar" class="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300" style="width: 100%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="px-2 mt-auto shrink-0 relative z-10 pb-2">
                        <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                            <button onclick="openMeditateModal()" class="btn-action relative overflow-hidden py-3 px-1 rounded-xl shadow-[0_4px_15px_rgba(79,70,229,0.5)] flex flex-col items-center justify-center gap-1 group border border-indigo-400/60">
                                <div class="absolute inset-0 bg-[url('assets/images/btn_breakthrough.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/50 to-transparent group-hover:opacity-80 transition-opacity"></div>
                                <span class="relative z-10 text-lg sm:text-xl drop-shadow-md">🌟</span>
                                <span class="relative z-10 font-bold text-[9px] sm:text-[10px] text-indigo-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider">Đột Phá</span>
                            </button>
                            <button onclick="toggleAutoExplore()" id="btn-auto-explore" class="btn-action relative overflow-hidden py-3 px-1 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center gap-1 group border border-blue-400/60 transition-all">
                                <div class="absolute inset-0 bg-[url('assets/images/btn_explore.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/50 to-transparent group-hover:opacity-80 transition-opacity" id="explore-overlay"></div>
                                <span class="relative z-10 text-lg sm:text-xl drop-shadow-md" id="explore-icon">🚶</span>
                                <span class="relative z-10 font-bold text-[9px] sm:text-[10px] text-blue-50 text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider" id="explore-text">Auto<br>Lịch Luyện</span>
                            </button>
                            <button onclick="toggleAutoWorldBoss()" id="btn-world-boss" class="btn-action btn-combat-lock relative overflow-hidden py-3 px-1 rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center gap-1 group border border-amber-400/60 transition-all">
                                <div class="absolute inset-0 bg-[url('assets/images/btn_boss.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-900/50 to-transparent group-hover:opacity-80 transition-opacity" id="boss-overlay"></div>
                                <span class="relative z-10 text-lg sm:text-xl drop-shadow-md">👹</span>
                                <span class="relative z-10 font-bold text-[9px] sm:text-[10px] text-amber-50 text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider">Boss<br>Thế Giới</span>
                            </button>
                            <button onclick="actionFightDemon()" id="btn-demon" class="btn-action btn-combat-lock relative overflow-hidden py-3 px-1 rounded-xl shadow-[0_4px_15px_rgba(225,29,72,0.5)] flex flex-col items-center justify-center gap-1 group border border-rose-400/60">
                                <div class="absolute inset-0 bg-[url('assets/images/btn_demon.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-900/50 to-transparent group-hover:opacity-80 transition-opacity"></div>
                                <span class="relative z-10 text-lg sm:text-xl drop-shadow-md">👿</span>
                                <span class="relative z-10 font-bold text-[9px] sm:text-[10px] text-rose-50 text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider">Vượt<br>Tâm Ma</span>
                            </button>
                        </div>
                    </div>
                </div>`;
