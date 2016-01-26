module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.get('/agendaMedicoVer', function(req,res){
      //routeLife('main','main',hps);
      if (req.session.passport && req.session.passport.user){
        intermed.callController('agenda', 'seleccionaAgendaMedico', {id: req.session.passport.user.id}, req, res);
      } else {
        res.status(200).json({success:false,error:1});
      }
  });

  app.get('/agendaPacienteVer', function(req,res){
      //routeLife('main','main',hps);
      if (req.session.passport && req.session.passport.user){
        intermed.callController('agenda', 'seleccionaAgendaPaciente', {id: req.session.passport.user.id}, req, res);
      } else {
        res.status(200).json({success:false,error:1});
      }
  });

  app.get('/muestraAgendaMedico', function(req,res){
      var datos =  { id : 1}
      routeLife('main','main',hps);
      intermed.callController('agenda','muestraAgendaMedico', datos, req, res);
  });

  app.post( '/cancelaCitaMedico', function ( req, res ) {
    intermed.callController( 'agenda', 'cancelaCitaMedico', req.body, req, res );
  });

  app.post('/agenda/detallesCancelacion/paciente', function (req, res){
    intermed.callController('agenda','detallesCancelacionPaciente', req.body, req, res);
  });

  app.post('/agenda/detallesCancelacion/medico', function (req, res){
    intermed.callController('agenda','detallesCancelacionMedico', req.body, req, res);
  });

  app.post('/agenda/detalleCita', function (req, res){
    intermed.callController('agenda','detalleCita', req.body, req, res);
  });

  app.post('/cita/calificar', function (req, res){
    intermed.callController('agenda','calificarCita', req.body, req, res);
  });
}
