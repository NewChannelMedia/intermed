var socket = io();
var notificaciones = [];
var notificacionesScroll = [];
var notificacionesTotal = [];
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
  solicitudesRechazadas = [];


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
          content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu colega en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(0,' + record.medico_id + ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ','+ record.id +')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
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
      data.forEach( function ( record ){
        date = formattedDate( record.inicio );
        var content = '';
        content += '<div class="media-left">';
          content += '<a href="#" onclick="miRecomendacion(\'#meRecomendaron\',\''+data+'\');" class="recomendando">';
            content += '<img class="media-object" src="" style="width: 50px;">';
            content += '</div>';
            content += '<div class="media-body">Estas son tus recomendaciones enviadas por "X" doctor';
          content += '</a>';
          content += '<br />';
          content += '<div class="text-left" style="margin-top:-25px;">';
            content += '<span style="font-size: 60%" class="glyphicon glyphicon-time" >'+date+'</span>';
          content += '</div>';
        content += '</div>';
        //console.log("RECORD: "+JSON.stringify(record));
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
})


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
