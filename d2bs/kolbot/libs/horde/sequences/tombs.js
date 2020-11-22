/**
*	@filename	tombs.js
*	@author		Adpist
*	@desc		Teleporting Sorc shares Canyon of The Magi waypoint with the others and they each clear to the chest in all of the tombs.
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function tombs_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if(!me.getQuest(7, 0) || !me.getQuest(13,0)) {
		if (!mfRun)
			HordeDebug.logUserError("tombs", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1 or summoner isn't done
	}
	
	if (!mfRun){
		HordeDebug.logUserError("tombs", "tombs is a mf run");
		return Sequencer.skip;//Skip: questing run
	}
	
	if (me.diff !== 0){
		HordeDebug.logUserError("tombs", "skipped in nightmare and hell");
		return Sequencer.skip;//Skip: Normal only
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function tombs(mfRun) {
	var i, j, chest;
	var clearAreas = true;
	
	if (!mfRun && Role.teleportingChar) {
		Travel.travel(4);
	}
	
	Pather.teleport = false;

	if (me.act !== 2) {
		Town.goToTown(2);
	}

	Config.ClearType = 0;

	if (Role.teleportingChar) {
		if (me.area !== 46) {
			Pather.useWaypoint(46);
		}

		Role.makeTeamJoinPortal();
	} else {
		if (!getWaypoint(17)) { // Canyon Of The Magi
			var cain;

			Town.goToTown(2);

			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);

				Town.move(NPC.Cain);
				cain = getUnit(1, "deckard cain");

				delay(1000);
			}

			me.cancel();

			Town.move("portalspot");

			print("Waiting for Canyon Of The Magi TP.");

			j = 0;

			while (!Pather.usePortal(46, null)) { // Canyon Of The Magi
				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}

			Waypoint.clickWP();
		} else {
			Pather.useWaypoint(46);
		}
	}

	Party.waitForMembers();
	Buff.Bo();
	Precast.doPrecast(true);

	for (i = 66; i <= 72; i += 1) {
		if (i !== getRoom().correcttomb) {
			Party.wholeTeamInGame();

			while (me.area === 46) {
				Pather.moveToExit(i, false, Config.ClearType); // Move to tomb, don't go in.

				Role.makeTeamJoinPortal(); // Make a portal outside of the tomb.

				Pather.moveToExit(i, true, Config.ClearType); // Go in the tomb.
			}

			Party.waitForMembers();
			Buff.Bo();
			if (clearAreas) {
				Attack.clearLevel(0);
			}

			chest = getPresetUnit(me.area, 2, 397);

			for (j = 0 ; j < 5 ; j += 1) {
				chest = getPresetUnit(me.area, 2, 397);

				if (chest) {
					break;
				}

				delay(me.ping * 2 + 250);
			}

			if (chest) {
				while (getDistance(me.x, me.y, chest.roomx * 5 + chest.x, chest.roomy * 5 + chest.y) > 10) {
					try {
						Pather.moveToPreset(me.area, 2, 397, 0, 0, true, false);
					} catch (e) {
						print("Caught Error.");

						print(e);
					}

					delay(me.ping * 2 + 250);

					Packet.flash(me.gid);
				}

				chest = getUnit(2, "chest");

				Misc.openChest(chest);
				
				delay(me.ping * 2 + 250);

				Pickit.pickItems();
			}

			Role.backToTown();
			
			HordeTown.doChores();

			delay(me.ping * 2 + 250);

			if (!Pather.usePortal(46, null)) {
				Town.move("waypoint");

				Pather.useWaypoint(46);
			}
		}
		
		if (Sequencer.shouldSkipCurrentSequence()) {
			break;
		}
	}
	
	Role.backToTown();

	return Sequencer.done;
}