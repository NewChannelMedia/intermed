module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/registrarcargorecurrente', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'RegistrarCargoRecurrente', req.body, req, res );
  } );
  app.post( '/ProcesarCargosClientes', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'ProcesarCargosClientes', req.body, req, res );
  } );

  app.post( '/registrarnuevatarjeta', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'RegistrarNuevaTarjeta', req.body, req, res );
  } );

  app.post( '/registrarplancargo', function ( req, res ) {
    intermed.callController( 'PlanDeCargo', 'PlanCargoRegistrar', req.body, req, res );
  } );

  app.post( '/plandecargo/delete', function ( req, res ) {
    intermed.callController( 'PlanDeCargo', 'PlanCargoEliminar', req.body, req, res );
  } );

  app.post( '/notificacionesproveedor', function ( req, res ) {
    intermed.callController( 'CargosProcesos', 'RecibirNotificacion', req.body, req, res );
  } );

  app.post( '/suscripcionpausar', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'SuscripcionPausar', req.body, req, res );
  } );

  app.post( '/suscripcioncancelar', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'SuscripcionCancelar', req.body, req, res );
  } );

  app.post( '/suscripcionreanudar', function ( req, res ) {
    intermed.callController( 'CargosUsuarios', 'SuscripcionReanudar', req.body, req, res );
  } );

  app.post('/plandecargo/intervalo/get', function (req, res){
    intermed.callController( 'PlanDeCargo', 'getIntervalo', req.body, req, res );
  });

  app.post('/plandecargo/getAll', function (req, res){
    intermed.callController( 'PlanDeCargo', 'getAll', req.body, req, res );
  });

  app.post('/plandecargo/delete/cond', function (req, res){
    intermed.callController( 'PlanDeCargo', 'DeleteCondCheck', req.body, req, res );
  });

  app.post('/plandecargo/reemplazar', function(req, res){
    intermed.callController( 'PlanDeCargo', 'reemplazarPlan', req.body, req, res );
  });

  app.post('/cargos/CrearSubscripcion', function (req, res){
    intermed.callController( 'CargosUsuarios', 'CrearSubscripcion', req.body, req, res );
  });

}
