(function() {
    const lat = document.querySelector('#lat').value || 18.921260;
    const lng = document.querySelector('#lng').value || -99.233927;
    const mapa = L.map('mapa').setView([lat, lng ], 13);

    let marker;
    
    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El Pin
    marker = new L.marker([lat, lng], {
        draggable: true, // Para poder mover el pin
        autopan: true // Para que el mapa se mueva al mover el pin
    })
    .addTo(mapa);

    //Detectar el moviento del pin
    marker.on('moveend', function (e) {
        marker = e.target;

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
    
        // Obtener la información de las calles al soltar pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            marker.bindPopup(resultado.address.LongLabel);

            // Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';

            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        });
    });

})();