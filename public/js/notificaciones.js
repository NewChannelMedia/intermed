var socket = io();
var notificaciones = [];
var notificacionesScroll = [];
var notificacionesTotal = [];
var doctorRecomendado = [];
var pedirRecomendacion = [];
var tuRecomendacion = [];

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
            if ( record.interno) {
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
                tipoNotificacion_id: record.id,
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
  if (!$('#notificationIcon').attr('aria-expanded')) {
    $( '#notificacinesList' ).html( '' );
    $( '#totalNotificaciones' ).html( '' );
    $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
    totalNotificaciones = [];
    totalNotificaciones = totalNotificaciones.concat( solicitudAmistad );
    totalNotificaciones = totalNotificaciones.concat( solicitudAmistadAceptada );
    totalNotificaciones = totalNotificaciones.concat( solicitudesAceptadas );
    totalNotificaciones = totalNotificaciones.concat( agregadoMedicoFavorito );
    totalNotificaciones = totalNotificaciones.concat( solicitudesRechazadas );
    totalNotificaciones = totalNotificaciones.concat( medicoRecomendado );
    totalNotificaciones = totalNotificaciones.concat( doctorRecomendado );
    totalNotificaciones = totalNotificaciones.concat( pedirRecomendacion );
    totalNotificaciones = totalNotificaciones.concat( tuRecomendacion );
    totalNotificaciones = totalNotificaciones.sort( ordenarPorFecha );
    if ( totalNotificaciones.length > 0 ) {
      $( '#totalNotificaciones' ).removeClass( 'hidden invisible' );
      var total = 0;
      //notificacionesScroll = [];
      totalNotificaciones.forEach( function ( notificacion ) {
        if (notificacionesScroll.indexOf(notificacion.id) === -1){
          notificacionesScroll.push(notificacion.id);
        }
        if ( notificacion.toString() != "undefined" ) {
          if ( notificacion.visto === 1 ) {
            $( '#notificacinesList' ).append( '<li class="media" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
          }
          else {
            $( '#totalNotificaciones' ).html( ++total );
            $( '#notificacinesList' ).append( '<li class="media" style="background-color:#DDD" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
          }
        }
      } );
      $('#notificacinesList').append('<a class="_next" href="#"></a>');
      var scroll = $('#notificacinesList').iscroll({
        onBeginRequest:function(request){
          $( "#notificacinesList" ).find( "a._next" ).remove();
          $.ajax( {
            url: '/notificaciones/scroll',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: {'id': notificacionesScroll},
            success: function ( data ) {
              $('#notificacinesList').find('.loader').remove();
              if (data.length>0){
                data.forEach(function(record){
                  if (notificacionesScroll.indexOf(record.id) === -1){
                    notificacionesScroll.push(record.id);
                    var date = formattedDate( record.inicio );
                    var contenido = '';
                    switch(record.tipoNotificacion_id) {
                        case 1:
                            if (record.paciente) contenido = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + record.paciente_id + ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
                            break;
                        case 2:
                            if (record.paciente) contenido = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                            break;
                        case 3:
                            if (record.paciente) contenido = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                            break;
                        case 4:
                            console.log('[ '+ record.id +' ] Solicitud amistad');
                            break;
                        case 5:
                            console.log('[ '+ record.id +' ] Solicitud de amistad aceptada');
                            break;
                        case 6:
                            console.log('[ '+ record.id +' ] Solicitud aceptada');
                            break;
                        case 7:
                            console.log('[ '+ record.id +' ] Agregado medico favorito');
                            break;
                        case 8:
                        case 9:
                            if (record.paciente){
                              contenido = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                            } else if (record.medico){
                              contenido = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                            }
                            break;
                        case 12:
                              if (record.paciente){
                                contenido = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                              } else if (record.medico){
                                contenido = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
                              }
                              break;
                        case 13:
                                if (record.paciente){
                                  contenido = '<div class="media-left"><a href="/perfil/'+record.paciente.Usuario.usuarioUrl+'"><img class="media-object" src="'+record.paciente.Usuario.urlFotoPerfil+'" style="width: 50px;"></div><div class="media-body">'+record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM +' Te ha recomendado a otro paciente</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span></div></div>';
                                } else if (record.medico){
                                  contenido = '<div class="media-left"><a href="/perfil/'+record.paciente.Usuario.usuarioUrl+'"><img class="media-object" src="'+record.paciente.Usuario.urlFotoPerfil+'" style="width: 50px;"></div><div class="media-body">'+record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM +' Te ha recomendado a otro paciente</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span></div></div>';
                                }
                                break;
                        case 14:
                          '<div class="media-left">'+'<a href="#" data-toggle="modal" data-target="#recomendandoAndo" class="recomendando">'+'<img class="media-object" src="existe" style="width: 50px;">'+'</div>'+'<div class="media-body">existeNo Recomendo tu perfil a otro paciente'+ '</a>'+'<br />'+'<div class="text-left" style="margin-top:-25px;">'+'<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>'+'</div>'+'</div>';
                          break;
                        case 15:
                          '<div class="media-left">'+'<a href="#" onclick="" class="recomendando">'+'<img class="media-object" src="" style="width: 50px;">'+'</div>'+'<div class="media-body">Estas son tus recomendaciones enviadas por "X" doctor'+'</a>'+'<br />'+'<div class="text-left" style="margin-top:-25px;">'+'<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>'+'</div>'+'</div>';
                          break;
                    }
                    if (contenido != '')
                      $( '#notificacinesList' ).append( '<li class="media" id="li' + record.id + '">' + contenido + '</li>' );
                  }
                });
                $('#notificacinesList').append('<a class="_next" href="#"></a>');
              }
            }
          })
        }
      });
    }
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
  solicitudesAceptadas = [],
  agregadoMedicoFavorito = [],
  solicitudesRechazadas = [],
  medicoRecomendado = [];

var InboxListLoaded = [];


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
        date = formattedDate( record.inicio );
        if (record.paciente){
          content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + record.paciente_id + ',0,' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ',' + record.id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
        } else if (record.medico){
          content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu colega en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(0,' + record.medico_id + ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(true, ' + record.medico_id + ','+ record.id +')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
        }
        if (content){
          solicitudAmistad.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          } );
        }
      } );
      actualizarNotificaciones();
    } );

    socket.on( 'solicitudAmistadAceptada', function ( data ) {
      solicitudAmistadAceptada = [];
      data.forEach( function ( record ) {
      date = formattedDate( record.inicio );
      var content = '';
      if (record.paciente){
        content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      } else if (record.medico){
        content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' ahora es tu colega en Intermed</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      }
      if (content){
        solicitudAmistadAceptada.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: content
        } );
      }
      } );
      actualizarNotificaciones();
    } );

    socket.on( 'solicitudesAceptadas', function ( data ) {
      solicitudesAceptadas = [];
      data.forEach( function ( record ) {
        date = formattedDate( record.inicio );
        var content = '';
        if (record.paciente){
          content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
        } else if (record.medico){
          content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
        }
        if (content){
          solicitudesAceptadas.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          } );
        }
      } );
      actualizarNotificaciones();
    });

    socket.on( 'solicitudRechazada', function ( data ) {
      solicitudesRechazadas = [];
      data.forEach( function ( record ) {
        date = formattedDate( record.inicio );
        var content = '';
        if (record.paciente){
          content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
        } else if (record.medico){
          content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
        }
        if (content){
          solicitudesRechazadas.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          } );
        }
      } );
      actualizarNotificaciones();
    });

    socket.on('agregadoMedicoFavorito', function ( data ) {
      agregadoMedicoFavorito = [];
      data.forEach( function ( record ) {
        if ( record.paciente ) {
          date = formattedDate( record.inicio );
          agregadoMedicoFavorito.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">El paciente ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' te agregó a sus médicos favoritos</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>'
          } );
        }
      } );
      actualizarNotificaciones();
    });

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
    socket.on( 'medicoRecomendado', function ( data ) {
      medicoRecomendado = [];
      data.forEach( function ( record ) {
        date = formattedDate( record.inicio );
        var content = '';
        if( record.medico && record.paciente ){
          var medicoUrl = record.medico.Usuario.usuarioUrl;
          var fotoPaciente = record.paciente.Usuario.urlFotoPerfil;
          var nombreCompleto = record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM ;
          var nombreDoctor = record.medico.Usuario.DatosGenerale.nombre+' '+record.medico.Usuario.DatosGenerale.apellidoP+' '+record.medico.Usuario.DatosGenerale.ApellidoM;
          content += '<div class="media-left">';
            content += '<a href="/perfil/'+medicoUrl+'">';
              content += '<img class="media-object" src="'+fotoPaciente+'" style="width: 50px;">';
              content += '</div>';
              content += '<div class="media-body">'+nombreCompleto+' Te ha recomendado al siguiente Dr.'+nombreDoctor;
            content += '</a>';
            content += '<br />';
            content += '<div class="text-left" style="margin-top:-25px;">';
              content += '<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>';
            content += '</div>';
          content += '</div>';
        }
        if (content){
          medicoRecomendado.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          } );
        }
      } );
      actualizarNotificaciones();
    });
    socket.on( 'doctorRecomendado', function( data ){
      doctorRecomendado = [];
      data.forEach( function ( record ) {
        date = formattedDate( record.inicio );
        var content = '';
        if( record.paciente && record.medico ){
          var pacienteUrl = record.paciente.Usuario.usuarioUrl;
          var fotoPaciente = record.paciente.Usuario.urlFotoPerfil;
          var nombreCompleto = record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM ;
          var nombreDoctor = record.medico.Usuario.DatosGenerale.nombre+' '+record.medico.Usuario.DatosGenerale.apellidoP+' '+record.medico.Usuario.DatosGenerale.ApellidoM;
          content += '<div class="media-left">';
            content += '<a href="/perfil/'+pacienteUrl+'">';
              content += '<img class="media-object" src="'+fotoPaciente+'" style="width: 50px;">';
              content += '</div>';
              content += '<div class="media-body">'+nombreCompleto+' Recomendo tu perfil a otro paciente';
            content += '</a>';
            content += '<br />';
            content += '<div class="text-left" style="margin-top:-25px;">';
              content += '<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>';
            content += '</div>';
          content += '</div>';
        }
        if (content){
          doctorRecomendado.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          } );
        }
      } );
      actualizarNotificaciones();
    });

    socket.on( 'inbox', function ( data ) {
      //socket.emit( 'verNotificacionesInbox' );
      //$('#totalInbox').html('');
      var total = data.length;
      if (total>0){
        $('#totalInbox').html(total);
      } else {
        $('#totalInbox').html('');
      }

    } );

    socket.on('cargarInboxVistaPrevia', function (data){
      $('li.loadInboxList').remove();
      data.forEach(function(record){
        InboxListLoaded.push(record.usuario.id);
        var visto = '';
        if (record.visto === 0){
          visto = ' style="background-color:#EEEEEE" ';
        }
        $('#notificacionesInboxList').append('<li class="media" '+ visto +'><div class="media-left"><a href="' + base_url + 'inbox/'+ record.usuario.usuarioUrl +'"><img class="media-object" src="'+record.usuario.urlFotoPerfil+'" style="width: 50px;"></a></div><div class="media-body"><a href="' + base_url + 'inbox/'+ record.usuario.usuarioUrl +'">'+ record.usuario.DatosGenerale.nombre + ' ' + record.usuario.DatosGenerale.apellidoP + ' ' + record.usuario.DatosGenerale.apellidoM +'</a><br><div class="text-left" style="margin-top:-25px;">'+ record.mensaje +'</div><br/><div class="text-right float-right" style="margin-top:-25px; margin-right:5px;font-size: 60%" > '+ formattedDate(record.fecha) +' <span style="font-size: 60%" class="glyphicon glyphicon-time"></span></div></div></li>');
      });
      if (data.length > 0){
        loadInboxList = true;
        $('#notificacionesInboxList').append('<li class="loadInboxList" style="min-height:0px; margin:0px;padding:0px;" class="btn btn-block text-center"></li>');
      }
      setTimeout(function(){
        socket.emit('verNotificacionesInbox');
        setTimeout(function(){
          socket.emit('inbox');
        },200);
      },1000);
    });

    socket.on('nuevoInbox', function(result){
      if ($('tr#'+result.de).length>0){

        //Actualizar fecha de mensaje
        var tr = $('tr#'+result.de);
        var fecha = getDateTime(true);
        tr.find('input.time').prop('value',fecha);
        var nuevafecha = formattedDate(fecha);
        tr.find('span.timeFormated').html(nuevafecha + ' ');
        //

        tr.prependTo('#InboxListaContactos');
        var td = tr.find('td');
        if (!td.hasClass('seleccionado')){
          td.addClass('noleido');
        }
      } else {
        socket.emit('crearConversacion',result.de);
      }
      if ($('td.seleccionado').parent().prop('id') == result.de){
        ultimaFecha = $( "#chat .datetime>span" ).last();
        if (ultimaFecha.html() != formatfecha(new Date().toLocaleString())){
          $('#chat').append('<li class="clearfix text-center datetime"><span>'+formatfecha(new Date().toLocaleString())+'</span></li>');
        }
        var hora = formathora(new Date().toLocaleString());
        var ultimoMsg = $( "#chat li" ).last();
        if (!ultimoMsg.hasClass('left')){
          $('#chat').append(mensajeIzquierda());
          ultimoMsg = $( "#chat li" ).last()
        }
        ultimoMsg.find('.contenidoMsg').append('<p class="pull-left text-left">' +  renderHTML(result.mensaje) + '</p>');
        ultimoMsg.find('.horaMsg').html(hora);

        if (document.hasFocus()){
          socket.emit('conversacionLeida', result.de);
        }

        focusUltimo();
      }
      socket.emit('inbox');
    });

    socket.on('crearConversacion', function(usuario){
      var fecha = getDateTime(true);
      $('#InboxListaContactos').prepend('<tr id="'+ usuario.id +'" ><td class="nombreContacto noleido" onclick="cargarInbox(this)"><img src="'+ usuario.urlFotoPerfil +'" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> '+ usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP + ' ' + usuario.DatosGenerale.apellidoM +'</span><br/><input type="hidden" class="time" value="' + fecha + '"><small class="pull-right text-right" style="font-size:70%"><span class="timeFormated">' + formattedDate(fecha)  + ' </span><span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>');
    });

    socket.on('obtenerUsuarioId', function (id){
      if ($('#InboxListaContactos').find('tr#'+id).length > 0){
        $('.nombreContacto').removeClass('seleccionado');
        $('#chat').html('');
        $('#InboxContact').html($('#InboxListaContactos').find('tr#'+id).find('span.name').html());
        $('#InboxListaContactos').find('tr#'+id).find('td').removeClass('noleido');
        $('#InboxListaContactos').find('tr#'+id).find('td').addClass('seleccionado');
        $('#InboxMsg').css('background-color','#FFF');
        $('#inboxInputText').prop('disabled',false);
        $('#inboxBtnEnviar').prop('disabled',false);
        cargarMensajes(id);
      }
    });

    socket.on('inboxEnviado', function(result){
      if (result.success){
        var td = $('td.seleccionado');
        td.parent().prependTo('#InboxListaContactos');

        //Actualizar fecha de mensaje
        var fecha = getDateTime(true);
        td.find('input.time').prop('value',fecha);
        var nuevafecha = formattedDate(fecha);
        td.find('span.timeFormated').html(nuevafecha + ' ');
        //
        var ultimoMsg = $( "#chat li" ).last()
        mensaje = $('#inboxInputText').val();
        mensaje = renderHTML(mensaje);
        $('#inboxInputText').val('');
        //Barra con fecha (dia-mes-año)
        ultimaFecha = $( "#chat .datetime>span" ).last();
        if (ultimaFecha.html() != formatfecha(new Date().toLocaleString())){
          $('#chat').append('<li class="clearfix text-center datetime"><span>'+formatfecha(new Date().toLocaleString())+'</span></li>');
        }
        //
        var hora = formathora(new Date().toLocaleString());
        if (!ultimoMsg.hasClass('right')){
          $('#chat').append(mensajeDerecha());
          ultimoMsg = $( "#chat li" ).last();
        }
        ultimoMsg.find('.contenidoMsg').append('<p class="pull-right text-right">' +  mensaje + '</p>');
        ultimoMsg.find('.horaMsg').html(hora);
      } else {
        $('#chat').append('<li class="clearfix text-center error"><span><span class="glyphicon glyphicon-info-sign" style="font-size:80%"></span>imposible enviar el mensaje, por favor revisa tu conexion</span></li>');
        setTimeout(function(){
          eliminarError();
        },3000);
      }
      focusUltimo();
    });

    socket.on('conversacionLeida',function(){
        setTimeout(function(){
          socket.emit('inbox');
        },1000);
    });

    socket.on('pedirRecomendacion',function(data){
      pedirRecomendacion = [];
      data.forEach( function ( record ) {
        date = formattedDate( record.inicio );
        var content = '';
        if( record.paciente ){
          var imagen = record.paciente.Usuario.urlFotoPerfil;
          var nombre = record.paciente.Usuario.DatosGenerale.nombre+' '+record.paciente.Usuario.DatosGenerale.apellidoP+' '+record.paciente.Usuario.DatosGenerale.apellidoM;
          content += '<div class="media-left">';
            content += '<a href="#" onclick="presionando(\'#recomendandoAndo\');" class="recomendando">';
              content += '<img class="media-object" src="'+imagen+'" style="width: 50px;">';
              content += '</div>';
              content += '<div class="media-body">'+nombre+' te ha pedido las siguientes recomendaciones';
            content += '</a>';
            content += '<br />';
            content += '<div class="text-left" style="margin-top:-25px;">';
              content += '<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>';
            content += '</div>';
          content += '</div>';
        }
        console.log("RECORD "+record);
        if (content){
          pedirRecomendacion.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          });
        }
      });
      actualizarNotificaciones();
    });
    socket.on('tuRecomendacion',function(data){
      tuRecomendacion = [];
      ides = '';
      var i = 0;
      data.forEach( function ( record ){
        date = formattedDate( record.inicio );
        var content = '';
        var usuario_id = record.usuario_id
        for( var i in record.medicos ){
          ides += "|"+record.medicos[ i ].id;
        }
        content += '<div class="media-left">';
          content += '<a href="#" onclick="miRecomendacion(\''+ides+'\');" class="recomendando">';
            content += '<img class="media-object" src="" style="width: 50px;">';
            content += '</div>';
            content += '<div class="media-body">Estas son tus recomendaciones';
          content += '</a>';
          content += '<br />';
          content += '<div class="text-left" style="margin-top:-25px;">';
            content += '<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>';
          content += '</div>';
        content += '</div>';
        if (content){
          tuRecomendacion.unshift( {
            id: record.id,
            time: record.inicio,
            visto: record.visto,
            content: content
          });
        }
      });
      actualizarNotificaciones();
    });
}

