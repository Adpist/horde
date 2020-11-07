/**
*	@filename	shenk.js
*	@author		Adpist
*	@desc		Kill shenk
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function shenk_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("shenk",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("shenk",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}
	
	if (mfRun && !me.getQuest(35, 0) && !me.getQuest(35,1)) {
		return Sequencer.skip;//Skip : Mf and quest isn't completed
	}
	
	if (!mfRun && (me.getQuest(35,0) || me.getQuest(35,1))){
		return Sequencer.skip;//Skip : Questing and quest is completed
	}
	
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function shenk(mfRun) { // SiC-666 TODO: Rewrite this.
	if (Role.teleportingChar) {
		Travel.travel(9);//Get all act wp if needed
	}
	
	if (!mfRun)
	{
		Town.doChores();
		Party.wholeTeamInGame();
		
		if (me.getQuest(35, 1)) {
			return Sequencer.done;
		}
	}
	
	if (Role.teleportingChar) {
		if (!Pather.useWaypoint(111, false)) {
			throw new Error();
		}
		Pather.teleport = true;
		Pather.moveTo(3883, 5113, 5, false);
		Pather.makePortal();
	} else {
		Town.goToTown(5);
		Town.move("portalspot");
		while(!Pather.usePortal(110, null)) {
			delay(1000);
		}
	}
	
	if (mfRun)
	{
		Attack.clear(20);
	}
	
	try{
		if (!mfRun) {
			Party.wholeTeamInGame();
		}
		
		Attack.kill(getLocaleString(22435)); // Shenk the Overseer
	}catch(e) {
		print(e);
		Attack.clear(20);
	}
	
	Pickit.pickItems();

	if (mfRun){
		Role.backToTown();
	}
	
	return Sequencer.done;
}