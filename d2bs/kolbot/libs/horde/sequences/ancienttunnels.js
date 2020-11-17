/**
*	@filename	ancienttunnels.js
*	@author		M
*	@desc		clear ancient tunnels
*	@credits	Adpist, kolton
*/

function ancienttunnels_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun)	{
		HordeDebug.logUserError("ancientstunnels", "ancientstunnels isn't a questing run");
		return Sequencer.skip;//Skip sequence, not a questing run
	}

	if(!me.getQuest(7, 0)) {
		return Sequencer.skip;//Stop : still Act 1
	}


	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function ancienttunnels(mfRun) {

	if (Role.teleportingChar) {
		Town.goToTown();
		if (!Pather.useWaypoint(44)) {
			throw new Error();
		}

		if(me.diff != 0){

			Pather.teleport = true;
			if (!Pather.moveToExit(65, true)) {
				throw new Error("Failed to move to Ancient Tunnels");
			}
			Role.makeTeamJoinPortal();
			delay(1750);
		} else {
			Role.makeTeamJoinPortal();
		}
	} else {
		Town.goToTown(2);


		if(me.diff === 0){

			if (!getWaypoint(44)) {
				var cain;

				Town.goToTown(2);

				while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
					Packet.flash(me.gid);

					Town.move(NPC.Cain);
					cain = getUnit(1, "deckard cain");

					delay(1000);
				}

				me.cancel();

				Town.move("portalspot");

				print("Waiting for TP.");

				j = 0;
				while (!Pather.usePortal(44, null)) { 
					delay(250);

					if (j % 20 == 0) { // Check for Team Members every 5 seconds.
						Party.wholeTeamInGame();
					}

					j += 1;
				}

				Waypoint.clickWP();
			} else {
				Pather.useWaypoint(44);
			}

		} else {
			Town.move("portalspot");

			var j = 0;
			while(!Pather.usePortal(65, null)) {
				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}
		}
	}

	if (HordeSystem.teamSize > 1 || me.diff === 0) {
		Pather.teleport = false;
	}

	if(me.diff === 0){
		Pather.moveToExit(65, true, Config.ClearType); // Go in the tunnel.
	}

	Party.waitForMembers();
	Attack.clearLevel(Config.ClearType);

	if (HordeSystem.teamSize > 1) {
		Pather.teleport = true;
	}

	Role.backToTown();

	return Sequencer.done;
}
