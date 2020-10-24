/**
*	@filename	Travel.js
*	@author		Adpist
*	@desc		Moving, pathing, travelling...
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Travel = {
	waitAndUsePortal: function(act, targetArea)
	{
		Town.goToTown(act);
		Town.repair();
		Town.move("portalspot");

		var j = 0;

		while (!Pather.usePortal(targetArea, null)) {
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	},
	
	safeMoveToExit: function(targetArea, use, clearPath) {
		var moveSucceeded, coord;
		
		while (me.area !== targetArea) {
			try {
				moveSucceeded = Pather.moveToExit(targetArea, use, clearPath);
			}
			catch (e) {
				print("Caught Error.");
				print(e);
				moveSucceeded = false;
			}
			
			if (!moveSucceeded)
			{
				print("move to exit failed. retry");
				coord = CollMap.getRandCoordinate(me.x, -5, 5, me.y, -5, 5);
				Pather.moveTo(coord.x, coord.y);
			}
		}
	},
	
	moveToExit: function (currentarea, targetarea, cleartype) { // SiC-666 TODO: add moving to exit without clearing after XX minutes.
		
		while (me.area == currentarea) {
			try {
				Pather.moveToExit(targetarea, true, cleartype);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}

			Packet.flash(me.gid);
		}

	},
	
	clearToExit: function (currentarea, targetarea, cleartype) { // SiC-666 TODO: add moving to exit without clearing after XX minutes.
		print("Start clearToExit");

		print("Currently in: " + Pather.getAreaName(me.area));
		print("Currentarea arg: " + Pather.getAreaName(me.area));

		delay(250);
		print("Clearing to: " + Pather.getAreaName(targetarea));
		while (me.area == currentarea) {
			try {
				Pather.moveToExit(targetarea, true, cleartype);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}

			Packet.flash(me.gid);

			delay(me.ping * 2 + 500);
		}

		print("End clearToExit");
	},
	
	toCanyon: function() {
		var i, journal;
		if (me.area !== 74) {
			if (!me.inTown) {
				Town.goToTown();
			}

			Town.move("waypoint");

			Pather.useWaypoint(74, true);
		}
		
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
		
		Pather.moveToPreset(74, 2, 357, -3, -3, true);

		journal = getUnit(2, 357);

		for (i = 0; i < 5; i += 1) {
			if (journal) {
				sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);

				delay(1000);

				me.cancel();
			}

			if (Pather.getPortal(46)) {
				break;
			}
		}
		
		Pather.usePortal(46);
		
		Waypoint.clickWP();
	},
	
	travel: function (goal) { // 0->9, a custom waypoint getter function
		var i, homeTown, startAct, nextAreaIndex, target, destination, unit, clearPath, walkTravel,
			wpAreas = [],
			areaIDs = [];
			
		walkTravel = false;

		switch (goal) { // Don't teleport until after Lost City (Act 2) if in normal difficulty
		case 0:
		case 1:
		case 2:
		case 3:
			if (me.diff===0) {
				Pather.teleport = false;
				walkTravel = true;
			} else {
				Pather.teleport = true;
			}

			break;
		default:
			Pather.teleport = true;
		}

		switch (goal) {
		case 0:
			destination = 5; // Dark Wood
			wpAreas = [1, 3, 4, 5];
			areaIDs = [2, 3, 4, 10, 5];
			homeTown = 1;
			startAct = 1;
			break;
		case 1:
			destination = 35; // Catacombs Level 2
			wpAreas = [1, 3, 4, 5, 6, 27, 29, 32, 35];
			areaIDs = [2, 3, 4, 10, 5, 6, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
			homeTown = 1;
			startAct = 1;
			break;
		case 2:
			destination = 57; // Halls Of The Dead Level 2
			wpAreas = [42, 57]; // Dry Hills, Halls Of The Dead Level 2
			areaIDs = [41, 42, 56, 57]; // Rocky Waste, Dry Hills, Halls Of The Dead Level 1, Halls Of The Dead Level 2
			homeTown = 40;
			startAct = 2;
			break;
		case 3:
			destination = 44; // Lost City
			wpAreas = [42, 43, 44]; // Dry Hills, Far Oasis, Lost City
			areaIDs = [42, 43, 44]; // Dry Hills, Far Oasis, Lost City
			homeTown = 40;
			startAct = 2;
			break;
		case 4:
			destination = 74; // Arcane Sanctuary
			wpAreas = [52, 74];
			areaIDs = [50, 51, 52, 53, 54, 74];
			homeTown = 40;
			startAct = 2;
			break;
		case 5: // Canyon Of The Magi
			destination = 46;
			wpAreas = [52, 74, 46];
			areaIDs = [50, 51, 52, 53, 54, 74, 46];
			homeTown = 40;
			startAct = 2;
			break;
		case 6:
			destination = 83; // Travincal
			wpAreas = [75, 76, 77, 78, 79, 80, 81, 83];
			areaIDs = [76, 77, 78, 79, 80, 81, 82, 83];
			homeTown = 75;
			startAct = 3;
			break;
		case 7:
			destination = 101; // Durance Of Hate Level 2
			wpAreas = [75, 76, 77, 78, 79, 80, 81, 83, 101];
			areaIDs = [76, 77, 78, 79, 80, 81, 82, 83, 100, 101];
			homeTown = 75;
			startAct = 3;
			break;
		case 8:
			destination = 107; // River Of Flame
			wpAreas = [103, 106, 107];
			areaIDs = [104, 105, 106, 107];
			homeTown = 103;
			startAct = 4;
			break;
		case 9:
			destination = 118; // Ancient's Way
			wpAreas = [109, 111, 112, 113, 115, 117, 118];
			areaIDs = [110, 111, 112, 113, 115, 117, 118];
			homeTown = 109;
			startAct = 5;
			break;
		case 10:
			destination = 129; // The Worldstone Keep Level 2
			wpAreas = [109, 111, 112, 113, 115, 117, 118, 129];
			areaIDs = [110, 111, 112, 113, 115, 117, 118, 120, 128, 129];
			homeTown = 109;
			startAct = 5;
			break;
		}

		Town.goToTown(startAct);

		Town.move("waypoint");

		//Pather.getWP(me.area); // SiC-666 Commented out because we shouldn't have to activate the waypoint in town before moving somewhere.

		target = Pather.plotCourse(destination, me.area); // Pather.plotCourse(destination area id, starting area id);
		nextAreaIndex = areaIDs.indexOf(target.course[0])+1; // Index of next area
		print("Travel course = " + target.course);

		if (nextAreaIndex < areaIDs.length) { // If next area index is invalid, return true.
			if (me.inTown && wpAreas.indexOf(target.course[0]) > -1 && // Use waypoint to first area if possible
				getWaypoint(wpAreas.indexOf(target.course[0]))) {
				Pather.useWaypoint(target.course[0]); // , !Pather.plotCourse_openedWpMenu); function useWaypoint(targetArea, check) check - force the waypoint menu
			}

			for (nextAreaIndex ; nextAreaIndex < areaIDs.length; nextAreaIndex += 1) {
				print("nextAreaIndex = " + nextAreaIndex);
				print("Next location name = " + Pather.getAreaName(areaIDs[nextAreaIndex]));

				if (Pather.teleport === true && me.charlvl >= 18) { // If allowed to teleport (determined by the switch above), skip killing monsters.
					clearPath = false;
				} else {
					clearPath = true;
				}

				switch (areaIDs[nextAreaIndex]) { // Special actions for traveling to some areas
				case 100: // Durance of Hate Level 1
				case 101: // Durance of Hate Level 2
					try{
						Pather.moveToExit(areaIDs[nextAreaIndex], true, clearPath);
					} catch(e) {
						print(e);

						Town.goToTown();

						HordeDebug.logScriptError("Travel", "Should travel to act4 by mephisto. please report");
						//this.mephisto();

						return true;
					}

					break;
				case 115: // Glacial Trail
				case 117: // Frozen Tundra
				case 118: // Ancient's Way
				case 120: // Arreat Summit
				case 128: // The Worldstone Keep Level 1
				case 129: // The Worldstone Keep Level 2
					try{
						Pather.moveToExit(areaIDs[nextAreaIndex], true, clearPath);
					} catch(e) {
						print(e);

						Town.goToTown();

						Town.move("portalspot");

						delay(10000);

						print("Attempting to use any portal");

						while (!Pather.usePortal(129, null)) {
							delay(5000);
						}

						this.clickWP();

						Pather.moveToExit([128, 120, 118], true, clearPath);

						this.clickWP();

						Pather.moveToExit(117, true, clearPath);

						this.clickWP();

						Pather.moveToExit(115, true, clearPath);

						this.clickWP();

						return true;
					}

					break;
				case 50: // Harem Level 1
					if (!Pather.moveToExit(50, true, false)) { // Only try up to three times to enter the Palace. Guard might be blocking the entrance.
						throw new Error("HordeSystem.travel: Failed to enter the Palace in Act 2.");
					}

					break;
				case 53: // Palace Cellar Level 2
					if (me.diff === 0) {
						if (!Pather.useWaypoint(40)) {
							Town.goToTown(2);
						}

						Town.doChores();

						Pather.useWaypoint(52);
					}

					Travel.clearToExit(52, 53, clearPath);

					break;
				case 74: // Arcane Sanctuary
					while (getDistance(me.x, me.y, 10073, 8670) > 10) {
						try {
							Pather.moveTo(10073, 8670, 3, false, false);
						} catch (e) {
							print("Caught Error.");

							print(e);
						}
					}

					Pather.usePortal(null);

					break;
				case 46: // Canyon Of The Magi
					this.toCanyon();
					break;
				case 78: // Flayer Jungle
					Pather.getWP(78, false); // Travel.clearToExit() often fails when attempting to move from Great Marsh to Flayer Jungle.

					break;
				case 110: // Harrogath -> Bloody Foothills
					Pather.moveTo(5026, 5095);

					unit = getUnit(2, 449); // Gate

					if (unit) {
						for (i = 0; i < 10; i += 1) {
							if (unit.mode === 0) {
								sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
							}

							if (unit.mode === 2) {
								break;
							}

							delay(500);
						}
					}

					Pather.moveToExit(areaIDs[nextAreaIndex], true, clearPath);

					break;
				default:
					if (goal <= 3 && me.diff === 0) { // If traveling in a group (all other goals are tele only).
						if (!me.inTown) {
							Party.waitForMembers(me.area, areaIDs[nextAreaIndex]);
						}
					}

					Travel.clearToExit(me.area, areaIDs[nextAreaIndex], clearPath);
				}

				if (wpAreas.indexOf(areaIDs[nextAreaIndex]) > -1) { // Check if the next area (which we are now in) has a waypoint. If it does, grab it, go to town, wait for party, run chores, take waypoint, and wait for the party.
					Waypoint.clickWP(walkTravel);

					if (me.diff === 0 && (goal === 0 || goal === 1 || goal === 2 || goal === 3) && areaIDs[nextAreaIndex] != destination) { // Don't wait for team if the destination has been reached. (all desinations have a waypoint)
						print("start this.travel() waypoint wait");

						Communication.sendToList(HordeSystem.allTeamProfiles, "at waypoint");

						Party.waitForMembersByWaypoint();

						Waypoint.playersAtWpCount = 0;

						Pather.useWaypoint(homeTown);

						Party.waitForMembers(me.area, areaIDs[nextAreaIndex]); // Wait for everyone to come to town. If Town.doChores() doesn't do anything it's possible to leave town while everyone is still trying to come to town.

						Town.doChores();

						Town.move("waypoint");

						Pather.useWaypoint(areaIDs[nextAreaIndex]);

						Party.waitForMembers();

						print("end this.travel() waypoint wait");
					}
				}
			}

			Pather.useWaypoint(homeTown); // Finishes in town. (all desinations have a waypoint)

			//Pather.teleport = false;
		}

		return true;
	},
	
	changeAct: function (act) {
		print("change Act " + act);

		var npc, time, tpTome,
			preArea = me.area;

		if (me.act === act) {
			return true;
		}

		try {
			switch (act) {
			case 2:
				if (me.act >= 2) {
					break;
				}

				Town.move("warriv");

				npc = getUnit(1, "warriv");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D36);

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}
				Town.move("palace");
				npc = getUnit(1, "jerhyn");
				if (!npc || !npc.openMenu()) {
					Pather.moveTo(5166, 5206);

					return false;
				}

				me.cancel();

				tpTome = me.findItem("tbk", 0, 3);
				if (tpTome && tpTome.getStat(70) > 0 ) {
					try{
						Pather.moveToExit(50, true);
						if (!Pather.usePortal(40, null)) {
							if (!me.inTown) {
								Town.goToTown();
							}
						}
					}catch(e) {
						print(e);
					}finally{
						if (!me.inTown) {
							Town.goToTown();
						}
					}
				}
				Town.move("meshif");

				npc = getUnit(1, "meshif");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D38);

				break;
			case 4:
				if (me.act >= 4) {
					break;
				}
				
				HordeDebug.logScriptError("Should travel to act4 by mephisto. please report");
				//this.mephisto();
				break;
			case 5:
				if (me.act >= 5) {
					break;
				}
				Town.move("tyrael");
				npc = getUnit(1, "tyrael");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				delay(me.ping > 0 ? me.ping : 50);

				if (getUnit(2, 566)) {
					me.cancel();
					Pather.useUnit(2, 566, 109);
				} else {
					Misc.useMenu(0x58D2);
				}

				break;
			}

			delay(1000 + me.ping * 2);

			while (!me.area) {
				delay(500);
			}

			if (me.area === preArea) {
				me.cancel();
				Town.move("portalspot");
				print("Act change failed.");

				return false;
			}

		} catch (e) {
			return false;
		}

		for(time=0; time<100 ; time += 1) {
			if (Party.allPlayersInArea()) {
				break;
			}
			if (time>30) {
				quit();
			}
		delay(1000);
		}
		return true;
	}
};