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
// Eventos de generales
$("#saveMail").click(function(){
  // este evento actualizara el correo
  var mail = $("#mailMedic").val();
  var expreg = new RegExp(/^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm);
  var comprobar = expreg.test(mail)? true: false;
  if( mail != '' ){
    if( comprobar ){
      bootbox.dialog({
        className: 'Intermed-Bootbox',
        title:'<span class="title">Confirmar con tu correo</span><span class="subtitle">Para realizar esta acción ocupamos que confirmes con tu contraseña</span>',
        buttons:{
          confirmar:{
            label:'Confirmar',
            className:'btn-danger',
            callback: function(){
              var email = $("#bootConfirm").val();
              //consulta a la db para checar que la consulta sea la misma
              $.post('/consultaInfo',{mail:email}, function(data){
                if(data){
                  // si entro aqui el correo esta bien y se actualizara en la base de datos
                  $.post('/changeMail',{correo:mail},function(data){
                    if(data ){
                      $("#mailMedic").val('');
                      $("#mensaje").removeClass('hidden');
                      $("#texto").text('Su correo '+mail+' fue cambiado con exito');
                      $("#getMail").text(mail);
                    }else{
                      $("#mailMedic").val('');
                      $("#mensaje").removeClass('hidden');
                      $("#texto").text('Su correo '+mail+' no se pudo cambiar, ya existe uno igual');
                    }
                  });
                }else{
                  console.log("No");
                }
              });
            },
          },
          cancel:{
            label:'Cancelar',
            className:'btn-default',
            callback: function(){
              bootbox.hideAll();
            }
          }
        },
        message:
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<span class="label label-info">Confirmar con tu contraseña</span>'+
              '<input type="password" class="form-control" id="bootConfirm" />'+
            '</div>'+
            '<div class="col-md-12">'+
              '¿Olvidaste tu contraseña?<a href="#" onclick="updatePasswordIntermed();" style="color:green;">'+
                'Cambiala aquí'+
              '</a>'+
            '</div>'+
          '</div>'+
        '</div>'
      });
    }else{
      bootbox.dialog({
        className: 'Intermed-Bootbox',
        title:'<span class="title">Confirmar con tu correo</span><span class="subtitle">Para realizar esta acción ocupamos que confirmes con tu contraseña</span>',
        buttons:{
          ok:{
            label:'Ok',
            className:'btn-warning',
            callback: function(){
              bootbox.hideAll();
            }
          }
        },
        message:
          '<div class="container-fluid">'+
            '<div class="row">'+
              '<div class="col-md-12">'+
                '<span class="label label-info">el correo que ingreso no es correcto\nRevise que no contenga lo siguiente:\nespacios en blanco al principio ni al final</span>'+
              '</div>'+
            '</div>'+
          '</div>'
      });
    }
  }else{
    bootbox.dialog({
        className: 'Intermed-Bootbox',
        title:'<span class="title">Revisa los campos</span><span class="subtitle">Hubo un error por favor revisa</span>',
        buttons:{
          ok:{
            label:'Ok',
            className:'btn-warning',
            callback: function(){
              bootbox.hideAll();
            }
          }
        },
        message:
          '<div class="container-fluid">'+
            '<div class="row">'+
              '<div class="col-md-12">'+
                '<span class="label label-info">El campo mail no puede estar vacio</span>'+
              '</div>'+
            '</div>'+
          '</div>'
    });
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
                    Msg='Url personal invalida.';
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
        Msg = 'La contraseña debe de tener por lo menos 6 caracteres';
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
