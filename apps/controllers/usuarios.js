var models = require('../models');
var http = require('http'),
    fs = require('fs');
var cryptomaniacs = require('./encryption');
var mail = require('./emailSender');
var correoUser = '';
exports.ajax = function(object, req, res) {
    models.DatosGenerales.findAll()
        .then(function(datos) {
            res.send(datos);
        });
};

exports.obtieneUsuariosCompletos = function(object, req, res) {
    models.Usuario.findAll({
            include: [{
                model: models.DatosGenerales
            }, {
                model: models.Medico
            }]
        })
        .then(function(datos) {
            res.send(datos);
        });
};

exports.ObtieneDatosGenerales = function(object, req, res) {
    models.DatosGenerales.findAll()
        .then(function(datos) {
            res.send(datos);
        });
};

exports.index = function(object, req, res) {
    res.render('usuarios/index', {
        title: 'Usuarios'
    });
};

exports.mostrar = function(object, req, res) {
    models.Usuario.findAll()
        .then(function(datos) {
            res.render('usuarios/mostrar', {
                title: 'Usuarios',
                datos: datos
            });
        });
};

exports.iniciarSesion = function(object, req, res) {
    req.session.passport = {};
    models.Usuario.findOne({
        where: {
            correo: object['email'],
            password: object['password']
        }
    }).then(function(usuario) {
        if (usuario) {
            generarSesion(req, res, usuario.id)
        } else {
            res.redirect('/');
        }
    });
};

