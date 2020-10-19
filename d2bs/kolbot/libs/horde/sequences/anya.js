/**
*	@filename	anya.js
*	@author		Adpist
*	@desc		rescue anya
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function anya_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("anya",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		if(!mfRun)
			HordeDebug.logUserError("anya",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}
	
	if (mfRun) {
		HordeDebug.logUserError("anya",  "not supported as mf run");
		return Sequencer.skip;//Skip : not supported
	}
	
	if (!mfRun && me.getQuest(37,0)) {
		return Sequencer.skip;//skip, quest is done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function anya(mfRun) { // Dark-f: Rewrite this.
	var i, anya, malah, scroll, unit, waitAnya;

	Town.doChores();
	Party.wholeTeamInGame();
	
	if (Role.teleportingChar) {
		Travel.travel(9);//Get all act wp if needed
	}
	
	if (!me.getQuest(37, 1)) {

		if (Role.teleportingChar) {

			Precast.doPrecast(true);

			Pather.useWaypoint(113, false);

			var clearType;

			if (me.classid === 1) {	//Dark-f: mind already changed, this is not correct now
				Pather.teleport = true;
				clearType = false;
			} else {
				Pather.teleport = false;
				clearType = true;
			}
			try{
				Pather.moveToExit(114, true, clearType);
			}catch(e) {
				print(e);
			}
			if (me.area!==114) {
				try{
					Pather.moveToExit(114, true, clearType);
				}catch(e) {
					print(e);
				}
			}
			if (me.classid ===1 ) {
				unit = getPresetUnit(me.area, 2, 460);
				while(true) {
					Pather.moveToUnit(unit, 15, 15, false);
					anya = getUnit(2, 558);
					if ( anya && getDistance(me, anya) < 35)
						break;
				}
			}
			Pather.makePortal();

		} else {
			Town.goToTown(5);
			Town.move("portalspot");
			while(!Pather.usePortal(114, null)) {
				delay(1000);
			}
		}
		//Buff.Bo();
		//Party.wholeTeamInGame();
		//unit = getPresetUnit(me.area, 2, 460);
		//Pather.moveToUnit(unit, true);
		Attack.clear(50);
		delay(me.ping+850);

		anya = getUnit(2, 558);
		if (anya) {
			if (Role.teleportingChar) {
				Pather.moveToUnit(anya);
				for (i = 0; i < 3; i += 1) {
					if (getDistance(me, anya) > 3) {
						Pather.moveToUnit(anya);
					}
					anya.interact();
					delay(300 + me.ping);
					me.cancel();
				}

				Town.goToTown(5);
				Town.move("malah");
				malah = getUnit(1, "malah");
				while(true) {
					malah.interact();
					if (malah && malah.openMenu()) {
						me.cancel();
					}
					if ( me.getItem(644) || me.getItem(646) || me.getQuest(37, 1))
						break;
					delay(500);
				}
			} else {
				delay(10000);
				Attack.clear(30);
				while(!Pather.usePortal(null, null)) { // Wait for TeleportingChar making portal
					delay(1000);
					Attack.clear(30);
				}
			}
			if ( me.getItem(644)) {
				Town.move("portalspot");
				while(!Pather.usePortal(114, null)) {
					delay(1000);
				}

				for (i = 0; i < 3; i += 1) {
					if (getDistance(me, anya) > 3) {
						Pather.moveToUnit(anya);
					}
					anya.interact();
					delay(300 + me.ping);
					me.cancel();
				}
			}
		}
		Town.goToTown(5);
		Town.move("malah");
		malah = getUnit(1, "malah");
		while(true) {
			malah.interact();
			malah.openMenu();
			me.cancel(1);
			if (me.getItem(646) || me.getQuest(37, 1))
				break;
			delay(1000);
		}
	}
	Town.goToTown(5);
	scroll = me.getItem(646);
	if (scroll) {
		clickItem(1, scroll);
	}
	anya = getUnit(1, "anya");
	Town.move("anya");
	if (!anya) {
		for (waitAnya=0 ; waitAnya<30 ; waitAnya+=1) {
			delay(1000);
			anya = getUnit(1, "anya");
			if (anya) {
				break;
			}
		}
	}
	if (anya) {
		Town.move("anya");
		anya.openMenu();
		me.cancel();
	}

	return Sequencer.done;
}