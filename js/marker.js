
//icon for the marker to be placed
var marker_icon = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: 'images/marker.png'
    }
});

//disable all the options of drawing except the marker
var options = {
    position: 'topright',
    draw: {

        circle: false, // Turns off this drawing tool
        rectangle: false,
        polygon: false,
        polyline: false,
        marker: {
            icon: new marker_icon()
        }
    },
};

//add draw control on the map
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);


//Inaccessible Roads

// add ESRI feature layer 
var inaccessibleRoads = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/inaccessibleRoads01/FeatureServer/0',
    editable: true,
}).addTo(map);

//to bind the popup with the marker-inaccessible road
inaccessibleRoads.bindPopup(function (layer) {
    return L.Util.template('<p><b>Created_By : </b>{Name}<br> <b>Description : </b> {Descriptoon_Task}<br><button onclick = "edit_roads()">edit</button><button onclick = "delete_roads()">delete</button></p>', layer.feature.properties);
});

var lat;
var lon;

//to open the modal which asks if the user wants to place workers or mark inaccessible roads
map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
            layer = e.layer;

    document.getElementById('road_worker').innerHTML = '';
    $('<p>Do you want to enter details about workers or inaccessible roads?</p><button id = "btn_1" class="btn" onclick = "form_worker()"> Workers </button><button id = "btn_2" class="btn" onclick = "form_road()"> Inaccessible Roads </button>').appendTo('#road_worker');

	// Get the modal
    var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    lat = layer._latlng.lat;
    lon = layer._latlng.lng;
    console.log(layer);
});


//to add the feature road on clicking submit on the form 
function addFeature_road() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    console.log(lon);
    console.log(lat);
    var feature = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        },
        properties: {
            Name: document.getElementById("author").value,
            Descriptoon_Task: document.getElementById("road_desc").value
        }
    };
    inaccessibleRoads.addFeature(feature, function (error, response) {
        if (error) {
            console.log('error adding feature' + error.message);
        } else {
            console.log('Successfully added feature ' + feature.id);
        }
    });

    inaccessibleRoads.bindPopup(function (layer) {
        return L.Util.template('<p><b>Created_By : </b>{Name}<br> <b>Description : </b> {Descriptoon_Task}<br><button onclick = "edit_roads()">edit</button><button onclick = "delete_roads()">delete</button></p></p>', layer.feature.properties);
    });
}

var name;
var description;
var id;

inaccessibleRoads.bringToFront();
inaccessibleRoads.on('click', function (event) {
    lon = event.latlng.lng;
    lat = event.latlng.lat;
    name = event.layer.feature.properties.Name;
    description = event.layer.feature.properties.Descriptoon_Task;
    id = event.layer.feature.id;
});

//display of new form when clicked to edit the road
function edit_roads() {
    var modal = document.getElementById('myModal');
    var modal_content = document.getElementById('road_worker');
    modal_content.innerHTML = '';
    modal.style.display = "block";
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $("<div id = 'form'><form>Entered_By:<br><input id = 'author' type='text' ><br>Description:<br><input id = 'road_desc' type='text'></form><br><button class = 'btn' id = 'submit' onclick = 'updateFeature_road()'>submit</button></div>").appendTo('#road_worker');
    $('#author').val(name);
    $('#road_desc').val(description);

}

//function that runs when clicked submit for editing
function updateFeature_road() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    var feature = {
        type: 'Feature',
        id: id,
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        },
        properties: {
            Name: document.getElementById("author").value,
            Descriptoon_Task: document.getElementById("road_desc").value
        }
    };

    inaccessibleRoads.updateFeature(feature, function (error, response) {
        if (error) {
            console.log('error updating feature' + error.message);
        } else {
            console.log('Successfully updated feature ' + feature.id);
        }
    });
    map.closePopup();
}

// functions to delete the road feature from the layer.
function delete_roads() {
    inaccessibleRoads.deleteFeature(id, function (error, response) {
        if (error) {
            console.log('error deleting feature' + error.message);
        } else {
            console.log('Successfully deleted feature ' + response.objectId);
        }
    });
    map.closePopup();
}


// Workers


//add feature layer for workers
var workers = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/W47q82gM5Y2xNen1/arcgis/rest/services/WorkerFeature/FeatureServer/0',
    editable: true,
}).addTo(map);

//to display the entered information as popup
workers.bindPopup(function (layer) {
    return L.Util.template('<p><b>Created_By : </b>{Name}<br><b> Number of Workers : </b>{Number}<br><b>Description : </b> {Descriptoon_Task}<br><button onclick = "edit_workers()">edit</button><button onclick = "delete_workers()">delete</button></p>', layer.feature.properties);
});

//to add a marker for the worker 
function addFeature_worker() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    console.log(lon);
    console.log(lat);
    var feature = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        },
        properties: {
            Name: document.getElementById("author").value,
            Number: document.getElementById("number").value,
            Descriptoon_Task: document.getElementById("worker_desc").value
        }
    };
    workers.addFeature(feature, function (error, response) {
        if (error) {
            console.log('error adding feature' + error.message);
        } else {
            console.log('Successfully added feature ' + feature.id);
        }
    });

    workers.bindPopup(function (layer) {
        return L.Util.template('<p><b>Created_By : </b>{Name}<br><b> Number of Workers : </b>{Number}<br><b>Description : </b> {Descriptoon_Task}<br><button onclick = "edit_workers()">edit</button><button onclick = "delete_workers()">delete</button></p>', layer.feature.properties);
    });
}

var number;
var worker_id;

workers.bringToFront();
workers.on('click', function (event) {
    lon = event.latlng.lng;
    lat = event.latlng.lat;
    name = event.layer.feature.properties.Name;
    description = event.layer.feature.properties.Descriptoon_Task;
    number = event.layer.feature.properties.Number;
    worker_id = event.layer.feature.id;
});


// display new form when the user clicks edit feature
function edit_workers() {
    var modal = document.getElementById('myModal');
    var modal_content = document.getElementById('road_worker');
    modal_content.innerHTML = '';
    modal.style.display = "block";
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $("<div id = 'form'><form>Entered_By:<br><input id = 'author' type='text' ><br>Number of Workers:<br><input id = 'number' type='text' ><br>Description:<br><input id = 'worker_desc' type='text'></form><br><button class = 'btn' id = 'submit' onclick = 'updateFeature_worker()'>submit</button></div>").appendTo('#road_worker');
    $('#author').val(name);
    $('#worker_desc').val(description);
    $('#number').val(number);


}

//update the information when the user has edited the feature 
function updateFeature_worker() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    var feature = {
        type: 'Feature',
        id: worker_id,
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        },
        properties: {
            Name: document.getElementById("author").value,
            Number: document.getElementById("number").value,
            Descriptoon_Task: document.getElementById("worker_desc").value
        }
    };

    workers.updateFeature(feature, function (error, response) {
        if (error) {
            console.log('error updating feature' + error.message);
        } else {
            console.log('Successfully updated feature ' + feature.id);
        }
    });
    map.closePopup();
}
 //to delete the feature worker
function delete_workers() {
    workers.deleteFeature(worker_id, function (error, response) {
        if (error) {
            console.log('error deleting feature' + error.message);
        } else {
            console.log('Successfully deleted feature ' + response.objectId);
        }
    });
    map.closePopup();
}
