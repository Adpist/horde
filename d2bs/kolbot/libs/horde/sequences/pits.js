/**
*	@filename	pits.js
*	@author		M
*	@desc		clear pits
*	@credits	Adpist, kolton
*/

function pits_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun)	{
		HordeDebug.logUserError("pits", "pits isn't a questing run");
		return Sequencer.skip;//Skip sequence, not a questing run
	}

	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function pits(mfRun) { // SiC-666 TODO: Rewrite this.

	if (Role.teleportingChar) {
		Town.goToTown();
		if (!Pather.useWaypoint(6)) {
			throw new Error();
		}
		Pather.teleport = true;
		if (!Pather.moveToExit([7, 12], true)) {
			throw new Error("Failed to move to Pit level 1");
		}
		Pather.makePortal();
		delay(1750);
	} else {
		Town.goToTown(1);
		Town.move("portalspot");
		var j = 0;
		while(!Pather.usePortal(12, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}


	Pather.teleport = false;
	Attack.clearLevel(Config.ClearType);


	if (!Pather.moveToExit(16, true, Config.Pit.ClearPath)) {
		throw new Error("Failed to move to Pit level 2");
	}

	Attack.clearLevel();

	Pather.teleport = true;
	Town.goToTown();


	return Sequencer.done;
}