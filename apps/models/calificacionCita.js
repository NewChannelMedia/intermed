"use strict";

module.exports = function(sequelize, DataTypes) {
  var CalificacionCita = sequelize.define("CalificacionCita", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    higieneLugar: {type: DataTypes.INTEGER},
    puntualidad: {type: DataTypes.INTEGER},
    instalaciones: {type: DataTypes.INTEGER},
    tratoPersonal: {type: DataTypes.INTEGER},
    satisfaccionGeneral: {type: DataTypes.INTEGER},
    comentarios: {type: DataTypes.STRING},
    agenda_id: {type : DataTypes.BIGINT, allowNull:false},
    medico_id: {type : DataTypes.BIGINT, allowNull:false},
    paciente_id: {type : DataTypes.BIGINT, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {
        CalificacionCita.belongsTo(models.Agenda)
        CalificacionCita.belongsTo(models.Medico)
        CalificacionCita.belongsTo(models.Paciente)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'calificacionCita'
  });

  return CalificacionCita;
};
