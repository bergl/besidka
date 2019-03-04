var BOHAC_ID     = 1;
var GENA_ID      = 2;
var HANAK_ID     = 3;
var KORYS_ID     = 4;
var KOUTAK_ID    = 5;
var KUSIAK_ID    = 6;
var VAVRA_ID     = 7;
var ZAMPIC_ID     = 8;
var RENESANCE_ID = 9;
var HOSTEL_ID = 13;
var KOUCKY_ID = 18;
var CEPLECHA_ID = 19;
var VRBA_ID = 20;
var HATY_ID = 21;
var PREZIDENT_ID        = 22;
var TROSSKETOS_ID       = 23;
var VIVIENNE_ID         = 24;
var STARSIOSKLIVEJSI_ID = 25;
var MLADSIHEZCI_ID      = 26;
var TOBIAS_ID           = 27;

var BOTTOM_FLOOR = 0,
    SECOND_FLOOR = 1,
    HOSTEL = 2,
    BACK_HOUSE = 3;

function Room(name, ename, full_name, capacity, ncapacity, nphotos, floor, price_season, price, price_one_season, price_one, has3D, acreage, id, beds, hasPrice, newRoom) {
    this.id = id;
    this.name = name;
    this.ename = ename;
    this.full_name = full_name;
    this.capacity = capacity;
    this.ncapacity = ncapacity;
    this.nphotos = nphotos;
    this.floor = floor;
    this.price_season = price_season;
    this.price = price;
    this.price_one_season = price_one_season;
    this.price_one = price_one;
    this.has3D = has3D;
    this.acreage = acreage;
    this.beds = beds;
    this.roomAvailability = [];
    this.hasPrice = hasPrice;
    this.isNewRoom = newRoom;

    this.setRoomAvailability = function (year, month, currentMonth, nextMonth) {
        var next_month = month == 12 ? 1 : month + 1,
            next_year = next_month == 1 ? parseInt(year, 10) + 1 : year;

        this.roomAvailability[year] = this.roomAvailability[year] || [];
        this.roomAvailability[next_year] = this.roomAvailability[next_year] || [];

        this.roomAvailability[year][month] = currentMonth;
        this.roomAvailability[next_year][next_month] = nextMonth;
    };

    this.getMonthAvailability = function (date) {
        var month = date.getMonth() + 1,
            year  = date.getFullYear().toString().substring(2);

        return this.roomAvailability[year] ? this.roomAvailability[year][month] : null; 
    };

    this.isRoomFree = function (date) {
        var day = date.getDate() - 1,
            availability = this.getMonthAvailability(date);

        return availability ? availability[day] : false;
    };
}

