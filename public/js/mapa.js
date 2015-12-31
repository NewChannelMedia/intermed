//Estilos
var styles = [
  {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
  }, {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
  }, {
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
  }
];


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
    estado: null,
    ciudad: null,
    colonia: null,
    calle: null,
    numero: null,
    codigoPostal: null,
    errorDireccion: null,
    soloCargar: false,



    initMap: function () {
        var success = true;
        $('#slc_estados').html('<option value=""></option>');
        $.ajax({
            url: '/obtenerEstados',
            type: 'POST',
            dataType: "json",
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(function (record) {
                    $('#slc_estados').append('<option value="' + record.id + '">' + record.estado + '</option>');
                });
            },
            error: function (jqXHR, textStatus, err) {
              console.log('ERROR: ' + JSON.stringify(err));
                var success = false;
            }
        });

        google.maps.visualRefresh = true;


        if ($('#idDireccion') && $('#idDireccion').val() != "" && $('#idDireccion').val() > 0){
          mapa.latitud = $('#latitud').val();
          mapa.longitud = $('#longitud').val();
        }

        var mapOptions = {
            center: new google.maps.LatLng(mapa.latitud, mapa.longitud),
            zoom: 5,//Mostrar Mexico
            mapTypeId: mapa.mapId
        };
        mapa.markers = new Array();
        mapa.popup = new google.maps.InfoWindow();
        var mapElement = document.getElementById('mapDiv');

        mapa.map =new google.maps.Map(mapElement,mapOptions);
        resizeMap();

        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });
        mapa.map.mapTypes.set('map_style', styledMap);
        mapa.map.setMapTypeId('map_style');

        google.maps.event.addListener(mapa.map, 'click', function(e){
          if (!($('#btnGuardar') && $('#btnGuardar').val() == "Editar")){
            var location = e.latLng;
            if (mapa.marker){
              //Actualizar ubicacion
              mapa.marker.setOptions({position: location});
            } else {
              //crear marcador
              mapa.latitud = location.lat;
              mapa.longitud = location.lng;
              mapa.Marcador();
            }
            mapa.funcionClick();
          }
        });

        if (!($('#idDireccion') && $('#idDireccion').val() != "" && $('#idDireccion').val() > 0)){
          mapa.GeolicalizacionUsuario();
        } else {
          $('#slc_estados').val($('#idEstado').val());
          obtenerCiudades();
          setTimeout(function(){
            $('#slc_ciudades').val($('#idMunicipio').val());
            obtenerColonias();
            setTimeout(function(){
              $('#slc_colonias').val($('#idLocalidad').val());
            },300);
          },300);
          var devCenter = new google.maps.LatLng(mapa.latitud, mapa.longitud);
          mapa.map.setCenter(devCenter);
          mapa.map.setZoom(14);
          setTimeout(function(){
            mapa.Marcador();
            mapa.marker.setOptions({draggable: false,animation:null});
          },200);
        }

        //Buscar Direcciones
        var searchDiv = document.getElementById('searchDiv');
        var searchField = document.getElementById('autocomplete_searchField');
        mapa.map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchDiv);

        var searchOptions = {
          bounds: new google.maps.LatLngBounds(new google.maps.LatLng(mapa.latitud, mapa.longitud)),types: new Array()
        };

        var autocompleteSearch = new google.maps.places.Autocomplete(searchField, searchOptions);
        //End buscar direcciones


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
                mapa.DireccionObtener(place);
            };

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
                title: "Arrastre y suelte para seleccionar la ubicación",
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(mapa.marker, 'mouseup', mapa.funcionClick);
        };
        //personalizar el icono
        mapa.marker.setIcon('img/marker.png');

    },

    //Acciones sobre el marcador
    funcionClick: function () {
      if (!($('#btnGuardar') && $('#btnGuardar').val() == "Editar")){
        if (mapa.marker.getAnimation() != null) {
            mapa.marker.setAnimation(null);
        } else {
            mapa.marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        var pos = mapa.marker.getPosition();
        mapa.latitud = pos.lat();
        mapa.longitud = pos.lng();
        mapa.DireccionObtener();
      }
    },

    //Obtener la direccion en base a la posicion del usuario
    DireccionObtener: function (place) {
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
                            setTimeout(function(){
                              AsignarCiudad();
                            },300);
                        };

                        if (addr.types[0] == 'postal_code') {
                            mapa.codigoPostal = addr.long_name;
                        };

                        $('#numeroUbi').val(mapa.numero);
                        $('#calleUbi').val(mapa.calle);
                        $('#cpUbi').val(mapa.codigoPostal);

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
        });
    }
};


