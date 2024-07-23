//const express = require('express'); //Importar con Common JS
import express from 'express'; // Importar con ECMASCRIPT6
import csrf from 'csurf'; // Existe otra lib de Node, esta es para trabajar con express
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) );
//app.use( bodyParser.urlencoded({extended: true}) ); //bodyParser es una dependencia
// que se usaba anteriormente para leer los formularios hoy en dia se usa express.
// en las últimas versiones

// Habilitar Cookie Parser
app.use( cookieParser() );

// Habilitar CSRF
app.use( csrf({cookie: true}) ); // Configurado de manera global

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    
    console.log('Conexión Correcta a la Base de Datos');
} catch (error) {
    console.log(error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública para almacenar contenido estático
app.use( express.static('public') );

// Routing
app.use('/', appRoutes);
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El Servidor está funcionando en el puerto ${port}`);
});