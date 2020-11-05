/**
*	@filename	HordeSystem.js
*	@author		Adpist
*	@desc		general stuff
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeSystem = {
	team: {},
	build: {},
	teamSize: 0,
	teleProfile: "",
	boProfile: "",
	followerProfiles: [],
	allTeamProfiles: [],
	allTeamCharacters: [],
	
	init: function() {
		print("Init horde");
		
		this.team = {};
		this.build = {};
		this.teamSize = 0;
		this.teleProfile = "";
		this.boProfile = "";
		this.followerProfiles = [];
		this.allTeamProfiles = [];
		this.allTeamCharacters = [];
	},
	
	getTeamIndex: function(profile) {
		if (profile === undefined) {
			profile = me.profile;
		}
		
		return this.allTeamProfiles.indexOf(profile);
	},
	
	setupBuild: function(buildName) {
		var className = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
		
		if (!include("horde/builds/"+className+"/"+buildName+".js")) {
			throw new Error("Failed to find build: "+ buildName + " for class " + className);
		}
		
		if (!include("horde/builds/templates/stats/"+className+".js")){
			throw new Error("Failed to find stats build templates for class " + className);
		}
		
		if (!include("horde/builds/templates/skills/"+className+".js")){
			throw new Error("Failed to find skills build templates for class " + className);
		}
		
		this.build = HordeBuild;
		
		var statBuild = StatsBuilds[this.build.statsBuild],
			skillsBuild = SkillsBuilds[this.build.skillsBuild];
			
		if (statBuild === undefined) {
			throw new Error("invalid stats build " + this.build.statsBuild + " for class " + className);
		}
		
		if (skillsBuild === undefined) {
			throw new Error("invalid skills build " + this.build.skillsBuild + " for class " + className);
		}
		
		//Stats
		Config.AutoStat.Enabled = true;
		Config.AutoStat.Save = 0;
		Config.AutoStat.BlockChance = 0;
		Config.AutoStat.UseBulk = false;
		Config.AutoStat.Build = statBuild;
		
		//Skills
		Config.AutoSkill.Enabled = true;
		Config.AutoSkill.Save = 0;
		Config.AutoSkill.Build = skillsBuild;
		
		//AutoBuild
		Config.AutoBuild.Enabled = true;
		Config.AutoBuild.Template = HordeBuild.autoBuildTemplate;
		
		//Debugging
		Config.AutoBuild.Verbose = true;			//	Allows script to print messages in console
		Config.AutoBuild.DebugMode = true;			//	Debug mode prints a little more information to console and
		
		//Auto Equip
		Config.AutoEquip = true;
		HordeBuild.pickits.forEach(function(pickit) {
			Config.PickitFiles.push(pickit);
		});
	},
	
	trimBaseName: function(name) {
		var splitted = name.split(' '), result = "";
		for (var i = 0 ; i < splitted.length ; i += 1) {
			result += splitted[i].toLowerCase();
		}
		return result;
	},
	
	setupRunewordLocation: function(locationName, runewordLocation, merc) {
		var runewords = Object.keys(runewordLocation), runeword, pickitLine;
		
		for(var i = 0 ; i < runewords.length ; i += 1) {
			runeword = runewordLocation[runewords[i]];
			if (runeword.skipIf === undefined || runeword.skipIf === "" || !eval(runeword.skipIf)) {				
				Config.KeepRunewords.push("[type] == " + locationName + " # " + runeword.statCondition);
				
				for (var j = 0 ; j < runeword.bases.length ; j += 1) {
					var lowerCaseName = this.trimBaseName(runeword.bases[j]);
					Config.Runewords.push([runeword.runeword, lowerCaseName]);
					if (runeword.cubeBase) {
						if (runeword.recipeType !== undefined) {
							Config.Recipes.push([runeword.recipeType, runeword.bases[j], runeword.roll]);
						} else {
							HordeDebug.logUserError("Runewords", "runeword entry " + runewords[i] + " have cube base but recipeType isn't defined");
						}
					}
					
					pickitLine = "[name] == " + lowerCaseName;
					
					if (runeword.qualityCondition !== undefined) {
						pickitLine += " && " + runeword.qualityCondition;
					}
					
					if (runeword.roll === Roll.Eth) {
						pickitLine += " && [flag] == ethereal ";
					} else if (runeword.roll === Roll.NonEth) {
						pickitLine += " && [flag] != ethereal ";
					}
					
					pickitLine += " # [sockets] == " + runeword.sockets;
					pickitLine += " # [maxquantity] == 1";
					
					NTIP.PushLine(0, pickitLine, "dynamic/runewords/"+ (merc ? "merc" : "character") +"/" + locationName + "/" + runewords[i]);
				}
			}
		}
	},
	
	setupRunewordCategory: function(category, merc) {
		var locations = Object.keys(category);
		
		for (var i = 0 ; i < locations.length ; i += 1) {
			this.setupRunewordLocation(locations[i], category[locations[i]], merc);
		}
	},
	
	setupRunewords: function(runewordProfile) {
		if (runewordProfile === undefined) {
			return;
		}
		
		if (!isIncluded("horde/settings/crafting/runewords/" + runewordProfile + ".js")){
			if (!include("horde/settings/crafting/runewords/" + runewordProfile + ".js")){
				throw new Error("couldn't find " + runewordProfile + ".js in libs/horde/settings/crafting/runewords");
			}
		}
		
		Config.MakeRunewords = true;
		
		this.setupRunewordCategory(RunewordProfile.character, false);
		this.setupRunewordCategory(RunewordProfile.merc, true);
	},
	
	setupConfig: function(teamName, oog) {
		print("setup config " + me.profile + "[" + teamName + "]");
		
		if (!isIncluded("horde/settings/teams/" + teamName + ".js")){
			if (!include("horde/settings/teams/" + teamName + ".js")){
				throw new Error("couldn't find " + teamName + ".js in libs/horde/settings/teams/");
			}
		}
		
		var isTeleportChar = false;
		this.team = HordeTeam;
		
		if (this.team === undefined){
			D2Bot.printToConsole(me.profile + " isn't in " + teamName + " team", 6);
			throw new Error("Couldn't find horde team : " + teamName);
		}
		
		var profiles = Object.keys(this.team.profiles);
		
		if (this.team.profiles[me.profile] === undefined){
			D2Bot.printToConsole(me.profile + " isn't in " + teamName + " team", 6);
			throw new Error(me.profile + " isn't in " + teamName + " team");
		}
		//parse each team member
		profiles.forEach(function(profile) {
			var profileData = HordeSystem.team.profiles[profile];
			switch(profileData.role) {
				case "teleport":
					HordeSystem.teleProfile = profile;
					break;
					
				case "bo":
					HordeSystem.boProfile = profile;
					break;
					
				case "follower":
					HordeSystem.followerProfiles.push(profile);
					break;
					
				default:
					D2Bot.printToConsole("unhandled role : " + profileData.role + " => using follower");
					HordeSystem.followerProfiles.push(profile);
					break;
			}
			HordeSystem.allTeamProfiles.push(profile);
			HordeSystem.allTeamCharacters.push(profileData.character);
			HordeSystem.teamSize += 1;
		});
		
		isTeleportChar = this.teleProfile === me.profile;
		if(isTeleportChar) { //For non horde hooks
			Config.Horde.RoleteleportingChar = true;
		} else {
			Config.Horde.RoleteleportingChar = false;
		}
		if(this.team.manualPlay){
			Scripts.Horde = false;
			if (isTeleportChar) {
				Scripts.UserAddon = true;
			}
			else {
				Scripts.Follower = true;
				Config.Leader = this.team.profiles[this.teleProfile].character;
			}
			
			Config.MinGameTime = this.team.minGameTime;
			Config.MaxGameTime = 0;
			
			//NOT HARDCORE FRIENDLY
			Config.LifeChicken = 0; //Disable chicken in manual
			Config.TownCheck = 0;
		}
		else {
			Scripts.Horde = true;
			
			//For now party leader is teleporter
			Config.PublicMode = (isTeleportChar) ? 1 : 2;
			
			Config.MinGameTime = this.team.minGameTime;
			Config.MaxGameTIme = this.team.maxGameTime;
			
			Config.ItemInfo = true;//Debug purposes
		}
		
		if (this.team.quitList) {
			Config.QuitList = this.allTeamCharacters;
			Config.QuitListMode = 0;
			Config.QuitListDelay = [2,10];
		}
		else {
			Config.QuitList = [];
		}
		
		if (HordeSettings.logChar) {
			MuleLogger.LogNames = true; // Put account/character name on the picture
			MuleLogger.LogItemLevel = true; // Add item level to the picture
			MuleLogger.LogEquipped = true; // include equipped items
			MuleLogger.LogMerc = true; // include items merc has equipped (if alive)
		}
		
		if (!oog) {
			this.setupBuild(this.team.profiles[me.profile].build);
			this.setupRunewords(this.team.profiles[me.profile].runewordsProfile);
			Sequencer.setupSequences(this.team.sequencesProfile);
			
		}
		return true;
	},
	
	shouldKillBaal: function() {
		if (!!this.team.difficulties) {
			if (!!this.team.difficulties[me.diff] && !!this.team.difficulties[me.diff].killBaalIf) {
				return eval(this.team.difficulties[me.diff].killBaalIf);
			}
		}
		return true;
	},
	
	getGameDifficulty: function() {
		var selectedDifficulty;
		if (!!this.team.difficulties) {
			
			if (!!this.team.difficulties[0] && !!this.team.difficulties[0].stayIf) {
				if (!eval(this.team.difficulties[0].stayIf)) {//stay in normal not verified
					if (!!this.team.difficulties[1] && !!this.team.difficulties[1].stayIf) {
						if (eval(this.team.difficulties[1].stayIf)) {//stay in nightmare verified
							selectedDifficulty = "Nightmare";
						} else {
							selectedDifficulty = "Hell";//hellyeah :)
						}
					}
				} else {
					selectedDifficulty = "Normal";
				}
			}
		}
		if (selectedDifficulty === undefined) {
			HordeDebug.logUserError("Wrong difficulty settings in your team. compare with template file. picking profile one");
			selectedDifficulty = gameInfo.difficulty;//Failing on profile setting
		}
		return selectedDifficulty;
	},
	
	boot: function() {
		Sequencer.run();
	},
	
	onToolThreadQuit: function() {
		var baseDelay = 250, minDelay;
		//no more leader
		Role.isLeader = false;
		
		if (Role.backToTown()) {
			//We're safe in town, just wait to not leave all together
			baseDelay = 2000;
		}
		
		minDelay = baseDelay+(baseDelay* (this.getTeamIndex(me.profile) + 1));
		delay(minDelay, minDelay + baseDelay/4 );
	}
}
