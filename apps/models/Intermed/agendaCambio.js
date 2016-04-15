"use strict";

module.exports = function(sequelize, DataTypes) {
  var AgendaCambio = sequelize.define("AgendaCambio", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    fechaHoraInicio: {type: DataTypes.DATE},
    fechaHoraFin: {type: DataTypes.DATE},
    agenda_id: {type : DataTypes.BIGINT, allowNull:false},
    estatus: {type : DataTypes.INTEGER},
    tiempo : {type : DataTypes.STRING}
  },{
    classMethods: {

    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'agendaCambios'
  });

  return AgendaCambio;
};
