/**
*	@filename	staff.js
*	@author		Adpist
*	@desc		Get staff
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function staff_requirements(mfRun) {
/***** REQUIREMENTS ******/
	if(!me.getQuest(7, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("staff", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1
	}
	
	if (mfRun) {
		HordeDebug.logUserError("staff",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getItem(92) || me.getItem(91) || me.getQuest(10,0)){
		return Sequencer.skip;//Skip: have staff or quest
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function staff(mfRun) { 

	if (Role.teleportingChar) {
		if (me.diff !== 0) { // The Teleporting Sorc needs to travel to Lost City in Nightmare and Hell, otherwise it's already been done in this.cube();
			Travel.travel(2); // Halls Of The Dead Level 2
			Travel.travel(3); // Lost City
		}
	
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
				return Sequencer.fail;
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
				return Sequencer.fail;
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

	}

	return Sequencer.done;
}