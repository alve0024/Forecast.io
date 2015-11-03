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
};

function loadData(widgetclass) {
  var apiKey = "fda235c0e8003cf980cc7ef67ef32c33";
  var apiURL = "https://api.forecast.io/forecast/"+apiKey+"/45.3470,-75.7594?units=ca&exclude=daily,minutly,flags" 
  console.log("Using div with class %s", widgetclass); 
  $.get(apiURL, onSuccess, "jsonp");
}

function onSuccess(forecastData) {
  console.log(forecastData.hourly.data);
  var x = new Date(forecastData.time * 1000);
   
  var htmlForcast = "";

  $weather = $('.weather-forecast');
  
  for(var i=0; i<24; i++) {
    hourlyWeather = forecastData.hourly.data[i];
    hour = new Date(hourlyWeather.time * 1000);
    icon = hourlyWeather.icon;

    console.log(hour.getHours() + ":00");
    
    htmlForcast = hour.getHours() + ":00 "+icon;
    $weather.add("<div>");
    $weather.text(htmlForcast);
    
    if (hour.getHours() === 23) {
      break;
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