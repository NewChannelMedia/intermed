var models  = require('../models');

exports.ajax = function(req, res) {
  models.DatosGenerales.findAll().then(function(datos) {
    res.send(datos);
  });
};

exports.obtieneUsuariosCompletos = function(req, res) {
  models.Usuario.findAll({
    include: [{ model: models.DatosGenerales }, { model: models.Medico }]}
  ).then(function(datos) {
    res.send(datos);
  });
};

exports.ObtieneDatosGenerales = function(req, res) {
  models.DatosGenerales.findAll().then(function(datos) {
    res.send(datos);
  });
};

exports.index = function(req, res) {
  res.render('usuarios/index', {
    title: 'Usuarios'
  });
};

exports.mostrar = function(req, res) {
  models.Usuario.findAll().then(function(datos) {
    res.render('usuarios/mostrar', {
      title: 'Usuarios',
      datos: datos
    });
  });
};
