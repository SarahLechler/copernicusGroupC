
var legend = L.control({position: 'bottomleft'});
var weatherBox = "none";        // hide on default
var satelliteBox = "none";      // hide on default
var precipitationBox = "none";  // hide on default
var gaugingStationBox = "";     // show on default

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

    legend.onAdd = function () {
        var div = L.DomUtil.create('CopernicusLegend', 'legend-description');

        var valuesTable = '<span class="layer-description-title">Legend:</span> <br>';
        valuesTable += '<div class="layer-description-container">';

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
        valuesTable += '<span><img class="legendIcon" src="images/lgd_precip.png"></img>';
        valuesTable += 'precipitation</span>';
        valuesTable += '</span><br></div>';

        valuesTable += '<div id="gaugingStationBox" style="display: ' + gaugingStationBox + '"><span>';
        valuesTable += '<b>Gauging stations:</b> description of gauging stations.';
        valuesTable += '</span></div>';

        valuesTable += '</div>';

        div.innerHTML += '<div>' + valuesTable + '</div>';

        return div;
    }
    ;

    legend.addTo(map);
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
};

