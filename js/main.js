//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;

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
}

function loadCount(){
  scriptsLoaded++;
    if(scriptsLoaded === 2){
      //call the function in My widget script to load the JSON and build the widget
      loadData(".weather-forecast");
      console.log("both scripts loaded");
    }
}

function loadData(widgetclass) {
  var apiKey = "fda235c0e8003cf980cc7ef67ef32c33";
  var apiURL = "https://api.forecast.io/forecast/"+apiKey+"/45.3470,-75.7594?units=ca&exclude=daily,minutly,flags";
  $.get(apiURL, onSuccess, "jsonp");
}

function onSuccess(forecastData) {
  displayWeatherToday(forecastData);
  buildTable(forecastData);
} 

function displayWeatherToday(forecastData){
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var temperature = Math.floor(forecastData.hourly.data[0].temperature);
  var weatherIcon = getWeatherIcon(forecastData.hourly.data[0].icon);
  var summary = forecastData.hourly.data[0].summary;
  $('.weather-forecast').append('<div id="weatherToday">');
  $('#weatherToday').append('<p>'+"Current condition for today, "+day+"/"+month+'</p>');
  $('#weatherToday').append('<i class="wi '+weatherIcon+' current"></i>');
  $('#weatherToday').append('<div class="temp"><h1>    '+temperature+'°C </h1></div>');
  $('#weatherToday').append('<strong>'+summary+'</strong>');
}

function getWeatherIcon(icon) {
  var weatherIcon = {
    "clear-day"          : "wi-forecast-io-clear-day",
    "clear-night"        : "wi-forecast-io-clear-night",
    "rain"               : "wi-forecast-io-rain",
    "snow"               : "wi-forecast-io-snow",
    "sleet"              : "wi-forecast-io-sleet",
    "wind"               : "wi-forecast-io-wind",
    "fog"                : "wi-forecast-io-fog",
    "cloudy"             : "wi-forecast-io-cloudy",
    "partly-cloudy-day"  : "wi-forecast-io-partly-cloudy-day",
    "partly-cloudy-night": "wi-forecast-io-partly-cloudy-night",
    "hail"               : "wi-forecast-io-hail",
    "thunderstorm"       : "wi-forecast-io-thunderstorm",
    "tornato"            : "wi-forecast-io-tornado"
  };
  return weatherIcon[icon];
}

function buildTable(forecastData) {  
  var weatherData = [];
  // Fill the forecast data into the matrix
  for(var i=0; i<24; i++) {
    hourlyWeather = forecastData.hourly.data[i];
    hour = new Date(hourlyWeather.time * 1000);
    weatherData.push([hour.getHours() + ":00",
                      Math.floor(hourlyWeather.humidity*100)+"%", 
                      hourlyWeather.cloudcover,
                      hourlyWeather.temperature+"°C",
                      hourlyWeather.windSpeed+" Km/h",
                      hourlyWeather.icon,
                      hourlyWeather.summary
    ]); 
    if (hour.getHours() === 23) {
      break;
    }
  } 
 
  $("#weatherToday").append('<div id="weatherTable">');
  var widget = $("#weatherTable");
  widget.html("");
  var wTable = $("<table>", {"id": "wTable"}).appendTo(widget);
  var rowLength = weatherData.length;
  var colLength = weatherData[0].length;
  var weatherIcon = '';
  // Print the forecast data
  for (i = 0; i < rowLength; i++) {
    trow = $("<tr>", {"class": "trClass"}).appendTo(wTable);
    for (var j = 0; j < colLength; j++) {
        if (j==colLength-2) {
          weatherIcon = getWeatherIcon(weatherData[i][j]);
          $("<td>", {"class": "tdClass"}).appendTo(trow).html('<i class="wi '+weatherIcon+'"></i>');
        } else {
          $("<td>", {"class": "tdClass"}).appendTo(trow).html(weatherData[i][j]);
        }
        
    }
  }
}