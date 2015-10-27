var models = require( '../models' );

exports.index = function ( object, req, res ) {
  res.render( 'inbox', object );
}

exports.enviar = function( object, req, res ){
  models.Inbox.create(
    {
      usuario_id_de: req.session.passport.user.id,
      usuario_id_para: object.para,
      mensaje: object.mensaje
    }
  ).then(function(inbox){
    if (inbox){
      var tipoNotId = '';
      models.Usuario.findOne({
        where: {
          id: object.para
        },
        attributes: [ 'tipoUsuario' ]
      }).then(function(usuario){
        if (usuario){
          if (usuario.tipoUsuario == "P"){
            tipoNotId = 101;
          } else if (usuario.tipoUsuario == "M"){
            tipoNotId = 102;
          }
          if (tipoNotId > 0){
              models.Notificacion.create( {
                usuario_id: object.para,
                tipoNotificacion_id: tipoNotId,
                data: req.session.passport.user.id.toString()
              });
          }
        }
      })
      res.send({'success':true});
    } else {
      res.send({'success':false})
    }
  })
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
  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}
