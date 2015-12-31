"use strict";

module.exports = function (sequelize, DataTypes) {
    var PlanDeCargo = sequelize.define("PlanDeCargo", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false },
        intervalocargo_id: { type: DataTypes.INTEGER, allowNull: false },
        frecuencia: { type: DataTypes.INTEGER, allowNull: false },
        periodoprueba: { type: DataTypes.INTEGER, allowNull: false },
    },
    {        
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'plandecargo'
    });

    return PlanDeCargo;
};
