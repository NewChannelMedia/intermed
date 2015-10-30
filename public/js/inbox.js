function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight + 2)+"px";
  $('#inboxBtnEnviar').css('height',element.style.height);
}

$("textarea").keypress(function(event) {
  var key = event.which || event.keyCode;
  var control = event.ctrlKey || event.altKey ||  event.shiftKey ;
  if (!control && key==13){
    if ($('#inboxInputText').val() != ''){
      enviarMensaje($('#InboxContact').html(), $('#inboxInputText').val());
    }
    event.preventDefault();
  }
});

$('#inboxBtnEnviar').click(function(){
    if ($('#inboxInputText').val() != ''){
      enviarMensaje($('#InboxContact').html(), $('#inboxInputText').val());
    }
});

function eliminarError(){
  $('.error').fadeOut(300, function() { $(this).remove(); });
}

function focusUltimo(){
  var ultimoMsg = $( "#chat li .horaMsg" ).last();
  if (ultimoMsg[0]){
    ultimoMsg[0].scrollIntoView();
  }
}

function enviarMensaje(para, mensaje){
  eliminarError();
  enviado = false;
  var para_id = $('.seleccionado').parent().prop('id');
  mensaje = mensaje.replace(/\n/g, '<br/>');

  socket.emit('enviarInbox',{para: para_id, mensaje: mensaje});
}

$(document).ready(function(){
  $('#InboxMsg').css('background-color','#EEE');
  inputAutocompleteContact($('#autocompleteContactos'));
  $('#inboxInputText').prop('disabled',true);
  $('#inboxBtnEnviar').prop('disabled',true);

  $('#InboxMsg').css('height',($(window).height() - document.getElementById('inboxInput').offsetHeight - document.getElementById('navPlatform').offsetHeight - 130));
  $('#InboxMsg').css('overflow','auto');
  $('#contactList').css('height',$('#InboxMsg').css('height'));
  $('#contactList').css('overflow','auto');

  setInterval(function(){
    $('td.nombreContacto').each(function() {
      var nuevafecha = formattedDate($(this).find('input.time').prop('value'));
      $(this).find('span.timeFormated').html(nuevafecha + ' ');
    });
    /*$('tr>td>input').each(function(inp){
      $(inp).val('Test');
      console.log('VAL: ' + $(inp).val());
    });*/
  },300000);

  cargarContactosCondicional();
});

function cargarInbox(element){
  $('.nombreContacto').removeClass('seleccionado');
  $('#chat').html('');
  $(element).addClass('seleccionado');
  $(element).removeClass('noleido');
  $('#InboxMsg').css('background-color','#FFF');
  $('#inboxInputText').prop('disabled',false);
  $('#inboxBtnEnviar').prop('disabled',false);

  $('#InboxContact').html($(element).find('span.name').html());
  cargarMensajes($(element).parent().prop('id'));
}

function nuevoInbox(ui){
  var fecha = getDateTime(true);
  $('#InboxListaContactos').prepend('<tr id="'+ ui.item.id +'" ><td class="nombreContacto seleccionado" onclick="cargarInbox(this)"><img src="'+ ui.item.imageSrc +'" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> '+ ui.item.name +'</span><br/><input type="hidden" class="time" value="' + fecha + '"><small class="pull-right text-right" style="font-size:70%"><span class="timeFormated">' + formattedDate(fecha)  + ' </span><span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>');
  $('#chat').html('');
}

var liload = '<li class="clearfix text-center load" style="padding:0px;"><button onclick="cargarAnteriores()" class="btn btn-warning btn-block">Cargar anteriores</button></li>';

function cargarMensajes(id){
  $.ajax({
    url: "/inbox/cargarMensajesPorUsuario",
    dataType: "json",
    method: 'POST',
    data: {usuario_id: id},
    success: function( data ) {
      if (data){

        if (data[2].length>0){
          if (data[2].length==10) $('#chat').html(liload);
          resultado = data.resultado;
          var fecha = '';
          data[2].reverse();
          data[2].forEach(function(record){
            if ( fecha != formatfecha(record.fecha))
            {
              fecha = formatfecha(record.fecha);
              $('#chat').append('<li class="clearfix text-center datetime"><span>'+fecha+'</span></li>');
            }
            if (data[1] == record.usuario_id_de){
              var ultimoMsg = $( "#chat li" ).last()
              var hora = formathora(record.fecha);
              if (!ultimoMsg.hasClass('right')){
                $('#chat').append(mensajeDerecha());
                ultimoMsg = $( "#chat li" ).last();
              }
              ultimoMsg.find('.contenidoMsg').append('<p id ="'+ record.id +'" class="pull-right text-right">' +  renderHTML(record.mensaje) + '</p>');
              ultimoMsg.find('.horaMsg').html(hora);
            } else {
              var ultimoMsg = $( "#chat li" ).last();
              var hora = formathora(record.fecha);
              if (!ultimoMsg.hasClass('left')){
                $('#chat').append(mensajeIzquierda());
                ultimoMsg = $( "#chat li" ).last();
              }
              ultimoMsg.find('.contenidoMsg').append('<p id ="'+ record.id +'" class="pull-left text-left">' +  renderHTML(record.mensaje) + '</p>');
              ultimoMsg.find('.horaMsg').html(hora);
            }
          });
          socket.emit('conversacionLeida', data[0]);
          cargarInboxCondicional();
        }
      }
    }
    });
}


