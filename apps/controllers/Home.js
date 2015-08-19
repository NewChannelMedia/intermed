/**
* 	En este archivo se atraparan los eventos de la plantilla home.hbs,
*	asi como también hara la función de recibir y enviar los datos del modelo,
*	hacía la vista. Se trabajara con una función que simulara como la clase de este
*	archivo y dentro de esta función es como se trabajara.
*	Dentro de los metodos iran las llamadas a los metodos o llamados de los modelos y el envio de los parametros
*	@author Oscar, Cinthia.
*	@version 0.0.0.0
*/
//librerias que se utilizaran en este archivo
//var model = require('/../models/Medicos');
module.exports = {
	/**
	*	En el siguiente metodo es el que se encargara del envio
	*	que se obtengan de la base de datos, se mandaran hacia la
	*	vista.
	*/
	index:function(object, req, res ){
		res.render('home', object)
	},
	sayHello: function(object, req, res) {
		res.render('home', {}, function(err, html){ res.send(html)});
	},
	vacio: function(object, req, res) {
		res.render('searchMedic', {}, function(err, html){ res.send(html)});
	},
	/**
	*	EL siguiente metodo es el que realizara las busquedas,
	*	dependiendo del primer input, que es donde se elige
	*	por que sera su busqueda. Teniendo ese valor del select
	*	se mandara a un if para que se verifique que es lo que se tiene
	*	que enviar y se devuelve a la vista el resultado de la busqueda
	*
	*	@param object recibe el objeto con todos los valores del input
	*	@param req el request del servidor
	*	@param response
	*
	*/
	searching: function( object, req, res )
	{
		console.log( object );//imprime en consola el objeto
		// el siguiente if saca el valor que se encuentra en el primer input
		if( object.seleccionador === "especialidad" )
		{
			// arreglo con los datos que se van a enviar
			var envioEspecialidad = {
				titulo: object.seleccionador,
				especialidad : object.especialidad,
				ciudad: object.ciudad,
				colonia: object.colonia,
				hospital: object.hospital,
				aseguradora: object.aseguradora,
				costo: object.costo
			};
			res.render('searchMedic', envioEspecialidad);
		}else if( object.seleccionador === "medico"){
			var envioMedico = {
				titulo: object.seleccionador,
				nombreMedico: object.nombreMedico,
				hospital: object.hospital,
				aseguradora: object.aseguradora,
				costo: object.costo
			};
			res.render('searchMedic', envioMedico);
		}else if ( object.seleccionador === "padecimiento") {
			var envioPadecimiento = {
				titulo: object.seleccionador,
				padecimiento: object.padecimiento,
				ciudadela: object.ciudadela,
				coloniapad: object.coloniapad,
				hospital: object.hospital,
				aseguradora: object.aseguradora,
				costo: object.costo
			};
			res.render('searchMedic', envioPadecimiento);
		}
	}
}
