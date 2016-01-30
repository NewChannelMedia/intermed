var models = require( '../models' );
var mail = require( './emailSender' );
/**
Controlador de para contactos
*	@author Cinthia Bermúdez
*	@version 0.0.0.0
*/

module.exports = {
  countPV: function ( object, req, res ) {
    if (req.session.passport && req.session.passport.user && req.session.passport.user.tipoUsuario == "A"){
      models.Usuario.findAll({
        where:{
          tipoUsuario: 'M',
          status: 2
        }
      }).then(function(Usuarios){
        var statusDos = Usuarios.length;
        models.Usuario.findAll({
          where: {
            status: 4
          },
          include: [{
              model: models.Medico,
              attributes: ['id'],
              where: {
                cedula: {
                  $not: ''
                }
              }
          }]
        }).then(function(Usuarios){
          var statusTres = Usuarios.length;;
          res.status(200).json({
            success: true,
            count: (statusDos + statusTres)
          });
        });
      });
    } else {
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  },

  getPV: function ( object, req, res ) {
    if (req.session.passport && req.session.passport.user && req.session.passport.user.tipoUsuario == "A"){
      models.Usuario.findAll({
        where:{
          tipoUsuario: 'M',
          status: 2
        },
        include: [{
            model: models.Medico,
            attributes: ['id','cedula','curp']
        },{
            model: models.DatosGenerales,
            attributes: ['nombre','apellidoP','apellidoM']
        }],
        attributes: ['id','usuarioUrl','urlPersonal','urlFotoPerfil']
      }).then(function(Usuarios){
        var result = [];
        result.push(Usuarios);
        models.Usuario.findAll({
          where: {
            status: 4
          },
          include: [{
              model: models.Medico,
              attributes: ['id','cedula','curp'],
              where: {
                cedula: {
                  $not: ''
                }
              }
          },{
              model: models.DatosGenerales,
              attributes: ['nombre','apellidoP','apellidoM']
          }],
          attributes: ['id','usuarioUrl','urlPersonal','urlFotoPerfil']
        }).then(function(Usuarios){
          result.push(Usuarios);
          res.status(200).json({
            success: true,
            result: result
          });
        });
      });
    } else {
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  },

  updatePV: function (object, req, res){
    if (req.session.passport && req.session.passport.user && req.session.passport.user.tipoUsuario == "A"){
      models.Usuario.update({
        status: object.status
      },{
        where: {
          id: object.usuario_id
        }
      }).then(function(result){
        models.Notificacion.destroy({
          where: {
            usuario_id: object.usuario_id,
            tipoNotificacion_id: {
              $in: [9,10]
            }
          }
        });
        if (object.status == 1){
          //insertar notificacion cedula aceptada (9)
          models.Notificacion.create({
            usuario_id: object.usuario_id,
            tipoNotificacion_id: 9,
            data: ''
          });
        }else if (object.status == 3){
          //insertar notificacion cedula rechazada (10)
          models.Notificacion.create({
            usuario_id: object.usuario_id,
            tipoNotificacion_id: 10,
            data: ''
          });
        }


        res.status(200).json({
          success: true,
          error: result
        });
      });
    } else {
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  }
}
