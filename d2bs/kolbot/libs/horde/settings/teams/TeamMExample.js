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
            runewordsProfile: "mTeamRunewords"
        },
        "sorc-002": {
            account: "account",
            role: "follower",
            className: "sorceress",
            character: "character",
            build: "firetiered",
            runewordsProfile: "mTeamRunewords"
        },
        "sorc-003": {
            account: "account",
            role: "follower",
            className: "sorceress",
            character: "character",
            build: "lighttiered",
            runewordsProfile: "mTeamRunewords"
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
            build: "hammerconcentrationtiered",
            runewordsProfile: "mTeamRunewordsPala"
        },
        "pala-002": {
            account: "account",
            role: "follower",
            className: "paladin",
            character: "character",
            build: "hammerconvictiontiered",
            runewordsProfile: "mTeamRunewordsPala"
        },
        "drui-001": {
            account: "account",
            role: "follower",
            className: "druid",
            character: "character",
            build: "elementaltiered",
            runewordsProfile: "mTeamRunewords"
        },
        "necr-001": {
            account: "account",
            role: "follower",
            className: "necromancer",
            character: "character",
            build: "corpseresisttiered",
            runewordsProfile: "mTeamRunewords"
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

    ladder: true, //Is ladder team
    hardcore: false, //Is Hardcore team
    expansion: true, //Is Xpac team
    sequencesProfile: "mTeamBuilder", //The sequence profile to use for this team
	walkChaosSancNorm: true, //Disable tele for clear of Chaos sanc in Normal
	walkChaosSancNm: true, //Disable tele for clear of Chaos sanc in NM
	walkChaosSancHell: true, //Disable tele for clear of Chaos sanc in Hell
	walkThroneRoomNorm: true, //Disable tele for clear of Throne Room in Normal
    minGameTime: 220, //min game time to use for the whole team
    maxGameTime: 0, //max game time to use for whole team,
    quitList: true, //quit when any team mate leave the game
    manualPlay: false, //Use manual teleporter / follower script on others
	disableMercRebuy: true, //Never re-buy (ONLY Revive) merc except on Norm -> Nightmare
    debug: false //debug mode
};
