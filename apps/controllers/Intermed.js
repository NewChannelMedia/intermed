/**
 * 	<-------------------------> Archivo Intermed.js <------------------------->
 *	La función de este archivo sera llamar a los demas controladores este
 *	funcionara como constructor de la carpeta controllers para así cuando se
 *	exporte solo mande a llamar al constructor de esta clase y con los parametros
 *	mande a llamar al archivo que ocupe para su trabajo.
 *
 *
 *
 *	@author Oscar, Cinthia
 *	@date  thursday, August 6, 2015
 *	@version 0.0.0.0
 *
 */

// se importan las librerias necesarias
var fs = require( 'fs' );
/**
 * 	function principal del archivo, en esta function lo que se hara es que cuando se mande a llamar
 *	busque el archivo que se esta buscando por medio del parametro y retorne ese archivo
 *	para poderlo usar y asi mandar a llamar el o los metodos que pueda contener.
 */
function callController( file, method, object, rq, rs ) {

  var exists = fs.exists( __dirname + '/' + file + '.js', function ( req, res ) {
    if ( req === true) {
      var controller = require( './' + file + '.js' );
      if ( method) {
        try {
          /*console.log(a);*/
          controller[ method ]( object, rq, rs );
        }
        catch ( e ) {
          if (rq){
            rq.file = file;
            rq.funct = method;
            rq.errorHandler.report(e, rq, rs);
          }
        }
      }
      else
        console.error( "Error2: falta indicar medoto a llamar." );
    }
    else
      console.error( "Error3: El controlador \'" + file + "\' no existe." );
  } );
}


// con la siguiente linea se podrá exportar este js a cualquier archivo del project
exports.callController = callController;
