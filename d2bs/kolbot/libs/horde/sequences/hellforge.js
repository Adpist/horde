/**
*	@filename	hellforge.js
*	@author		Adpist
*	@desc		Complete the hell forge quest
*	@credits	Adpist
*/

function hellforge_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(23,0)) {
		if (!mfRun)
			HordeDebug.logUserError("hellforge", "mephisto isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop; //Stop: Mephisto isn't dead
	}
	
	if (mfRun) {
		return Sequencer.skip; //Skip: not supported as mf run
	}
	
	if (!mfRun && me.getQuest(27, 0)) {
		return Sequencer.skip;//Skip: quest already complete
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function hellforge(mfRun) {
	var leaveParty = false;
	var cain;
	
	Town.goToTown(4);
	
	if (Role.teleportingChar) {
		Travel.travel(8);
	}
	
	Party.waitForMembers();

	if (Role.teleportingChar) {
		Pather.teleport = true;
		
		Travel.travel(8);
		
		Pather.useWaypoint(107);
		
		Pather.moveToPreset(me.area, 2, 376);

		Role.makeTeamJoinPortal();
		
		Party.waitSynchro("hellforge_portal");
		
	} else {

		Town.move("portalspot");

		var j = 0;
		Party.waitSynchro("hellforge_portal");
		
		while (!Pather.usePortal(107, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}
	
	Pather.moveToPreset(me.area, 2, 376);
	
	if (me.diff === 2) {
		Attack.clear(30);
	}

	try {
		Attack.kill(getLocaleString(1067)); // Hephasto The Armorer
	} catch(e) {
		print(e);
	}
	
	Pather.moveToPreset(me.area, 2, 376, 0, 0, false, true);
	
	Attack.clear(40);
	
	Pather.moveToPreset(me.area, 2, 376, 0, 0, false, true);
	
	Party.secureWaitSynchro("secure_hellforge");

	if (!mfRun) {
		delay(me.ping*2 + 500);

		if (leaveParty) {
			if (Role.isLeader) {
				Party.leaveParty();
			}
		}
		
		if (Role.isLeader) {
			Quest.getQuestItem(90);
		} else {
			delay(me.ping*2 + 2000);
		}
		
		Pickit.pickItems();
		
		if (Role.isLeader) {
			if (me.getItem(90)) {
			
				Town.goToTown();
				cain = getUnit(1, "deckard cain");
				while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
					Packet.flash(me.gid);

					Town.move(NPC.Cain);
					cain = getUnit(1, "deckard cain");

					delay(1000);
				}
				
				me.cancel();
				
				if (!me.getItem(551)) {
					HordeDebug.logScriptError("hellforge", "leader failed to get mephisto soulstone");
					return Sequencer.fail;		
				}
				
				Quest.equipQuestItem(90);
				
				Pather.usePortal(107, me.name);
				
				Pather.moveToPreset(me.area, 2, 376);
				
				var forge = getUnit(2, 376);
				
				if (leaveParty) {
					Party.secureWaitSynchro("hellforge_left_party");
				}
				
				Misc.openChest(forge);
				
				Quest.smashPresetUnit(376);
				
				delay(me.ping*2 + 5000);
				
				for (var i = 0 ; i < 5 ; i += 1) {
					Pickit.pickItems();
					delay(1000);
				}
			} else {
				if (leaveParty) {
					Party.secureWaitSynchro("hellforge_left_party");
				}
			}
			
			Pickit.pickItems();
			
			if (leaveParty) {
				Town.goToTown();
				
				cain = getUnit(1, "deckard cain");
				while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
					Packet.flash(me.gid);

					Town.move(NPC.Cain);
					cain = getUnit(1, "deckard cain");

					delay(1000);
				}
				
				me.cancel();
				
				if (!me.getQuest(27,0)){
					D2Bot.printToConsole(me.profile + " failed to complete hellforge", 7);
				} else {
					D2Bot.printToConsole(me.profile + " completed hellforge", 5);
				}
				
				Pather.usePortal(107, me.name);
				
				for (var i = 0 ; i < 3 ; i += 1) {
					if (Party.joinHordeParty()) {
						break;
					}
					if (i === 2) {
						throw new Error("Failed to rejoin party after hellforge");
					}
				}
				
				Party.secureWaitSynchro("hellforge_joined_party", 30000);
			}
		} else {
			//Not leader
			if (leaveParty) {
				Town.goToTown();
				Party.secureWaitSynchro("hellforge_left_party");
				delay(me.ping*2 + 2000);
				Party.inviteTeammate(HordeSystem.leaderProfile);
				Party.secureWaitSynchro("hellforge_joined_party", 60000);
				Pather.usePortal(107, me.name);
			}
		}
		
		Party.secureWaitSynchro("completed_hellforge", 60000);
		
		delay(me.ping*2 + 2500);
		
		Pather.moveToPreset(me.area, 2, 376, 0, 0, false, true);
		
		Pickit.pickItems();
	}
	
	Role.backToTown();

	if (Role.isLeader) {
		Pickit.pickItems();
			
		Item.autoEquip(); // For leader to re-equip her weapon.
	}
	
	if ((Role.isLeader || !leaveParty) && !mfRun) {
		if(!me.getQuest(27,0)) {
			//Complete quest
			cain = getUnit(1, "deckard cain");
			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);

				Town.move(NPC.Cain);
				cain = getUnit(1, "deckard cain");

				delay(1000);
			}
			
			me.cancel();
			
			if (!me.getQuest(27,0)){
				D2Bot.printToConsole(me.profile + " failed to complete hellforge", 7);
			} else {
				D2Bot.printToConsole(me.profile + " completed hellforge", 5);
			}
		}
	}

	return Sequencer.done;
}
