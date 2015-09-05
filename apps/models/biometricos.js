"use strict";

module.exports = function(sequelize, DataTypes) {
  var Biometrico = sequelize.define("Biometrico", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    peso: {type: DataTypes.REAL},
    altura: {type: DataTypes.REAL},
    tipoSangre: {type: DataTypes.STRING},
    genero: {type: DataTypes.STRING},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        Biometrico.belongsTo(models.Usuario)
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
