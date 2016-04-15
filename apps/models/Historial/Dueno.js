"use strict";

module.exports = function(sequelize, DataTypes){
  var Dueño = sequelize.define('Dueño',{
    id:{type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    idP:{ type: DataTypes.BIGINT },
    idDr:{ type: DataTypes.BIGINT },
    token:{ type: DataTypes.BIGINT }
  },{
    classMethods: {
      associate: function(models) {
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'pertenece'
  });
  return Dueño;
}
