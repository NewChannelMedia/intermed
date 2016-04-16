//Caracteres especiales
var accentMap = {
"á": "a",
"é": "e",
"í": "i",
"ó": "o",
"ú": "u",
'´': ''
};
var normalize = function( term ) {
  var ret = "";
  for ( var i = 0; i < term.length; i++ ) {
    ret += accentMap[ term.charAt(i) ] || term.charAt(i);
  }
  return ret;
};
function customFilter(array, terms) {
    arrayOfTerms = terms.split(" ");
    var result  = [];
    for (var k in arrayOfTerms){
      arrayOfTerms[k] = arrayOfTerms[k].replace(/ /g,'');
    }
    var result =  $.grep(array, function (value) {
      var coincide = true;
      for (var k in arrayOfTerms){
        if (coincide){
          var matcher = new RegExp("\\b" + arrayOfTerms[k], "i");
          coincide = matcher.test(normalize(value.label));
        }
      }
      return coincide;
    });
    return result;
};

function replaceChars(cadena){
    for ( var key in accentMap) {
      cadena = cadena.replace(key,accentMap[key]);
    }
    return cadena;
}

$(document).ready(function(){
  if ($( "#buscadorInterno" ).length > 0){
    var autocompleteInicial = [];

    var oficina = [
    {value:'Bitácora',category:'Oficina',url:'bitacora',image:'<span class="glyphicon glyphicon-calendar"></span> ',label:'Bitácora'},
    {value:'Perfil',category:'Oficina',url:'perfil',image:'<span class="glyphicon glyphicon-user"></span> ',label:'Perfil'},
    {value:'Inicio',category:'Oficina',url:'',image:'<span class="glyphicon glyphicon-home"></span> ',label:'Inicio'}
    ];

    $.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
      currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'> " + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
    });


    $( "#buscadorInterno" ).catcomplete({
      delay: 0,
      minLength: 0,
      source: function( request, response ) {
        request.term = replaceChars(request.term);
        var busqueda = request.term.split(" ");
        busqueda = $.grep(busqueda, function(v, k){
            return $.inArray(v ,busqueda) === k;
        });
        var pacientes = 0;
        if ($('#tipoBusquedaPaciente').is(':checked')){
          pacientes = 1;
        }
        $.ajax({
          url: "/buscadorInterno",
          dataType: "json",
          method: 'POST',
          data: {
            busqueda: busqueda,
            pacientes: pacientes
          },
          success: function( data ) {
            var allUsers = [];
            data.forEach(function(user){
              var newUser = new Array();
              newUser['name'] = user.DatosGenerale.nombre + ' ' + user.DatosGenerale.apellidoP + ' ' + user.DatosGenerale.apellidoM;
              newUser['value'] = newUser['name'];
              newUser['category'] = "Usuarios";
              newUser['url']  = 'nuevoPerfilMedicos/'+user.usuarioUrl;
              newUser['image']  = "<img src="+user.urlFotoPerfil+" style='width:20px'></img> ";
              if (user.Medico){
                newUser['name']  = 'Dr. ' + newUser['name'] ;
              }
              newUser['label']  = newUser['name'];
              user = newUser;
              allUsers.push(newUser);
            })
            if (!$('#tipoBusquedaPaciente').is(':checked')){
              allUsers = oficina.concat(allUsers);
            }
            response(customFilter(allUsers,request.term));
            if ($('#mapSearchDiv')){
              $('ul.ui-autocomplete').css('position','fixed');
            }
          }
        });
      },
      focus: function( event, ui ) {
        $( "#buscadorInterno" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        window.location.href = base_url+ui.item.url;
        return false;
      }
    })
    .catcomplete( "instance" )._renderItem = function( ul, item ) {
      var li = $( "<li>" );
      li.append( "<a>" + item.image + item.label +"</a>" );
      return li.appendTo(ul);
    };
  }


  if ($( "#buscadorInternoDropDown" ).length > 0){

      var autocompleteInicial = [];

      var oficina = [
      {value:'Bitácora',category:'Oficina',url:'bitacora',image:'<span class="glyphicon glyphicon-calendar"></span> ',label:'Bitácora'},
      {value:'Perfil',category:'Oficina',url:'perfil',image:'<span class="glyphicon glyphicon-user"></span> ',label:'Perfil'},
      {value:'Inicio',category:'Oficina',url:'',image:'<span class="glyphicon glyphicon-home"></span> ',label:'Inicio'}
      ];

      $.widget( "custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
        currentCategory = "";
        $.each( items, function( index, item ) {
          var li;
          if ( item.category != currentCategory ) {
            ul.append( "<li class='ui-autocomplete-category'> " + item.category + "</li>" );
            currentCategory = item.category;
          }
          li = that._renderItemData( ul, item );
          if ( item.category ) {
            li.attr( "aria-label", item.category + " : " + item.label );
          }
        });
      }
      });


      $( "#buscadorInternoDropDown" ).catcomplete({
        delay: 0,
        minLength: 0,
        source: function( request, response ) {
          request.term = replaceChars(request.term);
          var busqueda = request.term.split(" ");
          busqueda = $.grep(busqueda, function(v, k){
              return $.inArray(v ,busqueda) === k;
          });
          var pacientes = 0;
          if ($('#tipoBusquedaPaciente').is(':checked')){
            pacientes = 1;
          }
          $.ajax({
            url: "/buscadorInterno",
            dataType: "json",
            method: 'POST',
            data: {
              busqueda: busqueda,
              pacientes: pacientes
            },
            success: function( data ) {
              var allUsers = [];
              data.forEach(function(user){
                var newUser = new Array();
                newUser['name'] = user.DatosGenerale.nombre + ' ' + user.DatosGenerale.apellidoP + ' ' + user.DatosGenerale.apellidoM;
                newUser['value'] = newUser['name'];
                newUser['category'] = "Usuarios";
                newUser['url']  = 'nuevoPerfilMedicos/'+user.usuarioUrl;
                newUser['image']  = "<img src="+user.urlFotoPerfil+" style='width:20px'></img> ";
                if (user.Medico){
                  newUser['name']  = 'Dr. ' + newUser['name'] ;
                }
                newUser['label']  = newUser['name'];
                user = newUser;
                allUsers.push(newUser);
              });
              if (!$('#tipoBusquedaPaciente').is(':checked')){
                allUsers = oficina.concat(allUsers);
              }
              response(customFilter(allUsers,request.term));
            }
          });
        },
        focus: function( event, ui ) {
          $( "#buscadorInternoDropDown" ).val( ui.item.label );
          return false;
        },
        select: function( event, ui ) {
          window.location.href = base_url+ui.item.url;
          return false;
        }
      })
      .catcomplete( "instance" )._renderItem = function( ul, item ) {
        var li = $( "<li>" );
        li.append( "<a>" + item.image + item.label +"</a>" );
        return li.appendTo(ul);
      };
    }
});

