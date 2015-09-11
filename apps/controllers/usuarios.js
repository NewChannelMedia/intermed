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
    console.log('-->OBJECT: ' + JSON.stringify(object));
    req.session.passport = {};
    models.Usuario.findOne({
        where: {
            correo: object['email'],
            password: object['password']
        }
    }).then(function(usuario) {
        if (usuario) {
            generarSesion(req, res, usuario.id, true);
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

                return models.Usuario.findOne({
                    where: {
                        fbId: object['id']
                    }
                }, {
                    transaction: t
                }).then(function(usuario) {
                    if (!usuario) {
                        return models.Usuario.create({
                                usuario: object['email'],
                                correo: object['email'],
                                tipoUsuario: object['tipoUsuario'],
                                tipoRegistro: object['tipoRegistro'],
                                fbId: object['id']
                            }, {
                                transaction: t
                            })
                            .then(function(usuario) {
                                if (object['email']) {
                                    return usuario.update({
                                        estatusActivacion: 1
                                    }, {
                                        transaction: t
                                    });
                                }
                                if (object.picture) {
                                    guardarImagenDePerfil(object, usuario, req, res);
                                }
                                usuario_id = usuario.id;
                                return models.DatosGenerales.create({
                                        nombre: object['first_name'],
                                        apellidoP: object['last_name'],
                                        apellidoM: '',
                                        rfc: '',
                                        usuario_id: usuario_id,
                                        genero: object['gender']
                                    }, {
                                        transaction: t
                                    })
                                    .then(function(result) {
                                        if (object['tipoUsuario'] === 'P') {
                                            return crearPaciente(req, res, object, usuario_id, t);
                                        } else if (object['tipoUsuario'] === 'M') {
                                            return crearMedico(req, res, object, usuario_id, t);
                                        }
                                    });
                            });
                    } else {
                        usuario_id = usuario.id;
                        generarSesion(req, res, usuario_id, true);
                    }
                });
            } else { //Registro por correo
                return models.Usuario.findOne({
                        where: {
                            correo: object['email']
                        }
                    }, {
                        transaction: t
                    })
                    .then(function(usuario) {
                        if (!usuario) {
                            //Usuario nuevo
                            if (object.tipoUsuario === 'M') {
                                console.log('___Creando médico.')
                                return models.Usuario.create({
                                    correo: object['email'],
                                    password: object['password'],
                                    tipoUsuario: object['tipoUsuario'],
                                    tipoRegistro: object['tipoRegistro'],
                                    estatusActivacion: 0,
                                    token: ''
                                }, {
                                    transaction: t
                                }).then(function(usuario) {
                                    generarSesion(req, res, usuario.id, true);
                                })
                            } else if (object.tipoUsuario === 'P') {
                                console.log('___Creando paciente.')
                                return models.Usuario.create({
                                        correo: object['email'],
                                        password: object['password'],
                                        tipoUsuario: object['tipoUsuario'],
                                        tipoRegistro: object['tipoRegistro'],
                                        estatusActivacion: 0,
                                        token: ''
                                    }, {
                                        transaction: t
                                    })
                                    .then(function(usuario) {
                                        var tokens = String(cryptomaniacs.doEncriptToken(usuario.id, object['tiempoStamp']));
                                        console.log("Token vato loco " + tokens);
                                        return usuario.update({
                                                token: tokens
                                            }, {
                                                transaction: t
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
                                                return models.DatosGenerales.create({
                                                        nombre: object['first_name'],
                                                        apellidoP: object['last_name'],
                                                        apellidoM: '',
                                                        rfc: '',
                                                        usuario_id: usuario_id,
                                                        genero: object['gender']
                                                    }, {
                                                        transaction: t
                                                    })
                                                    .then(function(result) {
                                                        return crearPaciente(req, res, object, usuario_id, t);
                                                    });
                                            });
                                    });
                            }
                        } else {
                            //Usuario ya existente
                            console.log('El usuario con el correo ' + object['email'] + ' ya se encuentra registrado');
                            generarSesion(req, res, usuario_id, true);
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


function guardarImagenDePerfil(object, usuario) {
    options = {
        host: 'fbcdn-profile-a.akamaihd.net',
        port: 80,
        path: object.picture.data.url
    }
    http.get(options, function(resultado) {
        var imagedata = '';
        resultado.setEncoding('binary');

        resultado.on('data', function(chunk) {
            imagedata += chunk
        })

        resultado.on('end', function() {
            if (!fs.existsSync('./garage/profilepics/' + usuario.id)) {
                fs.mkdirSync('./garage/profilepics/' + usuario.id, 0777);
            };
            var path = './garage/profilepics/' + usuario.id + '/' + usuario.id + '_' + getDateTime() + '.png';
            fs.writeFile(path, imagedata, 'binary', function(err) {
                console.log('Guardando: ' + object.picture.data.url);
                if (err) console.error('___Error al guardar imagen de perfil (' + err + ')');
                else {console.log('__Imagen guardada en: ' + path);
                    usuario.update({
                        urlFotoPerfil: path
                    });
                }
            });
        });
    });
}

var crearPaciente = function(req, res, object, usuario_id, t) {
    //Se trata de un paciente
    return models.Paciente.create({
            usuario_id: usuario_id
        }, {
            transaction: t
        })
        .then(function(paciente) {
            if (object['birthday'] != 'undefined-undefined-undefined') {
                return paciente.update({
                        fechaNac: object['birthday']
                    }, {
                        transaction: t
                    })
                    .then(function(result) {
                        console.log('CREAR PACIENTE');
                        setTimeout(function() {
                            generarSesion(req, res, usuario_id, true);
                        }, 1000);
                    });
            } else {
                console.log('CREAR PACIENTE sin fecha');
                setTimeout(function() {
                    generarSesion(req, res, usuario_id, true);
                }, 1000);
            }
        });
}

var crearMedico = function(req, res, object, usuario_id, t) {
    //Se trata de un médico
    return models.Medico.create({
            cedula: '',
            codigoMedico: '',
            usuario_id: usuario_id
        }, {
            transaction: t
        })
        .then(function(medico) {
            // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
            return models.MedicoEspecialidad.create({
                    tipo: '1',
                    titulo: '',
                    lugarEstudio: '',
                    medico_id: medico.id,
                    fecha: Date.now(),
                    especialidad_id: object['especialidadMed'] // Id de la especialidad
                }, {
                    transaction: t
                })
                .then(function(result) {
                    setTimeout(function() {
                        generarSesion(req, res, usuario_id, true);
                    }, 1000);
                });
        });
}

exports.actualizarSesion = function(object, req, res) {
    var usuario_id = '';
    if (req.session.passport.user) {
        usuario_id = req.session.passport.user.id;
    }
    generarSesion(req, res, usuario_id, false);
}

var generarSesion = function(req, res, usuario_id, redirect) {
    if (!redirect) redirect = false;
    req.session.passport = {};
    models.Usuario.findOne({
            where: {
                id: usuario_id
            },
            attributes: ['id', 'urlFotoPerfil', 'tipoUsuario', 'tipoRegistro', 'estatusActivacion','logueado'],
            include: [{
                model: models.DatosGenerales,
                attributes: ['nombre', 'apellidoP', 'apellidoM']
            }, {
                model: models.Biometrico,
                attributes: ['genero']
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
                    'estatusActivacion': usuario.estatusActivacion,
                    'logueado': usuario.logueado
                }));
                usuario.update({logueado:1}).then(function(result){
                    req.session.passport.user.registroCompleto = "1";
                    if (!usuario.DatosGenerale) req.session.passport.user.registroCompleto = "0";
                    if (!usuario.Direccions) req.session.passport.user.registroCompleto = "0";
                    if (!usuario.Biometrico || !usuario.Biometrico.genero) req.session.passport.user.registroCompleto = "0";
                    if (usuario.DatosGenerale) req.session.passport.user.name = usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP + ' ' + usuario.DatosGenerale.apellidoM;
                    else req.session.passport.user.name = 'Fulano De Tal';
                    if (usuario.urlFotoPerfil) {
                        fs.readFile(usuario.urlFotoPerfil, function(err, data) {
                            if (err) console.log('Error al leer la imagen de perfil: ' + err);
                            req.session.passport.user.fotoPerfil = 'data:image/jpeg;base64,' + (data).toString('base64');
                            cargarExtraInfo(usuario, redirect, req, res);
                        });
                    } else {
                        cargarExtraInfo(usuario, redirect, req, res);
                    }
                });
            } else {
                if (redirect) {
                    res.redirect('/');
                } else res.send({
                    'result': 'error',
                    'error': 'El usuario no existe'
                })
            }
        });
};

function cargarExtraInfo(usuario, redirect, req, res) {
    var tipoUsuario = '';
    if (usuario.tipoUsuario === 'P') {
        tipoUsuario = 'Paciente';
    } else if (usuario.tipoUsuario === 'M') {
        req.session.passport.user.name = 'Dr. ' + req.session.passport.user.name;
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
                } else {
                    req.session.passport.user.registroCompleto = "0";
                }
                var DireccionPrincipal = usuario.Direccions[0];
                if (DireccionPrincipal) {
                    obtenerDatosLocalidad(DireccionPrincipal.localidad_id, redirect, req, res);
                } else {
                    req.session.passport.user.registroCompleto = "0";
                    if (redirect) {
                        res.redirect('/perfil');
                    } else res.send({
                        'result': 'success',
                        'session': req.session.passport.user
                    });
                }
            });
    } else {
        if (usuario.tipoUsuario === 'A') {
            res.redirect('/registro');
        }
    }
}

function obtenerDatosLocalidad(localidad_id, redirect, req, res) {
    models.sequelize.query("SELECT `Localidad`.`CP`, `Localidad`.`localidad`, `TipoLocalidad`.`id` AS 'tipo_id', `TipoLocalidad`.`tipo`, `Ciudad`.`id` AS 'ciudad_id', `Ciudad`.`ciudad`, `Municipio`.`id` AS 'municipio_id', `Municipio`.`municipio`, `Estado`.`id` AS 'estado_id', `Estado`.`estado` FROM `localidades` AS `Localidad`INNER JOIN `tipoLocalidad` AS `TipoLocalidad` ON `TipoLocalidad`.`id` = `Localidad`.`tipo_localidad_id` INNER JOIN `ciudades` AS `Ciudad` ON `Localidad`.`ciudad_id` = `Ciudad`.`id` and `Localidad`.`municipio_id` = `Ciudad`.`municipio_id` and `Localidad`.`estado_id` = `Ciudad`.`estado_id` INNER JOIN `municipios` AS `Municipio` ON `Localidad`.`municipio_id` = `Municipio`.`id` and `Localidad`.`estado_id` = `Municipio`.`estado_id` INNER JOIN `estados` AS `Estado` ON `Localidad`.`estado_id` = `Estado`.`id` WHERE `Localidad`.`id` = " + localidad_id + ";", {
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function(localidad) {
            req.session.passport.user.ciudad = localidad[0].ciudad;
            req.session.passport.user.estado = localidad[0].estado;
            if (redirect) {
                res.redirect('/perfil');
            } else res.send({
                'result': 'success',
                'session': req.session.passport.user
            });
        })
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

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + month + day + hour + min + sec;
}
