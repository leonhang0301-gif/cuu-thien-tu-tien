const TPL_CHAR = `<div id="view-char" class="tab-content flex-col h-auto min-h-full p-4 space-y-4">
                    <div class="flex border-b border-white/10 pb-2 gap-4">
                        <button onclick="switchCharTab('info')" id="btn-char-info" class="text-base font-bold text-cyan-400 flex items-center gap-2 border-b-2 border-cyan-400 pb-1 transition-colors"><span class="text-xl">📜</span> Thông Tin</button>
                        <button onclick="switchCharTab('meridian')" id="btn-char-meridian" class="text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"><span class="text-xl">🌌</span> Kinh Mạch</button>
                    </div>
                    
                    <div id="char-info-container" class="space-y-4 flex flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="flex justify-center mb-2">
                            <div class="relative w-28 h-28 rounded-full border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden">
                                <img src="assets/images/avatar.jpg" alt="Avatar" class="w-full h-full object-cover anim-breathe">
                            </div>
                        </div>
                        <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                            <h3 class="font-bold text-amber-300 mb-3 text-xs flex items-center justify-between"><span class="flex items-center gap-2"><span class="text-sm">📊</span> Thuộc Tính Căn Bản</span> <span class="text-cyan-300 font-mono bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800" id="ui-sp-display">SP: 0</span></h3>
                            <ul class="space-y-2 text-[11px] text-slate-300" id="char-stats-list"></ul>
                        </div>
                        <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                            <h3 class="font-bold text-emerald-300 mb-3 text-xs flex items-center justify-between"><span class="flex items-center gap-2"><span class="text-sm">🧠</span> Phân Bổ Thuộc Tính</span> <span class="text-emerald-300 font-mono bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800" id="ui-attr-display">Điểm: 0</span></h3>
                            <div class="space-y-2" id="char-attr-list"></div>
                        </div>
                        <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                            <h3 class="font-bold text-purple-400 mb-3 text-xs flex items-center gap-2"><span class="text-sm">🛡️</span> Đang Mặc</h3>
                            <div class="space-y-2" id="char-equip-list"></div>
                        </div>
                        <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                            <h3 class="font-bold text-fuchsia-400 mb-3 text-xs flex items-center gap-2"><span class="text-sm">💊</span> Đan Dược Căn Bản (Đã Nuốt)</h3>
                            <div class="space-y-1 text-[10px] text-slate-300" id="char-pills-list"></div>
                        </div>
                        <div class="glass-panel p-3.5 rounded-xl border border-white/5 shadow-lg">
                            <h3 class="font-bold text-sky-400 mb-3 text-xs flex items-center gap-2"><span class="text-sm">✨</span> Kỹ Năng & Bí Cấp</h3>
                            <div class="space-y-2 text-[11px]" id="char-skills-list"></div>
                        </div>
                    </div>

                    <div id="char-meridian-container" class="space-y-4 hidden flex-col animate-[fadeIn_0.3s_ease]">
                        <!-- Render via JS -->
                    </div>
                </div>`;
