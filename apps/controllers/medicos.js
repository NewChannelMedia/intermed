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
        } catch ( err ) {
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
            model: models.Medico,
                    include: [{
                      model: models.MedicoEspecialidad,
                      include: [{
                        model: models.Especialidad
                      }]
                    }]
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
            order: [['orden','ASC']],
            include: [{
              model: models.Aseguradora
            }]
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
      if (req.session.passport.user && req.session.passport.user.Medico_id){
        var medico_id = req.session.passport.user.Medico_id;
        models.MedicoAseguradora.destroy({
          where: { medico_id: medico_id}
        }).then(function(result){
          object.aseguradoras.forEach(function(rec){
            models.Aseguradora.findOrCreate({
              where: {aseguradora: rec.val},
              defaults: {aseguradora: rec.val}
            }).spread(function(aseguradora, created) {
              models.MedicoAseguradora.create({
                medico_id: medico_id,
                aseguradora_id: aseguradora.id,
                orden: rec.num
              });
            });
          });
          res.status(200).json({'success':true});
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
        models.Especialidad.findOrCreate({
          where: {especialidad: req.body.especialidad},
          defaults: {especialidad: req.body.especialidad,tipoEspecialidad_id: 2}
        }).spread(function(especialidad, created) {
          var usuario_id = req.session.passport.user.id;
          models.MedicoEspecialidad.findOne({
            where:{
              especialidad_id: parseInt(especialidad.id),
              medico_id: parseInt(req.session.passport.user.Medico_id)
            }
          }).then(function(esp){
            if (esp){
              esp['success'] = false;
              esp['existe'] = true;
              res.send(esp);
            }else{
              models.MedicoEspecialidad.create({
                especialidad_id: parseInt(especialidad.id),
                subEsp: parseInt(req.body.checado),
                medico_id: parseInt(req.session.passport.user.Medico_id)
              }).then(function(creado){
                models.MedicoEspecialidad.findOne({
                  where:{
                    especialidad_id: parseInt(especialidad.id),
                    medico_id: parseInt(req.session.passport.user.Medico_id)
                  }
                }).then(function(creado){
                  creado = JSON.parse(JSON.stringify(creado));
                  creado['Especialidad'] = JSON.parse(JSON.stringify(especialidad));
                  if (especialidad){
                    creado['success'] = true;
                  }
                  res.send(creado);
                });
              });
            }
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
            object.medico_id = medico.id;
            models.CalificacionMedico.findOrCreate({
              where: {
                usuario_id: req.session.passport.user.id,
                medico_id: medico.id
              },
              defaults: {
                usuario_id: req.session.passport.user.id,
                medico_id: medico.id
              }
            }).spread(function(CalificacionMedico,created){
              if (CalificacionMedico){
                models.PreguntasMedico.findOrCreate({
                  where: {
                    calificacionmedico_id: CalificacionMedico.id
                  },
                  defaults: {
                    medico_id: object.medico_id,
                    calificacionmedico_id: CalificacionMedico.id,
                    higiene: object.respuestas.higiene,
                    puntualidad: object.respuestas.puntualidad,
                    instalaciones: object.respuestas.instalaciones,
                    tratoPersonal: object.respuestas.tratoPersonal,
                    satisfaccionGeneral: object.respuestas.satisfaccionGeneral,
                    costo: object.respuestas.costo
                  }
                }).spread(function(PreguntasMedico, created){
                  if (!created){
                    //Actualizar resultados
                    PreguntasMedico.update({
                      medico_id: object.medico_id,
                      higiene: object.respuestas.higiene,
                      puntualidad: object.respuestas.puntualidad,
                      instalaciones: object.respuestas.instalaciones,
                      tratoPersonal: object.respuestas.tratoPersonal,
                      satisfaccionGeneral: object.respuestas.satisfaccionGeneral,
                      costo: object.respuestas.costo
                    }).then(function(result){
                      _this.calcularCalificacionMedico(object, req, res, true);
                    });
                  } else {
                    _this.calcularCalificacionMedico(object, req, res, false);
                  }
                });
              } else {
                res.status(200).json({
                  success: false
                });
              }
            });
          });
      } else {
        res.status(200).json({error:1});
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  calcularCalificacionMedico: function(object, req, res, modificacion){
    try{
      models.Medico.findById(object.medico_id).then(function(medico){
        var promedio = 0;
        models.PreguntasMedico.findAll({
          where: {
            medico_id: object.medico_id
          }
        }).then(function(calificaciones){
          calificaciones.forEach(function(cal){
              promedio +=  ((parseInt(cal.higiene) + parseInt(cal.puntualidad) + parseInt(cal.instalaciones) + parseInt(cal.tratoPersonal) + parseInt(cal.satisfaccionGeneral) + parseInt(cal.costo)) / 6);
          });
          promedio = promedio/calificaciones.length;
          medico.update({calificacion :  promedio});
        });
        res.status(200).json({
          success:true
        })
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
                medico_id: medico.id,
                visible: 1
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
              },{
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
            if (object.experiencia_id != "" && parseInt(object.experiencia_id)>0){
              models.MedicoExperiencia.update( {
                titulo:object.titulo,
                lugarTrabajo:object.institucion,
                descripcion:object.descripcion,
                fechaInicio: object.fechaInicio,
                fechaFin: object.fechaFin,
                actual: object.actual,
                estado_id: parseInt(object.estado_id),
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
                estado_id: parseInt(object.estado_id),
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
        } ).catch( function ( err ) {
          req.errorHandler.report(err, req, res);
        } );
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  comentarios: function (object, req, res){
    try{
      models.ComentariosMedicos.findAll( {
        include: [ {
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil','usuarioUrl','tipoUsuario'],
          include:[{
            model: models.DatosGenerales
          }]
        }],
        order:[['fecha','DESC']],
        where: {
          medico_id: req.session.passport.user.Medico_id
        }
      } ).then( function ( comentarios ) {
        res.render('medico/comentarios',{comentarios:comentarios});
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  comentarioVisible: function (object, req, res){
    if (req.session.passport && req.session.passport.user && req.session.passport.user.Medico_id){
        models.ComentariosMedicos.findOne( {
          attributes: ['id','visible'],
          where: {
            medico_id: req.session.passport.user.Medico_id,
            id: object.comentario_id
          }
        } ).then( function ( comentario ) {
          if (comentario){
            comentario.update({visible: object.visible}).then(function(result){
                res.status(200).json({
                  success:true,
                  result: result
                })
            });
          } else {
            res.status(200).json({
              success:false
            })
          }
        } );
    } else {
      res.status(200).json({
        success:false
      })
    }
  },

  comentarioResponder: function (object, req, res){
    //{"comentario_id":"12","respuesta":"hola"}
      if (req.session.passport && req.session.passport.user && req.session.passport.user.Medico_id){
          models.ComentariosMedicos.findOne( {
            attributes: ['id','respuesta','fecharespuesta','usuario_id'],
            where: {
              medico_id: req.session.passport.user.Medico_id,
              id: object.comentario_id
            },
            include: [{
              model: models.Medico,
              attributes: ['id'],
              include: [{
                model: models.Usuario,
                attributes: ['urlFotoPerfil'],
                include: [{
                  model: models.DatosGenerales
                }]
              }]
            }]
          } ).then( function ( comentario ) {
            if (comentario){
              comentario.update({respuesta: object.respuesta,fecharespuesta:new Date().toISOString()}).then(function(result){
                  //Crear notificacion para Paciente
                  models.Notificacion.findOrCreate({
                    where: {
                      tipoNotificacion_id: 16,
                      usuario_id: comentario.usuario_id,
                      data: object.comentario_id
                    },
                    defaults: {
                      tipoNotificacion_id: 16,
                      usuario_id: comentario.usuario_id,
                      data: object.comentario_id
                    }
                  });

                  res.status(200).json({
                    success:true,
                    result: result
                  })
              });
            } else {
              res.status(200).json({
                success:false
              })
            }
          } );
      } else {
        res.status(200).json({
          success:false
        })
      }
  },
  detalleMedico: function (object, req, res){
    models.Medico.findOne({
      attributes: ['id'],
      where: models.sequelize.or(
        { id: object.medico_id },
        { id: req.session.passport.user.Medico_id }
      ),
      include: [{
        model: models.Usuario,
        attributes: ['urlFotoPerfil','correo'],
        include: [{
          model: models.DatosGenerales,
        }]
      }]
    }).then(function(result){
      res.status(200).json({
        success:true,
        result: result
      })
    });
  },
  cedulaGeneral: function (object, req, res){
    models.Medico.findOne({
      where: {
        cedula: object.cedula,
        usuario_id: {$not: req.session.passport.user.id}
      }
    }).then(function(existe){
      if (existe){
        res.status(200).json({
          success: false,
          registrado: true
        });
      } else {
        var request = require("request");
        iconv  = require('iconv-lite');

        var options = {
          method: 'POST',
          encoding: null,
          url: 'http://www.cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action',
          headers:
           {
             'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
             'Accept-Charset': 'utf-8'
           },
          body: 'json=%7B%22maxResult%22%3A%221000%22%2C%22idCedula%22%3A%222'+ object.cedula +'%22%2C%22nombre%22%3A%22%22%2C%22paterno%22%3A%22%22%2C%22materno%22%3A%22%22%2C%22h_genero%22%3A%22%22%2C%22genero%22%3A%22%22%2C%22annioInit%22%3A%22%22%2C%22annioEnd%22%3A%22%22%2C%22insedo%22%3A%22%22%2C%22inscons%22%3A%22%22%2C%22institucion%22%3A%22TODAS%22%7D'
        };

        request(options, function (error, response, body) {
          if (error){
            res.status(200).json({
              success:false,
              result: error
            });
          } else {
            body= iconv.decode(new Buffer(body), "ISO-8859-1");
            if (JSON.parse(body).items && JSON.parse(body).items.length>0){
              body = body.split('[{')[1].split('}]')[0].split(",");
              var nombre = '';
              var paterno = '';
              var materno = '';
              var anio = '';
              var institucion = '';
              var cedula = '';
              var sexo = '';
              var titulo = '';
              var tipo = '';
              var insedo = '';
              var inscons = '';
              body.forEach(function(res){
                var string1 = res.split(":")[0];
                var string2 = res.split(":")[1];
                if (string1 && string2 && string2.replace("\"","").replace('"',"") != "null"){
                  string1 = string1.replace("\"","").replace('"',"");
                  string2 = string2.replace("\"","").replace('"',"");
                  if (string1 == "anioreg"){
                    anio = string2;
                  } else if (string1 == "desins"){
                    institucion = string2;
                  } else if (string1 == "idCedula"){
                    cedula = string2;
                  } else if (string1 == "nombre"){
                    nombre = string2;
                  } else if (string1 == "paterno"){
                    paterno = string2;
                  } else if (string1 == "materno"){
                    materno = string2;
                  } else if (string1 == "sexo"){
                    sexo = string2;
                  } else if (string1 == "titulo"){
                    titulo = string2;
                  } else if (string1 == "tipo"){
                    tipo = string2;
                  } else if (string1 == "inscons"){
                    inscons = string2;
                  } else if (string1 == "insedo"){
                    insedo = string2;
                  }
                }
              });
              var resultArray = {
                anio: anio,
                institucion: institucion,
                titulo: titulo,
                tipo: tipo,
                inscons: inscons,
                insedo: insedo,
                cedula: cedula,
                nombre: nombre,
                paterno: paterno,
                materno: materno,
                sexo: sexo
              }

              console.log('Primer validación: '+ object.genero + ' = ' + sexo +' ' + (object.genero == sexo));
              if (object.nombreMedico.toUpperCase().replace(' ','') == nombre.toUpperCase().replace(' ','') && object.paterno.toUpperCase().replace(' ','') == paterno.toUpperCase().replace(' ','') && object.materno.toUpperCase().replace(' ','') == materno.toUpperCase().replace(' ','') && object.genero == sexo){
                if (object.tipo == resultArray.tipo){
                  if (object.tipo == "C1"){
                    models.Medico.update({
                      cedula: object.cedula,
                      titulo: resultArray.titulo
                    },{
                      where: {
                        usuario_id: req.session.passport.user.id
                      }
                    }).then(function(result){
                      res.status(200).json({
                        success:true,
                        exists: true,
                        result: resultArray
                      });
                    });
                  } else {
                    models.MedicoEspecialidad.findOne({
                      where: {
                        cedula: object.cedula
                      }
                    }).then(function(MedicoEspecialidad){
                      if (!MedicoEspecialidad){
                        console.log('Insertar especialidad');
                        models.Especialidad.findOrCreate({
                          where:{
                            especialidad: object.titulo
                          },
                          defaults: {
                            especialidad: object.titulo
                          }
                        }).spread(function(especialidad,created){
                          models.MedicoEspecialidad.create({
                            medico_id: req.session.passport.user.Medico_id,
                            cedula: object.cedula,
                            titulo: resultArray.titulo,
                            especialidad_id: especialidad.id,
                            anio: resultArray.anio
                          });
                        });
                        res.status(200).json({
                          success:true,
                          exists: true,
                          result: resultArray
                        });
                      } else {
                        res.status(200).json({
                          success:false,
                          exists: true,
                          repeat: true,
                          result: resultArray
                        });
                      }
                    });
                  }
                } else {
                  res.status(200).json({
                    success:false,
                    exists: true,
                    tipo: true,
                    result: resultArray
                  });
                }
              } else {
                res.status(200).json({
                  success:false,
                  exists: true,
                  result: resultArray
                });
              }
            } else {
              res.status(200).json({
                success:false,
                exists: false,
                result: resultArray
              });
            }

          }
        });
      }
    });



  },

  registrarDatosGenerales: function ( object, req, res){
    console.log('OBJECT: ' + JSON.stringify(object));


    try{
      if ( req.session.passport.user && req.session.passport.user.tipoUsuario === "M" ) {
        var usuario_id = req.session.passport.user.id;
        models.Medico.findOne({where: {
            usuario_id: {$ne: req.session.passport.user.id},
            curp: object.curp
          }}).then(function(medicoCurp){
            if (!medicoCurp){
              models.DatosGenerales.upsert({
                nombre: object.nombre,
                apellidoP: object.paterno,
                apellidoM: object.materno,
                usuario_id: usuario_id
              },{where: {
                usuario_id: usuario_id
              }}).then(function(DG){
                models.Medico.upsert({
                  curp: object.curp,
                  fechaNac: object.fechaNac,
                  usuario_id: usuario_id
                  },{where: {
                    usuario_id: usuario_id
                }}).then(function(MED){
                  models.Biometrico.upsert({
                    genero: object.genero,
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

  especialidadEstudioAgregar: function (object, req, res){

    models.Especialidad.findOrCreate({
      where:{
        especialidad: object.especialidad
      },
      defaults: {
        especialidad: object.especialidad
      }
    }).spread(function(especialidad,created){
      models.MedicoEspecialidad.findOne({
        where: {
          especialidad_id: especialidad.id
        }
      }).then(function(MedicoEspecialidad){
        if (!MedicoEspecialidad){
          models.MedicoEspecialidad.create({
            medico_id: req.session.passport.user.Medico_id,
            especialidad_id: especialidad.id
          }).then(function(MedicoEspecialidad){
              res.status(200).send( {
                'success': true,
                'result': MedicoEspecialidad
              } );
          });
        } else {
          res.status(200).send( {
            'success': false,
            'repeat': true
          } );
        }
      });
    });
  },

  getFeedback: function (object, req, res){
    models.Medico.findOne({
      where: {
        usuario_id: req.session.passport.user.id
      },
      attributes: ['calificacion']
    }).then(function(calificacion){
      models.sequelize.query("SELECT Year(`fecha`) as 'anio', Month(`fecha`) as 'mes', AVG(`higiene`) AS 'higiene',AVG(`puntualidad`) AS 'puntualidad',AVG(`instalaciones`) AS 'instalaciones',AVG(`tratoPersonal`) AS 'tratoPersonal',AVG(`costo`) AS 'costo',AVG(`satisfaccionGeneral`) AS 'satisfaccionGeneral' FROM `intermed`.`preguntas-medico` where `medico_id` = 1 group by year(`fecha`),month(`fecha`) order by year(`fecha`) ASC,month(`fecha`) ASC;", { type: models.sequelize.QueryTypes.SELECT})
      .then(function(promedios) {
        models.sequelize.query("SELECT COUNT(`satisfaccionGeneral`) as 'total', `satisfaccionGeneral` as 'porcentaje' FROM `intermed`.`preguntas-medico`  where `medico_id` = 1 GROUP BY `satisfaccionGeneral` ORDER BY `satisfaccionGeneral` ASC;", { type: models.sequelize.QueryTypes.SELECT})
        .then(function(general) {
          res.status(200).json({calificacion: calificacion, promedios:promedios, general: general})
        });
      })
    });
  }

}
