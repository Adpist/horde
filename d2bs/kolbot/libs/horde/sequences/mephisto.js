/**
*	@filename	mephisto.js
*	@author		Adpist
*	@desc		Kill mephisto and take portal
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		check takeRedPortalOnly
*				areasLevelling handled in script :/
*/

function mephisto_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("mephisto", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (mfRun && !me.getQuest(23,0)) {
		return Sequencer.skip; //Skip : mephisto is not dead
	}
	
	if (!mfRun) {
		//Skip : quest already completed
		if (me.getQuest(23,0)) {
			return Sequencer.skip;
		}
		
		//Stop : can't complete quest
		if (!me.getQuest(18, 0) || !me.getQuest(21, 0)) {
			HordeDebug.logScriptError("mephisto", "Can't complete quest");
			return Sequencer.stop;
		}
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function mephisto(mfRun) {	
	var cain, clearLvl3 = false, i, redPortal;

	Town.repair();
	Pather.teleport = true;

	if (Role.teleportingChar) { // I am the Teleporting Sorc.
		Travel.travel(7);// Travel to Durance Of Hate Level 2 Waypoint if I don't have it.
		
		Pather.useWaypoint(101);

		Precast.doPrecast(true);

		Travel.clearToExit(101, 102, false);

		Pather.moveTo(17566, 8069);

		Pather.makePortal();
	} else {
		Town.goToTown(3);

		Town.move(NPC.Cain);

		cain = getUnit(1, "deckard cain");

		if (!cain || !cain.openMenu()) {
			return Sequencer.fail;
		}

		me.cancel();

		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(102, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
		
		if (mfRun) {
			Buff.selfBo();
		}
	}

	Party.wholeTeamInGame();

	if (!Communication.Questing.redPortal) {
		try
		{
			if (!Attack.kill(242)) {
				Attack.clear(20);
			}
		}
		catch(e)
		{
			Attack.clear(20);
		}

		Pickit.pickItems();
	}
	
	if (mfRun)
	{
		if (mfRun && clearLvl3) {
			Pather.teleport = false;
			Attack.clearLevel(0);
			Pather.teleport = true;
		}
	}

	if (mfRun ||
		((me.getQuest(22, 0) || me.getQuest(22, 12)) && 
			((me.diff === 0 && Party.hasReachedLevel(HordeSettings.mephLvl)) 
			|| (me.diff === 1 && Party.hasReachedLevel(HordeSettings.mephLvlnm)) 
			|| (me.diff === 2 && Party.hasReachedLevel(HordeSettings.mephLvlhell))))) { // Completed Meph Quest and the party has reached the difficulty specific HordeSettings.mephLvl requirement.
		
		for (i = 0 ; i < 5 ; i += 1) {
			redPortal = getPresetUnit(102, 2, 342);

			if (redPortal) {
				break;
			}

			delay(me.ping * 2 + 250);
		}

		while (getDistance(me.x, me.y, redPortal.roomx * 5 + redPortal.x, redPortal.roomy * 5 + redPortal.y) > 10) {
			try {
				Pather.moveToPreset(102, 2, 342, 0, 0, false, false);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}
		}

		while (me.area === 102) {
			redPortal = getUnit(2, 342);

			Pather.usePortal(null, null, redPortal); // Go to Act 4.
		}		
	}
	//TODO : move this elsewhere
	else {
		Town.goToTown();

		Town.doChores();
		
		if (me.diff === 0 && !Party.hasReachedLevel(HordeSettings.mephLvl))
		{
			Farm.areasLevelling(HordeSettings.mephLvlAreas, HordeSettings.mephLvl);
		}			
		else if (me.diff === 1 && !Party.hasReachedLevel(HordeSettings.mephLvlnm))
		{
			Farm.areasLevelling(HordeSettings.mephLvlnmAreas, HordeSettings.mephLvlnm);
		} 
		else if (me.diff === 2 && !Party.hasReachedLevel(HordeSettings.mephLvlhell))
		{
			Farm.areasLevelling(HordeSettings.mephLvlhellAreas, HordeSettings.mephLvlhell);
		}
	}

	//Pather.teleport = false;

	Party.waitForMembers();

	return Sequencer.done;
}