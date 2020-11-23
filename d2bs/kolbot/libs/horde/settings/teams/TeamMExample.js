/**
 *	@filename	MTeamSettings.js
 *	@author		Adpist M
 *	@desc		8 Player example, fill out correct profile names account and character to use
 *	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
 *   https://www.fantasynamegenerators.com/orc_names.php
 */
const HordeTeam = {
    profiles: {
        "sorc-001": {
            account: "account",
            role: "teleport",
            className: "sorceress",
            character: "character",
            build: "coldtiered",
            runewordsProfile: "mTeamRunewords",
			gearPriority: 1
        },
        "sorc-002": {
            account: "account",
            role: "follower",
            className: "sorceress",
            character: "character",
            build: "lighttiered",
            runewordsProfile: "mTeamRunewords",
			gearPriority: 3
        },
        "asin-001": {
            account: "account",
            role: "follower",
            className: "assassin",
            character: "character",
            build: "Trapsin",
            runewordsProfile: "mTeamRunewordsSin",
			gearPriority: 4
        },
        "barb-001": {
            account: "account",
            role: "bo",
            className: "barbarian",
            character: "character",
            build: "shoutingtank",
            runewordsProfile: "mTeamRunewords"
        },
        "pala-001": {
            account: "account",
            role: "follower",
            character: "character",
            className: "paladin",
            build: "hammersalvationtiered",
            runewordsProfile: "mTeamRunewordsPala",
			gearPriority: 2
        },
        "pala-002": {
            account: "account",
            role: "follower",
            className: "paladin",
            character: "character",
            build: "hammerconvictiontiered",
            runewordsProfile: "mTeamRunewordsPala",
			gearPriority: 2
        },
        "drui-001": {
            account: "account",
            role: "follower",
            className: "druid",
            character: "character",
            build: "elementaltiered",
            runewordsProfile: "mTeamRunewordsSin",
			gearPriority: 5
        },
        "necr-001": {
            account: "account",
            role: "follower",
            className: "necromancer",
            character: "character",
            build: "corpseresisttiered",
            runewordsProfile: "mTeamRunewords",
			gearPriority: 6
        }
    },

    difficulties: {
        0: { //Normal settings
            stayIf: "TeamData.getLowestLevel() < 42",
            killBaalIf: "true"
        },

        1: { //Nightmare settings
            stayIf: "TeamData.getLowestLevel() < 75",
            killBaalIf: "true"
        },

        2: { //Hell settings
            killBaalIf: "true"
        }
    },
	
	commonPickits: 	[
						{pickit: "kolton.nip"},
						{pickit: "horde/merc.act1.normal.xpac.nip", condition:"me.diff == 0 && !me.getQuest(7,0)"}
					],

    ladder: true, //Is ladder team
    hardcore: false, //Is Hardcore team
    expansion: true, //Is Xpac team
    sequencesProfile: "mTeamBuilder", //The sequence profile to use for this team
	enableGearSharing: "Party.hasReachedLevel(18)", //Condition to activate gear sharing. put "false" to disable gear sharing
	walkChaosSancNorm: true, //Disable tele for clear of Chaos sanc in Normal
	walkChaosSancNm: true, //Disable tele for clear of Chaos sanc in NM
	walkChaosSancHell: true, //Disable tele for clear of Chaos sanc in Hell
	walkThroneRoomNorm: true, //Disable tele for clear of Throne Room in Normal
    minGameTime: 220, //min game time to use for the whole team
    maxGameTime: 0, //max game time to use for whole team,
    quitList: true, //quit when any team mate leave the game
	instantQuitList: false,//Set this to true if you want all bots to leave instantly when a quit is triggered (ex : quitList on chicken in hardcore)
    manualPlay: false, //Use manual teleporter / follower script on others
	disableMercRebuy: true, //Never re-buy (ONLY Revive) merc except on Norm -> Nightmare
    debug: false //debug mode
};
