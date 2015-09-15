/**
 *	Este archivo es el encargado de hacer las rutas para las diferentes url que se van a estar mandando por get
 *	o por post, según sea el caso, estara trabajando dentro de una funcion donde esta se podrá exportar
 *	para su manejo en cualquier otro archivo js. En la cual se estara llamando al servidor de express.
 *	@author Oscar, Cinthia
 *	@version 0
 *	@date Tuesday, August 4,  2015
 */

var models = require('../apps/models');

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

app.use(session({
    secret: 'intermedSession',
    resave: false,
    saveUninitialized: true
}));

var hps = require('../apps/helpers/helpers');

app.use(bodyParser.json({
    limit: '5mb'
})); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
})); // support encoded bodies
//<----------------------------------------------------------------------------->
/**
 * function para cargar las rutas, como estatitcas los layouts
 *
 * @param plantilla, nombre del layouts
 * @param cuerpos, nombre del archivo que tendra el body de la pantalla
 *	@param hell, nombre del helper que se quiera utilizar
 */
var rutas = {
    routeLife: function(plantilla, carpeta, hell) {
        app.set('view engine', 'hbs');
        app.engine('hbs', exphbs({
            defaultLayout: __dirname + '/../apps/views/layouts/' + plantilla + '.hbs',
            helpers: hell
        }));
        app.set('views', __dirname + '/../apps/views/' + carpeta);
        app.use(express.static(__dirname + '/../public'));
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
var iniciar = function() {
    app.all('*', function(req, res, next) {
        if (req.session.passport.user) hps.varSession(req.session.passport.user);
        else hps.varSession(req.session.passport);
        rutas.routeLife('main', 'main', hps);
        next();
    });

    //LogIn
    app.post('/*', function(req, res, next) {
        if (req.body.loginType === 'admin') intermed.callController('session', 'login', req.body, req, res);
        else next();
    });

    //LogOut
    app.get('/logout', function(req, res, next) {
        intermed.callController('session', 'logout', {}, req, res)
    });
    //Home
    app.get('/', function(req, res) {
        intermed.callController('Home', 'index', req.body, req, res)
    }); //intermed.callController('Home', 'sayHello', '', req, res)});

    // get y post de searchMedic
    app.get('/searchMedic', function(req, res) {
        rutas.routeLife('interno', 'interno', hps);
        intermed.callController('Home', 'vacio', '', req, res);
    });
    app.post('/searchMedic', function(req, res) {
        var busqueda = JSON.parse(JSON.stringify(req.body));
        rutas.routeLife('interno', 'interno', hps);
        intermed.callController('Home', 'searching', busqueda, req, res);
    });
    //Registro
    app.get('/registro', function(req, res) {
        rutas.routeLife('interno', 'interno', hps);
        intermed.callController('registro', 'index', '', req, res);
    });
    app.post('/registro', function(req, res) {
        rutas.routeLife('interno', 'interno', hps);
        if (req.body.getAll === '1') {
            intermed.callController('registro', 'getAll', '', req, res)
        } else {
            /**
             *	Con la creación de la siguiente variable se puede generar un json que es dinamico
             *	atrapando todo tipo de post que se envia.
             *	JSON.stringify recibe el post con req.body y lo convierte un valor dado en javascript a una cadena  JSON
             *	JSON.parse analiza una cadena de texto como un JSON
             */
            var object = JSON.parse(JSON.stringify(req.body));
            intermed.callController('medicos', 'registrar', object, req, res);
        }
    });

	//prueba AboutPaciente
	app.get('/pacientes', function( req, res ){
		rutas.routeLife('main','main',hps);
		intermed.callController('Home', 'aboutPacientes', '', req, res);
	});
	app.get('/perfilMedicos', function( req, res ){
		rutas.routeLife('plataforma','plataforma/medicos',hps);
		intermed.callController('Home', 'perfilMedicos', '', req, res);
	});
	app.get('/perfilPacientes', function( req, res ){
		rutas.routeLife('plataforma','plataforma/pacientes',hps);
		intermed.callController('Home', 'perfilPacientes', '', req, res);
	});

    app.get('/auth/facebook/request/:tipo', function(req, res, next) {
        req.session.tipo = '';
        if (req.params.tipo === "M" || req.params.tipo === "P") req.session.tipo = req.params.tipo;
        next();
    }, passport.authenticate('facebook', {
        scope: ['email', 'user_birthday', 'user_location', 'publish_actions']
    }));

    //Callback con respuesta del inicio de sesion de facebook por passport (trae los datos del usuario)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            failureRedirect: '/'
        }),
        function(req, res) {
            console.log('______TIPO USUARIO: ' + req.session.tipo);
            req.session.passport.user['tipoRegistro'] = 'F';
            req.session.passport.user['tipoUsuario'] = req.session.tipo;
            intermed.callController('usuarios', 'registrarUsuario', req.session.passport.user, req, res);
        });
    //registro pacientes
    app.post('/reg/local', function(req, res) {
        req.body['tipoRegistro'] = 'C';
        if (req.body.tipoUsuario) req.body['tipoUsuario'] = req.body.tipoUsuario;
        else req.body['tipoUsuario'] = 'P';
        intermed.callController('usuarios', 'registrarUsuario', req.body, req, res);
    });
    //activar cuenta
    //<------------------------------------------------------------------------->
    app.get('/activar/:token', function(req, res) {
        var tok = req.params.token;
        rutas.routeLife('mail', 'interno', hps);
        intermed.callController('usuarios', 'activarCuenta', {
            token: tok
        }, req, res);
    });
    //<------------------------------------------------------------------------->
    //Verificar por ajax si una cuenta de correo esta disponible para su registro
    app.post('/correoDisponible', function(req, res) {
        intermed.callController('usuarios', 'correoDisponible', req.body, req, res);
    });
    //Inicio de sesión para usuarios registrados por correo
    app.post('/auth/correo', function(req, res) {
        intermed.callController('usuarios', 'iniciarSesion', req.body, req, res);
    });
    //Login para el usuario tipo admin
    app.post('/loginLocal', passport.authenticate('local', {
        failureRedirect: '/'
    }), function(req, res) {
        res.redirect('/');
    });
    //Obtener el perfil del usuario de la sesión
    app.get('/perfil', function(req, res) {
        if (req.session.passport.user) {
            var tipoUsuario = 'paciente';
            if (req.session.passport.user.tipoUsuario === 'M') tipoUsuario = 'medico';
            rutas.routeLife('plataforma', 'plataforma/' + tipoUsuario, hps);
            intermed.callController('home', 'perfil', req.body, req, res);
        } else {
            res.redirect('/');
        }
    });
    //Modificar la información del usuario de la sesión
    app.post('/perfil', function(req, res) {
        rutas.routeLife('plataforma', 'plataforma/paciente', hps);
        intermed.callController('pacientes', 'modificarPerfil', req.body, req, res);
    });
    //Obtener con ajax la información de la sesión del usuario
    app.post('/obtenerInformacionUsuario', function(req, res) {
        intermed.callController('usuarios', 'obtenerInformacionUsuario', '', req, res);
    });
    //Obtener con ajax las ciudades del estado_id enviado por post
    app.post('/obtenerCiudades', function(req, res) {
        intermed.callController('ubicacion', 'obtieneCiudades', req.body, req, res);
    });
    //Obtener con ajax las localidades del estado_id y ciudad_id enviados por post
    app.post('/obtenerLocalidades', function(req, res) {
        intermed.callController('ubicacion', 'obtieneLocalidades', req.body, req, res);
    });
    //Obtener con ajax el codigo postal de la localidad_id enviada por post
    app.post('/buscarCP', function(req, res) {
        intermed.callController('ubicacion', 'encontrarPorCP', req.body, req, res);
    });
    //::Temporal::, solo para ver la información que tiene el usuario en su variable sesión
    app.get('/informacionusuario', function(req, res) {
        res.send(JSON.stringify(req.session.passport) + '<br/><a href="/">Regresar</a>');
    });

    app.post('/informacionRegistroMedico', function(req, res) {
        intermed.callController('medicos', 'informacionRegistro', '', req, res);
    });

    app.post('/regMedPasoUno', function(req, res) {
        intermed.callController('medicos', 'regMedPasoUno', req.body, req, res);
    });

    app.post('/regMedPasoTres', function(req, res) {
        intermed.callController('medicos', 'regMedPasoTres', req.body, req, res);
    });

    app.post('/actualizarSesion', function(req, res) {
        intermed.callController('usuarios', 'actualizarSesion', req.body, req, res);
    });

    //  Pruebas  padecimientos y tipo especialidad
    app.get('/padecimientos', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.Padecimiento
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/especialidades', function(req, res) {
        models.Especialidad.findAll({
                include: [{
                    model: models.TipoEspecialidad
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/especialidadesm', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.Especialidad,
                    include: [{
                        model: models.TipoEspecialidad
                    }]
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/comentariosMedicos', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.ComentariosMedicos
                }, {
                    model: models.Usuario
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/comentariosUsuario', function(req, res) {
        models.Usuario.findAll({
                include: [{
                    model: models.ComentariosMedicos
                }, {
                    model: models.Medico
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/biometricos', function(req, res) {
        models.Biometrico.findAll({
                include: [{
                    model: models.Usuario,
                    include: [{
                        model: models.Paciente
                    }]
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/direccion', function(req, res) {
        models.Direccion.findAll({
                include: [{
                    model: models.Estado
                }, {
                    model: models.Ciudad
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/estados', function(req, res) {
        models.Estado.findAll({
                include: [{
                    model: models.Ciudad
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/ciudades', function(req, res) {
        models.Ciudad.findAll({
                include: [{
                    model: models.Estado
                }, {
                    model: models.Direccion
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/secretarias', function(req, res) {
        models.Secretaria.findAll({
                include: [{
                    model: models.Usuario
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/aseguradoras', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.Aseguradora
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/calificacionmedico', function(req, res) {
        models.CalificacionMedico.findAll({
                include: [{
                    model: models.Usuario
                }, {
                    model: models.Medico
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/calificacioncita', function(req, res) {
        models.CalificacionCita.findAll({
                include: [{
                    model: models.Agenda
                }, {
                    model: models.Medico
                }, {
                    model: models.Paciente
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/agenda', function(req, res) {
        models.Paciente.findAll({
                include: [{
                    model: models.Agenda,
                    include: [{
                        model: models.Usuario
                    }]
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/servicios', function(req, res) {
        models.Usuario.findAll({
                include: [{
                    model: models.CatalogoServicios
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/facturacion', function(req, res) {
        models.DatosFacturacion.findAll({
                include: [{
                    model: models.Usuario
                }, {
                    model: models.Direccion
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/institucion', function(req, res) {
        models.Institucion.findAll({
                include: [{
                    model: models.Usuario
                }, {
                    model: models.Direccion
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/proveedores', function(req, res) {
        models.Proveedor.findAll({
                include: [{
                    model: models.Usuario,
                    include: [{
                        model: models.Direccion
                    }]
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/hospitales', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.Hospital
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/medicosfav', function(req, res) {
        models.MedicoFavorito.findAll({
                include: [{
                    model: models.Medico
                }, {
                    model: models.Usuario
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/medicosfav2', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.MedicoFavorito
                }, {
                    model: models.Usuario
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/formacion', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.MedicoFormacion
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/colegios', function(req, res) {
        models.Colegio.findAll({
                include: [{
                    model: models.Medico
                }, {
                    model: models.Institucion
                }, ]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/experiencia', function(req, res) {
        models.Medico.findAll({
                include: [{
                    model: models.MedicoExperiencia,
                    include: [{
                        model: models.Ciudad
                    }, {
                        model: models.Estado
                    }, {
                        model: models.Institucion
                    }]
                }]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    app.get('/contactos', function(req, res) {
        models.Contacto.findAll({
                include: [{
                    model: models.Usuario
                }, {
                    model: models.Paciente
                }, ]
            })
            .then(function(datos) {
                res.send(datos);
            });
    });

    // Routers para el perfil de medicos

    app.get('/addMedicoColega', function(req, res) {
        var object = {
            idUsuario: 1,
            idMedico: 1
        }
        intermed.callController('medicos', 'agregaMedicoFavorito', object, req, res);
    });

    app.get('/obtieneMedicosFavoritos', function(req, res) {
        var object = {
            idUsuario: 1
        }
        intermed.callController('medicos', 'obtieneMedicoFavorito', object, req, res);
    });

    app.get('/borraMedicoFavorito', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'borraMedicoFavorito', object, req, res);
    });

    app.get('/obtieneFormacion', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'obtieneFormacion', object, req, res);
    });

    app.get('/agregaFormacion', function(req, res) {
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
        intermed.callController('medicos', 'agregaFormacion', object, req, res);
    });

    app.get('/actualizaFormacion', function(req, res) {
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
        intermed.callController('medicos', 'actualizaFormacion', object, req, res);
    });

    app.get('/borraFormacion', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'borraFormacion', object, req, res);
    });


    app.get('/obtieneExperiencia', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'obtieneExperiencia', object, req, res);
    });

    app.get('/agregaExperiencia', function(req, res) {
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
        intermed.callController('medicos', 'insertaExperiencia', object, req, res);
    });

    app.get('/actualizaExperiencia', function(req, res) {
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
        intermed.callController('medicos', 'actualizaExperiencia', object, req, res);
    });

    app.get('/borraExperiencia', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'borraExperiencia', object, req, res);
    });

    app.get('/obtienePadecimientosMedicos', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('padecimientos', 'obtienePadecimientosMedico', object, req, res);
    });

    app.get('/borraPadecimientosMedicos', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('padecimientos', 'borraPadecimientosMedico', object, req, res);
    });

    app.get('/agregaPadecimientosMedicos', function(req, res) {
        var object = {
            idMedico: 1,
            idPadecimiento: 1
        }
        intermed.callController('padecimientos', 'agregaPadecimientosMedico', object, req, res);
    });

    app.get('/obtieneComentarios', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'obtieneComentarios', object, req, res);
    });

    app.get('/agregaComentario', function(req, res) {
        var object = {
            comentario: 'comentario',
            anonimo: 1,
            idMedico: 1,
            idUsuario: 1
        }
        intermed.callController('medicos', 'agregaComentario', object, req, res);
    });

    app.get('/actualizaComentario', function(req, res) {
        var object = {
            comentario: 'comentario2',
            anonimo: 1,
            idMedico: 1,
            idUsuario: 1,
            id: 1
        }
        intermed.callController('medicos', 'actualizaComentario', object, req, res);
    });

    app.get('/borraComentario', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('medicos', 'borraComentarios', object, req, res);
    });

    app.get('/obtieneHospitalesMedico', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'obtieneHospitalesMedico', object, req, res);
    });

    app.get('/agregaHospitales', function(req, res) {
        var object = {
            nombre: 'nombre',
            idInstitucion: 2,
            idMedico: 1,
        }
        intermed.callController('instituciones', 'insertaHospital', object, req, res);
    });

    app.get('/actualizaHospitales', function(req, res) {
        var object = {
            id: 1,
            nombre: 'nombre3',
            idInstitucion: 2,
            idMedico: 1,
        }
        intermed.callController('instituciones', 'actualizaHospital', object, req, res);
    });

    app.get('/borraHospitales', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'borraHospital', object, req, res);
    });

    app.get('/obtieneColegiosMedico', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'obtieneColegiosMedico', object, req, res);
    });

    app.get('/agregaColegio', function(req, res) {
        var object = {
            nombre: 'nombre',
            fechaInicio: '01/01/2015',
            idInstitucion: 2,
            idMedico: 1,
        }
        intermed.callController('instituciones', 'insertaColegio', object, req, res);
    });

    app.get('/actualizaColegio', function(req, res) {
        var object = {
            nombre: 'nombre3',
            fechaInicio: '01/01/2015',
            idInstitucion: 2,
            idMedico: 1,
            id: 1
        }
        intermed.callController('instituciones', 'actualizaColegio', object, req, res);
    });

    app.get('/borraColegio', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'borraColegio', object, req, res);
    });

    app.get('/obtieneInstitucionesMedico', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'obtieneInstitucionesMedico', object, req, res);
    });

    app.get('/agregaInstitucion', function(req, res) {
        var object = {
            micrositio: 'nombre',
            razonSocial: 'gfdgd',
            idUsuario: 1
        }
        intermed.callController('instituciones', 'insertaInstitucion', object, req, res);
    });

    app.get('/actualizaInstitucion', function(req, res) {
        var object = {
            micrositio: 'nombre',
            razonSocial: 'gfdgd',
            idUsuario: 1,
            id: 1
        }
        intermed.callController('instituciones', 'actualizaInstitucion', object, req, res);
    });

    app.get('/borraInstitucion', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'borraInstitucion', object, req, res);
    });

    app.get('/obtieneAseguradorasMedico', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'obtieneAseguradorasMedico', object, req, res);
    });

    app.get('/agregaAseguradora', function(req, res) {
        var object = {
            nombre: 'nombre',
            idMedico: 1
        }
        intermed.callController('instituciones', 'insertaAseguradora', object, req, res);
    });

    app.get('/actualizaAseguradora', function(req, res) {
        var object = {
            nombre: 'nombre',
            idMedico: 1,
            id: 1
        }
        intermed.callController('instituciones', 'actualizaAseguradora', object, req, res);
    });

    app.get('/borraAseguradora', function(req, res) {
        var object = {
            id: 1
        }
        intermed.callController('instituciones', 'borraAseguradora', object, req, res);
    });

    //Modificar la información del usuario de la sesión
    app.get('/perfil/:usuario', function(req, res) {
        var usuario = req.params.usuario;
        //rutas.routeLife('plataforma', 'plataforma/paciente', hps);
        intermed.callController('usuarios', 'verPerfil', {usuario: usuario}, req, res);
    });
}
serv.server(app, 3000);
//se exporta para que otro js lo pueda utilizar
exports.iniciar = iniciar;
