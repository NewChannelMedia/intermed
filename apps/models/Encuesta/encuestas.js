"use strict";

module.exports = function (sequelize, DataTypes) {
    var DBEncuesta_encuesta = sequelize.define("DBEncuesta_encuesta", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
        codigo: { type: DataTypes.STRING, allowNull: false},
        tipoCodigo: { type: DataTypes.INTEGER, allowNull: false},
        tipoPlan: { type: DataTypes.INTEGER},
        canalUsado: { type: DataTypes.INTEGER},
        codigoUsado: { type: DataTypes.INTEGER},
        usada: { type: DataTypes.INTEGER},
        fecha: { type: DataTypes.DATE},
        registrado: { type: DataTypes.INTEGER},
    }, {
      classMethods: {
        associate: function(models) {
            DBEncuesta_encuesta.belongsTo(models.DBEncuesta_tipoEncuesta,  {foreignKey: 'tipoCodigo'})
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'encuestasM'
    });

    return DBEncuesta_encuesta;
};
