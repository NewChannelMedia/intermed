"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBError_userIntermed = sequelize.define("DBError_userIntermed", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        nombre: { type: DataTypes.STRING},
        correo: { type: DataTypes.STRING},
        celular: { type: DataTypes.STRING},
        pass: { type: DataTypes.STRING},
        activo: {type: DataTypes.INTEGER},
        rolUsuario_id: {type: DataTypes.INTEGER},
        imagenUrl: {type: DataTypes.STRING}
    }, {
      classMethods: {
        associate: function(models) {
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'userintermed'
    });

    return DBError_userIntermed;
};
