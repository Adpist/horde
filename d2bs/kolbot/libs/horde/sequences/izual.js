/**
*	@filename	izual.js
*	@author		Adpist
*	@desc		Kill izual & complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function izual_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(23,0)) {
		if (!mfRun)
			HordeDebug.logUserError("izual", "mephisto isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop; //Stop: Mephisto isn't dead
	}
	
	if (mfRun && !me.getQuest(25, 0)) {
		return Sequencer.skip; //Skip: mf run and izual quest isn't completed
	}
	
	if ((!mfRun && me.getQuest(25, 0))) {
		return Sequencer.skip;//Skip: quest already complete
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function izual(mfRun) {
	var tyrael;
	
	Town.goToTown(4);
	
	if (Role.teleportingChar) {
		Travel.travel(8);
	}
	
	Party.wholeTeamInGame();

	if (mfRun || !me.getQuest(25, 1)) {
		if (Role.teleportingChar) {
			Pather.teleport = true;

			Town.goToTown(4);

			Precast.doPrecast(true);

			Config.ClearType = false;

			Travel.clearToExit(103, 104, false); // Outer Steppes

			Travel.clearToExit(104, 105, false); // Plains Of Despair

			//Pather.moveToPreset(105, 1, 256);
			var presetUnit = getPresetUnit(105, 1, 256);

			if (!presetUnit) {
				return Sequencer.fail;
			}

			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);

			if (me.diff === 0) { // Don't Teleport while killing Izual in Normal Difficulty.
				Pather.teleport = false;
			}

			Role.makeTeamJoinPortal();
			
		} else {
			Town.goToTown(4);

			Town.move("portalspot");

			var j = 0;

			while (!Pather.usePortal(105, null)) {
				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}
		}

		Party.wholeTeamInGame();

		try {
			if (!Attack.clear(15, 0, 256)) { // Izual
				Attack.clear(20);
			}
		} catch (e) {
			Attack.clear(20);
		}

		Role.backToTown();
	}

	if (!mfRun) {
		Town.move("tyrael");
		tyrael = getUnit(1, "tyrael");
		tyrael.openMenu();
		me.cancel();
	}

	return Sequencer.done;
}
