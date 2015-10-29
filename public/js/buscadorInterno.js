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
        $.ajax({
          url: "/buscadorInterno",
          dataType: "json",
          method: 'POST',
          data: {
            busqueda: busqueda
          },
          success: function( data ) {
            var allUsers = [];
            data.forEach(function(user){
              var newUser = new Array();
              newUser['name'] = user.DatosGenerale.nombre + ' ' + user.DatosGenerale.apellidoP + ' ' + user.DatosGenerale.apellidoM;
              newUser['value'] = newUser['name'];
              newUser['category'] = "Usuarios";
              newUser['url']  = 'perfil/'+user.usuarioUrl;
              newUser['image']  = "<img src="+user.urlFotoPerfil+" style='width:20px'></img> ";
              if (user.Medico){
                newUser['name']  = 'Dr. ' + newUser['name'] ;
              }
              newUser['label']  = newUser['name'];
              user = newUser;
              allUsers.push(newUser);
            })
            allUsers = oficina.concat(allUsers);
            response(customFilter(allUsers,request.term));
          }
        });
      },
      focus: function( event, ui ) {
        $( "#buscadorInterno" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        window.location.href = "http://localhost:3000/"+ui.item.url;
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
              newUser['name'] = 'Dr. ' + dat.Medico.Usuario.DatosGenerale.nombre + ' ' + dat.Medico.Usuario.DatosGenerale.apellidoP + ' ' + dat.Medico.Usuario.DatosGenerale.apellidoM;
              newUser['value'] = newUser['name'];
              newUser['url']  = 'perfil/'+dat.Medico.Usuario.usuarioUrl;
              newUser['image']  = "<img src="+dat.Medico.Usuario.urlFotoPerfil+" style='width:20px'></img> ";
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
                newUser['name'] = dat.Paciente.Usuario.DatosGenerale.nombre + ' ' + dat.Paciente.Usuario.DatosGenerale.apellidoP + ' ' + dat.Paciente.Usuario.DatosGenerale.apellidoM;
                newUser['value'] = newUser['name'];
                newUser['url']  = 'perfil/'+dat.Paciente.Usuario.usuarioUrl;
                newUser['image']  = "<img src="+dat.Paciente.Usuario.urlFotoPerfil+" style='width:20px'></img> ";
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
        //Evento al seleccionar un item
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
  input.autocomplete({
    delay: 0,
    minLength: 0,
    source:function(request, response){
      response(customFilter(requestContactos(request.term,false,true),request.term));
    },
    select: function( event, ui){
      var html2 ="";
      var otro = "li"+i;
      var dato = $('#buscadorRecomendados').val();
      var medico_id;
      var id = $("#pacienteIdOculto").text();
      $.post('/medicosContacto',{idMedico:id},function(data){
        for(var i in data){
          medico_id = data[ i ].id;
        }
      });
      $.post('/pacienteIDOculto',{dato:dato},function(data){
        for(var i in data ){
          html2 += '<li id="'+otro+'">';
          html2 +="<p>";
            html2 += "<div class='label label-primary'><span class='close-label glyphicon glyphicon-remove'>&nbsp;"
              html2 +="<small>";
                html2 +=$('#buscadorRecomendados').val();
                html2 += "<span class='hidden' da='"+data[ i ].Paciente.usuario_id+"'>";
                  html2 += medico_id;
                html2 += "</span>";
              html2 +="</small>";
            html2 += "</span></div>";
          html2 +="</p>";
          html2 +="</li>";
          $( '#enviarRecomendaciones ul' ).append(html2);
        }
      }).fail(function(err){
        console.error("Error: "+JSON.stringify(err));
      });
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