$(document).ready(function(){
    $('#notificaciones').on('hidden.bs.dropdown', function(){
      $('#notificationIcon').attr('aria-expanded','');
      notificacionesScroll = [];
      actualizarNotificaciones();
    });

    if (window.location.href.indexOf("/inbox") > 0){
      socket.emit('conectarSocket');
    }
});


function verTodasNotificaciones(){
  var respuesta = false;
  $('#notifList').find('a._next').remove();
  $.ajax( {
    async: false,
    url: '/notificaciones/cargar',
    type: 'POST',
    dataType: "json",
    data: {'id': notificacionesTotal, 'limit': 8},
    success: function ( data ) {
      if (data.result == "error"){
        window.location="/";
      } else {
        if (data.length > 0){
          data.forEach(function(record){
              if (notificacionesTotal.indexOf(record.id) === -1){
                notificacionesTotal.push(record.id);
              }
              var date = formattedDate( record.inicio );
              var contenido = '';
              switch(record.tipoNotificacion_id) {
                  case 1:
                      if (record.paciente) contenido = '<a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 2:
                      if (record.paciente) contenido = '<a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a></div><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 3:
                      if (record.paciente) contenido = '<a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">Aceptaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 4:
                      if (record.medico) contenido = '<a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' quiere ser tu colega en Intermed</span></div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 5:
                      if (record.medico) contenido = '<a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 6:
                      if (record.medico) contenido = '<a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">Aceptaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 7:
                      if (record.paciente) contenido = '<a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' Te agregó a sus médicos favoritos</a></div><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      break;
                  case 8:
                  case 9:
                      if (record.paciente){
                        contenido = '<a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">Rechazaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      } else if (record.medico){
                        contenido = '<a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="col-lg-8 col-md-8 col-sm-10 col-xs-10"> Rechazaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</div></a><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-right"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div>';
                      }
                      break;
                  case 12:
                      if (record.paciente){
                        contenido = '<a href="/perfil/'+
                          record.medico.Usuario.usuarioUrl+
                          '"><img class="media-object" src="'+
                          record.paciente.Usuario.urlFotoPerfil+
                          '" style="width: 50px;"></div><div class="media-body">'+
                          record.paciente.Usuario.DatosGenerale.nombre+' '+
                          record.paciente.Usuario.DatosGenerale.apellidoP+' '+
                          record.paciente.Usuario.DatosGenerale.apellidoM+
                          ' Te ha recomendado al siguiente Dr.'+
                          record.medico.Usuario.DatosGenerale.nombre+' '+
                          record.medico.Usuario.DatosGenerale.apellidoP+' '+
                          record.medico.Usuario.DatosGenerale.ApellidoM+
                          '</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+
                          date+'</span></div>';
                      } else if (record.medico){
                        contenido = '<a href="/perfil/'+
                          record.medico.Usuario.usuarioUrl+
                          '"><img class="media-object" src="'+
                          record.paciente.Usuario.urlFotoPerfil+
                          '" style="width: 50px;"></div><div class="media-body">'+
                          record.paciente.Usuario.DatosGenerale.nombre+' '+
                          record.paciente.Usuario.DatosGenerale.apellidoP+' '+
                          record.paciente.Usuario.DatosGenerale.apellidoM+
                          ' Te ha recomendado al siguiente Dr.'+
                          record.medico.Usuario.DatosGenerale.nombre+' '+
                          record.medico.Usuario.DatosGenerale.apellidoP+' '+
                          record.medico.Usuario.DatosGenerale.ApellidoM+
                          '</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+
                          date+'</span></div>';
                      }
                      break;
                  case 13:
                      if (record.paciente){
                        contenido = '<a href="/perfil/'+record.paciente.Usuario.usuarioUrl+'"><img class="media-object" src="'+record.paciente.Usuario.urlFotoPerfil+'" style="width: 50px;"></div><div class="media-body">'+record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM +' Te ha recomendado a otro paciente</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span></div>';
                      } else if (record.medico){
                        contenido = '<a href="/perfil/'+record.paciente.Usuario.usuarioUrl+'"><img class="media-object" src="'+record.paciente.Usuario.urlFotoPerfil+'" style="width: 50px;"></div><div class="media-body">'+record.paciente.Usuario.DatosGenerale.nombre + ' ' +record.paciente.Usuario.DatosGenerale.apellidoP + ' ' +record.paciente.Usuario.DatosGenerale.apellidoM +' Te ha recomendado a otro paciente</a><br /><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span></div>';
                      }
                      break;
                  case 14:
                    '<div class="media-left">'+'<a href="#" data-toggle="modal" data-target="#recomendandoAndo" class="recomendando">'+'<img class="media-object" src="existe" style="width: 50px;">'+'</div>'+'<div class="media-body">existeNo Recomendo tu perfil a otro paciente'+ '</a>'+'<br />'+'<div class="text-left" style="margin-top:-25px;">'+'<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>'+'</div>'+'</div>';
                    break;
                  case 15:
                    '<div class="media-left">'+'<a href="#" onclick="" class="recomendando">'+'<img class="media-object" src="" style="width: 50px;">'+'</div>'+'<div class="media-body">Estas son tus recomendaciones enviadas por "X" doctor'+'</a>'+'<br />'+'<div class="text-left" style="margin-top:-25px;">'+'<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>'+'</div>'+'</div>';
                    break;
              }
              if (contenido != ""){
                $( '#notifListTable' ).append('<tr><td>' + contenido + '</td></tr>');
              }
          });
          respuesta=  true;
          $('#notifList').append('<a class="_next" href="#"></a>');
        }
      }
    },
    error: function (err){
      console.log('ERROR: ' + JSON.stringify(err));
    }
  });
  $('#notifList').find('div.loader').remove();
  return respuesta;
}

