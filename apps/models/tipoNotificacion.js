"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var TipoNotificacion = sequelize.define( "TipoNotificacion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    intervalo: {
      type: DataTypes.INTEGER
    },
    tipo: {
      type: DataTypes.STRING
    },
    tipoUsuario: {
      type: DataTypes.STRING
    },
    interno: {
      type: DataTypes.INTEGER
    },
    push: {
      type: DataTypes.INTEGER
    },
    mail: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        TipoNotificacion.hasMany( models.Notificacion, {
          foreignKey: 'tipoNotificacion_id'
        } );
        TipoNotificacion.hasMany( models.ConfNotUsu, {
          foreignKey: 'tipoNotificacion_id'
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tipoNotificacion'
  } );

  return TipoNotificacion;
};
