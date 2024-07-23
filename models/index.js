import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Mensaje from './Mensaje.js';

// Precio.hasOne(Propiedad);
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'}); // La definición de la llave foranea es opcional, Sequelize la crea automáticamente.
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'}); // Una Propiedad tiene Una Categoria
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'});
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId' }); // Una Propiedad tiene MUCHOS Mensajes

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId' });

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}