import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarId, generarJWT } from '../helpers/token.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js';

const formularioLogin =  (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
};

const autenticar = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('El Email es Obligatorio').run(req);
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado esté vació
    if(!resultado.isEmpty()) {
        // Errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    const { email, password } = req.body

    // Comprobar si el usuairo existe
    const usuario = await Usuario.findOne( { where: { email }});
    if(!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Usuario No Existe'}]
        });
    }

    // Comprobar si el usuario está confirmado
    if(!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu Cuenta no ha sido Confirmada' }]
        });
    }

    // Revisar el password
    if(!usuario.verificarPassword(password)) {
        console.log('Password Incorrecto...')
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Password es Incorrecto'}]
        });
    }

    // Autenticar a un usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    console.log(token);

    return res.cookie('_token', token, {
        httpOnly: true, // Evitar los ataques Crossite
        //secure: true // Sólo permite los cookies en aplicaciones seguras( es necesario un certificado SSL)
        //sameSite: true 
    }).redirect('/mis-propiedades');

}

// Cerrar Sesión
const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

const formularioRegistro =  (req, res) => {

    //console.log(req.csrfToken()); // Función para generar CSRF token

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
};

const registrar = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({min: 6}).withMessage('El password debe ser de almenos 6 caracteres').run(req);
    await check('repetir_password').equals('password').withMessage('Los Passwords no son iguales').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer los datos
    const { nombre, email, password } = req.body;

    // Verificar que el usuario no esté duplicado
    const existeUsuario = await Usuario.findOne( {where : { email } } ) //Object Literal Enhacement OLE

    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Usuario ya está Registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    //res.json(resultado.array());
    
    // Almacena un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    //Envía email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace'
    });
}

// Función que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;
    console.log( token );

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: {token} });

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        });
    }
    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó Correctamente'
    });
}

const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvide-password", {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken : req.csrfToken()
    });
}

const resetPassword = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado esté vació
    if(!resultado.isEmpty()) {

        //Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: resultado.array()
        });
    }

    // Buscar el usuario
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if(!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningún usuario'}]
        });
    }

    // Generar un token y enviar el email
    usuario.token = generarId();
    
    await usuario.save();

    // Envia email de confirmación
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    });

}

const comprobarToken = async (req, res) => {
    
    const { token } = req.params;
    
    const usuario = await Usuario.findOne( {where: { token } } );
    if(!usuario)  {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken()
    });
}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {
        // Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}});

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    
    usuario.password = await bcrypt.hash( password, salt );
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente'
    });

}

export {
     formularioLogin,
     autenticar,
     cerrarSesion,
     formularioRegistro,
     registrar,
     confirmar,
     formularioOlvidePassword,
     resetPassword,
     comprobarToken,
     nuevoPassword
}