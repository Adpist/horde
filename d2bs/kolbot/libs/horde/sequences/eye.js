/**
*	@filename	eye.js
*	@author		Adpist
*	@desc		Get Khalim's eye
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function eye(mfRun) {
	print("getting eye");

	Party.wholeTeamInGame();

	if (!me.inTown) {
		Town.goToTown();
	}

	if (me.charlvl >=18 && me.classid ===1 ) { // Dark-f add only sorceress
		Pather.teleport = true;
	} else {
		Pather.teleport = false;
	}

	Pather.useWaypoint(76, true);

	Precast.doPrecast(true);

	if (Pather.teleport === true) {
		Travel.clearToExit(76, 85, false);

		//Pather.moveToPreset(me.area, 2, 407);
		var presetUnit = getPresetUnit(85, 2, 407);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);
	} else {
		Travel.clearToExit(76, 85, Config.ClearType);
		if (!Pather.moveToPreset(me.area, 2, 407, 0, 0, Config.ClearType)) {
			Pather.moveToPreset(me.area, 2, 407);
		}
		Attack.clear(20);
	}

	Quest.getQuestItem(553, 407);

	Town.goToTown();

	if (me.getItem(553)) {
		Town.move("stash");
		delay(me.ping > 0 ? me.ping : 50);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(553));
	}

	//Pather.teleport = false;

	return true;
}