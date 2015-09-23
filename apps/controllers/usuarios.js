var models = require('../models');
var http = require('http'),
    request = require('request'),
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
            generarSesion(req, res, usuario.id, true);
        } else {
            res.redirect('/');
        }
    });
};

exports.logout = function (object, req, res) {
    if (req.session){
        res.clearCookie('intermed_sesion');
        req.session.destroy();
    }
    res.redirect('/');
};

// Método que registra pacientes (facebook)
exports.registrarUsuario = function(object, req, res) {
    req.session.passport = {};
    //Usuario que lo invito: req.session.invito;
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
                    if (!usuario && req.session.tipo != '') {
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

                                var usuarioUrl = String(usuario.id);
                                for (var i = usuarioUrl.length ; i < 7; i++){usuarioUrl = '0' + usuarioUrl;}

                                usuario_id = usuario.id;

                                if (object['email']) {
                                    return usuario.update({
                                        estatusActivacion: 1,
                                        usuarioUrl: usuarioUrl
                                    }, {
                                        transaction: t
                                    }).then(function (resutl){
                                        return crearDatosGeneralesFB(usuario,object,req, res, t);
                                    });
                                } else {
                                    return usuario.update({
                                        usuarioUrl: usuarioUrl
                                    }, {
                                        transaction: t
                                    }).then(function(resutl){
                                        return crearDatosGeneralesFB(usuario,object, req, res, t);
                                    });
                                }
                            });
                    } else if (usuario) {
                        usuario_id = usuario.id;
                        generarSesion(req, res, usuario_id, true);
                    } else {
                        console.log('El usuario no se encuentra registrado');
                        generarSesion(req, res, '', true);
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
                                return models.Usuario.create({
                                    correo: object['email'],
                                    password: object['password'],
                                    tipoUsuario: object['tipoUsuario'],
                                    tipoRegistro: object['tipoRegistro'],
                                    estatusActivacion: 0
                                }, {
                                    transaction: t
                                }).then(function(usuario) {
                                    var usuarioUrl = String(usuario.id);
                                    for (var i = usuarioUrl.length ; i < 7; i++){usuarioUrl = '0' + usuarioUrl;}
                                    var tokens = String(cryptomaniacs.doEncriptToken(usuario.id, getDateTime(false)));
                                    return usuario.update({
                                            token: tokens,
                                            usuarioUrl: usuarioUrl
                                        }, {
                                            transaction: t
                                        })
                                        .then(function(usuario) {
                                            return crearMedico(req, res, object, usuario, t);
                                        });
                                    });
                            } else if (object.tipoUsuario === 'P') {
                                return models.Usuario.create({
                                        correo: object['email'],
                                        password: object['password'],
                                        tipoUsuario: object['tipoUsuario'],
                                        tipoRegistro: object['tipoRegistro'],
                                        estatusActivacion: 0
                                    }, {
                                        transaction: t
                                    })
                                    .then(function(usuario) {
                                        var usuarioUrl = String(usuario.id);
                                        for (var i = usuarioUrl.length ; i < 7; i++){usuarioUrl = '0' + usuarioUrl;}

                                        var tokens = String(cryptomaniacs.doEncriptToken(usuario.id, object['tiempoStamp']));
                                        return usuario.update({
                                                token: tokens,
                                                usuarioUrl: usuarioUrl
                                            }, {
                                                transaction: t
                                            })
                                            .then(function(usuario) {
                                                return models.DatosGenerales.create({
                                                        nombre: object.first_name,
                                                        apellidoP: object.last_name,
                                                        apellidoM: '',
                                                        usuario_id: usuario.id,
                                                        genero: object.gender
                                                    }, {
                                                        transaction: t
                                                    })
                                                    .then(function(result) {
                                                        return crearPaciente(req, res, object, usuario, t);
                                                    });
                                            });
                                    });
                            }
                        } else {
                            //Usuario ya existente
                            console.log('El usuario con el correo ' + object['email'] + ' ya se encuentra registrado');
                            req.session.passport = {};
                            res.redirect('/');
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
    if (!fs.existsSync('./garage/profilepics/' + usuario.id)) {
        fs.mkdirSync('./garage/profilepics/' + usuario.id, 0777);
    };
    var path = './garage/profilepics/' + usuario.id + '/' + usuario.id + '_' + getDateTime(false) + '.png';

    download(object.picture.data.url, path, function(){
        usuario.update({
            urlFotoPerfil: path
        });
        console.log('IMAGEN GUARDADA');
    });
}