var rooms = {
    "BOHAC": new Room("bohac", "Bohac", "Boháč",  "2 + 4", 6, 4, BOTTOM_FLOOR, 1490, 1490, 1290, 1290, true, 44, BOHAC_ID, 2, true, false),
    "GENA": new Room("gena", "Gena", "Manž. Narodů",  "2 + 2",4, 4, BOTTOM_FLOOR, 1490, 1290, 1290, 990, true, 21, GENA_ID, 2, true, false),
    "HANAK": new Room("hanak", "Hanak", "Hanák",  "2 + 4",6, 2, BOTTOM_FLOOR, 1490, 1290, 1290, 990, true, 35, HANAK_ID, 2, true, false),
    "KORYS": new Room("korys", "Korys", "Korýs",  "2 + 0",2, 4, SECOND_FLOOR, 1290, 1190, 1290, 990, true, 17, KORYS_ID, 2, true, false),
    "KOUTAK": new Room("koutak", "Koutak", "Kouťák",  "2 + 2",4, 4, SECOND_FLOOR, 1490, 1490, 1290, 1290, true, 29, KOUTAK_ID, 2, true, false),
    "KUSIAK": new Room("kusiak", "Kusiak", "Kušiak",  "2 + 4",6, 3, SECOND_FLOOR, 1490, 1290, 1290, 990, true, 28, KUSIAK_ID, 2, true, false),
    "VAVRA": new Room("vavra", "Vavra", "Vávra",  "2 + 4",6, 4, SECOND_FLOOR, 1690, 1690, 1490, 1490, true, 51, VAVRA_ID, 2, true, false),
    "ZAMPIC": new Room("zampic", "Zampic", "Žampa",  "2 + 1",3, 3, SECOND_FLOOR, 1490, 1290, 1290, 990, true, 33, ZAMPIC_ID, 2, true, false),
    "RENESANCE": new Room("renesance", "KonferecniSal", "Konferen. sál","100 m2", 0, 7, BOTTOM_FLOOR, '?', '?','?', '?', true, 100, RENESANCE_ID, "moc", false, false),
    "HOSTEL" : new Room("hostel", "hostel","Hostel", "moc", 0, 0, HOSTEL, 150, 150,150, 150, false, HOSTEL_ID, "moc", false, false),
    "KOUCKY": new Room("koucky", "Koucky", "Koucký",  "2 + 2",4, 4, BACK_HOUSE, 1690, 1690, 1490, 1490, false, 42, KOUCKY_ID, 2, KOUCKY_ID, 2, true, true),
    "CEPLECHA": new Room("ceplecha", "Ceplecha", "Ceplecha",  "2 + 2",4, 4, BACK_HOUSE, 1490, 1490, 1290, 1290, false, 30, CEPLECHA_ID, 2, true, true),
    "VRBA": new Room("vrba", "Vrba", "Vrba",  "2 + 2",4, 4, BACK_HOUSE, 1490, 1290, 1290, 990, false, 27, VRBA_ID, 2, true, true),
    "HATY": new Room("haty", "Haty", "Haty",  "2 + 2",4, 2, BACK_HOUSE, 1490, 1490, 1290, 1290, false, 27, HATY_ID, 2, true, true),

//    "PREZIDENT":        new Room("prezident", "Prezident", "Prezidentský apartman Ferdinanda Vaňka", "4 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, PREZIDENT_ID, 2, true, true),
    "PREZIDENT":        new Room("prezident", "Prezident", "Prezidentský apartmán", "4 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, PREZIDENT_ID, 2, true, true),
    "TROSSKETOS":       new Room("trossketos", "Trossketos", "Tros Sketos", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, TROSSKETOS_ID, 2, true, true),
//    "VIVIENNE":         new Room("vivienne", "Vivienne", "Vivienne", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, VIVIENNE_ID, 2, true, true),
   "VIVIENNE":         new Room("vivienne", "Vivienne", "Vivienne Hatfieldová", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, VIVIENNE_ID, 2, true, true),
    "STARSIOSKLIVEJSI": new Room("starsiosklivejsi", "Starsiosklivejsi", "Starší ošklivější", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, STARSIOSKLIVEJSI_ID, 2, true, true),
    "MLADSIHEZCI":      new Room("mladsihezci", "Mladsihezci", "Mladší hezčí", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, MLADSIHEZCI_ID, 2, true, true),
    "TOBIAS":           new Room("tobias", "Tobias", "Tobiáš Mícha", "2 + 2", 4, 4, HOSTEL, 1490, 1290, 1290, 990, false, 27, TOBIAS_ID, 2, true, true)
};

var roomsArray = [];
for (var prop in rooms) {
    if( rooms.hasOwnProperty( prop ) ) {
        roomsArray.push(rooms[prop]);
    }
}

var g_actual_pict = 0,
    g_for_explorer = "img/",
    hash,
    g_current_room = null;


function setCurrentRoom(room) {
    var current_room = rooms[room];
    if (current_room) {
        g_current_room = current_room;
    }
    return !!current_room;
}

function setRoomImage(actualPict) {
    $$("roomImg").src = g_for_explorer + g_current_room.name + actualPict + ".jpg";
    g_actual_pict = actualPict;
}

function $$(elID) {
    return document.getElementById(elID);
}

function addThumbnails() {
    var roomThumbs = $("div.roomThumbs");
    roomThumbs.html("");

    for (var i = 0; i < g_current_room.nphotos; i++) {
        roomThumbs.append("<img onClick='setRoomImage(" + i + ");' class='roomThumb actionable' src='img/thumbs/" + g_current_room.name + i + ".jpg'/>");
    }
}

function getRoomBGImage(room) {
    return 'img/tiles/' + rooms[room].name + '.jpg';
}

function getRoomFullName(room) {
    return rooms[room].full_name;
}

function setHash(newHash) {
    window.location.hash = newHash;
    hash = newHash;
}

function updateData(date) {
    if (!g_current_room) {
        return;
    }

    var roomOrderLink = $$("roomOrderLink");

    roomOrderLink.title = "Objednat pokoj " + g_current_room.full_name;
    roomOrderLink.href = "form.html#" + g_current_room.name;

    setHash(g_current_room.name);
    $$("roomDesc").innerHTML = currentLocalisation[g_current_room.name + '_desc'];
    $$("price").innerText = g_current_room.price;
    $$("price_seaon").innerText = g_current_room.price_season;
    $$("capacity").innerText = g_current_room.capacity;
    $$("acreage").innerText = g_current_room.acreage;
    setRoomImage(0);
    addThumbnails();

    if (date) {
        $$("date_arrive").value = date;
    }

    if (g_current_room.id === RENESANCE_ID) {
        $("#prices").hide();
    } else {
        $("#prices").show();
    }
}

function changeAll(room, date) {
    if ((g_current_room === rooms[room] || !setCurrentRoom(room)) && !date) {
        return;
    }

    updateData(date);
}