/**
*	@filename	summoner.js
*	@author		Adpist
*	@desc		Move to & Kill summoner
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		Followers syncro
*/

function summoner_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if(!me.getQuest(7, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("summoner", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1
	}
	
	if (mfRun && !me.getQuest(13,0)) {
		return Sequencer.skip;//Skip: mf run and summoner is not done
	}
	
	if (!mfRun && me.getQuest(13,0) && getWaypoint(Pather.wpAreas.indexOf(46))) {
		return Sequencer.skip;//Skip: questing run and summoner is done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

// Teleporting Sorc will be at least level 18 as required by MAIN to reach this stage.
// TODO : no guarantee anymore
function summoner(mfRun) {
	var i, journal;
	
	Town.goToTown(2);
	
	if (!mfRun) {
		var drognan, cain;
		while (!drognan || !drognan.openMenu()) { // Try more than once to interact with Drognan.
			Packet.flash(me.gid);

			Town.move(NPC.Drognan);

			drognan = getUnit(1, NPC.Drognan);

			delay(1000);
		}
	}
	
	if (!mfRun && Role.teleportingChar) {
		Travel.travel(4);
	}
	
	
	if (!me.inTown) {
		Town.goToTown();
	}
	
	if (!mfRun) {
		Town.repair();
		Town.buyPotions();
		Party.wholeTeamInGame();
	}

	if (Role.teleportingChar) {
	
		if (mfRun) {
			Pather.useWaypoint(74, true);
		}
		else {
			Pather.teleport = true;
			
			if (me.area !== 74) {
				if (!me.inTown) {
					Town.goToTown();
				}

				Town.move("waypoint");

				Pather.useWaypoint(74, true);
			}
		}

		Precast.doPrecast(true);

		journal = getPresetUnit(74, 2, 357);

		if (!journal) {
			throw new Error("HordeSystem.summoner: No preset unit in Arcane Sanctuary.");
		}

		while (getDistance(me.x, me.y, journal.roomx * 5 + journal.x - 3, journal.roomy * 5 + journal.y - 3) > 10) {
			try {
				Pather.moveToPreset(74, 2, 357, -3, -3, false, false);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}
		}

		Pather.makePortal();
	} else {
		Town.goToTown(2);
		
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(74, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}

	Party.wholeTeamInGame();

	try {
		Attack.kill(250);
	} catch (e) {
	
	}
	
	Pather.moveToPreset(74, 2, 357, -3, -3, true);
	
	Attack.clear(20);

	Pickit.pickItems();

	Pather.moveToPreset(74, 2, 357, -3, -3, true);
	
	Party.secureWaitSynchro("after_summoner");

	journal = getUnit(2, 357);

	for (i = 0; i < 5; i += 1) {
		if (journal) {
			sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);

			delay(1000);

			me.cancel();
		}
		if(i>1){
			if(i===2){
				sendPacket(1, 0x40); // Refresh quest status
				delay(1000);
			}
			if(me.getQuest(13, 0)){
				i=5;
				break;
			}
		}
		if (Pather.getPortal(46)) {
			break;
		}
	}


	if (i === 5) {
		if(me.getQuest(13, 0)){
			for (i = 0; i < 5; i += 1) {
				Town.goToTown();				
				delay(1500);
				Town.move("portalspot");				
				delay(1500);
				if(Pather.getPortal(46)){
					break;
				}
				delay(1500);
			}
		}
		if (i === 5) {
			throw new Error("summoner failed");
		}
	}

	while(me.area !== 46) {
		try{
			Pather.usePortal(46);
		} catch (e) {
			Attack.clear(20);
		}
		
	}

	if (mfRun) {
		Pather.useWaypoint(1);
	}
	else {
		Waypoint.clickWP();
	}
	
	Role.backToTown();
	
	Town.move(NPC.Cain);
	
	var cain = getUnit(1, NPC.Cain);

	if (cain && cain.openMenu()) {
		me.cancel();
	}

	return Sequencer.done;
}
