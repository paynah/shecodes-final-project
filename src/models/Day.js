class Day {
    #date;
    #sunrise;
    #sunset;
    #weather;

    constructor(date) {
        this.#date = date;
    }

    updateData(newData) {
        this.#weather.updateData(newData);
        this.#sunrise = this.formatUnixTime(newData.sys.sunrise);
        this.#sunset = this.formatUnixTime(newData.sys.sunset);
    }

    formatUnixTime(unixTime) {
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

    get date() {
        return this.#date;
    }

    set date(newDate) {
        this.#date = newDate;
    }

    get sunrise() {
        return this.#sunrise;
    }

    set sunrise(newSunrise) {
        this.#sunrise = newSunrise;
    }

    get sunset() {
        return this.#sunset;
    }

    set sunset(newSunset) {
        this.#sunset = newSunset;
    }

    get weather() {
        return this.#weather;
    }

    set weather(newWeather) {
        this.#weather = newWeather;
    }
}