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
var bodyParser = require('body-parser');

//las siguientes lineas, son para indicar donde se encuentran los archivos y con cual sera el que sea el principal
app.set('view engine', 'hbs');
//se agrega la ruta donde se debe de jalar la plantilla
app.engine('hbs', exphbs({ defaultLayout: __dirname + '/../apps/views/layouts/main.hbs'}) );
//configure views path
app.set('views', __dirname + '/../apps/views');
//paginas estaticas donde se encontraran los archivos externos al proyecto en este caso css, js, img, etc...
app.use(express.static( __dirname + '/../public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

//llamado de la clase con la que se podra cargar los controladores
var intermed = require('../apps/controllers/intermed');

/**
*	function encargada de tener listo todo
*/
var iniciar = function()
{
	//Home
	app.get('/', function( req, res ){ intermed.callController('Home', 'sayHello', '', res) });
	//<-------------------------------------->
	/**
	*	El primer get que se encuentra para searchMedic es para la respuesta get
	*	el segundo es para el post al presionar el boton debe de atrapar los
	*	resultados de los inputs. La function intermed.callController recibira los
	*	siguientes parametros:
	*	@param nombre del controlador
	*	@param nombre del metodo
	*	@param object que se recibe
	* @param response
	*/
	app.get( '/searchMedic', function( req, res){intermed.callController('Home', 'vacio','',res)});
	app.post( '/searchMedic', function( req, res )
	{
		var busqueda = JSON.parse( JSON.stringify(req.body));
		intermed.callController('Home', 'searching',busqueda, res);
	});
	//<---------------------------------------->
	//Registro
	app.get('/registro', function( req, res ){ intermed.callController('registro', 'index', '', res)});
	app.post('/registro', function( req, res ){
		if (req.body.getAll === '1'){
			intermed.callController('registro', 'getAll', '', res)
		} else {
			/**
			*	Con la creación de la siguiente variable se puede generar un json que es dinamico
			*	atrapando todo tipo de post que se envia.
			*	JSON.stringify recibe el post con req.body y lo convierte un valor dado en javascript a una cadena  JSON
			*	JSON.parse analiza una cadena de texto como un JSON
			*/
			var object = JSON.parse( JSON.stringify(req.body) );
			intermed.callController('registro', 'registrar', object, res);
		}
	});
}
serv.server(app, 3000);
//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
