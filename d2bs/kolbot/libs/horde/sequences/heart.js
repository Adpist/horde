/**
*	@filename	heart.js
*	@author		Adpist
*	@desc		Get Khalim's heart
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function heart_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("heart", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (mfRun) {
		HordeDebug.logUserError("heart",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getQuest(18,0) || me.getItem(554) || me.getItem(174)) {
		return Sequencer.skip;//Skip: quest completed or item in inventory
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function heart(mfRun) {
	Town.goToTown(3);

	Party.wholeTeamInGame();
	
	if (Role.teleportingChar) {
		Travel.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.
	} else if (!Role.isLeader) {
		return Sequencer.done;
	}

	Pather.teleport = true;


	if (Role.teleportingChar) {

		Pather.useWaypoint(80, true);

		Precast.doPrecast(true);
		
		Travel.clearToExit(80, 92, false);

		Travel.clearToExit(92, 93, false);

		//Pather.moveToPreset(me.area, 2, 405);
		var presetUnit = getPresetUnit(93, 2, 405);

		if (!presetUnit) {
			return Sequencer.fail;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15, false);

		if (Role.isLeader) {
			Quest.getQuestItem(554, 405);
		} else {
			Role.makeTeamJoinPortal();
		}

	} else {
		Town.move("portalspot");
		while (!Pather.usePortal(93, null)) {
			delay(250);
		}

		Quest.getQuestItem(554, 405);
	}

	Role.backToTown();

	if (me.getItem(554)) {
		Town.move("stash");
		delay(me.ping > 0 ? me.ping : 50);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(554));
	}

	//Pather.teleport = false;

	return Sequencer.done;
};