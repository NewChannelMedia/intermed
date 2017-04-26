module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
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
  app.post('/search/medico', function (req, res){
    intermed.callController('search','medico',req.body,req,res);
  });
  app.post('/search/medico/count', function (req, res){
    intermed.callController('search','medicoGetCount',req.body,req,res);
  });

}
