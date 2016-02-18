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
        if (!object.idPlan) {
            PlanCargoCrear(res, object, intervalo.id, intervalo.descripcion);
        } else {
            PlanCargoActualizar(res, object, intervalo.id, intervalo.descripcion);
        }
    }).catch(function (err) {
      res.status(200).json({
        success: false,
        err: err
      });
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
                  res.status(200).json({
                    success: true,
                    result: plan
                  });
                } else {
                  res.status(200).json({
                    success: false,
                    err: 'Error al crear el plan'
                  });
                }
            }).catch(function (err) {
                res.status(200).json({
                  success: false,
                  err: 'Error al crear el plan(catch)'
                });
            });
        } else {
          res.status(200).json({
            success: false,
            err: 'Error al crear el plan conekta'
          });
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
                          res.status(200).json({
                            success: true,
                            result: plan
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
    models.PlanDeCargo.findOne({
        where: { id: object.plan_id }
    }).then(function (planbd) {
        conekta.Plan.find(planbd.idproveedor, function (err, plan) {
            if (err) {
              if (err.http_code == 404){
                //Eliminar plan de bd
                planbd.destroy();
              }
              res.status(200).json({
                success: true,
                result: err
              });
            } else {
                plan.delete(function (err, result) {
                    if (err) {
                      res.status(200).json({
                        success: false,
                        result: err
                      });
                    } else {
                      planbd.destroy();
                      res.status(200).json({
                        success: true,
                        result: result
                      });
                    }
                })
            }
        });
    }).catch(function (err) {
        console.log('ERROR: ' + err);
    });
}

exports.getIntervalo = function (object, req, res){
    models.IntervaloCargo.findAll().then(function (intervalos) {
      res.status(200).json({
        success: true,
        result: intervalos
      });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.getAll = function (object, req, res){
    models.PlanDeCargo.findAll({
      inlude: [{
        model: models.IntervaloCargo
      }]
    }).then(function(planes){
      res.status(200).json({
        success: true,
        result: planes
      });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.DeleteCondCheck = function (object, req, res){
    models.UsuarioCargo.findAll({
      where: {
        planDeCargo_id: object.plan_id
      }
    }).then(function(usuarios){
      if (usuarios.length>0){
        res.status(200).json({
          success: false,
          result: usuarios.length
        });
      } else {
        res.status(200).json({
          success: true
        });
      }
    });
}

exports.reemplazarPlan = function (object, req, res){
    models.PlanDeCargo.findOne({
      where: {
        id: parseInt(object.nuevoPlan_id)
      }
    }).then(function(PlanNuevo){
      console.log('Plan nuevo: ' + JSON.stringify(PlanNuevo));
      models.UsuarioCargo.findAll({
        where: {
          planDeCargo_id: object.plan_id
        }
      }).then(function(usuarios){
        var totalUsuarios = 0;
        if(usuarios.length>0){
          usuarios.forEach(function(usuario){
            conekta.Customer.find(usuario.idUsuarioProveedor, function (err, customer) {
              if (err){
                res.status(200).json({
                  success: false,
                  result: err
                });
              } else {
                customer.subscription.update({"plan_id":PlanNuevo.idproveedor}, function(err, result){
                  if (err){
                    res.status(200).json({
                      success: false,
                      line: 269,
                      result: err
                    });
                  } else {
                    usuario.update({
                      planDeCargo_id: object.nuevoPlan_id
                    }).then(function(){
                      totalUsuarios++;
                      if (totalUsuarios == usuarios.length){
                        res.status(200).json({
                          success: true
                        });
                      }
                    });
                  }
                });
              }
            });
          })
        } else {
          res.status(200).json({
            success: true
          });
        }
      });
    });
}
