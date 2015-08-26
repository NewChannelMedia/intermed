"use strict";

module.exports = function(sequelize, DataTypes) {
  var TipoEspecialidad = sequelize.define("TipoEspecialidad", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    tipo: {type: DataTypes.STRING,required: true}
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
   timestamps: false,
   paranoid: true,
   underscored: true,
   freezeTableName: true,
   tableName: 'tipoEspecialidad'
  });

  return TipoEspecialidad;
};
