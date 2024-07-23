import path from 'path'; // Nos devuelve la ruta absoluta.

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstado: './src/js/cambiarEstado.js'
    },
    output: {
        filename: '[name].js', // [name] -> Si existen múltiples archivos en el entry se toma el nombre de la propiedad en el json para nombrar el archivo en el output y no tener que escribir un nombre para cada archivo de salida.
        path: path.resolve('public/js')
    }
}