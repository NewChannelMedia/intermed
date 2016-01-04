var eventos = [];
var fechaInicio = '2015-11-02';

$(document).ready(function () {
  if ($('#horariosUbi').length>0){

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
        maxTime: '19:00',
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


function obtenerHorariosAgenda() {
    var objhorarios = [];
    var h = $('#divCalendario').fullCalendar('clientEvents');
    var evento;
    var i;
    var inicio = new moment();
    var fin = new moment();

    objhorarios = [];
    for (i = 0; i <= h.length - 1; i++) {
        evento = h[i];

        inicio.hours(evento.start._d.getUTCHours());
        inicio.minute(evento.start._d.getUTCMinutes());

        fin.hours(evento.end._d.getUTCHours());
        fin.minute(evento.end._d.getUTCMinutes());

        var horario = {
            direccion_id: $('#idDireccion').val(),
            dia: evento.start._d.getDay(),
            horaInicio: inicio.format('HH:mm'),
            horaFin: fin.format('HH:mm')
        };

        objhorarios.push(horario);
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
      maxTime: '19:00',
      lang: 'es',
      //events: eventos,
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


    eventos = JSON.parse(JSON.stringify(eventos));

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
            //left: false
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
          var fecha = new moment(date);
          var fechaInicial = new Date(date)
          var final = fecha.add(horas[0], 'h');
          var final = fecha.add(horas[1], 'm');
          final = new Date(final);

          fecha = new Date(date)
          fecha.setHours(fecha.getHours()  +  6);

          if ( validaEvento(fecha.getTime(), final)) {
            var validacionAgenda =  validaAgenda(fecha, final);
            if ( validacionAgenda == 1 ) {
              $('#divCalendario').fullCalendar('removeEvents');
              $('#divCalendario').fullCalendar('refetchEvents');
                eventData = {
                    title:   $('#servicio_id option:selected').text(),
                    start: date ,
                    end: final, //date.format('DMYYYY') +  " " +  duracion,
                    color : '#578',
                    overlap: false,
                    durationEditable: false,
                    editable: false
                };

                $('#divCalendario').fullCalendar('renderEvent', eventData, true);
                $('#divCalendario').fullCalendar('unselect');

            } else  if ( validacionAgenda == 2 ) {
              alert('No puede generar una cita con fecha anterior a la actual !');
            } else  if ( validacionAgenda == 3 ) {
              alert('Existe una cita con ese horario !');
            } else  if ( validacionAgenda == 4 ) {
                alert('No puede generar dos citas el mismo dia !');
            }
          }
          else {
            alert('La cita excede el tiempo disponible del médico !');
          }
        },
        eventClick: function (event, jsEvent, view) {
          if (event.id != null && event.id.substring(0,4) != 'cita' && (event.title != 'Cancelada' && event.title != 'No disponible'))
          {
              var r = confirm("Esta seguro de cancelar la cita ?");
              if  ( r == true)
              {
                  if  (cancelaCita(event._id))
                  {
                    console.log('cancelando ' + event._id)

                  }
              }
          } else if (event.id == null){
            var r = confirm("Esta seguro de cancelar la cita ?");
            if  ( r == true)
            {
                if  (cancelaCita(event._id))
                {
                  console.log('cancelando ' + event._id)
                }
            }
          }
        },
        eventMouseover: function (event, jsEvent, view) {
          if (event.id != null && event.id.substring(0,4) != 'cita' && (event.title != 'Cancelada' && event.title != 'No disponible')) {
            $(this).append('<span id=\"' + event._id + '\">Clic para eliminar</span>');
          } else if(event.id== null) {
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


function validaAgenda(inicioEvento, finEvento) {
  var h = $('#divCalendario').fullCalendar('clientEvents');
  var evento;
  var valido = 1;
  var fecha  =  new Date();

  if  ( inicioEvento < fecha )
  {
    valido  = 2;
  }
  else
  {
      for (i = 0; i <= h.length-1; i++) {
          evento = h[i];
          // Citas de otros pacientes
          if ((evento.rendering != 'background') && evento.id &&  (evento.id.substring(0,4) == 'cita'))
          {
              if ( !((inicioEvento < evento.start ) &&  ( finEvento <= evento.start )) || (inicioEvento >= evento.end ) )
              {
                valido = 3;
                break;
              }
          }

          // Citas del mismo paciente
          if ((evento.rendering != 'background') && evento.id && (evento.id.substring(0,4) != 'cita')  &&  (evento.title != 'Cancelada'))
          {
            var fechaEv =  new Date(evento.start);
            if  (  fechaEv.getDay() == inicioEvento.getDay())
            {
                valido = 4;
                break;
            }
          }
      };
  }
  return valido;
}

function validaEvento(inicioEvento, finEvento) {
  var h = $('#divCalendario').fullCalendar('clientEvents');
  var evento;
  var valido = false;

console.log(new Date(inicioEvento) + ' - ' + new Date(finEvento));
  for (i = 0; i <= h.length-1; i++) {
      evento = h[i];
      if (evento.rendering == 'background')
      {
          console.log('INICIO MAYO A START '+ (new Date(inicioEvento)) +' - ' + (new Date(evento.start))+ ':::'+ (new Date(inicioEvento) >= new Date(evento.start)));
          if ((new Date(inicioEvento) >= new Date(evento.start)) && (new Date(finEvento) <= new Date(evento.end)))
          {
            console.log('valido');
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
            center: false,
            right: false,
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
          var r = confirm("Esta seguro de cancelar la cita ?");
          if  ( r == true)
          {
              if  (cancelaCita(event._id))
              {
                $('#divCalendario').fullCalendar('removeEvents', event._id);
                $('#divCalendario').fullCalendar('unselect');
              }
          }
          //}
        },
        eventMouseover: function (event, jsEvent, view) {
          //if (event.id != null && event.id.substring(0,4) != 'cita' && event.title != 'Cancelada') {
            $(this).append('<span id=\"' + event._id + '\">Clic para cancelar</span>');
          //}
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
            center: false,
            right: false,
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
          //if (event.id != null && event.id.substring(0,4) != 'cita' && event.title != 'Cancelada') {
          var r = confirm("Esta seguro de cancelar la cita ?");
          if  ( r == true)
          {
              if  (cancelaCitaPaciente(event._id))
              {
                $('#divCalendario').fullCalendar('removeEvents', event._id);
                $('#divCalendario').fullCalendar('unselect');
              }
          }
          //}
        },
        eventMouseover: function (event, jsEvent, view) {
          //if (event.id != null && event.id.substring(0,4) != 'cita' && event.title != 'Cancelada') {
            $(this).append('<span id=\"' + event._id + '\">Clic para cancelar</span>');
          //}
        },
        eventMouseout: function (event, jsEvent, view) {
            $('#' + event._id).remove();
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
         bootbox.alert({
           backdrop: false,
           closeButton: false,
           onEscape: function () {
               bootbox.hideAll();
           },
           message:'La cita ha sido cancelada.',
           title: 'Mensaje de Intermed',
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
         bootbox.alert({
           backdrop: false,
           closeButton: false,
           onEscape: function () {
               bootbox.hideAll();
           },
           message:'La cita ha sido cancelada.',
           title: 'Mensaje de Intermed',
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
