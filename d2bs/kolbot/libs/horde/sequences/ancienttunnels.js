/**
*	@filename	ancienttunnels.js
*	@author		M
*	@desc		clear ancient tunnels
*	@credits	Adpist, kolton
*/

function ancienttunnels_requirements(mfRun) {
	/***** REQUIREMENTS ******/


	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function ancienttunnels(mfRun) { // SiC-666 TODO: Rewrite this.

	if (!mfRun)
	{
		Town.goToTown();
		Party.wholeTeamInGame();
		return true;
	}

	if (Role.teleportingChar) {
		Town.goToTown();
		if (!Pather.useWaypoint(44)) {
			throw new Error();
		}
		Pather.teleport = true;
		if (!Pather.moveToExit(65, true)) {
			throw new Error("Failed to move to Ancient Tunnels");
		}
		Pather.makePortal();
		delay(1750);
	} else {
		Town.goToTown(2);
		Town.move("portalspot");

		var j = 0;
		while(!Pather.usePortal(65, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}


	Pather.teleport = false;
	Attack.clearLevel(Config.ClearType);


	Pather.teleport = true;

	Town.goToTown();


	return Sequencer.done;
}