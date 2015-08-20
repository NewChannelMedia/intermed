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
    // Inicia transacción de registro de usuarios
    models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, function(t) {
        // Creando usuario
        return models.Usuario.findOrCreate({
            where: {
                correo: object['email']
            },
            defaults: {
                usuario: object['email'],
                correo: object['email'],
                password: '',
                tipoUsuario: object['tipoUsuario'],
                tipoRegistro: object['tipoRegistro'],
                fbId: object['id'],
                estatusActivacion: '0'
            }
        }).then(function(usuario) {
            // si fue exitoso, actualizamos  datos generales, direcciones, telefonos y médicos
            // tomamos el id que le toco al usuario
            var id = usuario[0].id;

            models.DatosGenerales.findOrCreate({
                where: {
                    usuario_id: id
                },
                defaults: {
                    nombre: object['first_name'],
                    apellidoP: object['last_name'],
                    apellidoM: '',
                    rfc: '',
                    usuario_id: id,
                    genero: object['gender']
                }
            });

            if (object['tipoRegistro'] === 'F') {
                console.log('REGISTRO POR FACEBOOK::::::');
                //Guarda imagen de perfil de usuario
                /*
                options = {
                    host: 'fbcdn-profile-a.akamaihd.net',
                    port: 80,
                    path: object.picture.data.url
                };

                http.get(options, function(res) {
                    var imagedata = ''
                    res.setEncoding('binary')
                    var path = './public/img/user_' + id + '.png';

                    res.on('data', function(chunk) {
                        imagedata += chunk
                    })

                    res.on('end', function() {
                        fs.writeFile(path, imagedata, 'binary', function(err) {
                            if (err) {
                                console.error('ERROR: ' + err);
                            } else {
                                console.log('Imagen de perfil guardada como "' + path + '"')
                            }
                        })
                    })
                })
                */

                models.Usuario.update({
                    estatusActivacion: '1'
                }, {
                    where: {
                        id: id
                    }
                });
            } else {
                console.log('REGISTRO LOCAL::::::');
                //Falta obtenerlo de facebook
                models.Direccion.create({
                    calle: '',
                    numero: '',
                    calle1: '',
                    calle2: '',
                    colonia: '',
                    estado_id: '', //Id del estado
                    ciudad: object['location']['name'],
                    cp: '',
                    principal: 1,
                    usuario_id: id
                });
                //Falta obtenerlo de facebook
                models.Telefono.create({
                    tipo: '1',
                    telefono: '',
                    usuario_id: id
                });
            }

            if (object['tipoUsuario'] === 'P') {
                //Se trata de un paciente
                models.Paciente.findOrCreate({
                    where: {
                        usuario_id: id
                    },
                    defaults: {
                        fechaNac: object['birthday'],
                        usuario_id: id
                    }
                });
            } else if (object['tipoUsuario'] === 'M') {
                //Se trata de un médico
                models.Medico.create({
                    cedula: '',
                    codigoMedico: '',
                    usuario_id: id
                }).then(function(medico) {
                    // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
                    models.MedicoEspecialidad.create({
                        tipo: '1',
                        titulo: '',
                        lugarEstudio: '',
                        medico_id: medico.id,
                        fecha: Date.now(),
                        especialidad_id: object['especialidadMed'] // Id de la especialidad
                    })
                });
            }


        });

    }).then(function(result) {
        res.redirect('/');
    }).catch(function(err) {
        console.error('ERROR: ' + err);
        req.session.passport = {};
        res.redirect('/');
    });
};
