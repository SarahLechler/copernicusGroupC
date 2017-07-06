/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// ============
    // Esri-Leaflet
    // ============

    var map = L.map('map',{zoomControl : false,zoomAnimation : false, minZoom : 7,maxBounds : [[50.31,5.77],[52.62,9.46]]}).setView([51.422080, 8.022025],8),
      layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map),
      // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
      layerLabels = null,
      worldTransportation = L.esri.basemapLayer('ImageryTransportation');


    function setBasemap(basemap) {
      if (layer) {
        map.removeLayer(layer);
      }
      if (basemap === 'OpenStreetMap') {
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      }
      else {
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
    }

    L.control.zoom({
      position:'topright'
    }).addTo(map);

    //var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
    var searchControl = L.esri.Geocoding.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: true}).addTo(map);

    searchControl.on('results', function(data){
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

        
// add image Layer
    L.esri.imageMapLayer({
      url: 'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer',
      attribution: 'United States Geological Survey (USGS), National Aeronautics and Space Administration (NASA)'
    }).addTo(map);
 

    //adding Feature layer for Workers

    var workers = L.esri.featureLayer({
      url:'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/WorkerFeature/FeatureServer/0'
    }).addTo(map);

    //adding Feature layer for Inaccessible Roads
    var inaccessibleRoads = L.esri.featureLayer({
      url:'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/inaccessibleRoads01/FeatureServer/0'
    }).addTo(map);

    /*map.on(L.Draw.Event,CREATED; function (e)){
      var feature = {
        type : 'Feature',
        geometry : {
          type : 'Point',
          coordinates : [7.574620, 51.982685],
        },
        properties : {
          created by : 'alicja',
          description : 'asjdojas'
        }
      };

      inaccessibleRoads.addFeature(feature);
    }*/
    
