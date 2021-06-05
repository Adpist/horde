/**
*	@filename	Waypoint.js
*	@author		Adpist
*	@desc		Waypoint management & synchro
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Waypoint = {
	playersAtWpCount: 0,
	teamWaypoints: [],
	myWaypoints: [],
	waypointsToShare: {},
	waypointsToReceive: [],
	waypointAreas: [0x03,0x04,0x05,0x06,0x1b,0x1d,0x20,0x23,0x30,0x2a,0x39,0x2b,0x2c,0x34,0x4a,0x2e,0x4c,0x4d,0x4e,0x4f,0x50,0x51,0x53,0x65,0x6a,0x6b,0x6f,0x70,0x71,0x73,0x7b,0x75,0x76,0x81],
	
	init: function() {
		this.playersAtWpCount = 0;
		this.teamWaypoints = [];
		this.myWaypoints = [];
		this.waypointsToShare = {};
		this.waypointsToReceive = [];
	},
	
	hasWaypoint: function(targetArea) {
		var wpIndex = Pather.wpAreas.indexOf(targetArea);
		if (wpIndex >= 0) {
			return getWaypoint(wpIndex);
		}
		
		return false;
	},
	
	clickWP: function (clearPath) { // Move to nearest wp and click it.
		var i, j, wp, presetUnit,
		wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

		if (clearPath === undefined ) {
			clearPath = false;
		}
		for (i = 0 ; i < wpIDs.length ; i += 1) {
			presetUnit = getPresetUnit(me.area, 2, wpIDs[i]);

			if (presetUnit) {
				print("going to nearest WP");

				while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 10) {
					try {
						Pather.moveToPreset(me.area, 2, wpIDs[i], 0, 0, clearPath, false);
					} catch (e) {
						print("Caught Error.");

						print(e);
					}

					Packet.flash(me.gid);

					delay(me.ping * 2 + 500);
				}

				wp = getUnit(2, "waypoint");

				if (wp) {
					for (j = 0 ; j < 10 ; j += 1) {
						sendPacket(1, 0x13, 4, wp.type, 4, wp.gid);

						delay(me.ping * 2 + 500);

						if (getUIFlag(0x14)) {
							delay(me.ping > 0 ? me.ping : 50);

							me.cancel();

							break;
						}

						Packet.flash(me.gid);

						delay(me.ping * 2 + 500);

						Pather.moveToUnit(presetUnit, 0, 0, Config.ClearType, clearPath);
					}
				}
			}
		}
	},
	
	receiveWaypoint: function (index) {
		var townArea;

		print("Receiving Waypoint in area: " + this.waypointAreas[index]);

		if (!me.inTown) {
			Pather.usePortal(null, null); // Attempt taking an existing Town Portal back before using the Waypoint (saves walking to the portal spot).
		}

		if (index < 8) { // Go to the correct Town as determined by the waypointAreas index value.
			townArea = 1;
		} else if (index < 16) {
			townArea = 40;
		} else if (index < 24) {
			townArea = 75;
		} else if (index < 26) {
			townArea = 103;
		} else {
			townArea = 109;
		}

		if (me.area !== townArea) { // Either the attempt to take a Portal back to Town was unsuccessful or the next Waypoint is in a different Act.
			Pather.useWaypoint(townArea);
		}

		if ((index === 13 || index === 14) && !me.getQuest(11 , 0)) { // Palace Cellar Level 1 & Arcane Sanctuary both require completion of The Tainted Sun.
			var drognan;

			while (!drognan || !drognan.openMenu()) { // Try more than once to interact with Drognan.
				Packet.flash(me.gid);

				Town.move("drognan");

				drognan = getUnit(1, "drognan");

				delay(1000);
			}
		}

		if (index === 15 && !me.getQuest(13, 0)) { // Canyon Of The Magi requires completion of The Summoner.
			var cain = getUnit(1, "deckard cain");

			if (!cain || !cain.openMenu()) {
				return false;
			}
		}

		if (index === 23 && !me.getQuest(21, 0)) { // Durance Of Hate Level 2 requires completion of The Blackened Temple.
			var cain;

			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);

				Town.move(NPC.Cain);

				cain = getUnit(1, "deckard cain");

				delay(1000);
			}

			if (!me.getQuest(21, 0)) {
				return false; // still can't take the tp, skip this one
			}
		}

		// if (index === 33 && me.getQuest(39, 0)) { // SiC-666 TODO: Worldstone Keep Level 2 requires the completion of Rite of Passage, but talking to someone won't help. Is there anything that would help if this situation arises?

		Town.move("portalspot");

		for (var j = 0 ; j < 720 ; j += 1) { // Wait up to 3 minutes for a Town Portal to the Waypoint.
			if (Pather.usePortal(this.waypointAreas[index], null)) {
				break;
			}

			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}
		}

		this.clickWP();
		
		return true;
	},
	
	announceWaypoints: function() {
		var myWaypointsString = "Have: "; // Does not need to be a global variable.

		for (var i = 1 ; i < (me.gametype ? 39 : 30) ; i += 1) { // In Expansion, there are 39 waypoints in total (34 that need to be acquired). In Classic, there are 30 waypoints in total (26 that need to be acquired).
			this.myWaypoints.push(getWaypoint(i) ? 1 : 0);

			if (i === 8 || i === 17 || i === 26 || i === 29) { // Skip Town Waypoints (0,9,18,27,30).
				i += 1;
			}
		}

	//	print("Waypoint.myWaypoints length: " + Waypoint.myWaypoints.length); // Should be 34 in Expansion and 26 in Classic.

		for (var i = 0 ; i < this.myWaypoints.length ; i += 1) {
			myWaypointsString += this.myWaypoints[i];
		}
		
		Communication.sendToList(HordeSystem.allTeamProfiles, myWaypointsString); // Announce my Waypoint possession values.
	},
	
	waitWaypointsAnnounced: function() {
		var j = 0;

		while (this.teamWaypoints.length !== HordeSystem.teamSize - 1) { // Wait for everyone's Waypoint data to be shared and recorded (excluding my own). This will ensure all verbal communications have been processed before proceeding.
			delay(250);

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}
	},
	
	buildWaypointsToShare: function(){
		if (Party.hasReachedLevel(6))
		{
			for (var i = 0 ; i < this.myWaypoints.length ; i += 1) { 		// Loop thru the Waypoint.myWaypoints list.
				if (i < 8 || 										// Cold Plains thru Catacombs Level 2 have no additional requirements.
					(i >= 8 && i <= 15 && Party.lowestAct > 1) ||			// Sewers Level 2 thru Canyon Of The Magi requires at least Act 2.
					(i >= 16 && i <= 23 && Party.lowestAct > 2) ||		// Spider Forest thru Durance Of Hate Level 2 requires at least Act 3.
					((i === 24 || i === 25) && Party.lowestAct > 3) ||	// City Of The Damned and River Of Flame require at least Act 4.
					(i >= 26 && i <= 33 && Party.lowestAct > 4)) {		// Frigid Highlands thru Worldstone Keep Level 2 requires Act 5.
					if (this.myWaypoints[i]) { // I have the waypoint.
						for (var j = 0 ; j < this.teamWaypoints.length ; j += 1) { 	// Loop thru the list of Team Members.
							if (!Number(this.teamWaypoints[j][i + 1])) { 			// This Team Member is missing the Waypoint (skip Team Member's name by using i + 1).
								if (!this.waypointsToShare.hasOwnProperty(i)) { 		// The Waypoint.waypointAreas index value isn't an element in the share list object yet.
																				// Example Waypoint.waypointsToShare = {"15" : ["Player1", "Player2", "Player3"]}; Canyon Of The Magi needs to be shared with three players.
									this.waypointsToShare[i] = []; 					// Add the Waypoint.waypointAreas index value to the share list as an element that contains an array.
								}
								
								this.waypointsToShare[i].push(this.teamWaypoints[j][0]); // Add the Team Member's name to the array to record how many others need to get it from me.
							}
						}
					} else { 	// I don't have the waypoint. Add it to a list of waypoints to receive.
						for (var j = 0 ; j < this.teamWaypoints.length ; j += 1) { 	// Loop thru the list of Team Members.
							if (Number(this.teamWaypoints[j][i + 1])) { // This Team Member has the Waypoint (skip Team Member's name by using i + 1).
								this.waypointsToReceive.push(i); // Add the Waypoint.waypointAreas index value to the receive list.
								
								break; // Only need to add to the receive list once.
							}
						}
					}
				}
			}
		}
	},
	
	giveWaypoints: function() {
		var i;
		print("Start sharing Waypoints.");

		for (i in this.waypointsToShare) {
			print("Current Waypoint.waypointsToShare element: " + i);

			while (this.waypointsToReceive.length) {
				print("Waypoint.waypointsToReceive: " + this.waypointsToReceive[0]);

				if (Number(i) < this.waypointsToReceive[0]) { // Convert Waypoint.waypointsToShare element to a number (it is a string at this point) and compare it to the number in Waypoint.waypointsToReceive[0].
					break; // Exit while loop because we need to share a Waypoint before receiving this one (Waypoint.waypointsToShare element is a lower Waypoint.waypointAreas index than the lowest Waypoint.waypointAreas index in the Waypoint.waypointsToReceive array).
				}

				this.receiveWaypoint(this.waypointsToReceive.shift()); // Cut the lowest Waypoint.waypointAreas index from the Waypoint.waypointsToReceive array.
			}

			if (!me.findItem(518)) { // No Tome of Town Portal.
				if (me.area !== 1) {
					Pather.useWaypoint(1);
				}

				Town.move("akara");

				var akara = getUnit(1, "akara");

				if (akara) {
					akara.startTrade();

					var scroll = akara.getItem(529);

					scroll.buy(); // Buy Scroll of Town Portal from Akara.

					me.cancel();
				}
			}

			Pather.useWaypoint(this.waypointAreas[i]); // Go to the Waypoint that needs to be given to other players.

			var portal = getUnit(2, 59); // A Town Portal at this stage means someone else is already sharing the Waypoint.

			if (!portal) { // Don't share this Waypoint if someone else is already.
				var player,
					playerList = this.waypointsToShare[i],
					finishedPlayerCount = HordeSystem.teamSize - playerList.length;

				print("Sharing a Waypoint in area: " + this.waypointAreas[i]);

				print("playerList.length: " + playerList.length + " finishedPlayerCount: " + finishedPlayerCount);

				if (me.findItem(518)) {
					Pather.makePortal(); // SiC-666 TODO: Buy more scrolls if needed. Pather will throw an error if there are no scrolls in Tomb.
				} else {
					scroll = me.findItem(529);

					if (scroll) {
						scroll.interact(); // Use a Scroll of Town Portal.
					}
				}
				var wpWaitTime = getTickCount() + 25000;//start max wp wait to account for town portal to wp walk
				delay(250);
				if(Pather.usePortal(null, null)){
					//wait safely intown
					HordeTown.goToTownWp();
				}
				
				for (var j = 0 ; j <100 ; j += 1) { //Here is some wrong, it is too long time to wait. Dark-f < 720 ; j += 1) { // Wait up to 3 minutes Team Members to grab the Waypoint.
					if (playerList.length === 0) { //Dark-f: && Misc.getNearbyPlayerCount() <= finishedPlayerCount) {
						break;
					}

					delay(250);
					
					if (j % 20 == 0) { // Check for Team Members every 5 seconds.
						Party.wholeTeamInGame();
						if (!me.inTown) {
							Attack.clear(2); //incase we got jumped fight back and not in town
						}
					}

					if(getTickCount() > wpWaitTime){
						break;
					}

					//This is broken, disabling
					//player = getUnit(0); // Get nearby player unit.
					//do {
					//	if (player.name !== me.name) {
					//		//print("waypoint sharing : player name is " + player.name);
					//		if (playerList.indexOf(player.name) > -1) { // Player's name is on the list of players needing this Waypoint.
					//			playerList.splice(playerList.indexOf(player.name), 1); // Remove player's name from the list.
					//		}
					//	}
					//} while (player.getNext()); // Loop thru all nearby player units.
					//This is broken, disabling
					
				}
				
				
				delay(2000);
			}
		}

		print("Done sharing Waypoints. Start receiving Waypoints.");
	},
	
	receiveWaypoints: function() {
		print("Waypoint.waypointsToReceive.length: " + this.waypointsToReceive.length);

		while (this.waypointsToReceive.length) { // Receive any remaining Waypoints.
			print("Waypoint.waypointsToReceive: " + this.waypointsToReceive[0]);

			this.receiveWaypoint(this.waypointsToReceive.shift()); // Cut the lowest Waypoint.waypointAreas index from the Waypoint.waypointsToReceive array.
		}

		if (me.area !== Quest.initialTownArea) { // Did share/receive something.
			Pather.useWaypoint(Quest.initialTownArea); // All done sharing/receiving! Return to original town.

			delay(5000); // Allow the Waypointer Giver a moment to come back to Town.
		}

		print("Done receiving Waypoints.");
	},
	
	shareWaypoints:function () {
		this.buildWaypointsToShare();
		this.giveWaypoints();
		this.receiveWaypoints();
	}
};
