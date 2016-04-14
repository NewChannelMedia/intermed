/**
* Todas las funciones cargadas en el $(document).ready();
* o funciones que las pueden llamar donde sea
**/
var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sábado'];


//Eliminar el hash '#_=_' que agrega el login con facebook
var base_url = 'http://localhost:3000/';
var default_urlFotoPerfil = '/garage/defaults/dpp.png';
if (window.location.hash == '#_=_'){
    history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
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
var base64file;

function seleccionarImagenPerfil(element) {
  base64file = '';
  var tamanio = $( element )[ 0 ].files[ 0 ].size;
  $('#contenedorFoto').html('');
  if ( tamanio < 1048576 ) {
    $('#tabPerfil').removeClass('active');
    $('#tabImagen').addClass('active');
    //cambioFotoPerfil();
    $( '#btnCrop' ).hide();
    $('#contenedorFoto').html('<img id="fotoPerfilNueva" >');
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
    reader.readAsDataURL( $( element )[ 0 ].files[ 0 ] );
  }
  else {
    $( '#imageFile' ).val( '' );
    alert( "La imagen es muy grande, selecciona otra" );
  }
}


function seleccionarImagenUsuarioPanel(element) {
  base64file = '';
  var tamanio = $( element )[ 0 ].files[ 0 ].size;
  $('#contenedorFoto').html('');
  if ( tamanio < 1048576 ) {
    $('#tabPerfil').removeClass('active');
    $('#tabImagen').addClass('active');
    cambioFotoPerfil();
    $( '#btnCrop' ).hide();
    $('#contenedorFoto').html('<img id="fotoPerfilNueva" >');
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
    reader.readAsDataURL( $( element )[ 0 ].files[ 0 ] );
  }
  else {
    $( '#imageFile' ).val( '' );
    alert( "La imagen es muy grande, selecciona otra" );
  }
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
          $('#divTelefono').html('<input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" onpaste="soloNumeros()" maxlength="12">');
          break;
      case "oficina":
          $('#divTelefono').html('<div class="row noPadding"><div class="col-md-8"><input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="12" onpaste="soloNumeros()" ></div><div class="col-md-4"><input type="text" id="extTelefono" class="form-control solo-numero" placeholder="Ext:" maxlength="10" onpaste="soloNumeros()" ></div></div>');
          break;
      case "localizador":
        $('#divTelefono').html('<div class="row noPadding"><div class="col-md-7"><input type="text" id="numTelefono" class="form-control solo-numero" placeholder="Número:" maxlength="10" onpaste="soloNumeros()" ></div><div class="col-md-5"><input type="text" id="extTelefono" class="form-control solo-numero" placeholder="Localizador:" maxlength="10" onpaste="soloNumeros()" ></div></div>');
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
      $('#divTelefonoAgregado').append('<li class="lbl lbl-tel">'+
          '<span class="numeroTelefono">'+
            '<input type="hidden" class="idTelefono" value="">' +
            '<input type="hidden" class="idTempTelefono" value="' + idTemp + '">' +
            '<span class="tipoTelefono hidden">'+ $('#tipoTelefono').val() +'</span>'+
            '<span class="tipoTelefonoIcon">'+
              '<span class="glyphicon '+ clase +'"></span>&nbsp;'+
            '</span>'+
            '<span class="numTelefono">'+$('#numTelefono').val() +'</span>'+
            '<span class="extTelefono">'+ ext +'</span>'+
          '</span>'+
          '<button type="button" class="btn btn-sm borrar" onclick="eliminarTelefono(this)">'+
            '<span class="glyphicon glyphicon-remove"></span>'+
          '</button>'+
      '</li>');
      $('[data-toggle="tooltip"]').tooltip();
      funcionesTelefonos();
      $('#tipoTelefono').prop('selectedIndex', 0);
      $('#tipoTelefono').change();
    }
  });

  $('span.numeroTelefono').unbind();
  $('span.numeroTelefono').click(function(){
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
    autoCompleteAseg('inputAseguradora');
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
//  var height = $('#buscadorFixed').height();
//  height += $('#mainNav').height();
//  $('#buscadorResultado').css('margin-top',height+'px');
}
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}
function InputAutoComplete(inputId, availableTags, defaultSelect){
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
          if (defaultSelect){
            var agregar = true;
            $('.'+inputId).each(function(){
              if ($(this).text() == ui.item.value){
                agregar = false;
              }
            });
            if (agregar){
            $(this).parent().append(
              '<div class="input-group-btn" style="padding:1px;display:initial">'+
                '<label class="btn-xs btn-primary" style="margin-top:2px">'+
                  '<span class="'+inputId+'">'+ ui.item.value +'</span>'+
                  '<span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove();ajustarPantallaBusqueda();" style="color:#d9534f;font-size:80%" ></span>'+
                '</label>'+
              '</div>');
            }
            this.value = '';
            ajustarPantallaBusqueda();
            return false;
          }
        },
        messages: {
            noResults: '',
            results: function() {return '';}
        }
      });
}
function ajustarPantallaBusqueda(){
  var windowWidth =  $(window).width();
  var height = $('#buscadorFixed').height();
      height += $('#mainNav').height();
  var heightDiv = $(window).height() - height;

  if (windowWidth>=992){
    $('#buscadorResultado').css('overflow','scroll');
    $('#buscadorResultado').css('height',heightDiv);

    $('#buscadorResultado').css('visibility','visible');
    $('#buscadorResultado').css('position','relative');

    $('#buscadorFixed').css('visibility','visible');
    $('#buscadorFixed').css('position','relative');

    $('#regresarVistaBusqueda').css('display','none');

    $('#mapSearchDiv').css('height',heightDiv);
    $('#mapSearchDiv').css('visibility','visible');
    $('#mapSearchDiv').css('position','relative');
  } else {
    $('#buscadorResultado').css('overflow','none');
    $('#buscadorResultado').css('height','auto');

    heightDiv = $(window).height() - $('#mainNav').height();
    $('#mapSearchDiv').css('height',heightDiv);
    if ($('#buscadorResultado').css('visibility') == "visible"){
      $('#regresarVistaBusqueda').css('display','none');
      $('#mapSearchDiv').css('position','fixed');
      $('#mapSearchDiv').css('visibility','hidden');
    }
  }
}

function vistaBuscadorMapa(){
  $('#regresarVistaBusqueda').css('top',$('#mainNav').height()+7);
  $('#regresarVistaBusqueda').css('display','block');

  $('#mapSearchDiv').css('visibility','visible');
  $('#mapSearchDiv').css('position','relative');

  $('#buscadorResultado').css('visibility','hidden');
  $('#buscadorResultado').css('position','fixed');

  $('#buscadorFixed').css('visibility','hidden');
  $('#buscadorFixed').css('position','fixed');
}

function vistaBuscadorResultados(){
  $('#regresarVistaBusqueda').css('display','none');

  $('#mapSearchDiv').css('visibility','hidden');
  $('#mapSearchDiv').css('position','fixed');

  $('#buscadorResultado').css('visibility','visible');
  $('#buscadorResultado').css('position','relative');

  $('#buscadorFixed').css('visibility','visible');
  $('#buscadorFixed').css('position','relative');
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
        $("#divCalendarioPadre").html('<div id="divCalendario" class="regHorMed"></div>');
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
          comp = "Higiene";
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
      case 'cal_costo':
          comp = "Costo";
          break;
      case 'cal_satisfaccion':
          comp = "Satisfacción";
          break;
      }

    var ant = $(div).find(".tooltip-inner").text().split('%')[0];
    ant = ant.split(' ');
    ant = ant[ant.length-1];

    $(div).find(".tooltip-inner").text(comp + ' ' + ui.value + '%');

    var tp = $(ui.handle).offset();

    tp.left = tp.left - (parseInt($(div).find(".tooltip-inner").css('width'))/2) + 10;

    if (id != "cal_satisfaccion"){
      if (parseInt(ant) > parseInt(ui.value)){
        tp.top = parseFloat(tp.top) - 22 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
      } else if (parseInt(ant) < parseInt(ui.value)){
        tp.top = parseFloat(tp.top) - 35 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
      } else {
        tp.top = parseFloat(tp.top) - 30 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
      }
    } else {
      tp.top = parseFloat(tp.top) - 22 - (parseInt($(div).find(".tooltip-inner").css('height')) - 17);
    }
    $(div).offset(tp);
    $(div).find(".tooltip").css('background-color','red');
    $(div).css('z-index','30000');
}