//objeto donde se mostrara el objeto
//mapa.nombreObjetoMostrarMapa = 'mapDiv';

//objetos que reciben los valores al cambiar posicion
mapa.nombreObjetoLatitud = 'latitud';
mapa.nombreObjetoLongitud = 'longitud';

//Objeto que recibe a direccion
mapa.nombreObjetoDireccion = 'direccion';

var infoWindows = [];

function MostrarUbicaciones(){
  var mapProp = {
      center:new google.maps.LatLng(20.667015199999998, -103.43773089999999),
      zoom: 20,
      draggable: true,
      scrollwheel: true,
      mapTypeId:google.maps.MapTypeId.ROADMAP
  };

  MapaUbicaciones=new google.maps.Map(document.getElementById("mapUbiDiv"),mapProp);

  google.maps.event.addListenerOnce(MapaUbicaciones, 'idle', function(){

    $('.direccionLtLn').each(function( index ) {
      var principal = $( this ).find('.principal').text();
      var latitud = $( this ).find('.lat').text();
      var longitud = $( this ).find('.long').text();
      var nombre = $( this ).find('.nombre').text();
      var direccion = $( this ).find('.direccion').html();

      var pos = new google.maps.LatLng(latitud, longitud);

      if (principal == 1){
        //Centrar mapa
        MapaUbicaciones.setCenter(pos);
      }

      while (!(MapaUbicaciones.getBounds().contains(pos))){
        MapaUbicaciones.setOptions({zoom: parseInt(MapaUbicaciones.get('zoom'))-1});
      }

      var marker = new google.maps.Marker({
          position: pos,
          map: MapaUbicaciones,
          draggable: false
      });
      marker.setIcon('img/marker.png');

      var contentString = '<div><h4>'+nombre+'</h4><p>'+direccion+'</p></div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      infoWindows.push(infowindow);

      marker.addListener('click', function() {
        infoWindows.forEach(function(info){
          info.close();
        });

        infowindow.open(MapaUbicaciones, marker);
      });

    });
  });

  //resizeMap();
}

function resizeMap() {
   if(typeof mapa.map =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
   if(typeof mapa.map =="undefined") return;
   var center = mapa.map.getCenter();
   google.maps.event.trigger(mapa.map, "resize");
   mapa.map.setCenter(center);
}
function cargarMapa(ubicacion_id) {
    mapa.initMap();

    if (ubicacion_id && ubicacion_id > 0){
      console.log('Ubicacion_id: ' + ubicacion_id);
    }
}



function AgregarMarcadores() {
    var id, titulo, lat, lon;
    if (mapa.soloCargar) {
        $('[id^=direccion]').each(function (obj, val) {
            id = ($(val).attr('id')).replace('direccion', '');
            titulo = $('#titulo' + id).html();
            lat = $('#latitud' + id).val();
            lon = $('#longitud' + id).val();

            var pos = new google.maps.LatLng(lat, lon);

            var marker = new google.maps.Marker({
                position: pos,
                map: mapa.map,
                draggable: false,
                title: titulo,
                animation: google.maps.Animation.DROP
            });
            marker.setIcon('img/marker.png');

        });
        mapa.latitud = lat;
        mapa.longitud = lon;
        mapa.zoom = 10;
        mapa.PosicionarMapa();
    };
}

function AsignarCiudad() {
    SeleccionarValor('slc_ciudades', mapa.ciudad);
    obtenerColonias();
    setTimeout(function(){
      AsignarColonia();
    },300);
}

function AsignarColonia() {
    SeleccionarValor('slc_colonias', mapa.colonia);
}

function SeleccionarValor(control, valor) {
    $("#" + control + ' option').each(function () {
        if (ReemplezarAcentos($(this).text()) == ReemplezarAcentos(valor)) {            
            $(this).attr("selected", true);
        }

    });
}

function ReemplezarAcentos(valor) {
    var resultado = valor;
    resultado = resultado.replace('Á', 'A');
    resultado = resultado.replace('É', 'E');
    resultado = resultado.replace('Í', 'I');
    resultado = resultado.replace('Ó', 'O');
    resultado = resultado.replace('Ú', 'U');

    resultado = resultado.replace('á', 'a');
    resultado = resultado.replace('é', 'e');
    resultado = resultado.replace('í', 'i');
    resultado = resultado.replace('ó', 'o');
    resultado = resultado.replace('ó', 'u');

    return resultado;
}
