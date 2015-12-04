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
