/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// ============
// Esri-Leaflet 
// ============

var map = L.map('map', {zoomControl: false, zoomAnimation: false,
    minZoom: 7, maxBounds:[[50, 5.77], [53.00, 9.46]]
}).setView([51.422080, 8.022025], 8),
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map),
        // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
        layerLabels = null,
        worldTransportation = L.esri.basemapLayer('ImageryTransportation'),
        precip_layer = L.tileLayer("http://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=f76f082faa2e7e033b8eced98e9132ae"
);


//if (map.hasLayer(precip_layer)) {
//    map.remove(precip_layer);
//    map.addLayer(precip_layer);
//} else {
//    map.addLayer(precip_layer);
//}

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
    if (show_precip){
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

//adding Feature layer for Workers

//adding Feature layer for Workers

 //add imageLayer --> MosaikDataSet/Sattelite data
//L.esri.imageMapLayer({
//    url: 'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer',
//    attribution: 'United States Geological Survey (USGS), National Aeronautics and Space Administration (NASA)'
//}).addTo(map);


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