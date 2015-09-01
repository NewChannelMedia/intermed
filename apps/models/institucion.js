"use strict";

module.exports = function(sequelize, DataTypes) {
  var Institucion = sequelize.define("Institucion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    micrositio: {type: DataTypes.STRING},
    razonSocial: {type: DataTypes.STRING, allowNull:false},
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
    tableName: 'instituciones'
  });

  return Institucion;
};
