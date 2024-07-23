// import Sequelize from 'sequelize'; Otra manera de importar Sequelize
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash( usuario.password, salt );
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
});

// Métodos Personalizados
// No se puede usar this. dentro de una "función anonima(arrow function)"
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default Usuario;