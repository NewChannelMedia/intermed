"use strict";

module.exports = function (sequelize, DataTypes) {
    var UsuariosReferencias = sequelize.define("UsuariosReferencias", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        usuariocargo_id: { type: DataTypes.INTEGER, allowNull: false },
        fecha: { type: DataTypes.DATE, allowNull: false },
        fechacargopagar: { type: DataTypes.DATE, allowNull: false },
        fechapago: { type: DataTypes.DATE },
        referencia: { type: DataTypes.STRING},
        usuarioreferenciaestatus_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
        classMethods: {
            associate: function (models) {
                UsuariosReferencias.belongsTo(models.UsuarioCargo, { foreignKey: 'usuariocargo_id' });
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'usuariosreferencias'
    });

    return UsuariosReferencias;
};
