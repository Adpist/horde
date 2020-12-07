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
	
	Log: {
		Experience: false, // Print experience statistics in the manager.
		Keys: false, // Log keys on item viewer
		Organs: true, // Log organs on item viewer
		LowRunes: false, // Log low runes (El - Dol) on item viewer
		MiddleRunes: false, // Log middle runes (Hel - Mal) on item viewer
		HighRunes: true, // Log high runes (Ist - Zod) on item viewer
		LowGems: false, // Log low gems (chipped, flawed, normal) on item viewer
		HighGems: false // Log high gems (flawless, perfect) on item viewer
	},
	
	Debug: {
		Verbose: {
			leaderElection: false,
			synchro: false,
			quests: false,
			sharing: false,
			crafting: false,
			chores: false
		}
	}
};
