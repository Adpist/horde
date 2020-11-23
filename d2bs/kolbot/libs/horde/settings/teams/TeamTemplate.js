/**
*	@filename	TeamSettings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const HordeTeam = {
	/* Put one entry in profiles per team member. the entry must be named as the D2Bot profile name
	*  account: account used for the character
	*  role: role of the character : "teleport", "bo", "follower". Need at least one "teleport" in the team
	*  className: class of the character ( "sorceress", "amazon", "paladin", "necromancer", "barbarian", "assassin", "druid" )
	*  character: name of the character
	*  build: build for the character (name of a .js file in kolbot\libs\horde\builds\#ClassName#\)
	*  runewordsProfile: the runewords the character will be making (name of a .js file in kolbot\libs\horde\settings\crafting\runewords)
	*/
	profiles: {
		"SorcProfile": {
			account: "account1",
			character: "mySorc",
			className: "sorceress",
			role: "teleport",
			build: "cold",
			runewordsProfile: "RunewordsTemplate",
			gearPriority: 1
		},
		"BarbProfile": {
			account: "account2",
			character: "myBarb",
			className: "barbarian",
			role: "bo",
			build: "bo",
			runewordsProfile: "RunewordsTemplate",
			gearPriority: 5
		},
		"PalaProfile": {
			account: "account3",
			character: "myPala",
			className: "paladin",
			role: "follower",
			build: "hammer",
			runewordsProfile: "RunewordsTemplate",
			gearPriority: 2
		},
		"NecroProfile": {
			account: "account4",
			character: "myNecro",
			className: "necromancer",
			role: "follower",
			build: "summoner",
			runewordsProfile: "RunewordsTemplate",
			gearPriority: 3
		},
		"DruidProfile": {
			account: "account5",
			character: "myDruid",
			className: "druid",
			role: "follower",
			build: "wind",
			runewordsProfile: "RunewordsTemplate",
			gearPriority: 4
		}
	},
	
	/* This is where you setup when the team should go to next difficulty and when the team should kill baal
	*/
	difficulties: {
		0: { //Normal settings
			stayIf: "TeamData.getLowestLevel() < 42", 
			killBaalIf: "true"
		},
		
		1: { //Nightmare settings
			stayIf: "TeamData.getLowestLevel() < 70", 
			killBaalIf: "true"
		},
		
		2: {//Hell settings
			killBaalIf: "TeamData.getAverageLevel() > 80"
		}
	},
	
	commonPickits: 	[
						{pickit: "kolton.nip"},
						{pickit: "horde/merc.act1.normal.xpac.nip", condition:"me.diff == 0 && !me.getQuest(7,0)"}
					],

	sequencesProfile: "default_xpac", //The sequence profile to use for this team (a .js file in kolbot\libs\horde\settings\sequences\)
	enableGearSharing: "Party.hasReachedLevel(18)", //Condition to activate gear sharing. put "false" to completely disable gear sharing
	minGameTime: 210, //min game time to use for the whole team
	maxGameTime: 0, //max game time to use for whole team,
	walkChaosSancNorm: true, //Disable tele for clear of Chaos sanc in Normal
	walkChaosSancNm: true, //Disable tele for clear of Chaos sanc in NM
	walkChaosSancHell: true, //Disable tele for clear of Chaos sanc in Hell
	walkThroneRoomNorm: true, //Disable tele for clear of Throne Room in Normal
	ladder: true, //Is ladder team
	hardcore: false, //Is Hardcore team
	expansion: true, //Is Xpac team
	quitList: true, //quit when any team mate leave the game
	instantQuitList: false,//Set this to true if you want all bots to leave instantly when a quit is triggered (ex : quitList on chicken in hardcore)
	manualPlay: false, //Use manual teleporter / follower script on others
	disableMercRebuy: false, //Never re-buy (ONLY Revive) merc except on Norm -> Nightmare
	debug: false //debug mode
};
