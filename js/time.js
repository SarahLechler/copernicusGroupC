function selectedTime() {
    var val = document.getElementById('range').value;
    console.log(unique_date[val]);
    console.log(val);

    return unique_date[val];
}

function selectedTimeEnd() {
    console.log("onended");
}

function test124(){
    console.log("ondrag");
}
function test125(){
    console.log("onSlide");
}