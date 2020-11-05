/**
*	@filename	Settings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeSettings = {
	leaderElectionTimeoutMinutes: 10, //Max time to wait for leader election
	maxWaitTimeMinutes: 3, //Max time to wait in case horde synchronization fails
	logChar: true,
	
	Overlay: {
		banner: true,
		playtime: true
	},
	
	Debug: {
		Verbose: {
			leaderElection: true,
			synchro: true
		}
	},
	/****************************************************/
	/* Everything below those lines will be deleted.    */
	/* please use sequences & teams						*/
	/****************************************************/
	
	
	
	// -------- Extra quests -------------	
	
	// -------- Normal Difficulty Questing -------------
	normTracincalFromWpOn: true, //Starts council fight from WP, big help in higher difficulty & teams
		
	// -------- Nightmare Difficulty Questing ----------
	nmTracincalFromWpOn: true, //Starts council fight from WP, big help in higher difficulty & teams
		
	// ---------- Hell Difficulty Questing --------------
	hellTracincalFromWpOn: true, //Starts council fight from WP, big help in higher difficulty & teams
	
	// kept for reference (was used to fill games if nothing else to do and current game time < min game time
	// -------- Normal Difficulty Area Levelling -------------
	/*caveLvlAreas: [],//[2,3,17,18,19,-1],
	tristLvlAreas: [11,15,-1,21,22,23,24,25,-1,12,16,-1],
	tombsLvlAreas: [55,59,-1,65,-1,58,-1],
	mephLvlAreas: [79,80,81,82,83,100,101,102,-1],
	diaLvlAreas: [107,106,105,104,-1,83,100,101,102,-1],
	baalLvlAreas: [129,128,130,-1,113,114,-1,115,-1,116,-1,118,119,-1,125,-1,126,-1,127,-1],
	// -------- Nightmare Difficulty Area Levelling ----------
	//mephLvlnmAreas: [9,13,-1,10,14,-1,11,15,-1,12,16,-1,55,59,-1,65,-1,79,80,81,82,83,-1],
	mephLvlnmAreas: [79,80,81,82,83,-1],
	diaLvlnmAreas: [107,-1,9,13,-1,10,14,-1,11,15,-1,12,16,-1,55,59,-1,65,-1,79,80,81,82,83,-1],
	mfLvlnmAreas: [],
	baalLvlnmAreas: [129,128,130,-1,113,114,-1,115,-1,116,-1,118,119,-1,125,-1,126,-1,127,-1],
	// ---------- Hell Difficulty Area Levelling --------------
	mephLvlhellAreas: [79,80,81,-1,35,36,37,-1,21,22,23,24,25,-1,17,19,-1,12,16,-1,65,-1],
	diaLvlhellAreas: [79,80,81,-1,19,-1,12,16,-1,65,-1,9,13,-1,10,14,-1,11,15,-1,12,16,-1,55,59,-1,65],
	mfLvlhellAreas: []*/

	
};
