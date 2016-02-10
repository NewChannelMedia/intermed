"use strict";

module.exports = function (sequelize, DataTypes) {
    var ProveedorNotificaciones = sequelize.define("ProveedorNotificaciones", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        notificacionProveedor_id: { type: DataTypes.STRING, allowNull: false },
        fechaCreacion: { type: DataTypes.DATE, allowNull: false },
        proveedorNotificacionEstatus_id: { type: DataTypes.INTEGER, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false },
        usuariosCargos_id: { type: DataTypes.INTEGER},        
        proveedorMetodosDePago_id: { type: DataTypes.INTEGER },
        fechaPago: { type: DataTypes.DATE}
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
