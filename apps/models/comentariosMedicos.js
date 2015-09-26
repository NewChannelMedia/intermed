"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var ComentariosMedicos = sequelize.define( "ComentariosMedicos", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    comentario: {
      type: DataTypes.STRING
    },
    anonimo: {
      type: DataTypes.BOOLEAN
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        ComentariosMedicos.belongsTo( models.Usuario )
        ComentariosMedicos.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'comentarios'
  } );

  return ComentariosMedicos;
};
