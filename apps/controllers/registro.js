var models  = require('../models');
/**
* 	En este archivo se atraparan los eventos de la plantilla home.handlebars,
*	asi como también hara la función de recibir y enviar los datos del modelo,
*	hacía la vista. Se trabajara con una función que simulara como la clase de este
*	archivo y dentro de esta función es como se trabajara.
*	Dentro de los metodos iran las llamadas a los metodos o llamados de los modelos y el envio de los parametros
*	@author Oscar, Cinthia.
*	@version 0.0.0.0
*/
//librerias que se utilizaran en este archivo
module.exports = {
	index: function(object, req, res) {
		/*if (!req.session.passport.admin){
			res.redirect('/')
		}
		else{*/
			models.Estado.findAll().then(function (estados){
				res.render('registro', {logged: req.session.passport.logged, estados: estados});
			})
		/*}
*/	},
	registrar: function(object, req, res) {
		object = [object];
		res.send(object);
	},
	getAll: function(object, req, res){

		var data = {};
		var id_localidad ;
		var id_municipio ;
			 models.Usuario.findAll({
      			include: [

        				 { model: models.Medico,attributes: ['id'], required: true},
        				 	{model: models.DatosGenerales},
        				 	{model: models.Direccion},
        				 	{model: models.Telefono,attributes: ['usuario_id','numero'], required: true}
     			 
     			 ]}).then(function (datos){
	   	
			 	models.Localidad.findAll({
		       		include: [

		       		 		{model: models.Direccion,attributes: ['localidad_id'], required: true},

		       		 ]

    		}).then( function (localidad){ 			
				
		

    			models.Especialidad.findAll({
    				include : [

    					{model: models.MedicoEspecialidad, attributes:['medico_id'], required: true}

    				]

				 }).then( function (especialidad){
				

					var data = {};
					//var jsn = JSON.stringify(data);
					

					counter = 0;

					datos.forEach( function (task){

					 		counter++;

					 	var numero;
					 	task.Telefonos.forEach( function (tel){
					 				numero = tel.numero

					 		} )
					 	var direccion;

					 	task.Direccions.forEach( function (dir){

					 		direccion = dir.calle + ' Entre '+ (dir.calle1 != null ? dir.calle1 : ' Desconocida ' ) + ' Y ' + (dir.calle2 != null ? dir.calle2 : 'Desconocida'); 

					 	});

					 
					 	
					 	data[counter-1] = 
					 	{
					 		id: task.id,
					 		nombre : task.DatosGenerale.nombre,
					 		apellidoP : task.DatosGenerale.apellidoP,
					 		apellidoM : task.DatosGenerale.apellidoM,
					 		correo : task.correo,
					 		telefono : numero,
					 		calle : direccion,
					 		numCalle : numero,
					 		
					 	}
					 
					});

					 counter = 0;
					 localidad.forEach( function (local){
					 	counter++;	
					 	data[counter-1]['localidad'] = local.localidad;
					 	data[counter-1]['cp'] = local.CP;

					 });

					 counter = 0;
					 especialidad.forEach( function (esp){
					 	counter++;	
					 	data[counter-1]['especialidad'] = esp.especialidad;

					 });
					 		
					 	var jsn = JSON.stringify(data);
						console.log(data);
				 		res.send(jsn);
				 });
    				
			});				
     			 			
     });




		/*
		var allDoctors = [ //Eliminar al conectar con el modelo, solo se agrego con finalidades de simulación
		{
			'nombreMed': 'Médico 1',
			'apellidoMed': 'Apellido',
			'correoMed': 'Correo',
			'telefonoMed': 'Teléfono',
			'calleMed': 'Calle',
			'numeroMed': 'Número',
			'calle1Med': 'Calle1',
			'calle2Med': 'Calle 2',
			'coloniaMed': 'Colonia',
			'cpMed': 'CP',
			'ciudadMed': 'Ciudad',
			'estadoMed': 'Estado',
			'especialidadMed': 'Especialidad'
		},
		{
			'nombreMed': 'Médico 1',
			'apellidoMed': 'Apellido',
			'correoMed': 'Correo',
			'telefonoMed': 'Teléfono',
			'calleMed': 'Calle',
			'numeroMed': 'Número',
			'calle1Med': 'Calle1',
			'calle2Med': 'Calle 2',
			'coloniaMed': 'Colonia',
			'cpMed': 'CP',
			'ciudadMed': 'Ciudad',
			'estadoMed': 'Estado',
			'especialidadMed': 'Especialidad'
		},
		{
			'nombreMed': 'Médico 1',
			'apellidoMed': 'Apellido',
			'correoMed': 'Correo',
			'telefonoMed': 'Teléfono',
			'calleMed': 'Calle',
			'numeroMed': 'Número',
			'calle1Med': 'Calle1',
			'calle2Med': 'Calle 2',
			'coloniaMed': 'Colonia',
			'cpMed': 'CP',
			'ciudadMed': 'Ciudad',
			'estadoMed': 'Estado',
			'especialidadMed': 'Especialidad'
		}
		];
*/
		
	}
}
