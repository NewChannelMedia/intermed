var models  = require('../models');

/**
Controlador de para médicos
*	@author Ivan Salcedo
*	@version 0.0.0.0
*/

module.exports = {
// obtiene médicos por ajax
  obtieneAjax: function(object, req, res){
    models.Medico.findAll({
      include: [{ model: models.DatosGenerales },
        { model: models.Medico },
        { model: models.Direccion},
        { model: models.Telefono},
      ]}).then(function(datos) {
        res.send(datos);
    });
  },
  // Método que muesta la pantalla de registro
  selecciona: function(object, req, res) {
		//Obteniendo estados
  	  models.Estado.findAll().then(function(estados) {
  			// Obteniendo especialidades
  			models.Especialidad.findAll().then(function(especialidades) {
          // Obteniendo médicos
          models.Usuario.findAll({
            include: [{ model: models.DatosGenerales },
              { model: models.Medico },
              { model: models.Direccion},
              { model: models.Telefono},
            ]}
          ).then(function(medicos) {
      				//Rendereando index y pasando los registros a la vista
        		  res.render('medicos/registro', {
        		    estados: estados,
        				especialidades : especialidades,
                medicos: medicos
        			});
          });
  		});
  	});
  },
  // Método que registra médicos
  registrar: function(object, req, res) {
      // Inicia transacción de registro de médicos
      models.sequelize.transaction({
          isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, function (t) {

          // Creando usuario
          models.Usuario.create({
              usuario: object['correoMed'],
              correo:  object['correoMed'],
              password: 'intermed123',
              tipoUsuario: 'M',
              tipoRegistro: '',
              estatusActivacion : '1'
          })
          .then(function(usuario) {
              // si fue exitoso, actualizamos  datos generales, direcciones, telefonos y médicos
              // tomamos el id que le toco al usuario
              var id = usuario.id;

              models.DatosGenerales.create({
                nombre: object['nombreMed'],
                apellidoP: object['apellidoMed'],
                apellidoM: object['apellidoMed'],
                rfc: '',
                usuario_id: id
              });

              models.Direccion.create({
                calle: object['calleMed'],
                numero: object['numeroMed'],
                calle1: object['calle1Med'],
                calle2: object['calle2Med'],
                colonia: object['coloniaMed'],
                estado_id: object['estadoMed'],  //Id del estado
                ciudad: object['ciudadMed'],
                cp: object['cpMed'],
                principal: 1,
                usuario_id: id
              });

              models.Telefono.create({
                  tipo: '1',
                  telefono: object['telefonoMed'],
                  usuario_id: id
              });

              models.Medico.create({
                cedula: '',
                codigoMedico: '',
                usuario_id: id
              }).then(function(medico) {
                  // si se pudo insertar el médico, tomamos su id para pasarlo a medicos especialidades y agregarla
                  models.MedicoEspecialidad.create({
                      tipo: '1',
                      titulo: '',
                      lugarEstudio: '',
                      medico_id: medico.id,
                      especialidad_id: object['especialidadMed']   // Id de la especialidad
                  })
              })
          });

        }).then(function(result) {
              // transacción completa
              res.status(200).json({ok: true});
        }).catch(function(err) {
              res.status(500).json({error: err});
        });
    },

    // Método para actualizar médicos
    actualizar: function(object, req, res) {

        var id = object['id'];
        var idMedico = object['idMedico'];

        models.sequelize.transaction({
            isolationLevel: Sequelize.Transaction.SERIALIZABLE
          }, function (t) {

              // actualizando usuario
              models.Usuario.update({
                  usuario: object['correoMed'], correo: object['correoMed']
                }, {
                  where: { id : id }
              });

              // actualizando nombres
              models.DatosGenerales.update({
                   nombre: object['nombreMed'],
                   apellidoP: object['apellidoMed'],
                   apellidoM: object['apellidoMed']
                 }, {
                   where: { usuario_id : id }
              });

              // actualizando dirección
              models.Direccion.update({
                   calle: object['calleMed'],
                   numero: object['numeroMed'],
                   calle1: object['calle1Med'],
                   calle2: object['calle2Med'],
                   colonia: object['coloniaMed'],
                   estado_id: object['estadoMed'],
                   ciudad: object['ciudadMed'],
                   cp: object['cpMed'],
                 }, {
                   where: { usuario_id : id }
               });

              // actualizando telefono
               models.Telefono.update({
                   telefono: object['telefonoMed']
                 }, {
                   where: { usuario_id : id }
               });

               // actualizando especialidad del médico
               models.MedicoEspecialidad.update({
                   especialidad_id: object['especialidadMed']
                 }, {
                   where: { medico_id : idMedico }
               });

          }).then(function(result) {
                // transacción completa
                res.status(200).json({ok: true});
          }).catch(function(err) {
                res.status(500).json({error: err});
          });
    }
}
