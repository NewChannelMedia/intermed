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
    closeButton:false,
    message: `
      <div id="CatRegModal">
        <form method="" action="">
          <div class="">
            <div class="">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
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
    closeButton:false,
    message: `
      <div id="id="RegPacModal"">
        <div class="modal-dialog modal-lg">
          <form method="POST" action="/reg/local" id="frm_regP">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="FlamaBook-normal s25 regHeader">Intermed&reg / <b>Registro Pacientes</b></h4>
              </div>
              <div class="modal-body">
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
    closeButton:false,
    message: `
      <div id="RegMedModal">
        <div class="modal-dialog modal-lg Flama-normal">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="FlamaBook-normal s25 regHeader">Intermed&reg / <b>Registro Médicos</b> </h4>
            </div>
            <div class="modal-body">
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
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
    `
  });
}
