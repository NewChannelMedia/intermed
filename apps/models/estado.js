"use strict";

module.exports = function(sequelize, DataTypes) {
  var Estado = sequelize.define("Estado", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    estado: {type : DataTypes.STRING, required: true, unique: true },
  }, {
    classMethods: {
      associate: function(models) {
        Estado.belongsTo(models.Direccion);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'estados'
  });

  return Estado;
};
