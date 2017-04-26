module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
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

  app.post('/control/enc/tipoCod/load', function (req, res){
    intermed.callController( 'control', 'encTipoCodLoad', req.body, req, res );
  });

  app.post('/control/tipoPlan/load', function (req, res){
    intermed.callController( 'control', 'tipoPlanLoad', req.body, req, res );
  });

  app.post('/control/enc/cod/create', function (req, res){
    intermed.callController( 'control', 'encCodCreate', req.body, req, res );
  });

  app.post('/control/encCod/Load', function (req, res){
    intermed.callController( 'control', 'encCodLoad', req.body, req, res );
  });

  app.post('/control/encCod/loadByCod', function (req, res){
    intermed.callController( 'control', 'encCodLoadByCod', req.body, req, res );
  });

  app.post('/control/Err/count', function (req, res){
    intermed.callController( 'control', 'countErr', req.body, req, res );
  });

  app.post('/control/err/get', function (req,res){
    intermed.callController( 'control', 'getErr', req.body, req, res );
  });

  app.post('/control/err/getById', function (req, res){
    intermed.callController( 'control', 'errGetById', req.body, req, res );
  });

  app.post('/control/err/status/update', function (req, res){
    intermed.callController( 'control', 'errStatusUpdate', req.body, req, res );
  });

  app.post('/control/err/comentario/add', function (req, res){
    intermed.callController( 'control', 'errAddComment', req.body, req, res );
  });

  app.post('/control/auth', function (req, res){
    intermed.callController( 'control', 'auth', req.body, req, res );
  });

  app.post('/control/user/add', function (req, res){
    intermed.callController( 'control', 'userAdd', req.body, req, res );
  });

  app.post('/control/usuariosIntermed/getAll', function (req, res){
    intermed.callController( 'control', 'userGetAll', req.body, req, res );
  });
}
