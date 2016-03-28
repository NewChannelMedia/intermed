function agregarUbicacion(ubicacion_id){
  var id = '', nombre = '', principal = '', calle = '', numero = '', interior = '';
  var callea = '', calleb = '', estado = '', municipio = '', localidad = '', cp = '';
  var latitud = '', longitud = '';
  var btnGuardar = 'Añadir ubicación';

  var continuar = true;
  if (ubicacion_id && ubicacion_id > 0){
    btnGuardar = 'Editar';
    $.ajax( {
      async: false,
      url: '/ubicaciones/traer',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'ubicacion_id': ubicacion_id
      },
      success: function ( data ) {
        if (data.success){
          id = data.result.id;
          nombre = data.result.nombre;
          if (data.result.principal == 1){
            principal = 'checked="checked"';
          }
          calle = data.result.calle;
          numero = data.result.numero;
          if (data.result.numeroInt){
            interior = data.result.numeroInt;
          }
          callea = data.result.calle1;
          calleb = data.result.calle2;
          estado = data.result.Municipio.Estado.id
          municipio = data.result.Municipio.id;
          localidad = data.result.Localidad.id;
          cp = data.result.Localidad.CP;
          latitud = data.result.latitud;
          longitud = data.result.longitud;
        } else {
          if (data.error){
            continuar = false;
            manejadorDeErrores(data.error);
          }
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
  }

  if (continuar){


    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      size:'large',
      className: 'Intermed-Bootbox',
      title: '<span class="title">CONFIGURA TUS UBICACIONES Y HORARIOS DE ATENCIÓN.</span><span class="subtitle">Señala la ubicación en el mapa y registra el horario de atención correspondiente con cada una.</span>',
      message:
      '<div class="row" style="padding:0px!important"><div class="col-md-12">'+
        '<ul class="nav nav-tabs menuBootbox">'+
          '<li class="active ubicaciones"><a data-toggle="tab" href="#divUbicacion">UBICACIONES</a></li>'+
          '<li class="servicios"><a data-toggle="tab" href="#divServicios" onclick="cargarServicios(\'#idDireccion\')">SERVICIOS</a></li>'+
          '<li class="horarios"><a data-toggle="tab" href="#divHorarios" onclick="iniciarDivCalendario()">HORARIOS</a></li>'+
        '</ul>'+
      '</div></div>'+
      '<div class="tab-content">'+
        '<div id="divUbicacion" class="tab-pane fade in active">'+
            '<form method="POST" name="frmRegUb" id="frmRegUbi">'+
                '<input type="hidden" id="idDireccion" name="idDireccion" value="'+id+'">'+
                '<input type="hidden" id="idEstado" name="idDireccion" value="'+estado+'">'+
                '<input type="hidden" id="idMunicipio" name="idDireccion" value="'+municipio+'">'+
                '<input type="hidden" id="idLocalidad" name="idDireccion" value="'+localidad+'">'+
                '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<div class="row">'+
                        '<div class="col-md-6">'+
                            '<div class="row">'+
                                '<div class="col-md-12">'+
                                  '<div class="row">'+
                                    '<div class="form-group">'+
                                      '<div class="row">'+
                                        '<label class="col-md-12 control-label" for="textinput" style="color:white">Nombre de la ubicación:</label>'+
                                        '<div class="col-md-7">'+
                                        '<input id="nombreUbi" name="nombreUbi" type="text" placeholder="" class="form-control input-md" value="'+nombre+'">'+
                                        '</div>'+
                                        '<div class="col-md-5">'+
                                          '<div class="row">'+
                                            '<div class="checkbox">'+
                                            '<label style="color:white;font-weight:bold">'+
                                              '<input type="checkbox" id="principal" name="principal" value="" style="margin-top:0px" '+ principal +'>'+
                                              'Ubicación principal.'+
                                            '</label>'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col-md-12">'+
                                  '<div class="row">'+
                                    '<div class="form-group">'+
                                      '<div class="row">'+
                                        '<div class="col-md-7">'+
                                          '<div class="row">'+
                                            '<label class="col-md-12 control-label" for="textinput" style="color:white">Calle o avenida:</label>'+
                                            '<div class="col-md-12">'+
                                            '<input id="calleUbi" name="calleUbi" type="text" placeholder="" class="form-control input-md" value="'+calle+'">'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                        '<div class="col-md-3">'+
                                          '<div class="row">'+
                                            '<div class="col-md-12">'+
                                                '<label class="control-label" for="textinput" style="color:white">Número:</label>'+
                                            '</div>'+
                                            '<div class="col-md-12">'+
                                                '<input id="numeroUbi" name="numeroUbi" type="text" placeholder="" class="form-control input-md" value="'+ numero +'">'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                        '<div class="col-md-2">'+
                                          '<div class="row">'+
                                            '<div class="col-md-12">'+
                                                '<label class="control-label" for="textinput" style="color:white">Interior:</label>'+
                                            '</div>'+
                                            '<div class="col-md-12">'+
                                                '<input id="numeroIntUbi" name="numeroIntUbi" type="text" placeholder="" class="form-control input-md" value="'+ interior+'">'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col-md-12">'+
                                  '<div class="row">'+
                                    '<div class="form-group">'+
                                      '<div class="row">'+
                                        '<div class="col-md-6">'+
                                          '<div class="row">'+
                                            '<label class="col-md-12 control-label" for="textinput" style="color:white">Entre calles:</label>'+
                                            '<div class="col-md-12">'+
                                            '<input id="calle1Ubi" name="calle1Ubi" type="text" placeholder="" class="form-control input-md" value="'+callea+'">'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                        '<div class="col-md-6">'+
                                          '<div class="row">'+
                                            '<label class="col-md-12 control-label" for="textinput" style="color:white">Y:</label>'+
                                            '<div class="col-md-12">'+
                                            '<input id="calle2Ubi" name="calle2Ubi" type="text" placeholder="" class="form-control input-md" value="'+ calleb +'">'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col-md-12">'+
                                  '<div class="row">'+
                                    '<div class="form-group">'+
                                      '<div class="row">'+
                                        '<div class="col-md-6">'+
                                          '<div class="row">'+
                                            '<label class="col-md-12 control-label" for="textinput" style="color:white">Estado:</label>'+
                                            '<div class="col-md-12">'+
                                            '<select id="slc_estados_mapa" name="slc_estados_mapa" type="text" placeholder="" class="form-control input-md" onChange="obtenerCiudades()">'+
                                            '</select>'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                        '<div class="col-md-6">'+
                                          '<div class="row">'+
                                            '<label class="col-md-12 control-label" for="textinput" style="color:white">Municipio/ciudad:</label>'+
                                            '<div class="col-md-12">'+
                                            '<select id="slc_ciudades_mapa" name="slc_ciudades_mapa" type="text" placeholder="" class="form-control input-md" onChange="obtenerColonias()">'+
                                            '</select>'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '<div class="col-md-12">'+
                                '<div class="row">'+
                                  '<div class="form-group">'+
                                    '<div class="row">'+
                                      '<div class="col-md-6">'+
                                        '<div class="row">'+
                                          '<label class="col-md-12 control-label" for="textinput" style="color:white">Localidad/colonia:</label>'+
                                          '<div class="col-md-12">'+
                                          '<select id="slc_colonias_mapa" name="slc_colonias_mapa" type="text" placeholder="" class="form-control input-md">'+
                                          '</select>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                      '<div class="col-md-6">'+
                                        '<div class="row">'+
                                          '<label class="col-md-12 control-label" for="textinput" style="color:white">CP:</label>'+
                                          '<div class="col-md-12">'+
                                          '<input id="cpUbi" name="cpUbi" type="text" placeholder="" class="form-control input-md" value="'+ cp +'">'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                          '</div>'+
                      '</div>'+
                      '<div class="col-md-6">'+
                        '<div class="row">'+
                            '<input type="hidden" id="latitud" name="latitud" value="'+latitud+'"/>'+
                            '<input type="hidden" id="longitud" name="longitud" value="'+longitud+'"/>'+
                            '<div id="searchDiv">'+
                                '<input id="autocomplete_searchField" type="text" placeholder="Buscar Dirección">'+
                            '</div>'+
                            '<div id="direccion"></div>'+
                            '<div id="mapDiv"></div>'+
                        '</div>'+
                      '</div>'+
                  '</div>'+
              '</div>'+
              '</div>'+


              '<div class="row">'+
              '<div class="col-md-12">'+
                '<div class="row">'+
                  '<hr class="style-white"/>'+
                  '<div class="col-md-12">'+
                    '<div class="row" class="text-center">'+
                      '<span style="font-weight:bold;color:white;font-size:130%;text-align:center;padding:7px;"  class="col-md-12">'+
                        'Teléfonos'+
                      '</span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-10 col-sm-10">'+
                    '<div class="row">'+
                      '<div class="form-group col-md-3 col-sm-3">'+
                        '<div class="row">'+
                          '<select class="form-control" id="tipoTelefono" >'+
                            '<option value="celular">Celular</option>'+
                            '<option value="oficina">Oficina</option>'+
                            '<option value="localizador">Localizador</option>'+
                          '</select>'+
                        '</div>'+
                      '</div>'+
                      '<div class="form-group col-md-9 col-sm-9" id="divTelefono">'+
                        '<div class="form-group">'+
                          '<input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" onpaste="soloNumeros()" maxlength="12"  >'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-2 col-sm-2">'+
                    '<div class="row">'+
                    '<div class="form-group">'+
                      '<input type="button" class="btn btn-warning btn-block" id="addFon" value="Añadir">'+
                    '</div>'+
                    '</div>'+
                  '</div>'+
              '</div>'+
              '<div class ="row">'+
                '<div class="form-group col-md-12 col-sm-12"><ul class="list-inline" id="divTelefonoAgregado"></ul></div>'+
              '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div id="fonAgregado" class="btn-group edit-btns text-center" data-toggle="buttons"></div>'+
              '</div>'+
              '<div class="col-md-12">'+
                '<div class="row">'+
                '<hr class="style-white"/>'+
                '<span style="font-weight:bold;color:white;font-size:80%;">'+
                  'Al finalizar de agregar tus ubicaciones, pasa a la pestaña de "horarios" para organizar las horas de atención que se mostrarán en tu agenda de citas.'+
                '</span>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-12" style="margin-top:15px;margin-bottom:30px">'+
                '<div class="row">'+
                  '<div class="col-md-6 pull-right">'+
                    '<div class="row">'+
                      '<div class="col-md-6">'+
                        '<div class="row">'+
                        '<input type="button" class="btn btn-add btn-block" value="'+btnGuardar+'" onclick="regUbicacion()" id="btnGuardar">'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-6">'+
                        '<div class="row" style="margin-left:2px">'+
                          '<input type="button" class="btn btn-save btn-block" value="Guardar y salir" onclick="regUbicacion(true);" id="btnGuardarSalir">'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-6 pull-left">'+
                    '<div class="row">'+
                      '<div class="col-md-6">'+
                        '<div class="row">'+
                        '<input type="button" class="btn btn-drop btn-block" value="Eliminar" onclick="eliminarUbicacion()" id="btnEliminar">'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
          '</form>'+
      '</div>'+


      '<div id="divHorarios" class="tab-pane fade divBodyBootbox">'+
        '<div class="row" style="margin-top:-10px;">'+
          '<div class="col-lg-12 col-md-12 UbicHidden">'+
            '<div class="row divActionsUbic">'+
              '<div class="col-lg-4 col-md-4 action action-All" onclick="calendarSeleccionarTodo()">'+
                '<span class="glyphicon glyphicon-ok"></span>'+
                '<span>Todo disponible</span>'+
              '</div>'+
              '<div class="col-lg-4 col-md-4 action action-Busy" onclick="calendarSeleccionarNada()">'+
                '<span class="glyphicon glyphicon-remove"></span>'+
                '<span>Todo ocupado</span>'+
              '</div>'+
              '<div class="col-lg-4 col-md-4 action action-Office" onclick="calendarHorarioOficina()">'+
                '<span class="glyphicon glyphicon-calendar"></span>'+
                '<span>Horario de oficina</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<form method="POST" name="frmRegHorarios" id="frmRegHorarios" onsubmit="return false;">'+
            '<input type="hidden" id="horariosUbi" name="horariosUbi" value="" />'+
            '<input type="hidden" id="direccion_id" name="direccion_id" value="" />'+
            '<div class="row">'+
                '<div class="col-md-12" id="divCalendarioPadre"><div id="divCalendario" class="regHorMed"></div></div>'+
                '<div class="col-md-6 pull-right"><input type="button" class="btn btn-save btn-md btn-block" id="btnRegHorarios" value="Guardar Horarios" onclick="regHorarios()"></div>'+
            '</div>'+
        '</form>'+
        '<!--<input type="button" class="btn btn-save btn-sm" value="Guardar y salir" onclick="registrarHorariosBot();">-->'+
        '<br/><br/>'+
      '</div>'+

        '<div id="divServicios" class="tab-pane fade divBodyBootbox">'+
          '<div class="row">'+
            '<div class="col-lg-12 regSectionTitle whiteF h77-boldcond" style="margin:5px!important;">'+
                  '<span class="glyphicon glyphicon-plus"></span>DA DE ALTA UN SERVICIO'+
            '</div>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-lg-12">'+
              '<div class="row">'+
              '<form method="POST" onsubmit="return guardarServicio(\'frmRegServ\');" id="frmRegServ">'+
                '<input type="hidden" id="servicio_id" value="">'+
                '<div class="col-md-3">'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<label class="whiteF regInput">Concepto.</label>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<input type="text" class="form-control regInput" id="conceptServ" name="concepto" required="required">'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-4">'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<label class="whiteF regInput">Descripción.</label>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<input type="text" class="form-control regInput" id="decriptServ" name="descripcion" required="required">'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<label class="whiteF regInput">Costo.</label>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<input type="text" class="form-control regInput" id="precServ" name="precio" required="required">'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<label class="whiteF regInput">Duración.</label>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<select id="duraServ" class="form-control regInput" name="duracion" required="required">'+
                        '<option value="" selected disabled>Selecciona</option>'+
                        '<option value="00:30:00">30 minutos</option>'+
                        '<option value="00:45:00">1 hora</option>'+
                        '<option value="01:30:00">1 hora y 30 minutos</option>'+
                        '<option value="02:00:00">2 horas</option>'+
                        '<option value="02:30:00">2 horas y 30 minutos</option>'+
                        '<option value="03:00:00">3 horas</option>'+
                        '<option value="03:30:00">3 horas y 30 minutos</option>'+
                        '<option value="04:00:00">4 horas</option>'+
                        '<option value="04:30:00">4 horas y 30 minutos</option>'+
                        '<option value="05:00:00">5 horas</option>'+
                        '<option value="05:30:00">5 horas y 30 minutos</option>'+
                        '<option value="06:00:00">6 horas</option>'+
                        '<option value="06:30:00">6 horas y 30 minutos</option>'+
                        '<option value="07:00:00">7 horas</option>'+
                        '<option value="07:30:00">7 horas y 30 minutos</option>'+
                        '<option value="08:00:00">8 horas</option>'+
                        '<option value="08:30:00">8 horas y 30 minutos</option>'+
                        '<option value="09:00:00">9 horas</option>'+
                        '<option value="09:30:00">9 horas y 30 minutos</option>'+
                      '</select>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-1">'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<label class="whiteF">&nbsp;</label>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<button type="submit" class="btn btn-primary regInput">'+
                        '<span style="color:white;" class="glyphicon glyphicon-plus"></span>'+
                      '</button>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</form>'+
              '</div>'+
            '</div>'+
          '</div>'+


          '<div class="row" style="margin-top:20px">'+
            '<div class="col-lg-12 regSectionTitle whiteF h77-boldcond" style="margin:5px!important;">'+
                  '<span class="glyphicon glyphicon-pencil"></span>EDITA TUS SERVICIOS'+
            '</div>'+
          '</div>'+

          '<div class="row">'+
            '<div class="col-lg-12">'+
              '<ul id="ServListReg" class="list-inline" style="margin-bottom:15px">'+
              '</ul>'+
            '</div>'+
          '</div>'+

      '</div>'+




    '</div>'
  });

  if (btnGuardar == "Editar"){
    $("#frmRegUbi :input").prop('disabled', true);
    $("#frmRegUbi :button").prop('disabled', false);
    $('#frmRegUbi :button #addFon').prop('disabled', true);
    $("#frmRegUbi #btnGuardarSalir").addClass('hidden');
    $('#btnGuardar').parent().parent().addClass('pull-right');
    cargarTelefonos();
  } else {
    $('#btnEliminar').addClass('hidden');
  }
  setTimeout(function(){
    $('#numTelefono').mask('000-000-0000',{reverse:true});
  },500);
  cargarMapa(ubicacion_id);
  if (mapa.marker){
    mapa.marker.setOptions({draggable: false});
  }
  funcionesTelefonos();
  if (btnGuardar == "Editar"){
    $('label.editar').unbind();
  }
}
}

function bootbox_modificaMedicoDetalles(tipo){
  var expertActive = '';
  var asegActi = '';
  var hospActi = '';
  if (tipo == 2){
    hospActi = 'active';
  } else if (tipo == 3){
    asegActi = 'active';
  } else {
    expertActive = 'active';
  }
  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    className: 'Intermed-Bootbox',
    title: '<span class="title"></span>',
    size:'large',
    message:
      '<style>.modal-header .close {margin-top: -17px;margin-right: -9px;}</style>'+
      '<ul class="nav nav-tabs menuBootbox">'+
        '<li class="'+ expertActive +'"><a data-toggle="tab" href="#divExpertEn">EXPERTO EN:</a></li>'+
        '<li class="'+ hospActi +'"><a data-toggle="tab" href="#divHospClin">HOSPITALES Y CLÍNICAS</a></li>'+
        '<li class="'+ asegActi +'"><a data-toggle="tab" href="#divAseguradoras">ASEGURADORAS</a></li>'+
      '</ul>'+

      '<div class="tab-content">'+
        //div experto en
        '<div id="divExpertEn" class="divBodyBootbox tab-pane fade in '+ expertActive +'">'+
            '<div class="row">'+
              '<form onsubmit="return false;">'+
              '<div class="col-lg-12 col-md-12" style="margin-bottom:20px;">'+
                '<div class="row">'+
                  '<div class="col-lg-2 col-md-2">'+
                    '<div class="row text-center">'+
                      '<label for="addExp" style="padding-top:7px">Experto en:</label>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-lg-8 col-md-8">'+
                    '<div class="row" style="margin-left:2px">'+
                      '<input type="text" class="form-control" id="addExp">'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-lg-2 col-md-2">'+
                    '<div class="row" style="margin-left:2px">'+
                      '<input type="submit" class="btn btn-warning btn-block" value="Agregar" onclick="agregarExpertoEn();">'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '</form>'+

              '<div class="col-lg-12 col-md-12">'+
                '<div class="row" id="sortableExpertoEnCont">'+
                '<ol class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="sortableExpertoEn">'+

              	'</ol>'+
              '</div>'+
            '</div>'+

            '<div class="col-md-12">'+
              '<div class="row">'+
                '<hr class="style-white" />'+
              '</div>'+
            '</div>'+

            '<div class="col-md-12" style="margin-top:10px;">'+
              '<div class="row">'+
                '<div class="col-md-4 pull-right">'+
                  '<div class="row">'+
                    '<input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar" onclick="guardarExpertoEn()">'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-4 pull-left">'+
                  '<div class="row">'+
                    '<input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
      '</div>'+

      //Div hospitales
      '<div id="divHospClin" class="divBodyBootbox tab-pane fade in '+ hospActi +'">'+
          '<div class="row">'+
            '<form onsubmit="return false;">'+
            '<div class="col-lg-12 col-md-12" style="margin-bottom:20px;">'+
              '<div class="row">'+
                '<div class="col-lg-2 col-md-2">'+
                  '<div class="row text-center">'+
                    '<label for="addExp" style="padding-top:7px">Hospital/Clínica:</label>'+
                  '</div>'+
                '</div>'+
                '<div class="col-lg-8 col-md-8">'+
                  '<div class="row" style="margin-left:2px">'+
                    '<input type="text" class="form-control" id="addClin">'+
                  '</div>'+
                '</div>'+
                '<div class="col-lg-2 col-md-2">'+
                  '<div class="row" style="margin-left:2px">'+
                    '<input type="submit" class="btn btn-warning btn-block" value="Agregar" onclick="agregarClinica();">'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '</form>'+

            '<div class="col-lg-12 col-md-12">'+
              '<div class="row" id="sortableClinicaCont">'+
              '<ol class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="sortableClinica">'+

              '</ol>'+
            '</div>'+
          '</div>'+

          '<div class="col-md-12">'+
            '<div class="row">'+
              '<hr class="style-white" />'+
            '</div>'+
          '</div>'+

          '<div class="col-md-12" style="margin-top:10px;">'+
            '<div class="row">'+
              '<div class="col-md-4 pull-right">'+
                '<div class="row">'+
                  '<input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar" onclick="guardarClinicas()">'+
                '</div>'+
              '</div>'+
              '<div class="col-md-4 pull-left">'+
                '<div class="row">'+
                  '<input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+

        '</div>'+
      '</div>'+

      //Div aseguradoras
      '<div id="divAseguradoras" class="divBodyBootbox tab-pane fade in '+ asegActi +'">'+

          '<div class="row">'+
            '<form onsubmit="return false;">'+
            '<div class="col-lg-12 col-md-12" style="margin-bottom:20px;">'+
              '<div class="row">'+
                '<div class="col-lg-2 col-md-2">'+
                  '<div class="row text-center">'+
                    '<label for="addExp" style="padding-top:7px">Aseguradora:</label>'+
                  '</div>'+
                '</div>'+
                '<div class="col-lg-8 col-md-8">'+
                  '<div class="row" style="margin-left:2px">'+
                    '<input type="text" class="form-control" id="addAseg">'+
                  '</div>'+
                '</div>'+
                '<div class="col-lg-2 col-md-2">'+
                  '<div class="row" style="margin-left:2px">'+
                    '<input type="submit" class="btn btn-warning btn-block" value="Agregar" onclick="agregarAseguradora();">'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '</form>'+

            '<div class="col-lg-12 col-md-12">'+
              '<div class="row" id="sortableAseguradoraCont">'+
              '<ol class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="sortableAseguradora">'+

              '</ol>'+
            '</div>'+
          '</div>'+

          '<div class="col-md-12">'+
            '<div class="row">'+
              '<hr class="style-white" />'+
            '</div>'+
          '</div>'+

          '<div class="col-md-12" style="margin-top:10px;">'+
            '<div class="row">'+
              '<div class="col-md-4 pull-right">'+
                '<div class="row">'+
                  '<input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar" onclick="guardarAseguradoras()">'+
                '</div>'+
              '</div>'+
              '<div class="col-md-4 pull-left">'+
                '<div class="row">'+
                  '<input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+

        '</div>'+
      '</div>'+
      //end div aseguradoras

      '</div>'
  });

  cargarClinicas();
  cargarAseguradoras();
  cargarExpertoEn();

	var ns = $('#sortableExpertoEnCont>ol.sortable').nestedSortable({
		forcePlaceholderSize: true,
		handle: 'div',
		helper:	'clone',
		items: 'li',
		opacity: .6,
		placeholder: 'placeholder',
		revert: 250,
		tabSize: 25,
		tolerance: 'pointer',
		toleranceElement: '> div',
		maxLevels: 2,
		isTree: true,
		expandOnHover: 700,
		startCollapsed: false
	});

	var ns = $('#sortableClinicaCont>ol.sortable').nestedSortable({
		forcePlaceholderSize: true,
		handle: 'div',
		helper:	'clone',
		items: 'li',
		opacity: .6,
		placeholder: 'placeholder',
		revert: 250,
		tabSize: 25,
		tolerance: 'pointer',
		toleranceElement: '> div',
		maxLevels: 1,
		isTree: true,
		expandOnHover: 700,
		startCollapsed: false
	});

	var ns = $('#sortableAseguradoraCont>ol.sortable').nestedSortable({
		forcePlaceholderSize: true,
		handle: 'div',
		helper:	'clone',
		items: 'li',
		opacity: .6,
		placeholder: 'placeholder',
		revert: 250,
		tabSize: 25,
		tolerance: 'pointer',
		toleranceElement: '> div',
		maxLevels: 1,
		isTree: true,
		expandOnHover: 700,
		startCollapsed: false
	});
}
//<--------------------- RECOMENDACIONES ------------------->
function recomendacionesBoot(usuarioMedico_id){

  if (!usuarioMedico_id){
    usuarioMedico_id = $('#usuarioPerfil').val();
  }

  //Revisar si existe sesión iniciada como paciente
  var tipoUsuario = revisarTipoSesion();
  if (tipoUsuario == ''){
    //Iniciar sesión, con callback a agendarCitaBootbox
    registrarPacienteBootbox('recomendacionesBoot', usuarioMedico_id);
  } else {
    var nombreUsuario = '';
    $.ajax( {
      async: false,
      url: '/usuario/traer',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'id': $('#usuarioPerfil').val()
      },
      success: function ( data ) {
        if (!data.DatosGenerale.apellidoM) data.DatosGenerale.apellidoM = '';
        nombreUsuario = 'Dr. ' + data.DatosGenerale.nombre  + ' ' + data.DatosGenerale.apellidoP + ' ' + data.DatosGenerale.apellidoM;
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });

    bootbox.dialog({
      onEscape: function () {
          bootbox.hideAll();
      },
      backdrop:true,
      closeButton:true,
      className: 'Intermed-Bootbox h65-medium',
      title: '<span class="title">Recomendar al '+ nombreUsuario +'</span>',
      message:
        '<form method="POST" onsubmit="return agregarDestRecom();" id="destRec">'+
          '<div class="form-group col-md-5">'+
            '<input class="form-control" type="text" placeholder="Nombre" name="nombre" id="nombreRecomendacion" required="">'+
          '</div>'+
          '<div class="form-group col-md-6">'+
            '<input class="form-control" type="email" placeholder="E-mail" name="email" id="correoRecomendacion" required="">'+
          '</div>'+
          '<div class="form-group col-md-1">'+
            '<button class="btn btn-warning btn-block"><span class="glyphicon glyphicon-plus"></span></button>'+
          '</div>'+

          '<div class="col-md-2 ag-bold s15" style="padding-top:15px">'+
            'Destinatarios:'+
          '</div>'+
          '<div class="form-group col-md-10">'+
            '<ul id="destRecomendacion" class="list-inline">'+
            '</ul>'+
          '</div>'+
        '</form>'+

        '<div class="form-group">'+
          '<div class="form-group col-md-12">'+
             '<textarea id="mensajeRecomendar" class="form-control" rows="3" placeholder="mensaje para los recomendados" style="resize: none;margin-top: -10px;"></textarea>'+
          '</div>'+
       '</div>'+

        '<div class="row">'+
          '<div class="form-group col-md-12">'+
              '<div class="col-md-4">'+
                  '<div class="form-group">'+
                      '<input type="button" class="btn btn-danger btn-md btn-block" id="btnRegMed" value="Cancelar" onclick="bootbox.hideAll();">'+
                  '</div>'+
              '</div>'+
              '<div class="col-md-6 col-md-offset-2">'+
                  '<div class="form-group">'+
                      '<input type="button" class="btn btn-primary btn-md btn-block" id="btnRegMed" value="Enviar" onclick="enviarRecomendacion();">'+
                  '</div>'+
              '</div>'+
          '</div>'+
        '</div>'
    });
    recomiendaAuto();
  }
}
//<--------------------- FIN RECOMENDACIONES --------------->

