module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post('/inbox/cargartodos', function (req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargartodos', req.body, req, res);
      }
  });

  app.post('/inbox/cargarMensajesPorUsuario', function (req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargarMensajesPorUsuario', req.body, req, res);
      }
  });

  app.post('/inbox/cargarMensajesPorUsuarioAnteriores', function(req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargarMensajesPorUsuarioAnteriores', req.body, req, res);
      }
  });
}
