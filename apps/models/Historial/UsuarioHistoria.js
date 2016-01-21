"use strict";

module.exports = function(sequelize, DataTypes){
  var UsuarioHistorial = sequelize.define('UsuarioHistorial',{
    id:{type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    idDr:{ type: DataTypes.BIGINT },
    pass:{ type: DataTypes.STRING },
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
    tableName: 'usuarioHistorial'
  });
  return UsuarioHistorial;
}