function requestContactos(busqueda, medicos, pacientes){
  busqueda = replaceChars(busqueda);
  busqueda = busqueda.split(" ");
  busqueda = $.grep(busqueda, function(v, k){
      return $.inArray(v ,busqueda) === k;
  });

  var allUsers = [];
  if (medicos){
    $.ajax({
      url: "/buscadorContactos",
      dataType: "json",
      method: 'POST',
      data: {
        busqueda: busqueda, medicos: medicos
      },
      async: false,
      success: function( data ) {
          data.forEach(function(dat){
            if (dat.Medico){
              var newUser = new Array();
              var tipo = '';
              newUser['id'] = dat.Medico.Usuario.id;
              if (dat.Medico.Usuario.DatosGenerale.apellidoM != null){
                dat.Medico.Usuario.DatosGenerale.apellidoM = ' ' + dat.Medico.Usuario.DatosGenerale.apellidoM;
              } else dat.Medico.Usuario.DatosGenerale.apellidoM = '';
              newUser['name'] = 'Dr. ' + dat.Medico.Usuario.DatosGenerale.nombre + ' ' + dat.Medico.Usuario.DatosGenerale.apellidoP +dat.Medico.Usuario.DatosGenerale.apellidoM;
              newUser['value'] = newUser['name'];
              newUser['url']  = 'perfil/'+dat.Medico.Usuario.usuarioUrl;
              newUser['image']  = "<img src="+dat.Medico.Usuario.urlFotoPerfil+" style='width:20px'></img> ";
              newUser['imageSrc']  = dat.Medico.Usuario.urlFotoPerfil;
              newUser['label']  = newUser['name'];
              user = newUser;
              allUsers.push(newUser);
            }
          })
      }
    });
  }

  if (pacientes){
      $.ajax({
        url: "/buscadorContactos",
        dataType: "json",
        method: 'POST',
        data: {
          busqueda: busqueda, pacientes: pacientes
        },
        async: false,
        success: function( data ) {
            data.forEach(function(dat){
              if (dat.Paciente){
                var newUser = new Array();
                var tipo = '';
                newUser['id'] = dat.Paciente.Usuario.id;
                if (dat.Paciente.Usuario.DatosGenerale.apellidoM != null){
                  dat.Paciente.Usuario.DatosGenerale.apellidoM =  ' ' + dat.Paciente.Usuario.DatosGenerale.apellidoM;
                } else dat.Paciente.Usuario.DatosGenerale.apellidoM = '';
                newUser['name'] = dat.Paciente.Usuario.DatosGenerale.nombre + ' ' + dat.Paciente.Usuario.DatosGenerale.apellidoP + dat.Paciente.Usuario.DatosGenerale.apellidoM;
                newUser['value'] = newUser['name'];
                newUser['url']  = 'perfil/'+dat.Paciente.Usuario.usuarioUrl;
                newUser['image']  = "<img src="+dat.Paciente.Usuario.urlFotoPerfil+" style='width:20px'></img> ";
                newUser['imageSrc']  = dat.Paciente.Usuario.urlFotoPerfil;
                newUser['label']  = newUser['name'];
                user = newUser;
                allUsers.push(newUser);
              }
            })
        }
      });
  }

  return allUsers;
}

