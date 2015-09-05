"use strict";

module.exports = function(sequelize, DataTypes) {
  var Secretaria = sequelize.define("Secretaria", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        Secretaria.belongsTo(models.Usuario)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'secretarias'
  });

  return Secretaria;
};
