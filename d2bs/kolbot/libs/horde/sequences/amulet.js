/**
*	@filename	amulet.js
*	@author		Adpist
*	@desc		Get amulet
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function amulet(mfRun) {
	var i, drognan;

	print("getting amulet");
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

		Pather.makePortal();
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

	if (Role.teleportingChar)
		Quest.getQuestItem(521, 149);

	delay(500);

	if (!Pather.usePortal(null, null)) {
		Town.goToTown();
	}

	if (me.getItem(521)) {
		Town.move("stash");
		delay(me.ping + 1);
		Town.openStash();
		Storage.Stash.MoveTo(me.getItem(521));
	}

	Town.move("drognan");

	for (i = 0 ; i < 200 ; i += 1) {
		if (i > 60) {
			quit();
		}

		if (Party.allPlayersInArea(40)) {
			break;
		}

		delay(1000);
	}

	while (!drognan || !drognan.openMenu()) { // Try more than once to interact with Drognan.
		Packet.flash(me.gid);

		Town.move("drognan");

		drognan = getUnit(1, "drognan");

		delay(1000);
	}

	me.cancel();

	//Pather.teleport = false;

	return true;
}