/**
*	@filename	LeaderElection.js
*	@author		M
*	@desc		Leader election logic
*	@credits	M, Adpist
*/

var LeaderElection = {
	hasEnteredLeaderGame: false,
	electedLeader: false,
	newElection: false,
	requestAnswers: [],
	
	clearElectionData: function() {
		this.electedLeader = false;
		this.newElection = false;
		this.requestAnswers.splice(0,this.requestAnswers.length);
		this.hasEnteredLeaderGame = false;
		Role.isLeader = false;
	},
	
	sendToList: function (list, id, data) {
		return list.forEach((profileName) => {
			if (profileName.toLowerCase() != me.profile.toLowerCase()) {
				sendCopyData(null, profileName, id, data);
			}
		});
	},
	
	receiveCopyData: function(id, data) {
		var obj;
		switch (id) {
			case 56:
			obj = JSON.parse(data);
			// Leader Profile request
			if(!!this.electedLeader){
				sendCopyData(null, obj.nick, 57, JSON.stringify({ nick: me.profile, electedLeader: Role.isLeader ? me.profile : this.electedLeader }));
				print(""+ obj.nick + " : requested election result - sent " + this.electedLeader);
			} else {
				sendCopyData(null, obj.nick, 58, JSON.stringify({nick: me.profile}));
				print(""+ obj.nick + " : requested election result - sent no leader yet");
			}
			return true;
		case 57:
			// Leader Profile reply
			obj = JSON.parse(data);
			this.newElection = obj.electedLeader;
			print(""+ obj.nick + " sent elected leader : "+this.newElection);
			return true;
		case 58:
			//no leader
			obj = JSON.parse(data);
			this.requestAnswers.push(obj.nick);
			print(""+ obj.nick + " sent elected no leader");			
			return true;
		}
		
		return false;
	},
	
	getOtherPlayerData: function(profileName) {
		var profileFile = "data/" + profileName + ".json";
		if (!FileTools.exists(profileFile)) {
			HordeDebug.logScriptError("Profile " + profileName + " data not found");
		}
		var string = Misc.fileAction(profileFile, 0);
		return JSON.parse(string);
	},
	
	askIfLeaderElected: function() {
		var tick = getTickCount();
		this.sendToList(HordeSystem.allTeamProfiles, 56, JSON.stringify({ nick: me.profile, msg: "leaderrequest" }));
		
		while(!this.newElection && this.requestAnswers.length < HordeSystem.teamSize - 1 && getTickCount() - tick < 2000) {
			
			delay(250);
		}
		
		return !!this.newElection;
	},
	
	onLeaderElected: function(leaderProfile) {
		print("" + leaderProfile + " is the new leader");
		Role.isLeader = (leaderProfile === me.profile);
		leader = "";
		this.electedLeader = leaderProfile;
		DataFile.updateStats("hordeLeader", leaderProfile);
	},
	
	leaderElection: function(){
		var hasPreviousElectionData = (!!this.electedLeader || !!this.newElection) && this.hasEnteredLeaderGame;
		D2Bot.updateStatus("Asking elected leader");
		print("Asking elected leader");
		
		//A bit of delay for sync
		delay(me.ping*2 + 1000);
		
		if (hasPreviousElectionData) {
			print("Has previous election data. cleaning up");
			this.clearElectionData();
		}
		
		if (!hasPreviousElectionData && this.askIfLeaderElected()) {
			this.onLeaderElected(this.newElection);
			return true;
		} else {
			D2Bot.updateStatus("Waiting ready for election");
			print("Waiting elected leader");
			if (!Party.waitSynchro("leader_election")) {
				print("leader synchro timed out");
				return false;
			}
		}
		
		while(!this.electedLeader){
			D2Bot.updateStatus("Electing leader...");
			delay(1000);
			if(HordeSystem.teleProfile.toLowerCase() === me.profile.toLowerCase()){
				//I'm the puesdo leader let me determine real leader
				this.newElection = this.doLeaderElection();
			} else {
				sendCopyData(null, HordeSystem.teleProfile, 56, JSON.stringify({ nick: me.profile, msg: "leaderrequest" }));
				//request leader
			}
			if(!!this.newElection){
				this.onLeaderElected(this.newElection);
				//Incase someone is desynced
				try {
					HordeSystem.allTeamProfiles.forEach((profileName) => {
						if (profileName.toLowerCase() != me.profile.toLowerCase()) {
							sendCopyData(null, profileName, 57, JSON.stringify({ nick: me.profile, electedLeader: this.electedLeader }));
						}
					});
				} catch (error){
					D2Bot.printToConsole("While sending quit kick: "+error);
				}
			}
		}
		
		return true;
	},
	
	doLeaderElection: function(){
		var levelCounter=0;
		var levelAggergate = 0;
		var levelLowest = 0;
		var hii = 0;
		var uncompletedQuests = {normalQuest:{},nmQuest:{},hellQuest:{}};
		var filteredUncompletedQuests = {normalQuest:{},nmQuest:{},hellQuest:{}};
		try {
			for(i=0;i<HordeSystem.allTeamProfiles.length;i++){
				var profileData = this.getOtherPlayerData(HordeSystem.allTeamProfiles[i]);
				if(!!profileData){
					if(!!profileData.level){
						levelAggergate+=profileData.level;
						levelCounter++;
						if(levelLowest < profileData.level){
							levelLowest = profileData.level;
						}
					}
					if(!!profileData.hordeInfo){
						var	hordeInfo = JSON.parse(profileData.hordeInfo);
						//normalQuest
						if(hordeInfo.hasOwnProperty("normalQuest")){
							for (hii = 1; hii < 41; hii += 1) {
								if(hordeInfo.normalQuest.hasOwnProperty(hii)){
									if(hordeInfo.normalQuest[hii]===0){
										if(!uncompletedQuests.normalQuest.hasOwnProperty(hii)){
											uncompletedQuests.normalQuest[hii]={};
											uncompletedQuests.normalQuest[hii].count=1;
											uncompletedQuests.normalQuest[hii].firstProfile=HordeSystem.allTeamProfiles[i];
										} else {
											uncompletedQuests.normalQuest[hii].count++;
										}
									}
								}
							}
						}

						//nmQuest
						if(hordeInfo.hasOwnProperty("nmQuest")){
							for (hii = 1; hii < 41; hii += 1) {
								if(hordeInfo.nmQuest.hasOwnProperty(hii)){
									if(hordeInfo.nmQuest[hii]===0){
										if(!uncompletedQuests.nmQuest.hasOwnProperty(hii)){
											uncompletedQuests.nmQuest[hii]={};
											uncompletedQuests.nmQuest[hii].count=1;
											uncompletedQuests.nmQuest[hii].firstProfile=HordeSystem.allTeamProfiles[i];
										} else {
											uncompletedQuests.nmQuest[hii].count++;
										}
									}
								}
							}
						}


						//hellQuest
						if(hordeInfo.hasOwnProperty("hellQuest")){
							for (hii = 1; hii < 41; hii += 1) {
								if(hordeInfo.hellQuest.hasOwnProperty(hii)){
									if(hordeInfo.hellQuest[hii]===0){
										if(!uncompletedQuests.hellQuest.hasOwnProperty(hii)){
											uncompletedQuests.hellQuest[hii]={};
											uncompletedQuests.hellQuest[hii].count=1;
											uncompletedQuests.hellQuest[hii].firstProfile=HordeSystem.allTeamProfiles[i];
										} else {
											uncompletedQuests.hellQuest[hii].count++;
										}
									}
								}
							}
						}


					} else {
						throw new Error("Did not get horde profile data, defaulting to teleport profile");
					}
				} else {
					throw new Error("Did not get all profile data, defaulting to teleport profile");

				}
			}

			print("Team Lowest Level: " + levelLowest);
			print("Team Average Level: " + Math.round(levelAggergate/levelCounter));



			//Lets remove the dead weight
			//	Always filter
			//	8 = Spoke to Jerhyn
			//	16 = Spoke to Hratli
			//	24 = Spoke to Tyrael
			//	Baal Quest in Hell



			//normalQuest
			if(uncompletedQuests.hasOwnProperty("normalQuest")){
				for (hii = 1; hii < 41; hii += 1) {
					if(hii===8 || hii===16 || hii===24){
						continue;
					}
					if(uncompletedQuests.normalQuest.hasOwnProperty(hii)){
						if(uncompletedQuests.normalQuest[hii].count<HordeSystem.allTeamProfiles.length){
								filteredUncompletedQuests.normalQuest[hii]=uncompletedQuests.normalQuest[hii];
						}
					}
				}
			}

			//nmQuest
			if(uncompletedQuests.hasOwnProperty("nmQuest")){
				for (hii = 1; hii < 41; hii += 1) {
					if(hii===8 || hii===16 || hii===24){
						continue;
					}
					if(uncompletedQuests.nmQuest.hasOwnProperty(hii)){
						if(uncompletedQuests.nmQuest[hii].count<HordeSystem.allTeamProfiles.length){
								filteredUncompletedQuests.nmQuest[hii]=uncompletedQuests.nmQuest[hii];
						}
					}
				}
			}


			//hellQuest
			if(uncompletedQuests.hasOwnProperty("hellQuest")){
				for (hii = 1; hii < 40; hii += 1) { // < 40 filter out baal Q for hell
					if(hii===8 || hii===16 || hii===24){
						continue;
					}
					if(uncompletedQuests.hellQuest.hasOwnProperty(hii)){
						if(uncompletedQuests.hellQuest[hii].count<HordeSystem.allTeamProfiles.length){
								filteredUncompletedQuests.hellQuest[hii]=uncompletedQuests.hellQuest[hii];
						}
					}
				}
			}

			//Search for first Quest that matches



			//normalQuest
			if(filteredUncompletedQuests.hasOwnProperty("normalQuest")){
				for (hii = 1; hii < 41; hii += 1) {
					if(StarterConfig.LeaderElectAnyQuest || hii===6 || hii===7 || hii===11 || hii===12 || hii===13 || hii===14 || hii===15 || hii===21 || hii===22 || hii===23 || hii===26 || hii===28 || hii===38 || hii===39 || hii===40){
						if(filteredUncompletedQuests.normalQuest.hasOwnProperty(hii)){
							//Leader elected!
							print("Leader Elected quest: " + hii + " profile count missing: "+filteredUncompletedQuests.normalQuest[hii].count+" leader will be: "+filteredUncompletedQuests.normalQuest[hii].firstProfile);

							return filteredUncompletedQuests.normalQuest[hii].firstProfile;
						}
					}
				}
			}

			//nmQuest
			if(filteredUncompletedQuests.hasOwnProperty("nmQuest")){
				for (hii = 1; hii < 41; hii += 1) {
					if(StarterConfig.LeaderElectAnyQuest || hii===6 || hii===7 || hii===11 || hii===12 || hii===13 || hii===14 || hii===15 || hii===21 || hii===22 || hii===23 || hii===26 || hii===28 || hii===38 || hii===39 || hii===40){
						if(filteredUncompletedQuests.nmQuest.hasOwnProperty(hii)){
							//Leader elected!
							print("Leader Elected quest: " + hii + " profile count missing: "+filteredUncompletedQuests.nmQuest[hii].count+" leader will be: "+filteredUncompletedQuests.nmQuest[hii].firstProfile);

							return filteredUncompletedQuests.nmQuest[hii].firstProfile;
						}
					}
				}
			}

			//hellQuest
			if(filteredUncompletedQuests.hasOwnProperty("hellQuest")){
				for (hii = 1; hii < 40; hii += 1) {
					if(StarterConfig.LeaderElectAnyQuest || hii===6 || hii===7 || hii===11 || hii===12 || hii===13 || hii===14 || hii===15 || hii===21 || hii===22 || hii===23 || hii===26 || hii===28 || hii===38 || hii===39 || hii===40){
						if(filteredUncompletedQuests.hellQuest.hasOwnProperty(hii)){
							//Leader elected!
							print("Leader Elected quest: " + hii + " profile count missing: "+filteredUncompletedQuests.hellQuest[hii].count+" leader will be: "+filteredUncompletedQuests.hellQuest[hii].firstProfile);

							return filteredUncompletedQuests.hellQuest[hii].firstProfile;
						}
					}
				}
			}

		} catch (error){
			print(error);
		}
		print("Default leader elected");
		return HordeSystem.teleProfile;
	}
};