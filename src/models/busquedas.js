const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./src/db/database.json";

  constructor() {
    this.leerBaseDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join("");
    });
  }

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

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerBaseDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
