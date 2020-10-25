/**
*	@filename	OverlayHelper.js
*	@author		Adpist
*	@desc		Helper for the horde overlay
*	@credits	Adpist, Noah
*/

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("AutoMule.js");
include("Gambling.js");
include("TorchSystem.js");
include("MuleLogger.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/CollMap.js");
include("common/Config.js");
include("common/Loader.js");
include("common/Misc.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Party.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");

function main() {
	include("json2.js");
	include("horde/includes.js");
	includeHorde();

	var obj, action,
		overlayThread = getScript("libs/horde/tools/overlaythread.js");

	HordeSystem.init();
	Config.init();
	Pickit.init();
	Storage.Init();
	addEventListener("scriptmsg", function (msg) {
		action = msg;
	});

	while (true) {
		/*if (getUIFlag(0x09)) {
			delay(100);

			if (overlayThread.running) {
				print("pause overlayThread");
				overlayThread.pause();
			}
		} else {
			if (!overlayThread.running) {
				print("resume overlayThread");
				overlayThread.resume();
			}
		}*/

		/*if (action) {
			try {
				obj = JSON.parse(action);

				if (obj) {
					switch (obj.type) {
					case "area":
						Pather.moveToExit(obj.dest, true);

						break;
					case "unit":
						Pather.moveToUnit(obj.dest, true);

						break;
					case "wp":
						Pather.getWP(me.area);

						break;
					}
				}
			} catch (e) {

			}

			action = false;
		}*/

		delay(100);
	}
}