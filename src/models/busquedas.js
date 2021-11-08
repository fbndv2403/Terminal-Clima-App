const axios = require("axios");

class Busquedas {
  historial = ["Madird", "Bogota", "Londres"];

  constructor() {}

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsWheather() {
    return {
      appid: process.env.OPEN_WEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(ciudad = "") {
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.paramsMapbox,
      });
      const resp = await intance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaCiudad(lat, lon) {
    try {
      const response = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWheather, lat, lon },
      });
      const res = await response.get();
      const { weather, main } = res.data;
      return {
        desc: weather[0].description,
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.log(error);
    }
    // return `latitud: ${lat}\nlongitud: ${lon}`;
  }
}

module.exports = Busquedas;