// Método que registra pacientes (facebook)
exports.registrarUsuario = function(object, req, res) {
    req.session.passport = {};
    var usuario_id = '';
    object['birthday'] = object.birthdayYear + '-' + object.birthdayMonth + '-' + object.birthdayDay;
    // Inicia transacción de registro de usuarios
    models.sequelize.transaction({
            isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, function(t) {

            if (object['tipoRegistro'] === 'F') {

                return models.Usuario.findAll({
                        where: {
                            fbId: object['id']
                        }
                    })
                    .then(function(usuarios) {
                        usuario = usuarios[0];
                        if (!usuario) {
                            //Usuario nuevo
                            models.Usuario.create({
                                    usuario: object['email'],
                                    correo: object['email'],
                                    tipoUsuario: object['tipoUsuario'],
                                    tipoRegistro: object['tipoRegistro'],
                                    fbId: object['id'],
                                    estatusActivacion: 1,
                                    urlFotoPerfil: object.picture.data.url
                                })
                                .then(function(usuario) {
                                    usuario_id = usuario.id;
                                    models.DatosGenerales.create({
                                            nombre: object['first_name'],
                                            apellidoP: object['last_name'],
                                            apellidoM: '',
                                            rfc: '',
                                            usuario_id: usuario_id,
                                            genero: object['gender']
                                        })
                                        .then(function(result) {
                                            if (object['tipoUsuario'] === 'P') {
                                                crearPaciente(req, res, object, usuario_id);
                                            } else if (object['tipoUsuario'] === 'M') {
                                                crearMedico(req, res, object, usuario_id);
                                            }
                                        });
                                });
                        } else {
                            usuario_id = usuario.id;
                            generarSesion(req, res, usuario_id);
                        }
                    });
            } else { //Registro por correo
                console.log('-->Registro por correo');
                return models.Usuario.findAll({
                        where: {
                            correo: object['email']
                        }
                    })
                    .then(function(usuarios) {
                        usuario = usuarios[0];
                        if (!usuario) {
                            if (object['tipoUsuario'] === 'M') {
                                console.log('-->Registrando médico');
                                models.Usuario.create({
                                    correo: object['email'],
                                    password: object['password'],
                                    tipoUsuario: object['tipoUsuario'],
                                    tipoRegistro: object['tipoRegistro'],
                                    estatusActivacion: 0,
                                    token: ''
                                }).then(function(usuario) {
                                    models.DatosGenerales.create({
                                        nombre: 'Fulano',
                                        apellidoP: 'De Tal',
                                        usuario_id: usuario.id
                                    }).then(function(result) {
                                        generarSesion(req, res, usuario.id);
                                    });
                                });
                            } else {
                                models.Usuario.create({
                                        usuario: object['email'],
                                        correo: object['email'],
                                        password: object['password'],
                                        tipoUsuario: object['tipoUsuario'],
                                        tipoRegistro: object['tipoRegistro'],
                                        estatusActivacion: 0,
                                        token: ''
                                    })
                                    .then(function(usuario) {
                                        var tokens = String(cryptomaniacs.doEncriptToken(usuario.id, object['tiempoStamp']));
                                        console.log("Token vato loco " + tokens);
                                        usuario.update({
                                                token: tokens
                                            })
                                            .then(function(usuario) {
                                                var datos = {
                                                    to: usuario.correo,
                                                    subject: 'Activa tu cuenta',
                                                    name: usuario.nombre,
                                                    correo: usuario.correo,
                                                    token: usuario.token
                                                };
                                                correoUser = usuario.correo;
                                                mail.mailer(datos, 'confirmar'); //se envia el correo
                                                usuario_id = usuario.id;
                                                models.DatosGenerales.create({
                                                        nombre: object['first_name'],
                                                        apellidoP: object['last_name'],
                                                        apellidoM: '',
                                                        rfc: '',
                                                        usuario_id: usuario_id,
                                                        genero: object['gender']
                                                    })
                                                    .then(function(result) {
                                                        crearPaciente(req, res, object, usuario_id);
                                                    });
                                            });
                                    });
                            }
                        } else {
                            //Usuario ya existente
                            console.log('El usuario con el correo ' + object['email'] + ' ya se encuentra registrado');
                            generarSesion(req, res, usuario_id);
                        }
                    });
            }
        })
        .catch(function(err) {
            console.error('ERROR: ' + err);
            req.session.passport = {};
            res.redirect('/');
        });
};
exports.correoDisponible = function(object, req, res) {
    models.Usuario.findAll({
            where: {
                correo: object['email']
            }
        })
        .then(function(usuario) {
            if (usuario[0]) {
                res.send({
                    'result': false
                });
            } else {
                res.send({
                    'result': true
                });
            }
        });
};

var crearPaciente = function(req, res, object, usuario_id) {
    //Se trata de un paciente
    models.Paciente.create({
            usuario_id: usuario_id
        })
        .then(function(paciente) {
            if (object['birthday'] != 'undefined-undefined-undefined') {
                paciente.update({
                        fechaNac: object['birthday']
                    })
                    .then(function(result) {
                        generarSesion(req, res, usuario_id);
                    });
            } else {
                generarSesion(req, res, usuario_id);
            }
        });
}

var crearMedico = function(req, res, object, usuario_id) {
    //Se trata de un médico
    models.Medico.create({
            cedula: '',
            codigoMedico: '',
            usuario_id: usuario_id
        })
        .then(function(medico) {
            // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
            models.MedicoEspecialidad.create({
                    tipo: '1',
                    titulo: '',
                    lugarEstudio: '',
                    medico_id: medico.id,
                    fecha: Date.now(),
                    especialidad_id: object['especialidadMed'] // Id de la especialidad
                })
                .then(function(result) {
                    generarSesion(req, res, usuario_id);
                });
        });
}

var generarSesion = function(req, res, usuario_id) {
    req.session.passport = {};
    models.Usuario.findOne({
            where: {
                id: usuario_id
            },
            attributes: ['id', 'urlFotoPerfil', 'tipoUsuario', 'tipoRegistro', 'estatusActivacion'],
            include: [{
                model: models.DatosGenerales,
                attributes: ['nombre', 'apellidoP']
            }, {
                model: models.Direccion,
                attributes: ['localidad_id']
            }]
        })
        .then(function(usuario) {
            if (usuario) {
                console.log('Generando variables de sesión...');
                req.session.passport.user = JSON.parse(JSON.stringify({
                    'id': usuario.id,
                    'tipoUsuario': usuario.tipoUsuario,
                    'tipoRegistro': usuario.tipoRegistro,
                    'estatusActivacion': usuario.estatusActivacion
                }));
                if (usuario.DatosGenerale)
					if (usuario.tipoUsuario == 'M') req.session.passport.user.name = 'Dr. ' +usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP;
					else req.session.passport.user.name = usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP;
                if (usuario.urlFotoPerfil) {
                    fs.readFile(usuario.urlFotoPerfil, function(err, data) {
                        if (err) throw err;
                        req.session.passport.user.fotoPerfil = 'data:image/jpeg;base64,' + (data).toString('base64');
                        cargarExtraInfo(usuario, req, res);
                    });
                } else {
                    cargarExtraInfo(usuario, req, res);
                }
            } else {
                res.redirect('/');
            }
        });
};

function cargarExtraInfo(usuario, req, res) {
    var tipoUsuario = '';
    if (usuario.tipoUsuario === 'P') {
        tipoUsuario = 'Paciente';
    } else if (usuario.tipoUsuario === 'M') {
        tipoUsuario = 'Medico';
    }
    if (tipoUsuario) {
        models[tipoUsuario].findOne({
                where: {
                    usuario_id: usuario.id
                },
                attributes: ['id']
            })
            .then(function(extraInfo) {
                if (extraInfo) {
                    req.session.passport.user[tipoUsuario + '_id'] = JSON.parse(JSON.stringify(extraInfo.id));
                }
                if (usuario.Direccions) {
                    var DireccionPrincipal = usuario.Direccions[0];
                    obtenerDatosLocalidad(DireccionPrincipal.localidad_id, req, res);
                } else {
                    res.redirect('/perfil');
                }
            });
    } else {
        if (usuario.tipoUsuario === 'A') {
            res.redirect('/registro');
        }
    }
}

exports.activarCuenta = function(object, req, res) {
    // se hace una consulta a usuario para traer el token condicionando lo del correo
    //consulta
    models.Usuario.findOne({
            where: {
                token: object.token
            }
        })
        .then(function(usuario) {
            if (usuario) {
                if (usuario.estatusActivacion === 0) {
                    usuario.update({
                        estatusActivacion: 1
                    });
                    res.render('activado', {
                        correo: usuario.correo
                    })
                } else {
                    res.render('noactivado', {
                        correo: usuario.correo
                    });
                }
            } else {
                res.status(200)
                    .send('<h1>Usuario no existe</h1>');
            }
        });
}
