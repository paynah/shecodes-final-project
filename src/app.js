let apiKey = "bcecae2f970171c301c3ec24ea004803";
let baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
let iconBaseUrl = "http://openweathermap.org/img/wn/";
const tempUnitsEnum = Object.freeze({
  fahrenheit: 0,
  celsius: 1
});

// Storing the imperial and metric numbers allows us to avoid
// data loss that results when repeatedly converting and rounding
let weather = 
{
    unit: tempUnitsEnum.fahrenheit,
    temperature: 
    {
        imperial: 77,
        metric: 25
    },
    feelsLikeTemp: 
    {
        imperial: 77,
        metric: 25
    },
    humidity: 27,
    tempMin: 
    {
        imperial: 56,
        metric: 13
    },
    tempMax: 
    {
        imperial: 82,
        metric: 28
    },
    visibility: 
    {
        imperial: 9,
        metric: 14
    },
    windSpeed: 
    {
        imperial: 10,
        metric: 16
    },
    description: "sunny",
    icon: ""
}

let city = 
{
    name: "San Francisco",
    countryCode: "US",
    latitude: 37.7749,
    longitude: 122.4194
}

let day = 
{
    sunrise: "6:12 AM",
    sunset: "8:15 PM"
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
}

// Add click event to temperature unit options
function onCelciusOptionClick(event) {
  event.preventDefault();

  if (weather.unit !== tempUnitsEnum.celsius) {
    selectCelciusOption();
    deselectFahrentheitOption();
    setCurrentTempUnit(tempUnitsEnum.celsius);
  } else {
    return;
  }

  setCurrentTemp(weather.temperature.metric)
  updateHighAndLowTemps(tempUnitsEnum.celsius);
}

function onFahrenheitOptionClick(event) {
  event.preventDefault();

  if (weather.unit !== tempUnitsEnum.fahrenheit) {
    selectFahrenheitOption();
    deselectCelciusOption();
    setCurrentTempUnit(tempUnitsEnum.fahrenheit);
  } else {
    return;
  }

  setCurrentTemp(weather.temperature.imperial);
  updateHighAndLowTemps(tempUnitsEnum.fahrenheit);
}

function updateHighAndLowTemps(unit) {
  let highAndLowTemps = document.querySelectorAll(".tempDisplay");
  let tempMax = weather.tempMax;
  let tempMin = weather.tempMin;
  highAndLowTemps.forEach(function (element) {
    let temps = element.innerHTML.split("/");
    if (temps.length === 2) {
      let highTemp = temps[0];
      let lowTemp = temps[1];

      highTemp = unit === tempUnitsEnum.fahrenheit ? tempMax.imperial : tempMax.metric;
      lowTemp = unit === tempUnitsEnum.fahrenheit ? tempMin.imperial : tempMin.metric;

      element.innerHTML = `${highTemp}° / ${lowTemp}°`;
    }
  });
}

function convertToCelsius(fahrenheitTemp) {
  if (!isNaN(parseInt(fahrenheitTemp))) {
    fahrenheitTemp = parseInt(fahrenheitTemp);
    return Math.round((fahrenheitTemp - 32) * (5 / 9));
  } else {
    return fahrenheitTemp;
  }
}

function convertToFahrenheit(celciusTemp) {
  if (!isNaN(parseInt(celciusTemp))) {
    celciusTemp = parseInt(celciusTemp);
    return Math.round(celciusTemp * (9 / 5) + 32);
  } else {
    return celciusTemp;
  }
}

function getWeatherByCityName(cityName) {
  let units = weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
  let reqUrl = `${baseUrl}q=${cityName}&units=${units}&appid=${apiKey}`;
  axios.get(reqUrl).then(onGetWeatherResponse).catch(onGetWeatherError);
}

function updateStoredWeatherData(newData) {
    city.name = newData.name;
    city.countryCode = newData.sys.country;
    city.latitude = newData.coord.lat;
    city.longitude = newData.coord.lon;

    day.sunrise = formatUnixTime(newData.sys.sunrise);
    day.sunset = formatUnixTime(newData.sys.sunset);

    var targetAttr = "metric";
    var unselectedAttr = "imperial";
    var conversionFn = convertToFahrenheit;
    if (weather.unit === tempUnitsEnum.fahrenheit) {
        targetAttr = "imperial";
        unselectedAttr = "metric";
        conversionFn = convertToCelsius;
    }

    weather['temperature'][targetAttr] = Math.round(newData.main.temp);
    weather['temperature'][unselectedAttr] = conversionFn(newData.main.temp);
    
    weather['feelsLikeTemp'][targetAttr] = Math.round(newData.main.feels_like);
    weather['feelsLikeTemp'][unselectedAttr] = conversionFn(newData.main.feels_like);

    weather['tempMax'][targetAttr] = Math.round(newData.main.temp_max);
    weather['tempMax'][unselectedAttr] = conversionFn(newData.main.temp_max);

    weather['tempMin'][targetAttr] = Math.round(newData.main.temp_min);
    weather['tempMin'][unselectedAttr] = conversionFn(newData.main.temp_min);

    weather.humidity = newData.main.humidity;
    weather.description = newData.weather[0].description;
    weather.icon = newData.weather.icon;

    // TO DO - visibility is returned in meters, need to convert to miles for imperial
    weather.visibility.metric = newData.main.visibility;

    // TO DO - add conversion for meter/sec for metric
    weather.windSpeed.imperial = newData.wind.speed;
    weather.windSpeed.metric = newData.wind.speed;
    // if (weather.unit === tempUnitsEnum.fahrenheit) {
    //     weather.windSpeed.imperial = newData.wind.speed; // mph
    // }
}

