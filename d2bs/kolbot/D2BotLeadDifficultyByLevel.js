var StarterConfig = {
	MinGameTime: 120, // Minimum game length in seconds. If a game is ended too soon, the rest of the time is waited in the lobby
	PingQuitDelay: 30, // Time in seconds to wait in lobby after quitting due to high ping
	CreateGameDelay: 10, // Seconds to wait before creating a new game
	ResetCount: 999, // Reset game count back to 1 every X games.
	CharacterDifference: 99, // Character level difference. Set to false to disable character difference.
	ChatActionsDelay: 2, // Seconds to wait in lobby before entering a channel

	// ChannelConfig can override these options for individual profiles.
	JoinChannel: "", // Default channel. Can be an array of channels - ["channel 1", "channel 2"]
	FirstJoinMessage: "", // Default join message. Can be an array of messages
	AnnounceGames: false, // Default value
	AfterGameMessage: "", // Default message after a finished game. Can be an array of messages

	SwitchKeyDelay: 5, // Seconds to wait before switching a used/banned key or after realm down
	CrashDelay: 5, // Seconds to wait after a d2 window crash
	FTJDelay: 10, // Seconds to wait after failing to create a game
	RealmDownDelay: 3, // Minutes to wait after getting Realm Down message
	UnableToConnectDelay: 5, // Minutes to wait after Unable To Connect message
	CDKeyInUseDelay: 5, // Minutes to wait before connecting again if CD-Key is in use.
	ConnectingTimeout: 20, // Seconds to wait before cancelling the 'Connecting...' screen
	PleaseWaitTimeout: 10, // Seconds to wait before cancelling the 'Please Wait...' screen
	WaitInLineTimeout: 60, // Seconds to wait before cancelling the 'Waiting in Line...' screen
	GameDoesNotExistTimeout: 30, // Seconds to wait before cancelling the 'Game does not exist.' screen
  
  //Level cut offs for Dynamic Difficulty
  normalMaxLevel: 42,
  nmMaxLevel: 72
};

var ChannelConfig = {
	/* Override default values for JoinChannel, FirstJoinMessage, AnnounceGames and AfterGameMessage per profile
		It's possible to override any number of these options (you don't have to put all of them)

		**** DO NOT EDIT ANYTHING INSIDE THIS COMMENT BLOCK ***

		Format:

		"Profile Name": {
			JoinChannel: "channel name", -OR- ["channel 1", "channel 2"],
			FirstJoinMessage: "first message", -OR- ["join msg 1", "join msg 2"],
			AnnounceGames: true,
			AfterGameMessage: "message after a finished run" -OR- ["msg 1", msg 2"]
		}

		Multiple entries are separated by a comma

		Examples:

		"Profile 1": {
			JoinChannel: "my channel",
			FirstJoinMessage: ".login",
			AnnounceGames: true,
			AfterGameMessage: "follow my runs or die"
		},
		"Profile 2": {
			JoinChannel: ["channel 1", "channel 2"],
			FirstJoinMessage: [".login", "^login"],
			AfterGameMessage: ["follow my runs or die", "seriously, you'll die"]
		}
	*/

	// Add your lines here

};



// No touchy!
include("json2.js");
include("OOG.js");
include("automule.js");
include("gambling.js");
include("craftingsystem.js");
include("torchsystem.js");
include("common/misc.js");

if (!FileTools.exists("data/" + me.profile + ".json")) {
	DataFile.create();
}

var gameInfo, gameStart, ingame, chatActionsDone, pingQuit,
	handle, useChat, firstLogin, connectFail,
	gameCount = DataFile.getStats().runs + 1,
	loginRetry = 0,
	lastGameStatus = "ready",
	isUp = "no",
	chanInfo = {
		joinChannel: "",
		firstMsg: "",
		afterMsg: "",
		announce: false
	};

function sayMsg(string) {
	if (!useChat) {
		return;
	}

	say(string);
}

