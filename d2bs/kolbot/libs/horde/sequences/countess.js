/**
*	@filename	countess.js
*	@author		Adpist
*	@desc		Move to countess (clearing path if normal) and kill countess
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function countess_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun && me.getQuest(5,0)) {
		return Sequencer.skip;//Skip: quest run and already completed
	}
	
	if (mfRun && !me.getQuest(5,0) && !me.getQuest(7,0)) {
		return Sequencer.skip;//Skip : mf run and countess and andy quest are not done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function countess(mfRun) {
	var clearPath = me.diff === 0, poi;
	
	if (Role.teleportingChar || me.diff === 0)
	{
		if (!getWaypoint(4))
		{
			Pather.useWaypoint(5);
			Travel.clearToExit(5, 6, clearPath);
			if (clearPath)
				Party.waitForMembers();
			Pather.getWP(6, clearPath);
		}
		else
		{
			Pather.useWaypoint(6);
		}
		
		if (clearPath)
		{
			Travel.clearToExit(6, 20, clearPath);
			Travel.clearToExit(20, 21, clearPath);
			Party.waitForMembers();
			Travel.clearToExit(21, 22, clearPath);
			Party.waitForMembers();
			Travel.clearToExit(22, 23, clearPath);
			Party.waitForMembers();
			Travel.clearToExit(23, 24, clearPath);
			Party.waitForMembers();
			Travel.clearToExit(24, 25, clearPath);
		}
		else
		{
			Travel.moveToExit(6, 20, clearPath);
			Travel.moveToExit(20, 21, clearPath);
			Travel.moveToExit(21, 22, clearPath);
			Travel.moveToExit(22, 23, clearPath);
			Travel.moveToExit(23, 24, clearPath);
			Travel.moveToExit(24, 25, clearPath);
		}
		if (Role.teleportingChar && me.diff !== 0)
		{
			poi = getPresetUnit(me.area, 2, 580);

			if (poi) {
				switch (poi.roomx * 5 + poi.x) {
				case 12565:
					Pather.moveTo(12578, 11043);
					break;
				case 12526:
					Pather.moveTo(12548, 11083);
					break;
				}
			}
			
			Pather.makePortal();
		}
		
		Party.wholeTeamInGame();
	}
	else
	{
		Travel.waitAndUsePortal(1, 25);
		Buff.selfBo();
	}
	
	if (clearPath)
	{
		Party.waitForMembers();
		Attack.clearLevel(0);
	}
	else
	{
		Attack.clear(20);
		try {
			Attack.clear(20, 0, getLocaleString(2875)); // The Countess
		} catch(e) {
			print(e);
		}
	}
	
	Pickit.pickItems();

	if (!Role.backToTown()) {
		Town.goToTown();
	}
	
	return Sequencer.done;
}