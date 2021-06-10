/**
*	@filename	cain.js
*	@author		Adpist
*	@desc		Get the scroll, open & enter portal, rescue cain
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cain_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (mfRun) {
		HordeDebug.logUserError("cain",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (me.getQuest(4,0)) {
		return Sequencer.skip;//Skip : quest is completed
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function cain(mfRun) { // Dark-f: rewrite rescue cain
	var i, j, akara, cain, slave, scroll1, scroll2, stoneA, stoneB, stoneC, stoneD, stoneE;
	
	Communication.Questing.cainStartPoint = "none";
	
	Party.wholeTeamInGame();
	
	Party.waitSynchro("cain_start_point");
	
	//Compute cain sequence start point
	if (Role.isLeader) {
		if (!me.getQuest(4, 1)) { // Cain isn't rescued yet
			if (!me.getQuest(4, 4) ) { //redportal isn't open
				if (!me.getItem(524)) {
					Communication.Questing.cainStartPoint = "scroll";
				} else {
					Communication.Questing.cainStartPoint = "tristram";
				}
			} else {
				Communication.Questing.cainStartPoint = "tristram";
			}
		} else {
			Communication.Questing.cainStartPoint = "completion";
		}
		
		Communication.sendToList(HordeSystem.allTeamProfiles, "cain " + Communication.Questing.cainStartPoint);
	} else {
		while(Communication.Questing.cainStartPoint === "none") {
			delay(100);
		}
	}
	
	Party.waitSynchro("cain_ready");
	if (Communication.Questing.cainStartPoint !== "completion") { // Cain isn't rescued yet
		if (me.diff === 0) {
			Travel.travel(0);
		} else {
			if (Role.teleportingChar)
				Travel.travel(0);
		}
		
		if (Communication.Questing.cainStartPoint === "scroll") { 	// Scroll of Inifuss
			if (!me.inTown) {
				Role.backToTown();
			}
			if (me.diff === 0 ) {
				Pather.useWaypoint(5); //dark wood
			} else {
				if (Role.teleportingChar ) {
					Pather.useWaypoint(5); //dark wood
					Pather.makePortal();
				} else {
					Town.move("portalspot");
					var j = 0;
					while (!Pather.usePortal(5, null)) {
						delay(250);
						if (j % 20 == 0) { // Check for Team Members every 5 seconds.
							Party.wholeTeamInGame();
						}
						j += 1;
					}
				}
			}
			Party.waitForMembers();

			Precast.doPrecast(true);
			Buff.Bo();
			Pather.teleport = false;
			Pather.moveToPreset(me.area, 1, 738, 0, 0, true, true); //move to tree
			Attack.clear(40); // treehead

			if (Role.isLeader) {
				Quest.getQuestItem(524, 30);
			}
			
			Pather.moveToPreset(me.area, 1, 738, 0, 0, true, true); //move to tree
			
			Party.waitForMembers();
			
			Role.backToTown();
			
		/*	scroll1 = me.getItem(524);
			if (scroll1) {
				if ( scroll1.location !== 7 && Storage.Stash.CanFit(scroll1)) {
					Storage.Stash.MoveTo(scroll1);
					delay(me.ping + 1);
					me.cancel();
				}
			}*/
		}
		
		if (Role.isLeader) {
			Role.backToTown();
			
			Town.move(NPC.Akara);
			akara = getUnit(1, NPC.Akara);
			if (akara && akara.openMenu()) {
				me.cancel();
			}
		}
	/*	scroll2 = me.getItem(525);
		if (scroll2) {
			if ( scroll2.location !== 7 && Storage.Stash.CanFit(scroll2)) {
				Storage.Stash.MoveTo(scroll2);
				delay(me.ping + 1);
				me.cancel();
			}
		}*/

		Party.wholeTeamInGame();
		if (Role.teleportingChar) {
			Pather.useWaypoint(4); //stoney field
			Pather.makePortal();
			if (me.diff > 0)
				Pather.teleport = false;
		} else {
			Town.move("portalspot");
			while (!Pather.usePortal(4, null)) {
				delay(250);
			}
		}
		Party.waitForMembers();

		Precast.doPrecast(true);

		Buff.Bo();
		Pather.moveToPreset(me.area, 1, 737, 0, 0, true, true);
		try{
			Attack.clear(15, 0, getLocaleString(2872));// Rakanishu
		} catch (e) {
			Attack.clear(20);
		}
		Attack.clear(20);
		if (Role.isLeader && !me.getQuest(4, 4) ) {		 //redportal already open
			stoneA = getUnit(2, 17);
			stoneB = getUnit(2, 18);
			stoneC = getUnit(2, 19);
			stoneD = getUnit(2, 20);
			stoneE = getUnit(2, 21);
			for (i = 0; i < 5; i += 1) {
				Misc.openChest(stoneA);
				Misc.openChest(stoneB);
				Misc.openChest(stoneC);
				Misc.openChest(stoneD);
				Misc.openChest(stoneE);
			}
		}
		if ( me.diff > 0 ) {
			// Dark-f: now only leader finish the next job when Nightmare & Hell
			if (Role.isLeader) {
				Pather.teleport = true;
				for (i = 0; i < 5; i += 1) {
					if (Pather.usePortal(38)) {
						break;
					}
					delay(1000);
				}
				Pather.moveTo(25175, 5160, 3, false); //Dark-f: close the slave.
				slave = getUnit(2, 26);
				if (!slave) {
					return Sequencer.fail;
				}
				for (i = 0; i < 5; i += 1) {
					if (getDistance(me, slave) > 3) {
						Pather.moveToUnit(slave);
					}
				}
				Misc.openChest(slave);
				if (!Pather.usePortal(null, null)) {
					Town.goToTown();
				}
				delay(3000);
			} else { // Dark-f: other team mates goto town.
				Role.backToTown();
			}
		} else {
		
			Party.secureWaitSynchro("enter_tristram");
			// all team
			for (i = 0; i < 5; i += 1) {
				if (Pather.usePortal(38)) {
					break;
				}
			delay(1000);
			}
			Pather.moveTo(25175, 5160, 3, false); //Dark-f: close the slave.
			slave = getUnit(2, 26);
			if (!slave) {
				return Sequencer.fail;
			}
			for (i = 0; i < 10; i += 1) {
				if (getDistance(me, slave) > 3) {
					Pather.moveToUnit(slave);
				}
			}
			Party.secureWaitSynchro("free_cain");
			
			Misc.openChest(slave);
			
			//Clear tristram
			var xx = [ 25175, 25147, 25149, 25127, 25128, 25150, 25081, 25115],
				yy = [ 5187,  5201,  5172,  5188,  5144,  5123,  5137, 5070];
			
			for (var coord = 0; coord < xx.length; coord += 1) {
				Pather.moveTo(xx[coord], yy[coord], 3, true);
				Party.secureWaitSynchro("clear_trist_"+coord);
				Attack.clear(30);
			}
	
			Role.backToTown();
		}
	}
	Town.move(NPC.Akara);
	akara = getUnit(1, NPC.Akara);
	if (akara && akara.openMenu()) {
		me.cancel();
	}
	Town.move(NPC.Cain);
	cain = getUnit(1, NPC.Cain);
	if (cain && cain.openMenu()) {
		me.cancel();
	}

	return Sequencer.done;
}