function cargarInboxCondicional(){
      var mensaje_id = $('.contenidoMsg p').first().prop('id');
      var usuario_id = $('td.seleccionado').parent().prop('id');
      var result =cargarMas(usuario_id,mensaje_id);
      if (parseInt(document.getElementById('chat').offsetHeight) < parseInt(document.getElementById('InboxMsg').offsetHeight)){
        if (result){
          cargarInboxCondicional();
        } else {
          focusUltimo();
        }
      } else {
        focusUltimo();
      }
}


function cargarContactosCondicional(){
      var result =cargarListaMensajes();
      if (parseInt(document.getElementById('InboxListaContactos').offsetHeight) < parseInt(document.getElementById('contactList').offsetHeight)){
        if (result){
          cargarContactosCondicional();
        }
      }
}

function cargarMas(usuario_id, mensaje_id){
  var respuesta = false;
  $.ajax({
    url: "/inbox/cargarMensajesPorUsuarioAnteriores",
    dataType: "json",
    method: 'POST',
    data: {usuario_id: usuario_id, mensaje_id: mensaje_id},
    async: false,
    success: function( data ) {
      if (data[2].length>0){
        $('li.load').remove();
        data[2].forEach(function(record){
          var fechaagregada = false;
          if ( $( "#chat .datetime > span" ).first().html() != formatfecha(record.fecha))
          {
            fechaagregada = true;
            //Si la fecha no es la primera que aparece, se agrega una nueva fecha, los mensajes se agregaran despues de este
            $('#chat').prepend('<li class="clearfix text-center datetime"><span>'+formatfecha(record.fecha)+'</span></li>');
          }
          if (fechaagregada){
            if (data[1] == record.usuario_id_de){
              var hora = formathora(record.fecha);
              $( "#chat .datetime" ).first().after(mensajeDerecha());
              var primerMensaje = $( "#chat li.msg" ).first();
              primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-right text-right">' +  renderHTML(record.mensaje) + '</p>');
              if (primerMensaje.find('.horaMsg').html() == ""){
                primerMensaje.find('.horaMsg').html(hora);
              }
            } else {
                var hora = formathora(record.fecha);
                $( "#chat .datetime" ).first().after(mensajeIzquierda());
                var primerMensaje = $( "#chat li.msg" ).first();
                primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-left text-left">' +  renderHTML(record.mensaje) + '</p>');
                if (primerMensaje.find('.horaMsg').html() == ""){
                  primerMensaje.find('.horaMsg').html(hora);
                }
            }
          } else {
            if (data[1] == record.usuario_id_de){
              var primerMensaje = $( "#chat li.msg" ).first()
              var hora = formathora(record.fecha);
              if (!primerMensaje.hasClass('right')){
                $( "#chat .datetime" ).first().after(mensajeDerecha());
                primerMensaje = $( "#chat li.msg" ).first();
              }
              primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-right text-right">' +  renderHTML(record.mensaje) + '</p>');
              if (primerMensaje.find('.horaMsg').html() == ""){
                primerMensaje.find('.horaMsg').html(hora);
              }
            } else {
                var primerMensaje = $( "#chat li.msg" ).first()
                var hora = formathora(record.fecha);
                if (!primerMensaje.hasClass('left')){
                  $( "#chat .datetime" ).first().after(mensajeIzquierda());
                  primerMensaje = $( "#chat li.msg" ).first();
                }
                primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-left text-left">' +  renderHTML(record.mensaje) + '</p>');
                if (primerMensaje.find('.horaMsg').html() == ""){
                  primerMensaje.find('.horaMsg').html(hora);
                }
            }
          }
        });
        if (data[2].length==20) {
          $('#chat').prepend(liload);
        }
        load = true;
        respuesta = true;
      }
    }
    });
    return respuesta;
}

