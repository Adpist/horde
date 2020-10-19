/**
*	@filename	default_xpac.js
*	@author		Adpist
*	@desc		Default Horde sequence profile 
*				Should contain most available sequences (if possible)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const Sequences = {
	//Quest sequence - Don't remove mandatory quests
	quests: {
		0: { //Normal
			//Act 1
			"den": 			{},
			"blood": 		{}, //optionnal
			"cain": 		{},
			"countess": 	{}, //optionnal
			"smith": 		{}, //optionnal
			"andy": 		{stopAfterIf:"!Party.hasReachedLevel(15)"},
			
			//Act 2
			"cube": 		{},
			"amulet": 		{stopAfterIf:"!Party.hasReachedLevel(18)"},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{}, //optionnal
			"duriel": 		{},
			
			//Act 3
			"figurine": 	{}, //optionnal
			"lamesen": 		{}, //optionnal
			"eye": 			{}, 
			"heart": 		{}, 
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{stopAfterIf:"!Party.hasReachedLevel(24)"},
			
			//Act 4
			"izual": 		{}, //optionnal
			"diablo": 		{stopAfterIf:"!Party.hasReachedLevel(27)"},
			
			//Act 5
			"shenk": 		{}, //optionnal
			"barbrescue": 	{}, //optionnal
			"anya": 		{}, //optionnal
			"ancients": 	{},
			"baal": 		{},
		},
		
		1: { //Nightmare
			//Act 1
			"den": 			{},
			"blood": 		{}, //optionnal
			"cain": 		{},
			"countess": 	{}, //optionnal
			"smith": 		{}, //optionnal
			"andy": 		{},
			
			//Act 2
			"cube": 		{},
			"amulet": 		{},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{}, //optionnal
			"duriel": 		{},
			
			//Act 3
			"figurine": 	{}, //optionnal
			"lamesen": 		{}, //optionnal
			"eye": 			{}, 
			"heart": 		{}, 
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{},
			
			//Act 4
			"izual": 		{}, //optionnal
			"diablo": 		{stopAfterIf:"!Party.hasReachedLevel(50)"},
			
			//Act 5
			"shenk": 		{}, //optionnal
			"barbrescue": 	{}, //optionnal
			"anya": 		{}, //optionnal
			"ancients": 	{},
			"baal": 		{},
		},
		
		2: { //Hell
			//Act 1
			"den": 			{},
			"blood": 		{}, //optionnal
			"cain": 		{},
			"countess": 	{}, //optionnal
			"smith": 		{}, //optionnal
			"andy": 		{},
			
			//Act 2
			"cube": 		{},
			"amulet": 		{},
			"summoner": 	{},
			"staff": 		{},
			"radament": 	{}, //optionnal
			"duriel": 		{},
			
			//Act 3
			"figurine": 	{}, //optionnal
			"lamesen": 		{}, //optionnal
			"eye": 			{}, 
			"heart": 		{}, 
			"brain": 		{},
			"travincal": 	{},
			"mephisto": 	{},
			
			//Act 4
			"izual": 		{}, //optionnal
			"diablo": 		{stopAfterIf:"!Party.hasReachedLevel(80)"},
			
			//Act 5
			"shenk": 		{}, //optionnal
			"barbrescue": 	{}, //optionnal
			"anya": 		{}, //optionnal
			"ancients": 	{},
			"baal": 		{},
		}
	},
	
	//Play those sequences before the quest sequences when starting a game
	beforeQuests: {
		0: { //Normal
			//Act 1
			"cave": 		{skipIf: "Party.hasReachedLevel(6)"}, //Levelling
			"trist": 		{skipIf: "Party.hasReachedLevel(11)"}, //Levelling
			"countess": 	{skipIf: "Party.hasReachedLevel(13)"}, //Levelling
			"andy": 		{skipIf: "Party.hasReachedLevel(18)"}, //Levelling
			
			//Act 2
			
			//Act 3
			"travincal": 	{skipIf: "Party.hasReachedLevel(24)"}, //Levelling
			"mephisto": 	{skipIf: "Party.hasReachedLevel(24)"}, //Levelling
			
			//Act 4
			"diablo": 		{skipIf:"Party.hasReachedLevel(27)"}, //Levelling
			
			//Act 5
			"shenk": 		{}, //MF
			"pindle": 		{} //MF
		},
		
		1: { //Nightmare
			//Act 1
			"countess": 	{}, //MF
			"andy": 		{}, //MF
			
			//Act 2
			
			//Act 3
			"mephisto": 	{}, //MF
			
			//Act 4
			"diablo": 		{skipIf:"Party.hasReachedLevel(50)"}, //Levelling
			
			//Act 5
			"shenk": 		{}, //MF
			"pindle": 		{} //MF
		},
		
		2: { //Hell
			//Act 1
			"countess": 	{}, //MF
			"andy": 		{}, //MF
			
			//Act 2
			"summoner": 	{}, //MF
			"duriel": 		{}, //MF
			
			//Act 3
			"mephisto": 	{}, //MF
			
			//Act 4
			"diablo": 		{}, //MF & Levelling
			
			//Act 5
			"shenk": 		{}, //MF
			"pindle": 		{} //MF
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
		},
		
		1: { //Nightmare
			//Act 1
			
			//Act 2
			
			//Act 3
			
			//Act 4
			
			//Act 5
		},
		
		2: { //Hell
			//Act 1
			
			//Act 2
			
			//Act 3
			
			//Act 4
			
			//Act 5
		}
	}
};