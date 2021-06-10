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
		if (me.diff === 0) { // All characters grab Cold Plains Waypoint in Normal. Only the Teleporting Sorc grabs it in Nightmare and Hell.
			Pather.teleport = false;
			
			Pather.useWaypoint(3);

			Party.waitForMembers(me.area, 17);

			Precast.doPrecast(true);

			Travel.clearToExit(3, 17, true);
		}
		else {
			Town.goToTown(1);
			if (Role.teleportingChar) {
				Pather.useWaypoint(3);

				Travel.clearToExit(3, 17, false);
				
				Role.makeTeamJoinPortal();
			} else {
				Town.move("portalspot");
				while (!Pather.usePortal(17, null)) {
					delay(250);
				}
				Buff.Bo();
			}
		}
		Party.waitForMembers();

		Party.wholeTeamInGame();

		try {
			Pather.teleport = false;
			Pather.moveToPreset(17, 1, 805, 0, 0, true);
			Pather.teleport = true;
			Attack.kill(getLocaleString(3111)); // Blood Raven
		} catch(e) {
			Pather.teleport = true;
			Attack.clear(30);
		}

		Pickit.pickItems();

		Role.backToTown();
	}

	while (!kashya || !kashya.openMenu()) { // Try more than once to interact with Kashya.
		Packet.flash(me.gid);

		Town.move(NPC.Kashya);

		kashya = getUnit(1, NPC.Kashya);

		delay(1000);
	}

	me.cancel();

	return Sequencer.done;
}
