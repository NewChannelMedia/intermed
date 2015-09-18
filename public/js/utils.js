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
              // SE LES ASIGNA DATOS A LOS ID'S
              $("#idDatosGenerales").val(data.DatosGenerale.id);
              $("#idTelefonos").val(data.Telefonos[0].id);
              $("#idLocalidad").val(data.Direccions[0].Localidad.id);
              $("#idMunicipio").val();
              $("#idBiometrico").val(data.Biometrico.id);
              $("#idContacto").val(data.Paciente.ContactoEmergencia[0].id);
              $("#idPadecimiento").val(data.Paciente.PacientePadecimientos[0].id);
              $("#idAlergia").val(data.Paciente.PacienteAlergia[0].id);
              // FIN DE LOS ID
              //DATOS GENERALES
              $("#inputNombre").html('<input type = "text" class = "form-control" id = "inName" name = "inName" value ="'+data.DatosGenerale.nombre+'" placeholder = "Nombre"/>');
              $("#buttonName").html('<button type = "button" id = "modificaName" class = "form-control btn btn-success" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputApellidoP").html('<input type = "text" class = "form-control" id = "inApellidoP" name = "inApellidoP" value = "'+data.DatosGenerale.apellidoP+'" placeholder="Apellido paterno"/>');
              $("#buttonApellidoP").html('<button type = "button" class = "form-control btn btn-success" id = "modificarApellidoP" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputApellidoM").html('<input type = "text" class = "form-control" id = "inApellidoM" name = "inApellidoM" value ="'+data.DatosGenerale.apellidoM+'" placeholder = "Apellido materno"/>');
              $("#buttonApellidoM").html('<button type = "button" class = "form-control btn btn-success" id = "modificarApellidoM" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              //FIN DATOS GENERALES
              //BIOMETRICOS
              $("#inputBiometricoPeso").html('<input type = "text" class = "form-control" id = "biometricoPeso" name = "biometricoPeso" value = "'+data.Biometrico.peso+'" placeholder = "Peso"/>');
              $("#inputBiometricoAltura").html('<input type = "text" class = "form-control" id = "biometricoAltura" name = "biometricoAltura" value = "'+data.Biometrico.altura+'" placeholder = "Altura"/>');
              $("#inputBiometricoSangre").html('<input type = "text" class = "form-control" id = "biometricoSangre" name = "biometricoSangre" value = "'+data.Biometrico.tipoSangre+'" placeholder = "Tipo Sangre"/>');
              $("#inputBiometricoGenero").html('<input type = "text" class = "form-control" id = "biometricoGenero" name = "biometricoGenero" value ="'+data.Biometrico.genero+'" placeholder = "Genero"/>');
              $("#buttonBiometrico").append('<button type = "button" class = "form-control btn btn-success" id = "modificarBiometrico" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              // FIN BIOMETRICOS
              // MUNICIPIOS Y TELEFONOS
              $("#ladaTelefono").html('');
              $("#numeroTelefono").html('');
              $("#buttonMunicipio").html('<button type = "button" class = "form-control btn btn-success" id = "moficaMunicipio" onclick= ""><span class="glyphicon glyphicon-pencil"></span></button>');
              $("#inputMunicipio").html('<input type = "text" class ="form-control" id = "agregaMunicipio" name = "agregaMunicipio" placeholder = "Municipio"/>');
              $("#buttonAddLada").html('<button type = "button" class = "form-control btn btn-primary" id = "agregaLada" onclick =""><span class="glyphicon glyphicon-plus"></span></button>');
              $("#addladaTelefono").html('<input type = "text" class = "form-control" id = "agregaAddLada" name = "agregaAddLada" placeholder = "LADA:"/>');
              $("#buttonAddTel").html('<button type = "button" class = "form-control btn btn-primary" id = "agregaFon" name = "agregaFon" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>');
              $("#addnumeroTelefono").html('<input type = "text" class ="form-control" id = "addFon" name = "addFon" placeholder="Telefono:"/>');
              $("#direccionCp").html('<input type = "text" class ="form-control" id = "direccionCP" name = "direccionCP" value ="'+data.Direccions[0].Localidad.CP+'" placeholder="CP"/>');
              $("#buttonCP").html('<button type = "button" class ="form-control btn btn-success" id = "CpButton" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              for( var i in data.Telefonos){
                $("#ladaTelefono").append('<input type = "text" class = "form-control" id = "idLada"'+i+' name = "idLada"'+i+' value = "'+data.Telefonos[i].lada+'" placeholder = "LADA"/>');
                $("#buttonLada").append('<button type = "button" class = "form-control btn btn-success" id = "modificarLada" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
                $("#numeroTelefono").append('<input type = "text" class = "form-control" id = "numTel"'+i+' name = "numTel"'+i+' value = "'+data.Telefonos[i].numero+'" placeholder = "Numero telefonico"/>');
                $("#buttonTel").append('<button type = "button" class = "form-control btn btn-success" id = "modificarTel" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>');
              }
              // FIN MUNICIPIOS Y TELEFONOS
              $("#contactoNombre").html('');
              $("#contactoTel").html('');
              $("#buttonContacto").html('');
              // CONTACTO
              for( var i in data.Paciente.ContactoEmergencia ){
                $("#contactoNombre").append('<input type = "text" class = "form-control" id = "contactoNombre'+i+'" value ="'+data.Paciente.ContactoEmergencia[i].nombre+'" name = "contactoNombre'+i+'" placeholder="Nombre del contacto:" />');
                $("#contactoTel").append('<input type = "text" class = "form-control" id = "contactoTel'+i+'" value = "'+data.Paciente.ContactoEmergencia[i].tel+'" name = "contactoTel'+i+'" placeholder="Telefono del contacto:"/>');
                $("#buttonContacto").append('<button type = "button" class = "form-control btn btn-success" id = "modificarContacto" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button> ');
              }
              // FIN CONTACTO
              $("#inputPadecimiento").html('');
              $("#buttonPadecimiento").html('');
              //PACIENTE
              for( var i in data.Paciente.PacientePadecimientos ){
                $("#inputPadecimiento").append('<input type = "text" class = "form-control" id = "padecimiento"'+i+' name = "padecimiento"'+i+' value = "' +data.Paciente.PacientePadecimientos[i].Padecimiento.padecimiento + '" placeholder="Padecimiento" disabled/><br/>');
                $("#buttonPadecimiento").append('<button type = "button" class = "form-control btn btn-danger id = "eliminaPadecimiento" onclick = ""><span class="glyphicon glyphicon-remove"></span></button>');
              }
              $("#buttonAddPadecimiento").html('<button type = "button" class = "btn btn-primary" id = "addPadecimiento" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>');
              //FIN PACIENTE
              $("#inputAlergia").html('');
              $("#eliminarAlergia").html('');
              // ALERGIA
              for( var i in data.Paciente.PacienteAlergia ){
                $("#inputAlergia").append('<input type = "text" class = "form-control" id = "alergia"'+ i + ' name = "alergia"'+i+' value ="' +data.Paciente.PacienteAlergia[i].Alergia.alergia+ '" placeholder="alergia" disabled/> ');
                $("#eliminarAlergia").append('<button type = "button" class = "form-control btn btn-danger" id = "eliminarAlergia" onclick = ""><span class="glyphicon glyphicon-remove"></span></button> ');
              }
              $("#addAlergia").html('<button type = "button" class = "btn btn-primary" id = "addAlergia" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>');
              //FIN ALERGIA
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}
//<-------------- OSCAR --------------------------->
function actualizarDatos(idInput, idOculto){
  $.ajax({
      url:"/actualizarDatos",
      type: "POST",
      dataType: "JSON",
      cache: false,
      data: {nombre:idInput,id:idOculto},
      success: function(data){
        console.log("EXITOSO");
      },
      error: function(jqXHR, textStatus, err){
        console.log("AJAX ERROR: (actualizar datos biometrico 1928) : " + err);
      }
  });
}
function crearDatos(idInput, idOculto){
  $.ajax({
    url: "/crearDatos",
    type: "POST",
    dataType: "JSON",
    cache: false,
    data:idInput,
    success: function(data){

    },
    error: function(jqXHR, textStatus, err){
      console.log("ERROR al crear la insercion 199:");
    }
  });
}
function deleteDatos(idInput, idOculto){
  $.ajax({
    url: "/deleteDatos",
    type: "POST",
    dataType:"JSON",
    cache:false,
    data:idInput,
    success: function(data){

    },
    error: function(jqXHR, textStatus, err){
      console.log("ERROR AL ELIMINAR 192:");
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
