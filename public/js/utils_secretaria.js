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
  alert('Eliminar medico: ' + medico_id);
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
