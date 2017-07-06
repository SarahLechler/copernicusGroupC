/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// ============
// Esri-Leaflet 
// ============

var map = L.map('map', {zoomControl: false, zoomAnimation: false, 
    //minZoom: 7, maxBounds:[[50.31, 5.77], [52.62, 9.46]]
            }).setView([51.422080, 8.022025], 8),
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
        // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
        layerLabels = null,
        worldTransportation = L.esri.basemapLayer('ImageryTransportation'),
        precip_layer = L.tileLayer("http://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=f76f082faa2e7e033b8eced98e9132ae"),
        layers = L.control.layers(layer, precip_layer).addTo(map);
        

function setBasemap(basemap) {
    if (layer) {
        map.removeLayer(layer);
    }
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
        map.addLayer(precip_layer);
    }

    // add world transportation service to Imagery basemap
    if (basemap === 'Imagery') {
        worldTransportation.addTo(map);
    } else if (map.hasLayer(worldTransportation)) {
        // remove world transportation if Imagery basemap is not selected    
        map.removeLayer(worldTransportation);
    }
}

L.control.zoom({
    position: 'topright'
}).addTo(map);

//var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
var searchControl = L.esri.Geocoding.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: true}).addTo(map);

searchControl.on('results', function (data) {
    if (data.results.length > 0) {
        var popup = L.popup()
                .setLatLng(data.results[0].latlng)
                .setContent(data.results[0].text)
                .openOn(map);
        map.setView(data.results[0].latlng)
    }
})

L.easyPrint({
    title: 'Click to print the map',
    position: 'topright'
}).addTo(map);


//adding StreamLayer    
//	var buses = L.esri.streamFeatureLayer({
//		url: 'https://geoeventsample3.esri.com:6443/arcgis/rest/services/LABus/StreamServer'
//	}).addTo(map);
console.log("added streamlayer");


