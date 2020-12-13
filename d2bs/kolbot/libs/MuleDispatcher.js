/**
*	@filename	MuleDispatcher.js
*	@author		kolton
*	@desc		Log items and perm configurable accounts/characters
*/

var MuleDispatcher = {
	LogAccounts: {
		/* Format:
			"account1/password1/realm": ["charname1", "charname2 etc"],
			"account2/password2/realm": ["charnameX", "charnameY etc"],
			"account3/password3/realm": ["all"]

			To log a full account, put "account/password/realm": ["all"]

			realm = useast, uswest, europe or asia

			Individual entries are separated with a comma.
		*/
	},

	LogGame: ["", ""], // ["gamename", "password"]
	LogNames: true, // Put account/character name on the picture
	LogItemLevel: true, // Add item level to the picture
	LogEquipped: false, // include equipped items
	LogMerc: false, // include items merc has equipped (if alive)
	SaveScreenShot: false, // Save pictures in jpg format (saved in 'Images' folder)
	IngameTime: rand(7230, 7290), // (180, 210) to avoid RD, increase it to (7230, 7290) for mule perming

	UseDispatch: true, // Use dispatch system or not
	TimeBetweenDispatchs: 180, //Time between mules to join game
	
	DispatchMules: [
	/*
		{
			name: "testmule1",
			realm:"europe",
			accountPrefix:"",
			accountPassword:"",
			charPrefix:"",
			charsPerAcc: 8,
			expansion:true,
			ladder:true,
			hardcore:false,
			createConfig:false,
			pickit:["Test1.nip"],
			profile:"MuleReceiver",//Put the profile using D2BotMuleDispatcher here
		},
		{
			name: "testmule2",
			realm:"europe",
			accountPrefix:"",
			accountPassword:"",
			charPrefix:"",
			charsPerAcc: 8,
			expansion:true,
			ladder:true,
			hardcore:false,
			createConfig:false,
			pickit:["Test2.nip"],
			profile:"MuleReceiver",//Put the profile using D2BotMuleDispatcher here
		},
	*/
	],
	
	// don't edit

	getMuleObject: function(dispatcherName){
		var i, currentDispatchMule;
		for (i = 0 ; i < this.DispatchMules.length ; ++i)
		{
			currentDispatchMule = this.DispatchMules[i];
			if (currentDispatchMule.name === dispatcherName)
			{
				return currentDispatchMule;
			}
		}
		
		return null;
	},
	
	getMuleFilename: function (dispatcherName) {
		var i, mule, jsonObj, jsonStr, file, currentDispatchMule;

		for (i = 0 ; i < this.DispatchMules.length ; ++i)
		{
			currentDispatchMule = this.DispatchMules[i];
			if (currentDispatchMule.name === dispatcherName)
			{
				file = "logs/DispatchMule." + currentDispatchMule.name + ".json";
				// If file exists check for valid info
				if (FileTools.exists(file)) {
					try {
						jsonStr = FileTools.readText(file);
						jsonObj = JSON.parse(jsonStr);

						// Return filename containing correct mule info
						if (currentDispatchMule.accountPrefix && jsonObj.account && jsonObj.account.match(currentDispatchMule.accountPrefix)) {
							return file;
						}
					} catch (e) {
						print(e);
					}
				} else {
					return file;
				}
			}
		}

		// File exists but doesn't contain valid info - remake
		FileTools.remove(file);

		return file;
	},
	
	getItemDesc: function (unit, logIlvl) {
		var i, desc, index,
			stringColor = "";

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		desc = unit.description.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
				desc.splice(i, 1);

				i -= 1;
			} else {
				// Add color info
				if (!desc[i].match(/^(y|ÿ)c/)) {
					desc[i] = stringColor + desc[i];
				}

				// Find and store new color info
				index = desc[i].lastIndexOf("ÿc");

				if (index > -1) {
					stringColor = desc[i].substring(index, index + "ÿ".length + 2);
				}
			}

			desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<:;.*])/g, "\\xffc$2").replace("ÿ", "\\xff", "g");
		}

		if (logIlvl && desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\\n");

		return desc;
	},
	
	pushPickit: function(dispatchInfo) {
		var i;
		
		//add mule pickits
		for (i = 0 ; i < dispatchInfo.pickit.length ; ++i)
		{
			Config.PickitFiles.push(dispatchInfo.pickit[i]);
		}
		
		NTIP.Clear();
		Pickit.init(true);
	},
	
	popPickit: function(dispatchInfo) {
		var i;
		
		//add mule pickits
		for (i = 0 ; i < dispatchInfo.pickit.length ; ++i)
		{
			Config.PickitFiles.splice(Config.PickitFiles.indexOf(dispatchInfo.pickit[i]), 1);
		}
		
		NTIP.Clear();
		Pickit.init(true);
	},
	
	// get a list of items to mule
	getDispatchMuleItems: function () {
		var item, items;

		item = me.getItem(-1, 0);
		items = [];
		
		//get matching items
		if (item) {
			do {
				if (Town.ignoredItemTypes.indexOf(item.itemType) === -1 && Pickit.checkItem(item).result > 0) {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}
		return items;
	},
	
	filterDispatchMule: function(dispatchInfo) {
		return me.realm.toLowerCase() === dispatchInfo.realm.toLowerCase()
			&& me.gametype === (dispatchInfo.expansion ? 1 : 0)
			&& (me.ladder > 0) === dispatchInfo.ladder
			&& me.playertype === dispatchInfo.hardcore;
	},
	
	getDispatchs: function() {
		var i = 0, currentDispatchMule,
			remainingDispatchs = [],
			itemsToDispatch = [];
		for (i = 0 ; i < this.DispatchMules.length ; ++i)
		{
			currentDispatchMule = this.DispatchMules[i];
			if (this.filterDispatchMule(currentDispatchMule))
			{
				this.pushPickit(currentDispatchMule);
				itemsToDispatch = this.getDispatchMuleItems(currentDispatchMule.pickit);
				this.popPickit(currentDispatchMule);
				
				if (itemsToDispatch.length > 0)
				{
					remainingDispatchs.push(currentDispatchMule);
				}
			}
		}
		return remainingDispatchs;
	},
	
	isDispatcherInGame: function(dispatchInfo) {
		var party = getParty();

		if (party) {
			do {
				if (party.name.match(dispatchInfo.charPrefix)) {
					return true;
				}
			} while (party.getNext());
		}

		return false;

	},
	
	dropItemsToDispatch: function (dispatchInfo) {
	
		if (!Town.openStash()) {
			return false;
		}

		var i,
			items = this.getDispatchMuleItems();

		if (!items || items.length === 0) {
			return false;
		}

		D2Bot.printToConsole("DispatchMule: Transfering " + items.length + " items to " + dispatchInfo.name, 7);

		for (i = 0; i < items.length; i += 1) {
			items[i].drop();
		}

		delay(1000);
		me.cancel();

		return true;
	},
	
	stashItems: function() {
		var i,
			items = me.findItems(-1, 0, 3);

		// stash large items first by sorting items by size in descending order
		items.sort(function(a, b) {return (b.sizex * b.sizey - a.sizex * a.sizey);});

		for (i = 0; i < items.length; i += 1) {
			Storage.Stash.MoveTo(items[i]);
		}

		return true;
	},
	
	// pick items from ground
	pickItems: function() {
		var i, items, canFit, item,
			rval = "fail",
			list = [];

		//delay(1000);

		for (i = 0; i < 100; i += 1) {
			items = me.findItems(-1, 0, 3);

			if (items) {
				break;
			}

			delay(100);
		}

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (items[i].mode === 0 && items[i].location === 3 && Town.ignoredItemTypes.indexOf(items[i].itemType) > -1  // drop trash (id/tp scroll primarily)
						&& (muleMode === 0 || items[i].classid !== 530)) { // don't drop ID scroll with torch/anni mules
					try {
						items[i].drop();
					} catch (dropError) {
						print("Failed to drop an item.");
					}
				}
			}
		}

		while (me.gameReady) {
			item = getUnit(4);

			if (item) {
				do {
					if (getDistance(me, item) < 20 && [3, 5].indexOf(item.mode) > -1 && Town.ignoredItemTypes.indexOf(item.itemType) === -1) { // don't pick up trash
						list.push(copyUnit(item));
					}
				} while (item.getNext());
			}

			// If and only if there is nothing left are we "done"
			if (list.length === 0) {
				rval = "done";

				break;
			}

			// pick large items first by sorting items by size in descending order and move gheed's charm to the end of the list
			list.sort(function(a, b) {
				if (a.classid === 605 && a.quality === 7 && !Pickit.canPick(a)) {
					return 1;
				}

				if (b.classid === 605 && b.quality === 7 && !Pickit.canPick(b)) {
					return -1;
				}

				return (b.sizex * b.sizey - a.sizex * a.sizey);
			});

			while (list.length > 0) {
				item = list.shift();
				canFit = Storage.Inventory.CanFit(item);

				if (!canFit) {
					this.stashItems();

					canFit = Storage.Inventory.CanFit(item);
				}

				if (canFit) {
					Pickit.pickItem(item);
				} else {
					rval = "next";
				}
			}

			if (rval === "next") {
				break;
			}

			delay(500);
		}

		return rval;
	},
	
	dispatch: function(dispatchInfo) {
		var i = 0, status = "muling",
		    tick, timeout = 150 * 1000; // Ingame mule timeout
		
		me.overhead("ÿc2dispatching to ÿc4" + dispatchInfo.name);
		
		function DropStatusEvent(mode, msg) {
			if (mode === 10) {
				switch (JSON.parse(msg).status) {
				case "report": // reply to status request
					sendCopyData(null, dispatchInfo.profile, 12, JSON.stringify({status: status}));

					break;
				case "quit": // quit command
					status = "quit";

					break;
				}
			}
		}
		
		addEventListener("copydata", DropStatusEvent);
		
		//Start mule profile
		D2Bot.start(dispatchInfo.profile);
		
		delay(5000);
		
		//Wait for mule dispatcher info request
		if(!sendCopyData(null, dispatchInfo.profile, 10, JSON.stringify({profile: me.profile, mode: 0, dispatcher: dispatchInfo.name})))
		{
			D2Bot.printToConsole("Failed to contact mule dispatcher profile " + dispatchInfo.profile, 9);
			return false;
		}
		
		delay(2000);
		
		D2Bot.joinMe(dispatchInfo.profile, me.gamename.toLowerCase(), "", me.gamepassword.toLowerCase(), "yes");
		
		delay(2000);
		
		//Wait for mule to join
		while (!this.isDispatcherInGame(dispatchInfo))
		{
			me.overhead("ÿc2Waiting dispatcher ÿc4Abort in :ÿc0" + (120-i) + " sec");
			delay(1000);
			i++;
			
			if (i > 120)
			{
				D2Bot.printToConsole("Mule dispatcher " + dispatchInfo.name + " didn't joined", 9);
				return false;
			}
		}
		
		delay(1000);
		
		//drop items
		this.pushPickit(dispatchInfo);
		this.dropItemsToDispatch(dispatchInfo);
		
		delay(1000);
		
		sendCopyData(null, dispatchInfo.profile, 11, "begin");		
		
		status = "done";
		
		delay(1000);
		
		sendCopyData(null, dispatchInfo.profile, 12, JSON.stringify({status: status}));
		
		tick = getTickCount();
		
		//wait for mule pick completion
		while (true) {
			if (status === "quit") {
				break;
			}
			me.overhead("ÿc2Waiting mule picking ÿc4Abort in :ÿc0 " + Math.floor((timeout - (getTickCount() - tick)) / 1000) + " sec");
			if (getTickCount() - tick > timeout) {
				D2Bot.printToConsole("Dispatcher Mule didn't rejoin. Picking up items.", 9);

				Misc.useItemLog = false; // Don't log items picked back up in town.

				this.pickItems();

				break;
			}

			delay(500);
		}
		
		D2Bot.stop(dispatchInfo.profile, true);
		
		delay(2000);
		
		removeEventListener("copydata", DropStatusEvent);
		
		this.popPickit(dispatchInfo);
		
		delay(1000);
		
		return true;
	},
	
	logGame: function(profilesToDispatch)
	{
		if (profilesToDispatch.length > 0)
		{
			var i, mulesStr = "[";
			
			for (i = 0; i < profilesToDispatch.length ; ++i)
			{
				mulesStr += profilesToDispatch[i].name;
				if (i < profilesToDispatch.length - 1)
				{
					mulesStr += " ; ";
				}
			}
			mulesStr += "]"
			D2Bot.printToConsole("MuleDispatcher: Dispatching on " + profilesToDispatch.length + " mules accounts " + mulesStr, 7);
		}
		else
		{
			D2Bot.printToConsole("MuleDispatcher: Logging items on " + me.account + " - " + me.name + ".", 7);
		}
	},
	
	inGameCheck: function () {
		var tick, nextDispatchTick,
			remainingDispatchs = [];

		if (getScript("D2BotMuleLogDispatcher.dbj") && this.LogGame[0] && me.gamename.match(this.LogGame[0], "i")) {
			print("ÿc4MuleDispatcherÿc0: Logging items on " + me.account + " - " + me.name + ".");
			MuleLogger.logChar();
			
			if (this.UseDispatch)
			{
				if (Town.goToTown(1)) 
				{
					Storage.Init();
					me.maxgametime = 0;
					remainingDispatchs = this.getDispatchs();
					nextDispatchTick = getTickCount() + this.TimeBetweenDispatchs * 1000;
				} 
			}
			this.logGame(remainingDispatchs);
			
			tick = getTickCount() + rand(1500, 1750) * 1000; // trigger anti-idle every ~30 minutes

			while ((getTickCount() - me.gamestarttime) < this.IngameTime * 1000 || remainingDispatchs.length > 0) {
			
				if (remainingDispatchs.length > 0)
				{
					me.overhead("ÿc2dispatch to ÿc4" + remainingDispatchs[0].name + "ÿc2 in :ÿc0 " + Math.floor((nextDispatchTick - getTickCount()) / 1000) + " sec");
				}
				else
				{
					me.overhead("ÿc2Log items done. ÿc4Stay in " + "ÿc4game more:ÿc0 " + Math.floor(this.IngameTime - (getTickCount() - me.gamestarttime) / 1000) + " sec");
				}	

				delay(1000);
				
				if (remainingDispatchs.length > 0)
				{
					if (getTickCount() > nextDispatchTick)
					{
						this.dispatch(remainingDispatchs[0]);
						remainingDispatchs.splice(0, 1);
						MuleLogger.logChar();
						if (remainingDispatchs.length > 0)
						{
							nextDispatchTick = getTickCount() + this.TimeBetweenDispatchs * 1000;
						}
					}
				}

				if ((getTickCount() - tick) > 0) {
					sendPacket(1, 0x40); // quest status refresh, working as anti-idle
					tick += rand(1500, 1750) * 1000;
				}
			}

			quit();

			return true;
		}

		return false;
	}
};