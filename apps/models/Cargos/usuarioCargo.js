"use strict";

module.exports = function (sequelize, DataTypes) {
    var UsuarioCargo = sequelize.define("usuariosCargos", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        medico_id: { type: DataTypes.BIGINT, allowNull: false },
        fechaprimerdescuento: { type: DataTypes.DATE }
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
