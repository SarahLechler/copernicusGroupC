function selectedTime() {
    var val = document.getElementById('range').value;
    console.log(unique_date[val]);
    console.log(val);
    var dateYMD = new Date(unique_date[val]);
    var dateMS = Date.parse(dateYMD) //time in millisec since  January 1st 1970 00:00:00 UTC
    changeSatelliteImage(dateMS);
    return unique_date[val];
}

var range = document.getElementById('range');
range.addEventListener ('change', changeSatelliteImage());

function changeSatelliteImage() {
    var changedDate = new Date (document.getElementById('range').value);
    console.log(changedDate); //DateAdd(startDate, 7, 'days'); to set timerange on EsriFunctions
    debugger;
    this.processedDataLayer.setTimeRange(changedDate - 259200, changedDate + 259200); //enter times here ("on drag");
    console.log("redrawingLayer");
}



function selectedTimeEnd() {
    console.log("onended");
}


function test125() {
    console.log("onSlide");
}

