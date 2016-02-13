var models = require( '../models' );

exports.index = function ( req, res ) {
  try{
    res.render( 'pacientes/index', {
      title: 'Pacientes'
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.mostrar = function ( req, res ) {
  try {
    models.Paciente.findAll().then( function ( datos ) {
      res.render( 'pacientes/mostrar', {
        title: 'Usuarios',
        datos: datos
      } );
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.biometricos = function ( req, res ) {
  try{
    res.render( 'pacientes/biometricos', {
      title: 'Usuarios'
    } );
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.modificarPerfil = function ( object, req, res ) {
  try{
    if ( !req.session.passport.user ) res.redirect( '/' );
    var sesion = req.session.passport.user;

    //Contar mensajes sin leer
    sesion.mensajes = 1;
    //Contar eventos nuevos o cercanos (Sin ver)
    sesion.calendario = 5;

    if ( req.body.base64file ) {
      console.log( 'base64file: ' + req.body.base64file.length );
      var fs = require( "fs" );
      if ( !fs.existsSync( './public/garage/profilepics/' + req.session.passport.user.id ) ) {
        fs.mkdirSync( './public/garage/profilepics/' + req.session.passport.user.id, 0777 );
      };

      var newPath = '/garage/profilepics/' + req.session.passport.user.id + '/' + req.session.passport.user.id + '_' + getDateTime() + '.jpg';
      var base64Data = req.body.base64file.replace( /^data:image\/png;base64,/, "" );
      fs.writeFile( './public' + newPath, base64Data, 'base64', function ( err, succes ) {
        if ( err ) {
          res.send( {
            result: 'error',
            message: err
          } );
        }
        else {
          console.log( "archivo subido: " + newPath );
          models.Usuario.update( {
            urlFotoPerfil: newPath
          }, {
            where: {
              id: req.session.passport.user.id
            }
          } ).then( function ( result ) {
            req.session.passport.user.fotoPerfil = newPath;
            res.send( {
              result: 'success'
            } );
          } );
        }
      } );
    }
    else {
      models.DatosGenerales.update( {
        nombre: req.body.nombre,
        apellidoP: req.body.apellidoPat,
        apellidoM: req.body.apellidoMat
      }, {
        where: {
          usuario_id: req.session.passport.user.id
        }
      } ).then( function ( result ) {
        res.render( 'perfil', sesion );
      } );
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.cargarUbicacion = function (object, req, res){
  try{
    if (req.session.passport.user && req.session.passport.user.Paciente_id){
      models.Direccion.findOne({
        where: {
          usuario_id: req.session.passport.user.id,
          principal: 1
        },
        attributes: ['id','latitud','longitud','municipio_id','localidad_id'],
        include: [
          {
            model : models.Municipio, attributes: ['estado_id']
          }
        ]
      }).then(function(result){
        res.status(200).json({'success':true,'result':result});
      });
    } else {
      res.status(200).json({'success':false});
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
}


function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;
  var min = date.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;
  var sec = date.getSeconds();
  sec = ( sec < 10 ? "0" : "" ) + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = ( month < 10 ? "0" : "" ) + month;
  var day = date.getDate();
  day = ( day < 10 ? "0" : "" ) + day;
  return year + month + day + hour + min + sec;
}
