/// <reference path="HistoricoCargos.js" />
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
    var guardarNotificacion = false;
    var idUsuarioCargo;
    
    notificacion = req.body;//typeof req.body == 'string' ? JSON.parse(req.body) : req.body;
    //Guardar informacion de la notificacion
    if (notificacion) {
        res.status(200).json({ ok: true });
        
        
        // console.log(notificacion);
        //obtener el id del usuario cargo
        models.UsuarioCargo.findOne({
            where: { idusuarioproveedor: notificacion.data.object.customer_id }
        }).then(function (usuario) {
            if (usuario) {
                idUsuarioCargo = usuario.id
                
                switch (notificacion.type) {
            //estos eventos se envian cuando se hace el pago
                    case 'subscription.paid': //cuando una suscripción ha sido pagada.                
                    case 'charge.paid'://cuando un cargo ha sido pagado                                
                        guardarNotificacion = true;
                        historicoCargos.HistoricoCargosRegistrar(notificacion, idUsuarioCargo, notificacion.data.object.amount / 100);
                        break;
                    case 'charge.created': // cargo ha sido creado pero todavía no ha sido pagado.
                    case 'charge.refunded': //cuando un cargo ha sido reembolsado en su totalidad al comprador.                
                    case 'charge.chargeback.created': //cuando el tarjetahabiente no reconoce el cargo y contacta a su banco para generar un contracargo. Para más información sobre contracargos, visita la sección de contracargos.                
                    case 'charge.chargeback.updated': //cuando alguien dentro de tu cuenta actualiza el contracargo con evidencia que apoya el caso de contracargo. Para más información sobre contracargos, visita la sección de contracargos.                
                    case 'charge.chargeback.under_review': //cuando el contracargo ha sido bloqueado y la evidencia que has proporcionado ha sido enviada al banco adquiriente para revisar el caso. Para más información sobre contracargos, visita la sección de contracargos                
                    case 'charge.chargeback.won': //cuando el contracargo ha sido resuelto a tu favor. En este momento, el monto del contracargo que había sido retenido será devuelto a tu saldo y será disponible para el siguiente depósito a tu cuenta. Para más información sobre contracargos, visita la sección de contracargos                
                    case 'charge.chargeback.lost': //cuando el contracargo ha sido resuelto a favor del tarjetahabiente. El monto del contracargo que había sido retenido será enviado al tarjetahabiente. Para más información sobre contracargos, visita la sección de contracargos            
                    case 'subscription.payment_failed'://cuando el pago de una suscripción no ha podido ser procesado. En caso de que la suscripción no pueda ser procesada después de 3 intentos consecutivos, la suscripción será cancelada.                               
                        guardarNotificacion = true;
                        bitacora.BitacoraRegistrar(notificacion, idUsuarioCargo);
                        break;
                    case 'subscription.created': //cuando una nueva suscripción ha sido creada                                
                    case 'subscription.paused': //cuando una suscripción ha sido pausada.                
                    case 'subscription.resumed': //cuando una suscripción pausada ha sido reanudada.                
                    case 'subscription.canceled': //cuando una suscripción ha sido cancelada. Aparte de que tú o el cliente haya cancelado la suscripción, también se cancelará después de varios intentos de realizar el cobro al cliente.                
                    case 'subscription.updated': //cuando una suscripción ha sido actualizada ya sea con un nuevo plan o tarjeta.        
                    case 'plan.created':
                    case 'plan.updated':            
                    default:
                        console.log('evento no manejado ' + notificacion.type);
                }
                
                if (guardarNotificacion == true) {
                    NotificacionGuardar(notificacion, idUsuarioCargo);
                }
            } else { 
                console.log("el usuario no existe");
            }
        }).catch(function (err) {
            console.log(err);
        });

        
    }
}

function NotificacionGuardar(notificacion, idUsuarioCargo) {
    models.ProveedorNotificacionesEstatus.findOne({
        where: {
            descripcion: notificacion.data.object.status
        }
    }).then(function (estatus) {
        if (estatus) {
            NotificacionRegistrar(notificacion, estatus.id, idUsuarioCargo);
        } else {
            models.ProveedorNotificacionesEstatus.create({
                descripcion: notificacion.data.object.status
            }).then(function (nuevoEstatus) {
                if (nuevoEstatus) {
                    NotificacionRegistrar(notificacion, nuevoEstatus.id, idUsuarioCargo);
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function NotificacionRegistrar(notificacion, estatusid, idUsuarioCargo) {
    var fechaCreacion = new Date(notificacion.created_at * 1000);
    var fechaPago = new Date(notificacion.data.object.created_at * 1000);
    var monto = 0;
    var descripcion;
    
    switch (notificacion.data.object.status) {
        case "past_due":
            descripcion = "Tarjeta Vencida";
            break;
        default:
            monto = notificacion.data.object.amount / 100;
            descripcion = notificacion.data.object.description;
    }
        
    models.ProveedorNotificaciones.findOne({
        where: {
            notificacionProveedor_id: notificacion.data.object.id
        }
    }).then(function (datos) {
        if (datos) {
            //actualizar informacion            
            console.log("falta validar que actualizar");
            //models.ProveedorNotificaciones.update({
            //    proveedorNotificacionEstatus_id: estatusid,
            //    fechaPago: fechaCreacion
            //}, {
            //    where: { notificacionproveedor_id: notificacion.data.object.id }
            //}).then(function (datos) {
            //    console.log('registro actualizado');
            //}).catch(function (err) {
            //    console.log(err);
            //});
        } else {
            //registrar informacion
            models.ProveedorNotificaciones.create({
                notificacionProveedor_id: notificacion.data.object.id,
                usuariosCargos_id: idUsuarioCargo,
                fechaCreacion: fechaPago,
                proveedorNotificacionEstatus_id: estatusid,
                descripcion: descripcion,
                monto: monto
            }).then(function (datos) {
                console.log('registro guardado');
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

