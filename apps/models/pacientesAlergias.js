  "use strict";
  module.exports = function( sequelize, DataTypes){
      var PacienteAlergia = sequelize.define('PacienteAlergia',{
          id:{ type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
          paciente_id:{ type: DataTypes.INTEGER},
          alergia_id:{ type: DataTypes.INTEGER}
      },{
          classMethods:{
              associate: function(models){
                  PacienteAlergia.belongsTo(models.Paciente);
                  PacienteAlergia.belongsTo(models.Alergias);
              }
          },
          timestamps: false,
          paranoid: true,
          underscored: true,
          freezeTableName: true,
          tableName: 'pacientesAlergias'
      });
      return PacienteAlergia;
  }
