/**
*	@filename	coldplains.js
*	@author		Adpist
*	@desc		navigate while clearing to get cold plains wp (or use it if already have), go back to bloodmoor and clear area
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function coldplains_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function coldplains(mfRun) {
	var i, akara;
	
	Pather.teleport = false;
	
	if (me.diff === 0) { // All characters grab Cold Plains Waypoint in Normal. Only the Teleporting Sorc grabs it in Nightmare and Hell.
		if (!getWaypoint(1))
		{
			Travel.safeMoveToExit(2, true, true);
			Party.wholeTeamInGame();
			Party.waitForMembers(me.area, 3);
			Pather.moveToExit(3, true, true);
			if (!getWaypoint(1))
				Pather.getWP(3);
		}else{
			Pather.useWaypoint(3);
		}
	} else { //Nm & Hell
		if (Role.teleportingChar) {
			if (!getWaypoint(1)) {
				Travel.clearToExit(1, 2, false); // Move from Rogue Encampment to Blood Moor

				Travel.clearToExit(2, 3, false); // Move from Blood Moor to Cold Plains

				Waypoint.clickWP();
			} else {
				Pather.useWaypoint(3);
			}
			
			Pather.makePortal();

			Pather.teleport = false; // not teleporting in Den

			delay(me.ping*2 + 1000);
		} else {
			Town.goToTown();
			Town.move("portalspot");
			while (!Pather.usePortal(3, null)) {
				delay(250);
			}
			Waypoint.clickWP();
			Buff.Bo();
		}
	}

	Attack.clearLevel();
	
	if (!Role.backToTown(false)) {
		Pather.moveToExit(2, true, true);
		Pather.moveToExit(3, true, true);
		Pather.useWaypoint(1);
	}
	
	Pather.teleport = true;

	return Sequencer.done;
}
