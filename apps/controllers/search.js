var models = require( '../models' );

module.exports = {
  cargaEstados: function( req, res ){
    try{
      models.Estado.findAll({
        attributes:['id','estado']
      }).then(function(estados){
        res.send(estados);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },
  cargarCiudades: function(req, res ){
    try{
      models.Municipio.findAll({
        where:{estado_id:req.body.id},
        attributes:['id','municipio']
      }).then(function(municipios){
        res.send(municipios);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarEspecialidades: function (object, req, res){
    try{
      models.Especialidad.findAll({
        order: [['especialidad','ASC']]
      }).then(function(especialidades){
        res.status(200).send(especialidades);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarPadecimientos: function (object, req, res){
    try{
      models.Padecimiento.findAll({
        order: [['padecimiento','ASC']],
        group: 'padecimiento'
      }).then(function(padecimientos){
        res.status(200).send(padecimientos);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarInstituciones: function (object, req, res){
    try{
      models.MedicoClinica.findAll({
        order: [['clinica','ASC']],
        group: 'clinica'
      }).then(function(HospitalesYClinicas){
        res.status(200).send(HospitalesYClinicas);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  cargarAseguradoras: function (object, req, res){
    try{
      models.Aseguradora.findAll({
        order: [['aseguradora','ASC']]
      }).then(function(aseguradoras){
        res.status(200).send(aseguradoras);
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  },

  medico: function (object, req, res){
    var condicionNombre = '';
    var condicionEspecialidad = '';
    var condicionAseguradora = '';

    var nombre = object.nombre;
    var especialidad = object.especialidades;
    var aseguradora = object.aseguradoras;

    if( nombre != "" ){
      condicionNombre = [];
      var nombres = nombre.split(' ');
      nombres.forEach(function(nombre){
        condicionNombre.push(models.sequelize.or(
            models.sequelize.or(
              {nombre: {$like: '% ' + nombre +'%'}},
              {nombre: {$like: nombre +'%'}}
            ),models.sequelize.or(
              {apellidoP: {$like: '% ' + nombre +'%'}},
              {apellidoP: {$like: nombre +'%'}}
            ),models.sequelize.or(
              {apellidoM: {$like: '% ' + nombre +'%'}},
              {apellidoM: {$like: nombre +'%'}}
            )
          ));
      });
    }

    if(especialidad && especialidad.length>0){
      condicionEspecialidad = {
        especialidad: {
          $in: especialidad
        }
      }
    }

    if(aseguradora && aseguradora.length > 0){
      condicionAseguradora = {
        aseguradora: {
          $in: aseguradora
        }
      }
    }

    models.Medico.findAll({
      include: [{
        model: models.Usuario,
        include:[{
          model: models.DatosGenerales,
          attributes:['nombre','apellidoP','apellidoM'],
          where: condicionNombre
        },{
          model: models.Direccion,
          attributes:['id','calle','numero','nombre','latitud','longitud'],
          include:[{
            model: models.Municipio,
            attributes:['id','municipio'],
            include:[{
              model: models.Estado,
              attributes:['id','estado']
            }]
          }],
          where: {
            latitud: {$gte: object.bounds.south ,$lte: object.bounds.north},
            longitud: {$gte: object.bounds.east ,$lte: object.bounds.west}
          }
        }]
      },{
        model: models.Padecimiento
      },{
        model: models.MedicoEspecialidad,
        attributes:['id','subEsp'],
        include:[{
          model: models.Especialidad,
          attributes:['id','especialidad'],
          where: condicionEspecialidad
        }]
      },{
        model: models.MedicoAseguradora,
        include: [{
          model: models.Aseguradora,
          where: condicionAseguradora
        }]
      },{
        model: models.MedicoClinica,
        attributes:['id','clinica']
      }],
      group: 'id',
      attributes:['id','calificacion'],
      order: [['calificacion','DESC']],
      limit: 100
    }).then(function(result){
      res.status(200).json({
        success: true,
        count: result.length,
        result: result
      });
    });
  }


}
