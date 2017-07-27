
function multiple_chart(station_name,count_gauging_station){
	var datapoints = [];
    console.log("trying to obtain chart data for station:" + station_name)
    var URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/" + station_name + "/W/measurements.json?start=P30D";
    $.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            console.log(result);
            var date_slider = selectedTime();
            for (var i in result) {
                if (date_slider == (result[i].timestamp).substr(0, 10)) {
                    datapoints.push({label: result[i].timestamp.substring(11, 16), y: result[i].value, toolTipContent: result[i].timestamp + " : " + result[i].value});
                }

            }
            var chart = new CanvasJS.Chart("chart_" + count_gauging_station,
                    {
                        zoomEnabled: true,
                        panEnabled: true,
                        title: {
                            text: station_name + ":" + date_slider
                        },
                        axisY: {
                            includeZero: false
                        },
                        data: [{
                                type: "line",
                                dataPoints: datapoints
                            }]

                    });

            chart.render();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error obtaining chart data");
        }
    });
	chartExists = true;
}

	