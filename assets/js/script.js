// Variables
var openWeatherAPIKey = "cde33587929014e610ef72e096cfc4ad";
var iconURLBase = "http://openweathermap.org/img/wn/";
var currentCityEl = document.getElementById("current-city-icon");
currentCityEl.src = iconURLBase + "10d.png";





// Functions 

// Makes a fetch call to the OpenWeather Current weather data API using a city name as its parameter. Parses the coord.lon, coord.lat, and name fields from the response and stores them in localStorage for future use. Then callOneCallDaily is called. If the response fails, an error modal is popped up.

function callCurrentCity(cityName) {
    var currentWeatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + openWeatherAPIKey;

    fetch(currentWeatherQueryURL)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Something went wrong!")
        })
        .then(function(data) {
            console.log(data);
            console.log(data.coord.lon);
            console.log(data.coord.lat);
        })
        .catch((error) => {
            console.error(error);
            var errorModelEl = document.getElementById("error-modal");
            var errorTextEl = document.getElementById("error-text");
            errorTextEl.textContent = "City name: " + cityName + " cannot be found. Please try again."
            errorModelEl.classList.add("is-active");
        });

}

// Makes a fetch call to the OpenWeather OneCall API using lon and lat fields as parameters. Excludes minutely, hourly, and alerts. Units are imperial. Parses the dt, weather.icon, temp.max, wind_speed, humidity, and uvi fields. Stores these values in arrays for each type. Stores the arrays in localStorage for future use.

function callOneCallDaily(lon, lat) {

}


// Code for modals (from bulma css examples)

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });

  // End of bulma modal code


// Main body
callCurrentCity("dumb town murica");



