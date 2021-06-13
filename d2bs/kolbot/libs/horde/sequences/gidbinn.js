/**
*	@filename	gibdinn.js
*	@author		Adpist
*	@desc		complete the gidbinn quest
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function gidbinn_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("gibdinn", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (mfRun) {
		HordeDebug.logUserError("gibdinn",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getQuest(19, 0)) {
		return Sequencer.skip;//Skip: quest is done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function gidbinn(mfRun) {
	var i, alkor, target, altar;
	
	Town.goToTown(3);

	Party.wholeTeamInGame();
	
	if (Role.teleportingChar) {
		Travel.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.
	}

	if (!me.inTown) {
		Town.goToTown();
	}
	
	print("quest[19,0] : " + me.getQuest(19, 0) + " ; quest[19,1] : " + me.getQuest(19, 1)  + " ; quest[19,2] : " + me.getQuest(19, 2));
	
	if (Role.teleportingChar) {
		if (me.charlvl >=18 && me.classid ===1 ) {
			Pather.teleport = true;
		} else {
			Pather.teleport = false;
		}

		if (!Pather.useWaypoint(78, true)) {
			throw new Error("Gidbinn quest failed");
		}

		Precast.doPrecast(false);
		
		Pather.moveToPreset(me.area, 2, 252, false, false);
	
		Role.makeTeamJoinPortal();
		
	} else {
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(78, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}
	
	//altar = getPresetUnit(me.area, 2, 252);
	altar = getUnit(2, 252);
	
	Attack.clear(30);
	
	//Wait for spawn
	delay(me.ping*2 + 250);
	
	//Secure
	Party.secureWaitSynchro("before_gidbinn", 30000);
	
	//clickMap(0, 0, altar.x, altar.y);
	Misc.openChest(altar);
	
	//Wait for spawn
	delay(me.ping*2 + 5000);
	
	//Clear
	for (var i = 0 ; i < 5 ; i += 1) {
		Attack.clear(50);
		Pather.moveToUnit(altar);
		delay(me.ping*2 + 2000);
	}
		
	//Secure sync
	Party.secureWaitSynchro("after_gidbinn", 60000);
	
	if (Role.isLeader) {
		Quest.getQuestItem(87);
	}	
	
	Pickit.pickItems();

	Role.backToTown();
	
	print("quest[19,0] : " + me.getQuest(19, 0) + " ; quest[19,1] : " + me.getQuest(19, 1) + " ; quest[19,2] : " + me.getQuest(19, 2));
	Town.move(NPC.Ormus);

	target = getUnit(1, NPC.Ormus);

	var tries = 0;
	while(target && target.openMenu()) {
		me.cancel();
		sendPacket(1, 0x40); //to refresh the status of me.getQuest(19, 0).
		if (me.getQuest(19, 2) || me.getQuest(19, 0)) { // Have completed Gidbinn
			break;
		}
		tries += 1;
		delay(1000);
		if (tries > 10)
		{
			break;
		}
	}
	print("quest[19,0] : " + me.getQuest(19, 0) + " ; quest[19,1] : " + me.getQuest(19, 1) + " ; quest[19,2] : " + me.getQuest(19, 2));
	
	Town.move(NPC.Asheara);

	target = getUnit(1, NPC.Asheara);

	var tries = 0;
	while(target && target.openMenu()) {
		me.cancel();
		sendPacket(1, 0x40); //to refresh the status of me.getQuest(19, 0).
		if (me.getQuest(19, 0)) { // Have completed Gidbinn
			break;
		}
		tries += 1;
		delay(1000);
		if (tries > 10)
		{
			break;
		}
	}
	print("quest[19,0] : " + me.getQuest(19, 0) + " ; quest[19,1] : " + me.getQuest(19, 1) + " ; quest[19,2] : " + me.getQuest(19, 2));

	Town.move("stash");

	return Sequencer.done;
}