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
            console.log('--Usuario y contraseña correctos--');
            generarSesion(req, res, usuario.id)
        } else {
            console.log('--Usuario o contraseña incorrectos--')
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
                                    estatusActivacion: 1
                                })
                                .then(function(usuario) {
                                    var http = require('http')
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
                                            fs.mkdirSync('./garage/profilepics/' + usuario.id, 0777);
                                            var path = './garage/profilepics/' + usuario.id + '/' + usuario.id + '_' + getDateTime() + '.png';
                                            fs.writeFile(path, imagedata, 'binary', function(err) {
                                                if (err) throw err
                                                console.log('File saved.')
                                                return usuario.update({
                                                    urlFotoPerfil: path
                                                }).then(function(result) {

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
                                            })
                                        })

                                    });
                                });
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
                    })
                    .then(function(usuarios) {
                        usuario = usuarios[0];
                        if (!usuario) {
                            //Usuario nuevo
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
                                                    if (object['tipoUsuario'] === 'P') {
                                                        crearPaciente(req, res, object, usuario_id);
                                                    } else if (object['tipoUsuario'] === 'M') {
                                                        crearMedico(req, res, object, usuario_id);
                                                    }
                                                });
                                        });
                                });
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
                    'estatusActivacion': usuario.estatusActivacion,
                    'name': usuario.DatosGenerale.nombre + ' ' + usuario.DatosGenerale.apellidoP
                }));
                if (usuario.urlFotoPerfil){
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

function cargarExtraInfo(usuario, req, res){
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
                var DireccionPrincipal = usuario.Direccions[0];
                if (DireccionPrincipal) {
                    console.log('DIRECCION');
                    obtenerDatosLocalidad(DireccionPrincipal.localidad_id, req, res);
                } else {
                    console.log('NO DIRECCION');
                    res.redirect('/perfil');
                }
            });
    } else {
        if (usuario.tipoUsuario === 'A') {
            res.redirect('/registro');
        }
    }
}

function obtenerDatosLocalidad(localidad_id, req, res) {
    models.sequelize.query("SELECT `Localidad`.`CP`, `Localidad`.`localidad`, `TipoLocalidad`.`id` AS 'tipo_id', `TipoLocalidad`.`tipo`, `Ciudad`.`id` AS 'ciudad_id', `Ciudad`.`ciudad`, `Municipio`.`id` AS 'municipio_id', `Municipio`.`municipio`, `Estado`.`id` AS 'estado_id', `Estado`.`estado` FROM `localidades` AS `Localidad`INNER JOIN `tipoLocalidad` AS `TipoLocalidad` ON `TipoLocalidad`.`id` = `Localidad`.`tipo_localidad_id` INNER JOIN `ciudades` AS `Ciudad` ON `Localidad`.`ciudad_id` = `Ciudad`.`id` and `Localidad`.`municipio_id` = `Ciudad`.`municipio_id` and `Localidad`.`estado_id` = `Ciudad`.`estado_id` INNER JOIN `municipios` AS `Municipio` ON `Localidad`.`municipio_id` = `Municipio`.`id` and `Localidad`.`estado_id` = `Municipio`.`estado_id` INNER JOIN `estados` AS `Estado` ON `Localidad`.`estado_id` = `Estado`.`id` WHERE `Localidad`.`id` = " + localidad_id + ";", {
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function(localidad) {
            console.log('LOCALIDAD: ' + JSON.stringify(localidad));
            req.session.passport.user.ciudad = localidad[0].ciudad;
            req.session.passport.user.estado = localidad[0].estado;
            res.redirect('/');
        })
}

exports.obtenerInformacionUsuario = function(object, req, res) {
    if (req.session.passport.user && req.session.passport.user.id > 0) {
        var usuario_id = req.session.passport.user.id;
        models.Usuario.findOne({
            where: {
                id: usuario_id
            },
            attributes: ['id', 'urlFotoPerfil', 'tipoUsuario', 'tipoRegistro', 'estatusActivacion'],
            include: [
              {model: models.DatosGenerales, attributes:['id','nombre','apellidoP','apellidoM']},
              {model: models.Direccion,attributes:['id','localidad_id'],
                  include:[{ model: models.Localidad, attributes:['id','CP','estado_id','localidad','municipio_id','estado_id'],
                    include:[
                        {model:models.Estado, attributes:['id','estado']},
                        {model:models.Ciudad, attributes:['id','ciudad']}
                    ]
                  }]
              },
              {model: models.Telefono, attributes:['id','numero','claveRegion','lada','usuario_id']},
              {model: models.Biometrico, attributes:['id','peso','altura','tipoSangre','genero']},
              {model: models.Paciente, include:[
                    {model: models.ContactoEmergencia, attributes:[ 'id','nombre','tel']},
                    {model: models.PacientePadecimiento,attributes:['id'], include:[{model:models.Padecimiento, attributes:['id','padecimiento']}]},
                    {model: models.PacienteAlergia, include:[ { model: models.Alergias, attributes:['id','alergia'] } ] }
                  ]
              }
            ]
        }).then(function(usuario) {
            usuario = JSON.parse(JSON.stringify(usuario));
            //console.log("USUARIOSSSS -------> " + JSON.stringify(usuario) );
            res.send(usuario);
        });
    }
};
//<---------------------------------------------------->
  exports.despachador = function( object, req, res){
    if( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      // en el caso de que se quiera insertar, se manejara en el mismo update,
      // donde si no encuentra el valor que lo inserte, y si lo encuentra que solo lo actualice
      // se crea el objecto que se manda para que se haga la insercion o actualización
      var campo = req.body.campo;
      var campo2 = req.body.prueba;
      var tabla = object.tabla;
      switch(object.accion){
        case 'insertar':
          req.body.prueba['usuario_id'] = usuario_id;
          models[tabla].create(
            req.body.prueba
          ).then(function(insertado){
            res.send(true);
          });
        break;
        case 'actualizar':
          // con la siguiente funcion se mandara a checar de que tabla se requiere realizar la accion
          // y con sus respectivas condiciones
          console.log("TACOSSSs");
          var update = {};
          if( object.numero === 'true' ){
            update[campo] = parseFloat(req.body.valor);
          }else{
            update[campo] = req.body.valor;
          }
          var prueba = req.body.prueba;
          models[tabla].update(
            update,{
            where:{usuario_id:usuario_id,id:prueba}
          }).then(function(){
            res.sendStatus(200);
          });
        break;
        case 'delete':
          var dosWhere = {};
          dosWhere[campo] = campo2
          dosWhere['id'] = req.body.valor2
          models[tabla].destroy({
            where:dosWhere
          }).then(function(eliminado){ 
            if( eliminado > 0 )
              res.send(true);
            else
              res.send(false);
          });
        break;
      }//fin switch
    }//fin if nombre: "Fulano"
  };
//<---------------------------------------------------->
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
