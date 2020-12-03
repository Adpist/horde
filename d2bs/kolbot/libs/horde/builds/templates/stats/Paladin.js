/**
*	@filename	Paladin.js
*	@author		Adpist
*	@desc		Paladin stats builds :
*					"Levelling" : vit + str (up to 156)
*					"Levelling" : vit + str (up to 110) + dex (up to 125) + energy (up to 75)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	
*/

var StatsBuilds = {
	"Levelling": [
		["vit", 40],
		["str", 60],
		["vit", 100],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 100],
		["vit", 180],
		["str", 125],
		["vit", 205],
		["str", 156],
		["vit", "all"]
	],
	
	"LevellingDex": [
		["vit", 40],
		["str", 60],
		["vit", 100],
		["dex", 35],//flail
		["str", 85],
		["vit", 150],
		["dex", 50],
		["str", 100],
		["vit", 180],
		["str", 125],
		["vit", 205],
		["dex", 100],
		["str", 156],
		["vit", 250],
		["dex", 150],
		["vit", "all"]
	],
	
	"LevellingMana": [
		["str", 40],
		["vit", 40],
		["str", 50],
		["vit", 50],
		["enr", 50],
		["str", 65],
		["vit", 75],
		["enr", 75],
		["vit", 100],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 110],
		["vit", 200],
		["vit", 250],
		["vit", "all"]	
	],
	
	"LevellingDexMana": [
		["vit", 40],
		["str", 60],
		["enr", 25],
		["vit", 100],
		["dex", 35],//flail
		["str", 85],
		["enr", 50],
		["vit", 150],
		["dex", 50],
		["str", 100],
		["vit", 180],
		["str", 125],
		["vit", 205],
		["dex", 100],
		["str", 156],
		["vit", 250],
		["dex", 150],
		["vit", "all"]
	],

	"LevellingLowMana": [
		["str", 40],
		["vit", 40],
		["str", 50],
		["vit", 50],
		["enr", 30],
		["str", 65],
		["vit", 75],
		["enr", 75],
		["vit", 100],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 110],
		["vit", 200],
		["vit", 250],
		["vit", "all"]
	]
	
};
