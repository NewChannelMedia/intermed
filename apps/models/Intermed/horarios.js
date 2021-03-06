"use strict";

module.exports = function (sequelize, DataTypes) {
    var Horarios = sequelize.define("Horarios", {
        Id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        direccion_id: {
            type: DataTypes.BIGINT,
            required: true
        },
        dia: {
            type: DataTypes.INTEGER,
            required: true
        },
        horaInicio: {
            type: DataTypes.STRING,
            required: true
        },
        horaFin: {
            type: DataTypes.STRING,
            required: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Horarios.belongsTo(models.Direccion);
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'horarios'
    });

    return Horarios;
};
