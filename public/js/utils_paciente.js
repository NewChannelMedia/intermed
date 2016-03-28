/**
* Contendra todas las funciones necesarias, para los pacientes
**/
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
function registrarCita() {
	var horarios = obtenerHorariosCita();
  if (horarios[0]){
    console.log('horarios: ' + JSON.stringify(horarios));
  	$("#fecha").val(horarios[0].inicio);
    $("#fechaFin").val(horarios[0].fin);
    $("#usuario_id").val(horarios[0].fin);

  	$.ajax({
  		url: '/agregaCita',
  		type: 'POST',
  		dataType: "json",
  		data: $('#frmRegCita').serialize(),
  		cache: false,
  		type: 'POST',
  		success: function( data ) {
  			if ( data.error == null ) {
            $('#divCalendario').fullCalendar('removeEvents');
            $('#divCalendario').fullCalendar('refetchEvents');
             bootbox.alert({
               backdrop: false,
               closeButton: false,
               onEscape: function () {
                   bootbox.hideAll();
               },
               message:'Se ha guardado tu cita',
               className: 'Intermed-Bootbox',
               title: '<span class="title">Mensaje de Intermed</span>',
               callback: function(){
                bootbox.hideAll();
               }
             });
  			}
  			else {
  				alert(data.error.message);
  			}
  		},
  		error: function( jqXHR, textStatus, err ) {
  			console.error( 'AJAX ERROR: (registro 166) : ' + err );
  		}
  	});
  } else {
    bootbox.alert({
      message: 'Debes de seleccionar el horario y fecha para tu cita.',
      className: 'Intermed-Bootbox',
      title: '<span class="title">Mensaje de Intermed</span>'
    });
  }
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
      id = $( this ).attr('id');
      $("#pacienteIdOculto").text(id);
      var medico_id="";
      var di = "";
      //console.log("ID: "+id);
      $.post('/medicosContacto',{idMedico:id},function(data){
        if (data){
          medico_id = data.id;
          di = data.Usuario.id;
          if( data.Usuario ){
            usuarioRL += data.Usuario.usuarioUrl;
            var nombreCompleto = ' ' +data.Usuario.DatosGenerale.nombre+' '+data.Usuario.DatosGenerale.apellidoP+' '+data.Usuario.DatosGenerale.apellidoM;
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
  function enviarRecomendacion(){
    var usuario_medico_id = $('#usuarioPerfil').val();
    var destinatarios = [];

    $('#destRecomendacion').find('.lbl-recomendacion').each(function(){
      var nombre = $(this).find('.Nombre').text();
      var correo = $(this).find('.Correo').text();
      destinatarios.push({
        'nombre':nombre,
        'correo':correo
      });
    });
    var mensaje =$("#mensajeRecomendar").val();

    $.post('/medicos/recomendar',{
      usuario_medico_id:usuario_medico_id,
      emails:destinatarios,
      mensaje:mensaje
    },function(data,status){
      if(data.success){
        bootbox.hideAll();
      }
    });
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
        if ( data.success ) {
          bootbox.hideAll();
        } else {
          manejadorDeErrores(data.error);
        }
      },
      error: function ( jqXHR, textStatus, err ) {
        console.error( 'AJAX ERROR: ' + err );
      }
    } );
  }
  function loadDatosGenerales(){
    $.post("/loadDatosGenerales",function(data){
      $('#usuarioUrlFotoPerfil').prop('src',data.urlFotoPerfil);
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
  function cargarListaAlfAmi( usuario ) {
    $.ajax( {
      async: false,
      url: '/cargarListaAlfAmi',
      type: 'POST',
      data: {
        usuario: usuario
      },
      dataType: "json",
      cache: false,
      success: function ( data ) {
          $('#LetrasList').html('');
          $('#listaAmistades').html('');
          $('#tipoFiltroAm').html('una letra');
          if ( data.success ) {
            var contenido = '';
            var primero = '';
            data.result.forEach(function(rec){
              if (primero == ""){
                primero = rec.Letra;
              }

              contenido += '<li>'+
                '<a onclick="cargarListaColegasByAlf('+usuario+',\"'+ rec.Letra +'\");alert('+rec.Letra+');">'+ rec.Letra +' <span class="badge pull-right">'+ rec.Total +' </span></a>'+
              '</li>';
            });
            $('#LetrasList').html(contenido);
            if (primero != ""){
              cargarListaAmistadesByAlf(usuario,primero);
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

  function cargarListaAmistadesByAlf(usuario_id,letra){
    $.ajax( {
      async: false,
      url: '/cargarListaAmistadesByAlf',
      type: 'POST',
      data: {
        usuario_id: usuario_id,
        letra: letra
      },
      dataType: "json",
      cache: false,
      success: function ( data ) {
        $('#listaAmistades').html('');
        if ( data.success ) {
          var contenido = '';
          contenido += '<div id="'+ letra +'" class="row" ><h1 class="h67-medcond">'+letra+'</h1>';
          data.result.forEach(function(res){
            contenido +=
            '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">'+
              '<div class="thumbnail">'+
                '<div >'+
                  '<a class="pPic" href="/perfil/'+ res.usuarioUrl +'"><img src="'+ res.urlFotoPerfil +'" alt="..."></a>'+
                '</div>'+
                '<div class="caption">'+
                  '<div class="nombre h77-boldcond">'+
                    '<span>'+ res.DatosGenerale.nombre +'</span>&nbsp;<span>'+ res.DatosGenerale.apellidoP +' '+ res.DatosGenerale.apellidoM +'</span>'+
                  '</div>'+
                  '<div class="esp h67-medcond">'+
                    '<span class="colEsp"></span>'+
                  '</div>'+
                  '<a class="h67-medcondobl" href="/perfil/'+ res.usuarioUrl +'">Ver Perfil</a>'+
                '</div>'+
              '</div>'+
            '</div>'
          })
          contenido += '</div>';
          $('#listaAmistades').html(contenido);
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

  function obtenerCriteriosCalificacion(){
      var higiene = $('#cal_higiene').slider("option", "value");
      var puntualidad = $('#cal_puntualidad').slider("option", "value");
      var instalaciones = $('#cal_instalaciones').slider("option", "value");
      var tratoPersonal = $('#cal_trato').slider("option", "value");
      var costo = $('#cal_costo').slider("option", "value");
      var satisfaccionGeneral =($("#cal_satisfaccion").val()*2*10);

      var criterios= {
        higiene: higiene,
        puntualidad: puntualidad,
        instalaciones: instalaciones,
        tratoPersonal: tratoPersonal,
        satisfaccionGeneral: satisfaccionGeneral,
        costo: costo
      }
      return criterios;
  }

  function calificarCita(agenda_id, notificacion_id){
    var comentario = $('#calificacionComentario').val();
    var respuestas = obtenerCriteriosCalificacion();

    $.ajax({
        url: '/cita/calificar',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: {
          agenda_id: agenda_id,
          notificacion_id: notificacion_id,
          comentarios: comentario,
          respuestas: respuestas
        },
        type: 'POST',
        success: function (data) {
          if (data.success){
            bootbox.hideAll();
            bootbox.alert({
              backdrop: true,
              onEscape: function () {
                  bootbox.hideAll();
              },
              size: 'small',
              message: `
              <div class="" style="background-color:#172c3b;padding:5px;margin:-15px;position:absolute;width:100%" >
              <div class="divBodyBootbox" style="position:relative" style="padding:30px">
                <h3 style="color:white">Calificacion enviada</h3>
                <input type="button" class="btn btn-warning btn-block" value="Ok" onclick="bootbox.hideAll()" style="margin-top:15px;">
              </div>
              </div>
              `
            });
          }
        },
        error: function (err){
          console.log('AJAX Error: ' + JSON.stringify(err));
        }
      });
  }
  function calificarServMedico(){
    try{
      var respuestas = obtenerCriteriosCalificacion();

      $.ajax({
          url: '/medico/calificar',
          type: 'POST',
          dataType: "json",
          async: false,
          cache: false,
          data: {
            usuario_id: $('#usuarioPerfil').val(),
            respuestas: respuestas
          },
          type: 'POST',
          success: function (data) {
            if (data.success){
              var titulo = $('#tituloComentario').val();
              var comentario = $('#comentarioMedico').val();
              var anonimo = 0;
              if ($('#comentarioAnonimo').is(':checked')){
                anonimo = 1;
              }
              return $.ajax({
                  url: '/medico/dejarComentario',
                  type: 'POST',
                  dataType: "json",
                  cache: false,
                  async: false,
                  data: {
                    usuario_medico_id: $('#usuarioPerfil').val(),
                    titulo: titulo,
                    comentario: comentario,
                    anonimo: anonimo
                  },
                  type: 'POST',
                  success: function (data) {
                    if (data.success){
                      bootbox.hideAll();
                      cargarComentariosMedico();
                      bootbox.alert({
                        backdrop: true,
                        onEscape: function () {
                            bootbox.hideAll();
                        },
                        size: 'small',
                        message: `
                        <div class="" style="background-color:#172c3b;padding:5px;margin:-15px;position:absolute;width:100%" >
                        <div class="divBodyBootbox" style="position:relative" style="padding:30px">
                          <h3 style="color:white">Comentario enviado.</h3>
                          <input type="button" class="btn btn-warning btn-block" value="Ok" onclick="bootbox.hideAll()" style="margin-top:15px;">
                        </div>
                        </div>
                        `
                      });
                    } else if(data.error){
                      manejadorDeErrores(data.error);
                    }
                  },
                  error: function (err){
                    console.log('AJAX Error: ' + JSON.stringify(err));
                  }
                });
            } else if(data.error){
              manejadorDeErrores(data.error);
            }
          },
          error: function (err){
            console.log('AJAX Error: ' + JSON.stringify(err));
          }
        });
        return false;
      }catch (e){
        console.log('error: ' + e);
        return false;
      }
  }

  function dejarComentario(){
      var titulo = $('#tituloComentario').val();
      var comentario = $('#comentarioMedico').val();
      var anonimo = 0;
      if ($('#comentarioAnonimo').is(':checked')){
        anonimo = 1;
      }
      $.ajax({
          url: '/medico/dejarComentario',
          type: 'POST',
          dataType: "json",
          cache: false,
          data: {
            usuario_medico_id: $('#usuarioPerfil').val(),
            titulo: titulo,
            comentario: comentario,
            anonimo: anonimo
          },
          type: 'POST',
          success: function (data) {
            if (data.success){
              bootbox.hideAll();
              cargarComentariosMedico();
              bootbox.alert({
                backdrop: true,
                onEscape: function () {
                    bootbox.hideAll();
                },
                size: 'small',
                message: `
                <div class="" style="background-color:#172c3b;padding:5px;margin:-15px;position:absolute;width:100%" >
                <div class="divBodyBootbox" style="position:relative" style="padding:30px">
                  <h3 style="color:white">Comentario enviado.</h3>
                  <input type="button" class="btn btn-warning btn-block" value="Ok" onclick="bootbox.hideAll()" style="margin-top:15px;">
                </div>
                </div>
                `
              });
            } else if(data.error){
              manejadorDeErrores(data.error);
            }
          },
          error: function (err){
            return false;
          }
        });
  }
