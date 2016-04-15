"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var SecretariaInvitacion = sequelize.define( "SecretariaInvitacion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    atendido: {
      type: DataTypes.INTEGER,
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        SecretariaInvitacion.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'secretaria-invitacion'
  } );

  return SecretariaInvitacion;
};
