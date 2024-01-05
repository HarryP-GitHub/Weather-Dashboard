var apiKey = '80a194365e55173540631dd2d7339ed6'; 
var searchEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('#search-history');
var currentWeatherEl = document.querySelector('#current-weather');
var forecastEl = document.querySelector('#forecast');

// function to get city coordinates when city is searched
// Using Geocoding API
function cityCoordinates(city) {
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    fetch(geoUrl)
        .then(function(response) {
            console.log(geoUrl);
            return response.json();
        })
        .then(function(cityLocation) {
            if (cityLocation.length > 0) {
                var lat = cityLocation[0].lat;
                var lon = cityLocation[0].lon;
                getWeather(city, lat, lon);
            } else {
                alert('City not found. Try a different name.');
            }
        });
}

//Getting weather data for 5 day forecast
//Use 5 day weather forecast API

function getWeather(city, lat, lon) {
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + apiKey;

    fetch(forecastUrl)
        .then(function(response) {
            console.log(forecastUrl);
            return response.json();
        })
        .then(function(forecastData) {
            currentWeather(city, forecastData.list[0]);
            forecastWeather(city, forecastData.list);
            updateSearchHistory(city);
        });
}

// When the search form is submitted, use the input to run function
function searchSubmit(event) {
    event.preventDefault();
    var searchInput = document.querySelector('#city-input').value;
    if (searchInput) {
        cityCoordinates(searchInput);
    } else {
        alert('Please enter a city name');
    }
}

// API formats weather backward as seen in console.log
// And has time in it
function formatDate(weatherDateTime) {
  console.log(weatherDateTime);
  var weatherDate = weatherDateTime.split(' ');
  var splitDate = weatherDate[0].split('-');
  return splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
}

// displaying current weather in Current weather div
function currentWeather(city, currentWeatherData) {
    var date = formatDate(currentWeatherData.dt_txt);
    currentWeatherEl.innerHTML = '<h3>' + city + ' (' + date + ')</h3>' +
      '<img src="http://openweathermap.org/img/wn/' + currentWeatherData.weather[0].icon + '.png" alt="Weather Image">' +
      '<p>Temperature: ' + currentWeatherData.main.temp + ' °C</p>' +
      '<p>Humidity: ' + currentWeatherData.main.humidity + '%</p>' +
      '<p>Wind Speed: ' + (currentWeatherData.wind.speed * 3.6).toFixed(2) + ' km/h</p>';
/* windspeed metric units is m/s by default */
/* Not using Math.floor because it doesn't work well with the decimals */
/* Using toFixed as gives the number of digits after decimal point */
}

// displaying forecast
function forecastWeather(city, forecastData) {
    forecastEl.innerHTML = '';
    for (var i = 0; i < forecastData.length; i += 8) {
        /*Need to do i += 8 because there are 8 x 3 hour weather updates per day */
        var day = forecastData[i];
        console.log(forecastData);
        var forecastDate = formatDate(day.dt_txt);
        var forecastDayEl = document.createElement('div');
        forecastDayEl.className = 'forecast-day';
        forecastDayEl.innerHTML = '<h4>' + forecastDate + '</h4>' +
          '<img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '.png" alt="Weather Image">' +
          '<p>Temp: ' + day.main.temp + ' °C</p>' +
          '<p>Humidity: ' + day.main.humidity + '%</p>' +
          '<p>Wind: ' + (day.wind.speed * 3.6).toFixed(2) + ' km/h</p>';
        forecastEl.appendChild(forecastDayEl);
    }
}

//Search history
function updateSearchHistory(city) {
    var listHistory = document.createElement('li');
    listHistory.textContent = city;
    listHistory.addEventListener('click', function() {
        cityCoordinates(city);
    });
    searchHistoryEl.appendChild(listHistory);
}

//local storage

searchEl.addEventListener('submit', searchSubmit);

