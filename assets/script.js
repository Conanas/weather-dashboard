// retrives the api key
function getAPIKey() {
    // the api key is stored here
    var apiKey = "accd5d59f380f6347ac44664ded3ecef";
    // function returns the api key here
    return apiKey;
}

// creates the string for the url request using the user input
// if there are any spaces in the string then they are replaced with %20
// can work with blank city input or blank country input
// turns the input to lower case
function getCityName() {
    // city name is taken from the city input box element
    var cityName = $("#city-search-input").val();
    // country name is taken from the country input box element
    var countryName = $("#country-search-input").val();
    // searchTerm will be created using the retrieved city and country name
    var searchTerm;
    // if the city input box is not empty
    if (cityName != "") {
        // place the retrieved city name into searchTerm and replace all whitespace with %20 to be used in ajax url
        searchTerm = cityName.replace(/\s/g, "%20");
        // if country input box is not empty
        if (countryName != "") {
            // concatenate countryName to searchTerm and replace whitespaces with %20
            searchTerm += `,${countryName.replace(/\s/g, "%20")}`;
        }
        // if city input is empty and country name input box is not empty
    } else if (cityName === "" && countryName != "") {
        // place country name into searchTerm and replace whitespaces with %20
        searchTerm = countryName.replace(/\s/g, "%20");
    }
    // return searchTerm as all lower case characters
    return searchTerm.toLowerCase();
}

// 5 day forecast functions

// updates the 5 day forecast by clearing the current 5 day forecast and filling with the new locations data
function processForecastData(response) {
    // stores 5 day forecast element in index.html
    var forecastDailies = $("#forecast-dailies");
    // clears the 5 day forecast element
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

        // creates div to display the forecast for 1 day
        // appends to forecast element
        var forecastDiv = $(`<div class="col-md forecast-daily"></div>`);
        forecastDailies.append(forecastDiv);

        // creates div to display date
        // appends to forecast div
        var dateDiv = $(`<div class="forecast-date"><h3>${date}</h3></div>`);
        forecastDiv.append(dateDiv);

        // creates the img element for the weather icon for the day
        // adds class to img element
        // appends img to forecast div
        var iconImage = getIconImage(icon);
        iconImage.addClass("forecast-icon");
        forecastDiv.append(iconImage);

        // creates the div to display the temp
        // appends to forecast div
        var tempDiv = $(`<div class="forecast-temp"><p>Temp: ${temp.toFixed(1)}<sup>o</sup>C</p></div>`);
        forecastDiv.append(tempDiv);

        // creates div to display humidity
        // appends to forecast div
        var humidityDiv = $(`<div class="forecast-humidity"><p>Humidity: ${humidity}%</p></div>`);
        forecastDiv.append(humidityDiv);
    }
}

// creates 5 day forecast url
function createForecastURL(cityNameCountry) {
    // retrieves api key and stores it
    var apiKey = getAPIKey();
    // creates the forecast url using the city name and country and api key
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&" +
        "q=" + cityNameCountry +
        "&appid=" + apiKey;
    // returns the newly created forecast url
    return forecastURL;
}

// gets the forecast data using the created url then prompts the data processing
function getForecastData(cityNameCountry) {
    // creates and stores a url to get the 5 day forecast data
    // the cityNameCountry has all whitespace removed before processing to url
    var forecastURL = createForecastURL(cityNameCountry.replace(/\s/g, ""));
    // ajax call to retrieve 5 day forecast data using the newly created forecast url
    $.ajax({
        url: forecastURL,
        method: "GET"
            // when data is retrieved it is processed to be displayed
    }).then(processForecastData)
}

// save functions

// stores and retrieves the get lastVisit save key
function getLastVisitKey() {
    // here is where the last visit key name for local storage is stored
    // returns last visit key name
    var lastVisitKey = "lastVisit";
    return lastVisitKey;
}

// deletes city button from search history list and deletes city from localStorage
function deleteCity(event) {
    // delete button is in another button and so the event is prevented from bubbling over into parent button
    event.stopPropagation();
    // city name is retrieved from event target and stored
    var cityName = event.target.dataset.name;
    // each button in the search history list is checked if it has the same data-name as its child delete button
    $(".search-list-button").each(function() {
        // if current button has the same name as the delete button
        if ($(this).attr("data-name") === cityName) {
            // remove button element and all child elements
            $(this).remove();
            // clear data from local storage
            localStorage.removeItem(cityName);
        }
    })
}

