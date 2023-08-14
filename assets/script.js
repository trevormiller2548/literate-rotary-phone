//this is the api key for the weather app
var apiKey = "0b0900da3e3ace0a6e0aa07ac1bb9cd6";
var weatherInput = document.getElementById("get-weather");

//this is the function that will run when the search button is clicked
document.getElementById("run-search").addEventListener("click", function () {
    var city = weatherInput.value.trim();
    if (city !== "") {
        fetchWeatherData(city);
    }
});
//this is the function that will run when the enter key is pressed
function fetchWeatherData(city) {
    var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            saveToLocalStorage(city);
        })
        .catch(error => console.error("Error fetching current weather:", error));

    fetch(fiveDayURL)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error("Error fetching forecast:", error));
}
//this is the function that will display the current weather
function displayCurrentWeather(data) {
    var tempF = (data.main.temp - 273.15) * 1.80 + 32;
    var temp = tempF.toFixed(2);

    document.querySelector(".city").innerHTML = `<h2>Today in ${data.name}</h2>`;
    document.querySelector(".wind").textContent = `Wind Speed: ${data.wind.speed}`;
    document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}`;
    document.querySelector(".temp").textContent = `Temperature (F): ${temp}`;
}
//this is the function that will display the forecast
function displayForecast(data) {
    var forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ""; // Clear previous data

    for (var i = 4; i < data.list.length; i += 8) {
        var forecastData = data.list[i];
        var tempF = (forecastData.main.temp - 273.15) * 1.80 + 32;
        var temp = tempF.toFixed(2);

        var forecastCard = document.createElement("div");
        forecastCard.className = "col";
        forecastCard.innerHTML = `
            <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
                <div class="card-body">
                    <h6>${forecastData.dt_txt}</h6>
                    <p>Temp: ${temp}</p>
                    <p>Humidity: ${forecastData.main.humidity}</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(forecastCard);
    }
}
//this is the function that will save the city to local storage
function saveToLocalStorage(city) {
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.unshift(city);
        if (recentSearches.length > 8) {
            recentSearches.pop();
        }
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
    displayRecentSearches(recentSearches);
}
//this is the function that will display the recent searches
function displayRecentSearches(recentSearches) {
    var recentSearchesList = document.querySelector(".recent-searches");
    recentSearchesList.innerHTML = "";

    recentSearches.forEach(function (search) {
        var listItem = document.createElement("li");
        listItem.textContent = search;
        listItem.addEventListener("click", function () {
            weatherInput.value = search;
            fetchWeatherData(search);
        });

        recentSearchesList.appendChild(listItem);
    });
}
//this is the function that will initialize the recent searches
function initRecentSearches() {
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    displayRecentSearches(recentSearches);
}

initRecentSearches();



