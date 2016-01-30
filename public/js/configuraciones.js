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
  var url = $("#urlMedic").val();
  if( url != '' ){
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
                // se envia a que se guarde este campo
                $.post('/saveUrl',{url:url},function(data){
                  if(data){
                    $("#urlMedic").val('');
                    $("#mensaje").removeClass('hidden');
                    $("#texto").text('Su url '+url+' fue cambiado con exito');
                    $("#getUrl").text(url);
                  }else{
                    $("#urlMedic").val('');
                    $("#mensaje").removeClass('hidden');
                    $("#texto").text('Su url '+mail+' no se pudo cambiar');
                  }
                });
              }else{
                console.log("No");
              }
            });
          }
        },
        cancel:{
          label:'Cancelar',
          className:'btn-default',
          callback: function(){bootbox.hideAll();}
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
                '<span class="label label-info">Campo vacio</span>'+
              '</div>'+
            '</div>'+
          '</div>'
    });
  }
});
$("#confirMedicPas").click(function(){
  var pass = $("#passMedic").val();
  var confirmPass = $("#confiMedic").val();
  if( pass != '' && confirmPass != '' ){
    if( pass === confirmPass ){
      if( (pass.length > 0 && pass.length >= 6) && (confirmPass.length > 0 && confirmPass.length >= 6) ){
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
                    // consulta para modificar los campos
                    $.post('/changePass',{password:pass},function(data){
                      if(data){
                        $("#passMedic").val('');
                        $("#confiMedic").val('');
                        $("#mensaje").removeClass('hidden');
                        $("#texto").text('Su contraseña fue cambiado con exito');
                      }else{
                        $("#passMedic").val('');
                        $("#confiMedic").val('');
                        $("#mensaje").removeClass('hidden');
                        $("#texto").text('Su contraseña no se pudo cambiar');
                      }
                    });
                  }else{
                    console.log("No");
                  }
                });
              }
            },
            cancel:{
              label:'Cancelar',
              className:'btn-default',
              callback: function(){bootbox.hideAll();}
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
                    '<span class="label label-info">Los campos deben de tener mas de 6 caracteres</span>'+
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
                  '<span class="label label-info">Los campos deben de coincidir</span>'+
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
                '<span class="label label-info">Los campos no pueden estar vacios</span>'+
              '</div>'+
            '</div>'+
          '</div>'
    });
  }
});
