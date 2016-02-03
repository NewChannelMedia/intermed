var models = require('../models');

exports.HistoricoCargosRegistrar = function (notificacion) {
    var fecha = new Date(notificacion.data.object.created_at * 1000);
    
    
    //Validar que exista el usuario en registro cargo
    models.UsuarioCargo.findOne({
        where: { idusuarioproveedor: notificacion.data.object.customer_id }
    }).then(function (usuario) {
        if (usuario) {
            models.HistoricoCargos.create({
                usuariocargo_id: usuario.id,
                fecha: fecha,
                monto: notificacion.data.object.amount /100
            }).then(function (plan) {
                if (registro) {
                    console.log(registro);
                }
            }).catch(function (err) {
                console.log('error al registrar');
                console.log(err);
        
            });
        } 
    }).catch(function (err) {
        console.log(err);
    });
}