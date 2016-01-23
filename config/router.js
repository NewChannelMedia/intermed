/**
 *	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
 *	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
 *	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
 *	@author Oscar, Cinthia
 *	@version 0
 *	@date Tuesday, August 4,  2015
 */
global.base_url = 'http://localhost:3000/';

var models = require( '../apps/models' );

//librerias requeridas
///librerias requeridas
var express = require( 'express' );
var exphbs = require( 'express-handlebars' );
var handlebars = require( 'handlebars' );
var app = express();
var url = require( 'url' );
//con esta linea se carga el servidor
var serv = require( './server' );
var socket = require( './io' );
//envio de correo variable
var envia = require( '../apps/controllers/emailSender' );
var passport = require( 'passport' ),
  bodyParser = require( 'body-parser' ),
  cookieParser = require( "cookie-parser" ),
  session = require( 'express-session' ),
  bundle = require( 'socket.io-bundle' ),
  ioPassport = require( 'socket.io-passport' );

app.use( cookieParser( 'intermedSession' ) );

app.use( session( {
  secret: 'intermedSession',
  resave: true,
  saveUninitialized: true
} ) );

var hps = require( '../apps/helpers/helpers' );

app.use( bodyParser.json( {
  limit: '5mb'
} ) ); // support json encoded bodies
app.use( bodyParser.urlencoded( {
  extended: true,
  limit: '5mb'
} ) ); // support encoded bodies

app.set( 'view engine', 'hbs' );
app.use( '/', express.static( __dirname + '/../public' ) );
app.use( '/perfil', express.static( __dirname + '/../public' ) );
app.use( '/nuevoPerfilMedicos', express.static( __dirname + '/../public' ) );
app.use( '/inbox', express.static( __dirname + '/../public' ) );
app.use( '/notificaciones', express.static( __dirname + '/../public' ) );
app.use( '/cambiar', express.static( __dirname + '/../public' ) );
app.use( '/historiales', express.static( __dirname + '/../public' ) );
//<----------------------------------------------------------------------------->
/**
 * function para cargar las rutas, como estatitcas los layouts
 *
 * @param plantilla, nombre del layouts
 * @param cuerpos, nombre del archivo que tendra el body de la pantalla
 *	@param hell, nombre del helper que se quiera utilizar
 */
var rutas = {
  routeLife: function ( plantilla, carpeta, hell ) {
    app.engine( 'hbs', exphbs( {
      defaultLayout: __dirname + '/../apps/views/layouts/' + plantilla + '.hbs',
      helpers: hell
    } ) );
    app.set( 'views', __dirname + '/../apps/views/' + carpeta );
  }
};
//<----------------------------------------------------------------------------->
//Configurar passport
require( './configPassport' )( passport );
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use( passport.initialize() );
app.use( passport.session() );

//llamado de la clase con la que se podra cargar los controladores
var intermed = require( '../apps/controllers/Intermed' );

/**
 *	function encargada de tener listo todo
 */
