"use strict";

module.exports = function(sequelize, DataTypes) {
  var Agenda = sequelize.define("Agenda", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    fechaHoraInicio: {type: DataTypes.DATE},
    status: {type: DataTypes.BOOLEAN},
    nota: {type: DataTypes.STRING},
    resumen: {type: DataTypes.STRING},
    direccion_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false},
    usuarioAtendido_id: {type : DataTypes.BIGINT}
  }, {
    classMethods: {
      associate: function(models) {
        Agenda.hasOne(models.CalificacionCita);
        Agenda.belongsTo(models.Direccion);
        Agenda.belongsTo(models.Usuario);

      /*
      Agenda.belongsTo(models.Usuario, {foreignKey: {
        name: 'usuario_id',
        field: 'usuario_id'
      }, as : 'Usuario'})
      Agenda.belongsTo(models.Usuario, {foreignKey: {
        name: 'usuarioAtendido_id',
        field: 'usuarioAtendido_id'
      },  as: 'UsuarioAtendio'})*/

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
