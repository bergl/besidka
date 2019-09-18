 var orderLoaded,
 //    serverAddress = 'http://54.247.99.58/order/',
     serverAddress =  'http://test.besidka.cz/reservation_server/www/order/', 
    current_month = new Date();

//sezóna
//(1.6 - 30.9,
//20.12 - 6.1)	

function isInSeason() {

  var date = $("#date_arrive").val();
  if (!date) {
    return false;
  }
  
  var adate = $.datepicker.parseDate('dd.mm.yy', date);
  if (!adate) {
    return false;
  }
  
  var day = adate.getDate();
  var month = adate.getMonth() + 1;
  
  if (month > 5 && month < 10) {
    return true; //(1.6 - 30.9,
  }
  
  if ((month == 12 && day > 19) || (month == 1 && day < 7)) {
    return true; //20.12 - 6.1
  }
  return false;
}

function updateCost() {

  	if (!g_current_room.hasPrice) {
		$(".tmpPrice").each(function() {
			$(this).text("domluvou");
		});
		return;
	}	

   var room = g_current_room;
   var npeople = parseInt($("#pocet_osob").val());   
   var ndays = parseInt($("#pocet_noci").val());
   var pocet_deti312 = parseInt($("#pocet_deti312").val());
   var isInS = isInSeason();
   var price = isInS ? room.price_season : room.price;
   var priceOnPerson = isInS ? room.price_one_season : room.price_one;
   
   npeople = npeople + pocet_deti312; // nepocitam do 3 let !
      
   price = npeople == 1 ? priceOnPerson : price;
   var info = " = "+ndays+" * ("+price + "Kč";
   price = price * ndays;
   
   var pristylka = Math.max(0, npeople - room.beds);
   if (pristylka) {
      price +=  ndays * (pristylka * 490);
      info += " + " + pristylka + " * 490";
      
   }
   info += ")";
   
  $(".tmpPrice").each(function() {
    	$(this).text(price + " Kč " + info);
  });
}

function updateBeds() {
  var npeople = parseInt($("#pocet_osob").val()) + parseInt($("#pocet_deti312").val());
  
  if (!g_current_room.hasPrice) {
	    $("#max_persons").text(npeople);
	    $("#add_bed").text("x");  
	    return;
  }

  var room = g_current_room,
	  of = currentLocalisation.of || 'z';

  
  $("#max_persons").text(npeople + " " + of + " max " + room.ncapacity);
  $("#add_bed").text(Math.max(0, npeople - room.beds) + " " + of + " max " + (room.ncapacity - room.beds));
}

function changeDate()  {
    var days = $('#pocet_noci').val();
    var date_arrive = $('#date_arrive').val();
    if (!isInteger(days) || date_arrive === "") {
      return;
  	}
    
    var date_out = $.datepicker.parseDate('dd.mm.yy', date_arrive);
    date_out.setDate(date_out.getDate()+parseInt(days, 10));
    $('#date_out').val(date_out.getDate()+"."+(date_out.getMonth()+1)+"."+date_out.getFullYear());
}

function updateValues() {
  changeDate();
  updateCost();
  updateBeds();
}

function markInvalid(el) {                     
  el.css("background-color", "#ff7171").change(function(e) { el.css("background-color","white");});
}

function isInteger (s) {
    return /^\d+$/.test(s);
}

function addIncreaseDescrease() {
   	$('<input class="decrease" type="button" value="-">').insertBefore('.countable');
    $('<input class="increase" type="button" value="+">').insertAfter('.countable');

	$(".increase").click(function(e) {
		  var prev = $(this).prev();
		  if (prev)
		  {
		      var value = prev.val();
		      if (isInteger(value))  {
		        prev.val(++value);
		        updateValues();
		      }
		      else
		        markInvalid(prev);
		  }
	});
	$(".decrease").click(function(e) {
		  var next = $(this).next();
		  if (next)
		  {
		      var value = next.val();
		      if (isInteger(value))
		      {
		        if (value > 0) {
		          next.val(--value);
		          updateValues();
		        }
		      }
		      else
		        markInvalid(next);
		  }
	});      
}

function showOrderStep(step, elements) {
	if (cleanAllAndValidate(step, true)) {
		elements.show();
	}
}

function copyValueFrom(to, from) {
	$("#"+to).html($("#"+from).val()); 
}

