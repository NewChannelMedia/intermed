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
                      $("#mensaje").removeClass('hidden');
                      $("#texto").text('Su correo '+mail+' fue cambiado con exito');
                    }else{
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
          '</div>'+
        '</div>'
      });
    }else{
      bootbox.alert('el correo que ingreso no es correcto\nRevise que no contenga lo siguiente:\nespacios en blanco al principio ni al final',
      function(e){
      });
    }
  }else{
    bootbox.alert('El campo mail no puede estar vacio', function(){});
  }
});
$("#saveUrl").click(function(){
  var url = $("#urlMedic").val();
  if( url != '' ){
    // se envia a que se guarde este campo
    $.post('/saveUrl',{url:url},function(data){
      if(data){
        $("#mensaje").removeClass('hidden');
        $("#texto").text('Su url '+url+' fue cambiado con exito');
      }else{
        $("#mensaje").removeClass('hidden');
        $("#texto").text('Su url '+mail+' no se pudo cambiar');
      }
    });
  }else{
    bootbox.alert("Campo vacio", function(){});
  }
});
$("#confirMedicPas").click(function(){
  var pass = $("#passMedic").val();
  var confirmPass = $("#confiMedic").val();
  if( pass != '' && confirmPass != '' ){
    if( pass === confirmPass ){
      if( (pass.length > 0 && pass.length >= 6) && (confirmPass.length > 0 && confirmPass.length >= 6) ){
        // consulta para modificar los campos
        $.post('/changePass',{password:pass},function(data){
          if(data){
            $("#passMedic").val('');
            $("#mensaje").removeClass('hidden');
            $("#texto").text('Su contraseña fue cambiado con exito');
          }else{
            $("#confiMedic").val('');
            $("#mensaje").removeClass('hidden');
            $("#texto").text('Su contraseña no se pudo cambiar');
          }
        });
      }else{
        bootbox.alert({
          message:'Los campos deben de tener mas de 6 caracteres',
          callback: function(){
            setTimeout(function(){
              if( pass.length == 0 || pass.length < 6 ){
                $("#passMedic").focus();
              }else if( confirmPass.length == 0 && confirmPass.length < 6){
                $("#confiMedic").focus();
              }
            });
          }
        });
      }
    }else{
      bootbox.alert({
        message:"Los campos deben de coincidir",
        callback: function(){
          setTimeout(function(){
            if(pass!=confirmPass){
              $("#passMedic").focus();
            }
          },300);
        }
      });
    }
  }else{
    bootbox.alert({
      message:"Los campos no pueden estar vacios",
      callback: function(){
        setTimeout(function(){
        $("#passMedic").focus();
        },300);
      }
    });
  }
});