$( document ).ready( function () {
  //console.log('length: '+$( '#perfilMedico' ).length);
  if ( $( '#perfilMedico' ).length > 0 ) {

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

    cargarFormacionAcademica();
    cargarExperienciaLaboral();

    cargarComentariosMedico();

    $('#buscadorEspecial').on('input',function(e){
     cargarListaEspCol( $( '#usuarioPerfil' ).val() );
    });

    $('.popVerMas').click( function(){
        $(this).popover('toggle');
    })

  } else if ($( '#perfilPaciente' ).length > 0 ) {
    cargarListaEspCol( $( '#usuarioPerfil' ).val() ,'P');
    cargarCitasPaciente();

    var today = new Date();

    var d = new Date()
    var timeZoneOffset = '';

    var n = parseInt(d.getTimezoneOffset())/60;

    if (n<0){
      timeZoneOffset = '+';
    } else {
      timeZoneOffset = '-'
    }
    n = n.toString().replace('+','').replace('-','');

    if (n.split('.')[0].length== 1){
      timeZoneOffset += '0'+n.split('.')[0];
    } else {
      timeZoneOffset += n.split('.')[0];
    }
    if (!n.split('.')[1]){
      timeZoneOffset += ':00';
    } else {
      timeZoneOffset += ':' + n.split('.')[1];
    }

    var events = [];
    $.ajax( {
      url: '/agenda/cargarCitasMesPaciente',
      type: 'POST',
      dataType: "json",
      data: {tz: timeZoneOffset},
      cache: false,
      async: false,
      success: function ( data ) {
        events = [];
        data.result.forEach(function(res){
          var fecha = res.FECHA.split('T')[0].split('-');
          events.push(new Date(parseInt(fecha[0]), parseInt(fecha[1])-1, parseInt(fecha[2])).getTime());
        });
      },
      error: function ( jqXHR, textStatus, err ) {
        events = [];
      }
    } );

    $("#calendar").kendoCalendar({
      culture: 'es-MX',
      start: "day",
      depth: "decade",
      value: today,
      dates: events,
      month: {
        // template for dates in month view
        content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                    '<div class="' +
                       '# if (data.value) { #' +
                           "dayEvent" +
                       '# } else { #' +
                           "day" +
                       '# } #' +
                    '">#= data.value #</div>' +
                 '# } else { #' +
                 '#= data.value #' +
                 '# } #'
      },
      footer: false
    });
    var kendoCalendar = $("#calendar").data("kendoCalendar");
    kendoCalendar.value(new Date());
    kendoCalendar.bind("navigate", function() {
      var value = new Date(this.current());
      var inicio = new Date(value.getFullYear(), value.getMonth(),1).toISOString().split('T')[0];
      var fin = new Date(value.getFullYear(), value.getMonth(), new Date(value.getFullYear(),value.getMonth()+1, 0).getDate()).toISOString().split('T')[0];
      console.log('INICIO: ' +  inicio);
      console.log('FIN: ' +  fin);

    });
    kendoCalendar.bind("change", function() {
      //aqui cargamos los eventos de ese dia en la lista de la derecha
      var value = new Date(new Date(this.value()).toLocaleDateString());

      $('#mesFecha').text(meses[value.getMonth()]);
      $('#diaFecha').text(value.getDate());
      $('#anioFecha').text(value.getFullYear());
      $('#diaSemana').text(dias[value.getDay()]);

      var fechaInicio = value.toISOString().split('T')[0] + ' 00:00:00';
      var fechaFin = value.toISOString().split('T')[0] + ' 23:59:59';

      if( $(window).width() < 767){
        toAgendaDay();
      }
    });

    if ( $( window ).innerWidth() <= 767 ) {
      var h = $( window ).outerHeight() - $( '#newMainNav' ).height() - $( '.agendaTopContainer' ).height() - 2;
      $( '.dashboardBody' ).css( 'height', h + 'px' );
      $( '.dashboardLeft' ).css( 'height', h - 2 + 'px' );
      $( '.dashboardRight' ).css( 'height', h - 2 + $( '.agendaTopContainer' ).height() + 'px' );
      $( '.dashboardBody2' ).css( 'min-height', h + $( '.agendaTopContainer' ).height() - $( 'footer' ).height() + 'px' );
      var y = $( '.dashboardBody2' ).height() - $( '.colegas-header' ).height();
      $( '.dashboardBody2 .main-colegas' ).css( 'max-height', y + 'px' );
      $( '.dashboardBody2 .main-colegas' ).css( 'height', y  + 'px' );
    }
    if ( $( window ).innerWidth() > 767 ) {
      var h = $( window ).height() - $( '#newMainNav' ).height() - 2;
      $( '.dashboardBody' ).css( 'height', h - $( '.agendaTopContainer' ).height() + 'px' );
      $( '.dashboardLeft' ).css( 'height', h - $( '.agendaTopContainer' ).height() - 2  + 'px' );
      $( '.dashboardRight' ).css( 'height', h - $( '.agendaTopContainer' ).height() -2 + 'px' );
      $( '.dashboardBody2' ).css( 'height', h + 'px' );
      var y = $( '.dashboardBody2' ).height() - ( $( '.colegas-header' ).height() );
      $( '#listaEspecialidades' ).css( 'height', y + 'px' );
      $( '.dashboardBody2 .main-colegas' ).css( 'max-height', y + 'px' );
      $( '.dashboardBody2 .main-colegas' ).css( 'height', y + 'px' );
    }

  } else if($( '#medicoSecretaria').length > 0 ){
    if ( $( window ).innerWidth() <= 767 ) {
      var h = $( window ).outerHeight() - $( '#newMainNav' ).height() - $( 'footer' ).height();
      $( '#medicoSecretaria' ).css( 'height', h + 'px' );
      $( '#msBody' ).css( 'height', h - $( '.agendaTopContainer' ).height() + 'px' );
    }
    if ( $( window ).innerWidth() > 767 ) {
      var h = $( window ).outerHeight() - $( '#newMainNav' ).height() - $( 'footer' ).height();
      $( '#medicoSecretaria' ).css( 'height', h + 'px' );
      $( '#msBody' ).css( 'height', h - $( '.agendaTopContainer' ).height() + 'px' );
    }


    if (!$('#agregar').hasClass('hidden')){
      //alert('agregar secretaria');
    } else if (!$('#enEspera').hasClass('hidden')){
      //alert('en espera de secretaria');
    } else if (!$('#mostrar').hasClass('hidden')){
      //alert('mostrar secretaria');
    }
  } else if( $('#oficinaMedico').length > 0 ) {
    var date = new Date();
    $('#diaSemana').text(dias[date.getDay()]);
    $('#diaFecha').text(date.getDate());
    $('#mesFecha').text(meses[date.getMonth()]);
    $('#anioFecha').text(date.getFullYear());

    marcarEventosCalendario();

    var kendoCalendar = $("#calendar").data("kendoCalendar");
      kendoCalendar.value(new Date());
      var fechaInicio = new Date().toISOString().split('T')[0] + ' 00:00:00';
      var fechaFin = new Date().toISOString().split('T')[0] + ' 23:59:59';
      cargarEventosPorDia(fechaInicio, fechaFin);
      kendoCalendar.bind("navigate", function() {
        var value = new Date(this.current());
        var inicio = new Date(value.getFullYear(), value.getMonth(),1).toISOString().split('T')[0];
        var fin = new Date(value.getFullYear(), value.getMonth(), new Date(value.getFullYear(),value.getMonth()+1, 0).getDate()).toISOString().split('T')[0];
      });
      kendoCalendar.bind("change", function() {
        //aqui cargamos los eventos de ese dia en la lista de la derecha
        var value = new Date(new Date(this.value()).toLocaleDateString('en-US'));

        $('#mesFecha').text(meses[value.getMonth()]);
        $('#diaFecha').text(value.getDate());
        $('#anioFecha').text(value.getFullYear());
        $('#diaSemana').text(dias[value.getDay()]);

        var fechaInicio = value.toISOString().split('T')[0] + ' 00:00:00';
        var fechaFin = value.toISOString().split('T')[0] + ' 23:59:59';

        cargarEventosPorDia(fechaInicio,fechaFin);


        if( $(window).width() < 767){
          toAgendaDay();
        }
      });


    if ( $( window ).width() > 767 ) {
      var h = $( window ).height() - $( '#newMainNav' ).height() - $( '.agendaTopContainer' ).height() - 2 - $('footer').height();
      $( '.agendaBody' ).css( 'height', h + 'px' );
      $( '.agendaMonth' ).css( 'height', h - 2 + 'px' );
      $( '.agendaDay' ).css( 'height', h - 2 + 'px' );
    }
    else if ( $( window ).width() < 767 ) {
      var h = $( window ).height() - $( '#newMainNav' ).height() - 2;
      $( '.agendaDay' ).css( 'height', h + 'px' );
      $( '.agendaMonth' ).css( 'height', h - $( '.agendaTopContainer' ).height() + 'px' );
      $( '.agendaOverview' ).css( 'height', ( h - $( '.agendaTopContainer' ).height() + 60 ) / 2 + 'px' );
      $( '.agendaOverview' ).addClass('overview-on-Mobile hidden');
      $( '.agendaDay .day' ).addClass('openOverview');
      $( '.agendaOverview .closeOverview' ).removeClass('hidden');
    }

  } else if($('#galeriaMedico').length > 0) {
    $('.carousel').carousel('pause');

    if ( $( window ).width() > 767 ) {
      var h = $( window ).height() - $( '#newMainNav' ).height() - $('footer').height();
      var h2 = h - $('#stickyNav').height() - $('#uploadControl').height();
      $( '#galeriaBody' ).css( 'height', h + 'px' );
      $( '#galeriaPanel' ).css('height', h2 + 'px');
      $( '#uploadPanel .well' ).css('height', $( '#galeriaPanel' ).height() + 'px');
      $( '#uploadPanel2 .well' ).css('height', $( '#galeriaPanel' ).height() + 'px');
      $( '#slideGaleria' ).css('height', $('#galeriaPanel').height() - 30 + 'px');
      $( '.img-container' ).css('height', $( '#slideGaleria' ).height() + 'px');
      $( '.caption-container' ).css('height', $( '#slideGaleria' ).height() + 'px');
    }
    else if ( $( window ).width() < 767 ) {
      console.log($(window).height());

      var h2 = h - $('#stickyNav').height() - $('#uploadControl').height() - $('#stickyNav').height();
      $( '#galeriaBody' ).css( 'height', h + 'px' );
      $( '#galeriaBody' ).css('padding-top', $( '#newMainNav' ).height() + $('#stickyNav').height() + 'px')
      $( '#galeriaPanel' ).css('height', h2 + 'px');
      $( '#uploadPanel .well' ).css('height', $( '#galeriaPanel' ).height() + 'px');
      $( '#uploadPanel .well' ).css('height', $( '#galeriaPanel' ).height() + 'px');
      $( '#slideGaleria' ).css('height', $('#galeriaPanel').height() + 'px');
      $( '.img-container' ).css('height', $( '#slideGaleria' ).height() - 120 + 'px');
      $( '.caption-container' ).css('height', 120 + 'px');
    }

    $('.gallery-thumb-content').on('click',function(){
      var currentId = $(this).find('.id').text();
      iniciarGaleria(currentId);
    });

    $('#btnUpToGallery').on('click',function(){
      $('#imageUploadChoser').click();
    });
    $('#btnUploadImages').addClass('hidden');
    $('#imageUploadChoser').on('change', function (evt) {
      cargarImagenes(evt);
    });

    GalleryThumbnail();

  } else if ($('#feedback').length > 0){
    getFeedback();

    if ( $( window ).width() > 767 ) {
      var h = $( window ).height() - $( 'footer' ).height() - $( '#newMainNav' ).height() - 15;
      $('#moderarComentarios').css('max-height', h -$('#panelEstadisticas').height() - 20 + 'px');
      $('#moderarComentarios .panel').css('max-height', $('#moderarComentarios').height() + 'px');
      $('#moderarComentarios .panel-body').css('height', $('#moderarComentarios .panel').height() - $('#moderarComentarios .panel .panel-heading').outerHeight() + 'px');

      $('#panelTopDr').css('height', ($('#moderarComentarios').height() / 2) + 'px');
      $('#panelTopDr .panel').css('height', $('#panelTopDr').height() - 10 + 'px');
      $('#panelTopDr .panel-body').css('height', $('#panelTopDr .panel').height() - $('#panelTopDr .panel .panel-heading').outerHeight() + 'px');

      $('#panelEstrellas').css('height', ($('#moderarComentarios').height() / 2) + 'px');
      $('#panelEstrellas .panel').css('height', $('#panelEstrellas').height() + 'px');
      $('#panelEstrellas .panel-body').css('height', $('#panelEstrellas .panel').height() - $('#panelEstrellas .panel .panel-heading').outerHeight() + 'px');
    }
    else if ( $( window ).width() < 767 ) {
      var h = $( window ).height() - $( 'footer' ).height() - $( '#newMainNav' ).height() ;
      $('#moderarComentarios').css('max-height', h - 20 + 'px');
      $('#moderarComentarios .panel').css('max-height', $('#moderarComentarios').height() + 'px');
      $('#moderarComentarios .panel-body').css('height', $('#moderarComentarios .panel').height() - $('#moderarComentarios .panel .panel-heading').outerHeight() + 'px');

      $('#panelTopDr').css('height', ($('#moderarComentarios').height() / 3) + 'px');
      $('#panelTopDr .panel').css('height', $('#panelTopDr').height() - 10 + 'px');
      $('#panelTopDr .panel-body').css('height', $('#panelTopDr .panel').height() - $('#panelTopDr .panel .panel-heading').outerHeight() + 'px');

      $('#panelEstrellas').css('height', ($('#moderarComentarios').height() / 3) + 'px');
      $('#panelEstrellas .panel').css('height', $('#panelEstrellas').height() - 10 + 'px');
      $('#panelEstrellas .panel-body').css('height', $('#panelEstrellas .panel').height() - $('#panelEstrellas .panel .panel-heading').outerHeight() + 'px');
    }

  } else if ($('#configuraciones').length > 0){
    if ( $( window ).width() > 767 ) {
      var h = $( window ).height() - $( 'footer' ).height() - $( '#newMainNav' ).height() ;
      $('#configuraciones').css('height', h + 'px');
      $('#configPanel').css('height', h - 30 + 'px');
      $('#configPanel .panel-body.mainpb').css('height', $('#configPanel').height() + 'px');
      $('#configPanel .tab-pane').css('height', $('#configPanel .panel-body').height() + 'px');
    }
    else if ( $( window ).width() < 767 ) {
      var h = $( window ).height() - $('#newMainNav').height() ;
      $('#configuraciones').css('height', h + 'px');
      $('#configPanel').css('height', h - $( 'footer' ).height() + 'px');
      $('#configPanel .panel-body.mainpb').css('height', $('#configPanel').height() + 'px');
      $('#configPanel .tab-pane').css('height', $('#configPanel .panel-body').height() + 'px');
    }


  }
} );

