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
                        "card": conektaTokenId,//"tok_test_visa_4242",
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
                            res.render('registrado', {
                                title: 'Cargo rechazado' + err.message_to_purchaser
                            });
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

exports.RegistrarNuevaTarjetaDatos = function (object, req, res) {
    models.PlanDeCargo.findAll()
    .then(function (planes) {
        res.render('nuevatarjeta', {
            title: 'Pagos',
            usuario_id: 1,
            planes: planes
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.RegistrarNuevaTarjeta = function (object, req, res) {
    console.log('nueva tarjeta');
    models.UsuarioCargo.findOne({
        where: { medico_id: object.usuario_id }
    }).then(function (usuario) {
        if (usuario) {
            if (usuario.idUsuarioProveedor) {
                conekta.Customer.find(usuario.idUsuarioProveedor, function (err, customer) {
                    console.log(customer);

                    //customer.createCard({
                    //    token: object.conektaTokenId
                    //}, function (err, resultado) {
                    //    if (err) {
                    //        console.log(res.toObject());
                    //    } else {
                    //        console.log(resultado);
                    //        res.render('registrado', {
                    //            title: 'Tarjeta registrada'
                    //        });

                    //    }
                    //});
                });
            }
        } else {
            console.log('???');
        }
    }).catch(function (err) {
        console.log(err);
    });

}


//Informacion para registrar cargos de usuario
exports.RegistrarCargoRecurrenteDatos = function (object, req, res) {
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

exports.RegistrarCargoRecurrente = function (object, req, res) {
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
        //Validar que exista el usuario en registro cargo
        models.UsuarioCargo.findOne({
            where: { medico_id: object.usuario_id }
        }).then(function (usuario) {
            if (usuario) {
                if (usuario.idUsuarioProveedor) {
                    UsuarioActualizarEnProveedor(res, datos, usuario.idUsuarioProveedor)
                } else {
                    RegistrarUsuarioEnProveedor(res, object.usuario_id, datos, object.conektaTokenId, object.planid);
                }
            } else {
                models.UsuarioCargo.create({
                    medico_id: object.usuario_id,
                    plandecargo_id: object.planid
                }).then(function (usuariocargoregistrado) {
                    if (usuariocargoregistrado) {
                        RegistrarUsuarioEnProveedor(res, object.usuario_id, datos, object.conektaTokenId, object.planid);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
}


function RegistrarUsuarioEnProveedor(res, usuario_id, datos, conektaTokenId, planid) {
    //Obtener el id del plan
    models.PlanDeCargo.findOne({
        where: { id: planid }
    }).then(function (plan) {
        //registra en proveedor
        conekta.Customer.create({
            "name": datos.DatosGenerale.nombre + ' ' + datos.DatosGenerale.apellidoP + ' ' + datos.DatosGenerale.apellidoM,
            "email": datos.correo,
            //"phone": "55-5555-5555",
            "cards": [conektaTokenId],
            "plan": plan.idproveedor,
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
                console.log(err);
            } else {
                UsuarioGuardarDatosProveedor(usuario_id, resultado.toObject().id, planid, resultado.subscription.toObject().created_at, resultado.subscription.toObject().billing_cycle_end);
                UsuarioGuardarTarjeta(usuario_id, resultado.toObject().cards[0]);
                
                console.log('cliente registrado en proveedor');

                res.render('registrado', {
                    title: 'Registrado'
                });
            }
        });
    }).catch(function (err) {
        console.log('error al obtener el id del intervalo cargo');
    });
}

function UsuarioGuardarDatosProveedor(idUsuario, idUsuarioProveedor, planid, fechaAlta, fechaProximoDescuento) {
    var _fechaAlta = new Date(fechaAlta * 1000);
    var _fechaProximoDescuento = new Date(fechaProximoDescuento * 1000);
    console.log(_fechaAlta);
    console.log(_fechaProximoDescuento);

    models.UsuarioCargo.update({
        idUsuarioProveedor: idUsuarioProveedor,
        planDeCargo_id: planid,
        fechaAlta: _fechaAlta,
        fechaProximoDescuento: _fechaProximoDescuento
    }, {
        where: { medico_id: idUsuario }
    })
}

function UsuarioGuardarTarjeta(idUsuario, tarjetaProveedor) {
    models.UsuarioTarjeta.findOne({
        where: { idTarjetaProveedor: tarjetaProveedor.id }
    }).then(function (tarjeta) {
        if (!tarjeta) {
            models.UsuarioTarjeta.create({
                medico_id: idUsuario,
                idTarjetaProveedor: tarjetaProveedor.id,
                ultimosDigitos: tarjetaProveedor.last4
            })
        }
    }).catch(function (err) {
        console.log('error al registrar tarjeta del usuario');
    });
}

function UsuarioActualizarEnProveedor(res, datos, idUsuarioProveedor, conektaTokenId) {
    customer = conekta.Customer.find(idUsuarioProveedor, function (err, customer) {
        customer.update({
            "name": datos.DatosGenerale.nombre + ' ' + datos.DatosGenerale.apellidoP + ' ' + datos.DatosGenerale.apellidoM,
            "email": datos.correo,
            //"phone": "55-5555-5555",
            //"cards": [conektaTokenId],
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
                console.log(err);
            } else {
                res.render('registrado', {
                    title: 'Registrado'
                });
            }
        });
    });
}





function RegitrarSuscripcionEnProveedor(idUsuario, idUsuarioProveedor, planid) {
    models.PlanDeCargo.findOne({
        where: { id: planid }
    }).then(function (plan) {
        customer = conekta.Customer.find(idUsuarioProveedor, function (err, customer) {
            customer.createSubscription({
                plan: plan.idproveedor
            }, function (err, res) {
                if (err) {
                    console.log(err);
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
        where: { id: idUsuario }
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