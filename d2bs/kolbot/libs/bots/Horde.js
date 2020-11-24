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
		
		HordeSystem.preRunSetup();
		
		TeamData.save();
		
		Party.waitWholeTeamJoined();
		
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
		
		//update highest town
		Quest.goToHighestTown();
		Party.updateLowestAct();
		
		Sharing.shareGold();
		
		HordeTown.doChores();
		
		//Sharing sequence
		Sharing.announceSharingSequence();
		Waypoint.announceWaypoints();
		Waypoint.waitWaypointsAnnounced();
		
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
