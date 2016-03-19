var socket = io();

$( 'document' ).ready( function () {
  socket.emit( 'contarNuevasNotificaciones' );
  socket.emit( 'inbox' );
  var notificacionesInterval;
  clearInterval( notificacionesInterval );
  notificacionesInterval = setInterval( function () {
    try {
      socket.emit( 'contarNuevasNotificaciones' );
      socket.emit( 'inbox' );
    }
    catch ( err ) {
      console.log( 'No se puede conectar con el servidor' );
    }
  }, ( 10000 ) );
  socketManejadores();
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

function ordenarPorFecha( a, b ) {
  var c = new Date( a.time );
  var d = new Date( b.time );
  return d - c;
}

var notificacionesId = [];
var InboxListLoaded = [];


function socketManejadores() {

  socket.on( 'inbox', function ( total ) {
    if ( total > 0 ) {
      $( '#totalInbox' ).html( total );
    }
    else {
      $( '#totalInbox' ).html( '' );
    }
  } );

  socket.on( 'cargarInboxVistaPrevia', function ( data ) {
    $( 'li.loadInboxList' ).remove();
    data.forEach( function ( record ) {
      InboxListLoaded.push( record.usuario.id );
      var visto = '';
      if ( record.visto === 0 ) {
        visto = ' style="background-color:#EEEEEE" ';
      }
      $( '#notificacionesInboxList' ).append( '<li class="media" ' + visto + ' id="vistaPrev_'+record.usuario.id+'"><div class="media-left"><a href="' + base_url + 'inbox/' + record.usuario.usuarioUrl + '"><img class="media-object img-circle" src="' + record.usuario.urlFotoPerfil + '" style="width: 40px;height:40px"></a></div><div class="media-body"><a href="' + base_url + 'inbox/' + record.usuario.usuarioUrl + '" style="color:black">' + record.usuario.DatosGenerale.nombre + ' ' + record.usuario.DatosGenerale.apellidoP + ' ' + record.usuario.DatosGenerale.apellidoM + '</a><br><div class="text-left msg" style="margin-top:5px;">' + record.mensaje + '</div><br/><div class="text-right float-right" style="margin-top:-25px; margin-right:5px;font-size: 60%" ><span class="fecha">' + formattedDate( record.fecha ) + ' </span><span style="font-size: 60%" class="glyphicon glyphicon-time"></span></div></div></li>' );
    } );
    if ( data.length > 0 ) {
      loadInboxList = true;
      $( '#notificacionesInboxList' ).append( '<li class="loadInboxList" style="min-height:0px; margin:0px;padding:0px;" class="btn btn-block text-center"></li>' );
    }
    setTimeout( function () {
      socket.emit( 'verNotificacionesInbox' );
      setTimeout( function () {
        socket.emit( 'inbox' );
      }, 200 );
    }, 1000 );
  } );

  socket.on( 'nuevoInbox', function ( result ) {
    if ( $( 'tr#' + result.de ).length > 0 ) {

      //Actualizar fecha de mensaje
      var tr = $( 'tr#' + result.de );
      var fecha = getDateTime( true );
      tr.find( 'input.time' ).prop( 'value', fecha );
      var nuevafecha = formattedDate( fecha );
      tr.find( 'span.timeFormated' ).html( nuevafecha );
      //

      tr.prependTo( '#InboxListaContactos' );
      var td = tr.find( 'td' );
      if ( !td.hasClass( 'seleccionado' ) ) {
        td.addClass( 'noleido' );
      }
    }
    else {
      socket.emit( 'crearConversacion', result.de );
    }
    if ( $( 'td.seleccionado' ).parent().prop( 'id' ) == result.de ) {
      ultimaFecha = $( "#chat .datetime>span" ).last();
      if ( ultimaFecha.html() != formatfecha( new Date().toLocaleString() ) ) {
        $( '#chat' ).append( '<li class="clearfix text-center datetime"><span>' + formatfecha( new Date().toLocaleString() ) + '</span></li>' );
      }
      var hora = formathora( new Date().toLocaleString() );
      var ultimoMsg = $( "#chat li" ).last();
      if ( !ultimoMsg.hasClass( 'left' ) ) {
        $( '#chat' ).append( mensajeIzquierda() );
        ultimoMsg = $( "#chat li" ).last()
      }
      ultimoMsg.find( '.contenidoMsg' ).append( '<p class="pull-left text-left">' + renderHTML( result.mensaje ) + '</p>' );
      ultimoMsg.find( '.horaMsg' ).html( hora );

      if ( document.hasFocus() ) {
        socket.emit( 'conversacionLeida', result.de );
      }

      focusUltimo();
    }

    if ($('.notificationDropdown').is(':visible')){
      var li = $('#notificacionesInboxList li.media#vistaPrev_'+result.de).clone();
      if (li.length>0){
        $('#notificacionesInboxList li.media#vistaPrev_'+result.de).remove();
        li.css('background-color','#EEEEEE');
        li.find('div.msg').html(renderHTML(result.mensaje));
        li.find('span.fecha').html(formattedDate(getDateTime( true )));
        $('#notificacionesInboxList').prepend(li);
      } else {
        $.ajax( {
          url: '/usuarios/informacionUsuario',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: {usuario_id: result.de},
          success: function ( usuario ) {
            if (usuario){
              InboxListLoaded.push( usuario.id );
              visto = ' style="background-color:#EEEEEE" ';
              $( '#notificacionesInboxList' ).prepend( '<li class="media" ' + visto + ' id="vistaPrev_'+usuario.id+'"><div class="media-left"><a href="' + base_url + 'inbox/' + usuario.usuarioUrl + '"><img class="media-object img-circle" src="' + usuario.urlFotoPerfil + '" style="width: 40px;height:40px"></a></div><div class="media-body"><a href="' + base_url + 'inbox/' + usuario.usuarioUrl + '">' + usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP + ' ' + usuario.DatosGenerale.apellidoM + '</a><br><div class="text-left msg" style="margin-top:-25px;">' + renderHTML(result.mensaje) + '</div><br/><div class="text-right float-right" style="margin-top:-25px; margin-right:5px;font-size: 60%" ><span class="fecha">' + formattedDate(getDateTime( true )) + ' </span><span style="font-size: 60%" class="glyphicon glyphicon-time"></span></div></div></li>' );
            }
          },
          error: function (err){
            console.log('ERROR: ' + JSON.stringify(err));
          }
        });
      }
    }
    socket.emit( 'inbox' );
  } );

  socket.on( 'crearConversacion', function ( usuario , append) {
    var id= usuario.id;
    var fecha = getDateTime( true );
    $( '#InboxListaContactos' ).prepend( '<tr id="' + usuario.id + '" ><td class="nombreContacto noleido" onclick="cargarInbox(this)"><img src="' + usuario.urlFotoPerfil + '" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> ' + usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP + ' ' + usuario.DatosGenerale.apellidoM + '</span><br/><input type="hidden" class="time" value="' + fecha + '"><small class="pull-right text-right" style="font-size:70%"><span class="timeFormated">' + formattedDate( fecha ) + '</span> <span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>' );

      console.log('Append:'+append)
    if (append){
      $( '.nombreContacto' ).removeClass( 'seleccionado' );
      $( '#chat' ).html( '' );
      $( '#InboxContact' ).html( $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'span.name' ).html() );
      $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'td' ).removeClass( 'noleido' );
      $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'td' ).addClass( 'seleccionado' );
      $( '#InboxMsg' ).css( 'background-color', '#FFF' );
      $( '#inboxInputText' ).prop( 'disabled', false );
      $( '#inboxBtnEnviar' ).prop( 'disabled', false );
      cargarMensajes( id );
    }
  } );

  socket.on( 'obtenerUsuarioId', function ( id ) {
    if ( $( '#InboxListaContactos' ).find( 'tr#' + id ).length <= 0) {
      socket.emit( 'crearConversacion', id ,true);
    } else {
      $( '.nombreContacto' ).removeClass( 'seleccionado' );
      $( '#chat' ).html( '' );
      $( '#InboxContact' ).html( $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'span.name' ).html() );
      $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'td' ).removeClass( 'noleido' );
      $( '#InboxListaContactos' ).find( 'tr#' + id ).find( 'td' ).addClass( 'seleccionado' );
      $( '#InboxMsg' ).css( 'background-color', '#FFF' );
      $( '#inboxInputText' ).prop( 'disabled', false );
      $( '#inboxBtnEnviar' ).prop( 'disabled', false );
      cargarMensajes( id );
    }
  } );

  socket.on( 'inboxEnviado', function ( result ) {
    if ( result.success ) {
      var td = $( 'td.seleccionado' );
      td.parent().prependTo( '#InboxListaContactos' );

      //Actualizar fecha de mensaje
      var fecha = getDateTime( true );
      td.find( 'input.time' ).prop( 'value', fecha );
      var nuevafecha = formattedDate( fecha );
      td.find( 'span.timeFormated' ).html( nuevafecha + ' ' );
      //
      var ultimoMsg = $( "#chat li" ).last()
      mensaje = $( '#inboxInputText' ).val();
      mensaje = renderHTML( mensaje );
      $( '#inboxInputText' ).val( '' );
      //Barra con fecha (dia-mes-año)
      ultimaFecha = $( "#chat .datetime>span" ).last();
      if ( ultimaFecha.html() != formatfecha( new Date().toLocaleString() ) ) {
        $( '#chat' ).append( '<li class="clearfix text-center datetime"><span>' + formatfecha( new Date().toLocaleString() ) + '</span></li>' );
      }
      //
      var hora = formathora( new Date().toLocaleString() );
      if ( !ultimoMsg.hasClass( 'right' ) ) {
        $( '#chat' ).append( mensajeDerecha() );
        ultimoMsg = $( "#chat li" ).last();
      }
      ultimoMsg.find( '.contenidoMsg' ).append( '<p class="pull-right text-right">' + mensaje + '</p>' );
      ultimoMsg.find( '.horaMsg' ).html( hora );
    }
    else {
      $( '#chat' ).append( '<li class="clearfix text-center error"><span><span class="glyphicon glyphicon-info-sign" style="font-size:80%"></span>imposible enviar el mensaje, por favor revisa tu conexion</span></li>' );
      setTimeout( function () {
        eliminarError();
      }, 3000 );
    }
    focusUltimo();
  } );

  socket.on( 'conversacionLeida', function () {
    setTimeout( function () {
      socket.emit( 'inbox' );
    }, 1000 );
  } );

  socket.on( 'contarNuevasNotificaciones', function ( total ) {
    if ( total > 0 ) {
      $( '#totalNotificaciones' ).html( total );
      $( '#totalNotificaciones' ).removeClass( 'invisible hidden' );
      if ( $( '.notificationDropdown' ).is( ':visible' ) ) {
        socket.emit( 'traerNuevasNotificaciones' );
      }
    }
    else {
      $( '#totalNotificaciones' ).html( '' );
      $( '#totalNotificaciones' ).addClass( 'invisible hidden' );
    }
  } );

  socket.on( 'contarNuevosComentarios', function ( total ) {
    if ( total > 0 ) {
      $( '#totalComentarios' ).html( total );
      $( '#totalComentarios' ).removeClass( 'invisible hidden' );
    }
    else {
      $( '#totalComentarios' ).html( '' );
      $( '#totalComentarios' ).addClass( 'invisible hidden' );
    }
  } );

  socket.on( 'notificacionesEncontradas', function ( notificaciones ) {
    $( '#notificacinesList' ).html( '' );
    notificaciones.forEach( function ( record ) {
      notificacionesId.push( record.id );
      var contenido = formatearNotificacion( record );
      if ( contenido != '' ) {
        $( '#notificacinesList' ).append( contenido );
      }
    } );
    $( '#notificacinesList' ).append( '<a class="_next" href="#"></a>' );

    var scroll = $( '#notificacinesList' ).iscroll( {
      onBeginRequest: function ( request ) {
        $( "#notificacinesList" ).find( "a._next" ).remove();
        socket.emit( 'notificacionesScroll', notificacionesId, $( '.not-fecha' ).last().text() );
      }
    } );
    socket.emit( 'verNotificaciones' );
    setTimeout( function () {
      socket.emit( 'contarNuevasNotificaciones' );
    }, 300 );
  } );

  socket.on( 'notificacionesScroll', function ( notificaciones ) {
    notificaciones.forEach( function ( record ) {
      notificacionesId.push( record.id );
      var contenido = formatearNotificacion( record );
      if ( contenido != '' ) {
        $( '#notificacinesList' ).append( contenido );
      }
    } );
    if ( notificaciones.length > 0 ) {
      console.log('notificaciones scroll next');
      $( '#notificacinesList' ).append( '<a class="_next" href="#"></a>' );

      var scroll = $( '#notificacinesList' ).iscroll( {
        onBeginRequest: function ( request ) {
          $( "#notificacinesList" ).find( "a._next" ).remove();
          socket.emit( 'notificacionesScroll', notificacionesId, $( '.not-fecha' ).last().text() );
        }
      } );
    }
    socket.emit( 'verNotificaciones' );
    setTimeout( function () {
      socket.emit( 'contarNuevasNotificaciones' );
    }, 300 );
  } );

  socket.on( 'traerNuevasNotificaciones', function ( notificaciones ) {
    socket.emit( 'verNotificaciones' );
    socket.emit( 'contarNuevasNotificaciones' );
    notificaciones.forEach( function ( record ) {
      notificacionesId.push( record.id );
      var contenido = formatearNotificacion( record );
      if ( contenido != '' ) {
        $( '#notificacinesList' ).prepend( contenido );
      }
    } );
  } );

  socket.on('cargarNotificacionesList',function(notificaciones){
    notificaciones.forEach(function (record){
      var contenido = formatearNotificacion(record, 'div');
      $('#notifListTable').append('<tr><td>' + contenido + '</td></tr>');
      notificacionesList.push(record.id);
      fechaNotificacionList = record.inicio;
    });
    if (document.getElementById('notifListTable').offsetHeight<$(window).height()){
      if (notificaciones.length === limitNotificacionesList){
        socket.emit('cargarNotificacionesList',notificacionesList,limitNotificacionesList,fechaNotificacionList);
      }
    } else {
      if (notificaciones.length === limitNotificacionesList){
        $('#notifList').append('<a class="_next" href="#"></a>');
      }
      var scroll = $('#notifList').iscroll({
        onBeginRequest:function(request){
          socket.emit('cargarNotificacionesList',notificacionesList,limitNotificacionesList,fechaNotificacionList);
        }
      });
    }
  });
}

