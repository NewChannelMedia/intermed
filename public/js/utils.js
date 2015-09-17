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

        $('#frm_regM').on('submit', function(e) {
            e.preventDefault();
            var pass1 = $('#contraseñaRegM').val();
            var pass2 = $('#contraseña2RegM').val();
            var correo = $('#correoRegM').val();
            var correo2 = $('#correoConfirmRegM').val();
            var submit = true,
                mensaje = '';
            //Validar contraseña y confirmacion de contraseña
            if (pass1 != pass2) {
                submit = false;
                mensaje = 'Confirmación de contraseña no coincide';
            }
            //Validar correo y confirmacion de correo
            else if (correo != correo2) {
                submit = false;
                mensaje = 'Confirmación de correo no coincide';
            }
            //Validar correo no registrado
            else {
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
                document.getElementById('alertErrorM').innerHTML = '';
                this.submit();
            } else {
                document.getElementById('alertErrorM').innerHTML = '<div class="alert alert-danger" role="alert" >' + mensaje + '</div>';
            }
        });

        if ($('#registroCompleto') && $('#registroCompleto').val() === "0" && $('#inicio').val() === "1") {
            actualizarSesion();
            if ($('#tipoUsuario').val() === "M") {
                informacionRegistroMedico();
            }
        }

        if (location.pathname.substring(0, 7) === '/perfil') {
            cargarFavCol($('#usuarioPerfil').val());
        }
    });
}

