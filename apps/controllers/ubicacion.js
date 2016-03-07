var models = require('../models');

exports.index = function (req, res) {
  try{
    res.render('especialidades/index', {
        title: 'Especialidades'
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.mostrar = function (req, res) {
  try{
    models.Especialidades.findAll().then(function (datos) {
        res.render('registrado', {
            title: 'REgistrado'
        });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneTelefonos = function (object,req, res) {
  try{
    models.Telefono.findAll({
      where: {
        direccion_id: object.direccion_id
      }
    }).then(function (datos) {
        res.send(datos);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.ObtieneDirecciones = function (req, res) {
  try{
    models.Direccion.findAll().then(function (datos) {
        res.send(datos);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneEstados = function (object, req, res) {
  try{
    models.Estado.findAll().then(function (datos) {
        res.send(datos);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneCiudades = function (object, req, res) {
  try{
    models.Municipio.findAll({
      where:{estado_id: object.estado_id},
      order: ['municipio'],
      attributes: ['id','municipio_id', 'municipio']
    }).then(function(ciudades){
      res.send({
          'municipio': ciudades
      });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.encontrarPorCP = function (object, req, res) {
  try{
    models.Localidad.findOne({
        where: {
            id: object.localidad_id
        },
        attributes: ['CP']
    }).then(function (localidad) {
        res.send(localidad);
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneLocalidades = function (object, req, res) {
  try{
    models.Municipio.findOne({
      where: {
        id: object.municipio_id
      }
    }).then(function(municipio){
      if (municipio){
        models.Localidad.findAll({
          where:{
            estado_id:object.estado_id,
            municipio_ant_id: municipio.municipio_id
          },
          order:['localidad'],
          attributes:['id','localidad']
        }).then( function(municipios){
          res.send({
              'municipios': municipios
          });
        });
      } else {
        res.send({
            'success': false
        });
      }
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.nuevaUbicacion = function (objects, req, res) {
  try {
    var estados;

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
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.registrarUbicacion = function (objects, req, res) {
  try{
    if (req.session.passport.user){
      if (objects.principal == 1){
        models.Direccion.update({
          principal:0
        },{
          where: {
            usuario_id: req.session.passport.user.id,
            principal: 1
          }
        });
      }
      if (objects.idDireccion=='') {
          models.Direccion.create({
              calle: objects.calleUbi,
              numero: objects.numeroUbi,
              numeroInt: objects.numeroIntUbi,
              calle1: objects.calle1Ubi,
              calle2: objects.calle2Ubi,
              principal: objects.principal,
              nombre: objects.nombreUbi,
              usuario_id: req.session.passport.user.id,
              estado_id: objects.slc_estados,
              localidad_id: objects.slc_colonias,
              municipio_id: objects.slc_ciudades,
              cp: objects.cpUbi,
              latitud: objects.latitud,
              longitud: objects.longitud
          }).then(function (datos) {
              if (datos){
                if (objects.telefonosNuevos){
                  objects.telefonosNuevos.forEach(function(record){
                    var numVar = record.numero.split("-");
                    var claveRegion = '';
                    var numero = '';
                    if (numVar.length==3){
                      claveRegion = numVar[0];
                      numero = numVar[1] + ' ' + numVar[2];
                    } else {
                      numero = numVar[0] + ' ' + numVar[1];
                    }

                    models.Telefono.create({
                      tipo:record.tipo,
                      claveRegion: claveRegion,
                      numero:numero,
                      ext:record.ext,
                      direccion_id: datos.id
                    });
                  });
                }
              }
              res.status(200).json({
                  success: true,
                  datos: datos,
                  ubicacion_id: datos.id
              });
          });
      } else {
        console.log('UBICACION_ID');
          models.Direccion.update({
              calle: objects.calleUbi,
              numero: objects.numeroUbi,
              numeroInt: objects.numeroIntUbi,
              calle1: objects.calle1Ubi,
              calle2: objects.calle2Ubi,
              principal: objects.principal,
              nombre: objects.nombreUbi,
              usuario_id: req.session.passport.user.id,
              estado_id: objects.slc_estados,
              localidad_id: objects.slc_colonias,
              municipio_id: objects.slc_ciudades,
              cp: objects.cpUbi,
              latitud: objects.latitud,
              longitud: objects.longitud
          }, {
              where: {
                  id: objects.idDireccion
              }
          }).then(function (datos) {
              if (datos){
                if (objects.telefonosActualizar){
                  var noEliminarId = [];
                  objects.telefonosActualizar.forEach(function(record){
                    noEliminarId.push(record.id);
                  });
                  models.Telefono.destroy({
                    where:{
                      id: {$notIn: noEliminarId},
                      direccion_id: objects.idDireccion
                    }
                  }).then(function(){
                    objects.telefonosActualizar.forEach(function(record){
                      var numVar = record.numero.split("-");
                      var claveRegion = '';
                      var numero = '';
                      if (numVar.length==3){
                        claveRegion = numVar[0];
                        numero = numVar[1] + ' ' + numVar[2];
                      } else {
                        numero = numVar[0] + ' ' + numVar[1];
                      }
                      models.Telefono.update({
                        tipo:record.tipo,
                        claveRegion: claveRegion,
                        numero: numero,
                        ext:record.ext
                      },{
                        where: {
                          id: record.id
                        }
                      });
                    });
                  });
                }
                if (objects.telefonosNuevos){
                  objects.telefonosNuevos.forEach(function(record){
                    var numVar = record.numero.split("-");
                    var claveRegion = '';
                    var numero = '';
                    if (numVar.length==3){
                      claveRegion = numVar[0];
                      numero = numVar[1] + ' ' + numVar[2];
                    } else {
                      numero = numVar[0] + ' ' + numVar[1];
                    }

                    models.Telefono.create({
                      tipo:record.tipo,
                      claveRegion: claveRegion,
                      numero:numero,
                      ext:record.ext,
                      direccion_id: objects.idDireccion
                    });
                  });
                }
              }
              res.status(200).json({
                  success: true,
                  ubicacion_id: objects.idDireccion
              });

          });
      }
    } else {
        res.status(200).json({
            success: false,
            error: 1
        });
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.horarios = function (objects, req, res) {
  try{
    var id = 1;
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
            direccion_id: id,
            horarios: JSON.stringify(resultado)
        });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.registrarHorarios = function (objects, req, res) {
  try{
    //eliminar registros anteriores
    if (req.session.passport && req.session.passport.user){
      models.Horarios.destroy({
          where: {
              direccion_id: objects.direccion_id
          }
      }).then(function () {
          models.Horarios.bulkCreate(JSON.parse(objects.horariosUbi)).then(
            function () {
              res.status(200).json({
                  success: true
              });
            })
      });
    } else{
      res.status(200).json({
        success: false,
        error: 1
      });
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.ubicacionObtener = function (objects, req, res) {
  try{
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
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.horariosObtener = function (objects, req, res) {
  try{
    var resultado = [];
    models.Horarios.findAll({
        where: {
            direccion_id: objects.direccion_id
        },
        attributes: ['dia', 'horaInicio', 'horaFin']
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
                start: horaInicio,
                end: horaFin
            };
            resultado.push(horario);
        };

        res.status(200).json({
            direccion_id: objects.direccion_id,
            horarios: resultado
        });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.agregaDireccion = function(object, req, res) {
  try{
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
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.actualizaDireccion = function(object, req, res) {
  try{
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
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.borraDireccion = function(object, req, res) {
  try{
    models.Direccion.destroy({
      where : {id : object.id}
    }).then(function(medico) {
          res.status(200).json({ok: true});
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.obtieneUbicacion = function(object, req, res) {
  try{
    if (req.session.passport.user){
      var where = {usuario_id : req.session.passport.user.id};
      var tipo = "findAll";
      if (object.ubicacion_id && object.ubicacion_id >0){
        where = {id : object.ubicacion_id};
        tipo = "findOne";
      }

      models.Direccion[tipo]({
          where : where,
          include: [
            {
                model: models.Municipio,
                attributes: ['id','municipio'],
                include: [{
                    model: models.Estado,
                    attributes: ['id','estado'],
                }],
            },
            {
                model: models.Localidad,
                attributes: ['id','localidad','CP'],
                include: [{
                    model: models.TipoLocalidad,
                    attributes: ['tipo'],
                }],
            },
            {
                model: models.Telefono
            }],
            order: [['principal','DESC']]
      }).then(function(datos) {
            res.status(200).json({success:true,result: datos});
      });
    } else {
          res.status(200).json({success:false,error: 1});
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}


exports.eliminaUbicacion = function(object, req, res){
  try{
    models.Telefono.destroy({
      where:{
        direccion_id: object.idDireccion
      }
    }).then(function (datos) {
      models.Direccion.destroy({
        where:{ id: object.idDireccion}
      }).then(function(result){
          res.status(200).json({success: true,result: result});
      });
    });
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}

exports.registrarubicacionPaciente = function (object, req, res){
  try{
    if (req.session.passport.user){
      object['usuario_id'] =req.session.passport.user.id;
      models.Direccion.destroy({
        where: {
          usuario_id: req.session.passport.user.id
        }
      }).then(function(){
        models.Direccion.create(object).then(function(result){
            res.status(200).json({success: true,result: result});
        });
      });
    } else {
        res.status(200).json({success: false});
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}