//<--------------------- PEDIR RECOMENDACIONES ------------->
    function pedirRecomendacionesBoot(){
      var nombreUsuario = '';

      $.ajax( {
        async: false,
        url: '/usuario/traer',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
          'id': $('#usuarioPerfil').val()
        },
        success: function ( data ) {
          if (!data.DatosGenerale.apellidoM) data.DatosGenerale.apellidoM = '';
          nombreUsuario = 'Dr. ' + data.DatosGenerale.nombre  + ' ' + data.DatosGenerale.apellidoP + ' ' + data.DatosGenerale.apellidoM;
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });

      $('.modal-body').css('padding',0);
      bootbox.dialog({
        onEscape: function () {
          bootbox.hideAll();
        },
        className: 'Intermed-Bootbox',
        title: '<span class="title">Pedir una Recomendación al ' + nombreUsuario + '</span>',
        size:'large',
        message:
        '<div class="col-md-12"><div class="row">'+
          '<div class="form-group">'+
            '<label for="especialidadesMedic" class="control-label" style="color:white;">Seleccione la(s) especialidad(es) que le interesan:</label>'+
            '<select id="especialidadesMedic" onChange="cargando(\'#especialidadesMedic\');" class="form-control">'+
            '</select>'+
          '</div>'+
          '<div class="" id="tipoRecomendacionPedir">'+
            '<ul class="list-inline"></ul>'+
          '</div>'+
        '</div></div>'+
        '<div class="row">'+
            '<div class="col-md-4">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-danger btn-md btn-block" id="btnRegMed" value="Cancelar" onclick="bootbox.hideAll();">'+
                '</div>'+
            '</div>'+
            '<div class="col-md-6 col-md-offset-2">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-primary btn-md btn-block" id="btnRegMed" value="Pedir" onclick="enviandoPeticion();">'+
                '</div>'+
            '</div>'+
        '</div>'
      });
    }
//<------------------- FIN PEDIR RECOMENDACIONES ----------->
//<------------------- LOGIN ------------------------------->
function loginModal(){
  $('.modal-body').css('padding',0);
  //action="/auth/correo"
  bootbox.dialog({
    onEscape: function () {
    bootbox.hideAll();
  },
    size:'medium',
    className: 'Intermed-Bootbox',
    title: '<span class="title">Intermed<sup>&reg;</sup> | Login</span>',
    backdrop:true,
    message:
      '<div class="" id="logInicio">'+
        '<form onsubmit="return iniciarSesionLocal(\'email\',\'password\');">'+
          '<div class="row">'+
            '<div class="col-md-8 col-md-offset-2">'+
              '<div class="form-group">'+
                '<button type="button" name="loginFB" class="btn btn-facebook btn-block btn-lg" onclick="window.location=\'/auth/facebook/request/loguin\'"><span class="icon icon-facebook2"></span> Login con Facebook</button>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-1"><hr class="hidden"></div>'+
          '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-10 s15 text-uppercase text-center dark-c"><br>o ingresa con tu correo:</div>'+
          '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-1"><hr class="hidden"></div>'+
          '<div class="row">'+
            '<div class="col-md-8 col-md-offset-2">'+
              '<div class="form-group" id="emailGroup">'+
                '<input type="text" class="form-control input-lg" id="email" name="email" placeholder="Usuario o Correo" required="true" aria-describedby="emailP">'+
                /*'<span  id="emailIcon" class="" aria-hidden="true"></span>'+
                '<span class="sr-only" id="emailP">(success)</span>'+
                '<div id="mail-error"></div>'+*/
              '</div>'+
              '<div class="form-group" id="passwordGroup">'+
                '<input type="password" class="form-control input-lg" id="password" name="password" placeholder="Contraseña" required="true" aria-describedby="passwordP">'+
                /*'<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                '<span class="sr-only" id="passwordP">(success)</span>'+
                '<div id="pass-error"></div>'+*/
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="alert alert-info hidden text-center text-uppercase" id="LoginError" role="alert"> <strong>Correo o contraseña incorrectos.</strong></div>'+
          '<div class="row footerBootbox" id="fin">'+
            '<div class="col-md-6 pull-right">'+
              '<input type="submit" name="login" value="Ingresar" class="btn btn-warning btn-lg btn-block">'+
            '</div>'+
            '<div class="col-md-6 pull-left">'+
              '<p class="text-center">'+
                '¿Olvidaste tus datos de acceso? <br><a class="whiteF" href="#">Haz click aqui para recuperarlos</a>'+
              '</p>'+
            '</div>'+
          '</div>'+
        '</form>'+
      '</div><!-- fin del div principal -->'
  });
  /*validateForm('input-correo','email');
  validateForm('input-password','password');*/
}
//<------------------- FIN LOGIN --------------------------->
//<------------------- INVITAR ----------------------------->
  function invitarModal(){
    $('.modal-body').css('padding',0);
    bootbox.dialog({
      onEscape: function () {
      bootbox.hideAll();
    },
      size:'medium',
      className: 'Intermed-Bootbox',
      title: '<span class="title">Invitar a Intermed&reg</span>',
      message:
      '<div id="addFormaForm" class="" arialabelledby="addForma">'+
        '<form class="form-horizontal text-left">'+
          '<div class="form-group">'+
            '<label class="col-md-2 control-label">Nombre</label>'+
            '<div class="col-md-10">'+
              '<input type="text" class="form-control" id="invitar_nombre">'+
            '</div>'+
          '</div>'+
          '<div class="form-group">'+
            '<label class="col-md-2 control-label">Correo</label>'+
            '<div class="col-md-10">'+
              '<input type="text" class="form-control" id="invitar_correo">'+
            '</div>'+
          '</div>'+
          '<div class="form-group">'+
            '<label class="col-md-2 control-label">Mensaje</label>'+
            '<div class="col-md-10">'+
              '<textarea class="form-control" id="invitar_mensaje" style="resize:none">Te invito a unirte a Intermed</textarea>'+
            '</div>'+
          '</div>'+
          '<div class="col-md-4 col-md-offset-8">'+
            '<button type="button" class="btn btn-primary btn-block dropdown-form-guardar" onclick="procesarInvitacion()">Enviar</button>'+
          '</div>'+
        '</form>.'+
      '</div>'
    });
  }
//<------------------- FIN INVITAR ------------------------->
function registro(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
    bootbox.hideAll();
  },
    size:'large',
    backdrop: true,
    closeButton:true,
    className: 'Intermed-Bootbox',
    title: '<span class="title">Intermed<sup>&reg;</sup> | Registro</span>',
    message:
    '<div id="CatRegModal">'+
      '<ul class="nav nav-tabs nav-justified" role="tablist">'+
        '<li role="presentation" class="active"><a href="#registroMedicos" aria-controls="registroMedicos" role="tab" data-toggle="tab">MEDICO</a></li>'+
        '<li role="presentation"><a href="#registroPacientes" aria-controls="registroPacientes" role="tab" data-toggle="tab">PACIENTE</a></li>'+
      '</ul>'+
      '<div class="tab-content">'+
        '<div role="tabpanel" class="tab-pane active" id="registroMedicos">'+
          '<div id="RegMedModal" class="Flama-normal">'+
            '<form method="POST" action="/reg/local" id="frm_regM" onsubmit="return encriptarPass(\'contrasenaRegM\',\'passEncriptM\')">'+
              '<div class="row">'+
                '<div class="col-lg-6 col-md-6 regFacebook">'+
                  '<h3>Intermed <sup>&reg;</sup> es mejor'+
                    '<br>con Facebook</h3>'+
                  '<br>'+
                  '<button name="registroFB" class="btn btn-facebook btn-block s20" onclick="window.location=\'/auth/facebook/request/M\'"><span class="icon icon-facebook2"></span> Regístrate con Facebook</button>'+
                  '<br>'+
                  '<h2 class="Flama-bold">¡En un solo click!</h2>'+
                  '<p class="s20 flamaBook-normal">'+
                    'Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.'+
                  '</p>'+
                  '<p class="s15 flamaBook-normal">'+
                    'Intermed no comparte tus datos con terceras personas ni compañias externas.'+
                  '</p>'+
                '</div>'+
                '<div class="col-lg-6 col-md-6 regCorreo">'+
                  '<h3>Regístrate con tu correo electrónico</h3>'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<div id="alertErrorM"></div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="form-group">'+
                        '<input type="hidden" name="tipoUsuario" value="M">'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="form-group  has-feedback" id="emailGroup">'+
                        '<input type="email" class="form-control" id="correoRegM" name="email" placeholder="Correo Electrónico" aria-describedby="correoRegMP">'+
                        '<span id="emailIcon" class="" aria-hidden="true"></span>'+
                        '<span class="sr-only" id="correoRegMP">(success)</span>'+
                        '<div id="email-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="form-group  has-feedback" id="conemailGroup">'+
                        '<input type="email" class="form-control" id="correoConfirmRegM" placeholder="Confirma tu correo Electrónico" aria-describedby="correoConfirmRegMP">'+
                        '<span id="conemailIcon" class="" aria-hidden="true"></span>'+
                        '<span class="sr-only" id="correoConfirmRegMP">(success)</span>'+
                        '<div id="conFemail-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="form-group  has-feedback" id="passwordGroup">'+
                        '<input type="hidden" id="passEncriptM" name="password">'+
                        '<input type="password" class="form-control" id="contrasenaRegM" placeholder="Contraseña" pattern=".{6,13}" aria-describedby="contraseñaRegMP">'+
                        '<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                        '<span class="sr-only" id="contraseñaRegMP">(success)</span>'+
                        '<div id="pass-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12" id="confirmGroup">'+
                      '<div class="form-group  has-feedback">'+
                        '<input type="password" class="form-control" id="contrasena2RegM" placeholder="Confirma tu contraseña" pattern=".{6,13}" aria-describedby="contraseña2RegMP">'+
                        '<span id="confirmIcon" class="" aria-hidden="true"></span>'+
                        '<span class="sr-only" id="contraseña2RegMP">(success)</span>'+
                        '<div id="conf-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row footerBootbox">'+
                '<div class="col-md-6">'+
                  '<p class="s15 text-center">'+
                    '<small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.'+
                  '</p>'+
                '</div>'+
                '<div class="col-md-6">'+
                  '<input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-warning btn-lg btn-block s20">'+
                '</div>'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+
        '<div role="tabpanel" class="tab-pane" id="registroPacientes">'+
          '<div id="RegPacModal" class="Flama-normal">'+
            '<form method="POST" action="/reg/local" id="frm_regP" onsubmit="return encriptarPass(\'contrasenaRegP\',\'passEncriptP\')">'+
              '<div class="row">'+
                '<div class="col-lg-6 col-md-6 regFacebook">'+
                  '<h3>Intermed <sup>&reg;</sup> es mejor'+
                    '<br>con Facebook</h3>'+
                  '<br>'+
                  '<button name="registroFB" class="btn btn-facebook btn-block s20" onclick="window.location=\'/auth/facebook/request/P\'"><span class="icon icon-facebook2"></span> Regístrate con Facebook</button>'+
                  '<br>'+
                  '<h2 class="Flama-bold">¡En un solo click!</h2>'+
                  '<p class="s20 flamaBook-normal">'+
                    'Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.'+
                  '</p>'+
                  '<p class="s15 flamaBook-normal">'+
                    'Intermed no comparte tus datos con terceras personas ni compañias externas.'+
                  '</p>'+
                '</div>'+
                '<div class="col-lg-6 col-md-6 regCorreo">'+
                  '<h3>Registrate con tu correo electrónico</h3>'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<div id="alertError"></div>'+
                    '</div>'+
                    '<div class="col-md-6">'+
                      '<div class="form-group">'+
                        '<input type="text" class="form-control" id="nombreReg"  name="first_name" placeholder="Nombre" required="true">'+
                        '<span id="nameIcon" class="" aria-hidden="true"></span>'+
                        '<div id="nombre-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-6">'+
                      '<div class="form-group" id="apellidoGroup">'+
                        '<input type="text" class="form-control" id="ApellidoReg" name="last_name" placeholder="Apellido" required="true">'+
                        '<span id="apellidoIcon" class="" aria-hidden="true"></span>'+
                        '<div id="apellido-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="form-group" id="emailGroup">'+
                        '<input type="email" class="form-control" id="correoReg" name="email" placeholder="Correo Electrónico" required="true">'+
                        '<span id="emailIcon" class="" aria-hidden="true"></span>'+
                        '<div id="email-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-6">'+
                      '<div class="form-group" id="passwordGroup">'+
                        '<input type="hidden" id="passEncriptP" name="password">'+
                        '<input type="password" class="form-control" id="contrasenaRegP" placeholder="Contraseña" pattern=".{6,13}" required="true">'+
                        '<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                        '<div id="pass-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-6">'+
                      '<div class="form-group" id="confirmGroup">'+
                        '<input type="password" class="form-control" id="contrasena2RegP" name="password2" placeholder="Confirma tu contraseña" pattern=".{6,13}" required="true">'+
                        '<span id="confirmIcon" class="" aria-hidden="true"></span>'+
                        '<div id="conf-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<br><h4>'+
                        '<small>Nacimiento</small>'+
                      '</h4>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<div class="form-group" id="diaGroup">'+
                        '<input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">'+
                        '<span id="diaIcon" class="" aria-hidden="true"></span>'+
                        '<div id="dia-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<div class="form-group" id="mesGroup">'+
                        '<input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">'+
                        '<span id="mesIcon" class="" aria-hidden="true"></span>'+
                        '<div id="mes-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<div class="form-group" id="añoGroup">'+
                        '<input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">'+
                        '<span id="añoIcon" class="" aria-hidden="true"></span>'+
                        '<div id="año-error"></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<h4>'+
                        '<small>Sexo</small>'+
                      '</h4>'+
                    '</div>'+
                    '<div class="col-md-4">'+
                      '<div class="radio">'+
                        '<label>'+
                          '<input type="radio" name="gender" id="sexM" value="M" checked required="true"> Masculino'+
                        '</label>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-4">'+
                      '<div class="radio">'+
                        '<label>'+
                          '<input type="radio" name="gender" id="sexF" value="F" required="true"> Femenino'+
                        '</label>'+
                      '</div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />'+
                      '<!-- TIMESTAMPS -->'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row footerBootbox">'+
                '<div class="col-md-6">'+
                  '<p class="s15 text-center">'+
                    '<small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.'+
                  '</p>'+
                '</div>'+
                '<div class="col-md-6">'+
                  '<input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-warning btn-lg btn-block s20">'+
                '</div>'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'
  });
}

