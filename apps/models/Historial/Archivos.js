"use strict";

module.exports = function(sequelize, DataTypes){
  var Archivos = sequelize.define('Archivos',{
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
  return Archivos;
}
