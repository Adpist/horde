/**
*	@filename	barbrescue.js
*	@author		Adpist
*	@desc		rescue barbarians in act 5
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function barbrescue_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("barbrescue",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("barbrescue",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}
	
	if (mfRun) {
		HordeDebug.logUserError("barbrescue",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (!mfRun && me.getQuest(36,0)) {
		return Sequencer.skip;//skip, quest is done
	}
	
	if (!Role.teleportingChar && !getWaypoint(Pather.wpAreas.indexOf(111))){
		return Sequencer.skip;
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function barbrescue(mfRun) { // SiC-666 TODO: Rewrite this.

	Town.goToTown(5);
	
	if (Role.teleportingChar) {
		Travel.travel(9);//Get all act wp if needed
	}
	
	var i, k, qual, door, skill, completionTries,
		coords =[],
		barbSpots = [];

	
	
	Party.wholeTeamInGame();
	
	if (Role.teleportingChar || HordeSystem.leaderProfile !== HordeSystem.teleProfile) {
		Pather.teleport = true;
		Pather.useWaypoint(111, false);
		Precast.doPrecast(true);
		barbSpots = getPresetUnits (me.area, 2, 473);

		if (!barbSpots) {
			return Sequencer.fail;
		}
	}
	
	if (Role.teleportingChar) {
		for ( i = 0  ; i < barbSpots.length ; i += 1) {
			coords.push({
				x: barbSpots[i].roomx * 5 + barbSpots[i].x - 3, //Dark-f: x-3
				y: barbSpots[i].roomy * 5 + barbSpots[i].y
			});
		}
		Config.PacketCasting = 1;

		for ( k = 0  ; k < coords.length ; k += 1) {
			print("going to barbspot "+(k+1)+"/"+barbSpots.length);
			Pather.moveToUnit(coords[k], 2, 0);
			door = getUnit(1, 434);
			if (!Role.isLeader) {
				Town.goToTown();
				Party.waitSynchro("portal_barb_rescue_"+k, 30000);
				Party.waitSynchro("team_in_barb_rescue_"+k, 10000);
				while (!Pather.usePortal(111, HordeSystem.team.profiles[HordeSystem.teleProfile].character)) {
					delay(250);
				}
			}
			if (door) {
				Pather.moveToUnit(door, 1, 0);
				for (i = 0; i < 20 && door.hp; i += 1) {
					if (me.getSkill(45, 1))
						Skill.cast(45, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(55, 1))
						Skill.cast(55, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(47, 1))
						Skill.cast(47, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(49, 1))
						Skill.cast(49, 0, door.x, door.y);
					delay(50);
				}
			}
			delay(1500 + 2 * me.ping); //barb going to town...
			if (!Role.isLeader) {
				Party.secureWaitSynchro("done_barb_rescue_"+k, 30000);
			}
		}
		
		Role.backToTown();
		
	} else if (HordeSystem.leaderProfile !== HordeSystem.teleProfile) {
		Role.backToTown();
		
		for ( i = 0  ; i < barbSpots.length ; i += 1) {
			Town.move("portalspot");
			
			Party.waitSynchro("portal_barb_rescue_"+i, 30000);
			while (!Pather.usePortal(111, HordeSystem.team.profiles[HordeSystem.teleProfile].character)) {
				delay(250);
			}
			Party.waitSynchro("team_in_barb_rescue_"+i, 10000);
			Party.secureWaitSynchro("done_barb_rescue_"+i, 30000);
			Role.backToTown();
		}
	} else {
		Role.backToTown();
	}
	
	Town.goToTown(5);
	
	Party.waitSynchro("barb_quest_done", 30000);
	
	delay(1000+me.ping);
	Town.move(NPC.Qual_Kehk);
	delay(1000+me.ping);
	qual = getUnit(1, NPC.Qual_Kehk);
	completionTries = 0;
	while(!me.getQuest(36,0)) {
		if (completionTries >= 30) {
			return Sequencer.fail;
		}
		qual.openMenu();
		me.cancel();
		delay(500);
		sendPacket(1, 0x40); //fresh Quest state.
		if (me.getQuest(36,0))
			break;
			
		completionTries += 1;
	}

	return Sequencer.done;
}
