/**
*	@filename	Sorceress.js
*	@author		Adpist
*	@desc		Sorceress stats builds :
*					"Levelling" : few points in energy (up to 30)
*					"LevellingMana" : more energy (up to 75)
*					"MonarchStr" : vit + str (up to 156)
*					"NoStr" : full vit (str is provided by gear)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	
*/

var StatsBuilds = {
	"Levelling" : [
		["str", 15],
		["vit", 30],
		["str", 25],
		["vit", 45],
		["str", 35],
		["vit", 55],
		["enr", 30],
		["str", 45],
		["vit", 75],
		["str", 60],
		["vit", 125],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 100],
		["vit", 200],
		["str", 125],
		["vit", 225],
		["str", 156],
		["vit", "all"]
	],
	
	"LevellingMana": [
		["str", 15],
		["vit", 30],
		["str", 25],
		["vit", 45],
		["str", 35],
		["vit", 55],
		["enr", 40],
		["str", 45],
		["vit", 75],
		["enr", 55],
		["str", 60],
		["vit", 125],
		["enr", 75],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 100],
		["vit", 200],
		["str", 125],
		["vit", 225],
		["str", 156],
		["vit", "all"]	
	],
	
	"MonarchStr": [
		["str", 15],
		["vit", 30],
		["str", 25],
		["vit", 45],
		["str", 35],
		["vit", 55],
		["str", 45],
		["vit", 75],
		["str", 60],
		["vit", 125],
		["str", 85],
		["vit", 150],
		["dex", 35],//hoto
		["str", 100],
		["vit", 200],
		["str", 125],
		["vit", 225],
		["str", 156],
		["vit", "all"]	
	],
	
	"NoStr": [
		["vit", "all"]	
	]
};