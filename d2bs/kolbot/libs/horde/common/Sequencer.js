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
	
	currentSequences: {},
	sequenceHistory: [],
	firstSequence: false,
	stopSequences: false,
	mfRun: false,
	
	//Sequence / requirements return values
	done: 2, 
	ok: 2,
	skip: 1,
	none: 0,
	stop: -1,
	fail: -2,
	
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
	
	runSequence: function(sequence, mfRun) {
		print(sequence + (mfRun ? " mf" : " questing"));
		
		var requirementResult = this.none, 
			sequenceInclude = "horde/sequences/"+sequence+".js",
			requirementFunction = sequence+"_requirements";
			
		if (!isIncluded(sequenceInclude)){
			if (!include(sequenceInclude)){
				throw new Error("Couldn't find sequence " + sequence);
			}
		}
		
		if (global[requirementFunction] === undefined) {
			HordeDebug.logScriptError(sequenceInclude + " doesn't contains a function " + requirementFunction);
			return this.stop;
		}
		
		//Check requirements
		requirementResult = global[sequence+"_requirements"](mfRun);
		
		if (requirementResult === this.ok) {
			requirementResult = global[sequence](mfRun);
		}
		
		return requirementResult;
	},
	
	runSequences: function(sequences, mfRun) {
		var sequencesList = Object.keys(sequences);
		
		this.currentSequences = sequences;
		this.mfRun = mfRun;
		this.firstSequence = true;
		this.stopSequences = false;
		
		sequencesList.forEach(function(sequence) {
			var sequenceResult, 
				conditions = Sequencer.currentSequences[sequence],
				skipSequence = false, 
				stopAfter = false;
			
			//Check history
			if (Sequencer.sequenceHistory.indexOf(sequence) !== -1) {
				skipSequence = true;
			}
			
			//Check user conditions
			if (conditions !== undefined) {
				if (conditions.stopBeforeIf !== undefined) {
					if (eval(conditions.stopBeforeIf)) {
						Sequencer.stopSequences = true;
					}
				}
				if (!Sequencer.stopSequences && conditions.skipIf !== undefined) {
					if (eval(conditions.skipIf)) {
						skipSequence = true;
					}
				}
			}
			
			if (!Sequencer.stopSequences && !skipSequence) {
			
				if (Sequencer.mfRun && !Sequencer.firstSequence){
					Farm.mfSync();
				}
				
				sequenceResult = Sequencer.runSequence(sequence, Sequencer.mfRun);
				
				if (Sequencer.mfRun && sequenceResult === Sequencer.done){
					Town.doChores();
				}
				
				switch (sequenceResult)
				{
					case Sequencer.done:
						Sequencer.sequenceHistory.push(sequence);
						Sequencer.firstSequence = false;
						break;
					
					case Sequencer.skip:
						break;
						
					case Sequencer.stop:
						stopAfter = true;
						break;
						
					case Sequencer.fail:
						HordeDebug.logScriptError("Sequence " + sequence + " failed");
						break;
					
					case Sequencer.none:
					default:
						HordeDebug.logScriptError("Sequence " + sequence + " returned unhandled completion state");
						break;
				}
			}
			
			if (!stopAfter) {
				if (conditions !== undefined) {
					if (conditions.stopAfterIf !== undefined) {
						if (eval(conditions.stopAfterIf)) {
							stopAfter = true;
						}
					}
				}
			}
			
			if (stopAfter) {
				this.stopSequences = true;
			}
		});
	},
	
	run: function() {
		this.sequenceHistory = [];
		
		this.runSequences(this.beforeSequences[me.diff], true);
		this.runSequences(this.questSequences[me.diff], false);
		this.runSequences(this.afterSequences[me.diff], true);
	}
};