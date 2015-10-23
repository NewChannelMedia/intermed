var models = require( '../models' );
exports.contactosRecomendados = function(req, res){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    //carga de los modelo
    models.MedFavColegas.findAll({
      where:{usuario_id:usuario_id},
      include:[{
        model:models.Paciente,
        include:[{
          model:models.Usuario,
          attributes:['urlFotoPerfil'],
          include:[{
            model:models.DatosGenerales,
            attributes:['nombre','apellidoP','apellidoM']
          }]
        }]
      }]
    }).then(function(datos){
      res.send(datos);
    });
  }
};
//exportar los medicos
exports.medicosContacto = function( req, res ){
  if ( req.session.passport.user && req.session.passport.user.id > 0 ){
    var usuario_id = req.session.passport.user.id;
    models.Medico.findAll({
      where:{id:req.body.idMedico},
      include:[{
        model:models.Usuario,
        attributes:['usuarioUrl','urlFotoPerfil'],
        include:[{
          model:models.DatosGenerales,
          attributes:['nombre','apellidoP','apellidoM']
        }]
      }]
    }).then(function(encontrado){
      res.send(encontrado);
    });
  }
};
