/**
*	@filename	Waypoint.js
*	@author		Adpist
*	@desc		Waypoint management & synchro
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var HordeDebug = {
	logUserError: function(script, error){
		if (error === undefined){
			D2Bot.printToConsole("[UserError]:" + script, 6);
			print("[UserError]:" + script);
		}
		else{
			D2Bot.printToConsole("[UserError:" + script + "]:" + error, 6);
			print("[UserError:" + script + "]:" + error);
		}
	},
	
	logScriptError: function(script, error){
		if (error === undefined){
			D2Bot.printToConsole("[ScriptError]:" + script, 6);
			print("[ScriptError]:" + script);
		}
		else{
			D2Bot.printToConsole("[ScriptError:" + script + "]:" + error, 6);
			print("[ScriptError:" + script + "]:" + error);
		}
	},
	
	logScriptInfo: function(script, msg){
		if (msg === undefined){
			D2Bot.printToConsole("[ScriptInfo]:" + script);
			print("[ScriptInfo]:" + script);
		}
		else{
			D2Bot.printToConsole("[ScriptInfo:" + script + "]:" + msg);
			print("[ScriptInfo:" + script + "]:" + msg);
		}
	}
};