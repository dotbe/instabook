function repeatString(string,n){


	tmp="";


	for(i=1;i<=n;i++){tmp+=string;}


	return tmp;


}


function getNumberSeparator(separator){


	switch (separator){


		case "S": return " ";


		case "C": return ",";


		case "D": return ".";


	}


	return "";


}


function getNumber(sNbr,format){


	//transform a formated number in a math number


	if(!format) format = "SD2";


	if (sNbr == "")return 0;


	sNbr = "" + sNbr;


	thousandSeparator = getNumberSeparator(format.charAt(0));


	decimalSeparator = getNumberSeparator(format.charAt(1));


	sNbr = sNbr.replace(/[ ]/g,"");


	


	if(sNbr.indexOf(",") == -1){//check if "." is thousand separator or decimal separator


		aNbr = sNbr.split(".");


		if(aNbr.length > 2)sNbr = sNbr.replace(/\./g,"");


		else if(aNbr.length == 2 && (aNbr[0].length != 3 || aNbr[1].length != 3) && thousandSeparator != "")sNbr = sNbr.replace(thousandSeparator,decimalSeparator);


		sNbr = sNbr.replace(thousandSeparator,"");


		sNbr = sNbr.replace(decimalSeparator,".");


	}


	else{


		sNbr = sNbr.replace(/\./g,"");


		sNbr = sNbr.replace(/\,/g,".");


	}


	if (parseFloat(sNbr) != sNbr)return 0;


	return parseFloat(sNbr);


}


function formatNumber(sNbr,format){


	if(sNbr=="")return "";


	thousandSeparator = getNumberSeparator(format.charAt(0));


	decimalSeparator = getNumberSeparator(format.charAt(1));


	nbrOfDecimal = format.substring(2);


	sNbr = getNumber(sNbr,format);


	sign = "";


	if (nbrOfDecimal!=""){


		roundTo = Math.pow(10,nbrOfDecimal);


		sNbr = Math.round(sNbr*roundTo)/roundTo;


	}


	if (sNbr < 0){


		sNbr = - sNbr;


		sign = "- ";


	}


	sNbr = "" + sNbr;


	aNbr = sNbr.split(".");


	tmp="";


	for(var i=aNbr[0].length-2;i>1;i-=3){tmp = thousandSeparator + aNbr[0].substring(i-1,i+2) + tmp;}


	aNbr[0]=aNbr[0].substring(i-1,i+2) + tmp;


	if (nbrOfDecimal != ""){


		if (aNbr.length == 1)aNbr[1]= repeatString("0",nbrOfDecimal);


		if (aNbr[1].length < nbrOfDecimal)aNbr[1] = aNbr[1] + repeatString("0",nbrOfDecimal - aNbr[1].length);


	}


	else{if (aNbr.length == 1)aNbr[1]= "";}


	decimalSeparator=(aNbr[1]=="")?"":decimalSeparator;


	return sign + aNbr[0] + decimalSeparator + aNbr[1];


}


function isNumber(oNumber){


	if(oNumber.value=="") return true;


	oNumber.value = getNumber(oNumber.value,oNumber.format);


	if (oNumber.value != ''){


		if (parseFloat(oNumber.value) != oNumber.value){ 


			alert('Please enter a number in ' + oNumber.getAttribute("label"));


			fieldFocus(oNumber);


			return false;


		}


		if (oNumber.getAttribute("min") != null 


				& oNumber.value < parseFloat(oNumber.getAttribute("min"))){


			alert(oNumber.getAttribute("label") + " " + checknumbergt + " " + oNumber.getAttribute("min"));


    					fieldFocus(oNumber);


    					return false;


		}


		if (oNumber.getAttribute("max") != null 


				& oNumber.value > parseFloat(oNumber.getAttribute("max"))){


			alert(oNumber.getAttribute("label") + " " + checknumberlt + " " + oNumber.getAttribute("max"));


    		fieldFocus(oNumber);


    		return false;


		}


	}	


	return true;


}


function autoFormatNumber(oNbr,format){


	oNbr.value=formatNumber(oNbr.value,format);


}


function isEmail(oEmail){


	if (oEmail.value == "") return true;


	var AtSym = oEmail.value.indexOf("@")


	var Period = oEmail.value.lastIndexOf(".")


	var Space = oEmail.value.indexOf(" ")


	var Length = oEmail.value.length - 1


	if ((AtSym < 1) ||


	    (Period <= AtSym+2) ||


	    (Period >= Length-1 ) ||


	    (Space  != -1))


	{  


	      alert(oEmail.getAttribute("label") + checkemail);


	      fieldFocus(oEmail);


		  return false;


	}


	return true;


}


