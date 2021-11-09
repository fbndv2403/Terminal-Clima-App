require("dotenv").config();
require("colors");
const {
  leerInput,
  inquirerMenu,
  pausarMenu,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();
    busquedas.leerBaseDB();
    switch (opt) {
      case 1:
        const terminoBusqueda = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(terminoBusqueda);
        const idSel = await listarLugares(lugares);
        if (idSel == 0) continue;

        const lugarSel = lugares.find((l) => l.id === idSel);
        busquedas.agregarHistorial(lugarSel.nombre);

        const clima = await busquedas.climaCiudad(lugarSel.lat, lugarSel.lng);

        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", lugarSel.nombre.yellow);
        console.log("Lat:", lugarSel.lat);
        console.log("Long: ", lugarSel.lng);
        console.log("Como esta el clima: ", clima.desc.yellow);
        console.log("Temperatura: ", clima.temp);
        console.log("Minima: ", clima.min);
        console.log("Maxima: ", clima.max);
        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    await pausarMenu();
  } while (opt !== 0);
};

main();
