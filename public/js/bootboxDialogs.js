function agregarUbicacion(ubicacion_id){
  console.log('Ubicacion_id: ' + ubicacion_id);
  var id = '', nombre = '', principal = '', calle = '', numero = '', interior = '';
  var callea = '', calleb = '', estado = '', municipio = '', localidad = '', cp = '';
  var latitud = '', longitud = '';
  var btnGuardar = 'Añadir ubicación';

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
        id = data.id;
        nombre = data.nombre;
        if (data.principal == 1){
          principal = 'checked="checked"';
        }
        calle = data.calle;
        numero = data.numero;
        if (data.numeroInt){
          interior = data.numeroInt;
        }
        callea = data.calle1;
        calleb = data.calle2;
        estado = data.Municipio.Estado.id
        municipio = data.Municipio.id;
        localidad = data.Localidad.id;
        cp = data.Localidad.CP;
        latitud = data.latitud;
        longitud = data.longitud;
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
  }


  bootbox.dialog({
    backdrop: true,
    onEscape: function () {
        bootbox.hideAll();
    },
    size:'large',
    message: `
    <div class="" style="background-color:#172c3b;padding:5px;margin:-15px;" >
    <div class="col-md-12" style="color:white">
      <h2 class="s25">CONFIGURA TUS UBICACIONES Y HORARIOS DE ATENCIÓN.</h2>
      <h3 class="s20">Señala la ubicación en el mapa y registra el horario de atención correspondiente con cada una.</h3>
    </div>

    <ul class="nav nav-tabs menuBootbox">
      <li class="active"><a data-toggle="tab" href="#divUbicacion">UBICACIONES</a></li>
      <li><a data-toggle="tab" href="#divHorarios">HORARIOS</a></li>
    </ul>

    <div class="tab-content">

    <div id="divUbicacion" class="tab-pane fade in active">
        <form method="POST" name="frmRegUb" id="frmRegUbi">
            <input type="hidden" id="idDireccion" name="idDireccion" value="`+id+`">
            <input type="hidden" id="idEstado" name="idDireccion" value="`+estado+`">
            <input type="hidden" id="idMunicipio" name="idDireccion" value="`+municipio+`">
            <input type="hidden" id="idLocalidad" name="idDireccion" value="`+localidad+`">
            <div class="row">
                <div class="col-md-12">
                  <div class="row">

                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-12">
                              <div class="row">
                                <div class="form-group">
                                  <div class="row">
                                    <label class="col-md-12 control-label" for="textinput" style="color:white">Nombre de la ubicación:</label>
                                    <div class="col-md-7">
                                    <input id="nombreUbi" name="nombreUbi" type="text" placeholder="" class="form-control input-md" value="`+nombre+`">
                                    </div>
                                    <div class="col-md-5">
                                      <div class="row">
                                        <div class="checkbox">
                                        <label style="color:white;font-weight:bold">
                                          <input type="checkbox" id="principal" name="principal" value="" style="margin-top:0px" `+ principal +`>
                                          Ubicación principal.
                                        </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div class="col-md-12">
                              <div class="row">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-7">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Calle o avenida:</label>
                                        <div class="col-md-12">
                                        <input id="calleUbi" name="calleUbi" type="text" placeholder="" class="form-control input-md" value="`+calle+`">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Número:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="numeroUbi" name="numeroUbi" type="text" placeholder="" class="form-control input-md" value="`+ numero +`">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-2">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Interior:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="numeroIntUbi" name="numeroIntUbi" type="text" placeholder="" class="form-control input-md" value="`+ interior+`">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>



                            <div class="col-md-12">
                              <div class="row">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Entre calles:</label>
                                        <div class="col-md-12">
                                        <input id="calle1Ubi" name="calle1Ubi" type="text" placeholder="" class="form-control input-md" value="`+callea+`">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Y:</label>
                                        <div class="col-md-12">
                                        <input id="calle2Ubi" name="calle2Ubi" type="text" placeholder="" class="form-control input-md" value="`+ calleb +`">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>




                              <div class="col-md-12">
                                <div class="row">
                                  <div class="form-group">
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="row">
                                          <label class="col-md-12 control-label" for="textinput" style="color:white">Estado:</label>
                                          <div class="col-md-12">
                                          <select id="slc_estados" name="slc_estados" type="text" placeholder="" class="form-control input-md" onChange="obtenerCiudades()">
                                          </select>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="row">
                                          <label class="col-md-12 control-label" for="textinput" style="color:white">Municipio/ciudad:</label>
                                          <div class="col-md-12">
                                          <select id="slc_ciudades" name="slc_ciudades" type="text" placeholder="" class="form-control input-md" onChange="obtenerColonias()">
                                          </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>



                            <div class="col-md-12">
                              <div class="row">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Localidad/colonia:</label>
                                        <div class="col-md-12">
                                        <select id="slc_colonias" name="slc_colonias" type="text" placeholder="" class="form-control input-md">
                                        </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">CP:</label>
                                        <div class="col-md-12">
                                        <input id="cpUbi" name="cpUbi" type="text" placeholder="" class="form-control input-md" value="`+ cp +`">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row">
                          <input type="hidden" id="latitud" name="latitud" value="`+latitud+`"/>
                          <input type="hidden" id="longitud" name="longitud" value="`+longitud+`"/>
                          <div id="searchDiv">
                              <input id="autocomplete_searchField" type="text" placeholder="Buscar Dirección">
                          </div>
                          <div id="direccion"></div>
                          <div id="mapDiv"></div>
                      </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
              <div class="row">
                <hr class="style-white"/>
                <div class="col-md-12">
                  <div class="row" class="text-center">
                    <span style="font-weight:bold;color:white;font-size:130%;text-align:center;padding:7px;"  class="col-md-12">
                      Teléfonos
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-10 col-sm-10">
                  <div class="row">
                    <div class="form-group col-md-3 col-sm-3">
                      <div class="row">
                        <select class="form-control" id="tipoTelefono" >
                          <option value="celular">Celular</option>
                          <option value="oficina">Oficina</option>
                          <option value="localizador">Localizador</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group col-md-9 col-sm-9" id="divTelefono">
                      <div class="form-group">
                        <input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" onpaste="soloNumeros()" maxlength="12"  >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-2 col-sm-2">
                  <div class="row">
                  <div class="form-group">
                    <input type="button" class="btn btn-warning btn-block" id="addFon" value="Añadir">
                  </div>
                  </div>
                </div>
            </div>
            <div class ="row">
              <div class="form-group col-md-12 col-sm-12 btn-group edit-btns text-center" id="divTelefonoAgregado" data-toggle="buttons"></div>
            </div>
            </div>
            <div class="row">
              <div id="fonAgregado" class="btn-group edit-btns text-center" data-toggle="buttons"></div>
            </div>

            <div class="col-md-12">
              <div class="row">
              <hr class="style-white"/>
              <span style="font-weight:bold;color:white;font-size:80%;">
                Al finalizar de agregar tus ubicaciones, pasa a la pestaña de "horarios" para organizar las horas de atención que se mostrarán en tu agenda de citas.
              </span>
              </div>
            </div>


            <div class="col-md-12" style="margin-top:15px;margin-bottom:30px">
              <div class="row">
                <div class="col-md-6 pull-right">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row">
                      <input type="button" class="btn btn-add btn-block" value="`+btnGuardar+`" onclick="regUbicacion()" id="btnGuardar">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row" style="margin-left:2px">
                        <input type="button" class="btn btn-save btn-block" value="Guardar y salir" onclick="regUbicacion();bootbox.hideAll();" id="btnGuardarSalir">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 pull-left">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row">
                      <input type="button" class="btn btn-drop btn-block" value="Eliminar" onclick="eliminarUbicacion()" id="btnEliminar">
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
        </form>
    </div>


    <div id="divHorarios" class="tab-pane fade">
      <h3>Menu 1</h3>
      <p>Some content in menu 1.</p>
    </div>

    </div>

    </div>
    </div>`
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
    mapa.marker.setOptions({draggable: false,animation:null});
  }
  funcionesTelefonos();
  if (btnGuardar == "Editar"){
    $('label.editar').unbind();
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
    size:'large',
    message: `


        <style type="text/css">

    		pre,code {
    			font-size: 12px;
    		}

    		pre {
    			width: 100%;
    			overflow: auto;
    		}

    		small {
    			font-size: 90%;
    		}

    		small code {
    			font-size: 11px;
    		}

    		.placeholder {
    			outline: 1px dashed #4183C4;
    		}

    		.mjs-nestedSortable-error {
    			background: #fbe3e4;
    			border-color: transparent;
    		}

    		#tree {
    			width: 100%;
    			margin: 0;
    		}

    		ol {
    			max-width: 100%;
    			padding-left: 25px;
    		}

        #sortableExpertoEnCont>ol{
          padding-left:0px;
        }

    		ol.sortable,ol.sortable ol {
    			list-style-type: none;
    		}

    		.sortable li div {
    			border: 1px solid #d4d4d4;
    			-webkit-border-radius: 3px;
    			-moz-border-radius: 3px;
    			border-radius: 3px;
    			cursor: move;
    			border-color: rgba(0,0,0,0.3);
    			margin: 0;
          margin-top:3px;
    			padding: 3px;
    		}

    		li.mjs-nestedSortable-collapsed.mjs-nestedSortable-hovering div {
    			border-color: #999;
    		}

    		.disclose, .expandEditor {
    			cursor: pointer;
    			width: 20px;
    			display: none;
    		}

    		.sortable li.mjs-nestedSortable-collapsed > ol {
    			display: none;
    		}

    		.sortable li.mjs-nestedSortable-branch > div > .disclose {
    			display: inline-block;
    		}

    		.sortable span.ui-icon {
    			display: inline-block;
    			margin: 0;
    			padding: 0;
    		}

    		.menuDiv {
    			background: rgba(0,0,0,0.2);
          margin:1px;
          padding-top:2px;
          padding-bottom:2px;
          padding-left: 20px!important;
    		}

        .menuDiv .glyphicon{
          font-size:80%;
        }

    		.menuEdit {
    			background: #FFF;
    		}

    		.itemTitle {
    			vertical-align: middle;
    			cursor: pointer;
    		}

    		.deleteMenu {
    			float: right;
    			cursor: pointer;
    		}

    		p,ol,ul,pre,form {
    			margin-top: 0;
    			margin-bottom: 1em;
    		}

    		dl {
    			margin: 0;
    		}

    		dd {
    			margin: 0;
    			padding: 0 0 0 1.5em;
    		}

    		code {
    			background: #e5e5e5;
    		}

    		input {
    			vertical-align: text-bottom;
    		}

    		.notice {
    			color: #c33;
    		}
        </style>

    <div class="" style="background-color:#172c3b;padding:5px;margin:-15px;">
      <div class="col-md-12" style="color:white">
        <h2 class="s25">CONFIGURA TUS UBICACIONES Y HORARIOS DE ATENCIÓN.</h2>
        <h3 class="s20">Señala la ubicación en el mapa y registra el horario de atención correspondiente con cada una.</h3>
      </div>

      <ul class="nav nav-tabs menuBootbox">
        <li class="`+ expertActive +`"><a data-toggle="tab" href="#divExpertEn">EXPERTO EN:</a></li>
        <li class="`+ hospActi +`"><a data-toggle="tab" href="#divHospClin">HOSPITALES Y CLÍNICAS</a></li>
        <li class="`+ asegActi +`"><a data-toggle="tab" href="#divAseguradoras">ASEGURADORAS</a></li>
      </ul>

      <div class="tab-content">

        <div id="divExpertEn" class="divBodyBootbox tab-pane fade in `+ expertActive +`">
            <div class="row">
              <form onsubmit="return false;">
              <div class="col-lg-12 col-md-12" style="margin-bottom:20px;">
                <div class="row">
                  <div class="col-lg-2 col-md-2">
                    <div class="row text-center">
                      <label for="addExp" style="padding-top:7px">Experiencia:</label>
                    </div>
                  </div>
                  <div class="col-lg-8 col-md-8">
                    <div class="row" style="margin-left:2px">
                      <input type="text" class="form-control" id="addExp">
                    </div>
                  </div>
                  <div class="col-lg-2 col-md-2">
                    <div class="row" style="margin-left:2px">
                      <input type="submit" class="btn btn-warning btn-block" value="Agregar" onclick="agregarExperiencia();">
                    </div>
                  </div>
                </div>
              </div>
              </form>

              <div class="col-lg-12 col-md-12">
                <div class="row" id="sortableExpertoEnCont">
                <ol class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="sortableExpertoEn">
                  <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
                    <div class="menuDiv">
                      <span>
                        <span data-id="2" class="itemTitle">Garganta</span>
                        <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                        <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                      </span>
                    </div>
                  </li>
                  <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
                    <div class="menuDiv">
                      <span>
                        <span data-id="2" class="itemTitle">Urgencias 24hrs.</span>
                        <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                        <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                      </span>
                    </div>
                  </li>
                  <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
                    <div class="menuDiv">
                      <span>
                        <span data-id="2" class="itemTitle">Enfermedades Alérgicas</span>
                        <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                        <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                      </span>
                    </div>
                  </li>
                  <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
                    <div class="menuDiv">
                      <span>
                        <span data-id="2" class="itemTitle">Transtornos respiratorios</span>
                        <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                        <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                      </span>
                    </div>
                  </li>
              	</ol>
              </div>
            </div>

            <div class="col-md-12">
              <div class="row">
                <hr class="style-white" />
              </div>
            </div>


            <div class="col-md-12" style="margin-top:15px;margin-bottom:30px">
              <div class="row">
                <div class="col-md-4 pull-right">
                  <div class="row">
                    <input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar" onclick="guardarExperiencia()">
                  </div>
                </div>
                <div class="col-md-4 pull-left">
                  <div class="row">
                    <input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

        <div id="divHospClin" class="divBodyBootbox tab-pane fade in `+ hospActi +`">
          <form method="POST" name="frmRegUb" id="frmRegUbi">
            <div class="row">
              Hospitales y clínicas

              <div class="col-md-12">
                <div class="row">
                  <hr class="style-white" />
                </div>
              </div>


              <div class="col-md-12" style="margin-top:15px;margin-bottom:30px">
                <div class="row">
                  <div class="col-md-4 pull-right">
                    <div class="row">
                      <input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar">
                    </div>
                  </div>
                  <div class="col-md-4 pull-left">
                    <div class="row">
                      <input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div id="divAseguradoras" class="divBodyBootbox tab-pane fade in `+ asegActi +`">
          <form method="POST" name="frmRegUb" id="frmRegUbi">
            <div class="row">
              Aseguradoras

              <div class="col-md-12">
                <div class="row">
                  <hr class="style-white" />
                </div>
              </div>


              <div class="col-md-12" style="margin-top:15px;margin-bottom:30px">
                <div class="row">
                  <div class="col-md-4 pull-right">
                    <div class="row">
                      <input type="button" class="btn btn-add btn-block" value="Guardar" id="btnGuardar">
                    </div>
                  </div>
                  <div class="col-md-4 pull-left">
                    <div class="row">
                      <input type="button" class="btn btn-drop btn-block" value="Salir" onclick="bootbox.hideAll()">
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>

      </div>
    </div>`
  });


	var ns = $('ol.sortable').nestedSortable({
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
}
//<--------------------- RECOMENDACIONES ------------------->
function recomendacionesBoot(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
        bootbox.hideAll();
    },
    closeButton:true,
    size:'large',
    message: `
    <div class="clearfix" style="background-color:#172c3b;padding:5px" >
      <div class="col-md-12" style="color:white">
        <div class="hidden" id="cargador"><span class="three-quarters-loader">Enviando...</span></div>
        <h4 class=""><span id="nombreOcultoPerfil" class="hidden"></span>Recomendar Dr.<span id="doctorSpan"></span> A:</h4>
      </div><br /><br /><br />
      <div id=“recomienda” class=“col-md-12”>
         <div class="form-group has-feedback" id="buscador">
             <label class="control-label"for="buscadorRecomendados" style="color:white">Busca entre tus contactos para que les recomiendes al Dr.<span class="hidden"id="pacienteIdOculto"></span></label>
             <input type="text" class="form-control" id="buscadorRecomendados" placeholder="Buscar contacto...">
             <span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
         </div>
         <div class="" id="contactosArecomendar">
             <table class="table table-condensed" id="recomendarA">
               <tbody></tbody>
             </table>
         </div>
         <div class="" id="enviarRecomendaciones">
           <ul class="list-inline"></ul>
         </div>
      </div>
      <div class="form-group" id="correoRecomendados">
         <label class="control-label" for="correoEnviarRecomendado" style="color:white">Recomendar via correo:</label>
         <input type="mail" class="form-control" id="correoEnviarRecomendado" placeholder="Correo:"/>
         <div class="" id="mensajeParaRecomendados">
            <textarea id="mensajeRecomendar" class="form-control" rows="3" placeholder="mensaje para los recomendados"></textarea>
         </div>
      </div>
      <div class="pull-right">
        <button type="button" class="btn btn-default" onclick="bootbox.hideAll();">close</button>
        <button type="button" id="enviarAtodos" onclick="enviarTodo();bootbox.hideAll();" class="btn btn-primary">Recomendar</button>
      </div>
    </div><!— FIN DIV PRINCIPAL —>
    `
  });
}
//<--------------------- FIN RECOMENDACIONES --------------->

