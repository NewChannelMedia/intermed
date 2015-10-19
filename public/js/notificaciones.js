var socket = io();;

//Manejar notificaciones
$.ajax( {
  url: '/notificaciones',
  type: 'POST',
  dataType: "json",
  cache: false,
  success: function ( data ) {
    if ( data ) {
      notificaciones.forEach( function ( notificacion ) {
        clearInterval( notificacion.id );
      } );
      notificaciones = [];


      if ( Object.prototype.toString.call( data ) === '[object Array]' ) {
        if ( data ) {
          data.forEach( function ( record ) {
            if ( record.interno || record.push || record.mail ) {
              socket.emit( record.tipo );
              //console.log( '[' + new Date().toLocaleString().substring( 0, 18 ) + '] Revisar: ' + record.tipo );

              var idInterval = setInterval(
                function () {
                  try {
                    socket.emit( record.tipo );
                    //console.log( '[' + new Date().toLocaleString().substring( 0, 18 ) + '] Revisar: ' + record.tipo );
                  }
                  catch ( err ) {
                    console.log( 'No se puede conectar con el servidor' );
                  }
                }, ( parseInt( record.intervalo ) * 1000 ) );
              notificaciones.push( {
                id: idInterval,
                tipo: record.tipo,
                interno: record.interno,
                push: record.push,
                mail: record.mail
              } );
            }
          } );
          socketManejadores();
        }
      }
    }
  },
  error: function ( jqXHR, textStatus, err ) {
    console.error( 'AJAX ERROR: ' + err );
  }
} );

function formattedDate( date ) {
  date = new Date( date );
  date = date.toString();
  var months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];

  var d1 = new Date( date || Date.now() ),
    month1 = d1.getMonth();
  day1 = '' + d1.getDate(),
    year1 = d1.getFullYear(),
    hour1 = '' + d1.getHours(),
    minutes1 = '' + d1.getMinutes(),
    seconds1 = '' + d1.getSeconds();

  if ( day1.length < 2 ) day1 = '0' + day1;
  if ( hour1.length < 2 ) hour1 = '0' + hour1;
  if ( minutes1.length < 2 ) minutes1 = '0' + minutes1;
  if ( seconds1.length < 2 ) seconds1 = '0' + seconds1;

  var fechaNotificacion = Date.UTC( year1, month1, day1, hour1, minutes1, seconds1 );

  var d = new Date();
  var fechaActual = Date.UTC( d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() );

  var dif = fechaActual - fechaNotificacion;

  var Horas = Math.floor( dif / ( 1000 * 60 * 60 ) );
  if ( Horas == 0 ) {
    var minutos = Math.floor( dif / ( 1000 * 60 ) );
    if ( minutos > 1 )
      return 'hace ' + minutos + ' minutos';
    else
      return 'hace 1 minuto';
  }
  else if ( Horas < 24 ) {
    return 'hace ' + Horas + ' horas';
  }
  else {
    return day1 + ' de ' + months[ month1 ] + ' a las ' + hour1 + ':' + minutes1;
  }
}

function actualizarNotificaciones() {
  $( '#notificacinesList' ).html( '' );
  $( '#totalNotificaciones' ).html( '' );
  $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
  totalNotificaciones = [];
  totalNotificaciones = totalNotificaciones.concat( solicitudAmistad );
  totalNotificaciones = totalNotificaciones.concat( solicitudAmistadAceptada );
  totalNotificaciones = totalNotificaciones.concat( solicitudesAceptadas );
  totalNotificaciones = totalNotificaciones.sort( ordenarPorFecha );
  if ( totalNotificaciones.length > 0 ) {
    $( '#totalNotificaciones' ).removeClass( 'hidden invisible' );
    var total = 0;
    totalNotificaciones.forEach( function ( notificacion ) {
      if ( notificacion.toString() != "undefined" ) {
        if ( notificacion.visto == 1 ) {
          $( '#notificacinesList' ).append( '<li class="media" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
        }
        else {
          $( '#totalNotificaciones' ).html( ++total );
          $( '#notificacinesList' ).append( '<li class="media" style="background-color:#DDD" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
        }
      }
    } );
  }
}

function ordenarPorFecha( a, b ) {
  var c = new Date( a.time );
  var d = new Date( b.time );
  return d - c;
}

var totalNotificaciones = [],
  solicitudAmistad = [],
  solicitudAmistadAceptada = [],
  solicitudesAceptadas = [];


function socketManejadores() {

  function borrarNotificaciones() {
    $( '#totalNotificaciones' ).html( '' );
    $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
    socket.emit( 'verNotificaciones' );
    totalNotificaciones.forEach( function ( notificacion ) {
      notificacion.visto = 1;
    } );
  }

  socket.on( 'solicitudAmistad', function ( data ) {
    solicitudAmistad = [];
    data.forEach( function ( record ) {
      if ( record.paciente ) {
        date = formattedDate( record.inicio );
        solicitudAmistad.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + record.paciente_id + ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>'
        } );
      }
    } );
    actualizarNotificaciones();
  } );

  socket.on( 'solicitudAmistadAceptada', function ( data ) {
    solicitudAmistadAceptada = [];
    data.forEach( function ( record ) {
      if ( record.paciente ) {
        date = formattedDate( record.inicio );
        solicitudAmistadAceptada.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>'
        } );
      }
    } );
    actualizarNotificaciones();
  } );

  socket.on( 'solicitudesAceptadas', function ( data ) {
    solicitudesAceptadas = [];
    data.forEach( function ( record ) {
      if ( record.paciente ) {
        date = formattedDate( record.inicio );
        solicitudesAceptadas.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>'
        } );
      }
    } );
    actualizarNotificaciones();
  } );

  socket.on( 'verNotificaciones', function ( data ) {
    $( '#totalNotificaciones' ).html( '' );
    $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
    totalNotificaciones.forEach( function ( notificacion ) {
      notificacion.visto = 1;
    } );
    setTimeout( function () {
      actualizarNotificaciones();
    }, 3000 );

  } );
}
