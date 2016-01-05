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
  console.log('fechaNotificacion: ' + fechaNotificacion);
  var fechaFinNotificacion = new Date(object.fechaFin);
  fechaNotificacion.setMinutes(fechaNotificacion.getMinutes() + 30);
  fechaFinNotificacion.setMinutes(fechaNotificacion.getDay() + 7);
  //console.log(object.fecha)
  models.Agenda.create({
      fechaHoraInicio:  object.fecha,
      fechaHoraFin:  object.fechaFin,
      status: object.estatus,
      direccion_id: object.ubicacion_id,
      paciente_id : req.session.passport.user.Paciente_id,
      servicio_id : object.serviciocita_id,
      usuario_id : object.medico_id,
      status : true
  }).then(function(datos) {
      models.Medico.findOne({
        where:{
          usuario_id: object.medico_id
        }
      }).then(function(result){
        models.MedicoPaciente.findOne({
            paciente_id: req.session.passport.user.Paciente_id,
            medico_id: result.id
        }).then(function(resultado){
          if (resultado.length == 0){
            models.MedicoPaciente.create({
                paciente_id: req.session.passport.user.Paciente_id,
                medico_id: result.id
            });
          }
        });

        models.MedicoFavorito.findOne({
          where: {
            usuario_id: req.session.passport.user.id,
            medico_id: result.id
          }
        }).then(function(resultado){
          if (!resultado){
            //Agregar como medico favorito
              models.MedicoFavorito.create({
                usuario_id: req.session.passport.user.id,
                medico_id: result.id,
                aprobado: 1,
                mutuo: 1
              });
          }
        })
      });

      //Agregar a pacientes que atiende el médico

      console.log('notificacion paciente');
      models.Notificacion.create({
          inicio: formatearFecha(fechaNotificacion),
          fin:  formatearFecha(fechaFinNotificacion),
          data : datos.id.toString(),
          tipoNotificacion_id : 21,
          usuario_id : req.session.passport.user.id
      },{logging:console.log});
      console.log('notificacion medico');
      models.Notificacion.create({
          usuario_id : object.medico_id,
          fin: formatearFecha(new Date(object.fecha)),
          data : datos.id.toString(),
          tipoNotificacion_id : 25
      },{logging:console.log});
      res.status(200).json({success: true});
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
      models.Agenda.findOne({
        where:{
          id: id
        }
      }).then(function(cita){
        models.Paciente.findOne({
          where: {
            id: cita.paciente_id.toString()
          }
        }).then(function(paciente){
          models.Notificacion.destroy({
            where:{
              tipoNotificacion_id: {$in: [21,25]},
              data: id
            }
          }).then(function(){
            models.Notificacion.create({
                data : id,
                tipoNotificacion_id : 22,
                usuario_id : paciente.usuario_id.toString()
            }).then(function(datos) {
              res.status(200).json({success: true});
            });
          });
        });
      });
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
          tipoNotificacion_id : 23,
          usuario_id : object.usuario_id
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
  var id = object.id.replace("cita_", "");
  models.Agenda.findOne({where:{id:id}}
  ).then(function(agenda){
    var infoAgenda = JSON.parse(JSON.stringify(agenda));
    var usuario_id = agenda.usuario_id;
    models.Agenda.destroy({where:{id:id}
    }).then(function(datos) {
        models.Notificacion.create({
            data : req.session.passport.user.Paciente_id+'|'+infoAgenda.fechaHoraInicio+'|'+infoAgenda.fechaHoraFin+'|'+infoAgenda.direccion_id+'|'+infoAgenda.servicio_id,
            tipoNotificacion_id : 24,
            usuario_id : usuario_id
        }).then(function(datos) {
          res.status(200).json({success: true});
        });
    })
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
/*
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
                horaInicio = '2015-12-20 ' + datos[i].horaInicio;
                horaFin = '2015-12-20 ' + datos[i].horaFin;
                break;
            case 1: //lunes
                horaInicio = '2015-12-14 ' + datos[i].horaInicio;
                horaFin = '2015-12-14 ' + datos[i].horaFin;
                break;
            case 2: //martes
                horaInicio = '2015-12-15 ' + datos[i].horaInicio;
                horaFin = '2015-12-15 ' + datos[i].horaFin;
                break;
            case 3: //miercoles
                horaInicio = '2015-12-16 ' + datos[i].horaInicio;
                horaFin = '2015-12-16 ' + datos[i].horaFin;
                break;
            case 4: //jueves
                horaInicio = '2015-12-17 ' + datos[i].horaInicio;
                horaFin = '2015-12-17 ' + datos[i].horaFin;
                break;
            case 5: //viernes
                horaInicio = '2015-12-18 ' + datos[i].horaInicio;
                horaFin = '2015-12-18 ' + datos[i].horaFin;
                break;
            case 6: //sabado
                horaInicio = '2015-12-19 ' + datos[i].horaInicio;
                horaFin = '2015-12-19 ' + datos[i].horaFin;
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
          if (datos[i].status != 0 ) {
            var horario = {
                id: datos[i].id.toString(),
                title:   'Cita',
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
          }  else {
            var horario = {
              id: 'Cita_' +  datos[i].id,
              title: 'Cancelada',
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              color : '#000',
              editable: false,
              durationEditable: false,
              overlap: false,
              slotEventOverlap: false,
            };
          }
        }
        else {
          var horario = {
              id: 'Cita_' +  datos[i].id,
              title: 'No disponible',
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
      res.send(resultado);
    });
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
};
*/

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
                  horaInicio = '2015-12-20 ' + datos[i].horaInicio;
                  horaFin = '2015-12-20 ' + datos[i].horaFin;
                  break;
              case 1: //lunes
                  horaInicio = '2015-12-14 ' + datos[i].horaInicio;
                  horaFin = '2015-12-14 ' + datos[i].horaFin;
                  break;
              case 2: //martes
                  horaInicio = '2015-12-15 ' + datos[i].horaInicio;
                  horaFin = '2015-12-15 ' + datos[i].horaFin;
                  break;
              case 3: //miercoles
                  horaInicio = '2015-12-16 ' + datos[i].horaInicio;
                  horaFin = '2015-12-16 ' + datos[i].horaFin;
                  break;
              case 4: //jueves
                  horaInicio = '2015-12-17 ' + datos[i].horaInicio;
                  horaFin = '2015-12-17 ' + datos[i].horaFin;
                  break;
              case 5: //viernes
                  horaInicio = '2015-12-18 ' + datos[i].horaInicio;
                  horaFin = '2015-12-18 ' + datos[i].horaFin;
                  break;
              case 6: //sabado
                  horaInicio = '2015-12-19 ' + datos[i].horaInicio;
                  horaFin = '2015-12-19 ' + datos[i].horaFin;
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
         where :  { usuario_id: object.id}
      }).then(function(datos) {

        for (i = 0; i <= datos.length - 1; i++) {

          if (datos[i].status == 1) {
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: 'Cita',
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
//                color : '#000',
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
                rendering: 'background',
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

exports.seleccionaHorarios = function(object, req, res) {
  var resultado = [];
  models.Horarios.findAll({
     where :  { direccion_id: object.direccion_id }
  }).then(function(datos) {

    var horaInicio;
    var horaFin;

    var dia0 = object.inicio +' ';

    var inicio = object.inicio.split('-');
    var fin = object.fin.split('-');

    var dia1 = '';
    var dia2 = '';
    var dia3 = '';
    var dia4 = '';
    var dia5 = '';
    var dia6 = '';
    if (fin[2]<inicio[2]){
      //cambio de mes
      var ultimo = parseInt(fin[2]);
      if (ultimo > 1){
        dia6 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
        if (ultimo>1){
          dia5 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
          if (ultimo>1){
            dia4 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
            if (ultimo>1){
              dia3 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
              if (ultimo>1){
                dia2 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
                if (ultimo>1){
                  dia1 = fin[0] + '-' + fin[1] + '-' + ("0" + --ultimo).slice(-2) + ' ';
                } else {
                  dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                }
              } else {
                  dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                  dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
              }
            } else {
                dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
                dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
                dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
            }
          } else {
              dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
              dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
              dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
              dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
          }
        } else {
            dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
            dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
            dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
            dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
            dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
        }
      } else {
        dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
        dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
        dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
        dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
        dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
        dia6 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+6)).slice(-2) + ' ';
      }
    } else {
      dia1 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+1)).slice(-2) + ' ';
      dia2 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+2)).slice(-2) + ' ';
      dia3 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+3)).slice(-2) + ' ';
      dia4 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+4)).slice(-2) + ' ';
      dia5 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+5)).slice(-2) + ' ';
      dia6 = inicio[0] + '-' + inicio[1] + '-' + ("0" + (parseInt(inicio[2])+6)).slice(-2) + ' ';
    }


    for (i = 0; i <= datos.length - 1; i++) {
        switch (datos[i].dia) {
            case 0: //domingo
                horaInicio = dia6 + datos[i].horaInicio;
                horaFin = dia6 + datos[i].horaFin;
                break;
            case 1: //lunes
                horaInicio = dia0 + datos[i].horaInicio;
                horaFin = dia0 + datos[i].horaFin;
                break;
            case 2: //martes
                horaInicio = dia1 + datos[i].horaInicio;
                horaFin = dia1 + datos[i].horaFin;
                break;
            case 3: //miercoles
                horaInicio = dia2 + datos[i].horaInicio;
                horaFin = dia2 + datos[i].horaFin;
                break;
            case 4: //jueves
                horaInicio = dia3 + datos[i].horaInicio;
                horaFin = dia3 + datos[i].horaFin;
                break;
            case 5: //viernes
                horaInicio = dia4 + datos[i].horaInicio;
                horaFin = dia4 + datos[i].horaFin;
                break;
            case 6: //sabado
                horaInicio = dia5 + datos[i].horaInicio;
                horaFin = dia5 + datos[i].horaFin;
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
       where :  { direccion_id: object.direccion_id}
    }).then(function(datos) {

      for (i = 0; i <= datos.length - 1; i++) {
      //  console.log(object.paciente_id + ' ' + datos[i].paciente_id)
        if (datos[i].paciente_id == req.session.passport.user.Paciente_id) {
          if (datos[i].status != 0 ) {
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: 'Cita',
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
          }  else {
            var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'Cancelada',
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              color : '#000',
              editable: false,
              durationEditable: false,
              overlap: false,
              slotEventOverlap: false,
            };
          }
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
          };
        }
        resultado.push(horario);
      }
      res.send(resultado);
    });
  });
};





