var models  = require('../models');

exports.ajax = function(object, req, res) {
  models.DatosGenerales.findAll().then(function(datos) {
    res.send(datos);
  });
};

exports.obtieneUsuariosCompletos = function(object, req, res) {
  models.Usuario.findAll({
    include: [{ model: models.DatosGenerales }, { model: models.Medico }]}
  ).then(function(datos) {
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
exports.registrar = function(object, req, res) {
    // Inicia transacción de registro de usuarios
    models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
      }, function (t) {
        // Creando usuario
        return models.Usuario.findOrCreate({
        where: {
            correo:  object['email']
        },
        defaults: {
            usuario: object['email'],
            correo:  object['email'],
            password: '',
            tipoUsuario: 'P',
            tipoRegistro: '',
            estatusActivacion : '1'
        }}).then(function(usuario) {
            // si fue exitoso, actualizamos  datos generales, direcciones, telefonos y médicos
            // tomamos el id que le toco al usuario
            var id = usuario[0].id;

            models.DatosGenerales.findOrCreate({
                where: {
                    usuario_id: id
                },
                defaults:{
                  nombre: object['first_name'],
                  apellidoP: object['last_name'],
                  apellidoM: '',
                  rfc: '',
                  usuario_id: id
                }
            });
            /*
            //Falta obtenerlo de facebook
            models.Direccion.create({
              calle: '',
              numero: '',
              calle1: '',
              calle2: '',
              colonia: '',
              estado_id: '',  //Id del estado
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
            });*/
            models.Paciente.findOrCreate({
                where: {
                    usuario_id: id
                },
                defaults: {
                  fechaNac: object['birthday'],
                  usuario_id: id
                }
          });
        });

      }).then(function(result) {
          res.redirect('/');
      }).catch(function(err) {
          console.error('ERROR: ' + err);
          req.session.passport = {};
          res.redirect('/');
      });
};
