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

	Town.goToTown(5);
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
					Pather.moveToUnit(unit, 5, 5, false);
					anya = getUnit(2, 558);
					if ( anya && getDistance(me, anya) < 35)
						break;
				}
			}
			Role.makeTeamJoinPortal();

		} else {
			Town.goToTown(5);
			Town.move("portalspot");
			while(!Pather.usePortal(114, null)) {
				delay(1000);
			}
		}
		
		Attack.clear(40);
		
		unit = getPresetUnit(me.area, 2, 460);
		while(true) {
			Pather.moveToUnit(unit, 5, 5, true);
			anya = getUnit(2, 558);
			if ( anya && getDistance(me, anya) < 10)
				break;
		}
		
		if (anya) {
			if (Role.isLeader) {
				Pather.moveToUnit(anya);
				for (i = 0; i < 3; i += 1) {
					if (getDistance(me, anya) > 3) {
						Pather.moveToUnit(anya);
					}
					anya.interact();
					delay(300 + me.ping);
					me.cancel();
				}

				Role.backToTown();
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
				Party.secureWaitSynchro("free_anya", 30000);
			} else {
				Party.secureWaitSynchro("free_anya", 30000);
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
		} else {
			HordeDebug.LogScriptError("Anya", "failed to find anya");
			return Sequencer.fail;
		}
		
		Role.backToTown();
		Town.move(NPC.Malah);
		malah = getUnit(1, NPC.Malah);
		var j = 0;
		if (!me.getQuest(37,0)) {
			while(true) {
				malah.interact();
				malah.openMenu();
				me.cancel(1);
				if (me.getItem(646) || me.getQuest(37, 1))
					break;
				delay(1000);
				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
					sendPacket(1, 0x40); // Refresh quest status				
					delay(1000);
				}
				if (j > 60) {
					return Sequencer.fail;
				}
				j += 1;
			}
		}
	}
	Town.goToTown(5);
	scroll = me.getItem(646);
	if (scroll) {
		clickItem(1, scroll);
	}
	anya = getUnit(1, NPC.Anya);
	Town.move(NPC.Anya);
	if (!anya) {
		for (waitAnya=0 ; waitAnya<30 ; waitAnya+=1) {
			delay(1000);
			anya = getUnit(1, NPC.Anya);
			if (anya) {
				break;
			}
		}
	}
	if (anya) {
		Town.move(NPC.Anya);
		anya.openMenu();
		me.cancel();
	}

	return Sequencer.done;
}
