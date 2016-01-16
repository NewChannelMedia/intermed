"use strict";

module.exports = function (sequelize, DataTypes) {
    var ProveedorMetodosPago = sequelize.define("ProveedorMetodosPago", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },        
        descripcion: { type: DataTypes.STRING, allowNull: false },
        activo: { type: DataTypes.BOOLEAN, allowNull: false }
    },
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'proveedormetodospago'
    });

    return ProveedorMetodosPago;
};