function regPaciente(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
    backdrop: true,
    className: 'Intermed-Bootbox',
    title: '<span class="title FlamaBook-normal regHeader">Intermed&reg / <b>Registro Pacientes</b></span>',
    size:'large',
    closeButton:true,
    message:
      '<div id="RegPacModal" class="Flama-normal">'+
          '<form method="POST" action="/reg/local" id="frm_regP" onsubmit="return encriptarPass(\'contrasenaReg\',\'contrasena2Reg\')">'+
              '<div class="">'+
                '<div class="row">'+
                  '<div class="col-md-6 regFacebook">'+
                    '<h3>Intermed <sup>&reg;</sup> es mejor'+
                      '<br>con Facebook</h3>'+
                    '<br>'+
                    '<button name="registroFB" class="btn btn-facebook btn-block s20" onclick="window.location=\'/auth/facebook/request/P\'"><span class="icon icon-facebook2"></span> Regístrate con Facebook</button>'+
                    '<br>'+
                    '<h2 class="Flama-bold">¡En un solo click!</h2>'+
                    '<p class="s20 flamaBook-normal">'+
                      'Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.'+
                    '</p>'+
                    '<p class="s15 flamaBook-normal">'+
                      'Intermed no comparte tus datos con terceras personas ni compañias externas.'+
                    '</p>'+
                  '</div>'+
                  '<div class="col-md-6" class="regCorreo">'+
                    '<h3>Registrate con tu correo electronico</h3>'+
                    '<div class="row">'+
                      '<div class="col-md-12">'+
                        '<div id="alertError"></div>'+
                      '</div>'+
                      '<div class="col-md-6">'+
                        '<div class="form-group">'+
                          '<input type="text" class="form-control" id="nombreReg"  name="first_name" placeholder="Nombre" required="true">'+
                          '<span id="nameIcon" class="" aria-hidden="true"></span>'+
                          '<div id="nombre-error"></div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-6">'+
                        '<div class="form-group" id="apellidoGroup">'+
                          '<input type="text" class="form-control" id="ApellidoReg" name="last_name" placeholder="Apellido" required="true">'+
                          '<span id="apellidoIcon" class="" aria-hidden="true"></span>'+
                          '<div id="apellido-error"></div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<div class="form-group" id="emailGroup">'+
                          '<input type="email" class="form-control" id="correoReg" name="email" placeholder="Correo Electrónico" required="true">'+
                          '<span id="emailIcon" class="" aria-hidden="true"></span>'+
                          '<div id="email-error"></div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<div class="form-group" id="passwordGroup">'+
                          '<input type="hidden" id="passEncript" name="password" >'+
                          '<input type="password" class="form-control" id="contrasenaReg" placeholder="Contraseña" pattern=".{6,13}" required="true">'+
                          '<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                          '<div id="pass-error"></div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<div class="form-group" id="confirmGroup">'+
                          '<input type="password" class="form-control" id="contrasena2Reg" name="password2" placeholder="Confirma tu contraseña" pattern=".{6,13}" required="true">'+
                          '<span id="confirmIcon" class="" aria-hidden="true"></span>'+
                          '<div id="conf-error"></div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<h4>'+
                          '<small>Fecha de Nacimiento</small>'+
                        '</h4>'+
                        '<div class="col-md-4">'+
                          '<div class="form-group" id="diaGroup">'+
                            '<input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">'+
                            '<span id="diaIcon" class="" aria-hidden="true"></span>'+
                            '<div id="dia-error"></div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="col-md-4">'+
                          '<div class="form-group" id="mesGroup">'+
                            '<input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">'+
                            '<span id="mesIcon" class="" aria-hidden="true"></span>'+
                            '<div id="mes-error"></div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="col-md-4">'+
                          '<div class="form-group" id="añoGroup">'+
                            '<input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">'+
                            '<span id="añoIcon" class="" aria-hidden="true"></span>'+
                            '<div id="año-error"></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<h4>'+
                          '<small>Sexo</small>'+
                        '</h4>'+
                        '<div class="col-md-6">'+
                          '<div class="radio">'+
                            '<label>'+
                              '<input type="radio" name="gender" id="sexM" value="M" checked required="true"> Masculino'+
                            '</label>'+
                          '</div>'+
                        '</div>'+
                        '<div class="col-md-6">'+
                          '<div class="radio">'+
                            '<label>'+
                              '<input type="radio" name="gender" id="sexF" value="F" required="true"> Femenino'+
                            '</label>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-md-12">'+
                        '<input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />'+
                        '<!-- TIMESTAMPS -->'+
                        '<input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-warning btn-block">'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                '</div>'+
              '</div>'+
          '</form>'+
      '</div>'+
      '<div class="footerBootbox">'+
        '<p class="s15 text-right">'+
          '<small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.'+
        '</p>'+
      '</div>'
  });
  validateForm( 'input-apellido', 'ApellidoReg' );
  validateForm( 'input-nombre', 'nombreReg' );
  validateForm( 'input-correo', 'correoReg' );
  validateForm( 'input-password', 'contraseñaReg' );
  validateForm( 'input-validPass', 'contraseña2Reg' );
  validateForm( 'input-dia', 'diaNacReg' );
  validateForm( 'input-mes', 'mesNacReg' );
  validateForm( 'input-año', 'añoNacReg' );
  validateForm( 'input-select', 'selectEstado' );
  validateForm( 'input-select', 'especialidad' );
  validateForm( 'input-checkbox', 'sexF' );
  validateForm( 'input-checkbox', 'sexM' );
}

function regMedico(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
    backdrop: true,
    className: 'Intermed-Bootbox',
    title: '<span class="title FlamaBook-normal regHeader">Intermed&reg / <b>Registro Médicos</b></span>',
    size:'large',
    closeButton:true,
    message:
      '<div id="RegMedModal">'+
        '<div class="Flama-normal">'+
          '<div class="row">'+
            '<div class="col-md-6 regFacebook">'+
              '<h3>Intermed &reg es mejor'+
                '<br>con Facebook</h3>'+
              '<br>'+
              '<button name="registroFB" class="btn btn-facebook btn-block s20" onclick="window.location=\'/auth/facebook/request/M\'"><span class="icon icon-facebook2"></span> Regístrate con Facebook</button>'+
              '<br>'+
              '<h2 class="Flama-bold">¡En un solo click!</h2>'+
              '<p class="s20 flamaBook-normal">'+
                'Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.'+
              '</p>'+
              '<p class="s15 flamaBook-normal">'+
                'Intermed no comparte tus datos con terceras personas ni compañias externas.'+
              '</p>'+
            '</div>'+
            '<div class="col-md-6 regCorreo">'+
              '<h3>Regístrate con tu correo electronico</h3>'+
              '<div class="row">'+
                '<form method="POST" action="/reg/local" id="frm_regM" onsubmit="return encriptarPass(\'contrasenaRegM\',\'contrasena2RegM\')">'+
                  '<div class="col-md-12">'+
                    '<div id="alertErrorM"></div>'+
                  '</div>'+
                  '<div class="col-md-12">'+
                    '<div class="form-group">'+
                      '<input type="hidden" name="tipoUsuario" value="M">'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-12">'+
                    '<div class="form-group  has-feedback" id="emailGroup">'+
                      '<input type="email" class="form-control" id="correoRegM" name="email" placeholder="Correo Electrónico" aria-describedby="correoRegMP">'+
                      '<span id="emailIcon" class="" aria-hidden="true"></span>'+
                      '<span class="sr-only" id="correoRegMP">(success)</span>'+
                      '<div id="email-error"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-12">'+
                    '<div class="form-group  has-feedback" id="conemailGroup">'+
                      '<input type="email" class="form-control" id="correoConfirmRegM" placeholder="Confirma tu correo Electrónico" aria-describedby="correoConfirmRegMP">'+
                      '<span id="conemailIcon" class="" aria-hidden="true"></span>'+
                      '<span class="sr-only" id="correoConfirmRegMP">(success)</span>'+
                      '<div id="conFemail-error"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-12">'+
                    '<div class="form-group  has-feedback" id="passwordGroup">'+
                      '<input type="password" class="form-control" id="contrasenaRegM" name="password" placeholder="Contraseña" pattern=".{6,13}" aria-describedby="contraseñaRegMP">'+
                      '<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                      '<span class="sr-only" id="contraseñaRegMP">(success)</span>'+
                      '<div id="pass-error"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-12" id="confirmGroup">'+
                    '<div class="form-group  has-feedback">'+
                      '<input type="password" class="form-control" id="contrasena2RegM" placeholder="Confirma tu contraseña" pattern=".{6,13}" aria-describedby="contraseña2RegMP">'+
                      '<span id="confirmIcon" class="" aria-hidden="true"></span>'+
                      '<span class="sr-only" id="contraseña2RegMP">(success)</span>'+
                      '<div id="conf-error"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-12">'+
                    '<input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />'+
                    '<input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-warning btn-block s20">'+
                  '</div>'+
                '</form>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="">'+
        '</div>'+
      '</div>'+
      '<div class="row text-center footerBootbox">'+
        '<p class="s15">'+
          '<small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.'+
        '</p>'+
      '</div>'
  });
  validateForm( 'input-correo', 'correoRegM' );
  validateForm( 'input-confMail', 'correoConfirmRegM' );
  validateForm( 'input-password', 'contraseñaRegM' );
  validateForm( 'input-validPass', 'contraseña2RegM' );
}

function cambioFotoPerfil(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
    backdrop: true,
    className: 'Intermed-Bootbox',
    title: '<span class="title">Selecciona el área a guardar:</span>',
    size: 'large',
    message:
    '<div  id="CambiarFotoPerfil" name="CambiarFotoPerfil" >'+
      '<form>'+
        '<div class="col-md-12">'+
          '<div class="row" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">'+
            '<input type="hidden" value="" name="base64file" id="base64file">'+
            '<div class="col-md-12" id="contenedorFoto" class="text-center" style="width: auto;margin: auto"></div>'+
            '<canvas id="canvas" height="300" width="300" style="display: none"></canvas>'+
          '</div>'+
        '</div>'+
      '</form>'+
  '</div>'+
  '<div class="row">'+
      '<div class="col-md-4">'+
          '<div class="form-group">'+
              '<input type="button" class="btn btn-danger btn-md btn-block" id="btnRegMed" value="Cancelar" onclick="bootbox.hideAll();">'+
          '</div>'+
      '</div>'+
      '<div class="col-md-6 col-md-offset-2">'+
          '<div class="form-group">'+
              '<input type="button" class="btn btn-primary btn-md btn-block" id="btnRegMed" value="Guardar" onclick="seleccionarImagenUsuario()">'+
          '</div>'+
      '</div>'+
  '</div>'
  });
}

function editaPerfBoot(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
  },
  className: 'Intermed-Bootbox',
  title: '<span class="title">Edita tu perfil.</span>',
  backdrop: true,
  size:'large',
  closeButton:true,
  message:
  '<div class="" id="tabPerfilModificar">'+
    '<ul class="nav nav-tabs menuBootbox">'+
      '<li role="presentation" class="active" onclick="loadDatosGenerales();">'+
        '<a href="#general" aria-control="general" role="tab" data-toggle="tab">'+
          '<span class="glyphicon glyphicon-th">&nbsp;Generales</span>'+
        '</a>'+
      '</li>'+
      '<li role="presentation" onclick="loadBiometricos();">'+
        '<a href="#biometricos" aria-control="biometricos" role="tab" data-toggle="tab">'+
          '<span class="glyphicon glyphicon-heart">&nbsp;Biometricos</span>'+
        '</a>'+
      '</li>'+
      '<li role="presentation" onclick="loadTelefonos();">'+
        '<a href="#emergencia" aria-control="emergencia" role="tab" data-toggle="tab">'+
          '<span class="glyphicon glyphicon-plus-sign">&nbsp;Emergencia</span>'+
        '</a>'+
      '</li>'+
    '</ul>'+
    '<div class="tab-content tabBootBox divBodyBootbox">'+
      '<div class="tab-pane active" role="tabpanel" id="general">'+
          '<div class="container-fluid">'+
            '<div class="row">'+
              '<div class="col-md-4">'+
                '<img src="" width="200" height="200" class="img-rounded" id="usuarioUrlFotoPerfil">'+
              '</div>'+
              '<div class="col-lg-8 input-group">'+
                '<input type="text" class="form-control" id="editNom" placeholder="Nombre" />'+
                '<span class="input-group-btn">'+
                  '<button id="nomEdit" class="btn btn-danger" onclick="updateName();"type="button"><span class="glyphicon glyphicon-wrench"></span></button>'+
                '</span>'+
              '</div><!-- /.col-lg-6 -->'+
              '<div class="col-lg-8 input-group">'+
                '<input type="text" class="form-control" id="editApeP" placeholder="Apelido paterno" />'+
                '<span class="input-group-btn">'+
                  '<button id="apePEdit" class="btn btn-danger" onclick="updateApellidoP();" type="button"><span class="glyphicon glyphicon-wrench" ></span></button>'+
                '</span>'+
              '</div><!-- /.col-lg-6 -->'+
              '<div class="col-lg-8 input-group">'+
                '<input type="text" class="form-control" id="editApeM" placeholder="Apellido materno" />'+
                '<span class="input-group-btn">'+
                  '<button id="apeMEdit" class="btn btn-danger" onclick="updateApellidoM();" type="button"><span class="glyphicon glyphicon-wrench" ></span></button>'+
                '</span>'+
              '</div><!-- /.col-lg-6 -->'+
              '<div class="col-lg-8">'+
                '<hr>'+
                '<h4 style="color:white" class="hidden" id="infoGeneral">Información actualizada</h4>'+
                '<h3 style="color:white" class="hidden" id="cambiandoGenerales"></h3>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '<hr>'+
        '<div class="container-fluid" id="ubicacionGeneral">'+
          '<h1 style="color:white;">Guarda tu ubicación</h1>'+
          '<div class="row">'+
            '<div class="col-md-8">'+
              '<div class="row">'+
                  '<input type="hidden" id="idDireccion" name="idDireccion" value=""/>'+
                  '<input type="hidden" id="idEstado" name="idEstado" value=""/>'+
                  '<input type="hidden" id="idMunicipio" name="idMunicipio" value=""/>'+
                  '<input type="hidden" id="idLocalidad" name="idLocalidad" value=""/>'+
                  '<input type="hidden" id="latitud" name="latitud" value=""/>'+
                  '<input type="hidden" id="longitud" name="longitud" value=""/>'+
                  '<div id="searchDiv">'+
                      '<input id="autocomplete_searchField" type="text" placeholder="Buscar Dirección">'+
                  '</div>'+
                  '<div id="direccion"></div>'+
                  '<div id="mapDiv"></div>'+
              '</div>'+
            '</div>'+
            '<div class="col-md-4">'+
              '<div class="row">'+

              '<div class="col-md-12 form-group">'+
                '<label for="slc_estados_mapa">Estado: </label>'+
                '<select type="text" class="form-control" id="slc_estados_mapa" onChange="obtenerCiudades(\'_mapa\');">'+
                '</select>'+
              '</div>'+

              '<div class="col-md-12 form-group">'+
                '<label for="slc_ciudades_mapa">Municipio/Ciudad: </label>'+
                '<select type="text" class="form-control" id="slc_ciudades_mapa" onChange="obtenerColonias(\'_mapa\');">'+
                '</select>'+
              '</div>'+

              '<div class="col-md-12 form-group">'+
                '<label for="slc_colonias_mapa">Localidad/Colonia: </label>'+
                '<select type="text" class="form-control" id="slc_colonias_mapa" >'+
                '</select>'+
              '</div>'+

              '<div class="col-md-12 form-group">'+
                '<input type="button" value="Guardar ubicación" class="btn btn-block btn-warning" onclick="guardarUbicacionPaciente()">'+
              '</div>'+


              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="tab-pane" role="tabpanel" id="biometricos">'+
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<label style="color:white">Biometricos</label>'+
            '</div>'+
            '<div class="col-md-12 form-group">'+
              '<input type="text" class="form-control" id="bioPeso" placeholder="Peso(kg.)" />'+
            '</div>'+
            '<div class="col-md-12 form-group">'+
              '<input type="text" class="form-control" id="bioAltura" placeholder="Altura" />'+
            '</div>'+
            '<div class="col-md-12 form-group">'+
              '<input type="text" class="form-control" id="bioSangre" placeholder="Tipo de sangre" />'+
            '</div>'+
            '<div class="col-md-12 form-group">'+
              '<select id="bioGenero" class="form-control">'+
                '<option value="0">--Genero--</option>'+
                '<option value="M">Masculino</option>'+
                '<option value="F">Femenino</option>'+
              '</select>'+
            '</div>'+
            '<div class="col-md-12 form-group">'+
              '<button class="btn btn-danger form-control" onclick="addBio();" id="addBio" type="button">'+
                '<span class="glyphicon glyphicon-plus">&nbsp;Agregar</span>'+
              '</button>'+
            '</div>'+
            '<div class="col-md-12 hidden" id="confirmacionBio">'+
              '<h4 style="color:white"><span class="glyphicon glyphicon-ok">&nbsp;Informacion guardada correctamente</span></h4>'+
            '</div>'+
            '<div class="col-md-12 hidden" id="negadoBio">'+
              '<h4 style="color:white"><span class="glyphicon glyphicon-remove">&nbsp;Fallo al guardar la informacion</span></h4>'+
            '</div>'+
            '<div class="col-md-12 hidden" id="delBio">'+
              '<h4 style="color:white"><span class="glyphicon glyphicon-trash">&nbsp;Informacion borrada...</span></h4>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<hr>'+
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-12 hidden" id="noBiometrico">'+
              '<h2 style="color:red;">Aun no ha registrado ningun biometrico</h2>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<table class="table table-condensed">'+
                '<thead style="color:white;">'+
                  '<tr>'+
                    '<th><center><span class="glyphicon glyphicon-scale">&nbsp;Peso</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-resize-vertical">&nbsp;Altura(cm)</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-question-sign">&nbsp;Tipo de sangre</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-user">&nbsp;Genero</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-remove-sign">&nbsp;Eliminar</span></center></th>'+
                  '</tr>'+
                '</thead>'+
                '<tbody id="bioBody">'+
                '</tbody>'+
              '</table>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="tab-pane" role="tabpanel" id="emergencia">'+
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-3 form-group">'+
              '<input type="text" class="form-control" id="bioNombretel" placeholder="Nombre del contacto" />'+
            '</div>'+
            '<div class="col-md-3 form-group">'+
              '<input type="text" class="form-control" id="bioTel" placeholder="Telefono" />'+
            '</div>'+
            '<div class="col-md-3 checkbox form-group">'+
              '<label style="color:white;">'+
                '<input type="checkbox" id="esMedic" name="esMedic" value="1">¿Es medico?'+
              '</label>'+
            '</div>'+
            '<div class="col-md-3 form-group">'+
              '<button type="button" id="bioTelbutton" onclick="addTelefon();" class="form-control btn btn-danger">'+
                '<span class="glyphicon glyphicon-phone-alt">&nbsp;Agregar</span>'+
              '</button>'+
            '</div>'+
            '<div class="col-md-12 hidden" id="telAdd">'+
              '<h4 style="color:white;"><span class="glyphicon glyphicon-phone-alt">&nbsp;Contacto agregado</span></h4>'+
            '</div>'+
            '<div class="col-md-12 hidden" id="deleFon">'+
              '<h4 style="color:white;"><span class="glyphicon glyphicon-remove">&nbsp;Contacto eliminado</span></h4>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<hr>'+
        '<div class="container-fluid hidden" id="noTelefono">'+
          '<div class="row">'+
            '<h2 style="color:red">UD. No tiene agregado telefono de emergencia</h2>'+
          '</div>'+
        '</div>'+
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<table class="table table-condensed">'+
                '<thead style="color:white;">'+
                  '<tr>'+
                    '<th><center><span class="glyphicon glyphicon-user">&nbsp;Nombre</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-phone-alt">&nbsp;Telefonos</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-user">&nbsp;Es mi medico</span></center></th>'+
                    '<th><center><span class="glyphicon glyphicon-remove-sign">&nbsp;Eliminar</span></center></th>'+
                  '</tr>'+
                '</thead>'+
                '<tbody id="telBody" style="color:white;"></tbody>'+
              '</table>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div><!-- PRINCIPAL -->'
  });
  loadDatosGenerales();
  cargarMapaPaciente();
}

