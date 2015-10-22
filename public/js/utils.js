/**
 *   Archivo creado por Cinthia
 *
 */
var regTotalDoc = 0,
  notificaciones = [],
  socket;

if ( location.pathname === '/registro' ) {
  $( document ).ready( getAllDoctors() );
}
else {
  $( document ).ready( function () {
    socketNotificaciones();

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
      actualizarSesion();
      if ( $( '#tipoUsuario' ).val() === "M" ) {
        informacionRegistroMedico();
      }
    }

    if ( location.pathname.substring( 0, 7 ) === '/perfil' ) {
      cargarFavCol( $( '#usuarioPerfil' ).val() );
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

function informacionRegistroMedico() {
  $.ajax( {
    async: true,
    url: '/informacionRegistroMedico',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $( "#step1" ).hide();
      $( "#step2" ).hide();
      $( "#step3" ).hide();
      var continuar = true;
      //PASO 1 de 3 (falta fecha de nacimiento)
      if ( data.DatosGenerale ) {
        document.getElementById( 'nombreRegMed' ).value = data.DatosGenerale.nombre;
        document.getElementById( 'apePatRegMed' ).value = data.DatosGenerale.apellidoP;
        document.getElementById( 'apeMatRegMed' ).value = data.DatosGenerale.apellidoM;
      }
      else continuar = false;
      if ( data.Biometrico ) {
        if ( data.Biometrico.genero == "F" ) document.getElementById( "sexF" ).checked = true;
        else if ( data.Biometrico.genero == "M" ) document.getElementById( "sexM" ).checked = true;
      }
      else continuar = false;
      if ( data.Medico && data.Medico.curp) {
        document.getElementById( 'curpRegMed' ).value = data.Medico.curp;
        document.getElementById( 'cedulaRegMed' ).value = data.Medico.cedula;
      }
      else continuar = false;
      i = 0;

      //Pasar al paso 2 de 3 (Datos de págo)
      if ( continuar ) {
        goToNextStep( i++ );
      }

      if ( data.Medico.pago == 0 ) {
        continuar = false;
      }

      //Pasar al paso 3 de 3 (Datos de facturación)
      if ( continuar ) {
        goToNextStep( i++ );
      }

      if ( data.DatosFacturacion ) {
        document.getElementById( 'nomRSocialFact' ).value = data.DatosFacturacion.razonSocial;
        document.getElementById( 'rfcFact' ).value = data.DatosFacturacion.RFC;
        if ( data.DatosFacturacion.Direccion ) {
          document.getElementById( 'calleFact' ).value = data.DatosFacturacion.Direccion.calle;
          document.getElementById( 'numeroFact' ).value = data.DatosFacturacion.Direccion.numero;
          if ( data.DatosFacturacion.Direccion.Localidad ) {
            document.getElementById( 'slc_estados' ).value = data.DatosFacturacion.Direccion.Localidad.estado_id;
            obtenerCiudades();
            setTimeout( function () {
              document.getElementById( 'slc_ciudades' ).value = data.DatosFacturacion.Direccion.Localidad.ciudad_id;
              obtenerColonias();
              setTimeout( function () {
                document.getElementById( 'slc_colonias' ).value = data.DatosFacturacion.Direccion.Localidad.id;
                document.getElementById( 'nmb_cp' ).value = data.DatosFacturacion.Direccion.Localidad.CP;
              }, 1000 );
            }, 1000 );

          }
          else continuar = false;
        }
        else continuar = false;
      }
      else continuar = false;

      $( "#RegMedModal" ).modal( "show" );

    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function saveStepOne() {
  $.ajax( {
    url: '/regMedPasoUno',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: $( '#regMedStepOne' ).serialize(),
    success: function ( data ) {
      if ( data.result === "success" ) {
        actualizarSesion();
        goToNextStep( 0 );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  } );
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
        goToNextStep( 1 );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 166) : ' + err );
    }
  } );
}

function saveStepTree() {
  $.ajax( {
    url: '/regMedPasoTres',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: $( '#regMedStepThree' ).serialize(),
    success: function ( data ) {
      if ( data.result === "success" ) {
        actualizarSesion();
        $( "#RegMedModal" ).modal( "hide" );
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
        console.log( 'DATA ' + data.result );
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
      success: function ( data ) {
        document.getElementById( "frmRegMed" ).reset();
        data.forEach( function ( record ) {
          addMedico( record );
        } );
      },
      error: function ( jqXHR, textStatus, err ) {
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
    success: function ( data ) {
      data.forEach( function ( record ) {
        addMedico( record );
      } );
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: (registro 196) : ' + err );
    }
  } );
}

function addMedico( record ) {
  var entreCalles = '',
    medicosRegistrados = '';
  if ( record.calle1Med && record.calle2Med ) {
    var conjucion = 'y';
    if ( record.calle2Med.length > 0 && record.calle2Med.toLowerCase().substring( 0, 1 ) === 'i' ) conjucion = 'e';
    entreCalles = 'Entre ' + record.calle1Med + ' ' + conjucion + ' ' + record.calle2Med;
  }
  try {
    // muestra los médicos con la funcionalidad de actualizar médico
    medicosRegistrados += '<tr><th scope="row">' + ( ++regTotalDoc ) + '</th><td>' + record.nombreMed + ' ' + record.apellidoMed + '</td><td>' + record.correoMed + '</td><td>' + record.telefonoMed + '</td><td><address><strong>' + record.calleMed + ' #' + record.numeroMed + '</strong><br>' + entreCalles + ' <br>' + record.coloniaMed + ', CP:' + record.cpMed + '<br>' + record.ciudadMed + ', ' + record.estadoMed + '<br></address></td><td>' + record.especialidadMed + '</td><td><button class="btn btn-info" onclick="muestraMedico(' + record.id + '); return false;"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
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
    if ( document.getElementById( inputs[ i ] ).value.length <= 0 ) {
      valid = false;
      break;
    }
  }
  return valid;
}

function obtenerCiudades() {
  document.getElementById( 'slc_ciudades' ).innerHTML = '<option value="">Ciudad</option>';
  $.ajax( {
    url: '/obtenerCiudades',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'estado_id': document.getElementById( 'slc_estados' ).value
    },
    success: function ( data ) {
      data.ciudades.forEach( function ( record ) {
        document.getElementById( 'slc_ciudades' ).innerHTML += '<option value="' + record.id + '">' + record.ciudad + '</option>';
      } );
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function obtenerColonias() {
  document.getElementById( 'slc_colonias' ).innerHTML = '<option value="">Colonia</option>';
  $.ajax( {
    url: '/obtenerLocalidades',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {
      'estado_id': document.getElementById( 'slc_estados' ).value,
      'ciudad_id': document.getElementById( 'slc_ciudades' ).value
    },
    success: function ( data ) {
      data.localidades.forEach( function ( record ) {
        document.getElementById( 'slc_colonias' ).innerHTML += '<option value="' + record.id + '">' + record.localidad + '</option>';
      } );
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
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
      document.getElementById( 'nmb_cp' ).value = data.cp;
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
              console.log( "Cambio pade" + cambioPadecimiento );
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
              console.log( "Cambio alergia" + cambioAlergia );
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
      console.log( "EXITOSO" );
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

// script para los intervalos del carousel
$( document ).ready( function () {
  $( '.carousel' ).carousel( {
    interval: 5000
  } );
} );

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

function validateForm( tipoForm, nameForm ) {
  var comprobando = false;
  $( document ).ready( function () {
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
            console.log( "STRING:" + dato );
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
  } );
} // fin de la funcion principal
//<---------------------------------------------------->

$( '#CambiarFotoPerfil' ).on( 'hidden.bs.modal', function ( e ) {
  $( '#imageFile' ).val( '' );
} )

var base64file;

$( function () {
  $( '#imageFile' ).change( function () {
    base64file = '';
    var tamanio = $( this )[ 0 ].files[ 0 ].size;
    if ( tamanio < 1048576 ) {
      $( '#btnCrop' ).hide();
      $( '#CambiarFotoPerfil' ).modal( "show" );
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

$( document ).ready( function MakeWizard() {
  $( "#RegMedModal" ).formToWizard()
} );

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
      if ( data.result == 'success' ) {
        if ( $( '#tipoUsuario' ).val() === "P" ) {
          if ( medicoID ) {
            $( '#addFavoriteContact' ).html( 'Eliminar de favoritos' );
          }
          else {
            $( '#addFavoriteContact' ).html( 'Invitación enviada' );
          }
        }
        else if ( $( '#tipoUsuario' ).val() === "M" ) {
            if ( medicoID ) {
              $( '#addFavoriteContact' ).html( 'Invitación enviada' );
            }
        }
        $( "#addFavoriteContact" ).attr( "onclick", "eliminarFavoritos()" );

        cargarFavCol( $( '#usuarioPerfil' ).val() );
      }
      else {
        alert( 'Error al guardar medico favorito' );
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function eliminarFavoritos( medico, paciente_id , notificacion_id) {
  console.log('ENTRO');
  var ruta = '/eliminarMedFav';
  var medicoID = '',
    pacienteID = '';
  if ( $( '#MedicoId' ).val() ) medicoID = $( '#MedicoId' ).val();
  if ( $( '#PacienteId' ).val() ) pacienteID = $( '#PacienteId' ).val();
  if ( !medico && paciente_id ) pacienteID = paciente_id;
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
      if ( data.result == 'success' ) {
        if ( $( '#tipoUsuario' ).val() === "P" ) {
          if ( medicoID ) {
            $( '#addFavoriteContact' ).html( 'Agregar a favoritos' );
          }
          else {
            $( '#addFavoriteContact' ).html( 'Agregar a contactos' );
          }
        }
        else if ( $( '#tipoUsuario' ).val() === "M" ) $( '#addFavoriteContact' ).html( 'Agregar a colegas' );
        $( "#addFavoriteContact" ).attr( "onclick", "agregarFavoritos()" );
        cargarFavCol( $( '#usuarioPerfil' ).val() );
        if ( notificacion_id ) {
          $( '#pre' + notificacion_id ).html( 'Rechazaste la solicitud de amistad de ' );
          $( '#post' + notificacion_id ).html( '' );
          for ( var x in solicitudAmistad ) {
            if ( solicitudAmistad[ x ].id == notificacion_id ) {
              $( '#button' + notificacion_id ).html( '' );
              solicitudesRechazadas.unshift( {
                id: solicitudAmistad[ x ].id,
                time: solicitudAmistad[ x ].time,
                visto: solicitudAmistad[ x ].visto,
                content: $( '#li' + notificacion_id ).html()
              } );
              solicitudAmistad.splice( x, 1 );
              actualizarNotificaciones();
            }
          }
        }
      }
      else {
        alert( 'Error al guardar medico favorito' );
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
            $( "#FavColPanel .contList" ).append(
              "<li class='media contList-profile'>" +
              "<div class='media-left contList-profilePic'>" +
              "<a class='contList-profileName' href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'><img class='media-object contList-profilePicImg' src='" + data[ p ].Medico.Usuario.urlFotoPerfil + "'></a>" +
              "</div>" +
              "<div class='media-body contList-profileBody'> " +
              "<a class='contList-profileName' href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'> Dr. " + data[ p ].Medico.Usuario.DatosGenerale.nombre + " " + data[ p ].Medico.Usuario.DatosGenerale.apellidoP + " " + data[ p ].Medico.Usuario.DatosGenerale.apellidoM + "</a><br>" +
              "<a class='contList-profileEsp' href='http://" + window.location.host + "/perfil/" + data[ p ].Medico.Usuario.usuarioUrl + "'> " + data[ p ].Medico.Usuario.Especialidad + "</a>" +
              "</div>" +
              "<div class='media-right contList-profileAction'>" +
              "<a class='contList-profileActionLink Flama-bold s15'>Recomendar</a>" +
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

//Funcion que previene que un carousel gire
$( function () {
  $( '#vCard' ).carousel( 'pause' );
  $( '#vCard' ).carousel( {
    interval: false
  } );
} );

$( function () {
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
} );

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
          for ( var x in solicitudAmistad ) {
            if ( solicitudAmistad[ x ].id == notificacion_id ) {
              $( '#button' + notificacion_id ).html( '' );
              solicitudesAceptadas.unshift( {
                id: solicitudAmistad[ x ].id,
                time: solicitudAmistad[ x ].time,
                visto: solicitudAmistad[ x ].visto,
                content: $( '#li' + notificacion_id ).html()
              } );
              solicitudAmistad.splice( x, 1 );
              actualizarNotificaciones();
            }
          }
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function socketNotificaciones() {
  //Manejar notificaciones
  $.ajax( {
    url: '/notificaciones',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if ( data ) {
        notificaciones.forEach( function ( notificacion ) {
          clearInterval( notificacion.id );
        } );
        notificaciones = [];


        if ( Object.prototype.toString.call( data ) === '[object Array]' ) {
          if ( data ) {
            socket = io();
            data.forEach( function ( record ) {
              if ( record.interno || record.push || record.mail ) {
                socket.emit( record.tipo );
                console.log( '[' + new Date().toLocaleString().substring( 0, 18 ) + '] Revisar: ' + record.tipo );

                var idInterval = setInterval(
                  function () {
                    try {
                      socket.emit( record.tipo );
                      console.log( '[' + new Date().toLocaleString().substring( 0, 18 ) + '] Revisar: ' + record.tipo );
                    }
                    catch ( err ) {
                      console.log( 'No se puede conectar con el servidor' );
                    }
                  }, ( parseInt( record.intervalo ) * 1000 ) );
                notificaciones.push( {
                  id: idInterval,
                  tipo: record.tipo,
                  interno: record.interno,
                  push: record.push,
                  mail: record.mail
                } );
              }
            } );
            socketManejadores();
          }
        }
      }
    },
    error: function ( jqXHR, textStatus, err ) {
      console.error( 'AJAX ERROR: ' + err );
    }
  } );
}

function formattedDate( date ) {
  date = new Date( date );
  date = date.toString();
  var months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];

  var d1 = new Date( date || Date.now() ),
    month1 = d1.getMonth();
  day1 = '' + d1.getDate(),
    year1 = d1.getFullYear(),
    hour1 = '' + d1.getHours(),
    minutes1 = '' + d1.getMinutes(),
    seconds1 = '' + d1.getSeconds();

  if ( day1.length < 2 ) day1 = '0' + day1;
  if ( hour1.length < 2 ) hour1 = '0' + hour1;
  if ( minutes1.length < 2 ) minutes1 = '0' + minutes1;
  if ( seconds1.length < 2 ) seconds1 = '0' + seconds1;

  var fechaNotificacion = Date.UTC( year1, month1, day1, hour1, minutes1, seconds1 );

  var d = new Date();
  var fechaActual = Date.UTC( d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() );

  var dif = fechaActual - fechaNotificacion;

  var Horas = Math.floor( dif / ( 1000 * 60 * 60 ) );
  if ( Horas == 0 ) {
    var minutos = Math.floor( dif / ( 1000 * 60 ) );
    if ( minutos > 1 )
      return 'hace ' + minutos + ' minutos';
    else
      return 'hace 1 minuto';
  }
  else if ( Horas < 24 ) {
    return 'hace ' + Horas + ' horas';
  }
  else {
    return day1 + ' de ' + months[ month1 ] + ' a las ' + hour1 + ':' + minutes1;
  }
}

function actualizarNotificaciones() {
  $( '#notificacinesList' ).html( '' );
  $( '#totalNotificaciones' ).html( '' );
  $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
  totalNotificaciones = [];
  totalNotificaciones = totalNotificaciones.concat( solicitudAmistad );
  totalNotificaciones = totalNotificaciones.concat( solicitudAmistadAceptada );
  totalNotificaciones = totalNotificaciones.concat( solicitudesAceptadas );
  totalNotificaciones = totalNotificaciones.concat( agregadoMedicoFavorito );
  totalNotificaciones = totalNotificaciones.concat( solicitudesRechazadas );
  totalNotificaciones = totalNotificaciones.sort( ordenarPorFecha );
  if ( totalNotificaciones.length > 0 ) {
    $( '#totalNotificaciones' ).removeClass( 'hidden invisible' );
    var total = 0;
    totalNotificaciones.forEach( function ( notificacion ) {
      if ( notificacion.toString() != "undefined" ) {
        if ( notificacion.visto == 1 ) {
          $( '#notificacinesList' ).append( '<li class="media" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
        }
        else {
          $( '#totalNotificaciones' ).html( ++total );
          $( '#notificacinesList' ).append( '<li class="media" style="background-color:#DDD" id="li' + notificacion.id + '">' + notificacion.content + '</li>' );
        }
      }
    } );
  }
}

function ordenarPorFecha( a, b ) {
  var c = new Date( a.time );
  var d = new Date( b.time );
  return d - c;
}

var totalNotificaciones = [],
  solicitudAmistad = [],
  solicitudAmistadAceptada = [],
  solicitudesAceptadas = [],
  agregadoMedicoFavorito = [],
  solicitudesRechazadas = [];

function socketManejadores() {

  function borrarNotificaciones() {
    $( '#totalNotificaciones' ).html( '' );
    $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
    socket.emit( 'verNotificaciones' );
    totalNotificaciones.forEach( function ( notificacion ) {
      notificacion.visto = 1;
    } );
  }

  socket.on( 'solicitudAmistad', function ( data ) {
    solicitudAmistad = [];
    data.forEach( function ( record ) {
      date = formattedDate( record.inicio );
      if (record.paciente){
        content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(' + record.paciente_id + ',0,' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ',' + record.id + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
      } else if (record.medico){
        content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body"><span id="pre' + record.id + '"></span>' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' <span id="post' + record.id + '">quiere ser tu amigo en Intermed</span></a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div><div class="media-right" id="button' + record.id + '"><button type="button" class="btn btn-success btn-xs" onclick="aceptarInvitacion(0,' + record.medico_id + ',' + record.id + ')" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button><button type="button" class="btn btn-danger btn-xs" onclick="eliminarFavoritos(false, ' + record.paciente_id + ','+ record.id +')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span></button></div>';
      }
      if (content){
        solicitudAmistad.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: content
        } );
      }
    } );
    actualizarNotificaciones();
  } );

  socket.on( 'solicitudAmistadAceptada', function ( data ) {
    solicitudAmistadAceptada = [];
    data.forEach( function ( record ) {
    date = formattedDate( record.inicio );
    var content = '';
    if (record.paciente){
      content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
    } else if (record.medico){
      console.log('solicitudAmistadAceptada: ' + JSON.stringify(data));
      content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + ' aceptó tu solicitud de amistad</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
    }
    if (content){
      solicitudAmistadAceptada.unshift( {
        id: record.id,
        time: record.inicio,
        visto: record.visto,
        content: content
      } );
    }
    } );
    actualizarNotificaciones();
  } );

  socket.on( 'solicitudesAceptadas', function ( data ) {
    solicitudesAceptadas = [];
    data.forEach( function ( record ) {
      date = formattedDate( record.inicio );
      var content = '';
      if (record.paciente){
        content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      } else if (record.medico){
        content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Aceptaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      }
      if (content){
        solicitudesAceptadas.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: content
        } );
      }
    } );
    actualizarNotificaciones();
  });

  socket.on( 'solicitudRechazada', function ( data ) {
    solicitudesRechazadas = [];
    data.forEach( function ( record ) {
      date = formattedDate( record.inicio );
      var content = '';
      if (record.paciente){
        content = '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      } else if (record.medico){
        content = '<div class="media-left"><a href= "/perfil/' + record.medico.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.medico.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">Rechazaste la solicitud de amistad de ' + record.medico.Usuario.DatosGenerale.nombre + ' ' + record.medico.Usuario.DatosGenerale.apellidoP + ' ' + record.medico.Usuario.DatosGenerale.apellidoM + '</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>';
      }
      if (content){
        solicitudesRechazadas.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: content
        } );
      }
    } );
    actualizarNotificaciones();
  });

  socket.on('agregadoMedicoFavorito', function ( data ) {
    agregadoMedicoFavorito = [];
    data.forEach( function ( record ) {
      if ( record.paciente ) {
        date = formattedDate( record.inicio );
        agregadoMedicoFavorito.unshift( {
          id: record.id,
          time: record.inicio,
          visto: record.visto,
          content: '<div class="media-left"><a href= "/perfil/' + record.paciente.Usuario.usuarioUrl + '"><img class="media-object" src="' + record.paciente.Usuario.urlFotoPerfil + '" style="width: 50px;"></div><div class="media-body">El paciente ' + record.paciente.Usuario.DatosGenerale.nombre + ' ' + record.paciente.Usuario.DatosGenerale.apellidoP + ' ' + record.paciente.Usuario.DatosGenerale.apellidoM + ' te agregó a sus médicos favoritos</a><br/><div class="text-left" style="margin-top:-25px;"><span style="font-size: 60%" class="glyphicon glyphicon-time" > ' + date + '</span></div></div>'
        } );
      }
    } );
    actualizarNotificaciones();
  });

  socket.on( 'verNotificaciones', function ( data ) {
    $( '#totalNotificaciones' ).html( '' );
    $( '#totalNotificaciones' ).addClass( 'hidden invisible' );
    totalNotificaciones.forEach( function ( notificacion ) {
      notificacion.visto = 1;
    } );
    setTimeout( function () {
      actualizarNotificaciones();
    }, 3000 );

  } );
}
