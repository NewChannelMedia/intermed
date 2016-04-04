var models = require( '../models' );
var mail = require( './emailSender' );
var cryptomaniacs = require( './encryption' );
var usuarios = require('./usuarios');

exports.index = function (object, req, res){
  try{
    models.MedicoSecretaria.findAll({
      where: {
        medico_id: req.session.passport.user.Medico_id,
        activo: 1
      },
      include: [{
        model: models.Secretaria,
        include: [{
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil','correo'],
          include: [{
            model: models.DatosGenerales
          }]
        },{
          model: models.Municipio,
        },{
          model: models.Estado
        }]
      }]
    }).then(function(secretarias){
      var total = 0;
      secretarias = JSON.parse(JSON.stringify(secretarias));
      if (secretarias.length>0){
        secretarias.forEach(function(secr){
          //Buscar el permiso para cada uno de ellos
          models.SecretariaPermisos.findAll({
            include: [{
              model: models.MedicoSecretariaPermisos,
              where: {
                medico_secretarias_id: secr.id
              },
              attributes: ['permiso']
            }],
            order: [['id','ASC']]
          }).then(function(permisos){
            secr.permisos = permisos;
            total++;
            if ( total == secretarias.length){
              res.render('medico/secretaria',{
                secretaria:secretarias.length,
                secretarias: secretarias
              });
            }
          });
        });
      } else {
        res.render('medico/secretaria',{
          secretaria:secretarias.length
        });
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.registrar = function (object, req, res){
  try{
    var token = object.token;
    models.SecretariaInvitacion.findOne({
      where: {
        token: token,
        atendido: 0
      },
      include: [{
        model: models.Medico,
        attributes: ['id'],
        include: [{
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil'],
          include: [{
            model: models.DatosGenerales
          }]
        }]
      }]
    }).then(function(invitacion){
      if (invitacion){
          //Buscar si la secretaria ya esta registrada
          models.Usuario.findOne({
            where:{correo:invitacion.correo}
          }).then(function(usuario){
            if (!usuario){
              //Registrar
              models.Estado.findAll({
                order: [['id','ASC']]
              }).then(function(estado){
                res.render('secretaria/registrar',{invitacion: invitacion, estados: estado});
              });
            }else {
              if (!(req.session.passport && req.session.passport.user && req.session.passport.user.id>0)){
                //Iniciar sesión
                res.render('secretaria/login',{invitacion: invitacion});
              } else if (req.session.passport.user.id == usuario.id){
                //Si usuario == sesion activa, crear relacion medico-secretaria y mostrar pantalla con notificacion de relación
                models.MedicoSecretaria.findOrCreate({
                  where: {
                    secretaria_id: req.session.passport.user.Secretaria_id,
                    medico_id: invitacion.medico_id
                  },
                  defaults: {
                    secretaria_id: req.session.passport.user.Secretaria_id,
                    medico_id: invitacion.medico_id,
                    activo: 1
                  }
                }).spread(function(MedicoSecretaria, created) {
                  if (!created){
                    MedicoSecretaria.update({activo:1});
                  }
                  invitacion.destroy();
                  exports.reiniciarPermisos(MedicoSecretaria, req);
                  models.Medico.findOne({where: {id:invitacion.medico_id}, include: [{model: models.Usuario, attributes:['id']}]}).then(function(medico){
                    models.Notificacion.create({
                      usuario_id: medico.Usuario.id,
                      data: req.session.passport.user.Secretaria_id.toString(),
                      tipoNotificacion_id: 33
                    });
                  });
                  models.Medico.findOne({
                    where: {
                      id: MedicoSecretaria.medico_id
                    },
                    attributes:['id'],
                    include: [{
                      model: models.Usuario,
                      attributes: ['id','usuarioUrl','urlFotoPerfil'],
                      include: [{
                        model: models.DatosGenerales
                      },{
                        model: models.Direccion,
                        attributes: ['id'],
                        order: [['principal','desc']],
                        include: [{
                          model: models.Municipio,
                          include: [{model: models.Estado}]
                        }]
                      }]
                    },{
                      model: models.Especialidad
                    }]
                  }).then(function(medico){
                    res.render('secretaria/relacioncreada',medico);
                  });
                });
              } else {
                //Permiso denegado
                res.redirect('/');
              }
            }
          });
      } else {
        res.send('la invitación ya no existe');
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.registrarcontoken = function (object, req, res){
  try{
    //Revisar si correo existe
    models.Usuario.findOne({
      where: {
        correo: object.correo
      }
    }).then(function(usuario){
      if (!usuario){
        //Crear Usuario
        models.sequelize.transaction( {
            isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
          }, function ( t ) {
            //Revisar que invitación exista
            return models.SecretariaInvitacion.findOne({
              where: { token: object.token }
            }, {transaction: t} ).then(function(invitacion){
              if (invitacion){
                return models.Usuario.create({
                  correo: object.correo,
                  password: object.pass,
                  tipoUsuario: 'S',
                  tipoRegistro: 'C',
                  estatusActivacion: 1
                }, {transaction: t} ).then(function(usuario){
                  return models.Secretaria.create({
                    usuario_id: usuario.id,
                    estado_id: object.estado,
                    municipio_id: object.municipio
                  }, {transaction: t} ).then(function(secretaria){
                    return models.DatosGenerales.create({
                      nombre: object.nombre,
                      apellidoP: object.paterno,
                      apellidoM: object.materno,
                      usuario_id: usuario.id
                    }, {transaction: t} ).then(function(dg){
                      return models.MedicoSecretaria.create({
                        medico_id: invitacion.medico_id,
                        secretaria_id: secretaria.id
                      }, {transaction: t} ).then(function(MedicoSecretaria){
                        usuarios.generarSesion(req,res,usuario.id,false,true);
                      });
                    });
                  });
                });
              }else {
                res.status(200).json({success:false,result: {invitacion: invitacion}})
              }
            });
          });
      } else {
          res.status(200).json({success:false,result: 'el correo ya existe'})
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.invitar = function ( object, req, res ) {
  try{
    models.MedicoSecretaria.findOne({
      where: {medico_id: req.session.passport.user.Medico_id, activo:1},
      attributes: ['id'],
      include: [{
          model: models.Secretaria,
          attributes: ['id'],
          include: [{
              model: models.Usuario,
              attributes: ['id','correo'],
              where: { correo: object.email}
            }]
        }]
    }).then(function(MedicoSecretaria){
      if (!MedicoSecretaria){
        models.Usuario.findOne({
          where: {
            correo: object.email
          }
        }).then(function(usuario){
          if (!usuario || usuario.tipoUsuario == "S"){
            if (usuario){
              models.Notificacion.create({
                usuario_id: usuario.id,
                tipoNotificacion_id: 31,
                data: req.session.passport.user.Medico_id.toString()
              });
            }
            var tokens = String( cryptomaniacs.doEncriptToken( req.session.passport.user.Medico_id+'-'+object.email ));
            models.SecretariaInvitacion.findOrCreate({
              where: {
                correo: object.email,
                medico_id: req.session.passport.user.Medico_id
              },
              defaults: {
                correo: object.email,
                medico_id: req.session.passport.user.Medico_id,
                token:tokens
              }
            }).spread(function(invitacion, created) {
              if (!created){
                invitacion.update({atendido:0});
              }
              var nombreSesion = req.session.passport.user.name;
              var enlace = 'localhost:3000/secretaria/'+tokens;

              var objecto = {
                to: object.email,
                subject: 'Invitación a Intermed',
                nombreSesion: nombreSesion,
                enlace: enlace
              };
              mail.send( objecto, 'invitarSecretaria');


              res.status(200).json({
                success: true,
                result: {
                  invitacion_id: invitacion.id
                }
              });
            });
          } else {
            res.status(200).json({success:false, msg:'El usuario con el correo \''+ object.email  +'\' no es secretaria.'});
          }
        });
      } else {
        res.status(200).json({success:false, msg:'El usuario con el correo \''+ object.email  +'\' es actualmente tu secretaria.'});
      }
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.buscar = function (object, req, res){
  //console.log('Filtro: ' + JSON.stringify(object.filtro));
  if (object.tipoBusqueda == 2){
      models.MedicoSecretaria.findAll({
        where: {medico_id: req.session.passport.user.Medico_id,activo:1},
        attributes: ['secretaria_id']
      }).then(function(missecretarias){
          models.SecretariaInvitacion.findAll({
            where: {medico_id: req.session.passport.user.Medico_id,atendido:0},
            attributes: ['correo']
          }).then(function(misinvitaciones){
            models.Secretaria.findAll({
              include: [{
                model: models.Usuario,
                attributes: ['id','usuarioUrl','urlPersonal','urlFotoPerfil','correo'],
                where: {
                  correo: {$like: '%'+ object.filtro +'%'}
                },
                include: [{
                  model: models.DatosGenerales
                }]
              },{
                model: models.Municipio
              },{
                model: models.Estado
              }]
            }).then(function(result){
              res.status(200).json({success:true,result: result,missecretarias:missecretarias,misinvitaciones: misinvitaciones});
            });
          });
      });

  } else if(object.tipoBusqueda == 1){
    var filtros = object.filtro.toString().split(" ");
    var where = new Array();

    filtros.forEach(function(result){
      if (result != ""){
        where.push(models.sequelize.or(
            {nombre: {$like: '%'+ result +'%'}},
            {apellidoP: {$like: '%'+ result +'%'}},
            {apellidoM: {$like: '%'+ result +'%'}}
        ));
      }
    });

    models.MedicoSecretaria.findAll({
      where: {medico_id: req.session.passport.user.Medico_id,activo:1},
      attributes: ['secretaria_id']
    }).then(function(missecretarias){
      models.SecretariaInvitacion.findAll({
        where: {medico_id: req.session.passport.user.Medico_id,atendido:0},
        attributes: ['correo']
      }).then(function(misinvitaciones){
        models.Secretaria.findAll({
          include: [{
            model: models.Usuario,
            attributes: ['id','usuarioUrl','urlPersonal','urlFotoPerfil','correo'],
            include: [{
              model: models.DatosGenerales,
              where: where
            }]
          },{
            model: models.Municipio
          },{
            model: models.Estado
          }]
        }).then(function(result){
          res.status(200).json({success:true,result: result,missecretarias:missecretarias,misinvitaciones: misinvitaciones});
        });
      });
    });
  }
}

exports.eliminarInvitacion = function (object, req, res){
  models.Secretaria.findOne({
    attributes: ['id'],
    where: {id: object.secretaria_id},
    include: [{
      model: models.Usuario,
      attributes: ['correo']
    }]
  }).then(function(result){
    models.SecretariaInvitacion.destroy({
      where: {
        medico_id: req.session.passport.user.Medico_id,
        correo: result.Usuario.correo
      }
    }).then(function(){
      res.status(200).json({success:true})
    })
  })
}

exports.reiniciarPermisos = function (MedicoSecretaria, req, res){
  models.SecretariaPermisos.findAll({
    order: [['id','ASC']]
  }).then(function(permisos){
    var total = 0;
    permisos.forEach(function(perm){
      models.MedicoSecretariaPermisos.findOrCreate({
        where: {medico_secretarias_id: MedicoSecretaria.id, secretaria_permiso_id: perm.id},
        defaults: {medico_secretarias_id: MedicoSecretaria.id, secretaria_permiso_id: perm.id, permiso: perm.default},
      }).spread(function(MedicoSecretariaPermiso, created){
        if (!created){
          //actualizar permisos a default si ya existian
          MedicoSecretariaPermiso.update({
            permiso: perm.default
          }).then(function(result){
            total++;
            if (total == permisos.length){
              if (res){
                res.status(200).json({success:true,result: MedicoSecretaria});
              }
            }
          });
        } else {
          total++;
          if (total == permisos.length){
            if (res){
            res.status(200).json({success:true,result: MedicoSecretaria});
            }
          }
        }
      });
    });
  });
}

exports.agregar = function (object, req, res){
  models.Secretaria.findOne({
    where: {id: object.secretaria_id},
    include: [{
      model: models.Usuario,
      attributes:['correo']
    }]
  }).then(function(secretaria){
    var tokens = String( cryptomaniacs.doEncriptToken( req.session.passport.user.Medico_id+'-'+secretaria.Usuario.correo ));
    models.SecretariaInvitacion.findOrCreate({
        where: {medico_id: req.session.passport.user.Medico_id, correo: secretaria.Usuario.correo},
        defaults: {medico_id: req.session.passport.user.Medico_id, correo: secretaria.Usuario.correo, token:tokens}
    }).spread(function(invitacion, created){
        var objecto = {
          to: secretaria.Usuario.correo,
          subject: 'Invitación a Intermed',
          nombreSesion: req.session.passport.user.name,
          enlace: 'localhost:3000/secretaria/'+tokens
        };
        mail.send( objecto, 'invitarSecretaria');
      if (!created){
        invitacion.update({atendido:0}).then(function(invitacion){
          res.status(200).json({success:true})
        });
      } else {
        res.status(200).json({success:true})
      }
    });
  });
}

exports.eliminar = function (object, req, res){
  models.MedicoSecretaria.findOne({
    where: {medico_id: req.session.passport.user.Medico_id, secretaria_id: object.secretaria_id, activo:1}
  }).then(function(MedicoSecretaria) {
    if (MedicoSecretaria){
      models.Secretaria.findOne({
        where: {id: object.secretaria_id},
        attributes: ['id','usuario_id']
      }).then(function(secretaria){
        models.Notificacion.create({
          usuario_id: secretaria.usuario_id,
          tipoNotificacion_id: 32,
          data: req.session.passport.user.Medico_id.toString()
        });
      })
      MedicoSecretaria.update({activo:0}).then(function(result){
        models.MedicoSecretariaPermisos.update({permiso:0},{
          where:{
            medico_secretarias_id: MedicoSecretaria.id
          }
        }).then(function(permisos){
          res.status(200).json({success:true,result: MedicoSecretaria});
        });
      });
    } else {
      res.status(200).json({success:false,result: MedicoSecretaria});
    }
  });
}

exports.permisoscambiar = function (object, req, res){
  models.MedicoSecretariaPermisos.findOne({
    where: {
      medico_secretarias_id: object.MedicoSecretariaPermisos_id,
      secretaria_permiso_id: object.permiso_id
    },
    include: [{
      model: models.MedicoSecretaria,
      where: {
        medico_id: req.session.passport.user.Medico_id
      }
    }]
  }).then(function(permiso){
    if (permiso){
      permiso.update({permiso: object.permiso}).then(function(result){
        res.status(200).json({success:true, result: result})
      });
    } else {
      //No existe el permiso, crear
      res.status(200).json({success:false})
    }
  });
}

exports.invitacionAceptar = function (object, req, res){
  models.Usuario.findOne({
    where: {
      id: req.session.passport.user.id
    }
  }).then(function(usuario){
    models.SecretariaInvitacion.findOne({
      where: {
        medico_id: object.medico_id,
        correo: usuario.correo
      }
    }).then(function(invitacion){
      if (invitacion){
        //Crear relacion medico-secretaria
        models.MedicoSecretaria.findOrCreate({
          where:{secretaria_id: req.session.passport.user.Secretaria_id, medico_id: object.medico_id},
          defaults: {secretaria_id: req.session.passport.user.Secretaria_id, medico_id: object.medico_id, activo: 1},
        }).spread(function(MedicoSecretaria, created){
          exports.reiniciarPermisos(MedicoSecretaria,req);
          invitacion.destroy();
          models.Medico.findOne({where: {id: object.medico_id}, include: [{model: models.Usuario, attributes:['id']}]}).then(function(medico){
            models.Notificacion.create({
              usuario_id: medico.Usuario.id,
              data: req.session.passport.user.Secretaria_id.toString(),
              tipoNotificacion_id: 33
            });
          });
          if (!created){
            MedicoSecretaria.update({
              activo: 1
            }).then(function(){
              //Notificación a médico de secretaria aceptación invitación
              res.status(200).json({success:true});
            });
          } else {
            //Notificación a médico de secretaria aceptación invitación
            res.status(200).json({success:true});
          }
        });
      } else {
        res.status(200).json({success:false});
      }
    });
  });
}


exports.invitacionRechazar = function (object, req, res){
  //Eliminar invitacion con correo de secretaria y medico_id
  models.Usuario.findOne({
    where: {
      id: req.session.passport.user.id
    }
  }).then(function(usuario){
    models.SecretariaInvitacion.destroy({
      where: {
        medico_id: object.medico_id,
        correo: usuario.correo
      }
    }).then(function(invitacion){
      models.Medico.findOne({where: {id: object.medico_id}, include: [{model: models.Usuario, attributes:['id']}]}).then(function(medico){
        models.Notificacion.create({
          usuario_id: medico.Usuario.id,
          data: req.session.passport.user.Secretaria_id.toString(),
          tipoNotificacion_id: 34
        });
      });
      //Notificación a médico de secretaria rechazo invitación
      res.status(200).json({success:true, result: invitacion});
    });
  });
}

exports.medicoEliminar = function (object, req, res){
  models.MedicoSecretaria.findOne({
    where: {
      medico_id: object.medico_id,
      secretaria_id: req.session.passport.user.Secretaria_id
    },
    include: [{
      model: models.Medico,
      attributes: ['id','usuario_id']
    }]
  }).then(function(MedicoSecretaria){
    if (MedicoSecretaria){
      MedicoSecretaria.update({activo:0}).then(function(MedicoSecretaria){
          models.MedicoSecretariaPermisos.update({permiso:0},{
            where:{
              medico_secretarias_id: MedicoSecretaria.id
            }
          }).then(function(permisos){
            models.Notificacion.create({
              usuario_id: MedicoSecretaria.Medico.usuario_id,
              tipoNotificacion_id: 35,
              data: req.session.passport.user.Secretaria_id.toString()
            });

            res.status(200).json({success:true,result: MedicoSecretaria});
          });
      });
    } else {
      res.status(200).json({success:false});
    }
  });
}

exports.citasProximas = function (object, req, res){
  models.Agenda.findAll({
    where: {
      fechaHoraInicio: {
        $between: [new Date(object.fechainicio),new Date(object.fechafin)]
      },
      status: 1
    },
    order: [['fechaHoraInicio','ASC']],
    include: [{
      model: models.Direccion,
      attributes: ['nombre'],
    },{
      model: models.CatalogoServicios,
      attributes: ['concepto'],
    },{
      model: models.Paciente,
      attributes: ['id'],
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.DatosGenerales
        }]
      }]
    },{
      model: models.PacienteTemporal,
    },{
      model: models.Usuario,
      attributes: ['id'],
      include: [{
        model: models.Medico,
        attributes: ['id'],
        include: [{
          model: models.MedicoSecretaria,
          where: {
            medico_id: {
              $in: object.medicos
            },
            activo: 1,
            secretaria_id: req.session.passport.user.Secretaria_id
          },
          attributes: ['id']
        }]
      }]
    }]
  }).then(function(result){
      res.status(200).json({success:true,result:result});
  });
}

exports.citaGuardarNota = function (object, req, res){
  models.Agenda.findOne({
    where: {
      id: object.agenda_id
    },
    include: [{
      model: models.Usuario,
      attributes: ['id'],
      include: [{
        model: models.Medico,
        attributes: ['id'],
        include: [{
          model: models.MedicoSecretaria,
          attributes: ['id'],
          where:{
            secretaria_id: req.session.passport.user.Secretaria_id,
            activo: 1
          }
        }]
      }]
    }]
  }).then(function(agenda){
    if (agenda){
      agenda.update({nota:object.nota}).then(function(result){
        res.status(200).json({success:true,result:result});
      });
    } else {
      res.status(200).json({success:false,result:agenda});
    }
  });
}

exports.medicoOficina = function (object, req, res){
  var usuarioUrl = object.usuarioUrl;
  models.Usuario.findOne({
    where: {
      usuarioUrl: usuarioUrl
    },
    attributes: ['usuarioUrl','urlPersonal','urlFotoPerfil'],
    include: [{
      model: models.DatosGenerales
    },{
      model: models.Medico,
      attributes: ['id']
    }]
  }).then(function(usuariomedico){
    res.render('secretaria/oficinaMedico',usuariomedico);
  });
}

exports.updateInfo = function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user) {
        models.DatosGenerales.update({
          nombre: object.nombre,
          apellidoP: object.apellidoP,
          apellidoM: object.apellidoM
        },{
          where: {
            usuario_id: req.session.passport.user.id
          }
        }).then(function(result){
          models.Secretaria.update({
            estado_id: object.estado_id,
            municipio_id: object.municipio_id
          },{
            where: {
              usuario_id: req.session.passport.user.id
            }
          }).then(function(){
            if (result){
                res.status( 200 ).json({success:true, result: result});
            } else {
                res.status( 200 ).json({success:false});
            }
          })
        });
      }
      else {
        res.status( 200 )
            .send({success:false,error:1});
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
}


exports.getInfo = function (object, req, res){
  try{
    if (req.session &&  req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Usuario.findOne({
        where:{id:usuario_id},
        attributes:['urlFotoPerfil','correo'],
        include:[{
          model: models.DatosGenerales,
          attributes:['nombre','apellidoP','apellidoM']
        },{
          model: models.Secretaria
        }]
      }).then(function(usuario){
        res.send(usuario);
      });
    }
  }catch ( err ) {
    console.log('ERROR: ' + err);
    //req.errorHandler.report(err, req, res);
  }
}



function formatearFecha(fecha){
  var fecha = new Date(fecha);
  var año = fecha.getFullYear();
  var mes = ("0" + (fecha.getMonth()+1)).slice(-2);
  var dia = ("0" + fecha.getDate()).slice(-2);
  var hora = ("0" + fecha.getHours()).slice(-2);
  var minutos = ("0" + fecha.getMinutes()).slice(-2);
  var segundos = ("0" + fecha.getSeconds()).slice(-2);
  return año + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
}
