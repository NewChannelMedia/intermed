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

exports.obtieneEstados = function(req, res) {
  models.Estado.findAll().then(function(datos) {
    res.sender(datos);
  });
};

exports.obtieneCiudades = function(object, req, res) {
  models.Municipio.findAll({where: {estado_id: object.estado_id}, order: ['municipio'], attributes: ['id','municipio']}).then(function(ciudades) {
    res.send({'ciudades' : ciudades});
  });
};

exports.encontrarPorCP = function(object, req, res) {
  models.Localidad.findOne({where: {id: object.localidad_id}, attributes: ['CP']}).then(function(localidad) {
    res.send({'cp' : localidad.CP});
  });
};

exports.obtieneLocalidades = function(object, req, res) {
  models.Localidad.findAll({where: {estado_id: object.estado_id , municipio_id: object.ciudad_id}, order: ['localidad'], attributes: ['id','localidad']}).then(function(localidades) {
    res.send({'localidades' : localidades});
  });
};
