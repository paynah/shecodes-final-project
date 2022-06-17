class WeatherView {
    #presenter;

    constructor() {

    }

    set presenter(newPresenter) {
        this.#presenter = newPresenter;
    }

    addEventListeners() {
        let tempUnitOptions = document.querySelectorAll("a.tempUnitChoice");
        tempUnitOptions.forEach(function (element) {
            if (element.innerHTML.includes("C")) {
                element.addEventListener("click", onCelciusOptionClick);
            } else {
                element.addEventListener("click", onFahrenheitOptionClick);
            }
        });
        
        let citySearchInput = document.querySelector("#citySearchForm");
        citySearchInput.addEventListener("submit", onCitySearchSubmit);
        
        let currentLocationBtn = document.querySelector("#useCurLocationBtn");
        currentLocationBtn.addEventListener("click", onCurrentLocationBtnClick);
    }

    selectCelciusOption() {
        let celciusOption = document.querySelector("#celciusOption");
        celciusOption.classList.add("selectedTempUnit");
    }
      
    deselectCelciusOption() {
        let celciusOption = document.querySelector("#celciusOption");
        celciusOption.classList.remove("selectedTempUnit");
    }

    selectFahrenheitOption() {
        let fahrenheitOption = document.querySelector("#fahrenheitOption");
        fahrenheitOption.classList.add("selectedTempUnit");
    }
      
    deselectFahrentheitOption() {
        let fahrenheitOption = document.querySelector("#fahrenheitOption");
        fahrenheitOption.classList.remove("selectedTempUnit");
    }

    convertHighAndLowTemps() {
        let highAndLowTemps = document.querySelectorAll(".tempDisplay");
        for (let x = 0; x < highAndLowTemps.length; x++) {
            let element = highAndLowTemps[x];
            let temps = element.innerHTML.split("/");
            if (temps.length === 2) {
                let highTemp = temps[0];
                let lowTemp = temps[1];
        
                highTemp = this.#presenter.convertTemp(highTemp);
                lowTemp = this.#presenter.convertTemp(lowTemp);
        
                element.innerHTML = `${highTemp}° / ${lowTemp}°`;
            }
        }
    }

    setCurrentMinMaxTemps(minTemp, maxTemp) {
        let minMaxElement = document.querySelector("#currentMinMaxTemp");
        let newMinMaxVal = `${maxTemp}° / ${minTemp}°`;
        minMaxElement.innerHTML = newMinMaxVal;
    }

    setCurrentTemp(temp) {
        let currentTempElement = document.querySelector("#currentTemp");
        currentTempElement.innerHTML = `${temp}°`;
    }

    setSunrise(sunriseTime) {
        let element = document.querySelector("#sunriseTime");
        element.innerHTML = `${sunriseTime}`;
    }

    setSunset(sunsetTime) {
        let element = document.querySelector("#sunsetTime");
        element.innerHTML = `${sunsetTime}`;
    }

    setHumidity(humidity) {
        let element = document.querySelector("#humidity");
        element.innerHTML = `${humidity}`;
    }

    setWindSpeed(windSpeed) {
        let element = document.querySelector("#windSpeed");
        element.innerHTML = `${windSpeed}`;
    }

    setCityName(newCityName) {
        let cityNameElement = document.querySelector("p#cityName");
        cityNameElement.innerHTML = newCityName;
    }

    updateCurrentDateTime() {
        let days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        let curDateTime = document.querySelector("#current-date-time");
        let curDate = new Date();
        let curDay = days[curDate.getDay()];
        let curHours = curDate.getHours();
        let curMinutes = curDate.getMinutes();
        let amPm = "AM";
      
        if (curHours > 12) {
          curHours = curHours - 12;
          amPm = "PM";
        }
      
        if (curMinutes < 10) {
          curMinutes = `0${curMinutes}`;
        }
      
        curDateTime.innerHTML = `${curDay} ${curHours}:${curMinutes} ${amPm}`;
    }
}

function onCelciusOptionClick(event) {
    event.preventDefault();
    presenter.setTempUnitToCelsius();
}

function onFahrenheitOptionClick(event) {
    event.preventDefault();
    presenter.setTempUnitToFahrenheit();
}

// Called when the user submits a city to search
function onCitySearchSubmit(event) {
    event.preventDefault();
    let citySearchInput = document.querySelector("#cityInput");
    let cityName = citySearchInput.value;

    if (citySearchInput && citySearchInput.value) {
        // Only update the city label if the input has a value
        //setCityName(cityName);
        presenter.getWeatherByCityName(cityName);
    } else {
        alert("Please enter a city");
    }
}

function onCurrentLocationBtnClick() {
    presenter.requestCurrentLocation();
}

/*function setCurrentMinMaxTemps(minTemp, maxTemp) {
    let minMaxElement = document.querySelector("#currentMinMaxTemp");
    let newMinMaxVal = `${maxTemp}° / ${minTemp}°`;
    minMaxElement.innerHTML = newMinMaxVal;
}

function setCurrentTemp(temp) {
    let currentTempElement = document.querySelector("#currentTemp");
    currentTempElement.innerHTML = `${temp}°`;
}

function setSunrise(sunriseTime) {
    let element = document.querySelector("#sunriseTime");
    element.innerHTML = `${sunriseTime}`;
}

function setSunset(sunsetTime) {
    let element = document.querySelector("#sunsetTime");
    element.innerHTML = `${sunsetTime}`;
}

function setHumidity(humidity) {
    let element = document.querySelector("#humidity");
    element.innerHTML = `${humidity}`;
}

function setWindSpeed(windSpeed) {
    let element = document.querySelector("#windSpeed");
    element.innerHTML = `${windSpeed}`;
}

function setCityName(newCityName) {
    let cityNameElement = document.querySelector("p#cityName");
    cityNameElement.innerHTML = newCityName;
}

function updateCurrentDateTime() {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let curDateTime = document.querySelector("#current-date-time");
    let curDate = new Date();
    let curDay = days[curDate.getDay()];
    let curHours = curDate.getHours();
    let curMinutes = curDate.getMinutes();
    let amPm = "AM";
  
    if (curHours > 12) {
      curHours = curHours - 12;
      amPm = "PM";
    }
  
    if (curMinutes < 10) {
      curMinutes = `0${curMinutes}`;
    }
  
    curDateTime.innerHTML = `${curDay} ${curHours}:${curMinutes} ${amPm}`;
}*/