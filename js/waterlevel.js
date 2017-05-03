
var URL = "http://pegelonline.wsv.de/webservices/rest-api/v2/stations.json?latitude=51.42&longitude=8.01&radius=175";
$.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async:false,
        success: function(result){
			console.log(result);
			addWater(result);
        }, 
        error: function(xhr, textStatus, errorThrown){ 
            alert("Unable to fetch Server data")               	 	
        }
        });
		

function addWater(data){
	
	for (i in data){
		var station_name = data[i].shortname;
		var lat = data[i].latitude;
		var lon = data[i].longitude;
		if(lat!=null && lon!=null){
			$.ajax({
				url: "http://pegelonline.wsv.de/webservices/rest-api/v2/stations/"+station_name+".json?includeTimeseries=true&includeCurrentMeasurement=true",
				method: "GET",
				dataType: "json",
				async:false,
				success: function(result){
					console.log(result.timeseries[0].currentMeasurement,result.timeseries[0].currentMeasurement.stateMnwMhw);
					if((result.timeseries[0].currentMeasurement.stateMnwMhw =='normal' || result.timeseries[0].currentMeasurement.stateMnwMhw =='low') && result.timeseries[0].currentMeasurement.trend == '1'){
						 var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/water_positive.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if((result.timeseries[0].currentMeasurement.stateMnwMhw == 'normal' || result.timeseries[0].currentMeasurement.stateMnwMhw == 'low')&&(result.timeseries[0].currentMeasurement.trend == '-1' || result.timeseries[0].currentMeasurement.trend == '0')){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/water_negative.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result.timeseries[0].currentMeasurement.stateMnwMhw == 'high'&& result.timeseries[0].currentMeasurement.trend == '1'){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/high_positive.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result.timeseries[0].currentMeasurement.stateMnwMhw=='high'&& (result.timeseries[0].currentMeasurement.trend=='-1'||result.timeseries[0].currentMeasurement.trend=='0')){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/high_negative.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result.timeseries[0].currentMeasurement.stateMnwMhw=='high'&& result.timeseries[0].currentMeasurement.trend=='-999'){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/high.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if((result.timeseries[0].currentMeasurement.stateMnwMhw=='low'||result.timeseries[0].currentMeasurement.stateMnwMhw=='normal') && result.timeseries[0].currentMeasurement.trend=='-999'){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/water.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result.timeseries[0].currentMeasurement.trend=='-1'||result.timeseries[0].currentMeasurement.trend=='0'){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/neutral_negative.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else {
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/neutral_positive.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
				var marker = new L.Marker.Label([lat, lon],{ icon: new waterIcon({ labelText: "<b>" + result.timeseries[0].currentMeasurement.value + "</b>"})}).addTo(map);	
				marker.bindPopup("<b>"+station_name+"</b><br> Water : " + result.water.shortname);
				
					
        }, 
        error: function(xhr, textStatus, errorThrown){ 
            alert("Unable to fetch Server data")               	 	
        }
        });
		
	}
}
	
	
}