______   _____   _____  ___  ___          _   _   _____  ______  ______   _____ 
|  _  \ / __  \ |  __ \ |  \/  |  _   _  | | | | |  _  | | ___ \ |  _  \ |  ___|
| | | | `' / /' | |  \/ | .  . | (_) (_) | |_| | | | | | | |_/ / | | | | | |__  
| | | |   / /   | | __  | |\/| |         |  _  | | | | | |    /  | | | | |  __| 
| |/ /  ./ /___ | |_\ \ | |  | |  _   _  | | | | \ \_/ / | |\ \  | |/ /  | |___ 
|___/   \_____/  \____/ \_|  |_/ (_) (_) \_| |_/  \___/  \_| \_| |___/   \____/

_______________________________________________________________________________

Disclaimer

/!\ use at your own risks ! /!\

It is a beta version of a team levelling D2Bot extension. 
Using it with existing characters and/or wrong configuration might lead to 
item loss or character deletion.

_______________________________________________________________________________

Features

-Goes from act 1 normal to act 5 hell with a balanced team
-Customisable & extensible run, builds, gearing & runewords

______________________________________________________________________________

Requirements

-At least one sorc for teleport

______________________________________________________________________________

Config setup :

1- create a new team. 

Choose a name for your team

Start doing as usual using kolbot :

Create the profiles for each Team Member in the D2Bot manager. Fill at least 
the following fields :
-ENTRY SCRIPT : Use D2BotHorde.dbj for all profiles
-Profile Name
-Account
-Password
-Character
-GameInfo (give unique game name for each team member)
-fill the rest to fit your needs. Note that difficulty will be ignored.

Then create a character config for each character in d2bs\kolbot\libs\config\
You use the #ClassName#.HordeTemplate.js as a starting point.

In the config file, you just have to change the team name to "YourTeamName" 
at the beginning of the config file. you'll notice that the file is lighter than usual.
You can add & tweak some of the remaining settings or add your custom stuff, 
but you should finish the rest of the setup described here before.

Now you need to setup horde specific settings. Teams are listed in 
d2bs\kolbot\libs\horde\settings\teams\

to create a new team, copy/paste TeamTemplate.js file and rename 
the copy to "YourTeamName.js"

Open the file with a text editor, and follow the instructions to setup your team.

______________________________________________________________________________

Sequences setup :

Sequences defines what your bots will be doing during each game. Sequences files 
are located in kolbot\libs\horde\settings\sequences.

you can use the default one "default_xpac.js" or copy/paste it and create one that 
fits your needs. you just have to put the name of the sequence file to your team settings.

A sequence file lists, for each difficulty, all the sequences that must be done 
by the team. There is 3 categories : BeforeQuests, Quests and AfterQuests. It allows to
schedule some mf/farming runs before and/or after running the quests to lvl up,
mf or farm gold. You can add conditions to control when they should do a sequence or not.

______________________________________________________________________________

Editing & adding new builds :

Builds are located in kolbot\libs\horde\builds\#ClassName#\
a build is composed of :
-a stat build (you can check existing ones or add new ones in 
kolbot\libs\horde\builds\templates\stats\#ClassName#.js)

-a skill build (you can check existing ones or add new ones in 
kolbot\libs\horde\builds\templates\skills\#ClassName#.js)

-an AutoBuild file (you can check existing ones or add new ones in 
kolbot\libs\config\Builds\#ClassName#.#BuildName#.js)

-Act2 normal/nightmare merc aura (leave empty string "" on nightmare merc 
if you want to keep normal merc)

-Build pickits (you can check existing ones or add new ones in 
kolbot\pickit\horde\#classname#.#buildname#.#xpax/classic#.nip)
	=> you need at least the class pickit and the merc pickit

______________________________________________________________________________

Editing & adding new runewords :

Runewords are located in kolbot\libs\horde\settings\crafting\runewords\

Runewords are separated for character & merc. each have a list 
of gear type ("sword", "shield", "polearm", ...)
Each gear type can have a list of runewords (the name doesn't really matter) 
with all parameters that are required to create the runeword.
Note that if you put a tier on it, it will not be crafted if you have a higher 
tier equipped. You can also put a condition to skip doing the runeword



