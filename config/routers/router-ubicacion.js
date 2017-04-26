module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  //Obtener con ajax las ciudades del estado_id enviado por post
  app.post( '/obtenerCiudades', function ( req, res ) {
    intermed.callController( 'ubicacion', 'obtieneCiudades', req.body, req, res );
  } );
  //Obtener con ajax las localidades del estado_id y ciudad_id enviados por post
  app.post( '/obtenerLocalidades', function ( req, res ) {
    intermed.callController( 'ubicacion', 'obtieneLocalidades', req.body, req, res );
  } );
  //Obtener con ajax el codigo postal de la localidad_id enviada por post
  app.post( '/buscarCP', function ( req, res ) {
    intermed.callController( 'ubicacion', 'encontrarPorCP', req.body, req, res );
  } );
  app.post('/medico/registrarubicacion', function (req, res) {
    intermed.callController('ubicacion', 'registrarUbicacion', req.body, req, res);
  });

  app.post('/registrarhorarios', function (req, res) {
    intermed.callController('ubicacion', 'registrarHorarios', req.body, req, res);
  });

  app.post('/horariosObtener', function (req, res){
    intermed.callController('ubicacion', 'horariosObtener', req.body, req, res);
  });

  app.post('/obtenerEstados',function( req, res){
    intermed.callController( 'ubicacion', 'obtieneEstados', req.body, req, res );
  })

  app.post('/ubicaciones/traer',function (req, res){
    intermed.callController( 'ubicacion', 'obtieneUbicacion', req.body, req, res );
  });

  app.post('/telefonos/traer',function (req, res){
    intermed.callController( 'ubicacion', 'obtieneTelefonos', req.body, req, res );
  });

  app.post('/ubicaciones/eliminar', function (req, res){
    intermed.callController( 'ubicacion', 'eliminaUbicacion', req.body, req, res );
  });

  app.post('/cargarCiudades',function(req, res){
    intermed.callController('search','cargarCiudades',req, res);
  });

  app.post('/traerUbicacionesPorServicio', function(req,res){
    intermed.callController('catServicios','traerUbicacionesPorServicio', req.body, req, res);
  });

  app.post('/traerDetallesServicioUbicacion', function (req, res){
    intermed.callController('catServicios','traerDetallesServicioUbicacion',req.body, req, res);
  });

  app.post('/seleccionaHorarios', function(req, res) {
    intermed.callController('agenda','seleccionaHorarios', req.body, req, res);
  });

  app.post('/ubicacion/detallesDireccion', function (req, res){
    intermed.callController('ubicacion','detallesDireccion', req.body, req, res);
  });
}
