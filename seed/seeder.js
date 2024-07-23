import { exit } from 'node:process'; // Permite usar la funcion exit() directamente sin la necesidad de process.
import categorias from './categorias.js';
import precios from './precios.js';
import usuarios from './usuarios.js';
import db from '../config/db.js';
import {Categoria, Precio, Usuario} from '../models/index.js';

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate();

        // Generar las Columnas
        await db.sync();

        // Insertar los datos
        //await Categoria.bulkCreate(categorias);
        //await Precio.bulkCreate(precios);

        await Promise.all([
            Precio.bulkCreate(precios),
            Categoria.bulkCreate(categorias),
            Usuario.bulkCreate(usuarios)
        ]);

        console.log('Datos Importados Correctamente');
        exit();
        // process.exit();

    } catch ( error ) {
        console.log(error);
        exit(1);
        // process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ]);

        await db.sync({force: true});

        console.log("Datos Eliminados Correctamente");
        exit();
    }catch(error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}