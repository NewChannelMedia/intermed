/**
*	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
*	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
*	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
*	@author Oscar, Cinthia
*	@version 0
*	@date Tuesday, August 4,  2015
*/

var models  = require('../apps/models');

//librerias requeridas
///librerias requeridas
var express = require('express');
var exphbs = require('express-handlebars');
var handlebars = require('handlebars');
var app = express();
var url = require('url');
//con esta linea se carga el servidor
var serv = require('./server');
//envio de correo variable
var envia = require('../apps/controllers/emailSender');
var passport = require('passport'),
	bodyParser = require('body-parser'),
	cookieParser = require("cookie-parser"),
	session = require('express-session');

app.use(session({secret: 'intermedSession',resave: false,saveUninitialized: true}));

var hps = require('../apps/helpers/helpers');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies
//<----------------------------------------------------------------------------->
	/**
	* function para cargar las rutas, como estatitcas los layouts
	*
	* @param plantilla, nombre del layouts
	* @param cuerpos, nombre del archivo que tendra el body de la pantalla
	*	@param hell, nombre del helper que se quiera utilizar
	*/
	var rutas = {
		routeLife: function( plantilla, carpeta, hell ){
			app.set('view engine', 'hbs');
			app.engine('hbs',exphbs({defaultLayout:__dirname + '/../apps/views/layouts/'+plantilla+'.hbs',helpers:hell}));
			app.set('views', __dirname+'/../apps/views/' + carpeta );
			app.use(express.static( __dirname + '/../public'));
		}
	};
//<----------------------------------------------------------------------------->
//Configurar passport
require('./configPassport')(passport);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//llamado de la clase con la que se podra cargar los controladores
var intermed = require('../apps/controllers/Intermed');

