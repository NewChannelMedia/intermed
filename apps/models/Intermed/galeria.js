"use strict";

module.exports = function(sequelize, DataTypes) {
  var Galeria = sequelize.define("Galeria", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false},
    fecha: {type: DataTypes.DATE},
    imagenurl: {type: DataTypes.STRING},
    titulo: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING}
  }, {
    classMethods: {
      associate: function(models) {
        Galeria.belongsTo(models.Usuario)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'galeria'
  });

  return Galeria;
};
