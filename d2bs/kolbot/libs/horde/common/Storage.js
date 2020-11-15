/**
*	@filename	Storage.js
*	@author		Adpist
*	@desc		Inventory, stash...
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeStorage = {

	organize: function() {
		var stash = 	[
							{item: me.getItem(549), x: 0, y: 0} //cube
						];
						
		var inventory = [
							{item: Role.getTpTome(), x: 0, y: 0} //tp tome
						];
						
		//keys if any
		var keys = me.findItems(543, 0, 3);
		for (var k = 0 ; k < keys.length ; k += 1) {
			if (k === 0 ) {
				inventory.push({item: keys[k], x: 0, y: 2});
			} else { //drop all key stacks after first
				keys[i].drop();
			}
		}
			
		this.organizeLocationItems(stash, 7);
		this.organizeLocationItems(inventory, 3);
	},
	
	organizeLocationItems: function(items, location) {
		for (var tries = 0 ; tries < 3 ; tries += 1) {
			var allDone = true;
			for (var i = 0 ; i < items.length ; i += 1) {
				if (!!items[i].item) {
					if (items[i].status === undefined || items[i].status !== "done") {
						switch (tries) {
							case 0: //First try : move from inventory to inventory
								if (!this.tryMoveItem(items[i].item, items[i].x, items[i].y, location)) {
									if (location === 3) {
										Storage.Stash.MoveTo(items[i].item);//Failed : moved to stash
									} else if (location === 7) {
										Storage.Inventory.MoveTo(items[i].item);
									}
									items[i].status = "moved";
								} else {
									items[i].status = "done";
								}
								break;
							case 1: //Second try : move from stash to inventory
								if (!this.tryMoveItem(items[i].item, items[i].x, items[i].y, location)) {
									items[i].status = "failed";
								} else {
									items[i].status = "done";
								}
								break;
							case 2: //Failed : move anywhere in inventory
								if (location === 3) {
									Storage.Inventory.MoveTo(items[i].item);
								} else if (location === 7) {
									Storage.Stash.MoveTo(items[i].item);
								}
								items[i].status = "done";
							break;
						}
					}
				} else { //We don't have this item yet
					items[i].status = "done";
				}
				
				allDone = allDone && items[i].status === "done";
			}
			
			if (allDone) {
				break;
			}
		}
	},
	
	tryMoveItem: function(item, x, y, location) {
		if (location === 3) {
			return this.tryMoveItemToInventory(item, x, y);
		} else if (location === 7) {
			return this.tryMoveItemToStash(item, x, y);
		}
		return false;
	},
	
	tryMoveItemToInventory: function(item, x, y) {
		if (item.x !== x || item.y !== y || item.location !== 3) {
			if (!Storage.Inventory.TryMoveToPosition(item, x, y)) {
				return false;
			}
		}
		
		return true;
	},
	
	tryMoveItemToStash: function(item, x, y) {
		Storage.Reload();
		
		if (item.x !== x || item.y !== y || item.location !== 7) {
			if (!Storage.Stash.TryMoveToPosition(item, x, y)) {
				return false;
			}
		}
		
		return true;
	},

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

			if (item && item.location !==7 && item.location !== 6) { // Have the item and it's not in Stash or Cube and it can fit in Stash.

				Storage.Stash.MoveTo(item); // SiC-666 TODO: Improve this by trying to move the item more than once?

				delay(me.ping * 2 + 500);
			}
		}
	}
	
};