/**
 * Script para la encriptación, desde passwords hasta
 * archivos completos.
 *
 *
 * @author Oscar
 * @date Thursday, August 27, 2015
 * @version 0.0.0.0
 *
 **/
// se cargan las librerias necesarias
var criptosis = require('crypto');
/**
* metodo para encriptar el token
*
* @param id
* @param times
* @return ecript token
*/
function doEncriptToken( id, times )
{
  var concatenando = id+times;
  return String(criptosis.createHash('md5').update(concatenando).digest('hex'));
}
// funciones que se podrán exportar
exports.doEncriptToken = doEncriptToken;
