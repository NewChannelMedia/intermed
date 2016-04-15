/**
 *	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
 *	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
 *	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
 *	@author Oscar, Cinthia
 *	@version 0
 *	@date Tuesday, August 4,  2015
 */
global.base_url = 'http://intermed.online:3000/';


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
    errorHandler = require( '../apps/controllers/errorHandler' ),
    models  = require('../apps/models');

require( './configPassport' )( passport );

var app = express()
    .use( cookieParser( '_intermed' ) )
    .use( session( {
      secret: '_intermed',
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
//Validar: Todo menos favicon.
app.use( '/', express.static( __dirname + '/../public' ) );
app.use( '/:a', express.static( __dirname + '/../public' ) );
app.use( '/:a/', express.static( __dirname + '/../public' ) );
app.use( '/:a/:b', express.static( __dirname + '/../public' ) );
app.use( '/:a/:b/', express.static( __dirname + '/../public' ) );
/*
app.use( '/inbox', express.static( __dirname + '/../public' ) );
app.use( '/notificaciones', express.static( __dirname + '/../public' ) );
app.use( '/cambiar', express.static( __dirname + '/../public' ) );
app.use( '/cambiar/historial', express.static( __dirname + '/../public' ) );
app.use( '/cambiar/intermed', express.static( __dirname + '/../public' ) );
app.use( '/historiales', express.static( __dirname + '/../public' ) );
app.use( '/medico', express.static( __dirname + '/../public' ) );
app.use( '/s', express.static( __dirname + '/../public' ) );
app.use( '/secretaria', express.static( __dirname + '/../public' ) );
app.use( '/:usuario/', express.static( __dirname + '/../public' ) );
app.use( '/:usuario/galeria', express.static( __dirname + '/../public' ) );
*/

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
  models: models,
  errorHandler: errorHandler
}
app.all( '*', function ( req, res, next ) {
  if (req.method == "GET")
  console.log(req.method  + '_' + req.path + ': ' + JSON.stringify(req.cookies['_intermed']));
  next();
});

//::Temporal::, solo para ver la información que tiene el usuario en su variable sesión
app.get( '/informacionusuario', function ( req, res ) {
  //res.send( JSON.stringify( req.session.passport ) + '<br/><a href="/">Regresar</a>' )
  res.send( JSON.stringify( req.session.passport ));
} );

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
//Fin temporal

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
require('./routers/router-control.js')(routerObject);
require('./routers/router-pagos.js')(routerObject);
require('./routers/router-historiales.js')(routerObject);
require('./routers/router-secretaria.js')(routerObject);
require( './routers/router-error.js' )(routerObject);
/*FIN CARGA DE ROUTERS*/



var io = serv.server( app, 3000 );
socket.io( io, bundle, ioPassport );
