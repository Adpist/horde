/**
*	@filename	Farm.js
*	@author		Adpist
*	@desc		Farming tools
*	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
*/


var Farm = {

	areasLevelling: function(areas, targetLevel){
		var i;
		
		print("areas levelling");
		
		if (areas.length == 0)
		{
			return Party.hasReachedLevel(targetLevel);
		}
		
		if (!me.inTown)
		{
			Town.goToTown();
		}
		
		Town.doChores();
				
		for (i = 0; i < areas.length; i += 1)
		{
			if (Party.hasReachedLevel(targetLevel))
			{
				return true;
			}
			
			if (areas[i] === -1)
			{
				Town.goToTown();
				
				delay(2000);
				
				Town.doChores();
			}
			else 
			{
				//- 30 for almost completed run
				if (getTickCount() - me.gamestarttime >= (Config.MinGameTime - 30)*1000)
				{
					print("quitting at duration" + (getTickCount() - me.gamestarttime));
					quit();
					return Party.hasReachedLevel(targetLevel);
				}
				
				while (me.area !== areas[i])
				{
					Pather.journeyTo(areas[i]);	
					delay(500);
				}
				
				Party.waitForMembers();
				
				Pather.teleport = false;
				
				Precast.doPrecast(true);
			
				delay(2000);
				
				Attack.clearLevel(0);
				
				Pather.teleport = true;
			}
		}
		
		Town.goToTown();
		
		Town.doChores();
		
		return Party.hasReachedLevel(targetLevel);
	}

};