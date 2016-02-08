var eventos = [];
var fechaInicio = '2015-11-02';

$(document).ready(function () {
  if ($('#horariosUbi').length>0 && $('#horariosUbi').val()){

    var valido = true;
    var eventos = JSON.parse($('#horariosUbi').val());
    console.log('EVENTOS: ' + JSON.stringify(eventos));

    //inicializar calendario
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        defaultView: 'agendaWeek',
        height: 350,
        allDaySlot: false,
        slotLabelFormat: 'h:mm a',
        slotLabelInterval: 30,
        columnFormat: 'dddd',
        header: {
            center: false,
            right: false,
            left: false
        },
        //businessHours: {
        //    start: '2015-11-08 10:00',
        //    end: '2015-11-08 12:00',
        //    dow: [0, 1, 2, 3, 4, 5, 6]
        //},
        minTime: '8:00',
        maxTime: '21:00',
        lang: 'es',
        events: eventos,
        defaultDate: fechaInicio,
        selectable: true,
        selectHelper: true,
        displayEventTime: false,
        eventOverlap:false,
        select: function (start, end) {
            var eventData;
            if (start.format('DMYYYY') != end.format('DMYYYY')) {
                alert('fechas distintas');
                valido = false;
            } else {
                valido = true;
            };

            if (valido == true) {
                eventData = {
                    title: 'Titulo Evento',
                    start: start,
                    end: end
                };

                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $('#calendar').fullCalendar('unselect');

        },
        editable: true,
        eventLimit: true,

        eventClick: function (event, jsEvent, view) {
            if (confirm('Desea eliminar el evento?')) {
                $('#calendar').fullCalendar('removeEvents', event._id);
            }
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            if (event.start.format('DMYYYY') != event.end.format('DMYYYY')) {
                alert('fechas distintas');
                revertFunc();
            }
        },
        //eventMouseover: function (event, jsEvent, view) {
        //    $(this).append('<span id=\"' + event._id + '\">Clic para eliminar</span>');

        //},
        eventMouseout: function (event, jsEvent, view) {
            $('#' + event._id).remove();
        },
        //eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
        //    console.log(jsEvent.target.id);
        //}

        eventMouseover: function (event, jsEvent, view) {
            $(this).append('<img src="img/eliminar.png" id=\"' + event.id + '\"/>');

        },
        eventMouseout: function (event, jsEvent, view) {
            $('#' + event.id).remove();
        }
    });
  }
});


function obtenerHorariosAgenda(direccion_id) {
    var objhorarios = [];
    var objhtemp = [];
    var h = $('#divCalendario').fullCalendar('clientEvents');
    var evento;
    var i;
    var inicio = new moment();
    var fin = new moment();

    objhorarios = [];
    if (parseInt(direccion_id<=0)){
      direccion_id = $('#idDireccion').val();
    }

    h.forEach(function(evento){

      inicio.hours(evento.start._d.getUTCHours());
      inicio.minute(evento.start._d.getUTCMinutes());

      fin.hours(evento.end._d.getUTCHours());
      fin.minute(evento.end._d.getUTCMinutes());

      var horario = {
          direccion_id: direccion_id,
          dia: evento.start._d.getDay(),
          horaInicio: inicio.format('HH:mm'),
          horaFin: fin.format('HH:mm')
      };
      objhtemp.push(horario);
    });

    //Ordenar por hora
    objhtemp.sort(function(a, b){
      var date1 = new Date(2016, 01, a['dia'], parseInt(a['horaInicio'].split(':')[0]), parseInt(a['horaInicio'].split(':')[1]));
      var date2 = new Date(2016, 01, b['dia'], parseInt(b['horaInicio'].split(':')[0]), parseInt(b['horaInicio'].split(':')[1]));

      if(date1 < date2){
        return -1;
      }else if(date1 > date2){
        return 1;
      } else {
        return 0;
      }
    });

    for (i = 0; i <= objhtemp.length-1; i++) {
        var total = objhorarios.length;

        if (i>0 && total>0){
          var date1 = new Date(2016, 01, objhorarios[total-1]['dia'], parseInt(objhorarios[total-1]['horaFin'].split(':')[0]), parseInt(objhorarios[total-1]['horaFin'].split(':')[1]));
          var date2 = new Date(2016, 01, objhtemp[i]['dia'], parseInt(objhtemp[i]['horaInicio'].split(':')[0]), parseInt(objhtemp[i]['horaInicio'].split(':')[1]));
          if (date1.toISOString() == date2.toISOString()){
            objhorarios[total-1].horaFin = objhtemp[i].horaFin;
          } else {
            objhorarios.push(objhtemp[i]);
          }
        } else {
          objhorarios.push(objhtemp[i]);
        }
    };

    return objhorarios;
};

