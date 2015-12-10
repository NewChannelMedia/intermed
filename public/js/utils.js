/**
 *   Archivo creado por Cinthia
 *
 */
var regTotalDoc = 0;
var base_url = 'http://localhost:3000/';
if ( location.pathname === '/registro' ) {
  $( document ).ready( getAllDoctors() );
}
else {
  $( document ).ready( function () {
    $( '#frm_regP' ).on( 'submit', function ( e ) {
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
            success: function ( data ) {
              submit = data.result;
              if ( !submit ) mensaje = "El correo " + correo + ' ya se encuentra registrado.';
            },
            error: function ( jqXHR, textStatus, err ) {
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

    $( '#frm_regM' ).on( 'submit', function ( e ) {
      e.preventDefault();
      var pass1 = $( '#contraseñaRegM' ).val();
      var pass2 = $( '#contraseña2RegM' ).val();
      var correo = $( '#correoRegM' ).val();
      var correo2 = $( '#correoConfirmRegM' ).val();
      var submit = true,
        mensaje = '';
      //Validar contraseña y confirmacion de contraseña
      if ( pass1 != pass2 ) {
        submit = false;
        mensaje = 'Confirmación de contraseña no coincide';
      }
      //Validar correo y confirmacion de correo
      else if ( correo != correo2 ) {
        submit = false;
        mensaje = 'Confirmación de correo no coincide';
      }
      //Validar correo no registrado
      else {
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
            success: function ( data ) {
              submit = data.result;
              if ( !submit ) mensaje = "El correo " + correo + ' ya se encuentra registrado.';
            },
            error: function ( jqXHR, textStatus, err ) {
              console.error( 'AJAX ERROR: ' + err );
            }
          } );
        }
      }

      if ( submit ) {
        document.getElementById( 'alertErrorM' ).innerHTML = '';
        this.submit();
      }
      else {
        document.getElementById( 'alertErrorM' ).innerHTML = '<div class="alert alert-danger" role="alert" >' + mensaje + '</div>';
      }
    } );

    if ( $( '#registroCompleto' ) && $( '#registroCompleto' ).val() === "0" && $( '#inicio' ).val() === "1" ) {
      if ( $( '#tipoUsuario' ).val() === "M" ) {
        registroMedicoDatosPersonales();
      }
    }

    if ( location.pathname.substring( 0, 7 ) === '/perfil' ) {
      cargarFavCol( $( '#usuarioPerfil' ).val() );
    }

    if ( location.pathname.substring( 0, 19 ) === '/nuevoperfilmedicos' ) {
      cargarListaEspCol( $( '#usuarioPerfil' ).val() );
    }

    /* validaciones al registro */
    validateForm( 'input-nombre', 'nombreMed' );
    validateForm( 'input-apellido', 'ApellidoReg' );
    validateForm( 'input-nombre', 'nombreReg' );
    //validateForm('input-nombre','ApellidoReg');
    validateForm( 'input-correo', 'correoReg' );
    validateForm( 'input-password', 'contraseñaReg' );
    validateForm( 'input-validPass', 'contraseña2Reg' );
    validateForm( 'input-dia', 'diaNacReg' );
    validateForm( 'input-mes', 'mesNacReg' );
    validateForm( 'input-año', 'añoNacReg' );
    validateForm( 'input-select', 'padecimiento' );
    validateForm( 'input-select', 'especialidad' );
    validateForm( 'input-select', 'slc_estado' );
    validateForm( 'input-select', 'slc_ciudad' );
    validateForm( 'input-checkbox', 'sexF' );
    validateForm( 'input-checkbox', 'sexM' );

  } );
}

