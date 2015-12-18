/**
*	App.js este archivo sera el principal de toda la aplicación.
*	Aquí solo se ejecutaran comandos para hacer el llamado de otros archivos
*	y donde también se ejecutara el servidor.
*
*
*	@author Oscar, Cinthia, JC
*	@version 0.0.0.0
*	@date 04/08/2015
*/

//librerias requeridas
var arranca = require('./config/router');
// carga del archivo intermed para la carga de los controladores encontrados en ese fichero

// se arranca el servidor
arranca.iniciar();
arranca.manejarPerfiles();
arranca.error404();