function iniciarCalendario(eventos){

  eventos = JSON.parse(JSON.stringify(eventos));

  var valido = true;

  $('#divCalendario').fullCalendar({
      // put your options and callbacks here
      defaultView: 'agendaWeek',
      height: 350,
      allDaySlot: false,
      slotLabelFormat: 'h:mm a',
      slotLabelInterval: 30,
      columnFormat: 'dddd',
      header: {
          center: false,
          right: false,
          left: false
      },
      //businessHours: {
      //    start: '2015-11-08 10:00',
      //    end: '2015-11-08 12:00',
      //    dow: [0, 1, 2, 3, 4, 5, 6]
      //},
      minTime: '8:00',
      maxTime: '21:00',
      lang: 'es',
      //events: eventos,
      events: eventos,
      defaultDate: fechaInicio,
      selectable: true,
      eventOrder: 'start',
      selectHelper: true,
      displayEventTime: false,
      eventOverlap:false,
      select: function (start, end) {
          var eventData;
          if (start.format('DMYYYY') != end.format('DMYYYY')) {
              //alert('fechas distintas');
              valido = false;
          } else {
              valido = true;
          };

          if (valido == true) {
              eventData = {
                  start: start,
                  end: end
              };

              $('#divCalendario').fullCalendar('renderEvent', eventData, true); // stick? = true
          }
          $('#divCalendario').fullCalendar('unselect');

      },
      editable: true,
      eventLimit: true,

      eventClick: function (event, jsEvent, view) {
          if (confirm('Desea eliminar el evento?')) {
              $('#divCalendario').fullCalendar('removeEvents', event._id);
          }


      },
      eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
          if (event.start.format('DMYYYY') != event.end.format('DMYYYY')) {
              alert('fechas distintas');
              revertFunc();
          }
      },
      //eventMouseover: function (event, jsEvent, view) {
      //    $(this).append('<span id=\"' + event._id + '\">Clic para eliminar</span>');

      //},
      eventMouseout: function (event, jsEvent, view) {
          $('#' + event._id).remove();
      },
      //eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
      //    console.log(jsEvent.target.id);
      //}

      eventMouseover: function (event, jsEvent, view) {
          $(this).append('<span class="eventCalRemove glyphicon glyphicon-trash"  id=\"' + event.id + '\"></span>');

      },
      eventMouseout: function (event, jsEvent, view) {
          $('#' + event.id).remove();
      }
  });
}

