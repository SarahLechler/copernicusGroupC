//https://www.pegelonline.wsv.de/webservices/gis/aktuell/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=gk:waterlevels&outputFormat=json&BBOX=50.31,5.77,52.62,9.46

// save all pegel data:
var pegelData = [];
var chartExists = false;
function checkChartStatus() {
    if (chartExists === false) {
    } else {
        if (check_sidenav == false) {
            var currentPopup = document.getElementsByClassName("leaflet-popup-content");
            getChart(currentPopup["0"].children["0"].innerHTML);
        } else
        {
            multiple_chart(station_1, 0);
            multiple_chart(station_2, 1);
            multiple_chart(station_3, 2);
        }

    }
}

/**
 * gets the hex color components for R and G of RGB.
 * @param {type} min
 * @param {type} max
 * @param {type} avg
 * @param {type} current
 * @returns {String|getColor.hex}
 */
function getColor(min, max, avg, current) {
    var range = max - min;
    var scaledMin = min - range / 4;
    var scaledMax = max + range / 4;
    var scaledRange = scaledMax - scaledMin;
    var avgRangeLow = avg - min;
    var avgRangeHigh = max - avg;
    var avg_low = avg - (avgRangeLow * 0.05);
    var avg_high = avg + (avgRangeHigh * 0.05);

    if (current > max)
        max = current;

    var red = 0;
    var green = 0;
    var blue = 0;
//    if (current <= avg_low) {
//        green = Math.round((current - min) / (avg_low - min) * 255);
//        blue = Math.round((avg_low - current) / (avg_low - min) * 255);
//    } else if ((current > avg_low) && (current <= avg)) {
//        red = Math.round((current - avg_low) / (avg - avg_low) * 128);
//        green = 255 - Math.round((current - avg_low) / (avg - avg_low) * 64);
//    } else if ((current > avg) && (current <= avg_high)) {
//        red = 127 + Math.round((current - avg) / (avg_high - avg) * 128);
//        green = 172 - Math.round((current - avg) / (avg_high - avg) * 64);
//    } else if (current > avg_high) {
//        red = 255;
//        green = 128 - Math.round((current - avg_high) / (max - avg_high) * 128);
//    } else {
//        red = 178;
//        green = 178;
//        blue = 178;
//    }
    if (current < avg) {
        red = Math.round((current - min) / (max - min) * 210);
        green = 210;
    } else {
        red = 210;
        green = 210 - Math.round((current - min) / (max - min) * 210);
    }

    if (red < 0 || green < 0 || blue < 0)
        console.log("fehler weil: " + red + "," + green + "," + blue);

    var red_hex = red.toString(16);
    var red_val = red_hex.length === 1 ? "0" + red_hex : red_hex;

    var green_hex = green.toString(16);
    var green_val = green_hex.length === 1 ? "0" + green_hex : green_hex;

    var blue_hex = blue.toString(16);
    var blue_val = blue_hex.length === 1 ? "0" + blue_hex : blue_hex;

    return red_val + green_val + blue_val;
}
;
function allDaysExist(stationname) {
    for (var i = 0; i < 30; i++) {
        if (!allPegelData[stationname][i])
            return false;
    }
    return true;
}
;

var gauging_stations_layer = new L.FeatureGroup();
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
                                var waterIcon = L.MakiMarkers.icon({
                                    icon: "water",
                                    color: "#" + getColor(allPegelData[stationname].min, allPegelData[stationname].max, allPegelData[stationname].avg, res[0].value),
                                    size: "l",
                                    stationname: stationname
                                });
                                var marker = new L.marker([lat, lon], {icon: waterIcon});
                                marker.bindPopup("<b>" + stationname + "</b><br> Water : " + stationname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
                                gauging_stations_layer.addLayer(marker);
                            } else {
                                var waterIcon = L.MakiMarkers.icon({
                                    icon: "water",
                                    color: "#A1A1A1",
                                    size: "l",
                                    stationname: stationname
                                });
                                var marker = new L.marker([lat, lon], {icon: waterIcon});
                                marker.bindPopup("<b>" + stationname + "</b><br> Water : " + stationname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
                                gauging_stations_layer.addLayer(marker);
                            }

                            allPegelData[stationname].marker = marker;
                        }
                        map.addLayer(gauging_stations_layer);
                        return res;
                    },
                    function (error) {
//                        console.log(error);
                        error["day"] = plusDay;
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
                            if (res[0]) {
                                if (res[0].value) {
                                    allPegelData['' + stationname].stationname = stationname;
                                    allPegelData['' + stationname].sum += res[0].value;
                                    allPegelData['' + stationname][res.day] = res[0].value;
                                    allPegelData['' + stationname].avg = allPegelData['' + stationname].sum / 31;
                                }
                            } else {
//                                console.log("NO DATA FOR DIS");
                            }
                        },
                        function (error) {
                            allPegelData['' + stationname][error.day] = undefined;
                            console.log("NO DATA FOR DIS");
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
        async: true,
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

var station_1;
var station_2;
var station_3;
map.on('popupopen', function (e) {
    console.log(e);
    console.log(count_gauging_station);
    getChart(e.popup._source.options.icon.options.stationname);
    if (count_gauging_station < 3 && check_sidenav == true) {
        if (count_gauging_station == 0)
            station_1 = e.popup._source.options.icon.options.stationname;
        if (count_gauging_station == 1)
            station_2 = e.popup._source.options.icon.options.stationname;
        if (count_gauging_station == 2)
            station_3 = e.popup._source.options.icon.options.stationname;
        multiple_chart(e.popup._source.options.icon.options.stationname, count_gauging_station);
        count_gauging_station = count_gauging_station + 1;
    }
});
map.on('popupclose', function () {
    if (check_sidenav == true)
        chartExists = true;
    else
        chartExists = false;
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
                    var timeLabel = result[i].timestamp.substring(11, 16);
                    datapoints.push({label: timeLabel, y: result[i].value, toolTipContent: result[i].timestamp + " : " + result[i].value});
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
    chartExists = true;
}

var water_pressed = true;
function getWater() {
    water_pressed = !water_pressed;
    var water_button = document.getElementById('water_button');
    if (water_pressed) {
        water_button.className = 'water_pressed';
        water_button.src = "images/waterlevel_white.png";
        map.addLayer(gauging_stations_layer);
    } else {
        water_button.className = 'water_unpressed';
        water_button.src = "images/waterlevel.png";
        map.removeLayer(gauging_stations_layer);
    }
    updateLegend();
}
;
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