function cargarListaInbox(){
  $('#notificacionesInboxList').html('');
  InboxListLoaded = [];
  socket.emit('cargarInboxVistaPrevia');
}

var loadInboxList = true;
function cargarInboxListCondicional(){
  var scrollBottom = $('#notificacionesInboxList').height() - $('#notificacionesInboxList').parent().height() - $('#notificacionesInboxList').scrollTop();
  if (scrollBottom <5 && $('li.loadInboxList').length>0 && loadInboxList){
    $('li.loadInboxList').html('Cargando...');
    loadInboxList = false;
    setTimeout(function(){
      $('li.loadInboxList').html('');
        socket.emit('cargarInboxVistaPrevia',{notIn: InboxListLoaded});
      },2000);
    }
}

function getDateTime( format ) {
  var date = new Date();
  var hour = date.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;
  var min = date.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;
  var sec = date.getSeconds();
  sec = ( sec < 10 ? "0" : "" ) + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = ( month < 10 ? "0" : "" ) + month;
  var day = date.getDate();
  day = ( day < 10 ? "0" : "" ) + day;
  if ( format ) {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  }
  else {
    return year + month + day + hour + min + sec;
  }
}



$(document).ready(function(){
  var chat = document.getElementById("notificacionesInboxList");
  if (chat.addEventListener) {
  	// IE9, Chrome, Safari, Opera
  	chat.addEventListener("mousewheel", cargarInboxListCondicional, false);
  	// Firefox
  	chat.addEventListener("DOMMouseScroll", cargarInboxListCondicional, false);
  }
  // IE 6/7/8
  else chat.attachEvent("onmousewheel", cargarInboxListCondicional);
});

