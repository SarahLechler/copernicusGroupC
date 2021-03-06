

// ============
// Esri-Leaflet
// ============
var map = L.map('map', {zoomControl: false, zoomAnimation: false,
    minZoom: 7, //maxBounds: [[50, 5.77], [53.00, 9.46]]
    maxBounds: [[48,3.5],[55,11.5]]
}).setView([51.422080, 8.022025], 8),
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map),
        // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
        layerLabels = null,
        worldTransportation = L.esri.basemapLayer('ImageryTransportation'),
        precip_layer = L.tileLayer("http://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=f76f082faa2e7e033b8eced98e9132ae");

var precip_pressed = false;

function getPrecipitation() {
    precip_pressed = !precip_pressed;
    if (layer)
        map.removeLayer(layer);
    if (precip_layer)
        map.removeLayer(precip_layer);
    map.addLayer(layer);
    if (precip_pressed)
        map.addLayer(precip_layer);
    var precip_button = document.getElementById('precip_button');
    if (precip_pressed) {
        precip_button.className = 'precip_pressed';
        precip_button.src = "images/precipitation_white.png";
    } else {
        precip_button.className = 'precip_unpressed';
        precip_button.src = "images/precipitation.png";
    }
    updateLegend();
};

function setBasemap(basemap) {
    if (layer) {
        map.removeLayer(layer);
    }
    if (precip_layer)
        map.removeLayer(precip_layer);
    if (basemap === 'OpenStreetMap') {
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    } else {
        layer = L.esri.basemapLayer(basemap);
    }
    map.addLayer(layer);
    if (layerLabels) {
        map.removeLayer(layerLabels);
    }

    if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
        layerLabels = L.esri.basemapLayer(basemap + 'Labels');
        map.addLayer(layerLabels);
    }

    // add world transportation service to Imagery basemap
    if (basemap === 'Imagery') {
        worldTransportation.addTo(map);
    } else if (map.hasLayer(worldTransportation)) {
        // remove world transportation if Imagery basemap is not selected
        map.removeLayer(worldTransportation);
    }
    if (precip_pressed) {
        map.addLayer(precip_layer);
    }
}

L.control.zoom({
    position: 'topright'
}).addTo(map);


L.control.scale({
	position:'bottomright'
}).addTo(map);

//var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
var searchControl = L.esri.Geocoding.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: true}).addTo(map);


L.easyPrint({
    title: 'Click to print the map',
    position: 'topright',
    elementsToHide: "hideInPrint"
}).addTo(map);


//add imageLayer --> MosaikDataSet/Sattelite data

var processedDataLayer = L.esri.dynamicMapLayer({
    url: 'https://www.copernicushub.eu/arcgis/rest/services/waterdetect/MapServer', 
    attribution: 'Sentinel1 Data after water detection process',
    layers: [3],
    to: Date.now(),
    from: Date.now()
   
});

var satellite_pressed = false;
function getSatelliteImagee() {
    satellite_pressed = !satellite_pressed;
//    if (layer){
//        map.removeLayer(layer);}
    if (processedDataLayer){
        map.removeLayer(processedDataLayer);
//    if (precip_layer)
//        map.removeLayer(precip_layer);
//    map.addLayer(layer);
    if (satellite_pressed)
        map.addLayer(processedDataLayer);
//    if (precip_pressed)
//        map.addLayer(precip_layer);
    var satellite_button = document.getElementById('satellite_button');    
    if (satellite_pressed) {
        satellite_button.className = 'satellite_pressed';
        satellite_button.src = "images/satellite_white.png";
    } else {
        satellite_button.className = 'satellite_unpressed';
        satellite_button.src = "images/satellite.png";
    }
    updateLegend();
}
}
;

var workers = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/WorkerFeature/FeatureServer/0'
});

workers.bindPopup(function (layer) {
    return L.Util.template('<p>Name: {Name}<br>Description: {Descriptoon_Task}</p>', layer.feature.properties);
});

//adding Feature layer for Inaccessible Roads
var inaccessibleRoads = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/inaccessibleRoads01/FeatureServer/0'
});
//adding Feature layer for Workers

inaccessibleRoads.bindPopup(function (layer) {
    return L.Util.template('<p>Name: {Name}<br>Description: {Descriptoon_Task}</p>', layer.feature.properties);
});

var workers_pressed = true;
function getWorkers() {
	workers_pressed = !workers_pressed;
	    if (workers)
        map.removeLayer(workers);
    if (inaccessibleRoads)
        map.removeLayer(inaccessibleRoads);
    if (workers_pressed){
        map.addLayer(workers);
		map.addLayer(inaccessibleRoads);
	}
    var workers_button = document.getElementById('workers_button');
    if (workers_pressed) {
        workers_button.className = 'workers_pressed';
        workers_button.src = "images/worker_layer_white.png";
    } else {
        workers_button.className = 'workers_unpressed';
        workers_button.src = "images/worker.png";
    }
    updateLegend();
}
