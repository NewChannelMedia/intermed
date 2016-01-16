"use strict";

module.exports = function (sequelize, DataTypes) {
    var ProveedorNotificacionesEstatus = sequelize.define("ProveedorNotificacionesEstatus", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        descripcion: { type: DataTypes.STRING, allowNull: false }        
    },
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'proveedornotificacionesestatus'
    });

    return ProveedorNotificacionesEstatus;
};
