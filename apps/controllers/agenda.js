var models  = require('../models');

exports.generarCita = function(object, req, res) {
  models.CatalogoServicios.findAll({
      where :  { usuario_id: object.id },
      attributes : ['id', 'concepto']
  }).then(function(servicios) {
      models.Direccion.findAll({
          where : {usuario_id : object.id},
          attributes : ['id', 'nombre']
      }).then(function(datos) {
        res.render('cita', {
          servicios: servicios,
          ubicaciones : datos
        });
      });
  });
};

exports.agregaCita = function(object, req, res) {
  var fechaNotificacion = new Date(object.fechaFin);
  var fechaFinNotificacion = new Date(object.fechaFin);
  fechaNotificacion.setMinutes(fechaNotificacion.getMinutes() + 30);
  fechaFinNotificacion.setMinutes(fechaNotificacion.getDay() + 7);

  models.Agenda.create({
      fechaHoraInicio:  object.fecha,
      fechaHoraFin:  object.fechaFin,
      status: object.estatus,
      direccion_id: object.lstUbicacion,
      paciente_id : object.paciente_id,
      servicio_id : object.lstServicio,
      usuario_id : object.medico_id,
      status : true
  }).then(function(datos) {
      models.Notificacion.create({
          inicio: fechaNotificacion,
          fin: fechaFinNotificacion,
          data : datos.id.toString(),
          tipoNotificacion_id : 1,  // cambiar el tipo de notificacion
          usuario_id : object.medico_id
      }).catch(function(err) {
          //console.log(err);
          //res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

exports.modificaCita = function(object, req, res) {
  models.Agenda.update({
      fechaHoraInicio: object.fechaHoraInicio,
      status: object.estatus,
      nota: object.nota,
      resumen: object.resumen,
      servicio_id : object.servicio_id,
      direccion_id: object.direccion_id
    }, { where : {  id: object.id }
  }).then(function(datos) {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

exports.cancelaCitaMedico = function(object, req, res) {
  var id = object.id.replace("cita_", "");
  models.Agenda.update({
      status: 0
    }, { where : {  id: id }
  }).then(function(datos) {
      var fechaFin  = new Date();
      var fecha  = new Date();
      fechaFin.setMinutes(fechaFin.getDay() + 1);
      models.Notificacion.create({
          inicio: fecha,
          fin: fechaFin,
          data : object.usuario_id.toString(),
          tipoNotificacion_id : 2,  // cambiar el tipo de notificacion
          usuario_id : object.usuario_id.toString()
      }).then(function(datos) {

      }).catch(function(err) {
          console.log(err);
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
      console.log(err);
      res.status(500).json({error: err});
  });
};

exports.rechazarCita = function(object, req, res) {
  models.Agenda.destroy({ where : {  id: object.id }
  }).then(function(datos) {
      var fechaFin  = new Date();
      var fecha  = new Date();
      fechaFin.setMinutes(fechaFin.getDay() + 1);
      models.Notificacion.create({
          inicio: fecha,
          fin: fechaFin,
          data : object.paciente_id.toString(),
          tipoNotificacion_id : 2,  // cambiar el tipo de notificacion
          usuario_id : 1
      }).then(function(datos) {

      }).catch(function(err) {
          console.log(err);
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
      console.log(err);
      res.status(500).json({error: err});
  });
}

exports.cancelaCita = function(object, req, res) {
  models.Agenda.destroy({ where : {  id: object.id }
  }).then(function(datos) {
      var fechaFin  = new Date();
      var fecha  = new Date();
      fechaFin.setMinutes(fechaFin.getDay() + 1);
      models.Notificacion.create({
          inicio: fecha,
          fin: fechaFin,
          data : object.paciente_id.toString(),
          tipoNotificacion_id : 2,  // cambiar el tipo de notificacion
          usuario_id : object.usuario_id.toString()
      }).then(function(datos) {

      }).catch(function(err) {
          console.log(err);
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
      console.log(err);
      res.status(500).json({error: err});
  });
};

exports.borraCita = function(object, req, res) {
  models.Agenda.destroy({
      where :  { id: object.id }
  }).then(function() {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

// Obtiene las citas del paciente
exports.seleccionaCitas = function(object, req, res) {
  models.Agenda.findAll({
      where :  { paciente_id: object.id },
      include : [
        { model : models.CatalogoServicios, attributes: ['concepto']},
        { model : models.Usuario,   include :[{ model : models.DatosGenerales}]},
        { model : models.Direccion,
          include :[{ model : models.Municipio,
            include :[{ model : models.Estado}]}]}
      ]
  }).then(function(datos) {
    res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};


// Obtiene la agenda del médico
exports.seleccionaAgenda = function(object, req, res) {
  models.Agenda.findAll({
      where :  { usuario_id: object.id },
      include : [
        { model : models.CatalogoServicios, attributes: ['concepto']},
        { model : models.Direccion,
          include :[{ model : models.Municipio,
            include :[{ model : models.Estado}]}]},
        /*{ model : models.Paciente,
          include :[{ model : models.Usuario,
            include :[{ model : models.DatosGenerales}]}]}*/
      ]
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

// Obtiene una cita especificada por id
exports.seleccionaCita = function(object, req, res) {
  models.Agenda.findOne({
      where :  { id: object.id },
      include : [
        { model : models.CatalogoServicios, attributes: ['concepto']},
        { model : models.Usuario,   include :[{ model : models.DatosGenerales}]},
        { model : models.Direccion,
          include :[{ model : models.Municipio,
            include :[{ model : models.Estado}]}]}
      ]
  }).then(function(datos) {
    res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

// Califica una cita
exports.calificaCita = function(object, req, res) {
  models.CalificacionCita.create({
      higieneLugar: object.higieneLugar,
      puntualidad: object.puntualidad,
      instalaciones: object.instalaciones,
      tratoPersonal: object.tratoPersonal,
      satisfaccionGeneral: object.satisfaccionGeneral,
      comentarios: object.comentarios,
      agenda_id: object.agenda_id,
      medico_id: object.medico_id,
      paciente_id: object.paciente_id
  }).then(function(datos) {
    var promedio =  ((datos.higieneLugar + datos.puntualidad + datos.instalaciones + datos.tratoPersonal + datos.satisfaccionGeneral) / 5)
    models.Medico.findById(datos.medico_id)
    .then(function(medico)
    {
      var calificacion = medico.calificacion;
      models.Medico.update({
          calificacion :  ((calificacion + promedio) / 2)
        }, {
          where: { id : datos.medico_id}
      });
      res.status(200).json({ok: true});
    }).catch(function(err) {
        res.status(500).json({error: err});
    })
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Para mostrar la calificacion de la cita
exports.seleccionaCalificacionCita = function(object, req, res) {
  models.CalificacionCita.findOne({
    where : { medico_id: object.id },
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Califica a un médico
exports.calificaMedico = function(object, req, res) {
  models.CalificacionMedico.create({
      efectividad: object.efectividad,
      tratoPersonal: object.tratoPersonal,
      presentacion : object.presentacion,
      higiene : object.higiene,
      medico_id : object.medico_id,
      usuario_id : object.usuario_id
  }).then(function(datos) {
      var promedio =  ((datos.efectividad + datos.tratoPersonal + datos.higiene + datos.presentacion) / 4)
      models.Medico.findById(datos.medico_id)
      .then(function(medico)
      {
        var calificacion = medico.calificacion;
        models.Medico.update({
            calificacion :  ((calificacion + promedio) / 2)
          }, {
            where: { id : datos.medico_id}
        });
        res.status(200).json({ok: true});
      }).catch(function(err) {
          res.status(500).json({error: err});
      })
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Obtiene la calificación de un médico
exports.seleccionaCalificacionMedico = function(object, req, res) {
  models.CalificacionMedico.findById(object.id, {
      include :[{  model: models.Medico,
        include :[{model: models.Usuario,
          include :[{model: models.DatosGenerales}]
        }]
      }]
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Obtiene la calificación de una cita
exports.seleccionaCalificacionCita = function(object, req, res) {
  models.CalificacionCita.findById(object.id, {
    include :[{  model: models.Agenda,
      include :[{model: models.Usuario,
        include :[{model: models.DatosGenerales}]
      },
      { model : models.Direccion,
        include :[{ model : models.Municipio,
          include :[{ model : models.Estado}]
        }]}]
    }]
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Obtiene servicios por usuario
exports.obtieneServicios = function(object, req, res) {
  models.CatalogoServicios.findAll({
      where :  { usuario_id: object.id }
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

// Obtiene detalles de un servicio
exports.obtieneServicio = function(object, req, res) {
  models.CatalogoServicios.findOne({
      where :  { id: object.id }
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

// Obtiene lista de servicios  para llenar combo
exports.obtieneServiciosLista = function(object, req, res) {
  models.CatalogoServicios.findAll({
      where :  { usuario_id: object.id },
      attributes : ['id', 'concepto']
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};

//  inserta servicio otorgado por el médico
exports.agregaServicio = function(object, req, res) {
    models.CatalogoServicios.create({
      concepto: object.concepto,
      descripcion: object.descripcion,
      precio: parseFloat(object.precio),
      duracion: object.duracion,
      usuario_id: object.usuario_id
    }).then(function(datos) {
        res.status(200).json({ok: true});
    }).catch(function(err) {
        res.status(500).json({error: err});
    });
};

// Muestra la pantalla para registrar servicios
exports.registraServicio = function(object, req, res) {
  res.render('servicios');
}

// modifica servicio otorgado por el médico
exports.modificaServicio = function(object, req, res) {
  models.CatalogoServicios.update({
    concepto: object.concepto,
    descripcion: object.descripcion,
    precio: object.precio,
    duracion: object.duracion,
    usuario_id: object.usuario_id
  }, { where  : {  id: object.id }}).then(function(datos) {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// borra un servicio
exports.borraServicio = function(object, req, res) {
  models.CatalogoServicios.destroy({
      where :  { id: object.id }
  }).then(function(datos) {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};


// Obtiene horarios por direccion
exports.seleccionaHorarios = function(object, req, res) {

  var resultado = [];
  models.Horarios.findAll({
     where :  { direccion_id: object.id }
  }).then(function(datos) {

    var horaInicio;
    var horaFin;

    for (i = 0; i <= datos.length - 1; i++) {
        switch (datos[i].dia) {
            case 0: //domingo
                horaInicio = '2015-12-06 ' + datos[i].horaInicio;
                horaFin = '2015-12-06 ' + datos[i].horaFin;
                break;
            case 1: //lunes
                horaInicio = '2015-12-07 ' + datos[i].horaInicio;
                horaFin = '2015-12-07 ' + datos[i].horaFin;
                break;
            case 2: //martes
                horaInicio = '2015-12-08 ' + datos[i].horaInicio;
                horaFin = '2015-12-08 ' + datos[i].horaFin;
                break;
            case 3: //miercoles
                horaInicio = '2015-12-09 ' + datos[i].horaInicio;
                horaFin = '2015-12-09 ' + datos[i].horaFin;
                break;
            case 4: //jueves
                horaInicio = '2015-12-10 ' + datos[i].horaInicio;
                horaFin = '2015-12-10 ' + datos[i].horaFin;
                break;
            case 5: //viernes
                horaInicio = '2015-12-11 ' + datos[i].horaInicio;
                horaFin = '2015-12-12 ' + datos[i].horaFin;
                break;
            case 6: //sabado
                horaInicio = '2015-12-13 ' + datos[i].horaInicio;
                horaFin = '2015-12-13 ' + datos[i].horaFin;
                break;
        };

        var horario = {
            //id: 'businessHours_' +  datos[i].id,
            title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
            start: horaInicio,
            end: horaFin,
            color : '#578',
            constraint: 'businessHours',
            rendering: 'background',
            overlap: false,
            //constraint: 'businessHours'
            //dow: [datos[i].dia]
        };
        resultado.push(horario);
    };

    models.Agenda.findAll({
       where :  { direccion_id: object.id }
    }).then(function(datos) {

      for (i = 0; i <= datos.length - 1; i++) {
      //  console.log(object.paciente_id + ' ' + datos[i].paciente_id)
        if (datos[i].paciente_id == object.paciente_id) {
          var horario = {
              id: datos[i].id.toString(),
              title:   datos[i].servicio_id,
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              //color : '#000',
              editable: false,
              durationEditable: false,
              overlap: false,
              slotEventOverlap: false,
              //constraint: 'businessHours',
              //rendering: 'background',
          };
        }
        else {
          var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'No disponible',
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              color : '#000',
              editable: false,
              durationEditable: false,
              overlap: false,
              slotEventOverlap: false,
              //constraint: 'businessHours',
              //rendering: 'background',
          };
        }
        resultado.push(horario);
      }
      res.send(resultado);
    });
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};


// Obtiene horarios por usuario
exports.seleccionaHorariosMedico = function(object, req, res) {
  models.Direccion.findAll({
    where : { usuario_id: object.id },
    include:[ {model: Horarios }]
  }).then(function(datos) {
      res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};


exports.seleccionaAgendaMedico  =  function(object, req, res)
{
    var resultado = [];
    models.Horarios.findAll({
       //where :  { direccion_id: object.id },
         include :[{model: models.Direccion, where : { usuario_id: object.id }}]
    }).then(function(datos) {

      var horaInicio;
      var horaFin;

      for (i = 0; i <= datos.length - 1; i++) {
          switch (datos[i].dia) {
              case 0: //domingo
                  horaInicio = '2015-12-06 ' + datos[i].horaInicio;
                  horaFin = '2015-12-06 ' + datos[i].horaFin;
                  break;
              case 1: //lunes
                  horaInicio = '2015-12-07 ' + datos[i].horaInicio;
                  horaFin = '2015-12-07 ' + datos[i].horaFin;
                  break;
              case 2: //martes
                  horaInicio = '2015-12-08 ' + datos[i].horaInicio;
                  horaFin = '2015-12-08 ' + datos[i].horaFin;
                  break;
              case 3: //miercoles
                  horaInicio = '2015-12-09 ' + datos[i].horaInicio;
                  horaFin = '2015-12-09 ' + datos[i].horaFin;
                  break;
              case 4: //jueves
                  horaInicio = '2015-12-10 ' + datos[i].horaInicio;
                  horaFin = '2015-12-10 ' + datos[i].horaFin;
                  break;
              case 5: //viernes
                  horaInicio = '2015-12-11 ' + datos[i].horaInicio;
                  horaFin = '2015-12-12 ' + datos[i].horaFin;
                  break;
              case 6: //sabado
                  horaInicio = '2015-12-13 ' + datos[i].horaInicio;
                  horaFin = '2015-12-13 ' + datos[i].horaFin;
                  break;
          };

          var horario = {
              //id: 'businessHours_' +  datos[i].id,
              title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
              start: horaInicio,
              end: horaFin,
              color : '#578',
              constraint: 'businessHours',
              rendering: 'background',
              overlap: false,
              //constraint: 'businessHours'
              //dow: [datos[i].dia]
          };
          resultado.push(horario);
      };

      models.Agenda.findAll({
         where :  { usuario_id: object.id, status: true }
      }).then(function(datos) {

        for (i = 0; i <= datos.length - 1; i++) {

          if (datos[i].status == 1) {
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: 'Cita',
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                color : '#000',
                editable: false,
                durationEditable: false,
                overlap: false,
                slotEventOverlap: false,
                //constraint: 'businessHours',
                //rendering: 'background',
            }
          } else {
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: 'Cita',
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                color : '#000',
                editable: false,
                durationEditable: false,
                overlap: false,
                slotEventOverlap: false,
                //constraint: 'businessHours',
                //rendering: 'background',
            }
          }

          resultado.push(horario);
        }

        res.send(resultado);
      });
    }).catch(function(err) {
        res.status(500).json({error: err})
    });
};

exports.muestraAgendaMedico  =  function(object, req, res)
{
    res.render( 'citaMedico', {
      id: object.id
    });
};