function iniciarCalendarioAgendarCita(){
    var valido = true;
    var duracionServicio =  $('#citaDuracion').html().substring(0, 5);

    $('#divCalendario').fullCalendar({
        firstDay:1,
        defaultView: 'agendaWeek',
        height: 350,
        allDaySlot: false,
        defaultDate: moment().format("YYYY-MM-DD"),
        slotLabelFormat: 'h:mm a',
        businessHours: true,
        slotLabelInterval : duracionServicio,
        slotDuration: '00:30',
        header: {
            //center: false,
            //right: false,
            left: false
        },
        //events: {url: '/seleccionaHorarios/' +  $('#ubicacion_id').val() +  "/" + $('#paciente_id').val()},
        events: function(start, end, timezone, callback) {
          $.ajax({
              url: '/seleccionaHorarios',
              type: 'POST',
              dataType: "json",
              cache: false,
              data: { direccion_id: $('#ubicacion_id').val(), inicio: start.format(), fin: end.format()},
              success: function (data) {
                callback(data);
              },
              error: function (err){
                console.log('AJAX Error: ' + JSON.stringify(err));
              }
            });
        },
        minTime: '8:00',
        maxTime: '21:00',
        defaultDate: new Date(),
        lang: 'es',
        selectable: true,
        selectHelper: false,
        displayEventTime: true,
        editable: true,
        eventLimit: true,
        overlap: false,
        slotEventOverlap: false,
        timezone:  "UTC",
        dayClick: function (date, allDay, jsEvent, view) {
          //quitaEventos();
          var horas = duracionServicio.split(":");

          inicio = new Date((new Date(date)).toUTCString().split(' GMT')[0]);
          final = new moment(inicio);
          final = final.add(horas[0], 'h').add(horas[1], 'm');
          final = new Date(final);

          var mensaje = '';
          if ( validaEvento(inicio, final)) {
            var validacionAgenda =  validaAgenda(inicio, final);
            if ( validacionAgenda == 1 ) {
              $('#divCalendario').fullCalendar('removeEvents');
              $('#divCalendario').fullCalendar('refetchEvents');
                eventData = {
                    title:   $('#servicio_id option:selected').text(),
                    start: date ,
                    end: new moment(date).add(horas[0], 'h').add(horas[1], 'm'),
                    color : '#FFBF00',
                    textColor: '#000',
                    overlap: false,
                    durationEditable: false,
                    editable: false
                };

                $('#divCalendario').fullCalendar('renderEvent', eventData, true);
                $('#divCalendario').fullCalendar('unselect');

            //} else  if ( validacionAgenda == 2 ) {
            //  alert('No puede generar una cita con fecha anterior a la actual !');
            } else  if ( validacionAgenda == 3 ) {
              mensaje = 'Horario cancelado por el médico !';
            } else  if ( validacionAgenda == 4 ) {
              mensaje = 'El horario seleccionado interfiere con el horario de otra Cita';
            } else  if ( validacionAgenda == 5 ) {
              mensaje = 'No puede generar dos citas el mismo dia !';
            }
          }
          /*else {
            mensaje = 'La cita excede el tiempo disponible del médico !';
          }*/
          if (mensaje != ""){
             bootbox.alert({
               backdrop: false,
               closeButton: false,
               onEscape: function () {
                   bootbox.hideAll();
               },
               message: mensaje,
               className: 'Intermed-Bootbox',
               title: '<span class="title">Mensaje de Intermed</span>'
             });
          }
        },
        eventClick: function (event, jsEvent, view) {
          if ((event.id != null && event.id.substring(0,4) != 'cita' && (event.title != 'Cancelada' && event.title != 'No disponible')) || (event.id == null))
          {
            $('#divCalendario').fullCalendar('removeEvents');
            $('#divCalendario').fullCalendar('refetchEvents');
          }
        },
        eventMouseover: function (event, jsEvent, view) {
          if ((event.id != null && event.id.substring(0,4) != 'cita' && (event.title != 'Cancelada' && event.title != 'No disponible')) || (event.id== null)) {
            $(this).append('<span id=\"' + event._id + '\">Clic para eliminar</span>');
          }
        },
        eventMouseout: function (event, jsEvent, view) {
          if (event.id != null && event.id.substring(0,4) != 'cita' && (event.title != 'Cancelada' && event.title != 'No disponible')) {
            $('#' + event._id).remove();
          } else if (event.id == null){
            $('#' + event._id).remove();
          }
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
          revertFunc();
        }
    });
}
var cita = null;


