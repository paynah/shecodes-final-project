class City {
    #name;
    #countryCode;
    #location;
    // day can be changed to an array of Days later so we have weather for the week
    #day;       

    constructor(name) {
        this.#name = name;
    }

    updateData(newData) {
        this.day.updateData(newData);
        this.#name = newData.name;
        this.#countryCode = newData.sys.country;
        this.location.updateData(newData);
    }

    get day() {
        return this.#day;
    }

    set day(newDay) {
        this.#day = newDay;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get location() {
        return this.#location;
    }

    set location(location) {
        this.#location = location;
    }

    set countryCode(countryCode) {
        this.#countryCode = countryCode;
    }
}