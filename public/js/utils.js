/**
 *   Archivo creado por Cinthia
 *
 */

var regTotalDoc = 0;


if (location.pathname === '/registro') {
    $(document).ready(getAllDoctors());
} else {
    $(document).ready(function() {
        $('#frm_regP').on('submit', function(e) {
            e.preventDefault();
            var pass1 = $('#contraseñaReg').val();
            var pass2 = $('#contraseña2Reg').val();
            var submit = true,
                mensaje = '';
            //Validar contraseña y confirmacion de contraseña
            if (pass1 != pass2) {
                submit = false;
                mensaje = 'Confirmación de contraseña no coincide';
            }
            //Validar fecha
            if (submit) {
                var dia = $('#diaNacReg').val();
                var mes = $('#mesNacReg').val();
                var anio = $('#añoNacReg').val()
                fecha = dia + "/" + mes + "/" + anio;
                if (validarFormatoFecha(fecha)) {
                    if (!existeFecha(fecha)) {
                        submit = false;
                        mensaje = "La fecha de nacimiento introducida no existe.";
                    }
                } else {
                    submit = false;
                    mensaje = "El formato de la fecha de nacimiento es incorrecto.";
                }
            }

            if (submit) {
                var correo = document.getElementById('correoReg').value;
                if (correoValido(correo)) {
                    $.ajax({
                        async: false,
                        url: '/correoDisponible',
                        type: 'POST',
                        dataType: "json",
                        cache: false,
                        data: {
                            'email': correo
                        },
                        success: function(data) {
                            submit = data.result;
                            if (!submit) mensaje = "El correo " + correo + ' ya se encuentra registrado.';
                        },
                        error: function(jqXHR, textStatus, err) {
                            console.error('AJAX ERROR: ' + err);
                        }
                    });
                }
            }

            if (submit) {
                document.getElementById('alertError').innerHTML = '';
                this.submit();
            } else {
                document.getElementById('alertError').innerHTML = '<div class="alert alert-danger" role="alert" >' + mensaje + '</div>';
            }
        });
    });
}

function validarFormatoFecha(campo) {
    var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    if ((campo.match(RegExPattern)) && (campo != '')) {
        return true;
    } else {
        return false;
    }
}

function existeFecha(fecha) {
    var fechaf = fecha.split("/");
    var day = fechaf[0];
    var month = fechaf[1];
    var year = fechaf[2];
    if (!(month > 0 && month < 13)) {
        return false;
    }
    var date = new Date(year, month, '0');
    if ((day - 0) > (date.getDate() - 0)) {
        return false;
    }
    return true;
}

function existeCorreo() {
    var correo = document.getElementById('correoReg').value;
    if (correoValido(correo)) {
        $.ajax({
            async: true,
            url: '/correoDisponible',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: {
                'email': correo
            },
            success: function(data) {
                console.log('DATA ' + data.result);
                return data.result;
            },
            error: function(jqXHR, textStatus, err) {
                alert('DATA: ' + err);
                console.error('AJAX ERROR: ' + err);
            }
        });
    }
}

function correoValido(correo) {
    return true;
}

function regDoctor() {
    if (regMedValid() == true) {
        $.ajax({
            url: '/registro',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: $('#frmRegMed').serialize(),
            type: 'POST',
            success: function(data) {
                document.getElementById("frmRegMed").reset();
                data.forEach(function(record) {
                    addMedico(record);
                });
            },
            error: function(jqXHR, textStatus, err) {
                console.error('AJAX ERROR: (registro 166) : ' + err);
            }
        });
    } else {
        alert("Faltan llenar unos datos.");
    }
}

function getAllDoctors() {
    regTotalDoc = 0;
    $.ajax({
        url: '/registro',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            getAll: '1'
        },
        type: 'POST',
        success: function(data) {
            data.forEach(function(record) {
                addMedico(record);
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 196) : ' + err);
        }
    });
}