function registroMedicoDatosPersonales(){

  var nombre = '', apellidop = '', apellidom = '';
  var curpRegMed = '', cedulaRegMed = '';
  var genderF = '', genderM = '';

  var continuar = true;
  $.ajax( {
    async: false,
    url: '/informacionRegistroMedico',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success ){
        if ( data.result.DatosGenerale) {
          nombre = data.result.DatosGenerale.nombre;
          apellidop = data.result.DatosGenerale.apellidoP;
          apellidom = data.result.DatosGenerale.apellidoM;
        }
        else continuar = false;

        if ( data.result.Biometrico ) {
          if ( data.result.Biometrico.genero == "F"){
            genderF = ' checked ';
          }
          else if ( data.result.Biometrico.genero == "M"){
            genderM = ' checked ';
          }
        }else continuar = false;

        if ( data.result.Medico && data.result.Medico.curp) {
          curpRegMed = data.result.Medico.curp;
          cedulaRegMed = data.result.Medico.cedula;
        }
        else continuar = false;

          if (continuar){
            //registroMedicoDatosPago();
          } else {
            $('.modal-body').css('padding',0);
            bootbox.dialog({
              backdrop: true,
              size:'large',
              closeButton: false,
              onEscape: function () {
                  bootbox.hideAll();
              },
              className: 'Intermed-Bootbox',
              title: '<span class="title FlamaBook-normal regHeader">Intermed® / <b>Registro Médicos</b></span>',
              message:
              '<div class="divBodyBootbox">'+


                '<form id="regMedStepOne">'+
                  '<div class="row topMsgReg">'+
                    '<div class="col-md-12">'+
                      '<h4 class="Flama-bold s20">¡Bienvenido Dr.!'+
                        '<small></small>'+
                      '</h4>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<div id="alertError"></div>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                      '<div class="regBox">'+
                        '<div class="row">'+
                          '<div class="col-md-4">'+
                            '<div class="form-group">'+
                              '<label class="Flama-normal s15" for="nombreRegMed">Nombres</label>'+
                              '<input type="text" class="form-control" id="nombreRegMed" name="nombreRegMed" placeholder="Nombres" value="'+ nombre +'">'+
                            '</div>'+
                          '</div>'+
                          '<div class="col-md-4">'+
                            '<div class="form-group">'+
                              '<label class="Flama-normal s15" for="apePatRegMed">Apellido Paterno</label>'+
                              '<input type="text" class="form-control" id="apePatRegMed" name="apePatRegMed" placeholder="Apellido Paterno" value="'+ apellidop +'">'+
                            '</div>'+
                          '</div>'+
                          '<div class="col-md-4">'+
                            '<div class="form-group">'+
                              '<label class="Flama-normal s15" for="apePatRegMed">Apellido Materno</label>'+
                              '<input type="text" class="form-control" id="apeMatRegMed" name="apeMatRegMed" placeholder="Apellido Materno" value="'+ apellidom +'">'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="row">'+
                          '<div class="col-md-6">'+
                            '<div class="row">'+
                              '<div class="col-md-12">'+
                                '<label class="Flama-normal s15">Fecha de Nacimiento</label>'+
                              '</div>'+
                            '</div>'+
                            '<div class="row">'+
                              '<div class="col-md-4">'+
                                '<div class="form-group">'+
                                  '<input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">'+
                                '</div>'+
                              '</div>'+
                              '<div class="col-md-4">'+
                                '<div class="form-group">'+
                                  '<input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">'+
                                '</div>'+
                              '</div>'+
                              '<div class="col-md-4">'+
                                '<div class="form-group">'+
                                  '<input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                          '<div class="col-md-6">'+
                            '<div class="col-md-12">'+
                              '<label class="Flama-normal s15">Sexo</label>'+
                            '</div>'+
                            '<div class="col-md-6">'+
                              '<div class="radio">'+
                                '<label>'+
                                  '<input type="radio" name="gender" id="sexM" value="M" '+ genderM +'> Masculino'+
                                '</label>'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-6">'+
                              '<div class="radio">'+
                                '<label>'+
                                  '<input type="radio" name="gender" id="sexF" value="F" '+ genderF +'> Femenino'+
                                '</label>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<hr class="separator2">'+
                      '<div class="regBox">'+
                        '<div class="row">'+
                          '<div class="col-md-6">'+
                            '<div class="form-group">'+
                              '<label class="Flama-normal s15" for="curpRegMed">CURP</label>'+
                              '<input type="text" class="form-control" id="curpRegMed" name="curpRegMed" placeholder="CURP"  value="'+ curpRegMed +'">'+
                            '</div>'+
                          '</div>'+
                          '<div class="col-md-6">'+
                            '<div class="form-group">'+
                              '<label class="Flama-normal s15" for="cedulaRegMed">Cedula Profesional</label>'+
                              '<div class="input-group">'+
                                '<input type="text" class="form-control" id="cedulaRegMed" name="cedulaRegMed" placeholder="CEDULA"  value="'+ cedulaRegMed +'">'+
                                '<span class="input-group-addon verificarAddon">'+
                                  '<input type="hidden" id="cedulaCurpVerificados" value="">'+
                                  '<button class="btn btn-warning verificarBtn Flama-normal s15" onclick="verificarCurpCedula()">Verificar</button>'+
                                '</span>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<hr class="separator2">'+
                    '<!-- Especialidades -->'+
                    '<div class="row">'+
                      '<h4 style="color:white;">Especialidades</h4>'+
                      '<div class="col-md-4 form-group">'+
                        '<select id="autoEspecialidad" class="form-control"></select>'+
                      '</div>'+
                      '<div class="col-md-4 checkbox form-group">'+
                        '<label style="color:white">'+
                          '<input type="checkbox" id="subEspEdit" name="subEsp" value="0"/>¿Es sub especialidad?'+
                        '</label>'+
                      '</div>'+
                      '<div class="col-md-4 form-group">'+
                        '<button id="addEspecialidadMedic" onclick="editEspecialidades();" class="btn btn-warning form-control" type="button">'+
                          '<span class="glyphicon glyphicon-floppy-disk"></span>'+
                        '</button>'+
                      '</div>'+
                    '</div>'+
                    '<!-- fin add Especialidades -->'+
                    '<div class="row">'+
                      '<div class="col-md-3 col-md-offset-9">'+
                        '<input type="button" id="regi" name="registroCorreo" value="Guardar" class="btn btn-warning btn-block btn-step" onclick="saveStepOne()" style="margin-top:10px;margin-bottom:10px">'+
                      '</div>'+
                    '</div>'+
                '</form>'+

              '</div>'+
              '</div>'
          });
        }

      } else {
        continuar = false;
        if (data.error){
          //Manejador de errores
        }
      }
    },
    error: function (error){
        console.log('Ajax error: ' + JSON.stringify(error));
    }
  });
  loadEspecialidades();
}


function registroMedicoDatosPago(){
  var continuar = true;
  $.ajax( {
    async: false,
    url: '/informacionRegistroMedico',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success ){
          if ( data.result.Medico.pago == 0 ) {
            continuar = false;
          }

          if (!continuar){

            $('.modal-body').css('padding',0);
            bootbox.dialog({
              backdrop: true,
              closeButton: false,
              onEscape: function () {
                  bootbox.hideAll();
              },
              size:'large',
              className: 'Intermed-Bootbox',
              title: '<span class="title FlamaBook-normal regHeader">Intermed® / <b>Registro Médicos</b></span>',
              message:
              '<div class="divBodyBootbox">'+
                '<div class="row topMsgReg">'+
                  '<div class="col-md-8">'+
                    '<h4 class="Flama-bold s20">Selecciona tu forma de pago.</h4>'+
                  '</div>'+
                  '<div class="col-md-4">'+
                    '<div class="msgPrecio text-center FlamaBook">'+
                      '<span class="trngl"></span>Recuerda que tu suscripción tiene un costo mensual de $1,000.00'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                  '<div class="col-md-12">'+
                    '<form class="radio">'+
                      '<div id="tarjOpt">'+
                        '<label class="bigLabel Flama-normal">'+
                          '<input type="radio" name="optionsRadios" id="tarjetaOptReg" value="tarjeta" checked=""> Tarjeta de crédito'+
                        '</label>'+
                        '<div id="tarjOptBox" class="regBox">'+
                          '<div class="row">'+
                            '<div class="col-md-3">'+
                              '<div class="form-group">'+
                                '<label class="Flama-normal s15" for="tipoTarjetaRegMed">Tipo de tarjeta</label>'+
                                '<input type="text" class="form-control" id="tipoTarjetaRegMed" name="tipoTarjetaRegMed" placeholder="Visa / Mastercard / etc">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-3">'+
                              '<div class="form-group">'+
                                '<label class="Flama-normal s15" for="numTarjetaRegMed">Número de la tarjeta</label>'+
                                '<input type="text" class="form-control" id="numTarjetaRegMed" name="numTarjetaRegMed" placeholder="xxxx-xxxx-xxxx-xxxx">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-6">'+
                              '<div class="row">'+
                                '<div class="col-md-4">'+
                                  '<div class="form-group">'+
                                    '<label class="Flama-normal s15" for="vencMesTarjetaRegMed">Vencimiento</label>'+
                                    '<input type="number" class="form-control" id="vencMesTarjetaRegMed" name="vencMesTarjetaRegMed" placeholder="Mes">'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col-md-4">'+
                                  '<div class="form-group">'+
                                    '<label class="Flama-normal s15" for="vencAñoTarjetaRegMed">Vencimiento</label>'+
                                    '<input type="number" class="form-control" id="vencAñoTarjetaRegMed" name="vencAñoTarjetaRegMed" placeholder="Año">'+
                                  '</div>'+
                                '</div>'+
                                '<div class="col-md-4">'+
                                  '<div class="form-group">'+
                                    '<label class="Flama-normal s15" for="seguridadTarjetaRegMed">Seguridad</label>'+
                                    '<div class="input-group">'+
                                      '<input type="password" class="form-control" id="seguridadTarjetaRegMed" name="seguridadTarjetaRegMed">'+
                                      '<span class="input-group-addon glyphicon">'+
                                        '<a tabindex="0" role="button" data-toggle="popover" title="Codigo de seguridad:" data-placement="bottom" data-container="body" data-content="El numero de seguridad se encuentra al reverso de tu tarjeta.">'+
                                          '<span class="glyphicon-question-sign"></span>'+
                                        '</a>'+
                                      '</span>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-5">'+
                              '<div class="form-group">'+
                                '<label class="Flama-normal s15" for="nombreTarjetaRegMed">Nombre del titular</label>'+
                                '<input type="text" class="form-control" id="nombreTarjetaRegMed" name="nombreTarjetaRegMed" placeholder="Tal como aparece en la tarjeta">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-2">'+
                              '<div class="form-group">'+
                                '<label>'+
                                  '<br>'+
                                '</label>'+
                                '<input type="button" id="registraTarjeta" name="registraTarjeta" value="Pagar" class="btn btn-warning btn-block Flama-normal s15" onclick="saveStepTwo()">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-5 secureStamp">'+
                              '<div class="row">'+
                                '<div class="col-md-12">'+
                                  '<p>'+
                                    '<span class="glyphicon glyphicon-lock"></span>'+
                                    '<strong>Este es un sitio seguro</strong>'+
                                    '<br>'+
                                    '<small>Utilizamos conexiones seguras para proteger su información.</small>'+
                                  '</p>'+
                                '</div>'+
                              '</div>'+
                              '<div class="securedImgs row">'+
                                '<div class="col-md-3">'+
                                  '<img alt="verisign" src="/img/verisign.png">'+
                                '</div>'+
                                '<div class="col-md-2">'+
                                  '<img alt="ssl" src="/img/ssl.png">'+
                                '</div>'+
                                '<div class="col-md-7">'+
                                  '<img alt="newchannel" src="/img/newchannel-350x61.png">'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<hr class="separator3" >'+
                      '<div id="paypalOpt" style="margin-top:5px">'+
                        '<label class="bigLabel Flama-normal">'+
                          '<input type="radio" name="optionsRadios" id="paypalOptReg" value="paypal"> PayPal'+
                        '</label>'+
                        '<div id="paypalOptBox" class="regBox">'+
                          '<div class="row">'+
                            '<div class="col-md-5">'+
                              '<div class="form-group">'+
                                '<label class="Flama-normal s15" for="paypalUser">Usuario de PayPal</label>'+
                                '<input type="text" class="form-control" id="paypalUser" name="paypalUser" placeholder="Usuario">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-5">'+
                              '<div class="form-group">'+
                                '<label class="Flama-normal s15" for="paypalPass">Constraseña</label>'+
                                '<input type="passwrod" class="form-control" id="paypalPass" name="paypalPass" placeholder="Contraseña">'+
                              '</div>'+
                            '</div>'+
                            '<div class="col-md-2">'+
                              '<label>'+
                                '<br>'+
                              '</label>'+
                              '<input type="button" id="paypalLogin" name="paypalLogin" value="PayPal Login" class="btn btn-warning btn-block Flama-normal s15">'+
                            '</div>'+
                          '</div>'+
                          '<div class="row">'+
                            '<div class="col-md-12">'+
                              '<a href="#">¿Olvidaste tu Usuario o Contraseña de Paypal? Haz click aquí.</a>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</form>'+
                  '</div>.'+

              '</div>'
            });

            $('#tarjetaOptReg').change(function(){
              $('#paypalOptBox').find('input').not(':input[type=button], :input[type=submit]').prop('value','');
              $('#tarjOptBox').find('input').prop('disabled',false);
              $('#paypalOptBox').find('input').prop('disabled',true);
              $('#tarjOptBox').find('input').first().focus();
            });

            $('#paypalOptReg').change(function(){
              $('#tarjOptBox').find('input').not(':input[type=button], :input[type=submit]').prop('value','');
              $('#tarjOptBox').find('input').prop('disabled',true);
              $('#paypalOptBox').find('input').prop('disabled',false);
              $('#paypalOptBox').find('input').first().focus();
            });

            setTimeout(function(){
              $('#tarjetaOptReg').change();
            },500);
          }
        }
      },
      error: function( error ){
        console.log('AJAX ERROR: ' +JSON.stringify(error));
      }
    });
}

function manejadorDeErrores(error){
  var codigoError = '';
  var descripcionError = '';
  var solucion = '';
  var box = false;
  var accion = '<button onclick="$(\'.bootbox\').last().modal(\'hide\');if($(\'.bootbox\')){ setTimeout(function(){$(\'body\').addClass(\'modal-open\');},300)}" class="btn btn-md btn-warning" style="margin-top:20px;margin-bottom:20px;">Aceptar</button>';
    switch (error) {
      case 1:
        codigoError = 'GEN0001';
        descripcionError = 'Sesión cerrada de manera inesperada.';
        solucion = '<span class="s15">Actualiza la página para solucionar este problema.</span>';
        accion = '<div class="col-md-12" style="color:white"><div class="row text-center"></div></div><button onclick="location.reload()" class="btn btn-md btn-warning" style="margin-top:20px;margin-bottom:20px;">Actualizar <span class="glyphicon glyphicon-refresh"></span></button>';
        //No sesión
        break;
      case 101:
        codigoError = 'MED0001';
        descripcionError = 'La CURP proporcionada ya se encuentra registrada.';
        solucion = '<span class="s15">Verifique que la CURP ingresada sea correcta, de ser así comuniquese con Intermed al número 01800123123.</span>';
      break;
      case 102:
        codigoError = 'MED0002';
        descripcionError = 'La cédula proporcionada ya se encuentra registrada.';
        solucion = '<span class="s15">Verifique que la CEDULA ingresada sea correcta, de ser así comuniquese con Intermed al número 01800123123.</span>';
        break;
      default:
        console.log('Error desconocido: [code:' + error+']');
    }

  var backdrop = true;

  if ($('.bootbox').length>0){
    backdrop = false;
  }

  $('.modal-body').css('padding',0);
  box = bootbox.dialog({
    backdrop: backdrop,
    closeButton: true,
    className: 'Intermed-Bootbox',
    title: '<span class="title"></span>',
    size:'small',
    message:
    '<style>.modal-header .close {margin-top: -17px;margin-right: -9px;}</style>'+
    '<div class="divBodyBootbox">'+
      '<center>'+
      '<div class="col-md-12" style="color:white">'+
        '<div class="row">'+
        '<h3 class="s20">Oh, oh, algo salió mal.</h3>'+
        '</div>'+
      '</div>'+
      '<div class="col-md-12" style="margin-top:10px">'+
        '<div class="row">'+
          '<div class="well  well-sm" style="background-color: rgba(0, 0, 0, 0.2);border-color: rgba(0, 0, 0, 0.3)">'+
            '<small>Error: '+codigoError+'</small><br/>'+
            '<small>Descripción: '+ descripcionError +'</small>'+
          '</div>'+
          '<br/>'+
          solucion+
        '</div>'+
      '</div>'+
      accion+
      '</center>'+
    '</div>'
  });
}

var newWindow = null;
var timeoutF = null;

function registrarseFacebook(callback, usuarioMedico_id){
  newWindow = window.open('/auth/facebook/request/P','_blank');

  timeoutF = setInterval(function(){
    var tipoUsuario = revisarTipoSesion();
    if (tipoUsuario == 'P'){
      //$('#loadDiv').remove();
      CancelarLogin();
      bootbox.hideAll();
      callback = window[callback];
      callback(usuarioMedico_id);
    }
  },2000);

  $('body').prepend('<div id="loadDiv" style="background-color: rgba(0,0,0,0.7);z-index: 30000;width: 100%;min-height: 100%;position: fixed;color: white;display: flex;   justify-content: center;"><div class="text-center" style="align-self: center;font-size: 40px;">Cargando...<br><button class="btn btn-danger" onclick="CancelarLogin()">Cancelar</button></div></div>');
}

function CancelarLogin(){
  if (timeoutF){
    clearTimeout(timeoutF);
    timeoutF = null;
  }
  if (newWindow){
    newWindow.close();
    newWindow = null;
  }
  if ($('#loadDiv').length>0){
    $('#loadDiv').remove();
  }
}

function iniciarSesionFacebook(callback, usuarioMedico_id){
    bootbox.hideAll();
    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      size:'large',
      className: 'Intermed-Bootbox',
      title: '<span class="title">Intermed<sup>&reg;</sup> | Iniciando sesión...</span>',
      message:'<div class="container-fluid"><div class="rows"><iframe src="/auth/facebook/request/loguin" id="iframeId" style="height: 600px" class="col-md-12 hidden"></iframe></div></div>'
    });

    $('#iframeId').load(function() {
        bootbox.hideAll();
        var tipoUsuario = revisarTipoSesion();
        if (tipoUsuario == ""){
          newWindow = window.open('/auth/facebook/request/loguin','_blank');

          timeoutF = setInterval(function(){
            var tipoUsuario = revisarTipoSesion();
            if (tipoUsuario == 'P'){
              CancelarLogin();
              bootbox.hideAll();
              callback = window[callback];
              callback(usuarioMedico_id);
            }
          },2000);

          $('body').prepend('<div id="loadDiv" style="background-color: rgba(0,0,0,0.7);z-index: 30000;width: 100%;min-height: 100%;position: fixed;color: white;display: flex;   justify-content: center;"><div class="text-center" style="align-self: center;font-size: 40px;">Cargando...<br><button class="btn btn-danger" onclick="CancelarLogin()">Cancelar</button></div></div>');
        } else {
          actualizarSesion(false, callback, usuarioMedico_id);
        }

    });
}


function registrarPacienteBootbox(callback, usuarioMedico_id, refresh){

  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    size:'large',
    className: 'Intermed-Bootbox',
    title: '<span class="title">Intermed<sup>&reg;</sup> | Registro</span>',
    message:
    '<div id="RegPacModal" class="Flama-normal">'+
        '<div class="row">'+
          '<div class="col-lg-6 col-md-6 regCorreo text-center">'+
            '<form method="POST" onsubmit="return iniciarSesionLocal(\'email\',\'password\',\''+callback+'\','+ usuarioMedico_id +');">'+
              '<h3>Inicia sesión</h3>'+
              '<br>'+
              '<div class="row">'+
                '<div class="col-md-8 col-md-offset-2">'+
                  '<div class="form-group" style="padding-top:0px">'+
                    '<button type="button" name="loginFB" class="btn btn-facebook btn-block btn-lg" onclick="iniciarSesionFacebook(\''+ callback +'\','+usuarioMedico_id+')"><span class="icon icon-facebook2"></span> Login con Facebook</button>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-1"><hr class="hidden"></div>'+
              '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-10 s15 text-uppercase text-center dark-c"><br>o ingresa con tu correo:</div>'+
              '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-1"><hr class="hidden"></div>'+
              '<div class="row">'+
                '<div class="col-md-8 col-md-offset-2">'+
                  '<div class="form-group" id="emailGroup">'+
                    '<input type="text" class="form-control input-lg" id="email" name="email" placeholder="Usuario o Correo" required="true" aria-describedby="emailP">'+
                  '</div>'+
                  '<div class="form-group" id="passwordGroup">'+
                    '<input type="password" class="form-control input-lg" id="password" name="password" placeholder="Contraseña" required="true" aria-describedby="passwordP" autocomplete="off">'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="alert alert-info hidden text-center text-uppercase" id="LoginError" role="alert"> <strong>Correo o contraseña incorrectos.</strong></div>'+
              '<div class="row" id="fin" style="margin-top:15px">'+
                '<div class="col-md-8 col-md-offset-2">'+
                  '<input type="submit" name="login" value="Ingresar" class="btn btn-warning btn-lg btn-block">'+
                '</div>'+
                '<div class="col-md-12">'+
                  '<p class="text-center">'+
                    '¿Olvidaste tus datos de acceso? <br><a href="#">Haz click aqui para recuperarlos</a>'+
                  '</p>'+
                '</div>'+
              '</div>'+
            '</form>'+

          '</div>'+
          '<div class="col-lg-6 col-md-6 regCorreo text-center">'+
            '<form method="POST" action="/reg/local" id="frm_regP" onsubmit="return encriptarPass(\'contrasenaRegP\',\'passEncriptP\')">'+
            '<h3>Regístrate</h3>'+
            '<br>'+
            '<button name="registroFB" class="btn btn-facebook btn-block s20" onclick="registrarseFacebook(\''+ callback +'\','+usuarioMedico_id+')"><span class="icon icon-facebook2"></span> Regístrate con Facebook</button>'+
            '<h4>o</h4>'+
            '<h3>Registrate con tu correo electrónico</h3>'+
            '<div class="row">'+
              '<div class="col-md-12">'+
                '<div id="alertError"></div>'+
              '</div>'+
              '<div class="col-md-6">'+
                '<div class="form-group">'+
                  '<input type="text" class="form-control" id="nombreReg"  name="first_name" placeholder="Nombre" required="true">'+
                  '<span id="nameIcon" class="" aria-hidden="true"></span>'+
                  '<div id="nombre-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-6">'+
                '<div class="form-group" id="apellidoGroup">'+
                  '<input type="text" class="form-control" id="ApellidoReg" name="last_name" placeholder="Apellido" required="true">'+
                  '<span id="apellidoIcon" class="" aria-hidden="true"></span>'+
                  '<div id="apellido-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-12">'+
                '<div class="form-group" id="emailGroup">'+
                  '<input type="email" class="form-control" id="correoReg" name="email" placeholder="Correo Electrónico" required="true">'+
                  '<span id="emailIcon" class="" aria-hidden="true"></span>'+
                  '<div id="email-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-6">'+
                '<div class="form-group" id="passwordGroup">'+
                  '<input type="hidden" id="passEncriptP" name="password">'+
                  '<input type="password" class="form-control" id="contrasenaRegP" placeholder="Contraseña" pattern=".{6,13}" required="true">'+
                  '<span id="passwordIcon" class="" aria-hidden="true"></span>'+
                  '<div id="pass-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-6">'+
                '<div class="form-group" id="confirmGroup">'+
                  '<input type="password" class="form-control" id="contrasena2RegP" name="password2" placeholder="Confirma tu contraseña" pattern=".{6,13}" required="true">'+
                  '<span id="confirmIcon" class="" aria-hidden="true"></span>'+
                  '<div id="conf-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-3">'+
                '<br><h4>'+
                  '<small>Nacimiento</small>'+
                '</h4>'+
              '</div>'+
              '<div class="col-md-3">'+
                '<div class="form-group" id="diaGroup">'+
                  '<input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">'+
                  '<span id="diaIcon" class="" aria-hidden="true"></span>'+
                  '<div id="dia-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-3">'+
                '<div class="form-group" id="mesGroup">'+
                  '<input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">'+
                  '<span id="mesIcon" class="" aria-hidden="true"></span>'+
                  '<div id="mes-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-3">'+
                '<div class="form-group" id="añoGroup">'+
                  '<input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">'+
                  '<span id="añoIcon" class="" aria-hidden="true"></span>'+
                  '<div id="año-error"></div>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-3">'+
                '<h4>'+
                  '<small>Sexo</small>'+
                '</h4>'+
              '</div>'+
              '<div class="col-md-4">'+
                '<div class="radio">'+
                  '<label>'+
                    '<input type="radio" name="gender" id="sexM" value="M" checked required="true"> Masculino'+
                  '</label>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-4">'+
                '<div class="radio">'+
                  '<label>'+
                    '<input type="radio" name="gender" id="sexF" value="F" required="true"> Femenino'+
                  '</label>'+
                '</div>'+
              '</div>'+
              '<div class="col-md-12">'+
                '<input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />'+
                '<!-- TIMESTAMPS -->'+
              '</div>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<p class="s15 text-center">'+
                '<small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.'+
              '</p>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-warning btn-lg btn-block s20">'+
            '</div>'+
          '</div>'+
        '</form>'+
      '</div>'+
    '</div>'+
  '</div>'
});
}