// load city from localStorage and prompts processing of data
function loadCity(event) {
    // retrieve city name from button and store
    var cityName = event.target.dataset.name;
    // use city name of button to load the data from local storage and store in response variable
    var response = JSON.parse(localStorage.getItem(cityName));
    // use response data to process and display the weather for the given city
    processCurrentData(response);
}

// check if the city is already saved in local Storage
function buttonCityCheck(cityNameCountry) {
    // boolean variable to store if a city exists in local storage, initialised to false
    var cityExists = false;
    // for each button in the search history list
    $(".search-list-button").each(function() {
            // if the current button has a data-name of the city and country
            if ($(this).attr("data-name") === cityNameCountry) {
                // city already exists as a button
                cityExists = true;
            }
        })
        // if city already has a button in the search history list
    if (cityExists) {
        return true;
        // else if the city does not have a button in the search history list
    } else {
        return false;
    }
}

// create city button and add to history if button does not already exist
// and adds event listener to button and close icon
function addHistoryButton(cityNameCountry) {
    // if the city does not already have a button in the search history list then create one
    if (buttonCityCheck(cityNameCountry) === false) {
        // variable to store the search history list element
        var searchHistoryList = $("#search-history-list");

        // create new list element and store
        // add class to new list element
        // append list item to search history list element
        var searchListItem = $("<li>");
        searchListItem.addClass("search-list-item");
        searchHistoryList.append(searchListItem);

        // create new search button and store
        // add class to search button
        // give button data-name of city and country
        // add city name and country text to button
        // append button to search list item
        // give button an on click event listener 
        var searchListButton = $("<button>");
        searchListButton.addClass("search-list-button");
        searchListButton.attr("data-name", cityNameCountry);
        searchListButton.text(cityNameCountry);
        searchListItem.append(searchListButton);
        searchListButton.on("click", loadCity);

        // create a delete button element and store
        // add class to delete button
        // give delete button data-name of city and country
        // prepend delete button to parent button
        // give delete button an on click listener
        var closeSearchButton = $(`<i class="fas fa-window-close"></i>`);
        closeSearchButton.addClass("delete-search-button");
        closeSearchButton.attr("data-name", cityNameCountry);
        searchListButton.prepend(closeSearchButton);
        closeSearchButton.on("click", deleteCity);
    }
}

// save the last visited city into the localStorage as lastVisited
function saveLastVisit(response) {
    // retrieve the last location visited key and store
    // save the last visited location to local storage under the last visited key name
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
    // retrieve and store the uv index value as float
    // retrieve and store the element the uv index is to be displayed
    // create variable for the background color of the uv display element
    // place the value of the uv index into the display element
    var uvIndex = parseFloat(response.value);
    var uvIndexSpan = $("#current-uv-index-span");
    var backgroundColor;
    uvIndexSpan.html(uvIndex);

    // if uv index is between 0 and 3
    // store background colour as blue
    // change the text color to black
    if (0 <= uvIndex && uvIndex < 3) {
        backgroundColor = "#99ddff";
        uvIndexSpan.css("color", "black");
    } else if (3 <= uvIndex && uvIndex < 6) {
        // if uv index is between 3 and 6
        // store background color as yellow
        // change text color to black
        backgroundColor = "#ffff99";
        uvIndexSpan.css("color", "black");
    } else if (6 <= uvIndex) {
        // if uv index is greater than 6
        // store background color as red
        // change font colour to white
        backgroundColor = "#ff4d4d";
        uvIndexSpan.css("color", "white");
    }
    // change the background color of the uv display element
    uvIndexSpan.css("background-color", backgroundColor);
}

// creates the uv url to request data from
function createUVURL(lat, lon) {
    // retrieve and store the api key
    // create query url for uv index using the latitude and longitude of city name
    // return the uv query url
    var apiKey = getAPIKey();
    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" +
        "appid=" + apiKey +
        "&lat=" + lat +
        "&lon=" + lon;
    return uvQueryURL;
}

// requests the uv rating for the current location for the day
function getUVIndex(lat, lon) {
    // create and store the uv query url using the latitude and longitude of the city
    // process the data retrieved to be displayed
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
    // create a url to retrieve the weather icon
    var iconURL = "https://openweathermap.org/img/wn/" +
        icon + "@2x.png";
    // create an image element
    var iconImage = $("<img>");
    // change src attribute of element to newly created icon url
    iconImage.attr({
        src: iconURL,
        // add alternate text
        alt: "icon",
    });
    // return newly created image element
    return iconImage;
}

