var models = require( '../models' );
var mail = require( './emailSender' );
var cryptomaniacs = require( './encryption' );

exports.index = function (object, req, res){
    models.MedicoSecretaria.findOne({
      where: {
        medico_id: req.session.passport.user.Medico_id,
        activo: 1
      },
      include: [{
        model: models.Secretaria
      }]
    }).then(function(secretaria){
      if (secretaria){
        res.render('medico/secretaria',{
          secretaria:secretaria
        });
      } else {
        models.SecretariaInvitacion.findOne({
          where:{
            medico_id: req.session.passport.user.Medico_id,
            activo: 0
          }
        }).then(function(invitacion){
          res.render('medico/secretaria',{
            invitacion: invitacion
          });
        });
      }
    });
};

exports.registrar = function (object, req, res){
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
                        order: [['principal','desc']]
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
                    console.log('User: ' + JSON.stringify(medico));
                    console.log('created: ' + created);
                    //res.send('Crear relación');
                  });
                });
              } else {
                //Permiso denegado
                res.send('Acceso denegado');
              }
            }
          });
        }
      } else {
        res.send('la invitación ya no existe');
      }
    });
}

exports.registrarcontoken = function (object, req, res){
  console.log('OBJECT: ' + JSON.stringify(object));
  //Revisar si correo existe
  //{"token":"e29be9a428a1e3b46370a01d67f18d55","nombre":"Cinthia Margarita","paterno":"Bermúdez","materno":"Acosta","correo":"bmdz.acos@gmail.com","pass":"f5bb0c8de146c67b44babbf4e6584cc0"}
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
              }, {transaction: t} ).then(function(){
                return models.SecretariaInvitacion.findOne({
                  where: { token: object.token }
                }, {transaction: t} ).then(function(invitacion){
                  return models.MedicoSecretaria.create({
                    medico_id: invitacion.medico_id,
                    secretaria_id: secretaria.id
                  }, {transaction: t} ).then(function(MedicoSecretaria){
                      return invitacion.update({activo:1}, {transaction: t} ).then(function(result){
                        res.status(200).json({success:true,result: MedicoSecretaria})
                      });
                  });
                });
              });
            });
          });

        });


      //Crear secretaria

      //Crear DatosGenerales

      //Crear relacion medico-secretaria
    } else {

        res.status(200).json({success:false,result: 'el correo ya existe'})
    }
  });

}

exports.invitar = function ( object, req, res ) {

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
    /*
  try{
    models.DatosGenerales.findAll()
    .then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }*/
};
