"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBError_userIntermed = sequelize.define("DBError_userIntermed", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        nombre: { type: DataTypes.STRING}
    }, {
      classMethods: {
        associate: function(models) {
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'userIntermed'
    });

    return DBError_userIntermed;
};
