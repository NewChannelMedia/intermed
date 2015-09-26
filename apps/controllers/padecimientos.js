var models = require( '../models' );

exports.obtienePadecimientosMedico = function ( objects, req, res ) {

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
};

exports.borraPadecimientosMedico = function ( objects, req, res ) {
  models.MedicoPadecimiento.destroy( {
    where: {
      id: objects.id
    }
  } ).then( function ( datos ) {
    res.send( {
      ok: true
    } )
  } );
};

exports.agregaPadecimientosMedico = function ( objects, req, res ) {
  models.MedicoPadecimiento.create( {
    medico_id: objects.idMedico,
    padecimiento_id: objects.idPadecimiento,
  } ).then( function ( datos ) {
    res.send( datos )
  } );
};
