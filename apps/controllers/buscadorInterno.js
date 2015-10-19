var models = require( '../models' );

exports.buscar = function ( object, req, res ) {
    var where = '';

    var busqueda = object.busqueda.split(" ");

    var where = new Array();
    if (busqueda.length > 0 && busqueda[0] != ''){
      busqueda.forEach(function(result){
        where.push(models.sequelize.or(
              {nombre: {$like: '%'+ result +'%'}},
              {apellidoP: {$like: '%'+ result +'%'}},
              {apellidoM: {$like: '%'+ result +'%'}}
          ));
      });
    }

    models.Usuario.findAll( {
        attributes: ['id','usuarioUrl','urlFotoPerfil'],
        include: [ {
          model: models.DatosGenerales, where: where,attributes: ['nombre','apellidoP','apellidoM']
              }, {
          model: models.Medico,attributes: ['id']
        }],
        limit: 10
      } )
      .then( function ( datos ) {
        res.send(JSON.parse(JSON.stringify(datos)));
      });
}
