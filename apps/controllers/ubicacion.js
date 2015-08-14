var models  = require('../models');

exports.index = function(req, res) {
  res.render('especialidades/index', {
    title: 'Especialidades'
  });
};

exports.mostrar = function(req, res) {
  models.Especialidades.findAll().then(function(datos) {
    res.render('especialidades/mostrar', {
      title: 'Especialidades',
      datos: datos
    });
  });
};

exports.ObtieneTelefonos = function(req, res) {
  models.Telefono.findAll().then(function(datos) {
    res.send(datos);
  });
};

exports.ObtieneDirecciones = function(req, res) {
  models.Direccion.findAll().then(function(datos) {
    res.send(datos);
  });
};
