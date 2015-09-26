"use strict";

module.exports = function(sequelize, DataTypes) {
  var Notificacion = sequelize.define("Notificacion", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    usuario_id: {type : DataTypes.BIGINT},
    tipoNotificacion_id: {type : DataTypes.BIGINT},
    data: {type: DataTypes.STRING},
    inicio: {type: DataTypes.DATE},
    fin: {type: DataTypes.DATE},
    visto: {type: DataTypes.INTEGER},
    recordatorio: {type: DataTypes.INTEGER}
  }, {
    classMethods: {
      associate: function(models) {
        Notificacion.belongsTo(models.TipoNotificacion, {foreignKey : 'tipoNotificacion_id'});
        Notificacion.belongsTo(models.Usuario);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'notificacion'
  });

  return Notificacion;
};
