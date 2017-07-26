
var legend = L.control({position: 'bottomleft'});
var weatherBox = "none";        // hide on default
var satelliteBox = "none";      // hide on default
var precipitationBox = "none";  // hide on default
var gaugingStationBox = "";     // show on default
var legendOpen = true;

/**
 * checks if it's dark outside.
 * @returns {true if 5AM > daytime  or daytime >= 10PM}
 */
isNight = function () {
    var d = new Date(); // current time
    var hours = d.getHours();

    return (hours < 5)
            || (hours >= 22);
};

/**
 * Displays a legend
 * @returns {undefined}
 */
loadLegend = function () {
    legend.addTo(map);
};

legend.onAdd = function () {
    var div = L.DomUtil.create('CopernicusLegend', 'legend-description');
    if (legendOpen){
        var valuesTable = '<span class="layer-description-title">Legend:<button id="legendButton" style="position: absolute; right: 10px;" onclick="manageLegend()">-</button></span><br>';
    }
    else
        var valuesTable = '<span class="layer-description-title">Legend:</span> <button id="legendButton" style="float:right" onclick="manageLegend()">+</button> <br>';
    valuesTable += '<div class="layer-description-container" id="legendContent">';

    valuesTable += '<div id="satelliteBox" style="display: ' + satelliteBox + '"><span>';
    valuesTable += '<b>Satellite:</b><br>';
    valuesTable += '<span><img class="legendIcon" src="images/lgd_satellite.png"></img>';
    valuesTable += 'Waterbodies from the processed satellite images.</span>';

    valuesTable += '</span><br></div>';
    valuesTable += '<div id="weatherBox" style="display: ' + weatherBox + '"><span>';
    valuesTable += '<b>Weather:</b><br>';
    if (isNight()) {
        valuesTable += '<table><tr><td><img class="legendIcon" src="images/01dn.png"></img> Clear sky.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/02dn.png"></img> Few clouds.</td>';
    } else {
        valuesTable += '<table><tr><td><img class="legendIcon" src="images/01d.png"></img> Clear sky.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/02d.png"></img> Few clouds.</td>';
    }
    valuesTable += '    <td><img class="legendIcon" src="images/03d.png"></img> Scattered clouds.</td></tr>';
    valuesTable += '    <tr><td><img class="legendIcon" src="images/04d.png"></img> Broken clouds.</td>';
    valuesTable += '<td><img class="legendIcon" src="images/05d.png"></img> Shower rain</td>';
    if (isNight()) {
        valuesTable += '    <td><img class="legendIcon" src="images/06dn.png"></img> Rain</td></tr>';
    } else {
        valuesTable += '    <td><img class="legendIcon" src="images/06d.png"></img> Rain</td></tr>';
    }
    valuesTable += '<tr><td><img class="legendIcon" src="images/07d.png"></img> Thunderstorm</td>';
    valuesTable += '    <td><img class="legendIcon" src="images/08d.png"></img> Snow</td>';
    valuesTable += '    <td><img class="legendIcon" src="images/09d.png"></img> Mist</td></tr></table>';
    valuesTable += '</span><br></div>';

    valuesTable += '<div id="precipitationBox" style="display: ' + precipitationBox + '"><span>';
    valuesTable += '<b>Precipitation:</b><br>';
    valuesTable += '<span>Low<img class="legendIconGauging" src="images/lgd_precip.png"></img>';
    valuesTable += 'High</span>';
    valuesTable += '</span><br></div>';

    valuesTable += '<div id="gaugingStationBox" style="display: ' + gaugingStationBox + '"><span>';
    valuesTable += '<b>Gauging stations:</b><br>';
    valuesTable += '<span>Min<img class="legendIconGauging" src="images/lgd_gauging.png"></img>';
    valuesTable += 'Max</span>';
    valuesTable += '</span></div>';

    valuesTable += '</div>';

    div.innerHTML += '<div>' + valuesTable + '</div>';
//    div.className += " hideInPrint";

    return div;
}
;

manageLegend = function () {
    if ($("#legendButton").html() === "-") {
        $("#legendButton").html("+");
        legendOpen = false;
    } else {
        $("#legendButton").html("-");
        legendOpen = true;
    }
    $("#legendContent").slideToggle();
};

loadLegend();

updateLegend = function () {
    if (precip_pressed) {
        precipitationBox = "";
    } else {
        precipitationBox = "none";
    }

    if (satellite_pressed) {
        satelliteBox = "";
    } else {
        satelliteBox = "none";
    }

    if (weather_pressed) {
        weatherBox = "";
    } else {
        weatherBox = "none";
    }

    if (water_pressed) {
        gaugingStationBox = "";
    } else {
        gaugingStationBox = "none";
    }

    if (legend)
        map.removeControl(legend);
    loadLegend();
    if (legendOpen === false)
        $("#legendContent").slideToggle(0);
    console.log("legendOpen is " + legendOpen)
};