exports.seleccionaAgendaPaciente  =  function(object, req, res)
{
    var resultado = [];
    models.Agenda.findAll({
       where :  { paciente_id: req.session.passport.user.Paciente_id}
    }).then(function(datos) {

      for (i = 0; i <= datos.length - 1; i++) {

        if (datos[i].status == 1) {
          var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'Cita',
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
//                color : '#000',
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
              rendering: 'background',
          }
        }

        resultado.push(horario);
      }

      res.send(resultado);
    });
};

exports.detallesCancelacionPaciente = function(object, req, res){
  models.Usuario.findOne({
    attributes: ['urlFotoPerfil'],
    include: [
      {
        model: models.Paciente,
        where: {
          id: object.paciente_id
        }
      },{
        model: models.DatosGenerales,
        attributes: ['nombre','apellidoP','ApellidoM']
      }
    ]
  }).then(function(usuario){
    models.Direccion.findOne({
      where: {
        id: object.direccion_id
      },
      attributes: ['nombre']
    }).then(function(ubicacion){
      models.CatalogoServicios.findOne({
        where:{
          id: object.servicio_id
        },
        attributes: ['concepto']
      }).then(function(servicio){
        console.log('UBICACION: ' + JSON.stringify(ubicacion));
        console.log('SERVICIO: ' + JSON.stringify(servicio));
        res.status(200).json({
          usuario: usuario,
          ubicacion: ubicacion.nombre,
          servicio: servicio.concepto
        });
      });
    })
  });
};