function fillServices() {

	var ordered_services  = "";

	if ($("#voucher").val() !== "") {
	   ordered_services += "Voucher ("+$("#voucher").val()+"), "; 
	}

	if ($("#dog").val() > 0) {
	   ordered_services += "pes ("+$("#dog").val()+"), "; 
	}          
	if ($("#tiny_bed").val() > 0) {
	   ordered_services += "děstská postýlka ("+$("#tiny_bed").val()+"), "; 
	}
	if ($("#extra_bed").val() > 0) {
	   ordered_services += "Přistýlka ("+$("#extra_bed").val()+"), "; 
	}          
	$("#ordered_services").html(ordered_services);
}

function fillOrderDetails() {
	$("#fill_name").html($("#finame").val()+" "+$("#faname").val()); 
	$("#fill_room").html(g_current_room.full_name);
	copyValueFrom("fill_nat","nat");
	copyValueFrom("fill_email","email");
	copyValueFrom("fill_city","city");
	copyValueFrom("fill_tel","tel");
	copyValueFrom("fill_street","street");
	copyValueFrom("fill_psc","psc");
	copyValueFrom("fill_person","pocet_osob");
	copyValueFrom("fill_nights","pocet_noci");
	copyValueFrom("fill_arrive","date_arrive");
	copyValueFrom("fill_dep","date_out");
	copyValueFrom("fill_kids3","pocet_deti3");
	copyValueFrom("fill_kids312","pocet_deti312");
	fillServices();
}

function showOrderDetails() {
	showOrderStep(2, $("#order_details,#tn_order_details"));
}

function showRoomSelect() {
	showOrderStep(1, $("#room_select,#tn_room_select"));
}

function showServices() {
	showOrderStep(3, $("#services,#tn_services"));
}

function showOrderOverview() {
	showOrderStep(4, $("#order,#tn_order"));
	fillOrderDetails();
}

 function showFreeRoom(room, date) {
     changeAll(room.toUpperCase(), date);
     showOrder();
 }

 function getMonthControls(monthName) {
     return "<input class='prevMonth' type='button' value='&#171;'/><div class='monthName'>" + monthName + "</div><input class='nextMonth' type='button' value='&#187;'/>";
 }

 function overallRooms(move) {
     move = move || 0;
     current_month.setMonth(current_month.getMonth() + move);

     var room, i, tr, url = serverAddress + "rooms?month="+(current_month.getMonth() + 1)+"&year="+current_month.getFullYear(),
         monthName = $.datepicker.regional.cs.monthNames[current_month.getMonth()],
         contentCache = $("<div></div>"),
         content = $("#overall"),
         free, d, m, day, days, curr, date, past;

     contentCache.html(getMonthControls(monthName));

     $.getJSON(url +"&callback=?",  function(data) {}).done(function() {}).fail(function(jqxhr, textStatus, error) {var err = textStatus + ', ' + error;
         console.log("Request Failed: " + err);}).always(function(data) {
         curr = data[0];

	 // iterate over rooms
         for (i = 0; i < roomsArray.length; i++) {
	     // TEMPORARY HACK until server upgraded to new version HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK 
	     if (i === 9)
		 continue; // skip hostel

             room = $("<div class='room'></div>");
             room.append("<div class='name'>" + roomsArray[i].full_name + "</div>");
             days = curr[i];

	     // TEMPORARY HACK until server upgraded to new version HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK 
	     if (i > 13) {
		 days = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // fake 31 occupied days for nonexistent room
	     }

             m = current_month.getMonth()+1;
             if (m < 10) m = "0"+m;
	     var date1 = m + "/01/" + current_month.getFullYear();
	     var dateOf1stDay = new Date(date1);
	     var offsetOf1stDay = dateOf1stDay.getDay()*30; // 30 px per day
             // iterate over days in months
             for (d = 0; d < days.length; d++) {
                 free = days[d] != "0";
                 m = current_month.getMonth()+1;
                 day = d+1;
                 if (m < 10) m = "0"+m;
                 if (day < 10) day = "0"+day;
                 date = m + "/" + day + "/" + current_month.getFullYear();
                 past = +new Date(date) < +new Date();
		 var offsetStr = "";
		 if  (d===0)
		     offsetStr =  " style='margin-left: "+offsetOf1stDay+"px'";
                 if (past) {
                     room.append($("<div class='item past'"+offsetStr+">" + (d+1) +"</div>"));
                 } else if (free) {
                     room.append($("<div onclick='showFreeRoom(\"" + roomsArray[i].name + "\",\"" + day + "." + m + "." + current_month.getFullYear() + "\");' class='item free'"+ offsetStr + ">" + (d + 1) + "</div>"));
                 } else {
                     room.append($("<div class='item occup'"+offsetStr+"'>" + (d+1) +"</div>"));
                 }
             }
             contentCache.append(room);
         }
         content.html(contentCache.html());
         async(addMonthClickHandlers);
     });
 }

 function addMonthClickHandlers() {
     $(".prevMonth").click(function(event) {
         overallRooms(-1);
         event.stopPropagation();
     });
     $(".nextMonth").click(function(event) {
         overallRooms(1);
         event.stopPropagation();
     });
 }

