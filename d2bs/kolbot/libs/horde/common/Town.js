/**
*	@filename	Town.js
*	@author		Adpist
*	@desc		Town functionnalities
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeTown = {

	doChores: function (repair = false) {
		if (!me.inTown) {
			Role.backToTown();
		}

		var i,
			cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x19, 0x1a];

		Party.waitSynchro("begin_chores");
		Attack.weaponSwitch(Attack.getPrimarySlot());

		//Restaure status, id items & craft
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Town.heal();
		Town.identify(Sharing.isGearSharingEnabled());
		Town.reviveMerc();
		Cubing.doCubing();
		Runewords.makeRunewords();
		
		Party.waitSynchro("begin_gearing");
				
		//Share gear & try auto equip
		Sharing.shareGear();
		Pickit.pickItems();
		Item.autoEquip();
		Item.autoEquipMerc();
		
		//update highest town
		Quest.goToHighestTown();
		Party.updateLowestAct();
		
		Party.waitSynchro("begin_selling");
		
		//Sell Inventory
		Town.clearInventory(true);
		HordeStorage.removeUnwearableItems();
		HordeStorage.organize();
		
		//Share gold if needed
		Sharing.shareGold();
		
		Party.waitSynchro("begin_shopping");
		
		//Go back to highest town & shop
		Quest.goToHighestTown();
		Town.shopItems();
		Town.fillTome(518);

		if (Config.FieldID) {
			Town.fillTome(519);
		}

		Town.buyPotions();
		Town.buyKeys();
		Town.repair(repair);
		Town.gamble();//need to update this to check against other players pickits
		
		Town.stash(true);
		Town.clearScrolls();
		
		Role.mercCheck();

		for (i = 0; i < cancelFlags.length; i += 1) {
			if (getUIFlag(cancelFlags[i])) {
				delay(500);
				me.cancel();

				break;
			}
		}

		me.cancel();
		
		Town.goToTown(Party.lowestAct);
		
		if (me.act === 5) {
			Town.move("stash");
		}
		
		Town.move("waypoint");
		
		if (HordeSettings.logChar) {
			MuleLogger.logChar();
		}
		
		TeamData.save();
		
		Party.waitSynchro("chores_done");
		
		return true;
	},
};