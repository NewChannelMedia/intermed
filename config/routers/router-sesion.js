module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var passport = object.passport;
  var url = object.url;

  app.all( '*', function ( req, res, next ) {
    req.errorHandler = object.errorHandler;
    req.routeLife = object.routeLife;
    req.hps = object.hps;

    var revivirSesion = false;
    if (url.parse(req.url).pathname != "/favicon.ico"){
      if ( req.session.passport.user ) {
        hps.varSession( req.session.passport.user );
        res.cookie( 'intermed_sesion', {
          id: req.session.passport.user.id,
          usuario: req.session.passport.user.usuarioUrl,
          tipoUsuario: req.session.passport.user.tipoUsuario
        } );
      }
      else {
        hps.varSession([]);
        //Eliminar cookie
        if (req.cookies['intermed_sesion']){
          //Revivir sesión si existe usuario con ['intermed_sesion']['id'] y ['intermed_sesion']['usuarioUrl']
          if (req.cookies['intermed_sesion']['id'] && req.cookies['intermed_sesion']['usuario']){
            revivirSesion = true;
            intermed.callController( 'usuarios', 'revivirSesion', {id:req.cookies['intermed_sesion']['id'],usuarioUrl:req.cookies['intermed_sesion']['usuario']}, req, res );
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
    console.log('Reg local');
    req.body[ 'tipoRegistro' ] = 'C';
    if ( req.body.tipoUsuario ) req.body[ 'tipoUsuario' ] = req.body.tipoUsuario;
    else req.body[ 'tipoUsuario' ] = 'P';
    intermed.callController( 'usuarios', 'registrarUsuario', req.body, req, res );
  } );
  //activar cuenta
  //<------------------------------------------------------------------------->
  app.get( '/activar/:token', function ( req, res ) {
    var tok = req.params.token;
    routeLife( 'mail', 'interno', hps );
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
}
