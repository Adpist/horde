/**
*	@filename	Communication.js
*	@author		Adpist
*	@desc		All about teammates communication
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Communication = {
	Questing: {
		cube: false,
		getCube: false,
		amulet: false,
		summoner: false,
		tombs: false,
		radament: false,
		killRadament: false,
		teamFigurine: false,
		LamEssen: false,
		clearOrifice: false,
		duriel: false,
		travincal: false,
		figurine: false,
		mephisto: false,
		redPortal: false,
		readyToKillDiablo: 0,
		waitAncients: 0
	},
	
	sendToList: function (list, message, mode=55) {
		return list.forEach((profileName) => {
			if (profileName.toLowerCase() != me.profile.toLowerCase()) {
				sendCopyData(null, profileName, mode, JSON.stringify({ nick: me.profile, msg: message }));
			}
		});
	},
	
	receiveCopyData: function(id, data) {
		let { msg, nick } = JSON.parse(data);
		// Dark-f ->
		if ( Party.iAmReady && HordeSystem.teamSize === 1 ) {
			Party.teamIsReady = true;

			print("Team is ready! Telling others :)");

			Communication.sendToList(HordeSystem.allTeamProfiles, "team is ready");
		}
		// <- Dark-f
		if (id == 55) {
			//sequencer command
			if (msg.indexOf("run ") !== -1) {
				var sequence, timeline, 
					args = msg.split(' ');
				if (args.length >= 2) {
					sequence = args[1];
					timeline = args[2];
					Sequencer.receiveSequenceRequest(sequence, timeline);
				} else {
					HordeDebug.logScriptError("Sequencer", "Invalid run command: " + msg);
				}
				
			} else {
				switch (msg) {
				//sequencer command
				case "end":
					Sequencer.onReceiveEnd();
					break;
				
				//Old stuff
				case "ready":
					Party.readyCount += 1;

					print("readyCount = " + Party.readyCount);

					if (Party.iAmReady && Party.readyCount === HordeSystem.teamSize - 1) {  // Doesn't count my ready because my messages are ignored. Subtract one from TeamSize to account for this.
						if (!Party.teamIsReady) { // Only need to change teamIsReady to true once.
							Party.teamIsReady = true;

							print("Team is ready! Telling others :)");

							Communication.sendToList(HordeSystem.allTeamProfiles, "team is ready");
						}
					}
					break;
				case "team is ready":
					if (!Party.teamIsReady) { // Only need to change teamIsReady to true once.
						Party.teamIsReady = true;

						print("Received team is ready!");
					}
					break;
				case "at waypoint":
					Waypoint.playersAtWpCount += 1;

					print("playersAtWPCount = " + Waypoint.playersAtWpCount);

					break;
				case "ready to drink":
					Buff.readyToDrink += 1;
					print("readyToDrink = " + Buff.readyToDrink);
					break;
				case "cube":
					this.Questing.cube = true;
					break;
				case "need cube":
					this.Questing.getCube = true;
					break;
				case "amulet":
					this.Questing.amulet = true;
					break;
				case "summoner":
					this.Questing.summoner = true;
					break;
				case "tombs":
					this.Questing.tombs = true;
					break;
				case "radament":
					this.Questing.radament = true;
					break;
				case "kill radament":
					this.Questing.killRadament = true;
					break;
				case "clear orifice":
					this.Questing.clearOrifice = true;
					break;
				case "duriel":
					this.Questing.duriel = true;
					break;
				case "travincal":
					this.Questing.travincal = true;
					break;
				case "team figurine":
					this.Questing.teamFigurine = true;
					break;
				case "figurine":
					this.Questing.figurine = true;
					break;
				case "Lam Essen":
					this.Questing.LamEssen = true;
					break;
				case "mephisto":
					this.Questing.mephisto = true;
					break;
				case "red portal":
					this.Questing.redPortal = true;
					break;
				case "ready to kill diablo":
					this.Questing.readyToKillDiablo += 1;
					break;
				case "master":
					Communication.sendToList(HordeSystem.allTeamProfiles, nick + " is my master.");
					break;
				case "smurf":
					Communication.sendToList(HordeSystem.allTeamProfiles, "Smurf!");
					break;
				case "WaitMe":
					this.Questing.wait = 1;
					break;
				case "hi":
				case "yo!":
				case "hello":
				case "hey":
					Communication.sendToList(HordeSystem.allTeamProfiles, "yo");
					break;
				case "bo":
					Buff.boing =1;
					break;
				case "I'm bored -.-":
					Buff.goBo =1;
					break;
				case "I'm Boed!":
					Buff.boed += 1;
					break;
				case "Ok Bitch":
					if (me.gold < Config.LowGold) {
						Sharing.pickGoldRequest = 1;
					}
					break;
				case "GimmeGold":
					if (me.gold > Config.LowGold * 2 + 100) {
						Communication.sendToList(HordeSystem.allTeamProfiles, "Ok Bitch");
						Sharing.giveGoldRequest = 1;
					}
					break;
				case "TP":
				case "Tp":
				case "tp":
				case "portal":
				case "tp plz":
					Sharing.giveTP(nick);
					break;
				case (msg.match("Have: ") ? msg : null): // We're comparing if that case's value is equal to our switch term. Thus, if the msg contains "Have: " compare msg to msg (do case), otherwise compare msg to null (don't do case).
					msg = msg.split("Have: ")[1].split(""); // Change msg from a string to an array of 0's and 1's representing waypoint possession.

					msg.unshift(nick); // Add the waypoint owner's name to the front of the array.

					Waypoint.teamWaypoints.push(msg); // Record the Team Member's list of Waypoint possession values. SiC-666 TODO: Should we check to make sure this character's waypoints hasn't been previously recorded?

					break;
				}
			}
		}
	}
	
}