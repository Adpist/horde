/**
*	@filename	TeamSettings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const HordeTeam = {
	/* Put one entry per team member. the entry must be named as the D2Bot profile name
	*  account: account used for the character
	*  role: role of the character : "teleport", "bo", "follower" or "summoner". Need at least one "teleport" in the team
	*  className: class of the character ( "sorceress", "amazon", "paladin", "necromancer", "barbarian", "assassin", "druid" )
	*  character: name of the character
	*  build: build for the character
	*/
	profiles: {
		"SorcProfile": {
			account: "account1",
			character: "mySorc",
			className: "sorceress",
			role: "teleport",
			build: "cold"
		},
		"BarbProfile": {
			account: "account2",
			character: "myBarb",
			className: "barbarian",
			role: "bo",
			build: "bo"
		},
		"PalaProfile": {
			account: "account3",
			character: "myPala",
			className: "paladin",
			role: "follower",
			build: "hammer"
		},
		"NecroProfile": {
			account: "account4",
			character: "myNecro",
			className: "necromancer",
			role: "follower",
			build: "summoner"
		}
	},
	
	ladder: true, //Is ladder team
	hardcore: false, //Is Hardcore team
	expansion: true, //Is Xpac team
	sequencesProfile: "default_xpac", //The sequence profile to use for this team
	minGameTime: 210, //min game time to use for the whole team
	maxGameTime: 0, //max game time to use for whole team,
	quitList: true, //quit when any team mate leave the game
	manualPlay: false, //Use manual teleporter / follower script on others
	debug: false //debug mode
};