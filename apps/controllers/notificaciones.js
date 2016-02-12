var models = require( '../models' );

exports.index = function ( object, req, res ) {
  try{
    res.render( 'notificaciones', object );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.configuracion = function ( object, req, res ) {
  try{
    res.render( 'notificaciones_configuracion', object );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.obtenerTodas = function ( object, req, res ) {
  try{
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
            if (result[ key2 ].configurable === 1){
              if ( result[ key2 ].id === confPersonal[ key ].tipoNotificacion_id) {
                result[ key2 ].interno = confPersonal[ key ].interno;
                result[ key2 ].push = confPersonal[ key ].push;
                result[ key2 ].mail = confPersonal[ key ].mail;
              }
            }
          }
        }
        res.send( result );
      } )
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.inbox = function ( req ) {
  var numNot = 0;
  if (req.tipoUsuario == "P"){
    numNot = 101;
  } else if (req.tipoUsuario == "M"){
    numNot = 102;
  }

  models.Notificacion.findAll( {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: numNot
    },
    group: ['data']
  } ).then( function ( result ) {
    req.socket.emit( 'inbox', result.length );
  })
}


exports.verNotificaciones = function ( req ) {
  models.Notificacion.update( {
    visto: 1
  }, {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: {$lt: 100},
      inicio: {$lt: new Date().toISOString().slice(0, 19).replace('T', ' ')},
    }
  } ).then( function ( result ) {
    req.socket.emit( 'verNotificaciones', result );
  } );
}


exports.verNotificacionesInbox = function ( req ) {
  models.Notificacion.update( {
    visto: 1
  }, {
    where: {
      usuario_id: req.usuario_id,
      visto: 0,
      tipoNotificacion_id: {$between: [100, 200]}
    }
  });
}

exports.notificacionesScroll = function (object){
  console.log('BEGIN REQUEST');
  models.Notificacion.findAll( {
    where: {
      id: {$notIn: object.notificacionesId},
      usuario_id: object.usuario_id,
      tipoNotificacion_id: {$in: object.notificaciones,$lt: 100},
      inicio: {$lte: object.maxfecha},
    },
    order: [ ['inicio', 'DESC']],
    limit: 5,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    formatearNotificacion(result,'notificacionesScroll',object);
  } )
}

exports.cargarNotificacionesList = function (object){
    var whereid = new Array();
    var limit = 0;
    if (object.notificacionesId && object.notificacionesId!= "" && object.notificacionesId != null) {
      whereid = {id: {not: [object.notificacionesId]}}
    }
    if (object.maxfecha && object.maxfecha != "") {
      wherefecha = {inicio: {$lte: object.maxfecha}}
    } else {
      wherefecha = {inicio: {$lte: new Date().toISOString().slice(0, 19).replace('T', ' ')}}
    }
    if (object.limit) {
      limit = object.limit
    }
    var where = new Array(models.sequelize.and(
      {usuario_id: object.usuario_id},
      {tipoNotificacion_id: {$in: object.notificaciones,$lt: 100}},//Inbox,,
      {inicio: {$lt: new Date().toISOString().slice(0, 19).replace('T', ' ')}},
      whereid,
      wherefecha
    ));

    models.Notificacion.findAll( {
      where: where,
      attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
      limit: limit,
      order: 'inicio DESC'
    } ).then( function ( result ) {
      formatearNotificacion(result,'cargarNotificacionesList',object);
    } );
}

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

