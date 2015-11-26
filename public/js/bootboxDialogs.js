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
                                    <input id="nombreUbi" name="nombreUbi" type="text" placeholder="" class="form-control input-md">
                                    </div>
                                    <div class="col-md-5">
                                      <div class="row">
                                        <div class="checkbox">
                                        <label style="color:white;font-weight:bold">
                                          <input type="checkbox" id="principal" name="principal" value="" style="margin-top:0px">
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
                                        <input id="calleUbi" name="calleUbi" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Número:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="numeroUbi" name="numeroUbi" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-2">
                                      <div class="row">
                                        <div class="col-md-12">
                                            <label class="control-label" for="textinput" style="color:white">Interior:</label>
                                        </div>
                                        <div class="col-md-12">
                                            <input id="numeroIntUbi" name="numeroIntUbi" type="text" placeholder="" class="form-control input-md">
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
                                        <input id="calle1Ubi" name="calle1Ubi" type="text" placeholder="" class="form-control input-md">
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <label class="col-md-12 control-label" for="textinput" style="color:white">Y:</label>
                                        <div class="col-md-12">
                                        <input id="calle2Ubi" name="calle2Ubi" type="text" placeholder="" class="form-control input-md">
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
                                        <input id="cpUbi" name="cpUbi" type="text" placeholder="" class="form-control input-md">
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
                                        <input type="button" class="btn btn-add btn-block" value="Añadir ubicación" onclick="regUbicacion()">
                                      </div>
                                    </div>
                                    <div class="col-md-5" style="margin-right:5px">
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
                          <input type="hidden" value="" id="latitud" name="latitud" />
                          <input type="hidden" value="" id="longitud" name="longitud" />
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
  cargarMapa();
}
//<--------------------- RECOMENDACIONES ------------------->
function recomendacionesBoot(){
  $('.modal-body').css('padding',0);
  bootbox.dialog({
    onEscape: function () {
        bootbox.hideAll();
    },
    size:'large',
    message: `
    <div class="clearfix" style="background-color:#172c3b;padding:5px" >
      <div class="col-md-12" style="color:white">
        <div class="hidden" id="cargador"><span class="three-quarters-loader">Enviando...</span></div>
        <h4 class="modal-title"><span id="nombreOcultoPerfil" class="hidden"></span>Recomendar Dr.<span id="doctorSpan"></span> A:</h4>
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
        <button type="button" class="btn btn-default" data-dismiss="modal">close</button>
        <button type="button" id="enviarAtodos" onclick="enviarTodo();" class="btn btn-primary">Recomendar</button>
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
    size:'small',
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
      size:'small',
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
