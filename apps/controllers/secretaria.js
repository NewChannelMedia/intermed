var models = require( '../models' );
var mail = require( './emailSender' );
var cryptomaniacs = require( './encryption' );
var usuarios = require('./usuarios');

exports.index = function (object, req, res){
  try{
    models.MedicoSecretaria.findAll({
      where: {
        medico_id: req.session.passport.user.Medico_id,
        activo: 1
      },
      include: [{
        model: models.Secretaria,
        include: [{
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil','correo'],
          include: [{
            model: models.DatosGenerales
          }]
        }]
      }]
    }).then(function(secretarias){
      console.log('Secretarias: ' + JSON.stringify(secretarias));
      res.render('medico/secretaria',{
        secretaria:secretarias.length,
        secretarias: secretarias
      });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.registrar = function (object, req, res){
  try{
    var token = object.token;
    models.SecretariaInvitacion.findOne({
      where: {
        token: token
      },
      include: [{
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
    }).then(function(invitacion){
      if (invitacion){
        if (invitacion.activo){
          res.redirect('/')
        } else {
          //Buscar si la secretaria ya esta registrada
          models.Usuario.findOne({
            where:{correo:invitacion.correo}
          }).then(function(usuario){
            if (!usuario){
              //Registrar
              res.render('secretaria/registrar',{invitacion: invitacion});
            }else {
              if (!(req.session.passport && req.session.passport.user && req.session.passport.user.id>0)){
                //Iniciar sesión
                res.render('secretaria/login',{invitacion: invitacion});
              } else if (req.session.passport.user.id == usuario.id){
                //Si usuario == sesion activa, crear relacion medico-secretaria y mostrar pantalla con notificacion de relación
                models.MedicoSecretaria.findOrCreate({
                  where: {
                    secretaria_id: req.session.passport.user.Secretaria_id,
                    medico_id: invitacion.medico_id
                  },
                  defaults: {
                    secretaria_id: req.session.passport.user.Secretaria_id,
                    medico_id: invitacion.medico_id
                  }
                }).spread(function(MedicoSecretaria, created) {
                  if (!invitacion.activo){
                    invitacion.update({activo:1});
                  }
                  models.Medico.findOne({
                    where: {
                      id: MedicoSecretaria.medico_id
                    },
                    attributes:['id'],
                    include: [{
                      model: models.Usuario,
                      attributes: ['id','usuarioUrl','urlFotoPerfil'],
                      include: [{
                        model: models.DatosGenerales
                      },{
                        model: models.Direccion,
                        attributes: ['id'],
                        order: [['principal','desc']],
                        include: [{
                          model: models.Municipio,
                          include: [{model: models.Estado}]
                        }]
                      }]
                    },{
                      model: models.Especialidad
                    }]
                  }).then(function(medico){
                    res.render('secretaria/relacioncreada',medico);
                    //res.send('Crear relación');
                  });
                });
              } else {
                //Permiso denegado
                res.redirect('/');
              }
            }
          });
        }
      } else {
        res.send('la invitación ya no existe');
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.registrarcontoken = function (object, req, res){
  try{
    //Revisar si correo existe
    models.Usuario.findOne({
      where: {
        correo: object.correo
      }
    }).then(function(usuario){
      if (!usuario){
        //Crear Usuario
        models.sequelize.transaction( {
            isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
          }, function ( t ) {
            //Revisar que invitación exista
            return models.SecretariaInvitacion.findOne({
              where: { token: object.token }
            }, {transaction: t} ).then(function(invitacion){
              if (invitacion){
                return models.Usuario.create({
                  correo: object.correo,
                  password: object.pass,
                  tipoUsuario: 'S',
                  tipoRegistro: 'C',
                  estatusActivacion: 1
                }, {transaction: t} ).then(function(usuario){
                  return models.Secretaria.create({
                    usuario_id: usuario.id
                  }, {transaction: t} ).then(function(secretaria){
                    return models.DatosGenerales.create({
                      nombre: object.nombre,
                      apellidoP: object.paterno,
                      apellidoM: object.materno,
                      usuario_id: usuario.id
                    }, {transaction: t} ).then(function(dg){
                      return models.MedicoSecretaria.create({
                        medico_id: invitacion.medico_id,
                        secretaria_id: secretaria.id
                      }, {transaction: t} ).then(function(MedicoSecretaria){
                        usuarios.generarSesion(req,res,usuario.id,false,true);
                      });
                    });
                  });
                });
              }else {
                res.status(200).json({success:false,result: {invitacion: invitacion}})
              }
            });
          });
      } else {
          res.status(200).json({success:false,result: 'el correo ya existe'})
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }

}

exports.invitar = function ( object, req, res ) {
  try{
    var tokens = String( cryptomaniacs.doEncriptToken( req.session.passport.user.Medico_id+'-'+object.email ));
    models.SecretariaInvitacion.findOrCreate({
      where: {
        correo: object.email,
        medico_id: req.session.passport.user.Medico_id
      },
      defaults: {
        correo: object.email,
        medico_id: req.session.passport.user.Medico_id,
        token:tokens
      }
    }).spread(function(invitacion, created) {
      //if (created){
        //Enviar correo con el token para invitar a secretaria
      //}
      var nombreSesion = req.session.passport.user.name;
      var enlace = 'localhost:3000/secretaria/'+tokens;

      var objecto = {
        to: object.email,
        subject: 'Invitación a Intermed',
        nombreSesion: nombreSesion,
        enlace: enlace
      };
      mail.send( objecto, 'invitarSecretaria');


      res.status(200).json({
        success: created,
        result: {
          invitacion_id: invitacion.id
        }
      });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
