var models = require( '../models' );

exports.index = function ( object, req, res ) {
  res.render( 'inbox', object );
}

exports.enviar = function( req ){
  models.Inbox.create(
    {
      usuario_id_de: req.usuario_id,
      usuario_id_para: req.info.para,
      mensaje: req.info.mensaje
    }
  ).then(function(inbox){
    if (inbox){
      var tipoNotId = '';
      models.Usuario.findOne({
        where: {
          id: req.info.para
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
                usuario_id: req.info.para,
                tipoNotificacion_id: tipoNotId,
                data: req.usuario_id.toString()
              });
          }
        }
      })
      req.socket.emit('inboxEnviado',{success:true});
    } else {
      req.socket.emit('inboxEnviado',{success:false});
    }
  })
}

exports.cargartodos  = function( object, req, res ){
  models.Inbox.findAll({
    where: models.sequelize.or(
      {usuario_id_de: req.session.passport.user.id},
      {usuario_id_para: req.session.passport.user.id}
    ),
    attributes: ['usuario_id_de','usuario_id_para',[models.Sequelize.fn('max', models.Sequelize.col('fecha')),'fecha'], 'visto'],
    group: ['usuario_id_de','usuario_id_para'],
    order:  '`fecha` DESC',
  }).then(function(result){
    if (result){
      var resultado = [];
      result.forEach( function ( record ) {
        usuario_id = '';
        if (record.usuario_id_de == req.session.passport.user.id){
          usuario_id = record.usuario_id_para;
        } else {
          usuario_id = record.usuario_id_de;
        }

        models.Usuario.findOne( {
          where: {
            id: usuario_id
          },
          attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
          include: [ {
            model: models.DatosGenerales,
            attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
            } ]
          }).then( function ( usuario ) {
            if (!resultado[usuario.id]){
              resultado[usuario.id] = {'fecha': record.fecha, 'usuario': usuario };
              if (record.usuario_id_para === req.session.passport.user.id){
                resultado[usuario.id]['visto'] = record.visto;
              }
            } else {
              if (record.usuario_id_para === req.session.passport.user.id){
                resultado[usuario.id]['visto'] = record.visto;
              }
            }
            if ( record === result[ result.length - 1 ] ) {
                res.send(resultado);
            }
        } )
      });
    } else {
        res.send(result);
    }
  });
}



exports.cargarMensajesPorUsuario  = function( object, req, res ){
  models.Inbox.findAll({
    where: models.sequelize.or(
      models.sequelize.and(
        {usuario_id_de: object.usuario_id},
        {usuario_id_para: req.session.passport.user.id}
      ),
      models.sequelize.and(
        {usuario_id_de: req.session.passport.user.id},
        {usuario_id_para: object.usuario_id}
      )
    ),
    attributes: ['usuario_id_de','usuario_id_para','mensaje','fecha', 'visto'],
    order:  '`fecha` ASC',
  }).then(function(result){
      var resultado = [];

      resultado.push(object.usuario_id);
      resultado.push(req.session.passport.user.id);
      resultado.push(JSON.parse(JSON.stringify(result)));
      res.send(resultado);
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
  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}
