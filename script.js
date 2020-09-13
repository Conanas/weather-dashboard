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



// save functions

// get lastVisit save key
function getLastVisitKey() {
    var lastVisitKey = "lastVisit";
    return lastVisitKey;
}

// delete City from localStorage
function deleteCity(event) {
    event.stopPropagation();
    var cityName = event.target.dataset.name;
    console.log(event);
    $(".search-list-button").each(function() {
        if ($(this).attr("data-name") === cityName) {
            $(this).remove();
            localStorage.removeItem(cityName);
        }
    })
}

// load city from localStorage
function loadCity(event) {
    var cityName = event.target.dataset.name;
    var response = JSON.parse(localStorage.getItem(cityName));
    processCurrentData(response);
}

// check if the city is already saved in local Storage
// add event listener to history button
// add event listener to delete history button
function buttonCityCheck(cityNameCountry) {
    var cityExists = false;
    $(".search-list-button").each(function() {
        if ($(this).attr("data-name") === cityNameCountry) {
            cityExists = true;
        }
    })
    if (cityExists) {
        return true;
    } else {
        return false;
    }
}

// create city button and add to history if button does not already exist
function addHistoryButton(cityNameCountry) {
    if (buttonCityCheck(cityNameCountry) === false) {
        var searchHistoryList = $("#search-history-list");

        var searchListItem = $("<li>");
        searchListItem.addClass("search-list-item");
        searchHistoryList.append(searchListItem);

        var searchListButton = $("<button>");
        searchListButton.addClass("search-list-button");
        searchListButton.attr("data-name", cityNameCountry);
        searchListButton.text(cityNameCountry);
        searchListItem.append(searchListButton);
        searchListButton.on("click", loadCity);

        var closeSearchButton = $(`<i class="fas fa-window-close"></i>`);
        closeSearchButton.addClass("delete-search-button");
        closeSearchButton.attr("data-name", cityNameCountry);
        searchListButton.prepend(closeSearchButton);
        closeSearchButton.on("click", deleteCity);
    }
}

// save the last visited city
function saveLastVisit(response) {
    var lastVisitKey = getLastVisitKey()
    localStorage.setItem(lastVisitKey, JSON.stringify(response));
}

// save city to localStorage
function saveCity(cityName, response) {
    localStorage.setItem(cityName, JSON.stringify(response));
}


// uv functions

// puts the uv index into the UI
// changes the backgound color of the uv index span
function processUVIndex(response) {
    var uvIndex = parseFloat(response.value);
    var uvIndexSpan = $("#current-uv-index-span");
    var backgroundColor;
    uvIndexSpan.html(uvIndex);
    // favourable, moderate, severe
    if (0 <= uvIndex && uvIndex < 3) {
        backgroundColor = "#63d063";
        uvIndexSpan.css("color", "black");
    } else if (3 <= uvIndex && uvIndex < 6) {
        backgroundColor = "yellow";
        uvIndexSpan.css("color", "black");
    } else if (6 <= uvIndex) {
        backgroundColor = "red";
        uvIndexSpan.css("color", "white");
    }
    uvIndexSpan.css("background-color", backgroundColor);
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
    var cityNameCountry = `${cityName}, ${cityCountry}`;

    $("#current-heading").text(`${cityNameCountry}: ${date}`);
    processCurrentIcon(icon);
    $("#current-temperature-span").html(`${temperature}<sup>o</sup>C`);
    $("#current-humidity-span").html(`${humidity}%`);
    $("#current-wind-speed-span").html(`${windSpeed}km/h`);
    getUVIndex(lat, lon);

    // save city and add button to history list
    saveCity(`${cityNameCountry}`, response);
    saveLastVisit(response);
    addHistoryButton(cityNameCountry);

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
        })
        .then(processCurrentData)
        .catch(function() {
            alert("Could not find location");
        });
}

// create the url for the default city if no cities in local storage
function createDefaultURL() {
    var apiKey = getAPIKey();
    var cityName = "Melbourne,AU";
    var defaultURL = "http://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    return defaultURL;
}

// loads default city on start up if there are no cities in storage
function loadDefaultCity() {
    var defaultURL = createDefaultURL();
    $.ajax({
            url: defaultURL,
            method: "GET"
        })
        .then(processCurrentData);
}

// check if there is a city in the database that was last visited
function checkLastVisit() {
    var lastVisitKey = getLastVisitKey();
    var lastVisit = JSON.parse(localStorage.getItem(lastVisitKey));
    if (lastVisit === null) {
        loadDefaultCity();
    } else {
        processCurrentData(lastVisit);
    }
}

// load search history buttons
function loadHistoryButtons() {
    var lastVisitKey = getLastVisitKey();
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != lastVisitKey) {
            addHistoryButton(localStorage.key(i));
        }
    }
}


// search city functions and event listener

function searchCity(event) {
    event.preventDefault();
    getCurrentData();
    // getForecast();
}

checkLastVisit();
loadHistoryButtons();
$("#search-button").on("click", searchCity);