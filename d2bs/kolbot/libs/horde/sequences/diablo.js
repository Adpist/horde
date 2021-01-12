/**
*	@filename	diablo.js
*	@author		Adpist
*	@desc		Diarun
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function diablo_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(23,0)) {
		if (!mfRun)
			HordeDebug.logUserError("diablo", "mephisto isn't dead");
		return mfRun ? Sequencer.skip : Sequencer.stop; //Stop, Mephisto isn't dead
	}
	
	if (mfRun && !me.getQuest(me.gametype === 0 ? 26 : 28, 0)) {
		return Sequencer.skip; //Skip: mf run and diablo isn't dead
	}
	
	if ((!mfRun && me.getQuest(me.gametype === 0 ? 26 : 28, 0))) {
		return Sequencer.skip;//Skip, quest already complete
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function diablo(mfRun) {
	Town.goToTown(4);
	
	if (Role.teleportingChar) {
		Travel.travel(8);
	}
	
	// Sort function
	this.sort = function (a, b) {
		if (Config.BossPriority) {
			if ((a.spectype & 0x5) && (b.spectype & 0x5)) {
				return getDistance(me, a) - getDistance(me, b);
			}

			if (a.spectype & 0x5) {
				return -1;
			}

			if (b.spectype & 0x5) {
				return 1;
			}
		}

		// Entrance to Star / De Seis
		if (me.y > 5325 || me.y < 5260) {
			if (a.y > b.y) {
				return -1;
			}

			return 1;
		}

		// Vizier
		if (me.x < 7765) {
			if (a.x > b.x) {
				return -1;
			}

			return 1;
		}

		// Infector
		if (me.x > 7825) {
			if (!checkCollision(me, a, 0x1) && a.x < b.x) {
				return -1;
			}

			return 1;
		}

		return getDistance(me, a) - getDistance(me, b);
	};

	// general functions
	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue.");
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.initLayout = function () {
		this.vizLayout = this.getLayout(396, 5275);
		this.seisLayout = this.getLayout(394, 7773);
		this.infLayout = this.getLayout(392, 7893);
	};

	this.openSeal = function (classid) {
		var i, seal;

		for (i = 0; i < 5; i += 1) {
			Pather.moveToPreset(108, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);

			seal = getUnit(2, classid);

			if (!seal) {
				return false;
			}

			if (seal.mode) { // Other player opened Seal already.
				return true;
			}

			if (classid === 394) {
				Misc.click(0, 0, seal);
			} else {
				seal.interact();
			}

			delay(classid === 394 ? 1000 : 500); // De Seis optimization

			if (!seal.mode) {
				if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) { // De Seis optimization
					Pather.moveTo(seal.x + 15, seal.y);
				} else {
					Pather.moveTo(seal.x - 5, seal.y - 5);
				}

				delay(500);
			} else {
				return true;
			}
		}

		return false;
	};

	this.chaosPreattack = function (name, amount) {
		var i, n, target, positions;

		switch (me.classid) {
		case 3:
			target = getUnit(1, name);

			if (!target) {
				return;
			}

			positions = [[6, 11], [0, 8], [8, -1], [-9, 2], [0, -11], [8, -8]];

			for (i = 0; i < positions.length; i += 1) {
				if (Attack.validSpot(target.x + positions[i][0], target.y + positions[i][1])) { // check if we can move there
					Pather.moveTo(target.x + positions[i][0], target.y + positions[i][1]);
					Skill.setSkill(Config.AttackSkill[2], 0);

					for (n = 0; n < amount; n += 1) {
						Skill.cast(Config.AttackSkill[1], 1);
					}

					break;
				}
			}

			break;
		default:
			break;
		}
	};

	this.getBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		for (i = 0; i < 16; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				this.chaosPreattack(name, 8);

				return Attack.clear(40, 0, name, this.sort);
			}

			delay(250);
		}

		return !!glow;
	};

	this.vizierSeal = function () {
		print("Viz layout " + this.vizLayout);

		this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB);

		Party.secureWaitSynchro("vizier", 60000);
		
		//if (Role.teleportingChar) {
			if (!this.openSeal(395) || !this.openSeal(396)) {
				//HordeDebug.logScriptError("diablo", "Failed to open Vizier seals.");
			}
		//}
		
		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292, 3, true);
		} else {
			Pather.moveTo(7695, 5316, 3, true);
		}


		if (!this.getBoss(getLocaleString(2851))) {
			//HordeDebug.logScriptError("diablo", "Failed to kill Vizier");
		}

		return true;
	};

	this.seisSeal = function () {
		print("Seis layout " + this.seisLayout);

		this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB);

		Party.secureWaitSynchro("seis", 60000);
		
		//if (Role.teleportingChar) {
			if (!this.openSeal(394)) {
				//HordeDebug.logScriptError("diablo", "Failed to open de Seis seal.");
			}
		//}

		if (this.seisLayout === 1) {
			if (me.classid === 1) {
				delay(3000);
				Pather.moveTo(7771, 5216); //(7771, 5196);
			} else {
				Pather.moveTo(7771, 5196, 3, true);
			}
		} else {
			if (me.classid === 1) {
				delay(3000);
				Pather.moveTo(7798, 5206); //(7798, 5186);
			} else {
				Pather.moveTo(7798, 5186, 3, true);
			}
		}

		if (!this.getBoss(getLocaleString(2852))) {
			HordeDebug.logScriptError("diablo", "Failed to kill de Seis");
		}

		return true;
	};

	this.infectorSeal = function () {
		print("Inf layout " + this.infLayout);

		this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB);

		Party.secureWaitSynchro("infector", 60000);
		
		//if (Role.teleportingChar) {
			if (!this.openSeal(392)) {
				//HordeDebug.logScriptError("diablo", "Failed to open Infector seal.");
			}
		//}

		if (this.infLayout === 1) {
			delay(1);
		} else {
			if (me.classid === 1) { // Dark-f
				Pather.moveTo(7908, 5295); // tested by Dark-f
			} else {
				Pather.moveTo(7928, 5295, 3, true); // temp
			}
		}

		if (!this.getBoss(getLocaleString(2853))) {
			HordeDebug.logScriptError("diablo", "Failed to kill Infector");
		}

		Party.secureWaitSynchro("last_seal", 60000);
		
		//if (Role.teleportingChar) {
			if (!this.openSeal(393)) {
				//HordeDebug.logScriptError("diablo", "Failed to open Infector seals");
			}
		//}

		return true;
	};

	this.diabloPrep = function () {
		var trapCheck,
			tick = getTickCount();

		while (getTickCount() - tick < 30000) {
			if (getTickCount() - tick >= 8000) {
				if (getUnit(1, 243)) {
					return true;
				}

				switch (me.classid) {
				case 1: // Sorceress
					if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
						if (me.getState(121)) {
							delay(500);
						} else {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
						}

						break;
					}

					delay(500);

					break;
				case 3: // Paladin
					Skill.setSkill(Config.AttackSkill[2]);

					Skill.cast(Config.AttackSkill[1], 1);

					break;
				case 5: // Druid
					if (Config.AttackSkill[1] === 245) {
						Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);

						break;
					}

					delay(500);

					break;
				case 6: // Assassin
					if (Config.UseTraps) {
						trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});

						if (trapCheck) {
							ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);

							break;
						}
					}

					delay(500);

					break;
				default:
					delay(500);

					break;
				}
			} else {
				delay(500);
			}

			if (getUnit(1, 243)) {
				return true;
			}
		}

		throw new Error("Diablo not found");
	};

	this.followPath = function (path) {
		var i;

		for (i = 0; i < path.length; i += 2) {
			if (this.cleared.length) {
				this.clearStrays();
			}


			Pather.moveTo(path[i], path[i + 1], 3, getDistance(me, path[i], path[i + 1]) > 50);

			Attack.clear(30, 0, false, this.sort);

			// Push cleared positions so they can be checked for strays
			this.cleared.push([path[i], path[i + 1]]);


			// After 5 nodes go back 2 nodes to check for monsters
			if (i === 10 && path.length > 16) {
				path = path.slice(6);

				i = 0;
			}
		}
	};

	this.clearStrays = function () {
		var i,
			oldPos = {x: me.x, y: me.y},
			monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster)) {
					for (i = 0; i < this.cleared.length; i += 1) {
						if (getDistance(monster, this.cleared[i][0], this.cleared[i][1]) < 30 && Attack.validSpot(monster.x, monster.y)) {
							Pather.moveToUnit(monster);

							Attack.clear(15, 0, false, this.sort);

							break;
						}
					}
				}
			} while (monster.getNext());
		}

		if (getDistance(me, oldPos.x, oldPos.y) > 5) {
			Pather.moveTo(oldPos.x, oldPos.y);
		}

		return true;
	};

	this.cleared = [];

	// path coordinates
	this.entranceToStar = [7794, 5490, 7769, 5484, 7771, 5423, 7782, 5413, 7767, 5383, 7772, 5324];
	this.starToVizA = [7766, 5306, 7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
	this.starToVizB = [7766, 5306, 7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
	this.starToSeisA = [7772, 5274, 7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
	this.starToSeisB = [7772, 5274, 7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
	this.starToInfA = [7815, 5273, 7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
	this.starToInfB = [7815, 5273, 7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];
/*
	this.entranceToStar = [7794, 5517, 7791, 5491, 7768, 5459, 7775, 5424, 7817, 5458, 7777, 5408, 7769, 5379, 7777, 5357, 7809, 5359, 7805, 5330, 7780, 5317, 7791, 5293];
	this.starToVizA = [7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
	this.starToVizB = [7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
	this.starToSeisA = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
	this.starToSeisB = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
	this.starToInfA = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
	this.starToInfB = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];
*/
	// start
	Party.wholeTeamInGame();

	//if ( Role.teleportingChar && me.classid === 1) {
	if (me.classid === 1) {
		Pather.teleport = true;
	} else {
		Pather.teleport = HordeSystem.isEndGame();
	}
	var clearType;

	if (Role.teleportingChar) {
		Pather.useWaypoint(107);

		Precast.doPrecast(true);
		if ( me.classid === 1) {
			clearType = false;
		} else {
			clearType = true;
		}

		if (!mfRun) {
			Pather.moveTo(7790, 5544, 10, clearType, clearType); // Start at Entrance.

			Pather.makePortal();
			Town.goToTown();
		} else {
			Pather.moveTo(7791, 5293, 10, clearType, clearType); // Start at Star.

			Pather.makePortal();
			Town.goToTown();
		}
	} else {
		Town.goToTown(4);

		Town.move("portalspot");

		Precast.doPrecast(true);

		while (!Pather.usePortal(108, null)) {
			delay(250);
		}
		
		Buff.selfBo();
	}
	Buff.Bo();
	if(HordeSystem.team.walkChaosSancNorm && me.diff === 0){
		Pather.teleport = false;
	}
	if(HordeSystem.team.walkChaosSancNm && me.diff === 1){
		Pather.teleport = false;
	}
	if(HordeSystem.team.walkChaosSancHell && me.diff === 2){
		Pather.teleport = false;
	}
	Attack.clear(10);
	if (Role.teleportingChar) {
		delay(5000);
		//Pather.teleport = false;
		Pather.usePortal(108, null);
		Pather.makePortal();
	}
	Config.ClearType = 0;

	this.initLayout();

	Attack.clear(30, 0, false, this.sort);

	Precast.doPrecast(true);

	if (me.y > 5400) {
		print("Started at Entrance.");

		this.followPath(this.entranceToStar);

		Attack.clear(30, 0, false, this.sort);
	} else {
		print("Started at Star.");
	}
	Buff.Bo();
	this.vizierSeal();
	Buff.Bo();
	this.seisSeal();

	Precast.doPrecast(true);
	if (me.classid === 1)
		delay(2000);
	Buff.Bo();
	//Pather.teleport = true;
	this.infectorSeal();
	
	// Don't kill Diablo in classic hell
	// NOTE TO USERS: It's better to switch to a CS Taxi script that will run faster and maintain Diablo virgin kills.
	if (me.gametype === 0 && me.diff === 2) {
		print("Not killing diablo in classic hell"); 

		Town.goToTown();

		Party.waitForMembers();

		delay(2000);

		return Sequencer.done;
	}

	Party.wholeTeamInGame();

	switch (me.classid) {
	case 1:
		Pather.moveTo(7772, 5274); //7792,5294

		break;
	default:
		Pather.moveTo(7788, 5292);

		break;
	}

	this.diabloPrep();
	Buff.Bo();
	if (me.gametype === 0) {
		try {
			Attack.hurt(243, 30);
		} catch(e) {
			print(e);
		}

		Town.goToTown();

		HordeTown.doChores();

		Town.move("portalspot");

		if (!me.playertype) {//Don't remove chicken in hardcore
			getScript("tools/ToolsThread.js").pause(); // Pausing ToolsThread.js will effectively turn off chicken and leaving when other characters exit.
		}
		
		Party.waitSynchro("dia_kill");

		Pather.usePortal(108, null);
	}

	try {
		Attack.kill(243); // Diablo
	} catch(e) {
		print(e);

		var diablo = getUnit(1, 243);

		if (diablo) {
			while (Attack.checkMonster(diablo)) {
				delay(250);
			}
		}
	}

	if (me.dead) { // It is possible to die after ToolsThread.js is paused (no potions and no chicken).
		var diablo = getUnit(1, 243);

		while (Attack.checkMonster(diablo)) {
			delay(250);
		}
	}

	Pickit.pickItems();

	Pather.teleport = true;

	if (me.gametype === 0) { // Exit game in classic.
		delay(2000 + 2000 * HordeSystem.getTeamIndex(me.profile)); // Seems necessary to delay after Diablo dies for experience and quest to be gained.
		if (mfRun) {
			quit();
		} else {
			while (me.ingame) {
				D2Bot.restart(); // D2Bot# will restart this profile immediately (avoids congrats screen).

				delay(1000);
			}	
		}
	} else {
		Role.backToTown();
		
		if(!mfRun) {
			delay(me.ping*2 + 500);
			Travel.changeAct(5);
		}
	}

	return Sequencer.done; // Continue to Act 5 in expansion.
}