exports.detallesCancelacionMedico = function(object, req, res){
  models.Agenda.findOne({
    where:{
      id: object.agenda_id
    },
    include:[{
      model: models.Usuario,
      include: [{
        model: models.DatosGenerales
      }]
    },{
      model: models.CatalogoServicios
    },{
      model: models.Direccion
    }]
  }).then(function(result){
    res.status(200).json({
      result: result
    });
  });
};

exports.detalleCita = function(object, req, res){
  models.Agenda.findOne({
    where:{
      id: object.agenda_id
    },
    include:[{
      model: models.Paciente,
      include: [{
        model: models.Usuario,
        include: [{
          model: models.DatosGenerales
        }]
      }]
    },{
      model: models.CatalogoServicios
    },{
      model: models.Direccion
    }]
  }).then(function(result){
    res.status(200).json({
      result: result
    });
  });
};

function formatearFecha(fecha){
  var año = fecha.getFullYear();
  var mes = ("0" + (fecha.getMonth()+1)).slice(-2);
  var dia = ("0" + fecha.getDate()).slice(-2);
  var hora = ("0" + fecha.getHours()).slice(-2);
  var minutos = ("0" + fecha.getMinutes()).slice(-2);
  var segundos = ("0" + fecha.getSeconds()).slice(-2);
  return año + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
}