if (window.location.href.indexOf("/notificaciones/configuracion") > 0){

    $(document).ready(function(){

      if (window.location.href.indexOf("/notificaciones/configuracion") > 0){
        //Manejar notificaciones
        $.ajax( {
          url: '/notificaciones',
          type: 'POST',
          dataType: "json",
          cache: false,
          success: function ( data ) {
            if ( data ) {
              /*
              notificaciones.forEach( function ( notificacion ) {
                clearInterval( notificacion.id );
              } );
              notificaciones = [];
              */
              if ( Object.prototype.toString.call( data ) === '[object Array]' ) {
                if ( data ) {
                  data.forEach( function ( record ) {
                    var internoChecked = '';
                    var pushChecked = '';
                    var mailChecked = '';
                    if (record.interno == 1){
                      internoChecked = ' checked ';
                    }
                    if (record.push == 1){
                      pushChecked = ' checked ';
                    }
                    if (record.mail == 1){
                      mailChecked = ' checked ';
                    }
                    var descripcion = '';
                    if (record.descripcion && record.descripcion != ''){
                      descripcion = ' <a data-toggle="popover" title="'+record.nombre+'" data-content="'+ record.descripcion+'"><span class="glyphicon glyphicon-question-sign"></span></a>';
                    }
                    $('#configNot').append('<tr id="'+ record.id +'"><td>'+record.nombre+ descripcion + '</td><td class="text-center"><input type="checkbox" class="interno" '+ internoChecked +'></td><td class="text-center"><input type="checkbox" class="push"  ' + pushChecked + '></td><td class="text-center"><input type="checkbox"  class="mail" '+ mailChecked +'></td></tr>');

                  if (record.configurable == 0){
                      $('tr#'+record.id).find('input[type="checkbox"]').each(function( index ) {
                        $( this ).attr('disabled',true);
                      });

                    }
                  } );
                  $('input[type="checkbox"]').click(function(){
                      var interno = 0, push = 0, mail = 0 ;
                      var id = $(this).parent().parent().prop('id');
                      if ($(this).parent().parent().find('input.interno').is(":checked")){
                        interno = 1;
                      }
                      if ($(this).parent().parent().find('input.push').is(":checked")){
                        push = 1;
                      }
                      if ($(this).parent().parent().find('input.mail').is(":checked")){
                        mail = 1;
                      }
                      modificarConfiguracion(id,interno,push,mail);
                  });
                  $('[data-toggle="popover"]').popover()
                }
              }
            }
          },
          error: function ( jqXHR, textStatus, err ) {
            console.error( 'AJAX ERROR: ' + err );
          }
        } );
      }
    });

    function modificarConfiguracion(id, interno, push, mail){
      $.ajax( {
        url: '/notificaciones/configurarNotificacion',
        type: 'POST',
        dataType: "json",
        data: {tipoNotificacion_id: id, interno: interno , push: push, mail: mail},
        cache: false,
        success: function ( data ) {
          if (data.success){
            if (interno == 0){
              //Detener setinterval para la notificacion
              var pos = -1;
              notificaciones.forEach( function ( notificacion ) {
                if (notificacion.tipoNotificacion_id == id){
                  clearInterval( notificacion.id );
                  pos = notificaciones.indexOf(notificacion);
                }
              } );
              if (pos>=0){
                notificaciones.splice(pos,1);
              }
            }
          }
        },
        error: function ( jqXHR, textStatus, err ) {
          console.error( 'AJAX ERROR: ' + err );
        }
      });
    }
}
