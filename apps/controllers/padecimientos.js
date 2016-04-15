var models = require( '../models' );

exports.obtienePadecimientosMedico = function ( objects, req, res ) {
  try{
    models.Medico.findAll( {
      include: [ {
        model: models.Padecimiento
      } ],
      where: {
        id: objects.id
      }
    } ).then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraPadecimientosMedico = function ( objects, req, res ) {
  try{
    models.MedicoPadecimiento.destroy( {
      where: {
        id: objects.id
      }
    } ).then( function ( datos ) {
      res.send( {
        ok: true
      } )
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.agregaPadecimientosMedico = function ( objects, req, res ) {
  try{
    models.MedicoPadecimiento.create( {
      medico_id: objects.idMedico,
      padecimiento_id: objects.idPadecimiento,
    } ).then( function ( datos ) {
      res.send( datos )
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
