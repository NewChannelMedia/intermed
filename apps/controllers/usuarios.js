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

exports.registra = function(object, req, res) {
    models.Usuario.create({
        usuario: object['correoMed'],
        correo:  object['correoMed'],
        password: object['passMed']
    }).then(function(datos) {
        res.send(datos);
  });
};

// insertar datos
exports.insertaDatosPersonales = function(object, req, res) {
  models.DatosGenerales.create({
      nombre: object['nombre'],
      apellidoP: object['apellidop'],
      apellidoM: object['apellidom'],
      rfc: object['rfc'],
      usuario_id: object['idUario']
    }).then(function(datos) {
        res.send(datos);
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

// modifica datos
exports.modificaDatosPersonales = function(object, req, res) {
  models.DatosGenerales.update({
      nombre: object['nombre'],
      apellidoP: object['apellidop'],
      apellidoM: object['apellidom'],
      rfc: object['rfc'],
    }, {
      where: { usuario_id : object['idUsuario'] }
  }).then(function() {
        res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
};

// modifica direccion y telefono
exports.modificaDireccionYTelefono = function(object, req, res) {
  models.Direccion.update({
       calle: object['calleMed'],
       numero: object['numeroMed'],
       calle1: object['calle1Med'],
       calle2: object['calle2Med'],
       colonia: object['coloniaMed'],
       estado_id: object['estadoMed'],
       ciudad: object['ciudadMed'],
       cp: object['cpMed'],
     }, {
       where: { usuario_id : object['idUsuario'] }
   }).then(function() {
         res.status(200).json({ok: true});
   }).catch(function(err) {
         res.status(500).json({error: err});
   });

   models.Telefono.update({
       telefono: object['telefonoMed']
     }, {
       where: { usuario_id : object['idUsuario'] }
   }).then(function() {
         res.status(200).json({ok: true});
   }).catch(function(err) {
         res.status(500).json({error: err});
   });
};

// modifica pasword
exports.modificaPassword = function(object, req, res) {
  models.Usuario.update({
      password: object['passoMed'],
      correo: object['correoMed']
    }, {
        where: { usuario_id : object['idUsuario'] }
  });
};
