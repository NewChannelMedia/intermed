var models = require( '../models' );
module.exports = {
  searchServices: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.CatalogoServicios.findAll({
        where:{ usuario_id:usuario_id},
        attributes:['id','concepto','descripcion','precio','duracion']
      }).then(function(resultado){
        res.send(resultado);
      });
    }
  },
  addServices: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.CatalogoServicios.create({
        concepto: req.body.concepto,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio),
        duracion: req.body.duracion,
        usuario_id: usuario_id,
        direccion_id: parseInt(req.body.otroID)
      }).then(function(catalogo){
        if( catalogo != null ){
          res.send(true);
        }else{
          res.send(false);
        }
      });
    }
  },
  deleteServicio: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.CatalogoServicios.destroy({
        where:{id:req.body.id}
      }).then(function(catalogo){
        res.sendStatus(catalogo);
      });
    }
  },
  updateServices: function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      var todo;
      var tipo = "";
      tipo = req.body.tipo;
      switch( tipo ){
        case "concepto":todo = {concepto: req.body.valor};break;
        case "descripcion":todo = { descripcion: req.body.valor }; break;
        case "precio":todo = { precio: parseFloat( req.body.valor ) }; break;
        case "duracion":todo = { duracion: req.body.valor }; break;
      }
      models.CatalogoServicios.update(todo,{
        where:{id:req.body.id,direccion_id:req.body.otroID},
      }).then(function(modificado){
        res.send(modificado);
      });
    }
  },
  traerServiciosPorMedico: function (object, req, res){
    models.CatalogoServicios.findAll({
      where:{ usuario_id:object.usuario_id},
      attributes:['concepto'],
      group: 'concepto',
      order: [['concepto','ASC']]
    }).then(function(resultado){
        res.status(200).json({
          success: true,
          result: resultado
        });
    });
  },
  traerUbicacionesPorServicio: function (object, req, res){
    models.Direccion.findAll({
      where:{
        usuario_id:object.usuario_id
      },
      order: [['principal','DESC'],[['nombre','ASC']]],
      attributes:['id','nombre','calle','numero','numeroInt'],
      include: [
        {
          model: models.CatalogoServicios,
          where: {
            concepto: object.servicio
          },
          attributes:['id','concepto','descripcion','precio','duracion'],
        },
        {
          model: models.Localidad
        },
        {
          model: models.Municipio,
          include: [
            { model: models.Estado }
          ]
        }
      ]
    }).then(function(resultado){
        res.status(200).json({
          success: true,
          result: resultado
        });
    });
  },
  traerDetallesServicioUbicacion: function (object, req, res){
    models.CatalogoServicios.findOne({
      where: {
        usuario_id:object.usuario_id,
        concepto: object.servicio,
        direccion_id: object.ubicacion
      },
      attributes:['id','concepto','descripcion','precio','duracion']

    }).then(function(resultado){
        res.status(200).json({
          success: true,
          result: resultado
        });
    });
  }
}
