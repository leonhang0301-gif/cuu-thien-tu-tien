// --- HỆ THỐNG CẢNH GIỚI MỞ RỘNG(15 Cấp Chuẩn Mộng Ảo) ---
        const DB_REALMS = [
            { level: 1, name: "Phàm Nhân", mult: 1, color: "text-slate-300" },
            { level: 10, name: "Luyện Khí", mult: 5, color: "text-green-400" },
            { level: 30, name: "Trúc Cơ", mult: 20, color: "text-blue-400" },
            { level: 100, name: "Kết Đan", mult: 80, color: "text-purple-400" },
            { level: 300, name: "Nguyên Anh", mult: 300, color: "text-pink-400" },
            { level: 800, name: "Hóa Thần", mult: 1000, color: "text-orange-400" },
            { level: 2000, name: "Luyện Hư", mult: 3500, color: "text-teal-400" },
            { level: 5000, name: "Hợp Thể", mult: 12000, color: "text-indigo-400" },
            { level: 12000, name: "Đại Thừa", mult: 40000, color: "text-rose-400" },
            { level: 25000, name: "Độ Kiếp", mult: 150000, color: "text-red-500" },
            { level: 40000, name: "Chân Tiên", mult: 600000, color: "text-amber-400" },
            { level: 60000, name: "Kim Tiên", mult: 2500000, color: "text-yellow-300" },
            { level: 80000, name: "Thái Ất", mult: 10000000, color: "text-fuchsia-300" },
            { level: 95000, name: "Đại La", mult: 50000000, color: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold" },
            { level: 99999, name: "Đạo Tổ", mult: 200000000, color: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-extrabold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" }
        ];

        const BREAKTHROUGH_STAGES = [
            { id: 'so_ky', name: 'Sơ Kỳ', minLv: 1, maxLv: 100, successRate: 0.82 },
            { id: 'trung_ky', name: 'Trung Kỳ', minLv: 101, maxLv: 800, successRate: 0.58 },
            { id: 'hau_ky', name: 'Hậu Kỳ', minLv: 801, maxLv: 99999, successRate: 0.4 }
        ];

        // 4 giai đoạn tu luyện trong MỖI cảnh giới: Sơ Kỳ → Trung Kỳ → Hậu Kỳ → Đại Viên Mãn
        const DB_REALM_STAGES = [
            { id: 1, name: 'Sơ Kỳ', color: 'text-slate-300' },
            { id: 2, name: 'Trung Kỳ', color: 'text-emerald-300' },
            { id: 3, name: 'Hậu Kỳ', color: 'text-cyan-300' },
            { id: 4, name: 'Đại Viên Mãn', color: 'text-amber-300' }
        ];

        const DB_ROOTS = {
            kim: { name: "Kim Linh Căn", icon: "⚔️", statName: "Lực Chiến", statKey: "atk", valPerLv: 10, color: "text-yellow-400" },
            moc: { name: "Mộc Linh Căn", icon: "🌿", statName: "Sinh Lực", statKey: "hp", valPerLv: 100, color: "text-green-400" },
            thuy: { name: "Thủy Linh Căn", icon: "💧", statName: "Né Tránh", statKey: "dodge", valPerLv: 0.001, color: "text-blue-400", isPercent: true },
            hoa: { name: "Hỏa Linh Căn", icon: "🔥", statName: "Bạo Kích", statKey: "crit", valPerLv: 0.001, color: "text-red-400", isPercent: true },
            tho: { name: "Thổ Linh Căn", icon: "🪨", statName: "Phòng Thủ", statKey: "def", valPerLv: 5, color: "text-amber-600" }
        };

        const MERIDIANS = [
            { name: "Nhâm Mạch", reqLv: 10, reqName: "Luyện Khí", color: "text-blue-400", bg: "bg-blue-500", stat: { hp: 500, atk: 50 } },
            { name: "Đốc Mạch", reqLv: 30, reqName: "Trúc Cơ", color: "text-green-400", bg: "bg-green-500", stat: { hp: 2000, def: 50 } },
            { name: "Xung Mạch", reqLv: 100, reqName: "Kết Đan", color: "text-purple-400", bg: "bg-purple-500", stat: { hp: 8000, atk: 300 } },
            { name: "Đới Mạch", reqLv: 300, reqName: "Nguyên Anh", color: "text-pink-400", bg: "bg-pink-500", stat: { dodge: 0.02, hp: 20000 } },
            { name: "Âm Kiều Mạch", reqLv: 800, reqName: "Hóa Thần", color: "text-orange-400", bg: "bg-orange-500", stat: { crit: 0.02, atk: 2000 } },
            { name: "Dương Kiều Mạch", reqLv: 2000, reqName: "Luyện Hư", color: "text-teal-400", bg: "bg-teal-500", stat: { hpM: 0.05, def: 1000 } },
            { name: "Âm Duy Mạch", reqLv: 5000, reqName: "Hợp Thể", color: "text-indigo-400", bg: "bg-indigo-500", stat: { atkM: 0.05, hp: 100000 } },
            { name: "Dương Duy Mạch", reqLv: 12000, reqName: "Đại Thừa", color: "text-rose-400", bg: "bg-rose-500", stat: { hpM: 0.1, atkM: 0.1 } }
        ];

        const MAP_IMAGES = [
            "https://images.unsplash.com/photo-1543158181-e6f496752194?q=80&w=800", "https://images.unsplash.com/photo-1518182170546-076616fd4aa5?q=80&w=800",
            "https://images.unsplash.com/photo-1603774844336-db12781bb45b?q=80&w=800", "https://images.unsplash.com/photo-1501432766859-994367f0521e?q=80&w=800",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800", "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800", "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800" 
        ];

        const DB_MAPS = [];
        const MAP_CATEGORIES = [
            { n: "Nhân Giới", minL: 1, maxL: 999, c: 20, imgs: [0,1], pfx: ["Thanh Vân", "Lạc Hà", "Bạch Lộ", "Phong Trần", "Hồng Trần"], sfx: ["Thôn", "Trấn", "Cốc", "Lâm", "Sơn"], mobs: ["Tạp Niệm", "Khí Độc", "Chướng Khí", "Ác Niệm", "Tâm Tà", "Cuồng Phong"] },
            { n: "Lục Địa", minL: 1000, maxL: 4999, c: 30, imgs: [0,2,4], pfx: ["Thiên Vũ", "Thương Lan", "Huyền Thiên", "Bắc Minh", "Nam Cương"], sfx: ["Đại Lục", "Hoang Mạc", "Chiến Trường", "Đế Quốc", "Sơn Mạch"], mobs: ["Yêu Khí", "Ma Niệm", "Tà Đạo Ám Khí", "Sát Khí", "Địa Hỏa"] },
            { n: "Địa Ngục", minL: 5000, maxL: 9999, c: 30, imgs: [1,3], pfx: ["Cửu U", "Hoàng Tuyền", "Tu La", "Minh Hà", "Sâm La"], sfx: ["Địa Ngục", "Quỷ Lĩnh", "Ma Uyên", "Huyết Trì", "Luyện Ngục"], mobs: ["Âm Khí", "Lệ Khí", "Tử Khí", "U Minh Oán Khí", "Huyết Sát"] },
            { n: "Tam Giới", minL: 10000, maxL: 24999, c: 40, imgs: [4,5], pfx: ["Yêu Tiên", "Thần Ma", "Hỗn Loạn", "Thái Cực", "Vô Cực"], sfx: ["Chi Tiền", "Giao Giới", "Chiến Tinh", "Ngân Hà", "Chi Môn"], mobs: ["Hỗn Độn Khí", "Tinh Tướng Huyễn Ảnh", "Tinh Không Ám Xung", "Yêu Ma Khí", "Thiên Phạt Chi Lôi"] },
            { n: "Thiên Giới", minL: 25000, maxL: 49999, c: 40, imgs: [5,6], pfx: ["Lăng Tiêu", "Cửu Trùng", "Đại La", "Thái Thanh", "Ngọc Thanh"], sfx: ["Bảo Điện", "Thiên Cung", "Tiên Đảo", "Thần Điện", "Tiên Vực"], mobs: ["Thiên Đạo Chướng Ngại", "Cửu Trùng Kiếp Lôi", "Tiên Nhân Oán Niệm", "Thần Phạt", "Chân Linh Chi Vấn"] },
            { n: "Cửu Thiên Giới", minL: 50000, maxL: 79999, c: 30, imgs: [5,7], pfx: ["Thần Tiêu", "Thanh Thiên", "Bích Lạc", "Hạo Thiên", "Quân Thiên"], sfx: ["Cửu Thiên", "Thần Vực", "Thánh Địa", "Chân Giới", "Vô Tượng"], mobs: ["Cửu Thiên Thần Kiếp", "Chân Tiên Ma Chướng", "Thánh Tôn Ý Chí", "Thiên Đế Phẫn Nộ", "Đạo Tổ Thử Thách"] },
            { n: "Vạn Giới", minL: 80000, maxL: 99999, c: 10, imgs: [7], pfx: ["Khởi Nguyên", "Hồng Mông", "Hỗn Độn", "Chư Thiên", "Vạn Giới"], sfx: ["Chi Tâm", "Khởi Điểm", "Chung Yên", "Vĩnh Hằng", "Phá Diệt"], mobs: ["Hỗn Độn Dòng Chảy", "Thời Không Sụp Đổ", "Hư Vô Thôn Phệ", "Sáng Thế Uy Áp", "Chúa Tể Dư Âm"] }
        ];

        let mapIdCounter = 0;
        MAP_CATEGORIES.forEach(cat => {
            let levelStep = (cat.maxL - cat.minL) / cat.c;
            for (let i = 0; i < cat.c; i++) {
                let minLv = Math.floor(cat.minL + i * levelStep);
                let name = cat.pfx[Math.floor(Math.random() * cat.pfx.length)] + " " + cat.sfx[Math.floor(Math.random() * cat.sfx.length)];
                let img = cat.imgs[Math.floor(Math.random() * cat.imgs.length)];
                
                let mapMobs = []; while (mapMobs.length < 5) {
                    let mob = cat.mobs[Math.floor(Math.random() * cat.mobs.length)];
                    if (!mapMobs.includes(mob)) mapMobs.push(mob);
                }
                let bosses = [];
                while (bosses.length < 3) {
                    let bossName = ["Đại ", "Thái Cổ ", "Thần "][Math.floor(Math.random()*3)] + cat.mobs[Math.floor(Math.random() * cat.mobs.length)] + " Vương";
                    if (!bosses.includes(bossName)) bosses.push(bossName);
                }

                DB_MAPS.push({ id: mapIdCounter, minLv: minLv === 0 ? 1 : minLv, name: `[${cat.n}] ${name}`, img: img, mobs: mapMobs, bosses: bosses, boss: bosses[0] });
                mapIdCounter++;
            }
        });
        DB_MAPS[0] = { id: 0, minLv: 1, name: "[Nhân Giới] Thanh Vân Thôn", img: 0, mobs: ["Tạp Niệm", "Khí Độc", "Ác Niệm", "Chướng Khí", "Tâm Tà"], bosses: ["Đại Ác Niệm Vương", "Thần Sát Quỷ Vương", "Thiên Phế Hồn Tướng"], boss: "Đại Ác Niệm Vương" };
        DB_MAPS[199].name = "[Vạn Giới] Vĩnh Hằng Chung Yên"; DB_MAPS[199].boss = "VÔ THƯỢNG ĐẠO TỔ"; DB_MAPS[199].bosses = ["VÔ THƯỢNG ĐẠO TỔ", "Thần Huyền Băng Vương", "Vô Hạn Hỏa Tổ"];

        const DB_SKILLS = [
            { req: "Phàm Nhân", name: "Thổ Nạp Căn Bản", desc: "Hiểu được cách vận khí, HP và MP bắt đầu luân chuyển." },
            { req: "Trúc Cơ", name: "Khinh Công Cấp Thấp", desc: "Bước chân nhẹ nhàng, mở khóa khả năng Né Tránh." },
            { req: "Nguyên Anh", name: "Nguyên Thần Xuất Khiếu", desc: "Thần thức cường đại, tăng mạnh tỷ lệ Bạo Kích EXP." },
            { req: "Chân Tiên", name: "Tiên Thể Phụ Thể", desc: "Thân thể siêu phàm, miễn nhiễm phần lớn sát khí môi trường." }
        ];

        const DB_ITEMS = {};
        const EXTRA_MORTAL_ITEMS = [
            { key: 'wbase_1', name: 'Mộc Kiếm Phàm', type: 'weapon', reqLv: 1, price: 120, atk: 80, crit: 0.01, tierClass: 'text-slate-300', desc: 'Y/c Lv: 1. Khí cụ phàm nhân cơ bản, dùng cho người mới bước vào giang hồ.' },
            { key: 'wbase_2', name: 'Thanh Phong Kiếm', type: 'weapon', reqLv: 5, price: 450, atk: 180, crit: 0.02, tierClass: 'text-green-400', desc: 'Y/c Lv: 5. Kiếm khí nhẹ, tốc độ linh hoạt hơn.' },
            { key: 'wbase_3', name: 'Liệt Hỏa Đao', type: 'weapon', reqLv: 15, price: 1800, atk: 420, crit: 0.03, tierClass: 'text-blue-400', desc: 'Y/c Lv: 15. Đao khí nóng như lửa, sát khí rõ rệt.' },
            { key: 'wbase_4', name: 'Bạch Hạc Phủ', type: 'weapon', reqLv: 30, price: 6000, atk: 900, crit: 0.04, tierClass: 'text-purple-400', desc: 'Y/c Lv: 30. Phủ khí uy áp, kéo dài thế công.' },
            { key: 'tbase_1', name: 'Hộ Tâm Phù', type: 'talisman', reqLv: 1, price: 140, hpM: 1.06, atkM: 1.03, tierClass: 'text-slate-300', desc: 'Y/c Lv: 1. Bùa hộ thân, tăng chút sinh lực và lực chiến.' },
            { key: 'tbase_2', name: 'Tụ Khí Phù', type: 'talisman', reqLv: 5, price: 500, hpM: 1.10, atkM: 1.05, tierClass: 'text-green-400', desc: 'Y/c Lv: 5. Bùa tụ khí, tăng thêm nội lực.' },
            { key: 'tbase_3', name: 'Kim Cang Trận', type: 'talisman', reqLv: 15, price: 2200, hpM: 1.14, atkM: 1.08, tierClass: 'text-blue-400', desc: 'Y/c Lv: 15. Trận pháp cứng cáp, tăng cường thân thể.' },
            { key: 'tbase_4', name: 'Ngũ Hành Phù', type: 'talisman', reqLv: 30, price: 7500, hpM: 1.18, atkM: 1.12, tierClass: 'text-purple-400', desc: 'Y/c Lv: 30. Phù ngũ hành, bền bỉ và uyển chuyển.' },
            { key: 'abase_1', name: 'Giáp Thân Cơ Bản', type: 'armor', reqLv: 1, price: 160, hp: 120, def: 5, tierClass: 'text-slate-300', desc: 'Y/c Lv: 1. Giáp cơ bản, tăng thô lực thể chất và bền vững.' },
            { key: 'abase_2', name: 'Áo Bạch Huyền', type: 'cloth', reqLv: 5, price: 520, hp: 350, dodge: 0.01, tierClass: 'text-green-400', desc: 'Y/c Lv: 5. Áo bạch huyền, tập trung khí lực và né tránh.' },
            { key: 'abase_3', name: 'Nón Thạch Hỏa', type: 'helmet', reqLv: 15, price: 2000, hp: 650, def: 18, tierClass: 'text-blue-400', desc: 'Y/c Lv: 15. Nón chiến y, giúp hộ thân không lung lay.' },
            { key: 'abase_4', name: 'Tay Bích Huyết', type: 'glove', reqLv: 20, price: 2800, atk: 180, crit: 0.02, tierClass: 'text-rose-400', desc: 'Y/c Lv: 20. Găng tay hắc hỏa, tăng sức đánh nhanh và chính xác.' },
            { key: 'abase_5', name: 'Giày Huyền Thiên', type: 'boots', reqLv: 30, price: 4200, dodge: 0.025, def: 25, tierClass: 'text-purple-400', desc: 'Y/c Lv: 30. Giày bền uyển, giúp chuyển động trong chiến đấu.' },
            { key: 'mbase_1', name: 'Thanh Thông Mã', type: 'mount', reqLv: 10, price: 2200, atk: 250, hp: 1800, tierClass: 'text-indigo-400', desc: 'Y/c Lv: 10. Tọa kỵ phàm nhân, tăng linh lực di chuyển.' },
            { key: 'mbase_2', name: 'Xích Huyết Mã', type: 'mount', reqLv: 20, price: 4500, atk: 420, hp: 3200, tierClass: 'text-rose-400', desc: 'Y/c Lv: 20. Tọa kỵ bền bỉ, thích hợp cho chiến trường.' },
            { key: 'mbase_3', name: 'Phong Tật Báo', type: 'mount', reqLv: 40, price: 9000, atk: 650, hp: 5000, tierClass: 'text-cyan-400', desc: 'Y/c Lv: 40. Tọa kỵ tốc độ cao, hợp với các đạo hữu phong lưu.' }
        ];
        const GEN_TIERS = [
            { n: 'Phàm Cấp', c: 'text-slate-300', m: 1 }, { n: 'Hoàng Cấp', c: 'text-green-400', m: 5 },
            { n: 'Huyền Cấp', c: 'text-blue-400', m: 20 }, { n: 'Địa Cấp', c: 'text-purple-400', m: 100 },
            { n: 'Thiên Cấp', c: 'text-orange-400', m: 500 }, { n: 'Tiên Cấp', c: 'text-rose-400', m: 3000 },
            { n: 'Thần Cấp', c: 'text-amber-400', m: 10000 }, { n: 'Hồng Mông', c: 'text-fuchsia-400', m: 50000 },
            { n: 'Hỗn Độn', c: 'text-cyan-300', m: 200000 }, { n: 'Thái Cổ', c: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-extrabold', m: 1000000 }
        ];
        DB_ITEMS['hp1'] = { name: 'Hạ Phẩm Hồi Huyết', type: 'consumable', sub: 'hp', val: 50000, price: 50, reqLv: 1, desc: 'Hồi 50000 HP' };
        DB_ITEMS['mp1'] = { name: 'Hạ Phẩm Hồi Nguyên', type: 'consumable', sub: 'mp', val: 5000, price: 50, reqLv: 1, desc: 'Hồi 5000 MP' };
        DB_ITEMS['psb1'] = { name: 'Thú Quyết Cơ Bản', type: 'pet_skill_book', val: 1, price: 50000, reqLv: 10, desc: 'Tăng 1 cấp Kỹ năng Linh thú' };
        DB_ITEMS['psb2'] = { name: 'Thú Quyết Cao Cấp', type: 'pet_skill_book', val: 5, price: 200000, reqLv: 300, desc: 'Tăng 5 cấp Kỹ năng Linh thú' };

        // Vật phẩm Kinh Mạch
        DB_ITEMS['kmd'] = { name: 'Kinh Mạch Đan', type: 'material', sub: 'meridian', price: 1500, tierClass: 'text-rose-300 font-bold', desc: 'Linh đan ẩn chứa kỳ năng, dùng để xung kích huyệt vị kinh mạch.' };
        DB_ITEMS['hgd'] = { name: 'Huyền Giám Đan', type: 'material', sub: 'breakthrough', price: 10000, tierClass: 'text-fuchsia-400 font-extrabold', desc: 'Đan dược trân quý, dùng để đột phá đại cảnh giới kinh mạch.' };

        EXTRA_MORTAL_ITEMS.forEach(item => {
            DB_ITEMS[item.key] = { ...item };
        });

        // Pets
        const PET_SKILLS = [];
        const E = ["Hỏa", "Băng", "Lôi", "Độc", "Phong", "Thổ", "Quang", "Ám", "Huyết", "Thần"];
        const T = ["Trảo", "Hống", "Thuẫn", "Bạo", "Diệt", "Sát", "Tế", "Thôn", "Chú", "Trận"];
        const A = ["Cuồng", "Ma", "Thánh", "Thiên", "Tuyệt", "Vô Cực", "Hỗn Độn", "U Minh", "Thái Cổ", "Hồng Mông"];
        for(let i=0; i<3; i++) {
            for(let e of E) {
                for(let t of T) {
                    let isAtk = Math.random() > 0.5;
                    PET_SKILLS.push({
                        name: `${A[Math.floor(Math.random()*A.length)]} ${e} ${t}`,
                        desc: isAtk ? `+${(Math.random()*15+5).toFixed(1)}% Lực Chiến` : `+${(Math.random()*15+5).toFixed(1)}% Sinh Lực`,
                        atkM: isAtk ? 1 + (Math.random()*0.15+0.05) : 1, hpM: !isAtk ? 1 + (Math.random()*0.15+0.05) : 1,
                    });
                }
            }
        }
        
        const P_BASES = ["Thử", "Hổ", "Điểu", "Long", "Quy", "Xà", "Viên", "Hồ", "Sư", "Cẩu"];
        const MATT_ELEMS = ["Hỏa", "Băng", "Lôi", "Phong", "Thổ", "Kim", "Mộc", "Thủy", "Ám", "Quang"];
        const MATT_TYPES = [{ n: "Tâm Pháp", stat: "hpM", val: 0.1, desc: "Tăng Sinh Lực" }, { n: "Quyết", stat: "atkM", val: 0.1, desc: "Tăng Lực Chiến" }, { n: "Thân Pháp", stat: "dodge", val: 0.02, desc: "Tăng Né Tránh" }, { n: "Chân Ngôn", stat: "crit", val: 0.02, desc: "Tăng Bạo Kích" }];
        const PM_NAMES = ["Tẩy Tủy Đan", "Tiên Thú Quả", "Huyết Mạch Đan", "Ngộ Đạo Trà", "Khẩu Phần", "Long Tiên Hương", "Ngự Thú Quyết", "Tọa Kỵ Đan"];
        const PILL_TYPES = [{ sub: 'hp', nm: 'Hồi Huyết Đan', stat: 'val', mult: 500 }, { sub: 'mp', nm: 'Hồi Nguyên Đan', stat: 'val', mult: 100 }, { sub: 'perm_atk', nm: 'Chân Khí Đan', stat: 'atk', mult: 10 }, { sub: 'perm_hp', nm: 'Thể Phách Đan', stat: 'hp', mult: 100 }, { sub: 'perm_exp', nm: 'Ngộ Đạo Đan', stat: 'expR', mult: 0.005 }, { sub: 'perm_luck', nm: 'Cơ Duyên Đan', stat: 'luckR', mult: 0.005 }];
        const WEP_NAMES = ["Bồ Đoàn", "Mộc Kiếm", "Thanh Phong Kiếm", "Liệt Hỏa Đao", "Trảm Tiên Kiếm", "Khai Thiên Phủ", "Phá Thiên Thương", "Hỗn Độn Kích", "Diệt Thế Trượng", "Thái Cổ Thần Khí"];
        const TAL_NAMES = ["Hộ Tâm Phù", "Tụ Khí Phù", "Kim Cang Trận", "Ngũ Hành Phù", "Thất Tinh Đồ", "Cửu Cung Trận", "Luân Hồi Ấn", "Thiên Đạo Phù", "Sáng Thế Lục", "Vô Hạn Bùa"];
        const ARMOR_NAMES = ["Đan Thân Giáp", "Long Thần Giáp", "Hỏa Tinh Giáp", "Băng Tâm Giáp", "Thiên Dùng Giáp", "Thánh Bảo Giáp", "Vô Cực Giáp", "Thái Cổ Áo Giáp", "Âm Dương Liên Giáp", "Vân Mộng Chế Giáp"];
        const CLOTH_NAMES = ["Mộc Lâm Áo", "Lôi Phong Áo", "Tăng Huyết Áo", "Bắc Đẩu Áo", "Vô Ảnh Áo", "Linh Mạch Áo", "Thần Pháp Áo", "Sương Huyết Áo", "Tuyệt Thế Áo", "Hồng Mông Áo"];
        const HELMET_NAMES = ["Ngân Định Nón", "Thủ Hộ Nón", "Phong Lôi Nón", "Huyết Thần Nón", "Tiên Nữ Nón", "Long Tộc Nón", "Huyền Băng Nón", "Quần Hành Nón", "Vô Ảnh Nón", "Thái Cổ Nón"];
        const GLOVE_NAMES = ["Thiên Phạt Tay", "Cửu Thiên Găng", "Hỏa Cốt Tay", "Lôi Pháp Tay", "Xuyên Không Găng", "Huyền Hỏa Tay", "Hộ Thần Găng", "Phượng Tử Tay", "Dương Huyết Găng", "Vô Hạn Tay"];
        const BOOTS_NAMES = ["Thần Tốc Giày", "Vân Hành Giày", "Tử Xà Giày", "Thiên Vân Giày", "Lũy Phong Giày", "Hư Không Giày", "Tế Thần Giày", "Sát Quang Giày", "Băng Mạch Giày", "Vạn Giới Giày"];
        const MNT_NAMES = ["Thanh Thông Mã", "Xích Huyết Mã", "Phong Tật Báo", "Lôi Hổ", "Hỏa Lân", "Băng Sương Cự Long", "Cửu U Minh Tước", "Hỗn Độn Côn Bằng", "Tinh Không Thú", "Vạn Giới Đài Sen"];

        GEN_TIERS.forEach((tier, t) => {
            let reqLv = DB_REALMS[t] ? DB_REALMS[t].level : 50000;
            
            // 1. Linh Thú (Pets)
            let prefix = A[t];
            P_BASES.forEach((base, pIdx) => {
                let skill = PET_SKILLS[(t * P_BASES.length + pIdx) % PET_SKILLS.length];
                let pAtk = Math.floor(Math.pow(t*10+pIdx+1, 1.9) * 50); let pHp = Math.floor(Math.pow(t*10+pIdx+1, 1.9) * 500);
                DB_ITEMS[`pet_${t}_${pIdx}`] = { name: `${prefix} ${base} [${tier.n}]`, type: 'pet', reqLv: reqLv, atk: pAtk, hp: pHp, price: Math.floor(Math.pow(t*10+pIdx+1, 1.6) * 1500), tierClass: tier.c, tierIdx: t, skill: skill, desc: `Y/c Lv: ${formatNum(reqLv)}. Kỹ năng: ${skill.name} (${skill.desc}).` };
            });

            // 2. Bí Cấp (Skill Books - Characters)
            let elem = MATT_ELEMS[t % MATT_ELEMS.length];
            MATT_TYPES.forEach((type, sIdx) => {
                let itemVal = type.val * (1 + t * 0.6);
                DB_ITEMS[`sb_${t}_${sIdx}`] = { name: `[${tier.n}] ${elem} ${type.n}`, type: 'skill_book', reqLv: reqLv, price: Math.floor(Math.pow(1.5, t) * 5000), tierClass: tier.c, tierIdx: t, [type.stat]: itemVal, baseVal: itemVal, statKey: type.stat, descStr: type.desc, desc: `Y/c Lv: ${formatNum(reqLv)}. Lĩnh ngộ bị động: ${type.desc} (+${(itemVal*100).toFixed(1)}%)` };
            });

            // 3. Tài nguyên Thú (Pet Items)
            let pmiVal = Math.floor(Math.pow(1.8, t) * 5) || 1;
            PM_NAMES.forEach((nm, nmIdx) => {
                let isMount = nm === "Tọa Kỵ Đan" || nm === "Long Tiên Hương";
                DB_ITEMS[`pmi_${t}_${nmIdx}`] = { name: `[${tier.n}] ${nm}`, type: 'pet_item', sub: isMount ? 'mount' : 'pet', val: pmiVal, price: Math.floor(Math.pow(1.6, t) * 2000), reqLv: reqLv, tierClass: tier.c, tierIdx: t, desc: `Y/c Lv: ${formatNum(reqLv)}. Đột phá ${pmiVal} cấp cho ${isMount ? 'Thú Cưỡi' : 'Linh Thú'}.` };
            });

            // 4. Tiên Đan (Pills)
            PILL_TYPES.forEach((pType, pillIdx) => {
                let pVal = pType.mult * tier.m;
                DB_ITEMS[`pill_${t}_${pillIdx}`] = { name: `[${tier.n}] ${pType.nm}`, type: 'consumable', sub: pType.sub, price: tier.m * 100, reqLv: reqLv, tierClass: tier.c, tierIdx: t, [pType.stat]: pType.stat.includes('R') ? pVal/100 : Math.floor(pVal), desc: `Y/c Lv: ${formatNum(reqLv)}. ` + (pType.stat.includes('R') ? `Tăng vĩnh viễn ${(pVal).toFixed(2)}% ${pType.nm.includes('Ngộ')?'Kinh Nghiệm':'Tỷ lệ Rớt'}` : `Tác dụng: +${formatNum(pVal)} ${pType.sub.toUpperCase().replace('PERM_','')}`) };
            });

            // 5. Vũ Khí, Bùa Chú, Giáp, Tay, Áo, Nón, Giày, Thú Cưỡi (Weapons, Talismans, Armor/Cloth/Helmet/Glove/Boots, Mounts)
            let wNm = WEP_NAMES[Math.min(t, WEP_NAMES.length-1)]; let wAtk = 100 * tier.m; let wCrit = 0.005 + (0.001 * t);
            DB_ITEMS[`wgen_${t}`] = { name: `[${tier.n}] ${wNm}`, type: 'weapon', reqLv: reqLv, price: tier.m * 500, tierClass: tier.c, tierIdx: t, atk: Math.floor(wAtk), crit: wCrit, desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(wAtk)} Lực Chiến, +${(wCrit*100).toFixed(1)}% Bạo Kích.` };
            
            let tNm = TAL_NAMES[Math.min(t, TAL_NAMES.length-1)]; let tHpM = 1 + (tier.m * 0.0005); let tAtkM = 1 + (tier.m * 0.0005);
            DB_ITEMS[`tgen_${t}`] = { name: `[${tier.n}] ${tNm}`, type: 'talisman', reqLv: reqLv, price: tier.m * 600, tierClass: tier.c, tierIdx: t, hpM: tHpM, atkM: tAtkM, desc: `Y/c Lv: ${formatNum(reqLv)}. +${((tHpM-1)*100).toFixed(1)}% Sinh Lực & Lực Chiến.` };

            let armorNm = ARMOR_NAMES[Math.min(t, ARMOR_NAMES.length-1)]; let armorHp = 120 * tier.m; let armorDef = 6 * tier.m;
            DB_ITEMS[`agen_${t}`] = { name: `[${tier.n}] ${armorNm}`, type: 'armor', reqLv: reqLv, price: tier.m * 620, tierClass: tier.c, tierIdx: t, hp: Math.floor(armorHp), def: Math.floor(armorDef), desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(armorHp)} Thể Phách, +${formatNum(armorDef)} Phòng Thủ.` };

            let clothNm = CLOTH_NAMES[Math.min(t, CLOTH_NAMES.length-1)]; let clothHp = 140 * tier.m; let clothDodge = 0.003 + (0.001 * t);
            DB_ITEMS[`cgen_${t}`] = { name: `[${tier.n}] ${clothNm}`, type: 'cloth', reqLv: reqLv, price: tier.m * 650, tierClass: tier.c, tierIdx: t, hp: Math.floor(clothHp), dodge: clothDodge, desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(clothHp)} Thể Phách, +${(clothDodge*100).toFixed(1)}% Né Tránh.` };

            let helmetNm = HELMET_NAMES[Math.min(t, HELMET_NAMES.length-1)]; let helmetHp = 110 * tier.m; let helmetDef = 8 * tier.m;
            DB_ITEMS[`hgen_${t}`] = { name: `[${tier.n}] ${helmetNm}`, type: 'helmet', reqLv: reqLv, price: tier.m * 610, tierClass: tier.c, tierIdx: t, hp: Math.floor(helmetHp), def: Math.floor(helmetDef), desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(helmetHp)} Thể Phách, +${formatNum(helmetDef)} Phòng Thủ.` };

            let gloveNm = GLOVE_NAMES[Math.min(t, GLOVE_NAMES.length-1)]; let gloveAtk = 60 * tier.m; let gloveCrit = 0.002 + (0.001 * t);
            DB_ITEMS[`ggen_${t}`] = { name: `[${tier.n}] ${gloveNm}`, type: 'glove', reqLv: reqLv, price: tier.m * 580, tierClass: tier.c, tierIdx: t, atk: Math.floor(gloveAtk), crit: gloveCrit, desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(gloveAtk)} Lực Chiến, +${(gloveCrit*100).toFixed(1)}% Bạo Kích.` };

            let bootsNm = BOOTS_NAMES[Math.min(t, BOOTS_NAMES.length-1)]; let bootsDodge = 0.004 + (0.001 * t); let bootsDef = 5 * tier.m;
            DB_ITEMS[`bgen_${t}`] = { name: `[${tier.n}] ${bootsNm}`, type: 'boots', reqLv: reqLv, price: tier.m * 590, tierClass: tier.c, tierIdx: t, dodge: bootsDodge, def: Math.floor(bootsDef), desc: `Y/c Lv: ${formatNum(reqLv)}. +${(bootsDodge*100).toFixed(1)}% Né Tránh, +${formatNum(bootsDef)} Phòng Thủ.` };
            
            let mNm = MNT_NAMES[Math.min(t, MNT_NAMES.length-1)]; let mAtk = 50 * tier.m; let mHp = 500 * tier.m;
            DB_ITEMS[`mgen_${t}`] = { name: `[${tier.n}] ${mNm}`, type: 'mount', reqLv: reqLv, price: tier.m * 1000, tierClass: tier.c, tierIdx: t, atk: Math.floor(mAtk), hp: Math.floor(mHp), desc: `Y/c Lv: ${formatNum(reqLv)}. +${formatNum(mAtk)} Lực Chiến, +${formatNum(mHp)} Sinh Lực.` };
        });

        // 1. Cho Nhân Vật
        DB_ITEMS['cpb_1'] = { name: 'Đại Đạo Bị Động: Bất Diệt Thể', type: 'skill_book', hpM: 0.15, statKey: 'hpM', val: 0.15, baseVal: 0.15, descStr: 'Tăng 15% Sinh Lực', desc: 'Y/c Lv: 100. Kỹ năng bị động: +15% Sinh Lực cho Đạo Hữu.', price: 50000, reqLv: 100, tierClass: 'text-purple-400', tierIdx: 3 };
        DB_ITEMS['cpb_2'] = { name: 'Đại Đạo Bị Động: Sát Thần Quyết', type: 'skill_book', atkM: 0.15, statKey: 'atkM', val: 0.15, baseVal: 0.15, descStr: 'Tăng 15% Lực Chiến', desc: 'Y/c Lv: 100. Kỹ năng bị động: +15% Lực Chiến cho Đạo Hữu.', price: 50000, reqLv: 100, tierClass: 'text-purple-400', tierIdx: 3 };
        DB_ITEMS['cpb_3'] = { name: 'Đại Đạo Bị Động: Hư Vô Ảnh', type: 'skill_book', dodge: 0.05, statKey: 'dodge', val: 0.05, baseVal: 0.05, descStr: 'Tăng 5% Né Tránh', desc: 'Y/c Lv: 100. Kỹ năng bị động: +5% Né Tránh cho Đạo Hữu.', price: 50000, reqLv: 100, tierClass: 'text-purple-400', tierIdx: 3 };
        DB_ITEMS['sb_heal_1'] = { name: 'Huyết Đạo Thần Châm', type: 'skill_book', reqLv: 10, price: 8000, tierClass: 'text-blue-400', tierIdx: 2, killRestoreHp: 0.12, killRestoreMp: 0.08, descStr: 'Hồi HP/MP sau khi hạ quái', desc: 'Y/c Lv: 10. Hạ quái hồi sinh khí, giữ thân thể kiên cố.' };
        DB_ITEMS['sb_lifesteal_1'] = { name: 'Hút Hồn Quyết', type: 'skill_book', reqLv: 15, price: 12000, tierClass: 'text-purple-400', tierIdx: 3, hitHpSteal: 0.05, hitMpSteal: 0.03, descStr: 'Hút HP & MP khi đánh', desc: 'Y/c Lv: 15. Đánh quái kích hoạt phần huyết linh, hút lại HP và MP.' };
        DB_ITEMS['sb_tran_1'] = { name: 'Trấn Yêu Thần Kinh', type: 'skill_book', reqLv: 20, price: 18000, tierClass: 'text-amber-400', tierIdx: 4, tranChance: 0.18, tranDamage: 0.40, descStr: 'Kỹ năng trấn, tăng sát thương đòn đánh', desc: 'Y/c Lv: 20. Kỹ năng trấn yêu, làm cho kẻ địch tê liệt và chịu thêm sát thương.' };

        // 2. Cho Linh Thú
        DB_ITEMS['ppb_1'] = { name: 'Sách Bị Động Thú: Cuồng Lực', type: 'pet_passive_book', stat: 'atkM', val: 0.05, desc: 'Cho thú cưng học. Bị động: +5% Lực Chiến cho chủ.', price: 20000, reqLv: 100, tierIdx: 3, tierClass: 'text-emerald-400' };
        DB_ITEMS['ppb_2'] = { name: 'Sách Bị Động Thú: Hộ Chủ Thuẫn', type: 'pet_passive_book', stat: 'hpM', val: 0.05, desc: 'Cho thú cưng học. Bị động: +5% Sinh Lực cho chủ.', price: 20000, reqLv: 100, tierIdx: 3, tierClass: 'text-emerald-400' };
        DB_ITEMS['ppb_3'] = { name: 'Sách Bị Động Thú: Thần Ẩn', type: 'pet_passive_book', stat: 'dodge', val: 0.02, desc: 'Cho thú cưng học. Bị động: +2% Né Tránh cho chủ.', price: 25000, reqLv: 100, tierIdx: 3, tierClass: 'text-emerald-400' };

        // 3. Cho Thú Cưỡi
        DB_ITEMS['mpb_1'] = { name: 'Sách Bị Động Kỵ: Tật Phong Bộ', type: 'mount_passive_book', stat: 'dodge', val: 0.03, desc: 'Cho thú cưỡi học. Bị động: +3% Né Tránh cho chủ.', price: 20000, reqLv: 100, tierIdx: 3, tierClass: 'text-indigo-400' };
        DB_ITEMS['mpb_2'] = { name: 'Sách Bị Động Kỵ: Tàn Sát Nhai', type: 'mount_passive_book', stat: 'crit', val: 0.03, desc: 'Cho thú cưỡi học. Bị động: +3% Bạo Kích cho chủ.', price: 20000, reqLv: 100, tierIdx: 3, tierClass: 'text-indigo-400' };
        DB_ITEMS['mpb_3'] = { name: 'Sách Bị Động Kỵ: Man Ngưu Lực', type: 'mount_passive_book', stat: 'atkM', val: 0.05, desc: 'Cho thú cưỡi học. Bị động: +5% Lực Chiến cho chủ.', price: 25000, reqLv: 100, tierIdx: 3, tierClass: 'text-indigo-400' };
        
        DB_MAPS.forEach(map => {
            map.dropPool = []; map.bossDropPool = [];
            
            let mapBaseTier = 0;
            for (let i = GEN_TIERS.length - 1; i >= 0; i--) {
                let tierReqLv = DB_REALMS[i] ? DB_REALMS[i].level : 50000;
                if (map.minLv >= tierReqLv) { mapBaseTier = i; break; }
            }
            map.baseTier = mapBaseTier;

            Object.keys(DB_ITEMS).forEach(key => {
                let item = DB_ITEMS[key];
                let iTier = item.tierIdx !== undefined ? item.tierIdx : 0;
                
                // Quái thường: CHỈ rớt đồ chuẩn cấp độ của Map hiện tại
                if (iTier === mapBaseTier) {
                    if (['consumable', 'material', 'weapon', 'talisman', 'armor', 'cloth', 'helmet', 'glove', 'boots', 'skill_book'].includes(item.type)) map.dropPool.push(key);
                }
                
                // Boss Pool: Chứa đồ cấp cao hơn 1 bậc
                if (iTier === Math.min(GEN_TIERS.length - 1, mapBaseTier + 1)) {
                    if (['consumable', 'material', 'weapon', 'talisman', 'armor', 'cloth', 'helmet', 'glove', 'boots', 'skill_book'].includes(item.type)) map.bossDropPool.push(key);
                }
            });
            
            if (map.dropPool.length === 0) map.dropPool = ['hp1', 'mp1'];
            if (map.bossDropPool.length === 0) map.bossDropPool = map.dropPool;
        });

        const SAVE_KEY = 'cuuthien_save_mobile_v12_drop_fix';

        const DB_SECTS = [
            { id: 'none', name: 'Không Thuộc Môn Phái', reqLv: 1, color: 'text-slate-400', desc: 'Chưa gia nhập môn phái nào.', bonus: {}, bossName: 'Không có' },
            { id: 'thao_duong', name: 'Thảo Đường', reqLv: 1, color: 'text-emerald-400', desc: 'Tăng HP và tốc độ tu hành.', bonus: { hpBonus: 1200, expRate: 0.03 }, bossName: 'Hỏa Ma Thảo Quân' },
            { id: 'bac_minh', name: 'Bắc Minh', reqLv: 20, color: 'text-cyan-400', desc: 'Tăng bạo kích và sát khí.', bonus: { crit: 0.04, atkBonus: 400 }, bossName: 'Bắc Minh Huyền Vũ' },
            { id: 'ngoc_long', name: 'Ngọc Long', reqLv: 100, color: 'text-purple-400', desc: 'Tăng phòng thủ và khí vận.', bonus: { defBonus: 500, luck: 0.04 }, bossName: 'Ngọc Long Tử' },
            { id: 'thien_van', name: 'Thiên Vân', reqLv: 300, color: 'text-sky-400', desc: 'Tăng tốc độ nhận tài nguyên.', bonus: { resourceBonus: 0.08, expRate: 0.04 }, bossName: 'Thiên Vân Đế Tinh' },
            { id: 'huyen_ton', name: 'Huyền Tôn', reqLv: 800, color: 'text-fuchsia-400', desc: 'Tăng sức mạnh linh khí.', bonus: { atkBonus: 1000, hpBonus: 2000 }, bossName: 'Huyền Tôn Cửu Vĩ' },
            { id: 'van_mong', name: 'Vân Mộng', reqLv: 2000, color: 'text-indigo-400', desc: 'Tăng né tránh và EXP.', bonus: { dodge: 0.03, expRate: 0.06 }, bossName: 'Vân Mộng Đạo Tổ' },
            { id: 'hư_không', name: 'Hư Không', reqLv: 5000, color: 'text-amber-400', desc: 'Tăng toàn bộ chỉ số.', bonus: { atkBonus: 2500, hpBonus: 4000, crit: 0.05, dodge: 0.03 }, bossName: 'Hư Không Quỷ Vương' },
            { id: 'dao_to', name: 'Đạo Tổ', reqLv: 12000, color: 'text-rose-400', desc: 'Đế cấp, tăng mạnh tất cả.', bonus: { atkBonus: 8000, hpBonus: 12000, crit: 0.08, dodge: 0.05, expRate: 0.1, luck: 0.08 }, bossName: 'Đạo Tổ Thượng Thiên' },
            { id: 'thien_canh', name: 'Thiên Cảnh', reqLv: 40000, color: 'text-yellow-300', desc: 'Tăng cường mọi đường tu tiên.', bonus: { atkBonus: 15000, hpBonus: 22000, crit: 0.1, dodge: 0.06, expRate: 0.12, luck: 0.1 }, bossName: 'Thiên Cảnh Vô Thượng' }
        ];
        const SECT_RANKS = [
            { id: 'misc_disciple', name: 'Đệ Tử Tạp Dịch', minLv: 1, color: 'text-slate-400' },
            { id: 'outer_disciple', name: 'Đệ Tử Ngoại Môn', minLv: 20, color: 'text-emerald-400' },
            { id: 'inner_disciple', name: 'Đệ Tử Nội Môn', minLv: 80, color: 'text-cyan-400' },
            { id: 'outer_elder', name: 'Trưởng Lão Ngoại Môn', minLv: 250, color: 'text-indigo-400' },
            { id: 'inner_elder', name: 'Trưởng Lão Nội Môn', minLv: 800, color: 'text-fuchsia-400' },
            { id: 'grand_elder', name: 'Đại Trưởng Lão', minLv: 2000, color: 'text-amber-400' },
            { id: 'leader', name: 'Môn Chủ', minLv: 5000, color: 'text-rose-400' }
        ];
