var models  = require('../../models');

exports.index = function(req, res){
  res.render('configuraciones');
},
exports.getGenerales = function( req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    models.Usuario.findOne({
      where:{id:usuario_id},
      attributes:['correo','usuarioUrl','urlPersonal']
    }).then(function(usuario){
      res.send(usuario);
    });
  }
}
exports.changeMail = function( object, req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    var obj={correo:object.correo};
    models.Usuario.findOne({
      where:{correo: object.correo},
      attributes:['correo']
    }).then(function(correoExiste){
      if (correoExiste){
        res.send(false);
      }else {
        models.Usuario.update(obj,{
          where:{id:usuario_id}
        }).then(function( actualizado ){
          if( actualizado == 1 ){
            res.send(true);
          }
        });
      }
    });
  }
}
exports.saveUrl = function( object, req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    var obj = { urlPersonal: object.url };
    models.Usuario.update(obj,{
      where:{id:usuario_id}
    }).then(function(actualizado){
      if(actualizado==1){
        res.send(true);
      }else{
        res.send(false);
      }
    });
  }
}
exports.changePass = function( object, req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    var obj = { password: object.password };
    models.Usuario.update(obj,{
      where:{ id:usuario_id }
    }).then(function(modificado){
      if(modificado==1){
        res.send(true);
      }else{
        res.send(false);
      }
    });
  }
}
exports.consultaInfo = function( object, req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    models.Usuario.findOne({
      where:{ password: object.mail, id: usuario_id}
    }).then(function(encontrado){
      if(encontrado){
        res.send(true);
      }else{
        res.send(false);
      }
    });
  }
}
