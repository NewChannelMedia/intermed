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
		res.render('registro');
	},
	registrar: function(object, req, res) {
		object = [object];
		res.send(object);
	},
	getAll: function(object, req, res){

		var allDoctors = [ //Eliminar al conectar con el modelo, solo se agrego con finalidades de simulación
		{
			'nombre': 'Médico 1',
			'apellido': 'Apellido',
			'correo': 'Correo',
			'telefono': 'Teléfono',
			'calle': 'Calle', 
			'numero': 'Número',
			'calle1': 'Calle1',
			'calle2': 'Calle 2',
			'colonia': 'Colonia',
			'CP': 'CP',
			'ciudad': 'Ciudad',
			'estado': 'Estado',
			'especialidad': 'Especialidad'
		},
		{
			'nombre': 'Médico 1',
			'apellido': 'Apellido',
			'correo': 'Correo',
			'telefono': 'Teléfono',
			'calle': 'Calle', 
			'numero': 'Número',
			'calle1': 'Calle1',
			'calle2': 'Calle 2',
			'colonia': 'Colonia',
			'CP': 'CP',
			'ciudad': 'Ciudad',
			'estado': 'Estado',
			'especialidad': 'Especialidad'
		},
		{
			'nombre': 'Médico 3',
			'apellido': 'Apellido',
			'correo': 'Correo',
			'telefono': 'Teléfono',
			'calle': 'Calle', 
			'numero': 'Número',
			'calle1': 'Calle1',
			'calle2': 'Calle 2',
			'colonia': 'Colonia',
			'CP': 'CP',
			'ciudad': 'Ciudad',
			'estado': 'Estado',
			'especialidad': 'Especialidad'
		}
		];

		res.send(allDoctors);
	}
}