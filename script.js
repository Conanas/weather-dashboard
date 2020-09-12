// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={your api key}

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast




// get city name
// get apikay

// retrives the api key
function getAPIKey() {
    var apiKey = "accd5d59f380f6347ac44664ded3ecef";
    return apiKey;
}

// creates the string for the url request using the user input
// if there are any spaces in the string then they are replaced with %20
// can work with blank city input or blank country input
// turns the input to lower case
function getCityName() {
    var cityName = $("#city-search-input").val();
    var countryName = $("#country-search-input").val();
    var searchTerm;
    if (cityName != "") {
        searchTerm = cityName.replace(/\s/g, "%20");
        if (countryName != "") {
            searchTerm += `,${countryName.replace(/\s/g, "%20")}`;
        }
    } else if (cityName === "" && countryName != "") {
        searchTerm = countryName.replace(/\s/g, "%20");
    }
    console.log(searchTerm);
    return searchTerm.toLowerCase();
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

// puts the uv index into the UI
function processUVIndex(response) {
    var uvIndex = parseInt(response.value).toFixed(0);
    $("#current-uv-index-span").html(uvIndex);
}

// creates the uv url request
function createUVURL(lat, lon) {
    var apiKey = getAPIKey();
    var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?" +
        "appid=" + apiKey +
        "&lat=" + lat +
        "&lon=" + lon;
    return uvQueryURL;
}

// requests the uv rating for the current location for the day
function getUVIndex(lat, lon) {
    var uvQueryURL = createUVURL(lat, lon);
    $.ajax({
        url: uvQueryURL,
        method: "GET"
    }).then(processUVIndex);
}


// current day functions

// retrieves the weather icon for the current day of city
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

// processes the current weather data and puts the information into the UI
function processCurrentData(response) {
    var cityName = response.name;
    var cityCountry = response.sys.country;
    var date = moment().format("MMM Do YYYY");
    var icon = response.weather[0].icon;
    var temperature = parseInt(response.main.temp).toFixed(0);
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    $("#current-heading").text(`${cityName}, ${cityCountry}: ${date}`);
    processCurrentIcon(icon);
    $("#current-temperature-span").html(`${temperature}<sup>o</sup>C`);
    $("#current-humidity-span").html(`${humidity}%`);
    $("#current-wind-speed-span").html(`${windSpeed}km/h`);
    getUVIndex(lat, lon);

    // save city add button to history list


}

// creates a url from user input
// gets the api key and city from user input to create url
function createCurrentURL() {
    var apiKey = getAPIKey();
    var cityName = getCityName();
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    console.log(currentURL);
    return currentURL;
}

// retrieves weather data from openweathermap api
// stores created url from user input
function getCurrentData() {
    var currentURL = createCurrentURL();
    $.ajax({
            url: currentURL,
            method: "GET"
        }).then(processCurrentData)
        .catch(function(error) {
            alert("Could not find location");
        });
}


// search city functions and event listener

function searchCity(event) {
    event.preventDefault();
    getCurrentData();
    // getForecast();
}

$("#search-button").on("click", searchCity);