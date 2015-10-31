/**
 *   Archivo creado por Cinthia
 *
 */
var regTotalDoc = 0;

if ( location.pathname === '/registro' ) {
	$( document ).ready( getAllDoctors() );
}
else {
	$( document ).ready( function() {
		$( '#frm_regP' ).on( 'submit', function( e ) {
			e.preventDefault();
			var pass1 = $( '#contraseñaReg' ).val();
			var pass2 = $( '#contraseña2Reg' ).val();
			var submit = true,
				mensaje = '';
			//Validar contraseña y confirmacion de contraseña
			if ( pass1 != pass2 ) {
				submit = false;
				mensaje = 'Confirmación de contraseña no coincide';
			}
			//Validar fecha
			if ( submit ) {
				var dia = $( '#diaNacReg' ).val();
				var mes = $( '#mesNacReg' ).val();
				var anio = $( '#añoNacReg' ).val()
				fecha = dia + "/" + mes + "/" + anio;
				if ( validarFormatoFecha( fecha ) ) {
					if ( !existeFecha( fecha ) ) {
						submit = false;
						mensaje = "La fecha de nacimiento introducida no existe.";
					}
				}
				else {
					submit = false;
					mensaje = "El formato de la fecha de nacimiento es incorrecto.";
				}
			}

			if ( submit ) {
				var correo = document.getElementById('correoReg').value;
				if ( correoValido( correo ) ) {
					$.ajax( {
						async: false,
						url: '/correoDisponible',
						type: 'POST',
						dataType: "json",
						cache: false,
						data: {
							'email': correo
						},
						success: function( data ) {
							submit = data.result;
							if ( !submit ) mensaje = "El correo " + correo + ' ya se encuentra registrado.';
						},
						error: function( jqXHR, textStatus, err ) {
							console.error( 'AJAX ERROR: ' + err );
						}
					} );
				}
			}

			if ( submit ) {
				document.getElementById( 'alertError' ).innerHTML = '';
				this.submit();
			}
			else {
				document.getElementById( 'alertError' ).innerHTML = '<div class="alert alert-danger" role="alert" >' + mensaje + '</div>';
			}
		} );
	} );
}

function validarFormatoFecha( campo ) {
	var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
	if ( ( campo.match( RegExPattern ) ) && ( campo != '' ) ) {
		return true;
	}
	else {
		return false;
	}
}

function existeFecha( fecha ) {
	var fechaf = fecha.split( "/" );
	var day = fechaf[ 0 ];
	var month = fechaf[ 1 ];
	var year = fechaf[ 2 ];
	if ( !( month > 0 && month < 13 ) ) {
		return false;
	}
	var date = new Date( year, month, '0' );
	if ( ( day - 0 ) > ( date.getDate() - 0 ) ) {
		return false;
	}
	return true;
}

function existeCorreo() {
	var correo = document.getElementById( 'correoReg' ).value;
	if ( correoValido( correo ) ) {
		$.ajax( {
			async: true,
			url: '/correoDisponible',
			type: 'POST',
			dataType: "json",
			cache: false,
			data: {
				'email': correo
			},
			success: function( data ) {
				console.log( 'DATA ' + data.result );
				return data.result;
			},
			error: function( jqXHR, textStatus, err ) {
				alert( 'DATA: ' + err );
				console.error( 'AJAX ERROR: ' + err );
			}
		} );
	}
}

function correoValido( correo ) {
	return true;
}

function regDoctor() {
	if ( regMedValid() == true ) {
		$.ajax( {
			url: '/registro',
			type: 'POST',
			dataType: "json",
			cache: false,
			data: $( '#frmRegMed' ).serialize(),
			type: 'POST',
			success: function( data ) {
				if ( data.error == null )
				{
					$( '#frmRegMed')[0].reset();
					addMedico( data,1 );
				}
				else {
					alert(data.error.message);
				}
			},
			error: function( jqXHR, textStatus, err ) {
				console.error( 'AJAX ERROR: (registro 166) : ' + err );
			}
		});
	}
	else {
		alert( "Faltan llenar unos datos." );
	}
}

function getAllDoctors() {
	regTotalDoc = 0;
	$.ajax( {
		url: '/todos',
		type: 'GET',
		dataType: "json",
		cache: false,
		data: {
			getAll: '1'
		},
//		type: 'POST',
		success: function( data ) {
			data.forEach( function( record ) {
				addMedico( record,1 );
			} );
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 196) : ' + err );
		}
	} );
}