// processes the current weather data and puts the information into the UI
// then process the forecast data
function processCurrentData(response) {

    // variables store the retrieved values from the response object
    // retrieve and store city name
    var cityName = response.name;
    // retrieve and store the cities country
    var cityCountry = response.sys.country;
    // retrieve and store the formatted date using moment.js
    var date = moment().format("MMM Do YYYY");
    // retrieve and store the icon name
    var icon = response.weather[0].icon;
    // retrieve and store the temperature as float to 1 decimal place
    var temperature = parseFloat(response.main.temp).toFixed(1);
    // retrieve and store the huidity
    var humidity = response.main.humidity;
    // retrieve and store the windspeed
    var windSpeed = response.wind.speed;
    // retrieve and store the latitude and longitude of the city to get the uv data
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    // create city name and country using retrieved respective values
    var cityNameCountry = `${cityName}, ${cityCountry}`;

    // edit the text in the ui
    // change text of current heading to that of city name, country and date
    $("#current-heading").text(`${cityNameCountry}: ${date}`);
    // create and store img element for icon
    var iconImage = getIconImage(icon);
    // give image element id of current-icon
    iconImage.attr("id", "current-icon");
    // apend new icon image to current heading display
    $("#current-heading").append(iconImage);
    // change html of temperature display to store temperature
    $("#current-temperature-span").html(`${temperature}<sup>o</sup>C`);
    // change html of humidity display to stored humidity
    $("#current-humidity-span").html(`${humidity}%`);
    // change html of wind speed display to store wind speed
    $("#current-wind-speed-span").html(`${windSpeed}km/h`);
    // get the uv index using the stored latitude and longitude
    getUVIndex(lat, lon);

    // save city, country name and response object to local storage
    saveCity(`${cityNameCountry}`, response);
    // save the current response object to last visit key in local storage
    saveLastVisit(response);
    // add button in search history button list as new button
    addHistoryButton(cityNameCountry);
    // get the data for the 5 day forecast
    getForecastData(cityNameCountry);
}

// creates a url from user input
// gets the api key and city from user input to create url
function createCurrentURL() {
    // retrieve and store the api key
    var apiKey = getAPIKey();
    // retrieve and store the city name using the inputs from the search boxes
    var cityName = getCityName();
    // create query url for current weather report for city
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    // return newly created url
    return currentURL;
}

// retrieves weather data from openweathermap api
// and prompts the process data
// if city can't be find then an alert pops up informing the user
function getCurrentData() {
    // create and store url for current weather report
    var currentURL = createCurrentURL();
    $.ajax({
            url: currentURL,
            method: "GET"
        })
        // process the retrieved data to be displayed
        .then(processCurrentData)
        // display error message if location could not be found
        .catch(function() {
            alert("Could not find location");
        });
}

// create the url for the default city if there are no cities in local storage
function createDefaultURL() {
    // retrieve and store the api key
    var apiKey = getAPIKey();
    // default city is melbourne australia
    var cityName = "Melbourne,AU";
    // create url for query
    var defaultURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&" +
        "q=" + cityName +
        "&appid=" + apiKey;
    // return newly created url
    return defaultURL;
}

// loads default city on start up if there are no cities in storage
function loadDefaultCity() {
    // create url for default city
    var defaultURL = createDefaultURL();
    // ajax call for data of default city
    $.ajax({
        url: defaultURL,
        method: "GET"
            // process data for display
    }).then(processCurrentData);
}

// check if there is a city in the database that was last visited
function checkLastVisit() {
    // retrieve and store teh last visited key
    var lastVisitKey = getLastVisitKey();
    // use last visited key to load object from local storage
    var lastVisit = JSON.parse(localStorage.getItem(lastVisitKey));
    // if there is no last visited key
    if (lastVisit === null) {
        // load default location
        loadDefaultCity();
    } else {
        // process the data to be displayed
        processCurrentData(lastVisit);
    }
}

// load search history buttons
function loadHistoryButtons() {
    // retrieve and store teh last visited key
    var lastVisitKey = getLastVisitKey();
    // for each item in local storage
    for (var i = 0; i < localStorage.length; i++) {
        // if the local storage key is not equal to teh last visited key
        if (localStorage.key(i) != lastVisitKey) {
            // add button to search history list using data from local storage
            addHistoryButton(localStorage.key(i));
        }
    }
}

// search city functions and event listener

// search for city using the user inputs
function searchCity(event) {
    // prevent default when form button is clicked
    event.preventDefault();
    // get the data from the city based on the users input
    getCurrentData();
}


// upon load

// check the last visited city in local storage and load to screen
checkLastVisit();
// load the history search buttons
loadHistoryButtons();
// add click event listener to search button
$("#search-button").on("click", searchCity);