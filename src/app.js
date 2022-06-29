let apiKey = "bcecae2f970171c301c3ec24ea004803";
let baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
let oneCallBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?";
const tempUnitsEnum = Object.freeze({
  fahrenheit: 0,
  celsius: 1
});

const metric = "metric";
const imperial = "imperial";

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

let forecast = [];

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

  if (curHours >= 12) {
    curHours = curHours === 12 ? curHours : curHours - 12;
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
    setWindSpeed();
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
    setWindSpeed();
  } else {
    return;
  }

  setCurrentTemp(weather.temperature.imperial);
  updateHighAndLowTemps(tempUnitsEnum.fahrenheit);
}

function updateHighAndLowTemps(unit) {
  let highAndLowTemps = document.querySelectorAll(".tempDisplay");

  let tempMax = unit === tempUnitsEnum.fahrenheit ? weather.tempMax.imperial : weather.tempMax.metric;
  let tempMin = unit === tempUnitsEnum.fahrenheit ? weather.tempMin.imperial : weather.tempMin.metric;
  highAndLowTemps[0].innerHTML = `${tempMax}° / ${tempMin}°`;

  for (let x = 1; x < highAndLowTemps.length; x++) {
    tempMax = unit === tempUnitsEnum.fahrenheit ? forecast[x-1].tempMax.imperial : forecast[x-1].tempMax.metric;
    tempMin = unit === tempUnitsEnum.fahrenheit ? forecast[x-1].tempMin.imperial : forecast[x-1].tempMin.metric;

    highAndLowTemps[x].innerHTML = `${tempMax}° / ${tempMin}°`;
  }
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

function convertToMetersPerSecond(milesPerHour) {
    return Math.round(milesPerHour/2.237);
}

function convertToMilesPerHour(metersPerSecond) {
    return Math.round(metersPerSecond * 2.237);
}

function convertMilesToMeters(miles) {
    return Math.round(miles * 1609.34);
}

function convertMetersToMiles(meters) {
    return Math.round(miles / 1609.34);
}

function getWeatherByCityName(cityName) {
  let units = weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
  let reqUrl = `${baseUrl}q=${cityName}&units=${units}&appid=${apiKey}`;
  axios.get(reqUrl).then(onGetWeatherResponse).catch(onGetWeatherError);
}

function getConvertedTemperatureData(temperature) {
  let targetAttr = metric;
  let unselectedAttr = imperial;
  let conversionFn = convertToFahrenheit;
  if (weather.unit === tempUnitsEnum.fahrenheit) {
      targetAttr = imperial;
      unselectedAttr = metric;
      conversionFn = convertToCelsius;
  }

  let convertedTemps = [];
  convertedTemps[targetAttr] = Math.round(temperature);
  convertedTemps[unselectedAttr] = conversionFn(temperature);

  return convertedTemps;
}

function updateStoredWeatherData(newData) {
    city.name = newData.name;
    city.countryCode = newData.sys.country;
    city.latitude = newData.coord.lat;
    city.longitude = newData.coord.lon;

    day.sunrise = formatUnixTime(newData.sys.sunrise);
    day.sunset = formatUnixTime(newData.sys.sunset);

    let convertedTemp = getConvertedTemperatureData(newData.main.temp);
    weather['temperature'][imperial] = convertedTemp[imperial];
    weather['temperature'][metric] = convertedTemp[metric];
    
    convertedTemp = getConvertedTemperatureData(newData.main.feels_like);
    weather['feelsLikeTemp'][imperial] = convertedTemp[imperial];
    weather['feelsLikeTemp'][metric] = convertedTemp[metric];

    convertedTemp = getConvertedTemperatureData(newData.main.temp_max);
    weather['tempMax'][imperial] = convertedTemp[imperial];
    weather['tempMax'][metric] = convertedTemp[metric];

    convertedTemp = getConvertedTemperatureData(newData.main.temp_min);
    weather['tempMin'][imperial] = convertedTemp[imperial];
    weather['tempMin'][metric] = convertedTemp[metric];

    weather.humidity = newData.main.humidity;
    weather.description = newData.weather[0].description;
    weather.icon = newData.weather[0].icon;

    if (weather.unit === tempUnitsEnum.fahrenheit) {
        weather.windSpeed.imperial = Math.round(newData.wind.speed); // mph
        weather.windSpeed.metric = convertToMetersPerSecond(newData.wind.speed);

        weather.visibility.imperial = newData.main.visibility;
        weather.visibility.metric = convertMilesToMeters(newData.main.visibility);
    } else {
        weather.windSpeed.imperial = convertToMilesPerHour(newData.wind.speed);
        weather.windSpeed.metric = Math.round(newData.wind.speed);

        weather.visibility.imperial = convertMetersToMiles(newData.main.visibility);
        weather.visibility.metric = newData.main.visibility;
    }
}

function updateBigWeatherIcon() {
    let element = document.querySelector("#big-weather-icon");
    element.src = `images/${weather.icon}.png`;
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
    updateBigWeatherIcon();
    setWindSpeed();

    let humidity = `${weather.humidity}%`;
    setHumidity(humidity);

    console.log(data);

    getForecast();
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

function createForecastDayObj(data) {
  let convertedTempMin = getConvertedTemperatureData(data.temp.min);
  let convertedTempMax = getConvertedTemperatureData(data.temp.max)

  let forecastDay = 
  {
    date: new Date(data.dt * 1000),
    tempMin: 
    {
      imperial: convertedTempMin[imperial],
      metric: convertedTempMin[metric]
    },
    tempMax: 
    {
      imperial: convertedTempMax[imperial],
      metric: convertedTempMax[metric]
    },
    icon: data.weather[0].icon
  }

  return forecastDay;
}

function updateForecast() {
  let forecastElement = document.querySelector("#forecast");
  let abbrevDays = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
  ];

  forecastElement.innerHTML = "";

  forecast.forEach(function(forecastDay) {
    let dayName = abbrevDays[forecastDay.date.getDay()];
    let monthDay = `${forecastDay.date.getMonth() + 1}/${forecastDay.date.getDate()}`;
    let tempMax = weather.unit === tempUnitsEnum.fahrenheit ? forecastDay.tempMax.imperial : forecastDay.tempMax.metric;
    let tempMin = weather.unit === tempUnitsEnum.fahrenheit ? forecastDay.tempMin.imperial : forecastDay.tempMin.metric;

    forecastElement.innerHTML += 
    `<div class="col-1 me-4">
      <div class="date">${dayName} <br />${monthDay}</div>
      <div>
        <img src="images/${forecastDay.icon}.png" alt="" class="dailyWeatherIcon">
      </div>
      <div class="tempDisplay">${tempMax}° / ${tempMin}°</div>
    </div>`;
  })
}

function onGetForecastResponse(response) {
  let dailyData = response.data.daily;

  forecast = [];
  for (let x = 0; x < 5; x++) {
    let forecastDay = createForecastDayObj(dailyData[x]);
    forecast.push(forecastDay);
  }

  updateForecast();
}

function getForecast() {
  let units = weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
  let reqUrl = `${oneCallBaseUrl}lat=${city.latitude}&lon=${city.longitude}&exclude=minutely,hourly,alerts&units=${units}&appid=${apiKey}`;

  axios.get(reqUrl).then(onGetForecastResponse).catch(onGetWeatherError);
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

  let formattedTime = `${hours}:${minutes} ${amPmUnit}`;
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

function setWindSpeed() {
    let windSpeed = "";
    if (weather.unit === tempUnitsEnum.celsius) {
        windSpeed = `${weather.windSpeed.metric} mps`;
    } else {
        windSpeed = `${weather.windSpeed.imperial} mph`;
    }

    let element = document.querySelector("#windSpeed");
    element.innerHTML = `${windSpeed}`;
}

function setWeatherDescription(desc) {
    let element = document.querySelector("#weather-description");
    element.innerHTML = desc;
}

addEventListeners();
updateCurrentDateTime();

getWeatherByCityName("San Francisco");