var models = require('../models');

//Conekta
var conekta = require('conekta');
conekta.api_key = "key_KP2rs6xsxH3r6jy9y7vhWg";
conekta.api_version = '1.0.0';
conekta.locale = 'es'

exports.FormularioCobro = function (req, res) {
    res.render('cargodirecto', {
        title: 'Pagar',
        usuario_id: 1
    });
}

exports.ProcesarCargosClientes = function (object, req, res) {
    models.Usuario.findOne({
        where: {
            id: object.usuario_id
        },
        attributes: ['id', 'correo'],
        include: [
         {
             model: models.DatosGenerales,
             attributes: ['nombre', 'apellidoP', 'apellidoM']
         },
         //{
         //    model: models.Telefono,
         //    attributes: ['nombre', 'apellidoP', 'apellidoM']
         //},
         {
             model: models.DatosFacturacion,
             attributes: ['RFC', 'razonSocial'],
             include: [
                 {
                     model: models.Direccion,
                     attributes: ['calle', 'numero'],
                     include: [
                         {
                             model: models.Localidad,
                             attributes: ['localidad', 'cp'],
                             include: [
                                 {
                                     model: models.Municipio,
                                     attributes: ['municipio'],
                                 },
                                 {
                                     model: models.Estado,
                                     attributes: ['estado'],
                                 }
                             ]
                         }
                     ]
                 }
             ]
         }
        ]
    })
     .then(function (datos) {
         if (datos) {
             RealizarCargo(res, object.conektaTokenId, datos);
         }
     }).catch(function (err) {
         console.log(err);
     });
}

