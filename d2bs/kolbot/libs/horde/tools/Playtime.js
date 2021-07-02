/**
*	@filename	Playtime.js
*	@author		Adpist
*	@desc		Playtime recording
*	@credits	Adpist
*/

var Playtime = {
	lastTick: 0,
	updateFrequency: 60000,
	inGame: false,
	
	lastOOG: 0,
	lastIG: 0,
	
	formatTime: function(time) {
		var sec = time/1000;
		sec = Math.floor(sec);
		var s = sec % 60; 
		sec = (sec-s)/60;
		var m = sec % 60;
		var h = (sec-m)/60;
		if (h == 0) {
			if (m == 0) {
				return "" + this.padStart(m, 2, '0') + "m " + this.padStart(s, 2, '0') + "s";
			}
			return "" + this.padStart(m, 2, '0') + "m " + this.padStart(s, 2, '0') + "s";
		}
		
		return "" + h + "h " + this.padStart(m, 2, '0') + "m " + this.padStart(s, 2, '0') + "s";
	},
	
	init: function() {
		this.readPlaytime();
		this.lastTick = getTickCount();
		this.inGame = false;
	},
	
	padStart : function(number, min, character) {
		var str = "" + number, checked = 1;
		
		for (var i = 1 ; i < min ; i+= 1) {
			checked = checked * 10;
			if (number < checked) {
				str = character + str;
			}
		}
		return str;
	},
	
	getInGameTime: function() {
		var playtime = this.lastIG;
		if (this.inGame) {
			playtime += getTickCount() - this.lastTick;
		}
		return this.formatTime(playtime);
	},
	
	getOutOfGameTime: function() {
		var playtime = this.lastOOG;
		if (!this.inGame) {
			playtime += getTickCount() - this.lastTick;
		}
		return this.formatTime(playtime);
	},
	
	getTotalTime: function() {
		var playtime = this.lastIG + this.lastOOG + getTickCount() - this.lastTick;
		return this.formatTime(playtime);
	},
	
	track: function(inGame) {
		this.recordPlaytime(true);
		this.lastTick = getTickCount();
		this.inGame = inGame;
		scriptBroadcast("playtime " + (inGame ? "ingame" : "oog"));
	},
	
	onReceivePlaytime: function(playtimeString) {
		if (playtimeString === "ingame") {
			this.inGame = true;
		} else if (playtimeString === "oog") {
			this.inGame = false;
		} else {
			var json = JSON.parse(playtimeString);
			this.lastIG = json.ingame;
			this.lastOOG = json.oog;
		}
		this.lastTick = getTickCount();
	},
	
	recordPlaytime: function(force) {
		var newTick = getTickCount(), dt = newTick - this.lastTick, play = false;
		var oogPlaytime = 0, ingamePlaytime = 0;
		
		if (force === undefined) {
			force = false;
		}
		
		if (dt >= this.updateFrequency || force) {			
			if (this.inGame) {
				this.lastIG += dt;
			} else {
				this.lastOOG += dt;
			}
			
			this.lastTick = newTick;
			var jsonString = JSON.stringify({oog: this.lastOOG, ingame: this.lastIG});
			this.writePlaytime(jsonString);
			scriptBroadcast("playtime " + jsonString);
		}
	},
	
	writePlaytime: function(string) {
		try {
			FileTools.writeText("data/"+me.profile+"-playtime.json", string);
		} catch (e) {
			return false;
		}
		
		return true;
	},
	
	readPlaytime: function() {
		var tick = getTickCount();
		if (FileTools.exists("data/"+me.profile+"-playtime.json")) {
			var string, json;
			
			try {
				string = FileTools.readText("data/"+me.profile+"-playtime.json");
				json = JSON.parse(string);
			} catch(e) {
				this.lastIG = 0;
				this.lastOOG = 0;
				return false;
			}
			
			this.lastIG = json.ingame;
			this.lastOOG = json.oog;
		} else {
			this.lastIG = 0;
			this.lastOOG = 0;
		}
		
		return true;
	}
};