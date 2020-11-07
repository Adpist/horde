/**
*	@filename	cave.js
*	@author		Adpist
*	@desc		Travel to cave in cold plains and clear lvl 2
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cave_requirements(mfRun) {
	/***** REQUIREMENTS ******/

	if (!me.getQuest(1,0)) {
		return Sequencer.skip;//Den is not done
	}
	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function cave(mfRun) {
	Town.repair();
	Town.doChores();

	if (!getWaypoint(1)) {
		Travel.safeMoveToExit(2, true, true);
		Party.wholeTeamInGame();
		Party.waitForMembers(me.area, 3);
		Pather.moveToExit(3, true, true);
		if (!getWaypoint(1)){
			Pather.getWP(3);
		}
	} else {
		Pather.useWaypoint(3);
	}

	Party.waitForMembers(me.area, 9);

	Precast.doPrecast(true);

	Travel.clearToExit(3, 9, Config.ClearType);

	Party.waitForMembers(me.area, 13);

	Travel.clearToExit(9, 13, Config.ClearType);

	Party.waitForMembers();

	Attack.clearLevel(Config.ClearType);

	try {
		Role.backToTown();
	} catch (error){
		//no tomes
		if (!me.inTown) {
			if(!Pather.usePortal(null, null)){
				Travel.clearToExit(13, 9, Config.ClearType);
				Travel.clearToExit(9, 3, Config.ClearType);
				Pather.useWaypoint(3);
			}
		}
	}
	return Sequencer.done;
}
