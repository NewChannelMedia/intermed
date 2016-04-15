var models = require( '../models' );

exports.obtieneEstados = function ( req, res ) {
  try{
    models.Estado.findAll().then( function ( datos ) {
      res.sender( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
