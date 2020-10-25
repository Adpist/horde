/**
*	@filename	OverlayThread.js
*	@author		Adpist
*	@desc		Horde overlay system
*	@credits	Adpist, Noah
*/

var HordeHooks = {
	text: {
		hooks: [],
		enabled: true,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}
			
			if (!this.getHook("banner")) {
				this.add("banner");
			}
			
			if (!this.getHook("oogtime")) {
				this.add("oogtime");
			} else {
				this.getHook("oogtime").hook.text = "OOG : " + Playtime.getOutOfGameTime();
			}
			
			if (!this.getHook("ingametime")) {
				this.add("ingametime");
			} else {
				this.getHook("ingametime").hook.text = "IG : " + Playtime.getInGameTime();
			}
			
			if (!this.getHook("totaltime")) {
				this.add("totaltime");
			} else {
				this.getHook("totaltime").hook.text = "TOTAL : " + Playtime.getTotalTime();
			}

		},

		add: function (name) {
			switch (name) {
			case "banner":
				this.hooks.push({
					name: "banner",
					hook: new Text("D2GM::HORDE", 400, 15, 1/*color*/, 1/*font*/, 2/*align*/)
				});
				
				break;
			
			case "oogtime":
				this.hooks.push({
					name: "oogtime",
					hook: new Text("OOG : " + Playtime.getOutOfGameTime(), 10, 100, 0/*color*/, 1/*font*/, 0/*align*/)
				});
				
				break;

			case "ingametime":
				this.hooks.push({
					name: "ingametime",
					hook: new Text("IG : " + Playtime.getInGameTime(), 10, 116, 0/*color*/, 1/*font*/, 0/*align*/)
				});
				
				break;
				
			case "totaltime":
				this.hooks.push({
					name: "totaltime",
					hook: new Text("TOTAL : " + Playtime.getTotalTime(), 10, 132, 0/*color*/, 1/*font*/, 0/*align*/)
				});
				
				break;
			}
			
			
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].name === name) {
					return this.hooks[i];
				}
			}

			return false;
		},

		flush: function () {
			if (getUIFlag(0x0D)) {
				return;
			}

			while (this.hooks.length) {
				this.hooks.shift().hook.remove();
			}
		}
	},
	
	update: function () {
		/*while (!me.gameReady) {
			delay(100);
		}*/

		this.text.check();
	},

	flush: function () {
		this.text.flush();
		return true;
	}
	
};

function main() {
	include("json2.js");
	include("OOG.js");
	include("common/party.js");
	include("common/attack.js");
	include("common/pather.js");
	include("common/misc.js");
	include("common/Prototypes.js");
	include("horde/tools/Playtime.js");
	print("load overlay helper");
	//load("libs/horde/tools/overlayhelper.js");
	print("Horde Overlay Thread Loaded.");


	var i,
		hideFlags = [0x09, 0x0C, 0x0D, 0x01, 0x02, 0x0F, 0x18, 0x19, 0x1A, 0x21];

	//addEventListener("keyup", this.keyEvent);

	while (true) {

		//this.revealArea(me.area);

		//if (getUIFlag(0x0A)) {
			HordeHooks.update();
		//} else {
		//	HordeHooks.flush();
		//}

		delay(20);

		/*for (i = 0; i < hideFlags.length; i += 1) {
			if(me.gameReady) {
				while (getUIFlag(hideFlags[i])) {
					HordeHooks.flush();
					delay(100);
				}
			}
		}*/
	}
}