/**
*	@filename	cain.js
*	@author		Adpist
*	@desc		Get the scroll, open & enter portal, rescue cain
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function cain(mfRun) { // Dark-f: rewrite rescue cain
	var i, j, akara, cain, slave, scroll1, scroll2, stoneA, stoneB, stoneC, stoneD, stoneE;

	print("cain");
	Town.doChores();
	Party.wholeTeamInGame();
	if (!me.getQuest(4, 1) ) { // Cain isn't rescued yet
		if (me.diff === 0) {
			Travel.travel(0);
		} else {
			if (Role.teleportingChar)
				Travel.travel(0);
		}
		
		if (!me.getQuest(4, 4) && !me.getQuest(4, 3) ) {
			if (!me.getItem(524)) { 	// Scroll of Inifuss
				if (!me.inTown) {
					Town.goToTown();
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
							if (me.getQuest(4, 0))
							{
								return true;
							}
						}
					}
				}
				Party.waitForMembers();

				Precast.doPrecast(true);
				Buff.Bo();
				Pather.teleport = false;
				Pather.moveToPreset(me.area, 1, 738, 0, 0, true, true); //move to tree
				Attack.clear(40); // treehead

				if (Role.teleportingChar) {
					Pather.makePortal();
					delay(5000);
					Quest.getQuestItem(524, 30);
					Pather.usePortal(null, null);
				} else {
					delay(1000);
					if (!Pather.usePortal(null, null)) {
						Town.goToTown();
					}
				}
			/*	scroll1 = me.getItem(524);
				if (scroll1) {
					if ( scroll1.location !== 7 && Storage.Stash.CanFit(scroll1)) {
						Storage.Stash.MoveTo(scroll1);
						delay(me.ping + 1);
						me.cancel();
					}
				}*/
			}
			Town.move("akara");
			akara = getUnit(1, "akara");
			if (akara && akara.openMenu()) {
				me.cancel();
			}
		/*	scroll2 = me.getItem(525);
			if (scroll2) {
				if ( scroll2.location !== 7 && Storage.Stash.CanFit(scroll2)) {
					Storage.Stash.MoveTo(scroll2);
					delay(me.ping + 1);
					me.cancel();
				}
			}*/
		}

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
				
				if (me.getQuest(4, 0))
				{
					return true;
				}
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
		if (!me.getQuest(4, 4) ) {		 //redportal already open
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
			if (Role.teleportingChar) {
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
					return false;
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
				Town.goToTown();
			}
		} else {
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
				return false;
			}
			for (i = 0; i < 10; i += 1) {
				if (getDistance(me, slave) > 3) {
					Pather.moveToUnit(slave);
				}
			}
			Misc.openChest(slave);
			if (!Pather.usePortal(null, null)) {
				Town.goToTown();
			}
			delay(3000);
		}
	}
	Town.move("akara");
	akara = getUnit(1, "akara");
	if (akara && akara.openMenu()) {
		me.cancel();
	}
	Town.move(NPC.Cain);
	cain = getUnit(1, NPC.Cain);
	if (cain && cain.openMenu()) {
		me.cancel();
	}

	return true;
}