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

// Método que registra usuarios
exports.registrar = function(object, req, res) {
    // Inicia transacción de registro de usuarios
    models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
      }, function (t) {

        // Creando usuario
        models.Usuario.findOrCreate({//create({
            usuario: object['name'],
            correo:  object['email'],
            password: 'passtest',
            tipoUsuario: 'P',
            tipoRegistro: '',
            estatusActivacion : '1'
        });
      }).then(function(result) {
            // transacción completa
            res.redirect('/');
            //res.status(200).json({ok: true});
      }).catch(function(err) {
          res.redirect('/');
          //res.status(500).json({error: err});
      });
};
