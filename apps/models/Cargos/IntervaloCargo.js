"use strict";

module.exports = function (sequelize, DataTypes) {
    var IntervaloCargo = sequelize.define("IntervaloCargo", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false }
    },
    {
        classMethods: {
            associate: function (models) {
                IntervaloCargo.hasMany(models.PlanDeCargo)
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'intervalocargo'
    });

    return IntervaloCargo;
};
