var models  = require('../models');

exports.obtieneHospitalesMedico = function(object, req, res) {
  models.Hospital.findAll({
    where :  { medico_id: object.id }
  })
  .then(function(datos) {
    res.send(datos);
  });
};

exports.insertaHospital = function(object, req, res) {
  models.Hospital.create({
    nombre: object.nombre,
    medico_id : object.idMedico,
    institucion_id : object.idInstitucion
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

exports.actualizaHospitalMedico = function(object, req, res) {
  models.Hospital.update({
    nombre: object.nombre,
    medico_id : object.idMedico,
    institucion_id : object.idInstitucion
  },{ where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.borraHospital = function(object, req, res) {
  models.Hospital.destroy({
    where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.obtieneColegiosMedico = function(object, req, res) {
  models.Colegio.findAll({
    where :  { medico_id: object.id }
  })
  .then(function(datos) {
    res.send(datos);
  });
};

exports.insertaColegio = function(object, req, res) {
  models.Colegio.create({
    nombre: object.nombre,
    medico_id : object.idMedico,
    fechaInicio: object.fechaInicio,
    institucion_id : object.idInstitucion
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

exports.actualizaColegio = function(object, req, res) {
  models.Colegio.update({
    nombre: object.nombre,
    medico_id : object.idMedico,
    fechaInicio: object.fechaInicio,
    institucion_id : object.idInstitucion
  },{ where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.borraColegio = function(object, req, res) {
  models.Colegio.destroy({
    where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.obtieneInstitucionesMedico = function(object, req, res) {
  models.Institucion.findAll({
    where :  { usuario_id: object.id }
  })
  .then(function(datos) {
    res.send(datos);
  });
};

exports.insertaInstitucion= function(object, req, res) {
  models.Institucion.create({
    micrositio: object.micrositio,
    razonSocial : object.razonSocial,
    usuario_id: object.idUsuario
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

exports.actualizaInstitucion= function(object, req, res) {
  models.Institucion.update({
    micrositio: object.micrositio,
    razonSocial : object.razonSocial,
    usuario_id: object.idUsuario
  },{ where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

exports.borraInstitucion = function(object, req, res) {
  models.Institucion.destroy({
    where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.obtieneAseguradorasMedico = function(object, req, res) {
  models.Aseguradora.findAll({
    where :  { medico_id: object.id }
  })
  .then(function(datos) {
    res.send(datos);
  });
};

exports.insertaAseguradora = function(object, req, res) {
  models.Aseguradora.create({
    nombre: object.nombre,
    medico_id : object.idMedico,
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

exports.actualizaAseguradora= function(object, req, res) {
  models.Aseguradora.update({
    nombre: object.nombre,
    medico_id : object.idMedico
  },{ where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};

exports.borraAseguradora = function(object, req, res) {
  models.Aseguradora.destroy({
    where : {id: object.id }
  }).then(function(datos) {
    res.status(200).json({ok: true});
  }).catch(function(err) {
    res.status(500).json({error: err});
  });
};
