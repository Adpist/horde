/**
*	@filename	staff.js
*	@author		Adpist
*	@desc		Get staff
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

// Only the Teleporting Sorc does this. She will be at least level 18 as required by MAIN to reach this stage.
function staff(mfRun) { 
	print("getting staff");

	Party.wholeTeamInGame();

	Pather.useWaypoint(43, true);

	Precast.doPrecast(true);
	// Dark-f
	if (me.classid === 1 ) {
		Pather.teleport = true;

		Travel.clearToExit(43, 62, false);

		Travel.clearToExit(62, 63, false);

		Travel.clearToExit(63, 64, false);

		var presetUnit = getPresetUnit(64, 2, 356);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);

	} else {

		Pather.teleport = false;
		Town.repair();
		Travel.clearToExit(43, 62, true);

		Travel.clearToExit(62, 63, true);

		Travel.clearToExit(63, 64, true);

		var presetUnit = getPresetUnit(64, 2, 356);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, true);
	}

	Quest.getQuestItem(92, 356);

	if (!Pather.usePortal(null, null)) {
		Town.goToTown();
	}

	if (me.getItem(92)) {
		Town.move("stash");
		delay(me.ping > 0 ? me.ping : 50);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(92));
	}

	//Pather.teleport = false;

	if (me.getItem(92)) { //teamStaff
		Communication.sendToList(HordeSystem.allTeamProfiles, "GotStaff");
	}

	return true;
}