function addMedico(record) {
    var entreCalles = '',
        medicosRegistrados = '';
    if (record.calle1Med && record.calle2Med) {
        var conjucion = 'y';
        if (record.calle2Med.length > 0 && record.calle2Med.toLowerCase().substring(0, 1) === 'i') conjucion = 'e';
        entreCalles = 'Entre ' + record.calle1Med + ' ' + conjucion + ' ' + record.calle2Med;
    }
    try {
        // muestra los médicos con la funcionalidad de actualizar médico
        medicosRegistrados += '<tr><th scope="row">' + (++regTotalDoc) + '</th><td>' + record.nombreMed + ' ' + record.apellidoMed + '</td><td>' + record.correoMed + '</td><td>' + record.telefonoMed + '</td><td><address><strong>' + record.calleMed + ' #' + record.numeroMed + '</strong><br>' + entreCalles + ' <br>' + record.coloniaMed + ', CP:' + record.cpMed + '<br>' + record.ciudadMed + ', ' + record.estadoMed + '<br></address></td><td>' + record.especialidadMed + '</td><td><button class="btn btn-info" onclick="muestraMedico(' + record.id + '); return false;"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
        //medicosRegistrados += '<tr><th scope="row">' + (++regTotalDoc) + '</th><td>' + record.nombreMed + ' ' + record.apellidoMed + '</td><td>' + record.correoMed + '</td><td>' + record.telefonoMed + '</td><td><address><strong>' + record.calleMed + ' #' + record.numeroMed + '</strong><br>' + entreCalles + ' <br>' + record.coloniaMed + ', CP:' + record.cpMed + '<br>' + record.ciudadMed + ', ' + record.estadoMed + '<br></address></td><td>' + record.especialidadMed + '</td><td><button class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
    } catch (ex) {
        console.error('PARSE ERROR (Registro 190) : ' + ex);
    }
    document.getElementById('tbmedReg').innerHTML += medicosRegistrados;
}

function regMedValid() {
    var inputs = ['nombreMed', 'apellidoMed', 'correoMed', 'telefonoMed', 'especialidadMed', 'calleMed', 'numeroMed', 'slc_colonias', 'nmb_cp', 'calle1Med', 'calle2Med', 'slc_ciudades', 'slc_estados'];
    var valid = true;
    for (i = 0; i < inputs.length; i++) {
        if (document.getElementById(inputs[i]).value.length <= 0) {
            valid = false;
            break;
        }
    }
    return valid;
}

