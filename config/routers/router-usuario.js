module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/correoDisponible', function ( req, res ) {
    intermed.callController( 'usuarios', 'correoDisponible', req.body, req, res );
  } );

  //Modificar la información del usuario de la sesión
  app.post( '/perfil', function ( req, res ) {
    routeLife( 'plataforma', 'plataforma/paciente', hps );
    intermed.callController( 'pacientes', 'modificarPerfil', req.body, req, res );
  } );
  //Obtener con ajax la información de la sesión del usuario
  app.post( '/obtenerInformacionUsuario', function ( req, res ) {
    intermed.callController( 'usuarios', 'obtenerInformacionUsuario', '', req, res );
  } );

  app.post('/usuarios/informacionUsuario',function (req, res){
    intermed.callController('usuarios','informacionUsuario',req.body,req, res);
  });

  app.post('/usuario/traer', function (req, res) {
    intermed.callController('usuarios', 'traerDatosUsuario', req.body, req, res);
  });

  app.post('/usuario/info/update', function (req, res) {
    intermed.callController('usuarios', 'UpdateInfo', req.body, req, res);
  });
}