function formatearNotificacion( record , element) {
  var not = '';
  var tipo = '';
  if ( record.medico ) {
    tipo = 'medico';
  }
  else if ( record.paciente ) {
    tipo = 'paciente';
  } else if (record.secretaria){
    tipo = 'secretaria';
  }

  var style = 'style="width: 40px;height:40px"';
  if (!(element && element != "")){
    element = 'li';
  } else {
    style= 'style="width: 30px;height:30px"'
  }

  var visto = '';
  if ( record.visto == 0 ) {
    visto = '  style="background-color:#DDD" ';
  }

  //$('img').on('error', function() { $(this).attr("src", '/garage/profilepics/dpp.png')});

  var fecha = formattedDate( record.inicio );
  //if ( record[ tipo ] ) {
    not = '';
    var usuarioUrl = '';
    var fotoPerfil = '';
    var nombreCompleto = '';
    var usuario_id = '';

    if ( record[ tipo ] ) {
      var usuarioUrl = record[ tipo ].Usuario.usuarioUrl;
      var fotoPerfil = record[ tipo ].Usuario.urlFotoPerfil;
      var nombreCompleto = record[ tipo ].Usuario.DatosGenerale.nombre + ' ' + record[ tipo ].Usuario.DatosGenerale.apellidoP + ' ' + record[ tipo ].Usuario.DatosGenerale.apellidoM;
      if ( tipo == 'medico' ) {
        nombreCompleto = 'Dr. ' + nombreCompleto;
      }
      usuario_id = record[ tipo ].Usuario.id;
    }

    var mediaObjectFecha = '<div class="text-left" style="margin-top:-5px;"><span class="not-fecha hidden invisible">' + record.inicio.slice( 0, 19 ).replace( 'T', ' ' ) + '</span><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + fecha + '</span></div>';

    var mediaObjectImagen = '<img class="media-object img-circle" src="' + fotoPerfil + '" '+style+'>';
    var mediaObjectFotoPerfil = '<div class="media-left"><a href= "/' + usuarioUrl + '">'+mediaObjectImagen+'</a></div>';

    switch ( record.tipoNotificacion_id ) {
      /*PACIENTE*/
      case 1:
        //solicitudAmistad
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '"><span id="pre' + record.id + '"></span>' + nombreCompleto + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a>' + mediaObjectFecha + '</div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + usuario_id + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + usuario_id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button>';
        break;
      case 2:
        //solicitudAmistadAceptada
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">' + nombreCompleto + ' aceptó tu solicitud de amistad</a>' + mediaObjectFecha + '</div>';
        break;
      case 3:
        //solicitudesAceptadas
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">Aceptaste la solicitud de amistad de ' + nombreCompleto + '</a>' + mediaObjectFecha + '</div>';
        break;
      case 8:
        //solicitudRechazada
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">Rechazaste la solicitud de amistad de ' + nombreCompleto + '</a>' + mediaObjectFecha + '</div>';
        break;
      case 12:
        //medicoRecomendado
        content = '';
        if ( record.medico && record.paciente ) {
          var medicoUrl = record.medico.Usuario.usuarioUrl;
          var fotoPaciente = record.paciente.Usuario.urlFotoPerfil;
          var nombreCompleto = record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM;
          var nombreDoctor = record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.ApellidoM;
          content += '<div class="media-left">';
          content += '<a href="/' + medicoUrl + '">';
          content += mediaObjectImagen;
          content += '</div>';
          content += '<div class="media-body">' + nombreCompleto + ' Te ha recomendado al Dr.' + nombreDoctor;
          content += '</a>';
          content += '<br />';
          content += mediaObjectFecha
          content += '</div>';
        }
        not = content;
        break;
      case 15:
        //tuRecomendacion
        content = '';
        var ides = '';
        for ( var i in record.medicos ) {
          ides += "|" + record.medicos[ i ].id;
        }
        content += '<div class="media-left">';
        content += '<a href="#" onclick="miRecomendacion(\'' + ides + '\');cerrarNotModal()" class="recomendando">';
        content += mediaObjectImagen;
        content += '</a>';
        content += '</div>';
        content += '<div class="media-body">';
        content += '<a href="#" onclick="miRecomendacion(\'' + ides + '\');cerrarNotModal();" class="recomendando">';
        content += nombreCompleto + ' te recomendo unos médicos';
        content += '</a>';
        content += mediaObjectFecha
        content += '</div>';
        not = content;
        break;
        /*MEDICO*/
      case 4:
        //solicitudAmistad
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '"><span id="pre' + record.id + '"></span>' + nombreCompleto + ' <span id="post' + record.id + '">quiere ser tu colega en Intermed</span></a>' + mediaObjectFecha + '</div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + usuario_id+ ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(' + usuario_id + ',' + record.id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button>';
        break;
      case 5:
        //solicitudAmistadAceptada
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">' + nombreCompleto + ' ahora es tu colega en Intermed</a>' + mediaObjectFecha + '</div>';
        break;
      case 6:
        //solicitudesAceptadas
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">Aceptaste la solicitud de amistad de ' + nombreCompleto + '</a>' + mediaObjectFecha + '</div>';
        break;
      case 7:
        //agregadoMedicoFavorito
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">' + nombreCompleto + ' te agregó a sus médicos favoritos</a>' + mediaObjectFecha + '</div>';
        break;
      case 9:
        //solicitudRechazada
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">Rechazaste la solicitud de amistad de ' + nombreCompleto + '</a>' + mediaObjectFecha + '</div>';
        break;
      case 13:
        //doctorRecomendado
        not += mediaObjectFotoPerfil + '<div class="media-body"><a href= "/' + usuarioUrl + '">' + nombreCompleto + ' Recomendo tu perfil a otro paciente</a>' + mediaObjectFecha + '</div>';
        break;
      case 14:
        //pedirRecomendacion
        not += '<div class="media-left"><a href="#" onclick="presionando(\'#recomendandoAndo\');cerrarNotModal()" class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a href="#" onclick="presionando(\'#recomendandoAndo\');cerrarNotModal()" class="recomendando">' + nombreCompleto + ' te ha pedido las siguientes recomendaciones</a>' + mediaObjectFecha + '</div>';
        break;
      case 20:
          //paciente generando cita
          not += '<div class="media-left"><a href="#" onclick="presionando(\'#recomendandoAndo\');cerrarNotModal()" class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a href="#" onclick="presionando(\'#recomendandoAndo\');cerrarNotModal()" class="recomendando">' + nombreCompleto + ' Ha solicitado una cita</a>' + mediaObjectFecha + '</div>';
          break;
      case 21:
          //paciente calificación de cita
          not += '<div class="media-left"><a onclick="bootboxCalificarCita(\''+record.data+'\',\''+record.id+'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="bootboxCalificarCita(\''+record.data+'\',\''+record.id+'\')">Califica tu cita con el ' + nombreCompleto + '</a>' + mediaObjectFecha + '</div>';
          break;
      case 22:
          //medico cancelando cita
          not += '<div class="media-left"><a  onclick="detalleCancelacionMedico(\''+ record.data +'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a  onclick="detalleCancelacionMedico(\''+ record.data +'\')">El ' + nombreCompleto + ' ha cancelado una cita que tenias programada.</a>' + mediaObjectFecha + '</div>';
          break;
      case 23:
          //paciente ha rechazado cambio de cita
          not += '<div class="media-left"><a href="#" >'+mediaObjectImagen+'</a></div><div class="media-body"><a href="#" >' + nombreCompleto + ' Ha rechazado la cita</a>' + mediaObjectFecha + '</div>';
          break;
      case 24:
          //paciente cancelando cita
          not += '<div class="media-left" ><a onclick="detalleCancelacionPaciente(\''+record.data+'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="detalleCancelacionPaciente(\''+record.data+'\')">El paciente ' + nombreCompleto + ' ha cancelado una cita.</a>' + mediaObjectFecha + '</div>';
          break;
      case 25:
          //medico tiene solicitud de cita
          not += '<div class="media-left"><a onclick="detalleCita(\''+record.data+'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="detalleCita(\''+record.data+'\')">El paciente ' + nombreCompleto + ' ha generado una cita.</a>' + mediaObjectFecha + '</div>';
          break;
      case 9:
          //medico tiene solicitud de cita
          not += '<div class="media-left"><a>INTERMED</a></div><div class="media-body"><a onclick="actualizarSesion();location.reload();">Tu cédula ha sido aceptada.</a>' + mediaObjectFecha + '</div>';
          break;
      case 10:
          not += '<div class="media-left"><a>INTERMED</a></div><div class="media-body"><a onclick="actualizarSesion();location.reload();">Tu cédula ha sido rechazada.</a>' + mediaObjectFecha + '</div>';
          actualizarSesion();
          //medico tiene solicitud de cita
          //not += '<div class="media-left"><a onclick="detalleCita(\''+record.data+'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="detalleCita(\''+record.data+'\')">El paciente ' + nombreCompleto + ' ha generado una cita.</a>' + mediaObjectFecha + '</div>';
          break;
      case 31:
          //Medico envio invitación a secretaria
          not += '<div class="media-left"><a class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a>' + nombreCompleto + ' te ha invitado a ser su secretaria.</a>' + mediaObjectFecha + '</div>';
          break;
      case 32:
          //Medico elimino a secretaria
          not += '<div class="media-left"><a class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a>' + nombreCompleto + ' te ha eliminado de sus secretarias.</a>' + mediaObjectFecha + '</div>';
          break;
      case 33:
          //Secretaria acepto invitación
          not += '<div class="media-left"><a href="/secretaria" class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a href="/secretaria" >' + nombreCompleto + ' ha aceptado la invitación para ser tu secretaria, ¡Asígnale sus permisos!.</a>' + mediaObjectFecha + '</div>';
          break;
      case 34:
          //Secretaria rechazo invitación
          not += '<div class="media-left"><a class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a>' + nombreCompleto + ' ha rechazado la invitación para ser tu secretaria.</a>' + mediaObjectFecha + '</div>';
          break;
      case 35:
          //Secretaria elimino a médico
          not += '<div class="media-left"><a class="recomendando">'+mediaObjectImagen+'</a></div><div class="media-body"><a>' + nombreCompleto + ' dejó de ser tu secretaria.</a>' + mediaObjectFecha + '</div>';
          break;
      case 16:
          mediaObjectImagen = '<img class="media-object img-circle" src="' + record.comentario.Medico.Usuario.urlFotoPerfil + '" '+style+'>';
          if (record.comentario.Medico.Usuario.DatosGenerale.apellidoM){
            record.comentario.Medico.Usuario.DatosGenerale.apellidoM = ' ' + record.comentario.Medico.Usuario.DatosGenerale.apellidoM;
          } else {
            record.comentario.Medico.Usuario.DatosGenerale.apellidoM = '';
          }
          nombreCompleto = record.comentario.Medico.Usuario.DatosGenerale.nombre + ' ' + record.comentario.Medico.Usuario.DatosGenerale.apellidoP + record.comentario.Medico.Usuario.DatosGenerale.apellidoM;
          not += '<div class="media-left"><a onclick="verDetalleComentario('+ record.comentario.id +')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="verDetalleComentario('+ record.comentario.id +')">El Dr. ' + nombreCompleto + ' ha respondido tu comentario.</a>' + mediaObjectFecha + '</div>';
          break;
      case 50:
          //Notificacion a paciente de retraso de cita
          var mediaObjectImagen = '<img class="media-object img-circle" src="' + record.agenda.Usuario.urlFotoPerfil + '" '+style+'>';
          var nombreCompleto = record.agenda.Usuario.DatosGenerale.nombre + ' ' + record.agenda.Usuario.DatosGenerale.apellidoP + ' ' + record.agenda.Usuario.DatosGenerale.apellidoM;
          not += '<div class="media-left"><a onclick="retrasaCita(\''+record.data+'\')">'+mediaObjectImagen+'</a></div><div class="media-body"><a onclick="retrasaCita(\''+record.data+'\')">El médico ' + nombreCompleto + ' ha retrasado la cita.</a>' + mediaObjectFecha + '</div>';
          break;
    }

    not += '</div>';
    not = '<'+ element +' class="media" id="li' + record.id + '" ' + visto + '>' + not + '</'+element+'>'

    console.log('not' + not)
  //}
  return not;
}

