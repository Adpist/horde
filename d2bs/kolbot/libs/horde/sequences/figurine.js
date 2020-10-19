/**
*	@filename	figurine.js
*	@author		Adpist
*	@desc		Perform the Golden Bird quest or wait for another character to do so, then drink the potion.
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function figurine_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("figurine", "Can't be done before duriel");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	
	if (me.getQuest(20,0)) {
		return Sequencer.skip;//Skip: Completed the quest
	}	
	
	if (me.getItem(546) || me.getItem(547)) {
		Communication.sendToList(HordeSystem.allTeamProfiles, "figurine");
		Communication.Questing.teamFigurine = true;
	}
	
	delay(1000);
	
	if (!Communication.Questing.teamFigurine) {
		return Sequencer.skip;//Skip : nobody have figurine
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function figurine(mfRun) {	
	var cain, alkor, meshif, potion;

/*	------- SiC-666 NOTES ------
	me.getQuest(20, 6) = ask cain about the jade figurine (persists after talking to cain)
	me.getQuest(20, 2) = Show Meshif the figurine (persists after talking to Meshif)
	me.getQuest(20, 16/19) = Ask cain about golden bird? need to check to see when these turn on. All i know is they are off before finding the figurine.
	me.getQuest(20, 4) = Give golden bird to Alkor
	me.getQuest(20, 1/28) = Return to Alkor for reward. 28 turns on once quest log is opened after reaching this stage.
	me.getQuest(20, 0) = Quest complete.
	me.getQuest(20, 5/12/13) = Quest complete/have potion? (16/19 persist at this stage, but 6/2/4/1 are off)
	me.getQuest(20, 5/12/13/16/19) = persists after drinking potion
----------------------------
*/

	Town.goToTown(3);

	if (me.getItem(546)) { // Have A Jade Figurine.
		if (!me.getQuest(20, 2)) { // Not at the "Show Meshif the Figurine" stage yet. Need to talk to Cain.
		
			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);
			
				Town.move(NPC.Cain);

				cain = getUnit(1, "deckard cain");

				delay(1000);
			}

			me.cancel();
		}

		Town.move("meshif");

		meshif = getUnit(1, "meshif");

		meshif.openMenu();
	}

	if (me.getItem(547)) { // Have The Golden Bird.
		if (!me.getQuest(20, 4)) { // Not at the "Give Golden Bird to Alkor" stage yet. Need to talk to Cain.
		
			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);
				
				Town.move(NPC.Cain);

				cain = getUnit(1, "deckard cain");

				delay(1000);
			}

			me.cancel();
		}

		Town.move("alkor");

		alkor = getUnit(1, "alkor");

		alkor.openMenu();

		me.cancel();
	}

	if (!me.getQuest(20, 1) && !me.getQuest(20, 0)) {
		var j = 0 ;

		while (!me.getQuest(20, 1) && !me.getQuest(20, 0)) { // Haven't done the Jade Figurine quest yet. It's possible another character has the Jade Figurine. After checking myself for it and processing if it had it, I should wait here until the "Return to Alkor for reward" stage.
			sendPacket(1, 0x40); // This is likely required to refresh the status of me.getQuest(20, 1) as has been tested with me.getQuest(18, 0) in this.travincal()

			delay(1000);

			if (j % 5 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}

	if (!me.getQuest(20, 0)) {
		Town.move("alkor");

		alkor = getUnit(1, "alkor");

		alkor.openMenu();

		me.cancel();
	}

	delay(500);

	potion = me.getItem(545);

	if (potion) {
		if (potion.location > 3) {
			this.openStash();
		}

		clickItem(1, potion);
	}

	Town.move(NPC.Cain);

	Communication.Questing.teamFigurine = false;

	return Sequencer.done;
}