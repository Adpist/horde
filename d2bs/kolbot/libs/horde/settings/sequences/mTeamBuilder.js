/**
*	@filename	mTeamBuilder.js
*	@author		M
*	@desc		Designed for a team (built around p8) to go from Lvl 1 to Hell Baal mixing MF / Leveling / Questing
*				Should contain most available sequences (if possible)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const Sequences = {
	//Quest sequence - Don't remove mandatory quests
	quests: {
		0: { //Normal
			//Act 1
			"den": 			{},
			"cave": 		{skipIf: "Party.hasReachedLevel(8)"},
			"cain": 		{},
			"countess": 	{},
			"andy": 		{},

			//Act 2
			"cube": 		{},
			"amulet": 		{stopAfterIf:"!Party.hasReachedLevel(18)"},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{},
			"duriel": 		{},

			//Act 3
			"eye": 			{},
			"heart": 		{},
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{},

			//Act 4
			"izual": 		{},
			"diablo": 		{stopAfterIf:"!Party.hasReachedLevel(27)"},

			//Act 5
			"shenk": 		{},
			"barbrescue": 	{},
			"anya": 		{},
			"ancients": 	{},
			"baal": 		{},
		},

		1: { //Nightmare
			//Act 1
			"den": 			{},
			"cain": 		{},
			"countess": 	{},
			"andy": 		{},

			//Act 2
			"cube": 		{},
			"amulet": 		{},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{},
			"duriel": 		{},

			//Act 3
			"eye": 			{},
			"heart": 		{},
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{},

			//Act 4
			"izual": 		{},
			"diablo": 		{},

			//Act 5
			"barbrescue": 	{skipIf: "!Party.hasReachedLevel(65)"},
			"anya": 		{},
			"ancients": 	{},
			"baal": 		{},
		},

		2: { //Hell
			//Act 1
			"den": 			{},
			"cain": 		{},
			"countess": 	{},
			"andy": 		{},

			//Act 2
			"cube": 		{},
			"amulet": 		{},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{skipIf: "!Party.hasReachedLevel(80)"},
			"duriel": 		{},

			//Act 3
			"eye": 			{},
			"heart": 		{},
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{},

			//Act 4
			"izual": 		{skipIf: "!Party.hasReachedLevel(80)"},
			"diablo": 		{},

			//Act 5
			"anya": 		{},
			"ancients": 	{},
			"baal": 		{},
		}
	},

	//Play those sequences before the quest sequences when starting a game
	beforeQuests: {
		0: { //Normal
			//Act 1
			"trist": 		{skipIf: "Party.hasReachedLevel(11)"}, //Levelling
			"andy": 		{skipIf: "Party.hasReachedLevel(16)"}, //Levelling

			//Act 2
			//TODO Leveling if <18
			"tombs": 		{skipIf: "Party.hasReachedLevel(22)"}, //Levelling

			//Act 3
			//TODO Leveling if<24
			"travincal": 	{skipIf: "Party.hasReachedLevel(22)"}, //Levelling
			"mephisto": 	{skipIf: "Party.hasReachedLevel(24)"}, //Levelling

			//Act 4
			"diablo": 		{skipIf: "Party.hasReachedLevel(30)"} //Levelling

			//Act 5
		},

		1: { //Nightmare
			//Act 1
			"andy": 		{}, //MF

			//Act 2

			//Act 3
			"mephisto": 	{} //MF

			//Act 4

			//Act 5
		},

		2: { //Hell
			//Act 1
			//"pits": 	{}, //MF TODO stop when past trav / start?
			"andy": 		{}, //MF

			//Act 2
			"duriel": 		{}, //MF TODO stop when past trav?

			//Act 3
			"mephisto": 	{} //MF

			//Act 4

			//Act 5

		}
	},

	//Play those sequences after the quest sequences before finishing a game
	afterQuests: {
		0: { //Normal
			//Act 1

			//Act 2
			"tombs": 		{skipIf: "Party.hasReachedLevel(23)"}, //Levelling
			"duriel": 		{skipIf: "Party.hasReachedLevel(23)"}, //Levelling

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},
			"diablo": 		{skipIf:"Party.hasReachedLevel(35)"}//,//Levelling
			//"worldstone": 		{skipIf:"!Party.hasReachedLevel(35)"} //Levelling
		},

		1: { //Nightmare
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},//,//Levelling
			"diablo": 		{skipIf:"Party.hasReachedLevel(64)"}, //Levelling
			"countess": 	{} //MF
			//"worldstone": 		{skipIf:"!Party.hasReachedLevel(60)"} //Levelling
			// TODO worldstone sequence for exp/items
		},

		2: { //Hell
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},//,//Levelling
			"diablo": 		{}, //Levelling
			"countess": 	{} //MF skip if baal Q beat
			//"worldstone": 		{} //Levelling
			// TODO worldstone sequence for exp/items
		}
	}
};
