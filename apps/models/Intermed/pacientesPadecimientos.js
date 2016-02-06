  "use strict";
  module.exports = function ( sequelize, DataTypes ) {
    var PacientePadecimiento = sequelize.define( 'PacientePadecimiento', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      paciente_id: {
        type: DataTypes.INTEGER
      },
      padecimiento_id: {
        type: DataTypes.INTEGER
      }
    }, {
      classMethods: {
        associate: function ( models ) {
          PacientePadecimiento.belongsTo( models.Paciente );
          PacientePadecimiento.belongsTo( models.Padecimiento );
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'PacientesPadecimientos'
    } );
    return PacientePadecimiento;
  }
