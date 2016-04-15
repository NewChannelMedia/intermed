"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBError_registro = sequelize.define("DBError_registro", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        err: { type: DataTypes.STRING},
        file: { type: DataTypes.STRING},
        function: { type: DataTypes.STRING},
        method: { type: DataTypes.STRING},
        datetime: { type: DataTypes.DATE},
        datetimeupdated: { type: DataTypes.DATE},
        filePath: { type: DataTypes.STRING},
        status: {type: DataTypes.BIGINT},
        userIntermed_id: {type: DataTypes.BIGINT}
    }, {
      classMethods: {
        associate: function(models) {
          DBError_registro.belongsTo( models.DBError_userIntermed ,  {foreignKey: 'userIntermed_id'})
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
