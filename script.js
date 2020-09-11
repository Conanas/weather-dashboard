var apiKey = "accd5d59f380f6347ac44664ded3ecef";
var queryURL = "";
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}
// api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={your api key}

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

var searchInput = $("#search-input");
var searchButton = $("#search-button");

searchButton.on("click", searchCity);

function searchCity(event) {
    event.preventDefault();
    getData();
}

function getData() {
    createURL();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(processData)
}

function createURL() {
    var cityName = searchInput.val();
    queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
}

function processData(response) {}