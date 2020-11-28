/**
*	@filename	Sharing.js
*	@author		Adpist
*	@desc		Sharing stuff between party
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Sharing = {	
	goldAnswers: [],
	
	onReceiveCommand: function(nick, msg) {
		/*if (HordeSettings.Debug.Verbose.sharing) {
			print("" + nick + " sent " + msg);
		}*/
		
		var args = msg.split(' ');
		if (args.length >= 2) {
			if (args[1] === "gold") {
				if (args.length === 3 ) {
					this.onReceiveGoldCommand(nick, args[2]);
				}
			} else if (args[1] === "gear") {
				if (args.length >= 3) {
					if (args[2] === "have") {
						if (args.length === 4) {
							this.onReceiveProfileGearCount(nick, parseInt(args[3]));
						}
					} else if (args[2] === "offer") {
						var tier = parseFloat(args[3]);
						var mercTier = parseFloat(args[4]);
						var lvlReq = parseInt(args[5]);
						var json = "";
						for (var i = 6; i < args.length ; i += 1) {
							if (i > 6) {
								json += " ";
							}
							json += args[i];
						}
						
						this.onReceiveGearOffer(nick, tier, mercTier, lvlReq, json);
					} else if (args[2] === "result") {
						this.onReceiveGearResult(nick, args);
					} else if (args[2] === "pick") {
						if (args.length === 3) {
							this.receiveItem(nick);
						} else if (args.length === 4 && args[3] == "done") {
							this.receivedPickDone = true;
						}
					}
				}
			}
		}
	},
	
	onReceiveGoldCommand: function(profile, arg) {
		var found = false;
		for (var i = 0 ; i < this.goldAnswers.length ; i += 1) {
			if (this.goldAnswers[i].profile === profile) {
				this.goldAnswers[i].cmd = arg;
				found = true;
			}
		}
		if (!found) {
			this.goldAnswers.push({profile: profile, cmd: arg});
		}
		
		if (profile === me.profile) {
			Communication.sendToList(HordeSystem.allTeamProfiles, "sharing gold " + arg);
		}
	},
	
	getProfileCommand: function(profile) {
		for (var i = 0 ; i < this.goldAnswers.length ; i += 1) {
			if (this.goldAnswers[i].profile === profile) {
				return this.goldAnswers[i].cmd;
			}
		}
		return "";
	},
	
	getProfilesForGoldCommand: function(cmd) {
		var profiles = [];
		for (var i = 0 ; i < this.goldAnswers.length ; i += 1) {
			if (this.goldAnswers[i].cmd === cmd) {
				profiles.push(this.goldAnswers[i].profile);
			}
		}
		return profiles;
	},	
	
	receiveGold: function () {
		var i, goldPile;

		if (me.getStat(14)) {
			Town.openStash();

			gold(me.getStat(14), 3); // Stash my Gold to make sure I have room to pick more up.

			delay(me.ping * 2 + 250);

			me.cancel();
		}

		goldPile = getUnit(4, 523, 3);

		if (goldPile) {
			Pickit.pickItem(goldPile);
		}
		
		delay(me.ping*2+250);

		if (Role.isMediumGold()) {
			this.onReceiveGoldCommand(me.profile, "good");
		}
	},

	giveGold: function () {
		var i, goldPile,
			dropAmmount = (me.gold - (Config.LowGold * 2)) / 2, // Keep some Gold for myself.
			maxDropAmmount = me.charlvl * 1e4; // The maximum ammount of Gold that can be dropped at once.

		Town.openStash();

		gold(me.getStat(14), 3); // Stash my Gold.

		delay(me.ping * 2 + 500);

		dropAmmount = dropAmmount > maxDropAmmount ? maxDropAmmount : dropAmmount; // If dropAmmount is greater than maxDropAmmount override it.

		dropAmmount = dropAmmount + me.getStat(14) > maxDropAmmount ? maxDropAmmount - me.getStat(14) : dropAmmount; // Handle residual Gold in Inventory screen (shouldn't ever be an issue, but let's be cautious).

		

		gold(Math.round(dropAmmount), 4); // Remove Gold from Stash (must be a round number).
/*
		for (i = 0 ; i < 50 ; i += 1) { // Wait up to two seconds. SiC-666 TODO: Does this not wait long enough and lead to C/I sometimes?
			delay(40);

			if (me.getStat(14)) { // Once Gold has moved to Inventory, exit loop.
				break;
			}
		}
*/
		delay(me.ping * 2 + 500);
		
		while (me.getStat(14) && this.getProfilesForGoldCommand("need").length > 0) {
			gold(me.getStat(14)); // Drop Gold

			delay(me.ping * 2 + 500);
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			HordeDebug.logScriptInfo("GoldSharing", me.profile + " dropped " + dropAmmount + " gold");
		}

		me.cancel();
		
		this.onReceiveGoldCommand(me.profile, "good");
	},
	
	shareGold: function() {
		if (HordeSystem.teamSize === 1) {
			return;
		}
		
		var need = Role.isLowGold(),
			offer = Role.isHighGold();
		
		this.goldAnswers = [];
		
		Party.waitSynchro("begin_gold");

		if (need) {
			if (HordeSettings.Debug.Verbose.sharing) {
				print(me.profile + " need gold");
			}
			this.onReceiveGoldCommand(me.profile, "need");
		} else if (offer) {
			this.onReceiveGoldCommand(me.profile, "offer");
		} else {
			this.onReceiveGoldCommand(me.profile, "good");
		}
		
		while(this.goldAnswers.length < HordeSystem.teamSize) {
			delay(me.ping+50);
			Party.wholeTeamInGame();
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			for (var i = 0 ; i < this.goldAnswers.length ; i += 1) {
				print("" + this.goldAnswers[i].profile + " " + this.goldAnswers[i].cmd + " gold");
			}
		}
		var notifiedStartSharing = false;
		if (this.getProfilesForGoldCommand("need").length > 0 && this.getProfilesForGoldCommand("offer").length > 0) {
			if (Role.isLeader && HordeSettings.Debug.Verbose.sharing && !notifiedStartSharing) {
				HordeDebug.logScriptInfo("GoldSharing", me.profile + " start share gold. need : " + this.getProfilesForGoldCommand("need").length + " ; offer : " + this.getProfilesForGoldCommand("offer").length);
				notifiedStartSharing = true;
			}
			Town.goToTown(Party.lowestAct);
			Town.move("stash");
			while(this.getProfilesForGoldCommand("need").length > 0 && this.getProfilesForGoldCommand("offer").length > 0) {
				if (this.getProfileCommand(me.profile) === "need") {
					this.receiveGold();				
				} else if (this.getProfileCommand(me.profile) === "offer") {
					this.giveGold();
				} else {
					delay(me.ping+50);
					Party.wholeTeamInGame();
				}
			}
		}
		
		var goldPile = getUnit(4, 523, 3);
		
		while(goldPile) {
			Pickit.pickItem(goldPile);
			delay(me.ping*2+250);
			goldPile = getUnit(4, 523, 3);
		}
		
		Party.waitSynchro("end_gold");
		
		Pickit.pickItems();
	},
	
	giveTP: function (nick) {
		print("giving TP");

		if (!this.nickList) {
			this.nickList = {};
		}
		if (!this.nickList[nick]) {
			this.nickList[nick] = {
				timer: 0
			};
		}

		if (getTickCount() - this.nickList[nick].timer < 60000) {
			Communication.sendToList(HordeSystem.allTeamProfiles, "I can only make one Tp per minute ):");
			return false;
		}
		Communication.sendToList(HordeSystem.allTeamProfiles, "Here you go :)");
		if (me.area !==120) {
			if (!Pather.makePortal()) {
				throw new Error("giveTP: Failed to make TP");
			}
			this.nickList[nick].timer = getTickCount();
		}
		return true;
	},
	
	announceSharingSequence: function() {
		if (Role.boChar && me.charlvl >= 24) { //announce bo
			Communication.sendToList(HordeSystem.allTeamProfiles, "bo");
		}
	},
	
	//Gear sharing
	gearAnswers: {},
	offeredGearAnswers: {},
	offerSelfResult: {},
	sharableGear: [],
	offeredGearHistory: [],
	fieldSharing: false,
	receivedPickDone: false,
	
	clearGearSharingData: function() {
		this.offeredGearAnswers = {};
		this.offerSelfResult = {};
		this.sharableGear = [];
		this.offeredGearHistory = [];
		this.fieldSharing = false;
		this.receivedPickDone = false;
	},
	
	onReceiveProfileGearCount: function(profile, gearCount) {
		if (!!this.gearAnswers[profile]) {
			this.gearAnswers[profile].count = gearCount;
			this.gearAnswers[profile].status =  gearCount > 0 ? "offer" : "done";
		} else {
			this.gearAnswers[profile] = {count: gearCount, status: gearCount > 0 ? "offer" : "done"};
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("Received " + profile + " gear sharing - status : " + this.gearAnswers[profile].status + " - Items : " + this.gearAnswers[profile].count);
		}
		
		if (profile === me.profile) {
			Communication.sendToList(HordeSystem.allTeamProfiles, "sharing gear have " + gearCount);
		}
	},
	
	onReceiveGearOffer: function(nick, tier, mercTier, lvlReq, json) {
		var sentItem = JSON.parse(json);
		var resultStr = "";
		
		if (Item.autoEquipCheckTier(sentItem, lvlReq, tier)) {
			resultStr += "1 tier " + tier;
		} else if (Item.autoEquipCheckMercTier(sentItem, lvlReq, mercTier)) {
			resultStr += "1 merctier " + mercTier;
		} else {
			resultStr += "0";
		}
		
		Communication.sendToProfile(nick, "sharing gear result " + resultStr);
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("sending gear result for " + sentItem.name + " to " + nick + " : " + resultStr);
		}
	},
	
	onReceiveGearResult: function(nick, args) {
		if (args.length === 6) {
			this.offeredGearAnswers[nick] = {result: parseInt(args[3]), type: args[4], tier: parseInt(args[5])};
		} else if (args.length === 4) {
			this.offeredGearAnswers[nick] = {result: parseInt(args[3])};
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("received gear result from " + nick + " : " + JSON.stringify(this.offeredGearAnswers[nick]));
		}
	},
	
	hasReceivedAllProfilesGear: function() {
		for (var i = 0 ; i < HordeSystem.allTeamProfiles.length ; i += 1) {
			if (!this.gearAnswers[HordeSystem.allTeamProfiles[i]]) {
				return false;
			}
		}
		
		return true;
	},
	
	getSharingProfile: function() {
		var lowestPrioProfile = false;
		var lowestPrio = 100;
		for (var i = 0 ; i < HordeSystem.allTeamProfiles.length ; i += 1) {
			var profile = HordeSystem.allTeamProfiles[i];
			if (this.gearAnswers[profile].status !== "done") {
				if (!!HordeSystem.team.profiles[profile].gearPriority) {
					if (lowestPrio > HordeSystem.team.profiles[profile].gearPriority) {
						lowestPrio = HordeSystem.team.profiles[profile].gearPriority;
						lowestPrioProfile = profile;
					}
				}
			}
		}
		return lowestPrioProfile;
	},
	
	getHigherPriorityProfiles: function() {
		var targetProfiles = [];
		var myPriority = HordeSystem.team.profiles[me.profile].gearPriority;
		
		for (var i = 0 ; i < HordeSystem.allTeamProfiles.length ; i += 1) {
			var profile = HordeSystem.allTeamProfiles[i];
			if (profile !== me.profile) {
				if (HordeSystem.team.profiles[profile].gearPriority < myPriority) {
					targetProfiles.push(profile);
				}
			}
		}
		return targetProfiles;
	},
	
	hasReceivedAllGearAnswers: function(profiles) {
		for (var i = 0 ; i < profiles.length ; i += 1) {
			var profile = profiles[i];
			if (profile !== me.profile) {
				if (!this.offeredGearAnswers[profile]) {
					return false;
				}
			}
		}
		
		return true;
	},
	
	getOfferWinner: function(profiles, myResult) {
		var winnerProfile = false;
		var highestPrio = 100000;
		var winnerResult = {};
		for (var i = 0 ; i < profiles.length ; i += 1) {
			var profile = profiles[i];
			if (profile !== me.profile && HordeSystem.team.profiles[profile].gearPriority < highestPrio) {
				var profileResult = this.offeredGearAnswers[profile];
				if (profileResult.result > 0) {
					var shouldKeep = false;
					if (profileResult.result === 1) {
						if (profileResult.type === "merctier" && myResult.result === 1 && !!myResult.tier) {
							shouldKeep = true;//he needs for merc & i need for char
						}						
					}
					if (!shouldKeep) {
						winnerProfile = profile;
						highestPrio = HordeSystem.team.profiles[profile].gearPriority;
					}
				}
			}
		}
		return winnerProfile;
	},
	
	offerItem: function(item, targetProfiles) {
		if (HordeSettings.Debug.Verbose.sharing) {
			print("offering " + item.name + " gid : " + item.gid);
		}
		
		for (var i = 0 ; i < targetProfiles.length ; i+=1) {
			var profile = targetProfiles[i];
			if (profile !== me.profile) {
				var tier = NTIP.GetTierEx(item, "Tier", TeamData.profilesGearPickits[profile].checkList);
				var mercTier = NTIP.GetTierEx(item, "MercTier", TeamData.profilesGearPickits[profile].checkList);
				
				if (HordeSettings.Debug.Verbose.sharing) {
					print("sending " + item.name + " to " + profile + " - tier : " + tier + " - merc tier : " + mercTier);
				}
				
				var convertedItem = JSON.parse(JSON.stringify(item));
				convertedItem.dexreq = item.dexreq;
				convertedItem.strreq = item.strreq;
				Communication.sendToProfile(targetProfiles[i], "sharing gear offer " + tier + " " + mercTier + " " + item.getStat(92) + " " + JSON.stringify(convertedItem));
			}
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("waiting all gear answers " + item.name + " gid : " + item.gid);
		}
		
		while(!this.hasReceivedAllGearAnswers(targetProfiles)) {
			delay(me.ping+50);
			Party.wholeTeamInGame();
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("received all gear answers " + item.name + " gid : " + item.gid);
		}
	},
		
	giveItem: function(profile, item) {
		if (HordeSettings.Debug.Verbose.sharing) {
			HordeDebug.logScriptInfo("GearSharing", "dropping " + item.name + " for " + profile);
		}
		Town.goToTown(Party.lowestAct);
		Town.move("stash");
		
		item.drop();
		
		this.receivedPickDone = false;
		
		Communication.sendToProfile(profile, "sharing gear pick");
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("wait receive pick done");
		}
		
		while(!this.receivedPickDone){
			delay(me.ping*2+250);
			Party.wholeTeamInGame();
		}
		
		this.receivedPickDone = false;
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("received pick done");
		}
	},
	
	receiveItem: function(profile) {
		if (HordeSettings.Debug.Verbose.sharing) {
			HordeDebug.logScriptInfo("GearSharing", "picking item from " + profile);
		}
		Town.goToTown(Party.lowestAct);
		Town.move("stash");
		
		Pickit.pickItems();
		delay(me.ping+50);
		Item.autoEquip();
		Item.autoEquipMerc();
		delay(me.ping+50);
		
		this.sharableGear = this.getGearToShare(this.fieldSharing);
		this.onReceiveProfileGearCount(me.profile, this.sharableGear.length);
		
		Communication.sendToProfile(profile, "sharing gear pick done");
	},
	
	isInOfferedGearHistory: function(item) {
		for (var i = 0 ; i < this.offeredGearHistory.length ; i += 1) {
			if (item.gid === this.offeredGearHistory[i].gid && item.classid === this.offeredGearHistory[i].classid) {
				return true;
			}
		}
		return false;
	},
	
	isGearSharingEnabled: function() {
		return eval(HordeSystem.team.enableGearSharing);
	},
	
	shareGear: function(fieldSharing) {
		if (HordeSystem.teamSize === 1 || !this.isGearSharingEnabled()) {
			return;
		}
		
		if (fieldSharing === undefined) {
			fieldSharing = false;
		}
		
		this.clearGearSharingData();
		this.fieldSharing = fieldSharing;
		
		Pickit.pickItems();
		
		Party.waitSynchro("begin_gear");
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("Begin gear sharing");
		}
		
		this.sharableGear = this.getGearToShare(fieldSharing);
		this.onReceiveProfileGearCount(me.profile, this.sharableGear.length);
		
		//wait all aswers
		while(!this.hasReceivedAllProfilesGear()) {
			delay(me.ping+50);
			Party.wholeTeamInGame();
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("Received all profiles gear offers");
		}
		
		var sharingProfile = this.getSharingProfile();
		if (sharingProfile) {
			do {
				if (sharingProfile === me.profile) {
					if (HordeSettings.Debug.Verbose.sharing) {
						print("Offering " + this.sharableGear.length + " items");
					}
					
					for (var i = 0 ; i < this.sharableGear.length ; i += 1) {
						var itemToShare = this.sharableGear[i];
						var checkResult = Pickit.checkItem(itemToShare);
						var targetProfiles = checkResult.result === 1 ? this.getHigherPriorityProfiles() : HordeSystem.allTeamProfiles;
						
						this.offeredGearAnswers = {};
						
						this.offerItem(itemToShare, targetProfiles);
						
						var winner = this.getOfferWinner(targetProfiles, checkResult);
						if (winner) {
							if (itemToShare.location === 7 ) {
								if (Storage.Inventory.CanFit(itemToShare)) {
									Storage.Inventory.MoveTo(itemToShare);
								}
							}
							
							this.giveItem(winner, itemToShare);
						} else {
							if (HordeSettings.Debug.Verbose.sharing) {
								print("nobody need " + itemToShare.name);
							}
						}

						Pickit.pickItems();
						
						this.offeredGearHistory.push({gid: itemToShare.gid, classid: itemToShare.classid});
					}
				
					delay(me.ping+50);
					Item.autoEquip();
					Item.autoEquipMerc();
					delay(me.ping+50);
					
					this.sharableGear = this.getGearToShare(fieldSharing);
					this.onReceiveProfileGearCount(me.profile, this.sharableGear.length);
					
					if (this.sharableGear.length == 0) {
						if (HordeSettings.Debug.Verbose.sharing) {
							print("Finished offering gear");
						}
						sharingProfile = this.getSharingProfile();
					} else if (HordeSettings.Debug.Verbose.sharing) {
						print("Still have " + this.sharableGear.length + " items to offer");
					}
				} else {
					if (HordeSettings.Debug.Verbose.sharing) {
						print("Waiting for " + sharingProfile + " to offer items");
					}
					
					while(this.gearAnswers[sharingProfile].status !== "done") {
						delay(me.ping + 50);
						Party.wholeTeamInGame();
					}
					
					sharingProfile = this.getSharingProfile();
				}
				
			} while(sharingProfile)
			
			if (HordeSettings.Debug.Verbose.sharing) {
				print("All offers processed");
			}
		} else {
			if (HordeSettings.Debug.Verbose.sharing) {
				print("No gear to share");
			}
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("Waiting all profiles to finish gear sharing");
		}
		
		Party.waitSynchro("end_gear");
		
		if (HordeSettings.Debug.Verbose.sharing) {
			print("End gear sharing");
		}
		
		this.clearGearSharingData();
		
		Pickit.pickItems();
	},
	
	getGearToShare: function(fieldSharing) {
		var sharableItems = [];
		var item = me.getItem();
		var firstItem = item;
		var locationsToCheck = fieldSharing ? [3] : [3,7];
		
		var itemTypesToShare = [
				2, //shields
				3, //armors
				10, //rings
				12, //amulets
				//13, //charms
				15, //Boots
				16, //Gloves
				19, //Belts
				24, //Scepters
				25, //Wands
				26, //Staffs
				27, //Bows
				28, //Axes
				29, //Clubs
				30, //Swords
				31, //Hammers
				32, //Knifes
				33, //Spears
				34, //Polearms
				35, //Crossbows
				36, //Maces
				37, //Helms
				42, //Throwing knives
				43, //Throwing axes
				44, //Javelins
				45, //Weapons
				46, //Melee weapons
				47, //Missile weapons
				48, //Thrown weapons
				49, //Combo weapons
				50, //Any armor
				51, //Any shield
				55, //Staves and rods
				59, //Class specific
				60, //Amazon
				61, //Barbarian
				62, //necromancer
				63, //paladin
				64, //Sorceress
				65, //assassin
				66, //druid
				68, //Orbs
				69, //Voodoo heads
				70, //Auric shields
				71, //Primal helms
				72, //pelt
				73, //Cloak
				75, //Circlets
				//82, //Small charm
				//83, //Medium charm
				//84, //large charm
				85, //Amazon bows
				86, //Amazon spears
				87, //Amazon javelins
				88	//Assassin claws
			];
	
		do {
			if (locationsToCheck.indexOf(item.location) !== -1) {
				if (itemTypesToShare.indexOf(item.itemType) !== -1) {
					if (!this.isInOfferedGearHistory(item) ) {
						var pickResult = Pickit.checkItem(item);
						if (pickResult.result === 0 || pickResult.result === 1) {
							if (HordeSettings.Debug.Verbose.sharing) {
								print("Can share " + item.name + " - result : " + pickResult.result + " - line : " + pickResult.line);
							}
							sharableItems.push(copyUnit(item));
						}
					}
				}
			}
		} while(item.getNext());
		
		return sharableItems;
	},
	
	
};