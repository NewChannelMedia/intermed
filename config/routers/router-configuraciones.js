module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;
  app.post('/getGenerales', function( req, res ){
    intermed.callController('/configuracion/configuraciones','getGenerales',req, res);
  });
  app.post('/changeMail', function( req, res ){
    intermed.callController('/configuracion/configuraciones','changeMail', req.body, req, res );
  });
  app.post('/saveUrl',function( req, res ){
    intermed.callController('/configuracion/configuraciones','saveUrl',req.body,req,res);
  });
  app.post('/changePass', function( req, res ){
    intermed.callController('/configuracion/configuraciones','changePass', req.body,req,res);
  });
  app.post('/consultaInfo', function( req, res ){
    intermed.callController('/configuracion/configuraciones','consultaInfo', req.body, req, res);
  });
}
