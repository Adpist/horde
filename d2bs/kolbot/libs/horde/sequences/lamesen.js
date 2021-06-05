/**
*	@filename	lamesen.js
*	@author		Adpist
*	@desc		Teleporting Sorc walks over to Alkor and completes the quest for everyone via exploit.
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		Do the sync for followers
*/

function lamesen_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("lamesen", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (mfRun) {
		HordeDebug.logUserError("lamesen",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getQuest(17, 0)) {
		return Sequencer.skip;//Skip: quest is done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function lamesen(mfRun) {
	var i, alkor, target;
	
	Town.goToTown(3);

	Party.wholeTeamInGame();
	
	if (Role.teleportingChar) {
		Travel.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.
	}

	if (!me.inTown) {
		Town.goToTown();
	}
	if (Role.teleportingChar) {
		if (me.charlvl >=18 && me.classid ===1 ) {
			Pather.teleport = true;
		} else {
			Pather.teleport = false;
		}

		if (!Town.goToTown() || !Pather.useWaypoint(80, true)) {
			throw new Error("Lam Essen quest failed");
		}

		Precast.doPrecast(false);

		if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
			throw new Error("Lam Essen quest failed");
		}

		if (Pather.teleport === true) {
			Travel.clearToExit(80, 94, false);

			if (!Pather.moveToPreset(me.area, 2, 193, 0, 0, 0)) {
				Pather.moveToPreset(me.area, 2, 193);
			}

		} else {
			Travel.clearToExit(80, 94, 0);
			if (!Pather.moveToPreset(me.area, 2, 193, 0, 0, 0)) {
				Pather.moveToPreset(me.area, 2, 193);
			}
		}

		target = getUnit(2, 193);

		if (Role.isLeader) {
			Misc.openChest(target);
			delay(300);

			target = getUnit(4, 548);
			Pickit.pickItem(target);
			Town.goToTown();
		
		} else {
			Town.goToTown();
			delay(10000);
		}
	} else {
		if (Role.isLeader) {
			Town.move("portalspot");
			while(!Pather.getPortal(94, null) && !Pather.usePortal(94, null)) {
				delay(me.ping*2+250);
			}
			target = getUnit(2, 193);
			Misc.openChest(target);
			delay(300);

			target = getUnit(4, 548);
			Pickit.pickItem(target);
			Town.goToTown();
		}
	}

	Party.waitSynchro("book_picked");
	
	if (!me.getQuest(17,0) && me.getItem(548)) {
		Town.move("alkor");

		target = getUnit(1, "alkor");

		var tries = 0;
		while(target && target.openMenu()) {
			me.cancel();
			sendPacket(1, 0x40); //to refresh the status of me.getQuest(17, 0).
			if (me.getQuest(17, 0)) { // Have completed Lam Esen's Tome.
				break;
			}
			tries += 1;
			delay(1000);
			if (tries > 3)
			{
				break;
			}
		}
	}

	Town.move("stash");

	return Sequencer.done;
}