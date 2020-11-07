/**
*	@filename	pindle.js
*	@author		Adpist
*	@desc		kill pindle (mf only)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function pindle_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("pindle",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("pindle",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}
	
	if (!mfRun) {
		return Sequencer.skip;//Skip : not supported
	}
	
	if (mfRun && !me.getQuest(37, 1) && !me.getQuest(37,0)){
		return Sequencer.skip;//Skip : anya quest not completed
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function pindle(mfRun) {
	Town.goToTown(5);
	
	if (Role.teleportingChar)
	{
		Town.move(NPC.Anya);
		if (!Pather.getPortal(121) && me.getQuest(37, 1)) {
			anya = getUnit(1, NPC.Anya);

			if (anya) {
				anya.openMenu();
				me.cancel();
			}
		}
		
		if (!Pather.usePortal(121)) {
			throw new Error("Failed to use portal.");
		}
		
		Precast.doPrecast(true);
		
		Pather.moveTo(10058, 13234);
		
		Role.makeTeamJoinPortal();
	}
	else
	{
		Town.move("portalspot");
		while(!Pather.usePortal(121, HordeSystem.team.profiles[HordeSystem.teleProfile].character)) {
			delay(1000);
		}
	}
	
	try {
		Attack.clear(15, 0, getLocaleString(22497)); // Pindleskin
	} catch (e) {
		print(e);
	}
	
	Pickit.pickItems();
	
	Role.backToTown();
	
	return Sequencer.done;
}