function validaAgenda(inicio, fin) {
  var h = $('#divCalendario').fullCalendar('clientEvents');
  var evento;
  var valido = 1;
  var fecha  =  formatearFecha(new Date());

  inicio = formatearFecha(inicio);
  fin = formatearFecha(fin);

  if  ( inicio < fecha )
  {
    valido  = 2;
  }
  else
  {
      for (i = 0; i <= h.length-1; i++) {
          evento = h[i];
          if (evento.rendering != 'background' && evento.id){
            var inicioEvento = formatearFecha(formatearTimestampAgenda(evento.start));
            var finEvento = formatearFecha(formatearTimestampAgenda(evento.end));

            //Citas propias
            if (evento.title == "Cita"){
              var inicioEvento = formatearFecha(formatearTimestampAgenda(evento.start));;
              if  (inicioEvento.split(' ')[0] == inicio.split(' ')[0])
              {
                  valido = 5;
                  break;
              }
            //Citas de otras personas o canceladas
            } else if ((inicio >= inicioEvento && inicio <= finEvento) || (fin >= inicioEvento && fin <= finEvento))
            {
              //Cita cancelada
              if (evento.title == "Cancelada"){
                //Cancelada
                valido = 3;
                break;
              } else {
                //Horario ocupado por otro paciente
                valido = 4;
                break;
              }
            }
          }
      };
  }
  return valido;
}

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

function validaEvento(inicioEvento, finEvento) {
  var h = $('#divCalendario').fullCalendar('clientEvents');
  var evento;
  var valido = false;

  var inicio = formatearFecha(new Date(inicioEvento));
  var fin = formatearFecha(new Date(finEvento));
  for (i = 0; i <= h.length-1; i++) {
      evento = h[i];
      if (evento.rendering == 'background')
      {
          var inicioEvento = formatearFecha(formatearTimestampAgenda(evento.start));
          var finEvento = formatearFecha(formatearTimestampAgenda(evento.end));
          if (inicio >= inicioEvento && fin <= finEvento)
          {
            valido = true;
            break;
          }
      }
  };

  return valido;
}

function obtenerHorarios() {
    var objhorarios = [];
    var h = $('#divCalendario').fullCalendar('clientEvents');
    var evento;
    var i;
    var inicio = new moment();
    var fin = new moment();
    var fecha;

    objhorarios = [];
    for (i = 0; i <= h.length-1; i++) {
        evento = h[i];

        if (evento.rendering != 'background')
        {
          if  (evento.id == undefined )
          {
              inicio.hours(evento.start._d.getUTCHours());
              inicio.minute(evento.start._d.getUTCMinutes());
              //inicio.days(evento.start._d.getUTCMinutes());

              fin.hours(evento.end._d.getUTCHours());
              fin.minute(evento.end._d.getUTCMinutes());

              fin = fin.subtract(6, 'hours');
              inicio = inicio.subtract(6, 'hours');

              var horario = {
                  inicio: evento.start.format('YYYY-M-D') + " "  + inicio.format('HH:mm'),
                  fin: evento.end.format('YYYY-M-D') + " "  + fin.format('HH:mm'),
              };
              objhorarios.push(horario);

              console.log('horarios' +   evento.start)
          }
        }
    };
    return objhorarios;
};

