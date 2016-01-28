/**
 *	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
 *	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
 *	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
 *	@author Oscar, Cinthia
 *	@version 0
 *	@date Tuesday, August 4,  2015
 */
global.base_url = 'http://localhost:3000/';


var express = require( 'express' ),
    exphbs = require( 'express-handlebars' ),
    handlebars = require( 'handlebars' ),
    serv = require( './server' ),
    socket = require( './io' ),
    url = require( 'url' ),
    passport = require( 'passport' ),
    bodyParser = require( 'body-parser' ),
    cookieParser = require( "cookie-parser" ),
    session = require( 'express-session' ),
    bundle = require( 'socket.io-bundle' ),
    ioPassport = require( 'socket.io-passport' ),
    hps = require( '../apps/helpers/helpers' ),
    intermed = require( '../apps/controllers/Intermed' ),
    models  = require('../apps/models');

require( './configPassport' )( passport );

var app = express()
    .use( cookieParser( 'intermedSession' ) )
    .use( session( {
      secret: 'intermedSession',
      resave: true,
      saveUninitialized: true
    } ) )
    .use( passport.initialize() )
    .use( passport.session() )
    .use( bodyParser.json( {
      limit: '5mb'
    } ) ) // support json encoded bodies
    .use( bodyParser.urlencoded( {
      extended: true,
      limit: '5mb'
    } ) ); // support encoded bodies

app.set( 'view engine', 'hbs' );

app.use( '/', express.static( __dirname + '/../public' ) );
app.use( '/inbox', express.static( __dirname + '/../public' ) );
app.use( '/notificaciones', express.static( __dirname + '/../public' ) );
app.use( '/cambiar', express.static( __dirname + '/../public' ) );
app.use( '/historiales', express.static( __dirname + '/../public' ) );
app.use( '/medico', express.static( __dirname + '/../public' ) );

var routeLife = function ( plantilla, carpeta, helpers ) {
  app.set( 'views', __dirname + '/../apps/views/' + carpeta);
  app.engine( 'hbs', exphbs( {
    defaultLayout: __dirname + '/../apps/views/layouts/' + plantilla + '.hbs',
    extname: '.hbs',
    helpers: helpers
  } ) );
}

/*INICIO CARGA DE ROUTERS*/
var routerObject = {
  app:app,
  intermed: intermed,
  routeLife: routeLife,
  hps: hps,
  express: express,
  passport: passport,
  url: url,
  models: models
}

require( './routers/router-sesion.js' )(routerObject);//Es el primero en cargar, verifica la sesión
require( './routers/_router-get.js' )(routerObject); //Contiene todas las rutas a cargar (render)
require( './routers/router-buscador.js' )(routerObject);
require( './routers/router-contactos.js' )(routerObject);
require( './routers/router-agenda.js' )(routerObject);
require( './routers/router-inbox.js' )(routerObject);
require( './routers/router-medico.js' )(routerObject);
require( './routers/router-notificaciones.js' )(routerObject);
require( './routers/router-paciente.js' )(routerObject);
require( './routers/router-ubicacion.js' )(routerObject);
require( './routers/router-usuario.js' )(routerObject);
require('./routers/router-encriptacion.js')(routerObject);
require('./routers/router-configuraciones.js')(routerObject);//router para las configuraciones
require( './routers/router-error.js' )(routerObject);
/*FIN CARGA DE ROUTERS*/

var io = serv.server( app, 3000 );
socket.io( io, bundle, ioPassport );
