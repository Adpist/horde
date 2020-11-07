/**
*	@filename	bloodmoor.js
*	@author		Adpist
*	@desc		navigate while clearing to get cold plains wp (or use it if already have), go back to bloodmoor and clear area
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function bloodmoor_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function bloodmoor(mfRun) {
	var i, akara;
	
	if (!getWaypoint(1))
	{
		Travel.safeMoveToExit(2, true, true);
		Party.wholeTeamInGame();
		Party.waitForMembers(me.area, 3);
		Pather.moveToExit(3, true, true);
		if (!getWaypoint(1))
			Pather.getWP(3);
	}
	else
	{
		Pather.useWaypoint(3);
	}
	Party.waitForMembers();
	Pather.moveToExit(2, true, true);

	Attack.clearLevel();

	if (!Role.backToTown(false)){
		Pather.moveToExit(1, true, true);
		Packet.flash(me.gid);
		delay(me.ping * 2 + 250);
	}

	return Sequencer.done;
}
