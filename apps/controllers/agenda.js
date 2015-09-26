var models = require( '../models' );

exports.agregaCita = function ( object, req, res ) {
  models.Agenda.create( {
    fechaHoraInicio: object.fechaHoraInicio,
    status: object.estatus,
    nota: object.nota,
    resumen: object.resumen,
    direccion_id: object.direccion_id,
    usuario_id: object.usuario_id,
    paciente_id: object.paciente_id,
    servicio_id: object.servicio_id
  } ).then( function ( datos ) {
    res.status( 200 ).json( {
      ok: true
    } );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

exports.modificaCita = function ( object, req, res ) {
  models.Agenda.update( {
    fechaHoraInicio: object.fechaHoraInicio,
    status: object.estatus,
    nota: object.nota,
    resumen: object.resumen,
    servicio_id: object.servicio_id,
    direccion_id: object.direccion_id
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
};

exports.cancelaCita = function ( object, req, res ) {
  models.Agenda.update( {
    nota: object.nota,
    status: 0
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
};

exports.borraCita = function ( object, req, res ) {
  models.Agenda.destroy( {
    where: {
      id: object.id
    }
  } ).then( function () {
    res.status( 200 ).json( {
      ok: true
    } );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

// Obtiene las citas del paciente
exports.seleccionaCitas = function ( object, req, res ) {
  models.Agenda.findAll( {
    where: {
      paciente_id: object.id
    },
    include: [
      {
        model: models.CatalogoServicios,
        attributes: [ 'concepto' ]
      },
      {
        model: models.Usuario,
        include: [ {
          model: models.DatosGenerales
        } ]
      },
      {
        model: models.Direccion,
        include: [ {
          model: models.Municipio,
          include: [ {
            model: models.Estado
          } ]
        } ]
      }
      ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};


// Obtiene la agenda del médico
exports.seleccionaAgenda = function ( object, req, res ) {
  models.Agenda.findAll( {
    where: {
      usuario_id: object.id
    },
    include: [
      {
        model: models.CatalogoServicios,
        attributes: [ 'concepto' ]
      },
      {
        model: models.Direccion,
        include: [ {
          model: models.Municipio,
          include: [ {
            model: models.Estado
          } ]
        } ]
      },
        /*{ model : models.Paciente,
          include :[{ model : models.Usuario,
            include :[{ model : models.DatosGenerales}]}]}*/
      ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

// Obtiene una cita especificada por id
exports.seleccionaCita = function ( object, req, res ) {
  models.Agenda.findOne( {
    where: {
      id: object.id
    },
    include: [
      {
        model: models.CatalogoServicios,
        attributes: [ 'concepto' ]
      },
      {
        model: models.Usuario,
        include: [ {
          model: models.DatosGenerales
        } ]
      },
      {
        model: models.Direccion,
        include: [ {
          model: models.Municipio,
          include: [ {
            model: models.Estado
          } ]
        } ]
      }
      ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

// Califica una cita
exports.calificaCita = function ( object, req, res ) {
  models.CalificacionCita.create( {
    higieneLugar: object.higieneLugar,
    puntualidad: object.puntualidad,
    instalaciones: object.instalaciones,
    tratoPersonal: object.tratoPersonal,
    satisfaccionGeneral: object.satisfaccionGeneral,
    comentarios: object.comentarios,
    agenda_id: object.agenda_id,
    medico_id: object.medico_id,
    paciente_id: object.paciente_id
  } ).then( function ( datos ) {
    var promedio = ( ( datos.higieneLugar + datos.puntualidad + datos.instalaciones + datos.tratoPersonal + datos.satisfaccionGeneral ) / 5 )
    models.Medico.findById( datos.medico_id )
      .then( function ( medico ) {
        var calificacion = medico.calificacion;
        models.Medico.update( {
          calificacion: ( ( calificacion + promedio ) / 2 )
        }, {
          where: {
            id: datos.medico_id
          }
        } );
        res.status( 200 ).json( {
          ok: true
        } );
      } ).catch( function ( err ) {
        res.status( 500 ).json( {
          error: err
        } );
      } )
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// Para mostrar la calificacion de la cita
exports.seleccionaCalificacionCita = function ( object, req, res ) {
  models.CalificacionCita.findOne( {
    where: {
      medico_id: object.id
    },
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// Califica a un médico
exports.calificaMedico = function ( object, req, res ) {
  models.CalificacionMedico.create( {
    efectividad: object.efectividad,
    tratoPersonal: object.tratoPersonal,
    presentacion: object.presentacion,
    higiene: object.higiene,
    medico_id: object.medico_id,
    usuario_id: object.usuario_id
  } ).then( function ( datos ) {
    var promedio = ( ( datos.efectividad + datos.tratoPersonal + datos.higiene + datos.presentacion ) / 4 )
    models.Medico.findById( datos.medico_id )
      .then( function ( medico ) {
        var calificacion = medico.calificacion;
        models.Medico.update( {
          calificacion: ( ( calificacion + promedio ) / 2 )
        }, {
          where: {
            id: datos.medico_id
          }
        } );
        res.status( 200 ).json( {
          ok: true
        } );
      } ).catch( function ( err ) {
        res.status( 500 ).json( {
          error: err
        } );
      } )
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// Obtiene la calificación de un médico
exports.seleccionaCalificacionMedico = function ( object, req, res ) {
  models.CalificacionMedico.findById( object.id, {
    include: [ {
      model: models.Medico,
      include: [ {
        model: models.Usuario,
        include: [ {
          model: models.DatosGenerales
        } ]
        } ]
      } ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// Obtiene la calificación de una cita
exports.seleccionaCalificacionCita = function ( object, req, res ) {
  models.CalificacionCita.findById( object.id, {
    include: [ {
      model: models.Agenda,
      include: [ {
          model: models.Usuario,
          include: [ {
            model: models.DatosGenerales
          } ]
      },
        {
          model: models.Direccion,
          include: [ {
            model: models.Municipio,
            include: [ {
              model: models.Estado
            } ]
        } ]
        } ]
    } ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// Obtiene servicios por usuario
exports.obtieneServicios = function ( object, req, res ) {
  models.CatalogoServicios.findAll( {
    where: {
      usuario_id: object.id
    }
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

// Obtiene detalles de un servicio
exports.obtieneServicio = function ( object, req, res ) {
  models.CatalogoServicios.findOne( {
    where: {
      id: object.id
    }
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

// Obtiene lista de servicios  para llenar combo
exports.obtieneServiciosLista = function ( object, req, res ) {
  models.CatalogoServicios.findAll( {
    where: {
      usuario_id: object.id
    },
    attributes: [ 'id', 'concepto' ]
  } ).then( function ( datos ) {
    res.send( datos );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } )
  } );
};

//  inserta servicio otorgado por el médico
exports.agregaServicio = function ( object, req, res ) {
  models.CatalogoServicios.create( {
    concepto: object.concepto,
    descripcion: object.descripcion,
    precio: object.precio,
    duracion: object.duracion,
    usuario_id: object.usuario_id
  } ).then( function ( datos ) {
    res.status( 200 ).json( {
      ok: true
    } );
  } ).catch( function ( err ) {
    res.status( 500 ).json( {
      error: err
    } );
  } );
};

// modifica servicio otorgado por el médico
exports.modificaServicio = function ( object, req, res ) {
  models.CatalogoServicios.update( {
    concepto: object.concepto,
    descripcion: object.descripcion,
    precio: object.precio,
    duracion: object.duracion,
    usuario_id: object.usuario_id
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
};

// borra un servicio
exports.borraServicio = function ( object, req, res ) {
  models.CatalogoServicios.destroy( {
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
    } )
  } );
};
