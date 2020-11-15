/**
*	@filename	Sharing.js
*	@author		Adpist
*	@desc		Sharing stuff between party
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Sharing = {	
	goldAnswers: [],
	
	onReceiveCommand: function(nick, msg) {
		if (HordeSettings.Debug.Verbose.sharing) {
			print("" + nick + " sent " + msg);
		}
		
		var args = msg.split(' ');
		if (args.length === 3 ) {
			if (args[1] === "gold") {
				this.onReceiveGoldCommand(nick, args[2]);
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

			delay(me.ping * 2 + 500);

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
	
	ShareGold: function() {
		if (HordeSystem.teamSize === 1) {
			return;
		}
		
		var need = Role.isLowGold(),
			offer = Role.isHighGold();
		
		this.goldAnswers = [];
		
		Party.waitSynchro("begin_gold");

		if (need) {
			if (HordeSettings.Debug.Verbose.sharing) {
				HordeDebug.logScriptInfo("GoldSharing", me.profile + " need gold");
			}
			this.onReceiveGoldCommand(me.profile, "need");
		} else if (offer) {
			this.onReceiveGoldCommand(me.profile, "offer");
		} else {
			this.onReceiveGoldCommand(me.profile, "good");
		}
		
		while(this.goldAnswers.length < HordeSystem.teamSize) {
			delay(me.ping+50);
		}
		
		if (HordeSettings.Debug.Verbose.sharing) {
			for (var i = 0 ; i < this.goldAnswers.length ; i += 1) {
				print("" + this.goldAnswers[i].profile + " " + this.goldAnswers[i].cmd + " gold");
			}
		}
		
		if (this.getProfilesForGoldCommand("need").length > 0 && this.getProfilesForGoldCommand("offer").length > 0) {
			Town.goToTown(Party.lowestAct);
			Town.move("stash");
			while(this.getProfilesForGoldCommand("need").length > 0 && this.getProfilesForGoldCommand("offer").length > 0) {
				if (this.getProfileCommand(me.profile) === "need") {
					this.receiveGold();				
				} else if (this.getProfileCommand(me.profile) === "offer") {
					this.giveGold();
				} else {
					delay(me.ping+50);
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
	}
};