/**
*	@filename	Horde.js
*	@author		Adpist
*	@desc		Questing, Leveling & Smurfing
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM, adpist
*/

if (!isIncluded("horde/includes.js")) { include("horde/includes.js"); };
includeHorde();

function Horde() {
	this.start = function () {
		var i;

		print("starting");
		scriptBroadcast("run prerun");
		
		Party.init();
		Waypoint.init();

		//Process previous game
		Town.doChores();
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Pickit.pickItems();
		
		//Setup current game
		Quest.initCurrentAct();
		HordeStorage.removeUnwearableItems();
		Pickit.pickItems();

		if (HordeSettings.logChar) {
			MuleLogger.logChar();
		}
		
		//Un-clog WP
		if (3 === me.act || 4 === me.act) {
			Town.move("portalspot");
		}
		
		//Wait synchro
		Party.waitTeamReady();
		
		//Sharing sequence
		Sharing.announceSharingSequence();
		Waypoint.announceWaypoints();
		Waypoint.waitWaypointsAnnounced();
		
		Sharing.ShareGold();
		Town.doChores();
		Role.mercCheck();
		Waypoint.shareWaypoints();
		Buff.initialBo();
		
		return true;
	};
	
	addEventListener("copydata", (id, data) => {
		Communication.receiveCopyData(id, data);
	});
	
	Role.initRole();
	Party.waitWholeTeamJoined();
	Pickit.pickItems();
	
	this.start();
	
	print("boot horde");
	HordeSystem.boot();
	
	return true;
}
