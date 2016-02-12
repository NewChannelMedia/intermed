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
    try{
      middle.obtieneMedicos( function ( datos ) {
        res.send( datos );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  obtieneAjax: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  seleccionaRegistrados: function(object, req, res) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  // Método que muesta la pantalla de registro
  selecciona: function(object, req, res) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  seleccionaEdicion: function(object, req, res) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  // Método que registra médicos
  registrar: function(object, req, res) {
    try{
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
      }catch ( err ) {
        req.errorHandler.report(err, req, res);
      }
    },

    actualizar2: function(object, req, res) {
      try{
        middle.guardaMedicos(object, function(datos) {
          res.send(datos);
        });
      }catch ( err ) {
        req.errorHandler.report(err, req, res);
      }
    },

    // Método para actualizar médicos
    actualizar: function(object, req, res) {
      try{
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
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
        }catch ( err ) {
          req.errorHandler.report(err, req, res);
        }
    },
    // obtiene id medico @alan
    seleccionaMedico: function(object, req, res) {
      try{
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
      }catch ( err ) {
        req.errorHandler.report(err, req, res);
      }
    },
    // obtiene id medico
    seleccionaTodosMedico: function(object, req, res) {
      try{
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
      }catch ( err ) {
        req.errorHandler.report(err, req, res);
      }
    },

  //  actualiza Usuario
  actualizaMedico: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  informacionRegistro: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  regMedPasoUno: function ( object, req, res ) {
    try{
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
                    models.Usuario.update({
                      status: -1
                    },{
                      where: {
                        id: usuario_id
                      }
                    }).then(function(status){
                      //Actualizar datos generales
                      models.DatosGenerales.upsert({
                        nombre: object[ 'nombreRegMed' ],
                        apellidoP: object[ 'apePatRegMed' ],
                        apellidoM: object[ 'apeMatRegMed' ],
                        usuario_id: usuario_id
                      },{where: {
                        usuario_id: usuario_id
                      }}).then(function(DG){
                        var fechaNac = object.anioNacReg + '-' + object.mesNacReg + '-' + object.diaNacReg;
                        models.Medico.upsert({
                          curp: object[ 'curpRegMed' ],
                          cedula: object[ 'cedulaRegMed' ],
                          fechaNac: fechaNac,
                          usuario_id: usuario_id
                          },{where: {
                            usuario_id: usuario_id
                        }}).then(function(MED){
                          models.Biometrico.upsert({
                            genero: object[ 'gender' ],
                            usuario_id: usuario_id
                          },{where: {
                            usuario_id: usuario_id
                          }}).then(function(BIO){
                            //Insergar codigo_id en usuario, y set codigo como registrado
                            models.DBEncuesta_encuesta.findOne({
                              where: {
                                codigo: object.codigoPromo
                              }
                            }).then(function(codigoEncuesta){
                              if (codigoEncuesta){
                                models.Usuario.update({
                                  codigoPromo_id: codigoEncuesta.id
                                },{
                                  where: {
                                    id: usuario_id
                                  }
                                }).then(function(){
                                  codigoEncuesta.update({
                                    registrado: 1
                                  }).then(function(result){
                                    console.log('Result: ' + JSON.stringify(result));
                                  });
                                });
                              }
                            });


                            res.send( {
                              'success': true
                            } );
                          });
                        });
                      })
                    });
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
            });
      }
      else {
        res.status(200).send( {
          'success': false,
          error: 1
        } );
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  regMedPasoDos: function ( object, req, res ) {
    try{
      if ( req.session.passport.user && req.session.passport.user.tipoUsuario === "M" ) {
        var usuario_id = req.session.passport.user.id;
        models.Usuario.update({
          status: 1
        },{
          where: {
            id: usuario_id
          }
        } ).then( function ( result ) {
          res.send( {
            'success': true
          } );
        } );
      }
      else {
        res.send( {
          'success':false
        } );
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  regMedPasoTres: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  agregaMedicoFavorito: function ( object, req, res ) {
    try{
      models.MedicoFavorito.create( {
        usuario_id: object.idUsuario,
        medico_id: object.idMedico
      } ).then( function ( datos ) {
        res.send( datos );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  obtieneMedicoFavorito: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  borraMedicoFavorito: function ( object, req, res ) {
    try{
      models.MedicoFavorito.destroy( {
        where: {
          id: object.id
        }
      } ).then( function () {
        res.status( 200 ).json( {
          ok: true
        } );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  borraFormacion: function ( object, req, res ) {
    try{
      models.MedicoFormacion.destroy( {
        where: {
          id: object.id
        }
      } ).then( function () {
        res.status( 200 ).json( {
          ok: true
        } );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  obtieneFormacion: function ( object, req, res ) {
    try{
      models.MedicoFormacion.findAll( {
        where: {
          medico_id: object.id
        }
      } ).then( function ( datos ) {
        res.send( datos )
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  agregaFormacion: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  actualizaFormacion: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  obtieneExperiencia: function ( object, req, res ) {
    try{
      models.MedicoFormacion.findAll( {
        where: {
          medico_id: object.id
        }
      } ).then( function ( datos ) {
        res.send( datos )
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  insertaExperiencia: function ( object, req, res ) {
    try{
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
        req.errorHandler.report(err, req, res);
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  actualizaExperiencia: function ( object, req, res ) {
    try{
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
        req.errorHandler.report(err, req, res);
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  borraExperiencia: function ( object, req, res ) {
    try{
      models.MedicoExperiencia.destroy( {
        where: {
          id: object.id
        }
      } ).then( function () {
        res.status( 200 ).json( {
          ok: true
        } );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  obtieneComentario: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  actualizaComentario: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  agregaComentario: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  borraComentarios: function ( object, req, res ) {
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoExpertoActualizar: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoExpertoTraer : function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoAseguradorasTraer: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoClinicasTraer: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoClinicasActualizar: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medicoAseguradorasActualizar: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadGenerales: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadEspecialidades: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadPadecimientos: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadPalabras: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Palabras.findAll({
          where:{ usuario_id: usuario_id},
          attributes:['id','palabra']
        }).then(function(palabras){
          res.send(palabras);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  mEditMedic: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  todasEspecialidades: function( req, res ){
    try{
      models.Especialidad.findAll({
        attributes:['id','especialidad']
      }).then(function(especialidades){
        res.send(especialidades);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  sacaMedicoId: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Medico.findOne({
          where:{usuario_id: usuario_id},
          attributes:['id']
        }).then(function(medico){
          res.send(medico);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  editEspecialidades: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.MedicoEspecialidad.findOne({
          where:{
            especialidad_id: parseInt(req.body.especialidad),
            medico_id: parseInt(req.session.passport.user.Medico_id)
          }
        }).then(function(esp){
          if (esp){
            esp['success'] = false;
            esp['existe'] = true;
            res.send(esp);
          }else{
            models.MedicoEspecialidad.create({
              especialidad_id: parseInt(req.body.especialidad),
              subEsp: parseInt(req.body.checado),
              medico_id: parseInt(req.session.passport.user.Medico_id)
            }).then(function(creado){
              models.MedicoEspecialidad.findOne({
                where:{
                  especialidad_id: parseInt(req.body.especialidad),
                  medico_id: parseInt(req.session.passport.user.Medico_id)
                }
              }).then(function(creado){
                models.Especialidad.findOne({
                  where: {
                    id: creado.especialidad_id
                  }
                }).then(function(especialidad){
                  creado = JSON.parse(JSON.stringify(creado));
                  creado['Especialidad'] = JSON.parse(JSON.stringify(especialidad));
                  if (especialidad){
                    creado['success'] = true;
                  }
                  res.send(creado);
                });
              });
            });
          }
        });
      } else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deleteEsp: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deleteSubEsp: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  traePadecimientos: function(req, res){
    try{
      models.Padecimiento.findAll().then(function(todos){
        res.send(todos);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  editPadecimientos: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  editPalabrasClave: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Palabras.create({
          palabra: req.body.palabra,
          usuario_id:usuario_id
        }).then(function(creado){
          res.send(creado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deletePad: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deletePalabra: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  calificar: function(object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  insertarCalificacionMedico: function(object, req, res, modificacion){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  recomendar: function(object, req, res){
    try{
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
              _this.enviarCorreosRecomendacion(req,res,object,medico);
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  enviarCorreosRecomendacion: function (req,res,object,medico){
    try{
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
            to:email.correo,
            nombre: ' ' + email.nombre,
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },


  pedirRecomendacion: function( req, res ){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  dejarComentario: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarComentarios: function(object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }

  },

  agregarFormacionAcademica: function  (object, req, res){
    try{
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
            if (object.formacion_id != "" && parseInt(object.formacion_id)>0){
              models.MedicoFormacion.update( {
                nivel: object.nivel,
                especialidad: object.especialidad,
                lugarDeEstudio: object.lugarDeEstudio,
                fechaInicio: object.fechaInicio,
                fechaFin: object.fechaFin,
                fechaTitulo: object.fechaTitulo,
                actual: object.actual,
                municipio_id: object.municipio_id,
                estado_id: object.estado_id,
                medico_id: medico.id
              }, {
                where: {
                  id: object.formacion_id
                }
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
            } else {
              models.MedicoFormacion.create( {
                nivel: object.nivel,
                especialidad: object.especialidad,
                lugarDeEstudio: object.lugarDeEstudio,
                fechaInicio: object.fechaInicio,
                fechaFin: object.fechaFin,
                fechaTitulo: object.fechaTitulo,
                actual: object.actual,
                municipio_id: object.municipio_id,
                estado_id: object.estado_id,
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
            }
          });
      } else {
        //Error: no usuario_id
        res.status(200).json({
          success: false,
          error: 3
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarFormacionAcademica: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
          models.Medico.findOne({
            where: {
              usuario_id: object.usuario_id
            }
          }).then(function(medico){
            models.MedicoFormacion.findAll( {
              where:{
                medico_id: medico.id
              },
              order:[['fechaInicio','ASC']],
              include: [
                {
                  model: models.Estado
                },
                {
                  model: models.Municipio
                }
              ]
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarFormacionAcademicaByID: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadFechaNac: function(req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Medico.findOne({
          where:{usuario_id:usuario_id},
          attributes:['fechaNac']
        }).then(function(fecha){
          res.send(fecha);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  regFechaNacimiento: function( object, req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Medico.update({fechaNac: object.fecha},{
          where:{usuario_id:usuario_id}
        }).then(function(actualizado){
          if( actualizado == 1 ){
            res.send(true);
          }else{
            res.send(false);
          }
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  updateCedula: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
          models.Medico.update({
            cedula: object.cedula
          },{
            where: {
              usuario_id: req.session.passport.user.id
            }
          }).then(function(medico){
            if (medico){
              models.Usuario.update({
                status: 4
              },{
                where: {
                  id: req.session.passport.user.id
                }
              }).then(function(usuario){
                res.status( 200 ).json( {
                  success: true,
                  result: medico
                } );
              });
            } else {
              res.status( 200 ).json( {
                success: false,
                error: 0
              } );
            }
          });
      } else {
        //Error: no usuario_id
        res.status(200).json({
          success: false,
          error: 3
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  addressGet: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
        models.Direccion.findAll({
          where:{
            usuario_id: req.session.passport.user.id
          },
          order: [['principal','DESC']],
          attributes: ['id','nombre','principal','calle','numero']
        }).then(function(ubicaciones){
          res.status( 200 ).json( {
            success: true,
            result: ubicaciones
          } );
        });
      }else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  serbUpdate: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
        if (object.servicio_id){
          //Actualizar servicio
          models.CatalogoServicios.update({
            concepto: object.concepto,
            descripcion: object.descripcion,
            precio: parseFloat(object.precio),
            duracion: object.duracion
          },{
            where: {
              id: object.servicio_id
            }
          }).then(function(datos) {
              res.status(200).json({success: true});
          }).catch(function(err) {
              res.status(500).json({error: err});
          });
        } else {
          //Agregar nuevo servicio
          models.CatalogoServicios.create({
            concepto: object.concepto,
            descripcion: object.descripcion,
            precio: parseFloat(object.precio),
            duracion: object.duracion,
            usuario_id: req.session.passport.user.id,
            direccion_id: object.direccion_id
          }).then(function(datos) {
              res.status(200).json({success: true, result: datos});
          }).catch(function(err) {
              res.status(500).json({error: err});
          });
        }
      }else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  serbGetByAddr: function (object, req, res){
    try{
        if (req.session.passport && req.session.passport.user){
          if (object.direccion_id){
            models.CatalogoServicios.findAll({
              where: {
                direccion_id: object.direccion_id,
                usuario_id: req.session.passport.user.id
              }
            }).then(function(datos) {
                res.status(200).json({success: true, result: datos});
            }).catch(function(err) {
                res.status(500).json({error: err});
            });
          } else {
              res.status(200).json({success: false});
          }
      }else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  servDrop: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
        if (object.id){
          models.CatalogoServicios.destroy({
            where: {
              id: object.id
            }
          }).then(function(datos) {
              res.status(200).json({success: true});
          }).catch(function(err) {
              res.status(500).json({error: err});
          });
        } else {
            res.status(200).json({success: false});
        }
      }else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  ubicMinConf: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
        models.Direccion.findAll({
          where: {
            usuario_id: req.session.passport.user.id
          },
          include: [{
            model: models.CatalogoServicios
          },{
            model: models.Horarios
          }]
        }).then(function(result){
          var valido = false;
          result.forEach(function(res){
            if (res.CatalogoServicios.length>0 && res.Horarios.length>0){
              valido = true;
            }
          });
          res.status(200).json({success: valido, result: result});
          });
      }else {
        res.status(200).json({
          success: false,
          error: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  agregarExperienciaLaboral: function  (object, req, res){
    try {
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
            console.log('Object: ' + JSON.stringify(object));
            if (object.experiencia_id != "" && parseInt(object.experiencia_id)>0){
              models.MedicoExperiencia.update( {
                titulo:object.titulo,
                lugarTrabajo:object.institucion,
                descripcion:object.descripcion,
                fechaInicio: object.fechaInicio,
                fechaFin: object.fechaFin,
                actual: object.actual,
                estado_id: object.estado_id,
                municipio_id: object.municipio_id,
                medico_id: medico.id
              }, {
                where: {
                  id: object.experiencia_id
                }
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
            } else {
              models.MedicoExperiencia.create( {
                titulo:object.titulo,
                lugarTrabajo:object.institucion,
                descripcion:object.descripcion,
                fechaInicio: object.fechaInicio,
                fechaFin: object.fechaFin,
                actual: object.actual,
                municipio_id: object.municipio_id,
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
            }
          });
      } else {
        //Error: no usuario_id
        res.status(200).json({
          success: false,
          error: 3
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarExperienciaLaboralByID: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
          models.Medico.findOne({
            where: {
              usuario_id: req.session.passport.user.id
            }
          }).then(function(medico){
            models.MedicoExperiencia.findOne( {
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },


  cargarExperienciaLaboral: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.user){
          models.Medico.findOne({
            where: {
              usuario_id: object.usuario_id
            }
          }).then(function(medico){
            models.MedicoExperiencia.findAll( {
              where:{
                medico_id: medico.id
              },
              order:[['actual','DESC'],['fechaInicio','ASC']],
              include: [{
                model: models.Municipio
              },{
                model: models.Estado
              }]
            } ).then( function ( datos ) {
              res.status( 200 ).json( {
                success: true,
                result: datos
              } );
            } );

            /*.catch( function ( err ) {
              res.status( 500 ).json( {
                error: err
              } );
            } );
            */
          });
      } else {
        //Error: no usuario_id
        res.status(200).json({
          success: false,
          error: 3
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

}
