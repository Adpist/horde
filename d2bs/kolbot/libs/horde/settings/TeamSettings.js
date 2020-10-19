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
		*  build: build for the character
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
		
		sequencesProfile: "default_xpac", //The sequence profile to use for this team
		minGameTime: 210, //min game time to use for the whole team
		maxGameTime: 0, //max game time to use for whole team,
		quitList: true, //quit when any team mate leave the game
		manualPlay: false, //Use manual teleporter / follower script on others
		debug: false //debug mode
	}
};