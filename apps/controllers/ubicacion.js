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

exports.ObtieneDirecciones = function (req, res) {
    models.Direccion.findAll().then(function (datos) {
        res.send(datos);
    });
};

exports.obtieneEstados = function (req, res) {
    models.Estado.findAll().then(function (datos) {
        res.send(datos);
    });
};

exports.obtieneCiudades = function (object, req, res) {
  models.Municipio.findAll({
    where:{estado_id: object.estado_id},
    order: ['municipio'],
    attributes: ['id','municipio_id', 'municipio']
  }).then(function(ciudades){
    res.send({
        'municipio': ciudades
    });
  });
};

exports.encontrarPorCP = function (object, req, res) {
    console.log("LOCALIDAD ID: "+object.localidad_id);
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
  console.log("ESTADO: "+object.estado_id+"\n"+"municipio_id "+object.municipio_id);
  models.Localidad.findAll({
    where:{
      estado_id:object.estado_id,
      municipio_id: object.municipio_id
    },
    order:['localidad'],
    attributes:['id','localidad']
  }).then( function(municipios){
    res.send({
        'municipios': municipios
    });
  });
};

exports.nuevaUbicacion = function (objects, req, res) {
    var estados;

    console.log('entro');

    models.Estado.findAll().then(function (datos) {
        estados = datos;
    });

    models.Direccion.findOne({
        where: {
            id: req.query.idDireccion
        },
        include: [
         {
             model: models.Municipio,
             include: [{
                 model: models.Estado
             }]
         },
         {
             model: models.Localidad
         }
        ]
    }).then(function (datos) {
        res.render('ubicacion', {
            title: 'Editar Ubicacion',
            estados: estados,
            direccion: datos,
            usuario_id: 1
        })
    });


};

exports.registrarUbicacion = function (objects, req, res) {
    if (objects.idDireccion=='') {
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
    } else {
        models.Direccion.update({
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
        }, {
            where: {
                id: objects.idDireccion
            }
        }).then(function (datos) {
            res.status(200).json({
                ok: true
            });

        }).catch(function (err) {
            res.status(500).json({
                error: err
            });
        });
    }
};

exports.horarios = function (objects, req, res) {
    var id = 48;
    var resultado = [];
    models.Horarios.findAll({
        where: {
            direccion_id: id
        },
        attributes: ['dia', 'horaInicio', 'horaFin'],
    }).then(function (datos) {

        var horaInicio;
        var horaFin;
        //se usa hardcode en la fecha, la fecha debe de ser lunes
        for (i = 0; i <= datos.length - 1; i++) {
            switch (datos[i].dataValues.dia) {
                case 0: //domingo
                    horaInicio = '2015-11-08 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-08 ' + datos[i].dataValues.horaFin;
                    break;
                case 1: //lunes
                    horaInicio = '2015-11-02 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-02 ' + datos[i].dataValues.horaFin;
                    break;
                case 2: //martes
                    horaInicio = '2015-11-03 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-03 ' + datos[i].dataValues.horaFin;
                    break;
                case 3: //miercoles
                    horaInicio = '2015-11-04 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-04 ' + datos[i].dataValues.horaFin;
                    break;
                case 4: //jueves
                    horaInicio = '2015-11-05 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-05 ' + datos[i].dataValues.horaFin;
                    break;
                case 5: //viernes
                    horaInicio = '2015-11-06 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-06 ' + datos[i].dataValues.horaFin;
                    break;
                case 6: //sabado
                    horaInicio = '2015-11-07 ' + datos[i].dataValues.horaInicio;
                    horaFin = '2015-11-07 ' + datos[i].dataValues.horaFin;
                    break;
            };

            var horario = {
                title: datos[i].dataValues.horaInicio + ' - ' + datos[i].dataValues.horaFin,
                start: horaInicio,
                end: horaFin
            };
            resultado.push(horario);
        };

        res.render('horarios', {
            title: 'Horarios',
            direccion_id: 48,
            horarios: JSON.stringify(resultado)
        });
    });
};

exports.registrarHorarios = function (objects, req, res) {
    //eliminar registros anteriores
    var continuarRegistro = true;
    var mensajeError;

    models.Horarios.destroy({
        where: {
            direccion_id: 48
        }
    }).then(function () {
        continuarRegistro = true;
    }).catch(function (err) {
        continuarRegistro = false;
        mensajeError = err;
    });

    if (continuarRegistro) {
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
            usuario_id: 1
        },
        attributes: ['id', 'nombre', 'latitud', 'longitud', 'calle', 'numero', 'calle1','calle2'],
        include: [
          {
              model: models.Municipio,
              attributes: ['municipio'],
              include: [{
                  model: models.Estado,
                  attributes: ['estado'],
              }],
          }]
    }).then(function (datos) {
        res.render('ubicacionobtener', {
            title: 'Direcciones',
            usuario_id: 1,
            direccion: datos
        });
    }).catch(function (err) {
        res.status(500).json({
            error: err
        })
    });
};

exports.horariosObtener = function (objects, req, res) {
    models.Horarios.findOne({
        where: {
            usuario_id: 1
        },
        attributes: ['id', 'nombre', 'latitud', 'longitud', 'calle', 'numero'],
        include: [
          {
              model: models.Municipio,
              attributes: ['municipio'],
              include: [{
                  model: models.Estado,
                  attributes: ['estado'],
              }],
          }]
    }).then(function (datos) {
        res.render('ubicacionobtener', {
            title: 'Direcciones',
            usuario_id: 1,
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
