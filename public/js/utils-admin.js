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
        var resultautocomplete = [];
        data.result.forEach(function(res){
          resultautocomplete.push(res.tipo);
          //$('#tipo_codigo_id').append('<option value="'+ res.id +'">'+ res.tipo +'</option>')
        });
        $('#tipo_codigo_id').autocomplete({
          minLength: 0,
          source: resultautocomplete
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
        cargarTipoCodigo();
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
        '<input type="text" id="tipo_codigo_id" class="form-control" required>'+
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

function guardarEstatusError(error_id,statusInput,element){
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
          if (element){
            if (status == 2){
              var contenidoatiende = '<a class="list-group-item disabled"><b>Atendido por:</b> '+ data.result.nombre  + ' [' + data.result.correo + '] </a>';
              contenidoatiende += '<a class="list-group-item disabled"><b>Fecha:</b> '+ new Date(data.date).toLocaleString('en-US')  +' </a>';

              $('#atiendeLog').html(contenidoatiende);

              $(element).removeClass('btn-success');
              $(element).addClass('btn-danger');
              $(element).text('Marcar como solucionado');
              $(element).parent().find('#estatusError').val(3);
            } else {
              $(element).parent().parent().parent().remove();
              $('#panelcomentarios').remove();
            }
          }

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

function registrarplancargo(){
  $.ajax({
    url: '/registrarplancargo',
    type: 'POST',
    dataType: "json",
    data: {
      idPlan: $('#plan_id').val(),
      intervalocargo_id: $('#intervalocargo_id').val(),
      nombre: $('#nombrePlan').val(),
      frecuencia: $('#frecuenciaPlan').val(),
      monto: $('#montoPlan').val(),
      periodoprueba: $('#periodoprueba').val()
    },
    cache: false,
    async: false,
    type: 'POST',
    success: function( data ) {
      if (data.success){
        if (data.success && data.result){
          resetFormPlan();
          /*
          data.result: {
            "id":35,
            "nombre":"Cinthia Bermudez",
            "monto":30,
            "intervalocargo_id":2,
            "frecuencia":"3",
            "periodoprueba":"0",
            "idproveedor":"plan_EaTYxA6CDvCqn5Fw"
          }
          */
          cargarPlanesDeCargo();

          //Agregar nuevo plan en panel-group, limpiar el formulario para agregar otro
          //console.log('RESULT: ' + JSON.stringify(data.result));
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


var intervalosCargos = [];
function cargarPlanCarg(){
  var contenido = `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
  <div class="panel panel-primary"><div class="panel-heading">
    Nuevo plan de cargo
  </div>
  <div class="panel-body" style="height: auto;padding-bottom: 0px;">
  <div class="row">
  <form method="POST" id="plancargo" name="plancargo" onsubmit="return registrarplancargo()">
      <input type="hidden" size="20" id="plan_id" name="plan_id" class="form-control">
      <div class="col-md-12">
        <div class="form-group">
          <input type="text" size="20" id="nombrePlan" name="nombre" required class="form-control" placeholder="Nombre de plan">
        </div>
      </div>
      <div class="col-md-7">
        <div class="form-group">
          <select name="intervalocargo_id" id="intervalocargo_id" required="required" class="form-control no-editable">
          </select>
        </div>
      </div>
      <div class="col-md-5">
        <div class="form-group">
          <input type="number" min="0" max="36"  id="frecuenciaPlan" name="frecuencia" required placeholder="Frecuencia" class="form-control no-editable">
        </div>
      </div>
      <div class="col-md-7">
        <div class="form-group">
          <input type="number" min="0" max="10000" id="montoPlan" name="monto" required placeholder="Monto"  class="form-control">
        </div>
      </div>
      <div class="col-md-5">
        <div class="form-group">
          <input type="number" min="0" max="365" id="periodoprueba" name="periodoprueba" required placeholder="Dias de prueba" class="form-control no-editable">
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <button type="submit" id="enviar" name="enviar" class="btn btn-primary btn-block">Registrar</button>
        </div>
      </div>
      <div class="col-md-12 div-remove hidden">
        <div class="form-group">
          <button type="button" class="btn btn-danger btn-block" onclick="resetFormPlan()">Cancelar</button>
        </div>
      </div>

  </form>
  </div>
  </div></div></div>`;


  contenido += `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 panel-group" id="planCargoGroup"></div>`;

  $('#pageAdminContent').html(contenido);
  intervalosCargos = [];
  $.ajax({
    url: '/plandecargo/intervalo/get',
    type: 'POST',
    dataType: "json",
    cache: false,
    async: false,
    type: 'POST',
    success: function( data ) {
      var opcionesIntervalo = '';
      if (data.success){
        opcionesIntervalo +='<option value="" selected disabled>Intervalo</option>';
        data.result.forEach(function(int){
            intervalosCargos[int.id] = int.nombre;
            opcionesIntervalo +='<option value="'+ int.id +'">'+ int.nombre +'</option>';
        });
      } else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
      $('#intervalocargo_id').html(opcionesIntervalo);
    },
    error: function( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  });
  cargarPlanesDeCargo();

}

function cargarPlanesDeCargo(){
    $.ajax({
      url: '/plandecargo/getAll',
      type: 'POST',
      dataType: "json",
      cache: false,
      type: 'POST',
      success: function( data ) {
        var contenido = '';
        if (data.success){
          data.result.forEach(function(plan){
            contenido += '<div class="panel panel-info planCargo" id="plan_'+ plan.id +'"><div class="panel-heading nombre">'+ plan.nombre +'</div>'+
            '<div class="panel-body" style="height: auto;">'+
              '<span class="hidden idCargo">'+ plan.id +'</span>'+
              '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Intervalo:</div><span class="hidden intervalo_id">'+ plan.intervalocargo_id +'</span><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right intervalo">'+ intervalosCargos[plan.intervalocargo_id] +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
              '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Frecuencia:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right frecuencia">'+ plan.frecuencia +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
              '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Monto:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right monto">'+ plan.monto +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
              '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Dias de prueba:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right periodoprueba">'+ plan.periodoprueba +'</div></div>'+
            '</div>'+
            '<div class="panel-footer">'+
              '<div class="row">'+
              '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                '<button class="btn btn-warning btn-block" onclick="editarPlanDeCargo('+ plan.id +')">Editar</button>'+
              '</div>'+
              '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                '<button class="btn btn-danger btn-block" onclick="CondEliminarPlanDeCargo('+ plan.id +')">Eliminar</button>'+
              '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
          });
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
        $('#planCargoGroup').html(contenido);
      },
      error: function( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    });
}

function editarPlanDeCargo(plan_id){
  var plan = $('#plan_'+plan_id);
  $('#plan_id').val(plan_id);
  $('#intervalocargo_id').val(plan.find('.intervalo_id').text())
  $('#nombrePlan').val(plan.find('.nombre').text())
  $('#frecuenciaPlan').val(plan.find('.frecuencia').text())
  $('#montoPlan').val(plan.find('.monto').text())
  $('#periodoprueba').val(plan.find('.periodoprueba').text())
  $('#plancargo').find('.btn-primary').text('Guardar');
  $('#plancargo').find('.div-remove').removeClass('hidden');
  $('#plancargo').find('.no-editable').each(function(){
    $(this).attr('disabled',true);
  })
}

function CondEliminarPlanDeCargo(plan_id){
  $.ajax({
    url: '/plandecargo/delete/cond',
    type: 'POST',
    dataType: "json",
    data: {
      plan_id: plan_id
    },
    cache: false,
    type: 'POST',
    success: function( data ) {
      var contenido = '';
      if (data.success){
          //Modal para confirmar eliminar plan
          bootbox.dialog({
            onEscape: function () {
              bootbox.hideAll();
          },
          className: 'Intermed-Bootbox',
          title: '<span class="title">Eliminar plan de cargo</span>',
          backdrop: true,
          message:
            '<div class="row">'+
                '<div class="col-md-12 text-center" style="padding:30px;font-size:120%">'+
                  '¿Está seguro de eliminar el plan de cargo \'' + $('#plan_'+plan_id).find('.nombre').text() + '\'?'+
                '</div>'+
            '</div>'+

            '<div class="row footerBootbox" style="padding-top:20px;padding-bottom:20px">'+
              '<div class="col-md-4 pull-right">'+
                  '<button class="btn btn-success btn-block" onclick="eliminarPlanDeCargo('+ plan_id +')">Eliminar</button>'+
              '</div>'+
              '<div class="col-md-4 pull-left">'+
                  '<button class="btn btn-danger btn-block" onclick="bootbox.hideAll()">Cancelar</button>'+
              '</div>'+
            '</div>'
          });
      } else {
        if (data.result>0){
          //Modal para cambiar de plan a usuarios o cancelar
          var opcionesPlanCargo = '<option value="" selected disabled>Selecciona un plan</option>';
          $('.planCargo').each(function(){
            var id = $(this).find('.idCargo').text();
            if (plan_id != id){
              var nombre = $(this).find('.nombre').text();
              opcionesPlanCargo += '<option value="'+ id +'">'+nombre+'</option>';
            }
          });
          bootbox.dialog({
            onEscape: function () {
              bootbox.hideAll();
          },
          className: 'Intermed-Bootbox',
          title: '<span class="title">Eliminar plan de cargo</span>',
          backdrop: true,
          message:
            '<div class="row">'+
                '<div class="col-md-12 text-center" style="padding:20px;font-size:120%">'+
                  'El plan \''+$('#plan_'+plan_id).find('.nombre').text()+'\' tiene usuarios suscritos. <br/>Para poder eliminarlo es necesario seleccionar un plan que lo reemplace: ' +
                '</div>'+
                '<div class="col-md-8 col-md-offset-2 text-center" style="padding-bottom:20px;font-size:120%">'+
                  '<select class="form-control" id="nuevoPlan_id" required>'+ opcionesPlanCargo +'</select>' +
                '</div>'+
            '</div>'+

            '<div class="row footerBootbox" style="padding-top:20px;padding-bottom:20px">'+
              '<div class="col-md-4 pull-right">'+
                  '<button class="btn btn-success btn-block" onclick="reemplazarPlanDeCargo('+ plan_id +',\'nuevoPlan_id\')">Eliminar</button>'+
              '</div>'+
              '<div class="col-md-4 pull-left">'+
                  '<button type="button" class="btn btn-danger btn-block" onclick="bootbox.hideAll()">Cancelar</button>'+
              '</div>'+
            '</div>'
          });
        }
        else if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  });
}

function reemplazarPlanDeCargo(plan_id, nuevoPlan_id){
  var nuevoplan = $('#'+nuevoPlan_id).val();
  if (nuevoplan && nuevoplan > 0){
    console.log(plan_id + ' - ' + $('#'+nuevoPlan_id).val());
    $.ajax({
      url: '/plandecargo/reemplazar',
      type: 'POST',
      dataType: "json",
      data: {
        plan_id: plan_id,
        nuevoPlan_id: nuevoplan
      },
      cache: false,
      type: 'POST',
      success: function( data ) {
        console.log('Result: ' + JSON.stringify(data));
        if (data.success){
          eliminarPlanDeCargo(plan_id);
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
  } else {
    $('#'+nuevoPlan_id).focus();
  }
}

function eliminarPlanDeCargo(plan_id){
    $.ajax({
      url: '/plandecargo/delete',
      type: 'POST',
      dataType: "json",
      data: {
        plan_id: plan_id
      },
      cache: false,
      type: 'POST',
      success: function( data ) {
        if (data.success){
          bootbox.hideAll();
          resetFormPlan();
          cargarPlanesDeCargo();
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

function resetFormPlan(){
  document.getElementById("plancargo").reset();
  $('#plan_id').val('');
  $('#plancargo').find('.no-editable').each(function(){
    $(this).attr('disabled',false);
  })
  $('#plancargo').find('.btn-primary').text('Registrar');
  $('#plancargo').find('.div-remove').addClass('hidden');
}

function cargarUsuariosCP(){
    var contenido = `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <div class="panel panel-primary"><div class="panel-heading">
      Nuevo usuario
    </div>
    <div class="panel-body" style="height: auto;padding-bottom: 0px;">
    <div class="row">
      <div class="col-md-12">
        <center>
          <div class="profilePic header-profile-photo-link center-block">
            <img id="imgPerfilNuevo" src="" width="200" height="200" class="img-rounded fotoPerfil">
            <label for="imageFile">Cambiar Imagen</label><input type="file" id="imageFile" style="display:none" onchange="seleccionarImagenUsuarioPanel(this)">
          </div>
        </center>
        <input type="hidden" id="imagenPerfilUs">
      </div>
    </div>
    <div class="row">
    <form method="POST" id="usuarioIntermed" name="plancargo" onsubmit="return registrarUsuarioIntermed()">
        <input type="hidden" size="20" id="plan_id" name="plan_id" class="form-control">
        <div class="col-md-12">
          <div class="form-group">
            <select id="rolUsuario" required class="form-control">
              <option value="" selected disabled>Selecciona rol de usuario</option>
              <option value="1">Admin</option>
              <option value="2">Programador</option>
            </select>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label>
              <input type="checkbox" id="activo" name="activo" checked> Activo
            </label>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <input type="text" id="nombre" name="nombre" required class="form-control" placeholder="Nombre">
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <input type="email" name="correo" id="correo" required="required" class="form-control" placeholder="Correo electrónico">
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <input type="text" id="telefono" name="telefono" required placeholder="Telefono/Celular" class="form-control">
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <button type="submit" id="enviar" name="enviar" class="btn btn-primary btn-block">Registrar</button>
          </div>
        </div>
        <div class="col-md-12 div-remove hidden">
          <div class="form-group">
            <button type="button" class="btn btn-danger btn-block" onclick="resetFormPlan()">Cancelar</button>
          </div>
        </div>

    </form>
    </div>
    </div></div></div>`;


    contenido += `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 panel-group" id="planUsuarioGroup"></div>`;

    $('#pageAdminContent').html(contenido);

    cargarUsuariosIntermed();
}

function registrarUsuarioIntermed(){
  var formulario = $('#usuarioIntermed');
  var rolusuario = formulario.find('#rolUsuario').val();
  var base64file = $('#imagenPerfilUs').val();
  var activo = 0;
  if (formulario.find('#activo').is(':checked')){
    activo = 1;
  }
  var nombre = formulario.find('#nombre').val();
  var correo = formulario.find('#correo').val();
  var telefono = formulario.find('#telefono').val();

  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var password = "";

  for( var i=0; i < 7; i++ )
      password += possible.charAt(Math.floor(Math.random() * possible.length));

  $.ajax({
    url: '/control/user/add',
    type: 'POST',
    dataType: "json",
    data: {
      activo: activo,
      nombre: nombre,
      correo: correo,
      telefono: telefono,
      rolusuario: rolusuario,
      base64file: base64file,
      password: hex_md5(password),
      passwordNotMd5: password
    },
    cache: false,
    type: 'POST',
    success: function( data ) {
      console.log('USUARIO: ' + JSON.stringify(data));
      if (data.success){
        bootbox.hideAll();
        resetFormUsuarioReg();
        cargarUsuariosIntermed();
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

function resetFormUsuarioReg(){
  document.getElementById("usuarioIntermed").reset();
  $('#imagenPerfilUs').val('');
  $('#imgPerfilNuevo').attr('src','');
}

function seleccionarImagenUsuario(){
  $('#imagenPerfilUs').val(base64file);bootbox.hideAll();
  $('#imgPerfilNuevo').attr("src", base64file);
}

function cargarUsuariosIntermed(){
    $.ajax({
      url: '/control/usuariosIntermed/getAll',
      type: 'POST',
      dataType: "json",
      cache: false,
      type: 'POST',
      success: function( data ) {
        var contenido = '';
        if (data.success){
          data.result.forEach(function(usuario){
            contenido +=
            '<div class="panel planUsuario panel-default" id="plan_'+ usuario.id +'">'+
              '<div class="panel-heading">'+
                '<h4 class="panel-title">'+
                  '<a role="button" data-toggle="collapse" data-parent="#planUsuarioGroup" href="#collapse'+ usuario.id +'" aria-expanded="true" aria-controls="collapse'+ usuario.id +'">'+ usuario.nombre +'</a>'+
                '</h4>'+
              '</div>'+
              '<div id="collapse'+ usuario.id +'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">'+
                '<div class="panel-body" style="height: auto;">'+
                  '<span class="hidden idUsuario">'+ usuario.id +'</span>'+
                  '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Correo:</div><span class="hidden intervalo_id">'+ usuario.correo +'</span><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right intervalo">'+ usuario.correo +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
                  '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Teléfono/Celular:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right frecuencia">'+ usuario.celular +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
                  '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Activo:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right monto">'+ usuario.activo +'</div></div><hr style="margin-top: 0px;margin-bottom: 5px;">'+
                  '<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-left">Rol:</div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-right periodoprueba">'+ usuario.rolUsuario_id +'</div></div>'+
                '</div>'+
              '</div>'+
            '</div>';
          });
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
        $('#planUsuarioGroup').html(contenido);
      },
      error: function( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    });
}