function agendarCitaBootbox(usuarioMedico_id){
    if (!usuarioMedico_id){
      usuarioMedico_id = $('#usuarioPerfil').val();
    }
    //Revisar si existe sesión iniciada como paciente
    var tipoUsuario = revisarTipoSesion();
    if (tipoUsuario == ''){
      //Iniciar sesión, con callback a agendarCitaBootbox
      registrarPacienteBootbox('agendarCitaBootbox', usuarioMedico_id);
    } else if (tipoUsuario == 'P'){
      //Agendar cita
      bootbox.dialog({
        backdrop: true,
        onEscape: function () {
            bootbox.hideAll();
        },
        size:'large',
        className: 'Intermed-Bootbox',
        title: '<span class="title">AGENDAR UNA CITA.</span><span class="subtitle">Selecciona el servicio para el cual quieres generar la cita, seguido de eso se desplegaran las distintas ubicaciones donde el médico brinda el servicio.</span>',
        message:
              '<form method="POST" name="frmRegCita" id="frmRegCita">'+
                '<input type="hidden" id="id" name="id">'+
                '<input type="hidden" id="medico_id" name="medico_id" value="'+ usuarioMedico_id +'">'+
                '<input type="hidden" id="fecha" name="fecha" />'+
                '<input type="hidden" id="fechaFin" name="fechaFin" />'+
                '<input type="hidden" id="serviciocita_id" name="serviciocita_id" />'+
                '<div class=col-md-12">'+
                  '<div class="col-md-2">'+
                    '<label for="servicio_id">Servicio: </label>'+
                  '</div>'+
                  '<div class="col-md-10">'+
                    '<select class="form-control" id="servicio_id" name="servicio_id" onchange="iniciarDivAgendaCita();">'+
                      '<option value=""></option>'+
                    '</select>'+
                  '</div>'+
                '</div>'+
                '<br/><br/>'+

                '<div class=col-md-12" id="ubicaciones_select">'+
                  '<div class="col-md-2">'+
                    '<label for="servicio_id">Ubicación: </label>'+
                  '</div>'+
                  '<div class="col-md-10">'+
                    '<select class="form-control" id="ubicacion_id" name="ubicacion_id" >'+
                      '<option value=""></option>'+
                    '</select>'+
                  '</div>'+
                '</div>'+


                '<div class=col-md-12" id="cita_detalles" style="visibility:hidden">'+
                  '<b>Costo del servicio: </b><span id="citaCosto"></span><br/>'+
                  '<b>Duración: </b><span id="citaDuracion"></span>'+
                '</div>'+


                '<div class="col-md-12" id="divCalendarioPadre"><div class="row"><div id="divCalendario" class="regHorMed"></div></div></div>'+

              '</form>'+
              '<input type="button" class="btn btn-drop btn-sm pull-left" value="Cancelar" onclick="bootbox.hideAll();">'+
              '<input type="button" class="btn btn-save btn-sm pull-right" value="Agendar cita" onclick="registrarCita()"><br/><br/<br/><br/>'+
              '<span style="color:#5D9AB7">.</span><br/><br/>'
      });
      traerServiciosPorMedico(usuarioMedico_id);
      iniciarDivAgendaCita();
    }
}

/*
function verAgendaMedico(){
    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      size:'large',
      className: 'Intermed-Bootbox',
      title: '<span class="title">TU AGENDA.</span><span class="subtitle">Da click en las citas para cancelarlas.</span>',
      message: '<form method="POST" name="frmRegCita" id="frmRegCita">'+
            '<input type="hidden" id="id" name="id">'+
            '<input type="hidden" id="paciente_id" name="paciente_id" value="1">'+
            '<input type="hidden" id="fecha" name="fecha" />'+
            '<input type="hidden" id="fechaFin" name="fechaFin" />'+

            '<div class="col-md-12">'+
              '<div class="row">'+
              '<div id="divCalendario"></div>'+
              '</div>'+
            '</div>'+

            '<div class="row">'+
                '<div class="col-md-12">'+
                    '<div class="form-group">'+
                        '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="bootbox.hideAll()">'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '</form>'
  });


    setTimeout(function(){
      generarCalendarioMedico();
    },500);


}
*/

function verAgendaPaciente(){
    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      size:'large',
      className: 'Intermed-Bootbox',
      title: '<span class="title">TU AGENDA.</span><span class="subtitle">Da click en las citas para cancelarlas.</span>',
      message: '<form method="POST" name="frmRegCita" id="frmRegCita">'+
            '<input type="hidden" id="id" name="id">'+
            '<input type="hidden" id="paciente_id" name="paciente_id" value="1">'+
            '<input type="hidden" id="fecha" name="fecha" />'+
            '<input type="hidden" id="fechaFin" name="fechaFin" />'+

            '<div class="col-md-12">'+
              '<div class="row">'+
              '<div id="divCalendario" class="regHorMed"></div>'+
              '</div>'+
            '</div>'+

            '<div class="row">'+
                '<div class="col-md-12">'+
                    '<div class="form-group">'+
                        '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="bootbox.hideAll()">'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '</form>'
  });


    setTimeout(function(){
      generarCalendarioPaciente();
    },500);
}

function detalleCancelacionPaciente(data){
  var data = data.split("|");

  var imagenUrl = '';
  var nombreUsuario = '';
  var nombreUbicacion = '';
  var nombreServicio = '';
  var fecha = data[1].split('T')[0];
  var hora = data[1].split('T')[1].split(':00.')[0];

  $.ajax( {
    async: false,
    url: '/agenda/detallesCancelacion/paciente',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'paciente_id': data[0],
      'direccion_id': data[3],
      'servicio_id': data[4],
    },
    success: function ( data ) {
      imagenUrl = data.usuario.urlFotoPerfil;
      if (!data.usuario.DatosGenerale.apellidoM) data.usuario.DatosGenerale.apellidoM = '';
      nombreUsuario = data.usuario.DatosGenerale.nombre  + ' ' + data.usuario.DatosGenerale.apellidoP + ' ' + data.usuario.DatosGenerale.apellidoM;
      nombreUbicacion = data.ubicacion;
      nombreServicio = data.servicio;
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
//  alert(data.split("|")[0]);

  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    className: 'Intermed-Bootbox',
    title: '<span class="title">CITA CANCELADA POR EL PACIENTE.</span>',
    message: '<div class="col-md-12" style="margin-bottom:30px;margin-top:30px">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
            '<img src="'+imagenUrl+'" style="margin-top:7px;width:100%">'+
            '</div>'+
            '<div class="col-md-8">'+
            '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
            '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
            '<h4><b>Paciente: </b>'+nombreUsuario+'</h4><br/>'+
            '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
            '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-12">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="bootbox.hideAll()">'+
                '</div>'+
            '</div>'+
        '</div>'
  });
}

function detalleCancelacionMedico(agenda_id){
  var imagenUrl = '';
  var nombreUsuario = '';
  var nombreUbicacion = '';
  var nombreServicio = '';
  var fecha = '';
  var hora = '';

  $.ajax( {
    async: false,
    url: '/agenda/detallesCancelacion/medico',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'agenda_id': agenda_id
    },
    success: function ( data ) {
      imagenUrl = data.result.Usuario.urlFotoPerfil;
      if (!data.result.Usuario.DatosGenerale.apellidoM) data.result.Usuario.DatosGenerale.apellidoM = '';
      nombreUsuario = 'Dr. ' + data.result.Usuario.DatosGenerale.nombre  + ' ' + data.result.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Usuario.DatosGenerale.apellidoM;
      nombreUbicacion = data.result.Direccion.nombre;
      nombreServicio = data.result.CatalogoServicio.concepto;
      fecha = data.result.fechaHoraInicio.split('T')[0];
      hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
//  alert(data.split("|")[0]);

  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    className: 'Intermed-Bootbox',
    title: '<span class="title">CITA CANCELADA POR EL MÉDICO.</span>',
    message: '<div class="col-md-12" style="margin-bottom:30px;margin-top:30px">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
            '<img src="'+imagenUrl+'" style="margin-top:7px;width:100%">'+
            '</div>'+
            '<div class="col-md-8">'+
            '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
            '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
            '<h4><b>'+nombreUsuario+'</b></h4><br/>'+
            '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
            '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-12">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="bootbox.hideAll()">'+
                '</div>'+
            '</div>'+
        '</div>'
  });
}

function detalleCita(agenda_id){
  var imagenUrl = '';
  var nombreUsuario = '';
  var nombreUbicacion = '';
  var nombreServicio = '';
  var fecha = '';
  var hora = '';
  var result = '';

  $.ajax( {
    async: false,
    url: '/agenda/detalleCita',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'agenda_id': agenda_id
    },
    success: function ( data ) {
      result = data.result;
      imagenUrl = data.result.Paciente.Usuario.urlFotoPerfil;
      if (!data.result.Paciente.Usuario.DatosGenerale.apellidoM) data.result.Paciente.Usuario.DatosGenerale.apellidoM = '';
      nombreUsuario = data.result.Paciente.Usuario.DatosGenerale.nombre  + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoM;
      nombreUbicacion = data.result.Direccion.nombre;
      nombreServicio = data.result.CatalogoServicio.concepto;
      fecha = data.result.fechaHoraInicio.split('T')[0];
      hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
//  alert(data.split("|")[0]);

  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    className: 'Intermed-Bootbox',
    title: '<span class="title">NUEVA CITA AGENDADA.</span>',
    message:'<div class="col-md-12" style="margin-bottom:30px;margin-top:30px">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
              '<img src="'+imagenUrl+'" style="margin-top:7px;width:100%">'+
            '</div>'+
            '<div class="col-md-8">'+
              '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
              '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
              '<h4><b>'+nombreUsuario+'</b></h4><br/>'+
              '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
              '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>'+

            '<!--<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
              '<h2>TEST</h2>'+
              '<div class="row">'+
                '<div id="mapaUbicacionCita" style="width:100%; height:250px; margin-top:20px;"></div>'+
              '</div>'+
            '</div>-->'+
          '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-12">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="bootbox.hideAll()">'+
                '</div>'+
            '</div>'+
        '</div>'
  });
//  cargarMapaUbicacionCita(result);
}

function bootboxCalificarCita(agenda_id, notificacion_id){

    var imagenUrl = '';
    var nombreUsuario = '';
    var nombreUbicacion = '';
    var nombreServicio = '';
    var fecha = '';
    var hora = '';

    $.ajax( {
      async: false,
      url: '/agenda/detallesCancelacion/medico',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'agenda_id': agenda_id
      },
      success: function ( data ) {
        imagenUrl = data.result.Usuario.urlFotoPerfil;
        if (!data.result.Usuario.DatosGenerale.apellidoM) data.result.Usuario.DatosGenerale.apellidoM = '';
        nombreUsuario = 'Dr. ' + data.result.Usuario.DatosGenerale.nombre  + ' ' + data.result.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Usuario.DatosGenerale.apellidoM;
        nombreUbicacion = data.result.Direccion.nombre;
        nombreServicio = data.result.CatalogoServicio.concepto;
        fecha = data.result.fechaHoraInicio.split('T')[0];
        hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });
  //  alert(data.split("|")[0]);

    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      className: 'Intermed-Bootbox',
      title: '<span class="title">CALIFICA TU CITA.</span>',
      message:
      '<style>span.Slider {float:left;}</style>'+
      '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">'+

      '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-bottom:15px;margin-top:20px">'+
        '<div class="row">'+
          '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:-15px;margin-bottom:5px;">'+
            '<h4><b>'+nombreUsuario+'</b></h4>'+
          '</div>'+

          '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-bottom:5px;">'+
            '<div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-3 col-sm-offset-3 col-xs-offset-3">'+
              '<img src="'+imagenUrl+'" style="width:100%;" class="img-thumbnail">'+
            '</div>'+
          '</div>'+

          '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-bottom:5px;"><small><b>Fecha: </b>'+ fecha +' '+ hora +'</small></div>'+

          '<div class="col-md-6 col-sm-6 col-xs-10 col-md-offset-3 col-sm-offset-3 col-xs-offset-1" style="margin-top:20px">'+
            '<div class="row">'+
              '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:5px;font-weight:bold">Satisfacción general: </div>'+
              '<div class="col-md-12 col-sm-12 col-xs-12"><input id="cal_satisfaccion" value="2.5" type="number" class="rating" min=0 max=5 step=0.5 data-size="xs"></div>'+
            '</div>'+

            '<div class="row" class="calificacionCriterios" style="margin-top:15px;margin-bottom:15px;">'+

                '<div class="col-md-2 col-sm-2 col-xs-2 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                        '<span class="Slider vertical" id="cal_higiene"></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                      '<span class="glyphicon glyphicon-trash" ></span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-2 col-sm-2 col-xs-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                        '<span class="Slider vertical" id="cal_puntualidad"></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                      '<span class="glyphicon glyphicon-time"></span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-2 col-sm-2 col-xs-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                        '<span class="Slider vertical"  id="cal_instalaciones"></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                      '<span class="glyphicon glyphicon-home"></span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-2 col-sm-2 col-xs-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                        '<span class="Slider vertical"  id="cal_trato"></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                      '<span class="glyphicon glyphicon-user"></span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-2 col-sm-2 col-xs-2">'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                        '<span class="Slider vertical"  id="cal_costo"></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                      '<span class="glyphicon glyphicon-usd"></span>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

            '</div>'+

            '<div class="row">'+
              '<textarea class="form-control" placeholder="Comentarios (opcional)" style="resize: none;margin-top:5px" rows="4" id="calificacionComentario"></textarea>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-12 col-sm-12 col-xs-12">'+
              '<div class="form-group">'+
                  '<input type="button" style="font-weight:bold" class="btn btn-warning btn-block" value="Calificar" onclick="calificarCita(\''+agenda_id+'\',\''+notificacion_id+'\');">'+
              '</div>'+
          '</div>'+
      '</div>'
    });


    $('.bootbox-close-button').css('z-index','1000');
    $('.bootbox-close-button').css('position','relative');
    $('.bootbox-close-button').css('color','white');
    $('.bootbox-close-button').css('font-size','180%');

    $("#cal_satisfaccion").rating();

    $('.clear-rating').css('display','none');
    $('.caption').css('display','none');



        $( "span.Slider.vertical" ).each(function() {

          var id = $(this).prop('id');

          $('#'+id ).slider({
            value: 50,
            min: -10,
            max: 110,
            step: 10,
            animate: true,
            orientation: "vertical",
            slide: repositionTooltip,
            start: function( e, ui ){
              $('#'+id +" .ui-slider-handle:first").tooltip('show');
              repositionTooltip(e,ui);
            },
            stop: function(){
              $('#'+id +" .ui-slider-handle:first").tooltip('hide');
            }
          });

          $('#'+id +" .ui-slider-handle:first").tooltip( {placement:"top",title: $('#'+id).slider("value"),trigger:"manual"});

        });


        $( "span.Slider.horizontal" ).each(function() {

          var id = $(this).prop('id');

          $('#'+id ).slider({
            value: 50,
            min: 0,
            max: 100,
            step: 10,
            animate: true,
            slide: repositionTooltip,
            start: function( e, ui ){
              $('#'+id +" .ui-slider-handle:first").tooltip('show');
              repositionTooltip(e,ui);
            },
            stop: function(){
              $('#'+id +" .ui-slider-handle:first").tooltip('hide');
            }
          });

          $('#'+id +" .ui-slider-handle:first").tooltip( {placement:"top",title: $('#'+id).slider("value"),trigger:"manual"});

        });
}

function calificarServicioMedico(){

    var imagenUrl = '';
    var nombreUsuario = '';

    $.ajax( {
      async: false,
      url: '/usuario/traer',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'id': $('#usuarioPerfil').val()
      },
      success: function ( data ) {
        imagenUrl = data.urlFotoPerfil;
        if (!data.DatosGenerale.apellidoM) data.DatosGenerale.apellidoM = '';
        nombreUsuario = 'Dr. ' + data.DatosGenerale.nombre  + ' ' + data.DatosGenerale.apellidoP + ' ' + data.DatosGenerale.apellidoM;
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });

    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      className: 'Intermed-Bootbox',
      title: '<span class="title">CALIFICA SU SERVICIO.</span>',
      message:
      '<style>span.Slider {float:left;}</style>'+
      '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">'+

      '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-bottom:15px;margin-top:20px">'+
        '<div class="row">'+
          '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:-15px;margin-bottom:5px;">'+
            '<h4><b>'+nombreUsuario+'</b></h4>'+
          '</div>'+

          '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-bottom:5px;">'+
            '<div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-3 col-sm-offset-3 col-xs-offset-3">'+
              '<img src="'+imagenUrl+'" style="width:100%;" class="img-thumbnail">'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="row" class="calificacionCriterios" style="margin-top:15px;margin-bottom:15px;">'+

            '<div class="col-md-2 col-sm-2 col-xs-2 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                    '<span class="Slider vertical" id="cal_higiene"></span>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                  '<span class="glyphicon glyphicon-trash" ></span>'+
                '</div>'+
              '</div>'+
            '</div>'+

            '<div class="col-md-2 col-sm-2 col-xs-2">'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                    '<span class="Slider vertical" id="cal_puntualidad"></span>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                  '<span class="glyphicon glyphicon-time"></span>'+
                '</div>'+
              '</div>'+
            '</div>'+

            '<div class="col-md-2 col-sm-2 col-xs-2">'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                    '<span class="Slider vertical"  id="cal_instalaciones"></span>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                  '<span class="glyphicon glyphicon-home"></span>'+
                '</div>'+
              '</div>'+
            '</div>'+

            '<div class="col-md-2 col-sm-2 col-xs-2">'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                    '<span class="Slider vertical"  id="cal_trato"></span>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                  '<span class="glyphicon glyphicon-user"></span>'+
                '</div>'+
              '</div>'+
            '</div>'+

            '<div class="col-md-2 col-sm-2 col-xs-2">'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                    '<span class="Slider vertical"  id="cal_costo"></span>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                  '<span class="glyphicon glyphicon-usd"></span>'+
                '</div>'+
              '</div>'+
            '</div>'+

        '</div>'+

        '<div class="row" class="calificacionCriterios" style="margin-top:15px;margin-bottom:15px;">'+

            '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:5px;font-weight:bold">Satisfacción cita: </div>'+

            '<div class="col-md-10 col-sm-10 col-xs-10 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">'+
              '<span class="Slider horizontal" id="cal_satisfaccion" style="width:100%!important"></span>'+
            '</div>'+

        '</div>'+

      '</div>'+
      '<div class="row">'+
          '<div class="col-md-12 col-sm-12 col-xs-12">'+
              '<div class="form-group">'+
                  '<input type="button" style="font-weight:bold" class="btn btn-warning btn-block" value="Calificar" onclick="calificarServMedico();">'+
              '</div>'+
          '</div>'+
      '</div>'
    });


    $('.bootbox-close-button').css('z-index','1000');
    $('.bootbox-close-button').css('position','relative');
    $('.bootbox-close-button').css('color','white');
    $('.bootbox-close-button').css('font-size','180%');

    $(".rating").rating();

    $('.clear-rating').css('display','none');
    $('.caption').css('display','none');



      $( "span.Slider" ).each(function() {

        var id = $(this).prop('id');

        $('#'+id ).slider({
          value: 50,
          min: -10,
          max: 110,
          step: 10,
          animate: true,
          orientation: "vertical",
          slide: repositionTooltip,
          start: function( e, ui ){
            $('#'+id +" .ui-slider-handle:first").tooltip('show');
            repositionTooltip(e,ui);
          },
          stop: function(){
            $('#'+id +" .ui-slider-handle:first").tooltip('hide');
          }
        });

        $('#'+id +" .ui-slider-handle:first").tooltip( {placement:"top",title: $('#'+id).slider("value"),trigger:"manual"});

      });
}

