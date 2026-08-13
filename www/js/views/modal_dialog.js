const TPL_MODAL_DIALOG = `
    <!-- Custom Dialog -->
    <div id="custom-dialog-overlay" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center z-[100] px-4">
        <div class="glass-panel w-full max-w-sm rounded-xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
            <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-500/20 rounded-full blur-xl"></div>
            <h3 id="dialog-title" class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-2 relative z-10 text-center">Tiêu đề</h3>
            <p id="dialog-msg" class="text-slate-300 text-sm mb-4 relative z-10 text-center">Nội dung thông báo</p>
            <input type="text" id="dialog-input" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white mb-4 hidden focus:outline-none focus:border-cyan-400 text-center" placeholder="Nhập...">
            <div class="flex gap-3 relative z-10">
                <button id="dialog-btn-cancel" onclick="closeDialog(false)" class="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hidden hover:bg-slate-700 transition">Hủy Bỏ</button>
                <button onclick="closeDialog(true)" class="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:brightness-110 transition shadow-lg shadow-cyan-900/50">Xác Nhận</button>
            </div>
        </div>
    </div>
`;
