"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoExperiencia = sequelize.define( "MedicoExperiencia", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      required: true
    },
    lugarTrabajo: {
      type: DataTypes.STRING,
      required: true
    },
    descripcion: {
      type: DataTypes.STRING
    },
    fechaInicio: {
      type: DataTypes.DATE,
      required: true
    },
    fechaFin: {
      type: DataTypes.DATE
    },
    actual: {
      type: DataTypes.INTEGER,
      required: true
    },
    municipio_id: {
      type: DataTypes.INTEGER,
      required: true
    },
    estado_id: {
      type: DataTypes.INTEGER,
      required: true
    },/*
    ciudad_id: {
      type: DataTypes.INTEGER,
      required: true
    },*/
    medico_id: {
      type: DataTypes.BIGINT,
      required: true
    },
    institucion_id: {
      type: DataTypes.BIGINT,
      required: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoExperiencia.belongsTo( models.Medico );
        MedicoExperiencia.belongsTo( models.Municipio );
        MedicoExperiencia.belongsTo( models.Estado );
      /*  MedicoExperiencia.belongsTo( models.Institucion )

        MedicoExperiencia.belongsTo( models.Ciudad )*/
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'experiencia'
  } );

  return MedicoExperiencia;
};