function obtenerCiudades() {
    document.getElementById('slc_ciudades').innerHTML = '<option value="">Ciudad</option>';
    $.ajax({
        url: '/obtenerCiudades',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'estado_id': document.getElementById('slc_estados').value
        },
        success: function(data) {
            data.ciudades.forEach(function(record) {
                document.getElementById('slc_ciudades').innerHTML += '<option value="' + record.id + '">' + record.ciudad + '</option>';
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function obtenerColonias() {
    document.getElementById('slc_colonias').innerHTML = '<option value="">Colonia</option>';
    $.ajax({
        url: '/obtenerLocalidades',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'estado_id': document.getElementById('slc_estados').value,
            'ciudad_id': document.getElementById('slc_ciudades').value
        },
        success: function(data) {
            data.localidades.forEach(function(record) {
                document.getElementById('slc_colonias').innerHTML += '<option value="' + record.id + '">' + record.localidad + '</option>';
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}


function obtenerCP() {
    document.getElementById('nmb_cp').value = '';
    $.ajax({
        url: '/buscarCP',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'localidad_id': document.getElementById('slc_colonias').value
        },
        success: function(data) {
            document.getElementById('nmb_cp').value = data.cp;
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}
function cargaEstadoCiudad(){
  $.ajax({
    url: "/obtenerEstadoCiudad",
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    success: function(data){

    },
    error: function(jqXHR, textStatus, err) {
        console.error('AJAX ERROR: (registro 146) : ' + err);
    }
  });
}
//variable general para sacar el id y usarlo en otras funciones
var general;
var poco;
function cargarInfoSesion() {
    $.ajax({
        url: '/obtenerInformacionUsuario',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function(data) {
              $("#buttonBiometrico").html('');
              $("#ladaTelefono").html('');
              $("#ladaTelefono").html('');
              //DATOS GENERALES
              $("#idNombre").html('<input type = "hidden" id = "idDatosGenerales" value = "'+data.DatosGenerale.id+'"/>');
              $("#inputNombre").html('<input type = "text" class = "form-control" id = "inName" name = "inName" value ="'+data.DatosGenerale.nombre+'" placeholder = "Nombre"/>');
              $("#buttonName").html('<button ocultoId = "'+data.DatosGenerale.id+'" determina = "n" otroCampo = "nombreD" inputId="inName" type = "button" id = "modificaName" class = "form-control btn btn-success"><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputApellidoP").html('<input type = "text" class = "form-control" id = "inApellidoP" name = "inApellidoP" value = "'+data.DatosGenerale.apellidoP+'" placeholder="Apellido paterno"/>');
              $("#buttonApellidoP").html('<button ocultoId = "'+data.DatosGenerale.id+'" determina = "aP" otroCampo = "apellidoP" inputId="inApellidoP" type = "button" class = "form-control btn btn-success" id = "modificarApellidoP"><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputApellidoM").html('<input type = "text" class = "form-control" id = "inApellidoM" name = "inApellidoM" value ="'+data.DatosGenerale.apellidoM+'" placeholder = "Apellido materno"/>');
              $("#buttonApellidoM").html('<button ocultoId = "'+data.DatosGenerale.id+'" determina = "aM" otroCampo = "apellidoM" inputId="inApellidoM" type = "button" class = "form-control btn btn-success" id = "modificarApellidoM" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              //FIN DATOS GENERALES
              //BIOMETRICOS
              $("#idBiometrico").html('<input type = "hidden" id = "idBiometrico" value = "'+data.Biometrico.id+'" />');
              $("#inputBiometricoPeso").html('<input selectivo = "peso" type = "text" class = "form-control" id = "biometricoPeso" name = "biometricoPeso" value = "'+data.Biometrico.peso+'" placeholder = "Peso"/>');
              $("#modificaBP").html('<button ocultoId = "'+data.Biometrico.id+'" class = "form-control btn btn-success" otroCampo = "biometric" inputType = "biometricoPeso" name = "modificaPB" type = "button" id = "modificaPB"><span class="glyphicon glyphicon-pencil"></span></button>')
              $("#inputBiometricoAltura").html('<input selectivo = "altura" type = "text" class = "form-control" id = "biometricoAltura" name = "biometricoAltura" value = "'+data.Biometrico.altura+'" placeholder = "Altura"/>');
              $("#modificaBA").html('<buttton ocultoId = "'+data.Biometrico.id+'" otroCampo = "biometric" inputType = "biometricoAltura" type = "button" class = "form-control btn btn-success" id = "modificarAl"><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputBiometricoSangre").html('<input selectivo = "sangre" type = "text" class = "form-control" id = "biometricoSangre" name = "biometricoSangre" value = "'+data.Biometrico.tipoSangre+'" placeholder = "Tipo Sangre"/>');
              $("#modificaBS").html('<buttton ocultoId = "'+data.Biometrico.id+'" otroCampo = "biometric" inputTyepe = "biometricoSangre" type = "button" name ="modificaSB" id = "modificaSB" class = "form-control btn btn-success"><span class="glyphicon glyphicon-pencil"></span></button>')
              $("#inputBiometricoGenero").html('<input selectivo = "genero" type = "text" class = "form-control" id = "biometricoGenero" name = "biometricoGenero" value ="'+data.Biometrico.genero+'" placeholder = "Genero"/>');
              $("#buttonBiometrico").html('<button ocultoId = "'+data.Biometrico.id+'" otroCampo = "biometric" inputId="biometricoGenero" type = "button" class = "form-control btn btn-success" id = "modificarBiometrico"><span class="glyphicon glyphicon-pencil"></span></button>');
              // FIN BIOMETRICOS
              // MUNICIPIOS Y TELEFONOS
              $("#ladaTelefono").html('');
              $("#numeroTelefono").html('');
              $("#buttonLada").html('');
              $("#buttonTel").html('');
              $("#contactoNombre").html('');
              $("#contactoTel").html('');
              $("#buttonContacto").html('');

              $("#buttonMunicipio").html('<button otroCampo = "municip" type = "button" class = "form-control btn btn-success" id = "moficaMunicipio" ><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#idMunicipio").html('<input type = "hidden" id = "idMunicipio" value = "'+data.Direccions[0].Localidad.municipio_id+'" />');
              $("#inputMunicipio").html('<input type = "text" class ="form-control" id = "agregaMunicipio" name = "agregaMunicipio" placeholder = "Municipio"/>');

              $("#buttonAddLada").html('<button ocultoId = "" otroCampo = "addLada" inputId="" type = "button" class = "form-control btn btn-primary" id = "agregaLada"><span class="glyphicon glyphicon-plus"></span></button>');
              $("#addladaTelefono").html('<input type = "text" class = "form-control" id = "agregaAddLada" name = "agregaAddLada" placeholder = "LADA:"/>');
              $("#addnumeroTelefono").html('<input type = "text" class ="form-control" id = "addFon" name = "addFon" placeholder="Telefono:"/>');

              $("#nombreDContacto").html('<input type = "text" id = "agregaNContacto" name = "agregaNContacto" class = "form-control"placeholder = "Nombre:"/>');
              $("#numeroDContacto").html('<input type = "text" id = "agregaNtel" name = "agregaNtel" class = "form-control" placeholder = "Telefono:"/>');
              $("#buttonContacto").html('<button otroCampo = "addDatos" inputId="" type = "button" class = "form-control btn, btn-primary" id = "agregaDatosContacto" name = "agregaDatosContacto"><span class="glyphicon glyphicon-pencil"></span></button>');

              $("idCp").html('<input type = "hidden" id = "idLocalidad" value = "'+data.Direccions[0].Localidad.id+'" />');
              $("#direccionCp").html('<input type = "text" class ="form-control" id = "direccionCP" name = "direccionCP" value ="'+data.Direccions[0].Localidad.CP+'" placeholder="CP"/>');
              $("#buttonCP").html('<button ocultoId = "'+data.Direccions[0].Localidad.id+'" otroCampo = "cpB" inputId="" type = "button" class ="form-control btn btn-success" id = "CpButton" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              for( var i in data.Telefonos){
                $("#idLada").append('<input type = "hidden" id = "idTelefonos'+i+'" value = "'+data.Telefonos[i].id+'" />');
                $("#ladaTelefono").append('<input us = "'+data.Telefonos[i].usuario_id+'" maxlength = "5" type = "text" class = "form-control" id = "dLada'+i+'" name = "dLada'+i+'" value = "'+data.Telefonos[i].lada+'" placeholder = "LADA"/>');
                $("#buttonLada").append('<button inputUs = "dLada'+i+'" ocultoId = "'+data.Telefonos[i].id+'" otroCampo = "lad" inputId = "dLada'+i+'" valor = "type = "button" class = "form-control btn btn-success" id = "modificarLada'+i+'" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
                $("#numeroTelefono").append('<input us = "'+data.Telefonos[i].usuario_id+'" type = "text" class = "form-control" id = "numTel'+i+'" name = "numTel'+i+'" value = "'+data.Telefonos[i].numero+'" placeholder = "Numero telefonico"/>');
                $("#buttonTel").append('<button inputUs = "numTel'+i+'" ocultoId = "'+data.Telefonos[i].id+'" otroCampo = "ttel" inputId = "numTel'+i+'" type = "button" class = "form-control btn btn-success" id = "modificarTel'+i+'"><span class="glyphicon glyphicon-pencil"></span></button>');
              }
              // FIN MUNICIPIOS Y TELEFONOS
              // CONTACTO
              $("#buttonContactoNombre").html('');
              for( var i in data.Paciente.ContactoEmergencia ){
                $("#idContacto").append('<input type = "hidden" id = "idContacto" value = "'+data.Paciente.ContactoEmergencia[i].id+'" />');
                $("#contactoNombre").append('<input type = "text" class = "form-control" id = "contactoNombre'+i+'" value ="'+data.Paciente.ContactoEmergencia[i].nombre+'" name = "contactoNombre'+i+'" placeholder="Nombre del contacto:" />');
                $("#buttonContactoNombre").append('<button ocultoId = "'+data.Paciente.ContactoEmergencia[i].id+'" otroCampo = "contChangeNombre" inputId = "contactoNombre'+i+'"  type = "button" class = "form-control btn btn-success" id = "modificaContactoNombre'+i+'"><span class = "glyphicon glyphicon-pencil"></span></button>');
                $("#contactoTel").append('<input type = "text" class = "form-control" id = "contactoTel'+i+'" value = "'+data.Paciente.ContactoEmergencia[i].tel+'" name = "contactoTel'+i+'" placeholder="Telefono del contacto:"/>');
                $("#buttonContacto").append('<button ocultoId = "'+data.Paciente.ContactoEmergencia[i].id+'" otroCampo = "contChange" inputId="contactoTel'+i+'" type = "button" class = "form-control btn btn-success" id = "modificarContacto'+i+'"><span class="glyphicon glyphicon-pencil"></span></button> ');
              }
              // FIN CONTACTO
              $("#inputPadecimiento").html('');
              $("#buttonPadecimiento").html('');
              //PACIENTE
              for( var i in data.Paciente.PacientePadecimientos ){
                $("#idPadecimiento").append('<input type = "hidden" id = "idPadecimiento'+i+'" value = "'+data.Paciente.PacientePadecimientos[i].Padecimiento.id+'" />');
                $("#inputPadecimiento").append('<input type = "text" class = "form-control" id = "padecimiento'+i+'" name = "padecimiento"'+i+' value = "' +data.Paciente.PacientePadecimientos[i].Padecimiento.padecimiento + '" placeholder="Padecimiento" disabled/><br/>');
                $("#buttonPadecimiento").append('<button de ="'+data.Paciente.PacientePadecimientos[i].id+'" acc = "elimina" ocultoId = "'+data.Paciente.PacientePadecimientos[i].Padecimiento.id+'" otroCampo = "deletePade" inputId="padecimiento'+i+'" type = "button" class = "form-control btn btn-danger id = "eliminaPadecimiento'+i+'"><span class="glyphicon glyphicon-remove"></span></button>');
              }
              $("#buttonAddPadecimiento").html('<button otroCampo = "addPad" inputId="" type = "button" class = "btn btn-primary" id = "addPadecimiento" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>');
              //FIN PACIENTE
              $("#inputAlergia").html('');
              $("#eliminarAlergia").html('');
              // ALERGIA
              for( var i in data.Paciente.PacienteAlergia ){
                $("#idAlergia").append('<input type = "hidden" id = "idAlergia" value = "'+data.Paciente.PacienteAlergia[i].Alergia.id+'" />');
                $("#inputAlergia").append('<input type = "text" class = "form-control" id = "alergia'+ i +'" name = "alergia"'+i+' value ="' +data.Paciente.PacienteAlergia[i].Alergia.alergia+ '" placeholder="alergia" disabled/> ');
                $("#eliminarAlergia").append('<button de ="'+data.Paciente.PacienteAlergia[i].id+'" acc = "elimina" ocultoId = "'+data.Paciente.PacienteAlergia[i].Alergia.id+'" otroCampo = "deleteAle" inputId= "alergia'+ i +'" type = "button" class = "form-control btn btn-danger" id = "eliminarAlergia'+i+'"><span class="glyphicon glyphicon-remove"></span></button> ');
              }
              $("#addAlergia").html('<button otroCampo = "addAle" inputId="" type = "button" class = "btn btn-primary" id = "addAlergia" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>');
              //FIN ALERGIA
              var otroCampo = "";
              var segundoSwitch = "";
              var idBoton = $("button").click(function(){
                if( $(this).attr('inputId') != "" ){
                  idBoton = "#"+$(this).attr('inputId');
                }
              });
              general = idBoton;
              $("#modificaBP").click(function(){
                da = String($("#modificaPB").attr('ocultoId'));
                despachador('Biometrico','actualizar','peso','', '#biometricoPeso','','',true,da,'');
              });
              $("#modificaBA").click(function(){
                da = String($("#modificarAl").attr('ocultoId'));
                despachador('Biometrico','actualizar','altura','', '#biometricoAltura','','',true,da,'');
              });
              $("#modificaBS").click(function(){
                da = String($("#modificaSB").attr('ocultoId'));
                despachador('Biometrico','actualizar','tipoSangre','', '#biometricoSangre','','','',da,'');
              });
              $("#buttonBiometrico").click(function(){
                da = String($("#modificarBiometrico").attr('ocultoId'));
                despachador('Biometrico','actualizar','genero','', '#biometricoGenero','','','',da,'');
              });
              var cambioAlergia;
              $("#menuAlergia").change(function(){
                if( $(this).val() != "0" ){
                  cambioAlergia = $(this).val();
                }else{
                  cambioAlergia = "0";
                  alert('Seleccione una opcion');
                }
              });
              var cambioPadecimiento;
              $("#menuPadecimiento").change(function(){
                if( $(this).val() != "0" ){
                  cambioPadecimiento = $(this).val();
                }else{
                  cambioPadecimiento = "0";
                  alert("Seleccione una opcion");
                }
              });
              $(idBoton).click(function(){
                otroCampo = $(this).attr('otroCampo');
                segundoSwitch = String($(this).attr('ocultoId'));
                var algo;
                if( $(this).attr('de') != ""){
                  algo = $(this).attr('de');
                }
                poco = $(this).attr('id');
                if($(this) != "" ){
                  switch(otroCampo){
                    case 'nombreD':despachador('DatosGenerales','actualizar','nombre','','#inName','','','',segundoSwitch,'');
                    break;
                    case 'apellidoP':despachador('DatosGenerales','actualizar','apellidoP','','#inApellidoP','','','',segundoSwitch,'');
                    break;
                    case 'apellidoM':despachador('DatosGenerales','actualizar','apellidoM','','#inApellidoM','','','',segundoSwitch,'');
                    break;
                    case 'municip':
                    break;
                    case 'addLada':
                      if( $("#agregaAddLada").val() != "" && $("#addFon").val() != "" ){
                        var inser ={};
                        inser = {
                          tipo:'P',
                          numero:$("#addFon").val(),
                          claveRegion: parseInt(101),
                          lada:parseInt($("#agregaAddLada").val()) ,
                          usuario_id:1
                        };
                        despachador('Telefono','insertar','','','','','','', inser);
                      }else{
                        alert("Debes de llenar los dos campos");
                      }
                    break;
                    case 'cpB':
                    break;
                    case 'lad':despachador('Telefono','actualizar','lada','',idBoton,'','','',segundoSwitch,'');
                    break;
                    case 'ttel':despachador('Telefono','actualizar','numero','',idBoton,'','','',segundoSwitch,'');
                    break;
                    case 'addDatos':
                      var contactoarray = {};
                      if($("#agregaNContacto").val() != "" && $("#agregaNtel").val() != "" ){
                        contactoarray = {
                          nombre:$("#agregaNContacto").val(),
                          tel:$("#agregaNtel").val(),
                          medico:0,
                          usuario_id:1,
                          paciente_id:1
                        };
                        despachador('ContactoEmergencia','insertar','','','','','','', contactoarray);
                      }else{
                        alert("Debes de llenar los dos campos");
                      }
                    break;
                    case 'contChangeNombre':despachador('ContactoEmergencia','actualizar','nombre','',idBoton,'','','',segundoSwitch,'');
                    break;
                    case 'contChange':despachador('ContactoEmergencia','actualizar','tel','',idBoton,'','','',segundoSwitch,'');
                    break;
                    case 'deletePade': despachador('PacientePadecimiento','delete','padecimiento_id','',idBoton,algo,'','',segundoSwitch,'');
                    break;
                    case 'addPad':
                      var padarray = {};
                      console.log("Cambio pade"+cambioPadecimiento);
                      if( cambioPadecimiento != "0" ){
                        padarray = {
                          paciente_id: 1,
                          padecimiento_id:cambioPadecimiento
                        };
                        despachador('PacientePadecimiento','insertar','','','','','','', padarray);
                      }else{
                        alert("Seleccione una opcion");
                      }
                    break;
                    case 'deleteAle':despachador('PacienteAlergia','delete','alergia_id','',idBoton,algo,'','',segundoSwitch,'');
                    break;
                    case 'addAle':
                      var alearray = {};
                      console.log("Cambio alergia"+cambioAlergia);
                      if( cambioAlergia != "0"){
                        alearray = {
                          paciente_id: 1,
                          alergia_id:cambioAlergia
                        };
                        despachador('PacienteAlergia','insertar','','','','','','', alearray);
                      }else{
                        alert("Seleccione una opcion");
                      }
                    break;
                  }//fin switch
                }//fin if
              });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}
//<-------------- OSCAR --------------------------->
/**
* En la siguiente function con ella se podrá actualizar los campos que se hayan mandado por parametro
* @param nameInput id del input
* @param idOculto id del input hidden
* @param campoAmodificar esta variable es para decirle a la funcion que campo es el que debe de modificar o insertar
*
*
**/
function despachador(nameTa, acction, campoAmodificar, campoAmoficar2, nameInput,nameinput2, idOculto,exodo,prueba,objectoInsert){
  var envioVariable;
  if(exodo == true){
    envioVariable = $(nameInput).val();
  }else{
    envioVariable = String($(nameInput).val());
  }
  var envioVariable2 = nameinput2;
  var envioIdVariable = String($(idOculto).val());
  $.ajax({
      url:"/despachador",
      type: "POST",
      dataType: "JSON",
      data: {
          tabla: nameTa,
          accion: acction,
          campo:campoAmodificar,
          campo2:campoAmoficar2,
          valor:envioVariable,
          valor2: envioVariable2,
          id:envioIdVariable,
          prueba:prueba,
          numero:exodo,
          objecto:objectoInsert
      },
      success: function(data){
        console.log("EXITOSO");
        if( data == true ){
          console.log("AGREGAR EFECTOS PARA QUE SE QUITE");
        }else{
          alert("No se pudo eliminar");
        }
      },
      error: function(jqXHR, textStatus, err){
        console.log("AJAX ERROR: (no se pudo ejecutar la accion: '"+acction+"') : " + err);
      },
      complete: function( xhr, status){
        console.log("Petición realizada");
      }
  });
}
//<-------------- OSCAR ---------------------------------->
// función que actualiza médico.
function actDoctor() {
    $.ajax({
        url: '/actualizaMedico',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: $('#frmActMed').serialize(),
        type: 'POST',
        success: function(data) {
            // al guardar cambios oculta la forma
            $("#UpdateModal").modal("hide");
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}

// muestra la ventana para editar al médico
function muestraMedico(id) {
    $("#UpdateModal .modal-body").load("edicionMedico/" + id, function() {
        $("#UpdateModal").modal("show");
    });
}

$('#CambiarFotoPerfil').on('hidden.bs.modal', function(e) {
    $('#imageFile').val('');
})

var base64file;

$(function() {
    $('#imageFile').change(function() {
        base64file = '';
        var tamanio = $(this)[0].files[0].size;
        if (tamanio < 1048576) {
            $('#btnCrop').hide();
            $('#CambiarFotoPerfil').modal("show");
            document.getElementById("contenedorFoto").innerHTML = '<img id="fotoPerfilNueva" >';
            var reader = new FileReader();
            var fotoPerfilNueva = $('#fotoPerfilNueva');
            reader.onload = function(e) {
                fotoPerfilNueva.attr("src", e.target.result);
                var x = document.getElementById("fotoPerfilNueva").width;
                var y = document.getElementById("fotoPerfilNueva").height;
                if (x > y) x = y;
                fotoPerfilNueva.Jcrop({
                    onChange: SetCoordinates,
                    onSelect: SetCoordinates,
                    boxWidth: 570,
                    aspectRatio: 1,
                    setSelect: [ x*0.1, x*0.1, x-(x*0.1),  x-(x*0.1)]
                });
            }
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            $('#imageFile').val('');
            alert("La imagen es muy grande, selecciona otra");
        }
    });
});

function verificarImagen() {
    $('#base64file').val(base64file);
}

function SetCoordinates(c) {
    var imgX1 = c.x,
        imgY1 = c.y,
        imgWidth = c.w,
        imgHeight = c.h;
    if (c.w > 0) {
        $('#btnCrop').show();
        var canvas = $("#canvas")[0];
        var context = canvas.getContext('2d');
        var img = new Image();
        var imgPreview = new Image();
        imgPreview.onload = function() {
            canvas.width = 200;
            canvas.height = 200;
            context.drawImage(imgPreview, 0, 0, 200, 200);
            base64file = canvas.toDataURL();
        };
        img.onload = function() {
            canvas.height = imgHeight;
            canvas.width = imgWidth;
            context.drawImage(img, imgX1, imgY1, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
            imgPreview.src = canvas.toDataURL();
        };
        img.src = $('#fotoPerfilNueva').attr("src");
    } else {
        $('#btnCrop').hide();
    }
};
