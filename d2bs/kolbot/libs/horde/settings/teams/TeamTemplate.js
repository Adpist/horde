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
			runewordsProfile: "CasterRunewords",
			gearPriority: 1
		},
		"BarbProfile": {
			account: "account2",
			character: "myBarb",
			className: "barbarian",
			role: "bo",
			build: "battleorders",
			runewordsProfile: "CasterRunewords",
			gearPriority: 5
		},
		"PalaProfile": {
			account: "account3",
			character: "myPala",
			className: "paladin",
			role: "follower",
			build: "hammerconcentration",
			runewordsProfile: "HammerRunewords",
			gearPriority: 2
		},
		"NecroProfile": {
			account: "account4",
			character: "myNecro",
			className: "necromancer",
			role: "follower",
			build: "summon",
			runewordsProfile: "CasterRunewords",
			gearPriority: 3
		},
		"DruidProfile": {
			account: "account5",
			character: "myDruid",
			className: "druid",
			role: "follower",
			build: "wind",
			runewordsProfile: "CasterRunewords",
			gearPriority: 4
		},
        "AssassinProfile": {
            account: "account6",
            role: "follower",
            className: "assassin",
            character: "mySin",
            build: "leaftrapsin",
            runewordsProfile: "LeafCasterRunewords",
			gearPriority: 4
        },
        "AmazonProfile": {
            account: "account7",
            role: "follower",
            className: "amazon",
            character: "myZon",
            build: "javazon",
            runewordsProfile: "PhysicalShieldedRunewords",
			gearPriority: 4
        },
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
						{pickit: "horde/pots.scrolls.nip"},
						{pickit: "horde/common.earlygame.weapon.nip", condition:"me.charlvl <= 18"},
						{pickit: "horde/merc.act1.normal.xpac.nip", condition:"me.diff == 0 && !me.getQuest(7,0)"}
					],

	ladder: true, //Is ladder team
	hardcore: false, //Is Hardcore team
	expansion: true, //Is Xpac team
	rushMode: false, //high level chars are rushing other characters
	sequencesProfile: "default_xpac", //The sequence profile to use for this team (a .js file in kolbot\libs\horde\settings\sequences\)
	enableGearSharing: "Party.hasReachedLevel(18)", //Condition to activate gear sharing. put "false" to disable gear sharing
	enableRuneSharing: "true", //Condition to activate rune sharing. put "true" to always activate and "false" to completely disable rune sharing
	enableAutoStats: "true", //Condition to activate auto stats. Needed when levelling
	enableAutoSkills: "true", //Condition to activate auto skills. Needed when levelling
	enableAutoEquip: "true", //Condition to activate auto equip. Needed when levelling
	clearInventoryBeforeSharing: "Party.hasReachedLevel(90)", //Condition to sell inventory stuff before sharing. Speeds up town chores but might be selling items not in pickit that would improve other characters stuff
	endgame: "Party.hasReachedLevel(90)", //Activates endgame sequences optimisations
	skipFirstBo: false, //Skip first game BO (in case the first sequence of the run already does the BO
	disableMercRebuy: true, //Disable merc rebuy to improve its level
	minGameTime: 210, //min game time to use for the whole team
	maxGameTime: 0, //max game time to use for whole team,
	quitList: true, //quit when any team mate leave the game
	instantQuitList: false,//Set this to true if you want all bots to leave instantly when a quit is triggered (ex : quitList on chicken in hardcore)
	manualPlay: false, //Use manual teleporter / follower script on others
	debug: false //debug mode
};
