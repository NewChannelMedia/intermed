var models = require( '../models' );

/**
Controlador de para contactos
*	@author Cinthia Bermúdez
*	@version 0.0.0.0
*/

module.exports = {
  agregarFav: function ( object, req, res ) {
    if ( req.session.passport.user ) {
      var condiciones = '';
      if ( object.medicoID ) {
        if (req.session.passport.user.tipoUsuario == "P"){
          //Tipo notificacion: agregadoMedicoFavorito
          models.Medico.findOne({
            where: { id: object.medicoID },
            attributes: ['id'],
            include: [{model: models.Usuario, attributes: ['id']}]
          }).then(function(medico){
            console.log('______MEDICO: ' + JSON.stringify(medico));
            models.Notificacion.create( {
              usuario_id: medico.Usuario.id,
              tipoNotificacion_id: 7,
              data: req.session.passport.user.Paciente_id.toString()
            } );
          });
        } else {
          /*Si se trata de una relacion médico-médico enviamos la solicitud de amistad*/
          models.Medico.findOne( {
            where: {
              id: object.medicoID
            }
          } ).then( function ( medico ) {
            var usuario_id = medico.usuario_id;
            console.log('___________USUARIO_ID: ' + usuario_id);
            console.log('___________USUARIO_ID: ' + medico.usuario_id);
            models.MedicoFavorito.create( {
              usuario_id: usuario_id,
              medico_id: req.session.passport.user.Medico_id,
              aprobado: 0
            } );

            models.Notificacion.create( {
              usuario_id: usuario_id,
              tipoNotificacion_id: 4,
              data: req.session.passport.user.Medico_id.toString()
            } );
          } );
        }
        condiciones = {
          usuario_id: req.session.passport.user.id,
          medico_id: object.medicoID
        };
      }
      else if ( object.pacienteID ) {
        if ( req.session.passport.user.tipoUsuario == "P" ) {
            /*Si se trata de una relacion paciente-paciente enviamos la solicitud de amistad*/
          models.Paciente.findOne( {
            where: {
              id: object.pacienteID
            }
          } ).then( function ( paciente ) {
            console.log( 'PACIENTE: ' + JSON.stringify( paciente ) );
            var usuario_id = paciente.usuario_id;
            models.MedicoFavorito.create( {
              usuario_id: usuario_id,
              paciente_id: req.session.passport.user.Paciente_id,
              aprobado: 0
            } );

            models.Notificacion.create( {
              usuario_id: usuario_id,
              tipoNotificacion_id: 1,
              data: req.session.passport.user.Paciente_id.toString()
            } );
          } );
        }

        condiciones = {
          usuario_id: req.session.passport.user.id,
          paciente_id: object.pacienteID
        }
      }

      models.MedicoFavorito.findOrCreate( {
        defaults: condiciones,
        where: condiciones
      } ).then( function ( result ) {
        if ( result ) {
          if (req.session.passport.user.tipoUsuario == "P" && condiciones.medico_id){
            models.MedicoFavorito.update({
              mutuo: 1
            },
            {
              where: condiciones
            });
          }

          res.send( {
            result: 'success'
          } );
        }
        else {
          res.send( {
            result: 'error'
          } );
        }
      } );
    }
    else {
      res.send( {
        result: 'error',
        error: 'Necesitas iniciar sesión'
      } );
    }
  },

  eliminarFav: function ( object, req, res ) {
    if ( req.session.passport.user ) {
      var condiciones = '';
      console.log('__________OBJECT: '+ JSON.stringify(object));

      if ( object.medicoID ) {
        if (req.session.passport.user.tipoUsuario == "M"){
          console.log( '--->ELIMNAR RELACIÓN MUTUA' )
            /*Si se trata de una relacion médico-médico eliminamos las relaciones por ambos lados*/
          models.Medico.findOne( {
            where: {
              id: object.medicoID
            }
          } ).then( function ( medico ) {
            var usuario_id = medico.usuario_id;
            models.MedicoFavorito.destroy( {
              where: {
                usuario_id: usuario_id,
                medico_id: req.session.passport.user.Medico_id
              }
            } );
          } );
        }
        condiciones = {
          usuario_id: req.session.passport.user.id,
          medico_id: object.medicoID
        }
      }
      else if ( object.pacienteID ) {
        if ( req.session.passport.user.tipoUsuario == "P" ) {
          console.log( '--->ELIMNAR RELACIÓN MUTUA' )
            /*Si se trata de una relacion paciente-paciente eliminamos las relaciones por ambos lados*/
          models.Paciente.findOne( {
            where: {
              id: object.pacienteID
            }
          } ).then( function ( paciente ) {
            console.log( 'PACIENTE: ' + JSON.stringify( paciente ) );
            var usuario_id = paciente.usuario_id;
            models.MedicoFavorito.destroy( {
              where: {
                usuario_id: usuario_id,
                paciente_id: req.session.passport.user.Paciente_id
              }
            } );
          } );
        }
        condiciones = {
          usuario_id: req.session.passport.user.id,
          paciente_id: object.pacienteID
        }
      }

      models.MedicoFavorito.destroy( {
        where: condiciones
      } ).then( function ( result ) {
        res.send( {
          result: 'success'
        } );
      } );

      var numNot = 0;
      if (req.session.passport.user.tipoUsuario == "P"){
        numNot = 8;
      } else if (req.session.passport.user.tipoUsuario == "M"){
        numNo = 9;
      }
      if (object.notificacion_id){
        models.Notificacion.update({
          tipoNotificacion_id: 8
        },{
          where: { id: object.notificacion_id}
        })
      }
    }
    else {
      res.send( {
        result: 'error',
        error: 'Necesitas iniciar sesión'
      } );
    }
  },

  cargarFavCol: function ( object, req, res ) {
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
  },

  aceptarInvitacion: function ( object, req, res ) {
    if ( req.session.passport.user ) {
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
      console.log('_____CONDICIONES: ' + JSON.stringify(condiciones));
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
        }
        else {
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

    }
    else {
      res.send( {
        result: 'error',
        error: 'Necesitas iniciar sesión'
      } );
    }
  },
  contactosRecomendados: function(req, res){
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
  },
  medicosContacto: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Medico.findAll({
        where:{id:req.body.idMedico},
        include:[{
          model:models.Usuario,
          attributes:['usuarioUrl','urlFotoPerfil'],
          include:[{
            model:models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM']
          }]
        }]
      }).then(function(encontrado){
        res.send(encontrado);
      });
    }
  }
}
