/**
*	@filename	Communication.js
*	@author		Adpist
*	@desc		All about teammates communication
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Communication = {
	ingame: true,
	
	Questing: {
		clearOrifice: false,//duriel sequence
		readyToKillDiablo: 0, //diablo sequence
		waitAncients: 0 //ancients sequence
	},
	
	Synchro: {
		teamMessages: {},
		
		cleanup: function() {
			this.teamMessages = {};
		},
		
		onReceiveCommand: function(nick, msg, ingame) {
			var args = msg.split(' ');
			if (args.length === 2) {
				this.addTeamReady(nick, args[1]);
			} else if (args.length === 3 ) {
				if (args[2] === "all") {
					this.addTeamReadyAll(nick, args[1]);
				} else if (args[2] === "ask") {
					this.onAskReady(nick, args[1]);
				}
			}
		},
		
		addTeamReady: function(profile, synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.flushTeamReady(synchroType);
			}
			
			if (this.teamMessages[synchroType].ready.indexOf(profile) === -1) {
				this.teamMessages[synchroType].ready.push(profile);
				
				if (this.teamMessages[synchroType].ready.length === HordeSystem.teamSize) {
					Communication.sendToList(HordeSystem.allTeamProfiles, "ready " + synchroType + " all");
					this.teamMessages[synchroType].all.push(me.profile);
				}
				
				if (HordeSettings.Debug.Verbose.synchro) {
					print("" + profile + " is ready for " + synchroType + " - " + this.teamMessages[synchroType].ready.length + "/" + HordeSystem.teamSize);
 				}
			}
		},
		
		addTeamReadyAll: function(profile, synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.flushTeamReady(synchroType);
			}
			
			if(this.teamMessages[synchroType].all.indexOf(profile) === -1) {
				this.teamMessages[synchroType].all.push(profile);
				
				if (this.teamMessages[synchroType].ready.indexOf(profile) === -1) {
					this.addTeamReady(profile, synchroType);
					Communication.sendToProfile(profile, "ready " + synchroType + " ask");
				}
			}
		},
		
		onAskReady: function(profile, synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.flushTeamReady(synchroType);
			}
			
			if (this.teamMessages[synchroType].ready.indexOf(me.profile) !== -1) {
				Communication.sendToProfile(profile, "ready " + synchroType);
			}
		},
		
		askMissingReady: function(synchroType) {
			if (this.teamMessages[synchroType] === undefined) {
				this.flushTeamReady(synchroType);
			}
			
			if (this.teamMessages[synchroType].ready.length < HordeSystem.teamSize) {
				for (var i = 0 ; i < HordeSystem.allTeamProfiles.length ; i += 1) {
					if (this.teamMessages[synchroType].ready.indexOf(HordeSystem.allTeamProfiles[i]) === -1) {
						Communication.sendToProfile(HordeSystem.allTeamProfiles[i], "ready " + synchroType + " ask");
					}
				}
			}
		},
		
		sayReady: function(synchroType) {
			this.addTeamReady(me.profile, synchroType);
			Communication.sendToList(HordeSystem.allTeamProfiles, "ready " + synchroType);
		},
		
		isTeamReady: function(synchroType) {
			if (this.teamMessages[synchroType] === undefined || this.teamMessages[synchroType].all === undefined) {
				return false;
			}
			
			return this.teamMessages[synchroType].all.length === HordeSystem.teamSize;
		},

		flushTeamReady: function(synchroType) {
			if (this.teamMessages[synchroType] === undefined ) {
				this.teamMessages[synchroType] = {ready: [], all: []};
			}
			else {
				this.teamMessages[synchroType].ready.splice(0,this.teamMessages[synchroType].ready.length);
				this.teamMessages[synchroType].all.splice(0,this.teamMessages[synchroType].all.length);
			}
		}
	},
	
	sendToProfile: function(profile, message, mode=55) {
		if (profile.toLowerCase() != me.profile.toLowerCase()) {
			sendCopyData(null, profile, mode, JSON.stringify({ nick: me.profile, msg: message, ingame: this.ingame }));
		}
	},
	
	sendToList: function (list, message, mode=55) {
		return list.forEach((profileName) => {
			if (profileName.toLowerCase() != me.profile.toLowerCase()) {
				sendCopyData(null, profileName, mode, JSON.stringify({ nick: me.profile, msg: message, ingame: this.ingame }));
			}
		});
	},
	
	
	receiveCopyData: function(id, data) {
		if (id == 55) {
			let { msg, nick, ingame } = JSON.parse(data);
			
			if (!ingame) {
				return;
			}
			
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
				this.Synchro.onReceiveCommand(nick, msg, ingame);
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