/** ChainLight Sorceress Build
 */
js_strict(true);

if (!isIncluded("common/Cubing.js")) {
    include("common/Cubing.js");
};
if (!isIncluded("common/Prototypes.js")) {
    include("common/Prototypes.js");
};
if (!isIncluded("common/Runewords.js")) {
    include("common/Runewords.js");
};

var AutoBuildTemplate = {

    1: {
        //SkillPoints: [-1],										// This doesn't matter. We don't have skill points to spend at lvl 1
        //StatPoints: [-1,-1,-1,-1,-1],								// This doesn't matter. We don't have stat points to spend at lvl 1
        Update: function() {
            Config.TownCheck = false; // Don't go to town for more potions
            Config.StashGold = 200; // Minimum amount of gold to stash.
            Config.AttackSkill = [-1, 36, -1, 36, -1, 0, 0]; // At level 1 we start with a +1 Fire Bolt staff
            Config.LowGold = 2000;

            Config.LowManaSkill = [0, 0]; // Hit stuff when out of Mana.
            Config.ScanShrines = [15, 13, 12, 14, 7, 6, 3, 2, 1];
            Config.BeltColumn = ["hp", "hp", "hp", "hp"]; // Keep tons of health potions!
            Config.MinColumn = [0, 0, 0, 0];
            Config.OpenChests = false;								// Might as well open em.
            Config.Cubing = false; // Don't cube yet!
            Config.HPBuffer = 4; // Number of healing potions to keep in inventory.
            Config.MPBuffer = 4; // Number of healing potions to keep in inventory.
            Config.RejuvBuffer = 4; // Number of rejuvenation potions to keep in inventory.
            Config.UseMerc = true; // Use merc. This is ignored and always false in d2classic.
            Config.MercWatch = false; // Instant merc revive during battle.
            Config.HealHP = 95; // Go to a healer if under designated percent of life.
            Config.HealMP = 90; // Go to a healer if under designated percent of mana.
        }
    },

    2: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.AttackSkill = [-1, 39, -1, 39, -1, 0, 0];		// Ice Bolt

            Config.BeltColumn = ["hp", "hp", "mp", "mp"];
        }
    },

    5: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.ScanShrines = [15, 13, 12];
            Config.MinColumn = [1, 1, 1, 0];
        }
    },

    6: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            //	Config.CastStatic = 70; 								// Cast static until the target is at designated life percent. 100 = disabled.
        }
    },

    7: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            //Config.PickitFiles.splice(Config.PickitFiles.indexOf("belowlevelseven.nip"), 1);	// Will remove index "belowlevel7.nip" from Config.PickitFiles
        }
    },


    10: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 5000;
            Config.AttackSkill = [-1, 45, -1, 45, -1, 42, -1];		// ice blast
        }
    },

    15: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            //	Config.CastStatic = 20; 								// Cast static until the target is at designated life percent. 100 = disabled.
            //	Config.OpenChests = false;								// Eyes on the prize!
        }
    },

    16: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.TownCheck = true; // Do go to town for more potions
        }
    },

    18: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
			Config.AttackSkill = [-1, 45, -1, 55, -1, 42, -1];		// Glacial Spike / ice blast
            Config.LowManaSkill = [-1, -1]; //
            Config.HPBuffer = 6; // Number of healing potions to keep in inventory.
            Config.MPBuffer = 10; // Number of healing potions to keep in inventory.

        }
    },

    20: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 10000;
        }
    },

    24: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
			Config.AttackSkill = [-1, 59, 45, 59, 55, 42, -1];		// add Blizzard
            Config.Cubing = true; // Will have a cube by now.
        }
    },

    25: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 15000;
        }
    },

    28: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.BeltColumn = ["hp", "mp", "mp", "rv"]; // Start keeping rejuvs
        }
    },

    30: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 20000;
        }
    },

    35: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 30000;
        }
    },

    37: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.Dodge = true;
        }
    },

    40: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 35000;
        }
    },

    41: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.MPBuffer = 12; // Number of healing potions to keep in inventory.
        }
    },

    45: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 40000;
        }
    },


    50: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 45000;
			Config.AttackSkill = [-1, 59, 45, 59, 55, -1, -1];		// remove static
        }
    },

    55: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 50000;
        }
    },

    60: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 55000;
        }
    },

    65: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 60000;
        }
    },

    70: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.LowGold = 100000;
        }
    },

    80: {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.Gamble = true; // Time to spend dat ca$h!!
            //Config.ScanShrines	= [];
        }
    },

};