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
		if (Role.teleportingChar && !me.getItem(555) && !me.getItem(553) && !me.getItem(554) && !me.getItem(555)) {
			HordeDebug.logUserError("travincal", "can't complete quest, don't have items");
			return Sequencer.stop; //can't complete quest, don't have items
		}
		
		if (me.getQuest(21, 0)) {
			return Sequencer.skip; //quest done
		}
	}
	else {
		if (!me.getQuest(21, 0)) {
			return Sequencer.skip;//quest isn't done, skip
		}
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function travincal(mfRun) {
	Communication.sendToList(HordeSystem.allTeamProfiles, "travincal");

	var cain, orgX, orgY, preArea;
	Town.repair();
	
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
		while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
			Packet.flash(me.gid);

			Town.move(NPC.Cain);

			cain = getUnit(1, "deckard cain");

			delay(1000);
		}

		me.cancel();
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

		Pather.moveTo(orgX + 129, orgY - 92, 5, false);	// (<3 kolton)

		Pather.makePortal();
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

	if (me.diff === 0) { // All characters don't teleport during the fight in normal.
		Pather.teleport = false;
	}

	Attack.clearList(this.buildList(0)); // Kill the High Council

	Pickit.pickItems();

	if (!mfRun) {
		if (Role.teleportingChar && !me.getQuest(18, 0)) { // I am the Teleporting Sorc and I have not completed Khalim's Will yet. Will smash the orb while the others keep the area clear.
			Quest.getQuestItem(173); // Pick up Khalim's Flail.

			preArea = me.area;

			if (!me.inTown) {
				Town.goToTown();
			}

			Quest.cubeFlail(); // Make Khalim's Will if I have the ingredients.

			Quest.equipFlail() // This function purposely throws an error if Khalim's Will isn't present or is lost in the process.

			Town.move("portalspot");

			if (!Pather.usePortal(preArea, me.name)) {
				throw new Error("HordeSystem.travincal: Failed to go back from town");
			}

			Config.PacketCasting = 1;

			Party.wholeTeamInGame();
			delay(30000); //TODO better logic one day, this is to hope everyone gets ready & is here for a bit	
			Party.wholeTeamInGame();
			Quest.placeFlail();
		} else { // I am not the Teleporting Sorc or Khalim's Will has been completed. If it the latter is true the while loop on the next line will be skipped.
			while (!me.getQuest(18, 0)) { // I am not the Teleporting Sorc and have not completed Khalim's Will yet.
				sendPacket(1, 0x40); // This is required to refresh the status of me.getQuest(18, 0). Without it, me.getQuest(18, 0) will not == 1 until the Quest Tab is opened on the character.

				Pather.moveToExit(100, false); // Stairs to Durance of Hate Level 1.

				Attack.clear(15);

				delay(1000);
			}
		}
		var unit = getUnit(4, 546);
		if (unit && Role.teleportingChar) {
			Quest.getQuestItem(546);
		}
	}
	
	if (me.findItem(546) || me.findItem(547) || me.getQuest(20, 1)) { // Have A Jade Figurine or The Golden Bird or need to Return to Alkor for Reward (possible if someone's Pickit then Town processes the Quest). Tell the Teleporting Sorc so she gets us to process it.
		Communication.sendToList(HordeSystem.allTeamProfiles, "team figurine");

		Communication.Globals.teamFigurine = true;
	}

	if (Role.teleportingChar) {
		Pather.teleport = true;
	}
	
	Town.goToTown();

	if (!mfRun) {
		if (Role.teleportingChar){
			Pickit.pickItems();
		}
		
		Item.autoEquip(); // For Role.teleportingChar to re-equip her weapon.

		Party.waitForMembers(); // Wait for everyone to finish Travincal and come to town so I don't miss someone announcing team figurine.
	}

	return Sequencer.done;
}