var crearPaciente = function(req, res, object, usuario, t) {
    //Se trata de un paciente
    return models.Paciente.create({
            usuario_id: usuario.id
        }, {
            transaction: t
        })
        .then(function(paciente) {
            generarRelacion(usuario, paciente.id, req, res);
            if (object['birthday'] != 'undefined-undefined-undefined') {
                return paciente.update({
                        fechaNac: object['birthday']
                    }, {
                        transaction: t
                    })
                    .then(function(result) {
                        if (usuario.tipoRegistro == "C") enviarCorreoConfirmacion(usuario);
                        setTimeout(function() {
                            if (object.email) borrarInvitaciones(object.email);
                            generarSesion(req, res, usuario.id, true);
                        }, 1000);
                    });
            } else {
                if (usuario.tipoRegistro == "C") enviarCorreoConfirmacion(usuario);
                setTimeout(function() {
                    if (object.email) borrarInvitaciones(object.email);
                    generarSesion(req, res, usuario.id, true);
                }, 1000);
            }
        });
}

var crearMedico = function(req, res, object, usuario, t) {
    return models.Medico.create({
            usuario_id: usuario.id
        }, {
            transaction: t
        })
        .then(function(medico) {
            var token = String(cryptomaniacs.doEncriptToken(medico.id, ''));
            medico.update({
                token:token
            }).then(function(result){
                generarRelacion(usuario, medico.id, req, res);
                if (usuario.tipoRegistro == "C") enviarCorreoConfirmacion(usuario);

                setTimeout(function() {
                    if (object.email) borrarInvitaciones(object['email']);
                    generarSesion(req, res, usuario.id, true);
                }, 1000);
            });
        });
    };

