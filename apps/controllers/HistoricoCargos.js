var models = require('../models');

exports.HistoricoCargosRegistrar = function (notificacion, idUsuarioCargo, monto) {
    var fecha = new Date(notificacion.data.object.created_at * 1000);
    
    models.HistoricoCargos.create({
        usuariocargo_id: idUsuarioCargo,
        fecha: fecha,
        monto: monto
    }).then(function (plan) {
        if (registro) {
            console.log(registro);
        }
    }).catch(function (err) {
        console.log('error al registrar');
        console.log(err);
        
    });
}