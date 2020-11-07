/**
*	@filename	baal.js
*	@author		Adpist
*	@desc		baalrun
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function baal_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("baal",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}

	if (!me.getQuest(28, 0)) {
		if (!mfRun)
			HordeDebug.logUserError("baal",  "diablo is not dead");
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : diablo isn't done
	}

	if (mfRun && !me.getQuest(40, 0)) {
		return Sequencer.skip;//Skip : Mf and quest isn't completed
	}

	if (!mfRun && me.getQuest(40,0)) {
		return Sequencer.skip;//skip, quest is done
	}
	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function baal(mfRun) { // SiC-666 TODO: Rewrite this.

	if (Role.teleportingChar && !getWaypoint(38)) {
		Pather.getWP(129, false);
	}

//(<3 YGM)
	Party.wholeTeamInGame();
	var portal, tick, baalfail, questTry, time, l, merc,
	quest = false;
	Town.goToTown(5);
	Town.doChores();
	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 1: // Sorceress
			switch (Config.AttackSkill[1]) {
			case 49:  // Lightening
			case 53:  // Chain Lightening
			case 56:  // Meteor
			case 59:  // Blizzard
			case 64:  // Frozen Orb
				if (me.getState(121)) {
					while (me.getState(121)) {
						delay(100);
					}
				} else {
					return Skill.cast(Config.AttackSkill[1], 0, 15090 + rand(-5, 5), 5026);
				}

				break;
			}

			break;
		case 3: // Paladin
			if (Config.AttackSkill[3] === 112) { // 112	Blessed Hammer
				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				return Skill.cast(Config.AttackSkill[3], 1);
			}

			break;
		case 5: // Druid
			if (Config.AttackSkill[3] === 245) {
				return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
			}

			break;
		case 6: // Assassin
			if (Config.UseTraps) {
				check = ClassAttack.checkTraps({x: 15094, y: 5028});

				if (check) {
					return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
				}
			}

			if (Config.AttackSkill[3] === 256) { // shock-web
				return Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
			}

			break;
		}

		return false;
	};

	this.checkThrone = function () {
		var monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster) && monster.x >= 15072 && monster.x <= 15118 && monster.y < 5080) {
					switch (monster.classid) {
					case 23:
					case 62:
						return 1;
					case 105:
					case 381:
						return 2;
					case 557:
						return 3;
					case 558:
						return 4;
					case 571:
						return 5;
					default:
						Attack.getIntoPosition(monster, 10, 0x4);
						Attack.clear(15);

						return false;
					}
				}
			} while (monster.getNext());
		}

		return false;
	};

	this.clearThrone = function () {
		var i, monster,
			monList = [],
			pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

		//avoid dolls
			monster = getUnit(1, 691);

			if (monster) {
				do {
					if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
						monList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			if (monList.length) {
				Attack.clearList(monList);
			}


		for (i = 0; i < pos.length; i += 2) {
			Pather.moveTo(pos[i], pos[i + 1]);
			Attack.clear(25);
		}
	};

	this.checkHydra = function () {
		var monster = getUnit(1, "hydra");
		if (monster) {
			do {
				if (monster.mode !== 12 && monster.getStat(172) !== 2) {
					if (me.classid === 1) { // I'm a sorceress, dodge Hydras if
						Pather.moveTo(15072, 5002);
					} else {
						Pather.moveTo(15118, 5002);
					}
					while (monster.mode !== 12) {
						delay(500);
						if (!copyUnit(monster).x) {
							break;
						}
					}

					break;
				}
			} while (monster.getNext());
		}

		return true;
	};

	for(questTry = 0 ; questTry < 10 ; questTry +=1) {
		if (me.getQuest(40,0)) {
			quest = true;
			break;
		}
		delay(100);
	}
	Pather.teleport = true;
	if (Role.teleportingChar) {
		try{
			Pather.useWaypoint(129);
		}catch(e) {
			print(e);
			Town.goToTown();
			for(baalfail = 0; baalfail < 10; baalfail =+1) {
				if (!Pather.usePortal(131, null)) {
					delay(1000);
				}
				if (!Pather.usePortal(129, null)) {
					delay(1000);
				}
				if (me.area === 131) {
					Pather.moveToExit([130, 129], true);
					Waypoint.clickWP();
					break;
				}
				if (me.area === 129) {
					Waypoint.clickWP();
					break;
				}
				delay(10000);
				if (baalfail === 8) {
					HordeDebug.logScriptError("baal", "I'm broken :/");
				}
			}

		}
		if (!Party.hasReachedLevel(28)) {
			Role.makeTeamJoinPortal();
		}
	}else{
		Town.goToTown(5);
		Town.move("portalspot");
		if (Party.hasReachedLevel(28)) {
			while(!Pather.usePortal(131, null)) {
				delay(500);
			}
		}else{
			while(!Pather.usePortal(129, null)) {
				delay(500);
			}
		}
	}

	//teleporting
	if (Role.teleportingChar && Party.hasReachedLevel(28)) {
		Pather.moveToExit([130, 131], true);
		//Pather.moveTo(15121, 5237);
		Pather.moveTo(15095, 5029);
		Pather.moveTo(15118, 5002);
		Pather.makePortal();
	}

	//walking
	if (!Party.hasReachedLevel(28)) {
		Pather.teleport = false;
		Precast.doPrecast(true);
		try{
			Pather.moveToExit(130, true, Config.ClearType);
			if (me.area !== 130) {
				Pather.teleport = true;
				Pather.moveToExit(130, true);
				Pather.teleport = false;
			}
			Pather.moveToExit(131, true, Config.ClearType);
			if (me.area !== 131) {
				Pather.teleport = true;
				Pather.moveToExit(131, true);
				Pather.teleport = false;
			}
		}catch(e) {
				if (Role.teleportingChar) {
					Pather.teleport = true;
					Town.goToTown();
					Pather.useWaypoint(129);
					Precast.doPrecast(true);
					Pather.moveToExit([130, 131], true);
					Pather.teleport = false;
				}else{
					Town.goToTown();
					Town.move("portalspot");
					while(!Pather.usePortal(131, null)) {
						delay(1000);
					}
				}
		}
		Pather.moveTo(15095, 5029, 5, Config.ClearType);
	}
	var ogFindItem = Config.FindItem;
	if (me.classid === 4) {
		Config.FindItem = true;
	}
	Pather.teleport = true;
	Attack.clear(15);
	this.clearThrone();
	tick = getTickCount();
	Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038, 5, Config.ClearType);
	Precast.doPrecast(true);

	if(HordeSystem.team.walkThroneRoomNorm && me.diff === 0) {
		Pather.teleport = false;
	}
BaalLoop:
	while (true) {
	//	if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
	//		Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
	//	}
		if (me.classid === 3 || me.classid === 4) {
			Pather.moveTo(15094, 5029);
			Buff.Bo();
		} else if (me.classid === 1) {
			Pather.moveTo(15094, 5038);
		}

		if (!getUnit(1, 543)) {
			break BaalLoop;
		}
		switch (this.checkThrone()) {
		case 1:
			Attack.clear(40);

			tick = getTickCount();

			Precast.doPrecast(true);

			break;
		case 2:
			Attack.clear(40);

			tick = getTickCount();

			break;
		case 3:
			Attack.clear(40);

			this.checkHydra();

			tick = getTickCount();

			break;
		case 4:

			Attack.clear(40);

			tick = getTickCount();

			break;
		case 5:
			Attack.clear(40);
			break BaalLoop;
		default:
			if (getTickCount() - tick < 7e3) {
				if (me.getState(2)) {
					Skill.setSkill(109, 0);
				}

				break;
			}

			if (!this.preattack()) {
				delay(100);
			}

			break;
		}

		delay(10);
	}

	if (me.classid === 1) {
		Pather.teleport = true;
	}
	if (me.classid === 4) {
		Config.FindItem = ogFindItem;
	}
	sendPacket(1, 0x40);
	delay(me.ping*2 + 250);

	if(!HordeSystem.shouldKillBaal()) {
		print("don't kill baal");
		return Sequencer.done;
	}

	Party.wholeTeamInGame();
	for(questTry = 0 ; questTry < 10 ; questTry +=1) {
		if (me.getQuest(40,0)) {
			quest = true;
			break;
		}
		delay(100);
	}

	if (!quest) {
		Config.QuitList = [];
	}
	Pather.moveTo(15090, 5008); //, 5, Config.ClearType);
	delay(5000);
	Precast.doPrecast(true);
	Buff.Bo();
	while (getUnit(1, 543)) {
		delay(500);
	}
	portal = getUnit(2, 563);
	if (portal) {
		Pather.usePortal(null, null, portal);
	} else {
		throw new Error("Baal: Couldn't find portal.");
	}
	for(time=0; time<200 ; time+=1) {
		if (time>30) {
			quit();
		}
		if (Party.allPlayersInArea()) {
			break;
		}
		delay(1000);
	}
	Pather.moveTo(15134, 5923);
	var baalded = false;
	var baalloop = getTickCount() + 3*60*1000;
	while(!baalded && getTickCount() < baalloop){
		try{
			if (Attack.kill(544)) {
				baalded = true;
			}
		}catch(e) {
			delay(10000);
			print(e);
		}
	}
	delay(me.ping*2);
	Pickit.pickItems();
	delay(2000);
	if (!quest) {
		Communication.sendToList(HordeSystem.allTeamProfiles, "avoiding congrats screen");

		delay(20 * me.ping); // Wait 2-4 seconds for others to pause ToolsThread.js before leaving.
		delay(rand(2000,10000));
		D2Bot.restart(); // Avoid congrats screen.
	}

	Pather.teleport = true;
	
	Role.backToTown();

	return Sequencer.done;
}
