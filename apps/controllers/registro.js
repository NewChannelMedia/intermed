var models = require( '../models' );
/**
 * 	En este archivo se atraparan los eventos de la plantilla home.handlebars,
 *	asi como también hara la función de recibir y enviar los datos del modelo,
 *	hacía la vista. Se trabajara con una función que simulara como la clase de este
 *	archivo y dentro de esta función es como se trabajara.
 *	Dentro de los metodos iran las llamadas a los metodos o llamados de los modelos y el envio de los parametros
 *	@author Oscar, Cinthia.
 *	@version 0.0.0.0
 */
//librerias que se utilizaran en este archivo
module.exports = {
	index: function(object, req, res) {
    try{
  		/*
  		models.Estado.findAll().then(function (estados){
  			res.render('registro', {logged: req.session.passport.logged, estados: estados});
  		})*/

  		models.Estado.findAll().then(function(estados) {
  			// Obteniendo especialidades
  			models.Especialidad.findAll().then(function(especialidades) {

  						//Rendereando index y pasando los registros a la vista
  						res.render('registro', {
  							estados: estados,
  							especialidades : especialidades,
  							logged: req.session.passport.logged
  						});
  				});
  		});
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
	},
	registrar: function(object, req, res) {
    try{
      object = [object];
  		res.send(object);
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
	},
	getAll: function(object, req, res){
    try{

      var allDoctors = [ //Eliminar al conectar con el modelo, solo se agrego con finalidades de simulación
        {
          'nombreMed': 'Médico 1',
          'apellidoMed': 'Apellido',
          'correoMed': 'Correo',
          'telefonoMed': 'Teléfono',
          'calleMed': 'Calle',
          'numeroMed': 'Número',
          'calle1Med': 'Calle1',
          'calle2Med': 'Calle 2',
          'coloniaMed': 'Colonia',
          'cpMed': 'CP',
          'ciudadMed': 'Ciudad',
          'estadoMed': 'Estado',
          'especialidadMed': 'Especialidad'
  		},
        {
          'nombreMed': 'Médico 1',
          'apellidoMed': 'Apellido',
          'correoMed': 'Correo',
          'telefonoMed': 'Teléfono',
          'calleMed': 'Calle',
          'numeroMed': 'Número',
          'calle1Med': 'Calle1',
          'calle2Med': 'Calle 2',
          'coloniaMed': 'Colonia',
          'cpMed': 'CP',
          'ciudadMed': 'Ciudad',
          'estadoMed': 'Estado',
          'especialidadMed': 'Especialidad'
  		},
        {
          'nombreMed': 'Médico 1',
          'apellidoMed': 'Apellido',
          'correoMed': 'Correo',
          'telefonoMed': 'Teléfono',
          'calleMed': 'Calle',
          'numeroMed': 'Número',
          'calle1Med': 'Calle1',
          'calle2Med': 'Calle 2',
          'coloniaMed': 'Colonia',
          'cpMed': 'CP',
          'ciudadMed': 'Ciudad',
          'estadoMed': 'Estado',
          'especialidadMed': 'Especialidad'
  		}
  		];

      res.send( allDoctors );
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
}
