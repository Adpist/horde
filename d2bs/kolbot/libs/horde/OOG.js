/**
*	@filename	OOG.js
*	@author		Adpist
*	@desc		Out of game stuff for horde
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeOOG = {

	findCharacterInfo: function(profile) {
		if (profile !== undefined) {
			print("Search character info for profile : " + profile);
			var charSettings = HordeSystem.team.profiles[profile];
			var info = {
				account: charSettings.account,
				charName: charSettings.character,
				ladder: HordeSystem.team.ladder,
				hardcore: HordeSystem.team.hardcore,
				expansion: HordeSystem.team.expansion,
				charClass: charSettings.className
			};
			
			return info;
		}
		
		return false;
	},
	
	tryCreateCharacter: function(profile, soloChar) {
		if (soloChar === undefined) {
			soloChar = false;
		}
		
		if (profile)
		{
			var charInfo = this.findCharacterInfo(profile);
			if(charInfo)
			{
				if (ControlAction.getCharacters().length >= 8) { // premade account that's already full
					D2Bot.printToConsole("found char info but account is full. can't create char", 9);
					return false;
				}

				if (soloChar) {
					if (!ControlAction.makeSoloCharacter(charInfo)) {
						D2Bot.printToConsole("failed to create character", 9);
						return false;
					}
				} else {
					if (!!ControlAction.makeCharacter(charInfo)) {
						D2Bot.printToConsole("failed to create character", 9);
						return false;
					}
				}				

				return true;
			}
			else
			{
				D2Bot.printToConsole("Couldn't find char info and character doesn't exist", 9);
			}
		}
		
		return false;
	},
	
	findCharacterConfig: function(profile) {
		var files = dopen("libs/config/").getFiles(), result = undefined;
		for (var i = 0 ; i < files.length ; i += 1){
			var file = files[i];
			if (file.indexOf(".js") !== -1) {
				var fileName = file.split('.');
				if (fileName.length === 3) {
					if (fileName[1] === profile) {
						if (result === undefined) {
							result = file;
						} else {
							throw new Error("Horde : there is multiple class for the same profile, this is not supported");
						}
					}
				}
			}
		}
		return result;
	}
};