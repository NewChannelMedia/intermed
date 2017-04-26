module.exports = function (object){
  var models = object.models;
  var app = object.app;
  var intermed = object.intermed;
  var routeDispatcher = object.routeDispatcher;
  var hps = object.hps;
  var express = object.express;
  var passport = object.passport;
  var url = object.url;

  app.post( '/informacionRegistroMedico', function ( req, res ) {
    intermed.callController( 'medicos', 'informacionRegistro', '', req, res );
  } );

  app.post( '/regMedPasoUno', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoUno', req.body, req, res );
  } );

  app.post( '/regMedPasoDos', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoDos', req.body, req, res );
  } );

  app.post( '/regMedPasoTres', function ( req, res ) {
    intermed.callController( 'medicos', 'regMedPasoTres', req.body, req, res );
  } );

  app.post('/medicos/pedirRecomendacion', function( req, res){
    intermed.callController('medicos','pedirRecomendacion',req, res);
  });

  app.post('/medicos/expertoActualizar',function (req, res){
    intermed.callController( 'medicos', 'medicoExpertoActualizar', req.body, req, res );
  });

  app.post('/medicos/expertoTraer', function (req, res){
    intermed.callController( 'medicos', 'medicoExpertoTraer', req.body, req, res );
  });

  // catalogo de servicios
  app.post('/addServices', function( req, res ){
    intermed.callController('catServicios', 'addServices', req, res);
  });
  app.post('/searchServices', function( req, res){
    intermed.callController('catServicios','searchServices',req, res);
  });
  app.post('/deleteServicio',function( req, res ){
    intermed.callController('catServicios','deleteServicio',req, res);
  });
  app.post('/updateServices', function( req, res ){
    intermed.callController('catServicios','updateServices',req, res);
  });
  app.post('/medicos/aseguradorasTraer', function (req, res){
    intermed.callController( 'medicos', 'medicoAseguradorasTraer', req.body, req, res );
  });

  app.post('/medicos/clinicasTraer', function (req, res){
    intermed.callController( 'medicos', 'medicoClinicasTraer', req.body, req, res );
  });

  app.post('/medicos/clinicasActualizar',function (req, res){
    intermed.callController( 'medicos', 'medicoClinicasActualizar', req.body, req, res );
  });

  app.post('/medicos/aseguradorasActualizar',function (req, res){
    intermed.callController( 'medicos', 'medicoAseguradorasActualizar', req.body, req, res );
  });

  app.post('/cargaEspecialidades', function( req, res ){
    intermed.callController('search','cargaEspecialidades',req,res);
  });
  app.post('/cargaPadecimiento', function( req, res ){
    intermed.callController('search','cargaPadecimiento', req, res );
  });

  app.post('/loadGenerales', function( req, res ){
    intermed.callController('medicos','loadGenerales', req, res );
  });
  app.post('/loadEspecialidades', function( req, res ){
    intermed.callController('medicos','loadEspecialidades', req, res );
  });
  app.post('/loadPadecimientos', function( req, res ){
    intermed.callController('medicos','loadPadecimientos', req, res );
  });
  app.post('/loadPalabras', function( req, res ){
    intermed.callController('medicos','loadPalabras', req, res );
  });
  app.post('/mEditMedic', function( req, res ){
    intermed.callController('medicos','mEditMedic', req, res );
  });
  app.post('/todasEspecialidades', function( req, res ){
    intermed.callController('medicos','todasEspecialidades', req, res);
  });
  app.post('/sacaMedicoId', function( req, res ){
    intermed.callController('medicos','sacaMedicoId',req,res);
  });
  app.post('/editEspecialidades', function( req, res ){
    intermed.callController('medicos','editEspecialidades', req, res);
  });
  app.post('/deleteEsp', function( req, res ){
    intermed.callController('medicos','deleteEsp', req, res );
  });
  app.post('/traePadecimientos', function( req, res ){
    intermed.callController('medicos', 'traePadecimientos',req, res);
  });
  app.post('/editPadecimientos', function( req, res ){
    intermed.callController('medicos','editPadecimientos', req, res);
  });
  app.post('/traerPalabras', function( req, res) {
    intermed.callController('medicos','traerPalabras', req, res);
  });
  app.post('/editPalabrasClave', function( req, res){
    intermed.callController('medicos','editPalabrasClave', req, res);
  });
  app.post('/deletePad', function( req, res ){
    intermed.callController('medicos','deletePad',req, res);
  });
  app.post('/deletePalabra', function( req, res ){
    intermed.callController('medicos','deletePalabra',req, res);
  });
  //<---------- FECHA LUNEs 14-15-2015 -------------->
  app.post('/deleteSubEsp', function( req, res ){
    intermed.callController('medicos','deleteSubEsp', req, res );
  });
  //<---------- FIN FECHA LUNES --------------------->

  app.post('/cargarEspecialidades', function (req, res){
    intermed.callController('search','cargarEspecialidades',{},req, res);
  });

  app.post('/cargarPadecimientos', function(req, res){
    intermed.callController('search','cargarPadecimientos',{},req, res);
  });

  app.post('/cargarInstituciones', function( req, res){
    intermed.callController('search','cargarInstituciones',{},req, res);
  });

  app.post('/cargarAseguradoras', function( req, res){
    intermed.callController('search','cargarAseguradoras',{},req, res);
  });

  app.post('/traerServiciosPorMedico', function(req, res){
    intermed.callController('catServicios','traerServiciosPorMedico',req.body, req, res);
  });

  app.post('/medico/calificar', function (req, res){
    intermed.callController('medicos','calificar', req.body, req, res);
  });

  app.post('/medico/dejarComentario', function (req, res){
    intermed.callController('medicos','dejarComentario', req.body, req, res);
  });

  app.post('/medico/cargarComentarios', function(req, res){
    intermed.callController('medicos','cargarComentarios', req.body, req, res);
  });

  app.post('/medico/formacionAcademica/agregar', function(req, res){
    intermed.callController('medicos','agregarFormacionAcademica', req.body, req, res);
  });

  app.post('/medico/formacionAcademica/cargar', function(req, res){
    intermed.callController('medicos','cargarFormacionAcademica', req.body, req, res);
  });

  app.post('/medico/formacionAcademica/cargarById', function(req,res){
    intermed.callController('medicos','cargarFormacionAcademicaByID', req.body, req, res);
  });

  app.post('/medico/experienciaLaboral/cargarById', function(req,res){
    intermed.callController('medicos','cargarExperienciaLaboralByID', req.body, req, res);
  });

  app.post('/medico/experienciaLaboral/agregar', function (req, res){
    intermed.callController('medicos','agregarExperienciaLaboral', req.body, req, res);
  });

  app.post('/medico/datos/loadFechaNac', function( req, res ){
    intermed.callController('medicos','loadFechaNac', req, res);
  });

  app.post('/medico/datos/regFechaNacimiento', function( req, res ){
    intermed.callController('medicos','regFechaNacimiento', req.body, req, res );
  });

  app.post('/medicos/cedula/update', function (req, res){
    intermed.callController('medicos','updateCedula', req.body, req, res);
  });

  app.post('/medicos/address/get', function (req, res){
    intermed.callController('medicos','addressGet', req.body, req, res);
  });

  app.post('/medicos/serv/update', function (req, res){
    intermed.callController('medicos','serbUpdate', req.body, req, res);
  });

  app.post('/medicos/serv/getByAddr', function (req, res){
    intermed.callController('medicos','serbGetByAddr', req.body, req, res);
  });

  app.post('/medicos/serv/drop', function (req, res){
    intermed.callController('medicos','servDrop', req.body, req, res);
  });

  app.post('/medicos/ubic/minconf', function (req, res){
    intermed.callController('medicos','ubicMinConf', req.body, req, res);
  });

  app.post('/medicos/enc/exist', function (req, res){
    intermed.callController('control','encExist', req.body, req, res);
  });

  app.post('/medico/experienciaLaboral/cargar', function (req, res){
    intermed.callController('medicos','cargarExperienciaLaboral', req.body, req, res);
  });

  app.post('/medico/comentario/visible', function(req, res){
    intermed.callController('medicos','comentarioVisible', req.body, req, res);
  });

  app.post('/medico/comentario/responder', function (req, res){
    intermed.callController('medicos','comentarioResponder', req.body, req, res);
  });

  app.post('/medicos/cedula/general', function (req, res){
    intermed.callController('medicos','cedulaGeneral', req.body, req, res);
  });

  app.post('/medicos/registrar/datosgenerales', function (req, res){
    intermed.callController('medicos','registrarDatosGenerales', req.body, req, res);
  });

  app.post('/medicos/especialidadestudio/agregar', function (req, res){
    intermed.callController('medicos','especialidadEstudioAgregar', req.body, req, res);
  });

  app.post('/medico/detalleMedico', function (req, res){
    intermed.callController('medicos','detalleMedico', req.body, req, res);
  });

  app.post('/medico/feedback', function (req, res){
    intermed.callController('medicos','getFeedback', req.body, req, res);
  });

  app.post('/gallery/upload', function (req, res){
    intermed.callController('galeria','upload', req.body, req, res);
  });

  app.post('/galeria/eliminar', function (req, res){
    intermed.callController('galeria','eliminar', req.body, req, res);
  });

  app.post('/galeria/actualizar', function (req, res){
    intermed.callController('galeria','actualizar', req.body, req, res);
  });

  app.post('/galeria/obtener', function (req, res){
    intermed.callController('galeria','obtener', req.body, req, res);
  });
}
