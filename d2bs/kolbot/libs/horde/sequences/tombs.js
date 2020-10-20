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
	
	if (!mfRun && Role.teleportingChar) {
		Travel.travel(4);
	}
	
	Communication.sendToList(HordeSystem.allTeamProfiles, "tombs");
	
	Town.doChores();
	Pather.teleport = false;

	if (me.act !== 2) {
		Town.goToTown(2);
	}

	Config.ClearType = 0;

	if (Role.teleportingChar) {
		if (me.area !== 46) {
			Pather.useWaypoint(46);
		}

		Pather.makePortal();
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

				Pather.makePortal(); // Make a portal outside of the tomb.

				Pather.moveToExit(i, true, Config.ClearType); // Go in the tomb.
			}

			Party.waitForMembers();
			Buff.Bo();
			Attack.clearLevel(0);

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
						Pather.moveToPreset(me.area, 2, 397, 0, 0, Config.ClearType, false);
					} catch (e) {
						print("Caught Error.");

						print(e);
					}

					delay(me.ping * 2 + 250);

					Packet.flash(me.gid);
				}

				chest = getUnit(2, "chest");

				Misc.openChest(chest);

				Pickit.pickItems();

			//	Attack.clear(40);
			}

			if (Misc.getNearbyPlayerCount() > 1) { // There are other characters nearby.
				delay(rand(2,10) * 500); // Delay 1-5 seconds to increase the chances of taking someone else's portal.
			}

			if (!Pather.usePortal(null, null)) {
				Town.goToTown();
			}

			delay(me.ping * 2 + 250);

			if (!Pather.usePortal(46, null)) {
				Town.move("waypoint");

				Pather.useWaypoint(46);
			}
		}
		
		if (Party.hasReachedLevel(HordeSettings.tombsLvl)) {
			break;
		}
	}

	if (!Pather.usePortal(null, null)) { // Need to finish in town.
		Town.goToTown();
	}
	
	
	if (!Party.hasReachedLevel(HordeSettings.tombsLvl)) {
		Farm.areasLevelling(HordeSettings.tombsLvlAreas);
	}

	if (!Party.hasReachedLevel(HordeSettings.tombsLvl)) {
		print("Not ready to start Duriel.");

		delay(1000);

		quit();
	}
	
	Communication.Questing.tombs = false;

	return Sequencer.done;
}