function cargarMensajesAnteriores(usuario_id, mensaje_id){
  $.ajax({
    url: "/inbox/cargarMensajesPorUsuarioAnteriores",
    dataType: "json",
    method: 'POST',
    data: {usuario_id: usuario_id, mensaje_id: mensaje_id},
    success: function( data ) {
      if (data[2].length>0){
        data[2].forEach(function(record){
          var fechaagregada = false;
          if ( $( "#chat .datetime > span" ).first().html() != formatfecha(record.fecha))
          {
            fechaagregada = true;
            //Si la fecha no es la primera que aparece, se agrega una nueva fecha, los mensajes se agregaran despues de este
            $('#chat').prepend('<li class="clearfix text-center datetime"><span>'+formatfecha(record.fecha)+'</span></li>');
          }
          if (fechaagregada){
            if (data[1] == record.usuario_id_de){
              var hora = formathora(record.fecha);
              $( "#chat .datetime" ).first().after(mensajeDerecha());
              var primerMensaje = $( "#chat li.msg" ).first();
              primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-right text-right">' +  renderHTML(record.mensaje) + '</p>');
              if (primerMensaje.find('.horaMsg').html() == ""){
                primerMensaje.find('.horaMsg').html(hora);
              }
            } else {
                var hora = formathora(record.fecha);
                $( "#chat .datetime" ).first().after(mensajeIzquierda());
                var primerMensaje = $( "#chat li.msg" ).first();
                primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-left text-left">' +  renderHTML(record.mensaje) + '</p>');
                if (primerMensaje.find('.horaMsg').html() == ""){
                  primerMensaje.find('.horaMsg').html(hora);
                }
            }
          } else {
            if (data[1] == record.usuario_id_de){
              var primerMensaje = $( "#chat li.msg" ).first()
              var hora = formathora(record.fecha);
              if (!primerMensaje.hasClass('right')){
                $( "#chat .datetime" ).first().after(mensajeDerecha());
                primerMensaje = $( "#chat li.msg" ).first();
              }
              primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-right text-right">' +  renderHTML(record.mensaje) + '</p>');
              if (primerMensaje.find('.horaMsg').html() == ""){
                primerMensaje.find('.horaMsg').html(hora);
              }
            } else {
                var primerMensaje = $( "#chat li.msg" ).first()
                var hora = formathora(record.fecha);
                if (!primerMensaje.hasClass('left')){
                  $( "#chat .datetime" ).first().after(mensajeIzquierda());
                  primerMensaje = $( "#chat li.msg" ).first();
                }
                primerMensaje.find('.contenidoMsg').prepend('<p id ="'+ record.id +'" class="pull-left text-left">' +  renderHTML(record.mensaje) + '</p>');
                if (primerMensaje.find('.horaMsg').html() == ""){
                  primerMensaje.find('.horaMsg').html(hora);
                }
            }
          }
        });
        if (data[2].length==20) {
          $('#chat').prepend(liload);
          $("#InboxMsg").scrollTop(40);
        }
        load = true;
      }

    }
    });
}

function mensajeIzquierda(){
  var img = $('td.seleccionado').find('img').prop('src');
  return '<li class="left clearfix msg"><span class="chat-img pull-left"><img src="'+ img +'" class="img-circle" width="50" height="50" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+ $('#InboxContact').html() +'</strong><small class="pull-right text-muted"> </small></div><span class="contenidoMsg"></span><span class="horaMsg pull-left text-left"></span></div></li>';
}

function mensajeDerecha(){
  return '<li class="right clearfix msg"><span class="chat-img pull-right"><img src="'+ $('#fotoPerfilMini').prop('src') +'" class="img-circle" width="50" height="50" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"> </small><strong class="pull-right primary-font">Cinthia Bermúdez Acosta</strong></div><span class="contenidoMsg"></span><span class="horaMsg pull-right text-right"></span></div></li>';
}

function renderHTML(text) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?()=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  text = text.replace(urlRegex, function(url) {
      //if ( ( url.indexOf(".jpg") > 0 ) || ( url.indexOf(".png") > 0 ) || ( url.indexOf(".gif") > 0 ) ) {
      //    return '<a href="' + url + '" target="_blanck"><img src="' + url + '" style="max-width:60%" class="img-thumbnail"></a>' + '<br/>'
      //} else {
          return '<a href="' + url + '" target="_blanck">' + url + '</a>'
      //}
  });
  return text;
}

var notIn = [];

