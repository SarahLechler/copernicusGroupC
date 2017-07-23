
var legend = L.control({position: 'bottomleft'});
var weatherBox = "none";        // hide on default
var satelliteBox = "none";      // hide on default
var precipitationBox = "none";  // hide on default
var gaugingStationBox = "";     // show on default

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
        valuesTable += '<table><tr><td><img class="legendIcon" src="images/01d.png"></img> Clear sky.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/02d.png">Few clouds.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/03d.png">Scattered clouds.</td></tr>';
//        valuesTable += '<span id="weatherSpan"><img class="legendIcon" src="images/01d.png"></img>';
//        valuesTable += 'Clear sky.</span>';
//        valuesTable += '<span id="weatherSpan"><img class="legendIcon" src="images/02d.png"></img>';
//        valuesTable += 'Few clouds.</span>';
//        valuesTable += '<span id="weatherSpan"><img class="legendIcon" src="images/03d.png"></img>';
//        valuesTable += 'Scattered clouds.</span><br>';
        valuesTable += '<tr><td><img class="legendIcon" src="images/04d.png"></img> Broken clouds.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/05d.png">Shower rain.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/06d.png">Rain.</td></tr>';
//        valuesTable += '<span><img class="legendIcon" src="images/04d.png"></img>';
//        valuesTable += 'Broken clouds.</span>';
//        valuesTable += '<span><img class="legendIcon" src="images/05d.png"></img>';
//        valuesTable += 'Shower rain.</span>';
//        valuesTable += '<span><img class="legendIcon" src="images/06d.png"></img>';
//        valuesTable += 'Rain.</span><br>';
        valuesTable += '<tr><td><img class="legendIcon" src="images/07d.png"></img>Thunderstorm.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/08d.png">Snow.</td>';
        valuesTable += '    <td><img class="legendIcon" src="images/09d.png">Mist.</td></tr></table>';
//        valuesTable += '<span><img class="legendIcon" src="images/07d.png"></img>';
//        valuesTable += 'Thunderstorm.</span>';
//        valuesTable += '<span><img class="legendIcon" src="images/08d.png"></img>';
//        valuesTable += 'Snow.</span>';
//        valuesTable += '<span><img class="legendIcon" src="images/09d.png"></img>';
//        valuesTable += 'Mist.</span>';
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

