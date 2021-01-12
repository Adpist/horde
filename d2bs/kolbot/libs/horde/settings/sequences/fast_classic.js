/**
*	@filename	fast_classic.js
*	@author		Adpist
*	@desc		Designed for a team to go from Lvl 1 to Hell diablo mixing MF / Leveling / Questing
*	@credits	Adpist, Blacknight, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const Sequences = {
	//Quest sequence - Don't remove mandatory quests
	quests: {
		0: { //Normal
			//Act 1
			"den": 			{},
			"blood": 		{},
			"cave": 		{skipIf: "Party.hasReachedLevel(8)"},
			"cain": 		{},
			"countess": 	{},
			"andy": 		{},

			//Act 2
			"cube": 		{},
			"amulet": 		{},
			"radament": 	{stopAfterIf:"!Party.hasReachedLevel(18)"},
			"summoner": 	{},
			"staff": 		{},
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
			"travincal": 	{},
			"mephisto": 	{},

			//Act 4
			"izual": 		{skipIf: "!Party.hasReachedLevel(82)"},
			"diablo": 		{},
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
			"diablo": 		{skipIf: "Party.hasReachedLevel(35)"} //Levelling
		},

		1: { //Nightmare
			//Act 1
			"andy": 		{}, //MF

			//Act 2

			//Act 3
			"mephisto": 	{} //MF

			//Act 4

		},

		2: { //Hell
			//Act 1
			//"pits": 	{}, //MF TODO stop when past trav / start?
			"andy": 		{}, //MF TODO start / stop when past duriel
			//"countess": 	{},

			//Act 2
			"duriel": 		{}, //MF TODO stop when past trav or duriel?

			//Act 3
			"mephisto": 	{} //MF

			//Act 4

		}
	},

	//Play those sequences after the quest sequences before finishing a game
	afterQuests: {
		0: { //Normal
			//Act 1

			//Act 2
			"ancienttunnels": 	{skipIf: "Party.hasReachedLevel(18)"}, //Levelling
			"tombs": 		{skipIf: "Party.hasReachedLevel(24)"}, //Levelling
			"duriel": 		{skipIf: "Party.hasReachedLevel(24)"}, //Levelling

			//Act 3

			//Act 4
			"diablo": 		{skipIf:"Party.hasReachedLevel(40)"}
		},

		1: { //Nightmare
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"diablo": 		{skipIf:"Party.hasReachedLevel(72)"}, //Levelling
			"countess": 	{} //MF
		},

		2: { //Hell
			//Act 1

			//Act 2

			//Act 3

			//Act 4

			//Act 5
			"diablo": 		{}
		}
	}
};
