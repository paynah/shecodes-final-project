class Weather {
    #unit;
    #temperature;
    #feelsLikeTemp;
    #humidity;
    #tempMin;
    #tempMax;
    #visibility;
    #windSpeed;
    #description;

    constructor() {}

    updateData(newData) {
        this.#temperature = Math.round(newData.main.temp);
        this.#feelsLikeTemp = Math.round(newData.main.feels_like);
        this.#humidity = newData.main.humidity;
        this.#tempMin = Math.round(newData.main.temp_min);
        this.#tempMax = Math.round(newData.main.temp_max);
        this.#visibility = newData.visibility;
        this.#windSpeed = newData.wind.speed;
        this.#description = newData.weather.description;
    }

    convertTemps() {
        let conversionFn = this.convertToCelsius;
        if (this.#unit === tempUnitsEnum.fahrenheit) {
            conversionFn = this.convertToFahrenheit;
        }

        this.#temperature = conversionFn(this.#temperature);
        this.#feelsLikeTemp = conversionFn(this.#feelsLikeTemp);
        this.#tempMax = conversionFn(this.#tempMax);
        this.#tempMin = conversionFn(this.#tempMin);
    }

    convertToCelsius(fahrenheitTemp) {
        fahrenheitTemp = parseInt(fahrenheitTemp);
        return Math.round((fahrenheitTemp - 32) * (5 / 9));
    }
      
    convertToFahrenheit(celciusTemp) {
        celciusTemp = parseInt(celciusTemp);
        return Math.round(celciusTemp * (9 / 5) + 32);
    }

    // Removes degree char and empty space
    cleanTemp(temp) {
        if (temp) {
            temp = temp.trim();
            temp = temp.replace("°", "");
        }
    
        return temp;
    }

    get unit() {
        return this.#unit;
    }

    set unit(newUnit) {
        this.#unit = newUnit;
    }

    get temperature() {
        return this.#temperature;
    }

    set temperature(newTemp) {
        this.#temperature = newTemp;
    }

    get feelsLikeTemp() {
        return this.#feelsLikeTemp;
    }

    set feelsLikeTemp(newTemp) {
        this.#feelsLikeTemp = newTemp;
    }

    get humidity() {
        return this.#humidity;
    }

    set humidity(newHumidity) {
        this.#humidity = newHumidity;
    }

    get tempMin() {
        return this.#tempMin;
    }

    set tempMin(newTemp) {
        this.#tempMin = newTemp;
    }

    get tempMax() {
        return this.#tempMax;
    }

    set tempMax(newTemp) {
        this.#tempMax = newTemp;
    }

    get visibility() {
        return this.#visibility;
    }

    set visibility(newVisibility) {
        this.#visibility = newVisibility;
    }

    get windSpeed() {
        return this.#windSpeed;
    }

    set windSpeed(newWindSpeed) {
        this.#windSpeed = newWindSpeed;
    }

    get description() {
        return this.#description;
    }

    set description(newDesc) {
        this.#description = newDesc;
    }
}