function cargarListaMensajes(){
  var resultado = false;
  $.ajax({
    url: "/inbox/cargartodos",
    dataType: "json",
    data: {notIn: notIn},
    method: 'POST',
    async: false,
    success: function( data ) {
    $('#InboxListaContactos').find('tr.tr_next').remove();
      if (data.length>0){
        resultado = true;
        var orden = [];
        for (x in data){
          if (data[x]){
            fecha = data[x].fecha;
            orden.push({x,fecha});
          }
        }
        orden = orden.sort(ordenarPorFecha);

        orden.forEach(function(ord){
          var x = ord.x;
          var visto = '';
          if (data[x].visto === 0){
            visto = ' noleido '
          }
          notIn.push(data[x].usuario.id);
          $('#InboxListaContactos').append('<tr id="'+ data[x].usuario.id +'" ><td class="nombreContacto'+ visto +'" onclick="cargarInbox(this)"><img src="'+ data[x].usuario.urlFotoPerfil +'" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> '+ data[x].usuario.DatosGenerale.nombre + ' '+ data[x].usuario.DatosGenerale.apellidoP + data[x].usuario.DatosGenerale.apellidoM  +'</span><br/><input class="time" type="hidden" value="'+data[x].fecha+'"><small class="pull-right text-right" style="font-size:70%"><span class="timeFormated">' + formattedDate(data[x].fecha) +'</span> <span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>');

        });
        $('#InboxListaContactos').append('<tr class="tr_next"><td class="text-center active"><a onclick="cargarListaMensajes">Ver más</a></td></tr>');
      }
      loadContactos = true;
    }
  });
  return resultado;
}


function ordenarPorFecha( a, b ) {
  var c = new Date( a.fecha );
  var d = new Date( b.fecha );
  return d - c;
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
    if ( minutos >= 1 ){
      if (minutos == 1){
        return 'hace ' + minutos + ' minuto';
      } else {
        return 'hace ' + minutos + ' minutos';
      }
    }
    else
      return 'hace unos segundos';
  }
  else if ( Horas < 24 ) {
    return 'hace ' + Horas + ' horas';
  }
  else {
    return day1 + ' de ' + months[ month1 ] + ' a las ' + hour1 + ':' + minutes1;
  }
}



function formatfecha( date ) {
  date = new Date( date );
  date = date.toString();
  var months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];

  var d = new Date(date || Date.now()),
    month = d.getMonth();
    day = '' + d.getDate(),
    year = d.getFullYear();

  return day + ' de ' + months[ month ] + ' de ' + year;
}


function formathora( date ) {
  date = new Date( date );
  date = date.toString();
  var months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];

  var d = new Date(date || Date.now()),
    hour = '' + d.getHours(),
    minutes = '' + d.getMinutes();

  return hour + ':' + minutes;
}

var load = true;

function cargarAnteriores(){
  if ($('#chat').position().top > 30 && $('li.load').length>0 && load){
    load = false;
    $('li.load button').html('<div class="throbber-loader">Cargando</div>');
    setTimeout(function(){
      $('li.load').remove();
      var mensaje_id = $('.contenidoMsg p').first().prop('id');
      var usuario_id = $('td.seleccionado').parent().prop('id');
      if (mensaje_id != '' && usuario_id != ''){
        cargarMensajesAnteriores(usuario_id,mensaje_id);
      }
    },1000);
  }
}
var loadContactos = true;

function cargarContactos(){
  var scrollBottom = $('#InboxListaContactos').height() - $('#contactList').height() - $('#contactList').scrollTop();
  if (scrollBottom <5 && $('.tr_next').length>0 && loadContactos){
    $('.tr_next').find('a').html('<div class="throbber-loader">Cargando…</div>');
    loadContactos = false;
    setTimeout(function(){
      cargarListaMensajes();
      },1000);
    }
}

$(document).ready(function(){
  var chat = document.getElementById("chat");
  if (chat.addEventListener) {
  	// IE9, Chrome, Safari, Opera
  	chat.addEventListener("mousewheel", cargarAnteriores, false);
  	// Firefox
  	chat.addEventListener("DOMMouseScroll", cargarAnteriores, false);
  }
  // IE 6/7/8
  else chat.attachEvent("onmousewheel", cargarAnteriores);


  var InboxListaContactos = document.getElementById("InboxListaContactos");
  if (InboxListaContactos.addEventListener) {
  	// IE9, Chrome, Safari, Opera
  	InboxListaContactos.addEventListener("mousewheel", cargarContactos, false);
  	// Firefox
  	InboxListaContactos.addEventListener("DOMMouseScroll", cargarContactos, false);
  }
  // IE 6/7/8
  else InboxListaContactos.attachEvent("onmousewheel", cargarContactos);
});