$( document ).ready( function () {
  $( '#notificaciones' ).on( 'hidden.bs.dropdown', function () {
    $( '#notificationIcon' ).attr( 'aria-expanded', '' );
    notificacionesScroll = [];
  } );

  if ( window.location.href.indexOf( "/inbox" ) > 0 ) {
    socket.emit( 'conectarSocket' );
  }
} );

function cargarListaInbox() {
  $( '#notificacionesInboxList' ).html( '' );
  InboxListLoaded = [];
  socket.emit( 'cargarInboxVistaPrevia' );
}

var loadInboxList = true;

function cargarInboxListCondicional() {
  var scrollBottom = $( '#notificacionesInboxList' ).height() - $( '#notificacionesInboxList' ).parent().height() - $( '#notificacionesInboxList' ).scrollTop();
  if ( scrollBottom < 5 && $( 'li.loadInboxList' ).length > 0 && loadInboxList ) {
    $( 'li.loadInboxList' ).html( 'Cargando...' );
    loadInboxList = false;
    setTimeout( function () {
      $( 'li.loadInboxList' ).html( '' );
      socket.emit( 'cargarInboxVistaPrevia', {
        notIn: InboxListLoaded
      } );
    }, 2000 );
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



$( document ).ready( function () {
  var chat = document.getElementById( "notificacionesInboxList" );
  if(chat){
    if (chat.addEventListener ) {
      // IE9, Chrome, Safari, Opera
      chat.addEventListener( "mousewheel", cargarInboxListCondicional, false );
      // Firefox
      chat.addEventListener( "DOMMouseScroll", cargarInboxListCondicional, false );
    }
    // IE 6/7/8
    else chat.attachEvent( "onmousewheel", cargarInboxListCondicional );
  }
} );

if ( window.location.href.indexOf( "/configuraciones" ) > 0 ) {

  $( document ).ready( function () {
      //Manejar notificaciones
      $.ajax( {
        url: '/notificaciones',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function ( data ) {
          if ( data ) {
            if ( Object.prototype.toString.call( data ) === '[object Array]' ) {
              if ( data ) {
                data.forEach( function ( record ) {
                  var internoChecked = '';
                  var pushChecked = '';
                  var mailChecked = '';
                  if ( record.interno == 1 ) {
                    internoChecked = ' checked ';
                  }
                  if ( record.push == 1 ) {
                    pushChecked = ' checked ';
                  }
                  if ( record.mail == 1 ) {
                    mailChecked = ' checked ';
                  }
                  var descripcion = '';
                  if ( record.descripcion && record.descripcion != '' ) {
                    descripcion = ' <a data-toggle="popover" title="' + record.nombre + '" data-content="' + record.descripcion + '"><span class="glyphicon glyphicon-question-sign"></span></a>';
                  }
                  $( '#configNot' ).append( '<tr id="' + record.id + '"><td>' + record.nombre + descripcion + '</td><td class="text-center"><input type="checkbox" class="interno" ' + internoChecked + '></td><td class="text-center"><input type="checkbox" class="push"  ' + pushChecked + '></td><td class="text-center"><input type="checkbox"  class="mail" ' + mailChecked + '></td></tr>' );

                  if ( record.configurable == 0 ) {
                    $( 'tr#' + record.id ).find( 'input[type="checkbox"]' ).each( function ( index ) {
                      $( this ).attr( 'disabled', true );
                    } );

                  }
                } );
                $( 'input[type="checkbox"]' ).click( function () {
                  var interno = 0,
                    push = 0,
                    mail = 0;
                  var id = $( this ).parent().parent().prop( 'id' );
                  if ( $( this ).parent().parent().find( 'input.interno' ).is( ":checked" ) ) {
                    interno = 1;
                  }
                  if ( $( this ).parent().parent().find( 'input.push' ).is( ":checked" ) ) {
                    push = 1;
                  }
                  if ( $( this ).parent().parent().find( 'input.mail' ).is( ":checked" ) ) {
                    mail = 1;
                  }
                  modificarConfiguracion( id, interno, push, mail );
                } );
                $( '[data-toggle="popover"]' ).popover()
              }
            }
          }
        },
        error: function ( jqXHR, textStatus, err ) {
          console.error( 'AJAX ERROR: ' + err );
        }
      } );
  } );

  function modificarConfiguracion( id, interno, push, mail ) {
    $.ajax( {
      url: '/notificaciones/configurarNotificacion',
      type: 'POST',
      dataType: "json",
      data: {
        tipoNotificacion_id: id,
        interno: interno,
        push: push,
        mail: mail
      },
      cache: false,
      success: function ( data ) {
        if ( data.success ) {
          if ( interno == 0 ) {
            //Detener setinterval para la notificacion
            var pos = -1;
            notificaciones.forEach( function ( notificacion ) {
              if ( notificacion.tipoNotificacion_id == id ) {
                clearInterval( notificacion.id );
                pos = notificaciones.indexOf( notificacion );
              }
            } );
            if ( pos >= 0 ) {
              notificaciones.splice( pos, 1 );
            }
          }
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
  }
}


function mostrarNotificaciones() {
  if ( socket ) {
    socket.emit( 'contarNuevasNotificaciones' );
    $( '#notificacinesList' ).html( '<li class="text-center"><div class="throbber-loader" style="margin-top:10px">…</div></li>' );
    setTimeout( function () {
      socket.emit( 'buscarNotificaciones' );
    }, 100 );

  }
}

function cerrarNotModal() {
  $( ".notificationDropdown" ).dropdown( "toggle" );
}
