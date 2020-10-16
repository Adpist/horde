/**
*	@filename	TeamSettings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

const Teams = {
	"TeamA": {
		/* Put one entry per team member. the entry must be named as the D2Bot profile name
		*  role: role of the character : "teleport", "bo", "follower" or "summoner". Need at least one "teleport" in the team
		*  character: name of the character
		*  mercAct2Normal : aura of the merc to hire in act 2 normal
		*  mercAct2Nightmare : aura of the merc to hire in act 2 nightmare
		*/
		profiles: {
			"SorcProfile": {
				role: "teleport",
				character: "mySorc",
				build: "meteorb"
			},
			"BarbProfile": {
				role: "bo",
				character: "myBarb",
				build: "bo"
			},
			"PalaProfile": {
				role: "follower",
				character: "myPala",
				build: "hammer"
			},
			"NecroProfile": {
				role: "summoner",
				character: "myNecro",
				build: "summoner"
			}
		},
		
		minGameTime: 210, //min game time to use for the whole team
		maxGameTime: 0, //max game time to use for whole team,
		quitList: true, //quit when any team mate leave the game
		manualPlay: false, //Use manual teleporter / follower script on others
		debug: false //debug mode
	}
};