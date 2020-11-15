/**
*	@filename	Settings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeSettings = {
	leaderElectionTimeoutMinutes: 10, //Max time to wait for leader election
	maxWaitTimeMinutes: 3, //Max time to wait in case horde synchronization fails
	logChar: true, //Set to true if you want to log the char inventory as a mule
	
	Overlay: {
		banner: true, //Display the D2GM::HORDE banner
		playtime: true //Display the playtime
	},
	
	Debug: {
		Verbose: {
			leaderElection: false,
			synchro: false,
			quests: false,
			sharing: false
		}
	}
};
