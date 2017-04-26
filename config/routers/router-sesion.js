module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var passport = object.passport;
  var url = object.url;
  var cookieSession = object.cookieSession;

  const crypto = require('crypto'),
    algorithm = 'aes192',
    password = 'int5erm7edS6ess6ion';



  app.all( '*', function ( req, res, next ) {

  //  console.log(req.cookies['connect.sid'] + '>'+req.method  + ' - ' + req.path + ': ' + JSON.stringify(req.cookies['_intermed']) + ' - ' + req.headers.cookie + '\n'+'----------------------------------');

    req.errorHandler = object.errorHandler;
    req.routeDispatcher = object.routeDispatcher;
    req.hps = object.hps;

    var revivirSesion = false;
    hps.varSession([]);
    if (url.parse(req.url).pathname != "/favicon.ico"){
      if ( req.session.passport.user ) {
        hps.varSession( req.session.passport.user );
      }
      else {
        if (req.cookies['_intermed'] && req.cookies['_intermed'] != "" && req.cookies['_intermed'] != "undefined"){
          try{
            var decipher = crypto.createDecipher(algorithm,password);
            var encrypted = unescape(req.cookies['_intermed']);
            var decrypted =  decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            cookieSession = decrypted.split(';');
            if (cookieSession[0] && cookieSession[1]){
              revivirSesion = true;
              intermed.callController( 'usuarios', 'revivirSesion', {id:cookieSession[0],tipoUsuario:cookieSession[2]}, req, res );
            }
          } catch (e){
            console.error('Error al descifrar la cookie de sesión: ' + e);
          }
        }
      }
      if (!revivirSesion){
        next();
      }
    }
  } );

  app.get( '/auth/facebook/request/:tipo', function ( req, res, next ) {
    req.session.tipo = '';
    if ( req.params.tipo === "M" || req.params.tipo === "P" ) req.session.tipo = req.params.tipo;
    next();
  }, passport.authenticate( 'facebook', {
    scope: [ 'email', 'user_birthday', 'user_location', 'publish_actions' ]
  } ) );

  //Callback con respuesta del inicio de sesion de facebook por passport (trae los datos del usuario)
  app.get( '/auth/facebook/callback', passport.authenticate( 'facebook', {
      failureRedirect: '/'
    } ),
    function ( req, res ) {
      req.session.passport.user[ 'tipoRegistro' ] = 'F';
      req.session.passport.user[ 'tipoUsuario' ] = req.session.tipo;
      intermed.callController( 'usuarios', 'registrarUsuario', req.session.passport.user, req, res );
  } );

  //registro pacientes
  app.post( '/reg/local', function ( req, res ) {
    req.body[ 'tipoRegistro' ] = 'C';
    if ( req.body.tipoUsuario ) req.body[ 'tipoUsuario' ] = req.body.tipoUsuario;
    else req.body[ 'tipoUsuario' ] = 'P';
    intermed.callController( 'usuarios', 'registrarUsuario', req.body, req, res );
  } );
  //activar cuenta
  //<------------------------------------------------------------------------->
  app.get( '/activar/:token', function ( req, res ) {
    var tok = req.params.token;
    routeDispatcher( 'mail', 'interno', hps );
    intermed.callController( 'usuarios', 'activarCuenta', {
      token: tok
    }, req, res );
  } );
  //<------------------------------------------------------------------------->
  //Verificar por ajax si una cuenta de correo esta disponible para su registro

  //Inicio de sesión para usuarios registrados por correo
  app.post( '/auth/correo', function ( req, res ) {
    intermed.callController( 'usuarios', 'iniciarSesion', req.body, req, res );
  } );


  app.post( '/actualizarSesion', function ( req, res ) {
    intermed.callController( 'usuarios', 'actualizarSesion', req.body, req, res );
  } );

  app.post('/session/tipo', function (req, res){
    intermed.callController( 'session', 'getSessionType', req.body, req, res );
  });

  app.post( '/logout', function ( req, res, next ) {
    routeDispatcher( 'main', 'main', hps );
    intermed.callController( 'usuarios', 'logout', {}, req, res )
  } );

  function parseCookies (request) {
      var list = {},
          rc = unescape(request.headers.cookie).replace('j:{','').replace(':{','').replace('}','');

      rc && rc.split(';').forEach(function( cookie ) {
          var parts = cookie.split('=');
          list[parts.shift().trim()] = decodeURI(parts.join('='));
      });

      return list;
  }
}
