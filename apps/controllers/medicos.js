var models = require( '../models' );
var cryptomaniacs = require( './encryption' );
var mail = require( './emailSender' );

/**
Controlador de para médicos
*	@author Ivan Salcedo
*	@version 0.0.0.0
*/

var _this = module.exports = {

  obtieneMedicos: function ( object, req, res ) {
    middle.obtieneMedicos( function ( datos ) {
      res.send( datos );
    } );
  },

  obtieneAjax: function ( object, req, res ) {
    models.Medico.findAll( {
      include: [
        {
          model: models.Usuario
        },
        {
          model: models.Especialidad
        }
      ]
    } ).then( function ( datos ) {
      res.send( datos );
    } );
  },

  seleccionaRegistrados: function(object, req, res) {
          models.Usuario.findAll({
            include: [{ model: models.DatosGenerales },
              { model: models.Medico, include :[{model: models.Especialidad}]},
              { model : models.Direccion,
                include :[{ model : models.Localidad},
                  { model : models.Municipio,
                    include :[{ model : models.Estado}]}
                ]}
            ]
          }).then(function(medico) {
              // enviando datos
              res.send(medico);
          });
  },

  // Método que muesta la pantalla de registro
  selecciona: function(object, req, res) {
		//Obteniendo estados
  	  models.Estado.findAll().then(function(estados) {
  			// Obteniendo especialidades
  			models.Especialidad.findAll().then(function(especialidades) {
          // Obteniendo médicos
          models.Usuario.findAll({
            include: [{ model: models.DatosGenerales },
              { model: models.Medico },
              { model: models.Direccion}
            ]}
          ).then(function(medicos) {
      				//Rendereando index y pasando los registros a la vista
        		  res.render('medicos/registro', {
        		    estados: estados,
        				especialidades : especialidades,
                medicos: medicos
        			});
          });
  		});
  	});
  },

  seleccionaEdicion: function(object, req, res) {
		//Obteniendo usuarios para edicion por ajax
          models.Usuario.findOne({
            where : { id : object.id },
            include: [{ model: models.DatosGenerales },
              { model: models.Medico, include :[{model: models.Especialidad}]},
              { model : models.Direccion,
                include :[{ model : models.Localidad},
                  { model : models.Municipio,
                    include :[{ model : models.Estado}]}
                ]}
            ]
          }).then(function(medico) {
              // enviando datos
              res.send(medico);
          });
  },

  // Método que registra médicos
  registrar: function(object, req, res) {
      var id  = 0;
      // Inicia transacción de registro de médicos
      models.sequelize.transaction({
          isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, function (t) {

          // Creando usuario
          return models.Usuario.create({
              usuario: object['correoMed'],
              correo:  object['correoMed'],
              password: 'intermed123',
              tipoUsuario: 'M',
              tipoRegistro: 'D',
              estatusActivacion : 0
          }, {transaction: t})
          .then(function(usuario) {
              // si fue exitoso, actualizamos  datos generales, direcciones, telefonos y médicos
              // tomamos el id que le toco al usuario
              id = usuario.id;

              return models.DatosGenerales.create({
                nombre: object['nombreMed'],
                apellidoP: object['apellidoMed'],
                apellidoM: object['apellidoMMed'],
                rfc: '',
                usuario_id: id
            }, {transaction: t}).then(function (result){
                  return models.Direccion.create({
                    calle: object['calleMed'],
                numero: object['numeroMed'],
                calle1: object['calle1Med'],
                calle2: object['calle2Med'],
                localidad_id: object.coloniaMed,
                municipio_id: object.ciudadMed,
                principal: 1,
                usuario_id: id
                }, {transaction: t});
            });
          });
        }).then(function(result) {
            // transacción completa
            models.Usuario.findOne({
              where : { id : id },
              include: [{ model: models.DatosGenerales },
                { model: models.Medico, include :[{model: models.Especialidad}]},
                { model : models.Direccion,
                  include :[{ model : models.Localidad},
                    { model : models.Municipio,
                      include :[{ model : models.Estado}]}
                  ]}
              ]
            }).then(function(medico) {
                // enviando datos
                res.send(medico);
            });
        }).catch(function(err) {
            console.log('ERROR: ' + err);
            res.status(200).json({error:err});
        });
    },

    actualizar2: function(object, req, res) {
      middle.guardaMedicos(object, function(datos) {
        res.send(datos);
      });
    },

    // Método para actualizar médicos
    actualizar: function(object, req, res) {
        var id = object.id;
        var idMedico = 0;

    // Obteniendo el id del médico a partir del id de usuario
    models.Medico.findOne( {
      where: {
        usuario_id: id
      }
    } ).then( function ( datos ) {
      idMedico = datos.id;
    } );

    models.sequelize.transaction( {
      isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, function ( t ) {

      // actualizando usuario
      models.Usuario.update( {
        usuario: object[ 'correoMed' ],
        correo: object[ 'correoMed' ]
      }, {
        where: {
          id: id
        }
      } );

      // actualizando nombres
      models.DatosGenerales.update( {
        nombre: object[ 'nombreMed' ],
        apellidoP: object[ 'apellidoMed' ],
        apellidoM: object[ 'apellidoMMed' ]
      }, {
        where: {
          usuario_id: id
        }
      } );

              // actualizando dirección
              models.Direccion.update({
                   calle: object['calleMed'],
                   numero: object['numeroMed'],
                   calle1: object['calle1Med'],
                   calle2: object['calle2Med'],
                   colonia: object['coloniaMed'],
                   localidad_id: object['coloniaMed']
                 }, {
                   where: { usuario_id : id }
               });

               models.Medico.findOne({
                 where: {usuario_id : id}
               }).then(function(datos) {
                 models.MedicoEspecialidad.update({
                     especialidad_id: object['especialidadMed']
                   }, {
                     where: { medico_id : datos.id }
                 });
               });
          }).then(function(result) {
                // transacción completa
                res.json({ok: true});
          }).catch(function(err) {
              models.Usuario.findOne({
                where : { id : id },
                include: [{ model: models.DatosGenerales },
                  { model: models.Medico, include :[{model: models.Especialidad}]},
                  { model : models.Direccion,
                    include :[{ model : models.Localidad},
                      { model : models.Municipio,
                        include :[{ model : models.Estado}]}
                    ]}
                ]
              }).then(function(medico) {
                  // enviando datos
                  res.send(medico);
              });
              //  res.json({error: err});
          });
    },
    // obtiene id medico @alan
    seleccionaMedico: function(object, req, res) {
      var idEstado= 0;
      var idMunicipio= 0;
      var idLocalidad=0;
      var idEspecialidad=0;

      models.Estado.findAll().then(function(estados) {
        // Obteniendo especialidades
        models.Especialidad.findAll().then(function(especialidades) {
          // Obteniendo médicos
            models.Usuario.findOne({
              where : { id : object.id },
              include: [{ model: models.DatosGenerales},
                { model: models.Medico, include :[{model: models.Especialidad}]},
                { model : models.Direccion,
                  include :[{ model : models.Localidad},
                    { model : models.Municipio,
                      include :[{ model : models.Estado}]}
                  ]}
              ]
            }).then(function(medico) {
              idEstado  = medico.Direccions[0].Municipio.estado_id;
              idMunicipio  =  medico.Direccions[0].Municipio.id;
              idLocalidad  = medico.Direccions[0].Localidad.id;
              idEspecialidad  = medico.Medico.Especialidads[0].id;
              //Rendereando index y pasando los registros a la vista
                models.Municipio.findAll({
                  where: {estado_id: idEstado},
                  order: ['municipio'], attributes: ['id','municipio']
                }).then(function(municipios) {
                    models.Localidad.findAll({
                      where: {municipio_id: idMunicipio},
                      order: ['localidad'], attributes: ['id','localidad']
                    }).then(function(localidades) {
                      res.render('actualizar', {
                        layout: null,
                        estados: estados,
                        especialidades : especialidades,
                        medico: medico,
                        municipios: municipios,
                        localidades : localidades,
                        idEstado: idEstado,
                        idMunicipio: idMunicipio,
                        idLocalidad: idLocalidad,
                        idEspecialidad: idEspecialidad
                      });
                   });
                });
          });
      });
    });

      /*
        models.Usuario.findOne({
          where : { id : object.id },
          include: [{ model: models.DatosGenerales },
            { model: models.Medico },
            { model: models.Direccion}
          ]
        }).then(function(medico) {
        				//Rendereando index y pasando los registros a la vista
          		  res.render('actualizar', {
                  layout: null,
                  medico: medico
          			});
            });*/
    },
    // obtiene id medico
    seleccionaTodosMedico: function(object, req, res) {
        models.Usuario.findAll({
          include: [{ model: models.DatosGenerales },
            { model: models.Medico },
            { model: models.Direccion}
          ]
        }).then(function(medico) {
            //Rendereando index y pasando los registros a la vista
            res.render('actualizar', {
              layout: null,
              medico: medico
            });
        });
    },

  //  actualiza Usuario
  actualizaMedico: function ( object, req, res ) {
    models.Medico.update( {
      cedula: object[ 'cedula' ],
      codigoMedico: object[ 'codigo' ],
    }, {
      where: {
        usuario_id: object[ 'id' ]
      }
    } ).then( function ( datos ) {
      res.send( datos );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  informacionRegistro: function ( object, req, res ) {
    if (req.session.passport && req.session.passport.user) {
      models.Usuario.findOne( {
        where: {
          id: req.session.passport.user.id
        },
        attributes: [ 'id' ],
        include: [ {
          model: models.DatosGenerales
                }, {
          model: models.Medico
                }, {
          model: models.Biometrico
                }, {
          model: models.Direccion
                }, {
          model: models.DatosFacturacion,
          include: [ {
            model: models.Direccion,
            include: [ {
              model: models.Localidad
            } ]
          } ]
                } ]
      } ).then( function ( usuario ) {
        res.send( {success:true,result: usuario} );
      } );
    }
    else {
      res.status( 200 )
          .send({success:false,error:1});
    }
  },

  regMedPasoUno: function ( object, req, res ) {
    if ( req.session.passport.user && req.session.passport.user.tipoUsuario === "M" ) {
      var usuario_id = req.session.passport.user.id;
      models.Medico.findOne({where: {
          usuario_id: {$ne: req.session.passport.user.id},
          curp: object[ 'curpRegMed' ]
        }}).then(function(medicoCurp){
          if (!medicoCurp){
            models.Medico.findOne({where: {
                usuario_id: {$ne: req.session.passport.user.id},
                cedula: object[ 'cedulaRegMed' ]
              }}).then(function(medicoCedula){
                if (!medicoCedula){
                  models.DatosGenerales.upsert( {
                    nombre: object[ 'nombreRegMed' ],
                    apellidoP: object[ 'apePatRegMed' ],
                    apellidoM: object[ 'apeMatRegMed' ],
                    usuario_id: usuario_id
                  } ).then( function ( result ) {
                    models.Biometrico.upsert( {
                      genero: object[ 'gender' ],
                      usuario_id: usuario_id
                    } ).then( function ( result ) {
                      models.Medico.findOne( {
                        where: {
                          usuario_id: usuario_id
                        }
                      } ).then( function ( medico ) {
                        medico.update( {
                          curp: object[ 'curpRegMed' ],
                          cedula: object[ 'cedulaRegMed' ]
                        } ).then( function ( result ) {
                          res.send( {
                            'success': true
                          } );
                        } );
                      } )
                    } )
                  } );
                } else {
                  res.status(200).send( {
                    'success': false,
                    'error': 102
                  } );
                }
              });
          } else {
            res.status(200).send( {
              'success': false,
              'error': 101
            } );
          }
        })
    }
    else {
      res.status(200).send( {
        'success': false,
        error: 1
      } );
    }
  },

  regMedPasoDos: function ( object, req, res ) {
    if ( req.session.passport.user && req.session.passport.user.tipoUsuario === "M" ) {
      var usuario_id = req.session.passport.user.id;
      models.Medico.update( {
        pago: 1
      }, {
        where: {
          usuario_id: usuario_id
        }
      } ).then( function ( result ) {
        res.send( {
          'result': 'success'
        } );
      } )
    }
    else {
      res.send( {
        'result': 'error'
      } );
    }
  },

  regMedPasoTres: function ( object, req, res ) {
    if ( req.session.passport.user && req.session.passport.user.tipoUsuario === "M" ) {
      var usuario_id = req.session.passport.user.id;
      models.Localidad.findOne( {
        where: {
          id: object[ 'locFact' ]
        }
      } ).then( function ( localidad ) {
        if ( localidad ) {
          models.Direccion.upsert( {
            calle: object[ 'calleFact' ],
            numero: object[ 'numeroFact' ],
            localidad_id: object[ 'locFact' ],
            municipio_id: localidad.municipio_id,
            usuario_id: usuario_id
          } ).then( function ( Direccion ) {
            models.Direccion.findOne( {
              where: {
                usuario_id: usuario_id
              }
            } ).then( function ( Direccion ) {
              models.DatosFacturacion.upsert( {
                RFC: object[ "rfcFact" ],
                razonSocial: object[ "nomRSocialFact" ],
                usuario_id: usuario_id,
                direccion_id: Direccion.id
              } ).then( function ( result ) {
                res.send( {
                  'result': 'success'
                } );
              } );
            } )
          } );
        }
        else {
          res.send( {
            'result': 'error',
            error: 'no se encontro la localidad'
          } );
        }
      } )
    }
    else {
      res.send( {
        'result': 'error'
      } );
    }
  },

  agregaMedicoFavorito: function ( object, req, res ) {
    models.MedicoFavorito.create( {
      usuario_id: object.idUsuario,
      medico_id: object.idMedico
    } ).then( function ( datos ) {
      res.send( datos );
    } );
  },

  obtieneMedicoFavorito: function ( object, req, res ) {
    models.Medico.findAll( {
      include: [ {
          model: models.MedicoFavorito
        },
        {
          model: models.Usuario
        },
        {
          model: models.Especialidad
        },
        ],
      where: {
        usuario_id: object.idUsuario
      },
    } ).then( function ( datos ) {
      res.send( datos )
    } );
  },

  borraMedicoFavorito: function ( object, req, res ) {
    models.MedicoFavorito.destroy( {
      where: {
        id: object.id
      }
    } ).then( function () {
      res.status( 200 ).json( {
        ok: true
      } );
    } );
  },

  borraFormacion: function ( object, req, res ) {
    models.MedicoFormacion.destroy( {
      where: {
        id: object.id
      }
    } ).then( function () {
      res.status( 200 ).json( {
        ok: true
      } );
    } );
  },

  obtieneFormacion: function ( object, req, res ) {
    models.MedicoFormacion.findAll( {
      where: {
        medico_id: object.id
      }
    } ).then( function ( datos ) {
      res.send( datos )
    } );
  },

  agregaFormacion: function ( object, req, res ) {
    models.MedicoFormacion.create( {
      nivel: object.nivel,
      especialidad: object.especialidad,
      lugarDeEstudio: object.lugarDeEstudio,
      fechaInicio: object.fechaInicio,
      fechaFin: object.fechaFin,
      fechaTitulo: object.fechaTitulo,
      actual: object.actual,
      medico_id: object.idMedico
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  actualizaFormacion: function ( object, req, res ) {
    models.MedicoFormacion.update( {
      nivel: object.nivel,
      especialidad: object.especialidad,
      lugarDeEstudio: object.lugarDeEstudio,
      fechaInicio: object.fechaInicio,
      fechaFin: object.fechaFin,
      fechaTitulo: object.fechaTitulo,
      actual: object.actual
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  obtieneExperiencia: function ( object, req, res ) {
    models.MedicoFormacion.findAll( {
      where: {
        medico_id: object.id
      }
    } ).then( function ( datos ) {
      res.send( datos )
    } );
  },

  insertaExperiencia: function ( object, req, res ) {
    models.MedicoExperiencia.create( {
      nivel: object.nivel,
      titulo: object.especialidad,
      lugarTrabajo: object.lugarDeEstudio,
      descripcion: object.descripcion,
      fechaInicio: object.fechaInicio,
      fechaFin: object.fechaFin,
      fechaTitulo: object.fechaTitulo,
      actual: object.actual,
      ciudad_id: object.idCiudad,
      municipio_id: object.idMunicipio,
      estado_id: object.idEstado,
      medico_id: object.idMedico,
      institucion_id: object.idInstitucion
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  actualizaExperiencia: function ( object, req, res ) {
    models.MedicoExperiencia.update( {
      nivel: object.nivel,
      titulo: object.especialidad,
      lugarTrabajo: object.lugarDeEstudio,
      descripcion: object.lugarDeEstudio,
      fechaInicio: object.fechaInicio,
      fechaFin: object.fechaFin,
      fechaTitulo: object.fechaTitulo,
      actual: object.actual,
      ciudad_id: object.idCiudad,
      municipio_id: object.idMunicipio,
      estado_id: object.idEstado,
      medico_id: object.idMedico,
      institucion_id: object.idInstitucion
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  borraExperiencia: function ( object, req, res ) {
    models.MedicoExperiencia.destroy( {
      where: {
        id: object.id
      }
    } ).then( function () {
      res.status( 200 ).json( {
        ok: true
      } );
    } );
  },

  obtieneComentario: function ( object, req, res ) {
    models.ComentariosMedicos.findAll( {
      include: [ {
        models: Usuario
      } ],
      where: {
        medico_id: object.id
      }
    } ).then( function ( datos ) {
      res.send( datos )
    } );
  },

  actualizaComentario: function ( object, req, res ) {
    models.ComentariosMedicos.update( {
      comentario: object.comentario,
      aninimo: object.anonimo,
      medico_id: object.idMedico,
      usuario_id: object.idUsuario
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  agregaComentario: function ( object, req, res ) {
    models.ComentariosMedicos.create( {
      comentario: object.comentario,
      aninimo: object.anonimo,
      medico_id: object.idMedico,
      usuario_id: object.idUsuario
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  },

  borraComentarios: function ( object, req, res ) {
    models.ComentariosMedicos.destroy( {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } )
    } );
  },

  medicoExpertoActualizar: function (object, req, res){
    if (req.session.passport.user){
      models.Medico.findOne({
        where: { usuario_id : req.session.passport.user.id},
        attributes: ['id']
      }).then(function(medico){
        models.MedicoExpertoEn.destroy({
          where: { medico_id: medico.id}
        }).then(function(result){
          object.expertoEn.forEach(function(rec){
            models.MedicoExpertoEn.create({
              medico_id: medico.id,
              expertoen: rec.exp.val,
              orden: rec.exp.num
            }).then(function(padre){
              if (rec.hijos){
                rec.hijos.forEach(function(hijo){
                  models.MedicoExpertoEn.create({
                    medico_id: medico.id,
                    expertoen: hijo.val,
                    padre_id: padre.id,
                    orden: hijo.num
                  });
                });
              }
            });
          });
          res.status(200).json({'success':true});
        });
      });
    } else {
      res.status(200).json({'success':false});
    }
  },

  medicoExpertoTraer : function (object, req, res){
    if (req.session.passport.user){
      models.Medico.findOne({
        where: { usuario_id : req.session.passport.user.id},
        attributes: ['id']
      }).then(function(medico){
        models.MedicoExpertoEn.findAll({
          where: { medico_id: medico.id},
          order: [['orden','ASC']]
        }).then(function(expertoEn){
          res.status(200).json({'success':true, 'result':expertoEn});
        });
      });
    } else {
      res.status(200).json({'success':false});
    }
  },

  medicoAseguradorasTraer: function (object, req, res){
      if (req.session.passport.user){
        models.Medico.findOne({
          where: { usuario_id : req.session.passport.user.id},
          attributes: ['id']
        }).then(function(medico){
          models.MedicoAseguradora.findAll({
            where: { medico_id: medico.id},
            order: [['orden','ASC']]
          }).then(function(expertoEn){
            res.status(200).json({'success':true, 'result':expertoEn});
          });
        });
      } else {
        res.status(200).json({'success':false});
      }
  },

  medicoClinicasTraer: function (object, req, res){
      if (req.session.passport.user){
        models.Medico.findOne({
          where: { usuario_id : req.session.passport.user.id},
          attributes: ['id']
        }).then(function(medico){
          models.MedicoClinica.findAll({
            where: { medico_id: medico.id},
            order: [['orden','ASC']]
          }).then(function(expertoEn){
            res.status(200).json({'success':true, 'result':expertoEn});
          });
        });
      } else {
        res.status(200).json({'success':false});
      }
  },

  medicoClinicasActualizar: function (object, req, res){
      if (req.session.passport.user){
        models.Medico.findOne({
          where: { usuario_id : req.session.passport.user.id},
          attributes: ['id']
        }).then(function(medico){
          models.MedicoClinica.destroy({
            where: { medico_id: medico.id}
          }).then(function(result){
            object.clinicas.forEach(function(rec){
              models.MedicoClinica.create({
                medico_id: medico.id,
                clinica: rec.val,
                orden: rec.num
              });
            });
            res.status(200).json({'success':true});
          });
        });
      } else {
        res.status(200).json({'success':false});
      }
  },

  medicoAseguradorasActualizar: function (object, req, res){
      if (req.session.passport.user){
        models.Medico.findOne({
          where: { usuario_id : req.session.passport.user.id},
          attributes: ['id']
        }).then(function(medico){
          models.MedicoAseguradora.destroy({
            where: { medico_id: medico.id}
          }).then(function(result){
            object.aseguradoras.forEach(function(rec){
              models.MedicoAseguradora.create({
                medico_id: medico.id,
                aseguradora: rec.val,
                orden: rec.num
              });
            });
            res.status(200).json({'success':true});
          });
        });
      } else {
        res.status(200).json({'success':false});
      }
  },
  loadGenerales: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Usuario.findOne({
        where:{id:usuario_id},
        attributes:['urlFotoPerfil'],
        include:[{
          model: models.DatosGenerales,
          attributes:['nombre','apellidoP','apellidoM']
        }]
      }).then(function(usuario){
        res.send(usuario);
      });
    }
  },
  loadEspecialidades: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Medico.findOne({
        where:{usuario_id:usuario_id},
        attributes:['id'],
        include:[{
          model: models.MedicoEspecialidad,
          attributes:['id','subEsp'],
          include:[{
            model: models.Especialidad,
            attributes:['especialidad']
          }]
        }]
      }).then(function(medicos){
        res.send(medicos);
      });
    }
  },
  loadPadecimientos: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Medico.findOne({
        where:{usuario_id:usuario_id},
        attributes:['id'],
        include:[{
          model: models.Padecimiento,
          attributes:['padecimiento']
        }]
      }).then(function(medico){
        res.send(medico);
      });
    }
  },
  loadPalabras: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Palabras.findAll({
        where:{ usuario_id: usuario_id},
        attributes:['id','palabra']
      }).then(function(palabras){
        res.send(palabras);
      });
    }
  },
  mEditMedic: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      var objecto;
      var tipo = req.body.tipo;
      if( tipo == 1 ){
        objecto = { nombre: req.body.dato };
      }else if( tipo == 2 ){
        objecto = { apellidoP: req.body.dato };
      }else if( tipo == 3 ){
        objecto = { apellidoM: req.body.dato };
      }
      models.DatosGenerales.update(objecto,{
        where:{ usuario_id: usuario_id }
      }).then(function(actualizado){
        res.send(actualizado);
      })
    }
  },
  todasEspecialidades: function( req, res ){
    models.Especialidad.findAll({
      attributes:['id','especialidad']
    }).then(function(especialidades){
      res.send(especialidades);
    });
  },
  sacaMedicoId: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Medico.findOne({
        where:{usuario_id: usuario_id},
        attributes:['id']
      }).then(function(medico){
        res.send(medico);
      });
    }
  },
  editEspecialidades: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
        models.MedicoEspecialidad.create({
        especialidad_id: parseInt(req.body.especialidad),
        subEsp: parseInt(req.body.checado),
        medico_id: parseInt(req.body.medico_id)
      }).then(function(creado){
        res.send(creado);
      });
    }
  },
  deleteEsp: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.MedicoEspecialidad.destroy({
        where:{id:req.body.id}
      }).then(function(des){
          if(des == 1 ){
            res.sendStatus(200);
          }else{
            res.sendStatus(404);
          }
      });
    }
  },
  deleteSubEsp: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.MedicoEspecialidad.destroy({
        where:{id:req.body.id}
      }).then(function(destruido){
        if( destruido == 1 ){
          res.sendStatus(200);
        }else{
          res.sendStatus(404);
        }
      });
    }
  },
  traePadecimientos: function(req, res){
    models.Padecimiento.findAll({

    }).then(function(todos){
      res.send(todos);
    });
  },
  editPadecimientos: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Medico.findOne({
        where:{usuario_id:usuario_id},
        attributes:['id']
      }).then(function(medico){
        models.MedicoPadecimiento.create({
          medico_id:medico.id,
          padecimiento_id:parseInt(req.body.padecimiento)
        }).then(function(creado){
          console.log("CREADO: "+JSON.stringify(creado));
          res.send(creado);
        });
      });
    }
  },
  editPalabrasClave: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Palabras.create({
        palabra: req.body.palabra,
        usuario_id:usuario_id
      }).then(function(creado){
        res.send(creado);
      });
    }
  },
  deletePad: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.MedicoPadecimiento.destroy({
        where:{id:req.body.id}
      }).then(function(destruido){
        if( destruido == 1 ){
          res.sendStatus(200);
        }else{
          res.sendStatus(404);
        }
      });
    }
  },
  deletePalabra: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Palabras.destroy({
        where:{id:req.body.id}
      }).then(function(des){
        if( des == 1 ){
          res.sendStatus(200);
        }else{
          res.sendStatus(404);
        }
      });
    }
  },

  calificar: function(object, req, res){
    if (req.session.passport && req.session.passport.user){
      models.Medico.findOne({
        where: {
          usuario_id: object.usuario_id
        }
      }).then(function(medico){
        if (medico){
          object.medico_id = medico.id;
          object.usuario_id = req.session.passport.user.id;
          models.CalificacionMedico.findOne({
            where: {
              medico_id: object.medico_id,
              usuario_id: object.usuario_id
            }
          }).then(function(calificacion){
            if (calificacion){
              //Eliminar calificacion actual
              models.CalificacionMedico.destroy({
                where: {
                  medico_id: object.medico_id,
                  usuario_id: object.usuario_id
                }
              }).then(function(result){
                _this.insertarCalificacionMedico(object, req, res, true);
              });
            } else {
              _this.insertarCalificacionMedico(object,req, res, false);
            }
          });
        } else {
          //No existe el médico
          res.status(200).json({error:1});
        }
      });
    } else {
      res.status(200).json({error:1});
    }
  },

  insertarCalificacionMedico: function(object, req, res, modificacion){
    models.CalificacionMedico.create(object).then(function(result){
      var success = false;
      if (result){
        success = true;
          models.Medico.findById(object.medico_id).then(function(medico){
            var promedio = 0;
            if (!modificacion){
              promedio =  ((parseInt(object.efectividad) + parseInt(object.tratoPersonal) + parseInt(object.higiene) + parseInt(object.presentacion)) / 4);
              if (medico.calificacion !=  null){
                calificacion = medico.calificacion;
                promedio = ((parseInt(calificacion) + promedio) / 2);
              }
              medico.update({calificacion :  promedio});
            } else {
              //Se debe de recalcular el promedio, porque el usuario modifico su calificación
              models.CalificacionMedico.findAll({
                where:{
                  medico_id: object.medico_id,
                  usuario_id: object.usuario_id
                }
              }).then(function(calificaciones){
                calificaciones.forEach(function(cal){
                    promedio +=  ((parseInt(cal.efectividad) + parseInt(cal.tratoPersonal) + parseInt(cal.higiene) + parseInt(cal.presentacion)) / 4);
                });
                promedio = promedio/calificaciones.length;
                medico.update({calificacion :  promedio});
              });
            }
          });
      }
      res.status(200).json({
        success: success,
        result: result
      });
    });
  },

  recomendar: function(object, req, res){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      models.Medico.findOne({
        where:{
          usuario_id: object.usuario_medico_id
        },
        include: [
          {
            model: models.Usuario,
            attributes: ['urlFotoPerfil','urlPersonal','usuarioUrl'],
            include:[
              {
                model: models.DatosGenerales,
                attributes: ['nombre','apellidoP','apellidoM']
              },
              {
                model: models.Direccion,
                attributes: ['id'],
                include: [{
                  model: models.Municipio,
                  include: [{
                    model: models.Estado
                  }]
                }]
              }
            ]
          },{
            model: models.Especialidad
          }
        ]
      }).then(function(medico){
          if (medico){
            if (object.usuarios_id){
              var recomcount = 0;
              models.Notificacion.create({
                usuario_id: object.usuario_medico_id,
                tipoNotificacion_id:13,
                data:String(req.session.passport.user.id)
              }).then(function(){
                object.usuarios_id.forEach(function(usuario){
                  models.Notificacion.create({
                      usuario_id:usuario,
                      tipoNotificacion_id:12,
                      data:req.session.passport.user.Paciente_id+"|"+medico.id
                  }).then(function(){
                    recomcount++;
                    if (recomcount == object.usuarios_id.length){
                      _this.enviarCorreosRecomendacion(req,res,object,medico);
                    }
                  });
                });
              });
          } else {
            _this.enviarCorreosRecomendacion(req,res,object,medico);
          }
        }else{
          //Error: el medico no existe
          res.status(200).json({
            success: false
          });
        }
      });
    } else {
      //Enviar error de sesión no iniciada
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  },

  enviarCorreosRecomendacion: function (req,res,object,medico){
    if (object.emails){
      if (medico.Usuario.DatosGenerale.apellidoM == null){
        medico.Usuario.DatosGenerale.apellidoM = '';
      } else {
        medico.Usuario.DatosGenerale.apellidoM = ' ' + medico.Usuario.DatosGenerale.apellidoM;
      }
      var mednombre = 'Dr(a). ' + medico.Usuario.DatosGenerale.nombre + ' ' + medico.Usuario.DatosGenerale.apellidoP + medico.Usuario.DatosGenerale.apellidoM;
      var especialidad = '';

      medico.Especialidads.forEach(function(esp){
        if (especialidad != ""){
          especialidad += ', ';
        }
        especialidad += esp.especialidad;
      });

      var municipio = '';
      if (medico.Usuario.Direccions[0]){
        municipio = medico.Usuario.Direccions[0].Municipio.municipio + ', ' +medico.Usuario.Direccions[0].Municipio.Estado.estado;
      }

      enlace = medico.Usuario.usuarioUrl;
      if (medico.Usuario.urlPersonal != "" && medico.Usuario.urlPersonal != null){
        enlace = medico.Usuario.urlPersonal;
      }

      var mailcont = 0;
      object.emails.forEach(function(email){
        var mailobject ={
          nombre:'correo de recomendacion',
          subject:'Recomendaciones',
          to:email,
          enlace:enlace,
          mensaje:req.body.mensaje,
          usuario:req.session.passport.user.name,
          medfotoPerfil: global.base_url + medico.Usuario.urlFotoPerfil,
          mednombre: mednombre,
          medespecialidad: especialidad,
          medubicacion: municipio
        };
        mail.send(mailobject,'recomendar');
        mailcont++;
        if (mailcont == object.emails.length){
          res.status(200).json({
            success: true
          });
        }
      });
    } else {
      res.status(200).json({
        success: true
      });
    }
  },


  pedirRecomendacion: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      models.Notificacion.create({
        usuario_id:req.body.idMedico,
        tipoNotificacion_id:14,
        data:req.session.passport.user.Paciente_id+req.body.idEspecialidad
      }).then(function(creado){
        res.status(200).json({
          success: true,
          creado: creado
        });
      });
    } else {
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  },

  dejarComentario: function (object, req, res){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      models.Medico.findOne({
        where: {
          usuario_id: object.usuario_medico_id
        }
      }).then(function(medico){
        if (medico){
          models.ComentariosMedicos.create({
            medico_id: medico.id,
            usuario_id: req.session.passport.user.id,
            titulo: object.titulo,
            comentario: object.comentario,
            anonimo: object.anonimo
          }).then(function(result){
            res.status(200).json({
              success: true,
              result: result
            });
          });
        } else {
          //error de que el medico no existe
          res.status(200).json({
            success: false,
            error: 2
          });
        }
      });
    } else {
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  },

  cargarComentarios: function(object, req, res){
    if (object.usuario_id == ""){
      if (req.session.passport && req.session.passport.user){
        object.usuario_id = req.session.passport.user.id;
      }
    }
    if (object.usuario_id != ""){
      models.Medico.findOne({
        where: {
          usuario_id: object.usuario_id
        }
      }).then(function(medico){
        if (medico){
          models.ComentariosMedicos.findAll({
            where:{
              medico_id: medico.id
            },
            order:[['fecha','DESC']],
            include: [{
              model: models.Usuario,
              attributes: ['id','usuarioUrl','urlFotoPerfil','urlPersonal'],
              include: [{
                model: models.DatosGenerales
              },{
                model: models.Direccion,
                attributes:['id'],
                include:[
                  {
                    model: models.Municipio,
                    include :[{ model : models.Estado}]
                  }
                ]
              }]
            }]
          }).then(function(result){
            res.status(200).json({
              success: true,
              result: result
            });
          });
        } else {
          //error de que el medico no existe
          res.status(200).json({
            success: false,
            error: 2
          });
        }
      });
    } else {
      //Error: no usuario_id
      res.status(200).json({
        success: false,
        error: 3
      });
    }

  },

  agregarFormacionAcademica: function  (object, req, res){
    if (req.session.passport && req.session.passport.user){
        if (object.fechaFin == ""){
          object.fechaFin = null;
        }
        if (object.fechaTitulo == ""){
          object.fechaTitulo = null;
        }
        if (object.fechaFin == ""){
          object.fechaFin = null;
        }

        models.Medico.findOne({
          where: {
            usuario_id: req.session.passport.user.id
          }
        }).then(function(medico){
          models.MedicoFormacion.create( {
            nivel: object.nivel,
            especialidad: object.especialidad,
            lugarDeEstudio: object.lugarDeEstudio,
            fechaInicio: object.fechaInicio,
            fechaFin: object.fechaFin,
            fechaTitulo: object.fechaTitulo,
            actual: object.actual,
            medico_id: medico.id
          } ).then( function ( datos ) {
            res.status( 200 ).json( {
              success: true,
              result: datos
            } );
          } ).catch( function ( err ) {
            res.status( 500 ).json( {
              error: err
            } );
          } );
        });
    } else {
      //Error: no usuario_id
      res.status(200).json({
        success: false,
        error: 3
      });
    }
  },

  cargarFormacionAcademica: function (object, req, res){
    if (req.session.passport && req.session.passport.user){
        models.Medico.findOne({
          where: {
            usuario_id: req.session.passport.user.id
          }
        }).then(function(medico){
          models.MedicoFormacion.findAll( {
            where:{
              medico_id: medico.id
            },
            order:[['fechaInicio','ASC']]
          } ).then( function ( datos ) {
            res.status( 200 ).json( {
              success: true,
              result: datos
            } );
          } ).catch( function ( err ) {
            res.status( 500 ).json( {
              error: err
            } );
          } );
        });
    } else {
      //Error: no usuario_id
      res.status(200).json({
        success: false,
        error: 3
      });
    }
  },

  cargarFormacionAcademicaByID: function (object, req, res){
    if (req.session.passport && req.session.passport.user){
        models.Medico.findOne({
          where: {
            usuario_id: req.session.passport.user.id
          }
        }).then(function(medico){
          models.MedicoFormacion.findOne( {
            where:{
              medico_id: medico.id,
              id: object.id
            },
            order:[['fechaInicio','ASC']]
          } ).then( function ( datos ) {
            res.status( 200 ).json( {
              success: true,
              result: datos
            } );
          } ).catch( function ( err ) {
            res.status( 500 ).json( {
              error: err
            } );
          } );
        });
    } else {
      //Error: no usuario_id
      res.status(200).json({
        success: false,
        error: 3
      });
    }
  }
}