function addMedico( record, tipo ) {
		var entreCalles = '',
		medicosRegistrados = '';
		especialidad = '';
		telefono = '';

		if ( record.Direccions[0].calle && record.Direccions[0].calle2 ) {
			var conjucion = 'y';
			if ( record.Direccions[0].calle2.length > 0 && record.Direccions[0].calle2.toLowerCase().substring( 0, 1 ) === 'i' ) conjucion = 'e';
			entreCalles = 'Entre ' + record.Direccions[0].calle + ' ' + conjucion + ' ' + record.Direccions[0].calle2;
		}

		if  ( record.Medico.Especialidads.length > 0 )
		{
			especialidad = record.Medico.Especialidads[0].especialidad;
		}

		if  ( record.Telefonos.length > 0 )
		{
			telefono = record.Telefonos[0].numero;
		}

		if  ( tipo == 1){
			++regTotalDoc;
		}

		try {
			medicosRegistrados += '<tr id="med_' + record.id  +'"><th scope="row">' + ( regTotalDoc ) + '</th><td>' + record.DatosGenerale.nombre + ' ' + record.DatosGenerale.apellidoP + ' ' + record.DatosGenerale.apellidoM +
			'</td><td>' + record.correo + '</td><td>' + telefono+ '</td><td><address><strong>' + record.Direccions[0].calle + ' #' + record.Direccions[0].numero + '</strong><br>' + entreCalles + '<br>'	+
			record.Direccions[0].Localidad.localidad  + ', CP:' + record.Direccions[0].Localidad.CP + '<br>' + record.Direccions[0].Municipio.municipio + ', ' + record.Direccions[0].Municipio.Estado.estado + '<br></address></td><td>' + especialidad +
			'</td><td><button class="btn btn-info" onclick="muestraMedico(' + record.id + '); return false;"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
		}
		catch ( ex ) {
			console.error( 'PARSE ERROR (Registro 190) : ' + ex );
		}

		if  ( tipo == 1){
			document.getElementById( 'tbmedReg' ).innerHTML = medicosRegistrados +  document.getElementById( 'tbmedReg' ).innerHTML;
		} else {
			$("tr#med_" +  record.id).replaceWith(medicosRegistrados);
		}
}

function registrarCita() {
	var horarios = obtenerHorarios();
	$("#fecha").val(horarios[0].inicio);

	console.log($('#frmRegCita').serialize());
	$.ajax({
		url: '/agregaCita',
		type: 'POST',
		dataType: "json",
		data: $('#frmRegCita').serialize(),
		cache: false,
		//data: JSON.stringify(obtenerHorarios()),
		type: 'POST',
		success: function( data ) {
			if ( data.error == null ) {

			}
			else {
				alert(data.error.message);
			}
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 166) : ' + err );
		}
	});
}


function regMedValid() {
/*
	var inputs = [ 'nombreMed', 'apellidoMed',  'correoMed', 'telefonoMed', 'especialidadMed', 'calleMed', 'numeroMed', 'coloniaMed', 'cpMed', 'calle1Med', 'calle2Med', 'ciudadMed', 'estadoMed' ];
	var valid = true;
	for ( i = 0; i < inputs.length; i++ ) {
		if ( document.getElementById( inputs[ i ] ).value.length <= 0 ) {
			valid = false;
			break;
		}
	}
	return valid;
	*/
	return true;
}

