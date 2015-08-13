var regTotalDoc = 0;

if (location.pathname === '/registro') $(document).ready(getAllDoctors());


function regDoctor(){
  if (regMedValid() == true){
      $.ajax({
         url: '/registro',
         type: 'POST',
         dataType: "json",
         cache: false,
         data: $('#frmRegMed').serialize(),
         type: 'POST',
         success: function(data){
            document.getElementById("frmRegMed").reset();
            data.forEach(function(record) {
              addMedico(record);
            });
         }
         , error: function(jqXHR, textStatus, err){
             console.error('AJAX ERROR: (registro 166) : ' + err );
         }
      });
  } else {
    alert("Faltan llenar unos datos.");
  }
}

function getAllDoctors(){
  regTotalDoc = 0;
  $.ajax({
    url: '/registro',
    type: 'POST',
    dataType: "json",
    cache: false,
    data: {getAll : '1'},
    type: 'POST',
    success: function(data){
      data.forEach(function(record) {
        addMedico(record);
      });
    }
    , error: function(jqXHR, textStatus, err){
           console.error('AJAX ERROR: (registro 196) : ' + err );
    }
  });
}

function addMedico(record){
    var entreCalles = '', medicosRegistrados = '';
    if (record.calle1 && record.calle2){
      var conjucion = 'y';
      if (record.calle2.length > 0 && record.calle2.toLowerCase().substring(0, 1) === 'i') conjucion = 'e';
      entreCalles = 'Entre ' + record.calle1 + ' ' + conjucion +' ' + record.calle2 ;
    }
    try{
      medicosRegistrados += '<tr><th scope="row">' + (++regTotalDoc) + '</th><td>' + record.nombre + ' ' + record.apellido + '</td><td>' + record.correo + '</td><td>' + record.telefono + '</td><td><address><strong>' + record.calle + ' #' + record.numero + '</strong><br>' + entreCalles + ' <br>' + record.colonia + ', CP:' + record.CP + '<br>' + record.ciudad + ', ' + record.estado + '<br></address></td><td>' + record.especialidad + '</td><td><button class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span></button></td></tr>';
    } catch (ex) {
      console.error('PARSE ERROR (Registro 190) : ' + ex);
    }
    document.getElementById('tbmedReg').innerHTML += medicosRegistrados;
}

function regMedValid(){
  var inputs = ['nombreMed','apellidoMed','correoMed','telefonoMed','especialidadMed','calleMed','numeroMed','coloniaMed','cpMed','calle1Med','calle2Med','ciudadMed','estadoMed'];
  var valid = true;
  for (i = 0; i < inputs.length; i++){
    if (document.getElementById(inputs[i]).value.length <= 0){
      valid = false;
      break;
    }
  }
  return valid;
}
