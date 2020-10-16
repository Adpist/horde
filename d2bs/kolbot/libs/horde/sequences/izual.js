/**
*	@filename	izual.js
*	@author		Adpist
*	@desc		Kill izual & complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function izual(mfRun) {
	var tyrael;

	print("izual");
	Town.repair();
	Town.doChores(); // Need max amount of potions otherwise might prematurely TP in Plains Of Despair.

	Party.wholeTeamInGame();

	if (!me.getQuest(25, 1)) {
		if (Role.teleportingChar) {
			Pather.teleport = true;

			Town.goToTown();

			Precast.doPrecast(true);

			Config.ClearType = false;

			Travel.clearToExit(103, 104, false); // Outer Steppes

			Travel.clearToExit(104, 105, false); // Plains Of Despair

			//Pather.moveToPreset(105, 1, 256);
			var presetUnit = getPresetUnit(105, 1, 256);

			if (!presetUnit) {
				return false;
			}

			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);

			if (me.diff === 0) { // Don't Teleport while killing Izual in Normal Difficulty.
				Pather.teleport = false;
			}

			Pather.makePortal();
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

		Town.goToTown();
	}

	Town.move("tyrael");

	tyrael = getUnit(1, "tyrael");

	tyrael.openMenu();

	me.cancel();

	return true;
}