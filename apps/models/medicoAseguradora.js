"use strict";

module.exports = function(sequelize, DataTypes) {
  var MedicoAseguradora = sequelize.define("MedicoAseguradora", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    medico_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
    aseguradora: {type: DataTypes.STRING , unique:true},
    orden: {type : DataTypes.BIGINT}
  }, {
    classMethods: {
      associate: function(models) {
        MedicoAseguradora.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicoaseguradora'
  });

  return MedicoAseguradora;
};