exports.configurarNotificacion = function (object, req, res){
  try{
    var usuario_id = req.session.passport.user.id;
    var tipoNotificacion_id = object.tipoNotificacion_id;
    var interno = object.interno;
    var push = object.push;
    var mail = object.mail;

    models.ConfNotUsu.findOne({
      where: {
          usuario_id: usuario_id,
          tipoNotificacion_id: tipoNotificacion_id
        }
    }).then(function(confNotificacion){
      if (confNotificacion){
          confNotificacion.update({
            interno: interno,
            push: push,
            mail: mail
          }).then(function(result){
            if (result){
              res.send({'success':true});
            } else {
              //Error
              res.send({'success':false});
            }
          });
      } else {
        models.ConfNotUsu.create({
          usuario_id: usuario_id,
          tipoNotificacion_id: tipoNotificacion_id,
          interno: interno,
          push: push,
          mail: mail
        }).then(function(result){
          if (result){
            res.send({'success':true});
          } else {
            //Error
            res.send({'success':false});
          }
        })
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};


exports.contarNuevasNotificaciones = function (object){
    models.Notificacion.findAll( {
      where: {
        usuario_id: object.usuario_id,
        tipoNotificacion_id: {$in: object.notificaciones,$lt: 100},
        inicio: {$lt: new Date().toISOString().slice(0, 19).replace('T', ' ')},
        visto: 0
      },
      attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
      order: 'inicio DESC'
    } ).then( function ( result ) {
        object.socket.emit('contarNuevasNotificaciones',result.length);
    } );
}


exports.buscarNotificaciones = function (object){
  models.Notificacion.findAll( {
    where: {
      usuario_id: object.usuario_id,
      tipoNotificacion_id: {$in: object.notificaciones,$lt: 100},
      inicio: {$lt: new Date().toISOString().slice(0, 19).replace('T', ' ')},
    },
    limit: 8,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
    order: 'inicio DESC'
  } ).then( function ( result ) {
    formatearNotificacion(result,'notificacionesEncontradas',object);
  } )
};



exports.traerNuevasNotificaciones = function (object){
  models.Notificacion.findAll( {
    where: {
      usuario_id: object.usuario_id,
      tipoNotificacion_id: {$in: object.notificaciones,$lt: 100},
      inicio: {$lt: new Date().toISOString().slice(0, 19).replace('T', ' ')},
      visto: 0
    },
    limit: 8,
    attributes: [ 'id', 'tipoNotificacion_id' ,'data', 'inicio', 'visto' ],
    order: 'inicio ASC'
  } ).then( function ( result ) {
    formatearNotificacion(result,'traerNuevasNotificaciones',object);
  } )
};


function formatearNotificacion(result, emit, object){
  if (result.length > 0){
    result = JSON.parse( JSON.stringify( result ) );
    var length = result.length;
    var totalProcesados = 0;
    result.forEach( function ( record ) {
      var tipoUsuario = '';
      switch(record.tipoNotificacion_id) {
          case 1:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } );
            break;
          case 2:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } );
            break;
          case 3:

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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } );
            break;
          case 4:
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
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } )
            break;
          case 5:
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
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } )
            break;
          case 6:
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
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } )
            break;
          case 7:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } );
            break;
          case 8:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } );
            break;
          case 9:
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
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( usuario ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            } )
            break;
        case 12:
            models.Paciente.findOne( {
              where: {
                id: record.data.split("|")[0],
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
            } ).then( function ( paciente ) {
              models.Medico.findOne({
                where:{id:record.data.split("|")[1]},
                attributes:['id'],
                include:[{
                  model:models.Usuario,
                  attributes:['usuarioUrl'],
                  include:[{
                    model:models.DatosGenerales,
                    attributes:['nombre','apellidoP','apellidoM']
                  }]
                }]
              }).then(function(medico){
                totalProcesados++;
                record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
                record[ 'medico' ] = JSON.parse( JSON.stringify( medico ) );
                if ( totalProcesados === result.length) {
                  object.socket.emit(emit,result);
                }
              });
            } );
            break;
        case 13:
            models.Paciente.findOne({
              where:{usuario_id:record.data},
              include:[{
                model:models.Usuario,
                attributes:['usuarioUrl','urlFotoPerfil'],
                include:[{
                  model:models.DatosGenerales,
                  attributes:['nombre','apellidoP','apellidoM']
                }]
              }]
            }).then(function(paciente){
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
        case 14:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
        case 15:
            var medicos_id = record.data.split("|");
            var total = 0;
            record['medicos'] = [];
            for(var i in medicos_id){
              if (i == 0){
                models.Usuario.findOne({
                  where:{ id: medicos_id[i]},
                  attributes:['usuarioUrl','urlFotoPerfil'],
                  include:[{
                      model: models.DatosGenerales,
                      attributes:['nombre','apellidoP','apellidoM']
                    }]
                }).then(function(usuario){
                  if(usuario){
                    record['medico'] = {'Usuario':JSON.parse(JSON.stringify(usuario))};
                  }
                  total++;
                  if( total == medicos_id.length){
                    totalProcesados++;
                    if ( totalProcesados === result.length) {
                      object.socket.emit(emit,result);
                    }
                  }
                });
              } else {
                models.Medico.findOne({
                  where:{ id: medicos_id[i]},
                  attributes:['id','usuario_id'],
                  include:[{
                    model: models.Usuario,
                    attributes:['usuarioUrl','urlFotoPerfil'],
                    include:[{
                      model: models.DatosGenerales,
                      attributes:['nombre','apellidoP','apellidoM']
                    }]
                  }]
                }).then(function(medico){
                  if(medico){
                    record['medicos'].push(JSON.parse( JSON.stringify( medico )));
                  }
                  total++;
                  if( total == medicos_id.length){
                    totalProcesados++;
                    if ( totalProcesados === result.length) {
                      object.socket.emit(emit,result);
                    }
                  }
                });
              }
            }
            break;
          case 24:
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
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
          case 25:
            models.Paciente.findOne({
              include:[{
                model: models.Usuario,
                attributes:['id','usuarioUrl','urlFotoPerfil'],
                include:[{
                  model: models.DatosGenerales,
                  attributes:['nombre','apellidoP','apellidoM']
                }]
              },{
                model: models.Agenda,
                where:{id: record.data}
              }]
            }).then(function(paciente){
              totalProcesados++;
              record[ 'paciente' ] = JSON.parse( JSON.stringify( paciente ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
          case 21:
            models.Medico.findOne({
              include:[{
                model: models.Usuario,
                attributes:['id','usuarioUrl','urlFotoPerfil'],
                include:[{
                  model: models.DatosGenerales,
                  attributes:['nombre','apellidoP','apellidoM']
                },
                {
                  model: models.Agenda,
                  where:{id: record.data}
                }]
              }]
            }).then(function(medico){
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( medico ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
          case 22:
            models.Medico.findOne({
              include:[{
                model: models.Usuario,
                attributes:['id','usuarioUrl','urlFotoPerfil'],
                include:[{
                  model: models.DatosGenerales,
                  attributes:['nombre','apellidoP','apellidoM']
                },
                {
                  model: models.Agenda,
                  where:{id: record.data}
                }]
              }]
            }).then(function(medico){
              totalProcesados++;
              record[ 'medico' ] = JSON.parse( JSON.stringify( medico ) );
              if ( totalProcesados === result.length) {
                object.socket.emit(emit,result);
              }
            });
            break;
          case 9:
            totalProcesados++;
            if ( totalProcesados === result.length) {
              object.socket.emit(emit,result);
            }
            break;
          case 10:
            totalProcesados++;
            if ( totalProcesados === result.length) {
              object.socket.emit(emit,result);
            }
            break;
        default:
            console.log('Notificacion sin procesar: [tipoNotificacion_id: '+ record.tipoNotificacion_id +']');
            totalProcesados++;
            if ( totalProcesados === result.length) {
              object.socket.emit(emit,result);
            }
      }
    });
  } else {
    object.socket.emit(emit,[]);
  }
}