function isID(oID){


	if (oID.value != oID.value.replace(/\W/,'_') || oID.value.substring(0,1) != oID.value.substring(0,1).replace(/\d/,'_')){


	      alert(oID.getAttribute("label") + checkid);


	      fieldFocus(oID);


		  return false;


	}


	return true;


}


function isLink(oLink){


	var FirstDot = oLink.value.indexOf('.')


	var LastDot = oLink.value.lastIndexOf('.')


	var Space = oLink.value.indexOf(' ')


	var Length = oLink.value.length - 1


	if ((oLink.value != '')&&


		((FirstDot < 1) ||


	    (LastDot <= FirstDot+2) ||


	    (LastDot >= Length-1 ) ||


	    (Space  != -1)))


	{  


	      alert(oLink.getAttribute("label") + checkurl);


	      fieldFocus(oLink);


		  return false;


	}


	return true;


}


var iLeftChar;


function isValidLength(oField){


	iMaxLength = oField.getAttribute("maxlength");


	if (iMaxLength == null || iMaxLength == "")return true;


	iLeftChar = iMaxLength - oField.value.length;


	oLeftChar = gbid[oField.name + "__leftChar"];


	if (oLeftChar){


		oLeftChar.innerText = iLeftChar;


		if (iLeftChar < 0){


			oLeftChar.style.color = "red";


			oLeftChar.style.fontWeight = "bold";


		}


		else {


			oLeftChar.style.color = "silver";


			oLeftChar.style.fontWeight = "";


		}


	}


	if (iLeftChar < 0)return false;


	else return true;


}


function isArea(oField){


	if (isValidLength(oField))return true;


	alert(oField.label + checklength + " " + oField.maxlength + " (> " + -iLeftChar + ").");


	return false;


}


function isInteger(oInteger){


	if(oInteger.value=="") return true;


	if (!isNumber(oInteger)) return false;


	if (parseInt(oInteger.value)!= oInteger.value){


		alert(oInteger.getAttribute("label") + checkinteger);


		fieldFocus(oInteger);


		return false;


	}	


	return true;


}


function autoFormatDate(oDate){


	var sDate;


	sDate=oDate.value;


	if(sDate.length == 0)return true;


	Today = new Date();


	rExp = new RegExp("[- .]", "gi");


	sDate = sDate.replace(rExp, '/');


	if (sDate.indexOf("/") == -1){


		d = sDate.substring(0, 2);


		m = sDate.substring(2, 4);


		y = sDate.substring(4, sDate.length);


	}


	else{


		d = sDate.substring(0,sDate.indexOf("/"));


		if(sDate.indexOf("/") < sDate.lastIndexOf("/")){


			m = sDate.substring(sDate.indexOf("/")+1,sDate.lastIndexOf("/"));


			y = sDate.substring(sDate.lastIndexOf("/") + 1, sDate.length);


		}


		else{


			m = sDate.substring(sDate.indexOf("/")+1,sDate.length);


			y = ""


		}


	}


	if(d.length > 2)return "checkday";


	if(m.length > 2)return "checkmonth";


	if(y.length > 4 || y.length == 3)return "checkyear";


	if(d.length < 2)d = "0" + d;


	if(m.length < 2)m = "0" + m;


	if(y.length < 3){


		if (y == ""){y = Today.getYear();}


		if(y.length == 1)y = "0" + y;


		if(y < 51)y = "20" + y;


		if(y > 50 && y < 100)y = "19" + y;


	}


	if (parseInt(y)!= y || parseInt(m,10)!= m || parseInt(d,10)!= d) return "checkdate";	


	if (m < 1 || m > 12) return "checkmonth";


	if (d < 1 || d > 31) return "checkday";	


	if ((m==2 || m==4 || m==6 || m==9 || m==11) && d==31) return "checkmonthday";	


	if (m == 2) {


		var isleap = (y % 4 == 0 && (y % 100 != 0 || y % 400 == 0));


		if (d > 29 || (d==29 && !isleap)) return "checkfebruary";


	}


	if(oDate.value){oDate.value = d + "/" + m + "/" + y};


	return true;


}


function isDate(oField){


	if (autoFormatDate(oField) == true)return true;


	alert(oField.getAttribute("label") + eval(autoFormatDate(oField)));


	fieldFocus(oField);


	return false;


}


function autoFormatYear(oYear){


	var sYear;


	sYear=oYear.value;


	if(sYear.length == 0)return true;


	if (parseFloat(sYear) != sYear)return "checkyear";


	if(sYear.length == 1)sYear = "0" + sYear;


	if(sYear < 51)sYear = "20" + sYear;


	if(sYear > 50 && sYear < 100)sYear = "19" + sYear;	


	if(oYear.value){oYear.value = sYear};


	return true;


}


