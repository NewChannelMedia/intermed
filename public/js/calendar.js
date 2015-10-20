var objhorarios = [];

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
        select: function (start, end) {
            var title = $('#nombreUbi').val();
            var eventData;

            if (start.format('DMYYYY') != end.format('DMYYYY')) {
                alert('fechas distintas');
                valido = false;
            } else {
                valido = true;
            };

            if (title && valido == true) {
                eventData = {
                    title: title,
                    start: start,
                    end: end
                };

                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                var horario = {
                    dia: start.format('d'),
                    inicio: start.format('HH:mm'),
                    fin: end.format('HH:mm')
                };
                objhorarios.push(horario);               
            }
            $('#calendar').fullCalendar('unselect');

        },
        editable: true,
        eventLimit: true
    })

    //al cambiar de tab mostrar el calendario la usar bootstrap
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('#calendar').fullCalendar('render');
    });
    $('#tabControl a:first').tab('show');
});