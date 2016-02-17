module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  //Vista: home
  app.get( '/', function ( req, res ) {
    routeLife( 'main', 'main', hps );
    app.set('view options', { layout: 'plataforma2' });
    intermed.callController( 'Home', 'index', req.body, req, res )
  } );

  //Buscador de médicos
  app.get( '/buscar', function ( req, res ) {
    routeLife( 'plataforma2', 'interno', hps );
    intermed.callController( 'Home', 'buscar', '', req, res );
  } );

  //Buscador de médicos (enviando por post el filtro de busqueda)
  app.post( '/buscar', function ( req, res ) {
    routeLife( 'plataforma2', 'interno', hps );
    intermed.callController( 'Home', 'searching', req.body, req, res );
  } );

  //Cerrar sesion
  app.get( '/logout', function ( req, res, next ) {
    routeLife( 'main', 'main', hps );
    intermed.callController( 'usuarios', 'logout', {}, req, res )
  } );

  app.get('/notificaciones', function (req, res){
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      routeLife( 'plataforma', 'plataforma', hps );
      intermed.callController('notificaciones','index', req.body, req, res);
    }
  });

  app.get('/inbox', function (req, res){
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController('inbox','index', req.body, req, res);
    }
  });

  app.get( '/inbox/:usuario_id', function ( req, res, next ) {
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController('inbox','index', req.body, req, res);
    }
  });

  app.get( '/invitacion/:tokeninvitacion', function ( req, res ) {
    res.cookie( 'intermed_invitacion', {
      token: req.params.tokeninvitacion
    }, {
      expires: new Date( Date.now() + ( 900000 * 4 * 24 ) )
    } );
    res.redirect( '/' );
  } );

  app.get('/notificaciones/configuracion', function (req, res){
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      routeLife( 'plataforma', 'plataforma', hps );
      intermed.callController('notificaciones','configuracion', req.body, req, res);
    }
  });
  //Configuraciones
  app.get('/configuraciones',function(req,res){
    routeLife('plataforma2','plataforma',hps);
    intermed.callController('/configuracion/configuraciones','index',req, res);
  });

  app.get('/control', function (req, res,next){
    if (req.session.passport && req.session.passport.user && req.session.passport.user.tipoUsuario == "A"){
      routeLife( 'plataforma2', 'plataforma', hps );
      res.render('control');
    } else {
      next();
    }
  });

  /* routers que cargan vista para cargos */
  app.get('/registrarcargorecurrente', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'RegistrarCargoRecurrenteDatos', req.body, req, res);
  });
  app.get('/ProcesarCargosClientes', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'FormularioCobro', req, res);
  });
  app.get('/registrarnuevatarjeta', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'RegistrarNuevaTarjetaDatos', req.body, req, res);
  });
  app.get('/registrarplancargo', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('PlanDeCargo', 'PlanCargoDatosRegistro', req.body, req, res);
  });
  app.get('/suscripcionpausar', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'SuscripcionPausarDatos', req, res);
  });
  app.get('/suscripcioncancelar', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'SuscripcionCancelarDatos', req, res);
  });
  app.get('/suscripcionreanudar', function (req, res) {
    routeLife( 'plataforma2', 'main', hps );
    intermed.callController('CargosUsuarios', 'SuscripcionReanudarDatos', req, res);
  });

  /*RUTA CARGAR PERFIL (DEJAR SIEMPRE AL FINAL)*/
  /*Dejando al final se evita que cada que se entre al router se haga una consulta para ver si se trata de un usuario*/
  app.get( '/:usuario', function ( req, res, next) {
    var usuario = '';
    if ( req.params.usuario ) usuario = req.params.usuario;
    if (usuario != ""){
      models.Usuario.findOne({
        where: models.Sequelize.or(
          {
            usuarioUrl: usuario,
            tipoUsuario: {
              $not: 'A'
            }
          },
          {
            urlPersonal: usuario,
            tipoUsuario: {
              $not: 'A'
            }
          }
        )
      }).then(function(us){
        app.use( '/'+usuario, express.static( __dirname + '/../public' ) );
        if (us){
          routeLife( 'plataforma2', 'plataforma', hps );
          intermed.callController( 'Home', 'nuevoPerfilMedicos', {usuario: usuario}, req, res );
        } else {
          next();
        }
      });
    } else {
      next();
    }
  } );
  /*FIN RUTA PERFIL USUARIO*/
}
