/**
*	@filename	trist.js
*	@author		Adpist
*	@desc		Clear tristram
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/


function trist_requirements(mfRun) {
	/***** REQUIREMENTS ******/
	if (!mfRun) {
		HordeDebug.logUserError("trist", "trist is a mf run");
		return Sequencer.skip;//Skip: questing run not supported
	}
	
	if (!me.getQuest(4,0)) {
		return Sequencer.skip;//Skip: cain quest isn't done
	}
	/***** END OF REQUIREMENTS ******/
	
	return Sequencer.ok;//We can process sequence
}

function trist(mfRun) {
	var coord, i, wasTeleporting,
		xx = [ 25175, 25147, 25149, 25127, 25128, 25150, 25081, 25115],
		yy = [ 5187,  5201,  5172,  5188,  5144,  5123,  5137, 5070];
	
	wasTeleporting = Pather.teleport;
	Pather.teleport = false;
	
	Pather.useWaypoint(4);

	Party.waitForMembers();

	Precast.doPrecast(true);
	Buff.Bo();
	Pather.moveToPreset(me.area, 1, 737, 0, 0, true, true);

	try{
		Attack.clear(20, 0, getLocaleString(2872)); // Rakanishu
	} catch (e) {
		Attack.clear(25);
	}

	Pather.moveToPreset(me.area, 1, 737, 0, 0, true, false); // Move back to stones after clearing.

	for (i = 0; i < 5; i += 1) {
		if (Pather.usePortal(38)) {
			break;
		}

		delay(1000);
	}

	Party.waitForMembers();
	Precast.doPrecast(true);
	Buff.Bo();
	for (coord = 0; coord < xx.length; coord += 1) {
		Pather.moveTo(xx[coord], yy[coord], 3, true);

		Attack.clear(20);
	}
	
	Pather.teleport = wasTeleporting;
	
	Role.backToTown();

	return Sequencer.done;
}