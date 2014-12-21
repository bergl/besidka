var currentStep = 1,
	email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

function validateElements(elements, test) {
    var i = 0;
    elements.each(function(index) {
      if (!test($(this)))
      {
        markInvalid($(this));
        if (i === 0 && $(this).is(':visible'));
          $(this).focus();
        i++;
      }
    });
    return i;
}

function validateRequired(elements) {
    return validateElements(elements, function(el) {
    	return el.val() !== "";  
    });
}

function validate() {
	switch(currentStep) {
		case 1: 
	  		return validateRequired($("#room_select .required")) === 0;  
		case 2:
		  	return (validateRequired($("#order_details .required")) === 0) &&
		         (validateElements($("#order_details .email"), function(el) { return email_reg.test(el.val());}) === 0);               
		case 3: 
		  	return (validateElements($("#voucher"), function(el) { return (el.val() === "" || isInteger(el.val()));}) === 0);
		case 4: 
	  		return (validateRequired($("#order_details .required, #room_select .required")) === 0) &&
	         	(validateElements($("#order_details .email"), function(el) { return email_reg.test(el.val());}) === 0 &&
	         	(validateElements($("#voucher"), function(el) { return (el.val() === "" || isInteger(el.val()));}) === 0));         
	}
	return true;
}

function cleanAllAndValidate(c, shouldValidate) {
  	if (shouldValidate && !validate() && c > currentStep) {
		return false;
	}
  
	$("#room_select,#services,#order,#order_details,#frooms,#overall").hide();
	$("#tn_room_select,#tn_services,#tn_order,#tn_order_details").hide();

	currentStep = c;
	return true;
}