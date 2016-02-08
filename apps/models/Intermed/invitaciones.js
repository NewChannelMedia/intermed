"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Invitacion = sequelize.define( "Invitacion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      required: true
    },
    correo: {
      type: DataTypes.STRING,
      required: true
    },
    mensaje: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Invitacion.belongsTo( models.Usuario );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'invitaciones'
  } );

  return Invitacion;
};
