var models  = require('../models');
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
		if (!req.session.passport.admin){
			res.redirect('/')
		}
		else{
			models.Estado.findAll().then(function (estados){
				res.render('registro', {logged: req.session.passport.logged, estados: estados});
			})
		}
	},
	registrar: function(object, req, res) {
		object = [object];
		res.send(object);
	},
	getAll: function(object, req, res){

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

		res.send(allDoctors);
	}
}
