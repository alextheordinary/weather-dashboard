// Variables
var openWeatherAPIKey = "cde33587929014e610ef72e096cfc4ad";
var iconURLBase = "http://openweathermap.org/img/wn/";
var currentCityName;
var currentCityLon;
var currentCityLat;


// Variables for Current Weather
var curWeatherObj;
var forecastObj = {
    dt: [],
    icon: [],
    temp: [],
    wind: [],
    humidity: []
};

// Arrays for 5-day forecast 




// Functions 

// Makes a fetch call to the OpenWeather Current weather data API using a city name as its parameter. Parses the coord.lon, coord.lat, and name fields from the response and stores them in localStorage for future use. Then callOneCallDaily is called. If the response fails, an error modal is popped up.

function callCurrentCity(cityName) {
    var currentWeatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + openWeatherAPIKey;

    fetch(currentWeatherQueryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Something went wrong!")
        })
        .then(function (data) {
            console.log(data);
            currentCityName = data.name;
            localStorage.setItem("city-name", JSON.stringify(currentCityName));
            currentCityLon = data.coord.lon;
            localStorage.setItem("city-lon", JSON.stringify(currentCityLon));
            currentCityLat = data.coord.lat;
            localStorage.setItem("city-lat", JSON.stringify(currentCityLat));
            callOneCallDaily(currentCityLon, currentCityLat);
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
    var oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + openWeatherAPIKey;

    fetch(oneCallQueryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Something went wrong!")
        })
        .then(function (data) {
            console.log(data);
            // Parse the resonse for the current weather
            curWeatherObj = {
                dt: data.current.dt,
                icon: data.current.weather[0].icon,
                temp: data.current.temp,
                wind: data.current.wind_speed,
                humidity: data.current.humidity,
                uvi: data.current.uvi
            };
            console.log(moment(curWeatherObj.dt, "X").format("M/D/YYYY"));

            // Parse the response for the 5 day forecast
            for (i = 1; i < 6; i++) {
                forecastObj.dt[i-1] = data.daily[i].dt;
                forecastObj.icon[i-1] = data.daily[i].weather[0].icon;
                forecastObj.temp[i-1] = data.daily[i].temp.max;
                forecastObj.wind[i-1] = data.daily[i].wind_speed;
                forecastObj.humidity[i-1] = data.daily[i].humidity;
            }
            // Write to local storage
            localStorage.setItem("cur-obj", JSON.stringify(curWeatherObj));
            localStorage.setItem("for-obj", JSON.stringify(forecastObj));

            // Fill in current weather box
            fillCurrentWeather();
            fillFiveDay();
        })
        .catch((error) => {
            console.error(error);
        });
}

// Fill Current Weather Box. 

function fillCurrentWeather() {
    var currentCityEl = document.getElementById("current-city");
    currentCityEl.textContent = currentCityName + " (" + moment(curWeatherObj.dt, "X").format("M/D/YYYY") + ")";
    var currentCityIconEl = document.createElement('img');
    currentCityIconEl.src = iconURLBase + curWeatherObj.icon + ".png";
    currentCityEl.appendChild(currentCityIconEl);
    document.getElementById("c-temp").textContent = "Temp: " + curWeatherObj.temp + " ℉" ;
    document.getElementById("c-wind").textContent = "Wind: " + curWeatherObj.wind + " MPH" ;
    document.getElementById("c-humidity").textContent = "Humidity: " + curWeatherObj.humidity + " %" ;
    var uviEl = document.getElementById("c-uvi");
    var uviSpanEl = document.createElement('span');
    uviSpanEl.textContent = curWeatherObj.uvi;
    uviEl.textContent = "UV Index: ";
    uviEl.appendChild(uviSpanEl);

    if (curWeatherObj.uvi < 3) {
        uviSpanEl.classList.add("favorable");
    } else if (curWeatherObj.uvi < 6) {
        uviSpanEl.classList.add("moderate");
    } else {
        uviSpanEl.classList.add("severe");
    }
}

// Fill 5-day forecast. Use a for loop to traverse to child elements in the dom and add in data from forecastObj

function fillFiveDay() {

    for (i = 1; i < 6; i++) {
        var fDayEl = document.getElementById("day-" + i);
        fDayEl.children[0].textContent = moment(forecastObj.dt[i-1], "X").format("M/D/YYYY");
        fDayEl.children[1].src = iconURLBase + forecastObj.icon[i-1] + ".png";
        fDayEl.children[2].textContent = "Temp: " + forecastObj.temp[i-1] + " ℉" ;
        fDayEl.children[3].textContent = "Wind: " + forecastObj.wind[i-1] + " MPH" ;
        fDayEl.children[4].textContent = "Humidity: " + forecastObj.wind[i-1] + " %" ;
    }

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
callCurrentCity("hartford");





