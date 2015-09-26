"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoFormacion = sequelize.define( "MedicoFormacion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nivel: {
      type: DataTypes.STRING,
      required: true
    },
    especialidad: {
      type: DataTypes.STRING,
      required: true
    },
    lugarDeEstudio: {
      type: DataTypes.STRING,
      required: true
    },
    fechaInicio: {
      type: DataTypes.DATE,
      required: true
    },
    fechaFin: {
      type: DataTypes.DATE
    },
    fechaTitulo: {
      type: DataTypes.DATE
    },
    actual: {
      type: DataTypes.INTEGER,
      required: true
    },
    medico_id: {
      type: DataTypes.BIGINT,
      required: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoFormacion.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'formacion'
  } );

  return MedicoFormacion;
};
