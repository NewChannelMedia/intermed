module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeLife = object.routeLife;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.get('*', function (req, res, next){
    if (req.url != '/logout'){
      if (req.session.passport && req.session.passport.user && req.session.passport.user.tipoUsuario == "M"){
        if (req.session.passport.user.status == 0){
          routeLife( 'plataforma2', 'plataforma', hps );
          models.PlanDeCargo.findAll({
            order: [['default','DESC']]
          }).then(function(planes){
            res.render('medico/registro_1',{planes:planes});
          });

        } else if (req.session.passport.user.status == -1){
          routeLife( 'plataforma2', 'plataforma', hps );
          res.render('medico/registro_2');
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });

  //Vista: home
  app.get( '/', function ( req, res ) {
    if (req.session.passport && req.session.passport.user){
      routeLife( 'plataforma2', 'plataforma', hps );
    } else {
      routeLife( 'main', 'main', hps );
    }
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
      routeLife( 'plataforma2', 'plataforma', hps );
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

  //Vista de historiales
  app.get('/historiales', function( req, res ){
    routeLife( 'plataforma2', 'plataforma/medico', hps );
    intermed.callController('historiales','index', req.body, req, res );
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

  app.get('/control', function (req, res) {
    routeLife( 'plataforma2', 'plataforma', hps );
    if (req.session.passport && req.session.passport.userIntermed && req.session.passport.userIntermed.id>0){
      res.render('control',{
        userIntermed: req.session.passport.userIntermed
      });
    } else {
      res.render('accesscontrol');
    }
  });


  app.get('/secretaria', function (req, res, next) {
    routeLife( 'plataforma2', 'plataforma', hps );
    if (req.session.passport && req.session.passport.user && req.session.passport.user.Medico_id>0 ){
      intermed.callController('secretaria','index',req.body, req, res);
    } else {
      next();
    }
  });

  app.get( '/secretaria/:token', function ( req, res, next ) {
    routeLife( 'plataforma2', 'plataforma', hps );
    if (!(req.session.passport && req.session.passport.user && req.session.passport.user.id>0) || (req.session.passport.user.Secretaria_id>0)){
      intermed.callController('secretaria','registrar', req.params, req, res);
    } else {
      next();
    }
  });

  app.get('/comentarios',function(req, res, next){
    if (req.session.passport && req.session.passport.user && req.session.passport.user.Medico_id>0 ){
      routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController('medicos','comentarios',req.body, req, res);
    } else {
      next();
    }
  });

  app.get( '/s/:usuarioUrl', function ( req, res, next ) {
    routeLife( 'plataforma2', 'plataforma', hps );
    if (req.session.passport && req.session.passport.user.id && req.session.passport.user.Secretaria_id>0){
      models.MedicoSecretaria.findOne({
        where: {
          activo: 1,
          secretaria_id: req.session.passport.user.Secretaria_id
        },
        include: [{
          model: models.Medico,
          attributes: ['id'],
          include: [{
            model: models.Usuario,
            attributes: ['usuarioUrl'],
            where: {
              usuarioUrl: req.params.usuarioUrl
            }
          }]
        }]
      }).then(function(MedicoSecretaria){
        if (MedicoSecretaria){
          intermed.callController('secretaria','medicoOficina', req.params, req, res);
        } else {
          next();
        }
      });
    } else {
      next();
    }
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
            tipoUsuario: 'M'
          },
          {
            urlPersonal: usuario,
            tipoUsuario: 'M'
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
