module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/notificaciones', function ( req, res ) {
    if ( req.session.passport.user ) {
      intermed.callController( 'notificaciones', 'obtenerTodas', req.body, req, res );
    }
    else {
      res.send( {
        result: 'null'
      } );
    }
  } );

  app.post('/notificaciones/configurarNotificacion', function(req, res){
    if (!req.session.passport.user){
      res.send({'success':false,'error':1});
    }else {
      intermed.callController('notificaciones','configurarNotificacion', req.body, req, res);
    }
  });

}
