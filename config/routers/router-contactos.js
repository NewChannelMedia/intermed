module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;


  app.post( '/agregarMedFav', function ( req, res ) {
    intermed.callController( 'contactos', 'agregarFav', req.body, req, res );
  } );

  app.post( '/eliminarMedFav', function ( req, res ) {
    intermed.callController( 'contactos', 'eliminarFav', req.body, req, res );
  } );

  app.post( '/cargarFavCol', function ( req, res ) {
    intermed.callController( 'contactos', 'cargarFavCol', {
      usuario: req.body.usuario
    }, req, res );
  } );

  app.post( '/enviarInvitacion', function ( req, res ) {
    intermed.callController( 'usuarios', 'invitar', req.body, req, res );
  } );

  app.post( '/aceptarInvitacion', function ( req, res ) {
    intermed.callController( 'contactos', 'aceptarInvitacion', req.body, req, res );
  } );

  app.post('/medicos/recomendar', function( req, res ){
    intermed.callController('medicos','recomendar', req.body ,req,res);
  });

  app.post( '/cargarListaEspCol', function ( req, res ) {
    intermed.callController( 'contactos', 'cargarListaEspCol', req.body, req, res );
  } );

  app.post('/cargarListaColegasByEsp', function (req, res){
    intermed.callController( 'contactos', 'cargarListaColegasByEsp', req.body, req, res );
  });

  app.post('/cargarListaAlfCol', function (req, res){
    intermed.callController( 'contactos', 'cargarListaAlfCol', {
      usuario: req.body.usuario
    }, req, res );
  });

  app.post('/cargarListaAlfAmi', function (req, res){
    intermed.callController( 'contactos', 'cargarListaAlfAmi', {
      usuario: req.body.usuario
    }, req, res );
  });

  app.post('/cargarListaColegasByAlf', function (req, res){
    intermed.callController( 'contactos', 'cargarListaColegasByAlf', req.body, req, res );
  });

  app.post('/cargarListaAmistadesByAlf', function (req, res){
    intermed.callController( 'contactos', 'cargarListaAmistadesByAlf', req.body, req, res );
  });
}
