import express from "express";
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js'

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);

router.post('/cerrar-sesion', cerrarSesion);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);

router.post('/olvide-password', resetPassword);

// Alamacena el nuevo passowrd
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

// Routing
// router.get('/', (req, res) => {
//     res.send('Hola Mundo en express');
// });

// router.post('/', (req, res) => {
//     res.json({msg:'Información de nosotros'});
// });

//ALTERNATIVA PARA ESCRIBIR LAS RUTAS CON EL MISMO PATH Y DIFERENTE MÉTODO
// router.route('/')
//     .get(function(req, res) {
//         res.json({msg: 'Hola Mundo en express'});
//     })
//     .post(function(req, res) {
//         res.json({msg: 'Respuesta de Tipo Post'});
//     });

export default router;