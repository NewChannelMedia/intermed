var models = require( '../models' );

var busquedaEspecial = {
  'dr':'medico',
  'dr.':'medico',
  'doctor':'medico',
  'doctora':'medico'
}

exports.buscar = function ( object, req, res ) {
    var where = new Array();
    var whereTipoUsuario = new Array();
    var busqueda = object.busqueda;

    if (busqueda.length > 0 && busqueda[0] != ''){
      busqueda.forEach(function(result){
        if (!(result.toLowerCase() in busquedaEspecial)){
          where.push(models.sequelize.or(
                {nombre: {$like: '%'+ result +'%'}},
                {apellidoP: {$like: '%'+ result +'%'}},
                {apellidoM: {$like: '%'+ result +'%'}}
            ));
        } else {
          if (busquedaEspecial[result] == "medico"){
            whereTipoUsuario = {tipoUsuario: 'M'};
          }
        }
      });
    }

    models.Usuario.findAll( {
        attributes: ['id','usuarioUrl','urlFotoPerfil'],
        include: [ {
          model: models.DatosGenerales, where: where,attributes: ['nombre','apellidoP','apellidoM']
              }, {
          model: models.Medico,attributes: ['id']
        }],
        where: whereTipoUsuario,
        limit: 10
      } )
      .then( function ( datos ) {
        res.send(JSON.parse(JSON.stringify(datos)));
      });
}
