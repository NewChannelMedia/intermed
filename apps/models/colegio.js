"use strict";

module.exports = function(sequelize, DataTypes) {
  var Colegio = sequelize.define("Colegio", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    nombre: {type: DataTypes.STRING, required:true},
    fechaInicio: {type : DataTypes.DATE, allowNull:false},
    institucion_id: {type : DataTypes.BIGINT, allowNull:false},
    medico_id: {type : DataTypes.BIGINT, allowNull:false},
  }, {
    classMethods: {
      associate: function(models) {
        Colegio.belongsTo(models.Institucion)
        Colegio.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'colegiosAsoc'
  });

  return Colegio;
};
