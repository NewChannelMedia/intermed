﻿"use strict";

module.exports = function (sequelize, DataTypes) {
    var UsuarioCargo = sequelize.define("UsuarioCargo", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        medico_id: { type: DataTypes.BIGINT, allowNull: false },
        idUsuarioProveedor: { type: DataTypes.STRING },
        cargosEstatus_id : { type: DataTypes.BIGINT, allowNull: false },
        planDeCargo_id: { type: DataTypes.STRING },
        fechaAlta: { type: DataTypes.DATE },
        fechaProximoCargo: { type: DataTypes.DATE },
    },
    {
        classMethods: {
            associate: function (models) {
                UsuarioCargo.belongsTo(models.Medico)
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'usuarioscargos'
    });

    return UsuarioCargo;
};
