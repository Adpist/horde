/**
*	@filename	Sharing.js
*	@author		Adpist
*	@desc		Sharing stuff between party
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Sharing = {
	pickGoldRequest: 0,
	giveGoldRequest: 0,
	
	receiveGold: function () {
		var i, goldPile;

		Town.move("stash");

		if (me.getStat(14)) {
			Town.openStash();

			gold(me.getStat(14), 3); // Stash my Gold to make sure I have room to pick more up.

			delay(me.ping * 2 + 500);

			me.cancel();
		}

		for (i = 0; i < 20; i += 1) { // Wait up to 20 seconds for someone to drop Gold for me to pick up.
			goldPile = getUnit(4, 523, 3);

			delay(1000);

			if (goldPile) {
				Pickit.pickItem(goldPile);
			}

			if (me.getStat(14)) {
				Town.openStash();

				gold(me.getStat(14), 3); // Stash my Gold.

				delay(me.ping * 2 + 500);

				me.cancel();
			}
		}
	},

	giveGold: function () {
		var i, goldPile,
			dropAmmount = (me.gold - (Config.LowGold * 2)) / 2, // Keep some Gold for myself.
			maxDropAmmount = me.charlvl * 1e4; // The maximum ammount of Gold that can be dropped at once.

		Town.move("stash");

		Town.openStash();

		gold(me.getStat(14), 3); // Stash my Gold.

		delay(me.ping * 2 + 500);

		dropAmmount = dropAmmount > maxDropAmmount ? maxDropAmmount : dropAmmount; // If dropAmmount is greater than maxDropAmmount override it.

		dropAmmount = dropAmmount + me.getStat(14) > maxDropAmmount ? maxDropAmmount - me.getStat(14) : dropAmmount; // Handle residual Gold in Inventory screen (shouldn't ever be an issue, but let's be cautious).

		print("Dropping " + Math.round(dropAmmount) + " Gold.");

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

		while (me.getStat(14)) {
			gold(me.getStat(14)); // Drop Gold

			delay(me.ping * 2 + 500);
		}

		me.cancel();

		for (i = 0 ; i < 20 ; i += 1) { // Wait 20 seconds for someone to pick up the Gold I've dropped.
			delay(1000);

			goldPile = getUnit(4, 523, 3);

			if (!goldPile) {
				break;
			}

			if (i === 19 && goldPile) {
				Pickit.pickItem(goldPile);
			}
		}
	},
	
	ShareGold: function() {
		if (this.pickGoldRequest ===1) { //teamGold - pick
			this.receiveGold();
		}
		if (this.giveGoldRequest ===1) { //teamGold - give
			this.giveGold();
		}
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
		if (me.gold < Config.LowGold) { //teamGold - ask
			Communication.sendToList(HordeSystem.allTeamProfiles, "GimmeGold");
		}
	}
};