/**
*	@filename	lamesen.js
*	@author		Adpist
*	@desc		Teleporting Sorc walks over to Alkor and completes the quest for everyone via exploit.
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function lamesen(mfRun) {
	var i, alkor, target;

	print("Lam Esen's Tome");

	Town.goToTown(3);

	Party.wholeTeamInGame();

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

		Misc.openChest(target);
		delay(300);

		target = getUnit(4, 548);
		Pickit.pickItem(target);
		Town.goToTown();
	}

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
		if (tries > 60)
		{
			quit();
		}
	}

	Town.move("stash");
	
	if (Role.teleportingChar)
	{
		Communication.sendToList(HordeSystem.allTeamProfiles, "Lam Essen");
	}
	
	//Pather.teleport = false;

	return true;
}