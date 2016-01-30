/**
* Todas las funciones, eventos, que tengan que ver con el medico
*
**/
function correoValido( correo ) {
  return true;
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
// muestra la ventana para editar al médico
function muestraMedico( id ) {
  $( "#UpdateModal .modal-body" ).load( "edicionMedico/" + id, function () {
    $( "#UpdateModal" ).modal( "show" );
  } );
}
$( document ).ready( function () {
  if ($('#regMedStepOne').length>0){

      var nombre = '', apellidop = '', apellidom = '';
      var curpRegMed = '', cedulaRegMed = '';
      var genderF = '', genderM = '';

      var continuar = true;
      $.ajax( {
        async: false,
        url: '/informacionRegistroMedico',
        type: 'POST',
        dataType: "json",
        cache: false,
        success: function ( data ) {
          if (data.success ){
            //Registrado el nombre
            if ( data.result.DatosGenerale) {
              $('#nombreRegMed').val(data.result.DatosGenerale.nombre);
              $('#apePatRegMed').val(data.result.DatosGenerale.apellidoP);
              if (data.result.DatosGenerale.apellidoM){
                $('#apeMatRegMed').val(data.result.DatosGenerale.apellidoM);
              }
            }
            console.log('FECHA: ' + data.result.Medico.fechaNac);

            if (data.result.Medico.fechaNac){
              var fechaNac = data.result.Medico.fechaNac.split('T')[0].split('-');
              $('#anioNacReg').val(fechaNac[0]);
              $('#mesNacReg').val(fechaNac[1]);
              $('#diaNacReg').val(fechaNac[2]);
            }

            //Registrado el Genero
            if ( data.result.Biometrico ) {
              if ( data.result.Biometrico.genero == "F"){
                genderF = ' checked ';
                $('#sexF').attr('checked',true);
              }
              else if ( data.result.Biometrico.genero == "M"){
                genderM = ' checked ';
                $('#sexM').attr('checked',true);
              }
            }

            //Registrado el curp
            if ( data.result.Medico && data.result.Medico.curp) {
              $('#curpRegMed').val(data.result.Medico.curp);
            }
            //Registrada la cedula
            if ( data.result.Medico && data.result.Medico.cedula) {
              $('#cedulaRegMed').val(data.result.Medico.cedula);
            }
          }
        },
        error: function(err){
          console.log('Ajax erro: ' + JSON.stringify(err));
        }
      });
      loadEspecialidades();
  }

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
// muestra la ventana para editar al médico
function muestraMedico( id ) {
  $( "#UpdateModal .modal-body" ).load( "edicionMedico/" + id, function () {
    $( "#UpdateModal" ).modal( "show" );
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
    var especialidades_id = '';
    $( '#tipoRecomendacionPedir ul li').each(function(){
      especialidades_id += '|' + $(this).prop('id').split('_')[1];
    });
    if (especialidades_id != ""){
      $.post('/medicos/pedirRecomendacion',{
          idMedico:$('#usuarioPerfil').val(),
          idEspecialidad: especialidades_id,
      },function(data){
        if (data.success){
          bootbox.hideAll();
        }else{
          if (data.error){
            manejadorDeErrores(data.error);
          }
        }
      });
    } else {
      alert("Seleccione una opcion");
    }
  }
  function cargando(ids){
    var id = $(ids).val();
    if ($('#liesp_'+id).length == 0){
      var valor = $(ids+" option:selected").text();
      $( '#tipoRecomendacionPedir ul' ).append('<li id="liesp_'+id+'"><div class="label label-warning"><span class="glyphicon glyphicon-remove">&nbsp;</span><span>'+valor+'</span></div></li>');
    }
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
function agregarClinica(){
  var addClin = $('#addClin').val();
  if (addClin && addClin != ""){
    $('#sortableClinica').append('<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">'+
      '<div class="menuDiv">'+
        '<span>'+
          '<span data-id="2" class="itemTitle">'+ addClin +'</span>'+
          '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">'+
          '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>'+
        '</span>'+
      '</div>'+
      '</li>');
      $('#addClin').val('');
  } else {
    //Input de agregar clinica vacio
  }
  $('#addClin').focus();
}
function agregarAseguradora(){
  var addAseg = $('#addAseg').val();
  if (addAseg && addAseg != ""){
    $('#sortableAseguradora').append('<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">' +
      '<div class="menuDiv">' +
        '<span>' +
          '<span data-id="2" class="itemTitle">' + addAseg + '</span>' +
          '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
          '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
        '</span>' +
      '</div>' +
      '</li>');
      $('#addAseg').val('');
  } else {
    //Input de agregar clinica vacio
  }
  $('#addAseg').focus();
}
function verificarCurpCedula(){
  var curp = $('#curpRegMed').val();
  var cedula = $('#cedulaRegMed').val();
}
function cambiarActual(element){
  if ($(element).is(':checked')){
    $('#divInicio').removeClass('col-md-3');
    $('#divInicio').addClass('col-md-10');
    $('#divFin').addClass('hidden');
    $('#divGrado').addClass('hidden');

    $('#inputFin').val('00/00/0000');
    $('#inputGrado').val('00/00/0000');
  } else {
    $('#divInicio').removeClass('col-md-10');
    $('#divInicio').addClass('col-md-3');
    $('#divFin').removeClass('hidden');
    $('#divGrado').removeClass('hidden');
  }
}
$("#oficina").click(function(){
  logEncrypt();
});
function createPassword(){
  bootbox.hideAll();
  passwordCreate();
}
function saveStepOne() {
  var diaNac = $('#diaNacReg').val();
  var mesNac = $('#mesNacReg').val();
  var anioNac = $('#anioNacReg').val();

  var fechaValida = isValidDate(anioNac,parseInt(mesNac)-1,diaNac);

  var nombreRegMed = $('#nombreRegMed').val();
  var apePatRegMed= $('#apePatRegMed').val();
  var apeMatRegMed = $('#apeMatRegMed').val();
  var gender = $('input[name=gender]').val();
  var curpRegMed = $('#curpRegMed').val();
  var cedulaRegMed = $('#cedulaRegMed').val();
  if (nombreRegMed != "" && apePatRegMed != "" && gender != "" && curpRegMed != "" && cedulaRegMed != "" && $('#regmedEsp').text() != "" && fechaValida){
    $.ajax( {
      url: '/regMedPasoUno',
      type: 'POST',
      dataType: "json",
      cache: false,
      async: false,
      data: $( '#regMedStepOne' ).serialize(),
      success: function ( data ) {
        if ( data.success) {
          actualizarSesion(true);
          //registroMedicoDatosPago();
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
    } else if ($('#regmedEsp').text() == ""){
      error ="su especialidad"
    } else if (fechaValida){
      error="su fecha de nacimiento (correcta)"
    } else {
      error = "su cédula";
    }
    bootbox.alert({
      message: "Es necesario indicar " + error + " para el registro.",
      title: "No se puede guardar la información."
    });
  }
  return false;
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
function actualizarSesion(refresh) {
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
          if ( !data.session.name ) $( '#session_nombreUsuario' ).html( 'No tenemos registrado tu nombre, por favor continua con tu registro <a onclick="registroMedicoDatosPersonales()">aquí</a>' );
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
        if (refresh){
          location.reload();
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
              "<a id='"+data[p].Medico.Usuario.id+"' class='recomendar contList-profileActionLink Flama-bold s15'>Recomendar</a>" +
              "<a id='"+data[p].Medico.Usuario.id+"' href='#' data-target='#pedir' data-toggle='modal' class='Pedir contList-profileActionLink Flama-bold s15'><smal>Pedir Recomendacion</smal></a>"+
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
//Registrar Ubicacion
function regUbicacion(salir) {
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
                if (salir){
                  bootbox.hideAll();
                } else {
                  $('.menuBootbox').find('li.ubicaciones').removeClass('active');
                  $('.menuBootbox').find('li.servicios').addClass('active');
                  $('#divUbicacion').removeClass('in');
                  $('#divUbicacion').removeClass('active');
                  $('#divServicios').addClass('in');
                  $('#divServicios').addClass('active');

                }
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
        $('#horariosUbi').val(JSON.stringify(obtenerHorariosAgenda()));

        $.ajax({
            url: '/registrarhorarios',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: $('#frmRegHorarios').serialize(),
            type: 'POST',
            success: function (data) {
                if (data.success){
                  bootbox.hideAll();
                } else {
                  if (data.error>0){
                      manejadorDeErrores(data.error);
                  }
                }
            },
            error: function (jqXHR, textStatus, err) {
                console.error('AJAX ERROR: (registro 166) : ' + err + ' ' + textStatus);
            }
        });
    }
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
        } else {
          $('#editUbi').html('');
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

          contenido += '<li>' +
                '<div class="direccionLtLn hidden">' +
                  '<span class="principal">' + record.principal + '</span>'+
                  '<span class="lat">' + record.latitud + '</span>' +
                  '<span class="long">' + record.longitud + '</span>' +
                  '<span class="nombre">' + record.nombre + '</span>' +
                  '<span class="direccion">' +
                      '<span>' + record.calle + '</span>&nbsp;<span>#' + record.numero + interior + '</span><br>' +
                      record.Localidad.TipoLocalidad.tipo + '<span>' + record.Localidad.localidad + '</span><br>' +
                      '<span>' + record.Municipio.municipio + '</span>, <span>' + record.Municipio.Estado.estado + '</span>. CP: <span>' + record.Localidad.CP + '</span>' +
                  '</span>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 direccion-pagination-bg">' +
                  '<span class=90>' + ++contador + '</span>' +
                '</div>' +
                '<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">' +
                  '<address class="whiteF Flama-bold">' +
                    '<strong><span>' + record.nombre + '</span></strong><br>' +
                    '<span>' + record.calle + '</span>&nbsp;<span>#' + record.numero + interior + '</span><br>' +
                    record.Localidad.TipoLocalidad.tipo + '<span>' + record.Localidad.localidad + '</span><br>' +
                    '<span>' + record.Municipio.municipio + '</span>, <span>' + record.Municipio.Estado.estado + '</span>. CP: <span>'+ record.Localidad.CP + '</span><br>';

            if (record.Telefonos.length > 0){
              contenido += '<br><strong>Teléfonos</strong><br>';

              record.Telefonos.forEach(function(tel){
                var claveRegion = '';
                if (tel.claveRegion){
                  claveRegion = tel.claveRegion +' ';
                }
                contenido += '<abbr title="Phone" style="text-transform: capitalize;">'+ tel.tipo +':</abbr> '+ claveRegion + tel.numero + ' ' +  tel.ext +'<br>';
              });
            }

            contenido += '</address></div></li>';
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
          $('#divTelefonoAgregado').append('<div class="input-group-btn numeroTelefono">' +
            '<input type="hidden" class="idTelefono" value="' + telefono.id + '">' +
            '<input type="hidden" class="idTempTelefono" value="">' +
            '<label class="btn btn-sm editar btnChk">' +
            '<input type="radio" autocomplete="off">' +
            '<span class="tipoTelefono hidden">' + telefono.tipo + '</span>' +
            '<span class="tipoTelefonoIcon"><span class="glyphicon ' + clase + '"></span></span>' +
            '<span class="numTelefono">' + numTel + '</span>' +
            '<span class="extTelefono">' + telefono.ext + '</span>' +
            '</label>' +
            '<button class="btn btn-sm borrar" disabled="true" onclick="eliminarTelefono(this)">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</button>' +
            '</div>'
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
    $('#sortableExpertoEn').append('<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">' +
      '<div class="menuDiv">' +
        '<span>' +
          '<span data-id="2" class="itemTitle">' + addExp + '</span>' +
          '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
          '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
        '</span>' +
      '</div>' +
      '</li>');
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
  var otroID = $("#idDireccion").val();
  //post para el envio de la informacion
  if( con != "" && des != "" && pre != "" && dur != "time" ){
    $.post('/addServices',{
      concepto:con,
      descripcion: des,
      precio: pre,
      duracion: dur,
      otroID: otroID
    },function(data){
      if(data == true){
        maquetaServices();
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
            html += '<div class="form-group">';
              html += '<input type="text" tipo="concepto" oculto="'+item.id+'" class="form-control" id="conceptModifica'+i+'" value="'+item.concepto+'" onfocus="editUbicacion(\''+con+'\')"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" tipo="descripcion" oculto="'+item.id+'" class="form-control" id="decriptModifica'+i+'" value="'+item.descripcion+'" onfocus="editUbicacion(\''+des+'\')"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<input type="text" tipo="precio" oculto="'+item.id+'" class="form-control" id="precModifica'+i+'" value="'+item.precio+'" onfocus="editUbicacion(\''+pre+'\');"/>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
            html += '<div class="form-group">';
              html += '<select id="durModifica'+i+'" oculto="'+item.id+'" tipo="duracion" onfocus="editUbicacion(\''+dur+'\')">';
                html += '<option value="'+item.duracion+'">'+item.duracion+'</option>';
                html += '<option value="00:30:00">30 minutos</option>';
                html += '<option value="00:45:00">1 hora</option>';
                html += '<option value="01:30:00">1 hora y 30 minutos</option>';
                html += '<option value="02:00:00">2 horas</option>';
                html += '<option value="02:30:00">2 horas y 30 minutos</option>';
                html += '<option value="03:00:00">3 horas</option>';
                html += '<option value="03:30:00">3 horas y 30 minutos</option>';
                html += '<option value="04:00:00">4 horas</option>';
                html += '<option value="04:30:00">4 horas y 30 minutos</option>';
                html += '<option value="05:00:00">5 horas</option>';
                html += '<option value="05:30:00">5 horas y 30 minutos</option>';
                html += '<option value="06:00:00">6 horas</option>';
                html += '<option value="06:30:00">6 horas y 30 minutos</option>';
                html += '<option value="07:00:00">7 horas</option>';
                html += '<option value="07:30:00">7 horas y 30 minutos</option>';
                html += '<option value="08:00:00">8 horas</option>';
                html += '<option value="08:30:00">8 horas y 30 minutos</option>';
                html += '<option value="09:00:00">9 horas</option>';
                html +='<option value="09:30:00">9 horas y 30 minutos</option>';
              html += '</select>';
            html += '</div>';
          html += '</center>';
        html += '</td>';
        html += '<td>';
          html += '<center>';
          var idDelete = "#delete-"+i;
            html += '<button type="button" id="delete-'+i+'" oculto="'+item.id+'" onclick="onDelete(\''+idDelete+'\')">';
              html += '<span class="glyphicon glyphicon-remove-sign"></span>'
            html += '</button>';
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
function updateServices( tipo, dato, di ){
  var id = di;
  var otroID = $("#idDireccion").val();
  $.post('/updateServices',{
    id: id,
    tipo: tipo,
    valor: dato,
    otroID: otroID
  }, function(data){
    if( data == 1 ){
      console.log("Modificado con exito: "+tipo);
    }else{
      console.log("No se pudo modificar: "+tipo);
    }
  }).fail(function(e){console.log("Error: "+JSON.stringify(e))});
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
              listaNueva += '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">' +
              '<div class="menuDiv">' +
                '<span>' +
                  '<span data-id="2" class="itemTitle">' + rec.expertoen + '</span>' +
                  '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
                  '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
                '</span>' +
              '</div>';
            } else {
              if (!ol){
                listaNueva += '<ol>';
                ol = true;
              }
              listaNueva += '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">' +
              '<div class="menuDiv">' +
                '<span>' +
                  '<span data-id="2" class="itemTitle">'+ rec.expertoen +'</span>' +
                  '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
                  '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
                '</span>' +
              '</div>' +
              '</li>';
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
            listaNueva += '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">' +
            '<div class="menuDiv">' +
              '<span>' +
                '<span data-id="2" class="itemTitle">' + rec.clinica + '</span>'
                '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
                '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
              '</span>' +
            '</div>' +
            '</li>';
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
            listaNueva += '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_2">'
            '<div class="menuDiv">' +
              '<span>' +
                '<span data-id="2" class="itemTitle">' + rec.aseguradora + '</span>' +
                '<span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick">' +
                '<span><span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().parent().parent().parent().remove();"></span></span>' +
              '</span>' +
            '</div>' +
            '</li>';
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
  //<--------- EDIT PERFIL MEDICO ------------>
    function loadGenerales(){
      // se cargan los datos generales y foto
      var html = "";
      $.post('/loadGenerales', function(data){
        $("#editNombreMed").attr('value',data.DatosGenerale.nombre);
        $("#editApellidoPMed").attr('value',data.DatosGenerale.apellidoP);
        $("#editApellidoMMed").attr('value',data.DatosGenerale.apellidoM);
        $("#imgPerfilMedic").attr('src',data.urlFotoPerfil);
      });
    }
    function loadEspecialidades(){
      // carga los datos de medicoEspecialidades
      var html = "";
      var html3 = "";
      var contador = 1;
      var contador2 = 1;
      //carga todas las especialidades
      $.post('/todasEspecialidades',function(p){
        var html2 = "";
        html2 += '<option value="0">--Especialidad--</option>';
        $.each(p,function(e, etem){
          html2 += '<option value="'+etem.id+'">'+etem.especialidad+'</option>';
        });
        $("#autoEspecialidad").html(html2);
      });
      $.post('/loadEspecialidades', function(data){
        if ($('#regMedStepOne').length>0){
          var cont = '';
          $.each(data.MedicoEspecialidads, function( i, item ){
            var clase = 'btn-info';
            if( item.subEsp == 1 ){
              clase = 'btn-default';
            }
            cont += '<div class="input-group-btn" style="display:inline-table;margin: 3px;">'+
            '<label class="btn btn-xs '+ clase +'">'+
            '<span>'+item.Especialidad.especialidad+'</span>'+
            '</label>'+
            '<button class="btn btn-xs borrar" type="button"  onclick="deleteEsp(\''+item.id+'\');" >'+
            '<span class="glyphicon glyphicon-remove"></span></button></div>';
          });
          $('#regmedEsp').html(cont);
        }else {
          $.each(data.MedicoEspecialidads, function( i, item ){
            if( item.subEsp == 0 ){
              html += '<tr>'
                html += '<td ><center>'+contador+'</center></td>';
                html += '<td><center>'+ item.Especialidad.especialidad+'</center></td>';
                html += '<td><center>';
                  html += '<button type="button" onclick="deleteEsp(\''+item.id+'\');" class="btn btn-danger">';
                    html += '<span class="glyphicon glyphicon-remove-sign"></span>';
                  html += '</button>';
                html += '</center></td>';
              html += '</tr>';
              contador++;
            } else {
              html3 += '<tr>'
                html3 += '<td ><center>'+contador2+'</center></td>';
                html3 += '<td><center>'+ item.Especialidad.especialidad+'</center></td>';
                html3 += '<td><center>';
                  html3 += '<button type="button" onclick="deleteSubEsp(\'#mDeletes-'+i+'\');" oculto="'+item.id+'" class="btn btn-warning" id="mDeletes-'+i+'">';
                    html3 += '<span class="glyphicon glyphicon-remove-sign"></span>';
                  html3 += '</button>';
                html3 += '</center></td>';
              html3 += '</tr>';
              contador2++;
            }
          });
          $("#tableEspecialidades").html(html);
          $("#tableSubEspecialidades").html(html3);
        }
      });
    }
    function loadPadecimientos(){
      var html = "";
      var contador = 1;
      $.post('/loadPadecimientos', function( data ){
        $.each(data.Padecimientos, function( i, item ){
          html += '<tr style="color:white">';
            html += '<td><center>'+contador+'</center></td>';
            html += '<td><center>'+item.padecimiento+'</center></td>';
            html += '<td><center>';
              html += '<button onclick="deletePad(\'#pDelete-'+i+'\')" oculto="'+item.MedicoPadecimiento['id']+'" class="btn btn-danger" id="pDelete-'+i+'">';
                html += '<span class="glyphicon glyphicon-remove-circle"></span>';
              html += '</button>';
            html +='</center></td>';
          html += '</tr>';
          contador++;
        });
        $("#tablePadecimientos").html(html);
      });
    }
    function loadPalabras(){
      var html = "";
      var contador = 1;
      $.post('/loadPalabras',function(data){
        $.each(data, function( i, item ){
          html += '<tr style="color:white;">';
            html += '<td><center>'+contador+'</center></td>';
            html += '<td><center>'+item.palabra+'</center></td>';
            html += '<td><center>';
              html += '<button class="btn btn-danger" onclick="deletePalabra(\'#palabrasDelete-'+i+'\')" oculto="'+item.id+'" id="palabrasDelete-'+i+'">';
                html += '<span class="glyphicon glyphicon-remove-circle"></span>';
              html += '</button>';
            html += '</center></td>';
          html += '</tr>';
          contador++;
        });
        $("#tablePalabras").html(html);
      });
    }
    function editGenerales(tipo){
      // tipo 1: editar nombre
      // tipo 2: editar apellido paterno
      // tipo 3: editar apellido materno
      switch(tipo){
        case 1: var nombre = $("#editNombreMed").val();
              $("#divEditGeneral").addClass('hidden');
              $.post('/mEditMedic',{dato: nombre, tipo: 1}, function(data){
                if( data.length > 0 ){
                  $("#divEditGeneral").removeClass('hidden');
                  $("#tipoUpdate").text('Nombre actualizado: '+nombre);
                }
              });
              break;
        case 2: var apellidoP = $("#editApellidoPMed").val();
              $("#divEditGeneral").addClass('hidden');
              $.post('/mEditMedic',{dato: apellidoP, tipo: 2}, function(data){
                if( data.length > 0 ){
                  $("#divEditGeneral").removeClass('hidden');
                  $("#tipoUpdate").text('Apellido paterno actualizado: '+apellidoP);
                }
              });
              break;
        case 3: var apellidoM = $("#editApellidoMMed").val();
              $("#divEditGeneral").addClass('hidden');
              $.post('/mEditMedic',{dato: apellidoM, tipo: 3}, function(data){
                if( data.length > 0 ){
                  $("#divEditGeneral").removeClass('hidden');
                  $("#tipoUpdate").text('Apellido materno actualizado: '+apellidoM);
                }
              });
              break;
      }
    }
    function editEspecialidades(){
      var especial = $("#autoEspecialidad option:selected").val();
      var checado;
      if( $("#subEspEdit").is(":checked") ){
        checado = 1;
      }else{
        checado = 0;
      }
      // se inserta una nueva especialidad
      $.post('/editEspecialidades',{
        especialidad:especial,
        checado:checado
      },function( data ){
        if( data != null ){
          $("#subEspEdit").attr('checked',false);
          loadEspecialidades();
        }else{
          console.log("ERror al agregar la especialidad");
        }
      });
    }
    function deleteEsp(id){
      bootbox.confirm('¿Estas seguro de eliminar esto?',function(result){
        if(result){
          $.post('/deleteEsp',{id:id}, function( data ){
            if( data == "OK" ){
              loadEspecialidades();
            }else{
              console.log("Error al eliminar especialidades");
            }
          });
        }
      });
    }
    //<-------------- Fecha Lunes 14-12-2015 ------------------>
      function deleteSubEsp(id){
        var id = $(id).attr('oculto');
        bootbox.confirm('¿Estas seguro de eliminar esto? ', function(result){
          if( result ){
            $.post('/deleteSubEsp',{id:id}, function( data ){
              if( data == "OK" ){
                loadEspecialidades();
              }else{
                console.log("Error al eliminar la sub-Especialidad");
              }
            });
          }
        });
      }
    //<-------------- FECHA LUNES ----------------------------->
    function traePadecimientos(){
      $.post('/traePadecimientos',function( data ){
        var html = "";
        html += '<option value="0">--Padecimiento--</option>';
        $.each(data, function( i, item ){
          html += '<option value="'+item.id+'">'+item.padecimiento+'</option>';
        });
        $("#editPadeMedic").html(html);
      });
    }
    function editPadecimientos(){
      var seleccion = $("#editPadeMedic option:selected").val();
      $.post('/editPadecimientos',{
        padecimiento: seleccion
      },function(per){
        if( per != null ){
          loadPadecimientos();
        }else{
          console.log("Error 019: insercion de padecimientos");
        }
      });
    }
    function editPalabrasClave(){
      var palabra = $("#autoPalabras").val();
      $.post('/editPalabrasClave',{palabra:palabra},function(data){
        if( data != null ){
          loadPalabras();
        }else{
          console.log("Error: al agregar la palabra clave");
        }
      });
    }
    function deletePad(id){
      var id = $(id).attr('oculto');
      bootbox.confirm('¿Estas seguro de eliminar este campo?',function(result){
        if( result ){
          $.post('/deletePad',{id:id},function(data){
            if( data == "OK" ){
              loadPadecimientos();
            }else{
              console.log("Error: al eliminar el padecimiento")
            }
          });
        }
      });
    }
    function deletePalabra(id){
      var id = $(id).attr('oculto');
      bootbox.confirm('¿Estas seguro de eliminar este campo?', function(result){
        if( result ){
          $.post('/deletePalabra',{id:id}, function(data){
            if( data == "OK" ){
              loadPalabras();
            }else{
              console.log("ERROR: no se pudo eliminar la palabra clave seleccionada");
            }
          });
        }
      });
    }
  //<--------- FIN EDIT PERFIL MEDICO -------->
  function traerServiciosPorMedico(usuario_id){
    $.ajax({
        url: '/traerServiciosPorMedico',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: { usuario_id: usuario_id},
        type: 'POST',
        success: function (data) {
          if (data.success){
            if (data.result){
              data.result.forEach(function(res){
                $('#servicio_id').append('<option value="'+res.concepto+'">'+res.concepto+'</option>');
              });
              $('#servicio_id').on('change',function(){
                traerUbicacionesPorServicio(usuario_id);
              });
            }
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
  }

  function traerUbicacionesPorServicio(usuario_id){
      var contenido = '<option value=""></option>';
      $.ajax({
          url: '/traerUbicacionesPorServicio',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: { usuario_id: usuario_id, servicio: $('#servicio_id').val()},
          type: 'POST',
          success: function (data) {
            if (data.success){
              if (data.result){
                data.result.forEach(function(res){
                  contenido += '<option value="'+res.id+'">'+res.nombre+ ' (' + res.calle + ' ' + res.numero + ' ' + res.numeroInt + ' ' + res.Localidad.localidad + ', ' + res.Municipio.municipio + ', ' + res.Municipio.Estado.estado + ')</option>';
                });
              }
            }
            $('#ubicacion_id').html(contenido);
            $('#ubicacion_id').on('change',function(){
              traerDetallesServicioUbicacion(usuario_id);
            });
          },
          error: function (err){
            console.log('AJAX Error: ' + JSON.stringify(err));
          }

        });
  }

  function traerDetallesServicioUbicacion(usuario_id){
    $('#citaCosto').html('');
    $('#citaDuracion').html('');
    $('#cita_detalles').css('visibility','hidden');
      $.ajax({
          url: '/traerDetallesServicioUbicacion',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: { usuario_id: usuario_id, servicio: $('#servicio_id').val(), ubicacion: $('#ubicacion_id').val()},
          type: 'POST',
          success: function (data) {
            if (data.success){
              if (data.result){
                $('#citaCosto').html(data.result.precio);
                $('#citaDuracion').html(data.result.duracion);
                $('#serviciocita_id').val(data.result.id);
                iniciarDivAgendaCita($('#ubicacion_id').val());
              }
            }
          },
          error: function (err){
            console.log('AJAX Error: ' + JSON.stringify(err));
          }
        });
  }
  function iniciarDivAgendaCita(direccion_id){
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
          setTimeout(function(){
            iniciarCalendarioAgendarCita();
            $('#cita_detalles').css('visibility','visible');
          },300);
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
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
  function cargarComentariosMedico(){
    var usuario_id = '';
    if ($('#usuarioPerfil').length>0){
      usuario_id = $('#usuarioPerfil').val();
    }
    $.ajax({
        url: '/medico/cargarComentarios',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
          usuario_id: usuario_id,
        },
        type: 'POST',
        success: function (data) {
          if (data.success){
            var contenido = '';
            data.result.forEach(function(res){
              var nombre = "Anonimo";
              if (res.anonimo == 0){
                if (res.Usuario.DatosGenerale.apellidoM && res.Usuario.DatosGenerale.apellidoM!=""){
                  res.Usuario.DatosGenerale.apellidoM = ' ' + res.Usuario.DatosGenerale.apellidoM;
                } else {
                  res.Usuario.DatosGenerale.apellidoM = '';
                }
                nombre = res.Usuario.DatosGenerale.nombre  + ' ' + res.Usuario.DatosGenerale.apellidoP + res.Usuario.DatosGenerale.apellidoM + '.';

                if (res.Usuario.Direccions[0]){
                  nombre = nombre + ' '+ res.Usuario.Direccions[0].Municipio.municipio +', '+ res.Usuario.Direccions[0].Municipio.Estado.estado.substring(0, 3) +'.';
                }

              } else {
                res.Usuario.urlFotoPerfil = default_urlFotoPerfil;
              }
              res.fecha = new Date(res.fecha).toLocaleDateString();
              res.fecha = formatearFechaComentario(res.fecha.split(' ')[0]);

              contenido += '<div class="media comment-container">';
                contenido += '<div class="media-left"><img class="img-circle comment-img" style="width:150px;" src="'+res.Usuario.urlFotoPerfil+'"></div>';
                contenido += '<article class="media-body">';
                  contenido += '<div class="comment-title s30 h67-medcond">'+res.titulo+'</div>';
                  contenido += '<p class="s15 h67-medium">'+res.comentario+'</p>';
                  contenido += '<p class="comment-autor s15 h75-bold"><span class="capitalize">'+ nombre +'</span></p>';
                  contenido += '<p class="comment-date s15 h67-medium text-info">'+res.fecha+'</p>';
                contenido += '</article>';
              contenido += '</div>';
            });
              $('#comentariosMedico').html(contenido);
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
  }
  function agregarFormacionAcademica(){
    var form = $('#formAcademica');
    var institucion = form.find('#inputInstitucion').val();
    var especialidad = form.find('#inputEspecialidad').val();
    var inicio = form.find('#inputInicio').val();
    var fin = form.find('#inputFin').val();
    var actual = 0;
    if (form.find('#inputActual').is(':checked')){
      actual = 1;
    }

    var formacion_id = $('#formacion_id').val();
    alert(formacion_id);

    var grado = form.find('#inputGrado').val();
    var nivel = form.find('#inputNivel').val();
    if (nivel > 0 && institucion != "" && especialidad != "" && inicio != ""){
      var insertar = true;
      if (!actual){
        if (fin == ""){
          insertar = false;
        }
      } else {
        fin = '';
        grado = '';
      }

      if (insertar){
        $.ajax({
            url: '/medico/formacionAcademica/agregar',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: {
              formacion_id: formacion_id,
              nivel:nivel,
              lugarDeEstudio: institucion,
              especialidad: especialidad,
              fechaInicio: inicio,
              fechaFin: fin,
              actual: actual,
              fechaTitulo: grado
            },
            type: 'POST',
            success: function (data) {
              console.log('Result: ' + JSON.stringify(data));
              if (data.success){
                bootbox.hideAll();
                cargarFormacionAcademica();
              } else {
                if(data.error){
                  manejadorDeErrores(data.error);
                }
              }
            },
            error: function (err){
              console.log('AJAX Error: ' + JSON.stringify(err));
            }
          });
      } else {
        //Faltan campos
        alert('Faltan campos (A)');
      }
    }else {
      //Faltan campos
      alert('Faltan campos (B)');
    }
  }
  function cargarFormacionAcademica(){
    $.ajax({
        url: '/medico/formacionAcademica/cargar',
        type: 'POST',
        dataType: "json",
        cache: false,
        type: 'POST',
        success: function (data) {
          if (data.success){
            var contenido = '';
            data.result.forEach(function(res){
              var anioInicio = new Date(res.fechaInicio).toLocaleDateString().split(' ')[0].split('/')[2];
              var anioFin = '';
              if (res.fechaFin && res.fechaFin != ""){
                anioFin = new Date(res.fechaFin).toLocaleDateString().split(' ')[0].split('/')[2];
              }
              var anioGrado = '';
              if (res.fechaTitulo && res.fechaTitulo != ""){
                anioGrado = new Date(res.fechaTitulo).toLocaleDateString().split(' ')[0].split('/')[2];
              }

              var clase = '';

              if (res.actual == 1){
                clase = " class='success' ";
              }

              contenido += '<tr ' + clase + '><td>'+res.lugarDeEstudio+'</td><td>'+res.especialidad+'</td><td>'+anioInicio+'</td>';
              contenido += '<td>'+anioFin+'</td>';
              contenido += '<td>'+anioGrado+'</td>';
              contenido += '<td><a style="color:green"><span class="glyphicon glyphicon-pencil" onclick="CambiarVisible(\'divListaFormacion\',\'divAddFormacion\','+ res.id +');"></span></a></td>';
              contenido += '<td><a style="color:red"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
            });
            $('#formacionAcademicaList').html(contenido);
          }else {
            if (data.error){
              manejadorDeErrores(data.error);
            }
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
  }
  function cargarFormacionAcademicaByID(formacion_id){
    $.ajax({
        url: '/medico/formacionAcademica/cargarById',
        type: 'POST',
        dataType: "json",
        cache: false,
        type: 'POST',
        data: {id:formacion_id},
        success: function (data) {
          if (data.success){
            if (data.result){
              $('#formacion_id').val(formacion_id);
              $('#inputInstitucion').val(data.result.lugarDeEstudio);
              $('#inputEspecialidad').val(data.result.especialidad);
              var fechaInicio = new Date(new Date(data.result.fechaInicio).toLocaleDateString()).toISOString().split('T')[0];
              var fechaFin = new Date(new Date(data.result.fechaFin).toLocaleDateString()).toISOString().split('T')[0];
              var fechaTitulo = new Date(new Date(data.result.fechaTitulo).toLocaleDateString()).toISOString().split('T')[0];
              $('#inputInicio').val(fechaInicio);
              $('#inputFin').val(fechaFin);
              $('#inputGrado').val(fechaTitulo);
              $('#inputInstitucion').val(data.result.lugarDeEstudio);
              if (data.result.actual === 1){
                $('#inputActual').attr('checked',true);
              }else {
                $('#inputActual').attr('checked',false);
              }
              $('#inputActual').change();
              $('#inputNivel').val(data.result.nivel);
            }
          }else {
            if (data.error){
              manejadorDeErrores(data.error);
            }
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
  }
  function isLogin(password){
    var pass = $(password).val();
    // se envia la informacion
    if( pass != '' ){
      if( pass.length >= 6 ){
        $.post('/isLogin',{pass:pass}, function(data){
          if( data == true ){
            $("#noAcceso").addClass('hidden');
            $(password).val('');
            window.location = "/historiales";
          }else{
            $("#noAcceso").removeClass('hidden');
          }
        });
      }else{
        console.log("Debe de contener mas de 6 caracteres");
      }
    }else{
      console.log("Campo vacio");
    }
  }
  function sendContraseña(uno,dos){
    var pass = $(uno).val();
    var confirma = $(dos).val();
    if( pass.length === confirma.length ){
      if( (pass === confirma) && ( pass != '' &&  confirma != '' ) ){
        $("#noCoincidenCampos").addClass('hidden');
        $.post('/insertPassword',{pas:confirma,modelo:'UsuarioHistorial'},function(data){
          if( data ){
            $("#Yacreado").addClass('hidden');
            $("#creado").removeClass('hidden');
            $(uno).val('');
            $(dos).val('');
          }else{
            $("#creado").addClass('hidden');
            $("#Yacreado").removeClass('hidden');
          }
        }).fail(function(e){
          console.log("Error: "+JSON.stringify(e));
        });
      }else{
        $("#noCoincidenCampos").removeClass('hidden');
      }
    }else{
      $("#noCoincidenCampos").removeClass('hidden');
    }
  }
  // checa que ya tenga una contraseña si es asi quita el enlace de crear cuenta
  function deleteLinkCrear(link){
    $.post('/deleteLinkCrear',function(data){
      if( data == true ){
        $(link).addClass('hidden');
      }else{
        $(link).removeClass('hidden');
      }
    }).fail(function(e){
      console.log("Fallo al hacer esta tarea");
    });
  }
  // cambiar password
  function confirmChangePass( password, confirm, bandera ){
    var primero = $(password).val();
    var segundo = $(confirm).val();
    // validaciones
    if( primero != '' && segundo != '' ){
      if( primero.length >= 6 && segundo.length >= 6 ){
        if( primero.length === segundo.length ){
          if( primero === segundo ){
            $("#vacioCampo").addClass('hidden');
            $("#mismaCantidad").addClass('hidden');
            $("#menorDeSeis").addClass('hidden');
            $("#igualInfo").addClass('hidden');
            switch(bandera){
              case 'historial':
                // se hace la consulta
                $.post('/changeValidPass',{pass:primero,bandera:'historial'}, function(data){
                  if( data == true ){
                    $("#bingo").removeClass('hidden');
                    $(password).val('');
                    $(confirm).val('');
                  }
                });
                break;
              case 'intermed':
                $.post('/changeValidPass',{pass:primero,bandera:'intermed'}, function(data){
                  if( data == true ){
                    $("#bingo").removeClass('hidden');
                    $(password).val('');
                    $(confirm).val('');
                  }
                });
                break;
            }
          }else{
            $("#vacioCampo").addClass('hidden');
            $("#bingo").addClass('hidden');
            $("#mismaCantidad").addClass('hidden');
            $("#menorDeSeis").addClass('hidden');
            $("#igualInfo").removeClass('hidden');
          }
        }else{
          $("#vacioCampo").addClass('hidden');
          $("#bingo").addClass('hidden');
          $("#menorDeSeis").addClass('hidden');
          $("#igualInfo").addClass('hidden');
          $("#mismaCantidad").removeClass('hidden');
        }
      }else{
        $("#vacioCampo").addClass('hidden');
        $("#bingo").addClass('hidden');
        $("#mismaCantidad").addClass('hidden');
        $("#igualInfo").addClass('hidden');
        $("#menorDeSeis").removeClass('hidden');
      }
    }else{
      $("#bingo").addClass('hidden');
      $("#menorDeSeis").addClass('hidden');
      $("#igualInfo").addClass('hidden');
      $("#mismaCantidad").addClass('hidden');
      $("#vacioCampo").removeClass('hidden');
    }
  }
  function getMailSend(span){
    $.post('/getMailSend',function(data){
      $(span).html(data.correo);
    })
  }
  // enviar correo de cambio de contraseña con el evento click
  function sendMailto(mail, bandera){
    var email = $(mail).text();
    switch(bandera){
      case "historial":console.log("Historial");
        $.post('/sendMailto',{
          to: email,
          bandera:"historial",
          subject: "Cambio de password",
        },function(data){

        });
        break;
      case "intermed":
        $.post('/sendMailto',{
          to: email,
          bandera:"intermed",
          subject: "Cambio de password de su cuenta principal",
        },function(data){

        });
        break;
    }
  }
  $("#agregarHistorial").click(function(){
    var nombre = $("#nombreInputHistorial").val();
    var apellidoP = $("#apellidoPHistorial").val();
    var apellidoM = $("#apellidoMHistorial").val();
    var dia = $("#diaHistorial").val();
    var mes = $("#mesHistorial").val();
    var año = $("#anioHistorial").val();
    var sexo = $("#selectSex option:selected").val();
    var cm = $("#cmHistorial").val();
    var kg = $("#kgHistorial").val();
    var correo = $("#mailHistorial").val();
    var salud = $("#estadoHistorial").val();
    var padecimiento = $("#padeHistorial").val();
    var alergias = $("#alergiasHistorial").val();
    var notas = $("#notaHistorial").val();
    // se envia los inputs por post
    $.post('/htmlToXml',{
      nombre: nombre,
      apellidoP: apellidoP,
      apellidoM: apellidoM,
      dia: dia,
      mes: mes,
      año: año,
      sexo: sexo,
      cm: cm,
      kg: kg,
      correo: correo,
      salud: salud,
      padecimiento:padecimiento,
      alergias:alergias,
      notas:notas
    }, function(data){
      if( data == true ){
        $("#nombreInputHistorial").val('');
        $("#apellidoPHistorial").val('');
        $("#apellidoMHistorial").val('');
        $("#diaHistorial").val('');
        $("#mesHistorial").val('');
        $("#anioHistorial").val('');
        $("#selectSex:selected").val('');
        $("#cmHistorial").val('');
        $("#kgHistorial").val('');
        $("#mailHistorial").val('');
        $("#estadoHistorial").val('');
        $("#padeHistorial").val('');
        $("#alergiasHistorial").val('');
        $("#notaHistorial").val('');
      }
    });
  });

function isValidDate(anio, mes, dia){
  //1991-12-01T06:00:00.000Z
  var date = new Date(parseInt(anio), parseInt(mes) , parseInt(dia)).toISOString();
  date = date.split('T')[0];
  date = date.split('-');
  if (parseInt(date[1]) == (parseInt(mes)+1)){
    return true;
  } else {
    return false;
  }
}
  //funcion que checara si el campo esta vacio, si encuentra informacion la guardara en el
  // input correspondiente para la fecha, en caso contrario solo mostrara el input vacio para que se llene
  function loadFechaNac(idInput){
    // se hace el post
    $.post('/medico/datos/loadFechaNac',function(data){
      var cortando =data.fechaNac.split('T');
      if( data != null ){
        $(idInput).val(cortando[0]);
        $("#muestraFecha").text(cortando[0]);
      }
    });
  }
  // funcion para guardar la fecha de nacimiento del medico
  function regFechaNacimiento(idInput){
    var fecha= $(idInput).val();
    // se envia la fecha
    $.post('/medico/datos/regFechaNacimiento',{fecha:fecha}, function( data ){
      if( data ){
        console.log("actualizado");
      }else{
        console.log("No actualizado");
      }
    }).fail(function(e){
      console.err("Error: "+JSON.stringify(e));
    });
  }