//<--------------------- PEDIR RECOMENDACIONES ------------->
    function pedirRecomendacionesBoot(){
      $('.modal-body').css('padding',0);
      bootbox.dialog({
        onEscape: function () {
        bootbox.hideAll();
      },
        size:'large',
        message: `
          <div class="clearfix" id="pedir" style="background-color:#172c3b;padding:5px">
            <div class="col-md-12">
              <h4 class="modal-title">
                <span id="nombreOcultoPerfil" class="hidden"></span>
                <p style="color:white;">
                  Pedir una Recomendación al <span id="nombreDoctor"></span><span class="hidden" id="idMedico"></span>
                </p>
              </h4>
            </div><br /><br /><br />
            <div class="">
              <p style="color:white;">En esta ventana podrá elegir una especialidad para poder pedirle una recomendacion a su medico</p>
                <div class="form-group">
                  <label for="especialidadesMedic" class="col-sm-2 control-label"style="color:white;">Especialidad</label>
                  <select id="especialidadesMedic" onChange="cargando('#especialidadesMedic');" class="form-control">
                  </select>
                </div>
                <div class="" id="tipoRecomendacionPedir">
                  <ul class="list-inline"></ul>
                </div>
              </div>
            </div>
            <div class="pull-right">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" id="mandarPeticion" onclick="enviandoPeticion();" class="btn btn-primary" class="btn btn-primary">Pedir</button>
            </div>
          </div><!-- div principal final -->
        `
      });
    }
