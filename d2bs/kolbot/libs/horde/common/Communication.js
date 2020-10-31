/**
*	@filename	Communication.js
*	@author		Adpist
*	@desc		All about teammates communication
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Communication = {
	Questing: {
		clearOrifice: false,//duriel sequence
		readyToKillDiablo: 0, //diablo sequence
		waitAncients: 0 //ancients sequence
	},
	
	Synchro: {
		teamMessages: {},
		
		addTeamReady: function(profile, synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.flushTeamReady(synchroType);
			}
			
			if (this.teamMessages[synchroType].indexOf(profile) === -1) {
				this.teamMessages[synchroType].push(profile);
			}
		},
		
		sayReady: function(synchroType) {
			this.addTeamReady(me.profile, synchroType);
			Communication.sendToList(HordeSystem.allTeamProfiles, "ready " + synchroType);
		},
		
		isTeamReady: function(synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				return false;
			}
			
			return this.teamMessages[synchroType].length === HordeSystem.teamSize;
		},

		flushTeamReady: function(synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.teamMessages[synchroType] = [];
			} else {			
				this.teamMessages[synchroType].splice(0,this.teamMessages[synchroType].length);
			}
		}
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
		
		if (id == 55) {
			//sequencer command
			if (msg.indexOf("run ") !== -1) {
				var sequence, timeline, 
					args = msg.split(' ');
				if (args.length >= 3) {
					sequence = args[1];
					timeline = args[2];
					Sequencer.receiveSequenceRequest(sequence, timeline);
				} else {
					HordeDebug.logScriptError("Sequencer", "Invalid run command: " + msg);
				}
			} 
			//Synchro command
			else if (msg.indexOf("ready ") !== -1) {
				var args = msg.split(' ');
				if (args.length >= 2) {
					this.Synchro.addTeamReady(nick, args[1]);
				}
			} else {
				switch (msg) {
				//sequencer command
				case "HordeGameEnd":
					Sequencer.onReceiveEnd();
					break;
				
				//Old stuff
				case "at waypoint":
					Waypoint.playersAtWpCount += 1;

					print("playersAtWPCount = " + Waypoint.playersAtWpCount);

					break;
				case "ready to drink":
					Buff.readyToDrink += 1;
					print("readyToDrink = " + Buff.readyToDrink);
					break;
				case "clear orifice":
					this.Questing.clearOrifice = true;
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