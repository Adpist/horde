/**
*	@filename	Town.js
*	@author		Adpist
*	@desc		Town functionnalities
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeTown = {
	needUpdateLowestAct: false,
	lastTownWpPosition: {x:0, y:0},
	goToTownWp: function() {
		if (!me.inTown) {
			Role.backToTown();
		}
		
		if (this.lastTownWpPosition.x !== me.x || this.lastTownWpPosition.y !== me.y) {
			if (me.act === 5) {
				Town.move("stash");
			}
			
			Town.move("waypoint");
			Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5)); // Move off of waypoint so others can reach it.
			delay(me.ping*2+50);
			this.lastTownWpPosition.x = me.x;
			this.lastTownWpPosition.y = me.y;
		}
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
	
	lightChores: function () {
		if (!me.inTown) {
			Role.backToTown();
		}
				
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Town.heal();
		Town.fillTome(518);

		if (Config.FieldID) {
			Town.fillTome(519);
		}

		Town.buyPotions();
		Town.buyKeys();
		
		if (me.gametype !== 0 ) {
			Town.reviveMerc();
		}
		
		this.goToTownWp();
		
		Party.waitSynchro("light_chores_done");
	},
	
	doChores: function (repair = false) {
		if (!me.inTown) {
			Role.backToTown();
		}

		var i,
			cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x19, 0x1a],
			startTick = getTickCount(), synchroStart;

		if (HordeSettings.Debug.Verbose.chores) {
			print("Start Town chores");
		}
		
		TeamData.save();
		var prepareTick = getTickCount();
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores prepare for sharing");
		}
		
		Attack.weaponSwitch(Attack.getPrimarySlot());

		if (Sharing.isGearSharingEnabled()) {
			this.doSharingChores(repair);
		} else {
			this.doNoSharingChores(repair);
		}
		
		if (Config.SortInventory) {
			Town.sortInventory();
		}
		
		if (me.gametype !== 0 ) {
			Role.mercCheck();
		}

		for (i = 0; i < cancelFlags.length; i += 1) {
			if (getUIFlag(cancelFlags[i])) {
				delay(500);
				me.cancel();

				break;
			}
		}

		me.cancel();
		
		Town.goToTown(Party.lowestAct);
		
		this.goToTownWp();
		
		if (HordeSettings.logChar) {
			MuleLogger.logChar();
		}
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores wait all done");
		}
		
		Party.waitSynchro("chores_done");
		
		if (HordeSettings.Debug.Verbose.chores) {
			if (Role.isLeader) {
				HordeDebug.logScriptInfo("TownChores", "town chores total time : " + (getTickCount() - startTick) + " ms");
			}
			
			print("Town chores done");
		}
		
		return true;
	},
	
	doSharingChores: function (repair = false) {
	
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores with sharing");
		}
		
		//Restaure status, id items & craft
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Town.heal();
		Town.identify(Sharing.isGearSharingEnabled());
		if (me.gametype !== 0 ) {
			Town.reviveMerc();
		}
		Cubing.doCubing();
		Runewords.makeRunewords();
		//this.clearStash();
		
		this.goToTownWp();
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores wait all prepared");
		}
		
		Party.waitSynchro("begin_gearing");
				
		if (HordeSettings.Debug.Verbose.chores) {
			
			if (Role.isLeader) {
				print("TownChores : prepare sharing time : " + (getTickCount() - prepareTick) + " ms");
			}
			
			print("Town chores gear sharing");
		}
		
		//Share gear & try auto equip
		var gearTick = getTickCount();
		Sharing.shareGear();
		Pickit.pickItems();
		Item.autoEquip();
		
		if (me.gametype !== 0 ) {
			Item.autoEquipMerc();
		}
		
		if (HordeSettings.Debug.Verbose.chores && Role.isLeader) {
			HordeDebug.logScriptInfo("TownChores", "gear sharing time : " + (getTickCount() - gearTick) + " ms");
		}
		
		//update highest town
		if (this.needUpdateLowestAct) {
			if (HordeSettings.Debug.Verbose.chores) {
				print("Town chores update lowest act");
			}
			var lowestActTick = getTickCount();
			
			Quest.goToHighestTown();
			Party.updateLowestAct();
			
			if (HordeSettings.Debug.Verbose.chores) {
				if (Role.isLeader) {
					print("TownChores : update lowest act : " + (getTickCount() - lowestActTick) + " ms");
				}
				print("Town chores wait all ready selling");
			}
			
			this.goToTownWp();
			
			this.needUpdateLowestAct = false;
		}
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores start selling");
		}
		
		//Sell Inventory
		Town.clearInventory(true);
		HordeStorage.removeUnwearableItems();
		HordeStorage.organize();
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores share gold");
		}
		
		//Share gold if needed
		Sharing.shareGold();
		
		this.goToTownWp();
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores Process shopping");
		}
		
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
	},
	
	doNoSharingChores: function (repair = false) {
	
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores no sharing");
		}
		
		//Restaure status, id items & craft
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Town.heal();
		Town.identify(Sharing.isGearSharingEnabled());
		Item.autoEquip();
		if (me.gametype !== 0 ) {
			Item.autoEquipMerc();
		}
		//Sell Inventory
		Town.clearInventory(true);
		HordeStorage.removeUnwearableItems();
		
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
		HordeStorage.organize();
		Town.clearScrolls();
		
		if (me.gametype !== 0 ) {
			Town.reviveMerc();
		}
		Cubing.doCubing();
		Runewords.makeRunewords();
		//this.clearStash();
		Item.autoEquip();
		if (me.gametype !== 0 ) {
			Item.autoEquipMerc();
		}
		//update highest town
		if (this.needUpdateLowestAct) {
			if (HordeSettings.Debug.Verbose.chores) {
				print("Town chores update lowest act");
			}
			var lowestActTick = getTickCount();
			
			Quest.goToHighestTown();
			Party.updateLowestAct();
			
			if (HordeSettings.Debug.Verbose.chores) {
				if (Role.isLeader) {
					print("TownChores : update lowest act : " + (getTickCount() - lowestActTick) + " ms");
				}
				print("Town chores wait all ready selling");
			}
			
			this.goToTownWp();
			
			this.needUpdateLowestAct = false;
		}
		
		if (HordeSettings.Debug.Verbose.chores) {
			print("Town chores share gold");
		}
		
		//Share gold if needed
		Sharing.shareGold();
		
		this.goToTownWp();
		
		//Go back to highest town & shop
		Quest.goToHighestTown();
	},
};