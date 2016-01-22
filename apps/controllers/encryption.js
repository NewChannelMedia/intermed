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
  exports.isLogin = function(object, req, res ){
    var cadena = generateEncrypted( object.pass );
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.UsuarioHistorial.findOne({
        where: {
          idDr: usuario_id,
          pass: cadena
        }
      }).then(function(success){
        if (success){
          res.send(true);
        } else {
          res.send(false);
        }
      });
    }
  }
  exports.insertPassword = function( object, req, res ){
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
  }
  exports.deleteLinkCrear = function( req, res ){
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
  }
  exports.changeValidPass = function( object, req, res ){
    var password = generateEncrypted(object.pass);
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
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
    }
  }
  exports.getMailSend = function( req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.Usuario.findOne({
        where:{ id: usuario_id },
        attributes:['correo']
      }).then(function(correo){
        res.send(correo);
      });
    }
  }
  exports.sendMailto = function( object, req, res ){
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      var f = new Date();
      var fecha = f.getFullYear()+'/'+f.getMonth()+'/'+f.getDate();
      var link = "localhost:3000/cambiar/"+String(doEncriptToken( usuario_id, fecha));
      console.log("ENLACE "+link);
      var objeto = {
        to:object.to,
        subject: object.subject,
        token: doEncriptToken( usuario_id, fecha),
        enlace: link
      }
      sendMail.send( objeto,'changePassword',res);
    }
  }
  exports.cambiar = function( object, req, res ){
    res.render('cambiarPass');
  }
  function generateEncrypted(pass){
    const password = crypto.createHmac('sha512',pass);
    password.update(pass);// se actualiza la cadena
    var cadena = password.digest('hex'); // almacena la cadena encriptada
    return cadena;
  }
  /**
   * metodo para encriptar el token
   *
   * @param id
   * @param times
   * @return ecript token
  */
  function doEncriptToken( id, times ) {
    var concatenando = id + times;
    return String( crypto.createHash( 'md5' ).update( concatenando ).digest( 'hex' ) );
  }
  // funciones que se podrán exportar
  exports.doEncriptToken = doEncriptToken;
