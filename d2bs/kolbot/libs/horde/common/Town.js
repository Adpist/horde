/**
*	@filename	Town.js
*	@author		Adpist
*	@desc		Town functionnalities
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeTown = {

	goToTownWp: function() {
		if (!me.inTown) {
			Role.backToTown();
		}
		
		Town.move("waypoint");
		
		Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5)); // Move off of waypoint so others can reach it.
	},
	
	clearStash: function() {
		var item = me.getItem(-1, 0);
		
		do{
			if (item.location == 7) {
				var checkResult = NTIP.CheckItem(item, NTIP_CheckListNoTier, true);
				var result = (checkResult.result > 0 && checkResult.result < 4) || Cubing.keepItem(item) || Runewords.keepItem(item) || CraftingSystem.keepItem(item) || HordeStorage.questItems.indexOf(item.classid) !== -1;
				
				print("item check result : " + JSON.stringify(checkResult));
				print(item.name + " result " + result);
			}
		} while(item.getNext());
	},
	
	doChores: function (repair = false) {
		if (!me.inTown) {
			Role.backToTown();
		}

		var i,
			cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x19, 0x1a];

		TeamData.save();
		
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
		//this.clearStash();
		
		this.goToTownWp();
		Party.waitSynchro("begin_gearing");
				
		//Share gear & try auto equip
		Sharing.shareGear();
		Pickit.pickItems();
		Item.autoEquip();
		Item.autoEquipMerc();
		
		//update highest town
		Quest.goToHighestTown();
		Party.updateLowestAct();
		
		this.goToTownWp();
		Party.waitSynchro("begin_selling");
		
		//Sell Inventory
		Town.clearInventory(true);
		HordeStorage.removeUnwearableItems();
		HordeStorage.organize();
		
		//Share gold if needed
		Sharing.shareGold();
		
		this.goToTownWp();
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
		
		this.goToTownWp();
		
		if (HordeSettings.logChar) {
			MuleLogger.logChar();
		}
		
		Party.waitSynchro("chores_done");
		
		return true;
	},
};