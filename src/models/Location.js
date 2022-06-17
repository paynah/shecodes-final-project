class Location {
    #latitude;
    #longitude;

    constructor(latitude, longitude) {
        this.#latitude = latitude;
        this.#longitude = longitude;
    }

    updateData(newData) {
        this.#latitude = newData.coord.lat;
        this.#longitude = newData.coord.lon;
    }

    get latitude() {
        return this.#latitude;
    }

    get longitude() {
        return this.#longitude;
    }
}