function selectedTime() {
    var val = document.getElementById('range').value;
    console.log(unique_date[val]);
    console.log(val);

    return unique_date[val];
}

function selectingTime() {
    var val = document.getElementById('range').value;
    updateGaugingStations(val);
    return unique_date[val];
}

function updateGaugingStations(val) {
    // Start <-- Gauging stations -->
    for (var key in allPegelData) {
        // skip loop if the property is from prototype
        if (!allPegelData.hasOwnProperty(key))
            continue;
        var obj = allPegelData[key];
        if (!obj.marker)
            continue;
        if ((obj.min != undefined) && (obj.max != undefined) && (obj[val] != undefined)) {
            obj.marker.setStyle(
                    {
                        color: '#0000FF',
                        weight: 2,
                        fill: true,
                        fillColor: '#' + getColor(obj.min, obj.max, obj[val]) + "FF",
                        fillOpacity: 1,
                        radius: 10,
                        opacity: 1,
                        className: obj.stationname
                    }
            );
        } else {
            obj.marker.setStyle(
                    {
                        color: '#0000FF',
                        weight: 2,
                        fill: true,
                        fillColor: '#c1c1c1',
                        fillOpacity: 1,
                        radius: 10,
                        opacity: 1,
                        className: obj.stationname
                    }
            );
        }
    }
    // End <-- Gauging stations -->