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

function cargarInfoSesion() {
    $.ajax({
        url: '/obtenerInformacionUsuario',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function(data) {
            document.getElementById('prf_nombre').value = data.DatosGenerale.nombre;
            document.getElementById('prf_apellidoPat').value = data.DatosGenerale.apellidoP;
            document.getElementById('prf_apellidoMat').value = data.DatosGenerale.apellidoM;
              $("#direccions").html('');
              $("#telefonos").html('');
              $('#contactoEmergencia').html('');
              $("#pacientePadi").html('');
              $('#pacienteAlergi').html('');
              $('#biometrico').html('');
            $.each(data.Direccions, function(index, value){
                $("#direccions").append('<label>Direcciones</label>');
                $("#direccions").append('<label>Ubicacion:</label><input type = "text" value = '+value.ubicacionGM+' class="form-control" name="ubicacionGM">');
                $("#direccions").append('<label>numero:</label><input type = "text" value = '+value.numero+' class="form-control" name="numero">');
                $("#direccions").append('<label>calle 1</label><input type = "text" value = '+value.calle1+' class="form-control" name="calle1">');
                $("#direccions").append('<label>calle 2</label><input type = "text" value = '+value.calle2+' class="form-control" name="calle2">');
                $("#direccions").append('<label>nombre consultorio:</label><input type = "text" value = '+value.nombre+' class="form-control" name="nombreConsul">');
                $("#direccions").append('<label>Hora Inicio</label><input type = "text" value = '+value.horaInicio+' class="form-control" name="horaInicio">');
                $("#direccions").append('<label>Hora fin</label><input type = "text" value = '+value.horaFin+' class="form-control" name="horaFin">');
                $("#direccions").append('<label>dias</label><input type = "text" value = '+value.dias+' class="form-control" name="dias">');
            });
            $.each(data.Telefonos, function(index, value){
              $("#telefonos").append('<label>Telefonos:</label>');
              $("#telefonos").append('<label>numero</label><input type = "text" value ='+value.numero+' class = "form-control"name = "numeroTel" >');
              $("#telefonos").append('<label>clave region</label><input type = "text" value ='+value.claveRegion+' class = "form-control"name = "claveRegion" >');
              $("#telefonos").append('<label>lada</label><input type = "text" value ='+value.lada+' class = "form-control"name = "lada" >');
            });

            $('#biometrico').append('<label>Peso: </label><input type = "text" value = '+data.Biometrico.peso+' class = "form-control" name = "peso">');
            $('#biometrico').append('<label>altura: </label><input type = "text" value = '+data.Biometrico.altura+' class = "form-control" name = "altura">');
            $('#biometrico').append('<label>tipo sangre: </label><input type = "text" value = '+data.Biometrico.tipoSangre+' class = "form-control" name = "tipoSangre">');
            $('#biometrico').append('<label>genero: </label><input type = "text" value = '+data.Biometrico.genero+' class = "form-control" name = "genero">');
            $.each(data.Paciente.ContactoEmergencia, function(index_contacto, value_contacto){
                $('#contactoEmergencia').append('<label>Nombre Contacto:</label><input type = "text" value = '+value_contacto.nombre+' class = "form-control" name = "nombreEmergencia">');
                $('#contactoEmergencia').append('<input type = "text" value = '+value_contacto.tel+' class = "form-control" name = "telEmergencia">');
            });
            $.each(data.Paciente.PacientePadecimientos, function(index_padecimiento, value_padecimiento){
                $("#pacientePadi").append('<label>Padecimiento:</label><input type = "text" value = '+value_padecimiento.Padecimiento.padecimiento+' class = "form-control" name = "padecimiento">');
                $("#pacientePadi").append('<input type="hidden" value = ' + value_padecimiento.padecimiento_id + ' class = form-control name = "padecimiento_id">');
            });
            $.each(data.Paciente.PacienteAlergia, function( index_alergia, value_alergia){
              $("#pacienteAlergi").append('<label>Alergia/s:</label><input type = "text" value = '+value_alergia.Alergia.alergia+' class = "form-control" name = "alergias">');
              $("#pacienteAlergi").append('<input type = "hidden" value = ' + value_alergia.alergia_id + ' class = "form-control" name = "alergia_id">');
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}

function actualizarBiometricos(){
  $.ajax({
      url:"/modificarInformacionPaciente",
      type: "POST",
      dataType: "JSON",
      cache: false,
      data: $('#perfilPaciente').serialize(),
      success: function(data){
        console.log("EXITOSO");
      },
      error: function(jqXHR, textStatus, err){
        console.log("AJAX ERROR: (actualizar datos biometrico 1928) : " + err);
      }
  });
}

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