function RealizarCargo(res, conektaTokenId, datos) {
    models.UsuarioCargo.findOne({
        where: {
            medico_id: datos.id
        }
    })
    .then(function (usuariocargo) {
        if (usuariocargo) {
            models.PlanDeCargo.findOne({
                where: {
                    id: usuariocargo.plandecargo_id
                }
            }).then(function (plan) {
                //Validar que usuario tiene registrada tarjeta
                if (plan) {
                    EjecutarCargo(res, conektaTokenId, datos, usuariocargo, plan.monto * 100);
                }

            }).catch(function (err) {
                console.log(err);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function EjecutarCargo(res, conektaTokenId, datos, usuariocargo, monto) {

    models.UsuariosReferencias.create({
        usuariocargo_id: datos.id,
        fecha: new Date(),
        fechacargopagar: new Date(),
        usuarioreferenciaestatus_id: 1 //pendiente de pago
    }).then(function (referencia) {
        if (referencia) {
            ///
            models.UsuariosReferencias.findOne({
                where: {
                    id: referencia.id
                }
            }).then(function (ref) {
                //Validar que usuario tiene registrada tarjeta
                if (ref) {
                    conekta.Charge.create({
                        "description": "Cargo Manual",
                        "amount": monto,
                        "currency": "MXN",
                        "reference_id": ref.referencia,
                        "card": "tok_test_visa_4242",
                        "details": {
                            "name": datos.DatosGenerale.nombre + ' ' + datos.DatosGenerale.apellidoP + ' ' + datos.DatosGenerale.apellidoM,
                            "phone": "403-342-0642",
                            "email": datos.correo,
                            //"customer": {
                            //    "logged_in": true,
                            //    "successful_purchases": 14,
                            //    "created_at": 1379784950,
                            //    "updated_at": 1379784950,
                            //    "offline_payments": 4,
                            //    "score": 9
                            //},
                            "line_items": [{
                                "name": "Cargo Mensual",
                                "description": "Cargo Mensual",
                                "unit_price": monto,
                                "quantity": 1
                            }],
                            "billing_address": {
                                "tax_id": datos.DatosFacturacion.RFC,
                                "company_name": datos.DatosFacturacion.razonSocial,
                                "street1": datos.DatosFacturacion.Direccion.calle,
                                "external_number": datos.DatosFacturacion.Direccion.numero,
                                "street3": datos.DatosFacturacion.Direccion.Localidad.localidad,
                                "city": datos.DatosFacturacion.Direccion.Localidad.Municipio.municipio,
                                "state": datos.DatosFacturacion.Direccion.Localidad.Estado.estado,
                                "zip": datos.DatosFacturacion.Direccion.Localidad.cp
                            }
                        }
                    }, function (err, cargo) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('registrado', {
                                title: 'Cargo hecho'
                            });
                        }
                    });
                }

            }).catch(function (err) {
                console.log(err);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

//Informacion para registrar cargos de usuario
exports.RegistrarUsuarioEnProveedorDatos = function (object, req, res) {
    models.PlanDeCargo.findAll()
    .then(function (planes) {
        res.render('cargoportarjeta', {
            title: 'Pagos',
            usuario_id: 1,
            planes: planes
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.RegistrarUsuarioEnProveedor = function (object, req, res) {
    console.log('registrar cliente tarjeta');

    models.Usuario.findOne({
        where: {
            id: object.usuario_id
        },
        attributes: ['correo'],
        include: [
         {
             model: models.DatosGenerales,
             attributes: ['nombre', 'apellidoP', 'apellidoM']
         },
         //{
         //    model: models.Telefono,
         //    attributes: ['nombre', 'apellidoP', 'apellidoM']
         //},
         {
             model: models.DatosFacturacion,
             attributes: ['RFC', 'razonSocial'],
             include: [
                 {
                     model: models.Direccion,
                     attributes: ['calle', 'numero'],
                     include: [
                         {
                             model: models.Localidad,
                             attributes: ['localidad', 'cp'],
                             include: [
                                 {
                                     model: models.Municipio,
                                     attributes: ['municipio'],
                                 },
                                 {
                                     model: models.Estado,
                                     attributes: ['estado'],
                                 }
                             ]
                         }
                     ]
                 }
             ]
         }
        ]
    })
     .then(function (datos) {
         //Registrar Usuario con proveedor
         conekta.Customer.create({
             "name": datos.DatosGenerale.nombre + ' ' + datos.DatosGenerale.apellidoP + ' ' + datos.DatosGenerale.apellidoM,
             "email": datos.correo,
             //"phone": "55-5555-5555",
             "cards": [object.conektaTokenId],
             "billing_address": {
                 "tax_id": datos.DatosFacturacion.RFC,
                 "company_name": datos.DatosFacturacion.razonSocial,
                 "street1": datos.DatosFacturacion.Direccion.calle,
                 "external_number": datos.DatosFacturacion.Direccion.numero,
                 "street3": datos.DatosFacturacion.Direccion.Localidad.localidad,
                 "city": datos.DatosFacturacion.Direccion.Localidad.Municipio.municipio,
                 "state": datos.DatosFacturacion.Direccion.Localidad.Estado.estado,
                 "zip": datos.DatosFacturacion.Direccion.Localidad.cp
             }
         }, function (err, resultado) {
             if (err) {
                 console.log(err.message_to_purchaser);
             } else {
                 console.log('cliente registrado');
                 var idUsuario = object.usuario_id;
                 var idUsuarioProveedor = resultado.toObject().id;
                 var idTarjetaProveedor = resultado.toObject().cards[0].id;
                 var idPlan = object.planid;

                 UsuarioRegistrarInformacionCargos(idUsuario, idUsuarioProveedor, idTarjetaProveedor, idPlan);


                 res.render('registrado', {
                     title: 'Registrado'
                 });
             }
         });
     }).catch(function (err) {
         console.log(err);
     });
}

function UsuarioRegistrarInformacionCargos(idUsuario, idUsuarioProveedor, idTarjetaProveedor, idPlan) {
    models.UsuarioCargo.findOne({
        where: { id: idUsuario }
    }).then(function (usuario) {
        if (!usuario) {
            models.UsuarioCargo.create({
                medico_id: idUsuario
            }).then(function (datos) {
                UsuarioGuardarIdProveedor(idUsuario, idUsuarioProveedor);
                UsuarioGuardarIdTarjeta(idUsuario, idTarjetaProveedor);
                RegitrarSuscripcion(idUsuario, idUsuarioProveedor, idPlan);
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            UsuarioGuardarIdProveedor(idUsuario, idUsuarioProveedor);
            UsuarioGuardarIdTarjeta(idUsuario, idTarjetaProveedor);
            RegitrarSuscripcion(idUsuario, idUsuarioProveedor, idPlan);
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function UsuarioGuardarIdProveedor(idUsuario, idUsuarioProveedor) {
    models.UsuarioCargo.update({
        idUsuarioProveedor: idUsuarioProveedor
    }, {
        where: { medico_id: idUsuario }
    })
}

function UsuarioGuardarIdTarjeta(idUsuario, idTarjetaProveedor) {
    models.UsuarioTarjeta.create({
        medico_id: idUsuario,
        idTarjetaProveedor: idTarjetaProveedor
    })
}

//Suscripciones son una manera de realizar cargos a un cliente con una cantidad fija de manera recurrente.
//Puedes cambiar el plan, pausar, cancelar y reanudar una suscripción a tu gusto.
function RegitrarSuscripcion(idUsuario, idUsuarioProveedor, planid) {
    models.PlanDeCargo.findOne({
        where: { id: planid }
    }).then(function (plan) {
        customer = conekta.Customer.find(idUsuarioProveedor, function (err, customer) {
            customer.createSubscription({
                plan: plan.nombre.replace(' ', '') + '_' + plan.id
            }, function (err, res) {
                if (err) {
                    console.log(err.message_to_purchaser);
                } else {
                    UsuarioGuardarIdPlan(idUsuario, planid);
                }
            });
        });

    }).catch(function (err) {
        console.log('error al obtener el id del intervalo cargo');
    });
}

function UsuarioGuardarIdPlan(idUsuario, planid) {
    models.UsuarioCargo.update({
        plandecargo_id: planid
    }, {
        where: { medico_id: idUsuario }
    })
}

//Informacion para llenar registro de nuevo plan de cargos
exports.PlanCargoDatosRegistro = function (object, req, res) {
    models.IntervaloCargo.findAll({
        attributes: ['id', 'nombre']
    })
    .then(function (intervalo) {

        if (req.query.planId) {
            models.PlanDeCargo.findOne({
                where: {
                    id: req.query.planId
                }
            }).then(function (plan) {

                res.render('plandecargo', {
                    title: 'Plan de cargo',
                    plan: plan,
                    intervalo: intervalo
                });
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            res.render('plandecargo', {
                title: 'Plan de cargo',
                intervalo: intervalo
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

//Planes son plantillas que te permiten crear suscripciones.
//Dentro del plan se define la cantidad y frecuencia con el cual se generaran los cobros recurrentes a los usuarios
exports.PlanCargoRegistrar = function (object, req, res) {
    models.IntervaloCargo.findOne({
        where: { id: object.intervalocargo_id }
    }).then(function (intervalo) {
        if (object.idPlan == 0) {
            PlanCargoCrear(res, object, intervalo.id, intervalo.descripcion);
        } else {
            PlanCargoActualizar(res, object, intervalo.id, intervalo.descripcion);
        }
    }).catch(function (err) {
        console.log('error al obtener el id del intervalo cargo');
        console.log(err);
    });
}

function PlanCargoCrear(res, object, intervaloId, intervaloDescripcion) {
    //registrar plan en conecta
    conekta.Plan.create({
        //"id": plan.idpublico,
        "name": object.nombre,
        "amount": object.monto * 100,
        "currency": "MXN",
        "interval": intervaloDescripcion,
        "frequency": object.frecuencia,
        "trial_period_days": object.periodoprueba
    }, function (err, planconekta) {
        if (planconekta) {
            models.PlanDeCargo.create({
                nombre: object.nombre,
                monto: parseFloat(object.monto),
                intervalocargo_id: intervaloId,
                frecuencia: object.frecuencia,
                periodoprueba: object.periodoprueba,
                idproveedor: planconekta.toObject().id
            }).then(function (plan) {
                if (plan) {
                    res.render('registrado', {
                        title: 'Plan registrado'
                    });
                }
            }).catch(function (err) {
                console.log(err);
                console.log('error al actualizar plan');
            });
        } else {
            console.log('error');
            console.log(err);
        }
    });
}

function PlanCargoActualizar(res, object, intervaloId, intervaloDescripcion) {
    models.PlanDeCargo.update({
        nombre: object.nombre,
        monto: parseFloat(object.monto),
        intervalocargo_id: intervaloId,
        frecuencia: object.frecuencia,
        periodoprueba: object.periodoprueba
    },
       {
           where: {
               id: object.idPlan
           }
       }
    ).then(function (datos) {
        console.log(datos);
        models.PlanDeCargo.findOne({
            where: { id: object.idPlan },
            attributes: ['idproveedor']
        }).then(function (plan) {
            //actualizar plan en conekta
            conekta.Plan.find(plan.idproveedor, function (err, plan) {
                if (err) {
                    console.log(err);
                } else {
                    plan.update({
                        //"id": object.planId,
                        //"name": object.nombre,
                        "amount": object.monto * 100,
                        //"currency": "MXN",
                        //"interval": intervaloDescripcion,
                        //"frequency": object.frecuencia,
                        //"trial_period_days": object.periodoprueba
                    }, function (err, planconekta) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('registrado', {
                                title: 'Plan actualizado'
                            });
                        }
                    })
                }
            });
        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log('error al actualizar plan');
        return false;
    });
}

//EliminarPlan
exports.PlanCargoEliminar = function (object, req, res) {
    models.IntervaloCargo.destroy({
        where: { id: object.idPlanEliminar }
    }).then(function () {
        console.log('eliminar c');
        conekta.Plan.find(object.nombre.replace(' ', '') + '_' + object.id, function (err, plan) {
            if (err) {
                console.log(err);
            } else {
                plan.delete(function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                })
            }
        });
    }).catch(function (err) {
        console.log(err);
    });
}



// Agregar cargos rechaados
exports.CargoRechazadoAgregar = function (object, req, res) {
    models.CargoRechazado.create({
        usuario_id: object.usuario_id,
        estatus_id: object.estatus_id,
        fecha: fecha,
        descripcion: object.descripcion,
        diasSinCobro: object.diasSinCobro
    }).then(function () {
      res.status(200).json();
    }).catch(function (err) {
        console.log(err);
        res.status(500).json();
    });
}

// Selecciona cargos rechazados
exports.CargoRechazadoSelecciona = function (object, req, res) {
  models.CargoRechazado.findAll({
      where :  { usuario_id: object.id },
      include : [{ model : models.EstatusCargoRechazado}],
      order: 'fecha DESC'
  }).then(function(datos) {
    res.send(datos);
  }).catch(function(err) {
      res.status(500).json({error: err})
  });
}

// Agregar estatus cargos rechaados
exports.EstatusCargoRechazadoAgregar = function (object, req, res) {
  models.EstatusCargoRechazadoAgregar.findOne({
    where: {
        medico_id: idUsuario
    }
  }).then(function (datos) {
    if  ( datos == null)
    {
      models.EstatusCargoRechazadoAgregar.create({
          descripcion: object.descripcion
      }).then(function (estatus) {
        res.status(200).json();
      }).catch(function (err) {
          console.log(err);
          res.status(500).json();
      });
    }
  }).catch(function (err) {
      console.log(err);
  });
}

// Selecciona cargos rechazados
exports.EstatusCargoRechazadoSelecciona = function (object, req, res) {
    models.EstatusCargoRechazadoAgregar.findAll()
    .then(function (datos) {
      res.send(datos);
    }).catch(function (err) {
        res.status(500).json();
    });
}
