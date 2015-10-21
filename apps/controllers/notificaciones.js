var models = require( '../models' );

exports.obtenerTodas = function ( object, req, res ) {
  models.TipoNotificacion.findAll( {
    where: {
      tipoUsuario: req.session.passport.user.tipoUsuario
    }
  } ).
  then( function ( result ) {
    models.ConfNotUsu.findAll( {
      where: {
        usuario_id: req.session.passport.user.id
      }
    } ).then( function ( confPersonal ) {
      for ( var key in confPersonal ) {
        for ( var key2 in result ) {
          if ( result[ key2 ].id === confPersonal[ key ].id ) {
            result[ key2 ].interno = confPersonal[ key ].interno;
            result[ key2 ].push = confPersonal[ key ].push;
            result[ key2 ].mail = confPersonal[ key ].mail;
          }
        }
      }
      res.send( result );
    } )
  } );
}

exports.solicitudAmistad = function ( req ) {
  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: 1
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ]
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: 1
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = record.data;
        record[ 'paciente_id' ] = paciente_id;
        models.Paciente.findOne( {
          where: {
            id: paciente_id
          },
          attributes: [ 'id' ],
          include: [ {
            model: models.Usuario,
            attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
            include: [ {
              model: models.DatosGenerales,
              attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                        } ]
                    } ]
        } ).then( function ( usuario ) {
          record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
          if ( record === result[ result.length - 1 ] ) {
            req.socket.emit( 'solicitudAmistad', result );
          }
        } )
      } );
    } );
  } )
};


exports.solicitudAmistadAceptada = function ( req ) {
  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: 2
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ]
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: 2
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = record.data;
        record[ 'paciente_id' ] = paciente_id;
        models.Paciente.findOne( {
          where: {
            id: paciente_id
          },
          attributes: [ 'id' ],
          include: [ {
            model: models.Usuario,
            attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
            include: [ {
              model: models.DatosGenerales,
              attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                        } ]
                    } ]
        } ).then( function ( usuario ) {
          record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
          if ( record === result[ result.length - 1 ] ) {
            req.socket.emit( 'solicitudAmistadAceptada', result );
          }
        } )
      } );
    } );
  } )
};


exports.solicitudesAceptadas = function ( req ) {
  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: 3
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ]
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: 3
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = record.data;
        record[ 'paciente_id' ] = paciente_id;
        models.Paciente.findOne( {
          where: {
            id: paciente_id
          },
          attributes: [ 'id' ],
          include: [ {
            model: models.Usuario,
            attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
            include: [ {
              model: models.DatosGenerales,
              attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                        } ]
                    } ]
        } ).then( function ( usuario ) {
          record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
          if ( record === result[ result.length - 1 ] ) {
            req.socket.emit( 'solicitudAmistadAceptada', result );
          }
        } )
      } );
    } );
  } )
};


exports.verNotificaciones = function ( req ) {
  models.Notificacion.update( {
    visto: 1
  }, {
    where: {
      usuario_id: req.usuario_id,
      visto: 0
    }
  } ).then( function ( result ) {
    req.socket.emit( 'verNotificaciones', result );
  } );
}

exports.scroll = function (object, req, res){
  models.Notificacion.findAll( {
    where: {
      usuario_id: req.session.passport.user.id,
      id: {not: [object.id]}
    },
    limit: 4,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ]
  } ).then( function ( result ) {
      result = JSON.parse( JSON.stringify( result ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = record.data;
        record[ 'paciente_id' ] = paciente_id;
        models.Paciente.findOne( {
          where: {
            id: paciente_id
          },
          attributes: [ 'id' ],
          include: [ {
            model: models.Usuario,
            attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
            include: [ {
              model: models.DatosGenerales,
              attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                        } ]
                    } ]
        } ).then( function ( usuario ) {
          record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
          if ( record === result[ result.length - 1 ] ) {
            res.send(result);
          }
        } )
    } );
  } )
}
