var models = require( '../models' );

exports.index = function ( object, req, res ) {
  res.render( 'notificaciones', object );
}

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
  var numNot = 0;
  if (req.tipoUsuario == "P"){
    numNot = 1;
  } else if (req.tipoUsuario == "M"){
    numNot = 4;
  }

  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: numNot
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: numNot
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante,
      order: 'inicio DESC'
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        if (req.tipoUsuario == "P"){
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
        } else if (req.tipoUsuario == "M"){
            var medico_id = record.data;
            record[ 'medico_id' ] = medico_id;
            models.Medico.findOne( {
              where: {
                id: medico_id
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
              record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( record === result[ result.length - 1 ] ) {
                req.socket.emit( 'solicitudAmistad', result );
              }
            } )
        }
      } );
    } );
  } )
};


exports.solicitudAmistadAceptada = function ( req ) {
  var numNot = 0;
  if (req.tipoUsuario == "P"){
    numNot = 2;
  } else if (req.tipoUsuario == "M"){
    numNot = 5;
  }

  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: numNot
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: numNot
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante,
      order: 'inicio DESC'
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = '', medico_id = '';
        if (req.tipoUsuario == "P"){
          paciente_id = record.data;
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
        } else if (req.tipoUsuario == "M"){
          medico_id = record.data;
          record[ 'medico_id' ] = paciente_id;

          models.Medico.findOne( {
            where: {
              id: medico_id
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
            record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
            if ( record === result[ result.length - 1 ] ) {
              req.socket.emit( 'solicitudAmistadAceptada', result );
            }
          } )
        }
      } );
    } );
  } )
};


exports.solicitudesAceptadas = function ( req ) {
  var numNot = 0;
  if (req.tipoUsuario == "P"){
    numNot = 3;
  } else if (req.tipoUsuario == "M"){
    numNot = 6;
  }

  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: numNot
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: numNot
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante,
      order: 'inicio DESC'
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = '', medico_id = '';
        if (req.tipoUsuario == "P"){
          paciente_id = record.data;
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
              req.socket.emit( 'solicitudesAceptadas', result );
            }
          } )
        } else if (req.tipoUsuario == "M"){
          medico_id = record.data;
          record[ 'medico_id' ] = paciente_id;

          models.Medico.findOne( {
            where: {
              id: medico_id
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
            record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
            if ( record === result[ result.length - 1 ] ) {
              req.socket.emit( 'solicitudesAceptadas', result );
            }
          } )
        }
      } );
    } );
  } )
};



exports.solicitudRechazada = function ( req ) {
  var numNot = 0;
  if (req.tipoUsuario == "P"){
    numNot = 8;
  } else if (req.tipoUsuario == "M"){
    numNot = 9;
  }

  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: numNot
    },
    attributes: [ 'id', 'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    var restante = 8 - result.length;
    if ( restante < 0 ) restante = 0;
    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: numNot
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      limit: restante,
      order: 'inicio DESC'
    } ).then( function ( resultVisto ) {
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var paciente_id = '', medico_id = '';
        if (req.tipoUsuario == "P"){
          paciente_id = record.data;
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
        } else if (req.tipoUsuario == "M"){
          medico_id = record.data;
          record[ 'medico_id' ] = paciente_id;

          models.Medico.findOne( {
            where: {
              id: medico_id
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
            record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
            if ( record === result[ result.length - 1 ] ) {
              req.socket.emit( 'solicitudAmistadAceptada', result );
            }
          } )
        }
      } );
    } );
  } )
};


