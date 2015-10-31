var assert = require('assert');
var agent = require('superagent');
var medicosController = require('../apps/controllers/medicos');

//var middle  = require('../apps/middleware/medicos');
describe('homepage', function(){
  it('should respond to GET',function(){
    agent.get('http://127.0.0.1:3000/').end(function(err, response){
      assert.equal(response.status, 200)
    })
  });
});

describe('medicos', function(done){
  it('obtiene medicos favoritos',function(){
    var object = { idUsuario :  1}
    	medicosController.obtieneMedicoFavorito(object, null, null, function(datos) {
          done();
      });
  });
});

/*
describe('medicos', function(){
  it('obtiene medicos',function(){
    	middle.obtieneMedicos(function(datos) {
          done();
      });
  });
});

describe('medicos', function(){
  it('guarda medicos',function(){
      var object = 	{	'calleMed': 'sancio 12',
        'numeroMed': '455',
        'calle1Med': 'Calle1',
        'calle2Med': 'Calle 2',
        'coloniaMed': 'Colonia',
        'cpMed': 'CP',
        'ciudadMed': 'Ciudad',
        'estadoMed': '1',
        'telefonoMed': 'Teléfono',
        'id': 9};
    	middle.guardaMedicos(object, function(datos) {
          done();
      });
  });
});

describe('medicos', function(){
  it('obtiene medicos perfil',function(){
    middle.seleccionaMedicoPerfil(12, function(datos) {
        done();
    });
  });
});
*/
