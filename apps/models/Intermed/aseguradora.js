"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Aseguradora = sequelize.define( "Aseguradora", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Aseguradora.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'aseguradoras'
  } );

  return Aseguradora;
};
