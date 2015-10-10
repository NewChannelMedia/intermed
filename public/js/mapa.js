//Api Google Maps
var mapa = {
    map: null,

    //coordenadas para iniciar los mapas en mexico
    latitud: 23.6266557,
    longitud: -102.5377501,
    zoom: 16,
    mapId: google.maps.MapTypeId.ROADMAP,
    /*
                                            Opciones Para mostrar mapas    
                                            ROADMAP
                                            SATELLITE
                                            HYBRID
                                            TERRAIN
                                        */
    nombreObjetoMostrarMapa: null,
    nombreObjetoLatitud: null,
    nombreObjetoLongitud: null,
    nombreObjetoDireccion: null,

    //Marcadores
    marker: null,
    markers: null,
    popup: null,


    initMap: function () {
        //Activar cartografia y temas
        google.maps.visualRefresh = true;

        //Direcciones
        mapa.markers = new Array();
        mapa.popup = new google.maps.InfoWindow();

        //Opciones de inicio para el mapa
        var mapOptions = {
            center: new google.maps.LatLng(mapa.latitud, mapa.longitud),
            zoom: 5,//Mostrar Mexico
            mapTypeId: mapa.mapId
        };

        //Obtener objeto para mostrar mapa
        var mapElement = document.getElementById(mapa.nombreObjetoMostrarMapa);

        //Crear objeto mapa
        mapa.map = new google.maps.Map(mapElement, mapOptions);

        //Posicionar el mapa en la ubicacion del usuario
        mapa.GeolicalizacionUsuario();

        //Buscar Direcciones
        var searchDiv = document.getElementById('searchDiv');
        var searchField = document.getElementById('autocomplete_searchField');
        mapa.map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchDiv);


        var searchOptions = {
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(mapa.latitud, mapa.longitud)
            ),
            types: new Array()
        };

        var autocompleteSearch = new google.maps.places.Autocomplete(searchField, searchOptions);

        google.maps.event.addListener(autocompleteSearch, 'place_changed', function () {
            while (mapa.markers[0]) {
                mapa.markers.pop().setMap(null);
            }
            var place = autocompleteSearch.getPlace();

            if (place.geometry) {
                mapa.latitud = place.geometry.location.lat();
                mapa.longitud = place.geometry.location.lng();
                mapa.PosicionarMapa();
                mapa.Marcador();
                mapa.DireccionObtener();
            };
            mapa.Marcador();           

        });
    },
    PosicionarMapa: function () {
        var devCenter = new google.maps.LatLng(mapa.latitud, mapa.longitud);
        mapa.map.setCenter(devCenter);
        mapa.map.setZoom(mapa.zoom);
    },

    //posicionar mapa en ubicacion de usuario
    GeolicalizacionUsuario: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    mapa.latitud = position.coords.latitude;
                    mapa.longitud = position.coords.longitude;

                    mapa.PosicionarMapa();
                    //Crear marcador en el centro del mapa()
                    mapa.Marcador();
                    mapa.DireccionObtener();
                });
        };
    },

    //Marcadores
    Marcador: function () {
        var pos = new google.maps.LatLng(mapa.latitud, mapa.longitud);

        if (mapa.marker != null) {
            mapa.marker.position = pos;
        } else {
            var image = {
                url: 'img/marker.png',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(25, 32),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
            };

            mapa.marker = new google.maps.Marker({
                position: pos,
                map: mapa.map,
                draggable: true,
                title: "Esto es un marcador",
                animation: google.maps.Animation.DROP,
                icon: image
            });

            google.maps.event.addListener(mapa.marker, 'mouseup', mapa.funcionClick);
        };
        //personalizar el icono
        //mapa.marker.setIcon('img/logo-color.png');
        
    },

    //Acciones sobre el marcador
    funcionClick: function () {
        if (mapa.marker.getAnimation() != null) {
            mapa.marker.setAnimation(null);
        } else {
            mapa.marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        var pos = mapa.marker.getPosition();
        mapa.latitud = pos.lat();
        mapa.longitud = pos.lng();
        mapa.DireccionObtener();

        //var infowindow = new google.maps.InfoWindow({
        //    content: 'Marker Info Window – lat : ' + latitud + ' lng: ' + longitud
        //});


        //infowindow.open(map, marker);
    },

    //Obtener la direccion en base a la posicion del usuario
    DireccionObtener: function () {
        var content = $("#" + mapa.nombreObjetoDireccion);

        var dir = "";
        var dir2 = "";
        var latlng = new google.maps.LatLng(mapa.latitud, mapa.longitud);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ "latLng": latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var address = "", ciudad = "", stado = "", codigoPostal = "", pais = "", formattedAddress = "";
                    var lat;
                    var lng;
                    //console.log( console.log(results[0].formatted_address));

                    for (var i = 0; i < results[0].address_components.length; i++) {
                        var addr = results[0].address_components[i];


                        if (addr.types[0] == 'street_number') {
                            $('#numeroMed').val(addr.long_name);
                        };

                        if (addr.types[0] == 'route') {
                            $('#calleMed').val(addr.long_name);
                        };

                        if (addr.types[0] == 'sublocality_level_1') {
                            $('#slc_colonias').append('<option value="1" selected="selected" >' + addr.long_name + ' </option>');
                        };

                        if (addr.types[0] == 'locality') {
                            $('#slc_ciudades').append('<option value="1" selected="selected" >' + addr.long_name + ' </option>');
                        };

                        if (addr.types[0] == 'administrative_area_level_1') {
                            $('#slc_estados').append('<option value="1" selected="selected" >' + addr.long_name + ' </option>');

                        };

                        if (addr.types[0] == 'postal_code') {
                            $('#nmb_cp').val(addr.long_name);
                        };

                        //if (results[0].formatted_address != null) {
                        //    console.log(results[0].formatted_address);
                        //};


                    };
                }
                else {
                    dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
                }
            }
            else {
                dir = "<p>No se puede obtener la dirección</p>";
            }

            //content.html("<p><strong>Latitud:</strong> " + mapa.latitud + "</p><p><strong>Longitud:</strong> " + mapa.longitud + "</p>" + dir + "<br/>" + dir2);
            $('#' + mapa.nombreObjetoLatitud).val(mapa.latitud);
            $('#' + mapa.nombreObjetoLongitud).val(mapa.longitud);
        })
    }
};


//objeto donde se mostrara el objeto
mapa.nombreObjetoMostrarMapa = 'mapDiv';

//objetos que reciben los valores al cambiar posicion
mapa.nombreObjetoLatitud = 'latitude';
mapa.nombreObjetoLongitud = 'longitude';

//Objeto que recibe a direccion
mapa.nombreObjetoDireccion = 'direccion';

//cargar mapa
google.maps.event.addDomListener(window, 'load', mapa.initMap);
