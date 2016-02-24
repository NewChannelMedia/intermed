module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  //Vista: home
  app.post( '/history/access', function ( req, res ) {
    intermed.callController( 'historiales', 'access', req.body, req, res )
  } );

  app.post('/history/login', function( req, res ){
    intermed.callController('historiales','login',req.body,req, res);
  });
}
