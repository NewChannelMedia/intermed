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
        usuario_id: usuario_id
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
      var todo = {
        concepto:req.body.concepto,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio),
        duracion: req.body.duracion
      }
      models.CatalogoServicios.update(todo,{
        where:{id:req.body.id},
      }).then(function(modificado){
        res.send(modificado);
      });
    }
  }
}
