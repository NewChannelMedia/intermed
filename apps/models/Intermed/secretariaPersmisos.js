"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var SecretariaPermisos = sequelize.define( "SecretariaPermisos", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    permiso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    default: {
      type: DataTypes.INTEGER,
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        SecretariaPermisos.hasMany( models.MedicoSecretariaPermisos )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'secretaria-permisos'
  } );

  return SecretariaPermisos;
};
