/**
*	@filename	barbrescue.js
*	@author		Adpist
*	@desc		rescue barbarians in act 5
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function rescueBarbs(mfRun) { // SiC-666 TODO: Rewrite this.
	print("coming barbies");
	
	var i, k, qual, door, skill, completionTries,
		coords =[],
		barbSpots = [];

	Party.wholeTeamInGame();
	if (!me.getQuest(36,1) && Role.teleportingChar) {
		Pather.teleport = true;
		Pather.useWaypoint(111, false);
		Precast.doPrecast(true);
		barbSpots = getPresetUnits (me.area, 2, 473);

		if (!barbSpots) {
			return false;
		}
		for ( i = 0  ; i < barbSpots.length ; i += 1) {
			coords.push({
				x: barbSpots[i].roomx * 5 + barbSpots[i].x - 3, //Dark-f: x-3
				y: barbSpots[i].roomy * 5 + barbSpots[i].y
			});
		}
		Config.PacketCasting = 1;

		for ( k = 0  ; k < coords.length ; k += 1) {
			print("going to barbspot "+(k+1)+"/"+barbSpots.length);
			Pather.moveToUnit(coords[k], 2, 0);
			door = getUnit(1, 434);
			if (door) {
				Pather.moveToUnit(door, 1, 0);
				for (i = 0; i < 20 && door.hp; i += 1) {
					if (me.getSkill(45, 1))
						Skill.cast(45, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(55, 1))
						Skill.cast(55, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(47, 1))
						Skill.cast(47, 0, door.x, door.y);
					delay(50);
					if (me.getSkill(49, 1))
						Skill.cast(40, 0, door.x, door.y);
					delay(50);
				}
			}
			delay(1500 + 2 * me.ping); //barb going to town...
		}
		delay(1000);
		Town.goToTown();
	}
	Town.move("qual-kehk");
	delay(1000+me.ping);
	qual = getUnit(1, "qual-kehk");
	completionTries = 0;
	while(!me.getQuest(36,0)) {
		if (completionTries >= 30) {
			return false;
		}
		qual.openMenu();
		me.cancel();
		delay(500);
		sendPacket(1, 0x40); //fresh Quest state.
		if (me.getQuest(36,0))
			break;
			
		completionTries += 1;
	}

	return true;
}