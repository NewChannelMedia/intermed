"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoEspecialidad = sequelize.define( "MedicoEspecialidad", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    cedula: {
      type: DataTypes.STRING
    },
    titulo: {
      type: DataTypes.STRING
    },
    anio: {
      type: DataTypes.INTEGER
    },
    medico_id: {
      type: DataTypes.BIGINT,
      required: true
    },
    especialidad_id: {
      type: DataTypes.INTEGER,
      required: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoEspecialidad.belongsTo( models.Especialidad )
        MedicoEspecialidad.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicosespecialidades'
  } );

  return MedicoEspecialidad;
};
