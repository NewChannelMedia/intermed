"use strict";

module.exports = function (sequelize, DataTypes) {
    var UsuarioTarjeta = sequelize.define("UsuarioTarjeta", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        medico_id: { type: DataTypes.BIGINT, allowNull: false },
        idTarjetaProveedor: { type: DataTypes.STRING },
        ultimosDigitos:{ type: DataTypes.STRING }
    },
    {
        classMethods: {
            associate: function (models) {
                UsuarioTarjeta.belongsTo(models.Medico)
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'usuariostarjetas'
    });

    return UsuarioTarjeta;
};
