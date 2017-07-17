//https://www.pegelonline.wsv.de/webservices/gis/aktuell/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=gk:waterlevels&outputFormat=json&BBOX=50.31,5.77,52.62,9.46



var URL = "http://pegelonline.wsv.de/webservices/rest-api/v2/stations.json?latitude=51.42&longitude=8.01&radius=175&includeTimeseries=true&includeCurrentMeasurement=true";
$.ajax({
    url: URL,
    method: "GET",
    dataType: "json",
    async: false,
    success: function (result) {
        console.log(result);
        addWater(result);
    },
    error: function (xhr, textStatus, errorThrown) {
        alert("Unable to fetch Server data")
    }
});


function addWater(result) {

    for (i in result) {
        var station_name = result[i].shortname;
        var lat = result[i].latitude;
        var lon = result[i].longitude;
        if (lat != null && lon != null) {
            if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal' || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low') && result[i].timeseries[0].currentMeasurement.trend == '1') {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/low_positive.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal' || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low') && (result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0')) {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/low_negative.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && result[i].timeseries[0].currentMeasurement.trend == '1') {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/high_positive.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && (result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0')) {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/high_negative.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && result[i].timeseries[0].currentMeasurement.trend == '-999') {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/high.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low' || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal') && result[i].timeseries[0].currentMeasurement.trend == '-999') {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/low.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else if (result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0') {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/neutral_negative.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            } else {
                var waterIcon = L.Icon.Label.extend({
                    options: {
                        iconUrl: 'images/neutral_positive.png',
                        shadowUrl: null,
                        iconSize: new L.Point(24, 24),
                        iconAnchor: new L.Point(0, 1),
                        labelAnchor: new L.Point(26, 0),
                        wrapperAnchor: new L.Point(12, 13),
                    }
                });
            }
            var marker = new L.Marker.Label([lat, lon], {className: station_name, icon: new waterIcon({labelText: "<b>" + result[i].timeseries[0].currentMeasurement.value + "</b>"})}).addTo(map);
            marker.bindPopup("<b>" + station_name + "</b><br> Water : " + result[i].water.shortname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");


        }

    }
}

// save all pegel data:
var pegelData = [];

/**
 * gets the hex color components for R and G of RGB.
 * @param {type} min
 * @param {type} max
 * @param {type} current
 * @returns {String|getColor.hex}
 */
function getColor(min, max, current) {
    var range = max - min;
    var scaledMin = min - range / 4;
    var scaledMax = max + range / 4;
    var scaledRange = scaledMax - scaledMin;
    var perc = Math.round((current - scaledMin) / (scaledRange) * 255);
    perc = 255 - perc;
    var hex = perc.toString(16);
    var val = hex.length === 1 ? "0" + hex : hex;
    if (hex < "00")
        return "0000";
    return val + "" + val;
}

function allDaysExist(stationname) {
    for (var i = 0; i < 30; i++) {
        if (!allPegelData[stationname][i])
            return false;
    }
    return true;
}
;

function getDayData(stationname, plusDay, lat, lon) {
    var now = new Date();
    var startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 12, 0, 0);
    startDate.setDate(startDate.getDate() + plusDay);
    var month = 0;
    if (startDate.getMonth() + 1 < 10)
        month = "0" + (startDate.getMonth() + 1);
    else
        month = (startDate.getMonth() + 1);
    var day = 0;
    if (startDate.getDate() < 10)
        day = "0" + (startDate.getDate());
    else
        day = (startDate.getDate());

    return $.ajax({
        url: "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/"
                + encodeURIComponent(stationname) + "/W/measurements.json"
                + "?start=" + encodeURIComponent(
                        startDate.getFullYear()
                        + "-" + month
                        + "-" + day
                        + "T12:00+02:00")
                + "&end=" + encodeURIComponent(
                        startDate.getFullYear()
                        + "-" + month
                        + "-" + day
                        + "T12:01+02:00"),
        method: "GET",
        dataType: "json",
        async: true
    })
            .then(
                    function (res) {
                        res["stationname"] = stationname;
                        if (res[0])
                            if (res[0].value)
                                res["value"] = res[0].value;
                            else
                                console.log(res);
                        res["day"] = plusDay;
                        if (allDaysExist(stationname)) { // if all days are obtained, create marker:
                            var min = allPegelData[stationname][0];
                            var max = allPegelData[stationname][0];
                            for (var i = 1; i < 31; i++) {
                                var curr = allPegelData[stationname][i];
                                if (curr < min)
                                    min = curr;
                                if (curr > max)
                                    max = curr;
                            }
                            allPegelData[stationname].min = min;
                            allPegelData[stationname].max = max;
                            if ((res[0]) && (res[0].value)) {
                                var marker = new L.CircleMarker(
                                        [lat, lon],
                                        {
                                            color: '#0000FF',
                                            weight: 2,
                                            fill: true,
                                            fillColor: '#' + getColor(allPegelData[stationname].min, allPegelData[stationname].max, res[0].value) + "FF",
                                            fillOpacity: 1,
                                            radius: 10,
                                            opacity: 1,
                                            className: stationname
                                        }).addTo(map);
                            } else {
                                var marker = new L.CircleMarker(
                                        [lat, lon],
                                        {
                                            color: '#0000FF',
                                            weight: 2,
                                            fill: true,
                                            fillColor: '#c1c1c1',
                                            fillOpacity: 1,
                                            radius: 10,
                                            opacity: 1,
                                            className: stationname
                                        }).addTo(map);
                            }
                            marker.bindPopup("<b>" + stationname + "</b><br> Water : " + stationname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
                            allPegelData[stationname].marker = marker;
                        }
                        return res;
                    },
                    function (error) {
//                        console.log(error);
                        return error;
                    }
            );
}

