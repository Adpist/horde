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
	
	initRole: function () { // Checks Config settings to determine role.
		var leaderProfile = DataFile.getStats().hordeLeader;
		
		if (HordeSystem.teleProfile === me.profile) {
			this.teleportingChar = true;

		} else if (HordeSystem.boProfile === me.profile) {
			this.boChar = true;
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
		
		if (waitTime > 0 && !me.dead && force) {
			print("back to town failed, forcing returning to town");
			return Town.goToTown();
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
	
	isLowGold: function() {
		return this.getGold()*2 < Config.LowGold;
	},
	
	isVeryLowGold: function() {
		return this.getGold()*4 <  Config.LowGold;
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
					else if (merc && merc.charlvl <= me.charlvl - 10 && (HordeSystem.getGameDifficulty() === "Normal" || !hasAct2NightmareMerc)) {
					
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
	}
};
