/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
jQuery(function($){
	$.datepicker.regional.cs = {
		closeText: 'Zavřít',
		prevText: '&#x3c;&#x3c; Předchozí měsíc',
		nextText: 'Následující měsíc &#x3e;&#x3e;',
		currentText: 'Nyní',
		monthNames: ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
		monthNamesShort: ['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro'],
		dayNames: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
		dayNamesShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
		dayNamesMin: ['ne','po','út','st','čt','pá','so'],
		weekHeader: 'Týd',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional.cs);
}); 

var dateArrive;

function loadMonth(fyear, month, reload) {

    var year = fyear.toString().substring(2),
        roomID = g_current_room.id,
        url = serverAddress + "room?roomID="+roomID+"&year="+fyear+"&month="+month;

    $.getJSON(url +"&callback=?",  function(data) {
        }).done(function() {}).fail(function(jqxhr, textStatus, error) {var err = textStatus + ', ' + error;
          console.log("Request Failed: " + err);}).always(function(data,textStatus) {

          g_current_room.setRoomAvailability(year, month, data[0], data[1]);
          if (reload) {
              dateArrive.datepicker("refresh"); 
          }
    });
}

function beforeShowCalendar(input, inst) {
   var date = dateArrive.datepicker("getDate") || new Date();

   loadMonth(date.getFullYear(), (date.getMonth()+1), true);
}

function isFreeDay(d) {
  var today = new Date(),
      month = d.getMonth() + 1,
      year  = d.getFullYear().toString().substring(2);

  today.setDate(today.getDate() - 1); //permit today

  if (d < today)
     return [false, 'old_date', ''];

  var roomDataLoaded = !!g_current_room.getMonthAvailability(d),
      isRoomFree = g_current_room.isRoomFree(d);

  if (roomDataLoaded) {
      return [isRoomFree, isRoomFree ? 'free_room' : 'occupied_room', isRoomFree ? 'Pokoj je volný' : 'Pokoj je obsazený'];
  } else {
      return [false, 'loading data', '']; 
  }
}

function monthChanged(year, month, inst) {
    loadMonth(year, month, true);       
}

function initDatePicker () {
	dateArrive = $("#date_arrive");

	dateArrive.datepicker({ dateFormat: 'dd.mm.yy', numberOfMonths: 1,
			showButtonPanel: false, beforeShowDay: isFreeDay, beforeShow: beforeShowCalendar, onChangeMonthYear: monthChanged});
	$("#searchdate").datepicker({ dateFormat: 'dd.mm.yy', numberOfMonths: 2});

  $("#ui-datepicker-div").click(function (event) {
      event.stopPropagation();
  });  
}