function onGetWeatherResponse(response) {
    let data = response.data;
    updateStoredWeatherData(data);
    let curTemp = weather.unit === tempUnitsEnum.fahrenheit ? weather.temperature.imperial : weather.temperature.metric;
    let maxTemp = weather.unit === tempUnitsEnum.fahrenheit ? weather.tempMax.imperial : weather.tempMax.metric;
    let minTemp = weather.unit === tempUnitsEnum.fahrenheit ? weather.tempMin.imperial : weather.tempMin.imperial;

    setCityName(city.name);
    setCurrentMinMaxTemps(minTemp, maxTemp);
    setCurrentTemp(curTemp);
    setSunrise(day.sunrise);
    setSunset(day.sunset);
    setWeatherDescription(weather.description);

    let humidity = `${weather.humidity}%`;
    setHumidity(humidity);

    let windSpeed = Math.round(weather.windSpeed.imperial);
    if (weather.unit === tempUnitsEnum.celsius) {
        windSpeed = `${windSpeed} mps`;
    } else {
        windSpeed = `${windSpeed} mph`;
    }
    setWindSpeed(windSpeed);
    console.log(data);
}

function getWeatherByCoords(latitude, longitude) {
  let units = weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
  let reqUrl = `${baseUrl}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(reqUrl).then(onGetWeatherResponse).catch(onGetWeatherError);
}

function onGetWeatherError(error) {
  let errorMsg = "An error has occurred. Please try again."
  if (error.response) {
    let errorData = error.response.data;
    errorMsg = errorData.message;
  } else {
    console.error(error, error.stack);
  }

  alert(errorMsg);
}

function formatUnixTime(unixTime) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(unixTime * 1000);
  
  let amPmUnit = "AM";
  let hours = date.getHours();
  if (hours > 12) {
    hours = hours - 12;
    amPmUnit = "PM";
  }
  
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  var formattedTime = `${hours}:${minutes} ${amPmUnit}`;
  return formattedTime;
}

// Called when the user submits a city to search
function onCitySearchSubmit(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#cityInput");
  let cityName = citySearchInput.value;

  if (citySearchInput && citySearchInput.value) {
    getWeatherByCityName(cityName);
  } else {
    alert("Please enter a city");
  }
}

function selectFahrenheitOption() {
  let fahrenheitOption = document.querySelector("#fahrenheitOption");
  fahrenheitOption.classList.add("selectedTempUnit");
}

function deselectFahrentheitOption() {
  let fahrenheitOption = document.querySelector("#fahrenheitOption");
  fahrenheitOption.classList.remove("selectedTempUnit");
}

function selectCelciusOption() {
  let celciusOption = document.querySelector("#celciusOption");
  celciusOption.classList.add("selectedTempUnit");
}

function deselectCelciusOption() {
  let celciusOption = document.querySelector("#celciusOption");
  celciusOption.classList.remove("selectedTempUnit");
}

function addEventListeners() {
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

function onCurrentLocationBtnClick() {
  requestCurrentLocation();
}

function setCurrentTempUnit(newUnit) {
    weather.unit = newUnit;
}

function requestCurrentLocation() {
  navigator.geolocation.getCurrentPosition(requestCurrentLocationCB);
}

function requestCurrentLocationCB(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeatherByCoords(latitude, longitude);
}

function setCurrentTemp(temp) {
    let currentTempElement = document.querySelector("#currentTemp");
    currentTempElement.innerHTML = `${temp}°`;
}

function setCityName(newCityName) {
    let cityNameElement = document.querySelector("p#cityName");
    cityNameElement.innerHTML = newCityName;
}

function setCurrentMinMaxTemps(minTemp, maxTemp) {
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

function setWeatherDescription(desc) {
    let element = document.querySelector("#weather-description");
    element.innerHTML = desc;
}

addEventListeners();
updateCurrentDateTime();