function isYear(oField){


	if (autoFormatYear(oField) == true)return true;


	alert(oField.getAttribute("label") + eval(autoFormatYear(oField)));


	fieldFocus(oField);


	return false;


}


function autoFormatMonth(oMonth){


	var sMonth;


	sMonth=oMonth.value;


	if(sMonth.length == 0)return true;


	if (parseFloat(sMonth) != sMonth)return "checkmonth";


	if(sMonth < 1 || sMonth > 12)return "checkmonth";


	return true;


}


function isMonth(oField){


	if (autoFormatMonth(oField) == true)return true;


	alert(oField.getAttribute("label") + eval(autoFormatMonth(oField)));


	fieldFocus(oField);


	return false;


}


function autoFormatHour(oHour){


	var sHour;


	sHour=oHour.value;


	if(sHour.length == 0) return true;


	rExp = new RegExp("[- .h]", "gi");


	sHour = sHour.replace(rExp,":");


	if(sHour.indexOf(":") != -1){


		h = sHour.substring(0, sHour.indexOf(":"));


		m = sHour.substring(sHour.indexOf(":")+1, sHour.length);


	}


	else {


		h = sHour.substring(0,2);


		m = sHour.substring(2,sHour.length);


	}


	if(h.length == 0)h = "00";


	if(h.length == 1)h = "0" + h;


	if(m.length == 0)m = "00";


	if(m.length == 1)m = "0" + m;


	sHour = h + ":" + m;


	if (sHour.length < 3 || sHour.length > 5 || (sHour.indexOf(":") != 1 & sHour.indexOf(":") != 2))return "checkhour";


	if (parseInt(h,10)!= h || parseInt(m,10)!= m)return "checktime";


    if (h < 0 || h > 23)return "checkhour";


    if (m < 0 || m > 59)return "checkminutes";


	if(oHour.value) oHour.value = sHour;


	return true;


}


function isHour(oHour){


	if (oHour.length == 0)return true;


	if (autoFormatHour(oHour) == true)return true;


	alert(oHour.getAttribute("label") + eval(autoFormatHour(oHour)));


	fieldFocus(oHour);


	return false;


}


function showCalendar(sForm,sField,sDate){


	sUrl = uas_url_lib + "/calendar/index.cfm?MyForm=" + sForm + "&MyField=" + sField + "&MyValue=" + sDate;


	window.open(sUrl, "CalendarWindow", "width=200, height=118");


}


function isNull(oField){


	if(oField.field_type == 'twinList'){


		if(oField.name.substring(0, 9) == 'twinList2') { // 7 = len of 'twinList'


			switch (oField.length){


				case 0:


					return true;


					break;


				case 1:


					if(oField[0].value.length == 0)return true;


					break;


			}


		} 


		return false;


	}


	if(oField.type == 'radio' || oField.type == 'checkbox'){


		//var oMultipleField = eval("document.all." + oField.name);


		var oMultipleField = document.getElementsByName(oField.name);


		if(oMultipleField.length){	


			for (var i=0; i<oMultipleField.length; i++){


				if (oMultipleField[i].checked){


					return false;


					break;


				}


			}


		}


		else{if(oMultipleField.checked)return false;}


		return true


	}


	if(oField.value == '')return true;


	return false;


}


function getFieldPrefix(oField){


	prefix = oField.name.substring(0, oField.name.lastIndexOf("__"));


	return (prefix == "" ? "" : prefix + "__");


}


function isCompulsory(oField){


	if (oField.getAttribute("compulsory") > 0){


		oFieldIsNull = false


		// handle grid and subform field


		fieldPrefix = oField.name.substring(0, oField.name.lastIndexOf("__"));


		if(fieldPrefix && gbn(fieldPrefix)) {


			if((gbn(fieldPrefix).value > 0 || fieldPrefix.substring(0,8) == 'Modify__') && gbn("Delete__" + fieldPrefix).value == 0) {


				oFieldIsNull = isNull(oField);


			}


		}


		else{


			oFieldIsNull = isNull(oField);


			//alert(oField + " " + oField.name + " L: " + oField.length + " isNull: " + oFieldIsNull)


		}


		if (oFieldIsNull){


			alert(checkcompulsory + oField.getAttribute("label"));


			fieldFocus(oField);


			return true;


		}


	}


	return false;


}


function isInAutoFillList(oField){


	if (oField.value != '' & oField.getAttribute("limit2list") == '1' & oField.getAttribute("inlist") == '0'){


		alert(oField.getAttribute("label") + checkautofill);


		fieldFocus(oField);


		return false;


	}


	return true;


}


