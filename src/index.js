/*let apiKey = "bcecae2f970171c301c3ec24ea004803";
let baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const tempUnitsEnum = Object.freeze({
  fahrenheit: 0,
  celsius: 1
});
let currentTempUnit = tempUnitsEnum.fahrenheit;

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

  if (currentTempUnit !== tempUnitsEnum.celsius) {
    selectCelciusOption();
    deselectFahrentheitOption();
    setCurrentTempUnit(tempUnitsEnum.celsius);
  } else {
    return;
  }

  convertCurrentTemp(convertToCelcius);
  updateHighAndLowTemps(convertToCelcius);
}

function onFahrenheitOptionClick(event) {
  event.preventDefault();

  if (currentTempUnit !== tempUnitsEnum.fahrenheit) {
    selectFahrenheitOption();
    deselectCelciusOption();
    setCurrentTempUnit(tempUnitsEnum.fahrenheit);
  } else {
    return;
  }

  convertCurrentTemp(convertToFahrenheit);
  updateHighAndLowTemps(convertToFahrenheit);
}

function convertCurrentTemp(conversionFn) {
  let currentTemp = document.querySelector("#currentTemp").innerHTML;
  let newTemp = conversionFn(currentTemp);
  setCurrentTemp(newTemp);
}

function updateHighAndLowTemps(conversionFn) {
  let highAndLowTemps = document.querySelectorAll(".tempDisplay");
  highAndLowTemps.forEach(function (element) {
    let temps = element.innerHTML.split("/");
    if (temps.length === 2) {
      let highTemp = temps[0];
      let lowTemp = temps[1];

      highTemp = conversionFn(highTemp);
      lowTemp = conversionFn(lowTemp);

      element.innerHTML = `${highTemp}° / ${lowTemp}°`;
    }
  });
}

// Removes degree char and empty space
function cleanTemp(temp) {
  if (temp) {
    temp = temp.trim();
    temp = temp.replace("°", "");
  }

  return temp;
}

function convertToCelcius(fahrenheitTemp) {
  fahrenheitTemp = cleanTemp(fahrenheitTemp);

  // Make sure that the parameter is a valid number
  if (!isNaN(parseInt(fahrenheitTemp))) {
    fahrenheitTemp = parseInt(fahrenheitTemp);
    return Math.round((fahrenheitTemp - 32) * (5 / 9));
  } else {
    return fahrenheitTemp;
  }
}

function convertToFahrenheit(celciusTemp) {
  celciusTemp = cleanTemp(celciusTemp);

  // Make sure that the parameter is a valid number
  if (!isNaN(parseInt(celciusTemp))) {
    celciusTemp = parseInt(celciusTemp);
    return Math.round(celciusTemp * (9 / 5) + 32);
  } else {
    return celciusTemp;
  }
}

function getWeatherByCityName(cityName) {
  let units = currentTempUnit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
  let reqUrl = `${baseUrl}q=${cityName}&units=${units}&appid=${apiKey}`;
  axios.get(reqUrl).then(onGetWeatherResponse).catch(onGetWeatherError);
}

function onGetWeatherResponse(response) {
  let data = response.data;
  let curTemp = Math.round(data.main.temp);
  let maxTemp = Math.round(data.main.temp_max);
  let minTemp = Math.round(data.main.temp_min);
  let cityName = data.name;

  setCurrentMinMaxTemps(minTemp, maxTemp);
  setCurrentTemp(curTemp);

  let sunriseTime = formatUnixTime(data.sys.sunrise);
  setSunrise(sunriseTime);

  let sunsetTime = formatUnixTime(data.sys.sunset);
  setSunset(sunsetTime);

  let humidity = `${data.main.humidity}%`;
  setHumidity(humidity);

  let windSpeed = Math.round(data.wind.speed);
  if (currentTempUnit === tempUnitsEnum.celsius) {
    windSpeed = `${windSpeed} mps`;
  } else {
    windSpeed = `${windSpeed} mph`;
  }
  setWindSpeed(windSpeed);

  setCityName(cityName);

  console.log(data);
}

function getWeatherByCoords(latitude, longitude) {
  let units = currentTempUnit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
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
    // Only update the city label if the input has a value
    setCityName(cityName);
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
  currentTempUnit = newUnit;
}

function requestCurrentLocation() {
  navigator.geolocation.getCurrentPosition(requestCurrentLocationCB);
}

function requestCurrentLocationCB(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeatherByCoords(latitude, longitude);
}

addEventListeners();
updateCurrentDateTime();*/

let presenter = new Presenter();