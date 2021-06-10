/**
*	@filename	Paladin.js
*	@author		Adpist
*	@desc		Paladin skill builds :
*					"HammerConcentration" : Hammer with concentration aura
*					"HammerConvition" : Hammer with conviction aura
*					"UberSmiter" : Smiter build
*	@credits	Adpist, Mark, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*	
*/

var SkillsBuilds = {
	"HammerConcentration": [
		[98, 1, false], //Might
		[97, 1, false], //Smite
		[99, 1, false], //Prayer
		[101, 1, false], //Holy Bolt
		[104, 1, false], //Defiance
		[107, 1, false], //Charge
		[109, 1, false], //Cleansing
		[108, 2, false], //Blessed aim
		[112, 1, false], //Blessed Hammer
		[113, 1, false], //Concentration
		[115, 1, false], //Vigor
		[112, 2, false], //Blessed Hammer
		[113, 2, false], //Concentration
		[112, 3, false], //Blessed Hammer
		[113, 3, false], //Concentration
		[112, 4, false], //Blessed Hammer
		[113, 4, false], //Concentration
		[112, 5, false], //Blessed Hammer
		[113, 5, false], //Concentration
		[112, 6, false], //Blessed Hammer
		[117, 1, false], //Holy shield
		[120, 1, false], //Meditation
		[112, 10, false], //Blessed Hammer
		[108, 3, false], //Blessed aim
		[112, 20, false], //Max Blessed Hammer
		[117, 5, false], //Holy shield
		[113, 20, false], //Max Concentration
		[115, 20, false], //Max Vigor
		[117, 10, false], //Holy shield
		[108, 20, false], //Max blessed aim
		[117, 20, false] //Max Holy shield
	],
	
	"HammerConviction": [
		[98, 1, false], //Might
		[97, 1, false], //Smite
		[99, 1, false], //Prayer
		[101, 1, false], //Holy Bolt
		[104, 1, false], //Defiance
		[107, 1, false], //Charge
		[109, 1, false], //Cleansing
		[108, 2, false], //Blessed aim
		[112, 1, false], //Blessed Hammer
		[103, 1, false], //Thorns
		[115, 1, false], //Vigor
		[112, 5, false], //Blessed Hammer
		[102, 1, false], //Holy Fire
		[112, 4, false], //Blessed Hammer
		[114, 1, false], //Holy Freeze
		[112, 6, false], //Blessed Hammer
		[117, 1, false], //Holy shield
		[120, 1, false], //Meditation
		[119, 1, false], //Sanctuary
		[112, 10, false], //Blessed Hammer
		[123, 10, false], //Conviction
		[112, 15, false], //Blessed Hammer
		[123, 15, false], //Conviction
		[112, 20, false], //Max blessed Hammer
		[123, 20, false], //Max Conviction
		[117, 5, false], //Holy shield
		[115, 20, false], //Max Vigor
		[117, 10, false], //Holy shield
		[108, 20, false], //Max blessed aim
		[117, 20, false] //Max Holy shield
	],

	"HammerSalvation": [
		[99, 1, false], //Prayer
		[98, 1, false], //Might
		[97, 1, false], //Smite
		[101, 1, false], //Holy Bolt
		[104, 1, false], //Defiance
		[107, 1, false], //Charge
		[109, 1, false], //Cleansing
		[108, 2, false], //Blessed aim
		[112, 1, false], //Blessed Hammer
		[115, 5, false], //Vigor
		[112, 5, false], //Blessed Hammer
		[117, 1, false], //Holy shield
		[112, 10, false], //Blessed Hammer
		[125, 20, false], //Max Salvation
		[112, 20, false], //Max blessed Hammer
		[117, 5, false], //Holy shield
		[115, 20, false], //Max Vigor
		[117, 10, false], //Holy shield
		[108, 20, false], //Max blessed aim
		[117, 20, false] //Max Holy shield
	],
	
	"Smiter": [
		[97, 1, false], //Smite
		[104, 1, false], //Defiance
		[122, 1, false], //fanatism
		[117, 1, false], //Holy shield
		[125, 1, false], //Salvation
		[124, 1, false], //Redemption
		[97, 20, true], //max smite
		[125, 20, true], //max Salvation
		[117, 20, true], //max Holy shield
		[122, 20, true], //max fanatism
		[110, 10, true], //Resist Lightning
		[100, 10, true], //Resist fire
		[104, 20, true] //rest Defiance
	],
	
	"UberSmiter": [
		[97, 1, false], //Smite
		[104, 1, false], //Defiance
		[122, 1, false], //fanatism
		[117, 1, false], //Holy shield
		[125, 1, false], //Salvation
		[97, 20, true], //max smite
		[122, 20, true], //max fanatism
		[117, 20, true], //max Holy shield
		[104, 20, true], //max Defiance
		[110, 10, true], //Resist Lightning
		[100, 10, true], //Resist fire
		[110, 20, true] //Max Resist Lightning
	]
		
};
