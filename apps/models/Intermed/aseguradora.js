"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Aseguradora = sequelize.define( "Aseguradora", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    aseguradora: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
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
