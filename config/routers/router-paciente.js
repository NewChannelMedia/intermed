module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  // Inserta la cita
  app.post('/agregaCita', function(req, res) {
    intermed.callController('agenda','agregaCita', req.body, req, res);
  });

  app.post( '/cancelaCita', function ( req, res ) {
    //console.log(req.body)
    intermed.callController( 'agenda', 'cancelaCita', req.body, req, res );
  });
  app.post('/loadDatosGenerales', function(req, res){
    intermed.callController('contactos','loadDatosGenerales',req,res);
  });
  app.post('/loadBiometricos', function( req, res ){
    intermed.callController('contactos', 'loadBiometricos', req, res);
  });
  app.post('/loadTelefonos', function( req, res ){
    intermed.callController('contactos', 'loadTelefonos', req, res );
  });
  app.post('/updateName', function( req, res ){
    intermed.callController('contactos','updateName', req, res);
  });
  app.post('/updateApellidoP', function( req, res ){
    intermed.callController('contactos','updateApellidoP', req, res);
  });
  app.post('/updateApellidoM', function( req, res ){
    intermed.callController('contactos','updateApellidoM', req, res);
  });
  app.post('/addBio', function( req, res ){
    intermed.callController('contactos','addBio', req, res);
  });
  app.post('/deleteBio',function( req, res ){
    intermed.callController('contactos','deleteBio', req, res);
  });
  app.post('/postPaciente',function( req, res ){
    intermed.callController('contactos','postPaciente',req, res);
  });
  app.post('/addTelefon',function(req, res){
    intermed.callController('contactos','addTelefon',req, res);
  });
  app.post('/deleteFon',function( req, res ){
    intermed.callController('contactos','deleteFon',req, res);
  });

  app.post('/paciente/cargarUbicacion',function (req, res){
    intermed.callController('pacientes','cargarUbicacion',req.body,req, res);
  });

  app.post('/registrarubicacionPaciente',function(req,res){
    intermed.callController('ubicacion','registrarubicacionPaciente',req.body,req, res);
  });

}
