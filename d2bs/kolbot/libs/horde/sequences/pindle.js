/**
*	@filename	pindle.js
*	@author		Adpist
*	@desc		kill pindle (mf only)
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/

function pindle(mfRun) {

	if (!mfRun) {
		return true;
	}
	
	print("mf pindle");
	
	Town.goToTown(5);
	
	if (Role.teleportingChar)
	{
		Town.move(NPC.Anya);
		if (!Pather.getPortal(121) && me.getQuest(37, 1)) {
			anya = getUnit(1, NPC.Anya);

			if (anya) {
				anya.openMenu();
				me.cancel();
			}
		}
		
		if (!Pather.usePortal(121)) {
			throw new Error("Failed to use portal.");
		}
		
		Precast.doPrecast(true);
		
		Pather.moveTo(10058, 13234);
		
		Pather.makePortal();
	}
	else
	{
		Town.move("portalspot");
		while(!Pather.usePortal(121, HordeSystem.teleProfile)) {
			delay(1000);
		}
	}
	
	try {
		Attack.clear(15, 0, getLocaleString(22497)); // Pindleskin
	} catch (e) {
		print(e);
	}
	
	Pickit.pickItems();
	
	Town.goToTown();
	
	return true;
}