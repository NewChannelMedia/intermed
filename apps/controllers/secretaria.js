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
            }]
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
        $between: [object.fechainicio,object.fechafin]
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

exports.detalleCita = function (object, req, res){
  models.Agenda.findOne({
    where: {
      id: object.agenda_id
    },
    include: [{
      model:models.Usuario,
      attributes: ['urlFotoPerfil','correo'],
      include: [{
        model: models.DatosGenerales
      },{
        model: models.Medico,
        attributes: ['id'],
        include: [{
          model: models.MedicoSecretaria,
          where: {
            secretaria_id: req.session.passport.user.Secretaria_id,
            activo: 1
          },
          attributes: ['id']
        }]
      }]
    },{
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
        attributes: ['id','urlFotoPerfil'],
        include: [{
          model: models.DatosGenerales
        }]
      }]
    },{
      model: models.PacienteTemporal
    }]
  }).then(function(result){
      res.status(200).json({success:true,result:result});
  })
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
    /*
    UsuarioMedico: {
      "usuarioUrl":"0000001",
      "urlPersonal":null,
      "urlFotoPerfil":"/garage/profilepics/dpp.png",
      "DatosGenerale":{
        "id":2,
        "nombre":"Medico",
        "apellidoP":"De Prueba",
        "apellidoM":"Uno",
        "usuario_id":1
      },
      "Medico":{
        "id":1
      }
    }
    */
    console.log('UsuarioMedico: ' + JSON.stringify(usuariomedico));
    res.render('secretaria/oficinaMedico',usuariomedico);
  });
}

exports.traerAgendaMedico = function (object, req, res){
  models.MedicoSecretaria.findOne({
    where:{
      secretaria_id: req.session.passport.user.Secretaria_id,
      medico_id: object.medico_id,
      activo:1
    },
    include: [{
      model: models.Medico,
      attributes:['id'],
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.Direccion,
          attributes: ['id']
        }]
      }]
    }]
  }).then(function(relacion){
    object.direccion_id = [];
    relacion.Medico.Usuario.Direccions.forEach(function (dir){
      object.direccion_id.push(dir.id);
    });
    if (relacion){
      //Secretaria cuenta con permisos para ver agenda
      exports.agendaMedico(object, req, res);
    } else {
      res.status(200).json({
        success: false,
        result: {
          relacion: relacion
        }
      });
    }
  })
}

exports.agendaMedico = function (object, req, res){
  try{
    var resultado = [];
    models.Horarios.findAll({
       where :  {
         direccion_id: {
           $in: object.direccion_id
         }
       },
       include: [{
         model: models.Direccion
       }]
    }).then(function(datos) {
      var horaInicio;
      var horaFin;

      var dia0 = object.inicio +' ';

      var inicio = object.inicio.split('-');
      var fin = object.fin.split('-');

      var dia1 = '';
      var dia2 = '';
      var dia3 = '';
      var dia4 = '';
      var dia5 = '';
      var dia6 = '';
      if (fin[2]<inicio[2]){
        //cambio de mes
        var ultimo = parseInt(fin[2]);
        if (ultimo > 1){
          dia6 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
          if (ultimo>1){
            dia5 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
            if (ultimo>1){
              dia4 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
              if (ultimo>1){
                dia3 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
                if (ultimo>1){
                  dia2 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
                  if (ultimo>1){
                    dia1 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
                  } else {
                    dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                  }
                } else {
                    dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                    dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
                }
              } else {
                  dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                  dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
                  dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
              }
            } else {
                dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
                dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
                dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
            }
          } else {
              dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
              dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
              dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
              dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
              dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
          }
        } else {
          dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
          dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
          dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
          dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
          dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
          dia6 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+6)).slice(-2) + ' ';
        }
      } else {
        dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
        dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
        dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
        dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
        dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
        dia6 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+6)).slice(-2) + ' ';
      }

      var total = 0;
      var className = [];
      for (i = 0; i <= datos.length - 1; i++) {

          if (!className[datos[i].direccion_id]){
            className[datos[i].direccion_id] = 'direccion_'+total++;
          }

          switch (datos[i].dia) {
              case 0: //domingo
                  horaInicio = dia6 + datos[i].horaInicio;
                  horaFin = dia6 + datos[i].horaFin;
                  break;
              case 1: //lunes
                  horaInicio = dia0 + datos[i].horaInicio;
                  horaFin = dia0 + datos[i].horaFin;
                  break;
              case 2: //martes
                  horaInicio = dia1 + datos[i].horaInicio;
                  horaFin = dia1 + datos[i].horaFin;
                  break;
              case 3: //miercoles
                  horaInicio = dia2 + datos[i].horaInicio;
                  horaFin = dia2 + datos[i].horaFin;
                  break;
              case 4: //jueves
                  horaInicio = dia3 + datos[i].horaInicio;
                  horaFin = dia3 + datos[i].horaFin;
                  break;
              case 5: //viernes
                  horaInicio = dia4 + datos[i].horaInicio;
                  horaFin = dia4 + datos[i].horaFin;
                  break;
              case 6: //sabado
                  horaInicio = dia5 + datos[i].horaInicio;
                  horaFin = dia5 + datos[i].horaFin;
                  break;
          };

          var horario = {
              //id: 'businessHours_' +  datos[i].id,
              title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
              start: horaInicio,
              end: horaFin,
              className : className[datos[i].direccion_id],
              constraint: 'businessHours',
              rendering: 'background',
              overlap: false,
              //constraint: 'businessHours'
              //dow: [datos[i].dia]
          };
          resultado.push(horario);
      };

      var fechaActual = formatearFecha(new Date());
      models.Agenda.findAll({
         where :  { direccion_id: object.direccion_id,
                    fechaHoraInicio: {
                      $gte: object.inicio,
                      $lte: object.fin
                    },
                    status: {
                      $gt: 0
                    }
                    },
                    include: [{
                      model: models.Paciente,
                      include: [{
                        model: models.Usuario,
                        include: [{
                          model: models.DatosGenerales
                        }]
                      }]
                    },{
                      model: models.PacienteTemporal
                    }]
      }).then(function(datos) {
        for (i = 0; i <= datos.length - 1; i++) {
          var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

          var clase = 'citaPend ' + className[datos[i].direccion_id];
          if (new Date(fechaEvento).toISOString().split('.000Z')[0].replace('T',' ') <= fechaActual){
            clase = 'citaPast ' + className[datos[i].direccion_id]
          }
          
          if (datos[i].status == 1 ) {
            var titulo = '';
            if (datos[i].Paciente){
              titulo = datos[i].Paciente.Usuario.DatosGenerale.nombre + ' ' + datos[i].Paciente.Usuario.DatosGenerale.apellidoP + datos[i].Paciente.Usuario.DatosGenerale.apellidoM;
            } else {
              titulo = datos[i].PacienteTemporal.nombres  + ' ' + datos[i].PacienteTemporal.apellidos;
            }
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: titulo,
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                className: clase,
                editable: false,
                durationEditable: false,
                overlap: false,
                slotEventOverlap: false,
            };
          }  else {
            clase += ' citaCanc';
            var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'Cancelada',
              className: clase,
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              editable: false,
              durationEditable: false,
              overlap: false,
              slotEventOverlap: false,
            };
          }
          resultado.push(horario);
        }
        res.send(resultado);
      });
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.serviciosPorHorario = function (object, req, res){
  var day = new Date(object.inicio).getDay();
  object.inicio = new Date(object.inicio).toISOString();
  object.inicio = object.inicio.split('T')[1].split(':00.00')[0]
  console.log('Inicio: ' + object.inicio)
  console.log('Day: ' + day)
  models.CatalogoServicios.findAll({
    include: [{
      model: models.Direccion,
      attributes: ['id'],
      include: [{
        model: models.Horarios,
        attributes: ['id','dia','horaInicio','horaFin'],
        where: {
          horaInicio :{
            $lte: object.inicio
          },
          horaFin: {
            $gt:object.inicio
          },
          dia: day
        }
      },{
        model: models.Usuario,
        attributes: ['id'],
        include: [{ model: models.Medico, where: { id: object.medico_id}}]
      }]
    }]
  }).then(function(result){
    res.status(200).json({
      success: false, result: result
    })
  });
}

