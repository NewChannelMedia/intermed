"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ciudad = sequelize.define("Ciudad", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    ciudad: {type : DataTypes.STRING, allowNull:false},
    estado_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
          Ciudad.belongsTo(models.Estado);
          Ciudad.hasMany(models.Direccion);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'ciudades'
  });

  return Ciudad;
};
