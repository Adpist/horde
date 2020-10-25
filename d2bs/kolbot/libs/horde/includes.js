/**
*	@filename	includes.js
*	@author		Adpist
*	@desc		includes whole horde library
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function includeHorde() {
	//TEMP : remove full settings folder until team settings are moved
	var folders = ["common", "tools", "settings"];
	
	if (!isIncluded("horde/settings/Settings.js")){
		if (!include("horde/settings/Settings.js")){
			throw new Error("Failed to include horde/settings/Settings.js");
		}
	}
	
	folders.forEach( (folder) => {
		var files = dopen("libs/horde/"+folder+"/").getFiles();
		files.forEach( (file) => {
			if (file.indexOf(".js") !== -1) {
				if (!isIncluded("horde/"+folder+"/"+file)){
					if (!include("horde/"+folder+"/"+file)){
						throw new Error("Failed to include " + "horde/"+folder+"/"+file);
					}
				}
			}
		});
	});
	
	if (!isIncluded("horde/OOG.js")){
		if (!include("horde/OOG.js")){
			throw new Error("Failed to include horde/OOG.js");
		}
	}
};