/**
* Todas las funciones cargadas en el $(document).ready();
* o funciones que las pueden llamar donde sea
**/
var regTotalDoc = 0;
var base_url = 'http://localhost:3000/';
var default_urlFotoPerfil = '/garage/profilepics/dpp.png';
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

    if ( location.pathname.substring( 0, 7 ) === '/perfil' ) {
      cargarFavCol( $( '#usuarioPerfil' ).val() );
    }

    /* validaciones al registro */
    validateForm( 'input-nombre', 'nombreMed' );
    validateForm('input-select', 'selectEstado');
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
      case "input-especialidad":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "especialidad-error";
        break;
      case "input-padecimiento":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "padecimiento-error";
        break;
      case "input-institucion":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "institucion-error";
        break;
      case "input-aseguradora":
        var m = $( "#" + nameForm ).val();
        var expreg = new RegExp( /^[A-Za-z\s\xF1\xD1]([a-z ñáéíóú]{2,60})+$/i );
        comprobando = expreg.test( m ) ? true : false;
        mensaje = "aseguradora-error";
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
        case "input-confMail":
          var correo = String( $( "#" + nameForm ).val() );
          var expreg = new RegExp( /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm );
          comprobando = expreg.test( correo ) ? true : false;
          mensaje = "conFmail-error";
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
      case "input-select":console.log("Entro aqui");
        var tamaño = $("#"+nameForm+" :selected").val();
        comprobando = ( $( tamaño ).val() != 0 ) ? true : false;
        console.log("Tamaño: "+tamaño);
        mensaje = "select-error";
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
            case "especialidad-error":
              $( "#aviso-error" ).remove();
              $( "#especialidadGroup" ).removeClass( 'has-error has-feedback' );
              $( '#especialidadIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#especialidadGroup" ).addClass( 'has-success has-feedback' );
              $( '#especialidadIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "padecimiento-error":
              $( "#aviso-error" ).remove();
              $( "#padecimientoGroup" ).removeClass( 'has-error has-feedback' );
              $( '#padecimientoIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#padecimientoGroup" ).addClass( 'has-success has-feedback' );
              $( '#padecimientoIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "institucion-error":
              $( "#aviso-error" ).remove();
              $( "#institucionGroup" ).removeClass( 'has-error has-feedback' );
              $( '#institucionIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#institucionGroup" ).addClass( 'has-success has-feedback' );
              $( '#institucionIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "aseguradora-error":
              $( "#aviso-error" ).remove();
              $( "#aseguradoraGroup" ).removeClass( 'has-error has-feedback' );
              $( '#aseguradoraIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#aseguradoraGroup" ).addClass( 'has-success has-feedback' );
              $( '#aseguradoraIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "select-error":
              $( "#aviso-error" ).remove();
              $( "#selectGroup" ).removeClass( 'has-error has-feedback' );
              $( '#selectIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#selectGroup" ).addClass( 'has-success has-feedback' );
              $( '#selectIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
              break;
            case "select-error":
              $( "#aviso-error" ).remove();
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
            case "conFmail-error":
              $( "#aviso-error" ).remove();
              $( "#emailGroup" ).removeClass( 'has-error has-feedback' );
              $( '#conemailIcon' ).removeClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#conemailGroup" ).addClass( 'has-success has-feedback' );
              $( '#conemailIcon' ).addClass( 'glyphicon glyphicon-ok form-control-feedback' );
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
            case "padecimiento-error":
              $( "#padecimientoGroup" ).addClass( 'has-error has-feedback' );
              $( '#padecimientoIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#padecimiento-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "especialidad-error":
              $( "#especialidadGroup" ).addClass( 'has-error has-feedback' );
              $( '#especialidadIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#especialidad-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "institucion-error":
              $( "#institucionGroup" ).addClass( 'has-error has-feedback' );
              $( '#institucionIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#institucion-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "aseguradora-error":
              $( "#aseguradoraGroup" ).addClass( 'has-error has-feedback' );
              $( '#aseguradoraIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#aseguradora-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
              break;
            case "select-error":
              $( "#selectGroup" ).addClass( 'has-error has-feedback' );
              $( '#selectIcon' ).addClass( 'glyphicon glyphicon-remove form-control-feedback' );
              $( "#select-error" ).html( '<div id = "aviso-error"><small><b>Error: El campo que esta intentando llenar, numeros, ni caracteres como los siguientes !\"·$%&/=¿¡\'\'?%\"\\</b></small></div>' );
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
$( function () {
  $( '[data-toggle="popover"]' ).popover()
} )
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
      $('#divTelefonoAgregado').append('<div class="input-group-btn numeroTelefono">'+
        '<input type="hidden" class="idTelefono" value="">' +
        '<input type="hidden" class="idTempTelefono" value="' + idTemp + '">' +
          '<label class="btn btn-sm editar btnChk">' +
            '<input type="radio" autocomplete="off">' +
            '<span class="tipoTelefono hidden">' + $('#tipoTelefono').val() + '</span>' +
            '<span class="tipoTelefonoIcon"><span class="glyphicon ' + clase + '"></span></span>' +
            '<span class="numTelefono">' + $('#numTelefono').val() + '</span>' +
            '<span class="extTelefono">' + ext + '</span>' +
          '</label>' +
          '<button class="btn btn-sm borrar" disabled="true" onclick="eliminarTelefono(this)">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
          '</button>' +
        '</div>'
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
function buscarInsMed(){
  $('#buscPag').html('');
  searchingData();
}
//<--------- FIN EDIT PERFIL MEDICO -------->

function CargarExtraBusqueda(){
  var tipo = $('#tipoBusqueda').prop('value');
  var cont = '';
  if (tipo == 1){
    //Buscar médicos
    cont +=
    '<div class="col-md-3">'+
      '<div class="form-group" id="especialidadGroup">'+
        '<div class="form-control" placeholder="Especialidad" style="height:auto!important;padding:2px">'+
          '<input type="hidden" id="hiddenEspecialidad" name="hiddenEspecialidad">'+
          '<input id="inputEspecialidad" class="autocompleteInput" placeholder="Especialidad" name="inputEspecialidad" aria-describedby="inputEspecialidadP">'+
          '<span id = "especialidadIcon" class="" aria-hidden="true"></span>'+
          '<span class="sr-only" id="inputEspecialidadP">(success)</span>'+
          '<div id = "especialidad-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    cont +=
    '<div class="col-md-3">'+
      '<div class="form-group" id="padecimientoGroup">'+
        '<div class="form-control" style="height:auto!important;padding:2px">'+
        '<input type="hidden" id="hiddenPadecimiento" name="hiddenPadecimiento">'+
        '<input id="inputPadecimiento" class="autocompleteInput" placeholder="Pacecimiento" name="inputPadecimiento" aria-describedby="inputPadecimientoP">'+
        '<span id = "padecimientoIcon" class="" aria-hidden="true"></span>'+
        '<span id="inputPadecimientoP" class="sr-only">(success)</span>'+
        '<div id = "padecimiento-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    cont +=
    '<div class="col-md-3">'+
      '<div class="form-group" id="institucionGroup">'+
        '<div class="form-control" style="height:auto!important;padding:2px">'+
        '<input type="hidden" id="hiddenInstitucion" name="hiddenInstitucion">'+
        '<input id="inputInstitucion" class="autocompleteInput" placeholder="Institución"  name="inputInstitucion" aria-describedby="inputInstitucionP">'+
        '<span id = "institucionIcon" class="" aria-hidden="true"></span>'+
        '<span class="sr-only" id="inputInstitucionP">(success)</span>'+
        '<div id = "institucion-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    cont +=
    '<div class="col-md-3">'+
      '<div class="form-group" id="aseguradoraGroup">'+
        '<div class="form-control" style="height:auto!important;padding:2px">'+
        '<input type="hidden" id="hiddenAseguradora" name="hiddenAseguradora">'+
        '<input id="inputAseguradora" class="autocompleteInput" placeholder="Aseguradora" name="inputAseguradora" aria-describedby="inputAseguradoraP">'+
        '<span id = "aseguradoraIcon" class="" aria-hidden="true"></span>'+
        '<span id="inputAseguradoraP" class="sr-only">(success)</span>'+
        '<div id = "aseguradora-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    $('#extraSearch').html(cont);
    autoCompleteEsp('inputEspecialidad');
    autoCompletePad('inputPadecimiento');
    autoCompleteInst('inputInstitucion');
    autoCompleteAseg('inputAseguradora');
    validateForm( 'input-especialidad', 'inputEspecialidad' );
    validateForm( 'input-padecimiento', 'inputPadecimiento' );
    validateForm( 'input-institucion', 'inputInstitucion' );
    validateForm( 'input-aseguradora', 'inputAseguradora' );
  } else if (tipo == 2){
    //Buscar instituciones
    cont +=
    '<div class="col-md-6">'+
      '<div class="form-group" id="especialidadGroup">'+
        '<div class="form-control" placeholder="Especialidad" style="height:auto!important;padding:2px">'+
        '<input type="hidden" id="hiddenEspecialidad" name="hiddenEspecialidad">'+
        '<input id="inputEspecialidad" class="autocompleteInput" placeholder="Especialidad" name="inputPadecimiento" aria-describedby="inputEspecialidadP">'+
        '<span id = "especialidadIcon" class="" aria-hidden="true"></span>'+
        '<span class="sr-only" id="inputEspecialidadP">(success)</span>'+
        '<div id = "especialidad-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    cont +=
    '<div class="col-md-6">'+
      '<div class="form-group">'+
        '<div class="form-control" style="height:auto!important;padding:2px">'+
        '<input type="hidden" id="hiddenPadecimiento" name="hiddenPadecimiento">'+
        '<input id="inputPadecimiento" class="autocompleteInput" placeholder="Pacecimiento" name="inputPadecimiento" aria-describedby="inputPadecimientoP">'+
        '<span id = "padecimientoIcon" class="" aria-hidden="true"></span>'+
        '<span id="inputPadecimientoP" class="sr-only">(success)</span>'+
        '<div id = "padecimiento-error"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
    $('#extraSearch').html(cont);
    autoCompleteEsp('inputEspecialidad');
    autoCompletePad('inputPadecimiento');
    validateForm( 'input-especialidad', 'inputEspecialidad' );
    validateForm( 'input-padecimiento', 'inputPadecimiento' );
  } else {
    $('#extraSearch').html(cont);
  }
  $('#buscadorFixed').css('top',$('#mainNav').height()+'px');
  var height = $('#buscadorFixed').height();
  height += $('#mainNav').height();
  $('#buscadorResultado').css('margin-top',height+'px');
}
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}
function InputAutoComplete(inputId, availableTags){
    $('#'+inputId)
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            availableTags, extractLast( request.term ) ) );
        },
        select: function( event, ui ) {
          var agregar = true;
          $('.'+inputId).each(function(){
            if ($(this).text() == ui.item.value){
              agregar = false;
            }
          });
          if (agregar){
          $(this).parent().append(
            '<div class="input-group-btn" style="padding:1px;display:initial">'+
              '<label class="btn-xs btn-warning" style="margin-top:2px">'+
                '<span class="`+inputId+`">`+ ui.item.value +`</span>'+
                '<span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove();ajustarPantallaBusqueda();" style="color:#d9534f;font-size:80%" ></span>'+
              '</label>'+
            '</div>');
          }
          this.value = '';
          ajustarPantallaBusqueda();
          return false;
        },
        messages: {
            noResults: '',
            results: function() {return '';}
        }
      });
}
function ajustarPantallaBusqueda(){
  var height = $('#buscadorFixed').height();
  height += $('#mainNav').height();
  $('#buscadorFixed').css('top',$('#mainNav').height()+'px');
  $('#buscadorResultado').css('margin-top',height+'px');
}
function buscarPaginador(id){
  var last_id = $('#maxNumPag').val();
  if (id == $('ul.pagination>li').not('.next').not('.last').last().find('a').text()){
    if (id < last_id){
      var varli = '<li id="paginador_'+(id+1)+'" onclick="buscarPaginador('+(id+1)+')"><a>'+(id+1)+'</a></li>';
      $('ul.pagination>li').not('.last').not('.next').last().after(varli);
      $('ul.pagination>li').not('.first').not('.preview').first().remove();
    }
  } else if (id == $('ul.pagination>li').not('.first').not('.preview').first().find('a').text() && id > 1){
    var varli = '<li id="paginador_'+(id-1)+'" onclick="buscarPaginador('+(id-1)+')"><a>'+(id-1)+'</a></li>';
    $('ul.pagination>li').not('.first').not('.preview').first().before(varli);
    $('ul.pagination>li').not('.last').not('.next').last().remove();
  }

  if ($('ul.pagination>li#paginador_'+id).length== 0){
    if ( id === 1){
      var varli = '';
      $('ul.pagination>li').not('.first').not('.preview').not('.next').not('.last').not(':first').remove();
      for (var i = 1;i<=5;i++){
        varli += '<li id="paginador_'+i+'" onclick="buscarPaginador('+i+')"><a>'+i+'</a></li>';
      }
      $('ul.pagination>li').not('.next').not('.last').last().after(varli);
      $('ul.pagination>li').not('.first').not('.preview').first().remove();
    } else {
      var varli = '';
      $('ul.pagination>li').not('.first').not('.preview').not('.next').not('.last').not(':first').remove();
      for (var i = last_id-5;i<=last_id;i++){
        varli += '<li id="paginador_'+i+'" onclick="buscarPaginador('+i+')"><a>'+i+'</a></li>';
      }
      $('ul.pagination>li').not('.next').not('.last').last().after(varli);
      $('ul.pagination>li').not('.first').not('.preview').first().remove();
    }
  }

  if (id == 1){
    $('ul.pagination>li.preview').css('visibility','hidden');
    $('ul.pagination>li.first').css('visibility','hidden');
  } else {
    $('ul.pagination>li.preview').css('visibility','visible');
    $('ul.pagination>li.first').css('visibility','visible');
  }
  if (parseInt(id) == parseInt(last_id)){
    $('ul.pagination>li.next').css('visibility','hidden');
    $('ul.pagination>li.last').css('visibility','hidden');
  } else {
    $('ul.pagination>li.next').css('visibility','visible');
    $('ul.pagination>li.last').css('visibility','visible');
  }
  $('ul.pagination>li').removeClass('active');
  $('ul.pagination>li#paginador_'+id).addClass('active');
  searchingData();
}
function buscadorPreview(){
  var id = $('ul.pagination>li.active').find('a').text();
  buscarPaginador(id-1);
}

function buscadorNext(){
  var id = $('ul.pagination>li.active').find('a').text();
  buscarPaginador((parseInt(id)+1));
}

function buscadorFirst(){
  buscarPaginador(1);
}

function buscadorLast(){
  buscarPaginador($('#maxNumPag').val());
}

function iniciarBusqueda(){
  if ($('#hiddenEspecialidad').length>0){
    var especialidad = '';
    $('.inputEspecialidad').each(function(){
      if ($(this).text()){
        if (especialidad != ""){
          especialidad+='-.-';
        }
        especialidad += $(this).text();
      }
    });
    $('#hiddenEspecialidad').prop('value',especialidad);
  }
  if ($('#hiddenPadecimiento').length>0){
    var padecimiento = '';
    $('.inputPadecimiento').each(function(){
      if ($(this).text()){
        if (padecimiento != ""){
          padecimiento+='-.-';
        }
        padecimiento += $(this).text();
      }
    });

    $('#hiddenPadecimiento').val(padecimiento);
  }

  if ($('#hiddenInstitucion').length>0){
    var institucion = '';
    $('.inputInstitucion').each(function(){
      if ($(this).text()){
        if (institucion != ""){
          institucion+='-.-';
        }
        institucion += $(this).text();
      }
    });
    $('#hiddenInstitucion').val(institucion);
  }

  if ($('#hiddenAseguradora').length>0){
    var aseguradora = '';
    $('.inputAseguradora').each(function(){
      if ($(this).text()){
        if (aseguradora != ""){
          aseguradora+='-.-';
        }
        aseguradora += $(this).text();
      }
    });
    $('#hiddenAseguradora').val(aseguradora);
  }
}

function agregarBusqueda(inputId,Valores){
  Valores = Valores.split('-.-');
  Valores.forEach(function(val){
    if (val != ""){
      $('#'+inputId).parent().append(
        '<div class="input-group-btn" style="padding:1px;display:initial">'+
          '<label class="btn-xs btn-warning" style="margin-top:2px">'+
            '<span class="`+inputId+`">'+ val +'</span>'+
            '<span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove();ajustarPantallaBusqueda();" style="color:#d9534f;font-size:80%" ></span>'+
          '</label>'+
        '</div>');
    }
  });
}
function registrarServicios(salir){
  if (salir){
    bootbox.hideAll();
  } else {
    $('.menuBootbox').find('li.servicios').removeClass('active');
    $('.menuBootbox').find('li.horarios').addClass('active');
    $('#divServicios').removeClass('in');
    $('#divServicios').removeClass('active');
    $('#divHorarios').addClass('in');
    $('#divHorarios').addClass('active');
  }
}

function registrarHorariosBot(salir){
  bootbox.hideAll();
}

function iniciarDivCalendario(direccion_id){
  if (!direccion_id){
    direccion_id = $('#idDireccion').val();
  }
  $.ajax({
      url: '/horariosObtener',
      type: 'POST',
      dataType: "json",
      cache: false,
      data: { direccion_id: direccion_id},
      type: 'POST',
      success: function (data) {
        $('#horariosUbi').val(data.horarios);
        $('#direccion_id').val(data.direccion_id);
        $("#divCalendario").remove();
        $("#divCalendarioPadre").html('<div id="divCalendario"></div>');
        setTimeout(function(){iniciarCalendario(data.horarios)},300);

      },
      error: function (err){
        console.log('AJAX Error: ' + JSON.stringify(err));
      }
    });
}

function vaciarCalendario(){
  $('#horariosUbi').val([]);
  $("#divCalendario").remove();
  $("#divCalendarioPadre").html('<div id="divCalendario"></div>');
  setTimeout(function(){iniciarCalendario([])},300);
}
function repositionTooltip( e, ui ){
    if (ui.value < 0 || ui.value >100){
      return false;
    }
    // If you're on Bootstrap 3.x change "tooltip" to "bs.tooltip"
    // Props to @fd_tl in the comments for the tip!
    var div = $(ui.handle).data("bs.tooltip").$tip[0];
    $(div).css('position','fixed');

    var id = $(div).closest('.Slider').prop('id');
    var comp = '';
    switch (id) {
      case 'cal_higiene':
          comp = "Higiene del lugar";
          break;
      case 'cal_puntualidad':
          comp = "Puntualidad";
          break;
      case 'cal_instalaciones':
          comp = "Instalaciones";
          break;
      case 'cal_trato':
          comp = "Trato personal";
          break;
      case 'cal_tratoper':
          comp = "Trato personal";
          break;
      case 'cal_pres':
          comp = "Presentación";
          break;
      case 'cal_efect':
          comp = "Efectividad";
          break;
      case 'cal_hig':
          comp = "Higiene";
          break;
      }

    var ant = $(div).find(".tooltip-inner").text().split('%')[0];
    ant = ant.split(' ');
    ant = ant[ant.length-1];

    $(div).find(".tooltip-inner").text(comp + ' ' + ui.value + '%');

    var tp = $(ui.handle).offset();

    tp.left = tp.left - (parseInt($(div).find(".tooltip-inner").css('width'))/2) + 10;

    if (parseInt(ant) > parseInt(ui.value)){
      tp.top = parseFloat(tp.top) - 22 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
    } else if (parseInt(ant) < parseInt(ui.value)){
      tp.top = parseFloat(tp.top) - 35 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
    } else {
      tp.top = parseFloat(tp.top) - 30 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
    }
    $(div).offset(tp);
    $(div).find(".tooltip").css('background-color','red');
    $(div).css('z-index','30000');
}
$( document ).ready( function () {
  //console.log('length: '+$( '#perfilMedico' ).length);
  if ( $( '#perfilMedico' ).length > 0 ) {

    //console.log('cargo perfilMedico');

    MostrarUbicaciones();

    $( function () {
      $( '[data-toggle="tooltip"]' ).tooltip()
    } )

    $( function () {
      $( window ).scroll( sticky_relocate );
      sticky_relocate();
    } );

    $( '.logros-slider' ).bxSlider( {
      slideWidth: 250,
      minSlides: 1,
      maxSlides: 5,
      moveSlides: 1,
      slideMargin: 50,
    } );

    $( '#1bg-perfil .float.down' ).click( function(){
      $(this).scrollTo( '#ubicaciones', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( '#2bg-ubicaciones .float.up' ).click( function(){
      $(this).scrollTo( '#perfil', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })
    $( '#2bg-ubicaciones .float.down' ).click( function(){
      $(this).scrollTo( '#info', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( '#3bg-info .float.up' ).click( function(){
      $(this).scrollTo( '#ubicaciones', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })
    $( '#3bg-info .float.down' ).click( function(){
      $(this).scrollTo( '#colegas', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( '#4bg-colegas .float.up' ).click( function(){
      $(this).scrollTo( '#info', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })
    $( '#4bg-colegas .float.down' ).click( function(){
      $(this).scrollTo( '#curriculum', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( '#5bg-curriculum .float.up' ).click( function(){
      $(this).scrollTo( '#colegas', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })
    $( '#5bg-curriculum .float.down' ).click( function(){
      $(this).scrollTo( '#comentarios', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( '#6bg-comentarios .float.up' ).click( function(){
      $(this).scrollTo( '#curriculum', 800, {offset: {top:-60, left:0} } /*{offset: function() { return {top:-60}; }}*/ );
    })

    $( window ).scroll( function() {
      hidenavbuttons();
    });

    function hidenavbuttons() {
      var h = $( window ).height(),
        halfHeight = Math.round(h / 2),
        scrollTop = $( window ).scrollTop(),
        pOffset = $( '#perfil' ).offset().top,
        pX = pOffset - scrollTop,
        uOffset = $( '#ubicaciones' ).offset().top,
        uX = uOffset - scrollTop,
        iOffset = $( '#info' ).offset().top,
        iX = iOffset - scrollTop,
        cOffset = $( '#colegas' ).offset().top,
        cX = cOffset - scrollTop,
        cvOffset = $( '#curriculum' ).offset().top,
        cvX = cvOffset - scrollTop,
        coOffset = $( '#comentarios' ).offset().top,
        coX = coOffset - scrollTop;
      if ( pX >= 0 ) {
        $('#1bg-perfil' ).removeClass( 'hidden' );
        $('#2bg-ubicaciones' ).addClass( 'hidden' );
        $('#3bg-info' ).addClass( 'hidden' );
        $('#4bg-colegas' ).addClass( 'hidden' );
        $('#5bg-curriculum' ).addClass( 'hidden' );
        $('#6bg-comentarios' ).addClass( 'hidden' );
      }
      else if( uX <= halfHeight && uX >= 0 ) {
        $( '#1bg-perfil' ).addClass( 'hidden' );
        $( '#2bg-ubicaciones' ).removeClass( 'hidden' );
        $( '#3bg-info' ).addClass( 'hidden' );
        $( '#4bg-colegas' ).addClass( 'hidden' );
        $( '#5bg-curriculum' ).addClass( 'hidden' );
        $( '#6bg-comentarios' ).addClass( 'hidden' );
      }
      else if( iX <= halfHeight && iX >= 0 ) {
        $( '#1bg-perfil').addClass( 'hidden' );
        $( '#2bg-ubicaciones').addClass( 'hidden' );
        $( '#3bg-info').removeClass( 'hidden' );
        $( '#4bg-colegas').addClass( 'hidden' );
        $( '#5bg-curriculum').addClass( 'hidden' );
        $( '#6bg-comentarios').addClass( 'hidden' );
      }
      else if( cX <= halfHeight && cX >= 0 ) {
        $( '#1bg-perfil' ).addClass( 'hidden' );
        $( '#2bg-ubicaciones' ).addClass( 'hidden' );
        $( '#3bg-info' ).addClass( 'hidden' );
        $( '#4bg-colegas' ).removeClass( 'hidden' );
        $( '#5bg-curriculum' ).addClass( 'hidden' );
        $( '#6bg-comentarios' ).addClass( 'hidden' );
      }
      else if( cvX <= halfHeight && cvX >= 0 ) {
        $( '#1bg-perfil' ).addClass( 'hidden' );
        $( '#2bg-ubicaciones' ).addClass( 'hidden' );
        $( '#3bg-info' ).addClass( 'hidden' );
        $( '#4bg-colegas' ).addClass( 'hidden' );
        $( '#5bg-curriculum' ).removeClass( 'hidden' );
        $( '#6bg-comentarios' ).addClass( 'hidden' );
      }
      else if( coX <= halfHeight && coX >= 0 ) {
        $( '#1bg-perfil' ).addClass( 'hidden' );
        $( '#2bg-ubicaciones' ).addClass( 'hidden' );
        $( '#3bg-info' ).addClass( 'hidden' );
        $( '#4bg-colegas' ).addClass( 'hidden' );
        $( '#5bg-curriculum' ).addClass( 'hidden' );
        $( '#6bg-comentarios' ).removeClass( 'hidden' );
      }
    }

    $( 'html' ).scrollLock( 'on', 'div' );
    /*$( 'html' ).niceScroll({background: 'none'});
    $( 'html' ).getNiceScroll().hide();*/

    function sticky_relocate() {
      var window_top = $( window ).scrollTop();
      var div_top = $( '#sticky-anchor' ).offset().top;
      if ( window_top > div_top ) {
        $( '.sticky' ).addClass( 'stick' );
      }
      else {
        $( '.sticky' ).removeClass( 'stick' );
      }
    }

    cargarListaEspCol( $( '#usuarioPerfil' ).val() );

    cargarComentariosMedico();

    $('#buscadorEspecial').on('input',function(e){
     cargarListaEspCol( $( '#usuarioPerfil' ).val() );
    });

    if ( $( '#registroCompleto' ) && $( '#registroCompleto' ).val() === "0" && $( '#inicio' ).val() === "1" ) {
      if ( $( '#tipoUsuario' ).val() === "M" ) {
        registroMedicoDatosPersonales();
      }
    }
  }
} );
//fin de Perfil Medicos
//<-------------------- modificaciones -------------------->
  function editUbicacion(dato){
    var cambio = "";
    $(dato).change(function(){
      cambio = $(this).val();
      var tipo = $(dato).attr('tipo');
      var id = $( this ).attr('oculto');
      switch( tipo ){
        case "concepto":updateServices( tipo,cambio,id );break;
        case "descripcion":updateServices( tipo,cambio,id );break;
        case "precio":updateServices( tipo,cambio,id );break;
        case "duracion":updateServices( tipo,cambio,id );break;
      }
    });
  }
  function onDelete(del){
    var id = $(del).attr('oculto');
    bootbox.confirm('¿Estas seguro de eliminar este servicio?', function(result){
      if( result == true ){
        // se manda un post con el id que se desea eliminar
        $.post('/deleteServicio',{id:id},function(data){
          maquetaServices();
        }).fail(function(e){
          maquetaServices();
        });
      }
    });
  }
//<-------------------- FIN MODIFICACIONES ---------------->
function buscadorColegasEspecial(){
  if ($('#buscadorEspecial').hasClass('hidden')){
    $('#buscadorEspecial').removeClass('hidden');
  } else {
    $('#buscadorEspecialInput').val('');
    $('#buscadorEspecial').addClass('hidden');
  }
  cargarListaEspCol( $( '#usuarioPerfil' ).val() );
}
function ocultarBuscadorColegasEspecial(){
  if (!$('#buscadorEspecial').hasClass('hidden')){
    $('#buscadorEspecialInput').val('');
    $('#buscadorEspecial').addClass('hidden');
  }
}
function formatearFechaComentario(fecha){
  var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  fecha = fecha.split('/');
  var mes = meses[parseInt(fecha[0])-1];
  var dia = fecha[1];
  var anio = fecha[2];
  return parseInt(dia) + ' de ' + mes + ' de ' + anio ;
}
function CambiarVisible(anterior,nuevo, formacion_id){
  $('#formAcademica')[0].reset();
  if (formacion_id){
    $('#divInicio').removeClass('col-md-10');
    $('#divInicio').addClass('col-md-3');
    $('#divFin').removeClass('hidden');
    $('#divGrado').removeClass('hidden');
    if (formacion_id>0 && !(formacion_id === true)){
      //AJax para traer la informacion de la formacion_id
      console.log('AJAX: formacion_id ' + formacion_id);
      cargarFormacionAcademicaByID(formacion_id);
    }
  }

  $('#'+anterior).removeClass('in');
  $('#'+anterior).removeClass('active');
  $('#'+nuevo).addClass('in');
  $('#'+nuevo).addClass('active');
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
function cargarListaEspCol( usuario ) {
  var filtro = $('#buscadorEspecialInput').val();
  $.ajax( {
    async: false,
    url: '/cargarListaEspCol',
    type: 'POST',
    data: {
      usuario: usuario,
      filtro: filtro
    },
    dataType: "json",
    cache: false,
    success: function ( data ) {
      $('#especialidadesList').html('');
      $('#listaColegas').html('');
      $('#tipoFiltro').html('una especialidad');
      if ( data.success ) {
        var contenido = '';
        var primero = '';
        data.result.forEach(function(esp){
          if (primero == ""){
            primero = esp.id;
          }
          contenido += '<li>' +
          '<a onclick="cargarListaColegasByEsp(' + usuario + ',' + esp.id + ',this)">' + esp.especialidad + '<span class="badge pull-right">' + esp.total + '</span></a>' +
          '</li>';
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
function cargarListaColegasByEsp(usuario_id,especialidad_id, element){
  $('#especialidadesList li.active').removeClass('active');
  if (element){
    $(element).parent().addClass('active');
  } else {
    $('#especialidadesList li').first().addClass('active');
  }
  var filtro = $('#buscadorEspecialInput').val();
  $.ajax( {
    async: false,
    url: '/cargarListaColegasByEsp',
    type: 'POST',
    data: {
      usuario_id: parseInt(usuario_id),
      especialidad_id: especialidad_id,
      filtro: filtro
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
          if (res.DatosGenerale.apellidoM == null){
            res.DatosGenerale.apellidoM = '';
          }
          var usuarioUrl = res.usuarioUrl;
          if (res.urlPersonal && res.urlPersonal != ""){
            usuarioUrl = res.urlPersonal;
          }
          contenido += `
          <div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
            <div class="thumbnail">
              <div >
                <a class="pPic" href="/`+ usuarioUrl +`"><img src="`+ res.urlFotoPerfil +`" alt="..."></a>
              </div>
              <div class="caption">
                <div class="nombre h77-boldcond">
                  Dr.&nbsp;<span>`+ res.DatosGenerale.nombre +`</span>&nbsp;<span>`+ res.DatosGenerale.apellidoP +` `+ res.DatosGenerale.apellidoM +`</span>
                </div>
                <div class="esp h67-medcond">
                  <span class="colEsp">`+ especialidad +`</span>
                </div>
                <a class="h67-medcondobl" href="/`+ usuarioUrl +`">Ver Perfil</a>
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
//<-------------- funciones para la busqueda de la pantalla searchMedic -------------->

function cargarCiudades(id){
  var idABuscar = $(id).val();// se saca el value del select de estados
  // se hace la consulta se manda como parametro el id que se obtuvo de seleccionar el estado
  $.post('/cargarCiudades',{id:idABuscar}, function(data){
    var cont = '<option value="0">Municipio/Ciudad</option>';
    $.each(data,function(i, item){
      cont += '<option value="'+item.id+'">'+item.municipio+'</option>';
    });
    $("#selectCiudad").html(cont);
  });
}
function cargaEspecialidades(){
  var html3 = "";
  // trae todas las especialidades
  html3 += '<option value="0">--Especialidad--</option>';
  $.post('/cargaEspecialidades', function(data){
    $.each(data, function(i, item){
      html3 += '<option value="'+item.id+'">'+item.especialidad+'</option>';
    });
    $("#selectEspecialidad").html(html3);
  });
}
function cargaPadecimiento(){
  var html4 = "";
  html4 += '<option value="0">--Padecimiento--</option>';
  $.post('/cargaPadecimiento', function(data){
    $.each(data, function( i, item){
      html4 += '<option value="'+item.id+'">'+item.padecimiento+'</option>';
    });
    $("#selectPadecimiento").html(html4);
  });
}
function searchingData(){
  var pagina = 1;
  var tipoBusqueda = $('#tipoBusqueda').val();
  var estado = $("#selectEstados").val();
  var ciudad = $("#selectCiudad").val();
  if ($('ul.pagination>li.active').length>0){
    pagina = $('ul.pagination>li.active').find('a').text();
  }
  var especialidad = [];
  $('.inputEspecialidad').each(function(){
    if ($(this).text()){
      especialidad.push($(this).text());
    }
  });
  var padecimiento = [];
  $('.inputPadecimiento').each(function(){
    if ($(this).text()){
      padecimiento.push($(this).text());
    }
  });
  var institucion = [];
  $('.inputInstitucion').each(function(){
    if ($(this).text()){
      institucion.push($(this).text());
    }
  });
  var aseguradora = [];
  $('.inputAseguradora').each(function(){
    if ($(this).text()){
      aseguradora.push($(this).text());
    }
  });
  var nombre = $("#nombreMed").val();
  var html5 = "";
  $("#medResults").html('');
  $.post('/findData',{
    pagina: pagina,
    tipoBusqueda: tipoBusqueda,
    estado: estado,
    municipio: ciudad,
    especialidad: especialidad,
    padecimiento: padecimiento,
    institucion: institucion,
    aseguradora: aseguradora,
    nombre: nombre
  },function(data){
    if ($('#buscPag').html() == "" && data.countmedicos>1){
      $('#maxNumPag').val(data.countmedicos);
      var limit = 5;
      if (data.countmedicos<5){
        limit = data.countmedicos;
      }
      var paginador = '<li class="first" onclick="buscadorFirst()" style="visibility:hidden"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
      paginador += '<li class="preview" onclick="buscadorPreview()" style="visibility:hidden"><a aria-label="Previous"><span aria-hidden="true">&lsaquo;</span></a></li>';
      for (var i = 1; i<= limit; i++){
        clase = '';
        if (pagina == i){
          clase = 'class="active"'
        }
        paginador += '<li id="paginador_'+i+'" '+clase+' onclick="buscarPaginador('+i+')"><a>'+i+'</a></li>';
      }
      paginador += '<li class="next"><a aria-label="Next" onclick="buscadorNext()"><span aria-hidden="true">&rsaquo;</span></a></li>';
      paginador += '<li class="last"><a aria-label="Next" onclick="buscadorLast()"><span aria-hidden="true">&raquo;</span></a></li>';
      $('#buscPag').html(paginador);
    }
    var contenido = '<div class="container-fluid">' +
      '<div class="row">' +
        '<div role="tabpanel" class="tab-pane fade in active " id="medResults">' +
          '<ul class="media-list">';
    if(data.medicos){
      $.each(data.medicos, function( i, item ){
        if (!item.DatosGenerale.apellidoM) item.DatosGenerale.apellidoM = ' ';
        var nombreCompleto = item.DatosGenerale.nombre+' '+item.DatosGenerale.apellidoP + ' ' + item.DatosGenerale.apellidoM;

        var usuarioUrl = item.usuarioUrl;
        if (item.urlPersonal && item.urlPersonal != ""){
          usuarioUrl = item.urlPersonal;
        }
        contenido += '<li class="media result" id="medico_id_'+ item.Medico.id +'">' +
            '<div class="media-left"><div class="media-enclosure"><a href="/'+item.urlPersonal+'">'+
                  '<img class="media-object imgBusqueda" src="'+ item.urlFotoPerfil +'" alt="">'+
                '</a></div></div>' +
            '<div class="media-body"><div class="col-md-8"><h4 class="media-heading">'+
                  '<span class="label label-topDr">Top Doctor</span> <a href="/'+item.urlPersonal+'">Dr. '+ nombreCompleto +'.'+
                '</a></h4><ul class="list-unstyled list-inline">';

          $.each(item.Medico.MedicoEspecialidads, function(a, esp ){
            if (esp.subEsp == 0){
              contenido += '<li><strong>' +esp.Especialidad.especialidad+'</strong></li>';
            }
          });

          contenido += '</ul><ul class="list-unstyled list-inline">';

          $.each(item.Medico.MedicoEspecialidads, function(a, esp ){
            if (esp.subEsp == 1){
              contenido += '<li><strong>'+esp.Especialidad.especialidad+'</strong></li>';
            }
          });

          contenido += '</ul><ul class="list-inline">';


          $.each(item.Medico.Padecimientos, function(a, pad ){
            contenido +='<li><small>'+pad.padecimiento+'</small></li>';
          });

          contenido += '</ul><ul class="list-unstyled list-ubicaciones">';

          var usu = item.usuarioUrl;
          if (item.urlPersonal && item.urlPersonal.length>0){
          usu = item.urlPersonal;
          }

          $.each(item.Direccions, function( i, itemDir ){
            contenido += '<li><div id="dir_'+itemDir.id+'" class="direccion hidden">'+
                  '<div class="top_dr">1</div>'+
                  '<div class="direccion_id">'+itemDir.id+'</div>'+
                  '<div class="latitud">'+itemDir.latitud+'</div>'+
                  '<div class="longitud">'+itemDir.longitud+'</div>'+
                  '<div class="medico_id">'+item.Medico.id+'</div>'+
                  '<div class="nombre">'+itemDir.nombre+'</div>'+
                  '<div class="imagen">'+item.urlFotoPerfil +'</div>'+
                  '<div class="doctor">Dr. '+nombreCompleto+'</div>'+
                  '<div class="direccion">'+itemDir.calle+' #'+itemDir.numero+'<br/>'+itemDir.Municipio.municipio+', '+itemDir.Municipio.Estado.estado+'</div>'+
                  '<div class="usuarioUrl">'+usu+'</div>'+
                '</div>'+
                '<a onclick="centrarEnMapa(\''+itemDir.latitud+'\',\''+itemDir.longitud+'\',\''+item.Medico.id+'\',\''+itemDir.id+'\',true)">'+
                  '<button class="btn btn-warning">'+
                    '<span class="glyphicon glyphicon-map-marker"></span>'+
                  '</button>'+
                  '<strong>'+itemDir.nombre+'</strong>'+
                  '<small>'+itemDir.calle+' #'+itemDir.numero+', '+itemDir.Municipio.municipio+','+itemDir.Municipio.Estado.estado+'<span class="glyphicon glyphicon-zoom-in"></span></small>'+
                '</a>'+
              '</li>';
          });

        contenido += '</ul></div><div class="resultOptions col-md-4">'+
                '<ul class="list-unstyled">'+
                  '<li>Costo de consulta:<strong> $1,230</strong></li>'+
                  '<li><a>Agrega a tus favoritos</a></li>'+
                  '<li><a>Envía mensaje</a></li>'+
                  '<li><a href="'+base_url+usu+'">Visita su perfíl</a></li>'+
                '</ul></div></div></li>';
      });
    }
    contenido += '</ul></div></div></div>';
    $("#buscadorResultado").html(contenido);
    mapSearchDiv();
  });
}
//<------------- FIN DE LAS FUNCIONES ---------------------------->
function autoCompleteEsp(inputId){
    $.ajax({
      async: false,
      url: '/cargarEspecialidades',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        var availableTags = [];
        data.forEach(function(esp){
          availableTags.push(esp.especialidad);
        });
        InputAutoComplete(inputId,availableTags);
      },
      error: function (err){
        console.log('Ajax error: ' + JSON.stringify(err));
      }
    });
}
function autoCompletePad(inputId){
    $.ajax({
      async: false,
      url: '/cargarPadecimientos',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        var availableTags = [];
        data.forEach(function(pad){
          availableTags.push(pad.padecimiento);
        });
        InputAutoComplete(inputId,availableTags);
      },
      error: function (err){
        console.log('Ajax error: ' + JSON.stringify(err));
      }
    });
}

function autoCompleteInst(inputId){
    $.ajax({
      async: false,
      url: '/cargarInstituciones',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        var availableTags = [];
        data.forEach(function(inst){
          availableTags.push(inst.clinica);
        });
        InputAutoComplete(inputId,availableTags);
      },
      error: function (err){
        console.log('Ajax error: ' + JSON.stringify(err));
      }
    });
}

function autoCompleteAseg(inputId){
    $.ajax({
      async: false,
      url: '/cargarAseguradoras',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        var availableTags = [];
        data.forEach(function(as){
          availableTags.push(as.aseguradora);
        });
        InputAutoComplete(inputId,availableTags);
      },
      error: function (err){
        console.log('Ajax error: ' + JSON.stringify(err));
      }
    });
}