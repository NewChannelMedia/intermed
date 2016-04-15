var models = require( '../models' );

exports.obtieneHospitalesMedico = function ( object, req, res ) {
  try{
    models.Hospital.findAll( {
      where: {
        medico_id: object.id
      }
    } )
    .then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.insertaHospital = function ( object, req, res ) {
  try{
    models.Hospital.create( {
      nombre: object.nombre,
      medico_id: object.idMedico,
      institucion_id: object.idInstitucion
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.actualizaHospitalMedico = function ( object, req, res ) {
  try{
    models.Hospital.update( {
      nombre: object.nombre,
      medico_id: object.idMedico,
      institucion_id: object.idInstitucion
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );¡
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraHospital = function ( object, req, res ) {
  try{
    models.Hospital.destroy( {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneColegiosMedico = function ( object, req, res ) {
  try{
    models.Colegio.findAll( {
      where: {
        medico_id: object.id
      }
    } )
    .then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.insertaColegio = function ( object, req, res ) {
  try{
    models.Colegio.create( {
      nombre: object.nombre,
      medico_id: object.idMedico,
      fechaInicio: object.fechaInicio,
      institucion_id: object.idInstitucion
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.actualizaColegio = function ( object, req, res ) {
  try{
    models.Colegio.update( {
      nombre: object.nombre,
      medico_id: object.idMedico,
      fechaInicio: object.fechaInicio,
      institucion_id: object.idInstitucion
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraColegio = function ( object, req, res ) {
  try{
    models.Colegio.destroy( {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      req.errorHandler.report(err, req, res);
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneInstitucionesMedico = function ( object, req, res ) {
  try{
    models.Institucion.findAll( {
      where: {
        usuario_id: object.id
      }
    } )
    .then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.insertaInstitucion = function ( object, req, res ) {
  try{
    models.Institucion.create( {
      micrositio: object.micrositio,
      razonSocial: object.razonSocial,
      usuario_id: object.idUsuario
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      req.errorHandler.report(err, req, res);
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.actualizaInstitucion = function ( object, req, res ) {
  try{
    models.Institucion.update( {
      micrositio: object.micrositio,
      razonSocial: object.razonSocial,
      usuario_id: object.idUsuario
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraInstitucion = function ( object, req, res ) {
  try{
    models.Institucion.destroy( {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.obtieneAseguradorasMedico = function ( object, req, res ) {
  try{
    models.Aseguradora.findAll( {
      where: {
        medico_id: object.id
      }
    } )
    .then( function ( datos ) {
      res.send( datos );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.insertaAseguradora = function ( object, req, res ) {
  try{
    models.Aseguradora.create( {
      nombre: object.nombre,
      medico_id: object.idMedico,
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.actualizaAseguradora = function ( object, req, res ) {
  try{
    models.Aseguradora.update( {
      nombre: object.nombre,
      medico_id: object.idMedico
    }, {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.borraAseguradora = function ( object, req, res ) {
  try{
    models.Aseguradora.destroy( {
      where: {
        id: object.id
      }
    } ).then( function ( datos ) {
      res.status( 200 ).json( {
        ok: true
      } );
    } ).catch( function ( err ) {
      res.status( 500 ).json( {
        error: err
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
