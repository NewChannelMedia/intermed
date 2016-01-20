  /**
  * El siguiente controlador: Tiene la funcionalidad
  * para poder iniciar session en este controlador
  * ademas de las funciones para encriptar sus archivos
  * y desencriptarlo.
  *
  *
  * @author Oscar
  * @version 0.0.0
  **/
  // se exporta el modulo poder encriptar archivos en una variable constante
  const encryptor = require('file-encryptor');
  // se manda a llamar el modulo para poder recorrer los ficheros
  const fs = require('fs');
