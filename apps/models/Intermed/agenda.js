"use strict";

module.exports = function(sequelize, DataTypes) {
  var Agenda = sequelize.define("Agenda", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    fechaHoraInicio: {type: DataTypes.DATE},
    fechaHoraFin: {type: DataTypes.DATE},
    status: {type: DataTypes.INTEGER},
    nota: {type: DataTypes.STRING},
    resumen: {type: DataTypes.STRING},
    direccion_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false},
    paciente_id: {type : DataTypes.BIGINT},
    paciente_temporal_id: { type: DataTypes.BIGINT},
    servicio_id : {type : DataTypes.INTEGER},
    motivoreagenda: {type: DataTypes.STRING}
  }, {
    classMethods: {
      associate: function(models) {
        Agenda.hasOne(models.CalificacionCita)
        Agenda.belongsTo(models.Direccion)
        Agenda.belongsTo(models.Usuario)
        Agenda.belongsTo(models.Paciente)
        Agenda.belongsTo(models.PacienteTemporal)
        Agenda.belongsTo(models.CatalogoServicios,{foreignKey:{
          name: 'servicio_id',
          field: 'servicio_id'
        }})
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'agenda'
  });

  return Agenda;
};
