"use strict";

module.exports = function (sequelize, DataTypes) {
    var HistoricoCargos = sequelize.define("HistoricoCargos", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        usuariocargo_id: { type: DataTypes.BIGINT },
        fecha: { type: DataTypes.DATE, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false }
    },
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'historicocargos'
    });

    return HistoricoCargos;
};
