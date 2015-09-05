"use strict";

module.exports = function(sequelize, DataTypes) {
  var CalificacionMedico = sequelize.define("CalificacionMedico", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    efectividad: {type: DataTypes.INTEGER},
    tratoPersonal: {type: DataTypes.INTEGER},
    presentacion: {type: DataTypes.INTEGER},
    higiene: {type: DataTypes.INTEGER},
    medico_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type : DataTypes.BIGINT}
  }, {
    classMethods: {
      associate: function(models) {
        CalificacionMedico.belongsTo(models.Usuario)
        CalificacionMedico.belongsTo(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'calificacionMedico'
  });

  return CalificacionMedico;
};