exports.crearCita = function (object, req, res){
  models.Medico.findOne({
    where:{
      id: object.medico_id
    }
  }).then(function(medico){
    models.CatalogoServicios.findOne({
      where: {
        id: object.servicio_id
      }
    }).then(function(servicio){
      if (object.paciente_id){
        models.Agenda.create({
          usuario_id: medico.usuario_id,
          paciente_id: object.paciente_id,
          fechaHoraInicio: object.inicio,
          fechaHoraFin: object.fin,
          direccion_id: servicio.direccion_id,
          servicio_id: servicio.id,
          status:1
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result
          })
        });
      } else {
        //Crear paciente temporal
        models.PacienteTemporal.create({
          nombres: object.nombre,
          apellidos: object.apellido,
          correo: object.correo,
          celular: object.celular
        }).then(function(PacienteTemporal){
            models.Agenda.create({
              usuario_id: medico.usuario_id,
              paciente_temporal_id: PacienteTemporal.id,
              fechaHoraInicio: object.inicio,
              fechaHoraFin: object.fin,
              direccion_id: servicio.direccion_id,
              servicio_id: servicio.id,
              status:1
            }).then(function(result){
              res.status(200).json({
                success: true,
                result: result
              })
            });
        });
      }
    });
  });
}

exports.cancelarCita = function(object, req, res){
  console.log('OBJECT: ' + JSON.stringify(object));
  //{"agenda_id":"31","medico":"true"}
  models.Agenda.findOne({
    where: {
      id: object.agenda_id
    },
    include: [{
      model: models.Usuario,
      attributes: ['id'],
      include: [{
        model: models.Medico,
        include: [{
          model: models.MedicoSecretaria,
          where: {activo: 1},
          include: [{
            model: models.Secretaria,
            where: {
              id: req.session.passport.user.Secretaria_id
            }
          }]
        }]
      }]
    }]
  }).then(function(agenda){
    console.log('AGENDA: ' + JSON.stringify(agenda));
    if (object.medico){
      agenda.update({status: 2}).then(function(agenda){
          console.log('Ag: ' + JSON.stringify(agenda));
      });
    } else {
      agenda.update({status: 0}).then(function(agenda){
          console.log('Ag: ' + JSON.stringify(agenda));
      });
    }
    console.log('Notificaciones');
      res.status(200).json({
        success: true,
        result:1
      })
  });

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