function inputAutocompleteContact(input){
    input.autocomplete({
      delay: 0,
      minLength: 0,
      source: function( request, response ) {
        response(customFilter(requestContactos(request.term, true, true),request.term));
      },
      select: function( event, ui ) {
        $('.nombreContacto').removeClass('seleccionado');
        var inbox = $('tr#'+ui.item.id);
        if (inbox.length>0){
          inbox.find('td').removeClass('noleido');
          inbox.find('td').addClass('seleccionado');
          cargarMensajes(ui.item.id);
        } else {
          nuevoInbox(ui);
          cargarMensajes(ui.item.id);
        }
        input.val('');
        $('#inboxInputText').prop('disabled',false);
        $('#inboxBtnEnviar').prop('disabled',false);
        $('#InboxMsg').css('background-color','#FFF');
        $('#InboxContact').html(ui.item.name);
        $('#chat').html('');
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      var li = $( "<li>" );
      li.append( "<div>" + item.image + item.label +"</div>" );
      return li.appendTo(ul);
    };
}
var i = 0;
function recomiendaAuto( input ){
  $('#buscadorRecomendados').autocomplete({
    delay: 0,
    minLength: 0,
    source:function(request, response){
      response(customFilter(requestContactos(request.term,false,true),request.term));
    },
    select: function( event, ui){
      /*
      id, name, value, url, image, imageSrc, label
      */
      if (ui.item.name && $('#recom_'+ui.item.id).length== 0){
        var cont = '';
        cont += '<li id="recom_'+ui.item.id+'" class="recomendacion">';
        cont +="<p>";
          cont += "<div class='label label-primary'><span class='close-label glyphicon glyphicon-remove'>&nbsp;"
            cont +="<small>";
              cont += ui.item.name;
            cont +="</small>";
          cont += "</span></div>";
        cont +="</p>";
        cont +="</li>";
        $( '#enviarRecomendaciones ul' ).append(cont);
      }
      return false;
    },
    change: function(event, ui){
      $('.close-label').click(function(){
        $(this).parent('div').remove()
      });
    }
  }).autocomplete('instance')._renderItem = function( ul, item){
    var li = $( "<li>" );
    li.append( "<div>" + item.image + item.label +"</div>" );
    return li.appendTo(ul);
  };
}
