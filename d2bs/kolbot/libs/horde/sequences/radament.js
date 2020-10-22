/**
*	@filename	radament.js
*	@author		Adpist
*	@desc		Kill radament, use book and complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		Handle run without teleport for normal ?
*/

function radament_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if(!me.getQuest(7, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("radament", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1
	}
	
	if (mfRun) {
		HordeDebug.logUserError("radament",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (!mfRun && me.getQuest(9,0)){
		return Sequencer.skip;//Skip : quest done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function radament(mfRun) {
	var i, radament, book, atma,
		pathX = [5106, 5205, 5205, 5214, 5222],
		pathY = [5125, 5125, 5152, 5153, 5181];
	
	Town.doChores();
	Party.wholeTeamInGame();

	if (!me.getQuest(9, 1)) {
		if (Role.teleportingChar) {
			Pather.teleport = true;
			Config.ClearType = false;
			if (getWaypoint(10)) {
				Pather.useWaypoint(48, true);
			} else {
				Town.goToTown(2);
				while (me.area !== 48) {
					if (me.area === 47) {
						try {
							Pather.moveToExit(48, true);
						} catch (e2) {
							print(e2);
							Town.goToTown(2);
						}
					} else if (me.area === 40) {
						for (i = 0; i < pathX.length; i += 1) {
							Pather.moveTo(pathX[i], pathY[i]);
							Packet.flash(me.gid);
							delay(me.ping * 2 + 100);
						}
						try {
							Pather.moveToExit(47, true);
						} catch (e3) {
							print(e3);
							Town.goToTown(2);
						}
					}
					Packet.flash(me.gid);
					delay(me.ping * 2 + 100);
				}
				Waypoint.clickWP();
			}
			Travel.clearToExit(48, 49, false);
			for (i = 0 ; i < 5 ; i += 1) {
				radament = getPresetUnit(49, 2, 355); // Chest by Radament.
				if (radament) {
					break;
				}
				delay(me.ping * 2 + 250);
			}
			while (getDistance(me.x, me.y, radament.roomx * 5 + radament.x, radament.roomy * 5 + radament.y) > 10) {
				try {
					Pather.moveToPreset(49, 2, 355, 0, 0, false, false);
				} catch (e) {
					print("Caught Error.");
					print(e);
				}
			}
			
			Pather.makePortal();
			
			//radament = getUnit(1, 229); // Radament.
			//Pather.moveToUnit(radament, 0, 0, false);
			
			Communication.sendToList(HordeSystem.allTeamProfiles, "kill radament");
		} else {
			Town.move("portalspot");
			var j = 0;
			while (me.area === 40) {
				delay(250);
				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}
				j += 1;
				if (Communication.Questing.killRadament) {
					Pather.usePortal(49, null);
				}
			}
		}

		Attack.clear(30);
		
		Party.wholeTeamInGame();
		Buff.Bo();
		try {
			Attack.kill(229); // Radament
		} catch (e) {
			print("Caught Error.");
			print(e);
			Attack.clear(30);
		}
		Quest.getQuestItem(552);
		book = me.findItem(552);
		if (book) {
			clickItem(1, book);
		}
		Town.goToTown();
	}
	Town.move("atma");
	atma = getUnit(1, "atma");
	atma.openMenu();
	me.cancel();
	//Pather.teleport = false;
	Communication.Questing.radament = false;
	return Sequencer.done;
}