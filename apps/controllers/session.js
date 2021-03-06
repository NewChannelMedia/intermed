/**
 * 	En este archivo se atraparan los eventos del inicio de sesión,
 *	asi como también hara la función de recibir y enviar los datos del modelo,
 *	hacía la vista. Se trabajara con una función que simulara como la clase de este
 *	archivo y dentro de esta función es como se trabajara.
 *	Dentro de los metodos iran las llamadas a los metodos o llamados de los modelos y el envio de los parametros
 *	@author Oscar, Cinthia.
 *	@version 0.0.0.0
 */
//librerias que se utilizaran en este archivo
//var model = require('/../models/Medicos');
module.exports = {
  /**
   *	En el siguiente metodo es el que se encargara del envio
   *	que se obtengan de la base de datos, se mandaran hacia la
   *	vista.
   */
  login: function ( object, req, res ) {
    try{
      if ( object.usuario === 'admin' && object.contraseña === 'admin' ) {
        req.session.passport = {};
        req.session.passport.name = 'admin';
        req.session.passport.admin = true;
        req.session.passport.logged = true;
        res.redirect( '/registro' );
      }
      else {
        res.redirect( '/' );
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  logout: function ( object, req, res ) {
    try{
      if ( req.session ) {
        res.clearCookie( '_intermed' );
        req.session.destroy();
      }
      res.redirect( '/' );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  getSessionType: function (object, req, res){
    var tipoUsuario = '';
    if (req.session.passport && req.session.passport.user){
      tipoUsuario = req.session.passport.user.tipoUsuario;
    }
    res.status(200).json({'tipoUsuario':tipoUsuario});
  }
}
