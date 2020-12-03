/**
*	@filename	PhysicalRunewords.js
*	@author		Adpist
*	@desc		Basic physical runewords profile
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var RunewordProfile = {
	runes: {
		stock: true, //pre stock runes before finding base
		stockAllRecipes: false //pre stock runes for each runeword recipe
	},
	
	character : { //Character Runewords
		"armor" : {
			"nm_smoke" : {
				runeword: Runeword.Smoke,
				sockets: 2,
				bases: ["Ghost Armor", "Serpentskin Armor", "Demonhide Armor", "Cuirass", "Mage Plate"],
				cubeBase: false,
				roll: Roll.All,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] == 50 && [LightResist] == 50",
				tier: 1000,
				skipIf: ""
			},
			"hell_smoke" : {
				runeword: Runeword.Smoke,
				sockets: 2,
				bases: ["Dusk Shroud", "Wyrmhide", "Scarab Husk", "Wire Fleece", "Great Hauberk", "Boneweave", "Archon Plate"],
				cubeBase: false,
				roll: Roll.All,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] == 50 && [LightResist] == 50",
				tier: 2000,
				skipIf: ""
			}
		},
		
		"weapon": {
			"Strength_Normal" :{
				runeword: Runeword.Strength,
				sockets: 2,
				bases: ["Maul"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				typeCondition: "[name] == maul",
				qualityCondition: "[quality] <= superior",
				statCondition: "[strength] == 20",
				tier: 5000,
				skipIf: ""
			},
			
			"Strength_Nightmare" :{
				runeword: Runeword.Strength,
				sockets: 2,
				bases: ["War Club"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				typeCondition: "[name] == warclub",
				qualityCondition: "[quality] <= superior",
				statCondition: "[strength] == 20",
				tier: 6000,
				skipIf: ""
			},
			
			"Strength_Hell" :{
				runeword: Runeword.Strength,
				sockets: 2,
				bases: ["Ogre Maul"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				typeCondition: "[name] == ogremaul",
				qualityCondition: "[quality] <= superior",
				statCondition: "[strength] == 20",
				tier: 7000,
				skipIf: ""
			},
			
			"Black_Normal" :{
				runeword: Runeword.Black,
				sockets: 3,
				bases: ["Maul"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Weapon,
				roll: Roll.NonEth,
				typeCondition: "[name] == maul",
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 15",
				tier: 5500,
				skipIf: ""
			},
			
			"Black_Nightmare" :{
				runeword: Runeword.Black,
				sockets: 3,
				bases: ["War Club"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Weapon,
				roll: Roll.NonEth,
				typeCondition: "[name] == warclub",
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 15",
				tier: 6500,
				skipIf: ""
			},
			
			"Black_Hell" :{
				runeword: Runeword.Black,
				sockets: 3,
				bases: ["Ogre Maul"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Weapon,
				roll: Roll.NonEth,
				typeCondition: "[name] == ogremaul",
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 15",
				tier: 7500,
				skipIf: ""
			}
		},
		
		"helm" : {
			"Lore" : {
				runeword: Runeword.Lore,
				sockets: 2,
				bases: ["Crown", "Mask","Bone Helm"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[LightResist] >= 25",
				tier: 75,
				skipIf: ""
			},
			"higher_Lore" : {
				runeword: Runeword.Lore,
				sockets: 2,
				bases: ["War Hat", "Grim Helm","Grand Crown", "Demonhead", "Bone Visage"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[LightResist] >= 25",
				tier: 120,
				skipIf: ""
			}
		}
	},
	
	merc: { //Merc runewords
		"polearm" : {
			"normal_insight" : {
				runeword: Runeword.Insight,
				sockets: 4,
				bases: ["Poleaxe", "Halberd"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.All,
				qualityCondition: "[quality] <= superior",
				statCondition: "[Meditationaura] <= 17",
				tier: 50000000, //Normal insig
				skipIf: ""
			},
			
			"nm_insight" : {
				runeword: Runeword.Insight,
				sockets: 4,
				bases: ["Bill", "Battle Scythe", "Partizan", "Bec De Corbin"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.All,
				qualityCondition: "[quality] <= superior",
				statCondition: "[Meditationaura] <= 17",
				tier: 100000000,
				skipIf: ""
			},
			
			"hell_insight" : {
				runeword: Runeword.Insight,
				sockets: 4,
				bases: ["Thresher", "Cryptic Axe", "Great Poleaxe", "Giant Thresher"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.All,
				qualityCondition: "[quality] <= superior",
				statCondition: "[Meditationaura] <= 17",
				tier: 150000000,
				skipIf: ""
			},
			
			"hell_insight_endgame" : {
				runeword: Runeword.Insight,
				sockets: 4,
				bases: ["Thresher", "Cryptic Axe", "Great Poleaxe", "Giant Thresher"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Weapon,
				roll: Roll.Eth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[Meditationaura] == 17",
				tier: 200000000,
				skipIf: ""
			}
		},
		
		"armor" : {
			"treachery_noneth" : {
				runeword: Runeword.Treachery,
				sockets: 3,
				bases: ["Dusk Shroud", "Wyrmhide", "Scarab Husk", "Wire Fleece", "Great Hauberk", "Boneweave", "Archon Plate"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 45",
				tier: 50000000, //non eth threachery
				skipIf: ""
			},
			
			"treachery_eth" : {
				runeword: Runeword.Treachery,
				sockets: 3,
				bases: ["Dusk Shroud", "Wyrmhide", "Scarab Husk", "Wire Fleece", "Great Hauberk", "Boneweave", "Archon Plate"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.Eth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 45",
				tier: 100000000, //eth threachery
				skipIf: ""
			}
		}
	}
};