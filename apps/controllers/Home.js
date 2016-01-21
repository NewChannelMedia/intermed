/**
 * 	En este archivo se atraparan los eventos de la plantilla home.hbs,
 *	asi como también hara la función de recibir y enviar los datos del modelo,
 *	hacía la vista. Se trabajara con una función que simulara como la clase de este
 *	archivo y dentro de esta función es como se trabajara.
 *	Dentro de los metodos iran las llamadas a los metodos o llamados de los modelos y el envio de los parametros
 *	@author Oscar, Cinthia.
 *	@version 0.0.0.0
 */
//librerias que se utilizaran en este archivo
var models = require( '../models' );
var http = require( 'http' ),
  fs = require( 'fs' );
var objecto;
var plataform2 = require( './plataforma.js' );
module.exports = {
  /**
   *	En el siguiente metodo es el que se encargara del envio
   *	que se obtengan de la base de datos, se mandaran hacia la
   *	vista.
   */
  index: function ( object, req, res ) {
    models.Especialidad.findAll( {
      attributes: [ 'id', 'especialidad' ]
    } ).then( function ( especia ) {
      models.Padecimiento.findAll( {
        attributes: [ 'id', 'padecimiento' ]
      } ).then( function ( padeci ) {
        models.Estado.findAll( {
          attributes: [ 'id', 'estado' ]
        } ).then( function ( estado ) {
          models.Ciudad.findAll( {} ).then( function ( ciudad ) {
            res.render( 'home', {
              especia: especia,
              padecimiento: padeci,
              estado: estado,
              ciudad: ciudad
            } );
          } );
        } );
      } );
    } );
  },
  perfil: function ( object, req, res ) {
    usuario = object.usuario;

    if ( ( req.session.passport.user && ( !usuario ) ) || ( req.session.passport.user && usuario == req.session.passport.user.usuarioUrl ) ) {
      var tipoUsuario = '';
      if ( req.session.passport.user.tipoUsuario == 'M' ) tipoUsuario = 'medico';
      else if ( req.session.passport.user.tipoUsuario == 'P' ) tipoUsuario = 'paciente';

      models.Estado.findAll( {
        attributes: [ 'id', 'estado' ]
      } ).then( function ( estados ) {
        res.render( tipoUsuario + '/perfil', {
          estados: estados
        } );
        if ( !usuario ) req.session.passport.user.logueado = "1";
      } );
    }
    else if ( usuario ) {
      //Perfil de otro usuario
      models.Usuario.findOne( {
        where: {
          usuarioUrl: usuario
        },
        include: [ {
          model: models.DatosGenerales,
          attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                }, {
          model: models.Medico,
          attributes: [ 'id' ],
          include: [ {
            model: models.MedicoEspecialidad,
            attributes: [ 'id', 'subEsp' ],
            include: [ {
              model: models.Especialidad
                        } ]
                    } ]
                }, {
          model: models.Paciente,
          attributes: [ 'id' ]
                } ]
      } ).then( function ( usuario ) {
        if ( usuario ) {
          usuario = JSON.parse( JSON.stringify( usuario ) );

          if ( req.session.passport.user && ( usuario.Medico || usuario.Paciente ) ) {
            if (usuario.Medico){
              var condiciones = {
                usuario_id: req.session.passport.user.id,
                medico_id: usuario.Medico.id
              };
            } else {
              var condiciones = {
                usuario_id: req.session.passport.user.id,
                paciente_id: usuario.Paciente.id
              };
            }
            cargarInfoPerfil( usuario, condiciones, req, res );
          }
          else {
            models.Direccion.findOne( {
              where: {
                usuario_id: usuario.id
              }
            } ).then( function ( direccion ) {
              if ( direccion ) {
                models.sequelize.query( "SELECT `Localidad`.`CP`, `Localidad`.`localidad`, `TipoLocalidad`.`id` AS 'tipo_id', `TipoLocalidad`.`tipo`, `Ciudad`.`id` AS 'ciudad_id', `Ciudad`.`ciudad`, `Municipio`.`id` AS 'municipio_id', `Municipio`.`municipio`, `Estado`.`id` AS 'estado_id', `Estado`.`estado` FROM `localidades` AS `Localidad`INNER JOIN `tipoLocalidad` AS `TipoLocalidad` ON `TipoLocalidad`.`id` = `Localidad`.`tipo_localidad_id` INNER JOIN `ciudades` AS `Ciudad` ON `Localidad`.`ciudad_id` = `Ciudad`.`id` and `Localidad`.`municipio_id` = `Ciudad`.`municipio_id` and `Localidad`.`estado_id` = `Ciudad`.`estado_id` INNER JOIN `municipios` AS `Municipio` ON `Localidad`.`municipio_id` = `Municipio`.`municipio_id` and `Localidad`.`estado_id` = `Municipio`.`estado_id` INNER JOIN `estados` AS `Estado` ON `Localidad`.`estado_id` = `Estado`.`id` WHERE `Localidad`.`id` = " + direccion.localidad_id + ";", {
                    type: models.sequelize.QueryTypes.SELECT
                  } )
                  .then( function ( localidad ) {
                    if (usuario.localidad && localidad[0]){
                      usuario.localidad = {
                        ciudad: localidad[ 0 ].ciudad,
                        estado: localidad[ 0 ].estado
                      };
                    }
                    armarPerfil( usuario, req, res );
                  } )
              }
              else {
                armarPerfil( usuario, req, res );
              }
            } );
          }
        }
        else {
          res.status( 200 ).send( 'El usuario \'' + object.usuario + '\' no existe.' );
        }
      } );
    }
    else {
      res.redirect( global.base_url);
    }
  },
  aboutPacientes: function ( object, req, res ) {
    res.render( 'pacientes', object )
  },
  perfilMedicos: function ( object, req, res ) {
    res.render( 'perfil', object )
  },
  perfilPacientes: function ( object, req, res ) {
    res.render( 'perfil', object )
  },

  //perfil nuevo
  nuevoPerfilMedicos: function ( object, req, res ) {
    usuario = object.usuario;
    var uUrl = "";
    var uTipo = "";
    if ( ( req.session.passport.user && ( !usuario ) ) || ( req.session.passport.user && usuario == req.session.passport.user.usuarioUrl ) || ( req.session.passport.user && usuario == req.session.passport.user.urlPersonal ) ) {
      var tipoUsuario = '';
      if ( req.session.passport.user.tipoUsuario == 'M' ) tipoUsuario = 'medico';
      else if ( req.session.passport.user.tipoUsuario == 'P' ) tipoUsuario = 'paciente';

      models.Estado.findAll( {
        attributes: [ 'id', 'estado' ]
      } ).then( function ( estados ) {
        models.Direccion.findAll({
            where: {
                usuario_id: req.session.passport.user.id
            },
            order: [['principal','DESC']],
            attributes: ['id', 'nombre', 'latitud', 'longitud', 'calle', 'numero', 'calle1','calle2','principal'],
            include: [{
              model: models.Localidad,
              attributes: ['localidad','CP'],
              include: [{
                  model: models.TipoLocalidad,
                  attributes: ['tipo'],
              }],
              },
              {
                  model: models.Municipio,
                  attributes: ['municipio'],
                  include: [{
                      model: models.Estado,
                      attributes: ['estado'],
                  }],
              },
              {
                  model: models.Telefono
              },{
                model: models.Usuario,
                attributes:['usuarioUrl','tipoUsuario']
              }],
              order: [['principal', 'DESC']]
        }).then(function (direccion) {
          if (req.session.passport.user.Medico_id){
            var medico = {};
            models.MedicoExpertoEn.findAll({
                where: {medico_id: req.session.passport.user.Medico_id},
                order: [['orden','ASC']]
              }).then(function(expertoen){
                  medico['MedicoExpertoEns'] = expertoen;
                  models.MedicoClinica.findAll({
                      where: {medico_id: req.session.passport.user.Medico_id},
                      order: [['orden','ASC']]
                    }).then(function(clinica){
                        medico['MedicoClinicas'] = clinica;
                        models.MedicoAseguradora.findAll({
                          where: {medico_id: req.session.passport.user.Medico_id},
                          order: [['orden','ASC']]
                        }).then(function(aseguradora){
                          var prueba = "";
                          plataform2.plataform2(req.session.passport.user.usuarioUrl,req,res, function(response){
                            medico['MedicoAseguradoras'] = aseguradora;
                            var vista = '/nuevoPerfilMedicos';
                            res.render( tipoUsuario + vista, {
                              medico: medico,
                              estados: estados,
                              usuario:{Direccions: JSON.parse(JSON.stringify(direccion))},
                              keywords: response
                            } );
                          });
                        });
                    });
                  });
          } else {
              res.render( tipoUsuario + '/nuevoPerfilMedicos', {
                estados: estados,
                usuario:{Direccions: JSON.parse(JSON.stringify(direccion))}
              } );
          }
        })
        if ( !usuario ) req.session.passport.user.logueado = "1";
      } );
    }
    else if ( usuario ) {
      //Perfil de otro usuario
      models.Usuario.findOne( {
        where: models.Sequelize.or({
          urlPersonal: usuario
        },{
          usuarioUrl: usuario
        }),
        include: [ {
          model: models.DatosGenerales,
          attributes: [ 'nombre', 'apellidoP', 'apellidoM' ]
                }, {
          model: models.Medico,
          attributes: [ 'id' ],
          include: [ {
            model: models.MedicoEspecialidad,
            attributes: [ 'id', 'subEsp' ],
            include: [ {
              model: models.Especialidad
                        } ]
                    } ]
                }, {
          model: models.Paciente,
          attributes: [ 'id' ]
                }]
      } ).then( function ( usuario ) {
        if ( usuario ) {
          models.Direccion.findAll({
             where: {usuario_id: usuario.id},
             order: [['principal', 'DESC']],
             attributes: ['id', 'nombre', 'latitud', 'longitud', 'calle', 'numero', 'calle1','calle2','principal'],
             include: [{
             model: models.Localidad,
             attributes: ['localidad','CP'],
             include: [{
                 model: models.TipoLocalidad,
                 attributes: ['tipo'],
             }],
             },
             {
             model: models.Municipio,
             attributes: ['municipio'],
             include: [{
                 model: models.Estado,
                 attributes: ['estado'],
             }],
            },
             {
                 model: models.Telefono
             }]
          }).then(function(direccion){
            usuario = JSON.parse( JSON.stringify( usuario ) );
            usuario.Direccions = JSON.parse(JSON.stringify(direccion));

            if ( req.session.passport.user && ( usuario.Medico || usuario.Paciente ) ) {
              if (usuario.Medico){
                var condiciones = {
                  usuario_id: req.session.passport.user.id,
                  medico_id: usuario.Medico.id
                };
              } else {
                var condiciones = {
                  usuario_id: req.session.passport.user.id,
                  paciente_id: usuario.Paciente.id
                };
              }
              cargarInfoPerfilNuevo( usuario, condiciones, req, res );
            }
            else {
              armarPerfilNuevo( usuario, req, res );
            }
          });
        }
        else {
          res.status( 200 ).send( 'El usuario \'' + object.usuario + '\' no existe.' );
        }
      } );
    }
    else {
      res.redirect( global.base_url);
    }
    //res.render( 'nuevoPerfilMedicos', object )
  },

  sayHello: function ( object, req, res ) {
    res.render( 'home', {}, function ( err, html ) {
      res.send( html )
    } );
  },
  vacio: function ( object, req, res ) {
    models.Estado.findAll( {
      attributes: [ 'id', 'estado' ]
    } ).then( function ( estado ) {
      models.Ciudad.findAll( {} ).then( function ( ciudad ) {
        res.render( 'searchMedic', {
          estado: estado
        } );
      } );
    } );
  },
  /**
   *	EL siguiente metodo es el que realizara las busquedas,
   *	dependiendo del primer input, que es donde se elige
   *	por que sera su busqueda. Teniendo ese valor del select
   *	se mandara a un if para que se verifique que es lo que se tiene
   *	que enviar y se devuelve a la vista el resultado de la busqueda
   *
   *	@param object recibe el objeto con todos los valores del input
   *	@param req el request del servidor
   *	@param response
   *
   */
  searching: function (  object, req, res ) {
      var render = {};
      render.nombre = object.nombreMed;
      render.estado = object.selectEstado;
      render.municipio = object.selectCiudad;
      render.tipoBusqueda = object.tipoBusqueda;
      render.inputEspecialidad = object.hiddenEspecialidad;
      render.inputPadecimiento = object.hiddenPadecimiento;
      render.inputInstitucion = object.hiddenInstitucion;
      render.inputAseguradora = object.hiddenAseguradora;

      models.Estado.findAll( {
        attributes: [ 'id', 'estado' ]
      } ).then( function ( estado ) {
        if (render.estado>0){
          models.Municipio.findAll({
            where: {
              estado_id: render.estado
            }
          }).then(function(municipios){
            render.municipios = municipios;
            res.render( 'searchMedic', {
              estado: estado,
              render: render
            } );
          })
        } else {
          res.render( 'searchMedic', {
            estado: estado,
            render: render
          } );
        }
      } );
    }, //fin del metodo searching
    homeEspecialidades: function( req, res ){
      // carga la info para que retorne las especialidades
      models.Especialidad.findAll({
        attributes:['id','especialidad']
      }).then(function(especialidades){
        res.send(especialidades);
      });
    },
    homePadecimientos: function( req, res ){
      models.Padecimiento.findAll({
        attributes:['id','padecimiento']
      }).then(function(padecimiento){
        res.send(padecimiento);
      })
    },
    homeEstados: function( req, res ){
      models.Estado.findAll({
        attributes:['id','estado']
      }).then(function(estado){
        res.send(estado);
      });
    },
    homeCiudad: function( req, res ){
      models.Municipio.findAll({
        where:{estado_id:req.body.id},
        attributes:['id','municipio']
      }).then( function( ciudades ){
        res.send(ciudades);
      });
    }
}

