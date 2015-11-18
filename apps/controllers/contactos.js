var models = require( '../models' );
var mail = require( './emailSender' );
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

            models.Notificacion.destroy( {
              where: {
                tipoNotificacion_id: 4,
                usuario_id: usuario_id,
                data: req.session.passport.user.Medico_id
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

            models.Notificacion.destroy( {
              where: {
                tipoNotificacion_id: 1,
                usuario_id: usuario_id,
                data: req.session.passport.user.Paciente_id
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
          attributes:['id','usuarioUrl','urlFotoPerfil'],
          include:[{
            model:models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM']
          }]
        }]
      }).then(function(encontrado){
        res.send(encontrado);
      });
    }
  },
  enviaCorreoRecomendados: function( req, res){
    var object ={
      nombre:'correo de recomendacion',
      subject:'Recomendaciones',
      to:req.body.toMail,
      enlace:req.body.enlace,
      mensaje:req.body.mensaje,
      usuario:req.body.usuario
    };
    mail.recomendacion(object,res,'recomendar');
  },
  medicoRecomendado: function( req, res ){
    var d = new Date();
    var strDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
    console.log("Fecha y Hora: "+strDate);
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      for( var i in req.body.objeto ){
        models.Notificacion.create({
            usuario_id:req.body.objectoId[ i ],
            tipoNotificacion_id:12,
            data:req.session.passport.user.Paciente_id+"|"+req.body.objeto[ i ],
            inicio:strDate,
            fin:null,
            visto:0,
            recordatorio:null
        }).then(function(creado){
          res.send(true);
        });
      }
    }
  },
  doctorRecomendado: function( req, res ){
    var d = new Date();
    var strDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
    console.log("Fecha y Hora: "+strDate);
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Notificacion.create({
        usuario_id: req.body.medicoId,
        tipoNotificacion_id:13,
        data:String(usuario_id),
        inicio:strDate,
        fin:null,
        visto:0,
        recordatorio:null
      }).then(function(creado){
        res.send('ok');
      });
    }
  },
  pacienteIDOculto: function( req, res ){
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
  },
  usuarioPrincipal: function( req, res ){
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
  },
  especialidadesMedico: function( req, res ){
    if( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Especialidad.findAll({
        attributes:['id','especialidad']
      }).then(function(especialidades){
        res.send(especialidades);
      });
    }
  },
  medicoDatos: function( req, res ){
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
  },
  pedirRecomendacionMedico: function( req, res ){
    var d = new Date();
    var strDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
    console.log("Fecha y Hora: "+strDate);
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      //for( var i in req.body.idEspecialidad ){
        models.Notificacion.create({
          usuario_id:req.body.idMedico,
          tipoNotificacion_id:14,
          data:req.session.passport.user.Paciente_id+req.body.idEspecialidad,
          inicio:strDate,
          visto:0,
          recordatorio:null
        }).then(function(creado){
          res.send(true);
        });
      //}
    }
  },
  traerDatos: function( req, res ){
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
  },
  especial: function( req, res ){
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
  },
  cargarContactosMedico: function( req, res ){
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
  },
  enviarMedAPacientes: function( req, res ){
    var d = new Date();
    var strDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
    console.log("Fecha y Hora: "+strDate);
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Notificacion.create({
        usuario_id: req.body.idMed,
        tipoNotificacion_id: 15,
        data: req.body.data,
        inicio:strDate,
        fin: null,
        visto: 0,
        leido: 0,
        recordatorio: null
      }).then( function( creado ){
        res.send(true);
      });
    }
  },
  consultaMedInfo: function( req, res ){
    var cortando = req.body.id.split("|");
    var count = 0;
    var medicosArreglo = [];
    for( var i in cortando ){
      if( cortando[ i ] != "" ){
        console.log("cortando: "+cortando);
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
  }
}
