"use strict";

module.exports = function(sequelize, DataTypes) {
  var Direccion = sequelize.define("Direccion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    ubicacionGM: {type: DataTypes.STRING},
    calle: {type:  DataTypes.STRING, required: true},
    numero: {type: DataTypes.STRING, required: true},
    calle1: {type: DataTypes.STRING},
    calle2: {type: DataTypes.STRING},
    colonia: {type: DataTypes.STRING, required: true},
    cp: {type: DataTypes.STRING},
    principal: {type:  DataTypes.BOOLEAN},
    nombre: {type: DataTypes.STRING},
    horaInicio: {type: DataTypes.STRING},
    horaFin: {type: DataTypes.STRING},
    dias: {type: DataTypes.STRING},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
    ciudad_id: {type: DataTypes.INTEGER, required: true},
    estado_id: {type: DataTypes.INTEGER, required: true},
    institucion_id: {type: DataTypes.INTEGER}
  }, {
    classMethods: {
      associate: function(models) {
        Direccion.belongsTo(models.Estado);
        Direccion.belongsTo(models.Ciudad);
        Direccion.belongsTo(models.Usuario);
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
