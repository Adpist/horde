/**
*	@filename	Waypoint.js
*	@author		Adpist
*	@desc		Waypoint management & synchro
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeDebug = {

	logInternal: function(category, script, error, color) {
		if (error === undefined){
			if (color === undefined) {
				D2Bot.printToConsole("[" + category + "]:" + script);
			} else {
				D2Bot.printToConsole("[" + category + "]:" + script, color);
			}
			print("[" + category + "]:" + script);
		}
		else{
			if (color === undefined) {
				D2Bot.printToConsole("[" + category + "]:" + script + "]:" + error);
			} else {
				D2Bot.printToConsole("[" + category + "]:" + script + "]:" + error, color);
			}
			print("[" + category + "]:" + error);
		}
	},
	
	logUserError: function(script, error){
		this.logInternal("UserError", script, error, 6);
	},
	
	logScriptError: function(script, error){
		this.logInternal("ScriptError", script, error, 6);
	},
	
	logScriptInfo: function(script, msg){
		this.logInternal("ScriptInfo", script, error);
	},
	
	logCriticalError: function(script, error) {
		this.logInternal("CriticalError", script, error, 9);
	}
};