﻿"use strict";

module.exports = function (sequelize, DataTypes) {
    var PlanDeCargo = sequelize.define("PlanDeCargo", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false },
        intervalocargo_id: { type: DataTypes.BIGINT, allowNull: false },
        frecuencia: { type: DataTypes.INTEGER, allowNull: false },
        periodoprueba: { type: DataTypes.INTEGER, allowNull: false },
        idproveedor: { type: DataTypes.STRING }
    },
    {
        classMethods: {
            associate: function (models) {
                PlanDeCargo.belongsTo(models.IntervaloCargo,{foreignKey:{
                  name: 'intervalocargo_id',
                  field: 'intervalocargo_id'
                }})
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'plandecargo'
    });

    return PlanDeCargo;
};
