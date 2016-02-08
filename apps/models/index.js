"use strict";

var fs = require( "fs" );
var path = require( "path" );
var Sequelize = require( "sequelize" );
var env = process.env.NODE_ENV || "development";
var db = {};

//var config    = require(__dirname + '/../config/config.json')[env];
var main = new Sequelize( 'intermed', 'intermed', '', {
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
var historial = new Sequelize('intermed.historia','intermed','',{
  host: 'localhost',
  dialect: 'mysql',
  pool:{
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: null
});
var inbox = new Sequelize( 'intermed.inbox', 'intermed', '', {
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

fs
  .readdirSync( __dirname )
  .filter( function ( file ) {
      return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "Cargos") && ( file !== "Historial");
  } )
  .forEach(function (file) {
        var model = (file == 'inbox.js') ? inbox.import(path.join(__dirname, file)) : main.import(path.join(__dirname, file));
        db[model.name] = model;
  } );

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
        var model = historial.import(path.join(__dirname + '/Historial', file));
        db[model.name] = model;
    });
Object.keys( db ).forEach( function ( modelName ) {
    if ("associate" in db[modelName]) {
    db[ modelName ].associate( db );
  }
} );

db.sequelize = main;
db.Sequelize = Sequelize;


module.exports = db;
