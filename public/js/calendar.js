$(document).ready(function () {


    var valido = true;

    // page is now ready, initialize the calendar...

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
        //    start: '6:00',
        //    end: '19:00',
        //    dow: [0, 1, 2, 3, 4, 5, 6]
        //},
        minTime: '8:00',
        maxTime: '19:00',
        //defaultDate: '2015-02-12',
        lang: 'es',
        selectable: true,
        selectHelper: true,
        displayEventTime: false,
        select: function (start, end) {
            var eventData;
            console.log(start.format('DMYYYY'));
            console.log(end.format('DMYYYY'));
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
            $('#calendar').fullCalendar('removeEvents', event._id);

        },
        //eventMouseover: function (event, jsEvent, view) {
        //    $(this).append('<span id=\"' + event._id + '\">Clic para eliminar</span>');

        //},
        //eventMouseout: function (event, jsEvent, view) {
        //    $('#' + event._id).remove();
        //},
        //eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
        //    console.log(jsEvent.target.id);
        //}

        eventMouseover: function (event, jsEvent, view) {
            $(this).append('<img src="img/eliminar.png" id=\"' + event.id  + '\"/>');

        },
        eventMouseout: function (event, jsEvent, view) {
            $('#' + event.id).remove();
        }
    })

    //al cambiar de tab mostrar el calendario la usar bootstrap
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('#calendar').fullCalendar('render');
    });
    $('#tabControl a:first').tab('show');
});

function obtenerHorarios() {
    var objhorarios = [];
    var h = $('#calendar').fullCalendar('clientEvents');
    var evento;
    var i;
    var inicio = new moment();
    var fin = new moment();

    objhorarios = [];
    for (i = 0; i <= h.length-1; i++) {
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