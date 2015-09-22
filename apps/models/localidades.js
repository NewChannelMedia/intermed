"use strict";

module.exports = function(sequelize, DataTypes) {
  var Localidad = sequelize.define("Localidad", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    CP: {type : DataTypes.STRING, allowNull:false},
    localidad: {type : DataTypes.STRING, allowNull:false},
    ciudad_id: {type : DataTypes.BIGINT, allowNull:false},
    municipio_id: {type : DataTypes.BIGINT, allowNull:false},
    estado_id: {type : DataTypes.BIGINT, allowNull:false},
    tipo_localidad_id: {type : DataTypes.INTEGER, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        //  Localidad.belongsTo(models.Ciudad);
        //  Localidad.belongsTo(models.Municipio);
          Localidad.belongsTo(models.Estado);
          Localidad.hasMany(models.Direccion);
          Localidad.belongsTo(models.TipoLocalidad);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'localidades'
  });

  return Localidad;
};