exports.agregadoMedicoFavorito = function ( req ) {

    models.Notificacion.findAll( {
      where: {
        usuario_id: req.usuario_id,
        visto: 0,
        tipoNotificacion_id: 7
      },
      attributes: [ 'id', 'data', 'inicio', 'visto' ],
      order: 'inicio DESC'
    } ).then( function ( result ) {
      var restante = 8 - result.length;
      if ( restante < 0 ) restante = 0;
      models.Notificacion.findAll( {
        where: {
          usuario_id: req.usuario_id,
          visto: 1,
          tipoNotificacion_id: 7
        },
        attributes: [ 'id', 'data', 'inicio', 'visto' ],
        limit: restante,
        order: 'inicio DESC'
      } ).then( function ( resultVisto ) {
        result = JSON.parse( JSON.stringify( result ) );
        result = result.concat( JSON.parse( JSON.stringify( resultVisto ) ) );
        var length = result.length;
        result.forEach( function ( record ) {
            paciente_id = record.data;
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
                req.socket.emit( 'agregadoMedicoFavorito', result );
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
      tipoNotificacion_id: {$notIn: [10, 11]},//Inbox
      id: {not: [object.id]}
    },
    limit: 4,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    if (result.length > 0){
      result = JSON.parse( JSON.stringify( result ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var tipoUsuario = '';
        switch(record.tipoNotificacion_id) {
            case 1:
              tipoUsuario = "P";
              break;
            case 2:
              tipoUsuario = "P";
              break;
            case 3:
              tipoUsuario = "P";
              break;
            case 4:
              tipoUsuario = "M";
              break;
            case 5:
              tipoUsuario = "M";
              break;
            case 6:
              tipoUsuario = "M";
              break;
            case 7:
              tipoUsuario = "P";
              break;
            case 8:
            tipoUsuario = "P";
                break;
            case 9:
              tipoUsuario = "M";
              break;
        }
        var paciente_id = '', medico_id = '';
        if (tipoUsuario == "P"){
          paciente_id = record.data;
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
        } else if (tipoUsuario == "M"){
          medico_id = record.data;
          record[ 'medico_id' ] = medico_id;

          models.Medico.findOne( {
            where: {
              id: medico_id
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
            record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
            if ( record === result[ result.length - 1 ] ) {
              res.send(result);
            }
          } )
        }
      } );
    } else {
      res.send(JSON.parse(JSON.stringify([])));
    }
  } )
}


exports.cargarNotificaciones = function ( object, req, res ) {
  if (!req.session.passport.user) res.send(JSON.parse(JSON.stringify({'result':'error'})));
  var whereid = new Array();
  var limit = 0;
  if (object.id && object.id!= "" && object.id != null) {
    whereid = {id: {not: [object.id]}}
  }
  if (object.limit) {
    limit = object.limit
  }
  var where = new Array(models.sequelize.and(
    {usuario_id: req.session.passport.user.id},
    {tipoNotificacion_id: {$notIn: [10, 11]}},//Inbox,,
    whereid
  ));
  models.Notificacion.findAll( {
    where: where,
    limit: limit,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    if (result.length > 0){
      result = JSON.parse( JSON.stringify( result ) );
      var length = result.length;
      result.forEach( function ( record ) {
        var tipoUsuario = '';
        switch(record.tipoNotificacion_id) {
            case 1:
              tipoUsuario = "P";
              break;
            case 2:
              tipoUsuario = "P";
              break;
            case 3:
              tipoUsuario = "P";
              break;
            case 4:
              tipoUsuario = "M";
              break;
            case 5:
              tipoUsuario = "M";
              break;
            case 6:
              tipoUsuario = "M";
              break;
            case 7:
              tipoUsuario = "P";
              break;
            case 8:
            tipoUsuario = "P";
                break;
            case 9:
              tipoUsuario = "M";
              break;
        }
        var paciente_id = '', medico_id = '';
        if (tipoUsuario == "P"){
          paciente_id = record.data;
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
        } else if (tipoUsuario == "M"){
          medico_id = record.data;
          record[ 'medico_id' ] = medico_id;

          models.Medico.findOne( {
            where: {
              id: medico_id
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
            record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
            if ( record === result[ result.length - 1 ] ) {
              res.send(result);
            }
          } )
        }
      } );
    } else {
      res.send(JSON.parse(JSON.stringify([])));
    }
  } )
};
exports.pedirRecomendacion = function( req ){
  models.Notificacion.findAll({
    where:{
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: 14
    },
    attributes:['id','usuario_id','data','inicio','visto'],
    order: 'inicio DESC'
  }).then(function( result ){
    var restante = 8 -result.length;
    if( restante < 0 ) restante = 0;
    models.Notificacion.findAll({
      where:{
        usuario_id: req.usuario_id,
        visto: 1,
        tipoNotificacion_id: 14
      },
      attributes:['id','usuario_id','data','inicio','visto'],
      limit: restante,
      order: 'inicio DESC'
    }).then(function( resultVisto ){
      result = JSON.parse( JSON.stringify( result ) );
      result = result.concat( JSON.parse( JSON.stringify( resultVisto )));
      var length = result.length;
      result.forEach( function( record ){
          models.Paciente.findOne({
            where:{id: record.data.split("|")[0]},
            include:[{
              model: models.Usuario,
              attributes:['id','usuarioUrl','urlFotoPerfil'],
              include:[{
                model: models.DatosGenerales,
                attributes:['nombre','apellidoP','apellidoM']
              }]
            }]
          }).then(function(paciente){
            record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
            if( record === result[ result.length - 1 ] ){
              req.socket.emit('pedirRecomendacion', result);
            }
        });
      });
    });
  });
};
function getDateTime() {
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
  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}
