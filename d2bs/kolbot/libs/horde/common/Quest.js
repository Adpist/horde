/**
*	@filename	Quest.js
*	@author		Adpist
*	@desc		Quests management
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Quest = {
	initialTownArea: 0,
	
	getQuestItem: function (classid, chestid) { // Accepts classid only or a classid/chestid combination.
		var i, chest, item,
			tick = getTickCount();

		if (me.findItem(classid)) { // Don't open "chest" or try picking up item if we already have it.
			return true;
		}

		if (me.inTown) {
			return false;
		}

		if (arguments.length > 1) {
			chest = getUnit(2, chestid);

			if (chest) {
				Misc.openChest(chest);
			}
		}

		for (i = 0 ; i < 50 ; i += 1) { // Give the quest item plenty of time (up to two seconds) to drop because if it's not detected the function will end.
			item = getUnit(4, classid);

			if (item) {
				break;
			}

			delay(40);
		}

		while (!me.findItem(classid)) { // Try more than once in case someone beats me to it.
			item = getUnit(4, classid);

			if (item) {
				if (Storage.Inventory.CanFit(item)) {
					Pickit.pickItem(item);

					delay(me.ping * 2 + 500);
				} else {
					if (Pickit.canMakeRoom()) {
						print("Trying to make room for " + Pickit.itemColor(item) + item.name);

						Town.visitTown(); // Go to Town and do chores. Will throw an error if it fails to return from Town.
					} else {
						print("Not enough room for " + Pickit.itemColor(item) + item.name);

						return false;
					}
				}
			} else {
				return false;
			}
		}

		return true;
	},
	
	cubeStaff: function () {
		print("cubing staff");

		var amulet = me.getItem("vip"),
			staff = me.getItem("msf");

		if (!staff || !amulet) {
			return false;
		}
		Town.move("stash");
		if (!Town.openStash()) {
			Town.openStash();
		}
		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true; //(<3 kolton)
	},

	placeStaff: function () {
		print("place staff");

		var staff, item, orifice,
			tick = getTickCount(),
			preArea = me.area;

		Town.goToTown();
		Town.move("stash");
		HordeStorage.toInventory(91);// Get Staff
		Town.move("portalspot");
		if (!Pather.usePortal(preArea, me.name)) {
			throw new Error("placeStaff: Failed to take TP");
		}
		delay(1000);
		orifice = getUnit(2, 152);
		if (!orifice) {
			return false;
		}
		Misc.openChest(orifice);
		staff = me.getItem(91);
		if (!staff) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}
			return false;
		}

		staff.toCursor();
		submitItem();
		delay(750 + me.ping);

		/*/ unbug cursor
		item = me.findItem(-1, 0, 3);

		if (item && item.toCursor()) {
			while (getUnit(100)) {
				Storage.Inventory.MoveTo(item);

				delay(me.ping * 2 + 500);
			}
		}*/

		return true;
	},

	cubeFlail: function () {
		var eye = me.getItem(553),
			heart = me.getItem(554),
			brain = me.getItem(555),
			flail = me.getItem(173);

		print("cubing flail");

		if (me.getItem(174)) { // Already have the finished Flail.
			return true;
		}

		if (!eye || !heart || !brain || !flail) {
			print("cubeFlail failed: missing ingredient(s)");

			return false;
		}
		Town.move("stash");
		if (!Town.openStash()) {
			Town.openStash();
		}
		Storage.Cube.MoveTo(eye);
		Storage.Cube.MoveTo(heart);
		Storage.Cube.MoveTo(brain);
		Storage.Cube.MoveTo(flail);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true;
	},

	equipFlail: function () {
		var finishedFlail = me.getItem(174);

		if (finishedFlail) {
			if (!Item.equip(finishedFlail, 4)) {
				Pickit.pickItems();

				throw new Error("HordeSystem.equipFlail: Failed to equip Khalim's Will.");
			}
		} else {
			throw new Error("HordeSystem.equipFlail: Lost Khalim's Will before trying to equip it.");
		}

		if (me.itemoncursor) { // Seems like Item.equip() doesn't want to keep whatever the sorc has for a weapon, so lets put it into inventory without checking it against Pickit.
			var cursorItem = getUnit(100);

			if (cursorItem) {
				if (Storage.Inventory.CanFit(cursorItem)) {
					print("Keeping weapon by force.")

					Storage.Inventory.MoveTo(cursorItem);
				} else {
					me.cancel();
					print("No room to keep weapon by force.");

					cursorItem.drop();
				}
			}
		}

		delay(me.ping * 2 + 100);

		Pickit.pickItems(); // Will hopefully pick up the character's weapon if it was dropped.

		return true;
	},

	placeFlail: function () { // SiC-666 TODO: Rename this function to smashOrb, check orb.mode in the loop and stop when it has been smashed.
		var i,
			orb = getUnit(2, 404);

		print("Smashing the Compelling Orb.");

		if (!orb) {
			throw new Error("HordeSystem.placeFlail: Couldn't find Compelling Orb.")
		}

		Pather.moveToUnit(orb, 0, 0, Config.ClearType, false);

		for (i = 0; i < 5; i += 1) {
			if (orb) {
				Skill.cast(0, 0, orb);

				delay(500);
			}
		}

		return true;
	},
	
	checkAndUseConsumable: function(item) {
		
		if (item === undefined)
		{
			item = me.getItem(552) ? me.getItem(552) : me.getItem(646); // Book of Skill from Radament or Scroll of Resistance from Malah.
		}
		
		if (item) {
			if (!Town.openStash()) {
				Town.move("stash");
				Town.openStash();
			}

			clickItem(1, item);

			delay(me.ping > 0 ? me.ping : 50);

			me.cancel();
		}
	},
	
	initCurrentAct: function() {
		if (!me.getQuest(7, 0) && (me.getQuest(6, 0) || me.getQuest(6, 1))) {
			Travel.changeAct(2);
		}
		if (!me.getQuest(15, 0) && me.getQuest(7, 0)) { // if andy done, but not duriel		say(" Here ****** 2 ");
			Town.goToTown(2);
		}
		if (!me.getQuest(15, 0) && (me.getQuest(14, 0) || me.getQuest(14, 1) || me.getQuest(14, 3) || me.getQuest(14, 4))) {
			Travel.changeAct(3);	//getQuest, (14, 0) = completed (talked to meshif), (14, 3) = talked to tyrael, (14, 4) = talked to jerhyn (<3 Imba)
		}
		if (!me.getQuest(23, 0) && me.getQuest(15, 0)) { // if duriel done, but not meph
			Town.goToTown(3);
		}
		if (!me.getQuest(28, 0) && me.getQuest(23, 0) ) { // if meph done, but not diablo
			Town.goToTown(4);
		}
		if (!me.getQuest(28, 0) && (me.getQuest(26, 0) || me.getQuest(26, 1))) {
			Travel.changeAct(5);
		}
		if (me.getQuest(28, 0)) { // if diablo done
			Town.goToTown(5);
		}
		
		delay(1000);
		
		Town.move("waypoint");
		Pather.useWaypoint(null);

		Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5)); // Move off of waypoint so others can reach it.
		
		this.initialTownArea = me.area;
	}
};