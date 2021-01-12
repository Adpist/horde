/**
*	@filename	orgtorch.js
*	@author		Adpist
*	@desc		Convert keys to organs, make torch if possible
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function orgtorch_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (me.gametype !== 1) {
		HordeDebug.logUserError("orgtorch",  "not supported as classic run");
		return Sequencer.stop;//Stop : classic
	}
	
	if (!me.getQuest(28, 0)) {
		return Sequencer.skip;//Stop : diablo isn't done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Communication.OrgTorch.askReady() ? Sequencer.ok : Sequencer.skip;
}

function orgtorch(mfRun) {
	this.doneAreas = [];
	
	this.checkTorch = function () {
		if (!me.inTown) {
			Role.backToTown();
		}
		
		Town.identify(true);
		
		var item = me.getItem("cm2");

		if (item) {
			do {
				if (item.quality === 7 && Pickit.checkItem(item).result === 1) {
					if (AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("torchMuleInfo")) {
						print("muling torch");
						scriptBroadcast("muleTorch");
						quit();
						scriptBroadcast("quit");
						//delay(10000);
					}

					return true;
				}
			} while (item.getNext());
		}

		return false;
	};
	
	this.openPortal = function (mode) {
		var portal,
			item1 = mode === 0 ? me.findItem("pk1", 0) : me.findItem("dhn", 0),
			item2 = mode === 0 ? me.findItem("pk2", 0) : me.findItem("bey", 0),
			item3 = mode === 0 ?  me.findItem("pk3", 0) : me.findItem("mbr", 0);

		Town.goToTown(5);

		if (Town.openStash() && Cubing.emptyCube()) {
			if (!Storage.Cube.MoveTo(item1) || !Storage.Cube.MoveTo(item2) || !Storage.Cube.MoveTo(item3)) {
				return false;
			}

			if (!Cubing.openCube()) {
				return false;
			}

			transmute();
			delay(1000);

			portal = getUnit(2, "portal");

			if (portal) {
				do {
					switch (mode) {
					case 0:
						if ([133, 134, 135].indexOf(portal.objtype) > -1 && this.doneAreas.indexOf(portal.objtype) === -1) {
							this.doneAreas.push(portal.objtype);
							HordeDebug.logScriptInfo("OrgTorch", "Open portal to " + portal.objtype);
							return copyUnit(portal);
						}

						break;
					case 1:
						if (portal.objtype === 136) {
							HordeDebug.logScriptInfo("OrgTorch", "Open portal to tristram");
							return copyUnit(portal);
						}

						break;
					}
				} while (portal.getNext());
			}
		}

		return false;
	};
	
	this.getCorpse = function (area) {
		if (me.mode === 17) {
			me.revive();
		}

		Pather.usePortal(null, me.name);
		Pather.makePortal();
				
		var corpse,
			rval = false;

		corpse = getUnit(0, me.name, 17);

		if (corpse) {
			do {
				if (getDistance(me, corpse) <= 15) {
					Pather.moveToUnit(corpse);
					corpse.interact();
					delay(500);

					rval = true;
				}
			} while (corpse.getNext() && !me.dead);
		}

		return rval;
	};
	
	this.lure = function (bossId) {
		var tick,
			unit = getUnit(1, bossId);

		if (unit) {
			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (getDistance(me, unit) <= 10) {
					return true;
				}

				delay(50);
			}
		}

		return false;
	};
	
	this.findOrgBoss = function(area, clearPath) {
		var findLoc = [];
		var target = 0;
		var targetFound = false;
		
		if (area === 134 && getUnit(1, 708)){
			return true;
		}
		
		Pather.teleport = !clearPath;
		
		if (!clearPath && !Role.teleportingChar) {
			Role.backToTown();
			Town.move("portalspot");
			while (!Pather.getPortal(area, HordeSystem.team.profiles[HordeSystem.teleProfile].character)) {
				delay(50);
			}
			
			if (!Role.uberChar) {
				delay(500);
			}
			
			Pather.usePortal(area, HordeSystem.team.profiles[HordeSystem.teleProfile].character)
		}
		
		switch (area) {
			case 133: // Matron's Den
				target = 707;
				break;
			case 134: // Forgotten Sands
				target = 708;
				break;
			case 135: // Furnace of Pain
				target = 706;
				break;
		}
		
		if (clearPath || Role.teleportingChar) {
			switch(area) {
				case 133: // Matron's Den
					if (!getUnit(1, 707)) {
						Pather.moveToPreset(133, 2, 397, 2, 2, false, clearPath);
					}
					break;
				case 134: // Forgotten Sands
					findLoc = [20196, 8694, 20308, 8588, 20187, 8639, 20100, 8550, 20103, 8688, 20144, 8709, 20263, 8811, 20247, 8665];

					if (!getUnit(1, 708)) {
						for (var i = 0; i < findLoc.length; i += 2) {
							Pather.moveTo(findLoc[i], findLoc[i + 1], 2, clearPath);
							
							if (clearPath) {
								delay(500);
								if (me.dead) {
									break;
								}
								Party.secureWaitSynchro("sands_loc_" + i, 20000);
							}
							
							//Break if done
							if (getUnit(1, 708)) {
								break;
							}
						}
					}
					break;
				case 135: // Furnace of Pain
					if (!getUnit(1, 706)) {
						Pather.moveToPreset(135, 2, 397, 2, 2, false, clearPath);
					}
					break;
			}
		}
		
		if (getUnit(1, target)) {
			targetFound = true;
			Pather.makePortal();
			if (!clearPath && Role.teleportingChar) {
				Pather.usePortal(null, null);
				delay(1000);
				Pather.usePortal(area, me.name);
				Pather.makePortal();
			}
		}
		
		Pather.teleport = true;
		
		return targetFound;
	};
	
	this.pandemoniumRun = function () {
		var i, findLoc, skillBackup, firstSynchro = false;

		var currentArea = me.area, areaDone = false, reachedTarget = false, died = false;
		var meph = false, dia = false, baal = false;
		
		if (Role.uberChar) {
			Communication.sendToList(HordeSystem.allTeamProfiles, "orgtorch area " + me.area);
		}
		
		while (!areaDone) {
			died = me.dead;
			if (!me.dead || this.getCorpse()) {
				//Not uber killer & we changed current area
				if (!Role.uberChar && Communication.OrgTorch.runArea !== currentArea) {
					areaDone = true;
					Role.backToTown();
					break;
				}
				
				//Initial syncro
				if (!firstSynchro) {
					if (me.area === 136) {
						Pather.moveTo(25050, 5100);
					}
					Party.secureWaitSynchro("begin_" + me.area);
					Precast.doPrecast(true);
					firstSynchro = true;
				}
				
				switch (me.area) {
				case 133: // Matron's Den
					try {
						if(!reachedTarget && this.findOrgBoss(me.area, false)) {
							reachedTarget = true;
						}
					} catch(e) {}
					
					if (me.dead) {
						break;
					}
					
					if (!Role.uberChar) {
						Attack.clear(15);
					}
					
					try{
						Attack.kill(707);
					} catch (e) {
					
					}
					
					if (me.dead) {
						break;
					}
					
					Pickit.pickItems();
					
					Party.secureWaitSynchro("matron_done", 30000);
					
					//Attack.clear(5);
					Pickit.pickItems();
					Role.backToTown();

					areaDone = true;
					break;
				case 134: // Forgotten Sands
					try {
						if(!reachedTarget && this.findOrgBoss(me.area, false)) {
							reachedTarget = true;
						}
					} catch(e) {}

					if (me.dead) {
						break;
					}
					
					if (!Role.uberChar) {
						Attack.clear(15);
					}
					
					try {
						Attack.kill(708);
					} catch (e) {
					
					}
					
					if (me.dead) {
						break;
					}
							
					Pickit.pickItems();
					
					Party.secureWaitSynchro("sands_done", 30000);
					
					Pickit.pickItems();
					
					Role.backToTown();

					areaDone = true;
					break;
				case 135: // Furnace of Pain
					try {
						if(!reachedTarget && this.findOrgBoss(me.area, false)) {
							reachedTarget = true;
						}
					} catch(e) {}
					
					if (me.dead) {
						break;
					}
					
					if (!Role.uberChar) {
						Attack.clear(15);
					}
					
					try {
						Attack.kill(706);
					} catch (e) {
					
					}
					
					if (me.dead) {
						break;
					}
					
					Pickit.pickItems();
					
					Party.secureWaitSynchro("furnace_done", 30000);
					
					Pickit.pickItems();
					Role.backToTown();

					areaDone = true;

					break;
				case 136: // Tristram
					Pather.teleport = true;
					if (!meph) {
						if (Role.uberChar) {
							findLoc = [25040, 5200, 25129, 5198, 25122, 5170];

							for (i = 0; i < findLoc.length; i += 2) {
								Pather.moveTo(findLoc[i], findLoc[i + 1]);
							}

							Skill.setSkill(125, 0);
							this.lure(704);
							Pather.moveTo(25129, 5198);
							Skill.setSkill(125, 0);
							this.lure(704);

							Party.waitSynchro("ubermeph", 30000);
							
						} else {
							findLoc = [25040, 5101, 25040, 5200];
							for (i = 0; i < findLoc.length; i += 2) {
								Pather.moveTo(findLoc[i], findLoc[i + 1]);
							}
							Party.waitSynchro("ubermeph", 30000);
							delay(1000);
							Pather.moveTo(25080, 5198, 2, false);
							delay(1000);
							Attack.clear(15);
							Pather.moveTo(25129, 5198, 2, true);
						}

						if (me.dead) {
							break;
						}
					
						if (!Role.uberChar) {
							Attack.clear(15);
						} 
						
						try{
							Attack.kill(704);
						} catch(e) {
							
						}
						
						if (!Role.uberChar) {
							Attack.clear(15);
						}
						
						if (me.dead) {
							break;
						}
						meph = true;
					}

					if (!dia) {
						if (!died && !getUnit(1, 709)) {						
							if (!Role.uberChar) {
								Pather.moveTo(25129, 5198, 2, true);
								Party.waitSynchro("uberdia", 30000);
								delay(2000);
							} else {
								Pather.moveTo(25122, 5170);
								Party.waitSynchro("uberdia", 30000);
							}
							
							if (me.dead) {
								break;
							}
						
							if (!getUnit(1, 709)) {
								Pather.moveTo(25122, 5141, 1, Role.uberChar || died ? false : true);
							}
						}
						
						if (me.dead) {
							break;
						}
						
						if (!Role.uberChar) {
							Attack.clear(30);
						}
						
						try{
							Attack.kill(709);
						} catch(e) { }
						
						if (!Role.uberChar) {
							Attack.clear(15);
						}
						
						if (me.dead) {
							break;
						}
						
						dia = true;
					}

					if (!baal) {
						if (!getUnit(1, 705)) {
							Pather.moveTo(25122, 5141, 1, Role.uberChar || died ? false : true);
						}
						
						if (me.dead) {
							break;
						}

						if (!Role.uberChar) {
							Attack.clear(15);
						}
						
						try{
							Attack.kill(705);
						} catch(e) { }
						
						if (!Role.uberChar) {
							Attack.clear(15);
						}
						
						if (me.dead) {
							break;
						}
						
						baal = true;
					}
					
					Pickit.pickItems();

					Pather.moveTo(25122, 5141, 1, true);
							
					Pickit.pickItems();
					
					Party.secureWaitSynchro("tristram_done", 30000);
					
					Pickit.pickItems();
					
					areaDone = true;
					
					break;
				}
			}
			
			delay(50);
		}
		
		if (me.area === 136) {
			while(me.area === 136) {
				Pather.moveTo(25105, 5140);
				Pather.usePortal(109);
			}
		} else {
			HordeTown.lightChores();
		}
	};
	
	Town.goToTown(5);
	
	var oldLifeChicken = Config.LifeChicken,
		oldTownHP = Config.TownHP,
		oldManaChicken = Config.ManaChicken,
		oldMercChicken = Config.MercChicken,
		oldTownMP = Config.TownMP,
		oldTownCheck = Config.TownCheck,
		oldMercWatch = Config.MercWatch;
	
	if (!me.playertype) {//Don't remove chicken in hardcore
		Config.LifeChicken = 1; // Exit game if life is less or equal to designated percent.
		Config.QuitList = [];
		//HordeSystem.toggleThreadsPause();
	}
	
	Config.TownHP = 0; // Go to town if life is under designated percent.
	Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
	Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
	Config.TownMP = 0; // Go to town if mana is under designated percent.
	Config.TownCheck = false; // Go to town if out of potions
	Config.MercWatch = false; // Don't revive merc during battle.
	
	if (Role.uberChar) {
		if (Role.hasKeySet()) {
			HordeDebug.logScriptInfo("OrgTorch", "Converting key set");
			for (var i = 0; i < 3; i += 1) {
				// Abort if we have a complete set of organs
				// If Config.OrgTorch.MakeTorch is false, check after at least one portal is made
				if (Role.hasOrgSet() && !Role.hasTorch()) {
					break;
				}

				var portal = this.openPortal(0);

				if (portal) {
					Pather.usePortal(null, null, portal);
				}

				this.pandemoniumRun();
			}
		}
		
		if (Role.hasOrgSet() && !Role.hasTorch()) {
			HordeDebug.logScriptInfo("OrgTorch", "Converting org set");
			portal = this.openPortal(1);

			if (portal) {
				Pather.usePortal(null, null, portal);
			}

			this.pandemoniumRun();
		}
		
		Communication.sendToList(HordeSystem.allTeamProfiles, "orgtorch done");
	} else {
		while(!Communication.OrgTorch.runDone) {
			if (Communication.OrgTorch.runArea !== 0) {
				if (!me.inTown) {
					Town.goToTown(5);
				}
				
				Pather.usePortal(Communication.OrgTorch.runArea);
				
				this.pandemoniumRun();
				
				Communication.OrgTorch.runArea = 0;
			}
			
			delay(50);
		}
	}
	
	//Restore config
	if (!me.playertype) {
		//HordeSystem.toggleThreadsPause();
	}
	
	if (Role.uberChar) {
		if (Role.hasTorch()) {
			this.checkTorch();
		}
	}
	
	Config.LifeChicken = oldLifeChicken;
	Config.TownHP = oldTownHP;
	Config.ManaChicken = oldManaChicken;
	Config.MercChicken = oldMercChicken;
	Config.TownMP = oldTownMP;
	Config.TownCheck = oldTownCheck;
	Config.MercWatch = oldMercWatch;
	
	return Sequencer.done;
}