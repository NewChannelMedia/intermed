var models  = require('../models');

exports.obtieneEstados = function(req, res) {
  models.Estado.findAll().then(function(datos) {
    res.sender(datos);
  });
};
