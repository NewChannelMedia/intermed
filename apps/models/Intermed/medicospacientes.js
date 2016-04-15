"use strict";

module.exports = function(sequelize, DataTypes) {
  var MedicoPaciente = sequelize.define("MedicoPaciente", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    medico_id: {type : DataTypes.BIGINT, allowNull:false},
    paciente_id: {type : DataTypes.BIGINT},
    fecha: {type: DataTypes.DATE},
  }, {
    classMethods: {
      associate: function(models) {
        MedicoPaciente.belongsTo(models.Paciente)
        MedicoPaciente.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicospacientes'
  });

  return MedicoPaciente;
};
