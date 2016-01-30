module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  // encriptionssss
  app.post('/isLogin', function( req, res ){
    intermed.callController('encryption','isLogin',req.body,req, res);
  });
  // end encriptionss
  // inserta contraseña
  app.post('/insertPassword', function( req, res ){
    intermed.callController( 'encryption', 'insertPassword', req.body,req, res );
  });
  // remover el enlace para crear cuenta
  app.post('/deleteLinkCrear', function( req, res ){
    intermed.callController( 'encryption', 'deleteLinkCrear',req, res);
  });
  // cambiar el password
  app.post('/changeValidPass', function( req, res ){
    intermed.callController( 'encryption', 'changeValidPass', req.body, req, res );
  });
  //trae mail
  app.post('/getMailSend', function( req, res ){
    intermed.callController( 'encryption', 'getMailSend', req, res );
  });
  //mail send
  app.post('/sendMailto', function( req, res ){
    intermed.callController( 'encryption', 'sendMailto', req.body, req, res );
  });
  // fin inserta contraseña
  // get para el cambio del password de historial
  app.get( '/cambiar/:bandera/:token', function ( req, res ) {
    var tok = req.params.token;
    switch (req.params.bandera) {
      case 'historial':
        routeLife( 'plataforma2', 'interno', hps );
        intermed.callController( 'encryption', 'cambiar', {token: tok}, req, res );
        break;
      case 'intermed':
        routeLife( 'plataforma2', 'interno', hps );
        intermed.callController( 'encryption', 'cambiarIntermedPass', {token: tok}, req, res );
        break;
    }
  });
  //Vista de historiales
  app.get('/historiales', function( req, res ){
    routeLife( 'plataforma2', 'plataforma/medico', hps );
    intermed.callController('encryption','historiales', req, res );
  });
  app.post('/htmlToXml',function( req, res ){
    intermed.callController( 'encryption', 'htmlToXml', req.body, req, res );
  });

}
