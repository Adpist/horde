/**
*	@filename	TeamData.js
*	@author		Adpist, M
*	@desc		Team data access
*	@credits	Adpist, M
*/

var TeamData = {
	
	save: function() {
		this.saveCharacterData();
		this.saveQuestData();
	},
	
	saveCharacterData: function() {
		DataFile.updateStats("level", me.charlvl);
	},
	
	saveQuestData: function() {
		var lastQuest = HordeSystem.team.expansion ? 40 : 28; //baal for LOD - Diablo for classic
		var questCompletionKeys = [	[0],//0 = Spoke to Warriv
									[0],//1 = Den of Evil
									[0],//2 = Sisters' Burial Grounds
									[0,1],//3 = Tools of the Trade
									[0],//4 = The Search for Cain
									[0],//5 = Forgotten Tower
									[0],//6 = Sisters to the Slaughter
									[0],//7 = Able to go to Act II
									[0],//8 = Spoke to Jerhyn
									[0],//9 = Radament's Lair
									[0],//10 = The Horadric Staff
									[0],//11 = The Tainted Sun
									[0],//12 = The Arcane Sanctuary
									[0],//13 = The Summoner
									[0],//14 = The Seven Tombs
									[0],//15 = Able to go to Act III
									[0],//16 = Spoke to Hratli
									[0],//17 = Lam Esen's Tome
									[0],//18 = Khalim's Will
									[0],//19 = Blade of the Old Religion
									[0],//20 = The Golden Bird
									[0],//21 = The Blackened Temple
									[0],//22 = The Guardian
									[0],//23 = Able to go to Act IV
									[0],//24 = Spoke to Tyrael
									[0],//25 = The Fallen Angel
									[0],//26 = Terror's End
									[0],//27 = Hell's Forge
									[0],//28 = Able to go to Act V
									[0],//29
									[0],//30
									[0],//31
									[0],//32
									[0],//33
									[0],//34
									[0,1],//35 = Seige on Haggorath
									[0],//36 = Rescue on Mount Arreat
									[0],//37 = Prison of Ice
									[0,1],//38 = Betrayal of Haggorath
									[0],//39 = Rite of Passage
									[0]//40 = Eve of Destruction
								];
		sendPacket(1, 0x40); // Refresh quest status
		delay(me.ping * 2 + 250);
		
		if (HordeSettings.Debug.Verbose.quests) {
			print(me.profile + " quest log : ");
			for(var i = 0 ; i <= lastQuest; i += 1) {
				var questStr = "Quest " + i + " : [";
				for (var j = 0 ; j <= 12 ; j += 1) {
					if (j > 0) {
						questStr += ",";
					}
					questStr += j + ":" + me.getQuest(i,j);
				}
				questStr += "]";
				
				print(questStr);
			}
		}
		
		try {
			var questJson = {};
			var hordeInfo = {};
			for (var i = 1; i <= lastQuest; i += 1) {
				var questResult = 0;
				for (var j = 0 ; j < questCompletionKeys[i].length ; j+=1) {
					if (me.getQuest(i, questCompletionKeys[i][j])) {
						questResult = 1;
						break;
					}
				}
				questJson[i] = questResult;
			}
			hordeInfo[me.diff] = questJson;
			
			DataFile.updateStats("hordeInfo", JSON.stringify(hordeInfo));
		} catch (error){
				HordeDebug.logScriptError("TeamData", "Failed to save character quest data : " + error);
		}
	},
	
	getTeamQuestData: function() {
		var teamData = {uncompletedQuests: {0:{},1:{},2:{}}, avgLvl: 1, lowestLvl: 100};
		var lastQuest = HordeSystem.team.expansion ? 40 : 28; //baal for LOD - Diablo for classic
		var ignoredQuests = [8,16,24];
		for(var i=0;i<HordeSystem.allTeamProfiles.length;i++){
			var profile = HordeSystem.allTeamProfiles[i];
			var profileData = this.getOtherPlayerData(profile);
			
			if (!!profileData) {
				if(!!profileData.level){
					teamData.avgLvl += profileData.level;
					if(teamData.lowestLvl > profileData.level){
						teamData.lowestLvl = profileData.level;
					}
				} else { //No data
					teamData.avgLvl += 1;
					teamData.lowestLvl = 1;
				}
					
				var	hordeInfo = !!profileData.hordeInfo ? JSON.parse(profileData.hordeInfo) : undefined;
				for(var diff = 0; diff <= 2 ; diff += 1) {
					for (var quest = 1; quest <= lastQuest; quest += 1) {
						if (ignoredQuests.indexOf(quest) === -1) {
							if (!!hordeInfo) {
								if(!!hordeInfo[diff] && hordeInfo[diff].hasOwnProperty(quest)){
									if(hordeInfo[diff][quest]===0){
										if(!teamData.uncompletedQuests[diff].hasOwnProperty(quest)){
											teamData.uncompletedQuests[diff][quest]={};
											teamData.uncompletedQuests[diff][quest].count=1;
											teamData.uncompletedQuests[diff][quest].firstProfile = profile;
										} else {
											teamData.uncompletedQuests[diff][quest].count+=1;
										}
									}
								}
							} else {//No data
								if(!teamData.uncompletedQuests[diff].hasOwnProperty(quest)){
									teamData.uncompletedQuests[diff][quest]={};
									teamData.uncompletedQuests[diff][quest].count=1;
									teamData.uncompletedQuests[diff][quest].firstProfile = profile;
								} else {
									teamData.uncompletedQuests[diff][quest].count+=1;
								}
							}
						}
					}
				}			
			}			
		}
		
		teamData.avgLvl = Math.round(teamData.avgLvl/HordeSystem.teamSize);
		
		return teamData;
	},
	
	getOtherPlayerData: function(profileName) {
		var profileFile = "data/" + profileName + ".json";
		if (!FileTools.exists(profileFile)) {
			throw new Error("Did not find for leader election: "+profileFile);
		}
		var string = Misc.fileAction(profileFile, 0);
		return JSON.parse(string);
	},
	
	getTeamLevels: function() {
		var teamLevels = [];
		
		for(var i=0;i<HordeSystem.allTeamProfiles.length;i++){
			var profileData = this.getOtherPlayerData(HordeSystem.allTeamProfiles[i]), found = false;
			if(!!profileData){
				if(!!profileData.level){
					teamLevels.push(profileData.level);
					found = true;
				}
			}
			if (!found) {
				teamLevels.push(1);
			}
		}
		
		return teamLevels;
	},
	
	getAverageLevel: function() {
		var teamLevels = this.getTeamLevels(), levelSum = 0, levelCount = teamLevels.length;
		for (var i = 0 ; i < levelCount ; i += 1) {
			levelSum += teamLevels[i]; 
		}
		
		return Math.round(levelSum/levelCount);
	},
	
	getLowestLevel: function() {
		var teamLevels = this.getTeamLevels(), level,
						lowestLevel = 100; //Todo : my level
		
		for (var i = 0 ; i < teamLevels.length ; i += 1) {
			level = teamLevels[i];
			if (level < lowestLevel) {
				lowestLevel = level;
			} 
		}
		
		return lowestLevel;
	}
};