var box;
function detalleCitaMedico(eventid){
  var agenda_id = eventid.split("_")[1];
  var imagenUrl = '';
  var nombreUsuario = '';
  var nombreUbicacion = '';
  var nombreServicio = '';
  var fecha = '';
  var hora = '';

  $.ajax( {
    async: false,
    url: '/agenda/detalleCita',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'agenda_id': agenda_id
    },
    success: function ( data ) {
      console.log('Result: ' + JSON.stringify(data));
      imagenUrl = data.result.Paciente.Usuario.urlFotoPerfil;
      if (!data.result.Paciente.Usuario.DatosGenerale.apellidoM) data.result.Paciente.Usuario.DatosGenerale.apellidoM = '';
      nombreUsuario = data.result.Paciente.Usuario.DatosGenerale.nombre  + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoM;
      nombreUbicacion = data.result.Direccion.nombre;
      nombreServicio = data.result.CatalogoServicio.concepto;
      fecha = data.result.fechaHoraInicio.split('T')[0];
      hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
//  alert(data.split("|")[0]);

  box = bootbox.dialog({
    backdrop: false,
    className: 'Intermed-Bootbox',
    title: '<span class="title">CITA AGENDADA</span>',
    message:'<div class="col-md-12">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
            '<img src="'+imagenUrl+'" style="margin-top:7px;width:100%">'+
            '</div>'+
            '<div class="col-md-8">'+
            '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
            '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
            '<h4><b>'+nombreUsuario+'</b></h4><br/>'+
            '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
            '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-4">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-danger btn-md btn-block" id="btnRegMed" value="Cancelar" onclick="cancelarCitaPorMedico(\''+ eventid +'\')">'+
                '</div>'+
            '</div>'+
            '<div class="col-md-6 col-md-offset-2">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="cerrarCurrentBootbox()">'+
                '</div>'+
            '</div>'+
        '</div>'
  });
}

function cerrarCurrentBootbox(){
  if (box){
    box.modal('hide');
  }
}


function detalleCitaPaciente(eventid){
  var agenda_id = eventid.split("_")[1];
  var imagenUrl = '';
  var nombreUsuario = '';
  var nombreUbicacion = '';
  var nombreServicio = '';
  var fecha = '';
  var hora = '';

  $.ajax( {
    async: false,
    url: '/agenda/detallesCancelacion/medico',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'agenda_id': agenda_id
    },
    success: function ( data ) {
      imagenUrl = data.result.Usuario.urlFotoPerfil;
      if (!data.result.Usuario.DatosGenerale.apellidoM) data.result.Usuario.DatosGenerale.apellidoM = '';
      nombreUsuario = 'Dr. ' + data.result.Usuario.DatosGenerale.nombre  + ' ' + data.result.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Usuario.DatosGenerale.apellidoM;
      nombreUbicacion = data.result.Direccion.nombre;
      nombreServicio = data.result.CatalogoServicio.concepto;
      fecha = data.result.fechaHoraInicio.split('T')[0];
      hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
    },
    error: function (err){
      console.log('AJAX Error: ' + JSON.stringify(err));
    }
  });
//  alert(data.split("|")[0]);

  box = bootbox.dialog({
    backdrop: false,
    className: 'Intermed-Bootbox',
    title: '<span class="title">CITA.</span>',
    message: '<div class="col-md-12" style="margin-bottom:30px;margin-top:30px">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
            '<img src="'+imagenUrl+'" style="margin-top:7px;width:100%">'+
            '</div>'+
            '<div class="col-md-8">'+
            '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
            '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
            '<h4><b>'+nombreUsuario+'</b></h4><br/>'+
            '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
            '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-4">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-danger btn-md btn-block" id="btnRegMed" value="Cancelar" onclick="cancelarCitaPorPaciente(\''+ eventid +'\')">'+
                '</div>'+
            '</div>'+
            '<div class="col-md-6 col-md-offset-2">'+
                '<div class="form-group">'+
                    '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="cerrarCurrentBootbox()">'+
                '</div>'+
            '</div>'+
        '</div>'
  });
}




function dejarComentarioMedico(){

    var imagenUrl = '';
    var nombreUsuario = '';

    $.ajax( {
      async: false,
      url: '/usuario/traer',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'id': $('#usuarioPerfil').val()
      },
      success: function ( data ) {
        imagenUrl = data.urlFotoPerfil;
        if (!data.DatosGenerale.apellidoM) data.DatosGenerale.apellidoM = '';
        nombreUsuario = 'Dr. ' + data.DatosGenerale.nombre  + ' ' + data.DatosGenerale.apellidoP + ' ' + data.DatosGenerale.apellidoM;
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });

    bootbox.dialog({
      backdrop: true,
      onEscape: function () {
          bootbox.hideAll();
      },
      className: 'Intermed-Bootbox',
      title: '<span class="title">DEJAR COMENTARIO.</span>',
      message:
      '<style>span.Slider {float:left;}</style>'+
      '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">'+
      '<form method="POST" onsubmit="return calificarServMedico();">'+
      '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-bottom:15px;margin-top:20px">'+
        '<div class="row">'+
            '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:-15px;margin-bottom:5px;">'+
              '<h4><b>'+nombreUsuario+'</b></h4>'+
            '</div>'+

            '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-bottom:5px;">'+
              '<div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-3 col-sm-offset-3 col-xs-offset-3">'+
                '<img src="'+imagenUrl+'" style="width:100%;" class="img-thumbnail">'+
              '</div>'+
            '</div>'+
          '</div>'+

          '<div class="row">'+
            '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="margin-top:5px;font-weight:bold">Satisfacción general: </div>'+
            '<div class="col-md-12 col-sm-12 col-xs-12"><input id="cal_satisfaccion" value="2.5" type="number" class="rating" min=0 max=5 step=0.5 data-size="xs"></div>'+
          '</div>'+

          '<div class="row" class="calificacionCriterios" style="margin-top:15px;margin-bottom:15px;">'+

              '<div class="col-md-2 col-sm-2 col-xs-2 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                      '<span class="Slider vertical" id="cal_higiene"></span>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                    '<span class="glyphicon glyphicon-trash" ></span>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="col-md-2 col-sm-2 col-xs-2">'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                      '<span class="Slider vertical" id="cal_puntualidad"></span>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                    '<span class="glyphicon glyphicon-time"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="col-md-2 col-sm-2 col-xs-2">'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                      '<span class="Slider vertical"  id="cal_instalaciones"></span>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                    '<span class="glyphicon glyphicon-home"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="col-md-2 col-sm-2 col-xs-2">'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                      '<span class="Slider vertical"  id="cal_trato"></span>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                    '<span class="glyphicon glyphicon-user"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="col-md-2 col-sm-2 col-xs-2">'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12 text-center" style="padding-left: 45%;">'+
                      '<span class="Slider vertical"  id="cal_costo"></span>'+
                  '</div>'+
                '</div>'+
                '<div class="row">'+
                  '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 45%;">'+
                    '<span class="glyphicon glyphicon-usd"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'+

          '</div>'+


          '<div class="row">'+

            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:20px">'+
                '<input type="text" id="tituloComentario" class="form-control" rows="3" placeholder="Titulo del comentario" required>'+
            '</div>'+

          '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:5px">'+
              '<textarea id="comentarioMedico" class="form-control" rows="3" placeholder="Comentario..." style="resize: none;" required></textarea>'+
          '</div>'+

          '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
            '<div style="font-weight: bold;padding:5px">'+
              '<label>'+
                '<input type="checkbox" id="comentarioAnonimo"> Comentario anónimo'+
              '</label>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
          '<div class="col-md-6 col-sm-6 col-xs-12 pull-right">'+
              '<div class="form-group">'+
                  '<input type="submit" style="font-weight:bold" class="btn btn-danger btn-block" value="Enviar">'+
              '</div>'+
          '</div>'+
          '<div class="col-md-3 col-sm-3 col-xs-12 pull-left">'+
              '<div class="form-group">'+
                  '<input type="button" style="font-weight:bold" class="btn btn-warning btn-block" value="Cancelar" onclick="bootbox.hideAll();">'+
              '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '</form>'
    });


    $(".rating").rating();

    $('.clear-rating').css('display','none');
    $('.caption').css('display','none');

    $( "span.Slider.vertical" ).each(function() {
      var id = $(this).prop('id');

      $('#'+id ).slider({
        value: 50,
        min: -10,
        max: 110,
        step: 10,
        animate: true,
        orientation: "vertical",
        slide: repositionTooltip,
        start: function( e, ui ){
          $('#'+id +" .ui-slider-handle:first").tooltip('show');
          repositionTooltip(e,ui);
        },
        stop: function(){
          $('#'+id +" .ui-slider-handle:first").tooltip('hide');
        }
      });

      $('#'+id +" .ui-slider-handle:first").tooltip( {placement:"top",title: $('#'+id).slider("value"),trigger:"manual"});

    });

    $( "span.Slider.horizontal" ).each(function() {

      var id = $(this).prop('id');

      $('#'+id ).slider({
        value: 50,
        min: 0,
        max: 100,
        step: 10,
        animate: true,
        slide: repositionTooltip,
        start: function( e, ui ){
          $('#'+id +" .ui-slider-handle:first").tooltip('show');
          repositionTooltip(e,ui);
        },
        stop: function(){
          $('#'+id +" .ui-slider-handle:first").tooltip('hide');
        }
      });

      $('#'+id +" .ui-slider-handle:first").tooltip( {placement:"top",title: $('#'+id).slider("value"),trigger:"manual"});

    });
}

function BootboxFormacionAcademica(){

      bootbox.dialog({
        backdrop: true,
        onEscape: function () {
            bootbox.hideAll();
        },
        size:'large',
        className: 'Intermed-Bootbox',
        title: '<span class="title"></span>',
        message:
        '<style>.modal-header .close {margin-top: -17px;margin-right: -9px;}</style>'+
        '<div class="tab-content Flama-normal">'+

          '<div id="divListaFormacion" class="tab-pane fade in active">'+
            '<div class="row">'+
              '<div class="col-md-10"><h2 class="whiteF" style="margin-top:0px">Tu formación académica</h2></div>'+
              '<div class="col-md-2"><input type="button" class="btn btn-warning btn-block" value="Agregar" onclick="CambiarVisible(\'divListaFormacion\',\'divAddFormacion\',true);"></div>'+
            '</div>'+

            '<div class="row">'+
              '<div class="col-md-12">'+
              `<table class="table">
                <thead>
                  <tr style="background-color:#172c3b;color:white;">
                    <th class="text-center">Institución</th>
                    <th class="text-center">Especialidad</th>
                    <th class="text-center">Inicio</th>
                    <th class="text-center">Fin</th>
                    <th class="text-center">Obtención del grado</th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                  </tr>
                </thead>
                <tbody style="background-color:#FFF;" class="text-center" id="formacionAcademicaList">
                </tbody>
              </table>`+
              '</div>'+
            '</div>'+

          '</div>'+

          '<div id="divAddFormacion" class="tab-pane fade">'+

            '<div class="row">'+
              '<div class="col-md-12"><h2 class="whiteF" style="margin-top:0px">Agregar formación académica</h2></div>'+
            '</div>'+

            '<form id="formAcademica">'+
              '<input type="hidden" id="formacion_id">'+


              '<div class="row">'+
                '<div class="col-md-6">'+
                  '<div class="form-group">'+
                    '<select class="form-control" id="selectEstados" onchange="cargarCiudades(\'#selectEstados\');" name="estado"></select>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-6">'+
                  '<div class="form-group">'+
                    '<select class="form-control invisible" id="selectCiudad"></select>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<select type="text" class="form-control" id="inputNivel">'+
                      '<option value = ""  disabled selected hidden>Nivel de educación</option>'+
                      '<option value = "1" >Premédica</option>'+
                      '<option value = "2" >Licenciatura</option>'+
                      '<option value = "3" >Especialización</option>'+
                      '<option value = "4" >Subespecialidad</option>'+
                      '<option value = "5" >Maestría</option>'+
                      '<option value = "6" >Doctorado</option>'+
                      '<option value = "7" >Postdoctorado</option>'+
                      '<option value = "8" >Educación continua</option>'+
                    '</select>'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" id="inputInstitucion" placeholder="Institución">'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" id="inputEspecialidad" placeholder="Especialidad">'+
                  '</div>'+
                '</div>'+
              '</div>'+

              '<div class="row">'+

                '<div class="col-md-2">'+
                  '<div class="checkbox" style="text-align:center"><br/>'+
                    '<label style="font-weight:bold">'+
                      '<input type="checkbox" id="inputActual" onChange="cambiarActual(this)"> Actual'+
                    '</label>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-3" id="divInicio">'+
                  '<div class="form-group">'+
                    '<label for="inputInicio">Inicio</label>'+
                    '<input type="date" class="form-control" id="inputInicio">'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-3" id="divFin">'+
                  '<div class="form-group">'+
                    '<label for="inputFin">Fin</label>'+
                    '<input type="date" class="form-control" id="inputFin">'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-4" id="divGrado">'+
                  '<div class="form-group">'+
                    '<label for="inputGrado">Obtención del grado</label>'+
                    '<input type="date" class="form-control" id="inputGrado">'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</form>'+

            '<div class="row">'+
              '<div class="col-md-2"><input type="button" class="btn btn-danger btn-block" value="Cancelar" onclick="CambiarVisible(\'divAddFormacion\',\'divListaFormacion\');"></div>'+
              '<div class="col-md-4 pull-right"><input type="button" class="btn btn-warning btn-block" value="Agregar" onclick="agregarFormacionAcademica()"></div>'+
            '</div>'+
          '</div>'+

      '</div>'
    });

    cargarEstados('selectEstados');
    cargarFormacionAcademica();
}

function BootboxExperienciaLaboral(){


        bootbox.dialog({
          backdrop: true,
          onEscape: function () {
              bootbox.hideAll();
          },
          size:'large',
          className: 'Intermed-Bootbox',
          title: '<span class="title"></span>',
          message:
          '<style>.modal-header .close {margin-top: -17px;margin-right: -9px;}</style>'+
          '<div class="tab-content Flama-normal">'+

            '<div id="divListaExperiencia" class="tab-pane fade in active">'+
              '<div class="row">'+
                '<div class="col-md-10"><h2 class="whiteF" style="margin-top:0px">Tu experiencia laboral</h2></div>'+
                '<div class="col-md-2"><input type="button" class="btn btn-warning btn-block" value="Agregar" onclick="CambiarVisible(\'divListaExperiencia\',\'divAddExperiencia\',true);"></div>'+
              '</div>'+

              '<div class="row">'+
                '<div class="col-md-12">'+
                `<table class="table">
                  <thead>
                    <tr style="background-color:#172c3b;color:white;">
                      <th class="text-center">Institución</th>
                      <th class="text-center">Especialidad</th>
                      <th class="text-center">Inicio</th>
                      <th class="text-center">Fin</th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                    </tr>
                  </thead>
                  <tbody style="background-color:#FFF;" class="text-center" id="formacionAcademicaList">
                  </tbody>
                </table>`+
                '</div>'+
              '</div>'+

            '</div>'+

            '<div id="divAddExperiencia" class="tab-pane fade">'+

              '<div class="row">'+
                '<div class="col-md-12"><h2 class="whiteF" style="margin-top:0px">Agregar experiencia laboral</h2></div>'+
              '</div>'+

              '<form id="formAcademica">'+
                '<input type="hidden" id="experiencia_id">'+

                '<div class="row">'+
                  '<div class="col-md-6">'+
                    '<div class="form-group">'+
                      '<select class="form-control" id="selectEstados" onchange="cargarCiudades(\'#selectEstados\');" name="estado"></select>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-6">'+
                    '<div class="form-group">'+
                      '<select class="form-control invisible" id="selectCiudad"></select>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="row">'+
                  '<div class="col-md-12">'+
                    '<div class="form-group">'+
                      '<input type="text" class="form-control" id="inputPuesto" placeholder="Puesto">'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="row">'+
                  '<div class="col-md-12">'+
                    '<div class="form-group">'+
                      '<input type="text" class="form-control" id="inputInstitucion" placeholder="Institución">'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="row">'+
                  '<div class="col-md-12">'+
                    '<div class="form-group">'+
                      '<textarea class="form-control" id="inputDescripcion" placeholder="Descripción" style="resize: none"></textarea>'+
                    '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="row">'+

                  '<div class="col-md-2">'+
                    '<div class="checkbox" style="text-align:center"><br/>'+
                      '<label style="font-weight:bold">'+
                        '<input type="checkbox" id="inputActual" onChange="cambiarActual(this)"> Actual'+
                      '</label>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-3" id="divInicio">'+
                    '<div class="form-group">'+
                      '<label for="inputInicio">Inicio</label>'+
                      '<input type="date" class="form-control" id="inputInicio">'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-3" id="divFin">'+
                    '<div class="form-group">'+
                      '<label for="inputFin">Fin</label>'+
                      '<input type="date" class="form-control" id="inputFin">'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</form>'+

              '<div class="row">'+
                '<div class="col-md-2"><input type="button" class="btn btn-danger btn-block" value="Cancelar" onclick="CambiarVisible(\'divAddExperiencia\',\'divListaExperiencia\');"></div>'+
                '<div class="col-md-4 pull-right"><input type="button" class="btn btn-warning btn-block" value="Agregar" onclick="agregarExperienciaLaboral()"></div>'+
              '</div>'+
            '</div>'+

        '</div>'
      });
      cargarEstados('selectEstados');
      cargarExperienciaLaboral();
}
//<-------------- function to open login del archivero ------------------>
  function logEncrypt(){
    bootbox.dialog({
      backdrop:false,
      className: 'Intermed-Bootbox',
      title: '<span class"title">Password</span><span class="subtitle">Ingresa a tus historiales</span>',
      message:
        '<div class="container-fluid">'+
          '<div class="hidden" id="noAcceso">'+
            '<h1>'+
              '<span class="label label-danger">'+
              '<span class="glyphicon glyphicon-warning-sign"></span>&nbsp;'+
              'No tiene acceso</span>'+
            '</h1>'+
          '</div>'+

          '<div class="row">'+
            '<div class="col-md-12">'+
              '<div class="form-horizontal">'+
                '<div class="form-group">'+
                  '<div class="row">'+
                    '<label for="inputContraseña" class="col-sm-2 control-label">Password</label>'+
                    '<div class="col-sm-10">'+
                      '<input type="password" class="form-control" id="passinput" placeholder="Password"/>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<div class="form-group">'+
                '<button type="button" class="btn btn-success btn-block"  onclick="isLogin(\'#passinput\')" class="form-control">'+
                  '<span class="glyphicon glyphicon-lock"></span>&nbsp;Ingresar'+
                '</button>'+
              '</div>'+
            '</div>'+
            '<div class="col-md-12 text-center">'+
              '<div class="form-group">'+
                '<a href="#" onclick="updatePassword();">'+
                  '<span class="label label-warning">¿Olvido su contraseña?</span>'+
                '</a>'+
              '</div>'+
            '</div>'+
          '</div>'+

        '</div>'
    });
  }
  function passwordCreate(){
    bootbox.dialog({
      backdrop:false,
      className: 'Intermed-Bootbox',
      title: '<span class"title">Password</span><span class="subtitle">Ingresa tu password para los historiales</span>',
      message:
        '<div class="container-fluid">'+
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<div id="noCoincidenCampos" class="hidden">'+
                '<label class="label label-warning">'+
                  '<span class="glyphicon glyphicon-remove"></span>&nbsp;Los campos no coinciden o estan vacios'+
                  '</label>'+
               '</div>'+
               '<div id="creado" class="hidden">'+
                  '<label class="label label-warning">'+
                    '<span class="glyphicon glyphicon-ok-sign"></span>&nbsp;Se ha creado su contraseña'+
                  '</label>'+
                '</div>'+
                '<div id="Yacreado" class="hidden">'+
                   '<label class="label label-warning">'+
                     '<span class="glyphicon glyphicon-remove-sign"></span>&nbsp;Ya cuenta con una contraseña'+
                   '</label>'+
                 '</div>'+
            '</div>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<div class="form-horizontal">'+
                '<div class="form-group">'+
                  '<label for="inputContraseña" class="col-sm-2 control-label">Password</label>'+
                  '<div class="col-sm-10">'+
                    '<input type="password" class="form-control" id="inputContraseña" placeholder="Password"/>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<div class="form-horizontal">'+
                '<div class="form-group">'+
                  '<label for="inputConfirmar" class="col-sm-2 control-label">Confirmar</label>'+
                  '<div class="col-sm-10">'+
                    '<input type="password" class="form-control" id="inputConfirmar" placeholder="Confirmar contraseña"/>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div class="col-md-12">'+
              '<div class="form-group">'+
                '<button type="button" class="btn btn-success pull-right" onclick="sendContraseña(\'#inputContraseña\',\'#inputConfirmar\');" class="form-control">'+
                  '<span class="glyphicon glyphicon-lock"></span>&nbsp;Crear'+
                '</button>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'
    });
  }
  function updatePassword(){
    bootbox.hideAll();
    bootbox.dialog({
      backdrop:false,
      className: 'Intermed-Bootbox',
      title: '<span class"title">Password</span><span class="subtitle">Cambiar su password</span>',
      message:
      '<div class="container-fluid">'+
        '<div class="row">'+
          '<div class="col-md-12">'+
            '<p>'+
              'Se le enviara un correo con la informacion correspondiente'+
              'para poder cambiar su contraseña debe de validar que su correo'+
              'es con el que se registro en este sitio, su correo es el siguiente:<br />'+
              '<h4>'+
                '<span class="label label-warning">'+
                  '<span class="glyphicon glyphicon-envelope">&nbsp;'+
                    '<span id="validateEmail"></span>'+
                  '</span>'+
                '</span>'+
              '</h4>'+
            '</p>'+
          '</div>'+
          '<div class="col-md-4">'+
            '<button class="btn btn-danger pull-right" onclick="sendMailto(\'#validateEmail\',\'historial\')">'+
              '<span class="glyphicon glyphicon-send">&nbsp; Enviar correo</span>'+
            '</button>'+
          '</div>'+
        '</div>'+
      '</div>'
    });
    getMailSend('#validateEmail');
  }
//<------------- fin function login del archivero ----------------------->

function DetallesCitaPaciente(agenda_id){

    var imagenUrl = '';
    var nombreUsuario = '';
    var nombreUbicacion = '';
    var nombreServicio = '';
    var fecha = '';
    var hora = '';

    var result = null;
    $.ajax( {
      async: false,
      url: '/agenda/detalleCita',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'agenda_id': agenda_id
      },
      success: function ( data ) {
        result = data.result;
        imagenUrl = data.result.Usuario.urlFotoPerfil;
        if (!data.result.Usuario.DatosGenerale.apellidoM) data.result.Usuario.DatosGenerale.apellidoM = '';
        nombreUsuario = data.result.Usuario.DatosGenerale.nombre  + ' ' + data.result.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Usuario.DatosGenerale.apellidoM;
        nombreUbicacion = data.result.Direccion.nombre;
        nombreServicio = data.result.CatalogoServicio.concepto;
        fecha = data.result.fechaHoraInicio.split('T')[0];
        hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });


    box = bootbox.dialog({
      backdrop: true,
      className: 'Intermed-Bootbox',
      title: '<span class="title h65-medium">CITA AGENDADA</span>',
      message:'<div class="col-md-12 h65-medium">'+
            '<div class="row">'+
              '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+
                '<div class="row">'+
                  '<img src="'+imagenUrl+'" style="margin-top:15px;width:100%" class="img-thumbnail">'+
                '</div>'+
              '</div>'+
              '<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">'+
                '<div class="row" style="padding-left:20px">'+
                  '<span class="pull-right"><b>Fecha: </b>'+ fecha +'</span><br/>'+
                  '<span class="pull-right"><b>Hora: </b>'+ hora +'</span><br/><br/>'+
                  '<h4><b>'+nombreUsuario+'</b></h4><br/>'+
                  '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
                  '<b>Servicio: </b>'+nombreServicio+'<br/>'+
                '</div>'+
              '</div>'+

              '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:20px">'+
                '<div class="row">'+
                  '<button class="btn btn-success btn-sm btn-block hidden" id="btnRutaCita"><span class="map-icon icon-map-signs"></span></button>'+
                '</div>'+
              '</div>'+

              '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
                '<div class="row">'+
                  '<div id="mapaUbicacionCita" style="width:100%; height:250px;"></div>'+
                '</div>'+
              '</div>'+

            '</div>'+
          '</div>'+

          '<div class="row">'+
              '<div class="col-md-4 col-md-offset-8">'+
                  '<input type="button" class="btn btn-warning btn-md btn-block" id="btnRegMed" value="Cerrar" onclick="cerrarCurrentBootbox()">'+
              '</div>'+
          '</div>'
        });

        setTimeout(function(){
          cargarMapaUbicacionCita(result);

          //Si se tiene la ubicacion actual del paciente, mostrar boton de ¿Como llegar?
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                function (position) {
                  var latitudCita = result.Direccion.latitud;
                  var longitudCita = result.Direccion.longitud;

                  var latitudActual = position.coords.latitude;
                  var longitudActual = position.coords.longitude;

                  origen = new google.maps.LatLng(latitudActual, longitudActual);
                  destino = new google.maps.LatLng(latitudCita, longitudCita);

                 var centerControlDiv = $('<div></div>');
                 CrearControlRuta(centerControlDiv, mapaUbicacion);

                  centerControlDiv.index = 1;
                  mapaUbicacion.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv[0]);
                });
          };
        },500);
}

