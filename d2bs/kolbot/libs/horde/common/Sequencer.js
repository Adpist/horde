/**
*	@filename	Sequencer.js
*	@author		Adpist
*	@desc		Sequences management
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

var Sequencer = {
	questSequences: {},
	beforeSequences: {},
	afterSequences: {},
	
	//Leader data
	currentSequences: {},
	sequenceHistory: [],
	firstSequence: false,
	
	//Common
	mfRun: false,
	
	//Follower data
	nextSequence: "",
	endGame: false,
	
	//Sequence / requirements return values
	done: 3, 
	ok: 2,
	skip: 1,
	none: 0,
	stop: -1,
	fail: -2,
	
	/* Common */
	setupSequences: function(sequencesProfile){
		var sequenceProfileInclude = "horde/settings/sequences/"+ sequencesProfile+".js";
		if (!isIncluded(sequenceProfileInclude)){
			if (!include(sequenceProfileInclude)){
				throw new Error("Couldn't find sequences profile" + sequencesProfile);
			}
		}
		
		this.questSequences = Sequences.quests;
		this.beforeSequences = Sequences.beforeQuests;
		this.afterSequences = Sequences.afterQuests;
	},
	
	preSequence: function(sequence, mfRun) {
		if (!this.firstSequence){
			if (this.mfRun) {
				Farm.mfSync();
			}
		}
	},
	
	postSequence: function(sequence, mfRun, sequenceResult) {
		//Post completed sequence
		if (sequenceResult === Sequencer.done){
			if (this.mfRun) {
				Town.doChores();
			}
		}
		
		switch (sequenceResult)
		{
			case Sequencer.done:
				Sequencer.sequenceHistory.push(sequence);
				Sequencer.firstSequence = false;
				break;
			
			case Sequencer.skip:
			case Sequencer.stop:
				break;
				
			case Sequencer.fail:
				HordeDebug.logScriptError("Sequence " + sequence + " failed");
				break;
			
			case Sequencer.none:
			default:
				HordeDebug.logScriptError("Sequence " + sequence + " returned unhandled completion state : " + sequenceResult);
				break;
		}
	},
	
	runSequence: function(sequence, mfRun) {		
		var sequenceResult = Role.isLeader ? this.none : this.ok,
			sequenceInclude = "horde/sequences/"+sequence+".js",
			requirementFunction = sequence+"_requirements";
			
		if (!isIncluded(sequenceInclude)){
			if (!include(sequenceInclude)){
				throw new Error("Couldn't find sequence " + sequence);
			}
		}
		
		if (Role.isLeader) {
			if (global[requirementFunction] === undefined) {
				HordeDebug.logScriptError(sequenceInclude + " doesn't contains a function " + requirementFunction);
				return this.stop;
			}
			
			//Check requirements
			try {
				sequenceResult = global[sequence+"_requirements"](mfRun);
			} catch(error) {
				HordeDebug.logScriptError("Error while validating " + sequence+"_requirements" + " : " + error);
			}

			//TODO : if skip, ask others if they need
		}
		
		//If we can do the sequence
		if (sequenceResult === this.ok) {
			print("" + (Role.isLeader ? "[Leader]" : "[Follower]") + sequence + (mfRun ? " mf" : " questing"));
		
			if (Role.isLeader) {
				Communication.sendToList(HordeSystem.allTeamProfiles, "run " + sequence + (mfRun ? " mf" : ""));
			}
			
			//run sequence
			this.preSequence(sequence, mfRun);
			try {
				sequenceResult = global[sequence](mfRun);
			} catch(error) {
				HordeDebug.logScriptError("Error while running sequence " + sequence + " : " + error);
			}
			this.postSequence(sequence, mfRun, sequenceResult);
		}
		
		return sequenceResult;
	},
	
	/* Leader */
	checkBeforeSequence: function(sequence, userConditions) {
		var result = this.ok;
		
		//Check history
		if (Sequencer.sequenceHistory.indexOf(sequence) !== -1) {
			result = this.skip;
		}
		
		//Check user conditions
		if (userConditions !== undefined) {
			if (userConditions.stopBeforeIf !== undefined) {
				if (eval(userConditions.stopBeforeIf)) {
					result = this.stop;
				}
			}
			if (result != this.stop && userConditions.skipIf !== undefined) {
				if (eval(userConditions.skipIf)) {
					result = this.skip;
				}
			}
		}
		
		return result;
	},
	
	checkAfterSequence: function(sequence, userConditions, currentResult) {
		var result = currentResult;
		
		if (userConditions !== undefined) {
			if (userConditions.stopAfterIf !== undefined) {
				if (eval(userConditions.stopAfterIf)) {
					result = this.stop;
				}
			}
		}
		
		return result;
	},
	
	runSequences: function(sequences, mfRun) {
		var sequencesList = Object.keys(sequences);
		this.currentSequences = sequences;
		this.mfRun = mfRun;
		
		sequencesList.every(function(sequence) {
			var sequenceResult, 
				conditions = Sequencer.currentSequences[sequence];
			
			sequenceResult = Sequencer.checkBeforeSequence(sequence, conditions);			
			
			if (sequenceResult === Sequencer.ok) {
				sequenceResult = Sequencer.runSequence(sequence, Sequencer.mfRun);
			}
			
			if (sequenceResult !== Sequencer.stop) {
				sequenceResult = Sequencer.checkAfterSequence(sequence, conditions, sequenceResult);
			}
			
			return sequenceResult !== Sequencer.stop;
		});
	},
	
	runLeader: function() {
		this.runSequences(this.beforeSequences[me.diff], true);
		this.runSequences(this.questSequences[me.diff], false);
		this.runSequences(this.afterSequences[me.diff], true);
		
		Communication.sendToList(HordeSystem.allTeamProfiles, "end");
	},
	
	/* Follower */
	runFollower: function() {
		while (!this.endGame) {
			if (this.nextSequence !== "") {
				var sequenceToRun = this.nextSequence, sequenceResult = this.none;
				this.nextSequence = "";//Be ready to receive next before starting
				
				sequenceResult = this.runSequence(sequenceToRun, this.mfRun);
			}
		}
	},
	
	receiveSequenceRequest: function(sequence, mfRun) {
		this.nextSequence = sequence;
		this.mfRun = mfRun;
	},
	
	onReceiveEnd: function() {
		this.endGame = true;
	},
	
	/* Main */
	run: function() {
		this.sequenceHistory = [];
		this.firstSequence = true;
		this.endGame = false;
		
		if (Role.isLeader) {
			this.runLeader();
		} else {
			this.runFollower();
		}
	}
};