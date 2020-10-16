/**
*	@filename	shenk.js
*	@author		Adpist
*	@desc		Kill shenk
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function shenk(mfRun) { // SiC-666 TODO: Rewrite this.

	if (mfRun) 	{ print("mfing shenk"); }
	else		{ print("killing shenk"); }
	
	if (!mfRun)
	{
		Town.doChores();
		Party.wholeTeamInGame();
		
		if (me.getQuest(35, 1)) {
			return true;
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
		Town.goToTown();
	}
	
	return true;
}