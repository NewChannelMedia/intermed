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
    contarErrores();
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


function contarErrores(){
  	$.ajax({
  		url: '/control/Err/count',
  		type: 'POST',
  		dataType: "json",
  		cache: false,
  		type: 'POST',
  		success: function( data ) {
        if (data.success){
          if (data.count>0){
            $('#badgeErr').text(data.count);
          } else {
            $('#badgeErr').text('');
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

function cargarTipoCodigo(){
	$.ajax({
		url: '/control/enc/tipoCod/load',
		type: 'POST',
		dataType: "json",
		cache: false,
		type: 'POST',
		success: function( data ) {
      if (data.success){
        data.result.forEach(function(res){
          $('#tipo_codigo_id').append('<option value="'+ res.id +'">'+ res.tipo +'</option>')
        });
      }
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
}

function cargarTipoPlan(){
	$.ajax({
		url: '/control/tipoPlan/load',
		type: 'POST',
		dataType: "json",
		cache: false,
		type: 'POST',
		success: function( data ) {
      if (data.success){
        data.result.forEach(function(res){
          $('#tipo_plan_id').append('<option value="'+ res.id +'">'+ res.nombre +'</option>')
        });
      }
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
}

function generarCodigosEnc(){
	$.ajax({
    async: false,
		url: '/control/enc/cod/create',
		type: 'POST',
		dataType: "json",
		cache: false,
		type: 'POST',
    data: {
      tipoCodigo: $('#tipo_codigo_id').val(),
      tipoPlan: $('#tipo_plan_id').val(),
      cantidad: $('#num_cod').val()
    },
		success: function( data ) {
      if (data.success){
        var contenido = '';
        var tipoPlan = $("#tipo_plan_id option:selected").text();
        var tipoCodigo = $("#tipo_codigo_id option:selected").text();

        $("#tipo_plan_id").val("");
        $("#tipo_codigo_id").val("");
        $("#num_cod").val("");

        data.result.forEach(function(res){
          contenido += '<tr class="text-left"><td>'+ tipoCodigo +' ('+res.tipoCodigo+')</td><td>'+ tipoPlan +' ('+res.tipoPlan+')</td><td>'+res.codigo+'</td></tr>';
        });
        $('#createCodeResult').html(contenido);
        $('#tableExportCodeResult').table2excel({
          filename: "Intermed_Cod-"+tipoCodigo+"-"+tipoPlan
        });
      }
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
  return false;
}

function cargarGenC(){
  var contenido = '<form id="frm_genCod" method="post" onsubmit="return generarCodigosEnc();">'+
    '<div class="row" style="margin-top: 40px;">'+
      '<div class="col-lg-4 col-md-4 col-lg-offset-2 col-md-offset-2 text-left">'+
        '<label for="">Tipo código: </label>'+
      '</div>'+
      '<div class="col-lg-4 col-md-4 text-right">'+
        '<select id="tipo_codigo_id" class="form-control" required>'+
          '<option value="" selected disabled>Selecciona un tipo de código</option>'+
        '</select>'+
      '</div>'+
    '</div>'+

    '<div class="row">'+
      '<div class="col-lg-4 col-md-4 col-lg-offset-2 col-md-offset-2 text-left">'+
        '<label for="">Tipo de plan: </label>'+
      '</div>'+
      '<div class="col-lg-4 col-md-4 text-right">'+
        '<select id="tipo_plan_id" class="form-control" required>'+
          '<option value="" selected disabled>Selecciona un tipo de plan</option>'+
        '</select>'+
      '</div>'+
    '</div>'+

    '<div class="row">'+
      '<div class="col-lg-4 col-md-4 col-lg-offset-2 col-md-offset-2 text-left">'+
        '<label for="numberOfCodes">Cantidad: </label>'+
      '</div>'+
      '<div class="col-lg-4 col-md-4 text-right">'+
        '<input type="number" value="" id="num_cod" min="1" max="600" class="form-control" required>'+
      '</div>'+
    '</div>'+

    '<div class="row">'+
      '<div class="col-lg-8 col-md-8 col-lg-offset-2 col-md-offset-2 text-left">'+
        '<button class="btn btn-primary btn-block">Generar y exportar</button>'+
      '</div>'+
    '</div>'+

  '</form>'+

  '<div class="row">'+
    '<div class="col-lg-8 col-md-8 col-lg-offset-2 col-md-offset-2">'+
      '<table class="table hidden" id="tableExportCodeResult">'+
        '<thead>'+
          '<tr>'+
            '<th>Tipo Código</th>'+
            '<th>Tipo Plan</th>'+
            '<th>Código</th>'+
          '</tr>'+
        '</thead>'+
        '<tbody id="createCodeResult">'+
        '</tbody>'+
      '</table>'+
    '</div>'+
  '</div>';
  $('#pageAdminContent').html(contenido);
  cargarTipoCodigo();
  cargarTipoPlan();
}

function cargarCodGen(){
  var tiposcodigos = [];
	$.ajax({
		url: '/control/tipoPlan/load',
		type: 'POST',
		dataType: "json",
		cache: false,
    async: false,
		type: 'POST',
		success: function( data ) {
      if (data.success){
        data.result.forEach(function(res){
          tiposcodigos[res.id] = res.nombre;
        });
      }
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });

	$.ajax({
		url: '/control/encCod/Load',
		type: 'POST',
		dataType: "json",
		cache: false,
		type: 'POST',
		success: function( data ) {
      var contenido = '<div class="list-group">';

      data.result.forEach(function(res){

        contenido += '<div class="media list-group-item"><div class="media-left"><h1>'+ res.tipoCodigo +'</h1></div><div class="media-body text-left"><p></p><h4 class="media-heading">'+ res.tipo +'</h4>';

        res.planes.forEach(function(plan){
          contenido +='<div class="media list-group-item"><div class="media-body text-left"><p></p><h4 class="media-heading">Plan: '+ tiposcodigos[plan.tipoPlan] +'</h4><br/>';
          contenido += '<p>Total de códigos generados: '+ plan.total +'</p>';
          contenido += '<p>Total de códigos redimidos: '+ plan.totalReg +'</p>';
          contenido += '</div><div class="media-right" href="#"><button class="btn btn-success btn-block" onclick="exportarCodigos('+ res.tipoCodigo +','+ plan.tipoPlan +',\''+ res.tipo +'\',\''+ tiposcodigos[plan.tipoPlan] +'\')">Descargar <span class="glyphicon glyphicon-download-alt"></span></button></div></div>';
        });
          //'CEDULA: </b>CURP_1</p>

        contenido+= '</div></div>';
      });
      contenido += '</div>';

      contenido += '<div class="row">'+
        '<div class="col-lg-12 col-md-12">'+
          '<table class="table hidden" id="tableExportCodeResult">'+
            '<thead>'+
              '<tr>'+
                '<th>Tipo Código</th>'+
                '<th>Tipo Plan</th>'+
                '<th>Código</th>'+
              '</tr>'+
            '</thead>'+
            '<tbody id="createCodeResult">'+
            '</tbody>'+
          '</table>'+
        '</div>'+
      '</div>';

      $('#pageAdminContent').html(contenido);
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
}

function exportarCodigos(tipoCodigo, tipoPlan, tcodigo, tplan){
  console.log(tcodigo  + ' ' + tplan);

  	$.ajax({
      async: false,
  		url: '/control/encCod/loadByCod',
  		type: 'POST',
  		dataType: "json",
  		cache: false,
  		type: 'POST',
      data: {
        tipoCodigo: tipoCodigo,
        tipoPlan: tipoPlan
      },
  		success: function( data ) {
        if (data.success){
          var contenido = '';

          data.result.forEach(function(res){
            contenido += '<tr class="text-left"><td>'+ tcodigo +' ('+res.tipoCodigo+')</td><td>'+ tplan +' ('+res.tipoPlan+')</td><td>'+res.codigo+'</td></tr>';
          });

          $('#createCodeResult').html(contenido);
          $('#tableExportCodeResult').table2excel({
            filename: "Intermed_Cod-"+tcodigo+"-"+tplan
          });
          $('#createCodeResult').html('');
        }
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });
}




function cargarError(){

            /*{"id":107,
            "err":"ReferenceError: a is not defined",
            "file":"usuarios",
            "function":"revivirSesion",
            "method":"GET",
            "datetime":"2016-02-12T23:41:18.000Z",
            "filePath":"./apps/errors/2016-02-12T23:41:18.827Z_9047.json",
            "status":0,
            "userIntermed_id":null}*/

    var contenido = `
  <!-- Nav tabs -->
  <ul class="nav nav-tabs menuBootbox" role="tablist" style="margin: -25px;">
    <li role="presentation" class="active"><a href="#errNuev" aria-controls="errNuev" role="tab" data-toggle="tab" aria-expanded="true">Nuevos</a></li>
    <li role="presentation" class=""><a href="#errNoAt" aria-controls="errNoAt" role="tab" data-toggle="tab" aria-expanded="false">Por atender</a></li>
    <li role="presentation" class=""><a href="#errAt" aria-controls="errAt" role="tab" data-toggle="tab" aria-expanded="false">Atendidos</a></li>
    <li role="presentation" class=""><a href="#errSol" aria-controls="errSol" role="tab" data-toggle="tab" aria-expanded="false">Solucionados</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content" style="margin-top:30px;">
    <div role="tabpanel" class="tab-pane active" id="errNuev" >
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Metodo</th>
            <th class="text-center">Error</th>
            <th class="text-center">Controlador/Función</th>
            <th class="text-center">Detalles</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div role="tabpanel" class="tab-pane" id="errNoAt">
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Metodo</th>
            <th class="text-center">Error</th>
            <th class="text-center">Controlador/Función</th>
            <th class="text-center">Detalles</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div role="tabpanel" class="tab-pane" id="errAt">
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Metodo</th>
            <th class="text-center">Error</th>
            <th class="text-center">Controlador/Función</th>
            <th class="text-center">Detalles</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div role="tabpanel" class="tab-pane" id="errSol">
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Metodo</th>
            <th class="text-center">Error</th>
            <th class="text-center">Controlador/Función</th>
            <th class="text-center">Detalles</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>

`;

$('#pageAdminContent').html(contenido);
    //Cargar nuevos
  	$.ajax({
  		url: '/control/err/get',
  		type: 'POST',
  		dataType: "json",
      data: {
        status: 0
      },
  		cache: false,
  		type: 'POST',
  		success: function( data ) {
        if (data.success){
          var cont = '';
          data.result.forEach(function(res){
            cont += '<tr id=\'err_'+ res.id +'\'>'+
                '<td>'+ res.id +'</td>'+
                '<td>'+ res.datetime +'</td>'+
                '<td>'+ res.method +'</td>'+
                '<td>'+ res.err +'</td>'+
                '<td>'+ res.file + '/' + res.function +'</td>'+
                '<td><a onclick=\'detallesError('+ res.id +',this)\'><span class=\'glyphicon glyphicon-search\'></span></a></td>'+
              '</tr>';
          });
          $('#errNuev').find('tbody').html(JSON.stringify(cont));
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
  		},
  		error: function( jqXHR, textStatus, err ) {
  			console.error( 'AJAX ERROR: (registro 166) : ' + err );
  		}
  	});

    //Cargar por atender
    $.ajax({
      url: '/control/err/get',
      type: 'POST',
      dataType: "json",
      data: {
        status: 1
      },
      cache: false,
      type: 'POST',
      success: function( data ) {
        if (data.success){
          var cont = '';
          data.result.forEach(function(res){
            cont += '<tr id=\'err_'+ res.id +'\'>'+
                '<td>'+ res.id +'</td>'+
                '<td>'+ res.datetime +'</td>'+
                '<td>'+ res.method +'</td>'+
                '<td>'+ res.err +'</td>'+
                '<td>'+ res.file + '/' + res.function +'</td>'+
                '<td><a onclick=\'detallesError('+ res.id +')\'><span class=\'glyphicon glyphicon-search\'></span></a></td>'+
              '</tr>';
          });
          $('#errNoAt').find('tbody').html(JSON.stringify(cont));
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      },
      error: function( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    });

    //Cargar Atendidos
    $.ajax({
      url: '/control/err/get',
      type: 'POST',
      dataType: "json",
      data: {
        status: 2
      },
      cache: false,
      type: 'POST',
      success: function( data ) {
        if (data.success){
          var cont = '';
          data.result.forEach(function(res){
            cont += '<tr id=\'err_'+ res.id +'\'>'+
                '<td>'+ res.id +'</td>'+
                '<td>'+ res.datetime +'</td>'+
                '<td>'+ res.method +'</td>'+
                '<td>'+ res.err +'</td>'+
                '<td>'+ res.file + '/' + res.function +'</td>'+
                '<td><a onclick=\'detallesError('+ res.id +')\'><span class=\'glyphicon glyphicon-search\'></span></a></td>'+
              '</tr>';
          });
          $('#errAt').find('tbody').html(JSON.stringify(cont));
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      },
      error: function( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    });


    //Cargar solucionados
    $.ajax({
      url: '/control/err/get',
      type: 'POST',
      dataType: "json",
      data: {
        status: 3
      },
      cache: false,
      type: 'POST',
      success: function( data ) {
        if (data.success){
          var cont = '';
          data.result.forEach(function(res){
            cont += '<tr id=\'err_'+ res.id +'\'>'+
                '<td>'+ res.id +'</td>'+
                '<td>'+ res.datetime +'</td>'+
                '<td>'+ res.method +'</td>'+
                '<td>'+ res.err +'</td>'+
                '<td>'+ res.file + '/' + res.function +'</td>'+
                '<td><a onclick=\'detallesError('+ res.id +')\'><span class=\'glyphicon glyphicon-search\'></span></a></td>'+
              '</tr>';
          });
          $('#errSol').find('tbody').html(JSON.stringify(cont));
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      },
      error: function( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    });
}

function guardarEstatusError(error_id,statusInput){
  var status = statusInput = $('#'+statusInput).val();
  var error_id = error_id;
  $.ajax({
    url: '/control/err/status/update',
    type: 'POST',
    dataType: "json",
    data: {
      status: status,
      id: error_id
    },
    cache: false,
    type: 'POST',
    success: function( data ) {
      if (data.success){
        if (data.success && data.result){
          var clone = $('tr#err_'+error_id).clone();
          $('tr#err_'+error_id).remove();
          var divid = '';
          if (status == 1){
            divid = '#errNoAt';
          } else if (status == 2){
            divid = '#errAt';
          } else if (status == 3){
            divid = '#errSol';
          }
          $(divid).find('tbody').append(clone);
        }else{
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      } else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  });
}

function agregarComentarioErr(error_id, inputComentario){
  var comentario = $('#'+inputComentario).val();
  $('#'+inputComentario).val('')
  $('#'+inputComentario).focus();
  console.log('Agregar comentario: ' + comentario);
  $.ajax({
    url: '/control/err/comentario/add',
    type: 'POST',
    dataType: "json",
    data: {
      comentario: comentario,
      id: error_id
    },
    cache: false,
    type: 'POST',
    success: function( data ) {
      if (data.success){
        if (data.success && data.result){
          var error = '<a class="list-group-item disabled" style="overflow-x: auto;"><small class="pull-right">'+ new Date(data.result.datetime) +'</small><b>'+ data.result.usuario.nombre +':</b><br><br>'+ data.result.comentario +'</a>';
          $('#listComentErr').append(error);
        }else{
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      } else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  });
  return false;
}