function GalleryThumbnail() {
  var w = $('.gallery-thumbnail').outerWidth();
  var h = w;
  $('.gallery-thumbnail').css('height', h + 'px' );
}


$( window ).resize( function() {
  GalleryThumbnail();
})


function marcarEventosCalendario(){
  var today = new Date();
  if ($("#calendar").data("kendoCalendar")){
    today = $("#calendar").data("kendoCalendar").value();
  }

  var timeZoneOffset = '';

  var n = parseInt(today.getTimezoneOffset())/60;

  if (n<0){
    timeZoneOffset = '+';
  } else {
    timeZoneOffset = '-'
  }
  n = n.toString().replace('+','').replace('-','');

  if (n.split('.')[0].length== 1){
    timeZoneOffset += '0'+n.split('.')[0];
  } else {
    timeZoneOffset += n.split('.')[0];
  }
  if (!n.split('.')[1]){
    timeZoneOffset += ':00';
  } else {
    timeZoneOffset += ':' + n.split('.')[1];
  }

  $("#calendar").html('');
  var events = [];
  $.ajax( {
    url: '/agenda/cargarCitasMes',
    type: 'POST',
    dataType: "json",
    data: {tz:timeZoneOffset},
    cache: false,
    async: false,
    success: function ( data ) {
      events = [];
      data.result.forEach(function(res){
        var fecha = res.FECHA.split('T')[0].split('-');
        events.push(new Date(parseInt(fecha[0]), parseInt(fecha[1])-1, parseInt(fecha[2])).getTime());
      });
    },
    error: function ( jqXHR, textStatus, err ) {
      events = [];
    }
  } );

  $("#calendar").kendoCalendar({
    culture: 'es-MX',
    start: "day",
    depth: "decade",
    value: today,
    dates: events,
    month: {
      // template for dates in month view
      content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                  '<div class="' +
                     '# if (data.value) { #' +
                         "dayEvent" +
                     '# } else { #' +
                         "day" +
                     '# } #' +
                  '">#= data.value #</div>' +
               '# } else { #' +
               '#= data.value #' +
               '# } #'
    },
    footer: false
  });
}

