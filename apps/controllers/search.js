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
    var especialidad = parseInt(req.body.especialidad);
    var estado = parseInt(req.body.estado);
    var municipio = parseInt(req.body.municipio);
    var padecimiento = parseInt(req.body.padecimiento);
    var nombre = req.body.nombre;
    var condicionNombre;
    var condicionEspecialidad;
    var condicionEstado;
    var condicionMunicipio;
    var condicionPadecimiento;
    if( nombre == "" ){
      condicionNombre = "";
    }else if( nombre != "" ){
      condicionNombre = { nombre:{ $like: "%"+nombre+"%"} }
    }
    if( especialidad == 0 ){
      condicionEspecialidad = "";
    }else if( especialidad >= 1 ){
      condicionEspecialidad = { especialidad_id: especialidad};
    }
    if( estado == 0 ){
      condicionEstado = "";
    }else if( estado >= 1 ){
      condicionEstado = { id: estado };
    }
    if( municipio == 0 ){
      condicionMunicipio = "";
    }else if( municipio >= 1 ){
      condicionMunicipio = {
        id: municipio,
        estado_id: estado
      };
    }
    if( padecimiento == 0 ){
      condicionPadecimiento = "";
    }else if( padecimiento >= 1 ){
      condicionPadecimiento = { id: padecimiento };
    }
    console.log("Nombre: "+JSON.stringify(condicionNombre));
    console.log("Especialidad: "+JSON.stringify(condicionEspecialidad));
    console.log("Estado: "+JSON.stringify(condicionEstado));
    console.log("Municipio: "+JSON.stringify(condicionMunicipio));
    console.log("Padecimiento: "+JSON.stringify(condicionPadecimiento));
    models.Usuario.findAll({
      where:{tipoUsuario:'M'},
      attributes:['usuarioUrl','urlFotoPerfil'],
      include:[{
        model: models.Medico,
        attributes:['id'],
        include:[{
          model: models.Padecimiento,
          where:condicionPadecimiento
        },{
          model: models.MedicoEspecialidad,
          where: condicionEspecialidad,
          attributes:['id','subEsp'],
          include:[{
            model: models.Especialidad,
            attributes:['id','especialidad']
          }]
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
      res.send(usuarios);
    });
  }
}
