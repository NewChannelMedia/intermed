
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
var passport = require('passport'),
	bodyParser = require('body-parser'),
	cookieParser = require("cookie-parser"),
	session = require('express-session');

app.use(session({secret: 'intermedSession',resave: false,saveUninitialized: true}));

var hps = require('../apps/helpers/helpers');

//las siguientes lineas, son para indicar donde se encuentran los archivos y con cual sera el que sea el principal
app.set('view engine', 'hbs');
//se agrega la ruta donde se debe de jalar la plantilla
app.engine('hbs', exphbs({ defaultLayout: __dirname + '/../apps/views/layouts/main.hbs', helpers: hps}) );
//configure views path
app.set('views', __dirname + '/../apps/views');
//paginas estaticas donde se encontraran los archivos externos al proyecto en este caso css, js, img, etc...
app.use(express.static( __dirname + '/../public'));

app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

//Configurar passport
require('./configPassport')(passport);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//llamado de la clase con la que se podra cargar los controladores
var intermed = require('../apps/controllers/intermed');

/**
*	function encargada de tener listo todo
*/
var iniciar = function()
{
	app.all('*', function( req, res, next){
		if (req.session.passport.user) hps.varSession(req.session.passport.user);
		else hps.varSession(req.session.passport);
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
	app.get('/',
	function (req, res, next){
		next();
	}
	, function( req, res ){ intermed.callController('Home', 'sayHello', '', req, res) });
	// get y post de searchMedic
	app.get( '/searchMedic', function( req, res){intermed.callController('Home', 'vacio','', req, res)});
	app.post( '/searchMedic', function( req, res )
	{
		var busqueda = JSON.parse( JSON.stringify(req.body));
		intermed.callController('Home', 'search',busqueda, req,  res);
	});
	//Registro
	app.get('/registro', function( req, res ){intermed.callController('registro', 'index', '', req, res)});
	app.post('/registro', function( req, res ){
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
			intermed.callController('registro', 'registrar', object, req, res);
		}
	});

	app.get('/auth/facebook', passport.authenticate('facebook',  {scope: 'email'}));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
		function(req, res) {
			res.redirect('/');
	});

	app.get('/userinfo', function(req, res){
		if (req.session.passport.user.provider === 'facebook'){
			//req.session.passport.user.email = 'emailtest';
		}
		res.send('<b>Información de usuario: </b><hr/>' + JSON.stringify(req.session.passport) + '<hr/><a href="/">Regresar</a>');
	});
}
serv.server(app, 3000);
//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