function cancelaCita(id) {
  $.ajax( {
    url: '/cancelaCita',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      id: id,
      usuario_id: $('#usuarioPerfil').val(),
    },
    success: function ( data ) {
      if  ( data.err != null){
        alert(data.error.message);
        return false;
      } else {
        $('#divCalendario').fullCalendar('removeEvents');
        $('#divCalendario').fullCalendar('refetchEvents');
        return true;
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
      return false;
    }
  });
}


  function generarCalendarioMedico()
  {
    var valido = true;
    var duracionServicio = '02:00';
    var precioServicio = 0;
    var horariosDireccion = 0;
    var horariosMedico = 0;

    $('#divCalendario').fullCalendar({
        firstDay:1,
        defaultView: 'agendaWeek',
        height: 350,
        allDaySlot: false,
        defaultDate: moment().format("YYYY-MM-DD"),
        slotLabelFormat: 'h:mm a',
        businessHours: true,
        slotLabelInterval : duracionServicio.substring(0, 5),
        /*businessHours: {
              start: '06:00',
              end: '22:59',
              dow: [ 1, 2, 3, 4, 5, 6, 7 ]
        },*/
        slotDuration: '00:30',
        //columnFormat: 'dddd',
        header: {
            //center: false,
            //right: false,
            left: false
        },
        events: {
          url: '/agendaMedicoVer'
        },
        minTime: '8:00',
        maxTime: '21:00',
        defaultDate: new Date(),
        lang: 'es',
        selectable: true,
        selectHelper: false,
        displayEventTime: true,
        editable: true,
        eventLimit: true,
        overlap: false,
        slotEventOverlap: false,
        dayClick: function (date, allDay, jsEvent, view) {
//          revertFunc();
          $('#divCalendario').fullCalendar('unselect');
        },
        eventClick: function (event, jsEvent, view) {
          //if (event.id != null && event.id.substring(0,4) != 'cita' && event.title != 'Cancelada') {
          if ($(this).find('span#'+event._id).length>0){
            detalleCitaMedico(event._id);
            /*
            bootbox.confirm({
              message: '¿Esta seguro de cancelar la cita?',
              title: '<span class="title">Mensaje de Intermed</span>',
              className: 'Intermed-Bootbox',
              backdrop: false,
              callback: function(result){
                if (result){
                  if (cancelaCita(event._id))
                  {
                    $('#divCalendario').fullCalendar('removeEvents', event._id);
                    $('#divCalendario').fullCalendar('unselect');
                  }
                }
              },
              buttons: {
                confirm: {
                  label: "Si"
                },
                cancel: {
                  label: "No"
                }
              }
            });*/
          }
          //}
        },
        eventMouseover: function (event, jsEvent, view) {
          var inicio = formatearTimestampAgenda(new Date(event.start));
          var fechaActual = formatearFecha(new Date());
          if (inicio > fechaActual){
            $(this).append('<span id=\"' + event._id + '\">Detalles</span>');
          }
        },
        eventMouseout: function (event, jsEvent, view) {
          if ($('#' + event._id).length>0){
            $('#' + event._id).remove();
          }
        },
        eventMouseout: function (event, jsEvent, view) {
            $('#' + event._id).remove();
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
          revertFunc();
        }
    });
  }

  function generarCalendarioPaciente()
  {
    var valido = true;
    var duracionServicio = '02:00';
    var precioServicio = 0;
    var horariosDireccion = 0;
    var horariosMedico = 0;

    $('#divCalendario').fullCalendar({
        firstDay:1,
        defaultView: 'agendaWeek',
        height: 350,
        allDaySlot: false,
        defaultDate: moment().format("YYYY-MM-DD"),
        slotLabelFormat: 'h:mm a',
        businessHours: true,
        slotLabelInterval : duracionServicio.substring(0, 5),
        /*businessHours: {
              start: '06:00',
              end: '22:59',
              dow: [ 1, 2, 3, 4, 5, 6, 7 ]
        },*/
        slotDuration: '00:30',
        //columnFormat: 'dddd',
        header: {
            //center: false,
            //right: false,
            left: false
        },
        events: {
          url: '/agendaPacienteVer'
        },
        minTime: '8:00',
        maxTime: '21:00',
        defaultDate: new Date(),
        lang: 'es',
        selectable: true,
        selectHelper: false,
        displayEventTime: true,
        editable: true,
        eventLimit: true,
        overlap: false,
        slotEventOverlap: false,
        dayClick: function (date, allDay, jsEvent, view) {
//          revertFunc();
          $('#divCalendario').fullCalendar('unselect');
        },
        eventClick: function (event, jsEvent, view) {
          if ($(this).find('span#'+event._id).length>0){
            detalleCitaPaciente(event._id);/*
            bootbox.confirm({
              message: '¿Esta seguro de cancelar la cita?',
              title: '<span class="title">Mensaje de Intermed</span><span class="subtitle">Subtitulo de prueba</span>',
              className: 'Intermed-Bootbox',
              backdrop: false,
              callback: function(result){
                if (result){
                    if  (cancelaCitaPaciente(event._id))
                    {
                      $('#divCalendario').fullCalendar('removeEvents', event._id);
                      $('#divCalendario').fullCalendar('unselect');
                    }
                }
              },
              buttons: {
                confirm: {
                  label: "Si"
                },
                cancel: {
                  label: "No"
                }
              }
            });*/
          }
        },
        eventMouseover: function (event, jsEvent, view) {
          var inicio = formatearTimestampAgenda(new Date(event.start));
          var fechaActual = formatearFecha(new Date());
          if (inicio > fechaActual){
            $(this).append('<span id=\"' + event._id + '\">Detalles</span>');
          }
        },
        eventMouseout: function (event, jsEvent, view) {
          if ($('#' + event._id).length>0){
            $('#' + event._id).remove();
          }
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
          revertFunc();
        }
    });
  }

  function quitaEventos() {
    var h = $('#divCalendario').fullCalendar('clientEvents');
    var evento;
    for (i = 0; i <= h.length-1; i++) {
        evento = h[i];
        if (evento.rendering != 'background')
        {
           if (evento.id == null || evento.id.substring(0,4) != 'cita')
           {
             $('#divCalendario').fullCalendar('removeEvents', evento._id);
           }
        }
    };
  }

  function obtenerHorarios() {
      var objhorarios = [];
      var h = $('#divCalendario').fullCalendar('clientEvents');
      var evento;
      var i;
      var inicio = new moment();
      var fin = new moment();
      var fecha;

      objhorarios = [];
      for (i = 0; i <= h.length-1; i++) {
          evento = h[i];

          if (evento.rendering != 'background')
          {
            if  (evento.id == undefined )
            {
                inicio.hours(evento.start._d.getUTCHours());
                inicio.minute(evento.start._d.getUTCMinutes());

                fin.hours(evento.end._d.getUTCHours());
                fin.minute(evento.end._d.getUTCMinutes());

                fin = fin.subtract(6, 'hours');
                inicio = inicio.subtract(6, 'hours');

                var horario = {
                    inicio: inicio.format('YYYY-M-D') + " "  + inicio.format('HH:mm'),
                    fin: fin.format('YYYY-M-D') + " "  + fin.format('HH:mm'),
                };
                objhorarios.push(horario);
            }
          }
      };
      return objhorarios;
  };

  function cancelaCita(id) {
    $.ajax( {
      url: '/cancelaCitaMedico',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        id: id,
        usuario_id: $('#medico_id').val(),
      },
      success: function ( data ) {
        if  (data.success){
        cerrarCurrentBootbox();
         bootbox.alert({
           backdrop: false,
           closeButton: false,
           className: 'Intermed-Bootbox',
           message:'La cita ha sido cancelada.',
           title: '<span class="title">Mensaje de Intermed</span>',
           callback: function(){
            $('#divCalendario').fullCalendar('removeEvents');
            $('#divCalendario').fullCalendar('refetchEvents');
             return true;
           }
         });
        } else {
          alert(data.error.message);
          return false;
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
        return false;
      }
    });
  }


  function cancelaCitaPaciente(id) {
    $.ajax( {
      url: '/cancelaCita',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        id: id,
        usuario_id: $('#medico_id').val(),
      },
      success: function ( data ) {
        if  (data.success){
          cerrarCurrentBootbox();
         bootbox.alert({
           backdrop: false,
           closeButton: false,
           onEscape: function () {
               bootbox.hideAll();
           },
           className: 'Intermed-Bootbox',
           message:'La cita ha sido cancelada.',
           title: '<span class="title">Mensaje de Intermed</span>',
           callback: function(){
            $('#divCalendario').fullCalendar('removeEvents');
            $('#divCalendario').fullCalendar('refetchEvents');
             return true;
           }
         });
        } else {
          alert(data.error.message);
          return false;
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
        return false;
      }
    });
  }

  function obtenerHorariosCita() {
      var objhorarios = [];
      var h = $('#divCalendario').fullCalendar('clientEvents');
      var evento;
      var i;
      var inicio = new moment();
      var fin = new moment();
      var fecha;

      objhorarios = [];
      for (i = 0; i <= h.length-1; i++) {
          evento = h[i];

          if (evento.rendering != 'background')
          {
            if  (evento.id == undefined )
            {
                inicio.hours(evento.start._d.getUTCHours());
                inicio.minute(evento.start._d.getUTCMinutes());
                //inicio.days(evento.start._d.getUTCMinutes());

                fin.hours(evento.end._d.getUTCHours());
                fin.minute(evento.end._d.getUTCMinutes());

                fin = fin.subtract(6, 'hours');
                inicio = inicio.subtract(6, 'hours');

                var horario = {
                    inicio: evento.start.format('YYYY-M-D') + " "  + inicio.format('HH:mm'),
                    fin: evento.end.format('YYYY-M-D') + " "  + fin.format('HH:mm'),
                };
                objhorarios.push(horario);

                console.log('horarios' +   evento.start)
            }
          }
      };

      return objhorarios;
  };


