//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;
var weatherData = [];

document.addEventListener("DOMContentLoaded", init);

function init(){
  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/weather-icons.css");	
  //loads the CSS file and applies it to the page
  css.addEventListener("load", loadCount);
  document.querySelector("head").appendChild(css);

  var jq = document.createElement("script");
  jq.addEventListener("load", loadCount);
  jq.setAttribute("src","http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
  document.querySelector("head").appendChild(jq);
};

function loadData(widgetclass) {
  var apiKey = "fda235c0e8003cf980cc7ef67ef32c33";
  var apiURL = "https://api.forecast.io/forecast/"+apiKey+"/45.3470,-75.7594?units=ca&exclude=daily,minutly,flags" 
  console.log("Using div with class %s", widgetclass); 
  $.get(apiURL, onSuccess, "jsonp");
}

function onSuccess(forecastData) {
  console.log(forecastData.hourly.data);
  buildTable(forecastData);
} 

function buildTable(forecastData) {
  // Create the header of the table
  weatherData.push([" Hour ", 
                    " Humidity ", 
                    " Chance of Rain ", 
                    " Temperature ", 
                    " Feels like ", 
                    " Wind speed ", 
                    " Weather "
  ]);
  
  // Fill the forecast data into the table
  for(var i=0; i<24; i++) {
    hourlyWeather = forecastData.hourly.data[i];
    hour = new Date(hourlyWeather.time * 1000);
    weatherHour = hour.getHours() + ":00";

    console.log(weatherHour);

    weatherData.push([weatherHour,
                      hourlyWeather.humidity, 
                      hourlyWeather.precipProbability,
                      hourlyWeather.temperature,
                      hourlyWeather.apparentTemperature,
                      hourlyWeather.windSpeed,
                      hourlyWeather.summary
    ]); 
    if (hour.getHours() === 23) {
      break;
    }
  }

  console.log(weatherData); 

  var widget = $(".weather-forecast");
  widget.html("");
  var wTable = $("<table>", {"id": "newTable"}).appendTo(widget);
  var rowLength = weatherData.length;
  var colLength = weatherData[0].length;
  console.log(colLength);

  // Print the header for the table
  var trow = $("<tr>", {"class": "trClass"}).appendTo(wTable);

  for (var j=0; j<colLength; j++) {
      $("<th>", {
        "class": "thClass"
      }).appendTo(trow).html(weatherData[0][j]);
  }
   
  // Print the forecast data
  for (var i = 1; i < rowLength; i < i++) {
    trow = $("<tr>", {"class": "trClass"}).appendTo(wTable);
    for (j = 0; j < colLength; j++) {
        $("<td>", {"class": "tdClass"}).appendTo(trow).html(weatherData[i][j]);
    }
  }
}

function buildWidget(widgetclass){
  loadData(widgetclass);
}

function loadCount(){
  scriptsLoaded++;
    if(scriptsLoaded === 2){
      //call the function in My widget script to load the JSON and build the widget
      buildWidget(".weather-forecast");
      console.log("both scripts loaded");
    }
}