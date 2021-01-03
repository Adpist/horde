/**
*	@filename	cube.js
*	@author		Adpist
*	@desc		Get cube
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cube_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if(!me.getQuest(7, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("cube", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1
	}
	
	if (mfRun && !me.getItem(549)) {
		return Sequencer.skip;//MF run but we don't have cube
	}
	
	if (!mfRun && me.getItem(549)) {
		return Sequencer.skip;//I already have cube and nobody requested quest
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function cube(mfRun) { // Only called in Normal Difficulty.
	var i, chest, cube;
	
	Party.wholeTeamInGame();

	print("travel halls of dead 2");
	Travel.travel(2); // Halls Of The Dead Level 2

	print("travel lost city");
	Travel.travel(3); // Lost City

	if (!me.inTown) {
		Role.backToTown();
	}

	print("use waypoint to halls of dead 2");
	Pather.useWaypoint(57, true); // Halls Of The Dead Level 2

	Party.waitForMembers();

	Precast.doPrecast(true);

	Pather.teleport = false;

	Config.ClearType = 0;

	Travel.clearToExit(57, 60, Config.ClearType);

	Party.waitForMembers();

	for (i = 0 ; i < 5 ; i += 1) {
		chest = getPresetUnit(60, 2, 354);

		if (chest) {
			break;
		}

		delay(me.ping * 2 + 250);
	}

	while (getDistance(me.x, me.y, chest.roomx * 5 + chest.x, chest.roomy * 5 + chest.y) > 10) {
		try {
			Pather.moveToPreset(60, 2, 354, 0, 0, false, true);
		} catch (e) {
			print("Caught Error.");

			print(e);
		}
	}

	Attack.clear(20);

	if (!me.getItem(549)) {
		Quest.getQuestItem(549, 354);
	}

	Role.backToTown();
	
	return Sequencer.done;
}