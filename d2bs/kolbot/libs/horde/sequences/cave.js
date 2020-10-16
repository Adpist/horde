/**
*	@filename	cave.js
*	@author		Adpist
*	@desc		Travel to cave in cold plains and clear lvl 2
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cave(mfRun) {
	print("cave");
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

	return true;
}