var directionsService;
var directionsDisplay = null;
var origen = null;
var destino = null;

function CrearControlRuta(controlDiv, map) {
  if (directionsDisplay){
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  } else {
    var controlUI = $(`<div class="panel-group" style="margin: 10px;font-size: 12px!important;">
      <div class="panel panel-default">
        <div class="panel-heading" style="padding: 5px;text-align:center">
          <a data-toggle="collapse" href="#collapse1" class="collapsed" aria-expanded="false" style="text-decoration: none;color: black;"><span class="map-icon icon-compass"></span></a>
        </div>
        <div id="collapse1" class="panel-collapse collapse" aria-expanded="true">
          <ul class="list-group">
            <li class="list-group-item"><a onclick="mostrarRutaCarro()"><span class="map-icon icon-directions_car"></span></a></li>
            <li class="list-group-item"><a onclick="mostrarRutaCaminando()"><span class="map-icon icon-directions_walk"></span></a></li>
            <li class="list-group-item"><a onclick="mostrarRuta()"><span class="map-icon icon-close"></span></a></li>
          </ul>
        </div>
      </div>
    </div>`);
    controlDiv.append(controlUI);
  }
}

function mostrarRutaCarro(){
  console.log('TRAVELMODE: ' + JSON.stringify(google.maps.TravelMode))
  mostrarRuta(google.maps.TravelMode.DRIVING);
}
function mostrarRutaCaminando(){
  mostrarRuta(google.maps.TravelMode.WALKING);
}

function mostrarRuta(travelMode){
  if(directionsDisplay){
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }
  if (travelMode){
    var request = {
       origin: origen,
       destination: destino,
       travelMode: travelMode,
       unitSystem: google.maps.UnitSystem.IMPERIAL,
       provideRouteAlternatives: true
       };

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    directionsService.route(request, function(response, status) {
         if (status == google.maps.DirectionsStatus.OK) {
             directionsDisplay.setMap(mapaUbicacion);
             directionsDisplay.setDirections(response);
         }
     });
  }
}



function updatePasswordIntermed(){
  bootbox.hideAll();
  bootbox.dialog({
    backdrop:false,
    className: 'Intermed-Bootbox',
    title: '<span class"title">Password intermed</span><span class="subtitle">Cambiar su password</span>',
    message:
    '<div class="container-fluid">'+
      '<div class="row">'+
        '<div class="col-md-12">'+
          '<p>'+
            'Se le enviara un correo con la informacion correspondiente'+
            'para poder cambiar su contraseña debe de validar que su correo'+
            'es con el que se registro en este sitio, su correo es el siguiente:<br />'+
            '<h4>'+
              '<span class="label label-warning">'+
                '<span class="glyphicon glyphicon-envelope">&nbsp;'+
                  '<span id="validateEmail"></span>'+
                '</span>'+
              '</span>'+
            '</h4>'+
          '</p>'+
        '</div>'+
        '<div class="col-md-4">'+
          '<button class="btn btn-danger pull-right" onclick="sendMailto(\'#validateEmail\',\'intermed\')">'+
            '<span class="glyphicon glyphicon-send">&nbsp; Enviar correo</span>'+
          '</button>'+
        '</div>'+
      '</div>'+
    '</div>'
  });
  getMailSend('#validateEmail');
}

function editarPerfilPersonal(){
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
  },
  className: 'Intermed-Bootbox',
  title: '<span class="title">Editar información personal</span>',
  backdrop: true,
  /*size:'large',*/
  message:
  '<div class="tab-content tabBootBox">'+
    '<div class="tab-pane active" role="tabpanel" id="tabPerfil">'+
      '<div class="row" style="padding: 10px 15px;">'+
        '<div class="h77-boldcond s20" style="color:#172C3B;">'+
          '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;INFORMACIÓN PERSONAL.'+
          '</div>'+
        '</div>'+
      '<div class="row">'+
        '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">'+
          '<div class="profilePic header-profile-photo-link center-block">'+
            '<img id="imgPerfilMedic" src="" width="200" height="200" class="img-rounded fotoPerfil">'+
            '<label for="imageFile">Cambiar Imagen</label>'+
            '<input type="file" id="imageFile" style="display:none" onchange="seleccionarImagenPerfil(this)">'+
            '</div>'+
          '</div>'+
        '<div class="col-lg-7 col-md-7 col-sm-7 col-xs-12">'+
          '<div class="form-group">'+
            '<label>Nombre:</label>'+
            '<input class="form-control" placeholder="Nombre" id="nombrePersonal">'+
            '</div>'+
          '<div class="form-group">'+
            '<div class="row">'+
              '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
                '<label>Apellido:</label>'+
                '</div>'+
              '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">'+
                '<input class="form-control" placeholder="Apellido paterno" id="appPatPersonal">'+
              '</div>'+
              '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">'+
                '<input class="form-control col-lg-6 col-md-6 col-sm-6 col-xs-6" placeholder="Apellido materno" id="appMatPersonal">'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="form-group">'+
            '<label>Fecha de Nacimiento</label>'+
            '<input type="date" class="form-control" id="fechaNacimiento" style="text-align: center;" />'+
            '</div>'+
          '</div>'+
        '</div>'+
      '<div class="row" style="padding: 10px 15px;">'+
        '<div class="h77-boldcond s20" style="color:#172C3B;">'+
          '<span class="glyphicon glyphicon-filter"></span>&nbsp;&nbsp;PALABRAS CLAVE.'+
          '</div>'+
        '</div>'+
      '<div class="row">'+
        '<div class="col-md-12">'+
          '<form onsubmit="return editPalabrasClave();">'+
            '<div class="input-group">'+
              '<input type="text" class="form-control" id="autoPalabras" placeholder="Palabras clave" required>'+
              '<span class="input-group-btn">'+
                '<button id="palabrasEdit" class="btn btn-success form-control" type="submit">'+
                  '<span class="glyphicon glyphicon-plus"></span>'+
                '</button>'+
              '</span>'+
            '</div>'+
          '</form>'+
        '</div>'+
        '<div class="col-md-12" id="PalabrasClaveList" style="text-align: center;">'+
        '</div>'+
      '</div>'+
      '<div class="row footerBootbox">'+
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-right">'+
          '<button class="btn btn-success btn-lg btn-block" onclick="guardarInformacionPersonal()">Guardar cambios</button>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="tab-pane" role="tabpanel" id="tabImagen">'+
      '<div class="row" id="CambiarFotoPerfil" name="CambiarFotoPerfil">'+
        '<div class="col-md-12">'+
          '<form>'+
            '<div class="" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">'+
              '<input type="hidden" value="" name="base64file" id="base64file">'+
              '<div class="col-md-12" id="contenedorFoto" class="text-center" style="width: auto;margin: auto"></div>'+
              '<canvas id="canvas" height="300" width="300" style="display: none"></canvas>'+
            '</div>'+
          '</form>'+
        '</div>'+
      '</div>'+
      '<div class="row footerBootbox">'+
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">'+
          '<input type="button" class="btn btn-danger btn-lg btn-block" id="btnRegMed" value="Cancelar" onclick="$(\ #tabPerfil\ ).addClass(\ active\ );$(\ #tabImagen\ ).removeClass(\ active\ );">'+
        '</div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">'+
          '<input type="button" class="btn btn-success btn-lg btn-block" id="btnRegMed" value="Guardar" onclick="guardarImagenPerfil();">'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });
  loadGenerales();
  loadPalabras();
  loadFechaNac("#fechaNacimiento");
}


function editarEspecialidades(){
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
  },
  className: 'Intermed-Bootbox',
  title: '<span class="title"></span>',
  backdrop: true,
  message:
    '<style>.modal-header .close {margin-top: -17px;margin-right: -9px;}</style>'+
    '<div class="tab-content tabBootBox">'+
      '<div class="tab-pane active" role="tabpanel" id="tabPerfil">'+
          '<div class="container-fluid">'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="whiteF h77-boldcond" style="font-size: 18px;padding: 8px;background-color: #172C3B;margin: -10px;margin-bottom: 5px;">'+
                    '<span class="glyphicon glyphicon-th-list"></span>&nbsp;&nbsp;ESPECIALIDADES.'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-12">'+
                  '<div class="input-group">'+
                    '<input type="text" id="autoEsp" class="form-control autoEspecialidad">'+
                    '<span class="input-group-btn">'+
                      '<button id="addEspecialidadMedic" onclick="agregarEspecialidad(\'autoEsp\');" class="btn btn-primary form-control" type="button">'+
                        '<span class="glyphicon glyphicon-plus"></span>'+
                      '</button>'+
                    '</span>'+
                  '</div>'+
                '</div>'+



                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="regmedEsp" style="margin-top:10px">'+
                  '<ul class="list-inline" id="especialidadesListBoot"></ul>'+
                '</div>'+

              '</div>'+


              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="whiteF h77-boldcond" style="font-size: 18px;padding: 8px;background-color: #172C3B;margin: -10px;margin-bottom: 5px;margin-top:20px;">'+
                    '<span class="glyphicon glyphicon-th-list"></span>&nbsp;&nbsp;SUBESPECIALIDADES.'+
                  '</div>'+
                '</div>'+

                '<div class="col-md-12">'+
                  '<div class="input-group">'+
                    '<input type="text" id="autoSubEsp" class="form-control autoEspecialidad">'+
                    '<span class="input-group-btn">'+
                      '<button id="addEspecialidadMedic" onclick="agregarSubespecialidad(\'autoSubEsp\');" class="btn btn-primary form-control" type="button">'+
                        '<span class="glyphicon glyphicon-plus"></span>'+
                      '</button>'+
                    '</span>'+
                  '</div>'+
                '</div>'+

                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="regmedEsp" style="margin-top:10px">'+
                  '<ul class="list-inline" id="subEspecialidadesListBoot"></ul>'+
                '</div>'+

              '</div>'+
            '</div>'+

        '</div>'+

    '</div>'
  });
  setTimeout(function(){
  loadEspecialidades();
  },300);
}

