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
  },

  encTipoCodLoad: function(object, req, res){
    models.DBEncuesta_tipoEncuesta.findAll().then(function(tipos){
      res.status(200).json({
        success: true,
        result: tipos
      });
    });
  },

  tipoPlanLoad: function (object, req, res){
    models.PlanDeCargo.findAll().then(function(tipos){
      res.status(200).json({
        success: true,
        result: tipos
      });
    });
  },

  encCodCreate: function (object, req, res){
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    var total = parseInt(object.cantidad);

    var existentes = [];
    var creados = [];
    var totalCreados = 0;

    models.DBEncuesta_encuesta.findAll({
      attributes: ['codigo']
    }).then(function(codigos){
      for (var i = 1; i <= total; i++) {
        var str = '';
        var existe = true;
        while(existe){
          for( var j=0; j < 6; j++ ){
            str += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          existe = false;
          codigos.forEach(function(codigo){
            if (codigo.codigo == str){
              existe = true;
            }
          });
          if (!existe){
            //Agregar a lista de codigos temporal
            codigos.push({
              'codigo': str
            });
            models.DBEncuesta_encuesta.create({
              codigo: str,
              tipoCodigo: object.tipoCodigo,
              tipoPlan: object.tipoPlan
            }).then(function(creado){
              creados.push(JSON.parse(JSON.stringify(creado)));
              totalCreados++;
              if (totalCreados == total){
                res.status(200).json({
                  success: true,
                  result: creados
                });
              }
            });
          }
        }
      }
    });
  },

  getNewCode: function (object, req, res){
    var str = '';

    var existe = true;

    while(existe){
      for( var i=0; i < 5; i++ ){
        str += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      models.DBEncuesta_encuesta.findOne({
        where: {
          codigo: str
        }
      }).then(function(exist){
        if (!exist){
          existe = false;
          console.log(str);
        } else {
          console.log('EXISTE!!!');
          str = '';
        }
      });
    }
  },

  encCodLoad: function (object, req, res){
    models.DBEncuesta_encuesta.findAll({
      attributes: [[models.Sequelize.fn('COUNT', models.Sequelize.col('codigo')), 'total'],'registrado','tipoCodigo','tipoPlan','codigo'],
      group: ['tipoCodigo','tipoPlan','registrado'],
      include: [{
        model: models.DBEncuesta_tipoEncuesta
      }],
      order: [['tipoCodigo','ASC'],['tipoPlan','ASC']],
      where: {
        tipoPlan : {
          $gt: 0
        },
        tipoCodigo : {
          $gt: 0
        }
      }
    }).then(function(Encuestas){
        models.PlanDeCargo.findAll().then(function(planDeCargo){
            var result = [];
            var tipoCodigo = '';
            var tipoPlan = '';
            var codigoresult = null;
            var totalPlan = 0;
            var totalPlanReg = 0;
            Encuestas = JSON.parse(JSON.stringify(Encuestas));
            var tipoPlan = '';
            var encT = null;
            Encuestas.forEach(function(enc){
              encT = enc;

              if (tipoCodigo != enc.tipoCodigo){
                //nuevo codigo
                if (codigoresult){
                  result.push(codigoresult);
                }

                if (tipoPlan != ""){
                  codigoresult.planes.push({
                    'tipoPlan': tipoPlan,
                    'total': totalPlan,
                    'totalReg':totalPlanReg
                  });
                  totalPlan = 0;
                  totalPlanReg = 0;
                }

                //Reiniciar tipo plan
                tipoPlan = enc.tipoPlan;
                //Reiniciar tipo codigo
                tipoCodigo = enc.DBEncuesta_tipoEncuestum.id;

                codigoresult = {
                  'tipoCodigo':tipoCodigo,
                  'tipo':enc.DBEncuesta_tipoEncuestum.tipo,
                  'planes': []
                }

                if (enc.registrado == 1){
                  totalPlanReg = enc.total;
                } else {
                  totalPlan = enc.total;
                }
              } else {
                if (tipoPlan != enc.tipoPlan){
                  codigoresult.planes.push({
                    'tipoPlan': tipoPlan,
                    'total': totalPlan,
                    'totalReg':totalPlanReg
                  });
                  tipoPlan = enc.tipoPlan;
                  totalPlanReg = 0;
                  totalPlan = 0;
                  if (enc.registrado == 1){
                    totalPlanReg = enc.total;
                  } else {
                    totalPlan = enc.total;
                  }
                } else {
                  if (enc.registrado == 1){
                    totalPlanReg = enc.total;
                  } else {
                    totalPlan = enc.total;
                  }
                }
              }
            });
            if (codigoresult){
              codigoresult.planes.push({
                'tipoPlan': tipoPlan,
                'total': totalPlan,
                'totalReg':totalPlanReg
              });
              result.push(codigoresult);
            }
            res.status(200).json({
              success: true,
              result: result
            });
        });
    });
  },

  encCodLoadByCod : function (object, req, res){
    models.DBEncuesta_encuesta.findAll({
      where: {
        tipoCodigo: object.tipoCodigo,
        tipoPlan: object.tipoPlan,
        registrado: 0
      }
    }).then(function(result){
      res.status(200).json({
        success: true,
        result: result
      });
    });
  },

  encExist: function (object, req, res){
      models.DBEncuesta_encuesta.findOne({
        where: {
          codigo: object.codigo
        }
      }).then(function(encuesta){
        var valido = false;
        var registrado = false;
        if (encuesta){
          valido = true;
          if (encuesta.registrado == 1){
          registrado = true;
          }
        }
        res.status(200).json({
          success: valido,
          registrado: registrado
        });
      });
  }
}
