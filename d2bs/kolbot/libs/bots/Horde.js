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

		scriptBroadcast("run prerun");
		
		Role.initRole();
		Party.init();
		Waypoint.init();
		
		TeamData.save();
		
		//Process previous game
		Pickit.pickItems();
		Town.doChores();
		Pickit.pickItems();
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Pickit.pickItems();
		
		Party.waitWholeTeamJoined();
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
		
		//IP rotation data feed
		if(Role.teleportingChar && !!me.gameserverip){
			var iprotation = Number(me.gameserverip.split(".")[3]);

			if (!!DataFile.getStats().QueueLength) {
				var QueueInfo = JSON.parse(DataFile.getStats().QueueLength);

				var realm = me.realm;
				if(realm === "USEast"){
					realm = "East";
				}
				if(realm === "USWest"){
					realm = "West";
				}
				say("/msg *ChannelDemon "+(me.ladder > 0? "Ladder" : "Non-Ladder")+" " + iprotation+"|"+realm+" "+(me.ladder > 0? "L" : "NL")+" Q:"+QueueInfo.QueueCount+" W:"+QueueInfo.QueueWait,2);

			} else {
				say("/w *channeldemon" + (me.ladder > 0? "Ladder" : "Non-Ladder") + iprotation, 2);
			}

		}
		
		//Wait synchro
		Party.initialSynchro();
		
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
	
	print("prepare horde");
	this.start();
	
	print("start horde");
	HordeSystem.boot();
	
	return true;
}
