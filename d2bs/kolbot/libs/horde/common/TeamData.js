/**
*	@filename	TeamData.js
*	@author		Adpist, M
*	@desc		Team data access
*	@credits	Adpist, M
*/

var TeamData = {

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