module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/buscadorInterno', function (req, res){
    intermed.callController( 'buscadorInterno', 'buscar', req.body, req, res );
  });
  app.post( '/buscadorContactos', function (req, res){
    intermed.callController( 'buscadorInterno', 'buscadorContactos', req.body, req, res );
  });
  app.post('/findData', function( req, res ){
    intermed.callController('search','findData',req,res);
  });

}
