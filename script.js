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
    var cityName = $("#search-input").val();
    return cityName;
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
    console.log(`UV Index: ${response.value}`);
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

function processCurrentData(response) {
    console.log(response);
    var cityName = response.name;
    console.log(`City Name: ${cityName}`);

    var date = moment().format("MMM Do YY");
    console.log(`Date: ${date}`);

    var icon = response.weather[0].icon;
    console.log(`Icon: ${icon}`);

    var iconURL = "http://openweathermap.org/img/wn/" +
        icon + "@2x.png";

    $("#current-heading").text(`${cityName}: ${date}, `)

    var temperature = response.main.temp;
    console.log(`Temperature: ${temperature}`);

    var humidity = response.main.humidity;
    console.log(`Humidity: ${humidity}`);

    var windSpeed = response.wind.speed;
    console.log(`Wind Speed: ${windSpeed}`);

    var lat = response.coord.lat;
    var lon = response.coord.lon;

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