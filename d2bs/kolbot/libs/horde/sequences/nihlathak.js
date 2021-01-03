/**
*	@filename	nihlathak.js
*	@author		Adpist
*	@desc		kill nihlathak (quest & mf)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function nihlathak_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("nihlathak",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("nihlathak",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}
	
	if (!me.getQuest(37, 1) && !me.getQuest(37,0)){
		if (!mfRun)
			HordeDebug.logUserError("nihlathak",  "anya is not done");
		return  mfRun ? Sequencer.skip : Sequencer.stop;//Stop : anya isn't done
	}
	
	if (!mfRun && (me.getQuest(38,0) || me.getQuest(38,1))) {
		return Sequencer.skip;//not mf run and quest is already done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function nihlathak(mfRun) {
	var useWaypoint = false;
	
	Town.goToTown(5);
	
	if (Role.teleportingChar)
	{
		if (Waypoint.hasWaypoint(123)) {
			Pather.useWaypoint(123);
			Precast.doPrecast(true);
		} else {
			Town.move(NPC.Anya);
			if (!Pather.getPortal(121) && me.getQuest(37, 1)) {
				anya = getUnit(1, NPC.Anya);

				if (anya) {
					anya.openMenu();
					me.cancel();
				}
			}
			
			if (!Pather.usePortal(121)) {
				if (useWaypoint) {
					Pather.useWaypoint(123);
					Precast.doPrecast(true);
				} else {
					throw new Error("Failed to use portal.");
				}
			}
			else {
				Precast.doPrecast(true);
				Pather.moveToExit(122, true);
				delay(me.ping*2 + 250);
				Pather.moveToExit(123, true);
				delay(me.ping*2 + 250);
				if (useWaypoint) {
					Waypoint.clickWP();
				}
			}
		}
		
		Pather.moveToExit(124, true);
				
		Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);
		
		Role.makeTeamJoinPortal();
		
		Party.secureWaitSynchro("portal_nihlathak");
	}
	else
	{
		Town.move("portalspot");
		while(!Pather.usePortal(124, HordeSystem.team.profiles[HordeSystem.teleProfile].character)) {
			delay(1000);
		}
		Party.secureWaitSynchro("portal_nihlathak");
	}
	
	try {
		Attack.kill(526);
	} catch (e) {
		print(e);
	}
	
	try {
		Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);
		Attack.clear(30);
		Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);
	} catch (e) {
		Attack.clear(30);
	}
	
	Party.secureWaitSynchro("post_nihlathak");
	
	Pickit.pickItems();
	
	Role.backToTown();
	
	return Sequencer.done;
}