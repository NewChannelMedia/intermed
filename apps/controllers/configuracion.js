var models = require( '../models' );

var invalidNames = [
  'informacionusuario',
  'buscar',
  'logout',
  'notificaciones',
  'inbox',
  'configuraciones',
  'historiales',
  'control',
  'registrarcargoconcurrente',
  'procesarcargosclientes',
  'registrarnuevatarjeta',
  'registrarplancargo',
  'suscripcioncancelar',
  'suscripcionreanudar',
  'secretaria',
  'comentarios',
  'agendamedicover',
  'agendapacientever',
  'muestraagendamedico'
]

exports.cambiarPass = function (object, req, res ) {
  try{
    models.Usuario.findOne({
      where: {
        id: req.session.passport.user.id
      }
    }).then( function ( usuario ) {
      if (usuario){
        if (usuario.password == object.actual){
          usuario.update({password: object.nueva}).then(function(){
            res.status(200).json({success: true });
          })
        } else {
          res.status(200).json({success: false ,pass:true});
        }
      } else {
        res.status(200).json({success: false });
      }
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.urlmedic = function (object, req, res){
  try{
    if (invalidNames.indexOf(object.urlmedic.toLowerCase())=== 0 || invalidNames.indexOf(object.urlmedic.toLowerCase())>0){
      res.status(200).json({success: false ,invalid:true});
    } else {
      if (! parseInt(object.urlmedic)){
        models.Usuario.findOne({
          where: {
            id: req.session.passport.user.id
          }
        }).then( function ( usuario ) {
          if (usuario){
            models.Usuario.findOne({
              where:{
                urlPersonal: object.urlmedic
              }
            }).then(function(existe){
              if (!existe){
                if (usuario.password == object.actual){
                  usuario.update({urlPersonal: object.urlmedic}).then(function(){
                    res.status(200).json({success: true });
                  })
                } else {
                  res.status(200).json({success: false ,pass:true});
                }
              } else {
                res.status(200).json({success: false ,exists:true});
              }
            })
          } else {
            res.status(200).json({success: false });
          }
        } );
      } else {
        res.status(200).json({success: false ,number:true});
      }
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};


exports.correo = function (object, req, res){
  try{
    models.Usuario.findOne({
      where: {
        id: req.session.passport.user.id
      }
    }).then( function ( usuario ) {
      if (usuario){
        models.Usuario.findOne({
          where:{
            correo: object.correo
          }
        }).then(function(existe){
          if (!existe){
            if (usuario.password == object.actual){
              usuario.update({correo: object.correo}).then(function(){
                res.status(200).json({success: true });
              })
            } else {
              res.status(200).json({success: false ,pass:true});
            }
          } else {
            res.status(200).json({success: false ,exists:true});
          }
        })
      } else {
        res.status(200).json({success: false });
      }
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
