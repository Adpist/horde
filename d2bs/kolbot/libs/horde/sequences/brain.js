/**
*	@filename	brain.js
*	@author		Adpist
*	@desc		Get Khalim's brain
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function brain(mfRun) {
	print("getting brain");

	Party.wholeTeamInGame();

	if (!me.inTown) {
		Town.goToTown();
	}

	if (me.charlvl >=18 && me.classid ===1 ) { // Dark-f add only sorceress
		Pather.teleport = true;
	} else {
		Pather.teleport = false;
	}

	Pather.useWaypoint(78, true);

	Precast.doPrecast(true);

	if (Pather.teleport === true) {

		Travel.clearToExit(78, 88, false);

		Travel.clearToExit(88, 89, false);

		Travel.clearToExit(89, 91, false);

		//Pather.moveToPreset(me.area, 2, 406);
		var presetUnit = getPresetUnit(91, 2, 406);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);

		Quest.getQuestItem(555, 406);

	} else {

		Travel.clearToExit(78, 88, true);

		Travel.clearToExit(88, 89, true);

		Travel.clearToExit(89, 91, true);

		//Pather.moveToPreset(me.area, 2, 406);
		var presetUnit = getPresetUnit(91, 2, 406);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, true);

		Quest.getQuestItem(555, 406);

	}

	Town.goToTown();

	if (me.getItem(555)) {
		Town.move("stash");
		delay(me.ping > 0 ? me.ping : 50);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(555));
	}

	//Pather.teleport = false;

	return true;
}