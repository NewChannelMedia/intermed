var models  = require('../models');

/**
Controlador de para médicos
*	@author Ivan Salcedo
*	@version 0.0.0.0
*/

module.exports = {

  obtieneAjax: function(object, req, res){
    models.Medico.findAll({
      include: [
        { model: models.Usuario },
        { model: models.Especialidad}
      ]}).then(function(datos) {
        res.send(datos);
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
              { model: models.Direccion},
              { model: models.Telefono},
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
            where : { id : object["id"] },
            include: [{ model: models.DatosGenerales },
              { model: models.Medico },
              { model: models.Direccion},
              { model: models.Telefono}
            ]
          }).then(function(medico) {
              // enviando datos
              res.send(medico);
          });
  },


  registrar2: function(object, req, res) {
    middle.insertaMedicos(object, function(datos) {
      res.send(datos);
    });
  },

  // Método que registra médicos

  registrar: function(object, req, res) {

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
              var id = usuario.id;

            //  delete object["id"];
              object["id"] = 1;

              return models.DatosGenerales.create({
                nombre: object['nombreMed'],
                apellidoP: object['apellidoMed'],
                apellidoM: object['apellidoMed'],
                rfc: '',
                usuario_id: id
            }, {transaction: t}).then(function (result){
                  return models.Direccion.create({
                    calle: object['calleMed'],
                numero: object['numeroMed'],
                calle1: object['calle1Med'],
                calle2: object['calle2Med'],
                localidad_id: 20024,
                principal: 1,
                usuario_id: id
                }, {transaction: t}).then(function (result){
                      return models.Telefono.create({
                          tipo: '1',
                          numero: object['telefonoMed'],
                          usuario_id: id
                      }, {transaction: t}).then(function(result){
                            return models.Medico.create({
                              usuario_id: id
                            }, {transaction: t}).then(function(medico) {
                                // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
                                return models.MedicoEspecialidad.create({
                                    tipo: '1',
                                    titulo: '',
                                    lugarEstudio: '',
                                    medico_id: medico.id,
                                    especialidad_id: object['especialidadMed']   // Id de la especialidad
                                }, {transaction: t})
                            })
                      });
                });
            });
          });

        }).then(function(result) {
              // transacción completa
          //  res.status(200).json({ok: true});
              res.send(object);
        }).catch(function(err) {
            console.log('ERROR: ' + err);
              res.json(object);
        });
    },


    actualizar: function(object, req, res) {
      middle.guardaMedicos(object, function(datos) {
        res.send(datos);
      });
    },

    // Método para actualizar médicos
    actualizar2: function(object, req, res) {
        var id = object['id'];
        var idMedico = 0;

        // Obteniendo el id del médico a partir del id de usuario
        models.Medico.findOne({ where: {usuario_id : id}} ).then(function(datos) {
            idMedico = datos.id;
        });

        models.sequelize.transaction({
            isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
          }, function (t) {

              // actualizando usuario
              models.Usuario.update({
                  usuario: object['correoMed'], correo: object['correoMed']
                }, {
                  where: { id : id }
              });

              // actualizando nombres
              models.DatosGenerales.update({
                   nombre: object['nombreMed'],
                   apellidoP: object['apellidoMed'],
                   apellidoM: object['apellidoMed']
                 }, {
                   where: { usuario_id : id }
              });

              // actualizando dirección
              models.Direccion.update({
                   calle: object['calleMed'],
                   numero: object['numeroMed'],
                   calle1: object['calle1Med'],
                   calle2: object['calle2Med'],
                   colonia: object['coloniaMed'],
                   estado_id: object['estadoMed'],
                   ciudad: object['ciudadMed'],
                   cp: object['cpMed'],
                 }, {
                   where: { usuario_id : id }
               });

              // actualizando telefono
               models.Telefono.update({
                   telefono: object['telefonoMed']
                 }, {
                   where: { usuario_id : id }
               });

               // actualizando especialidad del médico
               models.MedicoEspecialidad.update({
                   especialidad_id: object['especialidadMed']
                 }, {
                   where: { medico_id : idMedico }
               });
          }).then(function(result) {
                // transacción completa
                res.json({ok: true});
          }).catch(function(err) {
            res.json({error: err});
          });
    },
    // obtiene id medico @alan
    seleccionaMedico: function(object, req, res) {
        models.Usuario.findOne({
          where : { id : object["id"] },
          include: [{ model: models.DatosGenerales },
            { model: models.Medico },
            { model: models.Direccion},
            { model: models.Telefono}
          ]
        }).then(function(medico) {
        				//Rendereando index y pasando los registros a la vista
          		  res.render('actualizar', {
                  layout: null,
                  medico: medico
          			});
            });
    },
    // obtiene id medico
    seleccionaTodosMedico: function(object, req, res) {
        models.Usuario.findAll({
          include: [{ model: models.DatosGenerales },
            { model: models.Medico },
            { model: models.Direccion},
            { model: models.Telefono}
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
    actualizaMedico : function(object, req, res) {
      models.Medico.update({
          cedula: object['cedula'],
          codigoMedico: object['codigo'],
        }, {
          where: { usuario_id : object['id'] }
        }).then(function(datos) {
            res.send(datos);
      }).catch(function(err) {
            res.status(500).json({error: err});
      });
    },

    agregaMedicoFavorito : function(object, req, res) {
        models.MedicoFavorito.create({
           usuario_id: object.idUsuario,
            medico_id : object.idMedico
        }).then(function(datos) {
          res.send(datos);
        });
    },

    obtieneMedicoFavorito : function(object, req, res) {
      models.Medico.findAll({
        include: [{ model: models.MedicoFavorito },
          { model: models.Usuario },
          { model: models.Especialidad },
        ],
        where : { usuario_id : object.idUsuario },
      }).then(function(datos) {
          res.send(datos)
      });
    },

    borraMedicoFavorito : function(object, req, res) {
      models.MedicoFavorito.destroy({
        where : { id : object.id }
      }).then(function() {
          res.status(200).json({ok: true});
      });
    },

    borraFormacion : function(object, req, res) {
      models.MedicoFormacion.destroy({
        where : { id : object.id }
      }).then(function() {
          res.status(200).json({ok: true});
      });
    },

    obtieneFormacion: function(object, req, res) {
      models.MedicoFormacion.findAll({
        where : { medico_id : object.id }
      }).then(function(datos) {
          res.send(datos)
      });
    },

    agregaFormacion : function(object, req, res) {
        models.MedicoFormacion.create({
          nivel: object.nivel,
          especialidad: object.especialidad,
          lugarDeEstudio: object.lugarDeEstudio,
          fechaInicio: object.fechaInicio,
          fechaFin: object.fechaFin,
          fechaTitulo: object.fechaTitulo,
          actual: object.actual,
          medico_id: object.idMedico
        }).then(function(datos) {
            res.status(200).json({ok: true});
        }).catch(function(err) {
            res.status(500).json({error: err});
        });
    },

    actualizaFormacion : function(object, req, res) {
        models.MedicoFormacion.update({
          nivel: object.nivel,
          especialidad: object.especialidad,
          lugarDeEstudio: object.lugarDeEstudio,
          fechaInicio: object.fechaInicio,
          fechaFin: object.fechaFin,
          fechaTitulo: object.fechaTitulo,
          actual: object.actual
        }, { where  : {  id: object.id }
        }).then(function(datos) {
            res.status(200).json({ok: true});
        }).catch(function(err) {
              res.status(500).json({error: err});
        });
    },

    obtieneExperiencia: function(object, req, res) {
      models.MedicoFormacion.findAll({
        where : { medico_id : object.id }
      }).then(function(datos) {
          res.send(datos)
      });
    },

    insertaExperiencia : function(object, req, res) {
        models.MedicoExperiencia.create({
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
        }).then(function(datos) {
            res.status(200).json({ok: true});
        }).catch(function(err) {
            res.status(500).json({error: err});
        });
    },

    actualizaExperiencia : function(object, req, res) {
        models.MedicoExperiencia.update({
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
        }, { where :  { id: object.id }}).then(function(datos) {
            res.status(200).json({ok: true});
        }).catch(function(err) {
              res.status(500).json({error: err});
        });
    },

    borraExperiencia: function(object, req, res) {
      models.MedicoExperiencia.destroy({
        where : { id : object.id }
      }).then(function() {
          res.status(200).json({ok: true});
      });
    },

    obtieneComentario: function(object, req, res) {
      models.ComentariosMedicos.findAll({
        include: [{ models : Usuario }],
        where : { medico_id : object.id }
      }).then(function(datos) {
          res.send(datos)
      });
    },

    actualizaComentario: function(object, req, res) {
      models.ComentariosMedicos.update({
        comentario: object.comentario,
        aninimo: object.anonimo,
        medico_id: object.idMedico,
        usuario_id: object.idUsuario
      }, { where :  { id: object.id }}).then(function(datos) {
          res.status(200).json({ok: true});
      }).catch(function(err) {
          res.status(500).json({error: err});
      });
    },

    agregaComentario: function(object, req, res) {
      models.ComentariosMedicos.create({
        comentario: object.comentario,
        aninimo: object.anonimo,
        medico_id: object.idMedico,
        usuario_id: object.idUsuario
      }).then(function(datos) {
          res.status(200).json({ok: true});
      }).catch(function(err) {
          res.status(500).json({error: err});
      });
    },

    borraComentarios: function(object, req, res) {
      models.ComentariosMedicos.destroy({
          where :  { id: object.id }
      }).then(function(datos) {
          res.status(200).json({ok: true});
      }).catch(function(err) {
          res.status(500).json({error: err})
      });
    },


}
