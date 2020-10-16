/**
*	@filename	includes.js
*	@author		Adpist
*	@desc		includes whole horde library
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function includeHorde() {
	var folders = ["common", "settings"];
	
	folders.forEach( (folder) => {
		var files = dopen("libs/horde/"+folder+"/").getFiles();
		files.forEach( (file) => {
			if (!isIncluded("horde/"+folder+"/"+file)){
				if (!include("horde/"+folder+"/"+file)){
					throw new Error("Failed to include " + "horde/"+folder+"/"+file);
				}
			}
		});
	});
};