function ReceiveCopyData(mode, msg) {
	var obj;

	switch (msg) {
	case "Handle":
		handle = mode;

		break;
	}

	switch (mode) {
	case 2: // Game info
		print("Recieved Game Info");

		gameInfo = JSON.parse(msg);

		break;
	case 3: // Game request
		// Don't let others join mule/torch/key/gold drop game
		if (AutoMule.inGame || Gambling.inGame || TorchSystem.inGame || CraftingSystem.inGame) {
			break;
		}

		if (gameInfo) {
			obj = JSON.parse(msg);

			if (me.gameReady) {
				D2Bot.joinMe(obj.profile, me.gamename.toLowerCase(), "", me.gamepassword.toLowerCase(), isUp);
			} else {
				D2Bot.joinMe(obj.profile, gameInfo.gameName.toLowerCase(), gameCount, gameInfo.gamePass.toLowerCase(), isUp);
			}
		}

		break;
	case 4: // Heartbeat ping
		if (msg === "pingreq") {
			sendCopyData(null, me.windowtitle, 4, "pingrep");
		}

		break;
	case 0xf124: // Cached info retreival
		if (msg !== "null") {
			gameInfo.crashInfo = JSON.parse(msg);
		}

		break;
	}
}

function setNextGame() {
	var nextGame = gameInfo.gameName;

	if (StarterConfig.ResetCount && gameCount + 1 >= StarterConfig.ResetCount) {
		nextGame += 1;
	} else {
		nextGame += (gameCount + 1);
	}

	DataFile.updateStats("nextGame", nextGame);
}

function locationTimeout(time, location) {
	var endtime = getTickCount() + time;

	while (getLocation() === location && endtime > getTickCount()) {
		delay(500);
	}

	return (getLocation() !== location);
}

function updateCount() {
	D2Bot.updateCount();
	delay(1000);
	ControlAction.click(6, 264, 366, 272, 35);

	try {
		login(me.profile);
	} catch (e) {

	}

	delay(1000);
	ControlAction.click(6, 33, 572, 128, 35);
}

function ScriptMsgEvent(msg) {
	switch (msg) {
	case "mule":
		AutoMule.check = true;

		break;
	case "muleTorch":
		AutoMule.torchAnniCheck = 1;

		break;
	case "muleAnni":
		AutoMule.torchAnniCheck = 2;

		break;
	case "torch":
		TorchSystem.check = true;

		break;
	case "crafting":
		CraftingSystem.check = true;

		break;
	case "getMuleMode":
		if (AutoMule.torchAnniCheck === 2) {
			scriptBroadcast("2");
		} else if (AutoMule.torchAnniCheck === 1) {
			scriptBroadcast("1");
		} else if (AutoMule.check) {
			scriptBroadcast("0");
		}

		break;
	case "pingquit":
		pingQuit = true;

		break;
	}
}

function timer(tick) {
	if (!tick) {
		return "";
	}

	var min, sec;

	min = Math.floor((getTickCount() - tick) / 60000).toString();

	if (min <= 9) {
		min = "0" + min;
	}

	sec = (Math.floor((getTickCount() - tick) / 1000) % 60).toString();

	if (sec <= 9) {
		sec = "0" + sec;
	}

	return " (" + min + ":" + sec + ")";
}

function randomString(len, useNumbers = false) {
	var i, rval = "",
		letters = useNumbers ? "abcdefghijklmnopqrstuvwxyz0123456789" : "abcdefghijklmnopqrstuvwxyz";

	len = len ? len : rand(5, 14);

	for (i = 0; i < len; i += 1) {
		rval += letters[rand(0, letters.length - 1)];
	}

	return rval;
}

