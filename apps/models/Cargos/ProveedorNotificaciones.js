"use strict";

module.exports = function (sequelize, DataTypes) {
    var ProveedorNotificaciones = sequelize.define("ProveedorNotificaciones", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        notificacionProveedor_id: { type: DataTypes.STRING, allowNull: false },
        fechacreacion: { type: DataTypes.DATE, allowNull: false },
        proveedornotificacionestatus_id: { type: DataTypes.INTEGER, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DOUBLE, allowNull: false },
        usuarioscargos_id: { type: DataTypes.INTEGER},
        usuariostarjetas_id: { type: DataTypes.INTEGER },
        proveedormetodosdepago_id: { type: DataTypes.INTEGER },
        fechapago: { type: DataTypes.DATE}
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