function armarPerfil( usuario, req, res ) {
  usuario = JSON.parse( JSON.stringify( usuario ) );
  var especialidades = [];
  if ( usuario.tipoUsuario == "M" && usuario.Medico.MedicoEspecialidads ) {
    usuario.especialidades = JSON.parse( JSON.stringify( usuario.Medico.MedicoEspecialidads ) );
  }

  var tipoUsuario = 'Paciente';
  if ( usuario.tipoUsuario == 'M' ) tipoUsuario = 'Medico';
  models[ tipoUsuario ].findOne( {
    where: {
      usuario_id: usuario.id
    }
  } ).then( function ( result ) {
    usuario[ tipoUsuario ] = JSON.parse( JSON.stringify( result ) );
    res.render( tipoUsuario.toLowerCase() + '/perfil', {
      usuario: usuario
    } );
  } )
}

function cargarInfoPerfil( usuario, condiciones, req, res ) {
  models.MedicoFavorito.findOne( {
    where: condiciones
  } ).then( function ( result ) {
    if ( result ) {
      if ( result.aprobado == 1 && result.mutuo == 1 ) {
        usuario.medFavCol = result.id;
      }
      else if ( result.aprobado == 1 && result.mutuo == 0 ) {
        usuario.invitacionEnviada = "1";
      }
      else {
        usuario.invitacionEspera = "1";
      }
    } else {
      usuario.noAmigos = "1";
    }

    models.Direccion.findOne( {
      where: {
        usuario_id: usuario.id
      }
    } ).then( function ( direccion ) {
      if ( direccion ) {
        models.sequelize.query( "SELECT `Localidad`.`CP`, `Localidad`.`localidad`, `TipoLocalidad`.`id` AS 'tipo_id', `TipoLocalidad`.`tipo`, `Ciudad`.`id` AS 'ciudad_id', `Ciudad`.`ciudad`, `Municipio`.`id` AS 'municipio_id', `Municipio`.`municipio`, `Estado`.`id` AS 'estado_id', `Estado`.`estado` FROM `localidades` AS `Localidad`INNER JOIN `tipoLocalidad` AS `TipoLocalidad` ON `TipoLocalidad`.`id` = `Localidad`.`tipo_localidad_id` INNER JOIN `ciudades` AS `Ciudad` ON `Localidad`.`ciudad_id` = `Ciudad`.`id` and `Localidad`.`municipio_id` = `Ciudad`.`municipio_id` and `Localidad`.`estado_id` = `Ciudad`.`estado_id` INNER JOIN `municipios` AS `Municipio` ON `Localidad`.`municipio_id` = `Municipio`.`municipio_id` and `Localidad`.`estado_id` = `Municipio`.`estado_id` INNER JOIN `estados` AS `Estado` ON `Localidad`.`estado_id` = `Estado`.`id` WHERE `Localidad`.`id` = " + direccion.localidad_id + ";", {
            type: models.sequelize.QueryTypes.SELECT
          } )
          .then( function ( localidad ) {
            if(localidad[0]){
              usuario.localidad = {
                ciudad: localidad[ 0 ].ciudad,
                estado: localidad[ 0 ].estado
              };
            }
            armarPerfil( usuario, req, res );
          } )
      }
      else {
        armarPerfil( usuario, req, res );
      }
    } );
  } );
}



