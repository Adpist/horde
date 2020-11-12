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
			"den": 			{skipIf:"!Party.hasReachedLevel(77)"},
			"cain": 		{},
			"countess": 	{skipIf:"!Party.hasReachedLevel(82)"},
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
			"kurastchests": {}, //MF
			"travincal": 	{},
			"mephisto": 	{},

			//Act 4
			"izual": 		{skipIf: "!Party.hasReachedLevel(82)"},
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
			"tombs": 		{skipIf: "Party.hasReachedLevel(24)"}, //Levelling

			//Act 3
			//TODO Leveling if<24 in kurast
			"mephisto": 	{skipIf: "Party.hasReachedLevel(24)"}, //Levelling

			//Act 4
			"cows": 		{skipIf: "Party.hasReachedLevel(31)"},
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
			//"andy": 		{}, //MF TODO start / stop when past duriel

			//Act 2
			//"duriel": 		{}, //MF TODO stop when past trav or duriel?

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
			"tombs": 		{skipIf: "Party.hasReachedLevel(24)"}, //Levelling
			"duriel": 		{skipIf: "Party.hasReachedLevel(24)"}, //Levelling

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},
			"cows": 		{skipIf: "Party.hasReachedLevel(36)"},
			"diablo": 		{skipIf:"Party.hasReachedLevel(36)"}//,
			//"worldstone": {skipIf:"!Party.hasReachedLevel(36)"} //Levelling add this to make game longer
		},

		1: { //Nightmare
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},//,//Levelling
			//"cows": 		{skipIf:"Party.hasReachedLevel(72)"},
			"diablo": 		{skipIf:"Party.hasReachedLevel(64)"}, //Levelling
			"countess": 	{} //MF
			//"worldstone": {skipIf:"!Party.hasReachedLevel(70)"} //Levelling add this to make game longer
		},

		2: { //Hell
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"baal": 		{},//,//Levelling
			"cows": 		{skipIf:"Party.hasReachedLevel(90)"},
			"diablo": 		{}, //Levelling
			///"countess": 	{}, //MF skip if baal Q beat
			//"worldstone": 	{skipIf:"!Party.hasReachedLevel(94)"} //Levelling
			// TODO worldstone sequence for exp/items
		}
	}
};
