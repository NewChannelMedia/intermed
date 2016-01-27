module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  //rutas Para Cargos
  app.get('/ProcesarCargosClientes', function (req, res) {
      intermed.callController('CargosUsuarios', 'FormularioCobro', req, res);
  });

  app.post('/ProcesarCargosClientes', function (req, res) {
      intermed.callController('CargosUsuarios', 'ProcesarCargosClientes', req.body, req, res);
  });

  app.get('/registrarusuariotarjeta', function (req, res) {
      intermed.callController('CargosUsuarios', 'RegistrarUsuarioEnProveedorDatos', req.body, req, res);
  });

  app.post('/registrarusuariotarjeta', function (req, res) {
      intermed.callController('CargosUsuarios', 'RegistrarUsuarioEnProveedor', req.body, req, res);
  });

  //Registrar plan de cargo
  app.get('/registrarplancargo', function (req, res) {
      intermed.callController('CargosUsuarios', 'PlanCargoDatosRegistro', req.body, req, res);
  });

  app.post('/registrarplancargo', function (req, res) {
      intermed.callController('CargosUsuarios', 'PlanCargoRegistrar', req.body, req, res);
  });

  app.post('/eliminarplancargo', function (req, res) {
      intermed.callController('CargosUsuarios', 'PlanCargoEliminar', req.body, req, res);
  });

  app.post('/notificacionesproveedor', function (req, res) {
      intermed.callController('CargosProcesos', 'RecibirNotificacion', req.body, req, res);
  });
  //fin rutas cargos

  app.post('/agregaCargoRechazado', function (req, res) {
      intermed.callController('CargosUsuarios', 'CargoRechazadoAgregar', req.body, req, res);
  });

  app.post('/CargoRechazadoSelecciona', function (req, res) {
      intermed.callController('CargosUsuarios', 'CargoRechazadoSelecciona', req.body, req, res);
  });

  app.post('/EstatusCargoRechazadoSelecciona', function (req, res) {
      intermed.callController('CargosUsuarios', 'EstatusCargoRechazadoSelecciona', req.body, req, res);
  });
}