"use strict";

module.exports = function (sequelize, DataTypes) {
    var EstatusCargoRechazado = sequelize.define("EstatusCargoRechazado", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, name: 'idEstatusCobrosRechazados' },
        descripcion: {type: DataTypes.STRING}
    },{
    classMethods: {
      associate: function(models) {
        EstatusCargoRechazado.belongsTo(models.CargoRechazado)
      }
    }},
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'estatuscargosrechazados'
    });

    return EstatusCargoRechazado;
};
