"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ciudad = sequelize.define("Ciudad", {
    id: {type : DataTypes.BIGINT, primaryKey: true},
    ciudad: {type : DataTypes.STRING, allowNull:false},
    municipio_id: {type : DataTypes.BIGINT, allowNull:false},
    estado_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
          Ciudad.belongsTo(models.Estado);
          Ciudad.belongsTo(models.Municipio);
          Ciudad.hasMany(models.Localidad);
      },
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'ciudades'
  });

  return Ciudad;
};
