/**
*	@filename	smith.js
*	@author		Adpist
*	@desc		Move to smith, kill it and complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function smith_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (mfRun) {
		HordeDebug.logUserError("smith",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getQuest(3,0) || me.getQuest(3,1)) {
		return Sequencer.skip;//Skip: quest run & already completed
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function smith(mfRun) {
	var i, charsi, clearPath = me.diff === 0;
	
	Town.goToTown();
	
	if (clearPath || Role.teleportingChar)
	{
		if (!getWaypoint(5))
		{
			Pather.getWP(27, clearPath);
		}
		Pather.useWaypoint(27);
		Precast.doPrecast(true);
		
		if (clearPath)
		{
			Travel.clearToExit(27, 28, clearPath);
		}
		else
		{
			Travel.moveToExit(27,28, false);
		}

		for(i = 0 ; i < 5 ; i += 1)
		{
			if (Pather.moveToPreset(28, 2, 108, 0 ,0, clearPath)) {
				break;
			}
			else if (i === 4)
			{
				HordeDebug.logScriptError("smith", "failed to go to smith");
				return Sequencer.fail;
			}
		}
		
		if (!clearPath && Role.teleportingChar)
		{
			Pather.makePortal();
		}
	}
	else if (!clearPath)
	{
		Town.goToTown(1);
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(28, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
		
		for(i = 0 ; i < 5 ; i += 1)
		{
			if (Pather.moveToPreset(28, 2, 108, 0 ,0, clearPath)) {
				break;
			}
			else if (i === 4)
			{
				HordeDebug.logScriptError("smith", "failed to go to smith");
				return Sequencer.fail;
			}
		}
	}
	
	try
	{
		Attack.kill(getLocaleString(2889)); // The Smith
	}
	catch (e)
	{
	}
	
	Attack.clear(20);
	if (Role.teleportingChar)
	{
		Quest.getQuestItem(89, 108);
	}
	Pickit.pickItems();

	Town.goToTown();
	
	for (i = 0 ; i < 10 ; i += 1)
	{
		Town.move(NPC.Charsi);
		charsi = getUnit(1, "charsi");
		charsi.openMenu();
		me.cancel();
		
		if (me.getQuest(3,1))
		{
			break;
		}
	}
	
	return Sequencer.done;
}