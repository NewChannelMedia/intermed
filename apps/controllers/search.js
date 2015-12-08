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
    models.Usuario.findAll({
      where:{tipoUsuario:'M'},
      attributes:['urlFotoPerfil'],
      include:[{
        model: models.Medico,
        attributes:['id'],
        include:[{
          model: models.Padecimiento,
          where:{ id: req.body.padecimiento}
        },{
          model: models.MedicoEspecialidad,
          where:{ especialidad_id: req.body.especialidad},
          attributes:['id','subEsp'],
          include:[{
            model: models.Especialidad,
            attributes:['id','especialidad']
          },{
            model: models.DatosGenerales,
            where:{nombre:"%"+req.body.nombre+"%"},
            attributes:['nombre','apellidoP','apellidoM']
          },{
            model: models.Direccion,
            attributes:['calle','numero','nombre'],
            include:[{
              model: models.Municipio,
              attributes:['municipio'],
              include:[{
                model: models.Estado,
                attributes:['estado']
              }]
            }]
          }]
        }]
      }]
    }).then(function(usuarios){
      res.send(usuarios);
    });
  }
}
