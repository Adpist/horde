/**
*	@filename	Storage.js
*	@author		Adpist
*	@desc		Inventory, stash...
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeStorage = {

	toInventory: function (itemClassId) {
		print("toInventory");

		var i,
		items = [],
		item = me.getItem(-1, 0);

		if (!Town.openStash()) {
			Town.openStash();
		}
		if (item) {
			do {
				if ( item.classid === itemClassId)	 {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}
		for (i = 0; i < items.length; i += 1) {
			if ( Storage.Inventory.CanFit(items[i])) {
				Storage.Inventory.MoveTo(items[i]);
			}
		}
		delay(1000);
		me.cancel();

		return true;
	},
	
	removeUnwearableItems: function () { // Remove items that can no longer be worn due to a change in Dexterity/Strength. Will try to place in Inventory to be checked against Pickit. Clearinventory sells to NPC if there is no Pickit match.
		var item = me.findItem(null, 1, 1); // Equipped item.

		if (item) {
			do {
				if (!Item.canEquip(item)) {
					print("Removing an item I can no longer wear: " + item.name + ".");

					if (Storage.Inventory.CanFit(item)) {
						while (!Storage.Inventory.MoveTo(item)) { // Try to move the item more than once.
							delay(me.ping * 2 + 100);
							Storage.Inventory.MoveTo(item);
							delay(1000);
							Storage.Stash.MoveTo(item);
							me.cancel(1);
							while(me.itemoncursor) {
								delay(1000);
								while(getUIFlag(0x19) || getUIFlag(0x01)) {
									delay(1000);
									me.cancel(1);
								}
								Packet.dropItem(item);  // Why not sell ? Where the Packet.dropItem ? Dark-f
								item.drop(); //Dark-f: from cubing.js
								delay(me.ping * 2 + 100);
							}
						}
						Pickit.pickItems();
					} else {
						while(me.itemoncursor) {
							delay(1000);
							while(getUIFlag(0x19) || getUIFlag(0x01)) {
								delay(1000);
								me.cancel(1);
							}
							Packet.dropItem(item);  // Why not sell ? Where the Packet.dropItem ? Dark-f
							item.drop(); //Dark-f: from cubing.js
							delay(me.ping * 2 + 100);
						}
						Pickit.pickItems();
					}
				}
			} while (item.getNext());
		}
	},
	
	stashQuestItems: function() {
		var item, questStuff = [91, 92, 173, 174, 521, 524, 525, 553, 554, 555]; // SiC-666 TODO: Check to make sure this includes all quest items that need to be moved to Stash. (Don't need Horadric Cube in this list?)
			
		for (var i = 0 ; i < questStuff.length ; i += 1) {
			item = me.getItem(questStuff[i]);

			if (item && item.location !==7 && item.location !== 6 && Storage.Stash.CanFit(item)) { // Have the item and it's not in Stash or Cube and it can fit in Stash.
				Storage.Stash.MoveTo(i); // SiC-666 TODO: Improve this by trying to move the item more than once?

				delay(me.ping * 2 + 500);
			}
		}
	}
	
};