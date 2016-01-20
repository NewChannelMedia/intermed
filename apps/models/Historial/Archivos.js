"use strict";

module.exports = function(sequelize, DataTypes){
  var Archivo = sequelize.define('Archivo',{
    id:{type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    url:{ type: DataTypes.STRING },
    idP:{ type : DataTypes.BIGINT }
  },{
    classMethods: {
      associate: function(models) {
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'archivos'
  });
  return Archivo;
}
