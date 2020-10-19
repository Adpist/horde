/**
*	@filename	cave.js
*	@author		Adpist
*	@desc		Travel to cave in cold plains and clear lvl 2
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cave_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun) {
		HordeDebug.logUserError("cave",  "not supported as questing run");
		return Sequencer.skip;//Skip : not a questing sequence
	}
	
	if (!me.getQuest(1,0)) {
		return Sequencer.skip;//Den is not done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function cave(mfRun) {	
	Town.repair();
	Town.doChores();
	Pather.useWaypoint(3);

	Party.waitForMembers(me.area, 9);

	Precast.doPrecast(true);

	Travel.clearToExit(3, 9, Config.ClearType);

	Party.waitForMembers(me.area, 13);

	Travel.clearToExit(9, 13, Config.ClearType);

	Party.waitForMembers();

	Attack.clearLevel(Config.ClearType);
	
	Town.goToTown();

	return Sequencer.done;
}