// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={your api key}

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast




// get city name
// get apikay

function getAPIKey() {
    var apiKey = "accd5d59f380f6347ac44664ded3ecef";
    return apiKey;
}

function getCityName() {
    var cityName = $("#city-search-input").val();
    console.log(cityName.split(" ").join());
    return cityName.split(" ").join();
}


// 5 day forecast functions

// function processForecastData(response) {
//     console.log(response);
//     var cityName = response.city.name;
//     console.log(cityName);
//     var date = moment().format();
//     console.log(date);

// }

// function createForecastURL() {
//     var cityName = $("#search-input").val();
//     queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
// }

// function getForecast() {
//     createForecastURL();
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(processForecastData)
// }






// uv functions

function processUVIndex(response) {
    var uvIndex = parseInt(response.value).toFixed(0);
    $("#current-uv-index-span").html(uvIndex);
}

function createUVURL(lat, lon) {
    var apiKey = getAPIKey();
    var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?" +
        "appid=" + apiKey +
        "&lat=" + lat +
        "&lon=" + lon;
    return uvQueryURL;
}

function getUVIndex(lat, lon) {
    var uvQueryURL = createUVURL(lat, lon);
    $.ajax({
        url: uvQueryURL,
        method: "GET"
    }).then(processUVIndex);
}


// current day functions

function processCurrentIcon(icon) {
    var iconURL = "http://openweathermap.org/img/wn/" +
        icon + "@2x.png";
    var iconImage = $("<img>");
    iconImage.attr({
        src: iconURL,
        alt: "icon",
        id: "current-icon"
    });
    $("#current-heading").append(iconImage);
}

function processCurrentData(response) {
    var cityName = response.name;
    var date = moment().format("MMM Do YYYY");
    var icon = response.weather[0].icon;
    var temperature = parseInt(response.main.temp).toFixed(0);
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    $("#current-heading").text(`${cityName}: ${date}`);
    processCurrentIcon(icon);
    $("#current-temperature-span").html(`${temperature}<sup>o</sup>C`);
    $("#current-humidity-span").html(`${humidity}%`);
    $("#current-wind-speed-span").html(`${windSpeed}km/h`);
    getUVIndex(lat, lon);
}

function createCurrentURL() {
    var apiKey = getAPIKey();
    var cityName = getCityName();
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    console.log(currentURL);
    return currentURL;
}

function getCurrentData() {
    var currentURL = createCurrentURL();
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(processCurrentData);
}


// search city functions

function searchCity(event) {
    event.preventDefault();
    getCurrentData();
    // getForecast();
}

$("#search-button").on("click", searchCity);