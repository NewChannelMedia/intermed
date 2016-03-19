var models  = require('../models');
var moment = require('../../public/js/moment.min.js');

exports.generarCita = function(object, req, res) {
  try{
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
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.agregaCita = function(object, req, res) {
  try{
    var fechaNotificacion = new Date(object.fechaFin);
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
          models.MedicoPaciente.findOrCreate({
            where: {medico_id:result.id, paciente_id: req.session.passport.user.Paciente_id},
            defaults:{medico_id:result.id, paciente_id: req.session.passport.user.Paciente_id}
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

        models.Notificacion.create({
            inicio: formatearFecha(fechaNotificacion),
            fin:  formatearFecha(fechaFinNotificacion),
            data : datos.id.toString(),
            tipoNotificacion_id : 21,
            usuario_id : req.session.passport.user.id
        });

        models.Notificacion.create({
            usuario_id : object.medico_id,
            fin: formatearFecha(new Date(object.fecha)),
            data : datos.id.toString(),
            tipoNotificacion_id : 25
        });
        res.status(200).json({success: true});
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.modificaCita = function(object, req, res) {
  try{
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

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.cancelaCitaMedico = function(object, req, res) {
  try{
    var id = object.id.replace("cita_", "");
    //Cancelado por medico
    models.Agenda.update({
        status: 2
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
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.rechazarCita = function(object, req, res) {
  try{
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
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.cancelaCita = function(object, req, res) {
  try{
    var id = object.id.replace("cita_", "");
    models.Agenda.findOne({where:{id:id}}
    ).then(function(agenda){
      var infoAgenda = JSON.parse(JSON.stringify(agenda));
      var usuario_id = agenda.usuario_id;
      //Cancelado por paciente
      models.Agenda.update({
          status: 0
        }, { where : {  id: id }
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
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraCita = function(object, req, res) {
  try{
    models.Agenda.destroy({
        where :  { id: object.id }
    }).then(function() {
        res.status(200).json({ok: true});
    }).catch(function(err) {
        res.status(500).json({error: err})
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene las citas del paciente
exports.seleccionaCitas = function(object, req, res) {
  try{
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
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene la agenda del médico
exports.seleccionaAgenda = function(object, req, res) {
  try{
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
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene una cita especificada por id
exports.seleccionaCita = function(object, req, res) {
  try{
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
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Califica una cita
exports.calificaCita = function(object, req, res) {
  try{
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
        req.errorHandler.report(err, req, res);
      })
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Para mostrar la calificacion de la cita
exports.seleccionaCalificacionCita = function(object, req, res) {
  try{
    models.CalificacionCita.findOne({
      where : { medico_id: object.id },
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
        res.status(500).json({error: err});
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Califica a un médico
exports.calificaMedico = function(object, req, res) {
  try{
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
          req.errorHandler.report(err, req, res);
        })
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene la calificación de un médico
exports.seleccionaCalificacionMedico = function(object, req, res) {
  try{
    models.CalificacionMedico.findById(object.id, {
        include :[{  model: models.Medico,
          include :[{model: models.Usuario,
            include :[{model: models.DatosGenerales}]
          }]
        }]
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene la calificación de una cita
exports.seleccionaCalificacionCita = function(object, req, res) {
  try{
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
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene servicios por usuario
exports.obtieneServicios = function(object, req, res) {
  try{
    models.CatalogoServicios.findAll({
        where :  { usuario_id: object.id }
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene detalles de un servicio
exports.obtieneServicio = function(object, req, res) {
  try{
    models.CatalogoServicios.findOne({
        where :  { id: object.id }
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene lista de servicios  para llenar combo
exports.obtieneServiciosLista = function(object, req, res) {
  try{
    models.CatalogoServicios.findAll({
        where :  { usuario_id: object.id },
        attributes : ['id', 'concepto']
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

//  inserta servicio otorgado por el médico
exports.agregaServicio = function(object, req, res) {
  try{
    models.CatalogoServicios.create({
      concepto: object.concepto,
      descripcion: object.descripcion,
      precio: parseFloat(object.precio),
      duracion: object.duracion,
      usuario_id: object.usuario_id
    }).then(function(datos) {
        res.status(200).json({ok: true});
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Muestra la pantalla para registrar servicios
exports.registraServicio = function(object, req, res) {
  try{
    res.render('servicios');
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }

}

// modifica servicio otorgado por el médico
exports.modificaServicio = function(object, req, res) {
  try{
    models.CatalogoServicios.update({
      concepto: object.concepto,
      descripcion: object.descripcion,
      precio: object.precio,
      duracion: object.duracion,
      usuario_id: object.usuario_id
    }, { where  : {  id: object.id }}).then(function(datos) {
        res.status(200).json({ok: true});
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// borra un servicio
exports.borraServicio = function(object, req, res) {
  try{
    models.CatalogoServicios.destroy({
        where :  { id: object.id }
    }).then(function(datos) {
        res.status(200).json({ok: true});
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

// Obtiene horarios por usuario
exports.seleccionaHorariosMedico = function(object, req, res) {
  try{
    models.Direccion.findAll({
      where : { usuario_id: object.id },
      include:[ {model: Horarios }]
    }).then(function(datos) {
        res.send(datos);
    }).catch(function(err) {
      req.errorHandler.report(err, req, res);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.seleccionaAgendaMedico  =  function(object, req, res){
  try{
    var resultado = [];
    models.Horarios.findAll({
       //where :  { direccion_id: object.id },
         include :[{model: models.Direccion, where : { usuario_id: object.id }}]
    }).then(function(datos) {

      var horaInicio;
      var horaFin;

      /*
      Esto estaba de development
      var today = new Date();
            var fechaHorario=today;
            var inicioSemana  = (today.getDate() - today.getDay());

            for (i = 0; i <= datos.length - 1; i++) {

              if (datos[i].dia > 0 )
              {
                fechaHorario.setDate( inicioSemana + datos[i].dia);
              }
              else {
                fechaHorario.setDate( inicioSemana + 7);
              }

              horaInicio = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() + 1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaInicio;  //  '2015-12-13 ' + datos[i].horaInicio;
              horaFin = fechaHorario.getFullYear() + '-' + (fechaHorario.getMonth() +  1) + '-' + fechaHorario.getDate() + ' ' +  datos[i].horaFin;  //  '2015-12-13 ' + datos[i].horaInicio;

      */

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
        var fechaActual = formatearFecha(new Date());

        for (i = 0; i <= datos.length - 1; i++) {
            var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

            var color = '#5D9AB7';
            if (fechaEvento <= fechaActual){
              color = "#172c3b"
            }

          if (datos[i].status == 1) {
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: 'Cita',
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                color : color,
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
      req.errorHandler.report(err, req, res);
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.muestraAgendaMedico  =  function(object, req, res){
  try{
    res.render( 'citaMedico', {
      id: object.id
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.seleccionaHorarios = function(object, req, res) {
  try{
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
              color : '#FFF',
              constraint: 'businessHours',
              rendering: 'background',
              overlap: false,
              //constraint: 'businessHours'
              //dow: [datos[i].dia]
          };
          resultado.push(horario);
      };

      var fechaActual = formatearFecha(new Date());
      models.Agenda.findAll({
         where :  { direccion_id: object.direccion_id,
                    fechaHoraInicio: {
                      $gte: fechaActual.split(' ')[0]
                    }}
      }).then(function(datos) {
        for (i = 0; i <= datos.length - 1; i++) {
          var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

          var color = '#5D9AB7';
          if (fechaEvento <= fechaActual){
            color = "#172c3b"
          }

          if (datos[i].paciente_id == req.session.passport.user.Paciente_id) {
            if (datos[i].status != 0 ) {
              var horario = {
                  id: 'cita_' +  datos[i].id,
                  title: 'Cita',
                  className: 'notBG',
                  start: datos[i].fechaHoraInicio,
                  end: datos[i].fechaHoraFin,
                  color : color,
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
                className: 'notBG',
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
                className: 'notBG',
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

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.seleccionaAgendaPaciente  =  function(object, req, res){
  try{
    var resultado = [];
    models.Agenda.findAll({
       where :  { paciente_id: req.session.passport.user.Paciente_id}
    }).then(function(datos) {

      var fechaActual = formatearFecha(new Date());
      for (i = 0; i <= datos.length - 1; i++) {

        if (datos[i].status == 1) {
          var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

          var color = '#5D9AB7';
          if (fechaEvento <= fechaActual){
            color = "#172c3b"
          }

          var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'Cita',
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
              color : color,
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

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.detallesCancelacionPaciente = function(object, req, res){
  try{
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
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.detallesCancelacionMedico = function(object, req, res){
  try{
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

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.detalleCita = function(object, req, res){
  try{
    models.Agenda.findOne({
      where:{
        id: object.agenda_id
      },
      include:[{
        model: models.Paciente,
        include: [{
          model: models.Usuario,
          attributes:['usuarioUrl','urlPersonal','urlFotoPerfil'],
          include: [{
            model: models.DatosGenerales
          }]
        }]
      },{
        model: models.CatalogoServicios
      },{
        model: models.Usuario,
        attributes:['usuarioUrl','urlPersonal','urlFotoPerfil'],
        include: [{
          model: models.DatosGenerales
        }]
      },{
        model: models.Direccion,
        include: [{
          model: models.Localidad
        },{
          model: models.Municipio,
          include: [{
            model: models.Estado
          }]
        }]
      }]
    }).then(function(result){
      res.status(200).json({
        result: result
      });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.calificarCita = function(object, req, res){
  try{
    models.Agenda.findOne({
      where:{
        id: object.agenda_id
      },
      attributes: ['usuario_id','paciente_id'],
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.Medico,
          attributes:['id']
        }]
      }]
    }).then(function(result){
      var medico_id = result.Usuario.Medico.id;
      var paciente_id = result.paciente_id;
      object.medico_id = medico_id;
      object.usuario_id = req.session.passport.user.id;
      models.CalificacionCita.findOrCreate({
        where: {
          agenda_id: object.agenda_id,
          medico_id: medico_id,
          paciente_id: paciente_id
        },
        defaults: {
          comentarios: object.comentarios,
          agenda_id: object.agenda_id,
          medico_id: medico_id,
          paciente_id: paciente_id
        }
      }).spread(function(CalificacionCita, created) {
        if (!created){
          CalificacionCita.update({
            comentarios: object.comentarios,
            satisfaccion: object.satisfaccionCita
          });
        }
        //Actualizar datos en preguntasMedico
        models.PreguntasMedico.findOrCreate({
          where: {
            calificacioncita_id: CalificacionCita.id
          },
          defaults: {
            medico_id: object.medico_id,
            calificacioncita_id: CalificacionCita.id,
            higiene: object.respuestas.higiene,
            puntualidad: object.respuestas.puntualidad,
            instalaciones: object.respuestas.instalaciones,
            tratoPersonal: object.respuestas.tratoPersonal,
            satisfaccionGeneral: object.respuestas.satisfaccionGeneral,
            costo: object.respuestas.costo
          }
        }).spread(function(PreguntasMedico, created){
          if (!created){
            //Actualizar resultados
            PreguntasMedico.update({
              medico_id: object.medico_id,
              higiene: object.respuestas.higiene,
              puntualidad: object.respuestas.puntualidad,
              instalaciones: object.respuestas.instalaciones,
              tratoPersonal: object.respuestas.tratoPersonal,
              satisfaccionGeneral: object.respuestas.satisfaccionGeneral,
              costo: object.respuestas.costo
            }).then(function(result){
              exports.calcularCalificacionMedico(object, req, res, true);
            });
          } else {
            exports.calcularCalificacionMedico(object, req, res, false);
          }
          if (object.notificacion_id && object.notificacion_id > 0){
            models.Notificacion.destroy({
              where: {
                id: object.notificacion_id
              }
            });
          }
        });
      });
    });

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};


exports.calcularCalificacionMedico = function(object, req, res, modificacion){
  try{
    models.Medico.findById(object.medico_id).then(function(medico){
      var promedio = 0;
      models.PreguntasMedico.findAll({
        where: {
          medico_id: object.medico_id
        }
      }).then(function(calificaciones){
        calificaciones.forEach(function(cal){
            promedio +=  ((parseInt(cal.higiene) + parseInt(cal.puntualidad) + parseInt(cal.instalaciones) + parseInt(cal.tratoPersonal) + parseInt(cal.satisfaccionGeneral) + parseInt(cal.costo)) / 6);
        });
        promedio = promedio/calificaciones.length;
        medico.update({calificacion :  promedio});
      });
      res.status(200).json({
        success:true
      })
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
},

exports.obtenerCitasPropias = function(object, req, res){
  try{
    if (req.session.passport && req.session.passport.user){
      if (!object.limit){
        object.limit = 0;
      }
      if (!object.offset){
        object.offset = 0;
      }
      if (req.session.passport.user.tipoUsuario == "M"){
        //Si es un medico
        models.Agenda.findAll({
          where:{
            usuario_id: req.session.passport.user.id,
            fechaHoraInicio: {
              $gte: getDateTime()
            }
          },
          limit: object.limit,
          offset: object.offset,
          order: [['fechaHoraInicio','ASC']],
          include: [{
            model: models.Paciente,
            attributes:['id'],
            include: [{
                model: models.Usuario,
                attributes: ['usuarioUrl','urlFotoPerfil','urlPersonal'],
                include: [{
                    model: models.DatosGenerales,
                    attributes: ['nombre','apellidoP','apellidoM']
                }]
            }]
          }]
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result
          });
        });
      } else {
        //Si es un paciente
        models.Agenda.findAll({
          where:{
            paciente_id: req.session.passport.user.Paciente_id,
            fechaHoraInicio: {
              $gte: getDateTime()
            }
          },
          limit: object.limit,
          offset: object.offset,
          order: [['fechaHoraInicio','ASC']],
          include: [{
            model: models.Usuario,
            attributes:['usuarioUrl','urlFotoPerfil','urlPersonal'],
            include: [{
                model: models.DatosGenerales,
                attributes: ['nombre','apellidoP','apellidoM']
            }]
          }]
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result
          });
        });
      }
    } else {
      //Error: no sesion activa
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.contarCitasPropias = function(object, req, res){
  try{
    if (req.session.passport && req.session.passport.user){
      if (req.session.passport.user.tipoUsuario == "M"){
        //Si es un medico
        models.Agenda.findAll({
          where:{
            usuario_id: req.session.passport.user.id,
            fechaHoraInicio: {
              $gte: getDateTime()
            }
          },
          order: [['fechaHoraInicio','ASC']],
          include: [{
            model: models.Paciente,
            attributes:['id'],
            include: [{
                model: models.Usuario,
                attributes: ['usuarioUrl','urlFotoPerfil','urlPersonal'],
                include: [{
                    model: models.DatosGenerales,
                    attributes: ['nombre','apellidoP','apellidoM']
                }]
            }]
          }]
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result.length
          });
        });
      } else {
        //Si es un paciente
        models.Agenda.findAll({
          where:{
            paciente_id: req.session.passport.user.Paciente_id,
            fechaHoraInicio: {
              $gte: getDateTime()
            }
          },
          order: [['fechaHoraInicio','ASC']],
          include: [{
            model: models.Usuario,
            attributes:['usuarioUrl','urlFotoPerfil','urlPersonal'],
            include: [{
                model: models.DatosGenerales,
                attributes: ['nombre','apellidoP','apellidoM']
            }]
          }]
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result.length
          });
        });
      }
    } else {
      //Error: no sesion activa
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

function formatearFecha(fecha){
  var fecha = new Date(fecha);
  var año = fecha.getFullYear();
  var mes = ("0" + (fecha.getMonth()+1)).slice(-2);
  var dia = ("0" + fecha.getDate()).slice(-2);
  var hora = ("0" + fecha.getHours()).slice(-2);
  var minutos = ("0" + fecha.getMinutes()).slice(-2);
  var segundos = ("0" + fecha.getSeconds()).slice(-2);
  return año + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
}

function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;
  var min = date.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;
  var sec = date.getSeconds();
  sec = ( sec < 10 ? "0" : "" ) + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = ( month < 10 ? "0" : "" ) + month;
  var day = date.getDate();
  day = ( day < 10 ? "0" : "" ) + day;
  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

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
  //var id = object.id.replace("Cita_", "");
  var id = object.id;
  var hora =  object.tiempo.split(':');

  models.Agenda.findOne({
       where : { id: id}
  }).then(function(datos) {
      var aplazo = new moment(datos.fechaHoraInicio);
      var aplazoFin = new moment(datos.fechaHoraFin);

      aplazo.add(hora[0], 'hours');
      aplazo.add(hora[1], 'minutes');
      aplazoFin.add(hora[0], 'hours');
      aplazoFin.add(hora[1], 'minutes');

      models.AgendaCambio.create({
        fechaHoraInicio:  aplazo,
        fechaHoraFin:  aplazoFin,
        status: 0,
        agenda_id: id,
        tiempo : object.tiempo
      }).then(function() {
        models.Notificacion.create({
            data : id.toString(),
            tipoNotificacion_id : 50,
            usuario_id : datos.paciente_id.toString()
        });
      }).catch(function(err) {
          res.status(500).json({error: err});
      });
      res.status(200).json({ok: true});
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
          tipoNotificacion_id : 51,
          usuario_id : object.usuario_id.toString(),
          inicio : new Date()
      });
    });

    var qry = "select * from agenda where fechaHoraInicio between '" + formatearTimestampAgenda(agenda.fechaHoraInicio) +  "' and '" + formatearTimestampAgenda( agenda.fechaHoraFin) + "'";
    console.log(qry);
    sequelize.query(qry, {type: sequelize.QueryTypes.SELECT})
    .then(function(datos) {
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
              tipoNotificacion_id : 50,
              usuario_id : datos.paciente_id.toString(),
              inicio : new Date()
          });
       } else {
        //console.log('sin agenda para encimar ')
       }
    });
    res.status(200).json({sucess: ok});
  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

// el paciente no acepto el retraso de la cita
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
          tipoNotificacion_id : 52, //  determinar la notificacion
          usuario_id : datos.usuario_id.toString()
      });

    }).catch(function(err) {
        res.status(500).json({error: err});
    });

  }).catch(function(err) {
      res.status(500).json({error: err});
  });
};

exports.traerAgendaMedico = function (object, req, res){
  object.direccion_id = [];
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Direccion.findAll({
      where: {
        usuario_id: req.session.passport.user.id
      },
      attributes: ['id']
    }).then(function(direcciones){
      direcciones.forEach(function(dir){
        object.direccion_id.push(dir.id);
      });
      exports.agendaMedico(object, req, res);
    })
  } else {
      models.MedicoSecretaria.findOne({
        where:{
          secretaria_id: req.session.passport.user.Secretaria_id,
          medico_id: object.medico_id,
          activo:1
        },
        include: [{
          model: models.Medico,
          attributes:['id'],
          include: [{
            model: models.Usuario,
            attributes: ['id'],
            include: [{
              model: models.Direccion,
              attributes: ['id']
            }]
          }]
        }]
      }).then(function(relacion){
        relacion.Medico.Usuario.Direccions.forEach(function (dir){
          object.direccion_id.push(dir.id);
        });
        if (relacion){
          //Secretaria cuenta con permisos para ver agenda
          exports.agendaMedico(object, req, res);
        } else {
          res.status(200).json({
            success: false,
            result: {
              relacion: relacion
            }
          });
        }
      })
  }
}


exports.agendaMedico = function (object, req, res){
  try{
    var resultado = [];
    models.Horarios.findAll({
       where :  {
         direccion_id: {
           $in: object.direccion_id
         }
       },
       include: [{
         model: models.Direccion
       }]
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

      var total = 0;
      var className = [];
      for (i = 0; i <= datos.length - 1; i++) {

          if (!className[datos[i].direccion_id]){
            className[datos[i].direccion_id] = 'direccion_'+total++;
          }

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
              className : className[datos[i].direccion_id],
              constraint: 'businessHours',
              rendering: 'background',
              overlap: false,
              //constraint: 'businessHours'
              //dow: [datos[i].dia]
          };
          resultado.push(horario);
      };

      var fechaActual = formatearFecha(new Date());
      models.Agenda.findAll({
         where :  { direccion_id: object.direccion_id,
                    fechaHoraInicio: {
                      $gte: object.inicio,
                      $lte: object.fin
                    },
                    status: {
                      $gt: 0
                    }
                    },
                    include: [{
                      model: models.Paciente,
                      include: [{
                        model: models.Usuario,
                        include: [{
                          model: models.DatosGenerales
                        }]
                      }]
                    },{
                      model: models.PacienteTemporal
                    }]
      }).then(function(datos) {
        for (i = 0; i <= datos.length - 1; i++) {
          var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

          var clase = 'citaPend ' + className[datos[i].direccion_id];
          if (new Date(fechaEvento).toISOString().split('.000Z')[0].replace('T',' ') <= fechaActual){
            clase = 'citaPast ' + className[datos[i].direccion_id]
          }

          if (datos[i].status == 1 ) {
            var titulo = '';
            if (datos[i].Paciente){
              titulo = datos[i].Paciente.Usuario.DatosGenerale.nombre + ' ' + datos[i].Paciente.Usuario.DatosGenerale.apellidoP + datos[i].Paciente.Usuario.DatosGenerale.apellidoM;
            } else {
              titulo = datos[i].PacienteTemporal.nombres  + ' ' + datos[i].PacienteTemporal.apellidos;
            }
            var horario = {
                id: 'cita_' +  datos[i].id,
                title: titulo,
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                className: clase,
                editable: false,
                durationEditable: false,
                overlap: false,
                slotEventOverlap: false,
            };
          }  else {
            clase += ' citaCanc';
            var horario = {
              id: 'cita_' +  datos[i].id,
              title: 'Cancelada',
              className: clase,
              start: datos[i].fechaHoraInicio,
              end: datos[i].fechaHoraFin,
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

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}


exports.detalleCita = function (object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model:models.Usuario,
        attributes: ['urlFotoPerfil','correo'],
        where:{
          id: req.session.passport.user.id
        },
        include: [{
          model: models.DatosGenerales
        }]
      },{
        model: models.Direccion,
        attributes: ['nombre'],
      },{
        model: models.CatalogoServicios,
        attributes: ['concepto'],
      },{
        model: models.Paciente,
        attributes: ['id'],
        include: [{
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil'],
          include: [{
            model: models.DatosGenerales
          }]
        }]
      },{
        model: models.PacienteTemporal
      }]
    }).then(function(result){
        res.status(200).json({success:true,result:result});
    })
  } else {
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model:models.Usuario,
        attributes: ['urlFotoPerfil','correo'],
        include: [{
          model: models.DatosGenerales
        },{
          model: models.Medico,
          attributes: ['id'],
          include: [{
            model: models.MedicoSecretaria,
            where: {
              secretaria_id: req.session.passport.user.Secretaria_id,
              activo: 1
            },
            attributes: ['id']
          }]
        }]
      },{
        model: models.Direccion,
        attributes: ['nombre'],
      },{
        model: models.CatalogoServicios,
        attributes: ['concepto'],
      },{
        model: models.Paciente,
        attributes: ['id'],
        include: [{
          model: models.Usuario,
          attributes: ['id','urlFotoPerfil'],
          include: [{
            model: models.DatosGenerales
          }]
        }]
      },{
        model: models.PacienteTemporal
      }]
    }).then(function(result){
        res.status(200).json({success:true,result:result});
    })
  }
}


exports.citaGuardarNota = function (object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        where: {
          id: req.session.passport.user.id
        }
      }]
    }).then(function(agenda){
      if (agenda){
        agenda.update({nota:object.nota}).then(function(result){
          res.status(200).json({success:true,result:result});
        });
      } else {
        res.status(200).json({success:false,result:agenda});
      }
    });
  } else {
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.Medico,
          attributes: ['id'],
          include: [{
            model: models.MedicoSecretaria,
            attributes: ['id'],
            where:{
              secretaria_id: req.session.passport.user.Secretaria_id,
              activo: 1
            }
          }]
        }]
      }]
    }).then(function(agenda){
      if (agenda){
        agenda.update({nota:object.nota}).then(function(result){
          res.status(200).json({success:true,result:result});
        });
      } else {
        res.status(200).json({success:false,result:agenda});
      }
    });
  }
}


exports.cancelarCita = function(object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        where:{
          id: req.session.passport.user.id
        }
      }]
    }).then(function(agenda){
      console.log('AGENDA: ' + JSON.stringify(agenda));
      if (object.medico){
        agenda.update({status: 2}).then(function(agenda){
            console.log('Ag: ' + JSON.stringify(agenda));
        });
      } else {
        agenda.update({status: 0}).then(function(agenda){
            console.log('Ag: ' + JSON.stringify(agenda));
        });
      }
      console.log('Notificaciones');
        res.status(200).json({
          success: true,
          result:1
        })
    });
  } else {
    models.Agenda.findOne({
      where: {
        id: object.agenda_id
      },
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.Medico,
          include: [{
            model: models.MedicoSecretaria,
            where: {activo: 1},
            include: [{
              model: models.Secretaria,
              where: {
                id: req.session.passport.user.Secretaria_id
              }
            }]
          }]
        }]
      }]
    }).then(function(agenda){
      console.log('AGENDA: ' + JSON.stringify(agenda));
      if (object.medico){
        agenda.update({status: 2}).then(function(agenda){
            console.log('Ag: ' + JSON.stringify(agenda));
        });
      } else {
        agenda.update({status: 0}).then(function(agenda){
            console.log('Ag: ' + JSON.stringify(agenda));
        });
      }
      console.log('Notificaciones');
        res.status(200).json({
          success: true,
          result:1
        })
    });
  }
}

exports.serviciosPorHorario = function (object, req, res){
  var day = new Date(object.inicio).getDay();
  object.inicio = new Date(object.inicio).toISOString();
  object.inicio = object.inicio.split('T')[1].split(':00.00')[0]
  models.CatalogoServicios.findAll({
    include: [{
      model: models.Direccion,
      attributes: ['id'],
      include: [{
        model: models.Horarios,
        attributes: ['id','dia','horaInicio','horaFin'],
        where: {
          horaInicio :{
            $lte: object.inicio
          },
          horaFin: {
            $gt:object.inicio
          },
          dia: day
        }
      },{
        model: models.Usuario,
        attributes: ['id'],
        include: [{ model: models.Medico,
                    where: models.sequelize.or(
                      { id: object.medico_id },
                      { id: req.session.passport.user.Medico_id }
                    )
                  }]
      }]
    }]
  }).then(function(result){
    res.status(200).json({
      success: false, result: result
    })
  });
}


exports.crearCita = function (object, req, res){
  models.Medico.findOne({
    where: models.sequelize.or(
      { id: object.medico_id },
      { id: req.session.passport.user.Medico_id }
    )
  }).then(function(medico){
    models.CatalogoServicios.findOne({
      where: {
        id: object.servicio_id
      }
    }).then(function(servicio){
      if (object.paciente_id){
        models.Agenda.create({
          usuario_id: medico.usuario_id,
          paciente_id: object.paciente_id,
          fechaHoraInicio: object.inicio,
          fechaHoraFin: object.fin,
          direccion_id: servicio.direccion_id,
          servicio_id: servicio.id,
          status:1
        }).then(function(result){
          res.status(200).json({
            success: true,
            result: result
          })
        });
      } else {
        //Crear paciente temporal
        models.PacienteTemporal.create({
          nombres: object.nombre,
          apellidos: object.apellido,
          correo: object.correo,
          celular: object.celular
        }).then(function(PacienteTemporal){
            models.Agenda.create({
              usuario_id: medico.usuario_id,
              paciente_temporal_id: PacienteTemporal.id,
              fechaHoraInicio: object.inicio,
              fechaHoraFin: object.fin,
              direccion_id: servicio.direccion_id,
              servicio_id: servicio.id,
              status:1
            }).then(function(result){
              res.status(200).json({
                success: true,
                result: result
              })
            });
        });
      }
    });
  });
}
