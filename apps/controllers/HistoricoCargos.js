var models = require('../models');

exports.HistoricoCargosRegistrar = function (usuarioid, fecha, periodoPago, proximoDescuento, monto, notificacionId) {    
    switch (notificacion.type) {
        case 'subscription.paid': //cuando una suscripción ha sido pagada.                
        case 'charge.paid'://cuando un cargo ha sido pagado            
            models.HistoricoCargos.create({
                usuariocargo_id: usuarioid,
                fechaRegistro: fecha,
                periodoPago: periodoPago,
                monto: monto
            }).then(function (historico) {
                if (historico) {
                    models.UsuarioCargo.update({
                        fechaProximoCargo: proximoDescuento
                    }, {
                        where: { id: usuarioid }
                    });

                    models.ProveedorNotificaciones.update({
                        historicoCargos_id: historico.id
                    }, {
                        where: { id: notificacionId }
                    });
                }
            }).catch(function (err) {                
                console.log(err);        
            });
            break;

        default:
            console.log('solo se guardan los pagos')
    }
}