function getFeedback(tipo){
    $.ajax( {
      url: '/medico/feedback',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        //[{"anio":2015,"mes":3,"higiene":100,"puntualidad":100,"instalaciones":90,"tratoPersonal":100,"costo":100,"satisfaccionGeneral":100},{"anio":2016,"mes":2,"higiene":100,"puntualidad":100,"instalaciones":100,"tratoPersonal":100,"costo":100,"satisfaccionGeneral":100}]
        var dataset = {labels:[],datasets:[]};

        var fechas = [];

        var d = new Date();
        var year = d.getFullYear();
        var month = (parseInt(d.getMonth)+1);

        for (var i = 0; i < 6; i++){
          fechas.unshift({
            label: meses[parseInt(d.getMonth())]+'/'+d.getFullYear(),
            year: d.getFullYear(),
            month: d.getMonth()+1
          });
          d = new Date(new Date(d).setMonth(new Date(d).getMonth()-1));
        }

        var dataHigiene = {
            label: "Higiene",
            fillColor: "rgba(222, 222, 222, 0.2)",
            strokeColor: "rgba(56, 94, 157, 1)",
            pointColor: "rgba(56, 94, 157, 1)",
            pointDotStrokeWidth : 2,
            data: []
          }
        var dataPuntualidad = {
            label: "Puntualidad",
            fillColor: "rgba(222, 222, 222, 0.2)",
            strokeColor: "rgba(217, 71, 58, 1)",
            pointColor: "rgba(217, 71, 58, 1)",
            pointDotStrokeWidth : 2,
            data: []
          }
        var dataInstalaciones = {
            label: "Instalaciones",
            fillColor: "rgba(222, 222, 222, 0.2)",
            strokeColor: "rgba(234, 224, 64, 1)",
            pointColor: "rgba(234, 224, 64, 1)",
            pointDotStrokeWidth : 2,
            data: []
          }
        var dataTratoPersonal = {
            label: "Trato Personal",
            fillColor: "rgba(222, 222, 222, 0.2)",
            strokeColor: "rgba(106, 182, 91, 1)",
            pointColor: "rgba(106, 182, 91, 1)",
            pointDotStrokeWidth : 2,
            data: []
          }
        var dataCosto = {
            label: "Costo",
            fillColor: "rgba(222, 222, 222, 0.2)",
            strokeColor: "rgba(80, 79, 68, 1)",
            pointColor: "rgba(80, 79, 68, 1)",
            pointDotStrokeWidth : 2,
            data: []
          }

          fechas.forEach(function(fecha){
            JSON.stringify(fecha)
            var encontrado = false;
            data.promedios.forEach(function(prom){
              if (parseInt(fecha.year) == parseInt(prom.anio) && parseInt(fecha.month) == parseInt(prom.mes)){
                encontrado = true;
                dataset.labels.push(fecha.label);
                dataHigiene.data.push(prom.higiene);
                dataPuntualidad.data.push(prom.puntualidad);
                dataInstalaciones.data.push(prom.instalaciones);
                dataTratoPersonal.data.push(prom.tratoPersonal);
                dataCosto.data.push(prom.costo);
              }
            });
            if (!encontrado){
              dataset.labels.push(fecha.label);
              dataHigiene.data.push(0);
              dataPuntualidad.data.push(0);
              dataInstalaciones.data.push(0);
              dataTratoPersonal.data.push(0);
              dataCosto.data.push(0);
            }
          });


        if (!tipo){
            getCalTopDr(data.calificacion.calificacion);
            if (data.general[0]){
              getCalGeneral(data.general);
            }
            dataset.datasets.push(dataHigiene);
            dataset.datasets.push(dataPuntualidad);
            dataset.datasets.push(dataInstalaciones);
            dataset.datasets.push(dataTratoPersonal);
            dataset.datasets.push(dataCosto);
        } else {
          if (tipo == 1){
            //Todos
            dataset.datasets.push(dataHigiene);
            dataset.datasets.push(dataPuntualidad);
            dataset.datasets.push(dataInstalaciones);
            dataset.datasets.push(dataTratoPersonal);
            dataset.datasets.push(dataCosto);
          } else if (tipo == 2){
            //higiene
            dataset.datasets.push(dataHigiene);
          } else if (tipo == 3){
            //instalaciones
            dataset.datasets.push(dataInstalaciones);
          } else if (tipo == 4){
            //puntualidad
            dataset.datasets.push(dataPuntualidad);
          } else if (tipo == 5){
            //trato
            dataset.datasets.push(dataTratoPersonal);
          } else if (tipo == 6){
            //costo
            dataset.datasets.push(dataCosto);
          }
        }

        var width = $('#feedbackResult').parent().width();
        var ctx = document.getElementById("feedbackResult").getContext("2d");
        ctx.canvas.width = width;
        if ( $( window ).width() > 768 ) {
          ctx.canvas.height = 150;
        }
        else if ( $( window ).width <= 768 ) {
          ctx.canvas.height = 200;
        }
        var myNewChart = new Chart(ctx).Line(dataset,{
          scaleOverride: true,
          scaleSteps: 5,
          scaleStepWidth: 20,
          scaleStartValue: 0,
          tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
        });
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
}

function getCalTopDr(calificacion){
    if (!calificacion){
      calificacion = 0;
    }
    var color;
    if (parseInt(calificacion) < 60 ){
      color = 'rgb(217, 71, 58)';//rojo
    } else if (parseInt(calificacion) < 80){
      color = 'rgb(234, 224, 64)';//amarillo
    } else if (parseInt(calificacion) > 80){
      color = 'rgb(106, 182, 91)';//verde
    }
    var dataTopDr = [
        {
            value: calificacion,
            color: color
        },
        {
            value: (100-parseInt(calificacion)),
            color:"transparent"
        }
    ]
    $('#topDrPer').text(calificacion + '%');

    var h = $('#feedbackTopDr').parent().parent().parent().outerHeight() - 30;
    var ctx = document.getElementById("feedbackTopDr").getContext("2d");
    ctx.canvas.width = h;
    ctx.canvas.height = h;
    var myNewChart = new Chart(ctx).Doughnut(dataTopDr,{
      segmentStrokeWidth : 1,
       showTooltips: false
    });
}

function getCalGeneral(calificaciones){


    var dataCalGeneral = [];
    var unaEstrella = {
        value: 10,
        color:"#a0d197",
        label: '★✩✩✩✩'
    };
    var dosEstrellas = {
        value: 0,
        color:"#93ca88",
        label: '★★✩✩✩'
    };
    var tresEstrellas = {
        value: 0,
        color:"#85c379",
        label: '★★★✩✩'
    };
    var cuatroEstrellas = {
        value: 0,
        color:"#78bd6a",
        label: '★★★★✩'
    };
    var cincoEstrellas = {
        value: 20,
        color:"#6ab65b",
        label: '★★★★★'
    };

    var total = 0;
    var sumtotal = 0;
    calificaciones.forEach(function(cal){
      total = total + parseInt(cal.total);
      sumtotal = sumtotal + (parseInt(cal.total)*(cal.porcentaje));
      if (cal.porcentaje <= 20){
        unaEstrella.value = unaEstrella.value+ parseInt(cal.total);
      } else if (cal.porcentaje <= 40){
        dosEstrellas.value = dosEstrellas.value + parseInt(cal.total);
      } else if (cal.porcentaje <= 60){
        tresEstrellas.value = tresEstrellas.value + parseInt(cal.total);
      } else if (cal.porcentaje <= 80){
        cuatroEstrellas.value = cuatroEstrellas.value +  parseInt(cal.total);
      } else {
        cincoEstrellas.value = cincoEstrellas.value + parseInt(cal.total);
      }
    });

    dataCalGeneral = [unaEstrella,dosEstrellas,tresEstrellas,cuatroEstrellas,cincoEstrellas];

    $('#feedbackGeneral').append('<input id="prom_estrellas" type="number" value="'+ ((sumtotal/total)/20) +'" class="rating">');
    $("#prom_estrellas").rating({displayOnly: true, step: 0.5, readonly:true});

    $('.clear-rating').css('display','none');
    $('.caption').css('display','none');

    /*if ( $( window ).width() >= 992 ) {
      $('#starsContainer').height($('#feedbackTopDr').height()/2);
    }
    else if ( $( window ).width() < 992 ) {
      $('#starsContainer').height($('#feedbackTopDr').height());
    }*/

    $('#starDetails').popover({
        html : true,
        content: function(){
          return '<input type="number" value="1" class="rating rating-details"><span class="pull-right" style=" position: absolute;margin-top: -20px;right: 19px;">'+ unaEstrella.value +'</span><br>'+
          '<input type="number" value="2" class="rating rating-details"><span class="pull-right" style=" position: absolute;margin-top: -20px;right: 19px;">'+ dosEstrellas.value +'</span><br>'+
          '<input type="number" value="3" class="rating rating-details"><span class="pull-right" style=" position: absolute;margin-top: -20px;right: 19px;">'+ tresEstrellas.value +'</span><br>'+
          '<input type="number" value="4" class="rating rating-details"><span class="pull-right" style=" position: absolute;margin-top: -20px;right: 19px;">'+ cuatroEstrellas.value +'</span><br>'+
          '<input type="number" value="5" class="rating rating-details"><span class="pull-right" style=" position: absolute;margin-top: -20px;right: 19px;">'+ cincoEstrellas.value +'</span>';
        }
    });
}

function mostrarDetallesEstrellas(){
  setTimeout(function(){
    $(".rating").rating({displayOnly: true, readonly:true,'size':'xs'});
    $('.clear-rating').css('display','none');
    $('.caption').css('display','none');

    $('#starsContainer .popover').css('width',$('#starsContainer').outerWidth()+30);
    $('.popover').css('left','20px');
  },100);
}

function cargarEventosPorDia(fechaInicio, fechaFin){
  $.post('/agenda/eventos/dia',{fecha:fechaInicio,fin:fechaFin},function(data){
    if (data.success){
      var contenido = '';
      limpiarAgendaDia(fechaInicio);
      var anio = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[2]);
      var mes = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[0]);
      var dia = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[1]);

      data.horarios.forEach(function(horario){
        var horaInicio = horario.horaInicio.split(':');
        horaInicio[0] = parseInt(horaInicio[0]);
        var horaFin = horario.horaFin.split(':');
        while ((parseInt(horaInicio[0]) < parseInt(horaFin[0])) || (parseInt(horaInicio[0]) <= parseInt(horaFin[0]) && parseInt(horaInicio[1])<parseInt(horaFin[1]))){
          $('.mediaHora.'+anio+'-'+mes+'-'+dia+'-'+parseInt(horaInicio[0]) +'-'+parseInt(horaInicio[1])).removeClass('noDisponible');
          if (parseInt(horaInicio[1]) == 45){
            horaInicio[1] = '00';
            horaInicio[0] = parseInt(horaInicio)+1;
          } else {
            horaInicio[1] = parseInt(horaInicio[1])+15;
          }
        }
      });
      data.eventos.forEach(function(res){
        //{"id":7,"fechaHoraInicio":"2016-04-01T06:00:00.000Z","fechaHoraFin":"2016-04-01T15:00:00.000Z","nombre":"Evento de madrugada","ubicacion":"Los mochis","descripcion":"","usuario_id":8}
            var anio = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[2]);
            var mes = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[0]);
            var dia = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[1]);

            var horaInicio = new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[1];
            var horaFin = new Date(res.fechaHoraFin).toLocaleString('en-US').split(', ')[1];

            hora = parseInt(horaInicio.split(':')[0]);
            minutos = parseInt(horaInicio.split(':')[1]);

            if (hora == 12 && new Date(res.fechaHoraInicio).toLocaleString('en-US').search('AM')>0){
              hora = 0;
            } else if (hora != 12 && new Date(res.fechaHoraInicio).toLocaleString('en-US').search('PM')>0){
              hora = hora + 12;
            }

            var clase = anio+'-'+mes+'-'+dia+'-'+hora+'-'+minutos;
            var element = $('.mediaHora.'+clase);
            element.addClass('ocupada').addClass('consulta');
            element.find('.glyphicon').addClass('glyphicon-bookmark');

            element.find('.nombre').text(res.nombre);
            element.find('.ubicacion').text(res.ubicacion);
            element.find('.media').removeClass('hidden');
            if (res.status == 2){
              element.find('.media-right').text('Cancelada');
              element.addClass('cancelada');
            }
            element.find('.mediaHoraInterno').on('click',function(){
              detalleEventoMedico(res.id);
            });

            var fechaInicio = new Date(res.fechaHoraInicio);
            var fechaFin = new Date(res.fechaHoraFin);
            fechaInicio = new Date(fechaInicio.setMinutes(fechaInicio.getMinutes()+15));

            while (fechaInicio < fechaFin){
              var locale  = fechaInicio.toLocaleString('en-US');
              var anio = parseInt(locale.split(', ')[0].split('/')[2]);
              var mes = parseInt(locale.split(', ')[0].split('/')[0]);
              var dia = parseInt(locale.split(', ')[0].split('/')[1]);
              var hora =parseInt(locale.split(', ')[1].split(':')[0]);
              var minutos = parseInt(locale.split(', ')[1].split(':')[1]);
              if (hora == 12 && locale.search('AM')>0){
                hora = 0;
              } else if (hora != 12 && locale.search('PM')>0){
                hora = hora + 12;
              }

              var clase = anio+'-'+mes+'-'+dia+'-'+hora+'-'+minutos;
              $('.mediaHora.'+clase).addClass('ocupada').addClass('bloque');

              $('.mediaHora.'+clase).on('click',function(){
                detalleEventoMedico(res.id);
              });
              fechaInicio = new Date(fechaInicio.setMinutes(fechaInicio.getMinutes()+15));
            }
      });
      data.result.forEach(function(res){
          var anio = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[2]);
          var mes = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[0]);
          var dia = parseInt(new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[0].split('/')[1]);

          var horaInicio = new Date(res.fechaHoraInicio).toLocaleString('en-US').split(', ')[1];
          var horaFin = new Date(res.fechaHoraFin).toLocaleString('en-US').split(', ')[1];

          hora = parseInt(horaInicio.split(':')[0]);
          minutos = parseInt(horaInicio.split(':')[1]);

          if (hora == 12 && new Date(res.fechaHoraInicio).toLocaleString('en-US').search('AM')>0){
            hora = 0;
          } else if (hora != 12 && new Date(res.fechaHoraInicio).toLocaleString('en-US').search('PM')>0){
            hora = hora + 12;
          }

          var clase = anio+'-'+mes+'-'+dia+'-'+hora+'-'+minutos;


          var element = $('.mediaHora.'+clase);
          element.addClass('ocupada').addClass('consulta');
          element.find('.glyphicon').addClass('glyphicon-user');

          var nombre = '';
          if (res.PacienteTemporal){
            nombre = res.PacienteTemporal.nombres + ' ' + res.PacienteTemporal.apellidos;
          } else {
            nombre = res.Paciente.Usuario.DatosGenerale.nombre  + ' ' + res.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + res.Paciente.Usuario.DatosGenerale.apellidoM;
          }
          element.find('.nombre').text(nombre);
          var ubicacion = res.Direccion.nombre;
          element.find('.ubicacion').text(ubicacion);
          element.find('.media').removeClass('hidden');
          if (res.status == 2){
            element.find('.media-right').text('Cancelada');
            element.addClass('cancelada');
          }
          element.find('.mediaHoraInterno').on('click',function(){
            detalleCitaSecretaria(res.id);
          });

          var fechaInicio = new Date(res.fechaHoraInicio);
          var fechaFin = new Date(res.fechaHoraFin);
          fechaInicio = new Date(fechaInicio.setMinutes(fechaInicio.getMinutes()+15));

          while (fechaInicio < fechaFin){
            var locale  = fechaInicio.toLocaleString('en-US');
            var anio = parseInt(locale.split(', ')[0].split('/')[2]);
            var mes = parseInt(locale.split(', ')[0].split('/')[0]);
            var dia = parseInt(locale.split(', ')[0].split('/')[1]);
            var hora =parseInt(locale.split(', ')[1].split(':')[0]);
            var minutos = parseInt(locale.split(', ')[1].split(':')[1]);
            if (hora == 12 && locale.search('AM')>0){
              hora = 0;
            } else if (hora != 12 && locale.search('PM')>0){
              hora = hora + 12;
            }

            var clase = anio+'-'+mes+'-'+dia+'-'+hora+'-'+minutos;
            $('.mediaHora.'+clase).addClass('ocupada').addClass('bloque');

            if (res.status == 2){
              $('.mediaHora.'+clase).addClass('cancelada');
            }

            $('.mediaHora.'+clase).on('click',function(){
              detalleCitaSecretaria(res.id);
            });
            fechaInicio = new Date(fechaInicio.setMinutes(fechaInicio.getMinutes()+15));
          }

      });

      $('.mediaHora').not('.ocupada').on('click',function(){
        var clases = $(this).attr("class").split(' ');
        var horario;
        clases.forEach(function(clase){
          if (clase.split('-')[3]){
            horario = clase.split('-')[3] +':'+clase.split('-')[4]
          }
        });
        //2016-03-30T17:29:12.860Z8:00
        var clase = parseInt(horario.split(':')[0]) + '-' + horario.split(':')[1];
        var date = $("#calendar").data("kendoCalendar").value().toISOString().split('T')[0];
        var fecha = new Date(parseInt(date.split('-')[0]),parseInt(date.split('-')[1])-1,parseInt(date.split('-')[2]),parseInt(horario.split(':')[0]),parseInt(horario.split(':')[1]))

        if ($(this).hasClass('noDisponible')){
          seleccionarAgregarEvento(fecha.getTime(),fecha,null,clase);
        } else {
          seleccionarAgregarEventoCita(fecha.getTime(),fecha,null,clase);
        }
      });

    }
  }).fail(function(e){
    console.log('POST fail: ' + e);
  });
}