function main() {
	debugLog(me.profile);
	addEventListener('copydata', ReceiveCopyData);
	addEventListener('scriptmsg', ScriptMsgEvent);

	while (!handle) {
		delay(100);
	}

	DataFile.updateStats("handle", handle);
	delay(500);
	D2Bot.init();
	load("tools/heartbeat.js");

	while (!gameInfo) {
		D2Bot.requestGameInfo();
		delay(500);
	}

	if (gameInfo.error) {
		//D2Bot.retrieve();
		delay(200);

		if (!!DataFile.getStats().debugInfo) {
			gameInfo.crashInfo = DataFile.getStats().debugInfo;

			D2Bot.printToConsole("Crash Info: Script: " + JSON.parse(gameInfo.crashInfo).currScript + " Area: " + JSON.parse(gameInfo.crashInfo).area, 10);
		}

		/*if (gameInfo.crashInfo) {
			D2Bot.printToConsole("Crash Info: Script: " + gameInfo.crashInfo.currScript + " Area: " + gameInfo.crashInfo.area + (gameInfo.crashInfo.hasOwnProperty("lastAction") ? " " + gameInfo.crashInfo.lastAction : ""), 10);
		}*/

		ControlAction.timeoutDelay("Crash Delay", StarterConfig.CrashDelay * 1e3);
		D2Bot.updateRuns();
	}

	//D2Bot.store(JSON.stringify({currScript: "none", area: "out of game"}));
	DataFile.updateStats("debugInfo", JSON.stringify({currScript: "none", area: "out of game"}));

	while (true) {
		while (me.ingame) { // returns true before actually in game so we can't only use this check
			if (me.gameReady) { // returns false when switching acts so we can't use while
				isUp = "yes";

				if (!ingame) {
					gameStart = getTickCount();

					print("Updating Status");
					//D2Bot.updateStatus("Game: " + me.gamename);

					lastGameStatus = "ingame";
					ingame = true;

					DataFile.updateStats("runs", gameCount);
					DataFile.updateStats("ingameTick");
				}

				D2Bot.updateStatus("Game: " + me.gamename + timer(gameStart));
			}

			delay(1000);
		}

		isUp = "no";

		locationAction(getLocation());
		delay(1000);
	}
}

