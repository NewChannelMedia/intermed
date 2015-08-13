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

	// metodo para atrapar los post enviados cuando se eliga especialidad
	searchEspecialidad: function( object, req, res )
	{
		// Todo hacer la busqueda de medicos por especialidad
		res.render( ' searchMedic', {}, function( err, html ){ res.send(html) });
	},

	// metodo para atrapar el post y enviarlo al modelo para generar la consulta
	// para la busqueda de medicos, por nombre.
	searchMedico: function( object, req, res )
	{
		// Todo hacer la busqueda por el nombre del medico
		res.render('searchMedic',{}, function(err, html){res.send(html)});
	},

	// metodo para hacer la consulta para buscar por padecimientos se envia los datos al modelo
	searchPadecimiento: function( object, req, res )
	{
		//Todo hacer la busqueda por padecimientos
		res.render( 'searchMedic', {}, function( err, html ){ res.send(html)} );
	}
}
