var models = require('../models');

var montoCobro = 1000;

//Conekta
var conekta = require('conekta');
conekta.api_key = "key_KP2rs6xsxH3r6jy9y7vhWg";
conekta.api_version = '1.0.0';
conekta.locale = 'es'


//Listado de usuarios que estan activos y su fecha de primer descuento es actual o mayor a la fecha del servidor
exports.ProcesarCargosClientes = function (object, req, res) {
    var fechaActual = new Date();

    //Obtener listado de clientes que tienen fecha de primer descuento menor o igual a la fecha actual
    //Descartar los cientes que no estan activos
    //Descartar los clientes que tienen fecha de pago        
    console.log('inicia');

    models.Medico.findAll({
        where: {
            activo: 1,
            fechaprimerdescuento: { $lte: fechaActual } //<= fecha actual
        },
        attributes: ['id']
    })
    .then(function (datos) {
        datos.forEach(function (registro) {
            RealizarCargo(registro.id);
        });
    }).catch(function (err) {
        console.log(err);
    });
}


function RealizarCargo(idUsuario) {
    var idUsuarioProveedor = null;
    var plan = null;

    models.UsuarioCargo.findOne({
        where: {
            medico_id: idUsuario
        }
    })
    .then(function (datos) {
        //Validar que usaurio tiene registrada tarjeta
        console.log(datos.idUsuarioProveedor == null);
        if (datos.idUsuarioProveedor == 'NULL') {
            MensajeUsuarioSinTarjetaRegistrada(idUsuario);
        } else {
            console.log('Ejecutar cargo');
        }

    }).catch(function (err) {
        console.log(err);
    });
}

function MensajeUsuarioSinTarjetaRegistrada(idUsuario) {
    console.log('usuario sin tarjeta registrada');
}

//function BuscarUsuario(idUsuario) {
//    conekta.Customer.find('cus_k2D9DxlqdVTagmEd400001', function (customer) {
//        customer.update({
//            "name": "Logan",
//            "email": "logan@x-men.org"
//        }, function (res) {
//            console.log(res.toObject());
//        }, function (err) {

//        });
//    }, function (err) {

//    });

//}

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
                 return;
             } else {
                 console.log('cliente registrado');
                 var idUsuario=object.usuario_id;
                 var idUsuarioProveedor=resultado.toObject().id;
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
        where: { id: planid}
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
    var resultado = false;
    var mensaje = "";

    models.IntervaloCargo.findOne({
        where: { id: object.intervalocargo_id }
    }).then(function (intervalo) {
        console.log(intervalo.descripcion);
        if (object.idPlan == 0) {
            PlanCargoCrear(object, intervalo.id, intervalo.descripcion);            
        } else {
            PlanCargoActualizar(object, intervalo.id, intervalo.descripcion);            
        }

        res.render('registrado', {
            title: mensaje
        });

    }).catch(function (err) {
        console.log('error al obtener el id del intervalo cargo');
    });
}

function PlanCargoCrear(object, intervaloId, intervaloDescripcion) {    
    models.PlanDeCargo.create({
        nombre: object.nombre,
        monto: parseFloat(object.monto),
        intervalocargo_id: intervaloId,
        frecuencia: object.frecuencia,
        periodoprueba: object.periodoprueba
    }).then(function (plan) {        
        //registrar plan en conecta        
        conekta.Plan.create({
            "id": plan.nombre.replace(' ','') + '_' + plan.id,
            "name": plan.nombre,
            "amount": plan.monto * 100,
            "currency": "MXN",
            "interval": intervaloDescripcion,
            "frequency": plan.frecuencia,
            "trial_period_days": plan.periodoprueba
        }, function (err, res) {
            if (err) {
                console.log(err);                
            } else {
                console.log(res);                
            }
        });
    });    
}

function PlanCargoActualizar(object, intervaloId, intervaloDescripcion) {
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
        //actualizar plan en conekta
        console.log(object.nombre.replace(' ', '') + '_' + object.idPlan);


        conekta.Plan.find(object.nombre.replace(' ', '') + '_' + object.idPlan, function (err, plan) {
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
                }, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {                        
                        console.log(res);                        
                    }
                })
            }
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