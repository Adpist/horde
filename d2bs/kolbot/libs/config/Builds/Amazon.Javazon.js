/** Javazon Build
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

var AutoBuildTemplate = {};

AutoBuildTemplate[1] = {
    //SkillPoints: [-1],										// This doesn't matter. We don't have skill points to spend at lvl 1
    //StatPoints: [-1,-1,-1,-1,-1],								// This doesn't matter. We don't have stat points to spend at lvl 1
    Update: function() {
        Config.TownCheck = false; // Don't go to town for more potions
        Config.StashGold = 200; // Minimum amount of gold to stash.
        Config.AttackSkill = [-1, 0, 0, 0, 0, -1, -1];
        Config.LowManaSkill = [0, -1]; // Hit stuff when out of Mana.
        Config.ScanShrines = [15, 13, 12, 14, 7, 6, 3, 2, 1];
        Config.BeltColumn = ["hp", "hp", "hp", "hp"]; // Keep tons of health potions!
        Config.MinColumn = [0, 0, 0, 0];
        Config.OpenChests = false; // Might as well open em.
        Config.HPBuffer = 4; // Number of healing potions to keep in inventory.
        Config.MPBuffer = 4; // Number of healing potions to keep in inventory.
        Config.RejuvBuffer = 4; // Number of rejuvenation potions to keep in inventory.
        Config.UseMerc = true; // Use merc. This is ignored and always false in d2classic.
        Config.MercWatch = false; // Instant merc revive during battle.
        Config.HealHP = 95; // Go to a healer if under designated percent of life.
        Config.HealMP = 90; // Go to a healer if under designated percent of mana.
        Config.LowGold = 1000;
        Config.UseHP = 75; // Drink a healing potion if life is under designated percent.
        Config.UseRejuvHP = 50; // Drink a rejuvenation potion if life is under designated percent.
        Config.UseMP = 35; // Drink a mana potion if mana is under designated percent.
        Config.UseRejuvMP = 0; // Drink a rejuvenation potion if mana is under designated percent.
        Config.UseMercHP = 40; // Give a healing potion to your merc if his/her life is under designated percent.
        Config.UseMercRejuv = 0; // Give a rejuvenation potion to your merc if his/her life is under designated percent.
        Config.LifeChicken = 10; // Exit game if life is less or equal to designated percent.
        Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
        Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
        Config.TownHP = 35; // Go to town if life is under designated percent.
        Config.TownMP = 0; // Go to town if mana is under designated percent.
        Config.PickRange = 30; // Pick radius
        Config.FastPick = false; // Check and pick items between attacks
        Config.Dodge = true; // Move away from monsters that get too close. Don't use with short-ranged attacks like Poison Dagger.
        Config.DodgeRange = 10; // Distance to keep from monsters.
        Config.DodgeHP = 40; // Dodge only if HP percent is less than or equal to Config.DodgeHP. 100 = always dodge.
        Config.BossPriority = false; // Set to true to attack Unique/SuperUnique monsters first when clearing
        Config.ClearType = 0; // Monster spectype to kill in level clear scripts (ie. Mausoleum). 0xF = skip normal, 0x7 = champions/bosses, 0 = all
        Config.FCR = 0; // 0 - disable, 1 to 255 - set value of faster cast rate
        Config.FHR = 0; // 0 - disable, 1 to 255 - set value of faster hit recovery
        Config.FBR = 0; // 0 - disable, 1 to 255 - set value of faster block recovery
        Config.IAS = 0; // 0 - disable, 1 to 255 - set value of increased attack speed
        Config.PacketCasting = 0; // 0 = disable, 1 = packet teleport, 2 = full packet casting.
        Config.PacketShopping = false; // Use packets to shop. Improves shopping speed.
        Config.WaypointMenu = true;
        Config.PrimarySlot = -1; // Set to use specific weapon slot as primary weapon slot: -1 = disabled, 0 = slot I, 1 = slot II
        Config.MFSwitchPercent = 0; // Boss life % to switch to non-primary weapon slot. Set to 0 to disable.
        Config.AutoMap = true; // Set to true to open automap at the beginning of the game.
    }
};


AutoBuildTemplate[6] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.AttackSkill = [-1, 14, 0, 14, 0, 0, -1]; //power strike
        Config.MinColumn = [1, 1, 1, 0];
        Config.StashGold = 1000; // Minimum amount of gold to stash.
    }
};

AutoBuildTemplate[10] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 5000;
    }
};

AutoBuildTemplate[16] =

    {
        SkillPoints: [-1],
        StatPoints: [-1, -1, -1, -1, -1],
        Update: function() {
            Config.TownCheck = true; // Do go to town for more potions
        }
    };

AutoBuildTemplate[18] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.AttackSkill = [-1, 24, 0, 24, 0, 0, -1]; //charged strike
        Config.LowManaSkill = [-1, -1];
        Config.HPBuffer = 10; // Number of healing potions to keep in inventory.
    }
};
AutoBuildTemplate[20] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 10000;
        Config.StashGold = 5000; // Minimum amount of gold to stash.
    }
};
AutoBuildTemplate[24] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 15000;
    }
};

AutoBuildTemplate[30] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 20000;
        Config.MPBuffer = 6; // Number of mana potions to keep in inventory.
        Config.HPBuffer = 6; // Number of healing potions to keep in inventory.
        Config.BeltColumn = ["hp", "hp", "mp", "mp"];
    }
};

AutoBuildTemplate[35] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 30000;
        Config.StashGold = 10000; // Minimum amount of gold to stash.
    }
};
AutoBuildTemplate[37] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.Dodge = true;
        Config.DodgeRange = 10; // Distance to keep from monsters.
        Config.DodgeHP = 70; // Dodge only if HP percent is less than or equal to Config.DodgeHP. 100 = always dodge.
    }
};
AutoBuildTemplate[40] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 35000;
    }
};
AutoBuildTemplate[45] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.AttackSkill = [35, 35, 24, 35, 24, 10, -1]; //charged strike
		Config.LightningFuryDelay = 5; // Lightning fury interval in seconds. LF is treated as timed skill.
        Config.LowGold = 40000;
    }
};
AutoBuildTemplate[50] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 45000;
        Config.StashGold = 25000; // Minimum amount of gold to stash.
    }
};
AutoBuildTemplate[55] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 50000;
        Config.CainID.MinGold = 50000; // Minimum gold (stash + character) to have in order to use Cain.
    }
};
AutoBuildTemplate[60] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 55000;
    }
};
AutoBuildTemplate[65] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 60000;
    }
};
AutoBuildTemplate[70] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 100000;
        Config.UseHP = 90;
        Config.TownHP = 50;
        Config.MPBuffer = 2; // Number of mana potions to keep in inventory.
        Config.HPBuffer = 2; // Number of healing potions to keep in inventory.
    }
};

AutoBuildTemplate[80] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
        Config.LowGold = 250000;
    }
};

AutoBuildTemplate[85] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.LightningFuryDelay = 3.5; // Lightning fury interval in seconds. LF is treated as timed skill.
    }
};

AutoBuildTemplate[90] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.LightningFuryDelay = 2.5; // Lightning fury interval in seconds. LF is treated as timed skill.
    }
};

AutoBuildTemplate[95] = {
    SkillPoints: [-1],
    StatPoints: [-1, -1, -1, -1, -1],
    Update: function() {
		Config.LightningFuryDelay = 1.5; // Lightning fury interval in seconds. LF is treated as timed skill.
    }
};
