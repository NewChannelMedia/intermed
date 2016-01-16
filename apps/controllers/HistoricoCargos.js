var models = require('../models');

exports.HistoricoCargosRegistrar = function (idUsuarioProveedor, fecha, monto) {
    models.HistoricoCargos.create({
        usuariocargo_id: idUsuario,
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