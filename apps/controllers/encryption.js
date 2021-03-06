  /**
  * Script para la encriptación, desde passwords hasta
  * archivos completos.
  *
  *
  * @author Oscar
  * @Date Wednesday, January 20, 2016
  * @version 0.0.0
  **/
  // se exporta el modulo poder encriptar archivos en una variable constante
  const encryptor = require('file-encryptor');
  // se manda a llamar el modulo para poder recorrer los ficheros
  const fs = require('fs');
  // constante para el crypto
  const crypto = require('crypto');
  // modelos
  const models = require('../models');
  // constante para el envio de correo
  const sendMail = require('./emailSender');
  // convierte a xml

  /**
  * En la funcion isLogin, se podrá encriptar, la contraseña
  * la cual se podra revisar con una consulta hacia la tabla que se desee
  * esta funcion va a retornar un valor verdadero o falso, dependiendo
  * de si la contraseña encriptada es la misma almacenada de ser asi retorna un
  * boolean true, en caso contrario retornara un boolean false
  *
  * se utilizara la funcion de crypto createHmac para la encriptacion del password
  *
  * @param password: contraseña que se recibira por post de la vista que sea
  *         "SE OBTENDRA POR POST"
  * @param req.
  * @param res.
  * @return true en caso de ser el password correcto
  **/
  exports.insertPassword = function( object, req, res ){
    try{
      // se inserta a la base de datos
      var password = generateEncrypted( object.pas );
      var modelo = object.modelo;
      var f = new Date();
      var fecha = f.getFullYear()+'/'+f.getMonth()+'/'+f.getDate();
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var token = usuario_id+fecha;
        models.UsuarioHistorial.create({
          idDr: usuario_id,
          pass: password,
          token:generateEncrypted(token)
        }).then(function(creado){
          if( creado != null ){
            res.send(true);
          }else{
            res.send(false);
          }
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.deleteLinkCrear = function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.UsuarioHistorial.findOne({
          where:{ idDr: usuario_id },
          attributes:['pass']
        }).then(function(encontrado){
          if( encontrado != null ){
            res.send(true);
          }else{
            res.send(false);
          }
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.changeValidPass = function( object, req, res ){
    try{
      var password = generateEncrypted(object.pass);
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        switch(object.bandera){
          case 'historial':
            models.UsuarioHistorial.update({
              pass: password
            },{
              where:{
                idDr: usuario_id
              }
            }).then(function(actualizado){
              if( actualizado == 1 ){
                res.send(true)
              }else{
                res.send(false);
              }
            });
          break;
          case 'intermed':
            models.Usuario.update({
              password: object.pass
            },{
              where:{id:usuario_id}
            }).then(function(actualizo){
              if( actualizo == 1 ){
                res.send(true);
              }else{
                res.send(false);
              }
            });
          break;
        }
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.getMailSend = function( req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        models.Usuario.findOne({
          where:{ id: usuario_id },
          attributes:['correo']
        }).then(function(correo){
          res.send(correo);
        });
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.sendMailto = function( object, req, res ){
    try{
      if ( req.session.passport.user && req.session.passport.user.id > 0 ){
        var usuario_id = req.session.passport.user.id;
        var bandera = object.bandera;
        var f = new Date();
        var fecha = f.getFullYear()+'/'+(f.getMonth()+1)+'/'+f.getDate();
        // caso uno historial
        // caso dos cuenta intermed
        switch(bandera){
          case "historial":
            var link = "intermed.online/cambiar/historial/"+String(doEncriptToken( usuario_id, fecha));
            var objeto = {
              to:object.to,
              subject: object.subject,
              token: doEncriptToken( usuario_id, fecha),
              enlace: link
            };
            sendMail.send( objeto,'changePassword',res);
            break;
          case "intermed":
            var link = "intermed.online/cambiar/intermed/"+String(doEncriptToken(usuario_id,fecha));
            var objecto = {
              to: object.to,
              subject: object.subject,
              token: doEncriptToken( usuario_id, fecha ),
              enlace: link
            };
            sendMail.send( objecto, 'intermedChangePassword', res );
            break;
        }
      }
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.cambiar = function( object, req, res ){
    try{
      res.render('cambiarPass');
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  exports.cambiarIntermedPass = function( object, req, res ){
    try{
      res.render('cambiarPassIntermed');
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }
  // conviertiendo a xml
  /**
  *  Esta funcion es la encargada de mandar a xml
  * el objecto que se le pasa por paramtetro
  */
  exports.htmlToXml = function(object, req, res){
    try{
      var f = new Date();
      var fecha = f.getDate()+'_'+(f.getMonth()+1)+'_'+f.getFullYear();
      var archivo = "paciente_"+fecha+'.xml';
      var o2x = require('object-to-xml');
      var obj = {
        '?xml version=\"1.0\" encoding=\"iso-8859-1\"?' : null,
        datos:{
          nombre: object.nombre,
          apellidoP: object.apellidoP,
          apellidoM: object.apellidoM
        },
        fecha:{
          dia: object.dia,
          mes: object.mes,
          año: object.año
        },
        biometricos:{
          sexo: object.sexo,
          estatura: object.cm,
          peso: object.kg
        },
        correo: object.correo,
        salud:{
          estado: object.salud
        },
        padecimiento:{
          padecimientos:object.padecimiento
        },
        alergia:{
          alergias:object.alergias
        },
        nota:{
          notas: object.notas
        }
      }
      //se ubica el archivo en la posicion a guardar
      fs.writeFile('apps/views/plataforma/medico/historiales/'+archivo,o2x(obj),function(err,data){
        if(err){
          req.errorHandler.report(err, req, res);
        }else{
          res.send(true)
        }
      });
    }catch ( err ) {
      req.errorHandler.report(err, req, res);
    }
  }

  /**
  * Con este medoto se puede encriptar cualquier password
  * algoritmo que utilizara es el sha512 y encripta a una cadena de 128 caracteres
  *
  **/
  function generateEncrypted(str){
    var cadena = crypto.createHmac('sha512',str);
    cadena.update(str);// se actualiza la cadena
    var cadena = cadena.digest('hex'); // almacena la cadena encriptada
    return cadena;
  }
  /**
   * metodo para encriptar el token
   *
   * @param id
   * @param times
   * @return ecript token
  */
  function doEncriptToken( value, times ) {
    if (times){
      value = value.toString() + times.toString();
    } else {
      value = value.toString();
    }
    return String( crypto.createHash( 'md5' ).update( value ).digest( 'hex' ) );
  }
  // funciones que se podrán exportar
  exports.doEncriptToken = doEncriptToken;
