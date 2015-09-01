"use strict";

module.exports = function(sequelize, DataTypes) {
  var CatalogoServicios = sequelize.define("CatalogoServicios", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    concepto: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING},
    precio: {type: DataTypes.DOUBLE},
    duracion: {type: DataTypes.TIME},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        //User.hasOne(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'catalogoServicios'
  });

  return CatalogoServicios;
};