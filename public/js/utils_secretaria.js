function registrarSecretaria(){
    try{
        if ($('#passSec').val() === $('#passSec2').val()){
          var nombre = $('#nombreSec').val();
          var paterno = $('#apePSec').val();
          var materno = $('#apeMSec').val();
          var correo = $('#correoSec').text();
          var estado = $('#selectEstados').val();
          var municipio = $('#selectCiudad').val();
          var pass = hex_md5($('#passSec').val());
          var token = $('#tokenSec').text();
          $.post('/secretaria/registrar',{
            token:token,
            nombre: nombre,
            paterno: paterno,
            materno: materno,
            estado: estado,
            municipio: municipio,
            correo: correo,
            pass: pass
          },function( data ){
            if( data.success ){
              window.location.reload();
            }else{
              if (data.error){
                manejadorDeErrores(data.error);
              }
            }
          }).fail(function(e){
            console.error(e);
          });
        } else {
          alert('Contraseñas no coinciden')
        }
        return false;
    } catch (e){
      console.error(e);
      return false;
    }
}

function aceptarInvitacion(medico_id, element){
    $.post('/secretaria/invitacion/aceptar',{
      medico_id:medico_id
    },function( data ){
      if( data.success ){
        if (element){
          //Agregar al médico a lista "Tus doctores"
          var parent = $(element).parent().parent();
          var nombre = $(parent).find('.media-heading').text();
          parent.html('<div class="media-body text-center"><h4 class="media-heading s15"><strong>Haz solicitado la solicitud para administrar al '+ nombre +'</strong></div>');
          parent.addClass('list-group-item-success');
          setTimeout(function(){
            parent.remove();
          }, 5000);
        } else {
          window.location.reload();
        }
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    }).fail(function(e){
      console.error(e);
    });
  }


function rechazarInvitacion(medico_id, element){
    $.post('/secretaria/invitacion/rechazar',{
      medico_id:medico_id
    },function( data ){
      if( data.success ){
        if (element){
          var parent = $(element).parent().parent();
          var nombre = $(parent).find('.media-heading').text();
          parent.html('<div class="media-body text-center"><h4 class="media-heading s15"><strong>Haz rechazado la solicitud para administrar al '+ nombre +'</strong></div>');
          parent.addClass('list-group-item-danger');
          setTimeout(function(){
            parent.remove();
          }, 5000);
        } else {
          window.location.reload();
        }
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    }).fail(function(e){
      console.error(e);
    });
}

function eliminarRelacionMedico(medico_id, element){
  bootbox.confirm({
    title: 'Confirmar eliminación',
    message: "¿Estas seguro de querer eliminar al médico?, ya no podras administrarlo.",
    callback: function(result) {
      if (result) {
        $.post('/secretaria/medico/eliminar',{
        medico_id:medico_id
      },function( data ){
        if( data.success ){
          if (element){
            $(element).parent().parent().remove();
          } else {
            window.location.reload();
          }
        }else{
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      }).fail(function(e){
        console.error(e);
      });
      }
    }
  });
}

$(document).ready(function(){
  cargarCitasProximasSecretaria();
});

function cargarCitasProximasSecretaria(){

    if ($('#dashboardSecretaria').length>0){
      var date = new Date();
      $('#diaSemana').text(dias[date.getDay()]);
      $('#diaFecha').text(date.getDate());
      $('#mesFecha').text(meses[date.getMonth()]);
      $('#anioFecha').text(date.getFullYear());

      if ( $( window ).width() > 768 ) {
        var h = $( window ).height() - $( '#newMainNav' ).height() - $( '.agendaTopContainer' ).height() - 2 - $('footer').height();
        $( '.dashboardBody' ).css( 'height', h + 'px' );
        $( '.dashboardLeft' ).css( 'height', h-2 + 'px' );
        $( '.dashboardRight' ).css( 'height', h + 'px' );
      }
      else if ( $( window ).width() < 767 ) {
        var h = $( window ).height() - $( '#newMainNav' ).height() - 2;
        $( '.dasbboardLeft' ).css( 'height', h - $( '.agendaTopContainer' ).height() + 'px' );
        $( '.dashboardRight' ).css( 'height', h + 'px' );
      }

      $('#dateComa').text(',');
      $('#dateDe').text('de');

      var fechainicio = new Date().toISOString().split('T')[0];
      var utc = (parseInt(new Date().getTimezoneOffset())/60);
      cargarVistaPevCitas(new Date(new Date(fechainicio).setHours(new Date(fechainicio).getHours()+utc)));
    }
}

function cargarVistaPevCitasPrev(){
    var fechainicio = new Date();
    if ($('#dia1').val() && $('#dia1').val() != ""){
      fechainicio = new Date($('#dia1').val());
    }
    fechainicio = new Date(new Date(fechainicio).setDate(fechainicio.getDate()-3));
    cargarVistaPevCitas(fechainicio);
}

function cargarVistaPevCitasNext(){
    var fechainicio = new Date();
    if ($('#dia1').val() && $('#dia1').val() != ""){
      fechainicio = new Date($('#dia1').val());
    }
    fechainicio = new Date(new Date(fechainicio).setDate(fechainicio.getDate()+3));
    cargarVistaPevCitas(fechainicio);
}

function cargarVistaPevCitas(fechainicio){
  $('#dia1').val(fechainicio);

  var medicos = [];
  $('.MedicoSecretaria').each(function(){
    medicos.push($(this).attr('id').split('_')[1]);
  });

  var fechafin = new Date(new Date(fechainicio).setDate(fechainicio.getDate()+3));

  $('.dia1>.heading').text(formatDate(new Date(fechainicio)));
  $('.dia2>.heading').text(formatDate(new Date(fechainicio), 1));
  $('.dia3>.heading').text(formatDate(new Date(fechainicio), 2));

  var dia1 = formatDate(new Date(fechainicio),0,true)
  var dia2 = formatDate(new Date(fechainicio), 1,true);
  var dia3 = formatDate(new Date(fechainicio), 2,true);

  //Traer citas de medicos de proximos 3 dias
  $.post('/secretaria/medicos/traerCitasProximas',{
    medicos:medicos,
    fechainicio: fechainicio,
    fechafin: fechafin
  },function( data ){
    $('.panel-body.contenidoagenda').html('<ul class="list-group" style="margin-bottom: 0px"></ul>');
    if( data.success ){
      var eventos = [];
      data.result2.forEach(function(res){
        var div = 'MedicoSecretaria_'+res.Usuario.Medico.id;

        var date = new Date(res.fechaHoraInicio).toLocaleString('en-US');
        //4/7/2016, 12:00:00 PM
        //mes/dia/año, hora, minutos
        hora = parseInt(date.split(', ')[1].split(':')[0]);
        var minutos = date.split(', ')[1].split(':')[1];

        var horaClase = '';
        horaClase = hora;
        var T = 'AM';
        if (date.search('PM')>0){
          T = 'PM';
          horaClase = hora + 12;
        } else {
          if (hora == 12){
            horaClase = 0;
          }
        }

        hora = hora + ':'+minutos;
        horaClase = horaClase + ':'+minutos;

        //2016-04-05
        var anio = date.split(', ')[0].split('/')[2];
        var mes = date.split(', ')[0].split('/')[0];
        if (mes.length == 1){
          mes = '0'+mes;
        }
        var dia = date.split(', ')[0].split('/')[1];
        if (dia.length == 1){
          dia = '0'+dia;
        }
        fecha = anio  +'-'+ mes +'-'+ dia;

        var dia = 'dia';
        if (fecha == dia1){
          dia += '1';
        } else if (fecha == dia2){
          dia += '2';
        } else if (fecha == dia3){
          dia += '3';
        }
        var nombrePaciente = res.nombre;
        eventos.push({
          div: div,
          dia: dia,
          inicio: parseInt(horaClase.replace(':','')),
          contenido: '<li class="list-group-item eventoMedico" style="background-color:white;cursor:pointer" onclick="detalleEventoMedico('+ res.id +')"><strong>'+ hora +' ' + T +'</strong><br>'+ nombrePaciente + '<br>'+ res.ubicacion +'</li>'
        })
        //$('#'+div + ' .'+dia+' .panel-body ul').append();
      });
      data.result.forEach(function(res){
        var div = 'MedicoSecretaria_'+res.Usuario.Medico.id;

        var date = new Date(res.fechaHoraInicio).toLocaleString('en-US');
        //4/7/2016, 12:00:00 PM
        //mes/dia/año, hora, minutos
        hora = parseInt(date.split(', ')[1].split(':')[0]);
        var minutos = date.split(', ')[1].split(':')[1];

        var horaClase = '';
        var T = 'AM';
        horaClase = hora;
        if (date.search('PM')>0){
          T = 'PM';
          horaClase = hora + 12;
        } else {
          if (hora == 12){
            horaClase = 0;
          }
        }

        hora = hora + ':'+minutos;
        horaClase = horaClase + ':'+minutos;

        //2016-04-05
        var anio = date.split(', ')[0].split('/')[2];
        var mes = date.split(', ')[0].split('/')[0];
        if (mes.length == 1){
          mes = '0'+mes;
        }
        var dia = date.split(', ')[0].split('/')[1];
        if (dia.length == 1){
          dia = '0'+dia;
        }
        fecha = anio  +'-'+ mes +'-'+ dia;



        var dia = 'dia';
        if (fecha == dia1){
          dia += '1';
        } else if (fecha == dia2){
          dia += '2';
        } else if (fecha == dia3){
          dia += '3';
        }
        var nombrePaciente = '';
        if (res.Paciente){
          nombrePaciente = res.Paciente.Usuario.DatosGenerale.nombre + ' ' + res.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + res.Paciente.Usuario.DatosGenerale.apellidoM;
        } else if (res.PacienteTemporal){
          nombrePaciente = res.PacienteTemporal.nombres  + ' ' + res.PacienteTemporal.apellidos;
        }

        eventos.push({
          div: div,
          dia: dia,
          inicio: parseInt(horaClase.replace(':','')),
          contenido: '<li class="list-group-item" style="background-color:white;cursor:pointer" onclick="detalleCitaSecretaria('+ res.id +')"><strong>'+ hora +' ' + T + '</strong><br>'+ nombrePaciente + '<br>'+ res.Direccion.nombre +'<br>'+ res.CatalogoServicio.concepto +'</li>'
        });
      });

      eventos = eventos.sort(function (a,b) {
        if (a['inicio'] > b['inicio']) {
          return  1;
        }
        if (a['inicio'] < b['inicio']){
          return -1;
        } else {
          return 0;
        }
      });

      eventos.forEach(function(ev){
        $('#'+ev.div + ' .'+ev.dia+' .panel-body ul').append(ev.contenido);
      });
    }else{
      if (data.error){
        manejadorDeErrores(data.error);
      }
    }
    $('.panel-body.contenidoagenda ul').each(function(){
      if ($(this).text() == ""){
        $(this).parent().html('<div class="body-container"><div class="center-content text-center" style="padding: 15px;font-weight: bold;color: #DDD;"><span class="s20" >Sin citas agendadas</span></div></div>');
      }
    });
  }).fail(function(e){
    console.error(e);
  });
}

function formatearHora(horasminutos){
  var hora = horasminutos.split(':')[0];//16:30:00.000Z
  var minutos = horasminutos.split(':')[1];

  var m = 'am';
  if (parseInt(hora)>12){
    hora = parseInt(hora)-12;
    m = 'pm'
  }

  return hora + ':'+ minutos + ' ' +m;

}

function formatDate(fecha, numdias, year){
  var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  if (!numdias){
    numdias = 0;
  }
  var today = new Date(fecha.setDate(new Date(fecha).getDate()+numdias));
  var dd = today.getDate();
  var mm = today.getMonth();
  if(dd<10) {
      dd='0'+dd
  }
  if (year){
    mm++; //January is 0!
    var yyyy = today.getFullYear();
    if(mm<10) {
        mm='0'+mm
    }
    today = yyyy+'-'+mm+'-'+dd;
  } else {
    today = dd+'/'+meses[mm];
  }

  return today
}

function guardarNotaSecretaria(agenda_id, input){
  var nota = $('#'+input).val();
  $.post('/agenda/cita/guardarNota',{
    agenda_id:agenda_id,
    nota: nota,
  },function( data ){
    if( data.success ){
      bootbox.hideAll()
    }else{
      if (data.error){
        manejadorDeErrores(data.error);
      }
    }
  }).fail(function(e){
    console.error(e);
  });
}

function guardarDescripcionEventoSecretaria(evento_id, bootbox){
  var nombre = $('#eventoNombre').val();
  var ubicacion = $('#eventoUbicacion').val();
  var descripcion = $('#inputDescripcionEvento').val();
  if (nombre && nombre.replace(' ','') != ""){
    $.post('/agenda/evento/guardarDescripcion',{
      evento_id:evento_id,
      nombre: nombre,
      ubicacion: ubicacion,
      descripcion: descripcion,
    },function( data ){
      if( data.success ){
        cargarCitasProximasSecretaria();
        marcarEventosCalendario();
        if ($('#calendar').length>0){
          var fechaInicio = $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 00:00:00';
          var fechaFin =  $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 23:59:59';
          cargarEventosPorDia(fechaInicio, fechaFin);
        }

        if ($('#divCalendario').length>0){
          $('#divCalendario').fullCalendar('removeEvents');
          $('#divCalendario').fullCalendar('refetchEvents');
        }
        bootbox.hide();
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    }).fail(function(e){
      console.error(e);
    });
  } else {
    alert('Es necesario que indique el nombre del evento');
    $('#eventoNombre')[0].focus();
  }
}

function registrarCitaPacienteTemporal(inicio, fin, medico, servicio_id, paciente_id,kendo){
  try{
    var utc = (parseInt(new Date().getTimezoneOffset())/60);
    if (!paciente_id){
      $('#dangerMsg').addClass('hidden').text('');
      var nombre = $('#nombrePaciente').val();
      var apellido = $('#apellidoPaciente').val();
      var correo = $('#correoPaciente').val();
      var celular = $('#celularPaciente').val();
      if (nombre != "" && apellido != "" && (correo != "" || celular != "")){
        var datos = {
          kendo: kendo,
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          celular: celular,
          inicio: new Date(inicio),
          fin: new Date(fin),
          medico_id: medico,
          servicio_id: servicio_id,
          utc: utc
        }
        $.post('/agenda/crearCita',datos, function(data){
          if (data.success){
            if ($('.horas-container').length>0){
              marcarEventosCalendario();
              $('#agendarCitaOficina').text('AGENDAR');
              $('#agendarCitaOficina').removeClass('agregar');
              $('#agendarCitaOficina').addClass('btn-default');
              $('#agendarCitaOficina').removeClass('btn-danger');
              $('.mediaHora').not('.ocupada').not('.noDisponible').css('cursor','default');
              var fechaInicio = $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 00:00:00';
              var fechaFin =  $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 23:59:59';
              cargarEventosPorDia(fechaInicio, fechaFin);
            }

            if ($('#divCalendario').length>0){
                $('#divCalendario').fullCalendar('removeEvents');
                $('#divCalendario').fullCalendar('refetchEvents');
                activarDesactivarAgregarCita($('#btnAddCita'));
                secondaryBootbox.hide();
            } else {
              bootbox.hideAll();
            }

            cargarCitasProximasSecretaria();
            $('#regPacTemp').remove();
          }
        }).fail(function(e){
          console.error("Post error: "+JSON.stringify(e));
        });
      } else {
        if (nombre == ""){
          $('#dangerMsg').removeClass('hidden').text('Es necesario el nombre del paciente.');
        } else if (apellido == ""){
          $('#dangerMsg').removeClass('hidden').text('Es necesario el apellido del paciente.');
        } else {
          $('#dangerMsg').removeClass('hidden').text('Es necesario el correo o el teléfono del paciente.');
        }
        setTimeout(function(){
          $('#dangerMsg').addClass('hidden').text('');
        },5000);
      }
    } else {
      $.post('/agenda/crearCita',{
        kendo: kendo,
        paciente_id: paciente_id,
        inicio: new Date(inicio),
        fin: new Date(fin),
        medico_id: medico,
        servicio_id: servicio_id,
        utc: utc
      }, function(data){
        if (data.success){
          if ($('.horas-container').length>0){
            marcarEventosCalendario();
            $('#agendarCitaOficina').text('AGENDAR');
            $('#agendarCitaOficina').removeClass('agregar');
            $('#agendarCitaOficina').addClass('btn-default');
            $('#agendarCitaOficina').removeClass('btn-danger');
            $('.mediaHora').not('.ocupada').not('.noDisponible').css('cursor','default');
            var fechaInicio = $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 00:00:00';
            var fechaFin =  $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 23:59:59';
            cargarEventosPorDia(fechaInicio, fechaFin);
          }

          if ($('#divCalendario').length>0){
              $('#divCalendario').fullCalendar('removeEvents');
              $('#divCalendario').fullCalendar('refetchEvents');
              activarDesactivarAgregarCita($('#btnAddCita'));
              secondaryBootbox.hide();
          } else {
            bootbox.hideAll();
          }

          cargarCitasProximasSecretaria();
        }
      }).fail(function(e){
        console.error("Post error: "+JSON.stringify(e));
      });
    }
    return false;
  }catch(e){
    console.log('ERROR: ' + JSON.stringify(e))
    return false;
  }
}

function secretariaCancelaCita(agenda_id, medico){
  var utc = (parseInt(new Date().getTimezoneOffset())/60);
  $.post('/agenda/cita/cancelar',{
      agenda_id: agenda_id,
      medico: medico,
      utc: utc
    }, function(data){
    if (data.success){
      if ($('.horas-container').length>0){
        marcarEventosCalendario();
        var fechaInicio = $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 00:00:00';
        var fechaFin =  $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0] + ' 23:59:59';
        cargarEventosPorDia(fechaInicio, fechaFin);
      }

      if ($('#divCalendario').length>0){
          $('#divCalendario').fullCalendar('removeEvents');
          $('#divCalendario').fullCalendar('refetchEvents');
      }
      cargarCitasProximasSecretaria();
      if (bootSec){
        bootSec.hide();
      } else {
        bootbox.hideAll();
      }
    }
  }).fail(function(e){
    console.error("Post error: "+JSON.stringify(e));
  });
}