var allPegelData = {

};

// get data from last 30 days for station with name stationname:
function getStationData(stationname, lat, lon) {
    for (var i = 0; i < 31; i++) {
        getDayData(stationname, i, lat, lon)
                .then(
                        function (res) {
                            if (res[0])
                                if (res[0].value) {
                                    allPegelData['' + stationname].stationname = stationname;
                                    allPegelData['' + stationname].sum += res[0].value;
                                    allPegelData['' + stationname][res.day] = res[0].value;
                                    allPegelData['' + stationname].avg = allPegelData['' + stationname].sum / 31;
                                }
                        });
    }
}
;

//function addWater(result) {
//    for (var i in result) {
//        var station_name = result[i].shortname;
//        var lat = result[i].latitude;
//        var lon = result[i].longitude;
//        if (lat != null && lon != null) {
//            if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal'
//                    || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low')
//                    && result[i].timeseries[0].currentMeasurement.trend == '1') {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/low_positive.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal'
//                    || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low')
//                    && (result[i].timeseries[0].currentMeasurement.trend == '-1'
//                            || result[i].timeseries[0].currentMeasurement.trend == '0')) {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/low_negative.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && result[i].timeseries[0].currentMeasurement.trend == '1') {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/high_positive.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && (result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0')) {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/high_negative.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if (result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high' && result[i].timeseries[0].currentMeasurement.trend == '-999') {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/high.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if ((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low' || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal') && result[i].timeseries[0].currentMeasurement.trend == '-999') {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/low.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else if (result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0') {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/neutral_negative.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            } else {
//                var waterIcon = L.Icon.Label.extend({
//                    options: {
//                        iconUrl: 'images/neutral_positive.png',
//                        shadowUrl: null,
//                        iconSize: new L.Point(24, 24),
//                        iconAnchor: new L.Point(0, 1),
//                        labelAnchor: new L.Point(26, 0),
//                        wrapperAnchor: new L.Point(12, 13),
//                    }
//                });
//            }
//            var marker = new L.Marker.Label([lat, lon], {className: station_name, icon: new waterIcon({labelText: "<b>" + result[i].timeseries[0].currentMeasurement.value + "</b>"})}).addTo(map);
//            marker.bindPopup("<b>" + station_name + "</b><br> Water : " + result[i].water.shortname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
//
//        }
//
//    }
//}

var date = [];
var unique_date = [];
window.onload = function () {
    var URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/BONN/W/measurements.json?start=P30D";
    $.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            for (i in result) {
                date.push((result[i].timestamp).split('T', 11));
            }
            var hash = {};
            for (var i = 0; i < date.length; i++) {
                var key = date[i][0];
                if (!hash[key]) {
                    unique_date.push(date[i][0]);
                    hash[key] = 'found';
                }
            }

            console.log(unique_date);
            date_for_slider(unique_date);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });


}


function date_for_slider(unique_date) {
    for (var i in unique_date) {
        $('<span class="slider-step-text" >I<br>' + unique_date[i].substr(5, 10) + '</span>').appendTo('#steps');
    }

}

map.on('popupopen', function (e) {
    console.log(e);
    getChart(e.target._popup._source.options.className);
});


function getChart(station_name) {
    var datapoints = [];
    console.log("trying to obtain chart data for station:" + station_name)
    var URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/" + station_name + "/W/measurements.json?start=P30D";
    $.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            console.log(result);
            var date_slider = selectedTime();
            for (var i in result) {
                if (date_slider == (result[i].timestamp).substr(0, 10)) {
                    datapoints.push({label: result[i].timestamp.substr(0, 10), y: result[i].value, toolTipContent: result[i].timestamp + " : " + result[i].value});
                }

            }
            var chart = new CanvasJS.Chart("chartContainer",
                    {
                        zoomEnabled: true,
                        panEnabled: true,
                        title: {
                            text: "Water level as on " + date_slider
                        },
                        axisY: {
                            includeZero: false
                        },
                        data: [{
                                type: "line",
                                dataPoints: datapoints
                            }]

                    });

            chart.render();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error obtaining chart data");
        }
    });

}




$.ajax({
    url: "http://pegelonline.wsv.de/webservices/rest-api/v2/stations.json" +
            "?latitude=51.42" +
            "&longitude=8.01" +
            "&radius=175",
    method: "GET",
    dataType: "Json",
    async: true,
    success: function (result) {
        var current = 0;
        for (var current in result) {
            var currStationData = {
                stationname: "",
                latitude: undefined,
                longitude: undefined,
                sum: 0,
                avg: 0,
                min: undefined,
                max: undefined,
                marker: undefined
            };
            if (result[current].latitude)
                currStationData.latitude = result[current].latitude;
            if (result[current].longitude)
                currStationData.longitude = result[current].longitude;
            allPegelData['' + result[current].shortname] = currStationData;
            getStationData(result[current].shortname, currStationData.latitude, currStationData.longitude);
//                    for (i in result) {
//                        if (date_slider == (result[i].timestamp).substr(0, 10)) {
//                            datapoints.push({label: result[i].timestamp.substr(0, 10), y: result[i].value, toolTipContent: result[i].timestamp + " : " + result[i].value});
//                        }
//                    }
        }
        console.log(allPegelData);
        ;
    },
    error: function () {
        console.log("error");
    }
});
