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
	
	canCreateTp: function() {
		return hasTpTome && hasTpScrolls();
	},
	
	getTpTome: function() {
		return me.findItem("tbk", 0, 3);
	},
	
	hasTpScrolls: function() {
		var tpTome = getTpTome();
		if (tpTome) {
			return tpTome.getStat(70);
		}
		return false;
	},
	
	mercCheck: function() {
		if (Party.lowestAct >= 2)
		{
			if (me.diff === 0)
			{
				MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, false, 2);
				
				// make sure our merc can get levels
				if (Party.lowestAct == 5) {
					let merc = me.getMerc();

					if (merc && merc.charlvl < 25 && me.charlvl >= 28) {
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, true, 25);
					}
					else if (merc && merc.charlvl < HordeSettings.baalLvl - 5 && me.charlvl >= HordeSettings.baalLvl - 2) {
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, true, HordeSettings.baalLvl - 5);
					}
				}
			}
			else if (me.diff === 1)
			{
				MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, false, 2);
				
				if (Party.lowestAct == 5) {
					let merc = me.getMerc();

					if (merc && merc.charlvl < HordeSettings.baalLvlnm - 5 && me.charlvl >= HordeSettings.baalLvlnm - 2) {
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, true, HordeSettings.baalLvlnm - 5);
					}
				}
			}
		}
	}
};