function isDependent(oField){


	if (!oField.dependencies || isNull(oField))return false;


	aDependencies = oField.dependencies.split(",");


	for (j=0; j<aDependencies.length; j++){


		oDependentField = gbn(aDependencies[j]);


		if (isNull(oDependentField)){


			alert(checkcompulsory + oDependentField.label + "\n" + checkdependent + " " + oField.label + ".");


			fieldFocus(oDependentField);


			return true;


		}


	}


	return false;


}


function checkForm(form){





	var oFields;


	if(form) oFields = form.getElementsByTagName("textarea");


	else oFields = document.getElementsByTagName("textarea");


	


	for (i = 0; i<oFields.length; i++){


		if (isCompulsory(oFields[i])){return false};


		if (isDependent(oFields[i])){return false};


		if (!isArea(oFields[i])){return false};


	}


	if(form) oFields = form.getElementsByTagName("select");


	else oFields = document.getElementsByTagName("select");


	for (i = 0; i<oFields.length; i++){


		if (isCompulsory(oFields[i])){return false};


		if (isDependent(oFields[i])){return false};


	}


	if(form) oFields = form.getElementsByTagName("input");


	else oFields = document.getElementsByTagName("input");


	for (i = 0; i<oFields.length; i++){


		if (isCompulsory(oFields[i])){return false};


		switch (oFields[i].getAttribute("field_type")){


			case 'email':


				if (isEmail(oFields[i])!=true) return false;


				break;


			case 'number':


				if (isNumber(oFields[i])!=true) return false;


				break;


			case 'integer':


				if (isInteger(oFields[i])!=true) return false;


				break;


			case 'link':


				//if (isLink(oFields[i])!=true) return false;


				break;


			case 'date':


				if (isDate(oFields[i])!=true) return false;


				break;


			case 'hour':


				if (isHour(oFields[i])!=true) return false;


				break;


			case 'id':


				if (isID(oFields[i])!=true) return false;


				break;


			case 'autofill':


				if (isInAutoFillList(oFields[i])!=true) return false;


				break;


		} // switch 


		if (isDependent(oFields[i]))return false;


	}


	freezeWindow();


	return true;


}


// Perform a check or uncheck "Action" on checkboxes if a custom "Attributes" equals a "Value"


function checkByAttributes(Attributes,Value,Action){


	var checkboxes = document.getElementsByTagName('input');


	for (i = 0; i<checkboxes.length; i++){


		if (eval("checkboxes[" + i + "]." + Attributes) == Value){


			if (Action == 'check'){checkboxes[i].checked = true;}


			else{checkboxes[i].checked = false;}


		}


	}


}


function dtmClearFilter(){


	for(var i=0; i<dsp_search.elements.length; i++) {


		switch(dsp_search.elements[i].type){


			case "text":


				dsp_search.elements[i].value = "";


				break;


			case "select-one":


				dsp_search.elements[i].options[0].selected = true;


				break;


		}


	}


}


// ************************* SUBFORM and GRID **********************


function dtmDelete(oDelete,oModify,oZone){


	oClicked = event.srcElement;


	if (oDelete.value == 0){


		if (confirm(confirmdelete))oDelete.value = 1;


	}


	else {oDelete.value = 0;}// Undelete


	if (oDelete.value == 1){


		if (oClicked.src) oClicked.src = oClicked.src.replace("/delete.gif","/undelete.gif");


		else oClicked.innerHTML = word_undelete;


		setStyleByID(oZone,'backgroundColor','#ffd0d0');


		setStyleByID(oZone,'color','red');


	}


	else {


		if (oClicked.src) oClicked.src = oClicked.src.replace("/undelete.gif","/delete.gif");


		else oClicked.innerHTML = word_delete;


		if (oModify.value == 1){


			setStyleByID(oZone,'backgroundColor','#CCFFCC');


			setStyleByID(oZone,'color','');


		}


		else {


			setStyleByID(oZone,'backgroundColor','');


			setStyleByID(oZone,'color','');


		}


	}


	document.body.focus();


}


function handleGrid(MyAction, MyField, MyLine){


	if(listFind("9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,91,92,144,145",window.event.keyCode,","))return;


	bAction = gbn(MyAction + '__' + MyLine);


	oZone = eval("Zone__" + MyAction + "__" + MyLine);


	bDelete = gbn('Delete__' + MyAction + '__' + MyLine);


	if(MyField.compulsory > 0 && MyField.value==''){


		bAction.value=1;


		bDelete.value=1;


		setStyleByID(oZone,'backgroundColor','#ffd0d0');


		setStyleByID(oZone,'color','red');


	}


	else{


		bAction.value=1;


		bDelete.value=0;


		setStyleByID(oZone,'backgroundColor','#CCFFCC');


		setStyleByID(oZone,'color','');


	}


}


// ************* END OF SUBFORM and GRID *******************