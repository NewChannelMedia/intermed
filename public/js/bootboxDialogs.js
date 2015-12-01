function agregarUbicacion(ubicacion_id){
  var id = '', nombre = '', principal = '', calle = '', numero = '', interior = '';
  var callea = '', calleb = '', estado = '', municipio = '', localidad = '', cp = '';
  var latitud = '', longitud = '';
  var btnGuardar = 'Añadir ubicación';

  if (ubicacion_id && ubicacion_id > 0){
    btnGuardar = 'Guardar';
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

    <ul class="nav nav-tabs menuUbicacion">
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
                                          <option value="casa">Casa</option>
                                          <option value="celular">Celular</option>
                                          <option value="oficina">Oficina</option>
                                          <option value="localizador">Localizador</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div class="form-group col-md-9 col-sm-9">
                                      <div class="form-group">
                                        <input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="10" onpaste="soloNumeros()" >
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


                            <div class="col-md-12" style="margin-top:15px;">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-5" style="margin-right:5px">
                                      <div class="row">
                                        <input type="button" class="btn btn-add btn-block" value="`+btnGuardar+`" onclick="regUbicacion()" id="btnGuardar">
                                      </div>
                                    </div>
                                    <div class="col-md-5" style="margin-right:5px">
                                      <div class="row">
                                        <input type="button" class="btn btn-save btn-block" value="Guardar y salir" onclick="regUbicacion();bootbox.hideAll();" id="btnGuardarSalir">
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
  if (btnGuardar == "Guardar"){
    $("#frmRegUbi :input").prop('disabled', true);
    $("#frmRegUbi :button").prop('disabled', false);
    $('#frmRegUbi :button #addFon').prop('disabled', true);
    $("#frmRegUbi #btnGuardarSalir").addClass('hidden');
    $('#btnGuardar').val('Editar');
  }
  cargarMapa(ubicacion_id);
  mapa.marker.setOptions({draggable: false,animation:null});
}
