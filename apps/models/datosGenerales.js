"use strict";

module.exports = function(sequelize, DataTypes) {
  var DatosGenerales = sequelize.define("DatosGenerales", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    nombre: {type : DataTypes.STRING },
    apellidop: {type : DataTypes.STRING },
    apellidom: {type : DataTypes.STRING},
    rfc: {type: DataTypes.STRING},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
  }, {
    classMethods: {
      associate: function(models) {
        DatosGenerales.belongsTo(models.Usuario, {
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
   tableName: 'datosGenerales'
  });

  return DatosGenerales;
};