//<------------------- FIN PEDIR RECOMENDACIONES ----------->
//<------------------- LOGIN ------------------------------->
function loginModal(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
    bootbox.hideAll();
  },
    size:'medium',
    backdrop:false,
    message: `
      <div class="" id="logInicio">
        <form method="POST" action="/auth/correo">
          <div class="col-md-12">
            <h4>Intermed&reg | Login</h4>
          </div>
          <div class="row">
            <div class="col-md-8 col-md-offset-2">
              <input name="loginFB" value="Login con Facebook" class="btn btn-primary btn-block" onclick="window.location='/auth/facebook/request/loguin'">
            </div>
          </div>
          <div class="row">
            <div class="col-md-8 col-md-offset-2">
              <div class="form-group">
                <input type="text" class="form-control" id="email" name="email" placeholder="Usuario" required="true">
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="password" name="password" placeholder="Contraseña" required="true">
              </div>
              <input type="submit" name="login" value="Ingresar" class="btn btn-primary btn-block">
            </div>
          </div>
          <div class="row" id="fin">
            <div class="col-md-8 col-md-offset-2">
              <p class="text-center">
                <small>Recuerda que instituciones, proveedores y secretarias solo pueden ingresar con su correo y contraseña.</small>
                <br>
                <small>¿Olvidaste tus datos de acceso? <a href="#">Haz click aqui para recuperarlos</a></small>
              </p>
            </div>
          </div>
        </form>
      </div><!-- fin del div principal -->
    `
  });
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
      message: `
      <div id="addFormaForm" class="" arialabelledby="addForma">
        <div class="panel">
          <div class="panel-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-md-3 control-label">Nombre</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" id="invitar_nombre">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label">Correo</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" id="invitar_correo">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label">Mensaje</label>
                <div class="col-md-9">
                  <textarea class="form-control" id="invitar_mensaje">Te invito a unirte a Intermed</textarea>
                </div>
              </div>
              <div class="col-md-4 col-md-offset-8">
                <button type="button" class="btn btn-primary btn-block dropdown-form-guardar" onclick="procesarInvitacion()">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      `
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
    closeButton:true,
    message: `
      <div id="CatRegModal">
        <form method="" action="">
          <div class="">
            <div class="">
              <h4>Intermed&reg | Registro</h4>
            </div>
            <div class="">
              <div class="row">
                <h3 class="Flama-bold">SELECCIONA</h3>
                <h1 class="Flama-normal">TU CATEGORÍA</h1>
              </div>
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="iconos-servicios hi-icon-wrap hi-icon-effect hi-icon-effect-a">
                    <div class="col-md-3 col-sm-3 col-xs-6">
                      <a href="#" id="regPac" class="hi-icon hi-icon-modal" onclick='bootbox.hideAll();regPaciente();'>
                        <img class="hi-icon-img" src="img/BotonPacientes.png">
                      </a>
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-6">
                      <a href="#set-9" class="hi-icon hi-icon-modal" onclick="bootbox.hideAll(); regMedico();">
                        <img class="hi-icon-img" src="img/BotonMedicos.png">
                      </a>
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-6">
                      <a href="#set-9" class="hi-icon hi-icon-modal">
                        <img class="hi-icon-img" src="img/BotonInstituciones.png">
                      </a>
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-6">
                      <a href="#set-9" class="hi-icon hi-icon-modal">
                        <img class="hi-icon-img" src="img/BotonProveedores.png">
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-1"></div>
              </div>
            </div>
        </form>
      </div>
    `
  });
}
function regPaciente(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
  backdrop: true,
    size:'large',
    closeButton:true,
    message: `
      <div id="id="RegPacModal"">
        <div class="">
          <form method="POST" action="/reg/local" id="frm_regP">
            <div class="">
              <div class="">
                <h4 class="FlamaBook-normal s25 regHeader">Intermed&reg / <b>Registro Pacientes</b></h4>
              </div>
              <div class="">
                <hr class="separator">
                <div class="row">
                  <div class="col-md-6 regFacebook">
                    <h3>Intermed &reg es mejor
                      <br>con Facebook</h3>
                    <br>
                    <input name="registroFB" value="Registrate con Facebook" class="btn btn-primary btn-block s20" onclick="window.location='/auth/facebook/request/P'">
                    <br>
                    <h2 class="Flama-bold">¡En un solo click!</h2>
                    <p class="s20 flamaBook-normal">
                      Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.
                    </p>
                    <p class="s15 flamaBook-normal">
                      Intermed no comparte tus datos con terceras personas ni compañias externas.
                    </p>
                  </div>
                  <div class="col-md-6" class="regCorreo">
                    <h3>Registrate con tu correo electronico</h3>
                    <div class="row">
                      <div class="col-md-12">
                        <div id="alertError"></div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group" id="nameGroup">
                          <input type="text" class="form-control" id="nombreReg" name="first_name" placeholder="Nombre" required="true">
                          <span id="nameIcon" class="" aria-hidden="true"></span>
                          <div id="nombre-error"></div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group" id="apellidoGroup">
                          <input type="text" class="form-control" id="ApellidoReg" name="last_name" placeholder="Apellido" required="true">
                          <span id="apellidoIcon" class="" aria-hidden="true"></span>
                          <div id="apellido-error"></div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group" id="emailGroup">
                          <input type="email" class="form-control" id="correoReg" name="email" placeholder="Correo Electrónico" required="true">
                          <span id="emailIcon" class="" aria-hidden="true"></span>
                          <div id="email-error"></div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group" id="passwordGroup">
                          <input type="password" class="form-control" id="contraseñaReg" name="password" placeholder="Contraseña" pattern=".{6,13}" required="true">
                          <span id="passwordIcon" class="" aria-hidden="true"></span>
                          <div id="pass-error"></div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group" id="confirmGroup">
                          <input type="password" class="form-control" id="contraseña2Reg" name="password2" placeholder="Confirma tu contraseña" pattern=".{6,13}" required="true">
                          <span id="confirmIcon" class="" aria-hidden="true"></span>
                          <div id="conf-error"></div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <h4>
                          <small>Fecha de Nacimiento</small>
                        </h4>
                        <div class="col-md-4">
                          <div class="form-group" id="diaGroup">
                            <input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">
                            <span id="diaIcon" class="" aria-hidden="true"></span>
                            <div id="dia-error"></div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group" id="mesGroup">
                            <input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">
                            <span id="mesIcon" class="" aria-hidden="true"></span>
                            <div id="mes-error"></div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group" id="añoGroup">
                            <input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">
                            <span id="añoIcon" class="" aria-hidden="true"></span>
                            <div id="año-error"></div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <h4>
                          <small>Sexo</small>
                        </h4>
                        <div class="col-md-6">
                          <div class="radio">
                            <label>
                              <input type="radio" name="gender" id="sexM" value="M" checked required="true"> Masculino
                            </label>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="radio">
                            <label>
                              <input type="radio" name="gender" id="sexF" value="F" required="true"> Femenino
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />
                        <!-- TIMESTAMPS -->
                        <input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-success btn-block">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                </div>
              </div>
              <div class="modal-footer">
                <p class="s15">
                  <small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.
                </p>
              </div>
          </form>
          </div>
          <!-- /.modal-content -->
        </div>
      </div>
    `
  });
}
function regMedico(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
  backdrop: true,
    size:'large',
    closeButton:true,
    message: `
      <div id="RegMedModal">
        <div class="Flama-normal">
          <div class="">
            <div class="">
              <h4 class="FlamaBook-normal s25 regHeader">Intermed&reg / <b>Registro Médicos</b> </h4>
            </div>
            <div class="">
              <hr class="separator">
              <div class="row">
                <div class="col-md-6 regFacebook">
                  <h3>Intermed &reg es mejor
                    <br>con Facebook</h3>
                  <br>
                  <input name="registroFB" value="Registrate con Facebook" class="btn btn-primary btn-block s20" onclick="window.location='/auth/facebook/request/M'">
                  <br>
                  <h2 class="Flama-bold">¡En un solo click!</h2>
                  <p class="s20 flamaBook-normal">
                    Utiliza tu cuenta de Facebook para registrarte en Intermed y conectate con tus amigos y conocidos.
                  </p>
                  <p class="s15 flamaBook-normal">
                    Intermed no comparte tus datos con terceras personas ni compañias externas.
                  </p>
                </div>
                <div class="col-md-6 regCorreo">
                  <h3>Regístrate con tu correo electronico</h3>
                  <div class="row">
                    <form method="POST" action="/reg/local" id="frm_regM">
                      <div class="col-md-12">
                        <div id="alertErrorM"></div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <input type="hidden" name="tipoUsuario" value="M">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <input type="email" class="form-control" id="correoRegM" name="email" placeholder="Correo Electrónico">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <input type="email" class="form-control" id="correoConfirmRegM" placeholder="Confirma tu correo Electrónico">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <input type="password" class="form-control" id="contraseñaRegM" name="password" placeholder="Contraseña" pattern=".{6,13}">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <input type="password" class="form-control" id="contraseña2RegM" placeholder="Confirma tu contraseña" pattern=".{6,13}">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <input type="hidden" id="tiempo" name="tiempoStamp" value="tiempo" />
                        <input type="submit" id="regi" name="registroCorreo" value="Registrate" class="btn btn-success btn-block s20">
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="row text-center">
                <p class="s15">
                  <small>Al hacer clic en "Regístate", aceptas las <a href="">Condiciones</a> y confirmas que leíste nuestra <a href="">Política de datos</a>, incluido el <a href="">uso de cookies</a></small>.
                </p>
              </div>
            </div>
            <div class="">
            </div>
          </div>
        </div>
      </div>
    `
  });
}
function catServices(){
  $('.modal-body').css('padding',0);
    bootbox.dialog({
      onEscape: function () {
        bootbox.hideAll();
    },
    backdrop: true,
    size:'large',
    closeButton:true,
    message: `
      <div class="completoService" style="background-color:#172c3b; padding:5px;">
        <!-- INICIO HEADER -->
          <div class="" style="background-color:#172c3b">
            <h4 style="color:white">Catalogo de servicios</h4>
          </div>
        <!-- FIN HEADER -->
        <!-- INICIO BODY -->
          <div class="">
            <div class="row">
              <div class="col-md-12">
                <ul class="nav nav-tabs menuUbicacion" role="tablist">
                  <li role="presentation" class="active" id="cargar" onclick="downloadServices('#cargar');">
                    <a data-toggle="tab" aria-control="serv" role="tab" href="#serv">
                      <span style="color:white" class="glyphicon glyphicon-flash">&nbsp;Servicios</span>
                    </a>
                  </li>
                  <li role="presentation">
                    <a data-toggle="tab" aria-control="agServ" role="tab" href="#agServ">
                      <span style="color:white" class="glyphicon glyphicon-floppy-disk">&nbsp;Agregar Servicios</span>
                    </a>
                  </li>
                  <li role="presentation" onclick="maquetaServices();">
                    <a data-toggle="tab" aria-control="modifServ" role="tab" href="#modifServ">
                      <span style="color:white" class="glyphicon glyphicon-floppy-saved">&nbsp;Modifica servicios</span>
                    </a>
                  </li>
                  <li role="presentation" onclick="maquetaDeleteServices();">
                    <a data-toggle="tab" aria-control="deleteServ" role="tab" href="#deleteServ">
                      <span style="color:white" class="glyphicon glyphicon-floppy-remove">&nbsp;Borra servicios</span>
                    </a>
                  </li>
                </ul>
                <div class="tab-content" style="color:white">
                  <div role="tabpanel" class="tab-pane active" id="serv">
                    <h3>Tus servicios:</h3>
                    <table class="table table-condensed">
                      <thead>
                        <td><center>#</center></td>
                        <td><center>Concepto</center></td>
                        <td><center>Descripcion</center></td>
                        <td><center>Precio</center></td>
                        <td><center>Duracion</center></td>
                      </thead>
                      <tbody id="tusServices">
                      </tbody>
                    </table>
                    <div class="hidden" id="encontroServicios">
                      <h2 style="color:red;">No se encontraron servicios</h2>
                    </div>
                  </div>
                  <!-- Agregar mas servicios -->
                  <div id="agServ" role="tabpanel" class="tab-pane">
                    <h3>Agrega mas servicios</h3>
                    <table class="table table-condensed">
                      <thead>
                        <td><center>#</center></td>
                        <td><center>Concepto</center></td>
                        <td><center>Descripcion</center></td>
                        <td><center>Precio</center></td>
                        <td><center>Duracion</center></td>
                      </thead>
                      <tbody id="agregatuServices">
                        <td>
                          <center>
                            <button type="button" onclick="addServices('#conceptServ','#decriptServ','#precServ','#duraServ');" class="btn btn-primary">
                              <span style="color:white;" class="glyphicon glyphicon-plus"></span>
                            </button>
                          </center>
                        </td>
                        <td>
                          <center>
                            <div class="form-group">
                              <input type="text" class="form-control" id="conceptServ" />
                            </div>
                          </center>
                        </td>
                        <td>
                          <center>
                            <div class="form-group">
                              <input type="text" class="form-control" id="decriptServ" />
                            </div>
                          </center>
                        </td>
                        <td>
                          <center>
                            <div class="form-group">
                              <input type="text" class="form-control" id="precServ" />
                            </div>
                          </center>
                        </td>
                        <td>
                          <center>
                            <div class="form-group">
                              <select id="duraServ">
                                <option value="time">--Selecciona--</option>
                                <option value="00:30:00">30 minutos</option>
                                <option value="00:45:00">45 minutos</option>
                                <option value="01:00:00">1 hora</option>
                                <option value="02:00:00">2 horas</option>
                                <option value="03:00:00">3 horas</option>
                              </select>
                            </div>
                          </center>
                        </td>
                      </tbody>
                    </table>
                    <div class="hidden" id="exitoAgregado">
                      <h2 style="color:green">
                        <span class="glyphicon glyphicon-ok"></span>&nbsp;se ha agregado exitosamente
                      </h2>
                    </div>
                    <div class="hidden" id="exitoNoAgregado">
                      <h2 style="color:red">
                        <span class="glyphicon glyphicon-remove"></span>&nbsp;su servicio no se pudo agregado
                      </h2>
                    </div>
                  </div>
                  <!-- modifica -->
                  <div id="modifServ" role="tabpanel" class="tab-pane">
                    <h3>Modifica tus servicios</h3>
                    <table class="table table-condensed">
                      <thead>
                        <td><center>Modificar</center></td>
                        <td><center>Concepto</center></td>
                        <td><center>Descripcion</center></td>
                        <td><center>Precio</center></td>
                        <td><center>Duracion</center></td>
                      </thead>
                      <tbody id="modificatusServices">
                      </tbody>
                    </table>
                    <div class="hidden" id="exitoModificado">
                      <h2 style="color:green">
                        <span class="glyphicon glyphicon-ok"></span>&nbsp;se ha modificado exitosamente
                      </h2>
                    </div>
                    <div class="hidden" id="exitoNoModificado">
                      <h2 style="color:red">
                        <span class="glyphicon glyphicon-remove"></span>&nbsp;su servicio no Modificado
                      </h2>
                    </div>
                  </div>
                  <div id="deleteServ" role="tabpanel" class="tab-pane">
                    <h3>Elimina servicios</h3>
                    <table class="eliminaServicios table table-condensed">
                      <thead>
                        <td><center>Borrar</center></td>
                        <td><center>Concepto</center></td>
                        <td><center>Descripcion</center></td>
                        <td><center>Precio</center></td>
                        <td><center>Duracion</center></td>
                      </thead>
                      <tbody id="deleteServicesTable">
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- FIN BODY -->
        <!-- INICIO FOOTER -->
          <div class="modal-footer">
          </div>
        <!-- FIN FOOTER -->
      </div>
    `
  });
}
function cambioFotoPerfil(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
    },
  backdrop: true,
    size:'large',
    closeButton:false,
    message: `
    <div  id="CambiarFotoPerfil" name="CambiarFotoPerfil" >
      <form>
        <div class="">
          <div class="">
            <div class="row">
              <div class="col-md-12">
                <div class="row" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                  <h4 class="">Selecciona el area a guardar</h4>
                  <hr/>
                  <input type="hidden" value="" name="base64file" id="base64file">
                  <div class="col-md-12" id="contenedorFoto" class="text-center" style="width: auto;margin: auto"></div>
                  <canvas id="canvas" height="300" width="300" style="display: none"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <input type="button" value="Guardar" class="btn btn-primary" id="btnCrop" onclick="guardarImagenPerfil();bootbox.hideAll();">
            <input type="button" value="Cancelar" class="btn btn-danger" onclick="bootbox.hideAll();">
          </div>
        </div>
      </form>
  </div>
    `
  });
}
function editaPerfBoot(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
      bootbox.hideAll();
  },
  backdrop: true,
  size:'large',
  closeButton:true,
  message: `
  <div class="" id="tabPerfilModificar" style="background-color:#172c3b; padding:5px;">
    <ul class="nav nav-tabs menuBootbox">
      <li role="presentation" class="active" onclick="loadDatosGenerales();">
        <a href="#general" aria-control="general" role="tab" data-toggle="tab">
          <span class="glyphicon glyphicon-th">&nbsp;Generales</span>
        </a>
      </li>
      <li role="presentation" onclick="loadBiometricos();">
        <a href="#biometricos" aria-control="biometricos" role="tab" data-toggle="tab">
          <span class="glyphicon glyphicon-heart">&nbsp;Biometricos</span>
        </a>
      </li>
      <li role="presentation" onclick="loadTelefonos();">
        <a href="#emergencia" aria-control="emergencia" role="tab" data-toggle="tab">
          <span class="glyphicon glyphicon-plus-sign">&nbsp;Emergencia</span>
        </a>
      </li>
    </ul>
    <div class="tab-content tabBootBox">
      <div class="tab-pane active" role="tabpanel" id="general">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="{{fotoPerfil}}" width="200" height="200" class="img-rounded">
              </div>
              <div class="col-lg-8 input-group">
                <input type="text" class="form-control" id="editNom" placeholder="Nombre" />
                <span class="input-group-btn">
                  <button id="nomEdit" class="btn btn-danger" onclick="updateName();"type="button"><span class="glyphicon glyphicon-wrench"></span></button>
                </span>
              </div><!-- /.col-lg-6 -->
              <div class="col-lg-8 input-group">
                <input type="text" class="form-control" id="editApeP" placeholder="Apelido paterno" />
                <span class="input-group-btn">
                  <button id="apePEdit" class="btn btn-danger" onclick="updateApellidoP();" type="button"><span class="glyphicon glyphicon-wrench" ></span></button>
                </span>
              </div><!-- /.col-lg-6 -->
              <div class="col-lg-8 input-group">
                <input type="text" class="form-control" id="editApeM" placeholder="Apellido materno" />
                <span class="input-group-btn">
                  <button id="apeMEdit" class="btn btn-danger" onclick="updateApellidoM();" type="button"><span class="glyphicon glyphicon-wrench" ></span></button>
                </span>
              </div><!-- /.col-lg-6 -->
              <div class="col-lg-8">
                <hr>
                <h4 style="color:white" class="hidden" id="infoGeneral">Información actualizada</h4>
                <h3 style="color:white" class="hidden" id="cambiandoGenerales"></h3>
              </div>
            </div>
          </div>
        <hr>
        <div class="container-fluid" id="ubicacionGeneral">
          <h1 style="color:white;">MAPITA DE CINTHIA</h1>
        </div>
      </div>
      <div class="tab-pane" role="tabpanel" id="biometricos">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <label style="color:white">Biometricos</label>
            </div>
            <div class="col-md-12 form-group">
              <input type="text" class="form-control" id="bioPeso" placeholder="Peso(kg.)" />
            </div>
            <div class="col-md-12 form-group">
              <input type="text" class="form-control" id="bioAltura" placeholder="Altura" />
            </div>
            <div class="col-md-12 form-group">
              <input type="text" class="form-control" id="bioSangre" placeholder="Tipo de sangre" />
            </div>
            <div class="col-md-12 form-group">
              <select id="bioGenero" class="form-control">
                <option value="0">--Genero--</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div class="col-md-12 form-group">
              <button class="btn btn-danger form-control" onclick="addBio();" id="addBio" type="button">
                <span class="glyphicon glyphicon-plus">&nbsp;Agregar</span>
              </button>
            </div>
            <div class="col-md-12 hidden" id="confirmacionBio">
              <h4 style="color:white"><span class="glyphicon glyphicon-ok">&nbsp;Informacion guardada correctamente</span></h4>
            </div>
            <div class="col-md-12 hidden" id="negadoBio">
              <h4 style="color:white"><span class="glyphicon glyphicon-remove">&nbsp;Fallo al guardar la informacion</span></h4>
            </div>
            <div class="col-md-12 hidden" id="delBio">
              <h4 style="color:white"><span class="glyphicon glyphicon-trash">&nbsp;Informacion borrada...</span></h4>
            </div>
          </div>
        </div>
        <hr>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12 hidden" id="noBiometrico">
              <h2 style="color:red;">Aun no ha registrado ningun biometrico</h2>
            </div>
            <div class="col-md-12">
              <table class="table table-condensed">
                <thead style="color:white;">
                  <tr>
                    <th><center><span class="glyphicon glyphicon-scale">&nbsp;Peso</span></center></th>
                    <th><center><span class="glyphicon glyphicon-resize-vertical">&nbsp;Altura(cm)</span></center></th>
                    <th><center><span class="glyphicon glyphicon-question-sign">&nbsp;Tipo de sangre</span></center></th>
                    <th><center><span class="glyphicon glyphicon-user">&nbsp;Genero</span></center></th>
                    <th><center><span class="glyphicon glyphicon-remove-sign">&nbsp;Eliminar</span></center></ht>
                  </tr>
                </thead>
                <tbody id="bioBody">
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane" role="tabpanel" id="emergencia">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3 form-group">
              <input type="text" class="form-control" id="bioNombretel" placeholder="Nombre del contacto" />
            </div>
            <div class="col-md-3 form-group">
              <input type="text" class="form-control" id="bioTel" placeholder="Telefono" />
            </div>
            <div class="col-md-3 checkbox form-group">
              <label style="color:white;">
                <input type="checkbox" id="esMedic" name="esMedic" value="1">¿Es medico?
              </label>
            </div>
            <div class="col-md-3 form-group">
              <button type="button" id="bioTelbutton" onclick="addTelefon();" class="form-control btn btn-danger">
                <span class="glyphicon glyphicon-phone-alt">&nbsp;Agregar</span>
              </button>
            </div>
            <div class="col-md-12 hidden" id="telAdd">
              <h4 style="color:white;"><span class="glyphicon glyphicon-phone-alt">&nbsp;Contacto agregado</span></h4>
            </div>
            <div class="col-md-12 hidden" id="deleFon">
              <h4 style="color:white;"><span class="glyphicon glyphicon-remove">&nbsp;Contacto eliminado</span></h4>
            </div>
          </div>
        </div>
        <hr>
        <div class="container-fluid hidden" id="noTelefono">
          <div class="row">
            <h2 style="color:red">UD. No tiene agregado telefono de emergencia</h2>
          </div>
        </div>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <table class="table table-condensed">
                <thead style="color:white;">
                  <tr>
                    <th><center><span class="glyphicon glyphicon-user">&nbsp;Nombre</span></center></th>
                    <th><center><span class="glyphicon glyphicon-phone-alt">&nbsp;Telefonos</span></center></th>
                    <th><center><span class="glyphicon glyphicon-user">&nbsp;Es mi medico</span></center></th>
                    <th><center><span class="glyphicon glyphicon-remove-sign">&nbsp;Eliminar</span></center></th>
                  </tr>
                </thead>
                <tbody id="telBody" style="color:white;"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div><!-- PRINCIPAL -->
    `
  });
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
      console.log('Result: ' + JSON.stringify(data));
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
            registroMedicoDatosPago();
          } else {
            $('.modal-body').css('padding',0);
            bootbox.dialog({
              backdrop: true,
              size:'large',
              closeButton: false,
              onEscape: function () {
                  bootbox.hideAll();
              },
              message: `
              <div style="background-color:#172c3b;padding:5px;margin:-15px;" >
              <div class="col-md-12" style="color:white" >
                <h2 class="s25"><h4 class="FlamaBook-normal s25 regHeader">Intermed® / <b>Registro Médicos</b> </h4></h2>
              </div>.

              <div class="divBodyBootbox">


                <form id="regMedStepOne">
                  <div class="row topMsgReg">
                    <div class="col-md-12">
                      <h4 class="Flama-bold s20">¡Bienvenido Dr.!
                        <small></small>
                      </h4>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div id="alertError"></div>
                    </div>
                    <div class="col-md-12">
                      <div class="regBox">
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label class="Flama-normal s15" for="nombreRegMed">Nombres</label>
                              <input type="text" class="form-control" id="nombreRegMed" name="nombreRegMed" placeholder="Nombres" value="`+ nombre +`">
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label class="Flama-normal s15" for="apePatRegMed">Apellido Paterno</label>
                              <input type="text" class="form-control" id="apePatRegMed" name="apePatRegMed" placeholder="Apellido Paterno" value="`+ apellidop +`">
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label class="Flama-normal s15" for="apePatRegMed">Apellido Materno</label>
                              <input type="text" class="form-control" id="apeMatRegMed" name="apeMatRegMed" placeholder="Apellido Materno" value="`+ apellidom +`">
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-12">
                                <label class="Flama-normal s15">Fecha de Nacimiento</label>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-4">
                                <div class="form-group">
                                  <input type="text" class="form-control" id="diaNacReg" name="birthdayDay" placeholder="Dia" required="true">
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <input type="text" class="form-control" id="mesNacReg" name="birthdayMonth" placeholder="Mes" required="true">
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <input type="text" class="form-control" id="añoNacReg" name="birthdayYear" placeholder="Año" required="true">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="col-md-12">
                              <label class="Flama-normal s15">Sexo</label>
                            </div>
                            <div class="col-md-6">
                              <div class="radio">
                                <label>
                                  <input type="radio" name="gender" id="sexM" value="M" `+ genderM +`> Masculino
                                </label>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="radio">
                                <label>
                                  <input type="radio" name="gender" id="sexF" value="F" `+ genderF +`> Femenino
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="separator2">
                      <div class="regBox">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="Flama-normal s15" for="curpRegMed">CURP</label>
                              <input type="text" class="form-control" id="curpRegMed" name="curpRegMed" placeholder="CURP"  value="`+ curpRegMed +`">
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="Flama-normal s15" for="cedulaRegMed">Cedula Profesional</label>
                              <div class="input-group">
                                <input type="text" class="form-control" id="cedulaRegMed" name="cedulaRegMed" placeholder="CEDULA"  value="`+ cedulaRegMed +`">
                                <span class="input-group-addon verificarAddon">
                                  <button class="btn btn-warning verificarBtn Flama-normal s15">Verificar</button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3 col-md-offset-9">
                      <input type="button" id="regi" name="registroCorreo" value="Guardar" class="btn btn-warning btn-block btn-step" onclick="saveStepOne()" style="margin-top:10px;margin-bottom:10px">
                    </div>
                  </div>
                </form>

              </div>
              </div>`
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
      console.log('Result: ' + JSON.stringify(data));
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
              message: `
              <div style="background-color:#172c3b;padding:5px;margin:-15px;" >
              <div class="col-md-12" style="color:white" >
                <h2 class="s25"><h4 class="FlamaBook-normal s25 regHeader">Intermed® / <b>Registro Médicos</b> </h4></h2>
              </div>.

              <div class="divBodyBootbox">
                <div class="row topMsgReg">
                  <div class="col-md-8">
                    <h4 class="Flama-bold s20">Selecciona tu forma de pago.</h4>
                  </div>
                  <div class="col-md-4">
                    <div class="msgPrecio text-center FlamaBook">
                      <span class="trngl"></span>Recuerda que tu suscripción tiene un costo mensual de $1,000.00
                    </div>
                  </div>
                </div>


                  <div class="col-md-12">
                    <form class="radio">
                      <div id="tarjOpt">
                        <label class="bigLabel Flama-normal">
                          <input type="radio" name="optionsRadios" id="tarjetaOptReg" value="tarjeta" checked=""> Tarjeta de crédito
                        </label>
                        <div id="tarjOptBox" class="regBox">
                          <div class="row">
                            <div class="col-md-3">
                              <div class="form-group">
                                <label class="Flama-normal s15" for="tipoTarjetaRegMed">Tipo de tarjeta</label>
                                <input type="text" class="form-control" id="tipoTarjetaRegMed" name="tipoTarjetaRegMed" placeholder="Visa / Mastercard / etc">
                              </div>
                            </div>
                            <div class="col-md-3">
                              <div class="form-group">
                                <label class="Flama-normal s15" for="numTarjetaRegMed">Número de la tarjeta</label>
                                <input type="text" class="form-control" id="numTarjetaRegMed" name="numTarjetaRegMed" placeholder="xxxx-xxxx-xxxx-xxxx">
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="row">
                                <div class="col-md-4">
                                  <div class="form-group">
                                    <label class="Flama-normal s15" for="vencMesTarjetaRegMed">Vencimiento</label>
                                    <input type="number" class="form-control" id="vencMesTarjetaRegMed" name="vencMesTarjetaRegMed" placeholder="Mes">
                                  </div>
                                </div>
                                <div class="col-md-4">
                                  <div class="form-group">
                                    <label class="Flama-normal s15" for="vencAñoTarjetaRegMed">Vencimiento</label>
                                    <input type="number" class="form-control" id="vencAñoTarjetaRegMed" name="vencAñoTarjetaRegMed" placeholder="Año">
                                  </div>
                                </div>
                                <div class="col-md-4">
                                  <div class="form-group">
                                    <label class="Flama-normal s15" for="seguridadTarjetaRegMed">Seguridad</label>
                                    <div class="input-group">
                                      <input type="password" class="form-control" id="seguridadTarjetaRegMed" name="seguridadTarjetaRegMed">
                                      <span class="input-group-addon glyphicon">
                                        <a tabindex="0" role="button" data-toggle="popover" title="Codigo de seguridad:" data-placement="bottom" data-container="body" data-content="El numero de seguridad se encuentra al reverso de tu tarjeta.">
                                          <span class="glyphicon-question-sign"></span>
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-5">
                              <div class="form-group">
                                <label class="Flama-normal s15" for="nombreTarjetaRegMed">Nombre del titular</label>
                                <input type="text" class="form-control" id="nombreTarjetaRegMed" name="nombreTarjetaRegMed" placeholder="Tal como aparece en la tarjeta">
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label>
                                  <br>
                                </label>
                                <input type="button" id="registraTarjeta" name="registraTarjeta" value="Pagar" class="btn btn-warning btn-block Flama-normal s15" onclick="saveStepTwo()">
                              </div>
                            </div>
                            <div class="col-md-5 secureStamp">
                              <div class="row">
                                <div class="col-md-12">
                                  <p>
                                    <span class="glyphicon glyphicon-lock"></span>
                                    <strong>Este es un sitio seguro</strong>
                                    <br>
                                    <small>Utilizamos conexiones seguras para proteger su información.</small>
                                  </p>
                                </div>
                              </div>
                              <div class="securedImgs row">
                                <div class="col-md-3">
                                  <img alt="verisign" src="/img/verisign.png">
                                </div>
                                <div class="col-md-2">
                                  <img alt="ssl" src="/img/ssl.png">
                                </div>
                                <div class="col-md-7">
                                  <img alt="newchannel" src="/img/newchannel-350x61.png">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="separator3" >
                      <div id="paypalOpt" style="margin-top:5px">
                        <label class="bigLabel Flama-normal">
                          <input type="radio" name="optionsRadios" id="paypalOptReg" value="paypal"> PayPal
                        </label>
                        <div id="paypalOptBox" class="regBox">
                          <div class="row">
                            <div class="col-md-5">
                              <div class="form-group">
                                <label class="Flama-normal s15" for="paypalUser">Usuario de PayPal</label>
                                <input type="text" class="form-control" id="paypalUser" name="paypalUser" placeholder="Usuario">
                              </div>
                            </div>
                            <div class="col-md-5">
                              <div class="form-group">
                                <label class="Flama-normal s15" for="paypalPass">Constraseña</label>
                                <input type="passwrod" class="form-control" id="paypalPass" name="paypalPass" placeholder="Contraseña">
                              </div>
                            </div>
                            <div class="col-md-2">
                              <label>
                                <br>
                              </label>
                              <input type="button" id="paypalLogin" name="paypalLogin" value="PayPal Login" class="btn btn-warning btn-block Flama-normal s15">
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <a href="#">¿Olvidaste tu Usuario o Contraseña de Paypal? Haz click aquí.</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>.

              </div>
              </div>`
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
