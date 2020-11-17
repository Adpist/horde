/**
*	@filename	Buff.js
*	@author		Adpist
*	@desc		Buffing : Bo, Prebuff...
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Buff = {
	boing: 0,
	boed: 0,
	goBo: 0,
	toldBarb: false,
	readyToDrink: 0,
	
	giveBo: function () {
		var orgX, orgY;
		var usingWaypoint = true;
		var whereIwas = me.area;

		print("giving bo");

		var i;

		if (!Pather.accessToAct(2)) {
			usingWaypoint = false;
			Town.goToTown(1);

			while (me.area === 1) { // Be sure to enter Blood Moor.
				Pather.moveToExit(2, true, false);

				delay(me.ping * 2 + 250);

				Packet.flash(me.gid);

				delay(me.ping * 2 + 250);
			}
		} else {			
			getWaypoint(29) ? Pather.useWaypoint(107) : Pather.useWaypoint(35);			
		}

		var waypoint;

		if (usingWaypoint)
		{
			while (!waypoint) {
				waypoint = getUnit(2, "waypoint");

				delay(250);
			}
		}
		
		Party.waitForMembers();
		
		if (usingWaypoint)
		{
			while (getDistance(me, waypoint) < 5) { // Be sure to move off the waypoint.
				Pather.walkTo(me.x + rand(5, 15), me.y);

				delay(me.ping * 2 + 500);

				Packet.flash(me.gid);

				delay(me.ping * 2 + 500);
			}
		}

		Role.goToLeader();
		Precast.doPrecast(true);

		for (i=0 ; i<2 ; i+=1 ) {
			if (this.boed === (HordeSystem.teamSize - 1)) {
				break;
			}
			this.Bo();
			delay(me.ping * 2 + 500);
		}
		Communication.sendToList(HordeSystem.allTeamProfiles, "I'm bored -.-");

		if (!Pather.accessToAct(2)) {
			if (!Pather.moveToExit(1, true)) {
				Town.goToTown();
			}
			Town.move("waypoint");
		}else{
			Pather.useWaypoint(whereIwas);
		}

		return true;
	},

	beBo: function () {
		var orgX, orgY;
		var usingWaypoint = true;
		var whereIwas = me.area;
		
		print("being bo");

		if (!Pather.accessToAct(2)) {
			Town.goToTown(1);
			usingWaypoint = false;

			while (me.area === 1) { // Be sure to enter Blood Moor.
				Pather.moveToExit(2, true, false);

				delay(me.ping * 2 + 250);

				Packet.flash(me.gid);

				delay(me.ping * 2 + 250);
			}
		} else {
			getWaypoint(29) ? Pather.useWaypoint(107) : Pather.useWaypoint(35);	
			
		}
		
		var waypoint, coord;
		
		if (usingWaypoint)
		{
			while (!waypoint) {
				waypoint = getUnit(2, "waypoint");

				delay(250);
			}
		}
		
		Party.waitForMembers();

		if (usingWaypoint)
		{
			while (getDistance(me, waypoint) < 5) { // Be sure to move off the waypoint.
				
				coord = CollMap.getRandCoordinate(me.x, -5, 5, me.y, -5, 5);
				Pather.moveTo(coord.x, coord.y);
				//Pather.walkTo(me.x + rand(5, 15), me.y);

				delay(me.ping * 2 + 500);

				Packet.flash(me.gid);

				delay(me.ping * 2 + 500);
			}
		}
			
		var j = 0;

		while (this.goBo !== 1) {
			delay(250);

			if (!this.toldBarb && me.getState(32) && me.getState(26)) {
				Communication.sendToList(HordeSystem.allTeamProfiles, "I'm Boed!");

				this.toldBarb = true;
			}

			if (j % 20 == 0) { // Check for Team Members every 5 seconds.
				Party.wholeTeamInGame();
			}

			j += 1;
		}

		if (!Pather.accessToAct(2)) {
			if (!Pather.moveToExit(1, true)) {
				Town.goToTown();
			}

			Town.move("waypoint");
		} else {
			Pather.useWaypoint(whereIwas);
		}

		return true;
	},

	selfBo: function () { //Dark-f ->
		if (Role.boChar) {
			delay(500);
			if (me.getSkill(138))
				Skill.Cast(138, 0);
			if (me.getSkill(146))
				Skill.Cast(146, 0);
			if (me.getSkill(155))
				Skill.Cast(155, 0);
			if (me.getSkill(149))
				Skill.Cast(149, 0);
		}
		return true;
	},
	
	Bo: function () { //Dark-f ->
		Role.goToLeader();
		if (Role.boChar) {
			if (me.getSkill(138))
				Skill.Cast(138, 0);
			if (me.getSkill(146))
				Skill.Cast(146, 0);
			if (me.getSkill(155))
				Skill.Cast(155, 0);
			if (me.getSkill(149))
				Skill.Cast(149, 0);
		} else
			delay(me.ping * 2 + 1000);
		return true;
	},
	
	initialBo: function() {
		if (Buff.boing ===1 && !Role.boChar) { //being bo
			Buff.beBo();
		}
		if (Role.boChar && me.charlvl >= 24) { //giving bo
			Buff.giveBo();
		}
	},
	
	prebuffPoisonRes: function() { // Goes to Town, buys three Antidote potions from Akara, drinks them, and returns to Catacombs Level 4.
		var i, akara, potions;

		print("Buying Antidote Potions");

		Town.goToTown();

		Town.doChores();

		Town.move("akara");

		akara = getUnit(1, "akara");

		if (akara) {
			akara.startTrade();

			potions = akara.getItem(514);

			for (i = 0 ; i < 3 ; i += 1) {
				potions.buy();
			}

			me.cancel();
		}

		Town.move("portalspot");

		Party.waitSynchro("buff_poison", 30000);

		potions = me.findItems(514, -1, 3);

		if (potions.length) {
			for (i = 0 ; i < potions.length ; i += 1) {
				potions[i].interact();

				delay(me.ping * 2 + 500);
			}
		}
		if ( Role.teleportingChar && me.diff > 0) {
			return true;
		} else {
			Pather.usePortal(37, null);
		}

		return true;
	},
	
	raiseSkeletonArmy: function()
	{	
		if (!me.getQuest(1, 0)
			|| (me.diff === 0 /*&& TODO add AND mephisto not done*/)) {
			return;
		}
		
		var wasTeleporting = Pather.teleport;
		if (getWaypoint(1))
		{
			print("Raise skeleton army");
			
			Pather.useWaypoint(3);
			
			Party.waitForMembers(me.area, 2);
			
			Precast.doPrecast(true);
		
			delay(5000);
			
			Pather.teleport = false;
			
			Pather.moveToExit(2, true, true);
			
			Party.waitForMembers(me.area, 8);
			
			Travel.safeMoveToExit(8, true, true);
			
			Pather.teleport = wasTeleporting;
			
			Party.waitForMembers();
			
			Buff.selfBo();
			Precast.doPrecast(true);
		
			delay(5000);
			
			Town.goToTown();
		}
	}
};
