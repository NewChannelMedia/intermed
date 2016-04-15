var models = require( '../models' );

exports.index = function ( req, res ) {
  try{
    res.render( 'especialidades/index', {
      title: 'Especialidades'
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.mostrar = function ( req, res ) {
  try{
    models.Especialidades.findAll().then( function ( datos ) {
      res.render( 'especialidades/mostrar', {
        title: 'Especialidades',
        datos: datos
      } );
    } );

  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
