
var models = require('../models');

var montoCobro = 1000;

//Listado de usuarios que estan activos y su fecha de primer descuento es actual o mayor a la fecha del servidor
exports.ProcesarCargosClientes = function (object, req, res) {
    var fechaActual = new Date();

    //Obtener listado de clientes que tienen fecha de primer descuento menor o igual a la fecha actual
    //Descartar los cientes que no estan activos
    //Descartar los clientes que tienen fecha de pago        
    models.Medico.findAll({
        where: { activo: 1 },
        include: [
            {
                model: models.UsuarioCargo,
                where: {
                    fechaprimerdescuento: { $lte: fechaActual } //<= fecha actual
                }
            }
        ]
    })
    //    where: {
    //        fechaprimerdescuento: { $lte: fechaActual } //<= fecha actual
    //    },
    //    include: [
    //      {
    //          model: models.Medico,
    
    //      }]
    //})
    .then(function (datos) {
        datos.forEach(function (registro) {
            console.log(registro.id);
        });
    }).catch(function (err) {
        console.log(err);
    });

    //UsuariosCargoListado();

    ////Obtener Usuarios para procesar cargos
    //if (RegistrarCliente(req.body.conektaTokenId, cliente)==true) {
    //    if (RegistrarPlan(plan)==true) {
    //        RegistrarRelacionClientePlan(cliente, plan);
    //    }
    //}

};


function RealizarCargo(object, req, res) {
    //var cliente = null;
    //var plan = null;

    UsuariosCargoListado();

    ////Obtener Usuarios para procesar cargos
    //if (RegistrarCliente(req.body.conektaTokenId, cliente)==true) {
    //    if (RegistrarPlan(plan)==true) {
    //        RegistrarRelacionClientePlan(cliente, plan);
    //    }
    //}

};


function ListadoParaCargos() {
    //modelsCargos.usuariosCargos.findAll()
    //.then(function (datos) {        
    //    datos.forEach(function (registro) {
    //        console.log(registro.idUsuariosCargos);
    //    }); 
    //}).catch(function (err) {
    //    console.log(err);        
    //});


}


function UsuariosCargoListado() {

    var listado = ListadoParaCargos();
    //listado.forEach(function (registro) {
    //    console.log(registro.id);
    //});    
}

function RegistrarCliente(tokenid, cliente) {
    console.log('registrar cliente');

    //Registrar Tarjeta Usuario
    conekta.Customer.create({
        "name": "Carlos Patiño",
        "email": "carlosandres1978@gmail.com",
        "phone": "55-5555-5555",
        "cards": [tokenid]
    }, function (clienteRegistrado) {
        console.log('cliente registrado');
        console.log(clienteRegistrado);
        cliente = clienteRegistrado;
        return true;
    }, function (err) {
        console.log(err.message_to_purchaser);
        return false;
    });
}

//Registrar plan de cobro a cliente
function RegistrarPlan(plan) {
    console.log('registrar plan de cobro');
    conekta.Plan.create({
        "id": "PlanMensual",
        "name": "Plan Mensual",
        "amount": montoCobro,
        "currency": "MXN",
        "interval": "month"
    }, function (planRegistrado) {
        console.log(plan);
        plan = planRegistrado;
        return true;
    }, function (err) {
        console.log(err.message_to_purchaser);
        return false;
    });
}

//Registrar Relacion de client con plan de cobro
function RegistrarRelacionClientePlan(cliente, plan) {
    cliente.createSubscription({
        "plan_id": plan.id
    }, function (subscription) {
        console.log(subscription);
        return true;
    }, function (err) {
        console.error(err.message_to_purchaser);
        return false;
    });
}