function locationAction(location) {
	var i, control, string, text;

MainSwitch:
	switch (location) {
	case 0:
		ControlAction.click();

		break;
	case 1:	// Lobby
		D2Bot.updateStatus("Lobby");

		me.blockKeys = false;
		loginRetry = 0;

		if (!firstLogin) {
			firstLogin = true;
		}

		if (lastGameStatus === "pending") {
			gameCount += 1;
		}

		if (StarterConfig.PingQuitDelay && pingQuit) {
			ControlAction.timeoutDelay("Ping Delay", StarterConfig.PingQuitDelay * 1e3);

			pingQuit = false;
		}

		if (StarterConfig.JoinChannel !== "" || (ChannelConfig[me.profile] && ChannelConfig[me.profile].JoinChannel !== "")) {
			ControlAction.click(6, 27, 480, 120, 20);

			break;
		}

		if (ingame || gameInfo.error) {
			if (!gameStart) {
				gameStart = DataFile.getStats().ingameTick;
			}

			if (getTickCount() - gameStart < StarterConfig.MinGameTime * 1e3) {
				ControlAction.timeoutDelay("Min game time wait", StarterConfig.MinGameTime * 1e3 + gameStart - getTickCount());
			}
		}

		if (ingame) {
			//D2Bot.store(JSON.stringify({currScript: "none", area: "out of game"}));

			if (AutoMule.outOfGameCheck() || TorchSystem.outOfGameCheck() || Gambling.outOfGameCheck() || CraftingSystem.outOfGameCheck()) {
				break;
			}

			print("updating runs");
			D2Bot.updateRuns();

			gameCount += 1;
			lastGameStatus = "ready";
			ingame = false;

			if (StarterConfig.ResetCount && gameCount >= StarterConfig.ResetCount) {
				gameCount = 1;

				DataFile.updateStats("runs", gameCount);
			}
		}

		if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
			break;
		}

		if (!locationTimeout(5000, location)) { // in case create button gets bugged
			if (!ControlAction.click(6, 652, 469, 120, 20)) { // Join
				break;
			}

			if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
				break;
			}
		}

		break;
	case 2: // Waiting In Line
		D2Bot.updateStatus("Waiting...");
		locationTimeout(StarterConfig.WaitInLineTimeout * 1e3, location);
		ControlAction.click(6, 433, 433, 96, 32);

		break;
	case 3: // Lobby Chat
		D2Bot.updateStatus("Lobby Chat");

		if (lastGameStatus === "pending") {
			gameCount += 1;
		}

		if (ingame || gameInfo.error) {
			if (!gameStart) {
				gameStart = DataFile.getStats().ingameTick;
			}

			if (getTickCount() - gameStart < StarterConfig.MinGameTime * 1e3) {
				ControlAction.timeoutDelay("Min game time wait", StarterConfig.MinGameTime * 1e3 + gameStart - getTickCount());
			}
		}

		if (ingame) {
			//D2Bot.store(JSON.stringify({currScript: "none", area: "out of game"}));

			if (AutoMule.outOfGameCheck() || TorchSystem.outOfGameCheck() || Gambling.outOfGameCheck() || CraftingSystem.outOfGameCheck()) {
				break;
			}

			print("updating runs");
			D2Bot.updateRuns();

			gameCount += 1;
			lastGameStatus = "ready";
			ingame = false;

			if (StarterConfig.ResetCount && gameCount >= StarterConfig.ResetCount) {
				gameCount = 1;

				DataFile.updateStats("runs", gameCount);
			}

			if (ChannelConfig[me.profile] && ChannelConfig[me.profile].hasOwnProperty("AfterGameMessage")) {
				chanInfo.afterMsg = ChannelConfig[me.profile].AfterGameMessage;
			} else {
				chanInfo.afterMsg = StarterConfig.AfterGameMessage;
			}

			if (chanInfo.afterMsg) {
				if (typeof chanInfo.afterMsg === "string") {
					chanInfo.afterMsg = [chanInfo.afterMsg];
				}

				for (i = 0; i < chanInfo.afterMsg.length; i += 1) {
					sayMsg(chanInfo.afterMsg[i]);
					delay(500);
				}
			}
		}

		if (!chatActionsDone) {
			chatActionsDone = true;

			if (ChannelConfig[me.profile] && ChannelConfig[me.profile].hasOwnProperty("JoinChannel")) {
				chanInfo.joinChannel = ChannelConfig[me.profile].JoinChannel;
			} else {
				chanInfo.joinChannel = StarterConfig.JoinChannel;
			}

			if (ChannelConfig[me.profile] && ChannelConfig[me.profile].hasOwnProperty("FirstJoinMessage")) {
				chanInfo.firstMsg = ChannelConfig[me.profile].FirstJoinMessage;
			} else {
				chanInfo.firstMsg = StarterConfig.FirstJoinMessage;
			}

			if (chanInfo.joinChannel) {
				if (typeof chanInfo.joinChannel === "string") {
					chanInfo.joinChannel = [chanInfo.joinChannel];
				}

				if (typeof chanInfo.firstMsg === "string") {
					chanInfo.firstMsg = [chanInfo.firstMsg];
				}

				for (i = 0; i < chanInfo.joinChannel.length; i += 1) {
					ControlAction.timeoutDelay("Chat delay", StarterConfig.ChatActionsDelay * 1e3);

					if (ControlAction.joinChannel(chanInfo.joinChannel[i])) {
						useChat = true;
					} else {
						print("ÿc1Unable to join channel, disabling chat messages.");

						useChat = false;
					}

					if (chanInfo.firstMsg[i] !== "") {
						sayMsg(chanInfo.firstMsg[i]);
						delay(500);
					}
				}
			}
		}

		// Announce game
		if (ChannelConfig[me.profile] && ChannelConfig[me.profile].hasOwnProperty("AnnounceGames")) {
			chanInfo.announce = ChannelConfig[me.profile].AnnounceGames;
		} else {
			chanInfo.announce = StarterConfig.AnnounceGames;
		}

		if (chanInfo.announce) {
			sayMsg("Next game is " + gameInfo.gameName + gameCount + (gameInfo.gamePass === "" ? "" : "//" + gameInfo.gamePass));
		}

		if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
			break;
		}

		if (!locationTimeout(5000, location)) { // in case create button gets bugged
			if (!ControlAction.click(6, 652, 469, 120, 20)) { // Join
				break;
			}

			if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
				break;
			}
		}

		break;
	case 4: // Create Game
		D2Bot.updateStatus("Creating Game");

		control = getControl(1, 657, 342, 27, 20);

		// Set character difference
		if (typeof StarterConfig.CharacterDifference === "number") {
			if (control.disabled === 4) {
				ControlAction.click(6, 431, 341, 15, 16);
			}

			ControlAction.setText(1, 657, 342, 27, 20, StarterConfig.CharacterDifference.toString());
		} else if (StarterConfig.CharacterDifference === false && control.disabled === 5) {
			ControlAction.click(6, 431, 341, 15, 16);
		}

		// Get game name if there is none
		while (!gameInfo.gameName) {
			D2Bot.requestGameInfo();
			delay(500);
		}

		// FTJ handler
		if (lastGameStatus === "pending") {
			isUp = "no";

			D2Bot.printToConsole("Failed to create game");
			ControlAction.timeoutDelay("FTJ delay", StarterConfig.FTJDelay * 1e3);
			D2Bot.updateRuns();
		}
    
    // Game create by leader's level
		// TODO create based on team's level
		var difff = gameInfo.difficulty;
		var mylevel = 0;
		if (!!DataFile.getStats().level) {
		  mylevel = DataFile.getStats().level;					
		}
		
		if(mylevel =< StarterConfig.normalMaxLevel){
			difff = "Normal";
		} else if(mylevel > StarterConfig.normalMaxLevel && mylevel =< StarterConfig.nmMaxLevel){
			difff = "Nightmare";
		} else if (mylevel >= StarterConfig.nmMaxLevel){
			difff = "Hell";
		} // If cannot get level, leave default difficulty

		print("Char Level: "+mylevel+", resolved difficulty "+difff);
		ControlAction.createGame((gameInfo.gameName === "?" ? randomString(null,true) : gameInfo.gameName + gameCount), (gameInfo.gamePass === "?" ? randomString(null,true) : gameInfo.gamePass), difff, StarterConfig.CreateGameDelay*1000);

		lastGameStatus = "pending";

		setNextGame();
		locationTimeout(10000, location);

		break;
	case 5: // Join Game
		break;
	case 6: // Ladder
		break;
	case 7: // Channel List
		break;
	case 8: // Main Menu
	case 9: // Login
	case 12: // Character Select
	case 18: // D2 Splash
		// Single Player screen fix
		if (getLocation() === 12 && !getControl(4, 626, 100, 151, 44)) {
			ControlAction.click(6, 33, 572, 128, 35);

			break;
		}

		if (firstLogin && getLocation() === 9) { // multiple realm botting fix in case of R/D or disconnect
			ControlAction.click(6, 33, 572, 128, 35);
		}

		D2Bot.updateStatus("Logging In");

		try {
			login(me.profile);
		} catch (e) {
			if (getLocation() === 12 && loginRetry < 2) {
				if (loginRetry === 0) {
					// start from beginning of the char list
					sendKey(0x24);
				}

				control = getControl(4, 237, 457, 72, 93); // char on 1st column, 4th row

				if (control) {
					me.blockMouse = true;
					me.blockKeys = true;

					control.click();
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);
					sendKey(0x28);

					me.blockMouse = false;
				}

				loginRetry++;
			} else {
				me.blockKeys = false;
				print(e + " " + getLocation());
			}
		}

		break;
	case 10: // Login Error
		string = "";
		text = ControlAction.getText(4, 199, 377, 402, 140);

		if (text) {
			for (i = 0; i < text.length; i += 1) {
				string += text[i];

				if (i !== text.length - 1) {
					string += " ";
				}
			}

			switch (string) {
			case getLocaleString(5207):
				D2Bot.updateStatus("Invalid Password");
				D2Bot.printToConsole("Invalid Password");

				break;
			case getLocaleString(5208):
				D2Bot.updateStatus("Invalid Account");
				D2Bot.printToConsole("Invalid Account");

				break;
			case getLocaleString(5202): // cd key intended for another product
			case getLocaleString(10915): // lod key intended for another product
				D2Bot.updateStatus("Invalid CDKey");
				D2Bot.printToConsole("Invalid CDKey: " + gameInfo.mpq, 6);
				D2Bot.CDKeyDisabled();

				if (gameInfo.switchKeys) {
					ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
					D2Bot.restart(true);
				} else {
					D2Bot.stop();
				}

				break;
			case getLocaleString(5199):
				D2Bot.updateStatus("Disabled CDKey");
				D2Bot.printToConsole("Disabled CDKey: " + gameInfo.mpq, 6);
				D2Bot.CDKeyDisabled();

				if (gameInfo.switchKeys) {
					ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
					D2Bot.restart(true);
				} else {
					D2Bot.stop();
				}

				break;
			case getLocaleString(10913):
				D2Bot.updateStatus("Disabled LoD CDKey");
				D2Bot.printToConsole("Disabled LoD CDKey: " + gameInfo.mpq, 6);
				D2Bot.CDKeyDisabled();

				if (gameInfo.switchKeys) {
					ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
					D2Bot.restart(true);
				} else {
					D2Bot.stop();
				}

				break;
			case getLocaleString(5347):
				D2Bot.updateStatus("Disconnected");
				D2Bot.printToConsole("Disconnected");
				ControlAction.click(6, 335, 412, 128, 35);

				break MainSwitch;
			default:
				D2Bot.updateStatus("Login Error");
				D2Bot.printToConsole("Login Error - " + string);

				if (gameInfo.switchKeys) {
					ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
					D2Bot.restart(true);
				} else {
					D2Bot.stop();
				}

				break;
			}
		}

		ControlAction.click(6, 335, 412, 128, 35);

		while (true) {
			delay(1000);
		}

		break;
	case 11: // Unable To Connect
		D2Bot.updateStatus("Unable To Connect");

		if (connectFail) {
			ControlAction.timeoutDelay("Unable to Connect", StarterConfig.UnableToConnectDelay * 6e4);

			connectFail = false;
		}

		if (!ControlAction.click(6, 335, 450, 128, 35)) {
			break;
		}

		connectFail = true;

		break;
	case 13: // Realm Down - Character Select screen
		D2Bot.updateStatus("Realm Down");
		delay(1000);

		if (!ControlAction.click(6, 33, 572, 128, 35)) {
			break;
		}

		updateCount();
		ControlAction.timeoutDelay("Realm Down", StarterConfig.RealmDownDelay * 6e4);
		D2Bot.CDKeyRD();

		if (gameInfo.switchKeys && !gameInfo.rdBlocker) {
			D2Bot.printToConsole("Realm Down - Changing CD-Key");
			ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
			D2Bot.restart(true);
		} else {
			D2Bot.printToConsole("Realm Down - Restart");
			D2Bot.restart();
		}

		break;
	case 14: // Character Select / Main Menu - Disconnected
		D2Bot.updateStatus("Disconnected");
		delay(500);
		ControlAction.click(6, 351, 337, 96, 32);

		break;
	case 16: // Character Select - Please Wait popup
		if (!locationTimeout(StarterConfig.PleaseWaitTimeout * 1e3, location)) {
			ControlAction.click(6, 351, 337, 96, 32);
		}

		break;
	case 17: // Lobby - Lost Connection - just click okay, since we're toast anyway
		delay(1000);
		ControlAction.click(6, 351, 337, 96, 32);

		break;
	case 19: // Login - Cdkey In Use
		D2Bot.printToConsole(gameInfo.mpq + " is in use by " + ControlAction.getText(4, 158, 310, 485, 40), 6);
		D2Bot.CDKeyInUse();

		if (gameInfo.switchKeys) {
			ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
			D2Bot.restart(true);
		} else {
			ControlAction.click(6, 335, 450, 128, 35);
			ControlAction.timeoutDelay("CD-Key in use", StarterConfig.CDKeyInUseDelay * 6e4);
		}

		break;
	case 20: // Single Player - Select Difficulty
		break;
	case 21: // Main Menu - Connecting
		if (!locationTimeout(StarterConfig.ConnectingTimeout * 1e3, location)) {
			ControlAction.click(6, 330, 416, 128, 35);
		}

		break;
	case 22: // Login - Invalid Cdkey (classic or xpac)
		text = ControlAction.getText(4, 162, 270, 477, 50);
		string = "";

		if (text) {
			for (i = 0; i < text.length; i += 1) {
				string += text[i];

				if (i !== text.length - 1) {
					string += " ";
				}
			}
		}

		switch (string) {
		case getLocaleString(10914):
			D2Bot.printToConsole(gameInfo.mpq + " LoD key in use by " + ControlAction.getText(4, 158, 310, 485, 40), 6);
			D2Bot.CDKeyInUse();

			if (gameInfo.switchKeys) {
				ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
				D2Bot.restart(true);
			} else {
				ControlAction.click(6, 335, 450, 128, 35);
				ControlAction.timeoutDelay("LoD key in use", StarterConfig.CDKeyInUseDelay * 6e4);
			}

			break;
		default:
			if (gameInfo.switchKeys) {
				D2Bot.printToConsole("Invalid CD-Key");
				ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
				D2Bot.restart(true);
			} else {
				ControlAction.click(6, 335, 450, 128, 35);
				ControlAction.timeoutDelay("Invalid CD-Key", StarterConfig.CDKeyInUseDelay * 6e4);
			}

			break;
		}

		break;
	case 23: // Character Select - Connecting
	case 42: // Empty character screen
		string = "";
		text = ControlAction.getText(4, 45, 318, 531, 140);

		if (text) {
			for (i = 0; i < text.length; i += 1) {
				string += text[i];

				if (i !== text.length - 1) {
					string += " ";
				}
			}

			if (string === getLocaleString(11161)) { // CDKey disabled from realm play
				D2Bot.updateStatus("Realm Disabled CDKey");
				D2Bot.printToConsole("Realm Disabled CDKey: " + gameInfo.mpq, 6);
				D2Bot.CDKeyDisabled();

				if (gameInfo.switchKeys) {
					ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
					D2Bot.restart(true);
				} else {
					D2Bot.stop();
				}
			}
		}

		if (!locationTimeout(StarterConfig.ConnectingTimeout * 1e3, location)) {
			ControlAction.click(6, 33, 572, 128, 35);

			if (gameInfo.rdBlocker) {
				D2Bot.restart();
			}
		}

		break;
	case 24: // Server Down - not much to do but wait..
		break;
	case 25: // Lobby - Please Wait
		if (!locationTimeout(StarterConfig.PleaseWaitTimeout * 1e3, location)) {
			ControlAction.click(6, 351, 337, 96, 32);
		}

		break;
	case 26: // Lobby - Game Name Exists
		ControlAction.click(6, 533, 469, 120, 20);

		gameCount += 1;
		lastGameStatus = "ready";

		break;
	case 27: // Gateway Select
		ControlAction.click(6, 436, 538, 96, 32);

		break;
	case 28: // Lobby - Game Does Not Exist
		D2Bot.printToConsole("Game doesn't exist");

		if (gameInfo.rdBlocker) {
			D2Bot.printToConsole(gameInfo.mpq + " is probably flagged.", 6);

			if (gameInfo.switchKeys) {
				ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
				D2Bot.restart(true);
			}
		} else {
			locationTimeout(StarterConfig.GameDoesNotExistTimeout * 1e3, location);
		}

		lastGameStatus = "ready";

		break;
	case 38: // Game is full
		// doesn't happen when making
		break;
	default:
		if (location !== undefined) {
			D2Bot.printToConsole("Unhandled location " + location);
			//takeScreenshot();
			delay(500);
			D2Bot.restart();
		}

		break;
	}
}
