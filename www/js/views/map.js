const TPL_MAP = `<div id="view-map" class="tab-content flex-col h-auto min-h-full p-4 space-y-4">
                    <div class="flex border-b border-white/10 pb-2 gap-4">
                        <button onclick="switchMapTab('map')" id="btn-map-tab" class="text-base font-bold text-orange-400 flex items-center gap-2 border-b-2 border-orange-400 pb-1 transition-colors"><span class="text-xl">🗺️</span> Cửu Thiên Giới</button>
                        <button onclick="switchMapTab('tower')" id="btn-tower-tab" class="text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"><span class="text-xl">🗼</span> Trấn Yêu Tháp</button>
                    </div>
                    
                    <div id="map-container" class="space-y-4 flex flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start auto-rows-max" id="map-grid"></div>
                    </div>

                    <!-- Giao diện Tháp -->
                    <div id="tower-container" class="space-y-4 hidden flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="glass-panel p-4 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center relative overflow-hidden">
                            <div class="absolute -right-4 -top-4 text-7xl opacity-10 pointer-events-none">🗼</div>
                            <h3 class="text-xl font-bold text-red-400 mb-2">Trấn Yêu Tháp <br> <span class="text-sm text-white">Tầng <span id="tower-current-floor">1</span></span></h3>
                            <div class="flex justify-center mb-2 relative z-10">
                                <img src="assets/images/monster.png" class="w-24 h-24 object-cover rounded-lg border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] anim-breathe" alt="Yêu Ma" onerror="this.src='assets/images/boss.jpg'">
                            </div>
                            <p class="text-[10px] text-slate-300 mb-4 leading-relaxed">Mỗi tầng tháp giam giữ yêu ma cường đại. Vượt tháp nhận EXP, Linh Thạch, Tài Nguyên Động Phủ và Tỷ lệ rơi trang bị cực cao. Độ khó tăng vô hạn!</p>
                            
                            <div class="bg-black/50 p-3 rounded-lg border border-white/10 mb-4 text-left space-y-1 relative z-10">
                                <div class="text-[11px] text-slate-400">Gợi ý thủ khuyển: <span id="tower-boss-name" class="text-rose-400 font-bold">Yêu Ma</span></div>
                                <div class="text-[11px] text-slate-400">Lực chiến đề cử: <span id="tower-rec-atk" class="text-cyan-300 font-mono">1,000</span></div>
                                <div class="text-[11px] text-slate-400">Phòng thủ đề cử: <span id="tower-rec-def" class="text-emerald-300 font-mono">1,000</span></div>
                                <div class="text-[11px] text-slate-400 mt-2 border-t border-white/5 pt-1">Thưởng cơ bản: <span id="tower-reward-preview" class="text-amber-300 font-mono">...</span></div>
                                <div class="text-[10px] text-fuchsia-300 italic">✨ Tỷ lệ rớt đồ và phẩm chất tăng mạnh theo tầng.</div>
                            </div>

                            <div class="flex gap-2 relative z-10">
                                <button onclick="fightTower(false)" class="flex-1 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-500/50 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span>⚔️</span> <span id="manual-tower-text">Đánh Tầng 1</span>
                                </button>
                                <button onclick="toggleAutoTower()" id="btn-auto-tower" class="flex-1 py-3 bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 border border-red-500/50 rounded-xl text-white font-bold shadow-[0_4px_15px_rgba(239,68,68,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span id="auto-tower-icon">🤖</span> <span id="auto-tower-text">Auto Leo Tháp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