function detallesError(error_id, element){


  var error = '';
  var fecha = '';
  var descripcion = '';
  var comentarios = '';
  var estatus = '';
  var footerBootbox = '';
  var contenidoatiende = '';
  var panelcomentarios = '';
  $.ajax({
    url: '/control/err/getById',
    type: 'POST',
    dataType: "json",
    data: {
      id: error_id
    },
    async: false,
    cache: false,
    type: 'POST',
    success: function( data ) {
      if (data.success){
        if (data.result){

          if (element){
            $(element).attr('onclick', 'detallesError('+ error_id +')');
            var clone = $(element).parent().parent().clone();
            $(element).parent().parent().remove();
            $('#errNoAt').find('tbody').append(clone);
            contarErrores();
          }

          estatus = parseInt(data.result.status);

          var permisos = true;
          if (parseInt(estatus) == 2){
            //No puede cambiar de estatus el error, ni agregar comentarios
            if (parseInt(data.usuariointermed.rolUsuario_id) == 1){
              permisos = true;
            } else if (parseInt(data.result.userIntermed_id) != parseInt(data.usuariointermed.id) ){
              permisos = false;
            }
          }
          //"DBError_userIntermed":{"id":1,"nombre":"Adminitrador","correo":"admin@newchannel.mx"},
          if (data.result.DBError_userIntermed){
            contenidoatiende = '<a class="list-group-item disabled"><b>Atendido por:</b> '+ data.result.DBError_userIntermed.nombre  + ' [' + data.result.DBError_userIntermed.correo + '] </a>';
            contenidoatiende += '<a class="list-group-item disabled"><b>Fecha:</b> '+ new Date(data.result.datetimeupdated).toLocaleString('en-US')  +' </a>';
          }

          if (permisos){
            if (estatus >= 0 && estatus <= 2){
              panelcomentarios =
                '<div class="row" style="margin-top:20px;margin-bottom:20px" id="panelcomentarios">'+
                  '<div class="col-md-12">'+
                    '<form role="form" onsubmit="return agregarComentarioErr('+error_id+',\'ErrComent\')" id="addComentErr">'+
                      '<div class="input-group">'+
                        '<textarea class="form-control custom-control" rows="3" style="resize:none;height: 80px;" id="ErrComent" placeholder="Nuevo comentario..." required></textarea>'+
                        '<span class="input-group-btn">'+
                          '<button class="btn btn-primary" style="height: 80px;">Agregar</button>'+
                        '</span>'+
                      '</div>'+
                    '</form>'+
                  '</div>'+
                '</div>';
              var label = '';
              var clase = '';
              if (estatus == 0 || estatus == 1){
                label = 'Atender log';
                clase = 'btn-success';
                estatus = 2;
              } else if (estatus == 2){

                estatus = 3;
                label = 'Marcar como solucionado';
                clase = 'btn-danger';
              }
              footerBootbox =
                  '<div class="row footerBootbox" style="padding-top:20px;padding-bottom:20px">'+
                    '<div class="col-md-12">'+
                      '<div class="row">'+
                        '<input type="hidden" id="estatusError" value="'+ estatus +'">'+
                        '<button onclick="guardarEstatusError('+ error_id +',\'estatusError\',this);" class="btn '+clase+' btn-block form-control" type="button">'+ label +'</button>'+
                      '</div>'+
                    '</div>'+
                  '</div>';
            }
          }

          error = data.result.err;
          fecha = data.result.datetime;
          if ( data.result.jsonContent ){
            var jsonContent = data.result.jsonContent;
            descripcion += '<div class="list-group" id="atiendeLog">' + contenidoatiende + '</div>';

            descripcion += '<div class="list-group"><a href="#" class="list-group-item active"><b>Detalles de error:</b></a>';
            descripcion += '<a class="list-group-item disabled"><b>Error: </b>' + jsonContent.err +'</a>';
            if (jsonContent.usuario_id){
              descripcion +=  '<a class="list-group-item disabled"><b>Usuario: </b>' + jsonContent.usuario_id  +'</a>';
            }
            if (jsonContent.session){
              descripcion +=  '<a class="list-group-item disabled"><b>Sesion: </b>' + jsonContent.session  +'</a>';
            }
            if (jsonContent.file){
              descripcion +=  '<a class="list-group-item disabled"><b>Controlador:</b> ' + jsonContent.file  +'</a>';
            }
            if (jsonContent.function){
              descripcion +=  '<a class="list-group-item disabled"><b>Función:</b>' + jsonContent.function  +'</a>';
            }
            if (jsonContent.protocol){
              descripcion +=  '<a class="list-group-item disabled"><b>Protocolo:</b> ' + jsonContent.protocol  +'</a>';
            }
            if (jsonContent.host){
              descripcion +=  '<a class="list-group-item disabled"><b>Host:</b> ' + jsonContent.host  +'</a>';
            }
            if (jsonContent.method){
              descripcion +=  '<a class="list-group-item disabled"><b>Metodo:</b> ' + jsonContent.method  +'</a>';
            }
            if (jsonContent.path){
              descripcion +=  '<a class="list-group-item disabled"><b>Path:</b> ' + jsonContent.path  +'</a>';
            }
            if (jsonContent.headers){
              descripcion +=  '<a class="list-group-item active"><b>Headers</b></a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Connection:</b> ' + jsonContent.headers.connection +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Cache-control:</b> ' + jsonContent.headers['cache-control'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Upgrade-insecure-requests:</b> ' + jsonContent.headers['upgrade-insecure-requests'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>User-agent:</b> ' + jsonContent.headers['user-agent'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Accept-encoding:</b> ' + jsonContent.headers['accept-encoding'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Accept-language:</b> ' + jsonContent.headers['accept-language'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>if-none-match:</b> ' + jsonContent.headers['if-none-match'] +'</a>';
              descripcion +=  '<a class="list-group-item disabled" style="overflow-x: auto;"><b>Cookie:</b> ' + jsonContent.headers.cookie +'</a>';
            }
            descripcion += '</div>';

            comentarios += '<div class="list-group" id="listComentErr"><a href="#" class="list-group-item active"><b>Comentarios:</b></a>';
            data.result.jsonContent.comentarios.forEach(function(coment){
              comentarios += '<a class="list-group-item disabled" style="overflow-x: auto;"><small class="pull-right">'+ new Date(coment.datetime) +'</small><b>'+ coment.usuario.nombre +':</b><br><br> ' + coment.comentario +'</a>';
            });
            comentarios += '</div>';
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

    bootbox.dialog({
      onEscape: function () {
        bootbox.hideAll();
    },
    className: 'Intermed-Bootbox',
    title: '<span class="title">'+ error +'</span><span class="subtitle">'+ fecha +'</span>',
    backdrop: true,
    message:
        '<div class="row">'+
        '<div class="col-md-12">'+

          '<ul class="nav nav-tabs menuBootbox" role="tablist">'+
            '<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Detalles</a></li>'+
            '<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Historial</a></li>'+
          '</ul>'+

          '<div class="tab-content" style="margin-top:20px">'+
            '<div role="tabpanel" class="tab-pane active" id="home">'+

              descripcion +
            '</div>'+
            '<div role="tabpanel" class="tab-pane" id="profile">'+
              panelcomentarios +

              comentarios +
              '</div>'+
          '</div>'+
        '</div>'+

      '</div>'+

      footerBootbox
    });

    setTimeout(function(){
      $('#estatusError').val(estatus);
    },300);
}

var bootSec = null;
var popover = null;
function detalleCitaSecretaria(agenda_id){
    var imagenUrl = '';
    var nombreUsuario = '';
    var nombreUbicacion = '';
    var nombreServicio = '';
    var fecha = '';
    var hora = '';
    var result = '';
    var nota = '';

    $.ajax( {
      async: true,
      url: '/agenda/detalleCita',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: {
        'agenda_id': agenda_id
      },
      success: function ( data ) {
        if (data.result){
          result = data.result;
          if (data.result.Paciente){
            imagenUrl = data.result.Paciente.Usuario.urlFotoPerfil;
            if (!data.result.Paciente.Usuario.DatosGenerale.apellidoM) data.result.Paciente.Usuario.DatosGenerale.apellidoM = '';
            nombreUsuario = data.result.Paciente.Usuario.DatosGenerale.nombre  + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + data.result.Paciente.Usuario.DatosGenerale.apellidoM;
          } else {
            nombreUsuario = data.result.PacienteTemporal.nombres  + ' ' + data.result.PacienteTemporal.apellidos;
          }
          nombreUbicacion = data.result.Direccion.nombre;
          nombreServicio = data.result.CatalogoServicio.concepto;
          fecha = data.result.fechaHoraInicio.split('T')[0];
          hora = data.result.fechaHoraInicio.split('T')[1].split(':00.')[0];

          if (data.result.nota){
            nota = data.result.nota;
          }

          var editar = true;
          var estatus = '';
          if ((data.result.status != 1)){
            editar = false;
            if (data.result.status == 2){
              estatus = 'Cancelada por el médico.';
            } else if (data.result.status == 1){
              estatus = 'Cancelada por el paciente.';
            }
          } else if (formatearTimestampAgenda(new Date(data.result.fechaHoraInicio).getTime()) < formatearFecha(new Date())){
            estatus = "La cita ya finalizo.";
            editar = false;
          }

          var modal = '<div class="row">'+
            '<div class="col-md-3 col-sm-3 col-xs-3">'+
              '<img src="'+imagenUrl+'" class="img-rounded img-responsive" style="margin-top:20px;">'+
            '</div>'+
            '<div class="col-md-9 col-sm-9 col-xs-9">'+
              '<div class="body-container"><div class="center-content">'+
                '<h2><strong>'+nombreUsuario+'</strong></h2>'+
              '</div></div>'+
            '</div>'+
          '</div>'+

          '<div class="row">'+
            '<div class="col-md-8 col-sm-8 s20">'+
              '<span><b>Fecha: </b>'+ fecha +'</span><br/>'+
              '<span><b>Hora: </b>'+ hora +'</span><br/><br/>'+
              '<b>Ubicacion: </b>'+nombreUbicacion+'<br/>'+
              '<b>Servicio: </b>'+nombreServicio+'<br/>'+
            '</div>';

          if (editar){
            modal += '<div class="col-md-4 col-sm-4">'+
                '<button class="btn btn-default btn-block s20" style="color: #5cb85c;font-weight: bold;">Reagendar</button>'+
                '<button class="btn btn-default btn-block s20" style="color: #f0ad4e;font-weight: bold;" onClick="retrasaCita(' + agenda_id + ')">Retrasar</button>'+
                '<div class="btn-group btn-block">'+
                    '<button type="button" class="btn btn-default btn-block s20 dropdown-toggle" style="color: #d43f3a;font-weight: bold;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Cancelar</button>'+
                    '<ul class="dropdown-menu" style="width:100%">'+
                      '<li class="text-center" ><strong>¿Quién cancela?</strong></li>'+
                      '<li role="separator" class="divider"></li>'+
                      '<li class="text-center" style="cursor:pointer" onclick="secretariaCancelaCita('+agenda_id+',true)">Médico</li>'+
                      '<li role="separator" class="divider"></li>'+
                      '<li class="text-center" style="cursor:pointer" onclick="secretariaCancelaCita('+agenda_id+')">Paciente</li>'+
                    '</ul>'+
                  '</div>'+
              '</div>'+
            '</div>'+
            '<div class="row">'+
              '<div class="col-md-12 s20">'+
                '<label for="inputNotasCita">Notas: </label>'+
              '</div>'+
              '<div class="col-md-12 s20">'+
                  '<textarea class="form-control custom-control s20" rows="7" style="resize:none" id="inputNotasCita" maxlength="250">'+ nota +'</textarea>'+
              '</div>';
          } else {
            modal += '<div class="col-md-8 col-sm-8 s20">'+
              '<br><span><b>Estatus: </b><span style="color: red;font-weight:bold">'+ estatus +'</span></span><br/>'+
            '</div>';
          }

          if (editar){
            modal += '<div class="col-md-6 col-sm-4 col-xs-4 pull-right">'+
                  '<div class="form-group">'+
                      '<button class="btn btn-primary btn-md btn-block" id="btnRegMed"  onclick="guardarNotaSecretaria('+agenda_id+',\'inputNotasCita\')">Guardar</button>'+
                  '</div>'+
              '</div>'+

              '<div class="col-md-2 col-sm-4 col-xs-4 pull-left">'+
                  '<div class="form-group">'+
                      '<button class="btn btn-danger btn-block" id="btnRegMed" onclick="bootSec.hide()">Cerrar</button>'+
                  '</div>'+
              '</div>'+
            '</div>';
          } else {
            modal += '<div class="col-md-12">'+
                  '<div class="form-group">'+
                      '<button class="btn btn-danger btn-block" id="btnRegMed" onclick="bootSec.hide()">Cerrar</button>'+
                  '</div>'+
              '</div>'+
            '</div>';
          }




          bootSec =  bootbox.dialog({
              onEscape: function () {
                bootSec.hide();
            },
            backdrop: false,
            className: 'Intermed-Bootbox',
            title: '',
            message: modal
          });

          $('.bootbox-close-button').css('margin-top','0px');
          $('.bootbox-close-button').css('margin-right','5px');

        }
      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });
  //  alert(data.split("|")[0]);
}


function verAgendaMedico(medico_id){
  console.log('nombre y foto por ajax');
  var nombremedico = 'Médico de prueba uno';
  var urlFotoPerfil = '/garage/profilepics/dpp.png';
  //Agendar cita
  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    size:'large',
    className: 'Intermed-Bootbox',
    title: '<span class="title" id="agendaMedicoTitle"></span>',
    message:
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<form method="POST" name="frmRegCita" id="frmRegCita">'+
                '<input type="hidden" id="medico_id" name="medico_id" value="'+ medico_id +'">'+
                '<div class="col-md-10 text-left"><div class="btn-group" ><button type="button" class="btn btn-default direccionlist active" onclick="destacarDireccion(this)">VER TODAS</button><button type="button" class="btn btn-default direccionlist" onclick="destacarDireccion(this,\'direccion_0\')">Dirección 1</button><button type="button" class="btn btn-default direccionlist" onclick="destacarDireccion(this,\'direccion_1\')">Dirección 2</button><button type="button" class="btn btn-default direccionlist" onclick="destacarDireccion(this,\'direccion_2\')">Dirección 3</button></div></div>'+
                '<div class="col-md-2"><div class="row"><button type="button" class="btn btn-default btn-md pull-right" onclick="activarDesactivarAgregarCita(this)" id="btnAddCita">Agregar cita</button></div></div>'+
                '<div class="col-md-12" id="divCalendarioPadre"><div class="row"><div id="divCalendario" class="regHorMed"></div></div></div>'+
              '</form>'+
            '</div>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-md-4 pull-left">'+
              '<input type="button" class="btn btn-drop btn-block " value="Cancelar" onclick="bootbox.hideAll();">'+
            '</div>'+
            '<div class="col-md-4 pull-right">'+
              '<input type="button" class="btn btn-save btn-block " value="Agendar cita" onclick="registrarCita()">'+
            '</div>'+
          '</div>'
  });
  horariosAgendaMedico(medico_id);
}

var secondaryBootbox = null;

function agregarCitaPorServicio(servicios){
  var contenido = '';
  servicios.forEach(function(servicio){
    contenido += '<option value="'+ servicio.id +'">'+ servicio.concepto + '  (' + servicio.duracion +')</option>';
  });
  secondaryBootbox = bootbox.dialog({
    backdrop: false,
    size:'large',
    className: 'Intermed-Bootbox',
    title: '<span class="title">Selecciona paciente</span>',
    message:
          '<div class="row">'+
            '<div class="col-md-12">'+
              '<select class="form-control"><option value="" disabled selected></option>'+ contenido + '</select>'+
            '</div>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-md-4 pull-left">'+
              '<input type="button" class="btn btn-drop btn-block " value="Cancelar" onclick="secondaryBootbox.hide();">'+
            '</div>'+
            '<div class="col-md-4 pull-right">'+
              '<input type="button" class="btn btn-save btn-block " value="Seleccionar" onclick="registrarCita()">'+
            '</div>'+
          '</div>'
  });
}


function registrarNuevaCitaBootbox(inicio, fin, medico, servicio_id){
  //Modal para seleccionar paciente o introducir uno que no existe

  secondaryBootbox = bootbox.dialog({
    backdrop: false,
    size:'large',
    className: 'Intermed-Bootbox',
    title: '<span class="title text-center" style="font-weight:bold">¿Quién es el paciente?</span>',
    message:
      '<form method="post" onsubmit="return registrarCitaPacienteTemporal('+inicio+','+fin+','+medico+','+servicio_id+')">'+
          '<div class="row">'+
            '<div class="col-md-6">'+
                '<div class="input-group">'+
                  '<input type="text" id="inputBusquedaPaciente" class="form-control" placeholder="Encuentralo en Intermed..."  onchange="BuscarPaciente(\'inputBusquedaPaciente\',\'resultadosBusquedaPaciente\')">'+
                  '<span class="input-group-btn">'+
                    '<button type="button" class="btn btn-secondary" type="button"  onclick="BuscarPaciente(\'inputBusquedaPaciente\',\'resultadosBusquedaPaciente\')">Buscar</button>'+
                  '</span>'+
                '</div>'+
                '<ul class="list-group" id="resultadosBusquedaPaciente">'+
                  '<li class="list-group-item media" style="margin-top:0px">'+
                      '<div class="media-left"><a href="#"><img class="media-object" src="https://image.freepik.com/iconos-gratis/perfil-macho-sombra-de-usuario_318-40244.jpg" alt="..." style="width:40px"></a></div>'+
                      '<div class="media-body"><h4 class="media-heading">Nombre del paciente</h4><small>Zapopan, Jalisco.</small></div>'+
                      '<div class="media-right"><button type="button" class="btn btn-primary btn-sm" onclick="registrarCitaPacienteTemporal('+inicio+','+fin+','+medico+','+servicio_id+',2)">Seleccionar</button></div>'+
                  '</li>'+
                  '<li class="list-group-item media" style="margin-top:0px">'+
                      '<div class="media-left"><a href="#"><img class="media-object" src="https://image.freepik.com/iconos-gratis/perfil-macho-sombra-de-usuario_318-40244.jpg" alt="..." style="width:40px"></a></div>'+
                      '<div class="media-body"><h4 class="media-heading">Nombre del paciente</h4><small>Zapopan, Jalisco.</small></div>'+
                      '<div class="media-right"><button type="button" class="btn btn-primary btn-sm">Seleccionar</button></div>'+
                  '</li>'+
                  '<li class="list-group-item media" style="margin-top:0px">'+
                      '<div class="media-left"><a href="#"><img class="media-object" src="https://image.freepik.com/iconos-gratis/perfil-macho-sombra-de-usuario_318-40244.jpg" alt="..." style="width:40px"></a></div>'+
                      '<div class="media-body"><h4 class="media-heading">Nombre del paciente</h4><small>Zapopan, Jalisco.</small></div>'+
                      '<div class="media-right"><button type="button" class="btn btn-primary btn-sm">Seleccionar</button></div>'+
                  '</li>'+
                  '<li class="list-group-item media" style="margin-top:0px">'+
                      '<div class="media-left"><a href="#"><img class="media-object" src="https://image.freepik.com/iconos-gratis/perfil-macho-sombra-de-usuario_318-40244.jpg" alt="..." style="width:40px"></a></div>'+
                      '<div class="media-body"><h4 class="media-heading">Nombre del paciente</h4><small>Zapopan, Jalisco.</small></div>'+
                      '<div class="media-right"><button type="button" class="btn btn-primary btn-sm">Seleccionar</button></div>'+
                  '</li>'+
                '</ul>'+
            '</div>'+
            '<div class="col-lg-6 col-md-6 regCorreo">'+
              '<h3>Regístrate con tu correo electrónico</h3>'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<div class="alert alert-danger hidden" id="dangerMsg" role="alert"></div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" placeholder="Nombre(s)" required id="nombrePaciente">'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" placeholder="Apellido(s)" id="apellidoPaciente">'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="email" class="form-control" placeholder="Correo electrónico" id="correoPaciente">'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-md-12">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" placeholder="Celular" id="celularPaciente">'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-md-4 pull-left">'+
              '<input type="button" class="btn btn-drop btn-block " value="Cancelar" onclick="secondaryBootbox.hide();">'+
            '</div>'+
            '<div class="col-md-4 pull-right">'+
              '<input type="submit" class="btn btn-save btn-block " value="Guardar">'+
            '</div>'+
          '</div>'+
        '</form>'
  });
}

function verDetalleComentario(comentario_id){
    $.post('/paciente/detallesComentario',{
      comentario_id: comentario_id
    }, function(data){
      if (data.success){
        if (data.result){
          data.result.fecha = formatearFechaComentario(new Date(data.result.fecha).toLocaleDateString().split(' ')[0]);
          data.result.fecharespuesta = formatearFechaComentario(new Date(data.result.fecharespuesta).toLocaleDateString().split(' ')[0]);

          if (data.result.Medico.Usuario.DatosGenerale.apellidoM && data.result.Medico.Usuario.DatosGenerale.apellidoM != ""){
            data.result.Medico.Usuario.DatosGenerale.apellidoM = ' ' +data.result.Medico.Usuario.DatosGenerale.apellidoM;
          } else {
            data.result.Medico.Usuario.DatosGenerale.apellidoM = '';
          }

          if (data.result.Usuario.DatosGenerale.apellidoM && data.result.Usuario.DatosGenerale.apellidoM != ""){
            data.result.Usuario.DatosGenerale.apellidoM = ' ' + data.result.Usuario.DatosGenerale.apellidoM;
          } else {
            data.result.Usuario.DatosGenerale.apellidoM = '';
          }

          var nombreMedico = data.result.Medico.Usuario.DatosGenerale.nombre + ' ' + data.result.Medico.Usuario.DatosGenerale.apellidoP + data.result.Medico.Usuario.DatosGenerale.apellidoM;
          var nombrePaciente = data.result.Usuario.DatosGenerale.nombre + ' ' + data.result.Usuario.DatosGenerale.apellidoP + data.result.Usuario.DatosGenerale.apellidoM;

          secondaryBootbox = bootbox.dialog({
            backdrop: true,
            size:'large',
            className: 'Intermed-Bootbox',
            title: '<span class="title text-center" style="font-weight:bold"></span>',
            message:
                  '<div class="row">'+
                    '<div class="col-md-12">'+
                      '<div class="comentario row">'+
                        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">'+
                          '<div class="media comment-container">'+
                            '<div class="media-left">'+
                              '<img class="img-circle comment-img" style="width: 150px;" src="'+ data.result.Usuario.urlFotoPerfil +'">'+
                            '</div>'+
                            '<article class="media-body">'+
                              '<div class="text-uppercase s30 h67-medcond">'+ data.result.titulo +'</div>'+
                              '<p class="s15 h67-medium">'+ data.result.comentario +'</p>'+
                              '<p class="comment-autor s15 h75-bold noMargin">'+
                                '<span class="text-capitalize">'+ nombrePaciente +'</span>'+
                              '</p>'+
                              '<p class="comment-date s15 h67-medium text-info noMargin">'+ data.result.fecha +'</p>'+
                            '</article>'+
                          '</div>'+
                        '</div>'+
                        '<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 pull-right">'+
                          '<div class="media comment-container">'+
                            '<article class="media-body text-right">'+
                              '<p class="s15 h67-medium">'+ data.result.respuesta +'</p>'+
                              '<p class="comment-autor s15 h75-bold noMargin">'+
                              '<span class="text-capitalize">'+ nombreMedico +'</span></p>'+
                              '<p class="comment-date s15 h67-medium text-info noMargin">' + data.result.fecharespuesta + '</p>'+
                            '</article>'+
                            '<div class="media-right">'+
                            '<img class="img-circle comment-img noMargin" style="width:70px;" src="'+ data.result.Medico.Usuario.urlFotoPerfil +'">'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                '</div>'
          });
        }
      } else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    }).fail(function(e){
      console.error("Post error: "+JSON.stringify(e));
    });
}


// Diálogo para retrasar cita
function retrasaCita(id)
{
    var box = bootbox.dialog({
      show: false,
      backdrop: true,
      animate: false,
      onEscape: function () {
          bootbox.hideAll();
      },
      title: 'Retrasar Cita' ,
      message:
      '<div class="col-md-12">'+
          '<select id="tiempoRetrasoCita" class="form-control regInput" name="tiempoRetrasoCita" required="required">'+
          '<option value="" selected disabled>Selecciona</option>'+
          '<option value="00:15">15 minutos</option>'+
          '<option value="00:30">30 minutos</option>'+
          '<option value="01:00">1 hora</option>'+
          '<option value="01:30">1 Hora 30 Minutos</option>'+
          '<option value="02:00">2 Horas</option>'+
        '</select></div><br>',
      buttons: {
          cancel: {
              label: 'Cancelar',
              className: 'btn-warning'
          },
          save: {
              label: 'Aceptar',
              className: 'btn-success',
              callback: function () {
                var tiempo = $('#tiempoRetrasoCita').val();
                $.ajax({
                     async: false,
                     url: '/agenda/retrasarCita',
                     type: 'POST',
                     dataType: "json",
                     cache: false,
                     data: {
                       'id': id,
                       'tiempo' : tiempo
                     },
                     success: function () {
                        alert('Se ha mandado la solicitud de retraso de cita ');
                     },
                     error: function ( jqXHR, textStatus, err ) {
                       console.error( 'AJAX ERROR: ' + err );
                     }
                });
              }
          }
      }
    });

    box.modal('show');
}

// Diálogo para retrasar cita
/*
function aceptaRetrasoCita(id)
{
    var box = bootbox.dialog({
      show: false,
      backdrop: true,
      animate: false,
      onEscape: function () {
          bootbox.hideAll();
      },
      title: 'Retrasar Cita' ,
      message:
      '<div class="col-md-12"> Retraso de Cita</div><br>',
      buttons: {
          cancel: {
              label: 'Cancelar',
              className: 'btn-warning',
              callback: function () {
                $.ajax({
                     async: false,
                     url: '/agenda/aceptarCambioCita',
                     type: 'POST',
                     dataType: "json",
                     cache: false,
                     data: {
                       'id': id,
                       'estatus' : false
                     },
                     success: function () {
                        alert('Se ha cancelado la cita !');
                     },
                     error: function ( jqXHR, textStatus, err ) {
                       console.error( 'AJAX ERROR: ' + err );
                     }
                });
          },
          save: {
              label: 'Aceptar',
              className: 'btn-success',
              callback: function () {
                $.ajax({
                     async: false,
                     url: '/agenda/aceptarCambioCita',
                     type: 'POST',
                     dataType: "json",
                     cache: false,
                     data: {
                       'id': id,
                       'estatus' : true
                     },
                     success: function () {
                        alert('Se ha cambiado la cita !');
                     },
                     error: function ( jqXHR, textStatus, err ) {
                       console.error( 'AJAX ERROR: ' + err );
                     }
                });
              }
          }
      }
    });

    box.modal('show');
}
*/

// Diálogo para cancelar cita
/*
function cancelarCita(id)
{
    var box = bootbox.dialog({
      show: false,
      backdrop: true,
      animate: false,
      onEscape: function () {
          bootbox.hideAll();
      },
      title: 'Cancelar Cita' ,
      message:
      '<div class="col-md-12"> Desea cancelar le cita ?</div><br>',
      buttons: {
          cancel: {
              label: 'Cancelar Operación',
              className: 'btn-warning',
          },
          save: {
              label: 'Aceptar',
              className: 'btn-success',
              callback: function () {
                $.ajax({
                     async: false,
                     url: '/agenda/cancelarCita',
                     type: 'POST',
                     dataType: "json",
                     cache: false,
                     data: {
                       'id': id
                     },
                     success: function () {
                        alert('Se ha cancelado la cita !');
                     },
                     error: function ( jqXHR, textStatus, err ) {
                       console.error( 'AJAX ERROR: ' + err );
                     }
                });
              }
          }
      }
    });

    box.modal('show');
}
*/
