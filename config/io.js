var intermed = require( '../apps/controllers/Intermed' );
var models = require( '../apps/models' );

const crypto = require('crypto'),
  algorithm = 'aes192',
  password = 'int5erm7edS6ess6ion';

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

  function intermed_sesion(socket){
    var _intermed = {};
    try{
      var encrypted = unescape(socket.request.cookies['_intermed']).toString();
      var decipher = crypto.createDecipher(algorithm,password);
      var decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      cookieSession = decrypted.split(';');
      _intermed = {
        id: cookieSession[0],
        usuarioUrl: cookieSession[1],
        tipoUsuario: cookieSession[2]
      }
    } catch(e){
      console.log('Error en var session: ' + e);
    }
    return _intermed;
  }

  io.on( 'connection', function ( socket ) {
    socket.request.session = intermed_sesion(socket);
    if ( socket.request.session.id>0 ) {

      socket.on( 'disconnect', function () {
        desconectar( socket.id );
        //console.log('[desconectar]Usuarios conectados: ' + JSON.stringify(conectados));
        //console.log( '[DESCONEXIÓN:' + socket.id + ']USUARIO:' + socket.request.session.usuario + '.' );
      } );

      socket.on( 'verNotificaciones', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: verNotificaciones]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          tipoUsuario: socket.request.session.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'verNotificaciones', req );
      } );


      socket.on( 'verNotificacionesInbox', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: verNotificaciones]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          tipoUsuario: socket.request.session.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'verNotificacionesInbox', req );
      } );


      socket.on( 'verComentarios', function () {
        //console.log( 'socket_id: ' + socket.id + ' [Buscar: verNotificaciones]' );
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          tipoUsuario: socket.request.session.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'verComentarios', req );
      } );

      socket.on('inbox',function () {
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          tipoUsuario: socket.request.session.tipoUsuario
        };

        intermed.callController( 'notificaciones', 'inbox', req );
      } );

      socket.on('conectarSocket',function () {
        console.log( '[CONEXIÓN:' + socket.id + ']ID:' + socket.request.session.id + '.' );
        conectados.push( {
          socket: socket.id,
          id: socket.request.session.id,
          usuario: socket.request.session.usuario,
          tipoUsuario: socket.request.session.tipoUsuario
        } );

        //console.log('Usuarios conectados: ' + JSON.stringify(conectados));
      } );

      socket.on('enviarInbox', function(data){
        var SocketsConectados = indexOfUsuarioId(data.para);
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          tipoUsuario: socket.request.session.tipoUsuario,
          info: data,
          SocketsConectados: SocketsConectados
        };
        intermed.callController( 'inbox', 'enviar', req );
      })

      socket.on('conversacionLeida', function(usuario_id){
        var req = {
          socket: socket,
          usuario_id_para: socket.request.session.id,
          usuario_id_de: usuario_id
        };
        intermed.callController( 'inbox', 'conversacionLeida', req );
      })

      socket.on('crearConversacion', function (usuario_id,append){
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          usuario_id_de: usuario_id,
          append: append
        };
        intermed.callController( 'inbox', 'crearConversacion', req );
      });

      socket.on('cargarInboxVistaPrevia', function(object){
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id
        };
        if (object) {
          req.notIn = object.notIn
        }
        intermed.callController( 'inbox', 'cargarInboxVistaPrevia', req );
      });

      socket.on('obtenerUsuarioId', function(object){
          var req = {
            socket: socket,
            usuario_id: socket.request.session.id,
            UsuarioUrl: object
          };
          intermed.callController( 'usuarios', 'obtenerUsuarioId', req );
      });

      socket.on('contarNuevasNotificaciones',function (object){
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          UsuarioUrl: object
        };

        models.TipoNotificacion.findAll( {
          where: {
            tipoUsuario: socket.request.session.tipoUsuario
          }
        } ).
        then( function ( result ) {
          models.ConfNotUsu.findAll( {
            where: {
              usuario_id: req.usuario_id
            }
          } ).then( function ( confPersonal ) {
            for ( var key in confPersonal ) {
              for ( var key2 in result ) {
                if (result[ key2 ].configurable === 1){
                  if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                    result[ key2 ].interno = confPersonal[ key ].interno;
                    result[ key2 ].push = confPersonal[ key ].push;
                    result[ key2 ].mail = confPersonal[ key ].mail;
                  }
                }
              }
            }
            var notificaciones = [];
            for (var key in result){
              if (result[key].interno == 1){
                notificaciones.push(result[key].id);
              }
            }
            if (notificaciones.length > 0){
                var req = {
                  socket: socket,
                  usuario_id: socket.request.session.id,
                  tipoUsuario: socket.request.session.tipoUsuario,
                  notificaciones: notificaciones
                };
                intermed.callController( 'notificaciones', 'contarNuevasNotificaciones', req );
            }
          } )
        } );
      });

      socket.on('buscarNotificaciones',function (object){
        var req = {
          socket: socket,
          usuario_id: socket.request.session.id,
          UsuarioUrl: object
        };

        models.TipoNotificacion.findAll( {
          where: {
            tipoUsuario: socket.request.session.tipoUsuario
          }
        } ).
        then( function ( result ) {
          models.ConfNotUsu.findAll( {
            where: {
              usuario_id: socket.request.session.id
            }
          } ).then( function ( confPersonal ) {
            for ( var key in confPersonal ) {
              for ( var key2 in result ) {
                if (result[ key2 ].configurable === 1){
                  if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                    result[ key2 ].interno = confPersonal[ key ].interno;
                    result[ key2 ].push = confPersonal[ key ].push;
                    result[ key2 ].mail = confPersonal[ key ].mail;
                  }
                }
              }
            }
            var notificaciones = [];
            for (var key in result){
              if (result[key].interno == 1){
                notificaciones.push(result[key].id);
              }
            }
            if (notificaciones.length > 0){
                var req = {
                  socket: socket,
                  usuario_id: socket.request.session.id,
                  tipoUsuario: socket.request.session.tipoUsuario,
                  notificaciones: notificaciones
                };
                intermed.callController( 'notificaciones', 'buscarNotificaciones', req );
            }
          } )
        } );
      });



      socket.on('notificacionesScroll',function (object, maxfecha){
        models.TipoNotificacion.findAll( {
          where: {
            tipoUsuario: socket.request.session.tipoUsuario
          }
        } ).
        then( function ( result ) {
          models.ConfNotUsu.findAll( {
            where: {
              usuario_id: socket.request.session.id
            }
          } ).then( function ( confPersonal ) {
            for ( var key in confPersonal ) {
              for ( var key2 in result ) {
                if (result[ key2 ].configurable === 1){
                  if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                    result[ key2 ].interno = confPersonal[ key ].interno;
                    result[ key2 ].push = confPersonal[ key ].push;
                    result[ key2 ].mail = confPersonal[ key ].mail;
                  }
                }
              }
            }
            var notificaciones = [];
            for (var key in result){
              if (result[key].interno == 1){
                notificaciones.push(result[key].id);
              }
            }
            if (notificaciones.length > 0){
                var req = {
                  socket: socket,
                  usuario_id: socket.request.session.id,
                  tipoUsuario: socket.request.session.tipoUsuario,
                  notificaciones: notificaciones,
                  notificacionesId: object,
                  maxfecha: maxfecha
                };
                intermed.callController( 'notificaciones', 'notificacionesScroll', req );
            }
          } )
        } );
      });

      socket.on('traerNuevasNotificaciones',function(){
        models.TipoNotificacion.findAll( {
          where: {
            tipoUsuario: socket.request.session.tipoUsuario
          }
        } ).
        then( function ( result ) {
          models.ConfNotUsu.findAll( {
            where: {
              usuario_id: socket.request.session.id
            }
          } ).then( function ( confPersonal ) {
            for ( var key in confPersonal ) {
              for ( var key2 in result ) {
                if (result[ key2 ].configurable === 1){
                  if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                    result[ key2 ].interno = confPersonal[ key ].interno;
                    result[ key2 ].push = confPersonal[ key ].push;
                    result[ key2 ].mail = confPersonal[ key ].mail;
                  }
                }
              }
            }
            var notificaciones = [];
            for (var key in result){
              if (result[key].interno == 1){
                notificaciones.push(result[key].id);
              }
            }
            if (notificaciones.length > 0){
                var req = {
                  socket: socket,
                  usuario_id: socket.request.session.id,
                  tipoUsuario: socket.request.session.tipoUsuario,
                  notificaciones: notificaciones
                };
                intermed.callController( 'notificaciones', 'traerNuevasNotificaciones', req );
            }
          } )
        } );
      });

      socket.on('cargarNotificacionesList',function (notificacionesId,limit,maxfecha){

          console.log('cargarNotificacionesList');
          models.TipoNotificacion.findAll( {
            where: {
              tipoUsuario: socket.request.session.tipoUsuario
            }
          } ).
          then( function ( result ) {
            models.ConfNotUsu.findAll( {
              where: {
                usuario_id: socket.request.session.id
              }
            } ).then( function ( confPersonal ) {
              for ( var key in confPersonal ) {
                for ( var key2 in result ) {
                  if (result[ key2 ].configurable === 1){
                    if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                      result[ key2 ].interno = confPersonal[ key ].interno;
                      result[ key2 ].push = confPersonal[ key ].push;
                      result[ key2 ].mail = confPersonal[ key ].mail;
                    }
                  }
                }
              }
              var notificaciones = [];
              for (var key in result){
                if (result[key].interno == 1){
                  notificaciones.push(result[key].id);
                }
              }
              if (notificaciones.length > 0){
                  var req = {
                    socket: socket,
                    usuario_id: socket.request.session.id,
                    tipoUsuario: socket.request.session.tipoUsuario,
                    notificaciones: notificaciones,
                    maxfecha: maxfecha,
                    limit: limit,
                    notificacionesId: notificacionesId
                  };
                  intermed.callController( 'notificaciones', 'cargarNotificacionesList', req );
              }
            } )
          } );
      });
    }
  } );
};

//se importa para que otros js lo puedan ejecutar
exports.io = io;
