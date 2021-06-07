/**
*	@filename	mausoleum.js
*	@author		Adpist
*	@desc		clear mausoleum
*	@credits	Adpist, kolton
*/

function mausoleum_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun)	{
		HordeDebug.logUserError("mausoleum", "mausoleum isn't a questing run");
		return Sequencer.skip;//Skip sequence, not a questing run
	}

	if (me.diff === 0){
		HordeDebug.logUserError("mausoleum", "mausoleum isn't normal difficulty friendly");
		return Sequencer.skip;//Skip sequence, not a questing run
	}
	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function mausoleum(mfRun) {

	if (Role.teleportingChar) {
		Town.goToTown(1);
		if (!Pather.useWaypoint(3)) {
			throw new Error();
		}

		Pather.teleport = true;
		if (!Pather.moveToExit(17, true)) {
			throw new Error("Failed to move to burial grounds");
		}
		
		if (!Pather.moveToExit(19, true)) {
			throw new Error("Failed to move to Mausoleum");
		}
		Role.makeTeamJoinPortal();
		delay(1750);
		
	} else {
		Town.goToTown(1);

		Town.move("portalspot");

		var j = 0;
		while(!Pather.usePortal(19, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}

	if (HordeSystem.teamSize > 1 || me.diff === 0) {
		Pather.teleport = HordeSystem.isEndGame();
	}

	Party.waitForMembers();
	Attack.clearLevel(Config.ClearType);

	if (HordeSystem.teamSize > 1) {
		Pather.teleport = true;
	}

	Role.backToTown();

	return Sequencer.done;
}
