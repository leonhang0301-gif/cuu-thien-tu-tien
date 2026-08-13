const TPL_DONGPHU = `<div id="view-dongphu" class="tab-content flex-col h-auto min-h-full p-4 space-y-4">
                    <div class="flex border-b border-white/10 pb-2 gap-2 sm:gap-4 flex-wrap">
                        <button onclick="switchDongPhuTab('base')" id="btn-dp-base" class="text-base font-bold text-teal-400 flex items-center gap-2 border-b-2 border-teal-400 pb-1 transition-colors"><span class="text-xl">🏡</span> Động Phủ</button>
                        <button onclick="switchDongPhuTab('tree')" id="btn-dp-tree" class="text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"><span class="text-xl">🌳</span> Bồ Đề Thụ</button>
                        <button onclick="switchDongPhuTab('clan')" id="btn-dp-clan" class="text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"><span class="text-xl">👨‍👩‍👧‍👦</span> Gia Tộc</button>
                        <button onclick="switchDongPhuTab('sect')" id="btn-dp-sect" class="text-base font-bold text-slate-500 flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"><span class="text-xl">🪷</span> Môn Phái</button>
                    </div>

                    <!-- Nội dung Động Phủ Cơ Bản -->
                    <div id="dp-base-container" class="space-y-4 flex flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="glass-panel p-3 rounded-xl border border-white/5 shadow-lg flex justify-between text-[10px]">
                             <div class="text-green-300 font-bold">🪵 Mộc: <span id="ui-wood" class="text-white">0</span></div>
                             <div class="text-emerald-300 font-bold">🌿 Thảo: <span id="ui-herb" class="text-white">0</span></div>
                             <div class="text-slate-300 font-bold">🪨 Thiết: <span id="ui-iron" class="text-white">0</span></div>
                        </div>

                        <div class="glass-panel p-3 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] space-y-2 mb-2 relative overflow-hidden">
                            <div class="absolute -right-4 -top-4 text-6xl opacity-10 blur-sm pointer-events-none">✨</div>
                            <h3 class="font-bold text-amber-400 text-xs mb-1 flex items-center gap-1"><span>🔮</span> Bản Mệnh Pháp Bảo</h3>
                            <div id="natal-weapon-content"></div>
                        </div>

                        <div class="glass-panel p-3 rounded-xl border border-white/5 shadow-lg space-y-2.5">
                            <h3 class="font-bold text-emerald-300 text-xs mb-1">Tụ Linh Trận (Sản Xuất Tự Động)</h3>
                            <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                                <div>
                                    <div class="text-[11px] text-green-400 font-bold">Linh Mộc Trận <span class="text-white text-[9px]">(Lv <span id="lvl-wood">1</span>)</span></div>
                                    <div class="text-[9px] text-slate-400">Sản lượng: +<span id="prod-wood">2</span>/s</div>
                                </div>
                                <button onclick="upgradeEstate('wood')" class="bg-green-900/80 hover:bg-green-800 text-green-100 px-2 py-1 rounded text-[9px] font-bold border border-green-500/50 shadow transition-colors">Nâng <span id="cost-wood" class="text-yellow-300 font-normal ml-1"></span></button>
                            </div>
                            <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                                <div>
                                    <div class="text-[11px] text-emerald-400 font-bold">Linh Thảo Trận <span class="text-white text-[9px]">(Lv <span id="lvl-herb">1</span>)</span></div>
                                    <div class="text-[9px] text-slate-400">Sản lượng: +<span id="prod-herb">1</span>/s</div>
                                </div>
                                <button onclick="upgradeEstate('herb')" class="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-2 py-1 rounded text-[9px] font-bold border border-emerald-500/50 shadow transition-colors">Nâng <span id="cost-herb" class="text-yellow-300 font-normal ml-1"></span></button>
                            </div>
                            <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                                <div>
                                    <div class="text-[11px] text-slate-300 font-bold">Huyền Thiết Trận <span class="text-white text-[9px]">(Lv <span id="lvl-iron">1</span>)</span></div>
                                    <div class="text-[9px] text-slate-400">Sản lượng: +<span id="prod-iron">0</span>/s</div>
                                </div>
                                <button onclick="upgradeEstate('iron')" class="bg-slate-700 hover:bg-slate-600 text-slate-100 px-2 py-1 rounded text-[9px] font-bold border border-slate-500/50 shadow transition-colors">Nâng <span id="cost-iron" class="text-yellow-300 font-normal ml-1"></span></button>
                            </div>
                        </div>

                        <div class="glass-panel p-3 rounded-xl border border-white/5 shadow-lg space-y-2.5">
                            <div class="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
                                <h3 class="font-bold text-rose-300 text-xs">🔥 Lô Đỉnh Luyện Hóa</h3>
                                <div class="text-[9px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">Cấp Đỉnh Lô: <span id="furnace-lv" class="text-white font-bold">1</span></div>
                            </div>
                            <p class="text-[9px] text-slate-400 mb-2 leading-tight">Dùng tài nguyên Động Phủ để luyện chế Tiên Đan và Khí Cụ.</p>
                            
                            <div class="flex justify-center mb-2">
                                <img src="assets/images/furnace.jpg" class="w-24 h-24 object-cover rounded shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-rose-900/50 anim-breathe">
                            </div>

                            <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-rose-900/30">
                                <div>
                                    <div class="text-[10px] text-rose-400 font-bold">Nâng Cấp Đỉnh Lô</div>
                                    <div class="text-[9px] text-slate-400">Tốn: <span id="furnace-cost" class="text-amber-300 font-mono">1K</span> Mộc, Thảo, Thiết</div>
                                </div>
                                <button onclick="upgradeFurnace()" class="bg-rose-900/80 hover:bg-rose-800 text-rose-100 px-3 py-1 rounded text-[9px] font-bold border border-rose-500/50 shadow transition-colors">Nâng Cấp</button>
                            </div>

                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <button onclick="craftItem('pill')" class="relative overflow-hidden py-3 px-2 rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-1 group border border-emerald-500/50 transition-all">
                                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 group-hover:scale-110 transition-transform duration-500"></div>
                                    <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                                    <span class="relative z-10 text-xl group-active:scale-90 transition-transform drop-shadow-md">💊</span>
                                    <span class="relative z-10 text-[10px] font-bold text-emerald-50 drop-shadow uppercase tracking-wider">Luyện Đan</span>
                                    <span class="relative z-10 text-[8px] text-emerald-300 text-center leading-tight bg-black/50 px-1 py-0.5 mt-0.5 rounded" id="craft-pill-cost">500 Thảo<br>300 Mộc</span>
                                </button>
                                <button onclick="craftItem('equip')" class="relative overflow-hidden py-3 px-2 rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center gap-1 group border border-cyan-500/50 transition-all">
                                    <div class="absolute inset-0 bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-800 group-hover:scale-110 transition-transform duration-500"></div>
                                    <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                                    <span class="relative z-10 text-xl group-active:scale-90 transition-transform drop-shadow-md">⚔️</span>
                                    <span class="relative z-10 text-[10px] font-bold text-cyan-50 drop-shadow uppercase tracking-wider">Luyện Khí</span>
                                    <span class="relative z-10 text-[8px] text-cyan-300 text-center leading-tight bg-black/50 px-1 py-0.5 mt-0.5 rounded" id="craft-equip-cost">500 Thiết<br>300 Mộc</span>
                                </button>
                            </div>
                        </div>

                        <div class="glass-panel p-3 rounded-xl border border-white/5 shadow-lg space-y-2 mb-4">
                            <div class="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
                                <h3 class="font-bold text-fuchsia-300 text-xs flex items-center gap-1"><span>🛠️</span> Tiên Đạo Lò Rèn</h3>
                            </div>
                            <p class="text-[9px] text-slate-400 mb-2 leading-tight">Tinh luyện (+N) và Thăng cấp trang bị đang mặc.</p>
                            <div id="forge-container" class="space-y-2"></div>
                        </div>

                        <div class="glass-panel p-3 rounded-xl border border-white/5 shadow-lg space-y-2 mb-4">
                            <h3 class="font-bold text-cyan-300 text-xs mb-1">Tẩy Tủy Linh Căn</h3>
                            <p class="text-[9px] text-slate-400 mb-2 leading-tight">Tiêu hao tài nguyên Động Phủ để đột phá Linh Căn, tăng vĩnh viễn thuộc tính.</p>
                            <div class="grid grid-cols-1 gap-2" id="roots-container"></div>
                        </div>
                    </div>

                    <!-- Nội dung Gia Tộc -->
                    <div id="dp-clan-container" class="hidden space-y-4 flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="glass-panel p-4 rounded-xl border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                            <h3 class="text-lg font-bold text-fuchsia-400 mb-2 flex items-center gap-2"><span>👨‍👩‍👧‍👦</span> Gia Tộc Tu Tiên</h3>
                            <p class="text-[10px] text-slate-300 leading-relaxed mb-3">Gia tộc giúp ngươi thu hút thân nhân, tăng cường EXP, cơ duyên và tài nguyên. Lập gia tộc, mời người nhà, nâng cấp để trở thành đại thế lực.</p>
                            <div id="clan-container"></div>
                        </div>
                    </div>

                    <!-- Nội dung Môn Phái -->
                    <div id="dp-sect-container" class="hidden space-y-4 flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="glass-panel p-4 rounded-xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <h3 class="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2"><span>🪷</span> Môn Phái Tu Tiên</h3>
                            <p class="text-[10px] text-slate-300 leading-relaxed mb-3">Từ phàm nhân đến đỉnh phong, mỗi môn phái mang một loại ưu thế riêng. Vào thử luyện, tuyển tông môn và nhận phẩm vị riêng cho bản thân.</p>
                            <div id="sect-status"></div>
                        </div>
                        <div id="sect-list" class="space-y-2"></div>
                    </div>

                    <!-- Nội dung Bồ Đề Thụ -->
                    <div id="dp-tree-container" class="hidden space-y-4 flex-col animate-[fadeIn_0.3s_ease]">
                        <div class="glass-panel p-4 rounded-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
                            <div class="absolute -left-4 -bottom-4 text-8xl opacity-10 pointer-events-none">🌳</div>
                            
                            <h3 class="text-xl font-bold text-emerald-400 mb-1 flex items-center justify-center gap-2"><span>🌳</span> Tiên Cảnh Bồ Đề Thụ</h3>
                            <div class="text-[10px] text-emerald-200 bg-emerald-950/50 px-3 py-1 rounded-full inline-block border border-emerald-800 mb-4">Tầng <span id="bodhi-lv" class="font-bold text-white">0</span></div>
                            <div class="flex justify-center mb-4 relative z-10">
                                <img src="assets/images/bodhi_tree.jpg" alt="Bodhi Tree" class="w-32 h-32 object-cover rounded-full border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] anim-float">
                            </div>
                            
                            <p class="text-[10px] text-slate-300 mb-4 leading-relaxed text-left">
                                Bồ Đề Thụ là thánh vật trong truyền thuyết Mộng Ảo Tu Tiên. Dùng linh dịch (Mộc, Thảo, Thiết) tưới tắm để linh thụ phát triển.
                                <br><br>
                                <span class="text-amber-300 font-bold">Hiệu quả hiện tại:</span><br>
                                - Toàn bộ Chỉ Số Căn Bản: <span id="bodhi-stat-bonus" class="text-emerald-400 font-bold">+0%</span>
                            </p>

                            <div class="bg-black/40 p-3 rounded-lg border border-white/10 mb-4 text-left">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold text-slate-300">Tiến trình trưởng thành:</span>
                                    <span class="text-[10px] text-white" id="bodhi-exp-text">0 / 1000</span>
                                </div>
                                <div class="w-full bg-slate-900 rounded-full h-2">
                                    <div id="bodhi-exp-bar" class="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#10b981]" style="width: 0%"></div>
                                </div>
                            </div>

                            <button onclick="waterBodhiTree()" id="btn-water-tree" class="w-full relative overflow-hidden py-4 rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center gap-1 group border border-emerald-400/60 transition-all active:scale-95">
                                <div class="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 group-hover:scale-105 transition-transform duration-500"></div>
                                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                                <span class="relative z-10 text-xl drop-shadow-md">💧</span>
                                <span class="relative z-10 text-sm font-bold text-emerald-50 drop-shadow uppercase tracking-wider">Tưới Tiên Lộ</span>
                                <span class="relative z-10 text-[9px] text-emerald-200 font-normal bg-black/40 px-2 py-0.5 rounded-full mt-1" id="bodhi-cost-text">Tiêu hao: 100 Mộc, 100 Thảo, 50 Thiết</span>
                            </button>
                        </div>
                    </div>
                </div>`;
