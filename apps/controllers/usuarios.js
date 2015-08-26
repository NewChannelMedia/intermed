var models = require('../models');
var http = require('http'),
    fs = require('fs');

exports.ajax = function(object, req, res) {
    models.DatosGenerales.findAll().then(function(datos) {
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
    }).then(function(datos) {
        res.send(datos);
    });
};

exports.ObtieneDatosGenerales = function(object, req, res) {
    models.DatosGenerales.findAll().then(function(datos) {
        res.send(datos);
    });
};

exports.index = function(object, req, res) {
    res.render('usuarios/index', {
        title: 'Usuarios'
    });
};

exports.mostrar = function(object, req, res) {
    models.Usuario.findAll().then(function(datos) {
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
    // Registro por facebook
    if (object['tipoRegistro'] === 'F') {
        return models.Usuario.findOne({
            where: {
                fbId: object['id']
            }
        }).then(function(usuario) {
            if (!usuario) {
                crearUsuarioPorFB(object, req, res);
            } else {
                generarSesion(req, res, usuario.id);
            }
        });
    } else { //Registro por correo
        models.Usuario.findOne({
            where: {
                correo: object['email']
            }
        }).then(function(usuario) {
            if (!usuario) {
                crearUsuarioPorCorreo(object, req, res);
            } //Usuario ya existente
        })
    }
};

function crearUsuarioPorFB(object, req, res) {
    models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, function(t) {
        //Usuario nuevo
        return models.Usuario.create({
            correo: object['email'],
            tipoUsuario: object['tipoUsuario'],
            tipoRegistro: object['tipoRegistro'],
            fbId: object['id'],
            estatusActivacion: '1',
            urlFotoPerfil: object.picture.data.url
        }, {transaction: t}).then(function(usuario) {
            usuario_id = usuario.id;
            return models.DatosGenerales.create({
                nombre: object['first_name'],
                apellidoP: object['last_name'],
                apellidoM: '',
                usuario_id: usuario_id
            }, {transaction: t}).then(function(result) {
                return models.Biometrico.create({
                    genero: object.gender,
                    usuario_id: usuario_id
                }, {transaction: t}).then(function(result) {
                    if (object['tipoUsuario'] === 'P') {
                        crearPaciente(req, res, object, usuario_id);
                    } else if (object['tipoUsuario'] === 'M') {
                        crearMedico(req, res, object, usuario_id);
                    }
                });
            });
        })
    }).catch(function(err) {
        console.error('ERROR: ' + err);
        req.session.passport = {};
        res.redirect('/');
    });
}

function crearUsuarioPorCorreo(object, req, res) {
    object['birthday'] = object.birthdayYear + '-' + object.birthdayMonth + '-' + object.birthdayDay;
    console.log('Crear usuario por correo');
    models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, function(t) {
        //Usuario nuevo
        return models.Usuario.create({
            correo: object['email'],
            tipoUsuario: object['tipoUsuario'],
            tipoRegistro: object['tipoRegistro'],
            password: object['password'],
            estatusActivacion: '0'
        }, {transaction: t}).then(function(usuario) {
            usuario_id = usuario.id;
            return models.DatosGenerales.create({
                nombre: object['first_name'],
                apellidoP: object['last_name'],
                apellidoM: '',
                usuario_id: usuario_id
            }, {transaction: t}).then(function(result) {
                return models.Biometrico.create({
                    genero: object.gender,
                    usuario_id: usuario_id
                }, {transaction: t}).then(function(result) {
                    if (object['tipoUsuario'] === 'P') {
                        crearPaciente(req, res, object, usuario_id);
                    } else if (object['tipoUsuario'] === 'M') {
                        crearMedico(req, res, object, usuario_id);
                    }
                });
            });
        });
    }).catch(function(err) {
        console.error('ERROR: ' + err);
        req.session.passport = {};
        res.redirect('/');
    });
}

exports.correoDisponible = function(object, req, res) {
    models.Usuario.findAll({
        where: {
            correo: object['email']
        }
    }).then(function(usuario) {
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
    return models.Paciente.create({
        usuario_id: usuario_id
    }).then(function(paciente) {
        if (object['birthday'] != 'undefined-undefined-undefined') {
            return paciente.update({
                fechaNac: object['birthday']
            }).then(function(result) {
                generarSesion(req, res, usuario_id);
            });
        } else {
            generarSesion(req, res, usuario_id);
        }
    });
}

var crearMedico = function(req, res, object, usuario_id) {
    //Se trata de un médico
    return models.Medico.create({
        cedula: '',
        codigoMedico: '',
        usuario_id: usuario_id
    }).then(function(medico) {
        // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
        return models.MedicoEspecialidad.create({
            tipo: '1',
            titulo: '',
            lugarEstudio: '',
            medico_id: medico.id,
            fecha: Date.now(),
            especialidad_id: object['especialidadMed'] // Id de la especialidad
        }).then(function(result) {
            generarSesion(req, res, usuario_id);
        });
    });
}

var generarSesion = function(req, res, usuario_id) {
    models.Usuario.findAll({
        where: {
            id: usuario_id
        },
        include: [{
            model: models.DatosGenerales
        }, {
            model: models.Paciente
        }, {
            model: models.Direccion
        }, {
            model: models.Telefono
        }, ]
    }).then(function(usuario) {
        if (usuario[0]) {
            req.session.passport.user = JSON.parse(JSON.stringify(usuario[0]));
            req.session.passport.user.name = usuario[0].DatosGenerale.nombre + ' ' + usuario[0].DatosGenerale.apellidoP;
            if (usuario[0].tipoUsuario === 'P') {
                var tipoUsuario = 'Paciente';
            } else if (usuario[0].tipoUsuario === 'M') {
                var tipoUsuario = 'Medico';
            }
            models[tipoUsuario].findAll({
                where: {
                    usuario_id: usuario_id
                }
            }).then(function(extraInfo) {
                if (extraInfo[0]) {
                    req.session.passport.user['userInfo'] = JSON.parse(JSON.stringify(extraInfo[0]));
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            });
        } else {
            req.session.passport = {};
            res.redirect('/');
        }
    });
};
