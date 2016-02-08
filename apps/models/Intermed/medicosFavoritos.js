"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoFavorito = sequelize.define( "MedicoFavorito", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: {
      type: DataTypes.BIGINT
    },
    paciente_id: {
      type: DataTypes.BIGINT
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aprobado: {
      type: DataTypes.INTEGER
    },
    mutuo: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoFavorito.belongsTo( models.Medico )
        MedicoFavorito.belongsTo( models.Paciente )
        MedicoFavorito.belongsTo( models.Usuario )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medfavcolegas'
  } );

  return MedicoFavorito;
};
