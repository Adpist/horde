/**
*	@filename	Party.js
*	@author		Adpist
*	@desc		Party management and syncro
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Party = {
	iAmReady: false,
	readyCount: 0,
	teamIsReady:false,
	lowestAct: 0,
	
	init: function() {
		this.iAmReady = false;
		this.readyCount = 0;
		this.teamIsReady = false;
	},
	
	wholeTeamInGame: function (stayInGame) { // Counts all the players in game. If the number of players is below TeamSize either return false or quit game depending on input.
		var i, player,
			count = 0;

		if (stayInGame === undefined) {
			stayInGame = false;
		}

		for (i = 0 ; i < 30 ; i += 1) { // Try 30 times because getParty(); can fail once in a while.
			player = getParty();

			if (player) {
				do {
					count += 1;
				} while (player.getNext());

				break;
			}

			delay(250);
		}

		if (count < HordeSystem.teamSize) {
			return stayInGame ? false : quit(); // Return false if stayInGame is true, otherwise leave game.
		}

		return true;
	},
	
	waitWholeTeamJoined: function() {
		var tick = getTickCount();
	
		while (!Party.wholeTeamInGame(true)) { // Wait for the Horde Team to join.
			delay(1000);

			if (getTickCount() - tick > HordeSettings.maxWaitTimeMinutes * 60 * 1000) { // Leave the game after x minutes of waiting.
				print("Team wasn't in game within x minutes.");

				D2Bot.printToConsole("Horde: Team didn't join the game within x minutes.", 9);

				quit();
			}
		}
	},
	
	hasReachedLevel: function (level) {
		if (!level) {
			level = me.charlvl;
		}

		var i, player;

		for (i = 0 ; i < 30 ; i += 1) { // Try 30 times because getParty(); can fail once in a while.
			player = getParty();

			if (player) {
				do {
					if (player.level < level) { // Player is not ready.
						return false;
					}
				} while (player.getNext());

				return true;
			}

			delay(250);
		}

		return false;
	},
	
	getLowestAct: function () { // Cycles thru getParty() and returns the lowest Act (i.e., 1-5) the partied characters are in. Quits if noone is partied. Returns false is someone isn't in a Town.
		var i, j, player, myPartyID, area,
			lowestAct = 5;

		// Dark-f ->
		if (HordeSystem.teamSize === 1) {
			lowestAct = [-1, 1, 40, 75, 103, 109].indexOf(me.area);
			return lowestAct;
		}
		// <- Dark-f

		for (i = 0 ; i < 30 ; i += 1) { // Try 30 times because getParty(); can fail once in a while.
			player = getParty();

			if (player) {
				myPartyID = player.partyid;

				if (myPartyID === 65535) { // Noone in my Party. Probably a good idea to quit. . .
					for (j = 0 ; j < 60 ; j += 1)
					{
						myPartyID = player.partyid;
						if (myPartyID !== 65535)
						{
							break;
						}
					}
					if (j === 60)
					{
						throw new Error("HordeSystem.partyAct: Noone in my Party.");
						quit();
					}
				}

				while (player.getNext()) {
					if (player.partyid === myPartyID) { // Only check characters in a Party with me.
						area = [-1, 1, 40, 75, 103, 109].indexOf(player.area);

						if (area === -1) { // Player isn't in a Town.
							return false;
						}

						if (area < lowestAct) {
							lowestAct = area;
						}
					}
				}

				break;
			}

			delay(250);
		}

		return lowestAct;
	},
	
	allPlayersInArea: function (area) {
		if (!area) {
			area = me.area;
		}

		var count = 1,
			party = getParty(); //this is actually counting in game players(you included), not in party

		if (party) {
			do {
				if ( party.area === area ) { //counting players rdy
					count += 1;
				}
			} while (party.getNext());
		}

		if (count < HordeSystem.teamSize) {
			return false;
		}

		return true;
	},
	
	needToKeepWaiting: function (area, nextArea) { // Wait for party members to be in specified area.
		var myPartyId,
			result = false,
			player = getParty();

		if (arguments.length < 2) {
			throw new Error("HordeSystem.safeNeedToKeepWaiting: No areas argument supplied.");
		}

		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.partyid === myPartyId) {
					if (player.area !== area && player.area !== nextArea) {
						result = true; // Someone is still not in specified area. Need to keep waiting.
					}
				}
			}
		} else {
			result = true; // getParty() didn't return anything. Need to keep waiting.
		}

		return result;
	},
	
	waitForMembers: function (area, nextArea) {
		var tick = getTickCount(),
			orgx = me.x,
			orgy = me.y;

		print("Waiting for Party Members.");

		if (arguments.length < 1) {
			area = me.area;
		}
		if (arguments.length < 2){
			nextArea = area;
		}

		while (this.needToKeepWaiting(area, nextArea)) {
			if (!me.inTown) {
				Attack.clear(15);

				Pather.moveTo(orgx, orgy);
			}

			delay(1000);
			
			if(me.area != area)
			{
				Pather.journeyTo(area);
				delay(500);
			}
			
			if (getTickCount() - tick > HordeSettings.maxWaitTimeMinutes * 60 * 1000) { // Quit after 10 minutes of waiting.
				quit();
			}
		}
		
		delay(2000);
	},
	
	waitForMembersByWaypoint: function () {
		var tick = getTickCount(),
			orgx = me.x,
			orgy = me.y;

		print("Waiting for Party Members by Waypoint.");

		while (Waypoint.playersAtWpCount !== HordeSystem.teamSize - 1) {
			Attack.clear(15);

			Pather.moveTo(orgx, orgy);

			delay(1000);

			if (getTickCount() - tick > HordeSettings.maxWaitTimeMinutes * 60 * 1000) { // Quit after x minutes of waiting.
				quit();
			}
		}
	},
	
	waitTeamReady: function() {
		Party.iAmReady = true; // Prevents premature teamIsReady announcment.

		print("I am ready ; act = " + me.act);

		//D2Bot.shoutGlobal(me.realm + " " + me.gamename + " ready", 69);

		Communication.sendToList(HordeSystem.allTeamProfiles, "ready");

		// Dark-f ->
		if ( Party.iAmReady && HordeSystem.teamSize === 1 ) {
			Party.teamIsReady = true;

			print("Team is ready! Telling others :)");

			Communication.sendToList(HordeSystem.allTeamProfiles, "team is ready");
		}
		// <- Dark-f

		while (!Party.teamIsReady) {
			delay(500);
			
			if (getTickCount() - tick > HordeSettings.maxWaitTimeMinutes * 60 * 1000) { // Leave the game after x minutes of waiting.
				print("Team wasn't in game within x minutes.");

				D2Bot.printToConsole("Horde: Team wasn't ready within x minutes.", 9);

				quit();
			}
		}

		delay(1000);
		
		while (!this.lowestAct) { // Wait for everyone to get back to their Town, then record the lowest Town.
			this.lowestAct = Party.getLowestAct();

			delay(250);
		}

		print("wait team ready done. lowestAct: " + this.lowestAct);
	}
};