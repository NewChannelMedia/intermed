"use strict";

module.exports = function (sequelize, DataTypes) {
    var ProveedorNotificaciones = sequelize.define("ProveedorNotificaciones", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        notificacionProveedor_id: { type: DataTypes.STRING, allowNull: false },
        proveedorNotificacionEstatus_id: { type: DataTypes.INTEGER, allowNull: false },
        proveedorMetodosDePago_id: { type: DataTypes.INTEGER },
        usuariosCargos_id: { type: DataTypes.INTEGER },                
        historicoCargos_id: { type: DataTypes.INTEGER },        
        fechaCreacion: { type: DataTypes.DATE, allowNull: false },
        fechaPago: { type: DataTypes.DATE },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false }
    },
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'proveedornotificaciones'
    });
    
    return ProveedorNotificaciones;
};
