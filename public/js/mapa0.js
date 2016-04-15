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

    //Direccion
    estado:null,
    ciudad: null,
    colonia: null,
    calle: null,
    numero: null,
    codigoPostal: null,
    errorDireccion: null,



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
            mapa.marker = new google.maps.Marker({
                position: pos,
                map: mapa.map,
                draggable: true,
                title: "Esto es un marcador",
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(mapa.marker, 'mouseup', mapa.funcionClick);
        };
        //personalizar el icono
        mapa.marker.setIcon('img/marker.png');

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
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        var addr = results[0].address_components[i];

                        if (addr.types[0] == 'street_number') {
                            mapa.numero = addr.long_name;
                        };

                        if (addr.types[0] == 'route') {
                            mapa.calle = addr.long_name;
                        };

                        if (addr.types[0] == 'sublocality_level_1') {
                            mapa.colonia = addr.long_name;
                        };

                        if (addr.types[0] == 'locality') {
                            mapa.ciudad = addr.long_name;
                        };

                        if (addr.types[0] == 'administrative_area_level_1') {
                            mapa.estado = addr.long_name;
                            $("#slc_estados option:contains(" + mapa.estado + ")").attr("selected", true);
                            obtenerCiudades();
                        };

                        if (addr.types[0] == 'postal_code') {
                            mapa.codigoPostal = addr.long_name;
                        };

                        //if (results[0].formatted_address != null) {
                        //    console.log(results[0].formatted_address);
                        //};
                    };
                }
                else {
                    mapa.errorDireccion = "No se ha podido obtener ninguna dirección en esas coordenadas.";
                }
            }
            else {
                mapa.errorDireccion = "No se puede obtener la dirección";
            }


            $('#' + mapa.nombreObjetoLatitud).val(mapa.latitud);
            $('#' + mapa.nombreObjetoLongitud).val(mapa.longitud);
        })
    }
};


//objeto donde se mostrara el objeto
mapa.nombreObjetoMostrarMapa = 'mapDiv';

//objetos que reciben los valores al cambiar posicion
mapa.nombreObjetoLatitud = 'latitud';
mapa.nombreObjetoLongitud = 'longitud';

//Objeto que recibe a direccion
mapa.nombreObjetoDireccion = 'direccion';

//cargar mapa
google.maps.event.addDomListener(window, 'load', mapa.initMap);
