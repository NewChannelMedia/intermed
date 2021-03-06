"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Paciente = sequelize.define( "Paciente", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    fechaNac: {
      type: DataTypes.DATE
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
  }, {
    classMethods: {
      associate: function ( models ) {
        //User.hasOne(models.Medico)
        Paciente.hasMany( models.PacientePadecimiento );
        Paciente.hasMany( models.PacienteAlergia );
        Paciente.hasMany( models.ContactoEmergencia );
        Paciente.hasMany(models.MedicoFavorito)
        Paciente.hasMany(models.Agenda)

        Paciente.belongsTo( models.Usuario, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'pacientes'
  } );

  return Paciente;
};
