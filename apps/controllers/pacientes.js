var models  = require('../models');

exports.index = function(req, res) {
  res.render('pacientes/index', {
    title: 'Pacientes'
  });
};

exports.mostrar = function(req, res) {
  models.Paciente.findAll().then(function(datos) {
    res.render('pacientes/mostrar', {
      title: 'Usuarios',
      datos: datos
    });
  });
};

exports.biometricos = function(req, res) {
  res.render('pacientes/biometricos', {
    title: 'Usuarios'
  });
};
