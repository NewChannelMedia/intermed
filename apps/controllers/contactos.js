var models = require( '../models' );
var mail = require( './emailSender' );
/**
Controlador de para contactos
*	@author Cinthia Bermúdez
*	@version 0.0.0.0
*/

module.exports = {
  agregarFav: function ( object, req, res ) {
    try{
      if ( req.session.passport.user ) {
        if (req.session.passport.user.id != object.usuario_id){
          models.Usuario.findOne({
            where: {
              id: object.usuario_id
            },
            attributes: ['id','tipoUsuario'],
            include: [{
              model: models.Medico,
              attributes: ['id']
            },{
              model: models.Paciente,
              attributes: ['id']
            }]
          }).then(function(usuario){
            var usuario_id = usuario.id;
            var tipoUsuario = usuario.tipoUsuario;
            var tipoUsuario_id = '';
            if (usuario.Medico){
              tipoUsuario_id = usuario.Medico.id;
            } else if (usuario.Paciente){
              tipoUsuario_id = usuario.Paciente.id;
            }
            if (req.session.passport.user.tipoUsuario == "P"){
              //Paciente agrega a medico
              if (tipoUsuario == "M"){
                //Crear relación simple
                models.MedicoFavorito.findOrCreate({
                  defaults: {
                    usuario_id: req.session.passport.user.id,
                    medico_id: tipoUsuario_id,
                    mutuo: 1
                  },
                  where:  {
                    usuario_id: req.session.passport.user.id,
                    medico_id: tipoUsuario_id
                  }
                }).spread(function(result, created) {
                  if (created){
                    models.Notificacion.create({
                      usuario_id: usuario_id,
                      tipoNotificacion_id: 7,
                      data: req.session.passport.user.Paciente_id.toString()
                    });
                  }
                  if (result){
                    res.status(200).send( {
                      success: true
                    } );
                  } else {
                    res.status(200).send( {
                      success: false
                    } );
                  }
                });
              } else {
                //Paciente agrega a Paciente
                  models.MedicoFavorito.findOrCreate({
                    defaults: {
                      usuario_id: req.session.passport.user.id,
                      paciente_id: tipoUsuario_id
                    },
                    where:  {
                      usuario_id: req.session.passport.user.id,
                      paciente_id: tipoUsuario_id
                    }
                  }).spread(function(result, created) {
                    if (result){
                      models.MedicoFavorito.findOrCreate( {
                        defaults: {
                          usuario_id: usuario_id,
                          paciente_id: req.session.passport.user.Medico_id,
                        },
                        where:  {
                          usuario_id: usuario_id,
                          paciente_id: req.session.passport.user.Medico_id,
                          aprobado: 0
                        }
                      }).spread(function(result, created){
                        if (created){
                          models.Notificacion.create( {
                            usuario_id: usuario_id,
                            tipoNotificacion_id: 1,
                            data: req.session.passport.user.Paciente_id.toString()
                          } );
                        }
                        if (result){
                          res.status(200).send( {
                            success: true
                          } );
                        } else {
                          res.status(200).send( {
                            success: false
                          } );
                        }
                      })

                    } else {
                      res.status(200).send( {
                        success: false
                      } );
                    }
                  });
              }
            } else if (req.session.passport.user.tipoUsuario == "M"){
              //Medico agrega a medico
              if (tipoUsuario == "M"){
                models.MedicoFavorito.findOrCreate({
                  defaults: {
                    usuario_id: req.session.passport.user.id,
                    medico_id: tipoUsuario_id
                  },
                  where:  {
                    usuario_id: req.session.passport.user.id,
                    medico_id: tipoUsuario_id
                  }
                }).spread(function(result, created) {
                  if (result){
                    models.MedicoFavorito.findOrCreate( {
                      defaults: {
                        usuario_id: usuario_id,
                        medico_id: req.session.passport.user.Medico_id,
                      },
                      where:  {
                        usuario_id: usuario_id,
                        medico_id: req.session.passport.user.Medico_id,
                        aprobado: 0
                      }
                    }).spread(function(result, created){
                      if (created){
                        models.Notificacion.create( {
                          usuario_id: usuario_id,
                          tipoNotificacion_id: 4,
                          data: req.session.passport.user.Medico_id.toString()
                        } );
                      }
                      if (result){
                        res.status(200).send( {
                          success: true
                        } );
                      } else {
                        res.status(200).send( {
                          success: false
                        } );
                      }
                    })

                  } else {
                    res.status(200).send( {
                      success: false
                    } );
                  }
                });
              }
            }
          });

        } else {
          res.status(200).json({success:false});
        }
      }
      else {
        res.status(200).send( {
          success: false,
          error: 1
        } );
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  eliminarFav: function ( object, req, res ) {
    try{
      if ( req.session.passport.user ) {

          models.Usuario.findOne({
            where: {
              id: object.usuario_id
            },
            attributes: ['id','tipoUsuario'],
            include: [{
              model: models.Medico,
              attributes: ['id']
            },{
              model: models.Paciente,
              attributes: ['id']
            }]
          }).then(function(usuario){
            var usuario_id = usuario.id;
            var tipoUsuario = usuario.tipoUsuario;
            var tipoUsuario_id = '';
            if (usuario.Medico){
              tipoUsuario_id = usuario.Medico.id;
            } else if (usuario.Paciente){
              tipoUsuario_id = usuario.Paciente.id;
            }

            if (req.session.passport.user.tipoUsuario == "P"){
              if (tipoUsuario == "M"){
                //Paciente deja de seguir a medico
                models.MedicoFavorito.destroy({
                  where: {
                    usuario_id: req.session.passport.user.id,
                    medico_id: tipoUsuario_id
                  }
                }).then(function(){
                  res.status(200).json({success:true});
                });
              } else {
                //Paciente elimina a Paciente
                models.MedicoFavorito.destroy( {
                  where: {
                    usuario_id: usuario_id,
                    paciente_id: req.session.passport.user.Paciente_id
                  }
                } ).then(function(){
                  models.MedicoFavorito.destroy({
                      where: {
                        usuario_id: req.session.passport.user.id,
                        paciente_id: tipoUsuario_id
                      }
                  }).then(function(){
                    models.Notificacion.destroy( {
                      where: {
                        tipoNotificacion_id: 1,
                        usuario_id: usuario_id,
                        data: req.session.passport.user.Paciente_id
                      }
                    } ).then(function(){
                      res.status(200).json({success:true});
                    });
                  });
                });
              }
            } else if (req.session.passport.user.tipoUsuario == "M"){
              //Medico agrega a medico
              if (tipoUsuario == "M"){
                models.MedicoFavorito.destroy( {
                  where: {
                    usuario_id: usuario_id,
                    medico_id: req.session.passport.user.Medico_id
                  }
                } ).then(function(){
                  models.MedicoFavorito.destroy({
                      where: {
                        usuario_id: req.session.passport.user.id,
                        medico_id: tipoUsuario_id
                      }
                  }).then(function(){
                    models.Notificacion.destroy( {
                      where: {
                        tipoNotificacion_id: 4,
                        usuario_id: usuario_id,
                        data: req.session.passport.user.Medico_id
                      }
                    } ).then(function(){
                      res.status(200).json({success:true});
                    });
                  });
                });
              }
            }
            if (object.notificacion_id){
              var numNot = 0;
              if (req.session.passport.user.tipoUsuario == "P"){
                numNot = 8;
              } else if (req.session.passport.user.tipoUsuario == "M"){
                numNo = 9;
              }
              models.Notificacion.update({
                tipoNotificacion_id: numNo
              },{
                where: { id: object.notificacion_id}
              })
            }
          });
      }
      else {
        res.status(200).send( {
          success: false,
          error: 1
        } );
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarFavCol: function ( object, req, res ) {
    try{
      if ( object.usuario == '' && req.session.passport.user ) {
        object.usuario = req.session.passport.user.id;
      }
      models.MedicoFavorito.findAll( {
        where: {
          usuario_id: object.usuario,
          aprobado: 1,
          mutuo: 1
        },
        include: [
          {
            model: models.Medico,
            attributes: [ 'id' ],
            include: [
              {
                model: models.Usuario,
                attributes: [ 'id', 'usuarioUrl', 'urlFotoPerfil' ],
                include: [ {
                  model: models.DatosGenerales
                      } ]
              },
              {
                model: models.MedicoEspecialidad,
                include: [ {
                  model: models.Especialidad
                      } ]
              }
            ]
          },
          {
            model: models.Paciente,
            attributes: [ 'id' ],
            include: [
              {
                model: models.Usuario,
                attributes: [ 'id', 'usuarioUrl', 'urlFotoPerfil' ],
                include: [ {
                  model: models.DatosGenerales
                        } ]
              }
            ]
          }
      ]
      } ).then( function ( result ) {
        res.send( result );
      } );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  aceptarInvitacion: function ( object, req, res ) {
    try{
      if ( req.session.passport.user ) {
          models.Usuario.findOne({
            where: {
              id: object.usuario_id
            },
            attributes: ['id','tipoUsuario'],
            include: [{
              model: models.Medico,
              attributes: ['id']
            },{
              model: models.Paciente,
              attributes: ['id']
            }]
          }).then(function(usuario){
            if (usuario.Medico){
              object.medicoID = usuario.Medico.id;
            } else if (usuario.Paciente){
              object.pacienteID = usuario.Paciente.id;
            }
            var condiciones = [];
            if (object.pacienteID){
              condiciones = {
                usuario_id: req.session.passport.user.id,
                paciente_id: object.pacienteID
              }
            } else {
              condiciones = {
                usuario_id: req.session.passport.user.id,
                medico_id: object.medicoID
              }
            }
            models.MedicoFavorito.findOne( {
              where: condiciones
            } ).then( function ( result ) {
              if ( result ) {
                result.update( {
                  aprobado: 1,
                  mutuo: 1
                } ).then( function ( result ) {
                  if (req.session.passport.user.tipoUsuario == "P"){
                      models.Usuario.findOne( {
                        attributes: [ 'id' ],
                        include: [ {
                          model: models.Paciente,
                          where: {
                            id: object.pacienteID
                          },
                          attributes: [ 'id' ]
                        } ]
                      } ).then( function ( usuario ) {
                        models.Notificacion.create( {
                          usuario_id: usuario.id,
                          tipoNotificacion_id: 2,
                          data: req.session.passport.user.Paciente_id.toString()
                        } );
                        models.MedicoFavorito.update({
                            mutuo: 1
                          },{
                          where: {
                            usuario_id: usuario.id,
                            paciente_id: req.session.passport.user.Paciente_id.toString()
                          }
                        });
                        res.send( {
                          result: 'success'
                        } );
                      } );
                    } else {
                      models.Usuario.findOne( {
                        attributes: [ 'id' ],
                        include: [ {
                          model: models.Medico,
                          where: {
                            id: object.medicoID
                          },
                          attributes: [ 'id' ]
                        } ]
                      } ).then( function ( usuario ) {
                        models.Notificacion.create( {
                          usuario_id: usuario.id,
                          tipoNotificacion_id: 5,
                          data: req.session.passport.user.Medico_id.toString()
                        } );
                        models.MedicoFavorito.update({
                            mutuo: 1
                          },{
                          where: {
                            usuario_id: usuario.id,
                            medico_id: req.session.passport.user.Medico_id.toString()
                          }
                        });
                        res.send( {
                          result: 'success'
                        } );
                      } );
                    }
              } )
          } else {
            res.send( {
              result: 'error'
            } );
          }
        } );
        if ( object.notificacion_id ) {
          var numNot = 0;
          if (req.session.passport.user.tipoUsuario == "P"){
            numNot = 3;
          } else if (req.session.passport.user.tipoUsuario == "M"){
            numNot = 6;
          }
          models.Notificacion.update( {
            tipoNotificacion_id: numNot,
            visto: 1
          }, {
            where: {
              id: object.notificacion_id
            }
          } );
        }
      });
      }
      else {
        res.send( {
          result: 'error',
          error: 'Necesitas iniciar sesión'
        } );
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  contactosRecomendados: function(req, res){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        //carga de los modelo
        models.MedFavColegas.findAll({
          where:{usuario_id:usuario_id, medico_id:null},
          include:[{
            model:models.Paciente,
            include:[{
              model:models.Usuario,
              attributes:['urlFotoPerfil'],
              include:[{
                model:models.DatosGenerales,
                attributes:['nombre','apellidoP','apellidoM']
              }]
            }]
          }]
        }).then(function(datos){
          res.send(datos);
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  medicosContacto: function( req, res ){
    try{
      if (req.body.idMedico){
        if ( req.session.passport.user && req.session.passport.user.id > 0 ){
          var usuario_id = req.session.passport.user.id;
          models.Medico.findOne({
            attributes:['id'],
            include:[{
              model: models.Usuario,
              attributes:['id','usuarioUrl','urlFotoPerfil'],
              include:[{
                model: models.DatosGenerales,
                where:{ id: req.body.idMedico },
                attributes:['nombre','apellidoP','apellidoM']
              }]
            }]
          }).then(function(encontrado){
            res.send(encontrado);
          });
        }
      } else {
        models.Usuario.findOne({
          attributes:['id','usuarioUrl','urlFotoPerfil'],
          include: [
            {
              model: models.DatosGenerales,
              attributes:['nombre','apellidoP','apellidoM']
            },
            {
              model: models.Medico,
              attributes:['id']
            }
          ],
          where: {
            id: req.body.usuario_id
          }
        }).then(function(usuario){
          res.send(usuario);
        })
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  medicoRecomendado: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        for( var i in req.body.objeto ){
          models.Notificacion.create({
              usuario_id:req.body.objectoId[ i ],
              tipoNotificacion_id:12,
              data:req.session.passport.user.Paciente_id+"|"+req.body.objeto[ i ]
          }).then(function(creado){
            res.send(true);
          });
        }
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  doctorRecomendado: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Notificacion.create({
          usuario_id: req.body.medicoId,
          tipoNotificacion_id:13,
          data:String(usuario_id)
        }).then(function(creado){
          res.send('ok');
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  pacienteIDOculto: function( req, res ){
    try{
      var cortado = req.body.dato;
      var elem = cortado.split(" ");

      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.MedFavColegas.findAll({
          where:{usuario_id:usuario_id},
          include:[{
            model:models.Paciente,
            include:[{
              model:models.Usuario,
              attributes:['id','urlFotoPerfil'],
              include:[{
                model:models.DatosGenerales,
                where:{
                  nombre:{
                    $like:"%"+elem[0]+"%"
                  },
                  apellidoP:{
                    $like:"%"+elem[1]+"%"
                  }
                }
              }]
            }]
          }]
        }).then(function(datos){
          res.send(datos);
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  usuarioPrincipal: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Paciente.findOne({
          where:{usuario_id:usuario_id},
          attributes:['id'],
          include:[{
            model:models.Usuario,
            attributes:['id'],
            include:[{
              model:models.DatosGenerales,
              attributes:['nombre','apellidoP','apellidoM']
            }]
          }]
        }).then(function(paciente){
          res.send(paciente);
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  especialidadesMedico: function( req, res ){
    try{
      if( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Especialidad.findAll({
          attributes:['id','especialidad']
        }).then(function(especialidades){
          res.send(especialidades);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  medicoDatos: function( req, res ){
    try{
      if( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Medico.findOne({
          where:{id:usuario_id},
          attributes:['id'],
          include:[{
            model:models.Usuario,
            attributes:['id'],
            include:[{
              model:models.DatosGenerales,
              attributes:['nombre','apellidoP','apellidoM']
            }]
          }]
        }).then(function(medico){
          res.send(medico);
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  traerDatos: function( req, res ){
    try{
      if( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Notificacion.findAll({
          where:{
            tipoNotificacion_id:14,
            usuario_id: usuario_id
          }
        }).then( function( encontrado){
          res.send( encontrado );
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  especial: function( req, res ){
    try{
      if( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var resultado = [];
        var total = 0;
        for( var i in req.body.ides ){
          models.Especialidad.findAll({
            where:{id:req.body.ides[ i ]},
            attributes:['id','especialidad']
          }).then(function(especial){
            total++;
            resultado.push(JSON.parse(JSON.stringify(especial)));
            if (total === req.body.ides.length){
              res.send(resultado);
            }
          });
        }
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  cargarContactosMedico: function( req, res ){
    try{
      if( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.MedFavColegas.findAll({
          where:{usuario_id:usuario_id,mutuo:1},
          attributes:['id'],
          include:[{
            model: models.Medico,
            attributes:['id'],
            include:[{
              model: models.Usuario,
              attributes:['urlFotoPerfil'],
              include:[{
                model: models.DatosGenerales,
                attributes:['nombre','apellidoP','apellidoM']
              }]
            },{
              model: models.MedicoEspecialidad,
              attributes:['especialidad_id','titulo','lugarEstudio','fecha','subEsp'],
              include:[{
                model:models.Especialidad,
                attributes:['id','especialidad']
              }]
            }]
          }]
        }).then(function(result){
          res.send( result );
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  enviarMedAPacientes: function( req, res ){
    try{
      var d = new Date();
      var strDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Paciente.findOne({where: {id: req.body.idMed}}).then(function(result){
          models.Notificacion.create({
            usuario_id: result.usuario_id,
            tipoNotificacion_id: 15,
            data: req.session.passport.user.id + '|' + req.body.data,
            inicio:strDate,
            fin: null,
            visto: 0,
            leido: 0,
            recordatorio: null
          }).then( function( creado ){
            res.send(true);
          });
        });
      }

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  consultaMedInfo: function( req, res ){
    try{
      var cortando = req.body.id.split("|");
      var count = 0;
      var medicosArreglo = [];
      for( var i in cortando ){
        if( cortando[ i ] != "" ){
          models.Medico.findAll({
            where:{id:cortando[i]},
            attributes:['id'],
            include:[{
              model: models.Usuario,
              attributes:['usuarioUrl','urlFotoPerfil'],
              include:[{
                model: models.DatosGenerales,
                attributes:['nombre','apellidoP','apellidoM']
              }]
            }]
          }).then( function(medicos){
            medicosArreglo.push(medicos);
            count++;
            if (count == cortando.length){
              res.send(medicosArreglo);
            }
          });
        }else{
          count++;
          if (count == cortando.length){
            res.send(medicosArreglo);
          }
        }
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadDatosGenerales: function(req, res){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Usuario.findOne({
          where:{id:usuario_id},
          attributes:['urlFotoPerfil'],
          include:[{
            model:models.DatosGenerales,
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
  loadBiometricos: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Biometrico.findAll({
          where:{usuario_id:usuario_id},
          attributes:['id','peso','altura','tipoSangre','genero']
        }).then(function(biometricos){
          res.send(biometricos);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  loadTelefonos: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.ContactoEmergencia.findAll({
          where:{usuario_id:usuario_id},
          attributes:['id','nombre','tel','medico']
        }).then(function(contactos){
          res.send(contactos);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  updateName: function(req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var obj = {nombre:req.body.nombre};
        models.DatosGenerales.update(obj, {
          where:{usuario_id:usuario_id}
        }).then(function(actualizado){
          res.send(actualizado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  updateApellidoP: function(req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var obj = {apellidoP:req.body.nombre};
        models.DatosGenerales.update(obj, {
          where:{usuario_id:usuario_id}
        }).then(function(actualizado){
          res.send(actualizado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  updateApellidoM: function(req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var obj = {apellidoM:req.body.nombre};
        models.DatosGenerales.update(obj, {
          where:{usuario_id:usuario_id}
        }).then(function(actualizado){
          res.send(actualizado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  addBio: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Biometrico.create({
          peso: parseFloat(req.body.peso),
          altura: parseFloat(req.body.altura),
          tipoSangre: req.body.tipoS,
          genero: req.body.genero,
          usuario_id: usuario_id
        }).then(function(biometrico){
          res.send(biometrico);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deleteBio: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Biometrico.destroy({
          where:{id:req.body.id}
        }).then(function(destruido){
          if( destruido == 1 ){
            res.sendStatus(200);
          }else{
            res.sendStatus(400);
          }
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  deleteFon: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.ContactoEmergencia.destroy({
          where:{id:req.body.id}
        }).then(function(contacto){
          if( contacto == 1){
            res.sendStatus(200);
          }else{
            res.sendStatus(400);
          }
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  postPaciente:function(req, res){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Paciente.findOne({
          where:{usuario_id:usuario_id},
          attributes:['id']
        }).then(function(encontrado){
          res.send(encontrado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  addTelefon: function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.ContactoEmergencia.create({
          nombre: req.body.nombre,
          tel: req.body.tel,
          medico: parseInt(req.body.medico),
          usuario_id: usuario_id,
          paciente_id: parseInt(req.body.paciente_id)
        }).then(function(creado){
          res.send(creado);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarListaEspCol: function ( object, req, res ) {
    try{
      if ( object.usuario == '' && req.session.passport.user ) {
        object.usuario = req.session.passport.user.id;
      }
      var filtro = new Array();;
      if (object.filtro && object.filtro != ""){
        object.filtro = object.filtro.split(' ');
        object.filtro.forEach(function(result){
            filtro.push(models.sequelize.or(
                {nombre: {$like: '%'+ result +'%'}},
                {apellidoP: {$like: '%'+ result +'%'}},
                {apellidoM: {$like: '%'+ result +'%'}}
            ));
        });
      }
      models.Especialidad.findAll({
        group: ['especialidad'],
        order: ['especialidad'],
        attributes: ['id','especialidad',[models.Sequelize.fn('COUNT', models.Sequelize.col('especialidad')), 'total']],
        include: [
          {
            model: models.MedicoEspecialidad,
            attributes: [ 'id' ],
            where: {
              subEsp: 0
            },
            include: [
              {
                model: models.Medico,
                attributes: [ 'id'],
                include: [ {
                  model: models.MedicoFavorito,
                  where: {
                    usuario_id: object.usuario,
                    aprobado: 1,
                    mutuo: 1
                  }
                },{
                  model: models.Usuario,
                  attributes:['id'],
                  include:[{
                    model:models.DatosGenerales,
                    where: filtro
                  }]
                } ]
              }
            ]
          }
        ]
      }).then(function (result){
        res.status(200).send({'success':true,'result':result});
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarListaColegasByEsp: function (object, req, res){
    try{
      if ( object.usuario_id == '' && req.session.passport.user ) {
        object.usuario_id = req.session.passport.user.id;
      }
      var filtro = new Array();;
      if (object.filtro && object.filtro != ""){
        object.filtro = object.filtro.split(' ');
        object.filtro.forEach(function(result){
            filtro.push(models.sequelize.or(
                {nombre: {$like: '%'+ result +'%'}},
                {apellidoP: {$like: '%'+ result +'%'}},
                {apellidoM: {$like: '%'+ result +'%'}}
            ));
        });
      }

      models.Usuario.findAll({
        attributes:['id','usuarioUrl','urlFotoPerfil','urlPersonal'],
        include: [
          {
            model: models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM'],
            where: filtro
          },
          {
            model: models.Medico,
            attributes: [ 'id'],
            include: [ {
              model: models.MedicoFavorito,
              where: {
                usuario_id: object.usuario_id,
                aprobado: 1,
                mutuo: 1
              }
            }, {
              model: models.MedicoEspecialidad,
              attributes: ['id'],
              where: {
                subEsp: 0,
                especialidad_id: object.especialidad_id
              },
              include: [{
                model: models.Especialidad,
                attributes: ['especialidad']
              }]
            }]
          }
        ]
      }).then(function (result){
        models.Especialidad.findOne({
          where:{
            id: object.especialidad_id
          }
        }).then(function(esp){
          result = JSON.parse(JSON.stringify(result));
          var total = 0;
          result.forEach(function(usuario){
            models.MedicoEspecialidad.findAll({
              attributes: ['id'],
              where: {
                subEsp: 0,
                medico_id: usuario.Medico.id
              },
              include: [{
                model: models.Especialidad,
                attributes: ['especialidad']
              }]
            }).then(function(resultesp){
              total++;
              usuario.Medico.MedicoEspecialidads = resultesp;
              if (total == result.length){
                res.status(200).send({'success':true,'result':result,'especialidad':esp});
              }
            });
          });
        })
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarListaAlfCol: function ( object, req, res ) {
    try{
      if ( object.usuario == '' && req.session.passport.user ) {
        object.usuario = req.session.passport.user.id;
      }
      models.DatosGenerales.findAll({
        attributes: [[models.Sequelize.fn('COUNT', models.Sequelize.col('apellidoP')), 'Total'],[models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra']],
        group: [models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra'],
        order: [models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra'],
        include:[
          {
            model: models.Usuario,
            attributes:['id'],
            include:[
              {
                model: models.Medico,
                attributes: [ 'id'],
                include: [ {
                  model: models.MedicoFavorito,
                  attributes: ['id'],
                  where: {
                    usuario_id: object.usuario,
                    aprobado: 1,
                    mutuo: 1
                  }
                } ]
              }
            ]
          }
        ]
      }).then(function(result){
        res.status(200).send({'success':true,'result':result});
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarListaColegasByAlf: function (object, req, res){
    try{
      if ( object.usuario_id == '' && req.session.passport.user ) {
        object.usuario_id = req.session.passport.user.id;
      }

      models.Usuario.findAll({
        attributes:['id','usuarioUrl','urlFotoPerfil','urlPersonal'],
        include: [
          {
            model: models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM'],
            where:{
              apellidoP: { $like: object.letra +'%'}
            }
          },
          {
            model: models.Medico,
            attributes: [ 'id'],
            include: [ {
              model: models.MedicoFavorito,
              where: {
                usuario_id: object.usuario_id,
                aprobado: 1,
                mutuo: 1
              }
            }]
          }
        ]
      }).then(function (result){
        result = JSON.parse(JSON.stringify(result));
        var total = 0;
        result.forEach(function(usuario){
          models.MedicoEspecialidad.findAll({
            attributes: ['id'],
            where: {
              subEsp: 0,
              medico_id: usuario.Medico.id
            },
            include: [{
              model: models.Especialidad,
              attributes: ['especialidad']
            }]
          }).then(function(resultesp){
            total++;
            usuario.Medico.MedicoEspecialidads = resultesp;
            if (total == result.length){
              res.status(200).send({'success':true,'result':result});
            }
          });
        });
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },


  cargarListaAlfAmi: function ( object, req, res ) {
    try{
      if ( object.usuario == '' && req.session.passport.user ) {
        object.usuario = req.session.passport.user.id;
      }
      models.DatosGenerales.findAll({
        attributes: [[models.Sequelize.fn('COUNT', models.Sequelize.col('apellidoP')), 'Total'],[models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra']],
        group: [models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra'],
        order: [models.Sequelize.fn('SUBSTRING', models.Sequelize.col('apellidoP'),1,1), 'Letra'],
        include:[
          {
            model: models.Usuario,
            attributes:['id'],
            include:[
              {
                model: models.Paciente,
                attributes: [ 'id'],
                include: [ {
                  model: models.MedicoFavorito,
                  attributes: ['id'],
                  where: {
                    usuario_id: object.usuario,
                    aprobado: 1,
                    mutuo: 1
                  }
                } ]
              }
            ]
          }
        ]
      }).then(function(result){
        res.status(200).send({'success':true,'result':result});
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarListaAmistadesByAlf: function (object, req, res){
    try{
      if ( object.usuario_id == '' && req.session.passport.user ) {
        object.usuario_id = req.session.passport.user.id;
      }

      models.Usuario.findAll({
        attributes:['id','usuarioUrl','urlFotoPerfil'],
        include: [
          {
            model: models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM'],
            where:{
              apellidoP: { $like: object.letra +'%'}
            }
          },
          {
            model: models.Paciente,
            attributes: [ 'id'],
            include: [ {
              model: models.MedicoFavorito,
              where: {
                usuario_id: object.usuario_id,
                aprobado: 1,
                mutuo: 1
              }
            }]
          }
        ]
      }).then(function (result){
        res.status(200).send({'success':true,'result':result});
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
}
