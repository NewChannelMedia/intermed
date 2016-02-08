"use strict";

var fs = require( "fs" );
var path = require( "path" );
var Sequelize = require( "sequelize" );
var env = process.env.NODE_ENV || "development";
var db = {};

//var config    = require(__dirname + '/../config/config.json')[env];
<<<<<<< HEAD
var main = new Sequelize( 'intermed', 'intermed', '', {
=======
var sequelizeMain = new Sequelize( 'intermed', 'root', '', {
>>>>>>> b5c942598e918acb9f8282b340816836faef422c
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock"
    },
  logging: null
} );
// conexion a la nueva base de datos intermed.historia
<<<<<<< HEAD
var historial = new Sequelize('intermed.historia','intermed','',{
=======
var sequelizeHistorial = new Sequelize('intermed.historia','root','',{
>>>>>>> b5c942598e918acb9f8282b340816836faef422c
  host: 'localhost',
  dialect: 'mysql',
  pool:{
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: null
});
<<<<<<< HEAD
var inbox = new Sequelize( 'intermed.inbox', 'intermed', '', {
=======
var sequelizeInbox = new Sequelize( 'intermed.inbox', 'root', '', {
>>>>>>> b5c942598e918acb9f8282b340816836faef422c
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: null
} );

var sequelizeCargos = new Sequelize('intermed.cargos', 'intermed', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: null
});


var sequelizeEncuesta = new Sequelize('intermed.encuestas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: null
});

//Modelo de Intermed.Intermed
fs
  .readdirSync(__dirname + '/Intermed')
  .filter(function (file) {
      return (file.indexOf(".") !== 0);
  })
  .forEach(function (file) {
      var model = sequelizeMain.import(path.join(__dirname + '/Intermed', file));
      db[model.name] = model;
  });

//Modelo de Intermed.Inbox
fs
  .readdirSync(__dirname + '/Inbox')
  .filter(function (file) {
      return (file.indexOf(".") !== 0);
  })
  .forEach(function (file) {
      var model = sequelizeInbox.import(path.join(__dirname + '/Inbox', file));
      db[model.name] = model;
  });

//Modelo de Intermed.Cargos
fs
  .readdirSync(__dirname + '/Cargos')
  .filter(function (file) {
      return (file.indexOf(".") !== 0);
  })
  .forEach(function (file) {
      var model = sequelizeCargos.import(path.join(__dirname + '/Cargos', file));
      db[model.name] = model;
  });

//Modelo de Intermed.historia
fs
  .readdirSync(__dirname + '/Historial')
  .filter(function (file) {
      return (file.indexOf(".") !== 0);
  })
  .forEach(function (file) {
      var model = sequelizeHistorial.import(path.join(__dirname + '/Historial', file));
      db[model.name] = model;
  });


//Modelo de Intermed.Encuesta
fs
  .readdirSync(__dirname + '/Encuesta')
  .filter(function (file) {
      return (file.indexOf(".") !== 0);
  })
  .forEach(function (file) {
      var model = sequelizeEncuesta.import(path.join(__dirname + '/Encuesta', file));
      db[model.name] = model;
  });

Object.keys( db ).forEach( function ( modelName ) {
    if ("associate" in db[modelName]) {
    db[ modelName ].associate( db );
  }
} );

db.sequelize = sequelizeMain;
db.Sequelize = Sequelize;


module.exports = db;
