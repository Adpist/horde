/**
*	@filename	Horde.js
*	@author		Adpist
*	@desc		Questing, Leveling & Smurfing
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM, adpist
*/

if (!isIncluded("horde/includes.js")) { include("horde/includes.js"); };
includeHorde();

function Horde() {
	var useSequencer = true;
	
	this.start = function () {
		var i;

		print("starting");
		scriptBroadcast("run prerun");
		
		Party.init();
		Waypoint.init();

		//Process previous game
		Town.doChores();
		Quest.checkAndUseConsumable();
		HordeStorage.stashQuestItems();
		Pickit.pickItems();
		
		//Setup current game
		Quest.initCurrentAct();
		HordeStorage.removeUnwearableItems();
		Pickit.pickItems();

		if (HordeSettings.logChar) {
			MuleLogger.logChar();
		}
		
		//Un-clog WP
		if (3 === me.act || 4 === me.act) {
			Town.move("portalspot");
		}
		
		//Wait synchro
		Party.waitTeamReady();
		
		//Sharing sequence
		Sharing.announceSharingSequence();
		Waypoint.announceWaypoints();
		Waypoint.waitWaypointsAnnounced();
		
		Sharing.ShareGold();
		Town.doChores();
		Role.mercCheck();
		Waypoint.shareWaypoints();
		Buff.initialBo();
		
		return true;
	};
	
	//PATHING	
	this.mfScript = function()
	{	
		this.mfSync = function(){
			if (!me.inTown) {
				Town.goToTown();
			}
			
			Pather.useWaypoint(35);
			
			var waypoint;
			
			while (!waypoint) {
				waypoint = getUnit(2, "waypoint");

				delay(250);
			}

			Party.waitForMembers();
			
			while (getDistance(me, waypoint) < 5) { // Be sure to move off the waypoint.
				Pather.walkTo(me.x + rand(5, 15), me.y);

				delay(me.ping * 2 + 500);

				Packet.flash(me.gid);

				delay(me.ping * 2 + 500);
			}
			
			Precast.doPrecast(true);
			
			if (!Role.boChar)
			{
				delay(5000);
			}
			
			Pather.useWaypoint(1);
		}
		
		var didRun = false, allowMf = false;
		
		if ((me.diff === 0 && !HordeSettings.normalMf) || (me.diff === 1 && !HordeSettings.nmMf) || (me.diff === 2 && !HordeSettings.hellMf))
			return false;
		
		//we're act 3 mephisto
		if (!me.getQuest(23, 0) && me.getQuest(18, 0) && me.getQuest(21, 0))
		{
			allowMf = true;
		}
		
		//we're act 4 levelling
		if (me.getQuest(23, 0) && !me.getQuest(35, 0) && !me.getQuest(35, 1) && (!me.getQuest(28, 0) || !Party.hasReachedLevel(HordeSettings.diaLvl) || (me.diff === 1 && !Party.hasReachedLevel(HordeSettings.diaLvlnm)) || (me.diff === 2 && !Party.hasReachedLevel(HordeSettings.diaLvlhell))))
		{
			allowMf = true;
		}
		
		//we're act 5 ancients done
		if (me.gametype === 1 && me.getQuest(39, 0))
		{
			allowMf = true;
		}
		
		if (!allowMf)
		{
			return false;
		}
		
		print("Mf Script");
		
		//Act 1 mf
		if (me.getQuest(7, 0))
		{
			if ((me.diff === 1 && HordeSettings.nmMfCountessOn) || (me.diff === 2 && HordeSettings.hellMfCountessOn))
			{
				Sequencer.runSequence("countess", true);
				Town.doChores();
				didRun = true;
			}
			
			if ((me.diff === 1 && HordeSettings.nmMfAndyOn) || (me.diff === 2 && HordeSettings.hellMfAndyOn))
			{
				if (didRun)
					this.mfSync();
				Sequencer.runSequence("andy", true);
				Town.doChores();
				didRun = true;
			}
		}
		
		//Act 2 mf
		if(me.getQuest(14, 0))
		{
			if ((me.diff === 1 && HordeSettings.nmMfSummonerOn) || (me.diff === 2 && HordeSettings.hellMfSummonerOn))
			{
				if (didRun)
					this.mfSync();
				Sequencer.runSequence("summoner", true);
				Town.doChores();
				didRun = true;
			}
			
			if ((me.diff === 1 && HordeSettings.nmMfDurielOn) || (me.diff === 2 && HordeSettings.hellMfDurielOn))
			{
				if (didRun)
					this.mfSync();
				Sequencer.runSequence("duriel", true);
				Town.doChores();
				didRun = true;
			}
		}
		
		//Act 3 mf
		if(me.getQuest(23, 0))
		{
			if ((me.diff === 0 && HordeSettings.normalMfMephistoOn) || (me.diff === 1 && HordeSettings.nmMfMephistoOn) || (me.diff === 2 && HordeSettings.hellMfMephistoOn))
			{
				if (didRun)
					this.mfSync();

				Sequencer.runSequence("mephisto", true);
				Town.doChores();
				didRun = true;
			}
		}
		
		//Act 5 mf (after ancients)
		if (me.gametype === 1 && me.getQuest(39, 0))
		{
			if ((me.diff === 0 && HordeSettings.normalMfShenkOn) || (me.diff === 1 && HordeSettings.nmMfShenkOn) || (me.diff === 2 && HordeSettings.hellMfShenkOn))
			{
				if (didRun)
					this.mfSync();
					
				Sequencer.runSequence("shenk", true);
				Town.doChores();
				didRun = true;
			}
			
			if ((me.diff === 0 && HordeSettings.normalMfPindleOn) || (me.diff === 1 && HordeSettings.nmMfPindleOn) || (me.diff === 2 && HordeSettings.hellMfPindleOn))
			{
				if (didRun)
					this.mfSync();
				
				Sequencer.runSequence("pindle", true);
				Town.doChores();
				didRun = true;
			}
		}
		
		return true;
	}
//MAIN
	//addEventListener("copydata", ReceiveCopyData);
	addEventListener("copydata", (id, data) => {
		Communication.receiveCopyData(id, data);
	});
	
	Role.initRole();
	Party.waitWholeTeamJoined();
	Pickit.pickItems();
	
	this.start();

	if (useSequencer)
	{
		print("boot horde");
		HordeSystem.boot();
		return true;
	}
	
	this.mfScript();
	
	//act1
	if (!me.getQuest(7, 0)) { // Andariel is not done.
		Town.goToTown(1);

		//den - OK
		if (!me.getQuest(1, 0)) {
			Sequencer.runSequence("den", false);
		}

		if (me.diff === 0) { // Normal difficulty.
			//cave - OK (kinda)
			if (!me.getQuest(2, 0) && me.getQuest(1, 0) && !Party.hasReachedLevel(HordeSettings.caveLvl)) { // Haven't killed Blood Raven, have completed the Den of Evil
				Sequencer.runSequence("cave", false);
				
				if (!Party.hasReachedLevel(HordeSettings.caveLvl))
				{
					Farm.areasLevelling(HordeSettings.caveLvlAreas, HordeSettings.caveLvl);
				}
			}
			//blood raven - OK
			if (!me.getQuest(2, 0) && me.getQuest(1, 0) && Party.hasReachedLevel(HordeSettings.caveLvl)) { // Haven't killed Blood Raven, have completed the Den of Evil and the party has reached the HordeSettings.caveLvl requirement.
				Sequencer.runSequence("blood", false);
			}

			//cain - OK
			if (!me.getQuest(4, 0) && Party.hasReachedLevel(HordeSettings.caveLvl)) { // Haven't completed The Search for Cain and the party has reached the HordeSettings.caveLvl requirement.
				Sequencer.runSequence("cain", false); // Only rescues cain SiC-666 TODO: this is redundant, should grab the questing from autoladderreset or something to consolidate.
			}

			//Countess - OK
			if (HordeSettings.normalCountess && !me.getQuest(5,0) && Party.hasReachedLevel(HordeSettings.caveLvl)) {
				Sequencer.runSequence("countess", false);
			}
			
			//trist
			if (me.getQuest(4, 0) && !Party.hasReachedLevel(HordeSettings.tristLvl)) { // Have completed The Search for Cain and the party hasn't reached the HordeSettings.tristLvl requirement
				Sequencer.runSequence("trist", false);
				/* When the partyLevel is less than the HordeSettings.tristLvl, the game must quit.
				I think that the party should Lv up going to Dark Wood and so on.
				*/
				if (!Party.hasReachedLevel(HordeSettings.tristLvl)) {
					Farm.areasLevelling(HordeSettings.tristLvlAreas, HordeSettings.tristLvl);
				}
			}
		}

		if (me.diff > 0) { // Nightmare & Hell difficulty.
			if (!me.getQuest(4, 0)) { 	// Haven't completed The Search for Cain
				Sequencer.runSequence("cain", false);
			}
		}

		//Smith - ok
		if (HordeSettings.smithQuest && !me.getQuest(3,0) && !me.getQuest(3,1))
		{
			Sequencer.runSequence("smith", false);
		}
		
		//andy - ok
		if (!me.getQuest(7, 0) && ((me.diff === 0 && Party.hasReachedLevel(HordeSettings.tristLvl)) || (me.diff !== 0))) {
			Sequencer.runSequence("andy", false);
		}
	}

	//act2
	if (!me.getQuest(15, 0) && me.getQuest(7, 0)) { // Duriel is not done and Andariel is.

		Town.goToTown(2);

		if (Role.teleportingChar) { // I am the leader.
		
			//Cube - ok ; need handle merc
			if (!me.getItem(549) || Communication.Questing.getCube || me.charlvl < 18) { // No cube or team member is requesting cube or am not level 18 yet (required to teleport to the summoner).
				if (me.diff === 0)
					MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, false, 2);
				Communication.sendToList(HordeSystem.allTeamProfiles, "cube");
				Sequencer.runSequence("cube", false);
			}

			//Amulet - ok ; need handle merc
			if ((!me.getItem(521) && !me.getItem(91) && !me.getQuest(10, 0)) || !me.getQuest(11, 0)) { // No Amulet of the Viper/Horadric Staff and Horadric Staff quest (staff placed in orifice) is incomplete or The Tainted Sun quest is incomplete.
				if (me.charlvl >= HordeSettings.baalLvl && me.charlvl <= HordeSettings.diaLvlnm)
					MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, false, 2);
				Communication.sendToList(HordeSystem.allTeamProfiles, "amulet");
				Sequencer.runSequence("amulet", false);
			}

			//Summoner - ok
			if (!me.getQuest(13, 0) && me.getQuest(11 , 0) || !Pather.useWaypoint(46, true)) { // Summoner quest incomplete but The Tainted Sun is complete.
				Travel.travel(4); // Travel to all waypoints up to and including Arcane Sanctuary if I don't have them.

				Communication.sendToList(HordeSystem.allTeamProfiles, "summoner");
				
				Sequencer.runSequence("summoner", false);
			}

			//Tombs - ok
			if (!Party.hasReachedLevel(HordeSettings.tombsLvl) && me.diff === 0) {
				Travel.travel(5); // Travel to all waypoints up to and including Canyon Of The Magi if I don't have them.
				Communication.sendToList(HordeSystem.allTeamProfiles, "tombs");
				Sequencer.runSequence("tombs", false);
			}

			//staff - ok
			if (!me.getItem(92) && !me.getItem(91) && !me.getQuest(10, 0)) { // No Staff of Kings nor Horadric Staff and Horadric Staff quest (staff placed in orifice) not complete.
				
				Sequencer.runSequence("staff", false);
			}

			//Staff cubing - ok
			if (me.getItem(92) && me.getItem(521) && me.getItem(549)) { // Have The Staff of Kings, The Viper Amulet, and The Horadric Cube.
				Quest.cubeStaff();
			}

			//radament - ok
			if (!me.getQuest(9, 0)) { // && me.diff <= 2) { // Haven't finished Radament's Lair.
				Communication.sendToList(HordeSystem.allTeamProfiles, "radament");
				
				Sequencer.runSequence("radament", false);
			}

			//duriel - ok
			if (!me.getQuest(14, 0) && (Party.hasReachedLevel(HordeSettings.tombsLvl) || me.diff !== 0)) { // Haven't completed Duriel and team has reached level goal or this isn't normal difficulty.
				Communication.sendToList(HordeSystem.allTeamProfiles, "duriel");
				
				Sequencer.runSequence("duriel", false);
			}

		} else { // Not the leader.
			var j = 0;

			while (!me.getQuest(14, 0)) { // Haven't completed Duriel.
				if (Communication.Questing.cube) {
					if (me.diff === 0)
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Normal, false, 2);
						
					Sequencer.runSequence("cube", false);
					Communication.Questing.cube = false;
				}

				if (Communication.Questing.amulet) {
					if (me.charlvl >= HordeSettings.baalLvl && me.charlvl <= HordeSettings.diaLvlnm)
						MercTools.hireMerc(2, HordeSystem.build.mercAct2Nightmare, false, 2);
					
					Sequencer.runSequence("amulet", false);

					Communication.Questing.amulet = false;
				}

				if (Communication.Questing.summoner) {
					Sequencer.runSequence("summoner", false);

					Communication.Questing.summoner = false;
				}

				if (Communication.Questing.tombs) {
					Sequencer.runSequence("tombs", false);

					Communication.Questing.tombs = false;
				}

				if (Communication.Questing.radament) {
					Sequencer.runSequence("radament", false);

					Communication.Questing.radament = false;
				}

				if (Communication.Questing.duriel) {
					Sequencer.runSequence("duriel", false);

					Communication.Questing.duriel = false;
				}

				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}
		}
	}

	//act3
	if (!me.getQuest(23, 0) && me.getQuest(15, 0)) { // "Able to go to Act IV" (AKA haven't gone thru red portal to Act 4) is not done and Duriel is.
		Town.goToTown(3);
		if (Role.teleportingChar ) { // I am the Teleporting Sorc
			Travel.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.

			//figurine - ok
			if (Communication.Questing.teamFigurine) { // Someone has the Jade Figurine!
				Communication.sendToList(HordeSystem.allTeamProfiles, "figurine");
				Sequencer.runSequence("figurine", false);
			}

			//lamesen - ok
			if (!me.getQuest(17, 0)) { // Haven't completed Lam Esen's Tome.
				Sequencer.runSequence("lamesen", false);
			}

			//eye - ok
			if (!me.getItem(553) && !me.getItem(174) && !me.getQuest(18, 0)) { // Don't have Eye and don't have Khalim's Will and haven't completed Khalim's Will.
				Sequencer.runSequence("eye", false);
			}

			//heart - ok
			if (!me.getItem(554) && !me.getItem(174) && !me.getQuest(18, 0)) { // Don't have Heart and don't have Khalim's Will and haven't completed Khalim's Will.
				Sequencer.runSequence("heart", false);
			}

			//brain - ok
			if (!me.getItem(555) && !me.getItem(174) && !me.getQuest(18, 0)) { // Don't have Brain and don't have Khalim's Will and haven't completed Khalim's Will.
				Sequencer.runSequence("brain", false);
			}

			//travincal - ok
			if (me.getItem(174) || (me.getItem(553) && me.getItem(554) && me.getItem(555)) || !me.getQuest(20, 0) || !me.getQuest(21, 0)) { // Have Khalim's Will or have Eye, Heart, and Brain, or Golden Bird isn't complete, or The Blackened Temple isn't complete.
			//if (!me.getQuest(21, 0)) { // Have Khalim's Will or have Eye, Heart, and Brain, or Golden Bird isn't complete, or The Blackened Temple isn't complete.
				Communication.sendToList(HordeSystem.allTeamProfiles, "travincal");
				Sequencer.runSequence("travincal", false);
			}

			//Figurine - ok
			if (Communication.Questing.teamFigurine) { // Someone has the Jade Figurine!
				Communication.sendToList(HordeSystem.allTeamProfiles, "figurine");
				
				Sequencer.runSequence("figurine", false);
			}

			//mephisto - ok
			if (!me.getQuest(23, 0) && me.getQuest(18, 0) && me.getQuest(21, 0) ) { //no matter Golden bird && me.getQuest(20, 0)) { // Haven't been "Able to go to Act IV" yet and have completed Khalim's Will (AKA the stairs to Durance of Hate Level 1 are open), The Blackened Temple (AKA everyone can enter a Durance Of Hate Level 3 Town Portal), and Golden Bird.
				Communication.sendToList(HordeSystem.allTeamProfiles, "mephisto");

				Travel.travel(7); // Travel to Durance Of Hate Level 2 Waypoint if I don't have it.
				
				Sequencer.runSequence("mephisto", false);
			}
		} else {
			var j = 0;

			while (!me.getQuest(23, 0)) { // Haven't completed "Able to go to Act IV" (AKA haven't gone thru red portal to Act 4)
				if (Communication.Questing.LamEssen) {
					Sequencer.runSequence("lamesen", false);
					
					Communication.Questing.LamEssen = false;
				}

				if (Communication.Questing.travincal) {
					Sequencer.runSequence("travincal", false);

					Communication.Questing.travincal = false;
				}

				if (Communication.Questing.figurine) {
					Sequencer.runSequence("figurine", false);

					Communication.Questing.figurine = false;
				}

				if (Communication.Questing.mephisto) {
					Sequencer.runSequence("mephisto", false);

					Communication.Questing.mephisto = false;
				}

				if (Communication.Questing.redPortal) { // I'm a straggler stuck in Act 3. TeleportingChar is going to help me thru the Red Portal to Act 4!
					Sequencer.runSequence("mephisto", false);

					Communication.Questing.redPortal = false;
				}

				delay(250);

				if (j % 20 == 0) { // Check for Team Members every 5 seconds.
					Party.wholeTeamInGame();
				}

				j += 1;
			}
		}
	}

	//act4
	var runDiablo = 0; // Dark-f: for running baal

	if (me.getQuest(23, 0) && (!me.getQuest(28, 0) || !Party.hasReachedLevel(HordeSettings.diaLvl) || (me.diff === 1 && !Party.hasReachedLevel(HordeSettings.diaLvlnm)))) { // Have been to Act 4 and Diablo is not done or haven't reached the difficulty specific level requirement.
		Town.goToTown(4);

		if (Role.teleportingChar) { // I am the Teleporting Sorc
			var checkPartyAct;

			while (!checkPartyAct) { // Wait for everyone to get back to their Town, then record the lowest Town.
				checkPartyAct = Party.getLowestAct();

				delay(250);
			}

			if (checkPartyAct === 3) { // If the lowest Town is Act 3.
				Communication.sendToList(HordeSystem.allTeamProfiles, "red portal");
				Communication.Questing.redPortal = true;
				D2Bot.printToConsole("Horde: Helping straggler complete Act 3.", 5);
				
				Sequencer.runSequence("mephisto", false);
				Communication.Questing.redPortal = false;
			}

			Travel.travel(8);	// Travel to all waypoints up to and including River of Flame if I don't have them.
		}

		//izual - ok
		if (!me.getQuest(25, 0) || me.getQuest(25, 1)) { // The Fallen Angel is not done or it has been started.
			Sequencer.runSequence("izual", false);
		}

		
		//diablo - ok
		runDiablo = 1; // Dark-f: kill diablo first.

		Sequencer.runSequence("diablo", false);
		
		if (me.diff === 0 && !Party.hasReachedLevel(HordeSettings.diaLvl))
		{
			Farm.areasLevelling(HordeSettings.diaLvlAreas, HordeSettings.diaLvl);
		}	
		else if (me.diff === 1 && !Party.hasReachedLevel(HordeSettings.diaLvlnm))
		{
			Farm.areasLevelling(HordeSettings.diaLvlnmAreas, HordeSettings.diaLvlnm);
		} 
		else if (me.diff === 2 && !Party.hasReachedLevel(HordeSettings.diaLvlhell))
		{
			Farm.areasLevelling(HordeSettings.diaLvlhellAreas, HordeSettings.diaLvlhell);
		}
	}

	//act5
	if (me.gametype === 1 && Role.teleportingChar && me.getQuest(39, 0) && !getWaypoint(38) )
		Pather.getWP(129, false);

	//if (me.gametype === 1 && me.getQuest(28, 0) && ((me.diff === 0 && Party.hasReachedLevel(HordeSettings.diaLvl)) || (me.diff === 1 && Party.hasReachedLevel(HordeSettings.diaLvlnm)) || me.diff == 2)) { // Am an expansion character, Diablo is done, and the party has reached the difficulty specific HordeSettings.diaLvl requirement or it's Hell difficulty.
	if (me.gametype === 1 && me.getQuest(28, 0)) { //Dark-f
		Town.goToTown(5);
		if (!me.getQuest(37,1) && Role.teleportingChar) {
			Travel.travel(9);
		}

		//Shenk - ok
		if (!me.getQuest(35, 1) && !me.getQuest(35, 0)) {
			Sequencer.runSequence("shenk", false);
		}

		//Barbs - ok
		if ((!me.getQuest(36,0) || me.getQuest(36,1)) && me.diff < 2) {
			Sequencer.runSequence("barbrescue", false);
		}

		//anya - ok
		if ( !me.getQuest(37, 0) ) { //Dark-f
			Sequencer.runSequence("anya", false);
		}
		
		// Rite of Passage is not completed
		if (!me.getQuest(39, 0))
			Sequencer.runSequence("ancients", false);
		if (Role.teleportingChar && !getWaypoint(38))
			Pather.getWP(129, false);

		Sequencer.runSequence("baal", false);
		
		
		if (me.diff === 0 && !Party.hasReachedLevel(HordeSettings.baalLvl))
		{
			Farm.areasLevelling(HordeSettings.baalLvlAreas, HordeSettings.baalLvl);
		}			
		else if (me.diff === 1 && !Party.hasReachedLevel(HordeSettings.baalLvlnm))
		{
			Farm.areasLevelling(HordeSettings.baalLvlnmAreas, HordeSettings.baalLvlnm);
		} 
	}

	return true;
}
