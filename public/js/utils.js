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
				var correo = document.getElementById( 'correoReg' ).value;
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
				document.getElementById( "frmRegMed" ).reset();
				console.log(data);
			},
			error: function( jqXHR, textStatus, err ) {
				console.error( 'AJAX ERROR: (registro 166) : ' + err );
			}
		} );
	}
	else {
		alert( "Faltan llenar unos datos." );
	}
}

function getAllDoctors() {
	regTotalDoc = 0;
	$.ajax( {
		url: '/registro',
		type: 'POST',
		dataType: "json",
		cache: false,
		data: {
			getAll: '1'
		},
		type: 'POST',
		success: function( data ) {
		
	console.log(data);
var count = Object.keys(data).length


	for(var i = 0; i < count; i++)
	{
			addMedico(data[i]);

	}
			
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 196) : ' + err );
		}
	} );
}




function addMedico( record ) {
	var entreCalles = '',
		medicosRegistrados = '';
	if ( record.calle1Med && record.calle2Med ) {
		var conjucion = 'y';
		if ( record['Direccions']['calle1'].length > 0 && record['Direccions']['calle2'].toLowerCase().substring( 0, 1 ) === 'i' ) conjucion = 'e';
		entreCalles = 'Entre ' + record.calle1 + ' ' + conjucion + ' ' + record.calle2;
	}
	try {
		// muestra los médicos con la funcionalidad de actualizar médico
		medicosRegistrados += '<tr><th scope="row">' + ( ++regTotalDoc ) + '</th><td>' + record.nombre + ' ' + record.apellidoP+ ' ' +record.apellidoM+'</td><td>' + record.correo + '</td><td>' + record.telefono + '</td><td><address><strong>' + record.calle + ' #' + record.numCalle + '</strong><br> <br>' + record.localidad+ ', CP:' + record.cp+ '</td><td>'+record.especialidad+'</td><td><button class="btn btn-info" onclick="muestraMedico(' + record.id + '); return false;"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
		//medicosRegistrados += '<tr><th scope="row">' + (++regTotalDoc) + '</th><td>' + record.nombreMed + ' ' + record.apellidoMed + '</td><td>' + record.correoMed + '</td><td>' + record.telefonoMed + '</td><td><address><strong>' + record.calleMed + ' #' + record.numeroMed + '</strong><br>' + entreCalles + ' <br>' + record.coloniaMed + ', CP:' + record.cpMed + '<br>' + record.ciudadMed + ', ' + record.estadoMed + '<br></address></td><td>' + record.especialidadMed + '</td><td><button class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
	}
	catch ( ex ) {
		console.error( 'PARSE ERROR (Registro 190) : ' + ex );
	}
	document.getElementById( 'tbmedReg' ).innerHTML += medicosRegistrados;
}

function regMedValid() {
	var inputs = [ 'nombreMed', 'apellidoMed', 'correoMed', 'telefonoMed', 'especialidadMed', 'calleMed', 'numeroMed', 'coloniaMed', 'cpMed', 'calle1Med', 'calle2Med', 'ciudadMed', 'estadoMed' ];
	var valid = true;
	for ( i = 0; i < inputs.length; i++ ) {
		console.log(inputs[i]);


		/*if ( document.getElementById( inputs[ i ] ).value.length <= 0 ) {

			valid = false;
			break;
		}*/
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
                document.getElementById('slc_ciudades').innerHTML += '<option value="' + record.id + '">' +  record.ciudad + '</option>';
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
                document.getElementById('slc_colonias').innerHTML += '<option value="' + record.id + '">' +  record.localidad + '</option>';
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
		},
		error: function( jqXHR, textStatus, err ) {
			console.error( 'AJAX ERROR: (registro 166) : ' + err );
		}
	} );
}

// muestra la ventana para editar al médico
function muestraMedico( id ) {
	$( "#UpdateModal .modal-body" ).load( "edicionMedico/" + id, function() {
		$( "#UpdateModal" ).modal( "show" );
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
