function cambiarSeleccionado(element){
  $('ul.admin-nav li').removeClass('active');
  $(element).parent().addClass('active');
  $('.page-header').text($(element).find('.title').text());
  $('#pageAdminContent').html('');
}

$(document).ready(function(){
  $('ul.admin-nav>li>a').first().click();

  if ($('#controlPanelAdmin').length>0){
    contarPV();
    //contarM();
    //contarN();
  }
});

function contarPV(){
  	$.ajax({
  		url: '/control/PV/count',
  		type: 'POST',
  		dataType: "json",
  		cache: false,
  		type: 'POST',
  		success: function( data ) {
        if (data.success){
          if (data.count>0){
            $('#badgePV').text(data.count);
          } else {
            $('#badgePV').text('');
          }
        } else if (data.error){
          manejadorDeErrores(data.error);
        }
  		},
  		error: function( jqXHR, textStatus, err ) {
  			console.error( 'AJAX ERROR: (registro 166) : ' + err );
  		}
  	});
}

function cargarPV(){
  	$.ajax({
  		url: '/control/PV/get',
  		type: 'POST',
  		dataType: "json",
  		cache: false,
  		type: 'POST',
  		success: function( data ) {
        if (data.success){
          if (data.result){
            var contenido = '<div class="list-group">';
            data.result[1].forEach(function(res){
              if (res.DatosGenerale.apellidoM && res.DatosGenerale.apellidoM != ""){
                res.DatosGenerale.apellidoM = ' ' +res.DatosGenerale.apellidoM;
              } else {
                res.DatosGenerale.apellidoM = '';
              }
              var nombreCompleto = res.DatosGenerale.nombre  + ' ' + res.DatosGenerale.apellidoP + res.DatosGenerale.apellidoM;
              contenido += '<div class="media list-group-item alert-danger">'+
                  '<a class="media-left">'+
                    '<img class="media-object img-object" src="'+ res.urlFotoPerfil +'" alt="Generic placeholder image">'+
                  '</a>'+
                  '<div class="media-body text-left">'+
                    '<p><h4 class="media-heading">Dr. '+nombreCompleto+'</h4></p>'+
                    '<p><b>CURP: </b>'+ res.Medico.curp +'<br/>'+
                    '<b>CEDULA: </b>'+ res.Medico.cedula +'</p>'+
                  '</div>'+

                  '<a class="media-right" href="#">'+
                      '<button class="btn btn-success btn-block" onclick="validarCedula('+res.id+')"><span class="glyphicon glyphicon-ok"></span></button>'+
                      '<button class="btn btn-danger btn-block" onclick="rechazarCedula('+res.id+')"><span class="glyphicon glyphicon-remove"></span></button>'+
                  '</a>'+
                '</div>';
            });
            data.result[0].forEach(function(res){
              if (res.DatosGenerale.apellidoM && res.DatosGenerale.apellidoM != ""){
                res.DatosGenerale.apellidoM = ' ' +res.DatosGenerale.apellidoM;
              } else {
                res.DatosGenerale.apellidoM = '';
              }
              var nombreCompleto = res.DatosGenerale.nombre  + ' ' + res.DatosGenerale.apellidoP + res.DatosGenerale.apellidoM;
              contenido += '<div class="media list-group-item">'+
                  '<a class="media-left">'+
                    '<img class="media-object img-object" src="'+ res.urlFotoPerfil +'" alt="Generic placeholder image">'+
                  '</a>'+
                  '<div class="media-body text-left">'+
                    '<p><h4 class="media-heading">Dr. '+nombreCompleto+'</h4></p>'+
                    '<p><b>CURP: </b>'+ res.Medico.curp +'<br/>'+
                    '<b>CEDULA: </b>'+ res.Medico.cedula +'</p>'+
                  '</div>'+

                  '<a class="media-right" href="#">'+
                      '<button class="btn btn-success btn-block" onclick="validarCedula('+res.id+')"><span class="glyphicon glyphicon-ok"></span></button>'+
                      '<button class="btn btn-danger btn-block" onclick="rechazarCedula('+res.id+')"><span class="glyphicon glyphicon-remove"></span></button>'+
                  '</a>'+
                '</div>';
            });
            contenido += '</div>';
            $('#pageAdminContent').html(contenido);
          }
        } else if (data.error){
          manejadorDeErrores(data.error);
        }
  		},
  		error: function( jqXHR, textStatus, err ) {
  			console.error( 'AJAX ERROR: (registro 166) : ' + err );
  		}
  	});
}

function validarCedula(usuario_id){
    	$.ajax({
    		url: '/control/PV/update',
    		type: 'POST',
    		dataType: "json",
    		cache: false,
        data:{
          usuario_id: usuario_id,
          status: 1
        },
    		type: 'POST',
    		success: function( data ) {
          if (data.success){
            contarPV();
            cargarPV();
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
}

function rechazarCedula(usuario_id){
    	$.ajax({
    		url: '/control/PV/update',
    		type: 'POST',
    		dataType: "json",
    		cache: false,
        data:{
          usuario_id: usuario_id,
          status: 3
        },
    		type: 'POST',
    		success: function( data ) {
          if (data.success){
            contarPV();
            cargarPV();
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
}
