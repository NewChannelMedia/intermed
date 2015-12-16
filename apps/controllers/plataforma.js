var models = require( '../models' );
module.exports = {
  plataform2: function( req, res , callback){
    if( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      var concatenando2 = "", conca = "", c = "", catalogo = "", name = "", palabra = "";
      var todo = "";
      models.Usuario.findOne({
        where:{id:usuario_id},
        attributes:['id'],
        include:[{
          model: models.Direccion,
          attributes:['nombre'],
          include:[{
            model: models.Municipio,
            attributes:['municipio'],
            include:[{
              model: models.Estado,
              attributes:['estado']
            }]
          }]
        },{
          model: models.Medico,
          attributes:['id'],
          include:[{
            model: models.MedicoEspecialidad,
            attributes:['especialidad_id'],
            attributes:['id'],
            include:[{
              model: models.Especialidad,
              attributes:['especialidad']
            }]
          },{
            model: models.Padecimiento,
            attributes:['id','padecimiento']
          }]
        },{
          model: models.CatalogoServicios,
          attributes:['concepto']
        },{
          model: models.DatosGenerales,
          attributes:['nombre','apellidoP','apellidoM']
        },{
          model: models.Palabras,
          attributes:['palabra']
        }]
      }).then(function(usuario){
        if( usuario.Direccions[0] ){
          concatenando2+= usuario.Direccions[0].Municipio.Estado.estado+','+usuario.Direccions[0].Municipio.municipio+','+usuario.Direccions[0].nombre+',';
        }
        for( var i in usuario.Medico.MedicoEspecialidads ){
          conca += usuario.Medico.MedicoEspecialidads[i].Especialidad.especialidad+',';
        }
        for( var i in usuario.Medico.Padecimientos ){
          c += usuario.Medico.Padecimientos[i].padecimiento+',';
        }
        for( var i in usuario.CatalogoServicios ){
          catalogo += usuario.CatalogoServicios[i].concepto+',';
        }
        if( usuario.DatosGenerale ){
          name += usuario.DatosGenerale.nombre+" "+usuario.DatosGenerale.apellidoP+" "+usuario.DatosGenerale.apellidoM+',';
        }
        for( var i in usuario.Palabras ){
          palabra += usuario.Palabras[i].palabra+',';
        }
        todo = name+concatenando2+conca+c+palabra+catalogo;
        callback(todo);
      });
    }
  }
}
