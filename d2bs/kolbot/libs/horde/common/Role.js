/**
*	@filename	Waypoint.js
*	@author		Adpist
*	@desc		Waypoint management & synchro
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Role = {
	isLeader: false,
	teleportingChar: false,
	boChar: false,
	otherChar: false,
	questDropChar: false,
	uberChar: false,
	
	initRole: function () { // Checks Config settings to determine role.
		var leaderProfile = DataFile.getStats().hordeLeader;
		
		if (HordeSystem.teleProfile === me.profile) {
			this.teleportingChar = true;

		} else if (HordeSystem.boProfile === me.profile) {
			this.boChar = true;
		} else if (HordeSystem.questDropProfile === me.profile) {
			this.questDropChar = true;
		} else if (HordeSystem.uberProfile === me.profile) {
			this.uberChar = true;
		} else {
			for (var i = 0 ; i < HordeSystem.followerProfiles.length ; i += 1) {
				if (HordeSystem.followerProfiles[i] === me.profile) {
					this.otherChar = true;
					break;
				}
			}
			
			if (!this.otherChar) {
				HordeDebug.logUserError("TeamConfig", "I am not assigned a role in my Config file. Please rectify this omission and restart."); // SiC-666 TODO: Make this red text or throw an error instead.

				while(true) {
					delay(1000);
				}
			}
		}
		if (HordeSystem.teamSize > 1) {
			if (leaderProfile !== undefined) {
				this.isLeader = leaderProfile === me.profile;
			} else {
				this.isLeader = this.teleportingChar;
			} 
		} else {
			this.isLeader = true;
		}
	},
	
	getLeaderUnit: function () {
		var player = getUnit(0, HordeSystem.team.profiles[HordeSystem.teleProfile].character);

		if (player) {
			do {
				if (!player.dead) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	},

	goToLeader: function () {
		var leader = this.getLeaderUnit();
		if (leader) {
			if (this.boProfile) {//why bo only ?
				if (me.area != leader.area)
					return false;
				var count = 0;
				while( getDistance(me, leader) > 3 ) {
					if (!Pather.moveTo(leader.x + 1, leader.y, 5))
						Pather.moveTo(leader.x, leader.y + 1, 5);
					count += 1;
					if (count > 5)
						break;
				}
			}
			return true;
		}
		return false;
	},
	
	makeTeamJoinPortal: function() {
		if (HordeSystem.teamSize > 1) {
			Pather.makePortal();
		}
	},
	
	makeTeamTownPortal: function() {
		if (HordeSystem.teamSize > 1) {
			Pather.makePortal();
		}
	},
	
	getTownFromAct: function(act) {
		var towns = [1, 40, 75, 103, 109];
		if (act < 1 || act > 5) {
			throw new Error("Role.getTownFromAct: Invalid act");
		}
		
		return towns[act-1];
	},
	
	backToTown: function(force) {
		var waitTime = 1000, scrollsCount = 0, targetTown; //wait up to 1 second
		
		if (force === undefined) {
			force = true;
		}
		
		targetTown = this.getTownFromAct(me.act);
		
		if (!me.inTown && !me.dead) {
			if (me.area === 136) {
				Pather.moveTo(25105, 5140);
				Pather.usePortal(109);
				return true;
			}
			
			print("backToTown: not in town. need tp to " + targetTown);
			if (Pather.getPortal(targetTown, null)) {
				print("backToTown: try use existing portal " + waitTime);
				Pather.usePortal(targetTown, null);
				delay(me.ping*2+250);
				if (me.inTown || me.dead) {
					return true;
				}
			}			
				
			if (this.canCreateTp()) {
				scrollsCount = this.getTpTome().getStat(70);
				print("backToTown: have " + scrollsCount + " scrolls");
				if (scrollsCount === 20) {
					waitTime = HordeSystem.getTeamIndex(me.profile) * 50;// we wait [0;400] depending on our index in the team profiles.
				} else {
					waitTime = 400 + 30 * (20-scrollsCount);//we're not full of scrolls, wait [400;1000] depending on how many scrolls we have
				}
			}
			
			while(!me.inTown && !me.dead && waitTime > 0) {
				print("backToTown: waiting " + waitTime + " ms");
				delay(waitTime);
				
				if (Pather.getPortal(targetTown, null)) {
					print("backToTown: try use portal " + waitTime);
					Pather.usePortal(targetTown, null);
					waitTime = waitTime - 100;
				} else if (this.canCreateTp()) {
					print("backToTown: make portal " + waitTime);
					Pather.makePortal();
					Pather.usePortal(targetTown, null);
				} else {
					waitTime = waitTime - 100;
				}
			}
		}
		else {
			delay(waitTime);
		}
		
		Travel.walkMeHome(true);

		if (waitTime > 0 && !me.dead && force) {
			if(!me.inTown){
				print("back to town failed, forcing returning to town");
				return Town.goToTown();
			}
		}
		
		print("backToTown: " + (waitTime > 0 ? "succeeded" : "failed"));
		return waitTime > 0;
	},
	
	canCreateTp: function() {
		return this.hasTpScrolls();
	},
	
	getTpTome: function() {
		return me.findItem("tbk", 0, 3);
	},

	hasTpScrolls: function() {
		var tpTome = this.getTpTome();
		if (tpTome) {
			return tpTome.getStat(70);
		}
		return false;
	},
	
	getGold: function() {
		return me.getStat(14) + me.getStat(15);
	},
	
	isHighGold: function() {
		return this.getGold() > Config.LowGold*2 + 100;
	},
	
	isMediumGold: function() {
		return this.getGold() > Config.LowGold*1.5 + 100;
	},
	
	isLowGold: function() {
		return this.getGold() < Config.LowGold + 100;
	},
	
	isVeryLowGold: function() {
		return this.getGold()*2 < Config.LowGold + 100;
	},
	
	mercCheck: function() {
		if (Party.lowestAct >= 2 || me.act >= 2)
		{
			var enableMercRebuy = true, hasAct2NightmareMerc = !!HordeSystem.build.mercAct2Nightmare;
			if(HordeSystem.team.disableMercRebuy){
				enableMercRebuy = false;
			}
			if (me.diff === 0)
			{
				MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, false, 2);
				
				// make sure our merc can get levels
				if (Party.lowestAct == 5) {
					let merc = me.getMerc();

					if (merc && merc.charlvl < 25 && me.charlvl >= 28) {
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, enableMercRebuy, 25);
					}
					else if (merc && merc.charlvl <= me.charlvl - 10 && !hasAct2NightmareMerc) {
					
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, enableMercRebuy, me.charlvl - 5);
					}
				}
			}
			else if (me.diff === 1 && hasAct2NightmareMerc)
			{
				MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, false, 2);
				
				if (Party.lowestAct == 5) {
					let merc = me.getMerc();

					if (merc && merc.charlvl <= me.charlvl - 10) {
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, enableMercRebuy, me.charlvl - 5);
					}
				}
			}
		}
	},
	
	hasTorch: function() {
		var item = me.getItem("cm2");
		if (item) {
			do {
				if (item.quality === 7 && Pickit.checkItem(item).result === 1) {
					return true;
				}
			} while (item.getNext());
		}
		return false;
	},
	
	hasOrgSet: function() {
		var horns = me.findItems("dhn"),
			brains = me.findItems("mbr"),
			eyes = me.findItems("bey");

		if (!horns || !brains || !eyes) {
			return false;
		}

		// We just need one set to make a torch
		return horns.length && brains.length && eyes.length;
	},
	
	hasKeySet: function() {
		var tkeys = me.findItems("pk1", 0).length || 0;
		var hkeys = me.findItems("pk2", 0).length || 0;
		var dkeys = me.findItems("pk3", 0).length || 0;
		
		print("Has keys : terror : " + tkeys + " - hate : " + hkeys + " - destruction : " + dkeys);
		
		return tkeys >= 3 && hkeys >= 3 && dkeys >= 3;
	},
	
	getKeysNeeds: function() {
		var tkeys = me.findItems("pk1", 0).length || 0;
		var hkeys = me.findItems("pk2", 0).length || 0;
		var dkeys = me.findItems("pk3", 0).length || 0;
		
		return {terror: tkeys < 3 ? 3 - tkeys : 0, hate: hkeys < 3 ? 3 - hkeys : 0, dest: dkeys < 3 ? 3 - dkeys : 0};
	},
	
	orgTorchCheck: function() {
		if (this.uberChar) {
			if (!this.hasTorch()) {
				return this.hasKeySet() || this.hasOrgSet();
			}else {
				print("orgTorchCheck : already have torch");
				if (AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("torchMuleInfo")) {
					print("muling torch");
					scriptBroadcast("muleTorch");
					quit();
					scriptBroadcast("quit");
					//delay(10000);
				}
			}
		} else {
			print("orgTorchCheck : not uber char");
		}
		return false;
	}
};
