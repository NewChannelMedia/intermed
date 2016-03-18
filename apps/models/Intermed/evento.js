"use strict";

module.exports = function(sequelize, DataTypes) {
  var Evento = sequelize.define("Evento", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    fechaHoraInicio: {type: DataTypes.DATE},
    fechaHoraFin: {type: DataTypes.DATE},
    descripcion: {type: DataTypes.STRING},
    usuario_id : {type : DataTypes.INTEGER}
  }, {
    classMethods: {
      associate: function(models) {
        Evento.belongsTo(models.Usuario)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'eventos'
  });

  return Evento;
};
