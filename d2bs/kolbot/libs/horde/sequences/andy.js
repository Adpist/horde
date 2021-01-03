/**
*	@filename	andy.js
*	@author		Adpist
*	@desc		Move to andy & kill her
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function andy_requirements(mfRun) {

	/***** REQUIREMENTS ******/
	if (mfRun && (!me.getQuest(7,0) || !getWaypoint(Pather.wpAreas.indexOf(35)))) {
		return Sequencer.skip;//Skip : quest not completed or don't have wp
	}
	
	if (!mfRun && me.getQuest(7,0)) {
		return Sequencer.skip;//Skip : quest already completed
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function andy(mfRun) {
	var oldPickRange = Config.PickRange;
	var bugAndy = false; //!mfRun && me.diff !== 0;
	
	Town.goToTown(1);
	
	Party.wholeTeamInGame();

	if (!mfRun) {
		//move to act 2 if not an mf run
		if ( me.getQuest(6, 0) && !me.getQuest(7, 0)) {
			Travel.changeAct(2);
			return Sequencer.done;
		}
	}

	if (mfRun || !me.getQuest(6, 1)) {
		if (!me.inTown) {
			Role.backToTown();
		}

		if (Role.teleportingChar || me.diff === 0) {

			Travel.travel(1);

			if ( !mfRun && me.diff > 0 ) {
				Buff.prebuffPoisonRes();
			}
			
			Pather.useWaypoint(35);

			if (me.diff === 0) {
				Party.waitForMembers(me.area, 36);

				Precast.doPrecast(true);

				Pather.teleport = false;

				Travel.clearToExit(35, 36, true);

				Party.waitForMembers(me.area, 37);

				Travel.clearToExit(36, 37, true);

				Party.waitForMembers();

				Precast.doPrecast(true);
			} else {
				Pather.teleport = true;

				Travel.clearToExit(35, 36, false);

				Travel.clearToExit(36, 37, false);

				//Pather.moveTo(22568, 9582, 3, false); //Dark-f: Follower kill other monsters when the leader kills Andy
				//Pather.moveTo(22549, 9520, 3, false); //Dark-f: this is from running Andy
				
				if (mfRun) {
					Pather.moveTo(22549, 9520); //Andy spot
				}
				Pather.makePortal();				
				delay(1100);//save the sorc!
			}

			Party.wholeTeamInGame();
		} else {
			Town.goToTown(1);
			Town.repair();
			if ( !mfRun && me.diff > 0) {
				Buff.prebuffPoisonRes();
			}
			Town.move("portalspot");

			var j = 0;

			while (!Pather.usePortal(37, null)) {
				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}
		}
		
		if (mfRun)
		{
			Buff.selfBo();
		}
		else
		{
			Precast.doPrecast(true);
			Buff.Bo();
		}
		
		if (bugAndy) {
			Config.TownCheck = false;
			Config.TownHP = 0;
			Config.TownMP = 0;
		}
		
		if (me.diff === 0) {
			Pather.moveTo(22594, 9641, 3, Config.ClearType);
			Pather.moveTo(22564, 9629, 3, Config.ClearType);
			Pather.moveTo(22533, 9641, 3, Config.ClearType);

			Config.PickRange = 0;
			
			Buff.prebuffPoisonRes();
			
			Pather.moveTo(22568, 9582, 3, Config.ClearType);

			Pather.moveTo(22548, 9568, 3, false);

			Attack.kill(156); // Andariel

			Pickit.pickItems();
			
			Config.PickRange = oldPickRange;

			Attack.clear(35);
		} else {
		
			if (mfRun) {
				Attack.clear(20);
			}
			else {
				Pather.teleport = false;
				
				Attack.clearLevel(0);
			}
			
			try {
				Attack.kill(156); // Andariel
			} catch(e) {
				Attack.clear(20);
			}
		}
		
		Pickit.pickItems();
		
		delay(2000); // Wait for minions to die.

		Pickit.pickItems();
	}

	if (!mfRun)
	{
		if (bugAndy) {
			delay(15000); //wait for tp to spawn
		}
		
		Role.backToTown();
		delay(3000);
		Travel.changeAct(2);
		
		if (bugAndy) {
			HordeDebug.logScriptInfo("Andy", "Bugging Andy");
			quit();
		}
	} else {
		Role.backToTown();
	}
	
	return Sequencer.done;
}