function obtenerCiudades(tipo) {
		var ciudades;
		var idEstado = 0;

		if ( tipo == 0) {
			ciudades =  $('#slc_ciudades');
			idEstado = $('#slc_estados').val();
		}
		else {
			ciudades = $('#UpdateModal #slc_ciudades');
			idEstado = $('#UpdateModal #slc_estados').val();
		}
		ciudades.empty();
    $.ajax({
        url: '/obtenerCiudades',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'estado_id': idEstado
        },
        success: function(data) {
					ciudades.append('<option value="">Ciudad</option>');
            data.ciudades.forEach(function(record) {
                //ciudades.innerHTML += '<option value="' + record.id + '">' +  record.municipio + '</option>';
								ciudades.append('<option value="' + record.id + '">' +  record.municipio + '</option>');
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function obtenerColonias(tipo) {
		var colonias = null;
	  var idCiudad = 0;
		var idEstado = 0;

		if ( tipo == 0) {
			colonias =  $('#slc_colonias');
			idCiudad = $('#slc_ciudades').val();
			idEstado = $('#slc_estados').val();
		}
		else {
			colonias = $('#UpdateModal #slc_colonias');
			idCiudad = $('#UpdateModal #slc_ciudades').val();
			idEstado = $('#UpdateModal #slc_estados').val();
		}

		colonias.empty();
		colonias.append('<option value="">Colonia</option>');
    //document.getElementById('slc_colonias').innerHTML = '<option value="">Colonia</option>';
    $.ajax({
        url: '/obtenerLocalidades',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'estado_id': idEstado, //document.getElementById('slc_estados').value,
            'ciudad_id': idCiudad //document.getElementById('slc_ciudades').value
        },
        success: function(data) {
            data.localidades.forEach(function(record) {
							colonias.append('<option value="' + record.id + '">' +  record.localidad + '</option>');
                //document.getElementById('slc_colonias').innerHTML += '<option value="' + record.id + '">' +  record.localidad + '</option>';
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

function obtenerCP(tipo) {
		var idColonia = 0;
		var cp = null;

		if ( tipo == 0) {
			idColonia =  $('#slc_colonias').val();
			cp = $('#nmb_cp');
		}
		else {
			idColonia =  $('#UpdateModal #slc_colonias').val();
			cp = $('#UpdateModal #nmb_cp');
		}

		cp.val('');

    //document.getElementById('nmb_cp').value = '';
    $.ajax({
        url: '/buscarCP',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
            'localidad_id': idColonia //document.getElementById('slc_colonias').value
        },
        success: function(data) {
            //document.getElementById('nmb_cp').value = data.cp;
						cp.val(data.cp);
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

// función que actualiza médico.
function actDoctor() {
	$.ajax( {
		url: '/actualizaMedico',
		type: 'POST',
		dataType: "json",
		cache: false,
		data: $( '#frmActMed' ).serialize(),
		type: 'POST',
		success: function( data ) {
			// al guardar cambios oculta la forma
			$( "#UpdateModal" ).modal( "hide" );
			addMedico( data,0 );
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 166) : ' + err );
		}
	} );
}

// muestra la ventana para editar al médico
function muestraMedico( id ) {
	$( "#UpdateModal .modal-body").load("edicionMedico/" + id, function() {
		$("#UpdateModal" ).modal( "show" );
			$('#UpdateModal #slc_estados').val($('#UpdateModal #idEstado').val());
			$('#UpdateModal #slc_ciudades').val($('#UpdateModal #idMunicipio').val());
			$('#UpdateModal #slc_colonias').val($('#UpdateModal #idLocalidad').val());
			$('#UpdateModal #especialidadMed').val($('#UpdateModal #idEspecialidad').val());
	});
}


function regServicio()
{
	$.ajax( {
		url: '/agregaServicio',
		type: 'POST',
		dataType: "json",
		cache: false,
		data: $( '#frmRegServicio' ).serialize(),
		type: 'POST',
		success: function( data ) {
			alert('Se ha agregado el servicio !');

		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 166) : ' + err );
		}
	} );
}

// Obtiene ubicaciones para el servicio seleccionado
function obtieneUbicaciones(id )
{
	var ubicaciones = $('#lstUbicaciones');
	$.ajax( {
		url: '/seleccionaUbicacion',
		type: 'POST',
		dataType: "json",
		cache: false,
		data: { id: id},
		success: function( data ) {
				data.forEach(function(record) {
						ubicaciones.append('<option value="' + record.id + '">' +  record.nombre + '</option>');
				});
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 166) : ' + err );
		}
	} );
}



// script que muestra u oculta campos de la busqueda del home
if ( location.pathname === '/' ) {
	$( document ).ready( function() {
		$( "#sel-busqueda" ).change( function() {
			$( this ).find( "option:selected" ).each( function() {
				if ( $( this ).attr( "value" ) == "especialidad" ) {
					$( ".box" ).not( ".esp" ).hide();
					$( ".esp" ).show();
				}
				else if ( $( this ).attr( "value" ) == "medico" ) {
					$( ".box" ).not( ".med" ).hide();
					$( ".med" ).show();
				}
				else if ( $( this ).attr( "value" ) == "padecimiento" ) {
					$( ".box" ).not( ".pad" ).hide();
					$( ".pad" ).show();
				}
				else {
					$( ".box" ).hide();
				}
			} );
		} ).change();
	} );
}

// script para los intervalos del carousel
$( document ).ready( function() {
	$( '.carousel' ).carousel( {
		interval: 5000
	} );
} );

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
