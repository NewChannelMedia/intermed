"use strict";

module.exports = function(sequelize, DataTypes) {
  var Direccion = sequelize.define("Direccion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    calle: {type:  DataTypes.STRING, required: true},
    numero: {type: DataTypes.STRING, required: true},
    numeroInt: {type: DataTypes.STRING},
    calle1: {type: DataTypes.STRING},
    calle2: {type: DataTypes.STRING},
    principal: {type:  DataTypes.INTEGER},
    nombre: {type: DataTypes.STRING},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
    institucion_id: {type: DataTypes.INTEGER},
    municipio_id: {type: DataTypes.INTEGER, required: true},
    localidad_id: {type: DataTypes.INTEGER},
    latitud: {type: DataTypes.STRING},
    longitud: {type: DataTypes.STRING}
    //estado_id: {type: DataTypes.INTEGER, required: true}
  }, {
    classMethods: {
      associate: function(models) {
        Direccion.belongsTo(models.Usuario);
        Direccion.belongsTo(models.Municipio);
        //Direccion.belongsTo(models.Estado)
        Direccion.belongsTo(models.Localidad);
        Direccion.hasMany(models.Horarios);
        Direccion.hasMany(models.Telefono);
      }
    },
   timestamps: false,
   paranoid: true,
   underscored: true,
   freezeTableName: true,
   tableName: 'direcciones'
  });

  return Direccion;
};
