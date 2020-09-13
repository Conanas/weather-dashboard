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
    console.log("search term: " + searchTerm);
    return searchTerm.toLowerCase();
}

// 5 day forecast functions

// updates the 5 day forecast by clearing the current 5 day forecast and filling with the new locations data
function processForecastData(response) {
    // stores 5 day forecast element in index.html
    // and clears it
    var forecastDailies = $("#forecast-dailies");
    forecastDailies.empty();

    // for every day at 12pm for 5 days increment is 8 due to each value is 3 hours ahead
    for (var i = 1; i < response.list.length; i += 8) {

        // variables to retrieve and store date, icon, temp and humidity
        // from response data for 5 day forecast
        var date = moment(response.list[i].dt_txt).format("MMM Do");
        var icon = response.list[i].weather[0].icon;
        var temp = response.list[i].main.temp;
        var humidity = response.list[i].main.humidity;

        // creates elements using the retrieved values 
        // and appends the elements to the 5 day forecast element
        var forecastDiv = $(`<div class="col-md forecast-daily"></div>`);
        forecastDailies.append(forecastDiv);

        var dateDiv = $(`<div class="forecast-date"><h3>${date}</h3></div>`);
        forecastDiv.append(dateDiv);

        var iconImage = getIconImage(icon);
        iconImage.addClass("forecast-icon");
        forecastDiv.append(iconImage);

        var tempDiv = $(`<div class="forecast-temp"><p>Temp: ${temp}<sup>o</sup>C</p></div>`);
        forecastDiv.append(tempDiv);

        var humidityDiv = $(`<div class="forecast-humidity"><p>Humidity: ${humidity}%</p></div>`);
        forecastDiv.append(humidityDiv);
    }
}

// creates 5 day forecast url
function createForecastURL(cityNameCountry) {
    var apiKey = getAPIKey();
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&" +
        "q=" + cityNameCountry +
        "&appid=" + apiKey;
    console.log("forecast url: " + forecastURL);
    return forecastURL;
}

// gets the forecast data using the created url then prompts the data processing
function getForecastData(cityNameCountry) {
    var forecastURL = createForecastURL(cityNameCountry.replace(/\s/g, ""));
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(processForecastData)
}

// save functions

// stores and retrieves the get lastVisit save key
function getLastVisitKey() {
    var lastVisitKey = "lastVisit";
    return lastVisitKey;
}

// deletes city button from search history list and deletes city from localStorage
function deleteCity(event) {
    event.stopPropagation();
    var cityName = event.target.dataset.name;
    $(".search-list-button").each(function() {
        if ($(this).attr("data-name") === cityName) {
            $(this).remove();
            localStorage.removeItem(cityName);
        }
    })
}

// load city from localStorage and prompts processing of data
function loadCity(event) {
    var cityName = event.target.dataset.name;
    var response = JSON.parse(localStorage.getItem(cityName));
    processCurrentData(response);
}

// check if the city is already saved in local Storage
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
// and adds event listener to button and close icon
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

// save the last visited city into the localStorage as lastVisited
function saveLastVisit(response) {
    var lastVisitKey = getLastVisitKey()
    localStorage.setItem(lastVisitKey, JSON.stringify(response));
}

// save city response object to localStorage
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

// creates the uv url to request data from
function createUVURL(lat, lon) {
    var apiKey = getAPIKey();
    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" +
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

// retrieves the weather icon for the city
// this function is used for current day and the 5 day forecast
function getIconImage(icon) {
    var iconURL = "https://openweathermap.org/img/wn/" +
        icon + "@2x.png";
    var iconImage = $("<img>");
    iconImage.attr({
        src: iconURL,
        alt: "icon",
    });
    return iconImage;
}

// processes the current weather data and puts the information into the UI
// then process the forecast data
function processCurrentData(response) {

    // variables store the retrieved values from the response object
    var cityName = response.name;
    var cityCountry = response.sys.country;
    var date = moment().format("MMM Do YYYY");
    var icon = response.weather[0].icon;
    var temperature = parseFloat(response.main.temp).toFixed(1);
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var cityNameCountry = `${cityName}, ${cityCountry}`;

    // edit the text in the ui
    $("#current-heading").text(`${cityNameCountry}: ${date}`);
    var iconImage = getIconImage(icon);
    iconImage.attr("id", "current-icon");
    $("#current-heading").append(iconImage);
    $("#current-temperature-span").html(`${temperature}<sup>o</sup>C`);
    $("#current-humidity-span").html(`${humidity}%`);
    $("#current-wind-speed-span").html(`${windSpeed}km/h`);
    getUVIndex(lat, lon);

    // save city and add button to history list
    saveCity(`${cityNameCountry}`, response);
    saveLastVisit(response);
    addHistoryButton(cityNameCountry);

    // get the data for the 5 day forecast
    getForecastData(cityNameCountry);
}

// creates a url from user input
// gets the api key and city from user input to create url
function createCurrentURL() {
    var apiKey = getAPIKey();
    var cityName = getCityName();
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    console.log("current url: " + currentURL);
    return currentURL;
}

// retrieves weather data from openweathermap api
// and prompts the process data
// if city can't be find then an alert pops up informing the user
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

// create the url for the default city if there are no cities in local storage
function createDefaultURL() {
    var apiKey = getAPIKey();
    var cityName = "Melbourne,AU";
    var defaultURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&" +
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

// search for city using the user inputs
function searchCity(event) {
    event.preventDefault();
    getCurrentData();
}


// upon load

checkLastVisit();
loadHistoryButtons();
$("#search-button").on("click", searchCity);