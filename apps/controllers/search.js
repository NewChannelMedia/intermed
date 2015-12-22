var models = require( '../models' );

module.exports = {
  cargaEstados: function( req, res ){
    models.Estado.findAll({
      attributes:['id','estado']
    }).then(function(estados){
      res.send(estados);
    });
  },
  cargarCiudades: function(req, res ){
    models.Municipio.findAll({
      where:{estado_id:req.body.id},
      attributes:['id','municipio']
    }).then(function(municipios){
      res.send(municipios);
    });
  },
  cargaEspecialidades: function( req, res ){
    models.Especialidad.findAll({
      attributes:['id','especialidad']
    }).then(function(especialidades){
      res.send(especialidades);
    });
  },
  cargaPadecimiento: function( req, res ){
    models.Padecimiento.findAll({
      attributes:['id','padecimiento']
    }).then(function(padecimientos){
      res.send(padecimientos);
    });
  },
  findData: function( req, res ){
    var pagina = req.body.pagina;
    var tipoBusqueda = req.body.tipoBusqueda;
    var medico = false;
    var institucion = false;
    var nombre = req.body.nombre;
    var aseguradora = req.body.aseguradora;
    var institucion = req.body.institucion;
    var especialidad = req.body.especialidad
    var estado = parseInt(req.body.estado);
    var municipio = parseInt(req.body.municipio);
    var padecimiento = req.body.padecimiento;

    var condicionNombre = '';
    var condicionEspecialidad = '';
    var condicionEstado = '';
    var condicionMunicipio = '';
    var condicionPadecimiento = '';
    var condicionAseguradora = '';
    var condicionInstitucion = '';

    if (tipoBusqueda == 0){
      medico = true;
      institucion = true;
    } else if (tipoBusqueda == 1){
      medico = true;
    } else if (tipoBusqueda == 2){
      institucion = true;
    }

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

    if( municipio >= 1 ){
      condicionMunicipio = {
        id: municipio,
        estado_id: estado
      };
    } else if (estado>=1){
      condicionMunicipio = {
        estado_id: estado
      };
    }

    if(padecimiento && padecimiento.length > 0){
      condicionPadecimiento = {
        padecimiento: {
          $in: padecimiento
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

    if(institucion && institucion.length > 0){
      condicionInstitucion = {
        clinica: {
          $in: institucion
        }
      }
    }

    var limit = 2;
    var offset = limit * (pagina-1);

    if (medico){
      if (pagina == 1){
        models.Usuario.findAll({
          where:{tipoUsuario:'M'},
          attributes:['id'],
          include:[{
            model: models.Medico,
            attributes:['id'],
            include:[{
              model: models.Padecimiento,
              where: condicionPadecimiento
            },{
              model: models.MedicoEspecialidad,
              attributes:['id'],
              include:[{
                model: models.Especialidad,
                attributes:['id'],
                where: condicionEspecialidad
              }]
            },{
              model: models.MedicoAseguradora,
              attributes: ['id'],
              where: condicionAseguradora
            },{
              model: models.MedicoClinica,
              attributes:['id'],
              where: condicionInstitucion
            }]
          },{
            model: models.DatosGenerales,
            where: condicionNombre,
            attributes:['id']
          },{
            model: models.Direccion,
            attributes:['id'],
            include:[{
              model: models.Municipio,
              where: condicionMunicipio,
              attributes:['id'],
              include:[{
                model: models.Estado,
                attributes:['id']
              }]
            }]
          }]
        }).then(function(count){
          buscarMedicos( res,limit,offset, count.length,institucion, condicionNombre, condicionMunicipio,condicionEspecialidad, condicionPadecimiento, condicionAseguradora, condicionInstitucion);
        });
      } else {
        buscarMedicos( res,limit,offset, '',institucion, condicionNombre, condicionMunicipio,condicionEspecialidad, condicionPadecimiento, condicionAseguradora, condicionInstitucion);
      }
    } else {
      buscarInstituciones(res,{},condicionNombre,condicionMunicipio,condicionEspecialidad,condicionPadecimiento);
    }
  },

  cargarEspecialidades: function (object, req, res){
    models.Especialidad.findAll({
      order: [['especialidad','ASC']]
    }).then(function(especialidades){
      res.status(200).send(especialidades);
    });
  },

  cargarPadecimientos: function (object, req, res){
    models.Padecimiento.findAll({
      order: [['padecimiento','ASC']],
      group: 'padecimiento'
    }).then(function(padecimientos){
      res.status(200).send(padecimientos);
    });
  },

  cargarInstituciones: function (object, req, res){
    models.MedicoClinica.findAll({
      order: [['clinica','ASC']],
      group: 'clinica'
    }).then(function(HospitalesYClinicas){
      res.status(200).send(HospitalesYClinicas);
    });
  },

  cargarAseguradoras: function (object, req, res){
    models.MedicoAseguradora.findAll({
      order: [['aseguradora','ASC']],
      group: 'aseguradora'
    }).then(function(aseguradoras){
      res.status(200).send(aseguradoras);
    });
  },

  buscarInstituciones: function (res, usuarios, condicionNombre, condicionEstado, condicionMunicipio, condicionEspecialidad, condicionPadecimiento){
    console.log('Falta buscar instituciones');
    res.send(usuarios);
  }
}

function buscarInstituciones(res, usuarios, condicionNombre, condicionMunicipio, condicionEspecialidad, condicionPadecimiento){
  console.log('Falta buscar instituciones');
  res.send(usuarios);
}

function buscarMedicos( res,limit,offset, count,institucion, condicionNombre, condicionMunicipio,condicionEspecialidad, condicionPadecimiento, condicionAseguradora, condicionInstitucion){
  models.Usuario.findAll({
    where:{tipoUsuario:'M'},
    attributes:['usuarioUrl','urlFotoPerfil'],
    limit: limit,
    offset: offset,
    include:[{
      model: models.Medico,
      attributes:['id'],
      include:[{
        model: models.Padecimiento,
        where: condicionPadecimiento
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
        attributes: ['aseguradora'],
        where: condicionAseguradora
      },{
        model: models.MedicoClinica,
        attributes:['id','clinica'],
        where: condicionInstitucion
      }]
    },{
      model: models.DatosGenerales,
      where:condicionNombre,
      attributes:['nombre','apellidoP','apellidoM']
    },{
      model: models.Direccion,
      attributes:['id','calle','numero','nombre','latitud','longitud'],
      include:[{
        model: models.Municipio,
        where: condicionMunicipio,
        attributes:['id','municipio'],
        include:[{
          model: models.Estado,
          attributes:['id','estado']
        }]
      }]
    }]
  }).then(function(usuarios){
    result = {};
    result.medicos = usuarios;
    result.countmedicos = Math.ceil(count/limit);
    if (institucion){
      buscarInstituciones(res,result,condicionNombre,condicionMunicipio,condicionEspecialidad,condicionPadecimiento);
    }else{
      res.send(result);
    }
  });
}
