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
  if ($('#DashboarSecretaria').length>0){
    var medicos = [];
    $('.dia1>.heading').text(getDate());
    $('.dia2>.heading').text(getDate(1));
    $('.dia3>.heading').text(getDate(2));
    $('.MedicoSecretaria').each(function(){
      $(this).find('.panel-body').html(`<ul class="list-group" style="margin-bottom: 0px">
        <li class="list-group-item"><strong>9:00 am</strong><br>Nombre paciente<br>Ubicación<br>Servicio</li>
        <li class="list-group-item"><strong>9:00 am</strong><br>Nombre paciente<br>Ubicación<br>Servicio</li>
        <li class="list-group-item"><strong>9:00 am</strong><br>Nombre paciente<br>Ubicación<br>Servicio</li>
        <li class="list-group-item"><strong>9:00 am</strong><br>Nombre paciente<br>Ubicación<br>Servicio</li>
        <li class="list-group-item"><strong>9:00 am</strong><br>Nombre paciente<br>Ubicación<br>Servicio</li>
      </ul>`);
      medicos.push($(this).attr('id').split('_')[1]);
    });
  }
});

function getDate(numdias, year){
  var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  if (!numdias){
    numdias = 0;
  }
  var today = new Date(new Date().getTime() + (24*numdias) * 60 * 60 * 1000);
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
    today = yyyy+'-'+mm+'/'+yyyy;
  } else {
    today = dd+'/'+meses[mm];
  }

  return today
}
