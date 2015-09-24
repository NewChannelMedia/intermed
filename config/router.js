/**
*	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
*	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
*	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
*	@author Oscar, Cinthia
*	@version 0
*	@date Tuesday, August 4,  2015
*/

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

app.use(bodyParser.json({limit: '5mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true ,limit: '5mb'})); // support encoded bodies
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

	//Router para request inicio de sesion o registro con facebook por medio de passport
	app.get('/auth/facebook', passport.authenticate('facebook',  {scope: ['email','user_birthday','user_location','publish_actions']}));
	//Callback con respuesta del inicio de sesion de facebook por passport (trae los datos del usuario)
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
	//Verificar por ajax si una cuenta de correo esta disponible para su registro
	app.post('/correoDisponible', function( req, res ){
			intermed.callController('usuarios', 'correoDisponible', req.body, req, res);
		});
	//Inicio de sesión para usuarios registrados por correo
	app.post('/auth/correo', function( req, res){
		intermed.callController('usuarios', 'iniciarSesion', req.body, req, res);
	});
	//Login para el usuario tipo admin
	app.post('/loginLocal', passport.authenticate('local', { failureRedirect: '/' }),function(req, res) {
		res.redirect('/');
	});
	//Obtener el perfil del usuario de la sesión
	app.get('/perfil', function (req, res){
		rutas.routeLife('plataforma','plataforma/paciente', hps);
		intermed.callController('home','perfil', req.body, req, res);
	});
	//Modificar la información del usuario de la sesión
	app.post('/perfil', function (req, res){
		rutas.routeLife('plataforma','plataforma/paciente', hps);
		intermed.callController('pacientes','modificarPerfil', req.body, req, res);
	});
	//Obtener con ajax la información de la sesión del usuario
	app.post('/obtenerInformacionUsuario', function (req, res){
		rutas.routeLife('plataforma','plataforma/pacientes',hps);
		intermed.callController('usuarios','obtenerInformacionUsuario', '', req, res);
	});
	//actualiza la informacion del paciente de los biometricos
	app.post("/despachador", function(req, res){
			intermed.callController('usuarios','despachador',req.body, req, res);
	});
	//-----------------------------------------------------
	//-----------------------------------------------------
	//Obtener con ajax las ciudades del estado_id enviado por post
	app.post('/obtenerCiudades', function (req, res){
		intermed.callController('ubicacion','obtieneCiudades', req.body, req, res);
	});
	//Obtener con ajax las localidades del estado_id y ciudad_id enviados por post
	app.post('/obtenerLocalidades', function (req, res){
		intermed.callController('ubicacion','obtieneLocalidades', req.body, req, res);
	});
	//Obtener con ajax el codigo postal de la localidad_id enviada por post
	app.post('/buscarCP', function (req, res){
		intermed.callController('ubicacion','encontrarPorCP', req.body, req, res);
	});
	//::Temporal::, solo para ver la información que tiene el usuario en su variable sesión
	app.get('/informacionusuario', function (req, res){
		res.send(JSON.stringify(req.session.passport) + '<br/><a href="/">Regresar</a>');
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

}
serv.server(app, 3000);
//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
