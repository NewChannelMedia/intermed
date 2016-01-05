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
      var todo;
      if( req.body.tipo = "precio" ){
        var tipo = req.body.tipo;
        todo = {
          tipo: parseFloat(req.body.valor)
        }
      }else{
        var tipo = req.body.tipo;
        todo = {
          tipo: req.body.valor
        }
      }
      console.log("TODO: "+JSON.stringify(todo));
      models.CatalogoServicios.update(todo,{
        where:{id:req.body.id},
      }).then(function(modificado){
        res.send(modificado);
      });
    }
  }
}
