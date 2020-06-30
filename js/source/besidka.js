/// <reference path="jquery-1.11.1.min.js" />

var contentLoader,
    imgLoader,
    currLanguageType,
    overallRoomsLoaded,
    LARGE_SIZE = 2 * 320,
    SMALL_SIZE = 320,
    LARGE_SIZE_H = 491,
    SMALL_SIZE_H = 457,
    SMALL_ORDER_SIZE_H = 370,
    OVERALL_LARGE_SIZE = 960,
    OVERALL_LARGE_SIZE_H = 680,
    OVERALL_MIDDLE_SIZE = 640,
    OVERALL_MIDDLE_SIZE_H = 915,
    OVERALL_SMALL_SIZE = 320,
    OVERALL_SMALL_SIZE_H = 1800,
    ORDER_HASH = 'order',
    OVERALL_HASH = 'overall',
    TEXTS_HASH = 'texts-container',
    lastTile;

$("div.cnt").click(function () {
    var hadClass = $(this).hasClass("LARGE");
    $("div.LARGE").each(function () {
        $(this).removeClass("LARGE");
    });
    if (!hadClass) {
        $(this).addClass("LARGE");
    }
});

function setCookie(cname,cvalue,exdays) { //clean
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) { //clean
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function switchLanguage(language) {
    var prevLanguageType = currLanguageType;
    var bdy = $(document.body);
    
    currLanguageType = language;
    currentLocalisation = localisation[language];
    $.datepicker.setDefaults($.datepicker.regional[language]);
    translateAll();
    updateData();
    if (prevLanguageType) {
        bdy.removeClass(prevLanguageType);
    }
    bdy.addClass(currLanguageType);
}

function setLanguage(language) {
    if (localisation[language]) {
        setCookie("lang", language, 30);
        switchLanguage(language);
    }
}

function loadLanguage() {
    var language = getCookie('lang');

    if (language && localisation[language] && language !== defaultLanguage) {
        switchLanguage(language);
    }
}

function translateItem() {
    var item = $(this),
        string = item.attr("data-res"),
        translated = currentLocalisation[string];

    if (translated) {
        if (item.is('input')) {
            item.val(translated);
        } else {
            item.html(translated);
        }
    }
}

function translateAll() {
    $("[data-res]").each(translateItem);  
}

function resetContenLoaderHeight () {
    contentLoader.height("auto");
    var content = $("#contentLoader > div");
    content.height("auto");
    return content;
}

function resetContenLoaderSize () {
    var content = resetContenLoaderHeight ();
    
    contentLoader.width("auto");
    content.width("auto");
}

function hideContentLoader() {
    contentLoader.addClass("HIDING");
    contentLoader.removeClass("FULLSCREEN");
    setContentLoaderToTileSize(lastTile);
    setTimeout(function () {
        contentLoader.removeClass("HIDING");
        contentLoader.hide();
        resetContenLoaderSize();  
    }, 400);
}

function showFullscreenContent(contentWidth, contentHeight, tile) {
    lastTile = tile;
    contentLoader.addClass("FULLSCREEN");
    var center = getWindowCenter(contentWidth, contentHeight);
    contentLoader.offset(center);
    contentLoader.width(contentWidth);
    contentLoader.height(contentHeight);
    
    var content = $("#contentLoader > div");
    content.width(contentWidth);
    content.height(contentHeight);

    setTimeout(function () {
        resetContenLoaderHeight();
    }, 400);
}

function fillRoomcontent(roomName) {
    changeAll(roomName);
}

function async(callback) {
    setTimeout(callback, 0);
}

function getWindowCenter(contentWidth, contentHeight) {
    return {
        top: Math.max(0, ($(window).height() - contentHeight) / 2 + $(document).scrollTop()),
        left: ($(window).width() - contentWidth) / 2 + $(document).scrollLeft()
    };
}

function getContentWidth() {
    var isNarrow = $(window).width() < LARGE_SIZE;

    if (isNarrow) {
        contentLoader.addClass("NARROW");
    } else {
        contentLoader.removeClass("NARROW");
    }
    return isNarrow ? SMALL_SIZE : LARGE_SIZE;
}

function getContentHeight() {
    return $(window).width() < LARGE_SIZE ? LARGE_SIZE_H : SMALL_SIZE_H;
}

function getOrderContentHeight() {
    return $(window).width() < LARGE_SIZE ? LARGE_SIZE_H : SMALL_ORDER_SIZE_H;
}

function getOverAllContentWidth() {
    var w = $(window).width();
    return w >= OVERALL_LARGE_SIZE ? OVERALL_LARGE_SIZE : w >= OVERALL_MIDDLE_SIZE ?  OVERALL_MIDDLE_SIZE : OVERALL_SMALL_SIZE;
}

function getOverAllContentHeight() {
    var w = $(window).width();
    return w >= OVERALL_LARGE_SIZE ? OVERALL_LARGE_SIZE_H : w >= OVERALL_MIDDLE_SIZE ?  OVERALL_MIDDLE_SIZE_H : OVERALL_SMALL_SIZE_H;
}

function onOpenerToggled(element) {
    if (element.hasClass('contact')) {
        setTimeout(initializegMap, 500);
    }
}

function toggle (element) {
    element.toggleClass('OPEN');

    if (element.hasClass('OPEN')) {
        onOpenerToggled(element);
    }
}

function addKids() {
  $("#to3").show(1000);
  $("#add_kids").hide();
}

function setContentLoaderToTileSize (tile) {
    contentLoader.css({ top:  tile.offset().top + 'px', left:  tile.offset().left + 'px' });
    contentLoader.width(tile.width());
    contentLoader.height(tile.height());
}

function handleWindowResize () {
    if (isFullScreen()) {
        showFullscreenContent(getContentWidth(), getContentHeight(), lastTile); //toddo fix
    }
}

function isRoom(hash) {
    return !!rooms[hash.toUpperCase()];
}

function isOrder(hash) {
    return hash.indexOf(ORDER_HASH) === 0;
}

function isOverall(hash) {
    return hash.indexOf(OVERALL_HASH) === 0;
}

function isFullScreen() {
    return contentLoader.hasClass("FULLSCREEN");
}

function changeAllHash() {
    var room;

    if(window.location.hash) {
        var hasParam = window.location.hash.substring(1);

        if (hash === hasParam) {
            //avoid cyclic triggering
            return;
        }

        if (isRoom(hasParam)) {
            room = hasParam.toUpperCase();
            if (g_current_room === rooms[room]) {
                return;
            }
            showRoom($( "div[data-room='"+ hasParam.toUpperCase() + "']:eq(1)"));
        } else if (isOrder(hasParam)) {
            room = hasParam.substring(hasParam.indexOf(':') + 1).toUpperCase();
            changeAll(room);
            showOrder();
        } else if (isOverall(hasParam)) {
            showOverall();
        }
    } else {
        //if (isFullScreen()) {
        //    hideContentLoader();
        //}
    }     
}

function handleRoomClick (event) {
    if (isFullScreen()) {
        hideContentLoader();
        return;
    }

    showRoom($(this));
    if(event) {
        event.stopPropagation();
    }
}

function resetOrder() {
    $("#to3").hide();
    $("#add_kids").show();
    $("div.roomContent").hide();
    $("#room").val(g_current_room ? g_current_room.name.toUpperCase() : 'BOHAC');
}

function hotelOfTheYear() {
    window.open('img/hotelroku.png', '_blank', 'width=800,height=600,resizable=yes');
    return false;
}

function obchodniPodminky() {
    window.open('obchodnipodminkyBesidka.html', '_blank', 'width=800,height=1000,resizable=yes');
    return false;
}

function prepareOverall() {
    if (!overallRoomsLoaded) {
        overallRoomsLoaded = true;
        setTimeout(overallRooms, 0);
    }
}

function showOverall() {
    var overall = $("#overall"),
        el = $( "div.tile.preview");

    if (lastTile && overall.is(':visible')) {
        hideContentLoader();
        return false;
    }

    prepareOverall();
    $("div.orderContent").hide();
    $("#texts-container").hide();
    contentLoader.show();
    overall.width(getOverAllContentWidth());
    overall.height(getOverAllContentWidth());

    if (!isFullScreen()) {
        setContentLoaderToTileSize(el);
    } else {
        setContentLoaderToTileSize(contentLoader);
    }

    overall.show();
    $("div.roomContent").hide();

    var contentWidth = getOverAllContentWidth();
    var contentHeight = getOverAllContentHeight();

    async(function () {
        showFullscreenContent(contentWidth, contentHeight, el);
        setHash(OVERALL_HASH);
    });
}

function showTexts(el) {
    var text = el.attr("data-text"),
        texts = $("#texts-container"),
        textsContainer = $("#texts-container .container"),
        translated = currentLocalisation[text];

    if (texts.is(':visible')) {
        hideContentLoader();
        return false;
    }

    textsContainer.html(translated);
    $("div.orderContent").hide();
    $("div.roomContent").hide();
    $("#overall").hide();

    contentLoader.show();
    texts.width(getOverAllContentWidth());
    texts.height(getOverAllContentWidth());
    
    setContentLoaderToTileSize(el);

    texts.show();

    var contentWidth = getOverAllContentWidth();
    var contentHeight = getOverAllContentHeight();

    async(function () {
        showFullscreenContent(contentWidth, contentHeight, el);
        setHash(TEXTS_HASH);
    });
}

function showRoom(el) {
    var roomContent = $("div.roomContent"),
        contentWidth,
        contentHeight;

    $("div.orderContent").hide();
    $("#texts-container").hide();
    $("#overall").hide();
    fillRoomcontent(el.attr("data-room"));

    roomContent.width(getContentWidth());
    setContentLoaderToTileSize(el);
    contentLoader.show();
    roomContent.show();
    contentWidth = getContentWidth();
    contentHeight = roomContent.height();

    setHash(g_current_room.name);
    async(function () {
        showFullscreenContent(contentWidth, contentHeight, el);
    });
}

function showOrder() {
    var el = $("div.tile.order"),
        orderContent = $("div.orderContent");

    if (lastTile && orderContent.is(':visible')) {
        hideContentLoader();
        return false;
    }

    $("#overall").hide();
    $("#texts-container").hide();
    prepareOrder();
    contentLoader.show();
    orderContent.width(getContentWidth());
    
    if (!isFullScreen()) {
        setContentLoaderToTileSize(el);
    } else {
        setContentLoaderToTileSize(contentLoader);
    }

    orderContent.show();
    resetOrder();
    
    var contentWidth = getContentWidth();
    var contentHeight = getOrderContentHeight();

    setHash(ORDER_HASH + ':' + (g_current_room ? g_current_room.name : 'bohac'));
    async(function () {
        showFullscreenContent(contentWidth, contentHeight, el);
    });
}

function handleOverallClick(event) {
    showOverall();
    if(event) {
        event.stopPropagation();
    }
    return false;
}

function handleOrderClick(event) {
    if (!g_current_room) {
        changeAll('BOHAC');
    }
    showOrder();
    if(event) {
        event.stopPropagation();
    }
    return false;
}

function showFullscreenImage (img) {
    imgLoader.addClass("FULLSCREEN");
    var contentWidth = $(window).width() - 40;
    var contentHeight = $(window).height() - 40;

    imgLoader.width(contentWidth + "px"); //100
    imgLoader.height(contentHeight + "px");

    if (contentWidth > contentHeight) {
        img.style.height = "100%";
        img.style.width = "auto";        
    } else {
        img.style.width = "100%";
        img.style.height = "auto";
    }
}

function disposeImgLoader () {
    if (imgLoader.hasClass("FULLSCREEN")) {
        imgLoader.removeClass("FULLSCREEN");
        imgLoader.css({ top: '', left: '' });
        imgLoader.width("");
        imgLoader.height("");
        return true;
    }
    return false;
}

function getFSImgSource(pict) {
   return g_for_explorer + g_current_room.name + pict + "BIG.jpg"; 
}

function zoom() {
    var img = $$("imageLoaderImg"),
        src = getFSImgSource(g_actual_pict);

    if (disposeImgLoader()) {
        return;
    }

    if (img.src.substr(img.src.indexOf('img')) !== src) {
        img.onload = function () { //on load
            showFullscreenImage(img);
        };
        img.src = src;
    } else {
        showFullscreenImage(img);
    }
}

function disposeFullScreen () {
    if (!disposeImgLoader() && isFullScreen()) {
        hideContentLoader();
    }
}

function prepareRoom() {
    var room = $(this).attr("data-room");

    $(this).click(handleRoomClick);
    $(this).css('background-image', 'url(' + getRoomBGImage(room) + ')');
    if (getRoomFullName(room).length > 15) {
        $(this).append("<div id='longName' class='roomName'>" + getRoomFullName(room).toUpperCase() + "</div>");
    } else {
        $(this).append("<div class='roomName'>" + getRoomFullName(room).toUpperCase() + "</div>");
    }
}

function setImage (front) {
    if (!imgLoader.hasClass("FULLSCREEN")) {
        return;
    }

    var add = front ? 1 : -1,
        index = (g_actual_pict + add + g_current_room.nphotos) % g_current_room.nphotos,
        src = getFSImgSource(index),
        img = $$("imageLoaderImg");
    
    img.src = src;
    setRoomImage(index);
}

function nextPics (event) {
    setImage(true);
    event.stopPropagation();
}

function prevPics (event) {
    setImage(false);
    event.stopPropagation();
}

function handleKeyEvents(event) {
    switch (event.keyCode) {
        case 27: //esc 
            disposeFullScreen(); 
            break;
        case 37: 
            setImage(false); 
            event.preventDefault();
            break;
        case 39:
            setImage(true);
            event.preventDefault();
            break;
    }
    event.stopPropagation();
}

function facebook (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
}

$().ready(function () {

    var wind = $(window);
    contentLoader = $("#contentLoader");
    imgLoader = $("#imageLoader");

    $(".room").each(prepareRoom);
    loadLanguage();

    wind.keydown(handleKeyEvents);
    async(function () {

        $(".order, #roomOrderLink").click(handleOrderClick);
        $(".preview, #overallLink").click(handleOverallClick);

        $(".opener").click(function(event) {
            if (!$(event.target).parents('.content').length) {
                toggle($(this));
                event.stopPropagation();
            }
        }); 

        $(".text-opener").click(function(event) {
            showTexts($(event.target));
        });

        wind.click(disposeFullScreen);

        imgLoader.click(function (event) {
            zoom();
            event.stopPropagation();
        });

        facebook(document, 'script', 'facebook-jssdk');

        $(".navBut.prev").click(prevPics);
        $(".navBut.next").click(nextPics);

        contentLoader.click(function (event) {
            event.stopPropagation();
        });
        
        $(".flag").click(function () {
            setLanguage($(this).attr("data-lang"));
        });   

        changeAllHash();
        wind.bind("hashchange",changeAllHash);
        wind.resize(handleWindowResize);
    });
});