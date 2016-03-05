var models  = require('../models');
var moment = require('../../public/js/moment.min.js');


exports.generarCita = function(object, req, res) {
  models.CatalogoServicios.findAll({
      where :  { usuario_id: object.id },
      attributes : ['id', 'concepto']
  }).then(function(servicios) {
      models.Direccion.findAll({
          where : {usuario_id : ofbject.id},
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
      usuario_id : object.usuario_id,
      status : true
  }).then(function(datos) {
      models.Notificacion.create({
          inicio: fechaNotificacion,
          fin: fechaFinNotificacion,
          data : datos.id.toString(),
          tipoNotificacion_id : 21,
          usuario_id : object.paciente_id
      }).catch(function(err) {
          res.status(500).json({error: err});
      });
      fechaNotificacion = new Date(object.fechaInicio);
      models.Notificacion.create({
          inicio: Date.now(),
          fin: fechaNotificacion,
          data : datos.id.toString(),
          tipoNotificacion_id : 25,
          usuario_id : object.usuario_id
      }).catch(function(err) {
          res.status(500).json({error: err});
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
  console.log(object)
  var id = object.id.replace("Cita_", "");
  models.Agenda.update({
      status: 0
    }, { where : {  id: id }
  }).then(function(datos) {
      // Obteniendo el paciente la agenda
      models.Agenda.findOne({
        where : {  id: id }
      }).then(function(agenda) {
          var fechaFin  = new Date();
          var fecha  = new Date();
          fechaFin.setMinutes(fechaFin.getDay() + 1);
          models.Notificacion.create({
              inicio: fecha,
              fin: fechaFin,
              data : object.usuario_id.toString(),
              tipoNotificacion_id : 2,
              usuario_id : agenda.paciente_id.toString()
          }).catch(function(err) {
              res.status(500).json({error: err});
          });
      });
  }).catch(function(err) {
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
          tipoNotificacion_id : 23,
          usuario_id : object.usuario_id
      }).then(function(datos) {

      }).catch(function(err) {
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
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
          tipoNotificacion_id : 24,
          usuario_id : object.usuario_id.toString()
      }).then(function(datos) {

      }).catch(function(err) {
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
  }).catch(function(err) {
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
    var fechaHorario;
    var fechaCalendario  =  object.inicio.split('-');
    var inicioSemana = new Date(fechaCalendario[0], (fechaCalendario[1]-1) , fechaCalendario[2])
    fechaHorario  = inicioSemana;

    for (i = 0; i <= datos.length - 1; i++) {

        fechaHorario = new Date(fechaCalendario[0], (fechaCalendario[1]-1) , inicioSemana.getDate() + (datos[i].dia-1))
        horaInicio = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() + 1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaInicio;  //  '2015-12-13 ' + datos[i].horaInicio;
        horaFin = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() +  1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaFin;  //  '2015-12-13 ' + datos[i].horaInicio;

        var horario = {
            //id: 'businessHours_' +  datos[i].id,
            title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
            start: horaInicio,
            end: horaFin,
            color : '#578',
            constraint: 'businessHours',
            rendering: 'background',
            overlap: false,
            //dow: [datos[i].dia]
        };
        resultado.push(horario);
    };

    // Buscando los eventos del médico

        models.Evento.findAll({
           where :  { usuario_id: object.usuario_id , fechaHoraInicio: { $between: [object.inicio, object.fin] } }
        }).then(function(datos) {
          var horario = {
              id: '_' +  datos[i].id,
              title: datos[i].nota,
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              color : '#FF0000'
          }
          resultado.push(horario);
        });


    // buscando las citas
    models.Agenda.findAll({
       where :  { direccion_id: object.id, fechaHoraInicio: { $between: [object.inicio, object.fin] }}
    }).then(function(datos) {

      for (i = 0; i <= datos.length - 1; i++) {
          if (datos[i].status > 0 ) {
            // las citas del mismo paciente
            if (datos[i].paciente_id == object.paciente_id) {
                var horario = {
                    id: datos[i].id.toString(),
                    title:   'Cita',
                    start: datos[i].fechaHoraInicio,
                    end: datos[i].fechaHoraFin,
                    editable: false,
                    durationEditable: false,
                    overlap: false,
                    slotEventOverlap: false,
                };
            }
            else {
              // las citas de otros pacientes
              var horario = {
                  id: 'Cita_' +  datos[i].id,
                  title: 'No disponible x',
                  start: datos[i].fechaHoraInicio,
                  end: datos[i].fechaHoraFin,
                  color : '#000',
                  editable: false,
                  durationEditable: false,
                  overlap: false,
                  slotEventOverlap: false,
              };
            }
            resultado.push(horario);
        }
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

// Selecciona horarios y eventos del médico
exports.seleccionaAgendaMedico  =  function(object, req, res)
{
    var resultado = [];
    models.Horarios.findAll({
      include:[ {model: models.Direccion, where : { usuario_id: object.id }}]
    }).then(function(datos) {

      var horaInicio;
      var horaFin;
      var fechaHorario;
      var fechaCalendario  =  object.inicio.split('-');
      var inicioSemana = new Date(fechaCalendario[0], (fechaCalendario[1]-1) , fechaCalendario[2])
      fechaHorario  = inicioSemana;

      for (i = 0; i <= datos.length - 1; i++) {
          fechaHorario = new Date(fechaCalendario[0], (fechaCalendario[1]-1) , inicioSemana.getDate() + (datos[i].dia-1))
          horaInicio = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() + 1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaInicio;  //  '2015-12-13 ' + datos[i].horaInicio;
          horaFin = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() +  1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaFin;  //  '2015-12-13 ' + datos[i].horaInicio;

          var horario = {
              //id: 'businessHours_' +  datos[i].id,
              title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
              start: horaInicio,
              end: horaFin,
              color : '#578',
              rendering: 'background',
          };
          resultado.push(horario);
      };

      models.Evento.findAll({
         where :  { usuario_id: object.id , fechaHoraInicio: { $between: [object.inicio, object.fin] } }
      }).then(function(eventos) {
        for (i = 0; i <= eventos.length - 1; i++) {
            //if (eventos[i].status == 1) {
              var horario = {
                  id: '_' +  eventos[i].id,
                  title: eventos[i].descripcion,
                  start: formatearFecha(eventos[i].fechaHoraInicio),
                  end:  formatearFecha (eventos[i].fechaHoraFin),
                  color : '#FF0000'
              }
              console.log(eventos[i].fechaHoraInicio + ' ' + formatearTimestampAgenda(eventos[i].fechaHoraInicio))
              resultado.push(horario);
            //}
        }
      });

      models.Agenda.findAll({
           where :  { usuario_id: object.id , fechaHoraInicio: { $between: [object.inicio, object.fin] } }
      }).then(function(datos) {

            for (i = 0; i <= datos.length - 1; i++) {
                if (datos[i].status == 1) {
                  var horario = {
                      id: 'Cita_' +  datos[i].id,
                      title: 'Cita',
                      start: datos[i].fechaHoraInicio,
                      end: datos[i].fechaHoraFin,
                      editable: false,
                      durationEditable: false,
                    //  overlap: false,
                    //  slotEventOverlap: false,
                  }
                } else {
                  var horario = {
                      id:  datos[i].id,
                      title: 'Cita',
                      start: datos[i].fechaHoraInicio,
                      end: datos[i].fechaHoraFin,
                      color : '#000',
                      editable: false,
                      durationEditable: false,
                    //  overlap: false,
                    //  slotEventOverlap: false
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

// Agrega evento del médico
exports.agregaEvento = function(object, req, res) {
    models.Evento.create({
        fechaHoraInicio:  formatearFecha(object.fecha),
        fechaHoraFin:  formatearFecha(object.fechaFin),
        usuario_id : object.id,
        descripcion: object.titulo
    }).then(function(datos) {
        res.status(200).json({ok: true});
    }).catch(function(err) {
        res.status(500).json({error: err});
    });
};

// Cancelar  evento del médico
exports.cancelaEvento = function(object, req, res) {
  models.Evento.destroy({ where : { id: object.id }
  }).then(function(datos) {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Modificar  evento del médico
exports.modificaEvento = function(object, req, res) {
  models.Evento.update({
      fechaHoraInicio: object.inicio,
      fechaHoraFin: object.fin,
    }, { where : {  id: object.id }
  }).then(function(datos) {
      res.status(200).json({ok: true});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Médico solicitando un cambio en la cita
exports.solicitarCambioCita = function(object, req, res) {
  var id = object.id.replace("Cita_", "");
  models.AgendaCambio.create({
    fechaHoraInicio:  object.fecha,
    fechaHoraFin:  object.fechaFin,
    status: 0,
    agenda_id: id,
    tiempo : object.tiempo
  }).then(function(datos) {
    models.Agenda.findOne({
         where : { id: id}
    }).then(function(datos) {
      models.Notificacion.create({
          data : id.toString(),
          tipoNotificacion_id : 2, //  determinar la notificacion
          usuario_id : datos.paciente_id.toString()
      });
    });
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// Paciente autorizando la cita
exports.aceptarCambioCita = function(object, req, res) {
  //console.log('acepta cambio')
  // cambiando la cita
  models.AgendaCambio.findOne({
    where : { agenda_id: object.id }
  }).then(function(agenda) {
    var hora =  agenda.tiempo.split(':');
    var finalDia =  new moment.utc(agenda.fechaHoraInicio).endOf('day').format('YYYY-MM-DD HH:mm');
    //var finalDia =  new moment.utc(agenda.fechaHoraInicio).endOf('day').format('YYYY-MM-DD HH:mm');

      models.AgendaCambio.update({
        estatus:  1
      }, { where : { agenda_id: object.id, estatus:0}
    });

    models.Agenda.update({
        fechaHoraInicio:  agenda.fechaHoraInicio,
        fechaHoraFin:  agenda.fechaHoraFin
      }, { where : { id: object.id}
    }).then(function() {

      // Notificando al médico de la aceptación
      models.Notificacion.create({
          data : object.id.toString(),
          tipoNotificacion_id : 2, //  determinar la notificacion
          usuario_id : object.usuario_id.toString(),
          inicio : new Date()
      });
    });

    models.Agenda.findOne({
         where : {
           fechaHoraInicio : {$between: [agenda.fechaHoraInicio, agenda.fechaHoraFin]}
           //,
           //fechaHoraInicio : {$lt:finalDia }
         }
    }).then(function(datos) {

      if  ( datos != null)
      {
        console.log(datos.id +  ' ' + datos.fechaHoraInicio + ' ' + datos.fechaHoraFin)
         var aplazo = new moment(datos.fechaHoraInicio);
         var aplazoFin = new moment(datos.fechaHoraFin);

         aplazo.add(hora[0], 'hours');
         aplazo.add(hora[1], 'minutes');
         aplazoFin.add(hora[0], 'hours');
         aplazoFin.add(hora[1], 'minutes');
         // Verificar
         aplazo.subtract(6, 'hours');
         aplazoFin.subtract(6, 'hours');

         models.AgendaCambio.create({
           fechaHoraInicio: formatearTimestampAgenda(aplazo),
           fechaHoraFin:  formatearTimestampAgenda(aplazoFin),
           status: 0,
           agenda_id: datos.id,
           tiempo : agenda.tiempo
         });

          // Notificando al paciente cambio de cita
          models.Notificacion.create({
              data : datos.id.toString(),
              tipoNotificacion_id : 2, //  determinar la notificacion
              usuario_id : datos.paciente_id.toString(),
              inicio : new Date()
          });

      } else {
        console.log('sin datos para encimar')
      }
    });

    res.status(500).json('ok');
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

exports.rechazarCambioCita = function(object, req, res) {
  // Cancelando la solicitud
  console.log(object.id)
  models.AgendaCambio.update({
      estatus: 0,
    }, { where : {  agenda_id: object.id }
  }).then(function() {
    // Cancelando la cita
    models.Agenda.update({
        status: 0,
      },{ where : { id: object.id }
    }).then(function() {
      // Notificando al médico de la cancelación de la cita
      models.Notificacion.create({
          data : object.id.toString(),
          tipoNotificacion_id : 2, //  determinar la notificacion
          usuario_id : datos.usuario_id.toString()
      });
      console.log('cancelando')
    }).catch(function(err) {
        res.status(500).json({error: err});
    });
    console.log('rechanzando')
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};




function formatearFecha(fecha){
  fecha = new Date(fecha);
  var año = fecha.getFullYear();
  var mes = ("0" + (fecha.getMonth()+1)).slice(-2);
  var dia = ("0" + fecha.getDate()).slice(-2);
  var hora = ("0" + fecha.getHours()).slice(-2);
  var minutos = ("0" + fecha.getMinutes()).slice(-2);
  var segundos = ("0" + fecha.getSeconds()).slice(-2);
  return año + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
}

function formatearTimestampAgenda(timestamp){
  var date = new Date(timestamp);
  var iso = date.toISOString().split(':00.')[0].replace('T',' ');
  return iso
}
