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
                 "street1": datos.DatosFacturacion.Direccion.calle + ' ' + datos.DatosFacturacion.Direccion.numero,
                 "street2": datos.DatosFacturacion.Direccion.numero +' A' ,
                 "street3": datos.DatosFacturacion.Direccion.Localidad.localidad,
                 "city": datos.DatosFacturacion.Direccion.Localidad.Municipio.municipio,
                 "state": datos.DatosFacturacion.Direccion.Localidad.Estado.estado,
                 "zip": datos.DatosFacturacion.Direccion.Localidad.cp
             }
         }, function (resultado) {
             console.log('cliente registrado');
             console.log(resultado);
             //UsuarioGuardarIdProveedor(object.usuario_id, resultado.id);
             UsuarioGuardarIdProveedor(object.usuario_id, 'AAAA');
             res.render('registrado', {
                 title: 'Registrado'                 
             });
         }, function (err) {
             console.log(err.message_to_purchaser);
         });
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
function RegistrarRelacionUsuarioPlan(cliente, plan) {
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