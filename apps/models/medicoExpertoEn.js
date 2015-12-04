"use strict";

module.exports = function(sequelize, DataTypes) {
  var MedicoExpertoEn = sequelize.define("MedicoExpertoEn", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    medico_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
    expertoen: {type: DataTypes.STRING , unique:true},
    padre_id: {type : DataTypes.BIGINT},
    orden: {type : DataTypes.BIGINT}
  }, {
    classMethods: {
      associate: function(models) {
        MedicoExpertoEn.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicoExpertoEn'
  });

  return MedicoExpertoEn;
};
