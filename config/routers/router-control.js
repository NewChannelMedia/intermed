module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/control/PV/count', function ( req, res ) {
    intermed.callController( 'control', 'countPV', req.body, req, res );
  });

  app.post( '/control/PV/get', function ( req, res ) {
    intermed.callController( 'control', 'getPV', req.body, req, res );
  });

  app.post('/control/PV/update', function (req, res){
    intermed.callController( 'control', 'updatePV', req.body, req, res );
  });
}
