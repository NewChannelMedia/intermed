"use strict";

module.exports = function(sequelize, DataTypes) {
  var DatosFacturacion = sequelize.define("DatosFacturacion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    RFC: {type: DataTypes.STRING},
    razonSocial: {type: DataTypes.STRING},
    direccion_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        DatosFacturacion.belongsTo(models.Usuario)
        DatosFacturacion.belongsTo(models.Direccion)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'datosFacturacion'
  });

  return DatosFacturacion;
};
