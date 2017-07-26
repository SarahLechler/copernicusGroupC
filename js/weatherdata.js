//http://api.openweathermap.org/data/2.5/box/city?bbox=5.77,50.31,9.46,52.62,9&APPID=3e4e9e28f3ee43f6058e966b7f2be8c6

//a5c1af14a4a35b7c0d34a54ff1b30811

//31df404cdb420dc1bb780fffc9a100c7

//http://api.openweathermap.org/data/2.5/forecast?q={muenster}&appid=3e4e9e28f3ee43f6058e966b7f2be8c6

var markers = new L.FeatureGroup();
var weather_pressed = false;
function getWeather() {
    var weather_button = document.getElementById('weather_button');
    if (!weather_pressed) {
        
        var URL = "http://52.59.157.69:8000//weather2017_07_25.json";
        var URL = "http://api.openweathermap.org/data/2.5/box/city?bbox=5.77,50.31,9.46,52.62,9&APPID=3e4e9e28f3ee43f6058e966b7f2be8c6";
        $.ajax({
            url: URL,
            method: "GET",
            dataType: "json",
            async: false,
            crossDomain: true,
            success: function (result) {
                console.log(result);
                addToMap(result);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("Unable to fetch Server data")
            }
        });

        function addToMap(data) {
            var count = Object.keys(data.list).length;

            for (var i in data.list) {
                var lat = data.list[i].coord.Lat;
                var lon = data.list[i].coord.Lon;
                var myIcon = L.icon({
                    iconUrl: 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png'
                });
                var marker = L.marker([lat, lon], {icon: myIcon});
                if ((data.list[i].rain) !== null) {
                    marker.bindPopup("<center><p><b>" + data.list[i].name + "<br> Weather : " + data.list[i].weather[0].description + "</center></b>Rain : " + Object.values(data.list[i].rain) + "<br>Snow : " + data.list[i].snow + "<br> Humidity :" + data.list[i].main.humidity + "<br> Pressure : " + data.list[i].main.pressure + "<br>Temperature : " + data.list[i].main.temp + " Max: " + data.list[i].main.temp_max + " Min: " + data.list[i].main.temp_min + "</p>", {offset: new L.Point(25, 18)});
                } else {
                    marker.bindPopup("<center><p><b>" + data.list[i].name + "<br> Weather : " + data.list[i].weather[0].description + "</center></b>Rain : " + data.list[i].rain + "<br>Snow : " + data.list[i].snow + "<br> Humidity :" + data.list[i].main.humidity + "<br> Pressure : " + data.list[i].main.pressure + "<br>Temperature : " + data.list[i].main.temp + " Max: " + data.list[i].main.temp_max + " Min: " + data.list[i].main.temp_min + "</p>", {offset: new L.Point(25, 18)});
				}
                markers.addLayer(marker);
            }
            map.addLayer(markers);
            weather_button.className = 'weather_pressed';
            weather_button.src = "images/weather_white.png";
        }
        weather_pressed = true;
    } else {
        map.removeLayer(markers);
        weather_button.className = 'weather_unpressed';
        weather_button.src = "images/weather.png";
        weather_pressed = false;
    }
    updateLegend();
}