  /**
  * El siguiente controlador: Tiene la funcionalidad
  * para poder iniciar session en este controlador
  * ademas de las funciones para encriptar sus archivos
  * y desencriptarlo.
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
  * @param modelo: este parametro servira para saber en cual modelo se debe
  *         de hacer la consulta del password. "SE OBTENDRA POR POST"
  * @param req.
  * @param res.
  * @return true en caso de ser el password correcto
  **/
  exports.isLogin = function(object, req, res ){
    var password = object.pass;
    // se encripta el password
    /*const pass = crypto.createHmac('sha512',password);
    pass.update(password);// se actualiza la cadena
    var cadena = pass.digest('hex'); // almacena la cadena encriptada
    console.log(cadena);
    res.send(false);*/
    var cadena = generateEncrypted(password);
    console.log("Muere: "+cadena);
    console.log("longitud de la cadena: "+cadena.length);
  }
  exports.insertPassword = function( object, req, res ){
    console.log("NNO");
    // se inserta a la base de datos
    var password = generateEncrypted( object.pas );
    if ( req.session.passport.user && req.session.passport.user.id > 0 ){
      var usuario_id = req.session.passport.user.id;
      models.UsuarioHistorial.create({
        idDr: usuario_id,
        pass: password,
        token:0
      }).then(function(creado){
        console.log("CReado: "+JSON.stringify(creado));
        if( creado != null ){
          res.send(true);
        }else{
          res.send(false);
        }
      });
    }else{
      console.log("DATO QUE ESTA ENTRANDO AQUI");
    }
  }
  function generateEncrypted(pass){
    const password = crypto.createHmac('sha512',pass);
    password.update(pass);// se actualiza la cadena
    var cadena = password.digest('hex'); // almacena la cadena encriptada
    return cadena;
  }
