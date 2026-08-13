const TPL_MODAL_ADMIN = `<div id="modal-admin" class="fixed inset-0 z-50 hidden bg-black/90 backdrop-blur-md items-center justify-center p-4">
            <div class="glass-panel w-full max-w-sm rounded-2xl p-4 border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.4)] relative max-h-[90vh] overflow-y-auto">
                <button onclick="closeAdminModal()" class="absolute top-2 right-3 text-slate-400 hover:text-white text-lg">×</button>
                <h3 class="text-lg font-bold text-fuchsia-400 mb-4 text-center border-b border-fuchsia-500/30 pb-2">⚙️ Bảng Quản Trị Thiên Đạo</h3>
                
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <label class="text-slate-400 block mb-1">Level (Max 99999):</label>
                            <input type="number" id="admin-lv" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">SP:</label>
                            <input type="number" id="admin-sp" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Linh Thạch:</label>
                            <input type="number" id="admin-coins" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Chân Nguyên:</label>
                            <input type="number" id="admin-primal" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Tu Vị:</label>
                            <input type="number" id="admin-tuvi" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Tầng Tháp:</label>
                            <input type="number" id="admin-tower" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Mộc:</label>
                            <input type="number" id="admin-wood" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Thảo:</label>
                            <input type="number" id="admin-herb" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                        <div>
                            <label class="text-slate-400 block mb-1">Thiết:</label>
                            <input type="number" id="admin-iron" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white" />
                        </div>
                    </div>
                    
                    <button onclick="applyAdminChanges()" class="w-full py-2 bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-bold rounded shadow-md mt-2">Lưu Thay Đổi</button>
                    
                    <div class="border-t border-white/10 pt-3 mt-3 space-y-2">
                        <button onclick="adminGiveAllItems()" class="w-full py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded shadow-md text-xs">Phát Trọn Bộ Đạo Cụ (x10)</button>
                        <button onclick="adminMaxEstate()" class="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded shadow-md text-xs">Max Cấp Động Phủ & Lô Đỉnh (+100 Lv)</button>
                        <button onclick="adminUnlockMeridians()" class="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded shadow-md text-xs">Max Kinh Mạch</button>
                    </div>
                </div>
            </div>
        </div>`;
