module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.get('*', function(req, res){
    routeDispatcher( 'plataforma2', '', hps );
    res.render('pagina404');
  });
  app.post('*',function(req,res){
    res.status(404).send('Página no encontrada');
  });
}
