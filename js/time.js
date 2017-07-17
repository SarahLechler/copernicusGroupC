function selectedTime() {
    console.log("selectedTime");
    var val = document.getElementById('range').value;
    console.log(unique_date[val]);
    console.log(val);
    return unique_date[val];
}

function selectingTime() {
    var val = document.getElementById('range').value;
    // val
    for (var key in allPegelData) {
        // skip loop if the property is from prototype
        if (!allPegelData.hasOwnProperty(key))
            continue;
        var obj = allPegelData[key];
        if (!obj.marker)
            continue;
        obj.marker.setStyle(
                {
                    color: '#0000FF',
                    weight: 2,
                    fill: true,
                    fillColor: '#' + getColor(obj.min, obj.max, obj[val]) + "FF",
                    fillOpacity: 1,
                    radius: 10,
                    opacity: 1
                }
        );
    }
    return unique_date[val];
}
