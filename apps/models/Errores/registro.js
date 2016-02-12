"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBError_registro = sequelize.define("DBError_registro", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        type: { type: DataTypes.STRING},
        err: { type: DataTypes.STRING},
        stack: { type: DataTypes.STRING},
        arguments: { type: DataTypes.STRING},
        session: { type: DataTypes.STRING},
        file: { type: DataTypes.STRING},
        function: { type: DataTypes.STRING},
        usuario_id: { type: DataTypes.BIGINT},
        datetime: { type: DataTypes.DATE},
        protocol: { type: DataTypes.STRING},
        host: { type: DataTypes.STRING},
        port: { type: DataTypes.STRING},
        method: { type: DataTypes.STRING},
        path: { type: DataTypes.STRING},
        headers: { type: DataTypes.STRING},
        agent: { type: DataTypes.STRING},
    }, {
      classMethods: {
        associate: function(models) {
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'registro'
    });

    return DBError_registro;
};
