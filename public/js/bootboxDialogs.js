function agregarUbicacion(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    size:'large',
    message: `
    <div class="" style="background-color:#172c3b;padding:5px" >
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
            <input type="hidden" id="idDireccion" name="idDireccion" value="">
            <input type="hidden" id="usuario_id" name="usuario_id" value="">
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
                                    <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                    </div>
                                    <div class="col-md-5">
                                      <div class="row">
                                        <div class="checkbox">
                                        <label style="color:white;font-weight:bold">
                                          <input type="checkbox" value="" style="margin-top:0px">
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
                                        <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Número:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-2">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Interior:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
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
                                        <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Y:</label>
                                        <div class="col-md-12">
                                        <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
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
                                          <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="row">
                                          <label class="col-md-12 control-label" for="textinput" style="color:white">Municipio/ciudad:</label>
                                          <div class="col-md-12">
                                          <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
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
                                        <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">CP:</label>
                                        <div class="col-md-12">
                                        <input id="textinput" name="textinput" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr/>

                            <div class="col-md-12">
                              <div class="row">
                              <span style="font-weight:bold;color:white">
                                Al finalizar de agregar tus ubicaciones, pasa a la pestaña de "horarios" para organizar las horas de atención que se mostrarán en tu agenda de citas.
                              </span>
                              </div>
                            </div>


                            <div class="col-md-12" style="margin-top:5px;">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-5">
                                      <div class="row">
                                        <input type="button" class="btn btn-add btn-block" value="Añadir ubicación">
                                      </div>
                                    </div>
                                    <div class="col-md-5" style="margin-left:10px">
                                      <div class="row">
                                        <input type="button" class="btn btn-save btn-block" value="Guardar y salir">
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row">
                            <div id="searchDiv">
                                <input id="autocomplete_searchField" type="text" placeholder="Buscar Dirección">
                            </div>
                            <div id="mapDiv" class="col-md-12" style="margin-left:10px;"></div>
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
    $('.modal-body').css('padding',0);
  cargarMapa();
}
