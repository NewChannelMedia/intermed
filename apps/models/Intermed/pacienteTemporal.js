"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var PacienteTemporal = sequelize.define( "PacienteTemporal", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nombres: {
      type: DataTypes.STRING
    },
    apellidos: {
      type: DataTypes.STRING
    },
    correo: {
      type: DataTypes.STRING
    },
    telefono: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.DATE
    },
  }, {
    classMethods: {
      associate: function ( models ) {
        //User.hasOne(models.Medico)
        PacienteTemporal.hasMany(models.Agenda)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'pacientetemporal'
  } );

  return PacienteTemporal;
};
