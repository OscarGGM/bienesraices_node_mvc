import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUPloads: 1,
    autoProcessQueue: false, // Intenta hacer el envío del archivo inmediatamente una vez que este ha sido seleccionado
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El Límite es 1 Archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function() {
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue();
        });

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades';
            }
        })
    }
}