function cancelarCitaPorMedico(eventid){
  bootbox.confirm({
    message: '¿Esta seguro de cancelar la cita?',
    title: '<span class="title">Mensaje de Intermed</span>',
    className: 'Intermed-Bootbox',
    size: 'small',
    backdrop: false,
    callback: function(result){
      if (result){
        if (cancelaCita(eventid))
        {
          $('#divCalendario').fullCalendar('removeEvents', eventid);
          $('#divCalendario').fullCalendar('unselect');
          return true;
        }
      }
    },
    buttons: {
      confirm: {
        label: "Si"
      },
      cancel: {
        label: "No"
      }
    }
  });
}


function cancelarCitaPorPaciente(eventid){
  bootbox.confirm({
    message: '¿Esta seguro de cancelar la cita?',
    title: '<span class="title">Mensaje de Intermed</span>',
    className: 'Intermed-Bootbox',
    size: 'small',
    backdrop: false,
    callback: function(result){
      if (result){
        if (cancelaCitaPaciente(eventid))
        {
          $('#divCalendario').fullCalendar('removeEvents', eventid);
          $('#divCalendario').fullCalendar('unselect');
          return true;
        }
      }
    },
    buttons: {
      confirm: {
        label: "Si"
      },
      cancel: {
        label: "No"
      }
    }
  });
}

