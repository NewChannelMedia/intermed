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
        //User.hasOne(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'DatosFacturacion'
  });

  return DatosFacturacion;
};
