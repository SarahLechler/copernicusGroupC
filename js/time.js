function selectedTime() {
    var val = document.getElementById('range').value;
    console.log(unique_date[val]);
    console.log(val);

    return unique_date[val];
}

function selectingTime() {
    var val = document.getElementById('range').value;
    updateGaugingStations(val);
    changeSatelliteImage(val);
    return unique_date[val];
}

function changeSatelliteImage(val) {
    var changedDate = Date.parse(new Date (unique_date[val]));
    this.processedDataLayer.setTimeRange(changedDate - 259200, changedDate + 259200);
    console.log("redrawingLayer");
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
        if ((obj.min !== undefined) && (obj.max !== undefined) && (obj[val] !== undefined)) {
            gauging_stations_layer.removeLayer(obj.marker);
            var waterIcon = L.MakiMarkers.icon({
                icon: "water",
                color: "#" + getColor(obj.min, obj.max, obj.avg, obj[val]),
                size: "l",
                stationname: obj.stationname
            });
            obj.marker = new L.marker([obj.latitude, obj.longitude], {icon: waterIcon});
        } else {
            gauging_stations_layer.removeLayer(obj.marker);
            var waterIcon = L.MakiMarkers.icon({
                icon: "water",
                color: "#A1A1A1",
                size: "l",
                stationname: obj.stationname
            });
            obj.marker = new L.marker([obj.latitude, obj.longitude], {icon: waterIcon});
        }
        obj.marker.bindPopup("<b>" + obj.stationname + "</b><br> Water : " + obj.stationname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
        gauging_stations_layer.addLayer(obj.marker);

    }
    // End <-- Gauging stations -->
}
