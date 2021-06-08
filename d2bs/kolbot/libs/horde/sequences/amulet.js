/**
*	@filename	amulet.js
*	@author		Adpist
*	@desc		Get amulet
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function amulet_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (mfRun) {
		HordeDebug.logUserError("amulet",  "not supported as mf run");
		return Sequencer.skip;//Skip : mf run not supported;
	}
	
	if(!me.getQuest(7, 0)) {
		if(!mfRun)
			HordeDebug.logUserError("amulet", "andy isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 1
	}
	
	if (me.getQuest(15, 0) || me.getQuest(10,0) ||
		(me.getQuest(11,0) && (me.getItem(521) || me.getItem(91)))) {
		return Sequencer.skip; //Skip: act 3 available, orifice used, or we have completed altar and have amulet or complete staff
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function amulet(mfRun) {
	var i, drognan;
	
	Town.goToTown(2);
		
	Town.repair();
	Party.wholeTeamInGame();

	Pather.teleport = false;

	if (me.diff !== 0 && Role.teleportingChar) { // The Teleporting Sorc needs to travel to Lost City in Nightmare and Hell, otherwise it's already been done in this.cube();
		Travel.travel(2); // Halls Of The Dead Level 2
		Travel.travel(3); // Lost City
	}

	if (me.diff === 0) {
		Pather.useWaypoint(44, true);

		Party.waitForMembers(me.area, 45);

		Precast.doPrecast(true);

		Travel.clearToExit(44, 45, Config.ClearType); // Go to Valley Of Snakes.

		Party.waitForMembers(me.area, 58);
		Buff.Bo();

		Travel.clearToExit(45, 58, Config.ClearType); // Go to Claw Viper Temple Level 1

		Party.waitForMembers(me.area, 61);

		Travel.clearToExit(58, 61, Config.ClearType); // Go to Claw Viper Temple Level 2

		Party.waitForMembers();
		Buff.Bo();
		Pather.moveTo(15044, 14045, 3, Config.ClearType);
	} else if (Role.teleportingChar) {
		Pather.teleport = true;

		Config.ClearType = false;

		Pather.useWaypoint(44, true);

		Travel.clearToExit(44, 45, Config.ClearType); // Go to Valley Of Snakes.

		Travel.clearToExit(45, 58, Config.ClearType); // Go to Claw Viper Temple Level 1

		Travel.clearToExit(58, 61, Config.ClearType); // Go to Claw Viper Temple Level 2

		Pather.moveTo(15044, 14045, 3);

		Role.makeTeamJoinPortal();
	} else {
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(61, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	}

	Party.wholeTeamInGame();

	if (Role.isLeader)
		Quest.getQuestItem(521, 149);

	Role.backToTown();

	if (me.getItem(521)) {
		Town.move("stash");
		delay(me.ping + 50);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(521));
	}

	Town.move(NPC.Drognan);

	if (!Party.waitSynchro("complete_amulet", 60000)) {
		quit();
	}

	while (!drognan || !drognan.openMenu()) { // Try more than once to interact with Drognan.
		Packet.flash(me.gid);

		Town.move(NPC.Drognan);

		drognan = getUnit(1, NPC.Drognan);

		delay(1000);
	}

	me.cancel();

	return Sequencer.done;
}
