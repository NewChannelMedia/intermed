var models = require('../models');

exports.index = function (req, res) {
    res.render('especialidades/index', {
        title: 'Especialidades'
    });
};

exports.mostrar = function (req, res) {
    models.Especialidades.findAll().then(function (datos) {
        res.render('especialidades/mostrar', {
            title: 'Especialidades',
            datos: datos
        });
    });
};

exports.ObtieneTelefonos = function (req, res) {
    models.Telefono.findAll().then(function (datos) {
        res.send(datos);
    });
};

exports.obtieneDirecciones = function(object, req, res) {
  models.Direccion.findAll({
      where : {usuario_id : object.id}
  }).then(function(datos) {
        res.send(datos);
  });
}

exports.obtieneEstados = function(req, res) {
  models.Estado.findAll().then(function(datos) {
    res.sende(datos);
  });
};

exports.obtieneCiudades = function (object, req, res) {
    models.Municipio.findAll({
        where: {
            estado_id: object.estado_id
        },
        order: ['municipio'],
        attributes: ['municipio_id', 'municipio']
    }).then(function (ciudades) {
        res.send({
            'municipio': ciudades
        });
    });
};

exports.encontrarPorCP = function (object, req, res) {
    models.Localidad.findOne({
        where: {
            id: object.localidad_id
        },
        attributes: ['CP']
    }).then(function (localidad) {
        res.send({
            'cp': localidad.CP
        });
    });
};

exports.obtieneLocalidades = function (object, req, res) {

    models.Localidad.findAll({
        where: {
            estado_id: object.estado_id,
            municipio_id: object.municipio_id
        },
        order: ['localidad'],
        attributes: ['id', 'localidad']
    }).then(function (localidades) {
        res.send({
            'localidades': localidades
        });
    });
};

exports.ubicacion = function (objects, req, res) {
    models.Estado.findAll().then(function (datos) {
        res.render('ubicacion', {
            title: 'Ubicaciones',
            estados: datos,
            usuario_id: 6
        });
    });
};

exports.registrarUbicacion = function (objects, req, res) {
    console.log(objects.slc_colonias);
    console.log(objects.slc_ciudades);
    models.Direccion.create({
        ubicacionGM: 'object.ubicacionGM',
        calle: objects.calleUbi,
        numero: objects.numeroUbi,
        calle1: objects.calle1Ubi,
        calle2: objects.calle2Ubi,
        principal: 0,
        nombre: objects.nombreUbi,
        horarioInicio: 'object.horarioInicio',
        horarioFin: 'object.horarioFin',
        dias: 'objects.dias',
        usuario_id: objects.usuario_id,
        // institucion_id: '0',
        localidad_id: objects.slc_colonias,
        municipio_id: objects.slc_ciudades,
        latitud: objects.latitud,
        longitud: objects.longitud
    }).then(function (datos) {
        res.status(200).json({
            ok: true
        });

    }).catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};

exports.horarios = function (objects, req, res) {
    res.render('ubicacion', {
        title: 'Horarios',
        idDireccion: 39
    });
};

exports.registrarHorarios = function (objects, req, res) {
    //eliminar registros anteriores
    var continuarRegistro = true;
    var mensajeError;
    models.Horarios.destroy({
        where: {
            idDireccion: objects.idDireccion
        }
    }).then(function () {
        continuarRegistro = true;
    }).catch(function (err) {
        continuarRegistro = false;
        mensajeError = err;
    });

    if (continuarRegistro) {
        console.log(objects);

        models.Horarios.bulkCreate(JSON.parse(objects.horariosUbi)).then(function () {
            continuarRegistro = true;
        }).catch(function (err) {
            continuarRegistro = false;
            mensajeError = err;
        });

        //
        if (continuarRegistro) {
            res.status(200).json({
                ok: true
            });
        };
    } else {
        res.status(500).json({
            error: err
        });
    };
};

exports.ubicacionObtener = function (objects, req, res) {
    models.Direccion.findAll({
        where: {
            usuario_id: 6
        },
        include: [
          {
              model: models.Municipio,
              include: [{
                  model: models.Estado
              }]
          }]
    }).then(function (datos) {
        res.render('ubicacionobtener', {
            title: 'Direcciones',
            usuario_id:1,
            direccion: datos
        });
    }).catch(function (err) {
        res.status(500).json({
            error: err
        })
    });
};

exports.agregaDireccion = function(object, req, res) {
    models.Direccion.create({
      calle: object.calle,
      nombre: object.nombre,
      numero: object.numero,
      calle1: object.calle1,
      calle2: object.calle2,
      localidad_id: object.colonia,
      municipio_id: object.ciudad,
      principal: 0,
      longitud: object.longitud,
      latitud: object.latitud,
    usuario_id: id
  }).then(function(medico) {
        res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
}

exports.actualizaDireccion = function(object, req, res) {
    models.Direccion.update({
      calle: object.calle,
      numero: object.numero,
      nombre: object.nombre,
      calle1: object.calle1,
      calle2: object.calle2,
      localidad_id: object.colonia,
      municipio_id: object.ciudad,
      principal: object.principal,
      longitud: object.longitud,
      latitud: object.latitud,
      usuario_id: id
    },{ where : {id : object.id}
  }).then(function(medico) {
        res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
}

exports.borraDireccion = function(object, req, res) {
    models.Direccion.destroy({
      where : {id : object.id}
  }).then(function(medico) {
        res.status(200).json({ok: true});
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
}

exports.obtieneUbicacion = function(object, req, res) {
  models.Direccion.findOne({
      where : {id : object.id}
  }).then(function(datos) {
        res.send(datos);
  }).catch(function(err) {
        res.status(500).json({error: err});
  });
}
