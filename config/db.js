import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: 3307,
    dialect: 'mysql', 
    define: {
        timestamp: true
    },
    pool: {
        max: 5, // Máximo número de conexiones en el pool
        min: 0, // Mínimo número de conexiones en el pool
        acquire: 30000, // Tiempo(ms) que tardará en establecer una conexión antes de marcar un error
        idle: 10000 // Tiempo(ms) de vida de una conexión sin ser utilizada
    },
    operatorAliases: false
});

export default db;