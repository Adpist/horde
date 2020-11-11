/**
 *	@filename	cows.js
 *	@author		m
 *	@desc		Kill cows
 *	@credits	Adpist, JeanMax / SiC-666 / Dark-f, Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
 */
function cows_requirements(mfRun) {
    /***** REQUIREMENTS ******/

    switch (me.gametype) {
        case 0: // classic
            if (!me.getQuest(26, 0)) { // diablo not completed
                return Sequencer.skip;
            }

            break;
        case 1: // expansion
            if (!me.getQuest(40, 0)) { // baal not completed
                return Sequencer.skip;
            }

            break;
    }

    if (me.getQuest(4, 10)) { // king dead or cain not saved
        return Sequencer.skip;
    }

    if (!me.getQuest(4, 0)) { //Cain quest incomplete
        return Sequencer.skip;
    }

    /***** END OF REQUIREMENTS ******/

    return Sequencer.ok; //We can process sequence
}

function cows(mfRun) { // SiC-666 TODO: Rewrite this.
    this.buildCowRooms = function() {
        var i, j, room, kingPreset, badRooms, badRooms2,
            finalRooms = [],
            indexes = [];

        kingPreset = getPresetUnit(me.area, 1, 773);
        badRooms = getRoom(kingPreset.roomx * 5 + kingPreset.x, kingPreset.roomy * 5 + kingPreset.y).getNearby();

        for (i = 0; i < badRooms.length; i += 1) {
            badRooms2 = badRooms[i].getNearby();

            for (j = 0; j < badRooms2.length; j += 1) {
                if (indexes.indexOf(badRooms2[j].x + "" + badRooms2[j].y) === -1) {
                    indexes.push(badRooms2[j].x + "" + badRooms2[j].y);
                }
            }
        }

        room = getRoom();

        do {
            if (indexes.indexOf(room.x + "" + room.y) === -1) {
                finalRooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
            }
        } while (room.getNext());

        return finalRooms;
    };

    this.clearCowLevel = function() {

        var room, result, myRoom,
            rooms = this.buildCowRooms();

        function RoomSort(a, b) {
            return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
        }

        while (rooms.length > 0) {
            // get the first room + initialize myRoom var
            if (!myRoom) {
                room = getRoom(me.x, me.y);
            }

            if (room) {
                if (room instanceof Array) { // use previous room to calculate distance
                    myRoom = [room[0], room[1]];
                } else { // create a new room to calculate distance (first room, done only once)
                    myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
                }
            }

            rooms.sort(RoomSort);
            room = rooms.shift();

            result = Pather.getNearestWalkable(room[0], room[1], 10, 2);

            if (result) {
                Pather.moveTo(result[0], result[1], 3);

                if (!Attack.clear(30)) {
                    return false;
                }
            }
        }

        return true;
    };

    this.getLeg = function() {
        var i, portal, wirt, leg, gid;

        if (me.getItem(88)) {
            return me.getItem(88);
        }

        Pather.useWaypoint(4);
        Precast.doPrecast(true);
        Pather.moveToPreset(me.area, 1, 737, 8, 8);

        for (i = 0; i < 6; i += 1) {
            portal = Pather.getPortal(38);

            if (portal) {
                Pather.usePortal(null, null, portal);

                break;
            }

            delay(500);
        }

        if (!portal) {
            throw new Error("Tristram portal not found");
        }

        Pather.moveTo(25048, 5177);

        wirt = getUnit(2, 268);

        for (i = 0; i < 8; i += 1) {
            wirt.interact();
            delay(500);

            leg = getUnit(4, 88);

            if (leg) {
                gid = leg.gid;

                Pickit.pickItem(leg);
                Town.goToTown();

                return me.getItem(-1, -1, gid);
            }
        }

        throw new Error("Failed to get the leg");
    };

    this.getTome = function() {
        var tome,
            myTome = me.findItem("tbk", 0, 3),
            akara = Town.initNPC("Shop");

        tome = me.getItem("tbk");

        if (tome) {
            do {
                if (!myTome || tome.gid !== myTome.gid) {
                    return copyUnit(tome);
                }
            } while (tome.getNext());
        }

        if (!akara) {
            throw new Error("Failed to buy tome");
        }

        tome = akara.getItem("tbk");

        if (tome.buy()) {
            tome = me.getItem("tbk");

            if (tome) {
                do {
                    if (!myTome || tome.gid !== myTome.gid) {
                        return copyUnit(tome);
                    }
                } while (tome.getNext());
            }
        }

        throw new Error("Failed to buy tome");
    };

    this.openPortal = function(leg, tome) {
        var i;

        if (!Town.openStash()) {
            throw new Error("Failed to open stash");
        }

        if (!Cubing.emptyCube()) {
            throw new Error("Failed to empty cube");
        }

        if (!Storage.Cube.MoveTo(leg) || !Storage.Cube.MoveTo(tome) || !Cubing.openCube()) {
            throw new Error("Failed to cube leg and tome");
        }

        transmute();
        delay(500);

        for (i = 0; i < 10; i += 1) {
            if (Pather.getPortal(39)) {
                return true;
            }

            delay(200);
        }

        throw new Error("Portal not found");
    };


    Town.goToTown(1);
    if (Role.teleportingChar) {
        var leg, tome;
        leg = this.getLeg();
        tome = this.getTome();
        this.openPortal(leg, tome);
        delay(1000);
        Pather.usePortal(39);
        delay(1000);
        Pather.makePortal();
    } else {
        Town.move("portalspot");
    }

    while (me.area !== 39) {
        Pather.usePortal(39);
        delay(1000);
    }

    if (me.diff < 2) {
        Pather.teleport = false;
    }
    try {
        Precast.doPrecast(false);
        this.clearCowLevel();
    } catch (e) {
        print(e);
        Town.goToTown(1);
    }

    Pickit.pickItems();

    if (mfRun) {
        Role.backToTown();
    } else {

        Town.goToTown(1);
    }

    Pather.teleport = true;
    return Sequencer.done;
}