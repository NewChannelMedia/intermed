var eventos = [];
var fechaInicio = '2015-11-02';

$(document).ready(function () {
    var valido = true;
    var eventos = JSON.parse($('#horariosUbi').val());
    console.log(eventos);

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
        defaultDate: fechaInicio,
        events: eventos,
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

    })
});




function obtenerHorarios() {
    var objhorarios = [];
    var h = $('#calendar').fullCalendar('clientEvents');
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

        console.log($('#direccion_id').val());

        var horario = {
            direccion_id: $('#direccion_id').val(),
            dia: evento.start._d.getDay(),
            horaInicio: inicio.format('HH:mm'),
            horaFin: fin.format('HH:mm')
        };

        objhorarios.push(horario);
    };
    return objhorarios;
};
