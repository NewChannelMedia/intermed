var intermed = require( '../apps/controllers/Intermed' );

var io = function ( io, bundle, ioPassport ) {
  io.use( bundle.cookieParser() );
  io.use( bundle.session( {
    secret: 'my secret'
  } ) );
  io.use( ioPassport.initialize() );
  io.use( ioPassport.session() );

  var conectados = [];

  function indexOf( id ) {
    var index = 0;
    var indexenviar = -1;
    conectados.forEach( function ( record ) {
      if ( record.socket == id ) {
        indexenviar = index;
      }
      else index++;
    } );
    return indexenviar;
  }

  function indexOfUsuarioId( id ) {
    var index = 0;
    var indexenviar = [];
    conectados.forEach( function ( record ) {
      if ( record.id == id ) {
        indexenviar.push(record.socket);
      }
    } );
    return indexenviar;
  }

  function desconectar( id ) {
    var index = indexOf( id );
    if ( index >= 0 ) {
      conectados.splice( index, 1 );
      return true;
    }
    else {
      return false;
    }
  }

  io.on( 'connection', function ( socket ) {
    if ( socket.request.cookies.intermed_sesion ) {

      socket.on( 'disconnect', function () {
        desconectar( socket.id );
        //console.log('[desconectar]Usuarios conectados: ' + JSON.stringify(conectados));
        //console.log( '[DESCONEXIÓN:' + socket.id + ']USUARIO:' + socket.request.cookies.intermed_sesion.usuario + '.' );
      } );

      socket.on( 'solicitudAmistad', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: solicitudAmistad]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'solicitudAmistad', req );
      } );
      //OSCAR
      socket.on('medicoRecomendado', function(){
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };
        intermed.callController('notificaciones', 'medicoRecomendado',req);
      });
      socket.on('doctorRecomendado',function(){
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };
        intermed.callController('notificaciones','doctorRecomendado',req);
      });
      //FIN OSCAR
      socket.on( 'solicitudAmistadAceptada', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: solicitudAmistadAceptada]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'solicitudAmistadAceptada', req );
      } );

      socket.on( 'solicitudesAceptadas', function ( id ) {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: solicitudesAceptadas]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario,
          notificacion_id: id
        };

        intermed.callController( 'notificaciones', 'solicitudesAceptadas', req );
      } );

      socket.on( 'agregadoMedicoFavorito', function ( id ) {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: solicitudesAceptadas]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario,
          notificacion_id: id
        };

        intermed.callController( 'notificaciones', 'agregadoMedicoFavorito', req );
      } );

      socket.on( 'solicitudRechazada', function ( id ) {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: solicitudesAceptadas]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario,
          notificacion_id: id
        };

        intermed.callController( 'notificaciones', 'solicitudRechazada', req );
      } );


      socket.on( 'verNotificaciones', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: verNotificaciones]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'verNotificaciones', req );
      } );


      socket.on( 'verNotificacionesInbox', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: verNotificaciones]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'verNotificacionesInbox', req );
      } );

      socket.on('inbox',function () {
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'inbox', req );
      } );

      socket.on('conectarSocket',function () {
        console.log( '[CONEXIÓN:' + socket.id + ']ID:' + socket.request.cookies.intermed_sesion.id + '.' );
        conectados.push( {
          socket: socket.id,
          id: socket.request.cookies.intermed_sesion.id,
          usuario: socket.request.cookies.intermed_sesion.usuario,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario
        } );

        //console.log('Usuarios conectados: ' + JSON.stringify(conectados));
      } );

      socket.on('enviarInbox', function(data){
        var SocketsConectados = indexOfUsuarioId(data.para);
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          tipoUsuario: socket.request.cookies.intermed_sesion.tipoUsuario,
          info: data,
          SocketsConectados: SocketsConectados
        };
        intermed.callController( 'inbox', 'enviar', req );
      })

      socket.on('conversacionLeida', function(usuario_id){
        var req = {
          socket: socket,
          usuario_id_para: socket.request.cookies.intermed_sesion.id,
          usuario_id_de: usuario_id
        };
        intermed.callController( 'inbox', 'conversacionLeida', req );
      })

      socket.on('crearConversacion', function (usuario_id){
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id,
          usuario_id_de: usuario_id
        };
        intermed.callController( 'inbox', 'crearConversacion', req );
      });

      socket.on('cargarInboxVistaPrevia', function(object){
        var req = {
          socket: socket,
          usuario_id: socket.request.cookies.intermed_sesion.id
        };
        if (object) {
          req.notIn = object.notIn
        }
        intermed.callController( 'inbox', 'cargarInboxVistaPrevia', req );
      });

      socket.on('obtenerUsuarioId', function(object){
          var req = {
            socket: socket,
            usuario_id: socket.request.cookies.intermed_sesion.id,
            UsuarioUrl: object
          };
          intermed.callController( 'usuarios', 'obtenerUsuarioId', req );
      });
    }
  } );
};

//se importa para que otros js lo puedan ejecutar
exports.io = io;
