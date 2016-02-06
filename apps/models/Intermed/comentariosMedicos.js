"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var ComentariosMedicos = sequelize.define( "ComentariosMedicos", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING
    },
    comentario: {
      type: DataTypes.STRING
    },
    anonimo: {
      type: DataTypes.INTEGER
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    fecha: {type: DataTypes.DATE}
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