function cargarInfoPerfilNuevo( usuario, condiciones, req, res ) {
  usuario = JSON.parse(JSON.stringify(usuario));
  models.MedicoFavorito.findOne( {
    where: condiciones
  } ).then( function ( result ) {
    if (req.session.passport && req.session.passport.user && req.session.passport.user.Medico_id && usuario.Paciente){
      //Checar si es un medico que atiende
      models.MedicoPaciente.findOne({
        where:{
          medico_id: req.session.passport.user.Medico_id,
          paciente_id: usuario.Paciente.id
        }
      }).then(function(MedicoQueAtiende){
        if ( result ) {
          if (MedicoQueAtiende){
            usuario.medPac = "1";
          }
          if ( result.aprobado == 1 && result.mutuo == 1 ) {
            usuario.medFavCol = result.id;
          }
          else if ( result.aprobado == 1 && result.mutuo == 0 ) {
            usuario.invitacionEnviada = "1";
          }
          else {
            usuario.invitacionEspera = "1";
          }
        } else {
          usuario.noAmigos = "1";
        }
        armarPerfilNuevo( usuario, req, res );
      });
    } else if (req.session.passport && req.session.passport.user && req.session.passport.user.Paciente_id && usuario.Medico){
      //Checar si es un medico que atiende
      models.MedicoPaciente.findOne({
        where:{
          medico_id: usuario.Medico.id,
          paciente_id: req.session.passport.user.Paciente_id
        }
      }).then(function(MedicoQueAtiende){
        if ( result ) {
          if (MedicoQueAtiende){
            usuario.medPac = "1";
          }
          if ( result.aprobado == 1 && result.mutuo == 1 ) {
            usuario.medFavCol = result.id;
          }
          else if ( result.aprobado == 1 && result.mutuo == 0 ) {
            usuario.invitacionEnviada = "1";
          }
          else {
            usuario.invitacionEspera = "1";
          }
        } else {
          usuario.noAmigos = "1";
        }
        armarPerfilNuevo( usuario, req, res );
      });
    } else {
      if ( result ) {
        if ( result.aprobado == 1 && result.mutuo == 1 ) {
          usuario.medFavCol = result.id;
        }
        else if ( result.aprobado == 1 && result.mutuo == 0 ) {
          usuario.invitacionEnviada = "1";
        }
        else {
          usuario.invitacionEspera = "1";
        }
      } else {
        usuario.noAmigos = "1";
      }
      armarPerfilNuevo( usuario, req, res );
    }
  } );
}


