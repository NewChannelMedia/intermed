"use strict";

module.exports = function(sequelize, DataTypes) {
  var ConfNotUsu = sequelize.define("ConfNotUsu", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    usuario_id: {type: DataTypes.BIGINT},
    tipoNotificacion_id: {type: DataTypes.BIGINT},
    interno: {type: DataTypes.INTEGER},
    push: {type: DataTypes.INTEGER},
    mail: {type: DataTypes.INTEGER}
  }, {
    classMethods: {
      associate: function(models) {
        ConfNotUsu.belongsTo(models.TipoNotificacion, {foreignKey : 'tipoNotificacion_id'});
        ConfNotUsu.belongsTo(models.Usuario);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'confNotUsu'
  });

  return ConfNotUsu;
};
