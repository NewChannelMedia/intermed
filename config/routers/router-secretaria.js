
module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/secretaria/invitar', function ( req, res ) {
    intermed.callController( 'secretaria', 'invitar', req.body, req, res );
  });

  app.post('/secretaria/registrar', function (req, res){
    intermed.callController( 'secretaria', 'registrarcontoken', req.body, req, res );
  });
}