function calendarSeleccionarTodo(){
  calendarSeleccionarNada();
  var d = new Date(formatearTimestampAgenda($('#divCalendario').fullCalendar('getView').start));

  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();

  for (var i = 0; i < 6; i++) {
    var dateStart = new Date(year, month, day+i, 7, 0, 0, 0);
    var dateEnd = new Date(year, month, day+i, 21, 0, 0, 0);
    eventData = {
      "start":dateStart.toLocaleString(),
      "end":dateEnd.toLocaleString()
    }
    $('#divCalendario').fullCalendar('renderEvent', eventData, true);
  }
}

function calendarSeleccionarNada(){
  var calendario = $('#divCalendario').fullCalendar('removeEvents');
}

function calendarHorarioOficina(){
    calendarSeleccionarNada();
    var d = new Date(formatearTimestampAgenda($('#divCalendario').fullCalendar('getView').start));

    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    for (var i = 0; i < 6; i++) {
      var dateStart = new Date(year, month, day+i, 9, 0, 0, 0);
      var dateEnd = new Date(year, month, day+i, 14, 0, 0, 0);
      eventData = {
        "start":dateStart.toLocaleString(),
        "end":dateEnd.toLocaleString()
      }
      $('#divCalendario').fullCalendar('renderEvent', eventData, true);

      if (i<5){
        var dateStart = new Date(year, month, day+i, 16, 0, 0, 0);
        var dateEnd = new Date(year, month, day+i, 19, 0, 0, 0);
        eventData = {
          "start":dateStart.toLocaleString(),
          "end":dateEnd.toLocaleString()
        }
        $('#divCalendario').fullCalendar('renderEvent', eventData, true);
      }
    }
}
