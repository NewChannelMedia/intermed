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
            }).then(function(usuarios) {
                usuario = usuarios[0];
                if (!usuario) {
                    //Usuario nuevo
                    models.Usuario.create({
                        usuario: object['email'],
                        correo: object['email'],
                        tipoUsuario: object['tipoUsuario'],
                        tipoRegistro: object['tipoRegistro'],
                        fbId: object['id'],
                        estatusActivacion: '1',
                        urlFotoPerfil: object.picture.data.url
                    }).then(function(usuario) {
                        usuario_id = usuario.id;
                        models.DatosGenerales.create({
                            nombre: object['first_name'],
                            apellidoP: object['last_name'],
                            apellidoM: '',
                            rfc: '',
                            usuario_id: usuario_id,
                            genero: object['gender']
                        }).then(function(result) {
                            if (object['tipoUsuario'] === 'P') {
                                crearPaciente(req, res, object, usuario_id);
                            } else if (object['tipoUsuario'] === 'M') {
                                crearMedico(req, res, object, usuario_id);
                            }
                        });
                    })
                } else {
                    usuario_id = usuario.id;
                    generarSesion(req, res, usuario_id);
                }
            });
        } else { //Registro por correo
            return models.Usuario.findAll({
                where: {
                    correo: object['email']
                }
            }).then(function(usuarios) {
                usuario = usuarios[0];
                if (!usuario) {
                    //Usuario nuevo
                    models.Usuario.create({
                        usuario: object['email'],
                        correo: object['email'],
                        tipoUsuario: object['tipoUsuario'],
                        tipoRegistro: object['tipoRegistro'],
                        estatusActivacion: '0'
                    }).then(function(usuario) {
                        usuario_id = usuario.id;
                        models.DatosGenerales.create({
                            nombre: object['first_name'],
                            apellidoP: object['last_name'],
                            apellidoM: '',
                            rfc: '',
                            usuario_id: usuario_id,
                            genero: object['gender']
                        }).then(function(result) {
                            if (object['tipoUsuario'] === 'P') {
                                crearPaciente(req, res, object, usuario_id);
                            } else if (object['tipoUsuario'] === 'M') {
                                crearMedico(req, res, object, usuario_id);
                            }
                        });
                    });
                } else {
                    //Usuario ya existente
                    console.log('El usuario con el correo ' + object['email'] + ' ya se encuentra registrado');
                    generarSesion(req, res, usuario_id);
                }
            });
        }
    }).catch(function(err) {
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
    models.Paciente.create({
        fechaNac: object['birthday'],
        usuario_id: usuario_id
    }).then(function(result) {
        generarSesion(req, res, usuario_id);
    });
}

var crearMedico = function(req, res, object, usuario_id) {
    //Se trata de un médico
    models.Medico.create({
        cedula: '',
        codigoMedico: '',
        usuario_id: usuario_id
    }).then(function(medico) {
        // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
        models.MedicoEspecialidad.create({
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
