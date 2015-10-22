﻿"use strict";

module.exports = function (sequelize, DataTypes) {
    var Horarios = sequelize.define("Horarios", {
        idHorario: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        idDireccion: {
            type: DataTypes.BIGINT
        },
        dia: {
            type: DataTypes.INTEGER,
            required: true
        },
        horaIncio: {
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
