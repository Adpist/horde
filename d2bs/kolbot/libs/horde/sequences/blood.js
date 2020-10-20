/**
*	@filename	blood.js
*	@author		Adpist
*	@desc		Kill blood raven and complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function blood_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (mfRun) {
		HordeDebug.logUserError("blood",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (mfRun || me.getQuest(2,0)) {
		return Sequencer.skip;//Skip : quest completed
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function blood(mfRun) {
	var kashya;
	
	Town.repair();
	Party.wholeTeamInGame();

	if (!me.getQuest(2, 1)) {
		Pather.useWaypoint(3);

		Party.waitForMembers(me.area, 17);

		Precast.doPrecast(true);

		Travel.clearToExit(3, 17, true);

		Party.waitForMembers();

		Party.wholeTeamInGame();

		try {
			Pather.moveToPreset(17, 1, 805, 0, 0, true);
			Attack.kill(getLocaleString(3111)); // Blood Raven
		} catch(e) {
			Attack.clear(30);
		}

		Pickit.pickItems();

		Town.goToTown();
	}

	while (!kashya || !kashya.openMenu()) { // Try more than once to interact with Kashya.
		Packet.flash(me.gid);

		Town.move("kashya");

		kashya = getUnit(1, "kashya");

		delay(1000);
	}

	me.cancel();

	return Sequencer.done;
}