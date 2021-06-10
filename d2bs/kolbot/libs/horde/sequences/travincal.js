/**
*	@filename	travincal.js
*	@author		Adpist
*	@desc		Kill concil and complete quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		check for mf run
*/

function travincal_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("travincal", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (!mfRun){
		if (me.getQuest(21, 0) && (me.getQuest(18, 0) ||me.getQuest(23,0))) {
			return Sequencer.skip; //quest done
		}

		if (Role.teleportingChar && ((!me.getItem(555) || !me.getItem(553) || !me.getItem(554)) && !me.getItem(174))) {
			HordeDebug.logUserError("travincal", "can't complete quest, don't have items");
			return Sequencer.stop; //can't complete quest, don't have items
		}
	}
	else {
		if (!(me.getQuest(21, 0) && (me.getQuest(18, 0) || me.getQuest(23,0)))) {
			return Sequencer.skip;//quest isn't done, skip
		}
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function travincal(mfRun) {

	var cain, orgX, orgY, preArea,
		startNearWp = !mfRun;//For now we always start near wp when questing for safety reasons. could be added as an option when sequence parameters are a thing.
	Town.repair();
	var ogFastPick = Config.FastPick;
	var ogUseTelekinesis = Config.UseTelekinesis;
	var ogUseMerc =	Config.UseMerc;
	var ogMercWatch = Config.MercWatch;
	var ogHPBuffer = Config.HPBuffer;
	
	this.buildList = function (checkColl) {
		var monsterList = [],
			monster = getUnit(1);

		if (monster) {
			do {
				if ([345, 346, 347].indexOf(monster.classid) > -1 && Attack.checkMonster(monster) && (!checkColl || !checkCollision(me, monster, 0x1))) {
					monsterList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		return monsterList;
	};

	Party.wholeTeamInGame();


	Town.goToTown(3);
	if (!mfRun) {
		if(Config.HPBuffer < 8){
			Config.HPBuffer = 8; // bulk up
		}
		Town.buyPotions(); //force load up on pots
	}
	delay(3000);
	Party.allPlayersInArea(); //get team ready for portal
	if (!mfRun) {
		var tries = 0;
		while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
			Packet.flash(me.gid);

			Town.move(NPC.Cain);

			cain = getUnit(1, NPC.Cain);

			delay(1000);
			tries += 1;
			if (tries >= 3) {
				break;
			}
		}

		me.cancel();
		if (Role.teleportingChar) {
			Config.FastPick = true; // get the good items incase we fail
			Config.UseTelekinesis = true;
		}
		Config.UseMerc = false;
		Config.MercWatch = false;
		Config.TeleStomp = false;
	}

	if (Role.teleportingChar) { // I am the Teleporting Sorc, open a portal to Travincal next to the High Council.
		Pather.teleport = true;
		
		Pather.useWaypoint(83);

		Precast.doPrecast(true);

		orgX = me.x;
		orgY = me.y;

		if (!mfRun) {
			Party.wholeTeamInGame();
		}
		
		//Make starting next to council configurable for questing
		if(!startNearWp){
			Pather.moveTo(orgX + 129, orgY - 92, 5, false);	// (<3 kolton)
		} else {
			Pather.moveTo(orgX+17, orgY-5, 5, false); // just outside wp room
		}
		
		Role.makeTeamJoinPortal();
	} else { // I am not a Sorc, enter the Sorc's Travincal portal.
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(83, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}
	
	orgX = me.x;
	orgY = me.y;
	
	if (startNearWp) {
		//try to move progressivelly to council
		Party.secureWaitSynchro("trav_start");
		Pather.teleport = false;
		Pather.moveTo(orgX+12, orgY-31, 2, false, true);	// (<3 kolton)
		Attack.clear(30);
		Pather.moveTo(orgX+80, orgY-31, 2, false, true);	// (<3 kolton)
		delay(me.ping+50);
		Pather.moveTo(me.x + rand(-3, 3), me.y + rand(-3, 3)); // Move off of waypoint so others can reach it.
		Party.secureWaitSynchro("trav_lake");
		Attack.clear(30);
		Pather.moveTo(orgX+80, orgY-59, 2, false, true);	// (<3 kolton)
		delay(me.ping+50);
		Pather.moveTo(me.x + rand(-3, 3), me.y + rand(-3, 3)); // Move off of waypoint so others can reach it.
		Party.secureWaitSynchro("trav_entrance");
		Attack.clear(30);
		Pather.moveTo(orgX+80, orgY-73, 2, false, true);	// (<3 kolton)
		delay(me.ping+50);
		Pather.moveTo(me.x + rand(-3, 3), me.y + rand(-3, 3)); // Move off of waypoint so others can reach it.
		Party.secureWaitSynchro("trav_building");
		Attack.clear(30);
		Pather.moveTo(orgX+80, orgY-98, 2, false, true);	// (<3 kolton)
		Attack.clear(30);
		Pather.moveTo(orgX+60, orgY-98, 2, false, true);	// (<3 kolton)
		Attack.clear(30);
		
	} else {
		try {
			Pather.moveToExit(100, false, 0);
		} catch (error){
			print("Error in move clear to start trav battle: "+error);
		}
	}
	
	Attack.clearList(this.buildList(0)); // Kill the High Council

	Pickit.pickItems();

	if (startNearWp) {
		delay(me.ping+50);
		Pather.moveTo(orgX+80, orgY-73, 2, false, true);	// (<3 kolton)
		Pather.moveTo(me.x + rand(-3, 3), me.y + rand(-3, 3)); // Move off so others can reach position.
	}
	
	
	if (!mfRun) {
		Party.waitForMembers();
		
		if (Role.isLeader && !me.getQuest(18, 0)) { // I am the Teleporting Sorc and I have not completed Khalim's Will yet. Will smash the orb while the others keep the area clear.
			if(!me.getItem(174)){
				print("get flail");
				Quest.getQuestItem(173); // Pick up Khalim's Flail.
			}

			preArea = me.area;

			if (!me.inTown) {
				Town.goToTown();
			}

			if(!me.getItem(174)){
				print("make will");
				Quest.cubeFlail(); // Make Khalim's Will if I have the ingredients.
			}
			Town.goToTown();


			Quest.equipQuestItem(174) // This function purposely throws an error if Khalim's Will isn't present or is lost in the process.

			Town.move("portalspot");

			if (!Pather.usePortal(preArea, me.name)) {
				throw new Error("HordeSystem.travincal: Failed to go back from town");
			}

			Config.PacketCasting = 1;

			Party.wholeTeamInGame();
			
			Party.secureWaitSynchro("before_flail");
			Party.wholeTeamInGame();
			Quest.smashPresetUnit(404);
			Party.wholeTeamInGame();
			Party.secureWaitSynchro("after_flail");
		} else { // I am not the Teleporting Sorc or Khalim's Will has been completed. If it the latter is true the while loop on the next line will be skipped.
			
			Pather.moveToExit(100, false); // Stairs to Durance of Hate Level 1.
			Party.secureWaitSynchro("before_flail");
			Party.secureWaitSynchro("after_flail");
		}
		
		var unit = getUnit(4, 546);
		if (unit && Role.isLeader) {
			Quest.getQuestItem(546);
		}
	}

	if (Role.teleportingChar) {
		Pather.teleport = true;
	}
	
	Role.backToTown();

	if (!mfRun) {
		if (Role.isLeader){
			Pickit.pickItems();
		}
		
		Item.autoEquip(); // For Role.teleportingChar to re-equip her weapon.
	}

	Config.FastPick = ogFastPick;
	Config.UseTelekinesis = ogUseTelekinesis;
	Config.UseMerc = ogUseMerc;
	Config.MercWatch = ogMercWatch;
	Config.HPBuffer = ogHPBuffer;
	
	return Sequencer.done;
}
