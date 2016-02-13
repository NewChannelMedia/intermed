//Procesar las notificaciones recibidas del proveedor
var models = require('../models');
var historicoCargos = require('./HistoricoCargos');
var bitacora = require('./Bitacora');


//Conekta
var conekta = require('conekta');
conekta.api_key = "key_KP2rs6xsxH3r6jy9y7vhWg";
conekta.api_version = '1.0.0';
conekta.locale = 'es'


//Recibir las notificaciones del proveedor
exports.RecibirNotificacion = function (object, req, res) {
    var estatusProveedor;
    var descripcion;
    var fechaCreacion;
    var fechaPago;
    var periodoPago;
    var metodoPago;
    var proveedorProximoDescuento;
    var monto = 0;
    var guardarNotificacion = false;
    
    notificacion = req.body;//typeof req.body == 'string' ? JSON.parse(req.body) : req.body;
    //Guardar informacion de la notificacion
    if (notificacion) {
        res.status(200).json({ ok: true });
        
        console.log(notificacion);
        
        metodoPago = 1;
        fechaCreacion = new Date(notificacion.data.object.created_at * 1000);
        proveedorProximoDescuento = new Date(notificacion.data.object.billing_cycle_end * 1000);
        
        switch (notificacion.type) {
            //cuando el pago de una suscripción no ha podido ser procesado. En caso de que la suscripción no pueda ser procesada después de 3 intentos consecutivos, la suscripción será cancelada.
            case 'subscription.payment_failed':
                estatusProveedor = 'subscription.payment_failed';
                descripcion = 'Pago de suscripción Fallido';
                guardarNotificacion = true;
                monto = 0;
                bitacora.BitacoraRegistrar(notificacion, 1);
                break;
            //cuando una suscripción ha sido pagada.
            case 'subscription.paid':
                models.PlanDeCargo.findOne({
                    where: { idproveedor: notificacion.data.object.plan_id }
                }).then(function (plan) {
                    if (plan) {
                        estatusProveedor = 'subscription.paid';
                        descripcion = 'Cargo Recurrente';
                        fechaPago = fechaCreacion;
                        monto = plan.monto;
                        guardarNotificacion = true;
                        NotificacionGuardar(notificacion.data.object.id, notificacion.data.object.customer_id, estatusProveedor, metodoPago, fechaCreacion, fechaPago, descripcion, proveedorProximoDescuento, monto);
                    } else {
                        console.log('no se encontro el plan');
                    }
                }).catch(function (err) {
                    console.log('error al obtener el plan');
                });
                break;
            case 'customer.created':  
            case 'plan.created':
            case 'plan.updated':
            case 'subscription.created':
            case 'subscription.paused': //cuando una suscripción ha sido pausada.                
            case 'subscription.resumed': //cuando una suscripción pausada ha sido reanudada.                
            case 'subscription.canceled': //cuando una suscripción ha sido cancelada. Aparte de que tú o el cliente haya cancelado la suscripción, también se cancelará después de varios intentos de realizar el cobro al cliente.                
            case 'subscription.updated'://cuando una suscripción ha sido actualizada ya sea con un nuevo plan o tarjeta.        
                console.log('sin implementación');
                break;
            default:
                estatusProveedor = notificacion.data.object.status;
                descripcion = notificacion.data.object.description;
                monto = notificacion.data.object.amount / 100;
                fechaPago = new Date(notificacion.data.object.created_at * 1000);
                              
        }
        
        if (guardarNotificacion == true) {
            NotificacionGuardar(notificacion.data.object.id, notificacion.data.object.customer_id, estatusProveedor, metodoPago, fechaCreacion, fechaPago, descripcion, proveedorProximoDescuento, monto);
        }
        
        //switch (notificacion.type) {
        //    /*estos eventos se envian cuando se hace el pago
        //     * Solo se ejecutan despues guardar la notificacion                    
        //    case 'charge.paid'://cuando un cargo ha sido pagado
        //        historicoCargos.HistoricoCargosRegistrar(notificacion);
        //        break;
        //     */
        //    case 'charge.created': // cargo ha sido creado pero todavía no ha sido pagado.
        //    case 'charge.refunded': //cuando un cargo ha sido reembolsado en su totalidad al comprador.                
        //    case 'charge.chargeback.created': //cuando el tarjetahabiente no reconoce el cargo y contacta a su banco para generar un contracargo. Para más información sobre contracargos, visita la sección de contracargos.                
        //    case 'charge.chargeback.updated': //cuando alguien dentro de tu cuenta actualiza el contracargo con evidencia que apoya el caso de contracargo. Para más información sobre contracargos, visita la sección de contracargos.                
        //    case 'charge.chargeback.under_review': //cuando el contracargo ha sido bloqueado y la evidencia que has proporcionado ha sido enviada al banco adquiriente para revisar el caso. Para más información sobre contracargos, visita la sección de contracargos                
        //    case 'charge.chargeback.won': //cuando el contracargo ha sido resuelto a tu favor. En este momento, el monto del contracargo que había sido retenido será devuelto a tu saldo y será disponible para el siguiente depósito a tu cuenta. Para más información sobre contracargos, visita la sección de contracargos                
        //    case 'charge.chargeback.lost': //cuando el contracargo ha sido resuelto a favor del tarjetahabiente. El monto del contracargo que había sido retenido será enviado al tarjetahabiente. Para más información sobre contracargos, visita la sección de contracargos
            
        
        
                   
        //    default:
        //        console.log('evento no manejado' + notificacion.type);
        //}
    }
}