/**
*	function encargada de tener listo todo
*/
var iniciar = function()
{
	app.all('*', function( req, res, next){
		if (req.session.passport.user) hps.varSession(req.session.passport.user);
		else hps.varSession(req.session.passport);
		rutas.routeLife('main','main',hps);
		next();
	});

	//LogIn
	app.post('/*', function( req, res , next){
		if (req.body.loginType === 'admin') intermed.callController('session', 'login',req.body,req, res);
		else next();
	});

	//LogOut
	app.get('/logout', function( req, res , next){intermed.callController('session','logout', {}, req, res)});
	//Home
	app.get('/', function( req, res ){intermed.callController('Home','index','',req,res)});//intermed.callController('Home', 'sayHello', '', req, res)});

	// get y post de searchMedic
	app.get( '/searchMedic', function( req, res){intermed.callController('Home', 'vacio','', req, res)});
	app.post( '/searchMedic', function( req, res )
	{
		var busqueda = JSON.parse( JSON.stringify(req.body));
		rutas.routeLife('interno','interno', hps);
		intermed.callController('Home', 'searching',busqueda, req,  res);
	});
	//Registro
	app.get('/registro', function( req, res ){
		rutas.routeLife('interno','interno',hps);
		intermed.callController('registro', 'index', '', req, res);
	});
	app.post('/registro', function( req, res ){
		rutas.routeLife('interno','interno',hps);
		if (req.body.getAll === '1'){
			intermed.callController('registro', 'getAll', '', req, res)
		} else {
			/**
			*	Con la creación de la siguiente variable se puede generar un json que es dinamico
			*	atrapando todo tipo de post que se envia.
			*	JSON.stringify recibe el post con req.body y lo convierte un valor dado en javascript a una cadena  JSON
			*	JSON.parse analiza una cadena de texto como un JSON
			*/
			var object = JSON.parse( JSON.stringify(req.body) );
			intermed.callController('medicos', 'registrar', object, req, res);
		}
	});

	//prueba AboutPaciente
	app.get('/pacientes', function( req, res ){
		rutas.routeLife('main','main',hps);
		intermed.callController('Home', 'aboutPacientes', '', req, res);
	});

	app.get('/informacionusuario', function (req, res){
		res.send(JSON.stringify(req.session.passport) + '<br/><a href="/">Regresar</a>');
	});

	app.get('/auth/facebook', passport.authenticate('facebook',  {scope: ['email','user_birthday','user_location','publish_actions']}));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
		function(req, res) {
			req.session.passport.user['tipoRegistro'] = 'F';
			req.session.passport.user['tipoUsuario'] = 'P';
			intermed.callController('usuarios', 'registrarUsuario',req.session.passport.user, req, res);
	});
	//registro pacientes
	app.post('/reg/local', function (req, res){
		req.body.name = req.body.first_name + ' ' + req.body.last_name;
		req.body['tipoRegistro'] = 'L';
		req.body['tipoUsuario'] = 'P';
		intermed.callController('usuarios', 'registrarUsuario',req.body, req, res);
	});
	//activar cuenta
	//<------------------------------------------------------------------------->
	app.get('/activar/:token', function(req, res)
	{
		var tok = req.params.token;
		rutas.routeLife('mail','interno', hps);
		intermed.callController('usuarios','activarCuenta', {token:tok}, req, res);
	});
	//<------------------------------------------------------------------------->
	app.post('/correoDisponible', function( req, res ){
			intermed.callController('usuarios', 'correoDisponible', req.body, req, res);
		});

	app.post('/auth/correo', function( req, res){
		intermed.callController('usuarios', 'iniciarSesion', req.body, req, res);
	});

	app.post('/loginLocal', passport.authenticate('local', { failureRedirect: '/' }),function(req, res) {
		res.redirect('/');
	});

	//  Pruebas  padecimientos y tipo especialidad
	app.get('/padecimientos', function(req, res) {
		models.Medico.findAll({
			include :  [ { model: models.Padecimiento}  ]
		})
		.then(function(datos) {
			res.send(datos);
		});
	});

	app.get('/especialidades', function(req, res) {
			models.Especialidad.findAll({
				include :  [ { model: models.TipoEspecialidad}  ]
			})
			.then(function(datos) {
				res.send(datos);
			});
	});

	app.get('/especialidadesm', function(req, res) {
			models.Medico.findAll({
				include :  [ { model: models.Especialidad, include : [{ model: models.TipoEspecialidad}]}  ]
			})
			.then(function(datos) {
				res.send(datos);
			});
	});

	app.get('/comentariosMedicos', function(req, res) {
			models.Medico.findAll({
				include :  [
					{ model: models.ComentariosMedicos},
					{ model: models.Usuario}  ]
			})
			.then(function(datos) {
				res.send(datos);
			});
	});

		app.get('/comentariosUsuario', function(req, res) {
				models.Usuario.findAll({
					include :  [
						{ model: models.ComentariosMedicos},
						{ model: models.Medico}  ]
				})
				.then(function(datos) {
					res.send(datos);
				});
		});

		app.get('/biometricos', function(req, res) {
				models.Biometrico.findAll({
					include : [
						{ model: models.Usuario, include : [ { model : models.Paciente} ] }
					]
				})
				.then(function(datos) {
					res.send(datos);
				});
		});

		app.get('/direccion', function(req, res) {
				models.Direccion.findAll({
					include : [
						{ model: models.Estado},
						{ model: models.Ciudad}  ]
				})
				.then(function(datos) {
					res.send(datos);
				});
		});

		app.get('/estados', function(req, res) {
				models.Estado.findAll({
					include : [
						{ model: models.Ciudad}  ]
				})
				.then(function(datos) {
					res.send(datos);
				});
		});

		app.get('/ciudades', function(req, res) {
				models.Ciudad.findAll({
					include : [
						{ model: models.Estado},
						{ model: models.Direccion}
					]
				})
				.then(function(datos) {
					res.send(datos);
				});
		});

		app.get('/secretarias', function(req, res) {
						models.Secretaria.findAll({
							include : [
								{ model: models.Usuario}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/aseguradoras', function(req, res) {
						models.Medico.findAll({
							include : [
								{ model: models.Aseguradora}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/calificacionmedico', function(req, res) {
						models.CalificacionMedico.findAll({
							include : [
								{ model: models.Usuario},
								{ model: models.Medico}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/calificacioncita', function(req, res) {
						models.CalificacionCita.findAll({
							include : [
								{ model: models.Agenda},
								{ model: models.Medico},
								{ model: models.Paciente}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/agenda', function(req, res) {
						models.Agenda.findAll({
							include : [
								{ model: models.Usuario},
								{ model: models.Direccion}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/servicios', function(req, res) {
						models.Usuario.findAll({
							include : [
								{ model: models.CatalogoServicios}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/facturacion', function(req, res) {
						models.DatosFacturacion.findAll({
							include : [
								{ model: models.Usuario},
								{ model: models.Direccion}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/institucion', function(req, res) {
						models.Institucion.findAll({
							include : [
								{ model: models.Usuario},
								{ model: models.Direccion}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});

		app.get('/proveedores', function(req, res) {
						models.Proveedor.findAll({
							include : [
								{ model: models.Usuario,
									include : [{ model: models.Direccion}]}
							]
						})
						.then(function(datos) {
							res.send(datos);
						});
		});
}
serv.server(app, 3000);
//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
