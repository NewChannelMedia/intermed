/**
* Archivo js el cual es para las configuraciones
*
*
*/
// eventos click de las pestañas
function generales(){
  // se trae el correo y url si el url personalizado existe bloquea el input text
  $.post('/getGenerales',function(data){
    $("#getMail").text(data.correo);
    if( data.urlPersonal != null ){
      $("#getUrl").text(data.urlPersonal);
      $("#urlMedic").attr('title','Ya cuenta con un url personalizado');
      $("#urlMedic").val(data.urlPersonal);
      $("#saveUrl").attr('disabled','disabled');
      $("#urlMedic").attr('disabled','disabled');
    }else{
      $("#getUrl").text(data.usuarioUrl);
    }
  });
}
function validarEmail(valor) {
    re=/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/
    if(!re.exec(valor))    {
        return false;
    }else{
        return true;
    }
}

// Eventos de generales
$("#saveMail").click(function(){
  // este evento actualizara el correo
  var mailMedic = $("#mailMedic").val();
  var Msg = '';
  if( mailMedic != '' ){
    if(validarEmail(mailMedic)){
      bootbox.prompt({
        title: "¿Cual es tu contraseña actual?",
        inputType: "password",
        value: "",
        callback: function(result) {
          if (result && result != "") {
            $.post('/config/correo',{
              actual: hex_md5(result),
              correo: mailMedic
            },function(data){
              var Msg = '';
              if (data.success){
                $("#mailMedic").val('');
                actualizarSesion();
                Msg='Correo actualizado.';
              } else if (data.pass){
                  Msg='Contraseña actual incorrecta.';
              } else if (data.exists){
                  Msg='Correo ya existe.';
              }
              if (Msg != ''){
                bootbox.alert({
                  title: "Mensaje de intermed",
                  message: Msg
                });
              }
            });
          }
        }
      });
    }else{
      $("#mailMedic").focus();
      Msg = 'Formato incorrecto de correo';
    }
    if (Msg != ''){
      bootbox.alert({
        title: "Mensaje de intermed",
        message: Msg
      });
    }
  }else{
    $("#mailMedic").focus();
  }
});

$("#saveUrl").click(function(){
    $("#urlMedic").val($("#urlMedic").val().replace(' ',''));
    var urlMedic = $("#urlMedic").val();
    var Msg = '';
    if( urlMedic != '' ){
      if(urlMedic.length >= 6){
        bootbox.prompt({
          title: "¿Cual es tu contraseña actual?",
          inputType: "password",
          value: "",
          callback: function(result) {
            if (result && result != "") {
              $.post('/config/urlmedic',{
                actual: hex_md5(result),
                urlmedic: urlMedic
              },function(data){
                var Msg = '';
                if (data.success){
                  $('#urlPersonal').html('www.intermed.online/'+urlMedic);
                  $('#urlPersonal').next().remove();
                  $('#urlPersonal').next().remove();
                  $("#urlMedic").val('');
                  actualizarSesion();
                  Msg='URL personal agregada.';
                } else if (data.pass){
                    Msg='Contraseña actual incorrecta.';
                } else if (data.invalid){
                    Msg='Url personal invalida.';
                } else if (data.exists){
                    Msg='Url personal ya existe.';
                } else if (data.number){
                    Msg='Url personal invalida (no puede iniciar con número).';
                }
                if (Msg != ''){
                  bootbox.alert({
                    title: "Mensaje de intermed",
                    message: Msg
                  });
                }
              });
            }
          }
        });
      }else{
        Msg = 'La url personal debe de tener por lo menos 6 caracteres';
      }
    }else{
      $("#urlMedic").focus();
    }
    if (Msg != ''){
      bootbox.alert({
        title: "Mensaje de intermed",
        message: Msg
      });
    }
});

$("#confirMedicPas").click(function(){
  var pass = $("#passMedic").val();
  var confirmPass = $("#confiMedic").val();

  var Msg = '';
  if( pass != '' && confirmPass != '' ){
    if( pass === confirmPass ){
      if( (pass.length > 0 && pass.length >= 6) && (confirmPass.length > 0 && confirmPass.length >= 6) ){
        bootbox.prompt({
          title: "¿Cual es tu contraseña actual?",
          inputType: "password",
          value: "",
          callback: function(result) {
            if (result && result != "") {
              $.post('/config/pass',{
                actual: hex_md5(result),
                nueva: hex_md5(pass)
              },function(data){
                var Msg = '';
                if (data.success){
                  $("#passMedic").val('');
                  $("#confiMedic").val('');
                  Msg='Contraseña cambiada.';
                } else if (data.pass){
                    Msg='Contraseña actual incorrecta.';
                }
                if (Msg != ''){
                  bootbox.alert({
                    title: "Mensaje de intermed",
                    message: Msg
                  });
                }
              });
            }
          }
        });
      }else{
        Msg = 'La contraseña debe de tener por lo menos 6 caracteres';
      }
    }else{
      Msg = 'La nueva contraseña y la confirmación no coinciden.';
    }
  }else{
    if ($("#passMedic").val() == ""){
      $("#passMedic").focus();
    } else {
      $("#confiMedic").focus();
    }
  }
  if (Msg != ''){
    bootbox.alert({
      title: "Mensaje de intermed",
      message: Msg
    });
  }
});