var iniciar = function () {

  app.all( '*', function ( req, res, next ) {
    rutas.routeLife( 'main', 'main', hps );
    var revivirSesion = false;
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
      if (req.cookies['intermed_sesion'] && req.method == "GET"){
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
  } );

  //LogIn
  app.post( '/*', function ( req, res, next ) {
    if ( req.body.loginType === 'admin' ) intermed.callController( 'session', 'login', req.body, req, res );
    else next();
  } );

  //LogOut
  app.get( '/logout', function ( req, res, next ) {
    rutas.routeLife( 'main', 'main', hps );
    intermed.callController( 'usuarios', 'logout', {}, req, res )
  } );
  //Home
  app.get( '/', function ( req, res ) {
    rutas.routeLife( 'main', 'main', hps );
    intermed.callController( 'Home', 'index', req.body, req, res )
  } );

  // get y post de searchMedic
  app.get( '/buscar', function ( req, res ) {
    rutas.routeLife( 'plataforma2', 'interno', hps );
    intermed.callController( 'Home', 'vacio', '', req, res );
  } );
  app.post( '/buscar', function ( req, res ) {
    rutas.routeLife( 'plataforma2', 'interno', hps );
    var busqueda = JSON.parse( JSON.stringify( req.body ) );
    intermed.callController( 'Home', 'searching', busqueda, req, res );
  } );
  //Registro
  app.get( '/registro', function ( req, res ) {
    rutas.routeLife( 'interno', 'interno', hps );
    intermed.callController( 'registro', 'index', '', req, res );
  } );
  app.post( '/registro', function ( req, res ) {
    rutas.routeLife( 'interno', 'interno', hps );
    if ( req.body.getAll === '1' ) {
      intermed.callController( 'registro', 'getAll', '', req, res )
    }
    else {
      /**
       *	Con la creación de la siguiente variable se puede generar un json que es dinamico
       *	atrapando todo tipo de post que se envia.
       *	JSON.stringify recibe el post con req.body y lo convierte un valor dado en javascript a una cadena  JSON
       *	JSON.parse analiza una cadena de texto como un JSON
       */
      var object = JSON.parse( JSON.stringify( req.body ) );
      intermed.callController( 'medicos', 'registrar', object, req, res );
    }
  } );

  //prueba AboutPaciente
  app.get( '/pacientes', function ( req, res ) {
    rutas.routeLife( 'main', 'main', hps );
    intermed.callController( 'Home', 'aboutPacientes', '', req, res );
  } );
  app.get( '/perfilMedicos', function ( req, res ) {
    rutas.routeLife( 'plataforma', 'plataforma/medicos', hps );
    intermed.callController( 'Home', 'perfilMedicos', '', req, res );
  } );
  app.get( '/perfilPacientes', function ( req, res ) {
    rutas.routeLife( 'plataforma', 'plataforma/pacientes', hps );
    intermed.callController( 'Home', 'perfilPacientes', '', req, res );
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
    rutas.routeLife( 'mail', 'interno', hps );
    intermed.callController( 'usuarios', 'activarCuenta', {
      token: tok
    }, req, res );
  } );
  //<------------------------------------------------------------------------->
  //Verificar por ajax si una cuenta de correo esta disponible para su registro
  app.post( '/correoDisponible', function ( req, res ) {
    intermed.callController( 'usuarios', 'correoDisponible', req.body, req, res );
  } );
  //Inicio de sesión para usuarios registrados por correo
  app.post( '/auth/correo', function ( req, res ) {
    intermed.callController( 'usuarios', 'iniciarSesion', req.body, req, res );
  } );
  //Login para el usuario tipo admin
  app.post( '/loginLocal', passport.authenticate( 'local', {
    failureRedirect: '/'
  } ), function ( req, res ) {
    res.redirect( '/' );
  } );
  //Obtener el perfil del usuario de la sesión
  app.get( '/perfil', function ( req, res ) {
    if ( req.session.passport.user ) {
      rutas.routeLife( 'plataforma', 'plataforma', hps );
      intermed.callController( 'home', 'perfil', '', req, res );
    }
    else {
      res.redirect( '/' );
    }
  } );
  //Modificar la información del usuario de la sesión
  app.post( '/perfil', function ( req, res ) {
    rutas.routeLife( 'plataforma', 'plataforma/paciente', hps );
    intermed.callController( 'pacientes', 'modificarPerfil', req.body, req, res );
  } );
  //Obtener con ajax la información de la sesión del usuario
  app.post( '/obtenerInformacionUsuario', function ( req, res ) {
    intermed.callController( 'usuarios', 'obtenerInformacionUsuario', '', req, res );
  } );
  //Obtener con ajax las ciudades del estado_id enviado por post
  app.post( '/obtenerCiudades', function ( req, res ) {
    intermed.callController( 'ubicacion', 'obtieneCiudades', req.body, req, res );
  } );
  //Obtener con ajax las localidades del estado_id y ciudad_id enviados por post
  app.post( '/obtenerLocalidades', function ( req, res ) {
    intermed.callController( 'ubicacion', 'obtieneLocalidades', req.body, req, res );
  } );
  //Obtener con ajax el codigo postal de la localidad_id enviada por post
  app.post( '/buscarCP', function ( req, res ) {
    intermed.callController( 'ubicacion', 'encontrarPorCP', req.body, req, res );
  } );
  //::Temporal::, solo para ver la información que tiene el usuario en su variable sesión
  app.get( '/informacionusuario', function ( req, res ) {
    res.send( JSON.stringify( req.session.passport ) + '<br/><a href="/">Regresar</a>' );
  } );

  app.post( '/informacionRegistroMedico', function ( req, res ) {
    intermed.callController( 'medicos', 'informacionRegistro', '', req, res );
  } );

  app.post( '/regMedPasoUno', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoUno', req.body, req, res );
  } );

  app.post( '/regMedPasoDos', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoDos', req.body, req, res );
  } );

  app.post( '/regMedPasoTres', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoTres', req.body, req, res );
  } );

  app.post( '/actualizarSesion', function ( req, res ) {
    intermed.callController( 'usuarios', 'actualizarSesion', req.body, req, res );
  } );

  //  Pruebas  padecimientos y tipo especialidad
  app.get( '/padecimientos', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.Padecimiento
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/especialidades', function ( req, res ) {
    models.Especialidad.findAll( {
        include: [ {
          model: models.TipoEspecialidad
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/especialidadesm', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.Especialidad,
          include: [ {
            model: models.TipoEspecialidad
                    } ]
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/comentariosMedicos', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.ComentariosMedicos
                }, {
          model: models.Usuario
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/comentariosUsuario', function ( req, res ) {
    models.Usuario.findAll( {
        include: [ {
          model: models.ComentariosMedicos
                }, {
          model: models.Medico
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/biometricos', function ( req, res ) {
    models.Biometrico.findAll( {
        include: [ {
          model: models.Usuario,
          include: [ {
            model: models.Paciente
                    } ]
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/direccion', function ( req, res ) {
    models.Direccion.findAll( {
        include: [ {
          model: models.Estado
                }, {
          model: models.Ciudad
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/estados', function ( req, res ) {
    models.Estado.findAll( {
        include: [ {
          model: models.Ciudad
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/ciudades', function ( req, res ) {
    models.Ciudad.findAll( {
        include: [ {
          model: models.Estado
                }, {
          model: models.Direccion
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/secretarias', function ( req, res ) {
    models.Secretaria.findAll( {
        include: [ {
          model: models.Usuario
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/aseguradoras', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.Aseguradora
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/calificacionmedico', function ( req, res ) {
    models.CalificacionMedico.findAll( {
        include: [ {
          model: models.Usuario
                }, {
          model: models.Medico
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/calificacioncita', function ( req, res ) {
    models.CalificacionCita.findAll( {
        include: [ {
          model: models.Agenda
                }, {
          model: models.Medico
                }, {
          model: models.Paciente
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/agenda', function ( req, res ) {
    models.Paciente.findAll( {
        include: [ {
          model: models.Agenda,
          include: [ {
            model: models.Usuario
                    } ]
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/servicios', function ( req, res ) {
    models.Usuario.findAll( {
        include: [ {
          model: models.CatalogoServicios
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/facturacion', function ( req, res ) {
    models.DatosFacturacion.findAll( {
        include: [ {
          model: models.Usuario
                }, {
          model: models.Direccion
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/institucion', function ( req, res ) {
    models.Institucion.findAll( {
        include: [ {
          model: models.Usuario
                }, {
          model: models.Direccion
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/proveedores', function ( req, res ) {
    models.Proveedor.findAll( {
        include: [ {
          model: models.Usuario,
          include: [ {
            model: models.Direccion
                    } ]
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/hospitales', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.Hospital
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/medicosfav', function ( req, res ) {
    models.MedicoFavorito.findAll( {
        include: [ {
          model: models.Medico
                }, {
          model: models.Usuario
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/medicosfav2', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.MedicoFavorito
                }, {
          model: models.Usuario
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/formacion', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.MedicoFormacion
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/colegios', function ( req, res ) {
    models.Colegio.findAll( {
        include: [ {
          model: models.Medico
                }, {
          model: models.Institucion
                }, ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/experiencia', function ( req, res ) {
    models.Medico.findAll( {
        include: [ {
          model: models.MedicoExperiencia,
          include: [ {
            model: models.Ciudad
                    }, {
            model: models.Estado
                    }, {
            model: models.Institucion
                    } ]
                } ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  app.get( '/contactos', function ( req, res ) {
    models.Contacto.findAll( {
        include: [ {
          model: models.Usuario
                }, {
          model: models.Paciente
                }, ]
      } )
      .then( function ( datos ) {
        res.send( datos );
      } );
  } );

  // Routers para el perfil de medicos

  app.get( '/addMedicoColega', function ( req, res ) {
    var object = {
      idUsuario: 1,
      idMedico: 1
    }
    intermed.callController( 'medicos', 'agregaMedicoFavorito', object, req, res );
  } );

  app.get( '/obtieneMedicosFavoritos', function ( req, res ) {
    var object = {
      idUsuario: 1
    }
    intermed.callController( 'medicos', 'obtieneMedicoFavorito', object, req, res );
  } );

  app.get( '/borraMedicoFavorito', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'borraMedicoFavorito', object, req, res );
  } );

  app.get( '/obtieneFormacion', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'obtieneFormacion', object, req, res );
  } );

  app.get( '/agregaFormacion', function ( req, res ) {
    var object = {
      nivel: 'Licenciatura',
      especialidad: 'orejologo',
      lugarDeEstudio: 'torreon',
      fechaInicio: '01/01/2010',
      fechaFin: '01/01/2010',
      fechaTitulo: '01/01/2010',
      actual: 1,
      idMedico: 1
    }
    intermed.callController( 'medicos', 'agregaFormacion', object, req, res );
  } );

  app.get( '/actualizaFormacion', function ( req, res ) {
    var object = {
      nivel: 'Licenciatura',
      especialidad: 'orejologo',
      lugarDeEstudio: 'torreon',
      fechaInicio: '01/01/2010',
      fechaFin: '01/01/2010',
      fechaTitulo: '01/01/2010',
      actual: 1,
      idMedico: 1,
      id: 1
    }
    intermed.callController( 'medicos', 'actualizaFormacion', object, req, res );
  } );

  app.get( '/borraFormacion', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'borraFormacion', object, req, res );
  } );


  app.get( '/obtieneExperiencia', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'obtieneExperiencia', object, req, res );
  } );

  app.get( '/agregaExperiencia', function ( req, res ) {
    var object = {
      titulo: 'Licenciatura',
      descripcion: 'orejologo ',
      lugarTrabajo: 'torreon',
      fechaInicio: '01/01/2010',
      fechaFin: '01/01/2010',
      fechaTitulo: '01/01/2010',
      idCiudad: 1,
      idEstado: 1,
      idMunicipio: 1,
      actual: 1,
      idMedico: 1,
      idInstitucion: 2
    }
    intermed.callController( 'medicos', 'insertaExperiencia', object, req, res );
  } );

  app.get( '/actualizaExperiencia', function ( req, res ) {
    var object = {
      titulo: 'Licenciatura',
      descripcion: 'orejologo ',
      lugarTrabajo: 'torreon',
      fechaInicio: '01/01/2010',
      fechaFin: '01/01/2010',
      fechaTitulo: '01/01/2010',
      ciudad_id: 1,
      estado_id: 2,
      actual: 1,
      idMunicipio: 1,
      idInstitucion: 2,
      //idMedico: 1,
      id: 1
    }
    intermed.callController( 'medicos', 'actualizaExperiencia', object, req, res );
  } );

  app.get( '/borraExperiencia', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'borraExperiencia', object, req, res );
  } );

  app.get( '/obtienePadecimientosMedicos', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'padecimientos', 'obtienePadecimientosMedico', object, req, res );
  } );

  app.get( '/borraPadecimientosMedicos', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'padecimientos', 'borraPadecimientosMedico', object, req, res );
  } );

  app.get( '/agregaPadecimientosMedicos', function ( req, res ) {
    var object = {
      idMedico: 1,
      idPadecimiento: 1
    }
    intermed.callController( 'padecimientos', 'agregaPadecimientosMedico', object, req, res );
  } );

  app.get( '/obtieneComentarios', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'obtieneComentarios', object, req, res );
  } );

  app.get( '/agregaComentario', function ( req, res ) {
    var object = {
      comentario: 'comentario',
      anonimo: 1,
      idMedico: 1,
      idUsuario: 1
    }
    intermed.callController( 'medicos', 'agregaComentario', object, req, res );
  } );

  app.get( '/actualizaComentario', function ( req, res ) {
    var object = {
      comentario: 'comentario2',
      anonimo: 1,
      idMedico: 1,
      idUsuario: 1,
      id: 1
    }
    intermed.callController( 'medicos', 'actualizaComentario', object, req, res );
  } );

  app.get( '/borraComentario', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'medicos', 'borraComentarios', object, req, res );
  } );

  app.get( '/obtieneHospitalesMedico', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'obtieneHospitalesMedico', object, req, res );
  } );

  app.get( '/agregaHospitales', function ( req, res ) {
    var object = {
      nombre: 'nombre',
      idInstitucion: 2,
      idMedico: 1,
    }
    intermed.callController( 'instituciones', 'insertaHospital', object, req, res );
  } );

  app.get( '/actualizaHospitales', function ( req, res ) {
    var object = {
      id: 1,
      nombre: 'nombre3',
      idInstitucion: 2,
      idMedico: 1,
    }
    intermed.callController( 'instituciones', 'actualizaHospital', object, req, res );
  } );

  app.get( '/borraHospitales', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'borraHospital', object, req, res );
  } );

  app.get( '/obtieneColegiosMedico', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'obtieneColegiosMedico', object, req, res );
  } );

  app.get( '/agregaColegio', function ( req, res ) {
    var object = {
      nombre: 'nombre',
      fechaInicio: '01/01/2015',
      idInstitucion: 2,
      idMedico: 1,
    }
    intermed.callController( 'instituciones', 'insertaColegio', object, req, res );
  } );

  app.get( '/actualizaColegio', function ( req, res ) {
    var object = {
      nombre: 'nombre3',
      fechaInicio: '01/01/2015',
      idInstitucion: 2,
      idMedico: 1,
      id: 1
    }
    intermed.callController( 'instituciones', 'actualizaColegio', object, req, res );
  } );

  app.get( '/borraColegio', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'borraColegio', object, req, res );
  } );

  app.get( '/obtieneInstitucionesMedico', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'obtieneInstitucionesMedico', object, req, res );
  } );

  app.get( '/agregaInstitucion', function ( req, res ) {
    var object = {
      micrositio: 'nombre',
      razonSocial: 'gfdgd',
      idUsuario: 1
    }
    intermed.callController( 'instituciones', 'insertaInstitucion', object, req, res );
  } );

  app.get( '/actualizaInstitucion', function ( req, res ) {
    var object = {
      micrositio: 'nombre',
      razonSocial: 'gfdgd',
      idUsuario: 1,
      id: 1
    }
    intermed.callController( 'instituciones', 'actualizaInstitucion', object, req, res );
  } );

  app.get( '/borraInstitucion', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'borraInstitucion', object, req, res );
  } );

  app.get( '/obtieneAseguradorasMedico', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'obtieneAseguradorasMedico', object, req, res );
  } );

  app.get( '/agregaAseguradora', function ( req, res ) {
    var object = {
      nombre: 'nombre',
      idMedico: 1
    }
    intermed.callController( 'instituciones', 'insertaAseguradora', object, req, res );
  } );

  app.get( '/actualizaAseguradora', function ( req, res ) {
    var object = {
      nombre: 'nombre',
      idMedico: 1,
      id: 1
    }
    intermed.callController( 'instituciones', 'actualizaAseguradora', object, req, res );
  } );

  app.get( '/borraAseguradora', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'instituciones', 'borraAseguradora', object, req, res );
  } );

  app.get( '/perfil/:usuario', function ( req, res ) {
    var usuario = '';
    if ( req.params.usuario ) usuario = req.params.usuario;
    rutas.routeLife( 'plataforma', 'plataforma', hps );
    intermed.callController( 'home', 'perfil', {
      usuario: usuario
    }, req, res );
  } );

  app.post( '/agregarMedFav', function ( req, res ) {
    intermed.callController( 'contactos', 'agregarFav', req.body, req, res );
  } );

  app.post( '/eliminarMedFav', function ( req, res ) {
    intermed.callController( 'contactos', 'eliminarFav', req.body, req, res );
  } );

  app.post( '/cargarFavCol', function ( req, res ) {
    intermed.callController( 'contactos', 'cargarFavCol', {
      usuario: req.body.usuario
    }, req, res );
  } );

  app.post( '/enviarInvitacion', function ( req, res ) {
    intermed.callController( 'usuarios', 'invitar', req.body, req, res );
  } );

  //Home
  app.get( '/invitacion/:tokeninvitacion', function ( req, res ) {
    res.cookie( 'intermed_invitacion', {
      token: req.params.tokeninvitacion
    }, {
      expires: new Date( Date.now() + ( 900000 * 4 * 24 ) )
    } );
    res.redirect( '/' );
  } );

  // cita, agenda y calificación de médicos
  app.get( '/servicios', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'agenda', 'obtieneServicios', object, req, res );
  } );

  app.get( '/serviciosLista', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'agenda', 'obtieneServiciosLista', object, req, res );
  } );

  // Obtiene el detalle de un servicio
  app.get('/servicio/:id', function(req, res) {
      intermed.callController('agenda','obtieneServicio', {id: req.params.id}, req, res);
  });


  app.get( '/agregaServicio', function ( req, res ) {
    var object = {
      concepto: 'concepto servicio',
      descripcion: 'descripcion servicio',
      precio: 200.50,
      duracion: '1:30',
      usuario_id: 1,
    }
    intermed.callController( 'agenda', 'agregaServicio', object, req, res );
  } );

  app.get( '/modificaServicio', function ( req, res ) {
    var object = {
      concepto: 'concepto servicio',
      descripcion: 'descripcion servicio',
      precio: 100.50,
      duracion: '1:30',
      usuario_id: 1,
      id: 2
    }
    intermed.callController( 'agenda', 'modificaServicio', object, req, res );
  } );

  app.get( '/borraServicio', function ( req, res ) {
    var object = {
      id: 3
    }
    intermed.callController( 'agenda', 'borraServicio', object, req, res );
  } );

  //Muestra la pantalla para generar una cita
  app.get('/generarCita', function(req, res) {
    var datos =  { id : 1}
    rutas.routeLife('main','main',hps);
    intermed.callController('agenda','generarCita', datos, req, res);
  });

  // Inserta la cita
  app.post('/agregaCita', function(req, res) {
    intermed.callController('agenda','agregaCita', req.body, req, res);
  });

  app.get( '/modificaCita', function ( req, res ) {
    var object = {
      fechaHoraInicio: '01/01/2014 17:30',
      estatus: 1,
      nota: 'descripcion nota',
      resumen: 'resumen actualizacion',
      direccion_id: 1,
      servicio_id: 2,
      id: 2
    }
    intermed.callController( 'agenda', 'modificaCita', object, req, res );
  } );

  app.get( '/cancelaCita', function ( req, res ) {
    var object = {
      nota: 'descripcion cancelación cita',
      id: 2
    }
    intermed.callController( 'agenda', 'cancelaCita', object, req, res );
  } );

  app.post( '/cancelaCita', function ( req, res ) {
    //console.log(req.body)
    intermed.callController( 'agenda', 'cancelaCita', req.body, req, res );
  });

  app.get( '/borraCita', function ( req, res ) {
    var object = {
      id: 2
    }
    intermed.callController( 'agenda', 'borraCita', object, req, res );
  } );

  app.get( '/seleccionaCita', function ( req, res ) {
    var object = {
      id: 3
    }
    intermed.callController( 'agenda', 'seleccionaCita', object, req, res );
  } );

  app.get( '/seleccionaCitas', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'agenda', 'seleccionaCitas', object, req, res );
  } );

  app.get( '/seleccionaAgenda', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'agenda', 'seleccionaAgenda', object, req, res );
  } );

  app.get( '/calificaCita', function ( req, res ) {
    var object = {
      higieneLugar: 5,
      puntualidad: 5,
      instalaciones: 5,
      tratoPersonal: 5,
      satisfaccionGeneral: 3,
      comentarios: 'comentarios cita',
      agenda_id: 3,
      medico_id: 1,
      paciente_id: 1
    }
    intermed.callController( 'agenda', 'calificaCita', object, req, res );
  } );

  app.get( '/seleccionaCalificacionCita', function ( req, res ) {
    var object = {
      id: 2
    }
    intermed.callController( 'agenda', 'seleccionaCalificacionCita', object, req, res );
  } );

  app.get( '/calificaMedico', function ( req, res ) {
    var object = {
      efectividad: 5,
      tratoPersonal: 5,
      presentacion: 5,
      higiene: 5,
      medico_id: 1,
      usuario_id: 1
    }
    intermed.callController( 'agenda', 'calificaMedico', object, req, res );
  } );

  app.get( '/seleccionaCalificacionMedico', function ( req, res ) {
    var object = {
      id: 1
    }
    intermed.callController( 'agenda', 'seleccionaCalificacionMedico', object, req, res );
  } );

  //actualiza la informacion del paciente de los biometricos
  app.post( "/despachador", function ( req, res ) {
    intermed.callController( 'usuarios', 'despachador', req.body, req, res );
  } );
  //eventos click para insertar nueva informacion en biometricos
  app.post('/contactoEmergengia', function( req, res ){
    intermed.callController('usuarios','contactoEmergencia',req,res);
  });
  app.post('/biometricFull',function( req, res ){
    intermed.callController('usuarios','biometricFull',req, res);
  });
  app.post('/insertarLT', function( req, res ){
    intermed.callController('usuarios','insertarLT',req, res);
  });
  //<--------------- AUTOCOMPLETADOR ----------------------->
  app.post('/autocompletar',function( req, res ){
    intermed.callController( 'usuarios', 'autocompletar',req, res);
  });
  app.post('/autocompletarA',function( req, res ){
    intermed.callController( 'usuarios', 'autocompletarA',req, res);
  });
  //se insertan los valores cuando se selecccionan con el autocompletador
  app.post('/insertarPad',function( req, res ){
    intermed.callController('usuarios','insertarPad', req, res);
  });
  app.post('/insertAler',function(req, res){
    intermed.callController('usuarios','insertAler',req,res);
  });
  //<--------------- FIN AUTOCOMPLETADOR ------------------->



  app.post( '/aceptarInvitacion', function ( req, res ) {
    intermed.callController( 'contactos', 'aceptarInvitacion', req.body, req, res );
  } );

  app.get( '/testnotificaciones', function ( req, res ) {
    intermed.callController( 'notificaciones', 'prueba', req.body, req, res );
  } );

  app.post( '/notificaciones', function ( req, res ) {
    if ( req.session.passport.user ) {
      intermed.callController( 'notificaciones', 'obtenerTodas', req.body, req, res );
    }
    else {
      res.send( {
        result: 'null'
      } );
    }
  } );
  // recomendaciones url
  app.post('/contactosRecomendados',function(req, res){
    intermed.callController('contactos','contactosRecomendados',req,res);
  });
  app.post('/medicosContacto', function(req, res){
    intermed.callController('contactos','medicosContacto',req,res);
  });
  app.post('/enviaCorreoRecomendados', function( req, res ){
    intermed.callController('contactos','enviaCorreoRecomendados',req,res);
  });
  app.post('/medicoRecomendado', function( req, res ){
    intermed.callController('contactos','medicoRecomendado',req,res);
  });
  app.post('/pacienteIDOculto', function(req, res){
    intermed.callController('contactos','pacienteIDOculto', req, res);
  });
  app.post('/usuarioPrincipal', function( req, res ){
    intermed.callController('contactos','usuarioPrincipal',req, res);
  });
  app.post('/doctorRecomendado', function( req, res ){
    intermed.callController('contactos','doctorRecomendado',req, res);
  });
  // fin recomendaciones url
  app.post( '/buscadorInterno', function (req, res){
    intermed.callController( 'buscadorInterno', 'buscar', req.body, req, res );
  });
  app.post( '/buscadorContactos', function (req, res){
    intermed.callController( 'buscadorInterno', 'buscadorContactos', req.body, req, res );
  });

  app.get('/notificaciones', function (req, res){
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      rutas.routeLife( 'plataforma', 'plataforma', hps );
      intermed.callController('notificaciones','index', req.body, req, res);
    }
  });

  app.post('/notificaciones/cargar', function (req, res){
    intermed.callController('notificaciones','cargarNotificaciones', req.body, req, res);
  });

  app.post('/notificaciones/scroll', function (req, res){
    intermed.callController('notificaciones','scroll', req.body, req, res);
  });

  app.get('/inbox', function (req, res){
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      rutas.routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController('inbox','index', req.body, req, res);
    }
  });

  app.get( '/inbox/:usuario_id', function ( req, res, next ) {
    if (!req.session.passport.user){
      res.redirect( '/' );
    }else {
      rutas.routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController('inbox','index', req.body, req, res);
    }
  });

  app.post('/inbox/enviar', function (req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','enviar', req.body, req, res);
      }
  });

  app.post('/inbox/cargartodos', function (req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargartodos', req.body, req, res);
      }
  });

  app.post('/inbox/cargarMensajesPorUsuario', function (req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargarMensajesPorUsuario', req.body, req, res);
      }
  });

  app.post('/inbox/cargarMensajesPorUsuarioAnteriores', function(req, res){
      if (!req.session.passport.user){
        res.send({'success':false,'error':1});
      }else {
        intermed.callController('inbox','cargarMensajesPorUsuarioAnteriores', req.body, req, res);
      }
  });

    app.get('/registrarubicacion', function (req, res) {
        //if (req.session.passport.user) {
        intermed.callController('ubicacion', 'nuevaUbicacion', req.body, req, res);
        //}
        //else {
        //    res.send({
        //        result: 'null'
        //    });
        //}
    });

    app.post('/registrarubicacion', function (req, res) {
        //if (req.session.passport.user) {
        intermed.callController('ubicacion', 'registrarUbicacion', req.body, req, res);
        //}
        //else {
        //    res.send({
        //        result: 'null'
        //    });
        //}
    });

    app.get('/registrarhorarios', function (req, res) {
        //if (req.session.passport.user) {
        intermed.callController('ubicacion', 'horarios', req.body, req, res);
        //}
        //else {
        //    res.send({
        //        result: 'null'
        //    });
        //}
    });

    app.post('/registrarhorarios', function (req, res) {
        //if (req.session.passport.user) {
        intermed.callController('ubicacion', 'registrarHorarios', req.body, req, res);
        //}
        //else {
        //    res.send({
        //        result: 'null'
        //    });
        //}
    });

    app.post('/horariosObtener', function (req, res){
      intermed.callController('ubicacion', 'horariosObtener', req.body, req, res);
    });

    app.get('/ubicacionobtener', function (req, res) {
        //if (req.session.passport.user) {
        intermed.callController('ubicacion', 'ubicacionObtener', req.body, req, res);
        //}
        //else {
        //    res.send({
        //        result: 'null'
        //    });
        //}
    });

    //Obtiene Horarios por direccion
    app.get('/seleccionaHorarios/:id', function(req, res) {
      intermed.callController('agenda','seleccionaHorarios', {id: req.params.id}, req, res);
    });

    //Obtiene Horarios por direccion
    app.get('/seleccionaHorarios/:id/:paciente', function(req, res) {
      intermed.callController('agenda','seleccionaHorarios', {id: req.params.id, paciente_id: req.params.paciente}, req, res);
    });

    //Obtiene Horarios por usuario
    app.get('/seleccionaHorariosMedico/:id', function(req, res) {
      intermed.callController('agenda','seleccionaHorariosMedico', {id: req.params.id}, req, res);
    });

    app.get('/registraServicio', function(req, res) {
      rutas.routeLife('main','main',hps);
      intermed.callController('agenda','registraServicio', JSON.parse( JSON.stringify(req.body)), req, res);
    });

    app.post('/agregaServicio', function(req, res) {
      rutas.routeLife('main','main',hps);
      intermed.callController('agenda','agregaServicio', JSON.parse( JSON.stringify(req.body)), req, res);
    });

    app.get('/todos', function( req, res ){
        rutas.routeLife('interno','interno', hps);
        intermed.callController('medicos', 'seleccionaRegistrados', null, req, res);
    });

    app.get('/edicionMedico/:id', function(req,res){
        rutas.routeLife('interno','interno',hps);
        intermed.callController('medicos', 'seleccionaMedico', {id:req.params.id}, req, res);
    });

    app.post('/actualizaMedico', function(req,res){
        var object = JSON.parse( JSON.stringify(req.body));
        rutas.routeLife('interno','interno',hps);
        intermed.callController('medicos', 'actualizar', object, req, res);
    });

    app.get('/notificaciones/configuracion', function (req, res){
      if (!req.session.passport.user){
        res.redirect( '/' );
      }else {
        rutas.routeLife( 'plataforma', 'plataforma', hps );
        intermed.callController('notificaciones','configuracion', req.body, req, res);
      }
    });

    app.post('/notificaciones/configurarNotificacion', function(req, res){
        if (!req.session.passport.user){
          res.send({'success':false,'error':1});
        }else {
          intermed.callController('notificaciones','configurarNotificacion', req.body, req, res);
        }
    });
  // <---------------- OSCAR ESPECIALIDADES ---------------------->
    app.post('/especialidadesMedico',function(req, res){
      intermed.callController('contactos','especialidadesMedico',req,res);
    });
    app.post('/medicoDatos', function(req, res){
      intermed.callController('contactos','medicoDatos',req,res);
    });
  // <---------------- FIN OSCAR ESPECIALIDADES ------------------>
  // <---------------- PEDIR RECOMENDACION MEDICO ---------------->
    app.post('/pedirRecomendacionMedico', function( req, res){
      intermed.callController('contactos','pedirRecomendacionMedico',req, res);
    });
    app.post('/traerDatos', function( req, res ){
      intermed.callController('contactos','traerDatos', req, res);
    });
    app.post('/especial',function( req, res ){
      intermed.callController('contactos','especial',req, res);
    });
    app.post('/cargarContactosMedico', function( req, res ){
      intermed.callController('contactos','cargarContactosMedico', req, res);
    });
    app.post('/enviarMedAPacientes',function( req, res ){
      intermed.callController('contactos','enviarMedAPacientes',req, res);
    });
    app.post('/consultaMedInfo', function( req, res ){
      intermed.callController('contactos','consultaMedInfo', req, res);
    });
  // <---------------- FIN RECOMENDACION MEDICO ------------------>
  // <---------------- TRAE INFO A HOME ET ----------------------->
    app.post('/homeEspecialidades', function( req, res ){
      intermed.callController('Home','homeEspecialidades', req, res);
    });
    app.post('/homePadecimientos', function( req, res ){
      intermed.callController('Home','homePadecimientos', req, res);
    });
    app.post('/homeEstados', function( req, res ){
      intermed.callController('Home','homeEstados', req, res );
    });
    app.post('/homeCiudad', function( req, res ){
      intermed.callController('Home','homeCiudad',req, res);
    });
  // <---------------- FIN TRAE INFO HOME ET --------------------->
    app.post('/usuarios/informacionUsuario',function (req, res){
      intermed.callController('usuarios','informacionUsuario',req.body,req, res);
    });

    app.post('/obtenerEstados',function( req, res){
      intermed.callController( 'ubicacion', 'obtieneEstados', req.body, req, res );
    })

    app.post('/ubicaciones/traer',function (req, res){
      intermed.callController( 'ubicacion', 'obtieneUbicacion', req.body, req, res );
    });

    app.post('/telefonos/traer',function (req, res){
      intermed.callController( 'ubicacion', 'obtieneTelefonos', req.body, req, res );
    });

    app.post('/ubicaciones/eliminar', function (req, res){
      intermed.callController( 'ubicacion', 'eliminaUbicacion', req.body, req, res );
    });

    app.post('/medicos/expertoActualizar',function (req, res){
      intermed.callController( 'medicos', 'medicoExpertoActualizar', req.body, req, res );
    });

    app.post('/medicos/expertoTraer', function (req, res){
      intermed.callController( 'medicos', 'medicoExpertoTraer', req.body, req, res );
    });

    // catalogo de servicios
    app.post('/addServices', function( req, res ){
      intermed.callController('catServicios', 'addServices', req, res);
    });
    app.post('/searchServices', function( req, res){
      intermed.callController('catServicios','searchServices',req, res);
    });
    app.post('/deleteServicio',function( req, res ){
      intermed.callController('catServicios','deleteServicio',req, res);
    });
    app.post('/updateServices', function( req, res ){
      intermed.callController('catServicios','updateServices',req, res);
    });
    app.post('/loadDatosGenerales', function(req, res){
      intermed.callController('contactos','loadDatosGenerales',req,res);
    });
    app.post('/loadBiometricos', function( req, res ){
      intermed.callController('contactos', 'loadBiometricos', req, res);
    });
    app.post('/loadTelefonos', function( req, res ){
      intermed.callController('contactos', 'loadTelefonos', req, res );
    });
    app.post('/updateName', function( req, res ){
      intermed.callController('contactos','updateName', req, res);
    });
    app.post('/updateApellidoP', function( req, res ){
      intermed.callController('contactos','updateApellidoP', req, res);
    });
    app.post('/updateApellidoM', function( req, res ){
      intermed.callController('contactos','updateApellidoM', req, res);
    });
    app.post('/addBio', function( req, res ){
      intermed.callController('contactos','addBio', req, res);
    });
    app.post('/deleteBio',function( req, res ){
      intermed.callController('contactos','deleteBio', req, res);
    });
    app.post('/postPaciente',function( req, res ){
      intermed.callController('contactos','postPaciente',req, res);
    });
    app.post('/addTelefon',function(req, res){
      intermed.callController('contactos','addTelefon',req, res);
    });
    app.post('/deleteFon',function( req, res ){
      intermed.callController('contactos','deleteFon',req, res);
    });

    app.post('/medicos/aseguradorasTraer', function (req, res){
      intermed.callController( 'medicos', 'medicoAseguradorasTraer', req.body, req, res );
    });

    app.post('/medicos/clinicasTraer', function (req, res){
      intermed.callController( 'medicos', 'medicoClinicasTraer', req.body, req, res );
    });

    app.post('/medicos/clinicasActualizar',function (req, res){
      intermed.callController( 'medicos', 'medicoClinicasActualizar', req.body, req, res );
    });

    app.post('/medicos/aseguradorasActualizar',function (req, res){
      intermed.callController( 'medicos', 'medicoAseguradorasActualizar', req.body, req, res );
    });

    app.post('/paciente/cargarUbicacion',function (req, res){
      intermed.callController('pacientes','cargarUbicacion',req.body,req, res);
    });

    app.post('/registrarubicacionPaciente',function(req,res){
      intermed.callController('ubicacion','registrarubicacionPaciente',req.body,req, res);
    });

    app.post( '/cargarListaEspCol', function ( req, res ) {
      intermed.callController( 'contactos', 'cargarListaEspCol', {
        usuario: req.body.usuario
      }, req, res );
    } );

    app.post('/cargarListaColegasByEsp', function (req, res){
      intermed.callController( 'contactos', 'cargarListaColegasByEsp', req.body, req, res );
    });

    app.post('/cargarListaAlfCol', function (req, res){
      intermed.callController( 'contactos', 'cargarListaAlfCol', {
        usuario: req.body.usuario
      }, req, res );
    });

    app.post('/cargarListaAlfAmi', function (req, res){
      intermed.callController( 'contactos', 'cargarListaAlfAmi', {
        usuario: req.body.usuario
      }, req, res );
    });

    app.post('/cargarListaColegasByAlf', function (req, res){
      intermed.callController( 'contactos', 'cargarListaColegasByAlf', req.body, req, res );
    });

    app.post('/cargarListaAmistadesByAlf', function (req, res){
      intermed.callController( 'contactos', 'cargarListaAmistadesByAlf', req.body, req, res );
    });
    // boton de busqueda en searchMedic
    app.post('/cargaEstados',function(req, res){
      intermed.callController('search','cargaEstados',req, res);
    });
    app.post('/cargarCiudades',function(req, res){
      intermed.callController('search','cargarCiudades',req, res);
    });
    app.post('/cargaEspecialidades', function( req, res ){
      intermed.callController('search','cargaEspecialidades',req,res);
    });
    app.post('/cargaPadecimiento', function( req, res ){
      intermed.callController('search','cargaPadecimiento', req, res );
    });
    app.post('/findData', function( req, res ){
      intermed.callController('search','findData',req,res);
    });
    //fin

    app.get( '/buscador', function (req, res){
      req.body.get = true;
      req.body.busqueda = req.query['search'].split(" ");
      if (req.query['searchPac']){
        req.body.pacientes = 1;
      }
      rutas.routeLife( 'plataforma2', 'plataforma', hps );
      intermed.callController( 'buscadorInterno', 'buscar', req.body, req, res );
    });
    //<-------------- EDICION DE MEDICO PERFIL ---------------->
    app.post('/loadGenerales', function( req, res ){
      intermed.callController('medicos','loadGenerales', req, res );
    });
    app.post('/loadEspecialidades', function( req, res ){
      intermed.callController('medicos','loadEspecialidades', req, res );
    });
    app.post('/loadPadecimientos', function( req, res ){
      intermed.callController('medicos','loadPadecimientos', req, res );
    });
    app.post('/loadPalabras', function( req, res ){
      intermed.callController('medicos','loadPalabras', req, res );
    });
    app.post('/mEditMedic', function( req, res ){
      intermed.callController('medicos','mEditMedic', req, res );
    });
    app.post('/todasEspecialidades', function( req, res ){
      intermed.callController('medicos','todasEspecialidades', req, res);
    });
    app.post('/sacaMedicoId', function( req, res ){
      intermed.callController('medicos','sacaMedicoId',req,res);
    });
    app.post('/editEspecialidades', function( req, res ){
      intermed.callController('medicos','editEspecialidades', req, res);
    });
    app.post('/deleteEsp', function( req, res ){
      intermed.callController('medicos','deleteEsp', req, res );
    });
    app.post('/traePadecimientos', function( req, res ){
      intermed.callController('medicos', 'traePadecimientos',req, res);
    });
    app.post('/editPadecimientos', function( req, res ){
      intermed.callController('medicos','editPadecimientos', req, res);
    });
    app.post('/traerPalabras', function( req, res) {
      intermed.callController('medicos','traerPalabras', req, res);
    });
    app.post('/editPalabrasClave', function( req, res){
      intermed.callController('medicos','editPalabrasClave', req, res);
    });
    app.post('/deletePad', function( req, res ){
      intermed.callController('medicos','deletePad',req, res);
    });
    app.post('/deletePalabra', function( req, res ){
      intermed.callController('medicos','deletePalabra',req, res);
    });
    //<---------- FECHA LUNEs 14-15-2015 -------------->
    app.post('/deleteSubEsp', function( req, res ){
      intermed.callController('medicos','deleteSubEsp', req, res );
    });
    //<---------- FIN FECHA LUNES --------------------->
    //<-------------- FIN EDICION MEDICO PERFIL --------------->

    app.get('/agendaMedicoVer', function(req,res){
        //rutas.routeLife('main','main',hps);
        if (req.session.passport && req.session.passport.user){
          intermed.callController('agenda', 'seleccionaAgendaMedico', {id: req.session.passport.user.id}, req, res);
        } else {
          res.status(200).json({success:false,error:1});
        }
    });

    app.get('/agendaPacienteVer', function(req,res){
        //rutas.routeLife('main','main',hps);
        if (req.session.passport && req.session.passport.user){
          intermed.callController('agenda', 'seleccionaAgendaPaciente', {id: req.session.passport.user.id}, req, res);
        } else {
          res.status(200).json({success:false,error:1});
        }
    });

    app.get('/muestraAgendaMedico', function(req,res){
        var datos =  { id : 1}
        rutas.routeLife('main','main',hps);
        intermed.callController('agenda','muestraAgendaMedico', datos, req, res);
    });

    app.post( '/cancelaCitaMedico', function ( req, res ) {
      intermed.callController( 'agenda', 'cancelaCitaMedico', req.body, req, res );
    });

    app.post('/cargarEspecialidades', function (req, res){
      intermed.callController('search','cargarEspecialidades',{},req, res);
    });

    app.post('/cargarPadecimientos', function(req, res){
      intermed.callController('search','cargarPadecimientos',{},req, res);
    });

    app.post('/cargarInstituciones', function( req, res){
      intermed.callController('search','cargarInstituciones',{},req, res);
    });

    app.post('/cargarAseguradoras', function( req, res){
      intermed.callController('search','cargarAseguradoras',{},req, res);
    });

    app.post('/traerServiciosPorMedico', function(req, res){
      intermed.callController('catServicios','traerServiciosPorMedico',req.body, req, res);
    });

    app.post('/traerUbicacionesPorServicio', function(req,res){
      intermed.callController('catServicios','traerUbicacionesPorServicio', req.body, req, res);
    });

    app.post('/traerDetallesServicioUbicacion', function (req, res){
      intermed.callController('catServicios','traerDetallesServicioUbicacion',req.body, req, res);
    });

    app.post('/seleccionaHorarios', function(req, res) {
      intermed.callController('agenda','seleccionaHorarios', req.body, req, res);
    });

    app.post('/agenda/detallesCancelacion/paciente', function (req, res){
      intermed.callController('agenda','detallesCancelacionPaciente', req.body, req, res);
    });

    app.post('/agenda/detallesCancelacion/medico', function (req, res){
      intermed.callController('agenda','detallesCancelacionMedico', req.body, req, res);
    });

    app.post('/agenda/detalleCita', function (req, res){
      intermed.callController('agenda','detalleCita', req.body, req, res);
    });

    app.post('/cita/calificar', function (req, res){
      intermed.callController('agenda','calificarCita', req.body, req, res);
    });

    //rutas Para Cargos
    app.get('/ProcesarCargosClientes', function (req, res) {
        intermed.callController('CargosUsuarios', 'FormularioCobro', req, res);
    });

    app.post('/ProcesarCargosClientes', function (req, res) {
        intermed.callController('CargosUsuarios', 'ProcesarCargosClientes', req.body, req, res);
    });

    app.get('/registrarusuariotarjeta', function (req, res) {
        intermed.callController('CargosUsuarios', 'RegistrarUsuarioEnProveedorDatos', req.body, req, res);
    });

    app.post('/registrarusuariotarjeta', function (req, res) {
        intermed.callController('CargosUsuarios', 'RegistrarUsuarioEnProveedor', req.body, req, res);
    });

    //Registrar plan de cargo
    app.get('/registrarplancargo', function (req, res) {
        intermed.callController('CargosUsuarios', 'PlanCargoDatosRegistro', req.body, req, res);
    });

    app.post('/registrarplancargo', function (req, res) {
        intermed.callController('CargosUsuarios', 'PlanCargoRegistrar', req.body, req, res);
    });

    app.post('/eliminarplancargo', function (req, res) {
        intermed.callController('CargosUsuarios', 'PlanCargoEliminar', req.body, req, res);
    });

    app.post('/notificacionesproveedor', function (req, res) {
        intermed.callController('CargosProcesos', 'RecibirNotificacion', req.body, req, res);
    });
    //fin rutas cargos

}

var manejarPerfiles = function(){
  /*RUTA PERFIL (DEJAR SIEMPRE AL FINAL)*/
  /*Dejando al final se evita que cada que se entre al router se haga una consulta para ver si se trata de un usuario*/
  app.get( '/:usuario', function ( req, res, next) {
    var usuario = '';
    if ( req.params.usuario ) usuario = req.params.usuario;
    if (usuario != ""){
      models.Usuario.findOne({
        where: models.Sequelize.or(
          {
            usuarioUrl: usuario
          },
          {
            urlPersonal: usuario
          }
        )
      }).then(function(us){
        app.use( '/'+usuario, express.static( __dirname + '/../public' ) );
        if (us){
          rutas.routeLife( 'plataforma2', 'plataforma', hps );
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

  app.post('/agregaCargoRechazado', function (req, res) {
      intermed.callController('CargosUsuarios', 'CargoRechazadoAgregar', req.body, req, res);
  });

  app.post('/CargoRechazadoSelecciona', function (req, res) {
      intermed.callController('CargosUsuarios', 'CargoRechazadoSelecciona', req.body, req, res);
  });

  app.post('/EstatusCargoRechazadoSelecciona', function (req, res) {
      intermed.callController('CargosUsuarios', 'EstatusCargoRechazadoSelecciona', req.body, req, res);
  });
  // encriptionssss
    app.post('/isLogin', function( req, res ){
      intermed.callController('encryption','isLogin',req.body,req, res);
    });
  // end encriptionss
  // inserta contraseña
    app.post('/insertPassword', function( req, res ){
      intermed.callController( 'encryption', 'insertPassword', req.body,req, res );
    });
  // remover el enlace para crear cuenta
    app.post('/deleteLinkCrear', function( req, res ){
      intermed.callController( 'encryption', 'deleteLinkCrear',req, res);
    });
  // cambiar el password
    app.post('/changeValidPass', function( req, res ){
      intermed.callController( 'encryption', 'changeValidPass', req.body, req, res );
    });
    //trae mail
    app.post('/getMailSend', function( req, res ){
      intermed.callController( 'encryption', 'getMailSend', req, res );
    });
    //mail send
    app.post('/sendMailto', function( req, res ){
      intermed.callController( 'encryption', 'sendMailto', req.body, req, res );
    });
  // fin inserta contraseña
  // get para el cambio del password
  app.get( '/cambiar/:token', function ( req, res ) {
    var tok = req.params.token;
    rutas.routeLife( 'plataforma2', 'interno', hps );
    intermed.callController( 'encryption', 'cambiar', {token: tok}, req, res );
  });
  //Vista de historiales
  app.get('/historiales', function( req, res ){
    rutas.routeLife( 'plataforma2', 'plataforma/medico', hps );
    intermed.callController('encryption','historiales', req, res );
  });
  app.post('/htmlToXml',function( req, res ){
    intermed.callController( 'encryption', 'htmlToXml', req.body, req, res );
  });
}

var error404 = function(){
  app.get('*', function(req, res){
    rutas.routeLife( 'plataforma2', '', hps );
    res.render('pagina404');
  });
  app.post('*',function(req,res){
    res.status(404).send('Página no encontrada');
  });
}

var io = serv.server( app, 3000 );

socket.io( io, bundle, ioPassport );

//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
exports.manejarPerfiles = manejarPerfiles;
exports.error404 = error404;
