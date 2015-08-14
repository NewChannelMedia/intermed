"use strict";

module.exports = function(sequelize, DataTypes) {
  var Direccion = sequelize.define("Direccion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    ubicacionGoogleMaps: {type: DataTypes.STRING},
    calle: {type:  DataTypes.STRING, required: true},
    numero: {type: DataTypes.STRING, required: true},
    calle1: {type: DataTypes.STRING},
    calle2: {type: DataTypes.STRING},
    colonia: {type: DataTypes.STRING, required: true},
    ciudad: {type: DataTypes.STRING, required: true},
    estado_id: {type: DataTypes.INTEGER, required: true},
    cp: {type: DataTypes.STRING},
    principal: {type:  DataTypes.BOOLEAN},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true}
  }, {
    classMethods: {
      associate: function(models) {
    //    Direccion.hasOne(models.Estado);

        Direccion.belongsTo(models.Usuario, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
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
