var models  = require('../models');
var mail = require( './emailSender' );

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
    var fechaFinNotificacion = new Date(object.fechaFin).setMinutes(new Date(object.fechaFin).getDay() + 7);
    //console.log(object.fecha)
    models.Agenda.create({
        fechaHoraInicio:  new Date(object.fecha),
        fechaHoraFin:  new Date(object.fechaFin),
        status: object.estatus,
        direccion_id: object.ubicacion_id,
        paciente_id : req.session.passport.user.Paciente_id,
        servicio_id : object.serviciocita_id,
        usuario_id : object.medico_id,
        status : 1
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

        //Crear notificacion de recordatorio 1 dia antes
        var undiaantes = new Date(new Date(object.fecha).setHours(new Date(object.fecha).getHours()-24));
        models.Notificacion.create({
          usuario_id: req.session.passport.user.id,
          tipoNotificacion_id: 27,
          data: datos.id.toString(),
          inicio:undiaantes,
          fin:new Date(object.fecha)
        });

        //Crear notificacion de recordatorio 1 hora antes
        var unahoraantes = new Date(new Date(object.fecha).setHours(new Date(object.fecha).getHours()-1));
        models.Notificacion.create({
          usuario_id: req.session.passport.user.id,
          tipoNotificacion_id: 27,
          data: datos.id.toString(),
          inicio:unahoraantes,
          fin:new Date(object.fecha)
        });

        models.Notificacion.create({
            inicio: new Date(object.fechaFin),
            fin:  new Date(fechaFinNotificacion),
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

        models.Medico.findOne({
          where: {
            usuario_id: object.medico_id
          },
          attributes: ['id']
        }).then(function(medico){
          models.MedicoSecretaria.findAll({
            where: {
              activo: 1,
              medico_id: medico.id,
              secretaria_id: { $not: req.session.passport.user.Secretaria_id}
            },
            include: [{
              model: models.Secretaria,
              attributes: ['id','usuario_id']
            }]
          }).then(function(ressec){
            if (ressec){
              ressec.forEach(function(sec){
                models.Notificacion.create({
                  usuario_id: sec.Secretarium.usuario_id,
                  tipoNotificacion_id: 28,
                  data: datos.id.toString()
                });
              });
            }
          });
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
        comentario: object.comentarios,
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
    models.Direccion.findOne({
      where: {
        id: object.direccion_id
      },
      attributes: ['usuario_id']
    }).then(function(direccion){
      if (direccion){
        object.usuario_id = direccion.usuario_id;
      }
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
                title: datos[i].horaInicio + ' - ' + datos[i].horaFin,
                start: horaInicio,
                end: horaFin,
                //color : '#FFF',
                constraint: 'businessHours',
                rendering: 'background',
                overlap: false
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

          models.Evento.findAll({
           where :  {
              fechaHoraInicio: {
                $gte: new Date(object.inicio),
                $lte: new Date(object.fin)
              },
              usuario_id: object.usuario_id,
              status: {
                $gt: 0
              }
            }
          }).then(function(datos) {
            for (i = 0; i <= datos.length - 1; i++) {
              var horario = {
                  id: 'cita_' +  datos[i].id,
                  title: datos[i].nombre,
                  start: datos[i].fechaHoraInicio,
                  end: datos[i].fechaHoraFin,
                  editable: false,
                  durationEditable: false,
                  overlap: false,
                  slotEventOverlap: false,
              };
              resultado.push(horario);
            }
            res.status(200).json(resultado);
          });
        });
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

exports.detalleCitaPac = function(object, req, res){
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
        },{
          model: models.Medico,
          attributes:['id']
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
          comentario: object.comentarios,
          agenda_id: object.agenda_id,
          medico_id: medico_id,
          paciente_id: paciente_id,
          anonimo: object.anonimo
        }
      }).spread(function(CalificacionCita, created) {
        if (!created){
          CalificacionCita.update({
            comentario: object.comentarios,
            anonimo: object.anonimo
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
      if (req.session.passport.user.tipoUsuario == "M"){
        //Si es un medico
        models.Agenda.findAll({
          where:{
            usuario_id: req.session.passport.user.id,
            fechaHoraInicio: {
              $gte: new Date()
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
              $gte: new Date()
            },
            status: 1
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

  models.Agenda.findOne({
       where : { id: id}
  }).then(function(datos) {
      var aplazo = aplazaCita(object.tiempo, object.id);
      models.AgendaCambio.create({
        fechaHoraInicio:  aplazo.fecha,
        fechaHoraFin:  aplazo.fechaFin,
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
    sequelize.query(qry, {type: sequelize.QueryTypes.SELECT})
    .then(function(datos) {
      if  ( datos != null)
      {
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

exports.eventosPorDia = function (object, req, res){
  models.Agenda.findAll({
    where: models.sequelize.or(
      {//Inicio de evento dentro del horario
        usuario_id: req.session.passport.user.id,
        fechaHoraInicio: { $gte: new Date(object.fecha), $lt: new Date(object.fin) },
        status:{$gt: 0}
      },
      {//Fin de evento dentro del horario
        usuario_id: req.session.passport.user.id,
        fechaHoraFin: { $gte: new Date(object.fecha), $lt: new Date(object.fin) },
        status:{$gt: 0}
      }
    ),
    include: [{
      model: models.Paciente,
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        include: [{
          model: models.DatosGenerales
        }]
      }]
    },{
      model: models.PacienteTemporal
    },{
      model: models.Direccion,
      attributes:['nombre']
    }]
  }).then(function(result){
    var dia = new Date(object.fecha).getDay();
    models.Horarios.findAll({
      where: {
        dia: dia
      },
      include :[{model: models.Direccion, where : { usuario_id: req.session.passport.user.id },attributes: ['id']}]
    }).then(function(horarios) {
      object.fecha = new Date(object.fecha).toISOString().replace('T',' ').replace('.000Z','');
      object.fin = new Date(object.fin).toISOString().replace('T',' ').replace('.000Z','');

      models.Evento.findAll({
        where: models.sequelize.or(
          {//Inicio de evento dentro del horario
            usuario_id: req.session.passport.user.id,
            fechaHoraInicio: { $gte: new Date(object.fecha), $lt: new Date(object.fin) },
            status:1
          },
          {//Fin de evento dentro del horario
            usuario_id: req.session.passport.user.id,
            fechaHoraFin: { $gte: new Date(object.fecha), $lt: new Date(object.fin) },
            status:1
          }
        )
      }).then(function(eventos){
        res.status(200).json({
          success:true,
          result: result,
          eventos: eventos,
          horarios: horarios
        })
      });
    });

  })
}

exports.traerAgendaMedico = function (object, req, res){
  object.direccion_id = [];
  object.direcciones = [];
  if (req.session.passport.user.tipoUsuario == "M"){
    object.usuario_medico_id = req.session.passport.user.id;
    if (object.agenda_id){
      models.Agenda.findOne({
        where: {
          id: object.agenda_id
        },
        include: [{
          model: models.Direccion,
          attributes:  ['id','nombre']
        }],
        attributes: ['direccion_id']
      }).then(function(result){
        object.direccion_id = [result.direccion_id];
        object.direcciones.push({
          id: result.Direccion.id,
          nombre: result.Direccion.nombre
        })
        exports.agendaMedico(object, req, res);
      });
    } else {
      models.Direccion.findAll({
        where: {
          usuario_id: req.session.passport.user.id
        },
        attributes: ['id','nombre'],
        order: [['principal','DESC']]
      }).then(function(direcciones){
        direcciones.forEach(function(dir){
          object.direccion_id.push(dir.id);
          object.direcciones.push({
            id: dir.id,
            nombre: dir.nombre
          })
        });
        exports.agendaMedico(object, req, res);
      });
    }
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
              attributes: ['id','nombre'],
              order: [['principal','DESC']]
            }]
          }]
        }]
      }).then(function(relacion){
        object.usuario_medico_id = relacion.Medico.Usuario.id;
        if (object.agenda_id){
          models.Agenda.findOne({
            where: {
              id: object.agenda_id
            },
            include: [{
              model: models.Direccion,
              attributes:  ['id','nombre']
            }],
            attributes: ['direccion_id']
          }).then(function(result){
            object.direccion_id = [result.direccion_id];
            object.direcciones.push({
              id: result.Direccion.id,
              nombre: result.Direccion.nombre
            });
            exports.agendaMedico(object, req, res);
          });
        } else {
          relacion.Medico.Usuario.Direccions.forEach(function (dir){
            object.direccion_id.push(dir.id);
            object.direcciones.push({
              id: dir.id,
              nombre: dir.nombre
            })
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
        }
      });
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

      var dias = [];
      var newDate = new Date(object.inicio);
      for (var i = 1; i<7; i++){
        dias[i] = newDate.toISOString().split('T')[0];
        newDate = new Date(newDate.setHours(new Date(newDate).getHours()+24));
      }
      dias[0] = new Date(object.fin).toISOString().split('T')[0];


      var total = 0;
      var className = [];
      for (i = 0; i <= datos.length - 1; i++) {

          if (!className[datos[i].direccion_id]){
            className[datos[i].direccion_id] = 'direccion_'+total++;
            object.direcciones.forEach(function(dir){
              if (dir.id == datos[i].direccion_id){
                dir.className = className[datos[i].direccion_id];
              }
            });
          }

          horaInicio = dias[datos[i].dia] + ' ' + datos[i].horaInicio;
          horaFin = dias[datos[i].dia] + ' ' + datos[i].horaFin;


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
       where :  {
           direccion_id: {
             $in: object.direccion_id
           },
          fechaHoraInicio: {
            $gte: new Date(object.inicio),
            $lte: new Date(object.fin)
          },
          id: {$not: object.agenda_id},
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
          if (new Date(fechaEvento) <= new Date()){
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

        models.Evento.findAll({
         where :  {
            fechaHoraInicio: {
              $gte: new Date(object.inicio),
              $lte: new Date(object.fin)
            },
            usuario_id: object.usuario_medico_id,
            status: {
              $gt: 0
            }
          }
        }).then(function(datos) {
          for (i = 0; i <= datos.length - 1; i++) {
            var fechaEvento = formatearFecha(new Date(datos[i].fechaHoraInicio).toUTCString());

            var clase = 'eventoMedico';

            var horario = {
                id: 'cita_' +  datos[i].id,
                title: datos[i].nombre,
                start: datos[i].fechaHoraInicio,
                end: datos[i].fechaHoraFin,
                className: clase,
                editable: false,
                durationEditable: false,
                overlap: false,
                slotEventOverlap: false,
            };
            resultado.push(horario);
          }
          if (object.agenda_id){
            models.Agenda.findOne({
              where: {
                id: object.agenda_id
              },
              attributes: ['id','paciente_id','paciente_temporal_id'],
              include: [{
                model: models.Paciente,
                attributes: ['id'],
                include: [{
                  model: models.Usuario,
                  attributes: ['id'],
                  include: [{
                    model: models.DatosGenerales
                  }]
                }]
              },{
                model: models.PacienteTemporal,
              },{
                model: models.CatalogoServicios,
                attributes: ['duracion','concepto']
              }]
            }).then(function(agenda){
                res.status(200).json({
                  result: resultado,
                  direcciones: object.direcciones,
                  porreagendar: agenda
                });
            });
          } else {
            res.status(200).json({
              result: resultado,
              direcciones: object.direcciones
            });
          }
        });
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
        },{
          model: models.Medico,
          attributes: ['id']
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


exports.detalleEvento = function (object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Evento.findOne({
      where: {
        id: object.evento_id
      }
    }).then(function(result){
        res.status(200).json({success:true,result:result});
    })
  } else {
    models.Evento.findOne({
      where: {
        id: object.evento_id
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
      }]
    }).then(function(result){
        res.status(200).json({success:true,result:result});
    })
  }
}

exports.eventoGuardarDescr = function (object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    models.Evento.findOne({
      where: {
        id: object.evento_id
      },
      include: [{
        model: models.Usuario,
        attributes: ['id'],
        where: {
          id: req.session.passport.user.id
        }
      }]
    }).then(function(evento){
      if (evento){
        evento.update({descripcion:object.descripcion,nombre: object.nombre,ubicacion:object.ubicacion}).then(function(result){
          res.status(200).json({success:true,result:result});
        });
      } else {
        res.status(200).json({success:false,result:agenda});
      }
    });
  } else {
    models.Evento.findOne({
      where: {
        id: object.evento_id
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
    }).then(function(evento){
      if (evento){
        evento.update({descripcion:object.descripcion,nombre: object.nombre,ubicacion:object.ubicacion}).then(function(result){
          res.status(200).json({success:true,result:result});
        });
      } else {
        res.status(200).json({success:false,result:agenda});
      }
    });
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
      if (object.medico){
        agenda.update({status: 2});
      } else {
        agenda.update({status: 0});
      }
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
          model: models.DatosGenerales
        },{
          model: models.Medico,
          include: [{
            model: models.MedicoSecretaria,
            where: {activo: 1},
            include: [{
              model: models.Secretaria,
              where: {
                id: req.session.passport.user.Secretaria_id
              }
            },{
              model: models.MedicoSecretariaPermisos,
              where: {
                permiso: 1,
                secretaria_permiso_id: 4
              }
            }]
          }]
        }]
      },{
        model: models.Paciente
      },{
        model: models.PacienteTemporal
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
      },{
        model: models.CatalogoServicios
      }]
    }).then(function(agenda){
      if (agenda){
        if (object.medico){
          agenda.update({status: 2});
        } else {
          agenda.update({status: 0});
        }
        //Informar a Paciente
        if (agenda.PacienteTemporal){
          //Enviar notificacion por correo
          if (agenda.PacienteTemporal.correo){
            agenda.fechaHoraInicio = new Date(new Date(agenda.fechaHoraInicio).setHours(new Date(agenda.fechaHoraInicio.getHours()-parseInt(object.utc))));
            var mailobject ={
              subject:'Cita cancelada con el Dr. ' + agenda.Usuario.DatosGenerale.nombre  + ' ' + agenda.Usuario.DatosGenerale.apellidoP,
              to:agenda.PacienteTemporal.correo,
              nombre: ' ' + agenda.PacienteTemporal.nombres + ' ' + agenda.PacienteTemporal.apellidos,
              medfotoPerfil: global.base_url + agenda.Usuario.urlFotoPerfil,
              fechahora: agenda.fechaHoraInicio.toISOString().replace('T',' ').replace(':00.000Z',''),
              ubicacion: agenda.Direccion.nombre  + '\n(' + agenda.Direccion.calle  + ' ' + agenda.Direccion.numero + ' ' + agenda.Direccion.numeroInt + ' ' + agenda.Direccion.Localidad.localidad +'. ' + agenda.Direccion.Municipio.municipio  +', '+ agenda.Direccion.Municipio.Estado.estado  + ')',
              servicio: agenda.CatalogoServicio.concepto,
              mednombre: agenda.Usuario.DatosGenerale.nombre  + ' ' + agenda.Usuario.DatosGenerale.apellidoP + ' ' + agenda.Usuario.DatosGenerale.apellidoM
            };
            mail.send(mailobject,'citacancelada');
          }
        } else {
          models.Notificacion.create({
            usuario_id: agenda.Paciente.usuario_id,
            tipoNotificacion_id: 22,
            data: agenda.id.toString()
          });
        }

        //Informar a Médico
        models.Notificacion.create({
          usuario_id: agenda.Usuario.id,
          tipoNotificacion_id: 24,
          data: agenda.id.toString()
        });

        //Informar a secretarias de médico
        models.MedicoSecretaria.findAll({
          where: {
            activo: 1,
            medico_id: agenda.Usuario.Medico.id
          },
          include: [{
            model: models.Secretaria,
            attributes: ['id','usuario_id']
          }]
        }).then(function(ressec){
          if (ressec){
            ressec.forEach(function(sec){
              models.Notificacion.create({
                usuario_id: sec.Secretarium.usuario_id,
                tipoNotificacion_id: 23,
                data: agenda.id.toString()
              });
            });
          }
        });


        res.status(200).json({
          success: true
        })
      } else {
        res.status(200).json({
          success: false,
          error: 301
        })
      }
    });
  }
}

exports.serviciosPorHorario = function (object, req, res){
  var day = new Date(object.inicio).getDay();
  if (object.kendo){
    var horas = 0;
    if (object.inicio.search('PM')>0){
      horas = 12;
    }
    object.inicio = object.inicio.split(', ')[1].split(':');
    if (object.inicio[0]==12){
      horas = 0;
    }
    object.inicio[0] = (parseInt(object.inicio[0])+horas).toString();
    if (object.inicio[0].length == 1){
      object.inicio[0] = '0'+object.inicio[0];
    }
    object.inicio = object.inicio[0]+':'+object.inicio[1];
  } else {
    object.inicio = new Date(object.inicio).toISOString();
    object.inicio = object.inicio.split('T')[1].split(':00.00')[0];
  }
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
  if (req.session.passport.user.tipoUsuario == "M"){
    object.usuario_medico_id = req.session.passport.user.id;
    exports.validarInterferenciaEventos(object, req, res, exports.crearCitaMedico);
  } else {
    models.Medico.findOne({
      where: { id: object.medico_id },
      include: [{
        model: models.MedicoSecretaria,
        where: {
          secretaria_id: req.session.passport.user.Secretaria_id
        },
        include: [{
          model: models.MedicoSecretariaPermisos,
          where: {
            permiso: 1,
            secretaria_permiso_id: 3
          }
        }]
      }]
    }).then(function(medico){
      if (!medico){
        //Acceso denegado (no tiene permiso para agregar citas al médico)
        res.status(200).json({
          success: false,
          result: 301
        });
      } else {
        object.usuario_medico_id = medico.usuario_id;
        exports.validarInterferenciaEventos(object, req, res, exports.crearCitaMedico);
      }
    });
  }
}

exports.validarInterferenciaEventos= function (object,req, res, next){
  models.Evento.findOne({
    where: models.sequelize.or(
      {
        /*Evento nuevo contiene a evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gte: new Date(object.inicio) },
        fechaHoraFin: { $lte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*Evento existente contiene a evento nuevo*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lte: new Date(object.inicio) },
        fechaHoraFin: { $gte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*inicio de nuevo evento esta dentro de evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lte: new Date(object.inicio) },
        fechaHoraFin: { $gt: new Date(object.inicio) },
        status: {$gte: 1}
      },
      {
        /*fin de nuevo evento esta dentro de evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lt: new Date(object.fin) },
        fechaHoraFin: { $gte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*inicio de evento existente esta dentro de nuevo evento*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gte: new Date(object.inicio) },
        fechaHoraFin: { $lt: new Date(object.inicio) },
        status: {$gte: 1}
      },
      {
        /*fin de evento existente esta dentro de nuevo evento*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gt: new Date(object.fin) },
        fechaHoraFin: { $lte: new Date(object.fin) },
        status: {$gte: 1}
      }
    )
  }).then(function(result1){
    models.Agenda.findOne({
      where: models.sequelize.or(
        {
          /*Evento nuevo contiene a evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gte: new Date(object.inicio) },
          fechaHoraFin: { $lte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*Evento existente contiene a evento nuevo*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lte: new Date(object.inicio) },
          fechaHoraFin: { $gte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*inicio de nuevo evento esta dentro de evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lte: new Date(object.inicio) },
          fechaHoraFin: { $gt: new Date(object.inicio) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*fin de nuevo evento esta dentro de evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lt: new Date(object.fin) },
          fechaHoraFin: { $gte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*inicio de evento existente esta dentro de nuevo evento*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gte: new Date(object.inicio) },
          fechaHoraFin: { $lt: new Date(object.inicio) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*fin de evento existente esta dentro de nuevo evento*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gt: new Date(object.fin) },
          fechaHoraFin: { $lte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        }
      )
    }).then(function(result2){
      if (!result1 && !result2){
        next(object, req, res);
      } else {
        res.status(200).json({
          success:false,
          overflow: true
        });
      }
    });
  });
}

exports.crearCitaMedico = function (object, req, res){
  models.CatalogoServicios.findOne({
    where: {
      id: object.servicio_id
    }
  }).then(function(servicio){
    if (object.paciente_id){
      models.Agenda.create({
        usuario_id: object.usuario_medico_id,
        paciente_id: object.paciente_id,
        fechaHoraInicio: new Date(object.inicio),
        fechaHoraFin: new Date(object.fin),
        direccion_id: servicio.direccion_id,
        servicio_id: servicio.id,
        status:1
      }).then(function(result){
        models.Usuario.findOne({
          attributes: ['id'],
          include: [{
            model: models.Paciente,
            where: [{
              id: object.paciente_id
            }]
          }]
        }).then(function(usuario){
          models.Medico.findOne({
            attributes: ['id'],
            where: {
              usuario_id: object.usuario_medico_id
            }
          }).then(function(medico){
            if (req.session.passport.user.tipoUsuario == "M"){
              //Notificacion a secretarias
              models.MedicoSecretaria.findAll({
                where: {
                  activo: 1,
                  medico_id: medico.id
                },
                include: [{
                  model: models.Secretaria,
                  attributes: ['id','usuario_id']
                }]
              }).then(function(ressec){
                if (ressec){
                  ressec.forEach(function(sec){
                    models.Notificacion.create({
                      usuario_id: sec.Secretarium.usuario_id,
                      tipoNotificacion_id: 28,
                      data: result.id.toString()
                    });
                  });
                }
              });
            } else {
              //Notificacion a médico y a secretaria (excepto actual)
              models.Notificacion.create({
                usuario_id: object.usuario_medico_id,
                tipoNotificacion_id: 29,
                data: result.id.toString()
              });
              models.MedicoSecretaria.findAll({
                where: {
                  activo: 1,
                  medico_id: medico.id,
                  secretaria_id: { $not: req.session.passport.user.Secretaria_id}
                },
                include: [{
                  model: models.Secretaria,
                  attributes: ['id','usuario_id']
                }]
              }).then(function(ressec){
                if (ressec){
                  ressec.forEach(function(sec){
                    models.Notificacion.create({
                      usuario_id: sec.Secretarium.usuario_id,
                      tipoNotificacion_id: 28,
                      data: result.id.toString()
                    });
                  });
                }
              });
            }
          });

          if (usuario){
            //Crear notificacion para paciente registrado en Intermed (not_id: 26)
            models.Notificacion.create({
              usuario_id: usuario.id,
              tipoNotificacion_id: 26,
              data: result.id.toString()
            });

            //Crear notificacion de recordatorio 1 dia antes
            var undiaantes = new Date(new Date(object.inicio).setHours(new Date(object.inicio).getHours()-24));
            models.Notificacion.create({
              usuario_id: usuario.id,
              tipoNotificacion_id: 27,
              data: result.id.toString(),
              inicio:undiaantes,
              fin:new Date(object.inicio)
            });

            //Crear notificacion de recordatorio 1 hora antes
            var unahoraantes = new Date(new Date(object.inicio).setHours(new Date(object.inicio).getHours()-1));
            models.Notificacion.create({
              usuario_id: usuario.id,
              tipoNotificacion_id: 27,
              data: result.id.toString(),
              inicio:unahoraantes,
              fin:new Date(object.inicio)
            });

            //Crear notificacion para calificar cita (not_id: 21) terminada la cita
            models.Notificacion.create({
              usuario_id: usuario.id,
              tipoNotificacion_id: 21,
              data: result.id.toString(),
              inicio:new Date(object.fin)
            });
          }
        });
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
            usuario_id: object.usuario_medico_id,
            paciente_temporal_id: PacienteTemporal.id,
            fechaHoraInicio: object.inicio,
            fechaHoraFin: object.fin,
            direccion_id: servicio.direccion_id,
            servicio_id: servicio.id,
            status:1
          }).then(function(result){
            models.Medico.findOne({
              attributes: ['id'],
              where: {
                usuario_id: object.usuario_medico_id
              },
              include: [{
                model: models.Usuario,
                attributes: ['usuarioUrl','urlFotoPerfil','id'],
                include: [{
                  model: models.DatosGenerales
                }]
              }]
            }).then(function(medico){
              models.Agenda.findOne({
                where: {
                  id: result.id
                },
                include: [{
                  model: models.Direccion,
                  include: [{
                    model: models.Localidad
                  },{
                    model: models.Municipio,
                    include: [{
                      model: models.Estado
                    }]
                  }]
                },{
                  model: models.CatalogoServicios
                }]
              }).then(function(agenda){
                //console.log('Agenda: ' + JSON.stringify(agenda));
                /*
                {"id":177,"fechaHoraInicio":"2016-04-27T14:00:00.000Z","fechaHoraFin":"2016-04-27T14:30:00.000Z","status":1,"nota":null,"resumen":null,"direccion_id":1,"usuario_id":1,"paciente_id":null,"paciente_temporal_id":18,"servicio_id":1,"Direccion":{"id":1,"calle":"Calle Santo Tomas de Aquino","numero":"5748","numeroInt":"","calle1":"","calle2":"","principal":0,"nombre":"New Channel","usuario_id":1,"institucion_id":null,"municipio_id":1804,"localidad_id":19972,"latitud":"20.667080199999997","longitud":"-103.4377507","Municipio":{"id":1804,"municipio_id":120,"municipio":"Zapopan","estado_id":14,"Estado":{"id":14,"estado":"Jalisco"}}},"CatalogoServicio":{"id":1,"concepto":"Alergias","descripcion":"Tratamiento","precio":300,"duracion":"00:30:00","usuario_id":1,"direccion_id":1}}
                */
                agenda.fechaHoraInicio = new Date(new Date(agenda.fechaHoraInicio).setHours(new Date(agenda.fechaHoraInicio.getHours()-parseInt(object.utc))));
                //Enviar correo
                if (object.correo && object.correo != ""){
                  //Enviar correo con detalles de cita creada
                  if (object.correo && object.correo != ""){
                    //Enviar correo con detalles de cita creada
                    var mailobject ={
                      subject:'Nueva cita en Intermed',
                      to:object.correo,
                      nombre: ' ' + object.nombre + ' ' + object.apellido,
                      enlace:global.base_url,
                      medfotoPerfil: global.base_url + medico.Usuario.urlFotoPerfil,
                      fechahora: agenda.fechaHoraInicio.toISOString().replace('T',' ').replace(':00.000Z',''),
                      ubicacion: agenda.Direccion.nombre  + '\n(' + agenda.Direccion.calle  + ' ' + agenda.Direccion.numero + ' ' + agenda.Direccion.numeroInt + ' ' + agenda.Direccion.Localidad.localidad +'. ' + agenda.Direccion.Municipio.municipio  +', '+ agenda.Direccion.Municipio.Estado.estado  + ')',
                      servicio: agenda.CatalogoServicio.concepto,
                      mednombre: medico.Usuario.DatosGenerale.nombre  + ' ' + medico.Usuario.DatosGenerale.apellidoP + ' ' + medico.Usuario.DatosGenerale.apellidoM
                    };
                    mail.send(mailobject,'nuevacita');
                  }
                }

              });

              if (req.session.passport.user.tipoUsuario == "M"){
                //Notificacion a secretarias
                models.MedicoSecretaria.findAll({
                  where: {
                    activo: 1,
                    medico_id: medico.id
                  },
                  include: [{
                    model: models.Secretaria,
                    attributes: ['id','usuario_id']
                  }]
                }).then(function(ressec){
                  if (ressec){
                    ressec.forEach(function(sec){
                      models.Notificacion.create({
                        usuario_id: sec.Secretarium.usuario_id,
                        tipoNotificacion_id: 28,
                        data: result.id.toString()
                      });
                    });
                  }
                });
              } else {
                //Notificacion a médico y a secretaria (excepto actual)
                models.Notificacion.create({
                  usuario_id: object.usuario_medico_id,
                  tipoNotificacion_id: 29,
                  data: result.id.toString()
                });
                models.MedicoSecretaria.findAll({
                  where: {
                    activo: 1,
                    medico_id: medico.id,
                    secretaria_id: { $not: req.session.passport.user.Secretaria_id}
                  },
                  include: [{
                    model: models.Secretaria,
                    attributes: ['id','usuario_id']
                  }]
                }).then(function(ressec){
                  if (ressec){
                    ressec.forEach(function(sec){
                      models.Notificacion.create({
                        usuario_id: sec.Secretarium.usuario_id,
                        tipoNotificacion_id: 28,
                        data: result.id.toString()
                      });
                    });
                  }
                });
              }
            });
            res.status(200).json({
              success: true,
              result: result
            })
          });
      });
    }
  });
}

exports.cargarCitasMes = function(object, req, res){
  models.sequelize.query(
    "SELECT count(`fechaHoraInicio`) AS TOTAL,DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) AS FECHA FROM `intermed`.`agenda` where `status` > 0 && `usuario_id` = "+ req.session.passport.user.id +"  group by DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) order by `fechaHoraInicio` ASC;"
    , { type: models.Sequelize.QueryTypes.SELECT}
  ).then(function(result) {
    models.sequelize.query(
      "SELECT count(`fechaHoraInicio`) AS TOTAL,DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) AS FECHA FROM `intermed`.`eventos` where `status` > 0 && `usuario_id` = "+ req.session.passport.user.id +"  group by DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) order by `fechaHoraInicio` ASC;"
      , { type: models.Sequelize.QueryTypes.SELECT}
    ).then(function(result2) {
      res.status(200).json({
        success: false,
        result: result.concat(result2)
      });
    });
  });
}

exports.cargarCitasMesPac = function(object, req, res){
  models.sequelize.query(
    "SELECT count(`fechaHoraInicio`) AS TOTAL,DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) AS FECHA FROM `intermed`.`agenda` where `status` > 0 && `paciente_id` = "+ req.session.passport.user.Paciente_id +" AND DATE(`fechaHoraInicio`) >= NOW()  group by DATE(CONVERT_TZ(`fechaHoraInicio`,'+00:00','"+ object.tz +"')) order by `fechaHoraInicio` ASC;"
    , { type: models.Sequelize.QueryTypes.SELECT}
  ).then(function(result) {
    res.status(200).json({
      success: false,
      result: result
    });
  });
}

exports.eventoAgregar = function (object, req, res){
  if (req.session.passport && req.session.passport.user.tipoUsuario == "M"){
    object.usuario_medico_id = req.session.passport.user.id;
    exports.validarCrearEvento(object, req, res);
  } else {
    models.MedicoSecretaria.findOne({
      where:{
        secretaria_id: req.session.passport.user.Secretaria_id,
        medico_id: object.medico_id,
        activo:1
      },
      include: [{
        model: models.Medico,
        attributes:['id','usuario_id'],
        include: [{
          model: models.Usuario,
          attributes: ['id'],
          include: [{
            model: models.Direccion,
            attributes: ['id','nombre'],
            order: [['principal','DESC']]
          }]
        },{
          model: models.MedicoSecretaria,
          where: {activo: 1},
          include: [{
            model: models.Secretaria,
            where: {
              id: req.session.passport.user.Secretaria_id
            }
          },{
            model: models.MedicoSecretariaPermisos,
            where: {
              permiso: 1,
              secretaria_permiso_id: 2
            }
          }]
        }]
      }]
    }).then(function(relacion){
      if (relacion){
        object.usuario_medico_id = relacion.Medico.Usuario.id;
        exports.validarCrearEvento(object, req, res);
      } else {
        res.status(200).json({
          success: false,
          error: 404
        })
      }
    });
  }
}

exports.validarCrearEvento = function (object, req, res){
  models.Evento.findOne({
    where: models.sequelize.or(
      {
        /*Evento nuevo contiene a evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gte: new Date(object.inicio) },
        fechaHoraFin: { $lte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*Evento existente contiene a evento nuevo*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lte: new Date(object.inicio) },
        fechaHoraFin: { $gte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*inicio de nuevo evento esta dentro de evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lte: new Date(object.inicio) },
        fechaHoraFin: { $gt: new Date(object.inicio) },
        status: {$gte: 1}
      },
      {
        /*fin de nuevo evento esta dentro de evento existente*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $lt: new Date(object.fin) },
        fechaHoraFin: { $gte: new Date(object.fin) },
        status: {$gte: 1}
      },
      {
        /*inicio de evento existente esta dentro de nuevo evento*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gte: new Date(object.inicio) },
        fechaHoraFin: { $lt: new Date(object.inicio) },
        status: {$gte: 1}
      },
      {
        /*fin de evento existente esta dentro de nuevo evento*/
        usuario_id: object.usuario_medico_id,
        fechaHoraInicio: { $gt: new Date(object.fin) },
        fechaHoraFin: { $lte: new Date(object.fin) },
        status: {$gte: 1}
      }
    )
  }).then(function(result1){
    models.Agenda.findOne({
      where: models.sequelize.or(
        {
          /*Evento nuevo contiene a evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gte: new Date(object.inicio) },
          fechaHoraFin: { $lte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*Evento existente contiene a evento nuevo*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lte: new Date(object.inicio) },
          fechaHoraFin: { $gte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*inicio de nuevo evento esta dentro de evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lte: new Date(object.inicio) },
          fechaHoraFin: { $gt: new Date(object.inicio) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*fin de nuevo evento esta dentro de evento existente*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $lt: new Date(object.fin) },
          fechaHoraFin: { $gte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*inicio de evento existente esta dentro de nuevo evento*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gte: new Date(object.inicio) },
          fechaHoraFin: { $lt: new Date(object.inicio) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        },
        {
          /*fin de evento existente esta dentro de nuevo evento*/
          usuario_id: object.usuario_medico_id,
          fechaHoraInicio: { $gt: new Date(object.fin) },
          fechaHoraFin: { $lte: new Date(object.fin) },
          status: {$gte: 1},
          id: {$not: object.agenda_id}
        }
      )
    }).then(function(result2){
      if (!result1 && !result2){
        models.Evento.create({
          fechaHoraInicio: new Date(object.inicio),
          fechaHoraFin: new Date(object.fin),
          nombre: object.nombre,
          ubicacion: object.ubicacion,
          descripcion: object.descripcion,
          usuario_id : object.usuario_medico_id
        }).then(function(evento){
          var success = false;
          if (evento) success = true;
          res.status(200).json({
            success:true,
            evento: evento
          });
        });
      } else {
        res.status(200).json({
          success:false,
          overflow: true
        });
      }
    });
  });
}

exports.cancelarEvento = function (object, req, res){
  models.Evento.findOne({
    where: {
      id: object.evento_id
    },
    include: [{
      model: models.Usuario,
      attributes:['id'],
      include: [{
        model: models.Medico,
        attributes: ['id']
      }]
    }]
  }).then(function(evento){
    if (req.session.passport && req.session.passport.user.tipoUsuario == "M"){
      if (evento.Usuario.id = req.session.passport.usuario.id){
        evento.update({status:0}).then(function(result){
          res.status(200).json({
            success:true
          });
        });
      } else {
        res.status(200).json({
          success:false
        });
      }
    } else {
      models.MedicoSecretaria.findOne({
        where: {
          activo: 1,
          secretaria_id: req.session.passport.user.Secretaria_id,
          medico_id: evento.Usuario.Medico.id
        },
        include: [{
          model: models.MedicoSecretariaPermisos,
          where: {
            permiso: 1,
            secretaria_permiso_id: 5
          }
        }]
      }).then(function(result){
        if (result){
          evento.update({status:0}).then(function(result){
            res.status(200).json({
              success:true
            });
          });
        } else {
          res.status(200).json({
            success: false,
            error: 404
          })
        }
      })
    }
  });
}

exports.reagendar = function (object, req, res){
  if (req.session.passport.user.tipoUsuario == "M"){
    object.usuario_medico_id = req.session.passport.user.id;
    exports.validarInterferenciaEventos(object, req, res, exports.guardarReagenda);
  } else {
    models.Medico.findOne({
      where: { id: object.medico_id },
      include: [{
        model: models.MedicoSecretaria,
        where: {
          secretaria_id: req.session.passport.user.Secretaria_id
        },
        include: [{
          model: models.MedicoSecretariaPermisos,
          where: {
            permiso: 1,
            secretaria_permiso_id: 6
          }
        }]
      }]
    }).then(function(medico){
      if (!medico){
        //Acceso denegado (no tiene permiso para agregar citas al médico)
        res.status(200).json({
          success: false,
          result: 301
        });
      } else {
        object.usuario_medico_id = medico.usuario_id;
        exports.validarInterferenciaEventos(object, req, res, exports.guardarReagenda);
      }
    });
  }
}

exports.guardarReagenda = function (object, req, res){
  models.Agenda.findOne({
    where: {
      id: object.agenda_id
    },
    include: [{
      model: models.Usuario,
      attributes: ['id','usuarioUrl','urlFotoPerfil','urlPersonal'],
      include: [{
        model: models.DatosGenerales
      }]
    },{
      model: models.Paciente
    },{
      model: models.PacienteTemporal
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
    },{
      model: models.CatalogoServicios
    }]
  }).then(function(agenda){
    if (agenda){
      agenda.update({
        fechaHoraInicio: new Date(object.inicio),
        fechaHoraFin: new Date(object.fin),
        motivoreagenda: object.motivo
      }).then(function(result){
        if (agenda.Paciente){
          //Actualizar notificacion de recordatorio y de calificacion, eliminar
          //crear notificacion de cita reagendad
          models.Notificacion.destroy({
            where: {
              data: agenda.id.toString(),
              tipoNotificacion_id: {$in: [21,27]}
            }
          }).then(function(result){
            //Notificacion cita reagendada
            models.Notificacion.create({
                data: agenda.id.toString(),
                tipoNotificacion_id : 30,
                usuario_id: agenda.Paciente.usuario_id
            });

            //Crear notificacion de recordatorio 1 dia antes
            var undiaantes = new Date(new Date(agenda.fechaHoraInicio).setHours(new Date(agenda.fechaHoraInicio).getHours()-24));
            models.Notificacion.create({
              usuario_id: agenda.Paciente.usuario_id,
              tipoNotificacion_id: 27,
              data: agenda.id.toString(),
              inicio:undiaantes,
              fin:new Date(agenda.fechaHoraInicio)
            });

            //Crear notificacion de recordatorio 1 hora antes
            var unahoraantes = new Date(new Date(agenda.fechaHoraInicio).setHours(new Date(agenda.fechaHoraInicio).getHours()-1));
            models.Notificacion.create({
              usuario_id: agenda.Paciente.usuario_id,
              tipoNotificacion_id: 27,
              data: agenda.id.toString(),
              inicio:unahoraantes,
              fin:new Date(agenda.fechaHoraInicio)
            });

            models.Notificacion.create({
                inicio: new Date(agenda.fechaHoraFin),
                fin:  new Date(new Date(agenda.fechaHoraFin).setHours(new Date(agenda.fechaHoraFin).getHours()+(24*7))),
                data: agenda.id.toString(),
                tipoNotificacion_id : 21,
                usuario_id: agenda.Paciente.usuario_id
            });
          })

        } else {
          //Enviar correo con reagenda
          if (agenda.PacienteTemporal.correo){
            agenda.fechaHoraInicio = new Date(new Date(agenda.fechaHoraInicio).setHours(new Date(agenda.fechaHoraInicio.getHours()-parseInt(object.utc))));
            var mailobject ={
              motivo: agenda.motivoreagenda,
              subject:'Cita reagendada con el Dr. ' + agenda.Usuario.DatosGenerale.nombre  + ' ' + agenda.Usuario.DatosGenerale.apellidoP,
              to:agenda.PacienteTemporal.correo,
              nombre: ' ' + agenda.PacienteTemporal.nombres + ' ' + agenda.PacienteTemporal.apellidos,
              medfotoPerfil: global.base_url + agenda.Usuario.urlFotoPerfil,
              fechahora: agenda.fechaHoraInicio.toISOString().replace('T',' ').replace(':00.000Z',''),
              ubicacion: agenda.Direccion.nombre  + '\n(' + agenda.Direccion.calle  + ' ' + agenda.Direccion.numero + ' ' + agenda.Direccion.numeroInt + ' ' + agenda.Direccion.Localidad.localidad +'. ' + agenda.Direccion.Municipio.municipio  +', '+ agenda.Direccion.Municipio.Estado.estado  + ')',
              servicio: agenda.CatalogoServicio.concepto,
              mednombre: agenda.Usuario.DatosGenerale.nombre  + ' ' + agenda.Usuario.DatosGenerale.apellidoP + ' ' + agenda.Usuario.DatosGenerale.apellidoM
            };
            mail.send(mailobject,'citareagendada');
          }
        }

        res.status(200).json({success: true})
      })
    } else {
      res.status(200).json({success: false})
    }
  })
}

function aplazaCita(tiempo, id)
{
  models.Agenda.findOne({
       where : { id: id}
  }).then(function(evento) {

    var inicio = new moment(evento.fechaHoraInicio);
    var aplazoInicio = new moment(evento.fechaHoraInicio);
    var fin = new moment(evento.fechaHoraFin);
    var aplazoFin = new moment(evento.fechaHoraFin);
    var hora  =  tiempo.split(':');

    aplazo = inicio.add(hora[0], 'hours');
    aplazo = inicio.add(hora[1], 'minutes');

    aplazoFin = fin.add(hora[0], 'hours');
    aplazoFin = fin.add(hora[1], 'minutes');

    var datos =  {
      id: evento.id,
      tiempo: tiempo,
      fecha : aplazo.format('YYYY-M-D') + " "  + aplazo.format('HH:mm'),
      fechaFin:  aplazoFin.format('YYYY-M-D') + " "  + aplazoFin.format('HH:mm'),
    }

    return datos;
  });

}