var enviarCorreoConfirmacion = function(usuario){
    var datos = {
        to: usuario.correo,
        subject: 'Activa tu cuenta',
        name: usuario.nombre,
        correo: usuario.correo,
        token: usuario.token
    };
    correoUser = usuario.correo;
    mail.mailer(datos, 'confirmar'); //se envia el correo
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
    var actualizacion = false;
    if (req.session.passport.user) actualizacion = true;
    req.session.passport = {};
    models.Usuario.findOne({
            where: {
                id: usuario_id
            },
            attributes: ['id', 'usuarioUrl' ,'urlFotoPerfil', 'tipoUsuario', 'tipoRegistro', 'estatusActivacion'],
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
                    'usuario': usuario.usuario,
                    'tipoUsuario': usuario.tipoUsuario,
                    'tipoRegistro': usuario.tipoRegistro,
                    'estatusActivacion': usuario.estatusActivacion,
                    'logueado': usuario.logueado,
                    'usuarioUrl': usuario.usuarioUrl
                }));
                res.cookie('intermed_sesion', {id: usuario.id, usuario: usuario.usuarioUrl, tiempo: getDateTime(true)});
                if (actualizacion){
                    req.session.passport.user.inicio = 0;
                } else {
                    req.session.passport.user.inicio = 1;
                }
                usuario.update({logueado:1}).then(function(result){
                    req.session.passport.user.registroCompleto = 1;
                    if (!usuario.DatosGenerale) req.session.passport.user.registroCompleto = 0;
                    if (!usuario.Direccions) req.session.passport.user.registroCompleto = 0;
                    if (!usuario.Biometrico || !usuario.Biometrico.genero) req.session.passport.user.registroCompleto = 0;
                    if (usuario.DatosGenerale) req.session.passport.user.name = usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP + ' ' + usuario.DatosGenerale.apellidoM;
                    else req.session.passport.user.name = '';
                    if (usuario.urlFotoPerfil) {
                        fs.readFile(usuario.urlFotoPerfil, function(err, data) {
                            if (err) console.log('Error al leer la imagen de perfil: ' + err);
                            if (data) {
                                req.session.passport.user.fotoPerfil = 'data:image/jpeg;base64,' + (data).toString('base64');
                            }
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
                    req.session.passport.user.registroCompleto = 0;
                }
                var DireccionPrincipal = usuario.Direccions[0];
                if (DireccionPrincipal) {
                    obtenerDatosLocalidad(DireccionPrincipal.localidad_id, redirect, req, res);
                } else {
                    req.session.passport.user.registroCompleto = 0;
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
    models.sequelize.query("SELECT `Localidad`.`CP`, `Localidad`.`localidad`, `TipoLocalidad`.`id` AS 'tipo_id', `TipoLocalidad`.`tipo`, `Ciudad`.`id` AS 'ciudad_id', `Ciudad`.`ciudad`, `Municipio`.`municipio_id` AS 'municipio_id', `Municipio`.`municipio`, `Estado`.`id` AS 'estado_id', `Estado`.`estado` FROM `localidades` AS `Localidad`INNER JOIN `tipoLocalidad` AS `TipoLocalidad` ON `TipoLocalidad`.`id` = `Localidad`.`tipo_localidad_id` INNER JOIN `ciudades` AS `Ciudad` ON `Localidad`.`ciudad_id` = `Ciudad`.`id` and `Localidad`.`municipio_id` = `Ciudad`.`municipio_id` and `Localidad`.`estado_id` = `Ciudad`.`estado_id` INNER JOIN `municipios` AS `Municipio` ON `Localidad`.`municipio_id` = `Municipio`.`id` and `Localidad`.`estado_id` = `Municipio`.`estado_id` INNER JOIN `estados` AS `Estado` ON `Localidad`.`estado_id` = `Estado`.`id` WHERE `Localidad`.`id` = " + localidad_id + ";", {
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

exports.obtenerInformacionUsuario = function(object, req, res) {
    if (req.session.passport.user && req.session.passport.user.id > 0) {
        var usuario_id = req.session.passport.user.id;
        var tipoUsuario = 'Paciente';
        if (req.session.passport.user.tipoUsuario == 'M') {
            tipoUsuario = 'Medico';
        } {
            models.Usuario.findOne({
                where: {
                    id: usuario_id
                },
                attributes: ['id', 'urlFotoPerfil', 'tipoUsuario', 'tipoRegistro', 'estatusActivacion'],
                include: [{
                    model: models.DatosGenerales
                }, {
                    model: models.Direccion,
                    include: [{
                        model: models.Localidad
                    }]
                }, {
                    model: models.Telefono
                }, {
                    model: models.Biometrico
                }, {
                    model: models.Paciente
                }]
            }).then(function(usuario) {
                usuario = JSON.parse(JSON.stringify(usuario));
                res.send(usuario);
            });
        }
    }
};

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
};

exports.invitar = function (object, req, res){
        if (object.nombre && object.correo && object.mensaje){
            models.Invitacion.create({
                usuario_id: req.session.passport.user.id,
                nombre: object.nombre,
                correo: object.correo,
                mensaje: object.mensaje
            }).then(function(invitacion){
                var tokens = String(cryptomaniacs.doEncriptToken(invitacion.id, ''));
                invitacion.update({
                    token: tokens
                }).then(function (result){
                    var datos = {
                        to: object.correo,
                        subject: 'Te invito a usar Intermed',
                        nombre: object.nombre,
                        nombreSesion: req.session.passport.user.name,
                        enlace: 'localhost:3000/invitacion/' + tokens,
                        mensaje: object.mensaje
                    };
                    var result = mail.mailer(datos, 'invitar'); //se envia el correo
                    setTimeout(function(){
                        res.send({result:'success'});
                    }, 1000);
                });
            });
        } else {
            res.send({result: 'error', error: 'información incompleta'});
        }
};

var crearDatosGeneralesFB = function (usuario, object, req, res, t){
    var usuario_id = usuario.id;
    return models.DatosGenerales.create({
            nombre: object['first_name'],
            apellidoP: object['last_name'],
            apellidoM: '',
            usuario_id: usuario_id,
            genero: object['gender']
        }, {
            transaction: t
        })
        .then(function(result) {
            if (object.picture) {
                guardarImagenDePerfil(object, usuario, req, res);
            }
            if (object.gender){
                return models.Biometrico.create({
                    genero: object['gender'],
                    usuario_id: usuario_id
                }, {transaction: t}).then(function (result){
                    if (object['tipoUsuario'] === 'P') {
                        return crearPaciente(req, res, object, usuario, t);
                    } else if (object['tipoUsuario'] === 'M') {
                        return crearMedico(req, res, object, usuario, t);
                    }
                })
            } else {
                if (object['tipoUsuario'] === 'P') {
                    return crearPaciente(req, res, object, usuario, t);
                } else if (object['tipoUsuario'] === 'M') {
                    return crearMedico(req, res, object, usuario, t);
                }
            }
        });
};

function getDateTime(format) {
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
    if (format){
        return year +'-'+ month +'-'+ day + ' ' + hour +':'+ min +':'+ sec;
    } else {
        return year + month + day + hour + min + sec;
    }
}

function generarRelacion(usuario, medicopaciente_id, req, res){
    //Usuario que lo invito: req.session.invito;
    if (req.cookies.intermed_invitacion && req.cookies.intermed_invitacion.token){
        var token =  req.cookies.intermed_invitacion.token;
        res.clearCookie('intermed_invitacion');
        models.Invitacion.findOne({
            where:{token:token}
        }).then(function(invitacion){
            if (invitacion){
                if (usuario.tipoRegistro == 'C' && usuario.tipoUsuario == 'M'){
                    models.DatosGenerales.upsert({
                        nombre: invitacion.nombre,
                        apellidoP: '',
                        apellidoM: '',
                        usuario_id: usuario.id
                    });
                }

                console.log('________GENERANDO RELACIONES');
                console.log('________INVITO: ' + token);
                models.Usuario.findOne({
                    where: {id: invitacion.usuario_id},
                    attributes: ['id','usuarioUrl','tipoUsuario'],
                    include: [{
                        model: models.Medico
                    }, {
                        model: models.Paciente
                    }]
                }).then(function(usuarioInvito){
                    if (!(usuarioInvito.tipoUsuario == "P" && usuario.tipoUsuario == "M")){
                        var condiciones = {};
                        if (usuarioInvito.tipoUsuario == "M"){
                            condiciones = {
                                usuario_id: usuario.id,
                                medico_id: usuarioInvito.Medico.id
                            };
                        } else {
                            condiciones = {
                                usuario_id: usuario.id,
                                paciente_id: usuarioInvito.Paciente.id
                            };
                        }
                        models.MedicoFavorito.findOrCreate({
                            defaults: condiciones,
                            where: condiciones
                        }).then(function(result){
                            if (result){
                                console.log('________Médico/Colega/Contacto agregado')
                            } else {
                                console.log('________Error al agregar la relación')
                            }
                        });
                    } else {
                        console.log('________Tipo medico');
                    }
                    generarRelacionInversa(usuarioInvito, usuario.tipoUsuario ,medicopaciente_id, req, res);
                });
            } else {
                console.log('________LA INVITACIÓN NO EXISTE');
            }
        });
    }
}

function generarRelacionInversa(usuario, tipoUsuario, medicopaciente_id, req, res){
    //Usuario que lo invito: req.session.invito;
    console.log('________GENERANDO RELACIONES INVERSAS');

    if (!(tipoUsuario== "P" && usuario.tipoUsuario  == "M")){
        var condiciones = {};
        if (tipoUsuario == "M"){
            condiciones = {
                usuario_id: usuario.id,
                medico_id: medicopaciente_id
            };
        } else {
            condiciones = {
                usuario_id: usuario.id,
                paciente_id: medicopaciente_id
            };
        }
        models.MedicoFavorito.findOrCreate({
            defaults: condiciones,
            where: condiciones
        }).then(function(result){
            if (result){
                console.log('________Médico/Colega/Contacto agregado (inversa)')
            } else {
                console.log('________Error al agregar la relación (inversa)')
            }
        });
    } else {
        console.log('________Tipo medico (inversa)');
    }
}


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var borrarInvitaciones = function(correo){
    models.Invitacion.destroy({
        where:{correo: correo}
    }).then(function(result){
        console.log('Invitaciones eliminadas: ' + JSON.stringify(result));
    })
}