function NotificacionGuardar(idNotificacion, idUsuarioProveedor, estatusProveedor, metodoPago, fechaCreacion, fechaPago, descripcion, proveedorProximoDescuento, monto) {
    //switch (notificacion.type) {        
    //    case 'subscription.payment_failed':
    //        estatusProveedor = 'subscription.payment_failed';
    //        descripcion = 'Pago de suscripción Fallido';
    //        break;
    //    //cuando una suscripción ha sido pagada.                
    //    case 'subscription.paid':
    //        estatusProveedor = 'subscription.paid';
    //        descripcion = 'Cargo Recurrente';
    //        fechaPago = fechaCreacion;
    //        break;
    //    default:
    //        estatusProveedor = notificacion.data.object.status;
    //        descripcion = notificacion.data.object.description;
    //        monto = notificacion.data.object.amount / 100;
    //        fechaPago = new Date(notificacion.data.object.created_at * 1000);            
    //}
    
    models.UsuarioCargo.findOne({
        where: { idusuarioproveedor: idUsuarioProveedor }
    }).then(function (usuario) {
        if (usuario) {
            models.ProveedorNotificacionesEstatus.findOne({
                where: {
                    descripcion: estatusProveedor
                }
            }).then(function (estatus) {
                if (estatus) {
                    NotificacionRegistrar(usuario.id, idNotificacion, estatus.id, metodoPago, fechaCreacion, fechaPago, descripcion, usuario.fechaProximoCargo, proveedorProximoDescuento, monto);
                } else {
                    models.ProveedorNotificacionesEstatus.create({
                        descripcion: estatusProveedor
                    }).then(function (nuevoEstatus) {
                        if (nuevoEstatus) {
                            NotificacionRegistrar(usuario.id, idNotificacion, nuevoEstatus.id, metodoPago, fechaCreacion, fechaPago, descripcion, usuario.fechaProximoCargo, proveedorProximoDescuento, monto);
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            console.log('error al obtener el usuario');
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function NotificacionRegistrar(usuarioId, notificacionId, estatusId, metodoPago, fechaCreacion, fechaPago, descripcion, periodoPago, proveedorProximoDescuento, monto) {
    models.ProveedorNotificaciones.findOne({
        where: {
            notificacionProveedor_id: notificacionId
        }
    })
    .then(function (datos) {
        if (datos) {
            console.log('implementar actualizacion');
            //actualizar informacion            
            //models.ProveedorNotificaciones.update({
            //    proveedornotificacionestatus_id: estatusId,
            //    fechaPago: fechaPago
            //}, {
            //    where: { notificacionproveedor_id: notificacionId }
            //}).then(function (datos) {
            //    //guardar si es un pago
            //    console.log('guardar pago');
            //    console.log(datos);
            //    //historicoCargos.HistoricoCargosRegistrar(notificacion);
            //}).catch(function (err) {
            //    console.log(err);
            //});
        } else {
            //registrar informacion
            models.ProveedorNotificaciones.create({
                notificacionProveedor_id: notificacionId,
                proveedorNotificacionEstatus_id: estatusId,
                proveedorMetodosDePago_id: metodoPago, //solo se maneja por el momento cargo recurrente
                usuariosCargos_id: usuarioId,
                fechaCreacion: fechaCreacion,
                fechaPago: fechaPago,
                descripcion: descripcion,
                monto: monto
            }).then(function (notificacion) {
                historicoCargos.HistoricoCargosRegistrar(usuarioId, fechaCreacion, periodoPago, proveedorProximoDescuento, monto, notificacion.id);
            }).catch(function (err) {
                console.log(err);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}
////Listado de usuarios que estan activos y su fecha de primer descuento es actual o mayor a la fecha del servidor
//exports.ProcesarCargosClientes = function (object, req, res) {
//    var fechaActual = new Date();

//    //Obtener listado de clientes que tienen fecha de primer descuento menor o igual a la fecha actual
//    //Descartar los cientes que no estan activos
//    //Descartar los clientes que tienen fecha de pago        
//    console.log('inicia');

//    models.Medico.findAll({
//        where: {
//            activo: 1,
//            fechaprimerdescuento: { $lte: fechaActual } //<= fecha actual
//        },
//        attributes: ['id']
//    })
//    .then(function (datos) {
//        datos.forEach(function (registro) {
//            RealizarCargo(registro.id);
//        });
//    }).catch(function (err) {
//        console.log(err);
//    });
//}