function informacionRegistroMedico(){
    $.ajax({
        async: true,
        url: '/informacionRegistroMedico',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function(data) {
            var continuar = true;
            //PASO 1 de 3 (falta fecha de nacimiento)
            if (data.DatosGenerale) {
                document.getElementById('nombreRegMed').value = data.DatosGenerale.nombre;
                document.getElementById('apePatRegMed').value = data.DatosGenerale.apellidoP;
                document.getElementById('apeMatRegMed').value = data.DatosGenerale.apellidoM;
            } else continuar = false;
            if (data.Biometrico) {
                if (data.Biometrico.genero == "F") document.getElementById("sexF").checked = true;
                else if (data.Biometrico.genero == "M") document.getElementById("sexM").checked = true;
            } else continuar = false;
            if (data.Medico) {
                document.getElementById('curpRegMed').value = data.Medico.curp;
                document.getElementById('cedulaRegMed').value = data.Medico.cedula;
            } else continuar = false;
            i = 0;

            //Pasar al paso 2 de 3 (Datos de págo)
            if (continuar) {
                goToNextStep(i++);
            }
            /*
            //Pasar al paso 3 de 3 (Datos de facturación)
            if (continuar){
                console.log('SIMULANDO PAGO CORRECTO');
                goToNextStep(i++);
            }
            */
            if (data.DatosFacturacion) {
                document.getElementById('nomRSocialFact').value = data.DatosFacturacion.razonSocial;
                document.getElementById('rfcFact').value = data.DatosFacturacion.RFC;
                if (data.DatosFacturacion.Direccion) {
                    document.getElementById('calleFact').value = data.DatosFacturacion.Direccion.calle;
                    document.getElementById('numeroFact').value = data.DatosFacturacion.Direccion.numero;
                    if (data.DatosFacturacion.Direccion.Localidad) {
                        document.getElementById('slc_estados').value = data.DatosFacturacion.Direccion.Localidad.estado_id;
                        obtenerCiudades();
                        setTimeout(function() {
                            document.getElementById('slc_ciudades').value = data.DatosFacturacion.Direccion.Localidad.ciudad_id;
                            obtenerColonias();
                            setTimeout(function() {
                                document.getElementById('slc_colonias').value = data.DatosFacturacion.Direccion.Localidad.id;
                                document.getElementById('nmb_cp').value = data.DatosFacturacion.Direccion.Localidad.CP;
                            }, 1000);
                        }, 1000);

                    } else continuar = false;
                } else continuar = false;
            } else continuar = false;

            $("#RegMedModal").on('hidden.bs.modal', function() {
                    actualizarSesion();
            });
            $("#RegMedModal").modal("show");

        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function saveStepOne() {
    $.ajax({
        url: '/regMedPasoUno',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: $('#regMedStepOne').serialize(),
        success: function(data) {
            if (data.result === "success") {
                goToNextStep(0);
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}

function saveStepTwo() {
    goToNextStep(1);
}

function saveStepTree() {
    $.ajax({
        url: '/regMedPasoTres',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: $('#regMedStepThree').serialize(),
        success: function(data) {
            if (data.result === "success") {
                $("#RegMedModal").modal("hide");
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
    });
}

function actualizarSesion() {
    $.ajax({
        url: '/actualizarSesion',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function(data) {
            if (data.result === "success") {
                var fotoPerfil = '';
                if (data.session.registroCompleto === 1){
                    $('#registroIncompleto').css('display', 'none');
                }
                if (data.session.fotoPerfil) fotoPerfil = data.session.fotoPerfil;
                $('#fotoPerfilMini').attr("src", fotoPerfil);
                $('#fotoPerfil').attr("src", fotoPerfil);
                if (data.session.tipoUsuario === "M") {
                    if (!data.session.name) $('#session_nombreUsuario').html('No tenemos registrado tu nombre, por favor continua con tu registro <a onclick="informacionRegistroMedico()">aquí</a>');
                    else {
                        if (data.session.tipoUsuario == "M") $('#session_nombreUsuario').html('Dr. ' + data.session.name)
                        else $('#session_nombreUsuario').html(data.session.name);
                    }
                } else {
                    $('#session_nombreUsuario').html(data.session.name);
                }

                if (data.session.ciudad) {
                    $('#session_ubicacion').html(data.session.ciudad + ', ' + data.session.estado);
                }
            } else {
                window.location = "/"
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: (registro 166) : ' + err);
        }
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
    var inputs = ['nombreMed', 'apellidoMed', 'correoMed', 'telefonoMed', 'especialidadMed', 'calleMed', 'numeroMed', 'coloniaMed', 'cpMed', 'calle1Med', 'calle2Med', 'ciudadMed', 'estadoMed'];
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

// script que muestra u oculta campos de la busqueda del home
if (location.pathname === '/') {
    $(document).ready(function() {
        $("#sel-busqueda").change(function() {
            $(this).find("option:selected").each(function() {
                if ($(this).attr("value") == "especialidad") {
                    $(".box").not(".esp").hide();
                    $(".esp").show();
                } else if ($(this).attr("value") == "medico") {
                    $(".box").not(".med").hide();
                    $(".med").show();
                } else if ($(this).attr("value") == "padecimiento") {
                    $(".box").not(".pad").hide();
                    $(".pad").show();
                } else {
                    $(".box").hide();
                }
            });
        }).change();
    });
}

// script para los intervalos del carousel
$(document).ready(function() {
    $('.carousel').carousel({
        interval: 5000
    });
});

// script para obtener el DateStamp
$( document ).ready( function() {
	var str = "";
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	if ( minutes < 10 )
		minutes = "0" + minutes;
	if ( seconds < 10 )
		seconds = "0" + seconds;
	str += hours + ":" + minutes + ":" + seconds;
	$( "#regi" ).click( function() {
		$( "#tiempo" ).val( str );
	} );
} );

//<---------------------------------------------------->
	/**
	*	function hecha para validar todos los inputs, de las paginas,
	*	en los selects y radio button se revisara que se haya seleccionado
	* alguna opción. Se escaparan los caracteres, para evitar ataques
	*	XSS e inyecciones sql, se hara con JQUERY y expresiones regulares.
	*
	*	@param nameForm, nameForm es el input o los tipos de input que hay, para poderlos validad uno a uno
	*/
	var password;
	var dato;
	function validateForm( tipoForm, nameForm ){
				var comprobando = false;
				$(document).ready(function(){
						//se carga el id del formualio a validar
						$("#"+nameForm).change(function(){
								switch (tipoForm) {
										case "input-nombre":
											var m = $("#"+nameForm).val();
											var expreg = new RegExp(/^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i);
											comprobando = expreg.test(m)?true:false;
										break;
										case "input-correo":
											var correo = String($("#"+nameForm).val());
											var expreg = new RegExp(/[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/);
											comprobando = expreg.test(correo)? true : false;
										break;
										case "input-password":
											password = $("#"+nameForm).val().trim();
											dato = String(password.trim());
											var expreg = new RegExp(/([^\s][a-zA-Z0-9\d\D]){4,}/);
											comprobando = expreg.test(password) ? true: false;
										break;
										case "input-validPass":
											var atrapada = String($("#"+nameForm).val());
											var tam = dato.length;
											var expreg = new RegExp(/([^\s][a-zA-Z0-9\d\D]){4,}/);
											comprobar = expreg.test(atrapada) ? true: false;
											comprobando = ((tam === atrapada.length) && ( dato === atrapada ) && (comprobar === true))? true:false;
										break;
										case "input-dia":
											var dia = $("#" + nameForm ).val();
											var expreg = new RegExp(/^\d{1,2}/);
											comprobando =expreg.test(dia) ? true: false;
										break;
										case "input-mes":
											var mes = $("#" + nameForm ).val();
											var expreg = new RegExp(/^\d{1,2}/);
											comprobando =expreg.test(mes) ? true: false;
										break;
										case "input-año":
											var año = $("#" + nameForm ).val();
											var expreg = new RegExp(/^\d{4}/);
											comprobando =expreg.test(año) ? true: false;
										break;
										case "input-checkbox":
												comprobando = ($(this).attr('checked'))?true:false;
										break;
										case "input-select":
												comprobando = ($(this).val() > 0)?true:false;
										break;
								}
								//carga del ajax
								$.ajax({
									asyn:true,
									data:{},
									success:function(data){
										if(comprobando)
											$("#"+nameForm).css('background-color','#66FF33');
										else
											$("#"+nameForm).css('background-color','red');
									},
									error:function(){
										console.log("ERROR2 nombre");
									}
								});
						});
				});
	}// fin de la funcion principal
//<---------------------------------------------------->

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

function guardarImagenPerfil() {
    $.ajax({
        async: false,
        url: '/perfil',
        type: 'POST',
        dataType: "json",
        data: {base64file: base64file},
        cache: false,
        success: function(data) {
            if (data.result === 'success'){
                $('#CambiarFotoPerfil').modal('toggle');
                actualizarSesion();
            } else {
                alert('No se pudo guardar la imagen');
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
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

$(document).ready(function MakeWizard() {
    $("#RegMedModal").formToWizard()
});

// formToWizard
(function($) {
    $.fn.formToWizard = function() {
        var element = this;

        var steps = $(element).find(".step");
        var count = steps.size();

        $(element).find(".modal-header").find(".close").remove();
        $(element).find(".modal-header").append("<div class='stepsContainer pull-right'><ul id='steps' class='stepsList'></ul></div>");
        $(element).find(".stepsContainer").append("<span class='stepsConnector'></span>");

        steps.each(function(i) {
            if (i == 0) $("#steps").html("");
            $(this).wrap("<div id='step" + i + "'></div>");
            $(this).find(".EndButtons").addClass("step" + i + "c");
            $(this).find(".EndButtons").append("<p id='step" + i + "c'></p>");

            var name = $(this).find(".modal-footer").html();
            $("#steps").append("<li id='stepDesc" + i + "' class='stepBullets'>" + i + "</li>");
            if (i == 0) {
                createNextButton(i);
                selectStep(i);
            } else if (i == count - 1) {
                $("#step" + i).hide();
                createPrevButton(i);
            } else {
                $("#step" + i).hide();
                createPrevButton(i);
                createNextButton(i);
            }
        });

        function createPrevButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "c").append("<a href='#' id='" + stepName + "Prev' class='btn btn-default btn-block prev'><span class='glyphicon glyphicon-arrow-left'></span></a>");
            $("#" + stepName + "Prev").bind("click", function(e) {
                $("#" + stepName).hide();
                $("#step" + (i - 1)).show();
                selectStep(i - 1);
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "c").append("<a href='#' id='" + stepName + "Next' class='btn btn-default btn-block next'><span class='glyphicon glyphicon-arrow-right'></span></a>");
            $("#" + stepName + "Next").bind("click", function(e) {
                $("#" + stepName).hide();
                $("#step" + (i + 1)).show();
                selectStep(i + 1);
            });
        }

        function selectStep(i) {
            $("#steps li").removeClass("current");
            $("#stepDesc" + i).addClass("current");
        }

    }
})(jQuery);

function goToNextStep(i) {
    $("#step" + i++).hide();
    $("#step" + i).show();
    $("#steps li").removeClass("current");
    $("#stepDesc" + i).addClass("current");
}

function goToPrev(i) {
    $("#step" + i).hide();
    $("#step" + (i - 1)).show();
    selectStep(i - 1);
}

$(function() {
    $('[data-toggle="popover"]').popover()
})

$(document).ready(function() {
    if ($("#tarjetaOptReg").is(":checked")) {
        //$( '#paypalOpt' ).find( ".disabledBox" ).addClass( "dB" );
        $('#paypalOptBox').find($("input")).prop('disabled', true);
    }
    $("#tarjetaOptReg").change(function() {
        //$( '#tarjOpt' ).find( ".disabledBox" ).removeClass( "dB" );
        $('#tarjOptBox').find($("input")).prop('disabled', false);

        //$( '#paypalOpt' ).find( ".disabledBox" ).addClass( "dB" );
        $('#paypalOptBox').find($("input")).prop('disabled', true);
    });
    $("#paypalOptReg").change(function() {
        //$( '#tarjOpt' ).find( ".disabledBox" ).addClass( "dB" );
        $('#tarjOptBox').find($("input")).prop('disabled', true);

        //$( '#paypalOpt' ).find( ".disabledBox" ).removeClass( "dB" );
        $('#paypalOptBox').find($("input")).prop('disabled', false);

    });
});

function agregarFavoritos(){
    var ruta = '/agregarMedFav';
    var medicoID = $('#MedicoId').val();
    $.ajax({
        async: false,
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {medicoID: medicoID},
        cache: false,
        success: function(data) {
            if (data.result == 'success'){
                if ($('#tipoUsuario').val() === "P") $('#addFavoriteContact').html('Eliminar de favoritos');
                else if ($('#tipoUsuario').val() === "M") $('#addFavoriteContact').html('Eliminar de colegas');
                $("#addFavoriteContact").attr("onclick", "eliminarFavoritos()");
            } else {
                alert('Error al guardar medico favorito');
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function eliminarFavoritos(){
    var ruta = '/eliminarMedFav';
    var medicoID = $('#MedicoId').val();
    $.ajax({
        async: false,
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {medicoID: medicoID},
        cache: false,
        success: function(data) {
            if (data.result == 'success'){
                if ($('#tipoUsuario').val() === "P") $('#addFavoriteContact').html('Agregar a favoritos');
                else if ($('#tipoUsuario').val() === "M") $('#addFavoriteContact').html('Agregar a colegas');
                $("#addFavoriteContact").attr("onclick", "agregarFavoritos()");
            } else {
                alert('Error al guardar medico favorito');
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function cargarFavCol(usuario){
    $('#FavColPanel').html('');
    $.ajax({
        async: false,
        url: '/cargarFavCol',
        type: 'POST',
        data: {usuario: usuario},
        dataType: "json",
        cache: false,
        success: function(data) {
            if (data){
                for (var p in data) {
                    $('#FavColPanel').append('<li> <a href="http://'+ window.location.host +'/perfil/' + data[p].Medico.Usuario.usuarioUrl + '" > Dr. ' + data[p].Medico.Usuario.DatosGenerale.nombre + ' ' + data[p].Medico.Usuario.DatosGenerale.apellidoP + ' ' + data[p].Medico.Usuario.DatosGenerale.apellidoM + '</a></li>');
                }
                //alert('Success');
            }
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}
