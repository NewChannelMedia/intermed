//librerias

//arranca el servidor
var server = function ( ap, port ) {
  return require( 'socket.io' ).listen( ap.listen( port ) );
};

//se importa para que otros js lo puedan ejecutar
exports.server = server;
