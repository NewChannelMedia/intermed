var models = require( '../models' );
var crypto = require('crypto');

// Solo renderiza la vista de historiales
exports.index = function( req, res ){
  try{
    res.render('historiales');
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}


exports.index = function ( object, req, res ) {
  try{
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      if (req.session.passport.userHistory && req.session.passport.userHistory.idDr == req.session.passport.user.id){
        // Checar si mas de 24 horas desde ultimo inicio de sesión, si es asi borrar sesion de userHistory y mandar success:false, login:true
        res.render('historiales');
      } else {
        //render iniciar sesión
        res.render('ingresarHistoriales');
      }
    } else {
      res.send('<!DOCTYPE><head><script type="text/javascript">window.location.href = "/";</script></head><body></body></html>');
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.access = function ( object, req, res ) {
  try{
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      if (req.session.passport.userHistory && req.session.passport.userHistory.idDr == req.session.passport.user.id){
        // Checar si mas de 24 horas desde ultimo inicio de sesión, si es asi borrar sesion de userHistory y mandar success:false, login:true
        res.status(200).json({success:true});
      } else {
        var usuario_id = req.session.passport.user.id;
        models.UsuarioHistorial.findOne({
          where: {
            idDr: usuario_id
          }
        }).then(function(success){
          if (success){
            res.status(200).json({success:false,login:true});
          } else {
            res.status(200).json({success:false,login:false});
          }
        });
      }
    } else {
      res.status(200).json({success:false,error:1});
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};


exports.login = function(object, req, res ){
  try{
    var cadena = generateEncrypted( object.pass );
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.UsuarioHistorial.findOne({
        where: {
          idDr: usuario_id,
          pass: cadena
        },
        attributes: ['idDr','token']
      }).then(function(UsuarioHistorial){
        if (UsuarioHistorial){
          req.session.passport.userHistory = UsuarioHistorial;
          req.session.passport.userHistory.datetime = new Date().toISOString();
          res.status(200).json({'success':true,'sesion':UsuarioHistorial});
        } else {
          res.status(200).json({'success':false});
        }
      });
    }

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};


function generateEncrypted(str){
  var cadena = crypto.createHmac('sha512',str);
  cadena.update(str);// se actualiza la cadena
  var cadena = cadena.digest('hex'); // almacena la cadena encriptada
  return cadena;
}
