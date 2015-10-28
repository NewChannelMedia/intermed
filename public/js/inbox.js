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
  var ultimoMsg = $( "#chat li" ).last();
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

  setTimeout(function(){
    /*$('tr>td>input').each(function(inp){
      $(inp).val('Test');
      console.log('VAL: ' + $(inp).val());
    });*/
  },3000);

  cargarListaMensajes();
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
  $('#InboxListaContactos').prepend('<tr id="'+ ui.item.id +'" ><td class="nombreContacto seleccionado" onclick="cargarInbox(this)"><img src="'+ ui.item.imageSrc +'" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> '+ ui.item.name +'</span><br/><small class="pull-right text-right" style="font-size:70%;color:#888">Ahora <span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>');
  $('#chat').html('');
}

function cargarMensajes(id){
  $.ajax({
    url: "/inbox/cargarMensajesPorUsuario",
    dataType: "json",
    method: 'POST',
    data: {usuario_id: id},
    success: function( data ) {
      if (data){
        resultado = data.resultado;
        data[2].forEach(function(record){
          if (data[1] == record.usuario_id_de){
            var ultimoMsg = $( "#chat .msg" ).last();
            if (ultimoMsg.hasClass('right')){
              ultimoMsg.find('p').append('<br/>' + renderHTML(record.mensaje));
            }
            else{
              $('#chat').append(mensajeDerecha(record.mensaje));
            }
          } else {
            var ultimoMsg = $( "#chat .msg" ).last();
            if (ultimoMsg.hasClass('left')){
              ultimoMsg.find('p').append('<br/>' + renderHTML(record.mensaje));
            }
            else{
              $('#chat').append(mensajeIzquierda(record.mensaje));
            }
          }
        });
        focusUltimo();
      }
    }
    });
}

function mensajeIzquierda(msg){
  var img = $('td.seleccionado').find('img').prop('src');
  msg = renderHTML(msg);
  return '<li class="left clearfix msg"><span class="chat-img pull-left"><img src="'+ img +'" class="img-circle" width="50" height="50" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+ $('#InboxContact').html() +'</strong><small class="pull-right text-muted"> </small></div><p class="pull-left text-left">'+msg+'</p></div></li>';
}

function mensajeDerecha(msg){
  msg = renderHTML(msg);
  return '<li class="right clearfix msg"><span class="chat-img pull-right"><img src="'+ $('#fotoPerfilMini').prop('src') +'" class="img-circle" width="50" height="50" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"> </small><strong class="pull-right primary-font">Cinthia Bermúdez Acosta</strong></div><p class="pull-right text-right">'+ msg +'</p></div></li>';
}

function renderHTML(text) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  text = text.replace(urlRegex, function(url) {
      //if ( ( url.indexOf(".jpg") > 0 ) || ( url.indexOf(".png") > 0 ) || ( url.indexOf(".gif") > 0 ) ) {
      //    return '<a href="' + url + '" target="_blanck"><img src="' + url + '" style="max-width:60%" class="img-thumbnail"></a>' + '<br/>'
      //} else {
          return '<a href="' + url + '" target="_blanck">' + url + '</a>'
      //}
  });
  return text;
}

function cargarListaMensajes(){
  $.ajax({
    url: "/inbox/cargartodos",
    dataType: "json",
    method: 'POST',
    async: false,
    success: function( data ) {
      var orden = [];
      for (x in data){
        if (data[x]){
          fecha = data[x].fecha;
          orden.push({x,fecha});
        }
      }

      orden = orden.sort(ordenarPorFecha);
      console.log('orden: ' + JSON.stringify(orden));

      orden.forEach(function(ord){
        var x = ord.x;
        var visto = '';
        if (data[x].visto === 0){
          visto = ' noleido '
        }
        $('#InboxListaContactos').append('<tr id="'+ data[x].usuario.id +'" ><td class="nombreContacto'+ visto +'" onclick="cargarInbox(this)"><img src="'+ data[x].usuario.urlFotoPerfil +'" class="img-circle mini" width="50" height="50" /><span class="hidden-xs name"> '+ data[x].usuario.DatosGenerale.nombre + ' '+ data[x].usuario.DatosGenerale.apellidoP + data[x].usuario.DatosGenerale.apellidoM  +'</span><br/><input type="hidden" val="'+data[x].fecha+'"><small class="pull-right text-right" style="font-size:70%;color:#888">' + formattedDate(data[x].fecha) +' <span style="font-size: 80%" class="glyphicon glyphicon-time" ></span></small></td></tr>');

      });
    }
  });
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
