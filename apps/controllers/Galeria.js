var models = require( '../models' );
  var fs = require( "fs" );

exports.upload = function (object, req, res) {
  try{
    if (req.session.passport && req.session.passport.user){
      if ( !fs.existsSync( './public/garage/' + req.session.passport.user.id ) ) {
        fs.mkdirSync( './public/garage/' + req.session.passport.user.id, 0777 );
        fs.mkdirSync( './public/garage/' + req.session.passport.user.id+'/profilepics', 0777 );
        fs.mkdirSync( './public/garage/' + req.session.passport.user.id+'/galeria', 0777 );
        fs.mkdirSync( './public/garage/' + req.session.passport.user.id+'/thumbnails', 0777 );
      };
      var newPath = '/garage/' + req.session.passport.user.id + '/galeria/' + req.session.passport.user.id + '_' + getDateTime() + '_'+ object.num + '.jpg';
      var thumbPath = '/thumbnails/' + req.session.passport.user.id + '/galeria/' + req.session.passport.user.id + '_' + getDateTime() + '_'+ object.num + '.jpg';
      var base64Data = req.body.base64.split(';base64,')[1];

      fs.writeFile( './public' + newPath, base64Data, 'base64', function ( err, succes ) {
        if ( err ) {
          res.send( {
            succes: false,
            result: 'error',
            message: err
          } );
        }
        else {
          models.Galeria.create( {
            imagenurl: newPath,
            titulo: object.titulo,
            descripcion: object.descripcion,
            usuario_id: req.session.passport.user.id
          }).then(function(result){
            res.status(200).json({
              success: true,
              result: result
            })
          });
        }
      } );

    } else {
      res.status(200).json({
        success: false,
        error: 1
      })
    }
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};

exports.eliminar = function (object, req, res){
  models.Galeria.findOne({
    where: {
      id: object.imagen_id,
      usuario_id: req.session.passport.user.id
    }
  }).then(function(galeria){
    if (galeria){
      var url = galeria.imagenurl;
      fs.unlink('./public' + url, function(err){
        if (err){
          console.log('Error al eliminar imagen: ' + err);
        }
      });
      galeria.destroy();
      res.status(200).json({
        success: true
      })
    } else {
      res.status(200).json({
        success: true
      })
    }
  });
}

exports.actualizar = function (object, req, res){
  models.Galeria.findOne({
    where: {
      id: object.imagen_id,
      usuario_id: req.session.passport.user.id
    }
  }).then(function(galeria){
    if (galeria){
      console.log('OBJECT: ' + JSON.stringify(object));
      galeria.update({
        titulo: object.titulo,
        descripcion: object.descripcion
      },{
        logging:console.log
      }).then(function(result){
        res.status(200).json({
          success: true
        });
      });
    } else {
      res.status(200).json({
        success: true
      })
    }
  });
}

exports.obtener = function (object, req, res){
  models.Galeria.findAll({
    where: {
      usuario_id: object.usuario_id
    },
    order: [['fecha','ASC']]
  }).then(function(galeria){
    res.status(200).json({
      success: true,
      result: galeria
    });
  });
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
