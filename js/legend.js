
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

        valuesTable += '<div id="weatherBox" style="display: ' + weatherBox + '"><span>';
        valuesTable += '<b>Weather:</b> description of weather.';
        valuesTable += '</span></div>';

        valuesTable += '<div id="satelliteBox" style="display: ' + satelliteBox + '"><span>';
        valuesTable += '<b>Satellite:</b> description of satellite';
        valuesTable += '</span></div>';

        valuesTable += '<div id="precipitationBox" style="display: ' + precipitationBox + '"><span>';
        valuesTable += '<b>Precipitation:</b> description of precipitation';
        valuesTable += '</span></div>';

        valuesTable += '<div id="gaugingStationBox" style="display: ' + gaugingStationBox + '"><span>';
        valuesTable += '<b>Gauging stations:</b> description of gauging stations';
        valuesTable += '</span></div>';

        valuesTable += '</div>';

        div.innerHTML += '<div>' + valuesTable + '</div>';

        return div;
    }
    ;

    legend.addTo(map);
};

loadLegend();

updateLegend = function(){
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

