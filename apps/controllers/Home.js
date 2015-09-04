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
var models  = require('../models');
var objecto;

var consultas = {
	clausulas: function(object){
		if(object.seleccionador === "especialidad")
			return objeto = {$or:{ciudad:object.ciudad,colonia:object.colonia}};
		else if( object.seleccionador === "medico")
		{
			return  objeto = {nombre:{$like:object.nombreMedico + "%"}};
		}
		else if( object.seleccionador === "padecimiento")
		{
			return objeto = {$or:{ciudad:object.ciudadela,colonia:object.coloniapad}};
		}
	}
};
module.exports = {
		/**
		*	En el siguiente metodo es el que se encargara del envio
		*	que se obtengan de la base de datos, se mandaran hacia la
		*	vista.
		*/
		index:function(object, req, res ){
			models.Estado.findAll().then(function(estados){
				res.render('home', {estados: estados})
			});
		},
		perfil:function(object, req, res ){
			req.session.passport.user = JSON.parse(JSON.stringify(
				{
					id:1,
					fotoPerfil:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtf1/v/t1.0-1/p200x200/11889468_10206461139939549_4785168678102146365_n.jpg?oh=d0bc56911475435244e11a3fc0945a7d&oe=5661203E&__gda__=1454011048_7e69721703154a83648e218a21f8e996',
					tipoUsuario:"P",
					tipoRegistro:"F",
					estatusActivacion:1,
					name:'Cinthia Bermúdez Acosta',
					Paciente_id:1,
					ciudad:"Los Mochis",
					estado:"Sinaloa"
				}
				));

				var sesion = req.session.passport.user;

				//Contar mensajes sin leer
				sesion.mensajes = 1;
				//Contar eventos nuevos o cercanos (Sin ver)
				sesion.calendario = 5;

			res.render('perfil', sesion);
		},
		aboutPacientes:function(object, req, res ){
			res.render('pacientes', object)
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
				console.log("Consulta ---> " + consultas.clausulas(object) + "\n" );
				switch( object.seleccionador )
				{
						case "especialidad":
							models.Usuario.findAll({
								//se incluyen las siguientes tablas
								include: [{model: models.DatosGenerales},
												{model: models.Medico},
												{model: models.Direccion, where:consultas.clausulas(object)},
												{model: models.Telefono}
												//{model: models.Especialidad, where:{descripcion:object.especialidad}}
								]
							}).then(function(medicos)
							{
									console.log("especialidad");
									res.render('searchMedic', {medicos:JSON.parse(JSON.stringify(medicos)) });
							});
						break;
						case "medico":
							models.Usuario.findAll({
								//se incluyen las siguientes tablas
								include: [{model: models.DatosGenerales, where:consultas.clausulas(object)},
												{model: models.Medico},
												{model: models.Direccion},
												{model: models.Telefono}
												//{model: models.Especialidad}
								]
							}).then(function(medicos)
							{
								console.log("medico");
								res.render('searchMedic', {medicos:JSON.parse(JSON.stringify(medicos)) });
							});
						break;
						case "padecimiento":
							models.Usuario.findAll({
								//se incluyen las siguientes tablas
								include: [{model: models.DatosGenerales},
												{model: models.Medico},
												{model: models.Direccion,where:consultas.clausulas(object)},
												{model: models.Telefono}
												//{model: models.padecimiento}
								]
							}).then(function(medicos)
							{
								console.log("padecimiento");
									res.render('searchMedic', {medicos:JSON.parse(JSON.stringify(medicos)) });
							});
						break;
						default:
							models.Usuario.findAll({
								include: [{model: models.DatosGenerales, where:{nombre:{$like:object.nombreMedico + "%"}} },
												{model: models.Medico },
												{model: models.Direccion },
												{model: models.Telefono }
											]
							}).then(function(medicos)
							{
								console.log("default");
								res.render('searchMedic',{medicos:JSON.parse(JSON.stringify(medicos)) });
							});
						break;
				}
		}
}
