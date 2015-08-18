"use strict";

module.exports = function(sequelize, DataTypes) {
  var Biometrico = sequelize.define("Biometrico", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    peso: {type: DataTypes.REAL, required: true},
    altura: {type: DataTypes.REAL, required: true},
    tipoSangre: {type: DataTypes.STRING, required: true},
    paciente_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        //User.hasOne(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'biometricos'
  });

  return Biometrico;
};
