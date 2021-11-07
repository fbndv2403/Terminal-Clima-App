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
    switch (opt) {
      case 1:
        const terminoBusqueda = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(terminoBusqueda);
        const idSel = await listarLugares(lugares);
        const lugarSel = lugares.find((l) => l.id === idSel);
        console.log(lugarSel);

        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", lugarSel.nombre);
        console.log("Lat:", lugarSel.lat);
        console.log("Long: ", lugarSel.lng);
        console.log("Temperatura: ");
        console.log("Minima: ");
        console.log("Maxima: ");
        break;
    }

    await pausarMenu();
  } while (opt !== 0);
};

main();