function limpiarAgendaDia(fechaInicio){
    //4/13/2016

    var contenido = '';
    for (var hora = 8; hora < 21; hora++) {
      var tipohora = 'am';
      if (hora>=12){
        tipohora = 'pm';
      }

      contenido += `<div class="row hora">
      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-1 noPadding">
      <p class="noMargin">
        <span class="lbl-hora h77-boldcond">`+ hora +` `+ tipohora +`</span>
      </p>
      </div>
      <div class="col-lg-11 col-md-11 col-sm-10 col-xs-11">`;

      for (var i = 0; i < 4; i++) {
        var anio = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[2]);
        var mes = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[0]);
        var dia = parseInt(new Date(fechaInicio).toLocaleString('en-US').split(', ')[0].split('/')[1]);

        var minutos = (i*15);
        contenido += `<a role="button" class="row mediaHora noDisponible `+ anio +`-`+ mes +`-`+ dia +`-`+ hora +`-`+ minutos +`">
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 noPadding">
            <div class="mediaHoraInterno tiempo">
              <div class="body-container">
                <div class="center-content">
                  <span class="lbl-mediahora h77-boldcond">`+ hora +`:`+ ('0'+minutos).slice('-2') +`</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
            <div class="mediaHoraInterno">
              <div class="body-container">
                <div class="center-content">
                  <div class="media hidden">
                    <div class="media-left">
                      <span class="glyphicon s35 darkBlue-c "></span>
                    </div>
                    <div class="media-body">
                      <h4 class="h77-boldcond s20 noMargin white-c nombre"></h4>
                      <h4 class="h75-bold s15 noMargin white-c"><small class="ubicacion"></small></h4>
                    </div>
                    <div class="media-right text-right s20 "></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>`;
      }

      contenido += `</div>
      </div>`;
      }
      $('.horas-container').html(contenido);
}
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
function CambiarVisible(anterior,nuevo, formacion_id, experiencia_id){
  $('#formAcademica')[0].reset();
  if (formacion_id || experiencia_id){

    $('#divInicio').removeClass('col-md-10');
    $('#divInicio').addClass('col-md-3');
    $('#divFin').removeClass('hidden');
    $('#divGrado').removeClass('hidden');

    $('#formacion_id').val('');
    $('#experiencia_id').val('');

    if (formacion_id>0 && !(formacion_id === true)){
      //AJax para traer la informacion de la formacion_id
      cargarFormacionAcademicaByID(formacion_id);
    } else if (experiencia_id>0 && !(experiencia_id === true)){
      //AJax para traer la informacion de la formacion_id
      cargarExperienciaLaboralById(experiencia_id);
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

        $('#tabPerfil').addClass('active');
        $('#tabImagen').removeClass('active');
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
function cargarListaEspCol( usuario ,tipo) {
  if (!$('#colegas').hasClass('hidden')){
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
            '<a onclick="cargarListaColegasByEsp(' + usuario + ',' + esp.id + ',this,\''+tipo+'\')">' + esp.especialidad + '<span class="badge pull-right">' + esp.total + '</span></a>' +
            '</li>';
          });
          $('#especialidadesList').html(contenido);
          if (primero != ""){
            cargarListaColegasByEsp(usuario,primero,null,tipo);
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
}
function cargarListaColegasByEsp(usuario_id,especialidad_id, element,tipo){
  var classDiv = 'class="col-lg-3 col-md-3 col-sm-4 col-xs-6"';
  if (tipo && tipo == "P"){
    classDiv = 'class="col-lg-3 col-md-3 col-sm-4 col-xs-6"';
  }

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
          contenido +=
          '<div '+classDiv+'>'+
            '<div class="thumbnail noPadding noMargin">'+
              '<div >'+
                '<a class="" href="/'+ usuarioUrl +'"><img class="img-responsive" src="'+ res.urlFotoPerfil +'" alt="..."></a>'+
              '</div>'+
              '<div class="caption">'+
                '<div class="nombre h77-boldcond">'+
                  'Dr.&nbsp;<span>'+ res.DatosGenerale.nombre +'</span>&nbsp;<span>'+ res.DatosGenerale.apellidoP +' '+ res.DatosGenerale.apellidoM +'</span>'+
                '</div>'+
                '<div class="esp h67-medcond">'+
                  '<span class="colEsp">'+ especialidad +'</span>'+
                '</div>'+
                '<a class="h67-medcondobl" href="/'+ usuarioUrl +'">Ver Perfil</a>'+
              '</div>'+
            '</div>'+
          '</div>'
        })
        /*contenido += '</div>';*/
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

function cargarListaAlfCol( usuario ,tipo) {
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
        $('#listaColegas').html('');
        $('#tipoFiltro').html('una letra');
        if ( data.success ) {
          var contenido = '';
          var primero = '';
          data.result.forEach(function(rec){
            if (primero == ""){
              primero = rec.Letra;
            }
            contenido += '<li>' +
              '<a onclick="cargarListaColegasByAlf(' + usuario + ',\'' + rec.Letra + '\',this,\''+tipo+'\')">' + rec.Letra + '<span class="badge pull-right">' + rec.Total + '</span></a>' +
            '</li>';
          });
          $('#especialidadesList').html(contenido);
          if (primero != ""){
            cargarListaColegasByAlf(usuario,primero,null,tipo);
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
function cargarListaColegasByAlf(usuario_id,letra,element,tipo){
  var classDiv = 'class="col-lg-3 col-md-3 col-sm-4 col-xs-4"';
  if (tipo && tipo == "P"){
    classDiv = 'class="col-lg-3 col-md-4 col-sm-4 col-xs-4"';
  }
  $('#especialidadesList li.active').removeClass('active');
  if (element){
    $(element).parent().addClass('active');
  } else {
    $('#especialidadesList li').first().addClass('active');
  }
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

          if (res.DatosGenerale.apellidoM == null){
            res.DatosGenerale.apellidoM = '';
          }
          var usuarioUrl = res.usuarioUrl;
          if (res.urlPersonal && res.urlPersonal != ""){
            usuarioUrl = res.urlPersonal;
          }
          contenido +=
          '<div '+classDiv+'>'+
            '<div class="thumbnail">'+
              '<div >'+
                '<a class="pPic" href="/'+ usuarioUrl +'"><img src="'+ res.urlFotoPerfil +'" alt="..."></a>'+
              '</div>'+
              '<div class="caption">'+
                '<div class="nombre h77-boldcond">'+
                  'Dr.&nbsp;<span>'+ res.DatosGenerale.nombre +'</span>&nbsp;<span>'+ res.DatosGenerale.apellidoP +' '+ res.DatosGenerale.apellidoM +'</span>'+
                '</div>'+
                '<div class="esp h67-medcond">'+
                  '<span class="colEsp">'+ especialidad +'</span>'+
                '</div>'+
                '<a class="h67-medcondobl" href="/'+ usuarioUrl +'">Ver Perfil</a>'+
              '</div>'+
            '</div>'+
          '</div>'
        })
        /*contenido += '</div>';*/
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
  mapSearchDiv();

  autoCompleteEsp('inputEspecialidad',true);
  autoCompleteAseg('inputAseguradora');
}
//<------------- FIN DE LAS FUNCIONES ---------------------------->
function autoCompleteEsp(inputId, defaultSelect){
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
        InputAutoComplete(inputId,availableTags, defaultSelect);
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

function formatearFechaLocalT(fecha){
  //Transforma: 03/31/2016, 07:00:00 PM -> 2016-03-31T19:00:00
  fecha = new Date(fecha).toLocaleString('en-US');
  fecha = fecha.split(', ');
  var mes = fecha[0].split('/')[0].toString();
  var dia = fecha[0].split('/')[1].toString();
  var anio = fecha[0].split('/')[2].toString();
  var horas = parseInt(fecha[1].split(':')[0]);
  var minutos = parseInt(fecha[1].split(':')[1]).toString();

  if (mes.length== 1){
    mes = '0'+mes;
  }
  if (dia.length== 1){
    dia = '0'+dia;
  }
  if (horas != 12 && fecha[1].search('PM')>0){
    horas = horas+12;
  }

  horas = horas.toString();
  if (horas.length== 1){
    horas = '0'+horas;
  }

  if (minutos.length== 1){
    minutos = '0'+minutos;
  }

  fecha = anio +'-'+mes+'-'+dia+'T'+horas+':'+minutos+':00';

  return fecha;
}

function cargarCitasPaciente(offset, element){
    $.ajax({
      async: false,
      url: '/ag/pac/get',
      type: 'POST',
      dataType: "json",
      cache: false,
      success: function ( data ) {
        if (data.success){
          var contenido = '';
          var meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
          data.result.forEach(function(res){
            var date = new Date(res.fechaHoraInicio).toLocaleString('en-US');
            //4/7/2016, 12:00:00 PM
            //mes/dia/año, hora, minutos
            var dia = date.split(', ')[0].split('/')[1];
            var mes = date.split(', ')[0].split('/')[0];

            var hora = parseInt(date.split(', ')[1].split(':')[0]);
            var minutos = date.split(', ')[1].split(':')[1];

            var T = 'AM';
            if (date.search('PM')>0){
              T = 'PM';
              if (hora != 12){
                hora = hora + 12;
              }
            } else {
              if (hora == 12){
                hora = 0;
              }
            }

            hora = hora + ':'+minutos+' ' + T;
            mes = meses[mes-1];
            if (res.Usuario.DatosGenerale.apellidoM && res.Usuario.DatosGenerale.apellidoM != ""){
              res.Usuario.DatosGenerale.apellidoM = ' ' + res.Usuario.DatosGenerale.apellidoM;
            } else {
              res.Usuario.DatosGenerale.apellidoM = '';
            }
            var nombre = res.Usuario.DatosGenerale.nombre  + ' ' + res.Usuario.DatosGenerale.apellidoP + res.Usuario.DatosGenerale.apellidoM;
            contenido += '<div class="media list-group-item" style="background-color:#CACACA;border: none;">';
              contenido += '<div class="media-left text-center" style="padding: 10px;padding-top: 2px;padding-bottom: 2px;background-color:#FFF">';
                contenido += '<h1 style="padding:2px;margin:0px;">'+ dia +'</h1>';
                contenido += '<h3 style="padding:0px;margin:0px;">'+ mes +'</h3>';
              contenido += '</div>';
              contenido += '<div class="media-body text-left" style="padding: 10px;">';
                contenido += '<h4 class="media-heading">'+ hora +'</h4>';
                contenido += '<h5>'+ nombre +'</h5>';
                contenido += '<a onclick="DetallesCitaPaciente('+ res.id +')">Ver detalles >></a>';
              contenido += '</div>';
            contenido += '</div>';
          });
          $('#div_citasPaciente').html(contenido);
        } else if (data.error){
          //manejadorDeErrores(data.error);
        }
      },
      error: function (err){
        console.log('Ajax error: ' + JSON.stringify(err));
      }
    });
}

function cargarCitasPacientePrev(){
  var active = null;
  $('.citaPac.active').each(function(){
    active = $(this);
  });
  if (active){
    var offset = active.text();
    offset = parseInt(offset)-1;
    $('.citaPac').each(function(){
      if ($(this).text() == offset){
        active = $(this).find('a').first();
      }
    });
    cargarCitasPaciente((parseInt(offset)-1),active);
  }
}

function cargarCitasPacienteNext(){
  var active = null;
  $('.citaPac.active').each(function(){
    active = $(this);
  });
  if (active){
    var offset = active.text();
    offset = parseInt(offset)+1;
    $('.citaPac').each(function(){
      if ($(this).text() == offset){
        active = $(this).find('a').first();
      }
    });
    cargarCitasPaciente(offset-1,active);
  }
}



function agregarDestRecom(){
  var nombre = $('#nombreRecomendacion').val();
  var email = $('#correoRecomendacion').val();

  $('#destRecomendacion').append('<li class="lbl lbl-recomendacion">'+
    '<span class="Nombre">'+nombre+'</span>&lt;'+
    '<span class="Correo">'+email+'</span>&gt;'+
    '<button class="btn btn-sm borrar" onclick="$(this).parent().remove()">'+
      '<span class="glyphicon glyphicon-remove"</span>'+
    '</button>'+
  '</li>');
  $('#destRec')[0].reset();
  return false;
}


function revisarTipoSesion(){
  var tipoSesion = '';
  $.ajax({
    async: false,
    url: '/session/tipo',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      tipoSesion = data.tipoUsuario;
    },
    error: function(err){
      console.log('AJAX error: ' + JSON.stringify(err));
      return false;
    }
  });
  return tipoSesion;
}

function iniciarSesionLocal(inputEmail, inputPassword, callback, usuarioMedico_id, reload){
  try{
    var email = $('#'+inputEmail).val();
    var pass = hex_md5($('#'+inputPassword).val());
    $.ajax({
      async: false,
      url: '/auth/correo',
      type: 'POST',
      dataType: "json",
      data:{'email':email,'password':pass},
      cache: false,
      success: function ( data ) {
          if (data.success){
            if (callback){
              bootbox.hideAll();
              actualizarSesion(false, callback, usuarioMedico_id);
            } else {

              if (reload){
                window.location.reload();
              } else {
                window.location.href = '/';
                /*
                var usuarioUrl = data.session.usuarioUrl;
                if (data.session.urlPersonal){
                  usuarioUrl = data.session.urlPersonal;
                }
                if (usuarioUrl){
                window.location.href = '/'+usuarioUrl;
                } else {
                  window.location.href = '/';
                }*/
              }
            }
          } else {
            $('#LoginError').removeClass('hidden');
            setTimeout(function(){
              $('#LoginError').addClass('hidden');
            },3000);
          }
        return false;
      },
      error: function(err){
        console.log('AJAX error: ' + JSON.stringify(err));
        return false;
      }
    });
  }catch  (e){
    console.log('ERROR: ' + JSON.stringify(e));
  }
  return false;
}

function cargarEstados(divestados){
  $('#'+divestados).html('<option value=""></option>');
  $.ajax({
      url: '/obtenerEstados',
      type: 'POST',
      dataType: "json",
      cache: false,
      async: false,
      success: function (data) {
        $('#'+divestados).html('<option value="" selected disabled>Selecciona estado</option>');
          data.forEach(function (record) {
              $('#'+divestados).append('<option value="' + record.id + '">' + record.estado + '</option>');
          });
      },
      error: function (jqXHR, textStatus, err) {
        console.log('ERROR: ' + JSON.stringify(err));
      }
  });
}


function cargarCiudades(id){
  var idABuscar = $(id).val();// se saca el value del select de estados
  // se hace la consulta se manda como parametro el id que se obtuvo de seleccionar el estado
  $.post('/cargarCiudades',{id:idABuscar}, function(data){
    var cont = '<option value="">Municipio/Ciudad</option>';
    $.each(data,function(i, item){
      cont += '<option value="'+item.id+'">'+item.municipio+'</option>';
    });
    $("#selectCiudad").html(cont);
    $("#selectCiudad").removeClass('invisible');
  });
}

function realizarBusqueda(bounds){
  bounds = JSON.parse(JSON.stringify(bounds));
  var especialidades = [];
  $('.inputEspecialidad').each(function(){
    if ($(this).text() != ""){
      especialidades.push($(this).text());
    }
  });
  var aseguradoras = [];
  $('.inputAseguradora').each(function(){
    if ($(this).text() != ""){
      aseguradoras.push($(this).text());
    }
  });
  $.post('/search/medico',{
    bounds: bounds,
    nombre: $('#nombreMed').val(),
    especialidades: especialidades,
    aseguradoras: aseguradoras
  },function(data){
    marcadoresBusqueda.forEach(function(mark){
      mark.exist = false;
    });

    var contenido =
        `<div class="pagination pagination-large" style="display: inline-block;padding-left: 0;border-radius: 4px;text-align: right;width: 100%;font-size: 10px;margin-top: -15px;">
            <ul class="pager" style="text-align:right;margin:0px;"></ul>
        </div>`+
        '<ul class="media-list" id="ResultadoBusqueda" style="font-size:90%;text-align:left">';

    var height = $('#buscadorFixed').height();
    height += $('#mainNav').height();

    var marcadoresBusquedaTemp = [];
    data.result.forEach(function(medico){
      //console.log('Usuario: ' + JSON.stringify(medico));
      var usuarioUrl = medico.Usuario.usuarioUrl;
      if (medico.Usuario.urlPersonal && medico.Usuario.urlPersonal != ""){
        usuarioUrl = medico.Usuario.urlPersonal;
      }
      if (medico.Usuario.DatosGenerale.apellidoM && medico.Usuario.DatosGenerale.apellidoM != ""){
        medico.Usuario.DatosGenerale.apellidoM = ' ' + medico.Usuario.DatosGenerale.apellidoM;
      } else {
        medico.Usuario.DatosGenerale.apellidoM  = '';
      }

      var topDr = false;
      if (medico.calificacion>80){
        topDr = true;
      }

      var nombre = 'Dr. ' +medico.Usuario.DatosGenerale.nombre  + ' ' + medico.Usuario.DatosGenerale.apellidoP + medico.Usuario.DatosGenerale.apellidoM + '.';

      var imagenPerfil = medico.Usuario.urlFotoPerfil;

      var insigTopDr = '';
      if (topDr){
        insigTopDr = '<span class="label label-topDr" style="font-size: 60%">Top Doctor</span>&nbsp;&nbsp;';
      }
      var medico_id = medico.id;

      contenido += `
        <div class="media result" id="medico_id_`+ medico_id +`" style="margin-bottom: 15px; border-bottom: solid 1px #CACACA;padding-bottom: 15px;">
          <div class="media-left">
            <a href="` + base_url + usuarioUrl+`">
              <img class="media-object" src="`+ imagenPerfil + `" alt="">
            </a>
          </div>
          <div class="media-body">
              <h4 class="media-heading">`+
                insigTopDr+
                `<a href="`+ base_url + usuarioUrl+`">` + nombre + `</a>
              </h4>
              <ul class="list-unstyled list-inline">`;



        medico.MedicoEspecialidads.forEach(function(especialidad){
          if (especialidad.subEsp == 0){
            contenido += '<li><strong>'+especialidad.Especialidad.especialidad+'</strong></li>';
          }
        });

        contenido += `
              </ul>
              <ul class="list-unstyled list-inline">`;

        medico.MedicoEspecialidads.forEach(function(especialidad){
          if (especialidad.subEsp == 1){
            contenido += '<li>'+especialidad.Especialidad.especialidad+'</li>';
          }
        });

        contenido += `</ul>
              <ul class="list-inline">
              </ul>
              <ul class="list-unstyled list-ubicaciones">`;

        medico.Usuario.Direccions.forEach(function(direccion){
          if (direccion.numeroInt && direccion.numeroInt != ""){
            direccion.numeroInt = ' ' +direccion.numeroInt;
          } else {
            direccion.numeroInt = '';
          }
          contenido += `
            <li>
              <a onclick="centrarEnMapa('`+ direccion.latitud +`','`+ direccion.longitud +`',`+ medico.id +`,'`+ direccion.id +`',true)">
              <button class="btn btn-warning">
              <span class="glyphicon glyphicon-map-marker"></span>
              </button>
              &nbsp;&nbsp;
              <strong>`+ direccion.nombre +`</strong>
              <small> `+ direccion.calle +` #`+ direccion.numero + direccion.numeroInt +`, `+ direccion.Municipio.municipio +`,`+ direccion.Municipio.Estado.estado +`<span class="glyphicon glyphicon-zoom-in"></span>
              </small>
              </a>
            </li>`;

          if (!marcadoresBusqueda[direccion.id]){
            var pos = new google.maps.LatLng(direccion.latitud, direccion.longitud);

            var marker  = null;
            if (topDr){
              marker = new google.maps.Marker({
                  position: pos,
                  map: searchDiv,
                  draggable: false,
                  zIndex: 200,
                  icon: 'img/marker.png'
              });
            } else {
              marker = new google.maps.Marker({
                  position: pos,
                  map: searchDiv,
                  zIndex: 100,
                  draggable: false,
              });
            }

            var contentString = `
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center">
              <div class="row" style="padding-right:20px;">
                  <a href="`+ usuarioUrl +`"><img src="`+ medico.Usuario.urlFotoPerfil +`" style="width:100%"></a>
              </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style="text-align:left;">
              <div class="row">
                <h4><a href="`+ usuarioUrl +`">`+ nombre +`</a></h4>
                <h5>`+ direccion.nombre +`</h5>
                <p>`+ direccion.calle +` #`+ direccion.numero + direccion.numeroInt +`<br>`+
                direccion.Municipio.municipio +`,`+ direccion.Municipio.Estado.estado + `</p>
                <button class="btn btn-primary pull-right" onclick="agendarCitaBootbox(`+ medico.Usuario.id +`)">Hacer cita</button>
              </div>
            </div>`;

            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            infoWindows.push(infowindow);

            marker.addListener('click', function() {
              eventoBuscar = false;
              infoWindows.forEach(function(info){
                info.close();
              });

              if (!noScroll) $(document).scrollTo('#medico_id_'+medico_id, 500, {offset: function() { return {top:-(height+5)}; }});
              $('.result').removeClass('seleccionado');
              $('#medico_id_'+medico_id).addClass('seleccionado');

              searchDiv.setCenter(pos);
              infowindow.open(searchDiv, marker);
              noScroll = false;
            });


            marcadoresBusqueda[direccion.id] = {
              marker: marker,
              exist: true
            };
          } else {
            marcadoresBusqueda[direccion.id].exist = true;
          }
          marcadoresBusquedaTemp[direccion.id] = marcadoresBusqueda[direccion.id];

        });

        contenido += '<button class="btn btn-primary btn-sm pull-right" onclick="agendarCitaBootbox('+ medico.Usuario.id +')">Hacer cita</button>';

        contenido +=
              `</ul>
            </div>
            <!--
            <div class="media-right">
              <ul class="list-unstyled">
                <li>Costo de consulta:<strong> $1,230</strong></li>
                <li><a>Agrega a tus favoritos</a></li>
                <li><a>Envía mensaje</a></li>
                <li><a href="`+ base_url +usuarioUrl+`">Visita su perfíl</a></li>
              </ul>
            </div>-->
          </div>`;
    });
    contenido += '</ul>';

    contenido += `<div class="pagination pagination-large" style="display: inline-block;padding-left: 0;border-radius: 4px;text-align: right;width: 100%;font-size: 10px;margin-top: -15px;">
        <ul class="pager" style="text-align:right;margin:0px;"></ul>
    </div>`;
    $("#buscadorResultado").html(contenido);

    marcadoresBusqueda.forEach(function(mark){
      if (mark.exist == false){
        mark.marker.setMap(null);
      }
    });

    marcadoresBusqueda = marcadoresBusquedaTemp;

    //Paginador


    var listElement = $('#ResultadoBusqueda');
    var perPage = 10;
    var numItems = listElement.children().size();
    var numPages = Math.ceil(numItems/perPage);

    $('.pager').data("curr",0);

    var curr = 0;
    if (numPages > 1){
      $('.pager').removeClass('hidden');
    } else {
      $('.pager').addClass('hidden');
    }

    while(numPages > curr){
      $('<li><a href="#" class="page_link" style="border: none;background: none;width: auto;padding: 3px;">'+(curr+1)+'</a></li>').appendTo('.pager');
      curr++;
    }
    $('.pager .page_link:first').addClass('active');

    listElement.children().css('display', 'none');
    listElement.children().slice(0, perPage).css('display', 'block');

    $('.pager li a').click(function(){
      var clickedPage = $(this).html().valueOf() - 1;
      goTo(clickedPage,perPage);
    });

    function previous(){
      var goToPage = parseInt($('.pager').data("curr")) - 1;
      if($('.active').prev('.page_link').length==true){
        goTo(goToPage);
      }
    }

    function next(){
      goToPage = parseInt($('.pager').data("curr")) + 1;
      if($('.active_page').next('.page_link').length==true){
        goTo(goToPage);
      }
    }

    function goTo(page,perPage){
      var startAt = page * perPage,
        endOn = startAt + perPage;

      listElement.children().css('display','none').slice(startAt, endOn).css('display','block');
      $('.pager').attr("curr",page);
    }
  });
}

function encriptarPass(input1, input2){
  $('#'+input2).val(hex_md5($('#'+input1).val()));
  return true;
}


function iniciarSesionControl(inputEmail, inputPassword){
  var email = $('#'+inputEmail).val();
  var pass = hex_md5($('#'+inputPassword).val());
  $.ajax({
    async: false,
    url: '/control/auth',
    type: 'POST',
    dataType: "json",
    data:{'email':email,'password':pass},
    cache: false,
    success: function ( data ) {
        if (data.success){
          location.reload();
        } else {
          $('#LoginError').removeClass('hidden');
          setTimeout(function(){
            $('#LoginError').addClass('hidden');
          },3000);
        }
      return false;
    },
    error: function(err){
      console.log('AJAX error: ' + JSON.stringify(err));
      return false;
    }
  });
  return false;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function logout(){
  setCookie('_intermed');
  $.ajax({
    async: false,
    url: '/logout',
    type: 'POST',
    dataType: "json",
    cache: false,
    success: function ( data ) {
      if (data.success){
        window.location.href = "/";
      }
    },
    error: function(err){
      console.log('AJAX error: ' + JSON.stringify(err));
      return false;
    }
  });
}

/*Inicio galeria*/
function iniciarGaleria(currentId){
  var count = 0;
  var galeriaMedico = [];
  $('.gallery-thumb-content').each(function(){
    var imagen = $(this).css('background-image').replace('url("','').replace('")','');
    var id = $(this).find('.id').text();
    var titulo = $(this).find('.titulo').text();
    var descripcion = $(this).find('.descripcion').text();
    var fecha = $(this).find('.fecha').text();
    galeriaMedico.push({
      id: parseInt(id),
      titulo: titulo,
      descripcion: descripcion,
      imagen: imagen,
      fecha: fecha
    });
  });
  abrirModalGaleria(currentId,galeriaMedico);
}



function prevSlide(current,galeriaMedico){
  if (current == 0){
    current = galeriaMedico.length-1;
  } else {
    current = current-1;
  }
  actualizarSlider(current,galeriaMedico);
  return current;
}

function nextSlide(current,galeriaMedico){
  if (current == galeriaMedico.length-1){
    current = 0;
  } else {
    current = current+1;
  }
  actualizarSlider(current,galeriaMedico);
  return current;
}

function actualizarSlider(id,galeriaMedico){
  $('.img-container.img-slider').css('background-image','url(\''+galeriaMedico[id].imagen+'\')');
  $('.imageTitle').text(galeriaMedico[id].titulo);
  $('.imageDescription').text(galeriaMedico[id].descripcion);
  $('.utcDate').text(new Date(galeriaMedico[id].fecha).toISOString());
  $('.formattedDate').text(formatearFechaGaleria(galeriaMedico[id].fecha));
  $('.currentId').text(galeriaMedico[id].id);

  $('.editSlider').removeClass('hidden');
  $('.deleteSlider').removeClass('hidden');
  $('.saveEditSlider').addClass('hidden');
  $('.cancelEditSlider').addClass('hidden');
}

function formatearFechaGaleria(fecha){
  //4/6/2016, 12:20:20 PM > 01 de abril a las 13:01
  fecha =  new Date(fecha).toLocaleString('en-US');
  var dia = parseInt(fecha.split(', ')[0].split('/')[1]);
  var mes = meses[parseInt(fecha.split(', ')[0].split('/')[0])-1];
  var anio = parseInt(fecha.split(', ')[0].split('/')[2]);

  var horas = parseInt(fecha.split(', ')[1].split(':')[0]);
  var minutos = parseInt(fecha.split(', ')[1].split(':')[1]);

  if (horas != 12 && fecha.search('PM')>0){
    horas = horas + 12;
  } else if (horas == 12 && fecha.search('AM')>0){
    horas = 0;
  }

  if (horas.toString()==1){
    horas = '0'+horas;
  }

  if (anio == new Date().getFullYear()){
    return dia + ' de ' + mes + ' a las ' + horas + ':' + minutos;
  } else {
    return dia + ' de ' + mes + ' de ' + anio + ' a las ' + horas + ':' + minutos;
  }
}

function actualizarGaleria(current_id){
  $.post('/galeria/obtener',{usuario_id:$('#user_id').val()},function(data){
    if (data.success){
      var contenido = '';
      data.result.forEach(function(res){
        contenido += '<div class="gallery-thumbnail col-lg-2 col-md-2 col-sm-3 col-xs-4">'+
          '<div class="body-container gallery-thumb-content" style="background-image:url(\''+ res.imagenurl +'\')">'+
            '<div class="bottom-content text-left">'+
              '<span class="hidden id">'+ res.id +'</span>'+
              '<h4 class="s25 h67-medcond white-c noMargin shadow titulo">'+ res.titulo +'</h4>'+
              '<span class="hidden descripcion">'+ res.descripcion +'</span>'+
              '<span class="hidden fecha">'+ res.fecha +'</span>'+
            '</div>'+
          '</div>'+
        '</div>';
      });
      $('#gallery-container').html(contenido);
      GalleryThumbnail();
      $('.gallery-thumb-content').on('click',function(){
        var currentId = $(this).find('.id').text();
        iniciarGaleria(currentId);
      });
      bootbox.hideAll();
      if (current_id && current_id>0){
        iniciarGaleria(current_id);
      }
    }
  }).fail(function(e){
    console.log('Error: ' + JSON.stringify(e));
  });
}

function eliminarImagenGaleria(imagen_id,current, galeriaMedico){
  bootbox.confirm('¿Desea eliminar la imagen?', function(result){
    if( result == true ){
      // se manda un post con el id que se desea eliminar
      $.post('/galeria/eliminar',{imagen_id:imagen_id},function(data){
        if (data.success){
          bootbox.hideAll();
          if (galeriaMedico.length>1){
            if (current == galeriaMedico.length-1){
              current = 0;
            } else {
              current = current+1;
            }
            actualizarGaleria(galeriaMedico[current].id);
          } else {
            actualizarGaleria();
          }

        }
      }).fail(function(e){
        console.log('Error: ' + JSON.stringify(e));
      });
    }
  });
}

/*Fin galeria*/
