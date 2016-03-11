
module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/secretaria/invitar', function ( req, res ) {
    intermed.callController( 'secretaria', 'invitar', req.body, req, res );
  });

  app.post('/secretaria/registrar', function (req, res){
    intermed.callController( 'secretaria', 'registrarcontoken', req.body, req, res );
  });

  app.post('/secretaria/buscar', function (req, res){
    intermed.callController( 'secretaria', 'buscar', req.body, req, res );
  });

  app.post('/secretaria/agregar', function (req, res){
    intermed.callController( 'secretaria', 'agregar', req.body, req, res );
  });

  app.post('/secretaria/eliminar', function (req, res){
    intermed.callController( 'secretaria', 'eliminar', req.body, req, res );
  });

  app.post('/secretaria/permisos/cambiar', function (req, res){
    intermed.callController( 'secretaria', 'permisoscambiar', req.body, req, res );
  });

  app.post('/secretaria/eliminarInvitacion', function (req, res){
    intermed.callController( 'secretaria', 'eliminarInvitacion', req.body, req, res );
  });

  app.post('/secretaria/invitacion/aceptar', function (req, res){
    intermed.callController( 'secretaria', 'invitacionAceptar', req.body, req, res );
  });

  app.post('/secretaria/invitacion/rechazar', function (req, res){
    intermed.callController( 'secretaria', 'invitacionRechazar', req.body, req, res );
  });

  app.post('/secretaria/medico/eliminar', function (req, res){
    intermed.callController( 'secretaria', 'medicoEliminar', req.body, req, res );
  });

  app.post('/secretaria/medicos/traerCitasProximas', function (req, res){
    intermed.callController( 'secretaria', 'citasProximas', req.body, req, res );
  });

  app.post('/secretaria/detalleCita', function (req, res){
    intermed.callController( 'secretaria', 'detalleCita', req.body, req, res );
  });

  app.post('/secretaria/cita/guardarNota',function (req, res){
    intermed.callController( 'secretaria', 'citaGuardarNota', req.body, req, res );
  });

  app.post('/secretaria/AgendaMedico', function (req, res){
    intermed.callController('secretaria','traerAgendaMedico', req.body, req, res);
  });

  app.post('/secretaria/serviciosPorHorario', function (req, res){
    intermed.callController('secretaria','serviciosPorHorario', req.body, req, res);
  });

  app.post('/secretaria/crearCita', function (req, res){
    intermed.callController('secretaria','crearCita', req.body, req, res);
  });

  app.post('/secretaria/cita/cancelar', function (req, res){
    intermed.callController('secretaria','cancelarCita', req.body, req, res);
  });
}
