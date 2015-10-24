var models = require('../models');

exports.index = function (req, res) {
    res.render('especialidades/index', {
        title: 'Especialidades'
    });
};

exports.mostrar = function (req, res) {
    models.Especialidades.findAll().then(function (datos) {
        res.render('especialidades/mostrar', {
            title: 'Especialidades',
            datos: datos
        });
    });
};

exports.ObtieneTelefonos = function (req, res) {
    models.Telefono.findAll().then(function (datos) {
        res.send(datos);
    });
};

exports.ObtieneDirecciones = function (req, res) {
    models.Direccion.findAll().then(function (datos) {
        res.send(datos);
    });
};

exports.obtieneEstados = function (req, res) {
    models.Estado.findAll().then(function (datos) {
        res.sender(datos);
    });
};

exports.obtieneCiudades = function (object, req, res) {
    models.Ciudad.findAll({
        where: {
            estado_id: object.estado_id
        },
        order: ['ciudad'],
        attributes: ['id', 'ciudad']
    }).then(function (ciudades) {
        res.send({
            'ciudades': ciudades
        });
    });
};

exports.encontrarPorCP = function (object, req, res) {
    models.Localidad.findOne({
        where: {
            id: object.localidad_id
        },
        attributes: ['CP']
    }).then(function (localidad) {
        res.send({
            'cp': localidad.CP
        });
    });
};

exports.obtieneLocalidades = function (object, req, res) {
    models.Localidad.findAll({
        where: {
            estado_id: object.estado_id,
            ciudad_id: object.ciudad_id
        },
        order: ['localidad'],
        attributes: ['id', 'localidad']
    }).then(function (localidades) {
        res.send({
            'localidades': localidades
        });
    });
};

exports.ubicacion = function (objects, req, res) {
    models.Estado.findAll().then(function (datos) {
        res.render('ubicacion', {
            title: 'Ubicaciones',
            estados: datos,
            usuario_id: 1
        });
    });
};

exports.registrarUbicacion = function (objects, req, res) {
    models.Direccion.create({
        ubicacionGM: 'object.ubicacionGM',
        calle: objects.calleUbi,
        numero: objects.numeroUbi,
        calle1: objects.calle1Ubi,
        calle2: objects.calle2Ubi,
        principal: 0,
        nombre: objects.nombreUbi,
        horarioInicio: 'object.horarioInicio',
        horarioFin: 'object.horarioFin',
        dias: 'objects.dias',
        usuario_id: objects.usuario_id,
        // institucion_id: '0',
        localidad_id: objects.slc_colonias,
        municipio_id: objects.slc_ciudades,
        latitud: objects.latitud,
        longitud: objects.longitud
    }).then(function (datos) {
        res.status(200).json({
            ok: true
        });

    }).catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};

exports.horarios = function (objects, req, res) {
    res.render('ubicacion', {
        title: 'Horarios',
        idDireccion: 39
    });
};

exports.registrarHorarios = function (objects, req, res) {
    //eliminar registros anteriores
    var continuarRegistro = true;
    var mensajeError;    
    models.Horarios.destroy({
        where: {
            idDireccion: objects.idDireccion
        }
    }).then(function () {
        continuarRegistro = true;
    }).catch(function (err) {
        continuarRegistro = false;
        mensajeError = err;
    });

    if (continuarRegistro) {
        console.log(objects);

        models.Horarios.bulkCreate(JSON.parse(objects.horariosUbi)).then(function () {
            continuarRegistro = true;
        }).catch(function (err) {
            continuarRegistro = false;
            mensajeError = err;
        });

        //
        if (continuarRegistro) {
            res.status(200).json({
                ok: true
            });
        };
    } else {
        res.status(500).json({
            error: err
        });
    };
};