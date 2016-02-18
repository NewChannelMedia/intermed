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
                    plandecargo_id: object.planid,
                    cargosEstatus_id: 1
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
      console.log(plan);
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
                UsuarioGuardarDatosProveedor(usuario_id, resultado.toObject().id, planid, resultado.subscription.toObject().created_at, resultado.subscription.toObject().subscription_start);
                UsuarioGuardarTarjeta(usuario_id, resultado.toObject().cards[0]);

                models.UsuarioCargo.update({
                    cargosEstatus_id: 2 //Tabla estatusCargos: Suscripcion activa
                }, {
                    where: { medico_id: usuario_id }
                })

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

function UsuarioGuardarDatosProveedor(idUsuario, idUsuarioProveedor, planid, fechaAlta, fechaProximoCargo) {
    var _fechaAlta = new Date(fechaAlta * 1000);
    var _fechaProximoCargo = new Date(fechaProximoCargo * 1000);

    models.UsuarioCargo.update({
        idUsuarioProveedor: idUsuarioProveedor,
        planDeCargo_id: planid,
        fechaAlta: _fechaAlta,
        fechaProximoCargo: _fechaProximoCargo
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

exports.SuscripcionPausarDatos = function (req, res) {
    res.render('suscripcionpausar', {
        title: 'Pausar Suscripcion',
        idUsuario : 1
    });
}

exports.SuscripcionPausar = function (object, req, res) {
    models.UsuarioCargo.findOne({
        where: { medico_id: object.idUsuario }
    }).then(function (usuario) {
        if (usuario) {
            if (usuario.idUsuarioProveedor) {
                customer = conekta.Customer.find(usuario.idUsuarioProveedor, function (err, customer) {
                    customer.subscription.pause(function (err, resultado) {
                        if (err) {
                            console.log(err);
                            res.render('registrado', {
                                title: 'Error al pausar suscripcion'
                            });
                        } else {
                            models.UsuarioCargo.update({
                                cargosEstatus_id: 3 //Tabla estatusCargos: Suscripcion pausada
                            }, {
                                where: { medico_id: object.idUsuario }
                            })

                            res.render('registrado', {
                                title: 'Suscripcion pausada'
                            });
                        }
                    });
                });

            }
        }
    }).catch(function (err) {
        console.log(err);
    });
}

exports.SuscripcionReanudarDatos = function (req, res) {
    res.render('suscripcionreanudar', {
        title: 'Reanudar Suscripcion',
        idUsuario : 1
    });
}

exports.SuscripcionReanudar = function (object, req, res) {
    models.UsuarioCargo.findOne({
        where: { medico_id: object.idUsuario }
    }).then(function (usuario) {
        if (usuario) {
            if (usuario.idUsuarioProveedor) {
                customer = conekta.Customer.find(usuario.idUsuarioProveedor, function (err, customer) {
                    customer.subscription.resume(function (err, resultado) {
                        if (err) {
                            console.log(err);
                            res.render('registrado', {
                                title: 'Error al reanudar suscripcion'
                            });
                        } else {

                            models.UsuarioCargo.update({
                                cargosEstatus_id: 2 //Tabla estatusCargos: Suscripcion activa
                            }, {
                                where: { medico_id: object.idUsuario }
                            })

                            res.render('registrado', {
                                title: 'Suscripcion reanudada'
                            });
                        }
                    });
                });

            }
        }
    }).catch(function (err) {
        console.log(err);
    });
}

exports.SuscripcionCancelarDatos = function (req, res) {
    res.render('suscripcioncancelar', {
        title: 'Cancelar Suscripcion',
        idUsuario : 1
    });
}

exports.SuscripcionCancelar = function (object, req, res) {
    models.UsuarioCargo.findOne({
        where: { medico_id: object.idUsuario }
    }).then(function (usuario) {
        if (usuario) {
            if (usuario.idUsuarioProveedor) {
                customer = conekta.Customer.find(usuario.idUsuarioProveedor, function (err, customer) {
                    customer.subscription.cancel(function (err, resultado) {
                        if (err) {
                            console.log(err);
                            res.render('registrado', {
                                title: 'Error al cancelar Suscripcion'
                            });
                        } else {
                            models.UsuarioCargo.update({
                                cargosEstatus_id: 4 //Tabla estatusCargos: Suscripcion cancelada
                            }, {
                                where: { medico_id: object.idUsuario }
                            })

                            res.render('registrado', {
                                title: 'Suscripcion cancelada'
                            });
                        }
                    });
                });

            }
        }
    }).catch(function (err) {
        console.log(err);
    });
}
//function RegitrarSuscripcionEnProveedor(idUsuario, idUsuarioProveedor, planid) {
//    models.PlanDeCargo.findOne({
//        where: { id: planid }
//    }).then(function (plan) {
//        customer = conekta.Customer.find(idUsuarioProveedor, function (err, customer) {
//            customer.createSubscription({
//                plan: plan.idproveedor
//            }, function (err, res) {
//                if (err) {
//                    console.log(err);
//                } else {
//                    UsuarioGuardarIdPlan(idUsuario, planid);
//                }
//            });
//        });

//    }).catch(function (err) {
//        console.log('error al obtener el id del intervalo cargo');
//    });
//}

//function UsuarioGuardarIdPlan(idUsuario, planid) {
//    models.UsuarioCargo.update({
//        plandecargo_id: planid
//    }, {
//        where: { id: idUsuario }
//    })
//}
