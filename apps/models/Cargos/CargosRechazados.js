"use strict";

module.exports = function (sequelize, DataTypes) {
    var CargoRechazado = sequelize.define("CargoRechazado", {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, name: 'idCargosRechazados' },
        usuario_id: { type: DataTypes.INTEGER, allowNull: false, name:'idUsuario' },
        estatus_id: { type: DataTypes.INTEGER, allowNull: false, name:'idEstatusCargoRechazado' },
        fecha : { type: DataTypes.STRING, allowNull: false },
        descripcion: {type: DataTypes.STRING},
        diasSinCobro: {type: DataTypes.STRING}
    }, {
    classMethods: {
      associate: function(models) {
        CargoRechazado.hasOne(models.EstatusCargoRechazado)
      }
    }},
    {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'cargosrechazados'
    });

    return CargoRechazado;
};
