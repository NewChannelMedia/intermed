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
            estados: datos
        });
    });
};

exports.registrarUbicacion = function (objects, req, res) {    
    
    console.log(req.query.usuario_id);
    
    
    


    //models.Direccion.create({
    //    ubicacionGM: 'object.ubicacionGM',
    //    calle: objects.calle,
    //    numero: objects.numero,
    //    calle1: objects.calle1,
    //    calle2: objects.calle2,
    //    principal: 'object.principal',
    //    nombre: objects.nombre,
    //    horarioInicio: 'object.horarioInicio',
    //    horarioFin: 'object.horarioFin',
    //    dias: 'objects.dias',
    //    usuario_id: objects.usuario_id,
    //    institucion_id: '0',
    //    localidad_id: objects.localidad_id,
    //    municipio_id: objects.municipio_id,
    //    latitud: objects.latitud,
    //    longitud: objects.longitud
    //}).then(function (datos) {
    //    res.status(200).json({
    //        ok: true
    //    });
    //    //objects.horarios.foreach(function (horario) {
    //    //    model.Horarios.create({
    //    //        idDireccion: direccion.id,
    //    //        dia: horarios.dia,
    //    //        horaInicio: horarios.horaInicio,
    //    //        horaFin: horarios.horaFin
    //    //    }).then(function () {
    //    //        res.status(200).json({
    //    //            ok: true
    //    //        });
    //    //    }).catch(function (err) {
    //    //        res.status(500).json({
    //    //            error: err
    //    //        });
    //    //    });
    //    //});
    //}).catch(function (err) {
    //    res.status(500).json({
    //        error: err
    //    });
    //});
};
