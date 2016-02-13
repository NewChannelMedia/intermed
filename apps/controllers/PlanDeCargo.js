var models = require('../models');

//Conekta
var conekta = require('conekta');
conekta.api_key = "key_KP2rs6xsxH3r6jy9y7vhWg";
conekta.api_version = '1.0.0';
conekta.locale = 'es'

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