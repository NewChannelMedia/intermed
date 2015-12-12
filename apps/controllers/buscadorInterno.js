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

    var continuar = true;
    if (object.get && (object.busqueda.length == 0 || object.busqueda[0] == "")){
      continuar = false;
    }

    if (continuar){
      //if (busqueda.length > 0 && busqueda[0] != ''){
          if (object.pacientes>0){
            busqueda.forEach(function(result){
              if (result != ""){
                where.push(models.sequelize.or(
                    {nombre: {$like: '%'+ result +'%'}},
                    {apellidoP: {$like: '%'+ result +'%'}},
                    {apellidoM: {$like: '%'+ result +'%'}}
                ));
              }
            });
            whereTipoUsuario = {tipoUsuario: 'P'};
          } else {
            busqueda.forEach(function(result){
              if (result != ""){
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
              }
            });
            if (! whereTipoUsuario.tipoUsuario){
              whereTipoUsuario = {tipoUsuario: {$notLike: 'P'}};
            }
          }
      //}

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
          if (object.get){
            res.render('buscador',{resultado:datos});
          } else {
            res.send(JSON.parse(JSON.stringify(datos)));
          }
        });
    } else {
      res.render('buscador');
    }
}


exports.buscadorContactos = function ( object, req, res ) {
    var where = '';
    var whereTipoUsuario = new Array();
    var busqueda = object.busqueda;

    if (busqueda.length > 0 && busqueda[0] != ''){
      where = [];
      busqueda.forEach(function(result){
        if (!(result.toLowerCase() in busquedaEspecial)){
          where.push(models.sequelize.or(
                {nombre: {$like: '%'+ result +'%'}},
                {apellidoP: {$like: '%'+ result +'%'}},
                {apellidoM: {$like: '%'+ result +'%'}}
            ));
        } else {
          if (busquedaEspecial[result] == "medico"){
            whereTipoUsuario = {medico_id: {$ne: null}};
          }
        }
      });
    }

    var tipo = 'Medico';
    if (object.pacientes){
      tipo = 'Paciente';
    }

    models.MedicoFavorito.findAll( {
      where: models.sequelize.and(
          {
            usuario_id: req.session.passport.user.id,
            aprobado: 1,
            mutuo: 1
          },
          whereTipoUsuario
        ),
      include: [
        {
          model: models[tipo],
          attributes: [ 'id' ],
          include: [
            {
              model: models.Usuario,
              attributes: [ 'id', 'usuarioUrl', 'urlFotoPerfil' ],
              include: [ {
                model: models.DatosGenerales, where: where, attributes: ['nombre','apellidoP','apellidoM']
              } ]
            }
          ]
        }
    ],
    limit: 10
    } ).then( function ( result ) {
      res.send(JSON.parse(JSON.stringify(result)));
    } );
}
