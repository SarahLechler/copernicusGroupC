//https://www.pegelonline.wsv.de/webservices/gis/aktuell/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=gk:waterlevels&outputFormat=json&BBOX=50.31,5.77,52.62,9.46


var URL = "http://pegelonline.wsv.de/webservices/rest-api/v2/stations.json?latitude=51.42&longitude=8.01&radius=175&includeTimeseries=true&includeCurrentMeasurement=true";
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
		

function addWater(result){
	
	for (i in result){
		var station_name = result[i].shortname;
		var lat = result[i].latitude;
		var lon = result[i].longitude;
		if(lat!=null && lon!=null){
					if((result[i].timeseries[0].currentMeasurement.stateMnwMhw =='normal' || result[i].timeseries[0].currentMeasurement.stateMnwMhw =='low') && result[i].timeseries[0].currentMeasurement.trend == '1'){
						 var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/low_positive.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if((result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'normal' || result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'low')&&(result[i].timeseries[0].currentMeasurement.trend == '-1' || result[i].timeseries[0].currentMeasurement.trend == '0')){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/low_negative.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result[i].timeseries[0].currentMeasurement.stateMnwMhw == 'high'&& result[i].timeseries[0].currentMeasurement.trend == '1'){
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
					else if(result[i].timeseries[0].currentMeasurement.stateMnwMhw=='high'&& (result[i].timeseries[0].currentMeasurement.trend=='-1'||result[i].timeseries[0].currentMeasurement.trend=='0')){
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
					else if(result[i].timeseries[0].currentMeasurement.stateMnwMhw=='high'&& result[i].timeseries[0].currentMeasurement.trend=='-999'){
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
					else if((result[i].timeseries[0].currentMeasurement.stateMnwMhw=='low'||result[i].timeseries[0].currentMeasurement.stateMnwMhw=='normal') && result[i].timeseries[0].currentMeasurement.trend=='-999'){
						var waterIcon = L.Icon.Label.extend({
							options: {
							iconUrl: 'images/low.png',
							shadowUrl: null,
							iconSize: new L.Point(24, 24),
							iconAnchor: new L.Point(0, 1),
							labelAnchor: new L.Point(26,0 ),
							wrapperAnchor: new L.Point(12, 13),
							}
						});
					}
					else if(result[i].timeseries[0].currentMeasurement.trend=='-1'||result[i].timeseries[0].currentMeasurement.trend=='0'){
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
				var marker = new L.Marker.Label([lat, lon],{ className: station_name, icon: new waterIcon({ labelText: "<b>" + result[i].timeseries[0].currentMeasurement.value + "</b>"})}).addTo(map);
				marker.bindPopup("<b>"+station_name+"</b><br> Water : " + result[i].water.shortname + "<br><div id='chartContainer' style='height: 200px; width: 300px;'></div>");
				
					
        }
		
	}
}
	
	var date = [];
	var unique_date = [];
	window.onload = function(){
		var URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/BONN/W/measurements.json?start=P30D";
		$.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async:false,
        success: function(result){
			for (i in result){
				date.push((result[i].timestamp).split('T',11));
			}
			var hash = {};
			for(var i=0; i<date.length; i++) {
				var key = date[i][0];
					if (!hash[key]) {
						unique_date.push(date[i][0]);
						hash[key] = 'found';
					}
}
			
			console.log(unique_date);
			date_for_slider(unique_date);
        }, 
        error: function(xhr, textStatus, errorThrown){ 
                         	 	
        }
        });
		
		
	}

	
	function date_for_slider(unique_date){
	for (var i in unique_date){
	$('<span style=" display:inline-block;width: 0.90%;text-align:right;margin-right: 2.4%; font-size:8px">I<br>'+ unique_date[i] + '</span>').appendTo('#steps');
	}
	
}
	
map.on('popupopen',function(e){
	getChart(e.target._popup._source.options.className);
});


function getChart(station_name){
	var datapoints = []; 
	var URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/"+station_name+"/W/measurements.json?start=P30D";
$.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async:false,
        success: function(result){
			var date_slider = selectedTime();
			for (i in result){
				if (date_slider == (result[i].timestamp).substr(0,10)){
					datapoints.push({label: result[i].timestamp.substr(0,10), y: result[i].value,toolTipContent: result[i].timestamp + " : " + result[i].value});	
					}
					
			}
			var chart = new CanvasJS.Chart("chartContainer",
    {
      zoomEnabled: true,
	  panEnabled: true,
      title:{
        text: "Water level as on " + date_slider
      },
      axisY:{
        includeZero: false
      },
     data: [{
		 type: "line",
        dataPoints : datapoints
        }]  

   });

    chart.render();
        }, 
        error: function(xhr, textStatus, errorThrown){       	 	
        }
        });
		
}