function orderRoom() {
   //do some precheck
   if (!validate()) {
      alert("Ne všechny povinné položky objednávky jsou vyplněny nebo nejsou vyplněny správně !");
      return;
   }
   
   if (!confirm("Opravdu si přejete odeslat tuto objednávku ?")) {
      return;
   }
        
   var bValue = $("#finalOrder").val();
   $("#finalOrder").val("Odesilám ...");
   
   var name = $("#finame").val();
   var fname = $("#faname").val(); 
   var email = $("#email").val(); 
   var room = g_current_room.id;
   var tel = $("#tel").val();
   
   var city = $("#city").val();
   var street = $("#street").val();
   var psc = $("#psc").val();
   var state = $("#nat").val();
   var npeople = $("#pocet_osob").val();   
   var ndays = $("#pocet_noci").val();
   var pocet_deti3 = $("#pocet_deti3").val();
   var pocet_deti312 = $("#pocet_deti312").val();
   var date = $("#date_arrive").val();
   var adate = $.datepicker.parseDate('dd.mm.yy', date);
   var day = adate.getDate();
   var month = adate.getMonth() + 1;
   var year = adate.getFullYear();
   var text = $("#note").val();
   
   var pristylka = $("#extra_bed").val();
   var pes = $("#dog").val();
   var dpristylka = $("#tiny_bed").val();
   var voucher = $("#voucher").val();
   
   var url = serverAddress + "saveForm?name="+name+"&fname="+fname+"&email="+email+"&room="+
              room+"&tel="+tel+"&city="+city+"&street="+street+"&psc="+psc+
              "&npeople="+npeople+"&ndays="+ndays+"&day="+day+"&month="+month+
              "&year="+year+"&text="+text+"&pocet_deti3="+pocet_deti3+"&pocet_deti312="+pocet_deti312+"&state="+state+
              "&pristylka="+pristylka+"&pes="+pes+"&dpristylka="+dpristylka+"&voucher="+voucher;

    $.getJSON(url +"&callback=?",  function(data) {}).done(function() {}).fail(function(jqxhr, textStatus, error) {var err = textStatus + ', ' + error;
        console.log("Request Failed: " + err);}).always(function(data,textStatus) {
  	  	$("#finalOrder").val(bValue);
      	if (data == "0") {
          showConfirmation();
      		//alert("Požadavek na rezervaci byl zapsán.");
      	}
        else alert("Rezervaci nelze zapsat, protože koliduje s jinou potvrzenou rezervací.");
	});
}

function showConfirmation() {
  $("#confirmation_email").text($("#email").val()); 
  $("#confirmation").show();
}

function closeConfirmation() {
  $("#confirmation").hide();
  showRoomSelect();
  hideContentLoader();
}

function orderNextRoom() {
  $("#confirmation").hide();
  showRoomSelect();
}

function enableItem(item, enable) {
	if (enable) {
		item.removeAttr('disabled');
	} else {
		item.attr('disabled', 'disabled');    
	}
}

function enableControl(item, enable, withControls) {
	  enableItem(item, enable);
	  if (withControls) {
	      enableItem(item.prev(), enable);
	      enableItem(item.next(), enable);
	  }
}

function selectRoom(room) {
	changeAll(room);

	var today = new Date(),
		isRenesance = g_current_room.id === RENESANCE_ID;

	loadMonth(today.getFullYear(), (today.getMonth() + 1), false);

	$("#room").val(g_current_room.name.toUpperCase());

	enableControl($("#pocet_osob"), !isRenesance, true);

	if (isRenesance) { //wtf
		$("#add_kids").hide();
		$("#pocet_osob").val(1);
	} else if (!$("#to3").is(':visible')) {
		$("#add_kids").show();
	}

	var disableDogs = g_current_room.isNewRoom;
	enableControl($("#dog"), !disableDogs, true);
	if (disableDogs) {
  		$("#dog").val(0);
	}

	if ($("#order").is(':visible')) {
	 	fillOrderDetails();
	}

	updateCost();
	updateBeds();
}

function onRoomChanged() {
   	selectRoom($("#room").val());
}

function prepareOrder() {
	updateValues();

    if (orderLoaded) {
        return;
    }
    orderLoaded = true;

    async(function () {
    	addIncreaseDescrease();
    	initDatePicker();

		$("#date_arrive").change(changeDate);
	  	$("#finalOrder").click(orderRoom);   
	  	$("#room").change(onRoomChanged);
    });
}