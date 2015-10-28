"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Inbox = sequelize.define( "Inbox", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_id_de: {
      type: DataTypes.BIGINT
    },
    usuario_id_para: {
      type: DataTypes.BIGINT
    },
    mensaje: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.DATE
    },
    visto: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Inbox.belongsTo( models.Usuario, {
          foreignKey: 'usuario_id_de'
        } );

        Inbox.belongsTo( models.Usuario, {
          foreignKey: 'usuario_id_para'
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'inbox'
  } );

  return Inbox;
};
