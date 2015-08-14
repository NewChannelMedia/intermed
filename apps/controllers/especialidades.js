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
