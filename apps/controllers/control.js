var models = require( '../models' );
var mail = require( './emailSender' );
var fs = require("fs");

var jsonfile = require('jsonfile')
/**
*	@author Cinthia Bermúdez
*	@version 0.0.0.0
*/

module.exports = {
  countPV: function ( object, req, res ) {
    try{
      if (req.session.passport && req.session.passport.userIntermed && req.session.passport.userIntermed.id > 0){
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  getPV: function ( object, req, res ) {
    try{
      if (req.session.passport && req.session.passport.userIntermed && req.session.passport.userIntermed.id > 0){
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  updatePV: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.userIntermed && req.session.passport.userIntermed.id > 0){
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  encTipoCodLoad: function(object, req, res){
    try{
      models.DBEncuesta_tipoEncuesta.findAll().then(function(tipos){
        res.status(200).json({
          success: true,
          result: tipos
        });
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  tipoPlanLoad: function (object, req, res){
    try{
      models.PlanDeCargo.findAll().then(function(tipos){
        res.status(200).json({
          success: true,
          result: tipos
        });
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  encCodCreate: function (object, req, res){
    try{
      models.DBEncuesta_tipoEncuesta.findOne({
        where: {
          tipo: object.tipoCodigo
        }
      }).then(function(tipoEncuesta){
        if (tipoEncuesta){
          object.tipoCodigo = tipoEncuesta.id;
          crearCodigos(object, req, res);
        } else {
          models.DBEncuesta_tipoEncuesta.create({
            tipo: object.tipoCodigo
          }).then(function(tipoEncuesta){
            object.tipoCodigo = tipoEncuesta.id;
            crearCodigos(object, req, res);
          });
        }
      });

    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  getNewCode: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  encCodLoad: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  encCodLoadByCod : function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  encExist: function (object, req, res){
    try{
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
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  countErr: function (object, req, res){
    try{
      models.DBError_registro.findAll({
        where: {
          status: 0
        }
      }).then(function(total){
        res.status(200).json({
          success: true,
          count: total.length
        });
      }).catch(function(err){
        req.errorHandler.report(err, req, res);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  getErr: function (object, req, res){
    try{
      models.DBError_registro.findAll({
        where: {
          status: object.status
        }
      }).then(function(total){
        res.status(200).json({
          success: true,
          result: total
        });
      }).catch(function(err){
        req.errorHandler.report(err, req, res);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  errGetById: function (object, req, res){
    try{
      models.DBError_registro.findOne({
        where: {
          id: object.id
        },
        include: [{model: models.DBError_userIntermed,attributes:['id','nombre','correo']}]
      }).then(function(result){
        if (result.status == 0){
          result.status = 1;
          result.update({status:1});
        }
        jsonfile.readFile(result.filePath, function(err, obj) {
          result = JSON.parse(JSON.stringify(result));
          if (!err){
            result.jsonContent = JSON.parse(JSON.stringify(obj));
            var total = 0;
            if (result.jsonContent.comentarios.length>0){
              result.jsonContent.comentarios.forEach(function(com){
                models.DBError_userIntermed.findOne({
                  where: {
                    id: com.usuarioIntermed_id
                  }
                }).then(function(usuario){
                  com.usuario = usuario;
                  total++;
                  if (total == result.jsonContent.comentarios.length){
                    res.status(200).json({
                      success: true,
                      result: result,
                      usuariointermed: req.session.passport.userIntermed
                    });
                  }
                });
              });
            } else {
              res.status(200).json({
                success: true,
                result: result,
                usuariointermed: req.session.passport.userIntermed
              });
            }
          } else {
            res.status(200).json({
              success: false,
              result: err
            });
          }
        });
      }).catch(function(err){
        req.errorHandler.report(err, req, res);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  errStatusUpdate: function (object, req, res){
    try{
      if (req.session.passport && req.session.passport.userIntermed){
        var date = getDateTime(true);
        models.DBError_registro.update({
          status: object.status,
          userIntermed_id: req.session.passport.userIntermed.id,
          datetimeupdated: date
        },{
          where: {
            id: object.id
          }
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: req.session.passport.userIntermed,
            date: date
          });
        });
      } else {
        res.status(200).json({
          success: false,
          result: 1
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  errAddComment: function (object, req, res){
    try{
      models.DBError_registro.findOne({
        where: {
          id: object.id
        }
      }).then(function(result){
        if (result){
          //Leer el archivo de Error

          jsonfile.readFile(result.filePath, function(err, obj) {
            var jsonContent = JSON.parse(JSON.stringify(obj));
            var fecha = new Date().toISOString();
            var usuarioIntermed_id = req.session.passport.userIntermed.id;
            var nuevoComentario = {
              datetime: fecha,
              usuarioIntermed_id: usuarioIntermed_id,
              comentario: object.comentario
            }
            jsonContent.comentarios.push(nuevoComentario);

            jsonfile.writeFile(result.filePath, jsonContent, function (error) {
                if (!error){
                  models.DBError_userIntermed.findOne({
                    where:{
                      id: usuarioIntermed_id
                    }
                  }).then(function(usuario){
                    nuevoComentario.usuario = usuario;
                    res.status(200).json({
                      success: true,
                      result: nuevoComentario
                    });
                  });
                } else {
                  res.status(200).json({
                    success: false,
                    error: error
                  });
                }
            });

          });
          //Sobreescribir con nuevo comentario
        } else {
          res.status(200).json({
            success: false
          });
        }
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  auth: function (object, req, res){
    console.log('object. '+JSON.stringify(object));
    models.DBError_userIntermed.findOne({
      where: {
        correo: object.email,
        pass: object.password
      }
    }).then(function(usuario){
      if (usuario){
        //Crear sesión
        req.session.passport.userIntermed = usuario;
        res.status(200).json({
          success: true,
          result: usuario
        });
      } else {
        res.status(200).json({
          success: false
        });
      }
    });
  },

  userAdd: function (object, req, res){
    object.pathImagen = '';

    if (object.base64file){
      var fs = require( "fs" );
      if ( !fs.existsSync( './public/garage/profilepics/_control' ) ) {
        fs.mkdirSync( './public/garage/profilepics/_control', 0777 );
      };

      var newPath = '/garage/profilepics/_control/' + req.session.passport.userIntermed.id + '_' + getDateTime() + '.jpg';
      var base64Data = object.base64file.replace( /^data:image\/png;base64,/, "" );
      fs.writeFile( './public' + newPath, base64Data, 'base64', function ( err, succes ) {
        if ( err ) {
          res.send( {
            succes: false,
            result: err
          } );
        }
        else {
          console.log( "archivo subido: " + newPath );
          object.pathImagen = newPath;
          crearUsuarioIntermed(object,req,res);
        }
      } );
    } else {
      crearUsuarioIntermed(object,req,res);
    }
  },

  userGetAll: function (object, req, res){
    models.DBError_userIntermed.findAll().then(function(usuarios){
      res.status(200).json({
        success: true,
        result: usuarios
      });
    });
  }
}

function crearUsuarioIntermed(object, req, res){


  models.DBError_userIntermed.create({
    nombre: object.nombre,
    correo: object.correo,
    pass: object.password,
    activo: object.activo,
    celular: object.telefono,
    rolUsuario_id: object.rolusuario,
    imagenUrl: object.pathImagen
  }).then(function(usuario){
    var datos = {
      to: usuario.correo,
      subject: 'Tu acceso a Intermed',
      name: usuario.nombre,
      correo: usuario.correo,
      password: object.passwordNotMd5,
      enlace: 'localhost:3000/control',
    };
    mail.send( datos, 'registroPanel' ); //se envia el correo

    res.status(200).json({
      success: true,
      result: usuario
    });
  });
}

function crearCodigos(object, req, res){
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
}

function getDateTime(format) {
  var date = new Date();
  var hour = date.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;
  var min = date.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;
  var sec = date.getSeconds();
  sec = ( sec < 10 ? "0" : "" ) + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = ( month < 10 ? "0" : "" ) + month;
  var day = date.getDate();
  day = ( day < 10 ? "0" : "" ) + day;
  if (format){
    return year +'/'+ month +'/'+ day  +' '+ hour +':'+ min +':'+sec;
  } else {
    return year + month + day + hour + min + sec;
  }
}
