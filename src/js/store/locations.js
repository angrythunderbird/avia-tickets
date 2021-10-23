import api from '../services/apiService.js';
import { getFormattedDate } from '../helpers/getTime.js';

class Locations {
  constructor(apiLocations) {
    this.api = apiLocations;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = {};
    this.lastSearch = {};
    this.airlines = {};
  }

  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);
    
    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    return response;
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(item => item.full_name === key);
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  createShortCitiesList(citiesSerialized) {
    return Object.entries(citiesSerialized).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, company) => {
      company.logo = `https://pics.avs.io/200/200/${company.code}.png`;
      company.name = company.name || company.name_translations.en;
      acc[company.code] = company;
      return acc;
    }, {});
  }

  serializeCountries(countries) {
    // { 'Country code': { ... } }
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  getCountryNameByCountryCode(code) {
    return this.countries[code].name;
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.countries[city.country_code].name;
      city.name = city.name || city.name_translations.en;
      const full_name = `${city.name}, ${country_name}`;
      acc[city.code] = {
        ...city,
        country_name,
        full_name
      };
      return acc;
    }, {});
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
  }

  serializeTickets(tickets) {
    return Object.values(tickets).map(ticket => ({
      ...ticket,
      origin_name: this.getCityNameByCode(ticket.origin),
      destination_name: this.getCityNameByCode(ticket.destination),
      airline_logo: this.getAirlineLogoByCode(ticket.airline),
      airline_name: this.getAirlineNameByCode(ticket.airline),
      departure_at: getFormattedDate(ticket.departure_at),
      return_at: getFormattedDate(ticket.return_at)
    }));
  }
}

const locations = new Locations(api);

export default locations;
