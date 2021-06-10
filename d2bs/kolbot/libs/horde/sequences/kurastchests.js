/**
*	@filename	kurastchests.js
*	@author		m
*	@desc		do kurast chests
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function kurastchests_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!me.getQuest(15, 0)) {
		if (mfRun){
			HordeDebug.logUserError("kurastchests", "Can't be done before duriel");
		}
		return mfRun ? Sequencer.skip : Sequencer.stop;//Stop : still Act 2
	}
	if (!mfRun){
		if (me.getQuest(23,0)) { //skip once out of act3 for quest line
			return Sequencer.skip;
		}
	}
	/***** END OF REQUIREMENTS ******/

	return Sequencer.ok;//We can process sequence
}

function kurastchests(mfRun) {
	Party.wholeTeamInGame();

	if (!me.inTown) {
		Town.goToTown(3);
	}
	if (Role.teleportingChar) {
		var ogCainIDEnable = Config.CainID.Enable;
		var ogCainIDMinGold = Config.CainID.MinGold;
		var ogCainIDMinUnids = Config.CainID.MinUnids;
		var ogHealHP = Config.HealHP;
		var ogHealMP = Config.HealMP;
		var ConfigChestManiaAct3 = [79, 80, 81];//skip sewers when in questline
		if (!mfRun){
			Config.HealHP = 60; // Go to a healer if under designated percent of life.
			Config.HealMP = 0; // Go to a healer if under designated percent of mana.
			Config.CainID.Enable = true; // Identify items at Cain
			Config.CainID.MinGold = 50000; // Minimum gold (stash + character) to have in order to use Cain.
			Config.CainID.MinUnids = 1; // Minimum number of unid items in order to use Cain.
		} else {
			ConfigChestManiaAct3 = [79, 80, 81, 92,93];
		}
		Travel.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.
		Pickit.pickItems();

		for (var i = 0; i < ConfigChestManiaAct3.length; i += 1) {
			Pather.journeyTo(ConfigChestManiaAct3[i]);
			Precast.doPrecast(false);
			Misc.openChestsInArea(ConfigChestManiaAct3[i]);
		}

		Config.CainID.Enable = ogCainIDEnable;
		Config.CainID.MinGold = ogCainIDMinGold;
		Config.CainID.MinUnids = ogCainIDMinUnids;
		Config.HealHP = ogHealHP;
		Config.HealMP = ogHealMP;

		Town.goToTown();
	} else {
		Town.goToTown(3);
	}
	return Sequencer.done;
}
