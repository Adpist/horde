/**
*	@filename	SmiterRunewords.js
*	@author		Adpist
*	@desc		Smiter runewords
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
				tier: 9000,
				skipIf: ""
			}
		},
		
		"weapon" : {
			"black" : {
				runeword: Runeword.Black,
				sockets: 3,
				bases: ["Flail"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				typeCondition : "[name] == flail",
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] == 15",
				tier: 10000,
				skipIf: ""
			},
			
			"grief" : {
				runeword: Runeword.Grief,
				sockets: 5,
				bases: ["Phase Blade"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				typeCondition : "[name] == phaseblade",
				qualityCondition: "[quality] <= superior",
				statCondition: "[ias] >= 30",
				tier: 15000,
				skipIf: ""
			}
		},
		
		"auricshields" : {
			"normal_rhyme" : {
				runeword: Runeword.Rhyme,
				sockets: 2,
				bases: ["Targe", "Rondache", "Aerin Shield", "Crown Shield","Heraldic Shield","Aerin Shield"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 25 && [LightResist] >= 25",
				tier: 250,
				skipIf: ""
			},
			
			"normal_ancients_pledge" : {
				runeword: Runeword.AncientsPledge,
				sockets: 3,
				bases: ["Targe", "Rondache", "Aerin Shield", "Crown Shield","Heraldic Shield","Aerin Shield"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 40 && [LightResist] >= 40",
				tier: 5000,
				skipIf: ""
			},
			"nightmare_ancients_pledge" : {
				runeword: Runeword.AncientsPledge,
				sockets: 3,
				bases: ["Royal Shield","Akaran Targe", "Akaran Rondache", "Protector Shield", "Gilded Shield"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 40 && [LightResist] >= 40",
				tier: 6000,
				skipIf: ""
			},
			"hell_ancients_pledge" : {
				runeword: Runeword.AncientsPledge,
				sockets: 3,
				bases: ["Sacred Targe", "Sacred Rondache"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 40 && [LightResist] >= 40",
				tier: 7000,
				skipIf: ""
			},
			
			"hell_rhyme" : {
				runeword: Runeword.Rhyme,
				sockets: 2,
				bases: ["Sacred Targe"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: false,
				roll: Roll.NonEth,
				baseCondition: "[fireresist] >= 25",
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 50 && [LightResist] >= 50",
				tier: 8000,
				skipIf: ""
			},
			
			"good_hell_rhyme" : {
				runeword: Runeword.Rhyme,
				sockets: 2,
				bases: ["Sacred Targe"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Shield,
				roll: Roll.NonEth,
				baseCondition: "[fireresist] >= 40",
				qualityCondition: "[quality] <= superior",
				statCondition: "[FireResist] >= 65 && [LightResist] >= 65",
				tier: 10000,
				skipIf: ""
			},
			
			"exile" : {
				runeword: Runeword.Exile,
				sockets: 4,
				bases: ["Sacred Targe"], //capitals and spaces (ex : "Giant Thresher")
				cubeBase: true,
				recipeType: Recipe.Socket.Shield,
				roll: Roll.Eth,
				baseCondition: "[fireresist] >= 40",
				qualityCondition: "[quality] <= superior",
				statCondition: "[defianceaura] >= 13",
				tier: 15000,
				skipIf: ""
			},
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
				tier: 115,
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
				tier: 50000000,
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