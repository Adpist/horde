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
	leaderProfile: "",
	teleProfile: "",
	boProfile: "",
	questDropProfile: "",
	uberProfile: "",
	followerProfiles: [],
	allTeamProfiles: [],
	allTeamCharacters: [],
	loadedBuilds: {},
	
	init: function() {
		print("Init horde");
		
		this.team = {};
		this.build = {};
		this.teamSize = 0;
		this.leaderProfile = "";
		this.teleProfile = "";
		this.boProfile = "";
		this.questDropProfile = "";
		this.followerProfiles = [];
		this.allTeamProfiles = [];
		this.allTeamCharacters = [];
	},
	
	isEndGame: function() {
		return !this.team.endgame ? false : eval(this.team.endgame);
	},
	
	getTeamIndex: function(profile) {
		if (profile === undefined) {
			profile = me.profile;
		}
		
		return this.allTeamProfiles.indexOf(profile);
	},
	
	isTeammate: function(charName) {
		return this.allTeamCharacters.indexOf(charName) !== -1;
	},
	
	getBuild: function(buildName, className) {
		if (!!this.loadedBuilds[buildName]) {
			return this.loadedBuilds[buildName];
		}
		
		if (!include("horde/builds/"+className+"/"+buildName+".js")) {
			throw new Error("Failed to find build: "+ buildName + " for class " + className);
		}
		
		this.loadedBuilds[buildName] = HordeBuild;
		
		return this.loadedBuilds[buildName];
	},
	
	setupBuild: function(buildName) {
		var className = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
		
		if (!include("horde/builds/templates/stats/"+className+".js")){
			throw new Error("Failed to find stats build templates for class " + className);
		}
		
		if (!include("horde/builds/templates/skills/"+className+".js")){
			throw new Error("Failed to find skills build templates for class " + className);
		}
		
		this.build = this.getBuild(buildName, className);
		
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
		if (me.gametype === 0 ) {
			if (!!HordeBuild.classicPickits) {
				HordeBuild.classicPickits.forEach(function(pickit) {
					Config.PickitFiles.push(pickit);
				});
			}
		} else {
			if (!!HordeBuild.xpacPickits) {
				HordeBuild.xpacPickits.forEach(function(pickit) {
					Config.PickitFiles.push(pickit);
				});
			}
		}
	},
	
	trimBaseName: function(name) {
		var splitted = name.split(' '), result = "";
		for (var i = 0 ; i < splitted.length ; i += 1) {
			result += splitted[i].toLowerCase();
		}
		return result;
	},
	
	pushedRunewords: [],
	setupRunewordLocation: function(locationName, runewordLocation, merc) {
		var runewords = Object.keys(runewordLocation), runeword, pickitLine;
		var bodyLocMap = {"auricshields": 5, "shield": 5, "armor": 3, "helm": 1};
		var defaultBodyLoc = 4;
		
		for(var i = 0 ; i < runewords.length ; i += 1) {
			runeword = runewordLocation[runewords[i]];
			if (runeword.skipIf === undefined || runeword.skipIf === "" || !eval(runeword.skipIf)) {	
				var runewordBodyLoc = defaultBodyLoc;
				if (!!bodyLocMap[locationName]) {
					runewordBodyLoc = bodyLocMap[locationName];
				}

				var currentItemTier = merc ? Item.getEquippedItemMerc(runewordBodyLoc).tier : Item.getEquippedItem(runewordBodyLoc).tier;
				
				if (!runeword.tier || currentItemTier < runeword.tier)
				{
					if (HordeSettings.Debug.Verbose.crafting) {
						print("push runeword " + runewords[i] + " - current item tier : " + currentItemTier + " - runeword tier : " + runeword.tier);
					}
					
					if (this.pushedRunewords.indexOf(runeword.runeword) === -1) {
						this.pushedRunewords.push(runeword.runeword);
					}
					
					var itemTypeCondition = runeword.typeCondition;
					if (!itemTypeCondition) {
						itemTypeCondition = "[type] == " + locationName;
					}
					
					if (HordeSettings.Debug.Verbose.crafting) {
						print("Keep runeword condition : " + itemTypeCondition + " # " + runeword.statCondition);
					}
					
					Config.KeepRunewords.push(itemTypeCondition + " # " + runeword.statCondition);
					
					for (var j = 0 ; j < runeword.bases.length ; j += 1) {
						var lowerCaseName = this.trimBaseName(runeword.bases[j]);
						Config.Runewords.push([runeword.runeword, runeword.bases[j], runeword.roll]);
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
							pickitLine += " && [flag] == ethereal";
						} else if (runeword.roll === Roll.NonEth) {
							pickitLine += " && [flag] != ethereal";
						}
						
						pickitLine += " # [sockets] == " + runeword.sockets;
						if (!!runeword.baseCondition) {
							pickitLine += " && " + runeword.baseCondition;
						}
						pickitLine += " # [maxquantity] == 1";
						
						if (HordeSettings.Debug.Verbose.crafting) {
							print("base pickit : " + pickitLine);
						}
						
						NTIP.PushLine(0, pickitLine, "horde/runewords/bases/"+ (merc ? "merc" : "character") +"/" + locationName + "/" + runewords[i]);
					}
				} else {
					if (HordeSettings.Debug.Verbose.crafting) {
						print("skip runeword " + runewords[i] + " (tier condition - runeword : " + runeword.tier + " ; equipped : " + currentItemTier);
					}
				}
			} else {
				if (HordeSettings.Debug.Verbose.crafting) {
					print("skip runeword " + runewords[i] + " (skip condition)");
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
		
		this.pushedRunewords = [];
		this.setupRunewordCategory(RunewordProfile.character, false);
		this.setupRunewordCategory(RunewordProfile.merc, true);
		
		if (RunewordProfile.runes.stock) {
			var requirements = {};
			for(var i = 0 ; i < this.pushedRunewords.length ; i += 1) {
				var runeword = this.pushedRunewords[i];
				for (var j = 0 ; j < runeword.length ; j += 1) {
					if (!requirements[runeword[j]]) {
						requirements[runeword[j]] = {rune: runeword[j], quantity: 1};
					} else {
						requirements[runeword[j]].quantity += 1;
					}
				}
			}
			
			var runes = Object.keys(requirements);
			for (var i = 0 ; i < runes.length ; i += 1) {
				var rune = requirements[runes[i]];
				var runeLine = "[name] == " + rune.rune + " # # [MaxQuantity] == " + (RunewordProfile.runes.stockAllRecipes ? rune.quantity : 1);
				if (HordeSettings.Debug.Verbose.crafting) {
					print("push rune " + runeLine);
				}
				NTIP.PushLine(0, runeLine, "horde/runewords/runes/rune_" + rune.rune);
			}
		}
	},
	
	setupPickits: function() {
		if (!!this.team.commonPickits) {
			print("setup common pickits");
			for(var i = 0 ; i < this.team.commonPickits.length ; i += 1) {
				var conditionResult = true, 
					commonPickit = this.team.commonPickits[i];
				
				if(!!commonPickit.condition && commonPickit.condition !== "") {
					conditionResult = eval(commonPickit.condition);
					print("evaluate " + commonPickit.pickit + " result = " + conditionResult);
				}
				
				if(conditionResult) {
					print("add common pickit " + commonPickit.pickit);
					Config.PickitFiles.push(commonPickit.pickit);
				}
			}
		}
	},
	
	setupTownConfig: function() {
		Config.Cubing = me.charlvl > 24;
		if (me.charlvl > 30)
		{
			Config.MiniShopBot = true;
			Config.CainID.Enable = false; // Identify items at Cain
			Config.CainID.MinGold = 20000; // Minimum gold (stash + character) to have in order to use Cain.
			Config.CainID.MinUnids = 2; // Minimum number of unid items in order to use Cain.
		}
	},
	
	setupGambling: function() {
		// Gambling config
		Config.Gamble = me.charlvl > 80;
		Config.GambleGoldStart = Config.Gamble ? 1500000 : 3000000;
		Config.GambleGoldStop = Config.Gamble ? 1000000 : 2900000;
	},
	
	setupOptions: function() {
		Config.LogExperience = HordeSettings.Log.Experience; // Print experience statistics in the manager.
		Config.LogKeys = HordeSettings.Log.Keys; // Log keys on item viewer
		Config.LogOrgans = HordeSettings.Log.Organs; // Log organs on item viewer
		Config.LogLowRunes = HordeSettings.Log.LowRunes; // Log low runes (El - Dol) on item viewer
		Config.LogMiddleRunes = HordeSettings.Log.MiddleRunes; // Log middle runes (Hel - Mal) on item viewer
		Config.LogHighRunes = HordeSettings.Log.HighRunes; // Log high runes (Ist - Zod) on item viewer
		Config.LogLowGems = HordeSettings.Log.LogLowGems; // Log low gems (chipped, flawed, normal) on item viewer
		Config.LogHighGems = HordeSettings.Log.LogHighGems; // Log high gems (flawless, perfect) on item viewer
	},
	
	setupConfig: function(teamName, oog) {
		print("setup config " + me.profile + "[" + teamName + "]");
		
		if (!isIncluded("horde/settings/teams/" + teamName + ".js")){
			if (!include("horde/settings/teams/" + teamName + ".js")){
				throw new Error("couldn't find " + teamName + ".js in libs/horde/settings/teams/");
			}
		}
		
		var isTeleportChar = false;
		this.leaderProfile = DataFile.getStats().hordeLeader;
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
					
				case "questdrop":
					HordeSystem.questDropProfile = profile;
					HordeSystem.followerProfiles.push(profile);
					break;
				
				case "uber":
					HordeSystem.uberProfile = profile;
					HordeSystem.followerProfiles.push(profile);
					break
					
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
			Config.PublicMode = (isTeleportChar) ? 1 : 2;
			if (isTeleportChar) {
				Scripts.UserAddon = true;
			}
			else {
				Scripts.Follower = true;
				Config.Leader = this.team.profiles[this.teleProfile].character;
			}
			
			Config.MinGameTime = this.team.minGameTime;
			Config.MaxGameTime = 0;
			
			if (!me.playertype) {//Don't remove chicken in hardcore
				Config.LifeChicken = 0;
				Config.TownCheck = 0;
			}
		}
		else {
			Scripts.Horde = true;
			
			//For now party leader is teleporter
			Config.PublicMode = (isTeleportChar) ? 1 : 2;
			
			Config.MinGameTime = this.team.minGameTime;
			Config.MaxGameTime = this.team.maxGameTime;
			
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
			TeamData.setupProfilesGearPickits();
			this.setupBuild(this.team.profiles[me.profile].build);
			this.setupPickits();
			this.setupGambling();
			this.setupTownConfig();
			this.setupOptions();
		}
		
		Sequencer.setupSequences(this.team.sequencesProfile);
		
		return true;
	},
	
	preRunSetup: function() {
		Misc.cursorCheck(); // handle any items that could be stuck on the cursor before doing anything else
		Town.reviveMerc();
		this.setupRunewords(this.team.profiles[me.profile].runewordsProfile);
		Runewords.init();
		Cubing.init();
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
		Communication.Synchro.cleanup();
	},
	
	toggleThreadsPause: function () {
		var i,	script,
			scripts = ["tools/townchicken.js", "tools/antihostile.js", "tools/party.js", "tools/rushthread.js", "tools/toolsthread.js"];

		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script) {
				if (script.running) {
					print("Pausing " + scripts[i]);
					script.pause();
				}
				else {
					print("Resuming " + scripts[i]);
					script.resume();
				}
			}
		}

		return true;
	},
	
	onToolThreadQuit: function() {
		//no more leader
		Role.isLeader = false;
		Communication.Synchro.cleanup();
		
		if (!this.team.instantQuitList) {
			var baseDelay = 250, minDelay;
			var midChicken = (Config.LifeChicken + 100) / 2;
			if (Config.LifeChicken > 0 && me.hp <= Math.floor(me.hpmax * Config.LifeChicken / 100)) {
				return;
			} else if (Config.LifeChicken > 0 && me.hp <= Math.floor(me.hpmax * midChicken / 100)) {
				Town.goToTown();
			} else {
				
				if (Role.backToTown(false)) {
					//We're safe in town, just wait to not leave all together
					baseDelay = 2000;
				}
			}
				
			minDelay = baseDelay+(baseDelay* (this.getTeamIndex(me.profile) + 1));
			delay(minDelay, minDelay + baseDelay/4 );
		}
	}
	
}
