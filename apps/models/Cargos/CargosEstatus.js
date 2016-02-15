"use strict";

module.exports = function (sequelize, DataTypes) {
    var CargosEstatus = sequelize.define("CargosEstatus", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        descripcon: { type: DataTypes.STRING },        
    },
    {
        //classMethods: {
        //    associate: function (models) {
        //        UsuarioCargo.belongsTo(models.Medico)
        //    }
        //},           
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'cargosestatus'
    });
    
    return CargosEstatus;
};