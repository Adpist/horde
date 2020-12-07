/** Meteor Skill Sorceress Build

	Attack Config Variables For Sorceress
	---------------------------------------------------------------------------------------------------------------------
	Config.AttackSkill[0] = -1; // Preattack skill.
	Config.AttackSkill[1] = 56; // Primary skill to bosses.
	Config.AttackSkill[2] = 42; // Primary untimed skill to bosses. Keep at -1 if Config.AttackSkill[1] is untimed skill.
	Config.AttackSkill[3] = 56; // Primary skill to others.
	Config.AttackSkill[4] = 42; // Primary untimed skill to others. Keep at -1 if Config.AttackSkill[3] is untimed skill.
	Config.AttackSkill[5] = -1; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = -1; // Secondary untimed skill if monster is immune to primary untimed.
*/
js_strict(true);

if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };
if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };
if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };

var AutoBuildTemplate = {

	1:	{
			//SkillPoints: [-1],										// This doesn't matter. We don't have skill points to spend at lvl 1
			//StatPoints: [-1,-1,-1,-1,-1],								// This doesn't matter. We don't have stat points to spend at lvl 1
			Update: function () {
				Config.TownCheck		= false;						// Don't go to town for more potions
				Config.StashGold 		= 200;							// Minimum amount of gold to stash.
				Config.AttackSkill		= [-1, 36, -1, 36, -1, 0, 0];	// At level 1 we start with a +1 Fire Bolt staff
				Config.LowManaSkill		= [0, 0];						// Hit stuff when out of Mana.
				Config.ScanShrines		= [15, 13, 12, 14, 7, 6, 3, 2, 1];
				Config.BeltColumn		= ["hp", "hp", "hp", "hp"];		// Keep tons of health potions!
				Config.MinColumn 		= [0, 0, 0, 0];
			}
		},

	2:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.AttackSkill = [-1, 36, -1, 36, -1, 0, 0];		// Fire Bolt
				Config.BeltColumn = ["hp", "hp", "mp", "mp"];
			}
		},

	3:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	4:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	5:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.ScanShrines = [15, 13, 12];
				Config.MinColumn = [1, 1, 1, 0];
			}
		},

	6:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
			//	Config.CastStatic = 70; 								// Cast static until the target is at designated life percent. 100 = disabled.
			}
		},

	7:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				//Config.PickitFiles.splice(Config.PickitFiles.indexOf("belowlevelseven.nip"), 1);	// Will remove index "belowlevel7.nip" from Config.PickitFiles
			}
		},

	8:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	9:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	10:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 5000;
			}
		},

	11:	{
			SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	12:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.AttackSkill = [-1, 47, -1, 47, -1, 0, -1];		// Fire Ball
			}
		},

	13:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	14:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	15:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
			//	Config.CastStatic = 20; 								// Cast static until the target is at designated life percent. 100 = disabled.
			//	Config.OpenChests = false;								// Eyes on the prize!
			}
		},

	16:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.TownCheck = true;								// Do go to town for more potions
			}
		},

	17:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	18:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	19:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	20:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 10000;
			}
		},

	21:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	22:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	23:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	24:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.AttackSkill = [-1, 56, 47, 56, 47, 42,-1];		// Meteor + Fire Ball
				Config.Cubing = true;									// Will have a cube by now.
					Config.LowManaSkill = [-1, -1];							// Ice Bolt when low Mana.
			}
		},

	25:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 15000;
			}
		},

	26:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	27:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	28:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.BeltColumn = ["hp", "mp", "mp", "rv"]; 			// Start keeping rejuvs
			}
		},

	29:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	30:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 20000;
			}
		},

	31:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	32:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	33:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	34:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	35:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 30000;
			}
		},

	36:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	37:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.Dodge = true;
			}
		},

	38:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	39:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	40:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 35000;
			}
		},

	41:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	42:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	43:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	44:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	45:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 40000;
			}
		},

	46:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	47:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	48:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	49:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	50:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 45000;
			}
		},

	51:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	52:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	53:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	54:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	55:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 50000;
			}
		},

	56:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	57:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	58:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	59:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	60:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 55000;
			}
		},

	61:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	62:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	63:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	64:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	65:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 60000;
			}
		},

	66:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	67:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	68:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	69:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	70:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				Config.LowGold = 100000;
			}
		},

	71:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	72:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	73:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	74:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	75:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	76:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	77:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	78:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	79:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	80:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {
				//Config.ScanShrines	= [];
			}
		},

	81:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	82:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	83:	{
						SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	84:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	85:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	86:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	87:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	88:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	89:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	90:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	91:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	92:	{
				SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	93:	{
					SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	94:	{
			SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		},

	95:	{
			SkillPoints: [-1],											//
			StatPoints: [-1, -1, -1, -1, -1],								// Vitality + 5
			Update: function () {

			}
		},

	96:	{
			SkillPoints: [-1],											//
			StatPoints: [-1, -1, -1, -1, -1],								// Vitality + 5
			Update: function () {

			}
		},

	97:	{
			SkillPoints: [-1],											//
			StatPoints: [-1, -1, -1, -1, -1],								// Vitality + 5
			Update: function () {

			}
		},

	98:	{
			SkillPoints: [-1],											//
			StatPoints: [-1, -1, -1, -1, -1],								// Vitality + 5
			Update: function () {

			}
		},

	99:	{
			SkillPoints: [-1],
			StatPoints: [-1, -1, -1, -1, -1],
			Update: function () {

			}
		}
};