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
module.exports = {
		/**
		*	En el siguiente metodo es el que se encargara del envio
		*	que se obtengan de la base de datos, se mandaran hacia la
		*	vista.
		*/
		index:function(object, req, res ){
					models.Especialidad.findAll({
						attributes:['id','especialidad']
					}).then(function(especia){
						models.Padecimiento.findAll({
							attributes:['id','padecimiento']
						}).then(function(padeci){
							models.Estado.findAll({
								attributes:['id','estado']
							}).then(function(estado){
								models.Ciudad.findAll({
								}).then(function(ciudad){
									res.render('home', {especia:especia,padecimiento:padeci, estado:estado,ciudad:ciudad});
								});
							});
						});
					});
		},
	    perfil: function(object, req, res) {
	        if (!req.session.passport.user) {
	            res.redirect('/');
	        }

			var sesion = [];
	        //Contar mensajes sin leer
	        sesion.mensajes = 1;
	        //Contar eventos nuevos o cercanos (Sin ver)
	        sesion.calendario = 5;

			models.Estado.findAll({
				attributes:['id','estado']
			}).then(function(estados){
				res.render('perfil', {sesion: sesion, estados: estados});
				req.session.passport.user.logueado = "1";
			});
	    },
		aboutPacientes:function(object, req, res ){
			res.render('pacientes', object)
		},
		perfilMedicos: function(object, req, res){
			res.render('perfil', object)
		},
		perfilPacientes: function(object, req, res){
			res.render('perfil', object)
		},
		sayHello: function(object, req, res) {
			res.render('home', {}, function(err, html){ res.send(html)});
		},
		vacio: function(object, req, res) {
			models.Especialidad.findAll({
				attributes:['id','especialidad']
			}).then(function(especia){
				models.Padecimiento.findAll({
					attributes:['id','padecimiento']
				}).then(function(padeci){
					models.Estado.findAll({
						attributes:['id','estado']
					}).then(function(estado){
						models.Ciudad.findAll({
						}).then(function(ciudad){
							res.render('searchMedic' ,{especia:especia,padecimiento:padeci, estado:estado,ciudad:ciudad});
						});
					});
				});
			});
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
		searching: function(object, req, res)
		{
			var condicionNombre;
			if( object.nombreMedico != '' && object.apellidoMedico != '' ){
				// los dos campos con datos
				condicionNombre = {
					nombre:{$like:"%"+object.nombreMedico+"%"},
					apellidoP:{$like:"%"+object.apellidoMedico+"%"}
				};
			}else if( object.nombreMedico != '' && object.apellidoMedico == '' ){
				// solo el input nombre tiene información
				condicionNombre = {nombre:{$like:"%"+object.nombreMedico+"%"}};
			}else if( object.nombreMedico == '' && object.apellidoMedico != '' ){
				//el input apellido medico viene con informacion
				condicionNombre={	apellidoP:{$like:"%"+object.apellidoMedico+"%"}};
			}else if(object.nombreMedico == '' && object.apellidoMedico == ''){
				condicionNombre = '';
			}
			var condicionEspecia =(object.especialidad != '0')?{ especialidad_id: object.especialidad}:condicionEspecia = '';
			var condicionPadecimiento = (object.padecimiento != '0')?condicionPadecimiento = {id:object.padecimiento}:condicionPadecimiento = '';
			var condicionEstado = (object.estado != '0')?{ estado_id: object.estado}:condicionEstado = '';
			var condicionCiudad = (object.ciudad != '0')?{ ciudad_id:object.ciudad}:condicionCiudad = '';
			models.Usuario.findAll({
				where: {
					tipoUsuario: 'M'
				},
				include:[
					{model: models.Medico,attributes:['id','cedula'],
						include: [
							{model: models.Padecimiento, where:condicionPadecimiento, attributes:['id','padecimiento']},
							{model: models.MedicoEspecialidad,where:condicionEspecia, attributes:['id','subEsp'],include:[
								{model: models.Especialidad}
							]}
						]
					},
					{model: models.DatosGenerales,where:condicionNombre, attributes:['id','nombre','apellidoP','apellidoM']},
					{model: models.Direccion,attributes:['id','ubicacionGM','calle','numero','nombre'],
					include: [
						{model: models.Localidad, include:[
							{model: models.Estado,where:condicionEstado, attributes:['id','estado']},
							{model: models.Ciudad, where:condicionCiudad, attributes:['id','ciudad']}
						]}
					]},
					{model: models.Telefono, attributes:['tipo','numero','claveRegion','lada']}
				],
				attributes:['id','urlFotoPerfil']
			}).then(function(usuarios){
				console.log('USUARIOS: ' + JSON.stringify(usuarios));
				res.render('searchMedic',{usuarios:usuarios});
			});
		}//fin del metodo searching
}
