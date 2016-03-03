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
