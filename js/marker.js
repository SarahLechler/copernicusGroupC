var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    
    var MyCustomMarker = L.Icon.extend({
        options: {
            shadowUrl: null,
            iconAnchor: new L.Point(12, 12),
            iconSize: new L.Point(24, 24),
            iconUrl: 'images/worker.png'
        }
    });
    
    var options = {
        position: 'topright',
        draw: {
            
            circle: false, // Turns off this drawing tool
            rectangle: false,
			polygon: false,
			polyline: false,
            marker: {
                icon: new MyCustomMarker()
            }
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    };
    
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    
    map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
            layer = e.layer;
    
        if (type === 'marker') {
            layer.bindPopup('<form><p>Enter the number of workers: </p><input type="text" ></form>');

        }
    
        editableLayers.addLayer(layer);
    });
	
	