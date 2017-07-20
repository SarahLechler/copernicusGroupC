/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// ============
// Esri-Leaflet
// ============

var map = L.map('map', {zoomControl: false, zoomAnimation: false,
    minZoom: 7, maxBounds: [[50, 5.77], [53.00, 9.46]]
}).setView([51.422080, 8.022025], 8),
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map),
        // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
        layerLabels = null,
        worldTransportation = L.esri.basemapLayer('ImageryTransportation'),
        precip_layer = L.tileLayer("http://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=f76f082faa2e7e033b8eced98e9132ae");

var show_precip = false;

function getPrecipitation() {
    show_precip = !show_precip;
    console.log("precipitation activate!");
    if (layer)
        map.removeLayer(layer);
    if (precip_layer)
        map.removeLayer(precip_layer);
    map.addLayer(layer);
    if (show_precip)
        map.addLayer(precip_layer);
    var precip_button = document.getElementById('precipitation_icon');
    if (show_precip) {
        precip_button.className = 'precip_pressed';
    } else {
        precip_button.className = 'precip_unpressed';
    }
}
;

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
    if (show_precip) {
        map.addLayer(precip_layer);
    }
}

L.control.zoom({
    position: 'topright'
}).addTo(map);

//var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
var searchControl = L.esri.Geocoding.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: true}).addTo(map);
//
//searchControl.on('results', function (data) {
//    //var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
//    var searchControl = L.esri.Geocoding.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: true}).addTo(map);
//
//});

L.easyPrint({
    title: 'Click to print the map',
    position: 'topright'
}).addTo(map);

//add imageLayer --> MosaikDataSet/Sattelite data
var x = 2;
var URL = "https://www.copernicushub.eu/arcgis/rest/services/Processed_Data/ImageServer/"; //+ x;

console.log(URL);
var processedDataLayer = this.processedDataLayer = L.esri.imageMapLayer({
    url: URL, //'http://www.copernicushub.eu/arcgis/services/TestMosaicDataset_TimeEnabled/ImageServer/WMSServer?Request=GETCapabilities',
    attribution: 'Sentinel1 Data after water detection process',
    noData: 'LowPS',
    noDataInterpretation: null
});

var processedDataLayerTest = L.tileLayer.wms("http://www.copernicushub.eu/arcgis/services/TestMosaicDataset_TimeEnabled/ImageServer/WMSServer?", {
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});

var satellite = false;
function getSatelliteImagee() {
    satellite = !satellite;
    console.log("satellite activate!");
    if (layer)
        map.removeLayer(layer);
    if (processedDataLayer)
        map.removeLayer(processedDataLayer);
    map.addLayer(layer);
    if (satellite)
        map.addLayer(processedDataLayer);

    if (satellite) {
        satellite_button.className = 'satellite_pressed';
    } else {
        satellite_button.className = 'satellite_unpressed';
    }
}
;

var workers = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/WorkerFeature/FeatureServer/0'
}).addTo(map);

workers.bindPopup(function (layer) {
    return L.Util.template('<p>Name: {Name}<br>Description: {Descriptoon_Task}</p>', layer.feature.properties);
});

//adding Feature layer for Inaccessible Roads
var inaccessibleRoads = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/inaccessibleRoads01/FeatureServer/0'
}).addTo(map);

inaccessibleRoads.bindPopup(function (layer) {
    return L.Util.template('<p>Name: {Name}<br>Description: {Descriptoon_Task}</p>', layer.feature.properties);
});

