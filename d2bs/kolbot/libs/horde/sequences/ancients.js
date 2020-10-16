/**
*	@filename	ancients.js
*	@author		Adpist
*	@desc		Complete anciens quest (no mf)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	@todo		see "WTF" : handle hardcore + properly backup and restore the settings 
*/

function ancients(mfRun) { // SiC-666 TODO: Rewrite this.

	if (mfRun){
		return true;
	}
	
	print("ancients");

	var i, j, altar, time;
	Town.doChores();
	Party.wholeTeamInGame();
	Pather.teleport = true;
	if (Role.teleportingChar) {
		Pather.useWaypoint(118, true);
		Pather.moveToExit(120, false);
		Pather.makePortal();
	}else{
		Town.goToTown(5);
		Town.move("portalspot");
		while(!Pather.usePortal(118, null)) {
			delay(10000);
		}
	}
	Precast.doPrecast(true);
	Pather.teleport = true;

	try{
		Pather.moveToExit(120, true);
	}catch(e) {
		print(e);
	}

	if (me.area !==120) {
		if (!me.inTown) {
			Town.goToTown();
		}
		Town.move("portalspot");
		delay(10000);
		while(!Pather.usePortal(118, null)) { //(118, !me.name) ??
			delay(1000);
		}
		try{
			Pather.moveToExit(120, true);
		}catch(e) {
			print(e);
		}
	}
	Pather.moveTo(10048, 12634, 5, Config.ClearType);
	Party.wholeTeamInGame();
	Buff.Bo();
	
	//WTF
	Config.LifeChicken = 0; // Exit game if life is less or equal to designated percent.
	Config.TownHP = 0; // Go to town if life is under designated percent.
	Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
	Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
	Config.TownMP = 0; // Go to town if mana is under designated percent.
	Config.TownCheck = false; // Go to town if out of potions
	Config.MercWatch = false; // Don't revive merc during battle.
	//WTF

	Pather.teleport = true;
	altar = getUnit(2, 546);
	for(time=0; time<80 ; time+=1) {
		if (Party.allPlayersInArea() || Communication.Questing.waitAncients === 1) {
			break;
		}
		delay(1000);
	}

	if (altar && Role.teleportingChar) {
		Pather.moveToUnit(altar);
		Communication.sendToList(HordeSystem.allTeamProfiles, "WaitMe");
		delay(500 + me.ping * 3);
		clickMap(0, 0, altar);
		delay(100 + me.ping * 2);
		me.cancel();
		while (!getUnit(1, 542)) {
			delay(250);
			me.cancel();
		}
	}
	while(true) {
		Attack.clear(60);
		delay(3000);
		me.cancel();
		sendPacket(1, 0x40); //fresh Quest state.
		if (me.getQuest(39,0))
		{
			break;
		}
		else if (Role.teleportingChar)
		{
			if (!getUnit(1, 540) && !getUnit(1, 541) && !getUnit(1, 542))
			{
				delay(1000);
				Party.waitForMembers();
				Pather.moveToUnit(altar);
				delay(500 + me.ping * 3);
				clickMap(0, 0, altar);
				delay(100 + me.ping * 2);
				me.cancel();
			}
		}
	}
	Travel.clearToExit(120, 128, true);
	if (Role.teleportingChar) {
		Travel.clearToExit(128, 129, false);
		Pather.getWP(129, false);
	}
	Town.goToTown();
	return true;
}