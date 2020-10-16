/**
*	@filename	Settings.js
*	@author		Adpist
*	@desc		User settings for the Horde script
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeSettings = {
	// -------- Normal Difficulty -------------
	caveLvl: 7,
	tristLvl: 11,
	catacLvl: 13,	
	andyLvl: 16,
	tombsLvl: 24,
	mephLvl: 24,
	diaLvl: 27,
	baalLvl: 44,
	// -------- Nightmare Difficulty ----------
	mephLvlnm: 45,
	diaLvlnm: 50,
	mfLvlnm: 58,
	baalLvlnm: 70,
	// ---------- Hell Difficulty --------------
	mephLvlhell: 70,
	diaLvlhell: 80,
	mfLvlhell: 86,
	
	maxWaitTimeMinutes: 3, //Max time to wait in case smurf synchronization fails
	
	// -------- Extra quests -------------	
	normalCountess: true, //for levelling a bit more
	smithQuest: true,
	
	// -------- Difficulties MF -------------	
	normalMf: true,
	nmMf: true,
	hellMf: true,
		
	// -------- Normal Difficulty MF -------------
	normalMfMephistoOn: false,
	normalMfShenkOn: true,
	normalMfPindleOn: true,
		
	// -------- Nightmare Difficulty MF ----------
	nmMfCountessOn: true,
	nmMfAndyOn: true,
	nmMfSummonerOn: false,
	nmMfDurielOn: false,
	nmMfMephistoOn: true,
	nmMfShenkOn: true,
	nmMfPindleOn: true,
		
	// ---------- Hell Difficulty MF --------------
	hellMfCountessOn: true,
	hellMfAndyOn: true,
	hellMfSummonerOn: true,
	hellMfDurielOn: true,
	hellMfMephistoOn: true,
	hellMfShenkOn: true,
	hellMfPindleOn: true,
		
	// if party level isn't reach, clean some areas until min game time is reached (will leave after cleaning area)	
	// -------- Normal Difficulty Area Levelling -------------
	caveLvlAreas: [],//[2,3,17,18,19,-1],
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
	mfLvlhellAreas: []

};
