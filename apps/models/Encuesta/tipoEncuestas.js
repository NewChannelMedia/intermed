"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBEncuesta_tipoEncuesta = sequelize.define("DBEncuesta_tipoEncuesta", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        tipo: { type: DataTypes.STRING, allowNull: false}
    }, {
      classMethods: {
        associate: function(models) {
            DBEncuesta_tipoEncuesta.hasMany(models.DBEncuesta_encuesta,  {foreignKey: 'tipoCodigo'})
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'tipoEncuesta'
    });

    return DBEncuesta_tipoEncuesta;
};
