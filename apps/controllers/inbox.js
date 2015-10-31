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
              models.Notificacion.update( {
                visto: 1
              }, {
                where: {
                  usuario_id:  req.usuario_id.toString(),
                  visto: 0,
                  data: req.info.para,
                  tipoNotificacion_id: {$between: [100, 200]}
                }
              }).then(function(result){
                if (result){
                  req.socket.emit('conversacionLeida');
                }
              });
              models.Notificacion.create( {
                usuario_id: req.info.para,
                tipoNotificacion_id: tipoNotId,
                data: req.usuario_id.toString()
              });
          }
        }
      });
      req.SocketsConectados.forEach(function(socket){
        req.socket.broadcast.to(socket).emit('nuevoInbox',{de: req.usuario_id, mensaje: req.info.mensaje});
      });
      req.socket.emit('inboxEnviado',{success:true});
    } else {
      req.socket.emit('inboxEnviado',{success:false});
    }
  })
}

exports.cargartodos  = function( object, req, res ){
    var condicion = [];
    if (object.notIn && object.notIn.length > 0){
      condicion.push({
        usuario_id_de: { $notIn: object.notIn},
        usuario_id_para: { $notIn: object.notIn}
      })
    }
  models.Inbox.findAll({
    where: models.sequelize.and(
      condicion,
      models.sequelize.or(
        {usuario_id_de: req.session.passport.user.id},
        {usuario_id_para: req.session.passport.user.id}
      )
    ),
    attributes: [['IF(`usuario_id_de` = '+req.session.passport.user.id+',`usuario_id_para`,`usuario_id_de`)','usuario_id'],['max(`fecha`)','fecha'],'visto'],
    group: ['usuario_id'],
    order:  '`fecha` DESC',
  }).then(function(result){
    if (result.length > 0){
      var total = 0;
      result = JSON.parse(JSON.stringify(result));
      var resultado = [];
      result.forEach( function ( record ) {
        models.Usuario.findOne( {
          where: {
            id: record.usuario_id
          },
          attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
          include: [ {
            model: models.DatosGenerales,
            attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
            } ]
          }).then( function ( usuario ) {
            //consultar si visto
            models.Inbox.findOne({
              where: { usuario_id_para: req.session.passport.user.id,
                       usuario_id_de: record.usuario_id
                     },
              attributes: [[models.Sequelize.fn('min',models.Sequelize.col('visto')),'visto']],
              limit: 1
            }).then(function(visto){
              if (visto){
                visto = visto.visto;
              } else {
                visto = 1;
              }
              resultado[result.indexOf(record)] = {'fecha': record.fecha, 'usuario': usuario, 'visto':visto};
              total++;
              if ( total == result.length ) {
                  res.send(resultado);
              }
            });
        } )
      });
    } else {
        res.send({});
    }
  });
}


exports.cargarInboxVistaPrevia = function (object){
    var condicion = [];
    if (object.notIn && object.notIn.length > 0){
      condicion.push({
        usuario_id_de: { $notIn: object.notIn},
        usuario_id_para: { $notIn: object.notIn}
      })
    }
  models.Inbox.findAll({
    where: models.sequelize.and(
      condicion,
      models.sequelize.or(
        {usuario_id_de: object.usuario_id},
        {usuario_id_para: object.usuario_id}
      )
    ),
    attributes: [['IF(`usuario_id_de` = '+object.usuario_id+',`usuario_id_para`,`usuario_id_de`)','usuario_id'],'mensaje',['max(`fecha`)','fecha'],'visto'],
    group: ['usuario_id'],
    order:  'max(`fecha`) DESC',
    limit: 5
  }).then(function(result){
    if (result.length > 0){
      var total = 0;
      result = JSON.parse(JSON.stringify(result));
      var resultado = [];
      result.forEach( function ( record ) {
        models.Usuario.findOne( {
          where: {
            id: record.usuario_id
          },
          attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
          include: [ {
            model: models.DatosGenerales,
            attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
            } ]
          }).then( function ( usuario ) {
            //consultar si visto
            models.Inbox.findOne({
              where: { usuario_id_para: object.usuario_id,
                       usuario_id_de: record.usuario_id
                     },
              attributes: [[models.Sequelize.fn('min',models.Sequelize.col('visto')),'visto']],
              limit: 1
            }).then(function(visto){
              models.Inbox.findOne({
                where:
                      models.sequelize.or(
                        {
                          usuario_id_para: record.usuario_id,
                          usuario_id_de: object.usuario_id
                       },
                       {
                          usuario_id_para: object.usuario_id,
                          usuario_id_de: record.usuario_id
                        }),
                attributes: ['mensaje','fecha'],
                order:  '`fecha` DESC',
                limit: 1
              }).then(function(msg){
                if (visto){
                  visto = visto.visto;
                } else {
                  visto = 1;
                }
                resultado[result.indexOf(record)] = {'fecha': record.fecha, 'usuario': usuario, 'visto':visto, 'mensaje': msg.mensaje};
                total++;
                if ( total == result.length ) {
                    object.socket.emit('cargarInboxVistaPrevia',resultado);
                }
              });
            });
        } )
      });
    } else {
        res.send({});
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
    attributes: ['id','usuario_id_de','usuario_id_para','mensaje','fecha', 'visto'],
    order:  '`fecha` DESC',
    limit: 10
  }).then(function(result){
      var resultado = [];

      resultado.push(object.usuario_id);
      resultado.push(req.session.passport.user.id);
      resultado.push(JSON.parse(JSON.stringify(result)));
      res.send(resultado);
  });
}


exports.cargarMensajesPorUsuarioAnteriores  = function( object, req, res ){
  models.Inbox.findAll({
    where: models.sequelize.and(
      {id:{$lt: object.mensaje_id}},
      models.sequelize.or(
        models.sequelize.and(
          {usuario_id_de: object.usuario_id},
          {usuario_id_para: req.session.passport.user.id}
        ),
        models.sequelize.and(
          {usuario_id_de: req.session.passport.user.id},
          {usuario_id_para: object.usuario_id}
        )
      )
    ),
    attributes: ['id','usuario_id_de','usuario_id_para','mensaje','fecha', 'visto'],
    order:  '`fecha` DESC',
    limit: 20
  }).then(function(result){
      var resultado = [];

      resultado.push(object.usuario_id);
      resultado.push(req.session.passport.user.id);
      resultado.push(JSON.parse(JSON.stringify(result)));
      res.send(resultado);
  });
}

exports.conversacionLeida = function(req){
  models.Inbox.update(
    {visto: 1},
    {
      where:{
        usuario_id_de: req.usuario_id_de,
        usuario_id_para: req.usuario_id_para,
        visto: 0
      }
    }
  ).then(function(result){
    if (result){
      models.Notificacion.update( {
        visto: 1
      }, {
        where: {
          usuario_id: req.usuario_id_para,
          visto: 0,
          data: req.usuario_id_de.toString(),
          tipoNotificacion_id: {$between: [100, 200]}
        }
      }).then(function(result){
        if (result){
          req.socket.emit('conversacionLeida');
        }
      });
    }
  });
}

exports.crearConversacion = function(req){
  models.Usuario.findOne({
    where: {
      id: req.usuario_id_de
    },
    attributes: [ 'id', 'urlFotoPerfil', 'usuarioUrl' ],
    include: [ {
      model: models.DatosGenerales,
      attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
      } ]
  }).then( function ( usuario ) {
    req.socket.emit('crearConversacion',usuario);
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