function saveStepOne() {
  var nombreRegMed = $('#nombreRegMed').val();
  var apePatRegMed= $('#apePatRegMed').val();
  var apeMatRegMed = $('#apeMatRegMed').val();
  var gender = $('input[name=gender]').val();
  var curpRegMed = $('#curpRegMed').val();
  var cedulaRegMed = $('#cedulaRegMed').val();
  if (nombreRegMed != "" && apePatRegMed != "" && gender != "" && curpRegMed != "" && cedulaRegMed != ""){
    $.ajax( {
      url: '/regMedPasoUno',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: $( '#regMedStepOne' ).serialize(),
      success: function ( data ) {
        if ( data.success) {
          actualizarSesion();
          bootbox.hideAll();
          registroMedicoDatosPago();
        } else {
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: (registro 166) : ' + err );
      }
    } );
  } else {
    var error = ''
    if (nombreRegMed == ""){
      error = "su nombre";
    } else if (apePatRegMed == ""){
      error = "su apellido paterno";
    } else if (gender == ""){
      error = "su género";
    } else if (curpRegMed == ""){
      error = "su CURP";
    } else {
      error = "su cédula";
    }
    bootbox.alert({
      message: "Es necesario indicar " + error + " para el registro.",
      title: "No se puede guardar la información."
    });
  }
}

function saveStepTwo() {
  $.ajax( {
    url: '/regMedPasoDos',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if ( data.result === "success" ) {
        actualizarSesion();
        bootbox.hideAll();
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  } );
}

function actualizarSesion() {
  $.ajax( {
    url: '/actualizarSesion',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if ( data.result === "success" ) {
        var fotoPerfil = '';
        if ( data.session.registroCompleto === 1 ) {
          $( '#registroIncompleto' ).css( 'display', 'none' );
        }

        $('#inicio').val(data.session.inicio);

        if ( data.session.fotoPerfil ) fotoPerfil = data.session.fotoPerfil;
        $( '#fotoPerfilMini' ).attr( "src", fotoPerfil );
        $( '#fotoPerfil' ).attr( "src", fotoPerfil );
        if ( data.session.tipoUsuario === "M" ) {
          if ( !data.session.name ) $( '#session_nombreUsuario' ).html( 'No tenemos registrado tu nombre, por favor continua con tu registro <a onclick="informacionRegistroMedico()">aquí</a>' );
          else {
            if ( data.session.tipoUsuario == "M" ) $( '#session_nombreUsuario' ).html( 'Dr. ' + data.session.name )
            else $( '#session_nombreUsuario' ).html( data.session.name );
          }
        }
        else {
          $( '#session_nombreUsuario' ).html( data.session.name );
        }

        if ( data.session.ciudad ) {
          $( '#session_ubicacion' ).html( data.session.ciudad + ', ' + data.session.estado );
        }
      }
      else {
        window.location = "/"
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
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

function existeCorreo( correo ) {
  if ( !correo ) {
    var correo = document.getElementById( 'correoReg' ).value;
  }
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
      success: function ( data ) {
        //console.log( 'DATA ' + data.result );
        return data.result;
      },
      error: function ( jqXHR, textStatus, err ) {
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

	$.ajax({
		url: '/agregaCita',
		type: 'POST',
		dataType: "json",
		data: $('#frmRegCita').serialize(),
		cache: false,
		type: 'POST',
		success: function( data ) {
			if ( data.error == null ) {
	         alert("Se ha guardado su cita !");
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

function obtenerCP() {
  document.getElementById( 'nmb_cp' ).value = '';
  $.ajax( {
    url: '/buscarCP',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'localidad_id': document.getElementById( 'slc_colonias' ).value
    },
    success: function ( data ) {
      document.getElementById( 'nmb_cp' ).value = data.CP;
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function cargaEstadoCiudad() {
  $.ajax( {
    url: "/obtenerEstadoCiudad",
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    success: function ( data ) {

    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 146) : ' + err );
    }
  } );
}
//variable general para sacar el id y usarlo en otras funciones
var general;
var poco;

function cargarInfoSesion() {
  $.ajax( {
    url: '/obtenerInformacionUsuario',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $( "#buttonBiometrico" ).html( '' );
      $( "#ladaTelefono" ).html( '' );
      $( "#ladaTelefono" ).html( '' );
      //DATOS GENERALES
      if ( data.DatosGenerale ) {
        $( "#idNombre" ).html( '<input type = "hidden" id = "idDatosGenerales" value = "' + data.DatosGenerale.id + '"/>' );
        $( "#inputNombre" ).html( '<input type = "text" class = "form-control" id = "inName" name = "inName" value ="' + data.DatosGenerale.nombre + '" placeholder = "Nombre"/>' );
        $( "#buttonName" ).html( '<button ocultoId = "' + data.DatosGenerale.id + '" determina = "n" otroCampo = "nombreD" inputId="inName" type = "button" id = "modificaName" class = "form-control btn btn-success"><span class="glyphicon glyphicon-pencil"></span></button>' );
        $( "#inputApellidoP" ).html( '<input type = "text" class = "form-control" id = "inApellidoP" name = "inApellidoP" value = "' + data.DatosGenerale.apellidoP + '" placeholder="Apellido paterno"/>' );
        $( "#buttonApellidoP" ).html( '<button ocultoId = "' + data.DatosGenerale.id + '" determina = "aP" otroCampo = "apellidoP" inputId="inApellidoP" type = "button" class = "form-control btn btn-success" id = "modificarApellidoP"><span class="glyphicon glyphicon-pencil"></span></button>' );
        $( "#inputApellidoM" ).html( '<input type = "text" class = "form-control" id = "inApellidoM" name = "inApellidoM" value ="' + data.DatosGenerale.apellidoM + '" placeholder = "Apellido materno"/>' );
        $( "#buttonApellidoM" ).html( '<button ocultoId = "' + data.DatosGenerale.id + '" determina = "aM" otroCampo = "apellidoM" inputId="inApellidoM" type = "button" class = "form-control btn btn-success" id = "modificarApellidoM" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>' );
      } //FIN DATOS GENERALES
      //BIOMETRICOS
      if ( data.Biometrico ) {
        $( "#idBiometrico" ).html( '<input type = "hidden" id = "idBiometrico" value = "' + data.Biometrico.id + '" />' );
        $( "#inputBiometricoPeso" ).html( '<input selectivo = "peso" type = "text" class = "form-control" id = "biometricoPeso" name = "biometricoPeso" value = "' + data.Biometrico.peso + '" placeholder = "Peso"/>' );
        $( "#modificaBP" ).html( '<button ocultoId = "' + data.Biometrico.id + '" class = "form-control btn btn-success" otroCampo = "biometric" inputType = "biometricoPeso" name = "modificaPB" type = "button" id = "modificaPB"><span class="glyphicon glyphicon-pencil"></span></button>' )
        $( "#inputBiometricoAltura" ).html( '<input selectivo = "altura" type = "text" class = "form-control" id = "biometricoAltura" name = "biometricoAltura" value = "' + data.Biometrico.altura + '" placeholder = "Altura"/>' );
        $( "#modificaBA" ).html( '<buttton ocultoId = "' + data.Biometrico.id + '" otroCampo = "biometric" inputType = "biometricoAltura" type = "button" class = "form-control btn btn-success" id = "modificarAl"><span class="glyphicon glyphicon-pencil"></span></button>' );
        $( "#inputBiometricoSangre" ).html( '<input selectivo = "sangre" type = "text" class = "form-control" id = "biometricoSangre" name = "biometricoSangre" value = "' + data.Biometrico.tipoSangre + '" placeholder = "Tipo Sangre"/>' );
        $( "#modificaBS" ).html( '<buttton ocultoId = "' + data.Biometrico.id + '" otroCampo = "biometric" inputTyepe = "biometricoSangre" type = "button" name ="modificaSB" id = "modificaSB" class = "form-control btn btn-success"><span class="glyphicon glyphicon-pencil"></span></button>' )
        $( "#inputBiometricoGenero" ).html( '<input selectivo = "genero" type = "text" class = "form-control" id = "biometricoGenero" name = "biometricoGenero" value ="' + data.Biometrico.genero + '" placeholder = "Genero"/>' );
        $( "#buttonBiometrico" ).html( '<button ocultoId = "' + data.Biometrico.id + '" otroCampo = "biometric" inputId="biometricoGenero" type = "button" class = "form-control btn btn-success" id = "modificarBiometrico"><span class="glyphicon glyphicon-pencil"></span></button>' );
      } // FIN BIOMETRICOS
      // MUNICIPIOS Y TELEFONOS
      $( "#ladaTelefono" ).html( '' );
      $( "#numeroTelefono" ).html( '' );
      $( "#buttonLada" ).html( '' );
      $( "#buttonTel" ).html( '' );
      $( "#contactoNombre" ).html( '' );
      $( "#contactoTel" ).html( '' );
      $( "#buttonContacto" ).html( '' );
      $( "#buttonAddLada" ).html( '<button ocultoId = "" otroCampo = "addLada" inputId="" type = "button" class = "form-control btn btn-primary" id = "agregaLada"><span class="glyphicon glyphicon-plus"></span></button>' );
      $( "#addladaTelefono" ).html( '<input type = "text" class = "form-control" id = "agregaAddLada" name = "agregaAddLada" placeholder = "LADA:"/>' );
      $( "#addnumeroTelefono" ).html( '<input type = "text" class ="form-control" id = "addFon" name = "addFon" placeholder="Telefono:"/>' );
      $( "#nombreDContacto" ).html( '<input type = "text" id = "agregaNContacto" name = "agregaNContacto" class = "form-control"placeholder = "Nombre:"/>' );
      $( "#numeroDContacto" ).html( '<input type = "text" id = "agregaNtel" name = "agregaNtel" class = "form-control" placeholder = "Telefono:"/>' );
      $( "#buttonContacto" ).html( '<button otroCampo = "addDatos" inputId="" type = "button" class = "form-control btn, btn-primary" id = "agregaDatosContacto" name = "agregaDatosContacto"><span class="glyphicon glyphicon-pencil"></span></button>' );
      if ( data.Direccions.Localidad ) {
        $( "#buttonMunicipio" ).html( '<button otroCampo = "municip" type = "button" class = "form-control btn btn-success" id = "moficaMunicipio" ><span class="glyphicon glyphicon-pencil"></span></button>' );
        $( "#idMunicipio" ).html( '<input type = "hidden" id = "idMunicipio" value = "' + data.Direccions[ 0 ].Localidad.municipio_id + '" />' );
        $( "#inputMunicipio" ).html( '<input type = "text" class ="form-control" id = "agregaMunicipio" name = "agregaMunicipio" placeholder = "Municipio"/>' );
        $( "idCp" ).html( '<input type = "hidden" id = "idLocalidad" value = "' + data.Direccions[ 0 ].Localidad.id + '" />' );
        $( "#direccionCp" ).html( '<input type = "text" class ="form-control" id = "direccionCP" name = "direccionCP" value ="' + data.Direccions[ 0 ].Localidad.CP + '" placeholder="CP"/>' );
        $( "#buttonCP" ).html( '<button ocultoId = "' + data.Direccions[ 0 ].Localidad.id + '" otroCampo = "cpB" inputId="" type = "button" class ="form-control btn btn-success" id = "CpButton" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>' );
      }
      if ( data.Telefonos ) {
        for ( var i in data.Telefonos ) {
          $( "#idLada" ).append( '<input type = "hidden" id = "idTelefonos' + i + '" value = "' + data.Telefonos[ i ].id + '" />' );
          $( "#ladaTelefono" ).append( '<input us = "' + data.Telefonos[ i ].usuario_id + '" maxlength = "5" type = "text" class = "form-control" id = "dLada' + i + '" name = "dLada' + i + '" value = "' + data.Telefonos[ i ].lada + '" placeholder = "LADA"/>' );
          $( "#buttonLada" ).append( '<button inputUs = "dLada' + i + '" ocultoId = "' + data.Telefonos[ i ].id + '" otroCampo = "lad" inputId = "dLada' + i + '" valor = "type = "button" class = "form-control btn btn-success" id = "modificarLada' + i + '" onclick = ""><span class="glyphicon glyphicon-pencil"></span></button>' );
          $( "#numeroTelefono" ).append( '<input us = "' + data.Telefonos[ i ].usuario_id + '" type = "text" class = "form-control" id = "numTel' + i + '" name = "numTel' + i + '" value = "' + data.Telefonos[ i ].numero + '" placeholder = "Numero telefonico"/>' );
          $( "#buttonTel" ).append( '<button inputUs = "numTel' + i + '" ocultoId = "' + data.Telefonos[ i ].id + '" otroCampo = "ttel" inputId = "numTel' + i + '" type = "button" class = "form-control btn btn-success" id = "modificarTel' + i + '"><span class="glyphicon glyphicon-pencil"></span></button>' );
        }
      }
      // FIN MUNICIPIOS Y TELEFONOS
      // CONTACTOif(data.Paciente)
      if ( data.Paciente ) {
        $( "#buttonContactoNombre" ).html( '' );
        for ( var i in data.Paciente.ContactoEmergencia ) {
          $( "#idContacto" ).append( '<input type = "hidden" id = "idContacto" value = "' + data.Paciente.ContactoEmergencia[ i ].id + '" />' );
          $( "#contactoNombre" ).append( '<input type = "text" class = "form-control" id = "contactoNombre' + i + '" value ="' + data.Paciente.ContactoEmergencia[ i ].nombre + '" name = "contactoNombre' + i + '" placeholder="Nombre del contacto:" />' );
          $( "#buttonContactoNombre" ).append( '<button ocultoId = "' + data.Paciente.ContactoEmergencia[ i ].id + '" otroCampo = "contChangeNombre" inputId = "contactoNombre' + i + '"  type = "button" class = "form-control btn btn-success" id = "modificaContactoNombre' + i + '"><span class = "glyphicon glyphicon-pencil"></span></button>' );
          $( "#contactoTel" ).append( '<input type = "text" class = "form-control" id = "contactoTel' + i + '" value = "' + data.Paciente.ContactoEmergencia[ i ].tel + '" name = "contactoTel' + i + '" placeholder="Telefono del contacto:"/>' );
          $( "#buttonContacto" ).append( '<button ocultoId = "' + data.Paciente.ContactoEmergencia[ i ].id + '" otroCampo = "contChange" inputId="contactoTel' + i + '" type = "button" class = "form-control btn btn-success" id = "modificarContacto' + i + '"><span class="glyphicon glyphicon-pencil"></span></button> ' );
        }
        // FIN CONTACTO
        $( "#inputPadecimiento" ).html( '' );
        $( "#buttonPadecimiento" ).html( '' );
        //PACIENTE
        for ( var i in data.Paciente.PacientePadecimientos ) {
          $( "#idPadecimiento" ).append( '<input type = "hidden" id = "idPadecimiento' + i + '" value = "' + data.Paciente.PacientePadecimientos[ i ].Padecimiento.id + '" />' );
          $( "#inputPadecimiento" ).append( '<input type = "text" class = "form-control" id = "padecimiento' + i + '" name = "padecimiento"' + i + ' value = "' + data.Paciente.PacientePadecimientos[ i ].Padecimiento.padecimiento + '" placeholder="Padecimiento" disabled/><br/>' );
          $( "#buttonPadecimiento" ).append( '<button de ="' + data.Paciente.PacientePadecimientos[ i ].id + '" acc = "elimina" ocultoId = "' + data.Paciente.PacientePadecimientos[ i ].Padecimiento.id + '" otroCampo = "deletePade" inputId="padecimiento' + i + '" type = "button" class = "form-control btn btn-danger id = "eliminaPadecimiento' + i + '"><span class="glyphicon glyphicon-remove"></span></button>' );
        }
        $( "#buttonAddPadecimiento" ).html( '<button otroCampo = "addPad" inputId="" type = "button" class = "btn btn-primary" id = "addPadecimiento" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>' );
        //FIN PACIENTE
        $( "#inputAlergia" ).html( '' );
        $( "#eliminarAlergia" ).html( '' );
        // ALERGIA
        for ( var i in data.Paciente.PacienteAlergia ) {
          $( "#idAlergia" ).append( '<input type = "hidden" id = "idAlergia" value = "' + data.Paciente.PacienteAlergia[ i ].Alergia.id + '" />' );
          $( "#inputAlergia" ).append( '<input type = "text" class = "form-control" id = "alergia' + i + '" name = "alergia"' + i + ' value ="' + data.Paciente.PacienteAlergia[ i ].Alergia.alergia + '" placeholder="alergia" disabled/> ' );
          $( "#eliminarAlergia" ).append( '<button de ="' + data.Paciente.PacienteAlergia[ i ].id + '" acc = "elimina" ocultoId = "' + data.Paciente.PacienteAlergia[ i ].Alergia.id + '" otroCampo = "deleteAle" inputId= "alergia' + i + '" type = "button" class = "form-control btn btn-danger" id = "eliminarAlergia' + i + '"><span class="glyphicon glyphicon-remove"></span></button> ' );
        }
        $( "#addAlergia" ).html( '<button otroCampo = "addAle" inputId="" type = "button" class = "btn btn-primary" id = "addAlergia" onclick = ""><span class="glyphicon glyphicon-plus"></span></button>' );
      } //FIN ALERGIA
      var otroCampo = "";
      var segundoSwitch = "";
      var idBoton = $( "button" ).click( function () {
        if ( $( this ).attr( 'inputId' ) != "" ) {
          idBoton = "#" + $( this ).attr( 'inputId' );
        }
      } );
      general = idBoton;
      $( "#modificaBP" ).click( function () {
        da = String( $( "#modificaPB" ).attr( 'ocultoId' ) );
        despachador( 'Biometrico', 'actualizar', 'peso', '', '#biometricoPeso', '', '', true, da, '' );
      } );
      $( "#modificaBA" ).click( function () {
        da = String( $( "#modificarAl" ).attr( 'ocultoId' ) );
        despachador( 'Biometrico', 'actualizar', 'altura', '', '#biometricoAltura', '', '', true, da, '' );
      } );
      $( "#modificaBS" ).click( function () {
        da = String( $( "#modificaSB" ).attr( 'ocultoId' ) );
        despachador( 'Biometrico', 'actualizar', 'tipoSangre', '', '#biometricoSangre', '', '', '', da, '' );
      } );
      $( "#buttonBiometrico" ).click( function () {
        da = String( $( "#modificarBiometrico" ).attr( 'ocultoId' ) );
        despachador( 'Biometrico', 'actualizar', 'genero', '', '#biometricoGenero', '', '', '', da, '' );
      } );
      var cambioAlergia;
      $( "#menuAlergia" ).change( function () {
        if ( $( this ).val() != "0" ) {
          cambioAlergia = $( this ).val();
        }
        else {
          cambioAlergia = "0";
          alert( 'Seleccione una opcion' );
        }
      } );
      var cambioPadecimiento;
      $( "#menuPadecimiento" ).change( function () {
        if ( $( this ).val() != "0" ) {
          cambioPadecimiento = $( this ).val();
        }
        else {
          cambioPadecimiento = "0";
          alert( "Seleccione una opcion" );
        }
      } );
      $( idBoton ).click( function () {
        otroCampo = $( this ).attr( 'otroCampo' );
        segundoSwitch = String( $( this ).attr( 'ocultoId' ) );
        var algo;
        if ( $( this ).attr( 'de' ) != "" ) {
          algo = $( this ).attr( 'de' );
        }
        poco = $( this ).attr( 'id' );
        if ( $( this ) != "" ) {
          switch ( otroCampo ) {
            case 'nombreD':
              despachador( 'DatosGenerales', 'actualizar', 'nombre', '', '#inName', '', '', '', segundoSwitch, '' );
              break;
            case 'apellidoP':
              despachador( 'DatosGenerales', 'actualizar', 'apellidoP', '', '#inApellidoP', '', '', '', segundoSwitch, '' );
              break;
            case 'apellidoM':
              despachador( 'DatosGenerales', 'actualizar', 'apellidoM', '', '#inApellidoM', '', '', '', segundoSwitch, '' );
              break;
            case 'municip':
              break;
            case 'addLada':
              if ( $( "#agregaAddLada" ).val() != "" && $( "#addFon" ).val() != "" ) {
                var inser = {};
                inser = {
                  tipo: 'P',
                  numero: $( "#addFon" ).val(),
                  claveRegion: parseInt( 101 ),
                  lada: parseInt( $( "#agregaAddLada" ).val() ),
                  usuario_id: 1
                };
                despachador( 'Telefono', 'insertar', '', '', '', '', '', '', inser );
              }
              else {
                alert( "Debes de llenar los dos campos" );
              }
              break;
            case 'cpB':
              break;
            case 'lad':
              despachador( 'Telefono', 'actualizar', 'lada', '', idBoton, '', '', '', segundoSwitch, '' );
              break;
            case 'ttel':
              despachador( 'Telefono', 'actualizar', 'numero', '', idBoton, '', '', '', segundoSwitch, '' );
              break;
            case 'addDatos':
              var contactoarray = {};
              if ( $( "#agregaNContacto" ).val() != "" && $( "#agregaNtel" ).val() != "" ) {
                contactoarray = {
                  nombre: $( "#agregaNContacto" ).val(),
                  tel: $( "#agregaNtel" ).val(),
                  medico: 0,
                  usuario_id: 1,
                  paciente_id: 1
                };
                despachador( 'ContactoEmergencia', 'insertar', '', '', '', '', '', '', contactoarray );
              }
              else {
                alert( "Debes de llenar los dos campos" );
              }
              break;
            case 'contChangeNombre':
              despachador( 'ContactoEmergencia', 'actualizar', 'nombre', '', idBoton, '', '', '', segundoSwitch, '' );
              break;
            case 'contChange':
              despachador( 'ContactoEmergencia', 'actualizar', 'tel', '', idBoton, '', '', '', segundoSwitch, '' );
              break;
            case 'deletePade':
              despachador( 'PacientePadecimiento', 'delete', 'padecimiento_id', '', idBoton, algo, '', '', segundoSwitch, '' );
              break;
            case 'addPad':
              var padarray = {};
              //console.log( "Cambio pade" + cambioPadecimiento );
              if ( cambioPadecimiento != "0" ) {
                padarray = {
                  paciente_id: 1,
                  padecimiento_id: cambioPadecimiento
                };
                despachador( 'PacientePadecimiento', 'insertar', '', '', '', '', '', '', padarray );
              }
              else {
                alert( "Seleccione una opcion" );
              }
              break;
            case 'deleteAle':
              despachador( 'PacienteAlergia', 'delete', 'alergia_id', '', idBoton, algo, '', '', segundoSwitch, '' );
              break;
            case 'addAle':
              var alearray = {};
              //console.log( "Cambio alergia" + cambioAlergia );
              if ( cambioAlergia != "0" ) {
                alearray = {
                  paciente_id: 1,
                  alergia_id: cambioAlergia
                };
                despachador( 'PacienteAlergia', 'insertar', '', '', '', '', '', '', alearray );
              }
              else {
                alert( "Seleccione una opcion" );
              }
              break;
          } //fin switch
        } //fin if
      } );
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  } );
}
//<- inserciones con AJAX de diferentes envios a la db desde un click de un btn
$(document).ready(function(){
  $( "#agregaDatosContacto" ).click(function(){
    var nombre = $( "#agregaNContacto" ).val();
    var telefonoContacto = $( "#agregaNtel" ).val();
    if( nombre != "" && telefonoContacto != "" ){
      $.post('/contactoEmergengia',{nombre:nombre,tel:telefonoContacto},function(){});
    }else{
      alert("Favor de llenar ambos campos.");
    }
  });
  $( "#ingresaPeso" ).click(function(){
    var peso = $( "#inputIngresaPe" ).val();
    var altura = $( "#ingresaAlt" ).val();
    var tipoS = $( "#ingresaSa" ).val();
    var genero = $( "#ingresaGene" ).val();
    if( peso != "" && altura != "" && tipoS != "" && genero != "" ){
      $.post('/biometricFull',{
        peso:peso,
        altura:altura,
        tipoS:tipoS,
        genero:genero
      },function(){});
    }else{
      alert("Debe de llenar todo los campos de biometricos");
    }
  });
  $( "#agregaLada" ).click(function(){
    if( $( "#agregaAddLada" ).val() == "" && $( "#addFon" ).val() == "" ){
      alert("Debe de llenar los dos campos antes de presionar el boton");
    }else{
      var numero = $( "#addFon" ).val();
      var lada = $( "#agregaAddLada" ).val();
      $.post("/insertarLT",{numero:numero,lada:lada},function(e){
        if(e != 'ok' ){
          alert("Datos guardados correctamente");
        }else{
          alert("lada y telefono repetido revise de nuevo por favor");
        }
      });
    }
  });
});
//<- fin inserciones con ajax ->
//<-- autocompletar -->
  //cuando den click en el boton de agregar padecimiento debe de checar si existe y mostrar
  // la opcion si es nuevo insertarlo
  $(document).ready(function(){
    if( $('#recomendar').attr('valor') === "verdadero" ){
      $( '#ingresaPadecimiento' ).autocomplete({
        minLength:0,
        source:function( request, response ){
          $.post('/autocompletar',{valor: request.term},function(pos){
            var total = [];
            $.each(pos,function(index, valor){
              total.push({
                'name': valor.padecimiento,
                'value': valor.id,
                'label': valor.padecimiento
              });
            });
             response(total);
          });
        },
        focus:function(event, ui){
          $("#ingresaPadecimiento").val(ui.item.label);
          return false;
        },
        select:function(event, ui){
          $( '#project-id' ).val(ui.item.value);
          $("#ingresaPadecimiento").html('');
          return false;
        }
      }).autocomplete('instance')._renderItem = function( ul, item){
        return $( '<li>' ).append('<p>'+item.label+'</p>').appendTo(ul);
      };
      $("#ingresaAlergia").autocomplete({
        minLength:0,
        source:function( request, response ){
          $.post('/autocompletarA',{valor: request.term},function(pos){
            var total = [];
            $.each(pos,function(index, valor){
              total.push({
                'name': valor.alergia,
                'value': valor.id,
                'label': valor.alergia
              });
            });
             response(total);
          });
        },
        focus:function(event, ui){
          $("#ingresaAlergia").val(ui.item.label);
          return false;
        },
        select:function(event, ui){
          $( '#id-project' ).val(ui.item.value);
          return false;
        }
      }).autocomplete('instance')._renderItem = function( ul, item){
        return $( '<li>' ).append('<p>'+item.label+'</p>').appendTo(ul);
      };
      $( '#addPadecimiento' ).click(function(){
        var id_campo = $( '#project-id' ).val();
        var valorCampo = $( '#ingresaPadecimiento' ).val();
        if(valorCampo != "" ){
          $.post('/insertarPad',{valor:id_campo,valorCampo:valorCampo},function(e){
            //console.log(e);
            if( e != 'ok' ){
              alert("Padecimiento repetido inserte uno nuevo");
            }else{
              alert("Padecimiento guardado");
            }
          });
        }
      });
      $( "#addAlergia" ).click(function(){
        var id_campo = $( "#id-project" ).val();
        var valorCampo = $( "#ingresaAlergia" ).val();
        if( valorCampo != "" ){
          $.post('/insertAler',{id_campo:id_campo,valorCampo:valorCampo},function(e){
            if( e == "ok" ){
              alert("Alergia guardada");
            }else{
              alert("Ud. Ya ha ingresado esta alergia ingrese una nueva por favor");
            }
          });
        }
      });
    }
  });
//<-- fin autocompletar -->
//<-------------- OSCAR --------------------------->
/**
 * En la siguiente function con ella se podrá actualizar los campos que se hayan mandado por parametro
 * @param nameInput id del input
 * @param idOculto id del input hidden
 * @param campoAmodificar esta variable es para decirle a la funcion que campo es el que debe de modificar o insertar
 *
 *
 **/
function despachador( nameTa, acction, campoAmodificar, campoAmoficar2, nameInput, nameinput2, idOculto, exodo, prueba, objectoInsert ) {
  var envioVariable;
  if ( exodo == true ) {
    envioVariable = $( nameInput ).val();
  }
  else {
    envioVariable = String( $( nameInput ).val() );
  }
  var envioVariable2 = nameinput2;
  var envioIdVariable = String( $( idOculto ).val() );
  $.ajax( {
    url: "/despachador",
    type: "POST",
    dataType: "JSON",
    data: {
      tabla: nameTa,
      accion: acction,
      campo: campoAmodificar,
      campo2: campoAmoficar2,
      valor: envioVariable,
      valor2: envioVariable2,
      id: envioIdVariable,
      prueba: prueba,
      numero: exodo,
      objecto: objectoInsert
    },
    success: function ( data ) {
      //console.log( "EXITOSO" );
      if ( data == true ) {
        console.log( "AGREGAR EFECTOS PARA QUE SE QUITE" );
      }
      else {
        alert( "No se pudo eliminar" );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.log( "AJAX ERROR: (no se pudo ejecutar la accion: '" + acction + "') : " + err );
    },
    complete: function ( xhr, status ) {
      console.log( "Petición realizada" );
    }
  } );
}
//<-------------- OSCAR ---------------------------------->s
// función que actualiza médico.
function actDoctor() {
  $.ajax( {
    url: '/actualizaMedico',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: $( '#frmActMed' ).serialize(),
    type: 'POST',
    success: function ( data ) {
      // al guardar cambios oculta la forma
      $( "#UpdateModal" ).modal( "hide" );
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  } );
}


// función que actualiza médico interno
function actualizarDoctor() {
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
  $( "#UpdateModal .modal-body" ).load( "edicionMedico/" + id, function () {
    $( "#UpdateModal" ).modal( "show" );
  } );
}

// script que muestra u oculta campos de la busqueda del home
if ( location.pathname === '/' ) {
  $( document ).ready( function () {
    $( "#sel-busqueda" ).change( function () {
      $( this ).find( "option:selected" ).each( function () {
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

/* script para los intervalos del carousel
$( document ).ready( function () {
  $( '.carousel' ).carousel( {
    interval: 5000
  } );
  $(function () {
    $('#direcciones-carousel').carousel();
  });
} );
*/

// script para obtener el DateStamp
$( document ).ready( function () {
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
  $( "#regi" ).click( function () {
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
var mensaje;
function validateForm( tipoForm, nameForm ){
  //se carga el id del formualio a validar
  $( "#" + nameForm ).change( function () {
    switch ( tipoForm ) {
      case "input-nombre":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "nombre-error";
        break;
      case "input-apellido":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "apellido-error";
        break;
      case "input-correo":
        var correo = String( $( "#" + nameForm ).val() );
        var expreg = new RegExp( /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm );
        comprobando = expreg.test( correo ) ? true : false;
        mensaje = "mail-error";
        break;
      case "input-password":
        password = $( "#" + nameForm ).val();
        dato = String( password );
        for ( var i in dato ) {
          //console.log( "STRING:" + dato );
          var t = dato.length;
          if ( dato.length < 8 && ( dato[ 0 ] != " " || dato[ t ] || " " && dato[ i ] != " " ) ) {
            comprobando = false;
          }
          else {
            var expreg = new RegExp( /^([^\s])+[(\w\d)+][^\s]{4,64}([^\s?])$/gm );
            comprobando = expreg.test( password ) ? true : false;
            mensaje = "pass-error";
          }
        }
        break;
      case "input-validPass":
        var atrapada = String( $( "#" + nameForm ).val() );
        var tam = dato.length;
        var expreg = new RegExp( /^[^\s]+[(\w\W\d.)+][^\s]{4,64}[^\s]$/gm );
        comprobar = expreg.test( atrapada ) ? true : false;
        comprobando = ( ( tam === atrapada.length ) && ( dato === atrapada ) && ( comprobar === true ) ) ? true : false;
        mensaje = "conf-error";
        break;
      case "input-dia":
        var dia = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^\d{1,2}/ );
        comprobando = expreg.test( dia ) ? true : false;
        mensaje = "dia-error";
        break;
      case "input-mes":
        var mes = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^\d{1,2}/ );
        comprobando = expreg.test( mes ) ? true : false;
        mensaje = "mes-error";
        break;
      case "input-año":
        var año = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^\d{4}/ );
        comprobando = expreg.test( año ) ? true : false;
        mensaje = "año-error";
        break;
      case "input-checkbox":
        comprobando = ( $( this ).attr( 'checked' ) ) ? true : false;
        break;
      case "input-select":
        comprobando = ( $( this ).val() > 0 ) ? true : false;
        break;
    }
    //carga del ajax
    $.ajax( {
      asyn: true,
      data: {},
      success: function ( data ) {
        if ( comprobando ) {
          switch ( mensaje ) {
            case "nombre-error":
              $( "#aviso-error" ).remove();
              $( "#nameGroup" ).removeClass( 'has-error has-feedback' );
              $( '#nameIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#nameGroup" ).addClass( 'has-success has-feedback' );
              $( '#nameIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "apellido-error":
              $( "#aviso-error" ).remove();
              $( "#apellidoGroup" ).removeClass( 'has-error has-feedback' );
              $( '#apellidoIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#apellidoGroup" ).addClass( 'has-success has-feedback' );
              $( '#apellidoIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "mail-error":
              $( "#aviso-error" ).remove();
              $( "#emailGroup" ).removeClass( 'has-error has-feedback' );
              $( '#emailIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#emailGroup" ).addClass( 'has-success has-feedback' );
              $( '#emailIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "pass-error":
              $( "#aviso-error" ).remove();
              $( "#passwordGroup" ).removeClass( 'has-error has-feedback' );
              $( '#passwordIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#passwordGroup" ).addClass( 'has-success has-feedback' );
              $( '#passwordIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "conf-error":
              $( "#aviso-error" ).remove();
              $( "#confirmGroup" ).removeClass( 'has-error has-feedback' );
              $( '#confirmIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#confirmGroup" ).addClass( 'has-success has-feedback' );
              $( '#confirmIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "dia-error":
              $( "#aviso-error" ).remove();
              $( "#diaGroup" ).removeClass( 'has-error has-feedback' );
              $( '#diaIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#diaGroup" ).addClass( 'has-success has-feedback' );
              $( '#diaIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "mes-error":
              $( "#aviso-error" ).remove();
              $( "#mesGroup" ).removeClass( 'has-error has-feedback' );
              $( '#mesIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#mesGroup" ).addClass( 'has-success has-feedback' );
              $( '#mesIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "año-error":
              $( "#aviso-error" ).remove();
              $( "#añoGroup" ).removeClass( 'has-error has-feedback' );
              $( '#añoIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#añoGroup" ).addClass( 'has-success has-feedback' );
              $( '#añoIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
          } //fin switch
        }
        else {
          switch ( mensaje ) {
            case "nombre-error":
              $( "#nameGroup" ).addClass( 'has-error has-feedback' );
              $( '#nameIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#nombre-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "apellido-error":
              $( "#apellidoGroup" ).addClass( 'has-error has-feedback' );
              $( '#apellidoIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#apellido-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "mail-error":
              $( "#emailGroup" ).addClass( 'has-error has-feedback' );
              $( '#emailIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#email-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, no debe de llevar espacios o numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "pass-error":
              $( "#passwordGroup" ).addClass( 'has-error has-feedback' );
              $( '#passwordIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#pass-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, no debe de llevar espacios</b></small></div>' );
              break;
            case "conf-error":
              $( "#confirmGroup" ).addClass( 'has-error has-feedback' );
              $( '#confirmIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#conf-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, no debe de llevar espacios o no coincide con la contraseña</b></small></div>' );
              break;
            case "dia-error":
              $( "#diaGroup" ).addClass( 'has-error has-feedback' );
              $( '#diaIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#dia-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, solo debe de contener numeros</b></small></div>' );
              break;
            case "mes-error":
              $( "#mesGroup" ).addClass( 'has-error has-feedback' );
              $( '#mesIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#mes-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, solo debe de contener numeros</b></small></div>' );
              break;
            case "año-error":
              $( "#añoGroup" ).addClass( 'has-error has-feedback' );
              $( '#añoIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#año-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, solo debe de contener numeros</b></small></div>' );
              break;
          } //fin switch
        }
      },
      error: function () {
        console.log( "ERROR2 nombre" );
      }
    } );
  } );
}
//<---------------------------------------------------->

$( '#CambiarFotoPerfil' ).on( 'hidden.bs.modal', function ( e ) {
  $( '#imageFile' ).val( '' );cambioFotoPerfil();
} )

var base64file;

$( function () {
  $( '#imageFile' ).change( function () {
    base64file = '';
    var tamanio = $( this )[ 0 ].files[ 0 ].size;
    if ( tamanio < 1048576 ) {
      cambioFotoPerfil();
      $( '#btnCrop' ).hide();
      document.getElementById( "contenedorFoto" ).innerHTML = '<img id="fotoPerfilNueva" >';
      var reader = new FileReader();
      var fotoPerfilNueva = $( '#fotoPerfilNueva' );
      reader.onload = function ( e ) {
        fotoPerfilNueva.attr( "src", e.target.result );
        var x = document.getElementById( "fotoPerfilNueva" ).width;
        var y = document.getElementById( "fotoPerfilNueva" ).height;
        if ( x > y ) x = y;
        fotoPerfilNueva.Jcrop( {
          onChange: SetCoordinates,
          onSelect: SetCoordinates,
          boxWidth: 570,
          aspectRatio: 1,
          setSelect: [ x * 0.1, x * 0.1, x - ( x * 0.1 ), x - ( x * 0.1 ) ]
        } );
      }
      reader.readAsDataURL( $( this )[ 0 ].files[ 0 ] );
    }
    else {
      $( '#imageFile' ).val( '' );
      alert( "La imagen es muy grande, selecciona otra" );
    }
  } );
} );

function guardarImagenPerfil() {
  $.ajax( {
    async: false,
    url: '/perfil',
    type: 'POST',
    dataType: "json",
    data: {
      base64file: base64file
    },
    cache: false,
    success: function ( data ) {
      if ( data.result === 'success' ) {
        $( '#CambiarFotoPerfil' ).modal( 'toggle' );
        actualizarSesion();
      }
      else {
        alert( 'No se pudo guardar la imagen' );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function SetCoordinates( c ) {
  var imgX1 = c.x,
    imgY1 = c.y,
    imgWidth = c.w,
    imgHeight = c.h;
  if ( c.w > 0 ) {
    $( '#btnCrop' ).show();
    var canvas = $( "#canvas" )[ 0 ];
    var context = canvas.getContext( '2d' );
    var img = new Image();
    var imgPreview = new Image();
    imgPreview.onload = function () {
      canvas.width = 200;
      canvas.height = 200;
      context.drawImage( imgPreview, 0, 0, 200, 200 );
      base64file = canvas.toDataURL();
    };
    img.onload = function () {
      canvas.height = imgHeight;
      canvas.width = imgWidth;
      context.drawImage( img, imgX1, imgY1, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight );
      imgPreview.src = canvas.toDataURL();
    };
    img.src = $( '#fotoPerfilNueva' ).attr( "src" );
  }
  else {
    $( '#btnCrop' ).hide();
  }
};

function MakeWizard() {
  $( "#RegMedModal" ).formToWizard()
}

// formToWizard
( function ( $ ) {
  $.fn.formToWizard = function () {
    var element = this;

    var steps = $( element ).find( ".step" );
    var count = steps.size();

    $( element ).find( ".modal-header" ).find( ".close" ).remove();
    $( element ).find( ".modal-header" ).append( "<div class='stepsContainer pull-right'><ul id='steps' class='stepsList'></ul></div>" );
    $( element ).find( ".stepsContainer" ).append( "<span class='stepsConnector'></span>" );

    steps.each( function ( i ) {
      if ( i == 0 ) $( "#steps" ).html( "" );
      $( this ).wrap( "<div id='step" + i + "'></div>" );
      $( this ).find( ".EndButtons" ).addClass( "step" + i + "c" );
      $( this ).find( ".EndButtons" ).append( "<p id='step" + i + "c'></p>" );

      var name = $( this ).find( ".modal-footer" ).html();
      $( "#steps" ).append( "<li id='stepDesc" + i + "' class='stepBullets'>" + i + "</li>" );
      if ( i == 0 ) {
        createNextButton( i );
        selectStep( i );
      }
      else if ( i == count - 1 ) {
        $( "#step" + i ).hide();
        createPrevButton( i );
      }
      else {
        $( "#step" + i ).hide();
        createPrevButton( i );
        createNextButton( i );
      }
    } );

    function createPrevButton( i ) {
      var stepName = "step" + i;
      $( "#" + stepName + "c" ).append( "<a href='#' id='" + stepName + "Prev' class='btn btn-default btn-block prev'><span class='glyphicon glyphicon-arrow-left'></span></a>" );
      $( "#" + stepName + "Prev" ).bind( "click", function ( e ) {
        $( "#" + stepName ).hide();
        $( "#step" + ( i - 1 ) ).show();
        selectStep( i - 1 );
      } );
    }

    function createNextButton( i ) {
      var stepName = "step" + i;
      $( "#" + stepName + "c" ).append( "<a href='#' id='" + stepName + "Next' class='btn btn-default btn-block next'><span class='glyphicon glyphicon-arrow-right'></span></a>" );
      $( "#" + stepName + "Next" ).bind( "click", function ( e ) {
        $( "#" + stepName ).hide();
        $( "#step" + ( i + 1 ) ).show();
        selectStep( i + 1 );
      } );
    }

    function selectStep( i ) {
      $( "#steps li" ).removeClass( "current" );
      $( "#stepDesc" + i ).addClass( "current" );
    }

  }
} )( jQuery );

function goToNextStep( i ) {
  $( "#step" + i++ ).hide();
  $( "#step" + i ).show();
  $( "#steps li" ).removeClass( "current" );
  $( "#stepDesc" + i ).addClass( "current" );
}

function goToPrev( i ) {
  $( "#step" + i ).hide();
  $( "#step" + ( i - 1 ) ).show();
  selectStep( i - 1 );
}

$( function () {
  $( '[data-toggle="popover"]' ).popover()
} )

$( document ).ready( function () {
  if ( $( "#tarjetaOptReg" ).is( ":checked" ) ) {
    //$( '#paypalOpt' ).find( ".disabledBox" ).addClass( "dB" );
    $( '#paypalOptBox' ).find( $( "input" ) ).prop( 'disabled', true );
  }
  $( "#tarjetaOptReg" ).change( function () {
    //$( '#tarjOpt' ).find( ".disabledBox" ).removeClass( "dB" );
    $( '#tarjOptBox' ).find( $( "input" ) ).prop( 'disabled', false );

    //$( '#paypalOpt' ).find( ".disabledBox" ).addClass( "dB" );
    $( '#paypalOptBox' ).find( $( "input" ) ).prop( 'disabled', true );
  } );
  $( "#paypalOptReg" ).change( function () {
    //$( '#tarjOpt' ).find( ".disabledBox" ).addClass( "dB" );
    $( '#tarjOptBox' ).find( $( "input" ) ).prop( 'disabled', true );

    //$( '#paypalOpt' ).find( ".disabledBox" ).removeClass( "dB" );
    $( '#paypalOptBox' ).find( $( "input" ) ).prop( 'disabled', false );

  } );
} );

function agregarFavoritos( medico ) {
  var ruta = '/agregarMedFav';
  var medicoID = '',
    pacienteID = '';
  if ( $( '#MedicoId' ).val() ) medicoID = $( '#MedicoId' ).val();
  if ( $( '#PacienteId' ).val() ) pacienteID = $( '#PacienteId' ).val();
  $.ajax( {
    async: false,
    url: ruta,
    type: 'POST',
    dataType: "json",
    data: {
      medicoID: medicoID,
      pacienteID: pacienteID
    },
    cache: false,
    success: function ( data ) {
      console.log('Agregar a favoritos: ' + JSON.stringify(data));
      if ( data.success ) {
        if ( $( '#tipoUsuario' ).val() === "P" ) {
          if ( medicoID ) {
            $( '#addFavoriteContact' ).html('<span class="glyphicon h67-medcond s30">-</span> Elimina de favoritos');
          }
          else {
            $( '#addFavoriteContact' ).html('<span class="glyphicon h67-medcond s30">-</span> Invitación enviada');
          }
        }
        else if ( $( '#tipoUsuario' ).val() === "M" ) {
            if ( medicoID ) {
              $( '#addFavoriteContact' ).html('<span class="glyphicon h67-medcond s30">-</span> Invitación enviada');
            }
        }
        $( "#addFavoriteContact" ).attr( "onclick", "eliminarFavoritos()" );

        cargarFavCol( $( '#usuarioPerfil' ).val() );
      }
      else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function eliminarFavoritos( medico, paciente_id , notificacion_id) {
  //console.log('ENTRO');
  var ruta = '/eliminarMedFav';
  var medicoID = '',
    pacienteID = '';
  if ( $( '#MedicoId' ).val() ) medicoID = $( '#MedicoId' ).val();
  if ( $( '#PacienteId' ).val() ) pacienteID = $( '#PacienteId' ).val();
  if ( !medico && paciente_id ) pacienteID = paciente_id;
  else if ( medico && paciente_id ) medicoID = paciente_id;
  $.ajax( {
    async: false,
    url: ruta,
    type: 'POST',
    dataType: "json",
    data: {
      medicoID: medicoID,
      pacienteID: pacienteID,
      notificacion_id: notificacion_id
    },
    cache: false,
    success: function ( data ) {
      console.log('Eliminar favoritos: ' + JSON.stringify(data));
      if ( data.success ) {
        if ( $( '#tipoUsuario' ).val() === "P" ) {
          if ( medicoID ) {
            $( '#addFavoriteContact' ).html( '<span class="glyphicon h67-medcond s30">+</span> Agrega a favoritos' );
          }
          else {
            $( '#addFavoriteContact' ).html( '<span class="glyphicon h67-medcond s30">+</span> Agrega a contactos' );
          }
        }
        else if ( $( '#tipoUsuario' ).val() === "M" ) $( '#addFavoriteContact' ).html('<span class="glyphicon h67-medcond s30">+</span> Agrega a colegas');
        $( "#addFavoriteContact" ).attr( "onclick", "agregarFavoritos()" );
        cargarFavCol( $( '#usuarioPerfil' ).val() );
        if ( notificacion_id ) {
          $( '#pre' + notificacion_id ).html( 'Rechazaste la solicitud de amistad de ' );
          $( '#post' + notificacion_id ).html( '' );
          if (notificacion_id) $( '#button' + notificacion_id ).remove();
        }
      }
      else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function cargarFavCol( usuario ) {
  $( '#FavColPanel .contList' ).html( '' );
  //$('#FavColPanel>.panel-body').addClass("hidden invisible");
  $( '#ContColPanel .contList' ).html( '' );
  //$('#ContColPanel>.panel-body').addClass("hidden invisible");
  $.ajax( {
    async: false,
    url: '/cargarFavCol',
    type: 'POST',
    data: {
      usuario: usuario
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if ( data ) {
        /*for(var t in data){
          if(data[t].Medico)
            $('#FavColPanel .panel-body').removeClass("hidden invisible");
          else
            $('#ContColPanel .panel-body').removeClass("hidden invisible");
        }*/
        for ( var p in data ) {
          if ( data[ p ].medico_id ) {
            var especialidad = '';
            data[p].Medico.MedicoEspecialidads.forEach(function(esp){
              if (especialidad=="" && esp.subEsp == 0){
                especialidad = esp.Especialidad.especialidad;
              }
            });
            $( "#FavColPanel .contList" ).append(
              "<li class='media contList-profile' id='"+ data[ p ].Medico.Usuario.id +"'>" +
              "<div class='media-left contList-profilePic'>" +
              "<a href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'><img class='media-object contList-profilePicImg' src='" + data[ p ].Medico.Usuario.urlFotoPerfil + "'></a>" +
              "</div>" +
              "<div class='media-body contList-profileBody'> " +
              "<a class='contList-profileName' href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'> Dr. " + data[ p ].Medico.Usuario.DatosGenerale.nombre + " " + data[ p ].Medico.Usuario.DatosGenerale.apellidoP + " " + data[ p ].Medico.Usuario.DatosGenerale.apellidoM + "</a><br>" +
              "<a class='contList-profileEsp' href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'> " + especialidad + "</a>" +
              "</div>" +
              "<div class='media-right contList-profileAction'>" +
              "<a id ='"+data[ p ].Medico.id+"' href ='#' data-target='#recomendar' data-toggle='modal' class='recomendar contList-profileActionLink Flama-bold s15'>Recomendar</a>" +
              "<a id='"+data[ p ].Medico.id+"' href='#' data-target='#pedir' data-toggle='modal' class='Pedir contList-profileActionLink Flama-bold s15'><smal>Pedir Recomendacion</smal></a>"+
              "</div>" +
              "</li>"
            );
          }
          else
            $( '#ContColPanel .contList' ).append(
              "<li class='media contList-profile'>" +
              "<div class='media-left contList-profilePic'>" +
              "<a class='contList-profileName' href='http://" + window.location.host + "/perfil/" + data[ p ].Paciente.Usuario.usuarioUrl + "'><img class='media-object contList-profilePicImg' src='" + data[ p ].Paciente.Usuario.urlFotoPerfil + "'></a>" +
              "</div>" +
              "<div class='media-body contList-profileBody'> " +
              "<a class='contList-profileName' href='http://" + window.location.host + "/perfil/" + data[ p ].Paciente.Usuario.usuarioUrl + "'>" + data[ p ].Paciente.Usuario.DatosGenerale.nombre + " " + data[ p ].Paciente.Usuario.DatosGenerale.apellidoP + " " + data[ p ].Paciente.Usuario.DatosGenerale.apellidoM + "</a>" +
              "</div>" +
              "<div class='media-right contList-profileAction'>" +
              "<a class='contList-profileActionLink Flama-bold s15'>inbox</a>" +
              "</div>" +
              "</li>"
            );
        }
        //alert('Success');
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}
/**
* document ready cuando se cargue el perfil y aparesca los medicos favoritos
* cuando se le de un click al enlace se mostrara un un modal donde podra ver
* todos sus contactos y se les podra enviar la recomendacion en este caso el
* medico al cual le dio click al click de recomendar
*/
var id = "";
var usuarioRL="";
var extraDato ="";
var usuario = "";
var uId ="";
//<----------- RECOMENDACIONES -------------------->
  $(document).ready(function(){
    // inpyt type text
    $( '.recomendar.contList-profileActionLink' ).click(function(){
      //se manda a llamar al bootbox
      recomendacionesBoot();
      id += $( this ).attr('id');
      $("#pacienteIdOculto").text(id);
      var medico_id="";
      var di = "";
      //console.log("ID: "+id);
      $.post('/medicosContacto',{idMedico:id},function(data){
        for( var i in data ){
          medico_id = data[ i ].id;
          di = data[ i ].Usuario.id;
          if( data[ i ].Usuario ){
            usuarioRL += data[ i ].Usuario.usuarioUrl;
            var nombreCompleto = data[ i ].Usuario.DatosGenerale.nombre+' '+data[ i ].Usuario.DatosGenerale.apellidoP+' '+data[ i ].Usuario.DatosGenerale.apellidoM;
            $("#doctorSpan").text(nombreCompleto);
          }
        }
      });
      // con ajax se hace la peticion a la url la cual me mostrara la informacion en una tabla con
      // la lista de mis contactos
      $.post('/contactosRecomendados',function(data){
        $('#recomendar').attr('valor','verdadero');
        //Si nos dejan solitos nos amamos
        var html = "";
        var nombreTodo="";
        $( "#recomendarA tbody" ).html('');
        $( '#enviarRecomendaciones ul').html('');
        $( '#doc' ).html('');
        for( var i in data ){
          nombreTodo = data[ i ].Paciente.Usuario.DatosGenerale.nombre+' '+data[ i ].Paciente.Usuario.DatosGenerale.apellidoP+' '+data[ i ].Paciente.Usuario.DatosGenerale.apellidoM;
          var tr = "tr"+data[ i ].Paciente.id;
          var mas = medico_id;
          var otroMas = data[ i ].Paciente.usuario_id;
          html +='<tr class="" id="'+tr+'" onclick="seleccionarUsuario(\''+i+'\',\''+tr+'\',\''+nombreTodo+'\',\''+mas+'\',\''+otroMas+'\',\''+di+'\')">';
          html +='<td>';
          html +='<img src="'+data[ i ].Paciente.Usuario.urlFotoPerfil+'" alt="" class="img-thumbnail">';
          html +='</td>';
          html +='<td id="paciente'+data[ i ].Paciente.id+'">';
          html +='<p style="color:white">'+nombreTodo+'</p>';
          html +='</td>';
          html +='</tr>';
          extraDato = nombreTodo;
        }
        $.post('/usuarioPrincipal',function(data){
          uId = data.id;
          $("#nombreOcultoPerfil").text(data.Usuario.DatosGenerale.nombre+' '+data.Usuario.DatosGenerale.apellidoP+' '+data.Usuario.DatosGenerale.apellidoM);
        });
        $( "#recomendarA tbody" ).append(html);
      });
    });
  });
  //se carga el bootbox para que funcionen el boton de enviar
  function enviarTodo(){
    if( $( "#correoEnviarRecomendado" ).val() != ""){
      var to = $( "#correoEnviarRecomendado" ).val();
      var enlace = usuarioRL;
      var mensaje =$("#mensajeRecomendar").val();
      usuario=$("#nombreOcultoPerfil").text();
      $("#cargador").removeClass('hidden');
      $('#enviarAtodos').prop('disabled',true);
      $.post('/enviaCorreoRecomendados',{toMail:to,enlace:enlace,usuario:usuario,mensaje:mensaje},function(data,status){
        if(data){
          $('#enviarAtodos').prop('disabled',false);
          $("#cargador").addClass('hidden');
          $('.modal').modal('hide');
          $('.modal').on('hidden.bs.modal',function(e){
            $("#mensajeRecomendar").val('');
            $( "#correoEnviarRecomendado" ).val('');
          });
        }
      });
    }
    var obj = new Array();
    var objId = new Array();
    var medico;
    var paciente;
    $.each($("li div.label.label-primary small span.hidden"),function(count, valor){
      obj.push($( this ).text());
      medico = parseInt( $(this).attr('di'));
      objId.push( $( this ).attr('da') );
      paciente = parseInt( $(this).attr('da'));
    });
    $.post('/medicoRecomendado',{objeto:obj, objectoId:objId},function(data){
      $.post('/doctorRecomendado',{medicoId:medico, paciente:paciente},function(dat){});
      if(data){
        $('.modal').modal('hide');
        $('.modal').on('hidden.bs.modal',function(e){
          $("#mensajeRecomendar").text('');
          $( "#correoEnviarRecomendado" ).val('');
          $("#buscadorRecomendados").val('');
        });
      }
    });
  }
function seleccionarUsuario(i, tr, nombre, mas, otroMas, di){
  var html2 ="";
  var otroId = 'li'+i;
  html2 += '<li id="'+otroId+'" onclick="removerUsuario(\''+otroId+'\',\''+tr+'\')" >';
    html2 +="<p>";
      html2 += "<div class='label label-primary'><span class='glyphicon glyphicon-remove'>&nbsp;"
        html2 +="<small style='color:white'>";
          html2 +=nombre;
          html2 += "<span class='hidden' da='"+otroMas+"' di ='"+di+"' >";
            html2 += mas;
          html2 += "</span>";
        html2 +="</small>";
      html2 += "</span></div>";
    html2 +="</p>";
  html2 +="</li>";
  prueba = i;
  otro = otroId;
  if( $("#"+tr).attr('class') == '' ){
    $("#"+tr).addClass('check');
    $( '#enviarRecomendaciones ul' ).append(html2);
  }
}
function removerUsuario(id, tr){
  $( "#"+id ).remove();
  $("#"+tr).removeClass('check');
}
//<----------- FIN RECOMENDACIONES ---------------->
function procesarInvitacion() {
  var nombre = $( '#invitar_nombre' ).val(),
    correo = $( '#invitar_correo' ).val(),
    mensaje = $( '#invitar_mensaje' ).val();
  $.ajax( {
    async: true,
    url: '/correoDisponible',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'email': correo
    },
    success: function ( data ) {
      if ( data.result == true ) {
        enviarInvitacion( nombre, correo, mensaje );
      }
      else {
        alert( 'El usuario ya se encuentra registrado en intermed' )
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function enviarInvitacion( nombre, correo, mensaje ) {
  $.ajax( {
    async: false,
    url: '/enviarInvitacion',
    type: 'POST',
    data: {
      nombre: nombre,
      correo: correo,
      mensaje: mensaje
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if ( !data.result == 'success' ) {
        alert( 'Error al enviar la invitación' );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

//Funcion que previene que un dropdown se cierre al dar click dentro de el
$( function () {
  $( ".dropdown-form" ).click( function ( event ) {
    event.stopPropagation();
  } );
} )
$( function () {
  $( ".notificationDropdown" ).click( function ( event ) {
    event.stopPropagation();
  } );
} )


//funcion que vacia la forma dentro de un dropdown y lo cierra al click del boton de guardar
$( function () {
  $( ".dropdown-form-guardar" ).dropdown();
  $( ".dropdown-form-guardar" ).click( function () {
    var allInputs = $( ".dropdown-form :input" );
    allInputs.val( "" );
  } );
} )

/*Funcion que previene que un carousel gire
$( function () {
  $( '#vCard' ).carousel( 'pause' );
  $( '#vCard' ).carousel( {
    interval: false
  } );
} );*/

/*$( function () {
  $( '.uIndicators li' ).click( function ( e ) {
    e.stopPropagation();
    var goTo = $( this ).data( 'slide-to' );
    $( '.carousel-inner .item' ).each( function ( index ) {
      if ( $( this ).data( 'id' ) == goTo ) {
        goTo = index;
        return false;
      }
    } );

    $( '#ubicacionesCarousel' ).carousel( goTo );
  } );
} );*/

function aceptarInvitacion( paciente_id, medico_id, notificacion_id ) {
  if ( !(paciente_id > 0) ) paciente_id = $( '#PacienteId' ).val();
  if ( !(medico_id > 0 )) medico_id = $( '#MedicoId' ).val();
  $.ajax( {
    async: false,
    url: '/aceptarInvitacion',
    type: 'POST',
    dataType: "json",
    data: {
      medicoID: medico_id,
      pacienteID: paciente_id,
      notificacion_id: notificacion_id
    },
    cache: false,
    success: function ( data ) {
      if ( data.result == 'success' ) {
        $( '#addFavoriteContact' ).html( 'Eliminar de contactos' );
        $( "#addFavoriteContact" ).attr( "onclick", "eliminarFavoritos()" );
        cargarFavCol( $( '#usuarioPerfil' ).val() );
        if ( notificacion_id ) {
          $( '#pre' + notificacion_id ).html( 'Aceptaste la solicitud de amistad de ' );
          $( '#post' + notificacion_id ).html( '' );
          if (notificacion_id) $( '#button' + notificacion_id ).remove();
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}


function obtenerCiudades(post) {
    if (!post){
      post = '';
    }
    div = 'slc_ciudades'+post;
    if (document.getElementById(div)){
        if ($('#'+div+' option').length == 1) {
            $('#'+div+' option').remove();
        };

        document.getElementById(div).innerHTML = '<option value=""></option>';
        document.getElementById('slc_colonias'+post).innerHTML = '<option value=""></option>';
        $.ajax({
            url: '/obtenerCiudades',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: {
                'estado_id': $('#slc_estados'+post).val()
            },
            success: function (data) {
                data.municipio.forEach(function (record) {
                    document.getElementById(div).innerHTML += '<option value="' + record.id + '">' + record.municipio + '</option>';
                });
                //AsignarCiudad();
            },
            error: function (jqXHR, textStatus, err) {
                console.error('AJAX ERROR: ' + err);
                ciudadesCargando = false;
            }
        });

    }
}

function obtenerColonias(post) {
  if (!post){
    post = '';
  }
  div = 'slc_colonias'+post;
  if ($('#'+div)){
      if ($('#'+div+' option').length != 1) {
          $('#'+div+' option').remove();
      };

      $('#'+div).html('<option value=""></option>');
      $.ajax({
          url: '/obtenerLocalidades',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: {
              'estado_id': $('#slc_estados'+post).val(),
              'municipio_id': $('#slc_ciudades'+post).val()
          },
          success: function (data) {
              data.municipios.forEach(function (record) {
                $('#'+div).append('<option value="' + record.id + '">' + record.localidad + '</option>');
              });
          },
          error: function (jqXHR, textStatus, err) {
              console.error('AJAX ERROR: ' + err);
          }
      });
  }
}

//Registrar Ubicacion
function regUbicacion() {
    var nombreUbi = '', principal = 0, calleUbi = '', numeroUbi = '', numeroIntUbi= '';
    var calle1Ubi='',calle2Ubi='',slc_estados = '', slc_ciudades = '', slc_colonias = '', cp = '';
    nombreUbi = $('#nombreUbi').val();
    if ($('#principal').is(':checked')){
      principal = 1;
    }
    calleUbi = $('#calleUbi').val();
    numeroUbi = $('#numeroUbi').val();
    numeroIntUbi = $('#numeroIntUbi').val();

    calle1Ubi = $('#calle1Ubi').val();
    calle2Ubi = $('#calle2Ubi').val();

    slc_estados = $('#slc_estados_mapa').val();
    slc_ciudades = $('#slc_ciudades_mapa').val();
    slc_colonias = $('#slc_colonias_mapa').val();
    cpUbi = $('#cpUbi').val();
    idDireccion = $('#idDireccion').val();
    latitud = $('#latitud').val();
    longitud = $('#longitud').val();

    ubicacion_id = $('#idDireccion').val();

    UbicData = {
      idDireccion: ubicacion_id,
      nombreUbi: nombreUbi,
      principal: principal,
      calleUbi: calleUbi,
      numeroUbi: numeroUbi,
      numeroIntUbi: numeroIntUbi,
      calle1Ubi: calle1Ubi,
      calle2Ubi: calle2Ubi,
      idDireccion: idDireccion,
      latitud: latitud,
      longitud: longitud,
      slc_estados: slc_estados,
      slc_ciudades: slc_ciudades,
      slc_colonias: slc_colonias,
      cpUbi: cpUbi
    }


    var resultado = {};
    if ($('#btnGuardar').val() == "Editar"){
      $('#btnEliminar').addClass('hidden');
      $('#btnGuardar').parent().parent().removeClass('pull-right');
      resultado.valido = false;
      $('#btnGuardar').val('Guardar');
      $("#frmRegUbi :input").prop('disabled', false);
      $("#frmRegUbi button.borrar").prop('disabled',true);
      $("#frmRegUbi #btnGuardarSalir").removeClass('hidden');
      mapa.marker.setOptions({draggable: true,animation:google.maps.Animation.DROP});
      funcionesTelefonos();
    } else {
      resultado = regUbiValid(UbicData);
    }

    if (resultado.valido) {
        var telefonosNuevos = [];
        var telefonosActualizar = [];

        $('#divTelefonoAgregado').find('.numeroTelefono').each(function(){
          if ($(this).find('.idTelefono').val() != "" && parseInt($(this).find('.idTelefono').val())>0){
            //Actualizar telefono
            var ext = '';
            if ($(this).find('.extTelefono')){
              ext = $(this).find('.extTelefono').text();
            }
            telefonosActualizar.push({
              id: $(this).find('.idTelefono').val(),
              tipo: $(this).find('.tipoTelefono').text(),
              numero: $(this).find('.numTelefono').text(),
              ext: ext
            });
          } else {
            //Nuevo telefono
            var ext = '';
            if ($(this).find('.extTelefono')){
              ext = $(this).find('.extTelefono').text();
            }
            telefonosNuevos.push({
              tipo: $(this).find('.tipoTelefono').text(),
              numero: $(this).find('.numTelefono').text(),
              ext: ext,
            });
          }
        });

        UbicData['telefonosActualizar'] = telefonosActualizar;
        UbicData['telefonosNuevos'] = telefonosNuevos;

        $.ajax({
            url: '/registrarubicacion',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: UbicData,
            type: 'POST',
            success: function (data) {
              if (data.success){
                $('#idDireccion').val(data.ubicacion_id);
                $('#btnEliminar').removeClass('hidden');
                $('#btnGuardarSalir').addClass('hidden');
                $('#btnGuardar').val('Editar');
                $('#btnGuardar').parent().parent().addClass('pull-right');
                //Telefonos
                $('#addFon').val('Añadir');
                $('#tipoTelefono').prop('selectedIndex', 0);
                $('#tipoTelefono').change();

                $('#btnGuardar').val('Editar');
                $("#frmRegUbi :input").prop('disabled', true);
                $('#frmRegUbi :button #addFon').prop('disabled', true);
                $("#frmRegUbi :button").prop('disabled', false);
                $("#frmRegUbi #btnGuardarSalir").addClass('hidden');
                mapa.marker.setOptions({draggable: false,animation:null});
                cargarTelefonos();
                actualizarDirecciones();
              } else {
                if (data.error){
                  manejadorDeErrores(data.error);
                }
              }
            },
            error: function (err) {
                console.error('AJAX ERROR: (registro 166) : ' + JSON.stringify(err));
            }
        });
    } else if (resultado.error){
      bootbox.alert({
        message: "Es necesario indicar " + resultado.error + " de la ubicación para su registro.",
        title: "No se puede guardar la ubicación"
      });
    }
}

//Registrar Ubicacion
function regHorarios() {
    if (regHorariosValid() == true) {
        //agregar horarios al control
        $('#horariosUbi').val(JSON.stringify(obtenerHorarios()));

        $.ajax({
            url: '/registrarhorarios',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: $('#frmRegHorarios').serialize(),
            type: 'POST',
            success: function (data) {
                document.getElementById("frmRegHorarios").reset();
                alert('registro guradado');
            },
            error: function (jqXHR, textStatus, err) {
                console.error('AJAX ERROR: (registro 166) : ' + err + ' ' + textStatus);
            }
        });
    }
}

function regHorariosValid() {
    return true;
}
function regUbiValid(UbicData) {
    var error = '';
    var blnValido = true;
    if (blnValido && UbicData.nombreUbi == ''){
      blnValido = false;
      error = 'el nombre';
    }

    if (blnValido && UbicData.calleUbi == ''){
      blnValido = false;
      error = 'la calle';
    }

    if (blnValido && UbicData.numeroUbi == ''){
      blnValido = false;
      error = 'el número';
    }

    if (blnValido && (UbicData.latitud == '' || UbicData.longitud == '')){
      blnValido = false;
      error = 'la ubicacion';
    }

    if (blnValido && UbicData.slc_estados <= 0){
      blnValido = false;
      error = 'el estado';
    }

    if (blnValido && UbicData.slc_ciudades <= 0){
      blnValido = false;
      error = 'la ciudad';
    }

    if (blnValido && UbicData.slc_colonias <= 0){
      blnValido = false;
      error = 'la colonia';
    }

    if (blnValido && UbicData.cpUbi <= 0){
      blnValido = false;
      error = 'el código postal';
    }

    return {'valido':blnValido, 'error':error};
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

// Obtiene ciudades para una pantalla (0) o un modal  (1)
function obtenerCiudadesModal(tipo) {
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
            data.municipio.forEach(function(record) {
                //ciudades.innerHTML += '<option value="' + record.id + '">' +  record.municipio + '</option>';
								ciudades.append('<option value="' + record.municipio_id + '">' +  record.municipio + '</option>');
            });
        },
        error: function(jqXHR, textStatus, err) {
            console.error('AJAX ERROR: ' + err);
        }
    });
}

// Obtiene colonias para una pantalla (0) o un modal  (1)
function obtenerColoniasModal(tipo) {
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
            'municipio_id': idCiudad //document.getElementById('slc_ciudades').value
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

// Obtiene el cp para una pantalla (0) o un modal  (1)
function obtenerCPModal(tipo) {
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
/**
* Pedir recomendacion a un medico, la siguiente parte del script
* es para poder pedirle a cualquier medico una recomenacion
* de sus contactos de algun especialista.
* le llegara a el una notificacion donde se le avisara que usuario
* pidio una recomendacion, donde el podra elegir desde sus contactos
* una recomendacion y mandar, ya sea por correo o por el mismo sistema
* al cual al usuario le podra llegar una notificacion que al darle click
* lo mande al perfil del medico donde podra agregarlo a sus favoritos.
**/
//<------------------- OSCAR -------------------------->
var xEspecialidad;
var idEspecialidad = '';
  $(document).ready(function(){
    $(".Pedir.contList-profileActionLink").click(function(){
      var nombre = $(this).parent().parent().find('a.contList-profileName').text();
      var usuario_id = $(this).parent().parent().prop('id');
      $.post('/especialidadesMedico',function(data){
        pedirRecomendacionesBoot();
        var option ="";
        $("#especialidadesMedic").html('');
        option +='<option value="0">Especialidades</option>'
        for(var i in data ){
            option += '<option value="'+data[ i ].id+'">'+data[ i ].especialidad+'</option>';
        }
        $("#especialidadesMedic").append(option);
      });
      // carga nombre e id del medico
      $.post('/medicoDatos',function(data){
        $("#nombreDoctor").text(nombre);
        $("#idMedico").text(usuario_id);
      });
    });
  });
  function enviandoPeticion(){
    if( $("#especialidadesMedic option:selected").text() != "Especialidades" ){
      var id = $("#idMedico").text();
      var recomendacion = $("#especialidadesMedic option:selected").text();
      $.each($("li div.label.label-success small span.hidden"),function(index, data){
        idEspecialidad += "|"+$( this ).text();
      });
      $.post('/pedirRecomendacionMedico',{
          idMedico:id,
          idEspecialidad: idEspecialidad,
      },function(data){
        if(data){
        }
      });
    }else{
      alert("Seleccione una opcion");
    }
  }
  function cargando(ids){
    var id = $(ids).val();
    var valor = $(ids+" option:selected").text();
    console.log("ID: "+id+"\n"+"Valor: "+valor);
    var html2 ="";
     html2 += '<li>';
       html2 +="<p>";
         html2 += "<div class='label label-success'><span class='glyphicon glyphicon-remove'>&nbsp;"
           html2 +="<small>";
             html2 +=valor;
             html2 += "<span class='hidden'>";
               html2 += id;
             html2 += "</span>";
           html2 +="</small>";
         html2 += "</span></div>";
       html2 +="</p>";
     html2 +="</li>";
     $( '#tipoRecomendacionPedir ul' ).append(html2);
  }
  function presionando(hola){
    $(hola).modal('toggle');
    var html = "";
    var html2 = "";
    $.post('/traerDatos',function(dat){
      var arreglo = new Array();
      var spanOculto ="";
      for( var i in dat ){
          arreglo=dat[ i ].data.split("|");
          spanOculto=arreglo[0];
      }
      arreglo.shift();
      $.post('/especial',{ides:arreglo},function(datas){
        for( var i in datas ){
          for(var j in i)
          html += '<li>';
          html += '<span class="label label-warning">';
          html += datas[ i ][j].especialidad;
          html += '</span>';
          html+='</li>';
        }
        $( "#contenidoRequerido ul" ).html(html);
        $( "#idOculto" ).html(spanOculto);
        var titulo;
        var lugarEstudio;
        var especialidad;
        var name;
        var imgUrl;
        var idMedico;
        $.post('/cargarContactosMedico',function(medicosContactos){
          //console.log("MEDICOS CONTACTOS: "+JSON.stringify(medicosContactos));
          for( var i in medicosContactos ){
            if( medicosContactos[ i ].Medico.Usuario ){
              idMedico = medicosContactos[i ].Medico.id;
              var tdID = "td"+idMedico;
              name = medicosContactos[ i ].Medico.Usuario.DatosGenerale.nombre+' '+medicosContactos[ i ].Medico.Usuario.DatosGenerale.apellidoP+' '+medicosContactos[ i ].Medico.Usuario.DatosGenerale.apellidoM;
              imgUrl = medicosContactos[i].Medico.Usuario.urlFotoPerfil;
              html2 += '<tr class="" id="'+tdID+'" onclick="labelTag(\''+name+'\',\''+idMedico+'\',\''+tdID+'\')">';
                html2 += '<td>';
                  html2 += '<img src="'+imgUrl+'" alt="" class="img-circle"/>';
                html2 += '</td>';
                html2 += '<td>';
                  html2 += '<h4>'+name+'</h4>';
                  html2 += '<span class="s15">';
                  for( var j in medicosContactos[ i ].Medico.MedicoEspecialidads){
                    if( medicosContactos[ i ].Medico.MedicoEspecialidads[ j ].subEsp == 0){
                      html2 +="<strong>"+medicosContactos[ i ].Medico.MedicoEspecialidads[ j ].Especialidad.especialidad+'</strong>';
                    }
                  }
                  for( var p in medicosContactos[ i ].Medico.MedicoEspecialidads ){
                    if(medicosContactos[ i ].Medico.MedicoEspecialidads[ p ].subEsp == 1){
                      html2 +='<small>&nbsp;'+medicosContactos[ i ].Medico.MedicoEspecialidads[ p ].Especialidad.especialidad+'</small>';
                    }
                  }
                  html2 += '</span>';
                html2 += '</td>';
                html2 += '<td>';
                html2 += '</td>';
              html2 += '</tr>';
            }
          }
          $( "#tabla table.table-hover.table-condensed #agregandoContacto").html(html2);
        });
      });
    });
  }
  function labelTag( name, idMedico, tdID ){
    var axxios = "";
    var liID = 'li'+idMedico;
    axxios += '<li id="'+liID+'" onclick="remueveTagLi(\''+tdID+'\',\''+liID+'\');">';
      axxios += '<div class="label label-danger">';
        axxios += '<small>';
          axxios += '<span class="glyphicon glyphicon-remove">&nbsp;</span>';
          axxios += name;
        axxios += '</small>';
        axxios += '<span class="hidden">'+idMedico+'</span>';
      axxios += '</div>';
    axxios += '</li>';
    if( $("#"+tdID).attr('class') == '' ){
      $("#"+tdID).addClass('cambiando');
      $( "#sendFor ul.list-inline" ).append(axxios);
    }
  }
  function remueveTagLi( tdID, liID ){
    $("#"+liID).remove();
    $("#"+tdID).removeClass('cambiando');
  }
  function miRecomendacion( record ){
    $("#cuerpoRecomendado").html('');
      $.post('/consultaMedInfo',{
        id:record
      }, function(data){
        var html = "";
        $.each(data, function( i, item){
            html += '<tr>';
              html += '<td>';
                html += '<img src ="'+item[0].Usuario.urlFotoPerfil+'" class="img-circle">';
              html += '</td>';
              html += '<td>';
                html += '<a href ="'+base_url+"perfil/"+item[0].Usuario.usuarioUrl+'">';
                  html += '<span>'+item[0].Usuario.DatosGenerale.nombre+' '+item[0].Usuario.DatosGenerale.apellidoP+' '+item[0].Usuario.DatosGenerale.apellidoM+'</span>';
                html += '</a>';
              html += '</td>';
            html += '</tr>';
        });
        $("#cuerpoRecomendado").append(html);
      }).fail(function(e){
        alert("Error 718: "+JSON.stringify(e));
      });
    $("#meRecomendaron").modal('toggle');//abre el modal
  }
  //EVENTO DEL CLICK
  $(document).ready(function(){
    $( "#buscarRecomendar" ).click( function(){
      var spanOculto = $( "#idOculto" ).text();
      var datos="";
      $.each($('#sendFor li div.label.label-danger span.hidden'), function(index, value){
        if(datos != "") datos += "|"+$( this ).text();
        else datos = $( this ).text();
      });
      $.post('/enviarMedAPacientes',{idMed:spanOculto,data:datos},function(send){
        if(send){
          $('.modal').modal('hide');
            $('.modal').on('hidden.bs.modal',function(e){
              $("#sendFor").html('');
              $("#mensajeRecomendar").val('');
              $( "#correoEnviarRecomendado" ).val('');
            });
        }
      });
    });
  });
//<------------------- FIN OSCAR ---------------------->
//<------------------ OSCAR --------------------------->
  /**
  * En esta parde del script se va a cargar los option
  * de los diferentes select que estan en la pagina
  * Home y en los de estado municipio, se haran los respectivos
  * cambios
  *
  *
  **/
  $(document).ready(function(){
    //Ajax para traer especialidades
    $.post('/homeEspecialidades', function(data){
      var html = "";
      if( data != null ){
        $.each(data, function( i, item){
          html += '<option value="'+item.id+'">'+item.especialidad+'</option>';
        });
        $("#especialidad").append(html);
      }
    });
    //Ajax para traer padecimiento
    $.post('/homePadecimientos',function(padecimientos){
      var html = "";
      if( padecimientos != null ){
        $.each(padecimientos, function( i, item ){
          html += '<option value ="'+item.id+'">'+item.padecimiento+'</option>';
        });
        $("#padecimientoHome").append(html);
      }
    });
    // Ajax para estados
    $.post('/homeEstados', function(estados){
      var html = "";
      if( estados != null ){
        $.each(estados, function(i, item){
          html += '<option value="'+item.id+'">'+item.estado+'</option>';
        });
        $("#Estado").append(html);
      }
    });
    // evento change para las ciudades
    $("#Estado").change(function(){
      var valor = $( this ).val();
      $.post('/homeCiudad',{id:valor},function(ciudades){
        var html = "";
        if( ciudades != null ){
          $("#Ciudad").html('');
          $.each(ciudades, function( i, item ){
            html += '<option value="'+item.id+'">'+item.municipio+'</option>';
          });
          $("#Ciudad").append(html);
        }
      })
    });
  });
//<------------------ FIN OSCAR ----------------------->

function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('.sticky').addClass('stick');
    } else {
        $('.sticky').removeClass('stick');
    }
}

$(function(){
  $('#btnAgregaUbi').on('click',function(){
    agregarUbicacion();
  });

  $('#btnEditaUbi').on('click',function(){
    var ubicacion_id = $('.csslider > input:checked').prop('value');
    agregarUbicacion(ubicacion_id);
  });
});

$('#listaEspecialidades a').on('click', function(event) {
  event.preventDefault();
});

$(function() {
  $('nav a[href*=#]:not([href=#])').click(function() {
    event.preventDefault();
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - $('#stickyNav').height()
        }, 1000);
        return false;
      }
    }
  });
});

if ( location.pathname.indexOf('/nuevoPerfilMedicos/') == 0 ) {
$(document).ready(function(){
  $(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
  });

  $('.logros-slider').bxSlider({
    slideWidth: 250,
    minSlides: 1,
    maxSlides: 5,
    moveSlides: 1,
    slideMargin: 50,
  });
})



}

function actualizarDirecciones(salir){
  $.ajax( {
    async: false,
    url: '/ubicaciones/traer',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        if (data.result.length> 0 && $('#editUbi').html() != ""){
          $('#editUbi').html('<button class="btn btn-primary btn-xs" id="btnEditaUbi"><span class="glyphicon glyphicon-pencil"></span></button>');
        }
        var contenido = '';
        var contador = 0;
        data.result.forEach(function(record){
          var checked = '';
          if (contador == 0){
            checked = 'checked="checked"';
          }
          contenido+= '<input type="radio" name="slides" '+ checked +' id="slides_'+ ++contador +'" value="'+ record.id +'"/>';
        });
        contenido+= '<ul>';
        var contador = 0;
        data.result.forEach(function(record){
          var interior = '';
          if (record.numeroInt){
            interior = ' interior ' + record.numeroInt;
          }

          contenido += `
              <li>
                <div class="direccionLtLn hidden">
                  <span class="principal">`+ record.principal +`</span>
                  <span class="lat">`+record.latitud+`</span>
                  <span class="long">`+ record.longitud +`</span>
                  <span class="nombre">`+ record.nombre +`</span>
                  <span class="direccion">
                      <span>`+ record.calle +`</span>&nbsp;<span>#`+ record.numero + interior +`</span><br>
                      `+ record.Localidad.TipoLocalidad.tipo +` <span>`+ record.Localidad.localidad +`</span><br>
                      <span>`+ record.Municipio.municipio +`</span>, <pan>`+ record.Municipio.Estado.estado +`</pan>. CP: <span>`+ record.Localidad.CP +`</span>
                  </span>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 direccion-pagination-bg">
                  <span class=90>`+ ++contador +`</span>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                  <address class="whiteF Flama-bold">
                    <strong><span>`+ record.nombre +`</span></strong><br>
                    <span>`+ record.calle +`</span>&nbsp;<span>#`+ record.numero + interior +`</span><br>
                    `+ record.Localidad.TipoLocalidad.tipo +` <span>`+ record.Localidad.localidad +`</span><br>
                    <span>`+ record.Municipio.municipio +`</span>, <pan>`+ record.Municipio.Estado.estado +`</pan>. CP: <span>`+ record.Localidad.CP +`</span><br>`;

            if (record.Telefonos.length > 0){
              contenido += `<br><strong>Teléfonos</strong><br>`;

              record.Telefonos.forEach(function(tel){
                var claveRegion = '';
                if (tel.claveRegion){
                  claveRegion = tel.claveRegion +' ';
                }
                contenido += `<abbr title="Phone" style="text-transform: capitalize;">`+ tel.tipo +`:</abbr> `+ claveRegion + tel.numero + ' ' +  tel.ext +`<br>`;
              });
            }

            contenido += `</address></div></li>`;
            });
        contenido+= '</ul><div class="arrows">';
        var contador = 0;
        data.result.forEach(function(record){
          contenido+= '<label for="slides_'+ ++contador +'"></label>';
        });
        contenido+= '<label for="slides_1" class="goto-first"></label><label for="slides_'+ contador +'" class="goto-last"></label></div>';
        contenido+= '<div class="navigation"><div class="row"><div class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">';
        var contador = 0;
        data.result.forEach(function(record){
          contenido+= '<label for="slides_'+ ++contador +'">'+ contador +'&nbsp;</label>';
        });
        contenido+= '</div></div></div>';
        $('#slider1').html(contenido);
        MostrarUbicaciones();

        $('#btnEditaUbi').on('click',function(){
          var ubicacion_id = $('.csslider > input:checked').prop('value');
          console.log('UBI: ' + ubicacion_id);
          agregarUbicacion(ubicacion_id);
        });
        if (salir){
          bootbox.hideAll();
        }
      } else {
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}


function funcionesTelefonos(){
  $('#tipoTelefono').unbind();
  $('#tipoTelefono').change(function(){
    if ($('#divTelefono')){
      switch($('#tipoTelefono').val()) {
      case "celular":
          $('#divTelefono').html('<div class="form-group"><input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="12" onpaste="soloNumeros()" ></div>');
          break;
      case "oficina":
          $('#divTelefono').html('<div class="col-md-8"><div class="row" style="margin-right:2px;"><div class="form-group"><input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="12" onpaste="soloNumeros()" ></div></div></div><div class="col-md-4"><div class="row"><div class="form-group"><input type="text" id="extTelefono" class="form-control solo-numero" placeholder="Ext:" maxlength="10" onpaste="soloNumeros()" ></div></div></div>');
          break;
      case "localizador":
        $('#divTelefono').html('<div class="col-md-7"><div class="row" style="margin-right:2px;"><div class="form-group"><input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="10" onpaste="soloNumeros()" ></div></div></div><div class="col-md-5"><div class="row"><div class="form-group"><input type="text" id="extTelefono" class="form-control solo-numero" placeholder="Localizador:" maxlength="10" onpaste="soloNumeros()" ></div></div></div>');
        break;
      default:
          console.log('El tipo de telefono no existe');
        }
      $('#numTelefono').mask('000-000-0000',{reverse:true});
    }
  });

  $('#addFon').unbind();
  $('#addFon').click(function(){
    var clase = '';
    switch($('#tipoTelefono').val()) {
    case "celular":
        clase = 'glyphicon-phone';
        break;
    case "oficina":
        clase = 'glyphicon-phone-alt';
        break;
    case "localizador":
        clase = 'glyphicon-bell';
        break;
    default:
        console.log('El tipo de telefono no existe');
      }
    if ($('#addFon').val() == "Guardar"){
      var parent = $('#divTelefonoAgregado').find('.editando').parent();
        parent.find('.tipoTelefono').text($('#tipoTelefono').val());
        parent.find('.tipoTelefonoIcon').html("<span class='glyphicon "+clase+"'></span>");
        parent.find('.numTelefono').text($('#numTelefono').val());
        var ext = '';
        if ($('#extTelefono')) ext = $('#extTelefono').val();
        parent.find('.extTelefono').text(ext);
        parent.find('.editando').removeClass('editando');
        parent.find('.borrar').prop('disabled',true);
        $('#tipoTelefono').prop('selectedIndex', 0);
        $('#tipoTelefono').change();
        $('#addFon').val('Añadir');
    } else {
      var idTemp = 0;
      $('#divTelefonoAgregado').find('.idTempTelefono').each(function(){
        idTemp = parseInt($(this).val());
      });
      idTemp++;
      var ext = '';
      if ($('#extTelefono') && $('#extTelefono').val()) ext = $('#extTelefono').val();
      $('#divTelefonoAgregado').append(`
        <div class="input-group-btn numeroTelefono">
          <input type="hidden" class="idTelefono" value="">
          <input type="hidden" class="idTempTelefono" value="`+idTemp+`">
          <label class="btn btn-sm editar btnChk">
            <input type="radio" autocomplete="off">
            <span class="tipoTelefono hidden">`+$('#tipoTelefono').val()+`</span>
            <span class="tipoTelefonoIcon"><span class="glyphicon `+ clase +`"></span></span>
            <span class="numTelefono">`+ $('#numTelefono').val() +`</span>
            <span class="extTelefono">`+ ext +`</span>
          </label>
          <button class="btn btn-sm borrar" disabled="true" onclick="eliminarTelefono(this)">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </div>`
      );
      funcionesTelefonos();
      $('#tipoTelefono').prop('selectedIndex', 0);
      $('#tipoTelefono').change();
    }
  });

  $('label.editar').unbind();
  $('label.editar').click(function(){
    if ($('#btnGuardar').val() != "Editar"){
      if ($(this).hasClass('editando')){
        $(this).removeClass('editando');
        $(this).parent().find('.borrar').prop('disabled',true);
        $('#addFon').val('Añadir');
        $('#tipoTelefono').prop('selectedIndex', 0);
        $('#tipoTelefono').change();
      } else {
        $('.editando').each(function(){
          $(this).removeClass('editando');
          $(this).parent().find('.borrar').prop('disabled',true);
        });
        $(this).addClass('editando');
        $('#addFon').val('Guardar');
        $('#tipoTelefono').val($(this).parent().find('.tipoTelefono').text());
        $('#tipoTelefono').change();
        $('#numTelefono').val($(this).find('.numTelefono').text());
        $('#extTelefono').val($(this).find('.extTelefono').text());
        $(this).parent().find('.borrar').prop('disabled',false);
      }
    }
  });


  $('.solo-numero').unbind();
  $('.solo-numero').bind("paste", function(e){
    // access the clipboard using the api
    var pastedData = e.originalEvent.clipboardData.getData('text');
    if (!parseInt(pastedData)){
      if (e.preventDefault) {
          e.preventDefault();
      } else {
          e.returnValue = false;
      }
    }
  } );

   $('.solo-numero').keypress(function(evt) {
    var charCode = evt.keyCode || evt.which;
    if ((charCode < 45 || charCode > 57) &&  charCode != 13) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    }
  });
}

function eliminarTelefono(element){
  bootbox.confirm({
    message: "¿Desea eliminar el teléfono?.",
    title: "Mensaje de confirmación",
    callback: function(result) {
      if (result){
        $(element).parent().remove();
      }
    },
    buttons: {
      confirm: {
        label: "Si"
      },
      cancel: {
        label: "No"
      }
    }
  });
}

function eliminarUbicacion(){
  bootbox.confirm({
    message: "¿Desea eliminar la dirección?.<br/><br/>*** Esta acción eliminara los telefonos,horarios y citas vinculados con la ubicación.",
    title: "Mensaje de confirmación",
    callback: function(result) {
      if (result){
          var direccion_id = $('#idDireccion').val();
          $.ajax( {
            async: false,
            url: '/ubicaciones/eliminar',
            type: 'POST',
            dataType: "json",
            data: {idDireccion: direccion_id},
            cache: false,
            success: function ( data ) {
              if (data.success){
                actualizarDirecciones(true);
              }
            },
            error: function (err){
              console.log('ERROR AJAX: ' + JSON.stringify(err));
            }
          });
      }
    }
  });
}

function cargarTelefonos(){
  var direccion_id = $('#idDireccion').val();
  $('#divTelefonoAgregado').html('');
  if (direccion_id){
    $.ajax( {
      async: false,
      url: '/telefonos/traer',
      type: 'POST',
      dataType: "json",
      data: {direccion_id: direccion_id},
      cache: false,
      success: function ( data ) {
        data.forEach(function(telefono){
            var clase = '';
            switch(telefono.tipo) {
            case "celular":
                clase = 'glyphicon-phone';
                break;
            case "oficina":
                clase = 'glyphicon-phone-alt';
                break;
            case "localizador":
                clase = 'glyphicon-bell';
                break;
            default:
                console.log('El tipo de telefono no existe');
              }
          var numTel = '';
          if (telefono.claveRegion && telefono.claveRegion != ""){
            numTel += telefono.claveRegion + '-' + telefono.numero.replace(' ','-');
          } else {
            numTel += telefono.numero.replace(' ','-');
          }
          $('#divTelefonoAgregado').append(`
            <div class="input-group-btn numeroTelefono">
              <input type="hidden" class="idTelefono" value="`+telefono.id+`">
              <input type="hidden" class="idTempTelefono" value="">
              <label class="btn btn-sm editar btnChk">
                <input type="radio" autocomplete="off">
                <span class="tipoTelefono hidden">`+telefono.tipo+`</span>
                <span class="tipoTelefonoIcon"><span class="glyphicon `+ clase +`"></span></span>
                <span class="numTelefono">`+ numTel +`</span>
                <span class="extTelefono">`+ telefono.ext +`</span>
              </label>
              <button class="btn btn-sm borrar" disabled="true" onclick="eliminarTelefono(this)">
                <span class="glyphicon glyphicon-remove"></span>
              </button>
            </div>`
          );
        });
        funcionesTelefonos();
      },
      error: function (err){
        console.log('ERROR AJAX: ' + JSON.stringify(err));
      }
    });
  }
}

function agregarExpertoEn(){
  var addExp = $('#addExp').val();
  if (addExp && addExp != ""){
    $('#sortableExpertoEn').append(`
      <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
      <div class="menuDiv">
        <span>
          <span data-id="2" class="itemTitle">`+ addExp +`</span>
          <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
          <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
        </span>
      </div>
      </li>`);
      $('#addExp').val('');

  } else {
    //Input de experiencia vacio
  }
  $('#addExp').focus();
}

function guardarExpertoEn(){
  var expertoEn = {};
  var parent;
  var lastparent;
  var last = 0;
  $('#sortableExpertoEn .menuDiv').each(function(){
    if ($(this).parent().parent().prop('id') === "sortableExpertoEn"){
      lastparent = last;
      parent = '';
    } else {
      parent = lastparent;
    }

    if (parent === ''){
      expertoEn[lastparent] = {};
      expertoEn[lastparent].exp = {};
      expertoEn[lastparent].hijos = [];

      expertoEn[lastparent].exp = {
        num: last,
        val: $(this).find('.itemTitle').text(),
        padre: parent
      }
    } else {
      expertoEn[lastparent].hijos.push({
        num: last,
        val: $(this).find('.itemTitle').text(),
        padre: parent
      });
    }
    last++;
  });
  $.ajax( {
    async: false,
    url: '/medicos/expertoActualizar',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'expertoEn': expertoEn
    },
    success: function ( data ) {
      if (data.success){
        setTimeout(function(){
          traerExpertoEn();
        },500);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function traerExpertoEn(){
  $.ajax( {
    async: false,
    url: '/medicos/expertoTraer',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        console.log('Experto En: ' + JSON.stringify(data));
        var listaNueva = '<ul>';
        if (data.result){
          var sub = false;
          data.result.forEach(function(rec){
            if (!rec.padre_id){
              if (sub){
                listaNueva += '</ul>';
                sub = false;
              }
            } else {
              if (sub === false){
                listaNueva += '<ul>';
                sub = true;
              }
            }
            listaNueva += '<li>'+ rec.expertoen +'</li>';
          });
          if (sub){
            listaNueva += '</ul>';
          }
        }
        listaNueva += '</ul>';
        $('#divExpEn').html(listaNueva);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

/**
* abre el modal de login
*
**/
$(document).ready(function(){
  $("#logMod").click(function(){
    loginModal();
  });
  $("#addForma").click(function(){
    invitarModal();
  });
  $("#addForma1").click(function(){
    invitarModal();
  });
});
/**
* Funciones para los catalogos de servicios
* Las siguientes funciones se iran codificando
* las diferentes funciones para hacer el insert,
* update, delete, view, de catalogos,
* seran cuatro diferentes funciones una para cada
* funcion.
**/

/**
* downloadServices funcion que servira solo para
* cargar todos los catalogos de servicios que esta
* ofreciendo el medico
* @param id es el id de el div donde se va a maquetar la informacion
**/
function downloadServices(id){
  //post para mostrar los servicios en la primera pestaña
    $.post('/searchServices',function(data){
      if( data != null ){
        $("#tusServices").html('');
        var html ="";
        $.each(data,function(i, item){
          html += "<tr>";
            html += "<td><center>"+i+"</center></td>";
            html += "<td><center>"+item.concepto+"</center></td>";
            html += "<td><center>"+item.descripcion+"</center></td>";
            html += "<td><center>"+item.precio+"</center></td>";
            html += "<td><center>"+item.duracion+"</center></td>";
          html += "</tr>";
        });
        $("#tusServices").append(html);
      }else{
        $("#encontroServicios").removeClass('hidden');
      }
    }).fail(function(e){
      console.log("Error:-"+JSON.stringify(e));
    });
}
//funcion para agregar mas servicios
function addServices(concepto, descripcion,precio,duracion){
  var con = $(concepto).val();
  var des = $(descripcion).val();
  var pre = $(precio).val();
  var dur = $(duracion+ " :selected").val();
  //post para el envio de la informacion
  if( con != "" && des != "" && pre != "" && dur != "time" ){
    $.post('/addServices',{
      concepto:con,
      descripcion: des,
      precio: pre,
      duracion: dur
    },function(data){
      if(data == true){
        $("#exitoAgregado").removeClass('hidden');
        $(concepto).html('');
        $(descripcion).html('');
        $(precio).html('');
      }else{
        console.log("Entro aqui");
        $("#exitoNoAgregado").removeClass('hidden');
      }
    });
  }
}
// funcion para maquetar y poder modificar los resultados
function maquetaServices(){
  var html = "";
  //Maqueta los inputs y los botones para poder maquetar
  $("#modificatusServices").html('');
  var con = "";
  var des = "";
  var pre = "";
  var dur = "";
  $.post('/searchServices', function(data){
    $.each(data, function( i, item){
      con = "#conceptModifica"+i;
      des = "#decriptModifica"+i;
      pre = "#precModifica"+i;
      dur = "#durModifica"+i;
      html += '<tr>';
        html += '<td>';
          html += '<center>';
            html += '<button type="button" onclick="updateServices(\''+con+'\',\''+des+'\',\''+pre+'\',\''+dur+'\')" class="btn btn-success">';
              html += '<span style="color:white;" class="glyphicon glyphicon-pencil"></span>';
            html += '</button>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" oculto="'+item.id+'" class="form-control" id="conceptModifica'+i+'" value="'+item.concepto+'"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" class="form-control" id="decriptModifica'+i+'" value="'+item.descripcion+'"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" class="form-control" id="precModifica'+i+'" value="'+item.precio+'"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<select id="durModifica'+i+'">';
                html += '<option value="'+item.duracion+'">'+item.duracion+'</option>';
                html += '<option value="00:30:00">30 minutos</option>';
                html += '<option value="00:45:00">45 minutos</option>';
                html += '<option value="01:00:00">1 hora</option>';
                html += '<option value="02:00:00">2 horas</option>';
                html += '<option value="03:00:00">3 horas</option>';
              html += '</select>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
      html += '</tr>';
    });
    $("#modificatusServices").append(html);
  }).fail(function(e){
    console.log("Error:-"+JSON.stringify(e));
  });
}
function maquetaDeleteServices(){
  var html = "";
  $("#deleteServicesTable").html('');
  $.post('/searchServices', function(data){
    $.each(data, function( i, item){
      var tr = "#tr-"+item.id;
      var delet = item.id;
      html += '<tr class="">';
        html += '<td>';
          html += '<center>';
            html += '<button onclick="deleteFunction(\'#tr-'+tr+'\',\''+delet+'\');" type="button" class="btn btn-danger">';
              html += '<span style="color:white;" class="glyphicon glyphicon-remove"></span>';
            html += '</button>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" class="form-control" id="conceptModifica" value="'+item.concepto+'" disabled />';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" class="form-control" id="decriptModifica" value="'+item.descripcion+'" disabled />';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" class="form-control" id="precModifica" value="'+item.precio+'" disabled />';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<select disabled>';
                html += '<option value="'+item.duracion+'">'+item.duracion+'</option>';
              html += '</select>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
      html += '</tr>';
    });
    $("#deleteServicesTable").append(html);
  }).fail(function(e){
    console.log("Error:-"+JSON.stringify(e));
  });
}
function deleteFunction(tr, id){
  //bootbox para confirmar que desea eliminar la seleccion
  bootbox.confirm('¿Estas seguro de eliminar este servicio?', function(result){
    if( result == true ){
      // se manda un post con el id que se desea eliminar
      $.post('/deleteServicio',{id:id},function(data){
        $('.eliminaServicios'+tr).remove();
      }).fail(function(e){
        $('.eliminaServicios'+tr).remove();
      });
    }
  });
}
function updateServices( con, des, pre, dur){
  var concepto = $(con).val();
  var descripcion = $(des).val();
  var precio = $(pre).val();
  var duracion = $(dur+ " :selected").val();
  var id = $(con).attr('oculto');
  $.post('/updateServices',{
    id: id,
    concepto: concepto,
    descripcion: descripcion,
    precio: precio,
    duracion: duracion
  },function(data){
    if( data == 1 ){
      $("#exitoModificado").removeClass('hidden');
    }else{
      $("#exitoNoModificado").removeClass('hidden');
    }
  });
}
function loadDatosGenerales(){
  $.post("/loadDatosGenerales",function(data){
    $('#usuarioUrlFotoPerfil').prop('src',data.urlFotoPerfil);
    $("#editMail").attr('value',data.correo);
    $("#editNom").attr('value',data.DatosGenerale.nombre);
    $("#editApeP").attr('value',data.DatosGenerale.apellidoP);
    $("#editApeM").attr('value',data.DatosGenerale.apellidoM);
  });
}
function loadBiometricos(){
  var html="";
  $.post('/loadBiometricos',function(data){
    if( data.length > 0 ){
      $("#noBiometrico").addClass('hidden');
      $("#bioBody").html('');
      $.each(data, function(i, item){
        var id="#bioModi-"+i;
        html += '<tr style="color:white;">';
          html += '<td><center>'+item.peso+'</center></td>';
          html += '<td><center>'+item.altura+'</center></td>';
          html += '<td><center>'+item.tipoSangre+'</center></td>';
          html += '<td><center>'+item.genero+'<c/enter></td>';
          html += '<td>';
            html += '<center>';
              html += '<button class="btn btn-danger" oculto="'+item.id+'" type="button" id="bioModi-'+i+'" onclick="deleteBio(\''+id+'\')">';
                html += '<span class="glyphicon glyphicon-wrench"></span>';
              html += '</button>';
            html += '</center>';
          html += '</td>';
        html += '</tr>';
      });
      $("#bioBody").append(html);
    }else{console.log("entro al else");
      $("#noBiometrico").removeClass('hidden');
    }
  });
}
function loadTelefonos(){
  var html = "";
  $.post('/loadTelefonos', function( data ){
    if( data.length > 0 ){
      $("#noTelefono").addClass('hidden');
      $("#telBody").html('');
      $.each(data, function(i, item){
        var id="#deleteTelBio-"+i;
        html += '<tr>';
          html += '<td>';
            html += '<center>';
              html += item.nombre;
            html += '</center>';
          html += '</td>';
          html += '<td>';
            html += '<center>';
              html += item.tel;
            html += '</center>';
          html += '</td>';
          if( item.medico == 1 ){
            html += '<td>';
              html += '<center>';
                html += 'Medico';
              html += '</center>';
            html += '</td>';
          }else{
            html += '<td>';
              html += '<center>';
                html += 'Familiar/Conocido';
              html += '</center>';
            html += '</td>';
          }
          html += '<td>';
            html += '<center>';
              html += '<button class="btn btn-danger" oculto="'+item.id+'"type="button" id="deleteTelBio-'+i+'" onclick="deleteFon(\''+id+'\');">';
                html += '<span class="glyphicon glyphicon-remove-sign"></span>';
              html += '</button>';
            html += '</center>';
          html += '</td>';
        html += '</tr>';
      });
      $("#telBody").append(html);
    }else{
      $("#noTelefono").removeClass('hidden');
    }
  });
}
function updateName(){
  var nombre = $("#editNom").val();
  $.post('/updateName',{nombre:nombre},function(data){
    if( data.length > 0 ){
      $("#infoGeneral").removeClass('hidden');
      $("#cambiandoGenerales").removeClass('hidden');
      $("#cambiandoGenerales").text('Nombre: '+nombre);
    }else{
      $("#infoGeneral").addClass('hidden');
      $("#cambiandoGenerales").addClass('hidden');
    }
  });
}
function updateApellidoP(){
  var apellidoP = $("#editApeP").val();
  $.post('/updateApellidoP',{nombre:apellidoP},function(data){
    if( data.length > 0 ){
      $("#infoGeneral").removeClass('hidden');
      $("#cambiandoGenerales").removeClass('hidden');
      $("#cambiandoGenerales").text('Apellido paterno: '+apellidoP);
    }else{
      $("#infoGeneral").addClass('hidden');
      $("#cambiandoGenerales").addClass('hidden');
    }
  });
}
function updateApellidoM(){
  var apellidoM = $("#editApeM").val();
  $.post('/updateApellidoM',{nombre:apellidoM},function(data){
    if( data.length > 0 ){
      $("#infoGeneral").removeClass('hidden');
      $("#cambiandoGenerales").removeClass('hidden');
      $("#cambiandoGenerales").text('Apellido materno: '+apellidoM);
    }else{
      $("#infoGeneral").addClass('hidden');
      $("#cambiandoGenerales").addClass('hidden');
    }
  });
}
function addBio(){
  var peso = $("#bioPeso").val();
  var altura = $("#bioAltura").val();
  var tipoS = $("#bioSangre").val();
  var genero = $("#bioGenero :selected").val();
  $("#confirmacionBio").addClass('hidden');
  $.post('/addBio',{
    peso: peso,
    altura: altura,
    tipoS: tipoS,
    genero: genero
  },function(data){
    if( data ){
      $("#bioPeso").attr('value','');
      $("#bioAltura").attr('value','');
      $("#bioSangre").attr('value','');
      $("#bioGenero").attr('value','0');
      $("#confirmacionBio").removeClass('hidden');
      loadBiometricos();
    }else{
      $("#negadoBio").removeClass('hidden');
    }
  });
}
function deleteBio(id){
  var id = $(id).attr('oculto');
  $.post('/deleteBio',{id:id},function(data){
    if( data == "OK"){
      $("#delBio").removeClass('hidden');
      $("#confirmacionBio").addClass('hidden');
      loadBiometricos();
    }else{
      console.log("NO se borro");
    }
  });
}
function deleteFon(id){
  var id = $(id).attr('oculto');
  $.post('/deleteFon',{id:id},function(data){
    if( data == "OK" ){
      $("#deleFon").removeClass('hidden');
      loadTelefonos();
    }else{
      console.log("NO SE PUDO ELIMINAR EL CONTACTO")
    }
  });
}
function addTelefon(){
  var nombreCon = $("#bioNombretel").val();
  var tel = $("#bioTel").val();
  var es_medico;
  if( $("#esMedic:checked").val() == 1 ){
    es_medico = 1;
  }else{
    es_medico = 0;
  }
  var idPaciente;
  //consulta a paciente para traer id
  $.post('/postPaciente',function(data){
    idPaciente = JSON.stringify(data.id);
    $.post('/addTelefon',{
      nombre: nombreCon,
      tel: tel,
      medico:es_medico,
      paciente_id: idPaciente
    },function(datas){
      if( datas != null ){
        $("#telAdd").removeClass('hidden');
        loadTelefonos();
      }else{
        console.log("ERROR AL AGREGAR EL CONTACTO");
      }
    });
  });
}

function agregarClinica(){
  var addClin = $('#addClin').val();
  if (addClin && addClin != ""){
    $('#sortableClinica').append(`
      <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
      <div class="menuDiv">
        <span>
          <span data-id="2" class="itemTitle">`+ addClin +`</span>
          <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
          <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
        </span>
      </div>
      </li>`);
      $('#addClin').val('');
  } else {
    //Input de agregar clinica vacio
  }
  $('#addClin').focus();
}


function agregarAseguradora(){
  var addAseg = $('#addAseg').val();
  if (addAseg && addAseg != ""){
    $('#sortableAseguradora').append(`
      <li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
      <div class="menuDiv">
        <span>
          <span data-id="2" class="itemTitle">`+ addAseg +`</span>
          <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
          <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
        </span>
      </div>
      </li>`);
      $('#addAseg').val('');
  } else {
    //Input de agregar clinica vacio
  }
  $('#addAseg').focus();
}

function cargarExpertoEn(){
  $.ajax( {
    async: false,
    url: '/medicos/expertoTraer',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        var listaNueva = '';
        if (data.result){
          var sub = false;
          var ol = false;
          var li = false;
          data.result.forEach(function(rec){
            if (!rec.padre_id){
              if (ol){
                listaNueva += '</ol>';
                ol = false;
              }
              if (li){
                listaNueva += '</li>';
              }
              li = true;
              listaNueva += `<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
              <div class="menuDiv">
                <span>
                  <span data-id="2" class="itemTitle">`+ rec.expertoen +`</span>
                  <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                  <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                </span>
              </div>`;
            } else {
              if (!ol){
                listaNueva += '<ol>';
                ol = true;
              }
              listaNueva += `<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
              <div class="menuDiv">
                <span>
                  <span data-id="2" class="itemTitle">`+ rec.expertoen +`</span>
                  <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                  <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
                </span>
              </div>
              </li>`;
            }
          });
          if (sub){
            listaNueva += '</li></ol>';
          }
        }
        $('#sortableExpertoEn').html(listaNueva);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function cargarClinicas(){
  $.ajax( {
    async: false,
    url: '/medicos/clinicasTraer',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        var listaNueva = '';
        if (data.result){
          console.log('CLINICAS: ' + JSON.stringify(data));
          var sub = false;
          data.result.forEach(function(rec){
            listaNueva += `<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
            <div class="menuDiv">
              <span>
                <span data-id="2" class="itemTitle">`+ rec.clinica +`</span>
                <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
              </span>
            </div>
            </li>`;
          });
        }
        $('#sortableClinica').html(listaNueva);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  });
}

function cargarAseguradoras(){
  $.ajax( {
    async: false,
    url: '/medicos/aseguradorasTraer',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        var listaNueva = '';
        if (data.result){
          console.log('ASEGURADORAS: ' + JSON.stringify(data));
          var sub = false;
          data.result.forEach(function(rec){
            listaNueva += `<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">
            <div class="menuDiv">
              <span>
                <span data-id="2" class="itemTitle">`+ rec.aseguradora +`</span>
                <span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">
                <span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>
              </span>
            </div>
            </li>`;
          });
        }
        $('#sortableAseguradora').html(listaNueva);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  });
}


function guardarClinicas(){
  var clinicas = [];
  var last = 0;
  $('#sortableClinica .menuDiv').each(function(){
    clinicas.push({
      num: last,
      val: $(this).find('.itemTitle').text()
    });
    last++;
  });
  $.ajax( {
    async: false,
    url: '/medicos/clinicasActualizar',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'clinicas': clinicas
    },
    success: function ( data ) {
      if (data.success){
        setTimeout(function(){
          traerClinicas();
        },500);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}


function guardarAseguradoras(){
  var aseguradoras = [];
  var last = 0;
  $('#sortableAseguradora .menuDiv').each(function(){
    aseguradoras.push({
      num: last,
      val: $(this).find('.itemTitle').text()
    });
    last++;
  });
  $.ajax( {
    async: false,
    url: '/medicos/aseguradorasActualizar',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'aseguradoras': aseguradoras
    },
    success: function ( data ) {
      if (data.success){
        setTimeout(function(){
          traerAseguradoras();
        },500);
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function traerClinicas(){
    $.ajax( {
      async: false,
      url: '/medicos/clinicasTraer',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        if (data.success){
          var listaNueva = '<ul>';
          if (data.result){
            var sub = false;
            data.result.forEach(function(rec){
              listaNueva += '<li>'+ rec.clinica +'</li>';
            });
          }
          listaNueva += '</ul>';
          $('#divClinicas').html(listaNueva);
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
}

function traerAseguradoras(){
    $.ajax( {
      async: false,
      url: '/medicos/aseguradorasTraer',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        if (data.success){
          var listaNueva = '<ul>';
          if (data.result){
            var sub = false;
            data.result.forEach(function(rec){
              listaNueva += '<li>'+ rec.aseguradora +'</li>';
            });
          }
          listaNueva += '</ul>';
          $('#divAseg').html(listaNueva);
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
  }

//Registrar Ubicacion
function guardarUbicacionPaciente() {
    var latitud = '', longitud = '';
    var slc_estados='',slc_ciudades='',slc_colonias = '';
    latitud = $('#latitud').val();
    longitud = $('#longitud').val();
    slc_estados = $('#slc_estados_mapa').val();
    slc_ciudades = $('#slc_ciudades_mapa').val();
    slc_colonias = $('#slc_colonias_mapa').val();

    UbicData = {
      latitud: latitud,
      longitud: longitud,
      municipio_id: slc_ciudades,
      principal: 1
    }

    if (latitud != '' && longitud != '' && slc_estados != '' && slc_ciudades != ''){
      if (slc_colonias>0){
        UbicData['localidad_id'] = slc_colonias;
      }

      $.ajax({
          url: '/registrarubicacionPaciente',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: UbicData,
          type: 'POST',
          success: function (data) {
            if (data.success){
              bootbox.alert({
                message: "Tu ubicación ha sido guardada.",
                title: "Ubicación guardada"
              });
            }
          },
          error: function (err) {
              console.error('AJAX ERROR: (registro 166) : ' + JSON.stringify(err));
          }
      });
    } else {
      var mensaje = '';
      if (latitud == '' || longitud == ''){
        mensaje = 'la posición de su ubicación';
      } else if (slc_estados == ''){
        mensaje = 'el estado';
      } else {
        mensaje = 'el municipio o ciudad';
      }
      bootbox.alert({
        message: "Es necesario indicar " + mensaje + " para el registro de su dirección.",
        title: "No se puede guardar la ubicación"
      });
    }
}

function verificarCurpCedula(){
  var curp = $('#curpRegMed').val();
  var cedula = $('#cedulaRegMed').val();
}


function cargarListaEspCol( usuario ) {
  $.ajax( {
    async: false,
    url: '/cargarListaEspCol',
    type: 'POST',
    data: {
      usuario: usuario
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $('#especialidadesList').html('');
      $('#tipoFiltro').html('una especialidad');
      if ( data.success ) {
        var contenido = '';
        var primero = '';
        data.result.forEach(function(esp){
          if (primero == ""){
            primero = esp.id;
          }
          contenido += `<li>
            <a onclick="cargarListaColegasByEsp('`+usuario+`','`+ esp.id +`')">`+ esp.especialidad +` <span class="badge pull-right">`+ esp.total +` </span></a>
          </li>`;
        });
        $('#especialidadesList').html(contenido);
        if (primero != ""){
          cargarListaColegasByEsp(usuario,primero);
        }
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function cargarListaColegasByEsp(usuario_id,especialidad_id){
  $.ajax( {
    async: false,
    url: '/cargarListaColegasByEsp',
    type: 'POST',
    data: {
      usuario_id: usuario_id,
      especialidad_id: especialidad_id
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $('#listaColegas').html('');
      if ( data.success ) {
        var contenido = '';
        contenido += '<div id="'+ data.especialidad.especialidad +'" class="row" ><h1 class="h67-medcond">'+data.especialidad.especialidad+'</h1>';
        data.result.forEach(function(res){
          var especialidad= '';
          res.Medico.MedicoEspecialidads.forEach(function(esp){
            if (especialidad != ""){
              especialidad += ', ';
            }
            especialidad += esp.Especialidad.especialidad;
          });
          contenido += `
          <div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
            <div class="thumbnail">
              <div >
                <a class="pPic" href="/perfil/`+ res.usuarioUrl +`"><img src="`+ res.urlFotoPerfil +`" alt="..."></a>
              </div>
              <div class="caption">
                <div class="nombre h77-boldcond">
                  Dr.&nbsp;<span>`+ res.DatosGenerale.nombre +`</span>&nbsp;<span>`+ res.DatosGenerale.apellidoP +` `+ res.DatosGenerale.apellidoM +`</span>
                </div>
                <div class="esp h67-medcond">
                  <span class="colEsp">`+ especialidad +`</span>
                </div>
                <a class="h67-medcondobl" href="/perfil/`+ res.usuarioUrl +`">Ver Perfil</a>
              </div>
            </div>
          </div>`
        })
        contenido += '</div>';
        $('#listaColegas').html(contenido);
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}


function cargarListaAlfCol( usuario ) {
  $.ajax( {
    async: false,
    url: '/cargarListaAlfCol',
    type: 'POST',
    data: {
      usuario: usuario
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
        $('#especialidadesList').html('');
        $('#tipoFiltro').html('una letra');
        if ( data.success ) {
          var contenido = '';
          var primero = '';
          data.result.forEach(function(rec){
            if (primero == ""){
              primero = rec.Letra;
            }
            contenido += `<li>
              <a onclick="cargarListaColegasByAlf('`+usuario+`','`+ rec.Letra +`')">`+ rec.Letra +` <span class="badge pull-right">`+ rec.Total +` </span></a>
            </li>`;
          });
          $('#especialidadesList').html(contenido);
          if (primero != ""){
            cargarListaColegasByAlf(usuario,primero);
          }
        }else{
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function cargarListaColegasByAlf(usuario_id,letra){
  $.ajax( {
    async: false,
    url: '/cargarListaColegasByAlf',
    type: 'POST',
    data: {
      usuario_id: usuario_id,
      letra: letra
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $('#listaColegas').html('');
      if ( data.success ) {
        var contenido = '';
        contenido += '<div id="'+ letra +'" class="row" ><h1 class="h67-medcond">'+letra+'</h1>';
        data.result.forEach(function(res){
          var especialidad= '';
          if (res.Medico.MedicoEspecialidads){
            res.Medico.MedicoEspecialidads.forEach(function(esp){
              if (especialidad != ""){
                especialidad += ', ';
              }
              especialidad += esp.Especialidad.especialidad;
            });
          }
          contenido += `
          <div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
            <div class="thumbnail">
              <div >
                <a class="pPic" href="/perfil/`+ res.usuarioUrl +`"><img src="`+ res.urlFotoPerfil +`" alt="..."></a>
              </div>
              <div class="caption">
                <div class="nombre h77-boldcond">
                  Dr.&nbsp;<span>`+ res.DatosGenerale.nombre +`</span>&nbsp;<span>`+ res.DatosGenerale.apellidoP +` `+ res.DatosGenerale.apellidoM +`</span>
                </div>
                <div class="esp h67-medcond">
                  <span class="colEsp">`+ especialidad +`</span>
                </div>
                <a class="h67-medcondobl" href="/perfil/`+ res.usuarioUrl +`">Ver Perfil</a>
              </div>
            </div>
          </div>`
        })
        contenido += '</div>';
        $('#listaColegas').html(contenido);
      }else{
        if (data.error){
          manejadorDeErrores(data.error);
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}
