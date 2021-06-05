/**
*	@filename	Sorceress.js
*	@author		Adpist
*	@desc		Sorceress skill builds :
*					"Cold" : Blizzard sorc
*					"Light" : Lightning sorc
*					"Fire" : Meteor sorc
*					"TeleChant" : teleport, enchant & static sorc. a bit passive but efficient navigation
*					"Meteorb" : Fireball / meteor / frozen orb sorc
*	@credits	Adpist, Mark, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*
*/

var SkillsBuilds = {
	"Cold": [
		[39, 4, false], //ice bolt
		[40, 1, false], //frozen armor
		[37, 1, false], //Warmth
		[42, 1, false], //Static
		[54, 1, false], //Teleport
		[45, 7, false], //Level ice blast to keep 2 points at level 18 for tp & glacial spike
		[55, 1, true], //learn Glacial Spike
		[55, 3, false], //level Glacial Spike
		[59, 7, false], //Level blizzard
		[65, 1, false], //Cold mastery
		[59, 10, false], //Level Blizzard
		[65, 7, false], // Cold Mastery
		[59, 20, false], //Max Blizzard
		[55, 10, false], //level Glacial Spike
		[65, 17, false], //Max Cold Mastery
		[55, 15, false], //level Glacial Spike
		[45, 10, false], //level Ice blast
		[55, 20, false], //Max glacial spike
		[45, 20, false], //Max ice blast
		[39, 20, false] //Max ice bolt
	],

	"Light": [
		[38, 1, false], //Charged bolt
		[40, 1, false], //frozen armor
		[37, 1, false], //Warmth
		[38, 2, false], //Charged bolt
		[42, 2, false], //Static
		[42, 3, false], //Static
		[49, 1, false], //Lightning
		[48, 1, false],  //Nova
		[38, 4, false], //Charged bolt
		[54, 1, false], //Teleport
		[53, 10, false], //Chain lightning
		[63, 1, false], //Lightning mastery
		[49, 5, false], //lightning
		[53, 20, false], //Max Chain lightning
		[49, 20, false], //Max lightning
		[63, 20, false], //Max lightning mastery
		[38, 20, false], //Max Charged Bolt
		[48, 20, false]  //Max Nova
	],

	"Fire": [
		[36, 1, false], //fire bolt
		[40, 1, false], //frozen armor
		[37, 1, false], //Warmth
		[36, 4, false], //fire bolt
		[42, 1, false], //Static
		[43, 1, false], //Telekinesus
		[47, 1, false], //fire ball
		[41, 1, false], //Inferno
		[46, 1, false], //blaze
		[47, 3, false], //fire ball
		[54, 1, false], //Teleport
		[47, 10, false], //fire ball
		[51, 1, false], //fire wall
		[56, 6, false], //meteor
		[61, 1, false], //fire mastery
		[56, 10, false], // meteor
		[61, 10, false], //fire mastery
		[56, 20, false], //max meteor
		[61, 20, false], //max fire mastery
		[47, 20, false], //max fire ball
		[36, 20, false], //max fire bolt
		[41, 20, false] //max Inferno
	],

	"TeleChant": [
		[40, 1, false], //frozen armor
		[37, 1, false], //Warmth
		[42, 1, false], //Static
		[54, 1, false], //Teleport
		[52, 1, false], //Enchant
		[61, 1, false], //fire mastery
		[54, 12, false], //level Teleport
		[42, 10, false], //level Static
		[37, 10, false], //level warmth
		[52, 20, true], //Max Enchant
		[37, 20, true], //Max Warmth
		[61, 20, true], //Max fire mastery
		[42, 20, false], //Max Teleport
		[42, 20, false] //Max Static
	],

	"Meteorb":[
		[36, 4, false], //fire bolt
		[40, 1, false], //frozen armor
		[37, 1, false], //Warmth
		[42, 1, false], //Static
		[47, 1, false], //Fireball
		[54, 1, false], //Teleport
		[64, 1, false], //Frozen Orb
		[56, 1, false], //Meteor
		[65, 1, false], //Cold mastery
		[61, 1, false], //Fire mastery
		[47, 12, true], //Level Fireball
		[64, 20, false], //Max Frozen orb
		[65, 15, true], //Max Cold Mastery
		[47, 20, true], //Max Fireball
		[56, 20, true], //Max Meteor
		[61, 4, true], //Fire mastery
		[36, 5, true], //fire bolt
		[61, 5, true], //Fire mastery
		[36, 6, true], //fire bolt
		[61, 6, true], //Fire mastery
		[36, 7, true], //fire bolt
		[61, 7, true], //Fire mastery
		[36, 8, true], //fire bolt
		[61, 8, true], //Fire mastery
		[36, 9, true], //fire bolt
		[61, 9, true], //Fire mastery
		[36, 10, true], //fire bolt
		[61, 10, true], //Fire mastery
		[36, 11, true], //fire bolt
		[61, 11, true], //Fire mastery
		[36, 12, true], //fire bolt
		[61, 12, true], //Fire mastery
		[36, 13, true], //fire bolt
		[61, 13, true], //Fire mastery
		[36, 14, true], //fire bolt
		[61, 14, true], //Fire mastery
		[36, 15, true], //fire bolt
		[61, 15, true], //Fire mastery
		[36, 16, true], //fire bolt
		[61, 16, true], //Fire mastery
		[36, 17, true], //fire bolt
		[61, 17, true], //Fire mastery
		[36, 18, true], //fire bolt
		[61, 18, true], //Fire mastery
		[36, 19, true], //fire bolt
		[61, 19, true], //Fire mastery
		[36, 20, true], //fire bolt
		[61, 20, true] //Fire mastery
	]
};