class Presenter {
    // Models
    #city;
    // Views
    #weatherView;
    #apiKey = "bcecae2f970171c301c3ec24ea004803";
    #baseUrl = "https://api.openweathermap.org/data/2.5/weather?";

    constructor() {
        this.createDefaultData();
        this.#weatherView = new WeatherView();
        this.#weatherView.presenter = this;

        this.#weatherView.addEventListeners();
        this.#weatherView.updateCurrentDateTime();
    }

    createDefaultData() {
        let weather = new Weather();
        weather.unit = tempUnitsEnum.fahrenheit;
        weather.temperature = 77;
        weather.feelsLikeTemp = 77;
        weather.tempMax = 82;
        weather.tempMin = 56;
        weather.humidity = 27;
        weather.visibility = 10;
        weather.windSpeed = 10;
        weather.description = "sunny";

        let day = new Day();
        day.weather = weather;
        day.date = new Date();
        day.sunrise = "6:12 AM";
        day.sunset = "8:15 PM";

        let location = new Location(37.7749, 122.4194);

        let city = new City("San Francisco");
        city.countryCode = "US";
        city.location = location;
        city.day = day;

        this.#city = city;
    }

    setTempUnitToCelsius() {
        if (this.#city.day.weather.unit !== tempUnitsEnum.celsius) {
            this.#weatherView.selectCelciusOption();
            this.#weatherView.deselectFahrentheitOption();
            this.#city.day.weather.unit = tempUnitsEnum.celsius;
            this.#city.day.weather.convertTemps();
        } else {
            return;
        }

        this.#weatherView.setCurrentTemp(this.#city.day.weather.temperature);
        this.#weatherView.convertHighAndLowTemps();
    }

    setTempUnitToFahrenheit() {
        if (this.#city.day.weather.unit !== tempUnitsEnum.fahrenheit) {
            this.#weatherView.selectFahrenheitOption();
            this.#weatherView.deselectCelciusOption();
            this.#city.day.weather.unit = tempUnitsEnum.fahrenheit;
            this.#city.day.weather.convertTemps();
        } else {
            return;
        }

        this.#weatherView.setCurrentTemp(this.#city.day.weather.temperature);
        this.#weatherView.convertHighAndLowTemps();
    }

    convertTemp(temp) {
        // This should be refactored once the code supports weather for multiple days
        let newTemp;
        if (this.#city.day.weather.unit === tempUnitsEnum.celsius) {
            newTemp = this.#city.day.weather.convertToCelsius(temp);
        } else {
            newTemp = this.#city.day.weather.convertToFahrenheit(temp);
        }

        return newTemp;
    }

    getWeatherByCityName(cityName) {
        let units = this.#city.day.weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
        let reqUrl = `${this.#baseUrl}q=${cityName}&units=${units}&appid=${this.#apiKey}`;
        axios.get(reqUrl).then(this.onGetWeatherResponse).catch(this.onGetWeatherError);
    }

    getWeatherByCoords(latitude, longitude) {
        let units = this.#city.day.weather.unit === tempUnitsEnum.fahrenheit ? "imperial" : "metric";
        let reqUrl = `${this.#baseUrl}lat=${latitude}&lon=${longitude}&units=${units}&appid=${this.#apiKey}`;
        axios.get(reqUrl).then(this.onGetWeatherResponse).catch(this.onGetWeatherError);
    }

    onGetWeatherResponse(response) {
        let data = response.data;
        presenter.#city.updateData(data);
        presenter.#weatherView.setCityName(presenter.#city.name);
        presenter.#weatherView.setCurrentTemp(presenter.#city.day.weather.temperature);
        
        let tempMax = presenter.#city.day.weather.tempMax;
        let tempMin = presenter.#city.day.weather.tempMin;
        presenter.#weatherView.setCurrentMinMaxTemps(tempMin, tempMax);
        
        presenter.#weatherView.setSunrise(presenter.#city.day.sunrise);
        presenter.#weatherView.setSunset(presenter.#city.day.sunset);
        presenter.#weatherView.setHumidity(`${presenter.#city.day.weather.humidity}%`);

        let windSpeed = Math.round(presenter.#city.day.weather.windSpeed);
        if (presenter.#city.day.weather.unit === tempUnitsEnum.celsius) {
          windSpeed = `${windSpeed} mps`;
        } else {
          windSpeed = `${windSpeed} mph`;
        }
        presenter.#weatherView.setWindSpeed(windSpeed);

        presenter.#weatherView.updateCurrentDateTime();
        //console.log(data);
    }

    onGetWeatherError(error) {
        let errorMsg = "An error has occurred. Please try again."
        if (error.response) {
          let errorData = error.response.data;
          errorMsg = errorData.message;
        } else {
          console.error(error, error.stack);
        }
      
        alert(errorMsg);
    }

    requestCurrentLocation() {
        navigator.geolocation.getCurrentPosition(this.requestCurrentLocationCB);
    }
      
    requestCurrentLocationCB(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
      
        presenter.getWeatherByCoords(latitude, longitude);
    }
}