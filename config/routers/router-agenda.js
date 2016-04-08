module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;
/*
  app.get('/agendaMedicoVer', function(req,res){
    //routeLife('main','main',hps);
    if (req.session.passport && req.session.passport.user){
      intermed.callController('agenda', 'seleccionaAgendaMedico', {id: req.session.passport.user.id}, req, res);
    } else {
      res.status(200).json({success:false,error:1});
    }
  });*/


  // Selecciona agenda del médico y permite crear eventos, retrasar y cancelar citas
  app.get('/agendaMedicoVer', function(req,res){
    if (req.session.passport && req.session.passport.user){
      intermed.callController('agenda', 'seleccionaAgendaMedico', {id: req.session.passport.user.id, inicio: req.query.start, fin:req.query.end}, req, res);
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

  // Quitar
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

  app.post('/agenda/detalleCitaPac', function (req, res){
    intermed.callController('agenda','detalleCitaPac', req.body, req, res);
  });

  app.post('/cita/calificar', function (req, res){
    intermed.callController('agenda','calificarCita', req.body, req, res);
  });

  //Obtener citas proximas de usuario logueado
  app.post('/ag/pac/get', function (req, res){
    intermed.callController('agenda','obtenerCitasPropias', req.body, req, res);
  });

  //Contar citas proximas de usuario logueado
  app.post('/ag/private/count', function (req, res){
    intermed.callController('agenda','contarCitasPropias', req.body, req, res);
  });

  //Eventos
  app.post('/eventos/agregar', function (req, res){
    intermed.callController('agenda','agregaEvento', req.body, req, res);
  });

  app.post('/eventos/cancelar', function (req, res){
    intermed.callController('agenda','cancelaEvento', req.body, req, res);
  });

  app.post('/eventos/modificar', function (req, res){
    intermed.callController('agenda','modificaEvento', req.body, req, res);
  });

  //Citas
  app.post('/agenda/retrasarCita', function (req, res){
    intermed.callController('agenda','solicitarCambioCita', req.body, req, res);
  });

  app.post('/agenda/aceptarCambioCita', function (req, res){
    if ( req.body.estatus == true)  {
      intermed.callController('agenda','aceptarCambioCita', req.body, req, res);
    } else {
      intermed.callController('agenda','rechazarCambioCita', req.body, req, res);
    }
  });

  app.post('/agenda/cancelarCita', function (req, res){
    intermed.callController('agenda','cancelaCita', req.body, req, res);
  });

  // Opcion para quitar
  app.post('/agenda/rechazarCambioCita', function (req, res){
    intermed.callController('agenda','rechazarCambioCita', req.body, req, res);
  });


  app.post('/agenda/AgendaMedico', function (req, res){
    intermed.callController('agenda','traerAgendaMedico', req.body, req, res);
  });


  app.post('/agenda/detalleCita', function (req, res){
    intermed.callController( 'agenda', 'detalleCita', req.body, req, res );
  });

  app.post('/agenda/cita/guardarNota',function (req, res){
    intermed.callController( 'agenda', 'citaGuardarNota', req.body, req, res );
  });

  app.post('/agenda/cita/cancelar', function (req, res){
    intermed.callController('agenda','cancelarCita', req.body, req, res);
  });


  app.post('/agenda/serviciosPorHorario', function (req, res){
    intermed.callController('agenda','serviciosPorHorario', req.body, req, res);
  });

  app.post('/agenda/crearCita', function (req, res){
    intermed.callController('agenda','crearCita', req.body, req, res);
  });
  app.post('/agenda/eventos/dia', function (req, res){
    intermed.callController('agenda','eventosPorDia', req.body, req, res);
  });

  app.post('/agenda/cargarCitasMes', function (req, res){
    intermed.callController('agenda','cargarCitasMes', req.body, req, res);
  });

  app.post('/agenda/cargarCitasMesPaciente', function (req, res){
    intermed.callController('agenda','cargarCitasMesPac', req.body, req, res);
  });

  app.post('/agenda/evento/agregar', function (req, res){
    intermed.callController('agenda','eventoAgregar', req.body, req, res);
  });

  app.post('/agenda/detalleEvento', function (req, res){
    intermed.callController('agenda','detalleEvento', req.body, req, res);
  });

  app.post('/agenda/evento/cancelar', function (req, res){
    intermed.callController('agenda','cancelar', req.body, req, res);
  });

  app.post('/agenda/evento/guardarDescripcion', function (req, res){
    intermed.callController( 'agenda', 'eventoGuardarDescr', req.body, req, res );
  });

  app.post('/agenda/reagendar', function (req, res){
    intermed.callController( 'agenda', 'reagendar', req.body, req, res );
  });

}
