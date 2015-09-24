var models  = require('../models');

exports.obtenerTodas = function(object, req, res){
    models.TipoNotificacion.findAll({
        where: {tipoUsuario: req.session.passport.user.tipoUsuario}
    }).
    then(function(result){
        models.ConfNotUsu.findAll({
            where: {usuario_id: req.session.passport.user.id}
        }).then(function (confPersonal){for(var key in confPersonal) {
                    for(var key2 in result) {
                        if (result[key2].id === confPersonal[key].id){
                            result[key2].interno = confPersonal[key].interno;
                            result[key2].push = confPersonal[key].push;
                            result[key2].mail = confPersonal[key].mail;
                        }
                    }
                }
                res.send(result);
        })
    });
}

exports.prueba = function(object, req, res) {
    var TipoNotificacion = 3;
    object.visto = true;
    var visto = object.visto;
    if (req.session.passport.user){
        var usuarioId = req.session.passport.user.id;
          models.TipoNotificacion.findOne({
              attributes: ['id','interno','push','mail'],
              where: { id: TipoNotificacion},
              include: [
                  {model: models.Notificacion, where: { usuario_id: usuarioId, visto: 0 }}
              ]
          }).then(function(datos){
              if (datos){
                  models.ConfNotUsu.findOne({where: { usuario_id: usuarioId, tipoNotificacion_id: TipoNotificacion}}).
                  then(function(result){
                      if (result){
                          datos.interno = result.interno;
                          datos.push = result.push;
                          datos.mail = result.mail;
                      }
                      datos = JSON.parse(JSON.stringify(datos));
                      var count = 0;
                      var resultado = '';
                        for(var key in datos.Notificacions) {
                          if(datos.Notificacions.hasOwnProperty(key)) {
                            count++;
                            resultado += '<li>' + JSON.stringify(datos.Notificacions[key]) + '</li>'
                          }
                        }

                      res.send('Total: ' + count + '<br/><br/>interno: ' + datos.interno+ '<br/>push: '+ datos.push +'<br/>mail: ' + datos.mail +'<br/><br/>Resultado:<br/>' + resultado);

                      if (visto){
                          for(var key in datos.Notificacions) {
                            if(datos.Notificacions[key].id) {
                                models.Notificacion.update({visto:1},{ where: {id: datos.Notificacions[key].id}});
                             }
                          }
                      }
                  });
              } else {
                  res.send('No hay notificaciones');
              }
          });
    } else {
        res.send('Necesita iniciar sesión');
    }
};

exports.solicitudAmistad = function (req){
    models.Notificacion.findAll({
        where: { usuario_id: req.usuario_id, visto: 0 }, attributes: ['id','mensaje','enlace','url']
    }).then(function(result){
        req.socket.emit('solicitudAmistad',result);
    })
}

exports.verNotificaciones = function (req){
    console.log('VER NOTIFICACIONES');
    models.Notificacion.update(
        {visto: 1},{where: { usuario_id: req.usuario_id, visto: 0 }
    }).then(function(result){
        req.socket.emit('verNotificaciones',result);
    });
}
