const TPL_MODAL_MEDITATE = `<div id="modal-meditate" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm items-center justify-center p-4">
            <div class="glass-panel w-full max-w-xs rounded-2xl p-5 border border-cyan-500/50 shadow-[0_0_20px_rgba(8,145,178,0.4)] relative">
                <button onclick="closeMeditateModal()" id="btn-close-meditate" class="absolute top-2 right-3 text-slate-400 hover:text-white text-lg">×</button>
                <h3 class="text-base font-bold text-cyan-400 mb-4 text-center border-b border-cyan-500/30 pb-2">⚡ Đột Phá Cảnh Giới</h3>
                
                <div id="meditate-setup" class="space-y-2">
                            <p class="text-[10px] text-slate-300 mb-3 text-center leading-relaxed">Đột phá tiêu hao Chân Nguyên và Tu Vị. Mỗi cảnh giới có 4 giai đoạn: Sơ Kỳ → Trung Kỳ → Hậu Kỳ → Đại Viên Mãn. Đạt Đại Viên Mãn, đột phá thành công sẽ thăng lên cảnh giới kế tiếp.</p>
                    <div id="meditate-target" class="text-[10px] text-cyan-200 bg-cyan-950/40 border border-cyan-500/20 rounded-lg px-2 py-1.5 text-center leading-relaxed mb-2"></div>
                    <button onclick="startMeditate(1)" class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-cyan-700/50 rounded-lg text-cyan-300 font-bold text-xs shadow-md transition-colors">Đột Phá</button>
                    <button onclick="startBreakthrough(1, true)" class="w-full py-2 bg-amber-900/80 hover:bg-amber-800 border border-amber-500/50 rounded-lg text-amber-100 font-bold text-xs shadow-md transition-colors">Auto Đột Phá</button>
                </div>
                
                <div id="meditate-active-ui" class="hidden flex-col items-center gap-3">
                    <div class="text-[10px] text-amber-300 animate-pulse text-center">Đang nén khí và đột phá cảnh giới...</div>
                    <div class="w-16 h-16 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin mb-1 shadow-[0_0_15px_rgba(8,145,178,0.5)]"></div>
                    <div id="meditate-timer" class="font-mono text-cyan-100 text-sm font-bold bg-black/50 px-3 py-1 rounded">00:00:00</div>
                    <div id="meditate-yield" class="text-[9px] text-emerald-300 text-center bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50 w-full">Đã tiêu: 0 EXP</div>
                    <button onclick="stopMeditate(false)" class="mt-2 w-full py-2 bg-rose-900/80 hover:bg-rose-800 border border-rose-500/50 rounded-lg text-rose-100 font-bold text-xs shadow-[0_0_10px_rgba(225,29,72,0.3)]">Dừng Đột Phá</button>
                </div>
            </div>
        </div>`;
