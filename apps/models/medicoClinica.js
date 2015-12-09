"use strict";

module.exports = function(sequelize, DataTypes) {
  var MedicoClinica = sequelize.define("MedicoClinica", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    medico_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
    clinica: {type: DataTypes.STRING , unique:true},
    orden: {type : DataTypes.BIGINT}
  }, {
    classMethods: {
      associate: function(models) {
        MedicoClinica.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicoClinica'
  });

  return MedicoClinica;
};