function armarPerfilNuevo( usuario, req, res ) {
  usuario = JSON.parse( JSON.stringify( usuario ) );
  var especialidades = [];
  if ( usuario.tipoUsuario == "M" && usuario.Medico.MedicoEspecialidads ) {
    usuario.especialidades = JSON.parse( JSON.stringify( usuario.Medico.MedicoEspecialidads ) );
  }

  var tipoUsuario = 'Paciente';
  if ( usuario.tipoUsuario == 'M' )
    tipoUsuario = 'Medico';

  models[ tipoUsuario ].findOne( {
    where: {
      usuario_id: usuario.id
    }
  } ).then( function ( result ) {
    if ( usuario.tipoUsuario == 'M' ) {
      var medico = {};
      models.MedicoExpertoEn.findAll( {
        where: {
          medico_id: result.id
        },
        order: [ [ 'orden', 'ASC' ] ]
      } ).then( function ( expertoEn ) {
        medico[ 'MedicoExpertoEns' ] = expertoEn;

            models.MedicoClinica.findAll({
                where: {medico_id: result.id},
                order: [['orden','ASC']]
              }).then(function(clinica){
                  medico['MedicoClinicas'] = clinica;
                  models.MedicoAseguradora.findAll({
                    where: {medico_id: result.id},
                    order: [['orden','ASC']]
                  }).then(function(aseguradora){
                    plataform2.plataform2(usuario.usuarioUrl, req, res, function(response){
                      medico['MedicoAseguradoras'] = aseguradora;
                      usuario[ tipoUsuario ] = JSON.parse( JSON.stringify( result ) );
                      var vista = '/nuevoPerfilMedicos';
                      if (!(req.session.passport && req.session.passport.user && req.session.passport.user.id > 0)){
                        var vista = '/vistaPerfilNoRegistrado';
                      }
                      res.render( tipoUsuario.toLowerCase() + vista, {
                        usuario: usuario,
                        medico: medico,
                        keywords: response
                      } );
                  });
              });
          });
        });
    } else {
      usuario[ tipoUsuario ] = JSON.parse( JSON.stringify( result ) );
      res.render( tipoUsuario.toLowerCase() + '/nuevoPerfilMedicos', {
        usuario: usuario
      } );
    }
  } );
}
