const defaultState = {name: 'Vô Danh', lv: 1, highestLv: 1, exp: 0, coins: 500, hp: 100, mp: 50, mapId: 0, towerFloor: 1, realmStage: 1,
            wood: 0, herb: 0, iron: 0, 
            sp: 0, attributePoints: 0, attributes: { atk: 0, hp: 0, def: 0 }, skillLevels: {}, natalWeapon: { unlocked: false, lv: 0 },
            estate: { woodLv: 1, herbLv: 1, ironLv: 1, furnaceLv: 1 }, 
            bodhiTree: { level: 0, exp: 0 },
            primal: 0,
            tuvi: 0,
            roots: { kim: 1, moc: 1, thuy: 1, hoa: 1, tho: 1 }, 
            meridians: { level: 0, node: 0 },
            inv: { 'hp1': 5, 'mp1': 5 }, pets: [], mounts: [], learnedSkills: [], 
            mountLevels: {}, petLevels: {}, enhanceLevels: {}, starLevels: {}, petEnhanceLevels: {}, mountEnhanceLevels: {}, petStarLevels: {}, mountStarLevels: {},
            petPassives: {}, mountPassives: {}, 
            equip: { weapon: null, talisman: null, armor: null, glove: null, cloth: null, helmet: null, boots: null, pet: null, mount: null, manual: null },
            pillsEaten: {}, meditation: { active: false, start: 0, lastTick: 0, hours: 0, rates: null },
            breakthrough: { active: false, start: 0, lastTick: 0, cycles: 0, targetCycles: 1, auto: false },
            autoOffline: { activeMode: null, lastSavedAt: Date.now() },
            clan: null,
            sect: null
        };

        function deepMergeState(baseState, incomingState = {}) {
            const clone = JSON.parse(JSON.stringify(baseState));
            for (const key of Object.keys(incomingState)) {
                if (incomingState[key] && typeof incomingState[key] === 'object' && !Array.isArray(incomingState[key]) && clone[key] && typeof clone[key] === 'object' && !Array.isArray(clone[key])) {
                    clone[key] = deepMergeState(clone[key], incomingState[key]);
                } else {
                    clone[key] = incomingState[key];
                }
            }
            return clone;
        }

        function ensureCompanionState() {
            if (!p) return;
            if (!p.equip) p.equip = { weapon: null, talisman: null, armor: null, glove: null, cloth: null, helmet: null, boots: null, pet: null, mount: null, manual: null };
            p.equip.pet = p.equip.pet || null;
            p.equip.mount = p.equip.mount || null;
            if (!p.pets) p.pets = [];
            if (!p.mounts) p.mounts = [];
            p.pets = [...new Set((p.pets || []).filter(Boolean))];
            p.mounts = [...new Set((p.mounts || []).filter(Boolean))];
            if (!p.petLevels) p.petLevels = {};
            if (!p.mountLevels) p.mountLevels = {};
            if (!p.petEnhanceLevels) p.petEnhanceLevels = {};
            if (!p.mountEnhanceLevels) p.mountEnhanceLevels = {};
            if (!p.petStarLevels) p.petStarLevels = {};
            if (!p.mountStarLevels) p.mountStarLevels = {};
            if (!p.petPassives) p.petPassives = {};
            if (!p.mountPassives) p.mountPassives = {};

            p.pets.forEach(id => {
                if (!p.petLevels[id]) p.petLevels[id] = 1;
                if (!p.petEnhanceLevels[id]) p.petEnhanceLevels[id] = 0;
                if (!p.petStarLevels[id]) p.petStarLevels[id] = 0;
                if (!p.petPassives[id]) p.petPassives[id] = {};
            });
            p.mounts.forEach(id => {
                if (!p.mountLevels[id]) p.mountLevels[id] = 1;
                if (!p.mountEnhanceLevels[id]) p.mountEnhanceLevels[id] = 0;
                if (!p.mountStarLevels[id]) p.mountStarLevels[id] = 0;
                if (!p.mountPassives[id]) p.mountPassives[id] = {};
            });
        }

        let p = deepMergeState(defaultState, {});
        let isCombat = false;
        let isAutoExploring = false;
        let isAutoTower = false;
        let activeShopCategory = 'skill_book'; 
        let autoExploreInterval = null;
        let autoTowerInterval = null;
        let isAutoMeridian = false;
        let autoMeridianInterval = null;
        let isAutoBreakthrough = false;
        let autoBreakthroughInterval = null;
        let breakthroughInterval = null;
        let isAutoWorldBoss = false;
        let autoWorldBossInterval = null;

        let activeInvCategory = 'all';
        const invCategories = [
            { id: 'all', title: 'Tất Cả' },
            { id: 'skill_book', title: 'Bí Kíp' },
            { id: 'consumable', title: 'Tiên Đan' },
            { id: 'weapon', title: 'Khí Cụ' },
            { id: 'talisman', title: 'Bùa Chú' },
            { id: 'armor', title: 'Giáp' },
            { id: 'cloth', title: 'Áo' },
            { id: 'helmet', title: 'Nón' },
            { id: 'glove', title: 'Tay' },
            { id: 'boots', title: 'Giày' },
            { id: 'pet', title: 'Linh Thú' },
            { id: 'mount', title: 'Tọa Kỵ' },
            { id: 'pet_item', title: 'Tiên Thú Đan' },
            { id: 'pet_book', title: 'Thú Quyết' }
        ];
