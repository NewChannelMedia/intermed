"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Palabras = sequelize.define( "Palabras", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    palabra: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Palabras.belongsTo( models.Usuario )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'palabras'
  } );

  return Palabras;
};
