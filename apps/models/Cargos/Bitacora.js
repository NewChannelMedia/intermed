"use strict";

module.exports = function (sequelize, DataTypes) {
    var Bitacora = sequelize.define("Bitacora", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        usuariocargo_id: { type: DataTypes.BIGINT },
        fechaRegistro: { type: DataTypes.DATE, allowNull: false },
        periodoPago: { type: DataTypes.DATE, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false }
    },
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'bitacora'
    });

    return Bitacora;
};
