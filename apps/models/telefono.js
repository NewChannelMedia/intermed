"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Telefono = sequelize.define( "Telefono", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING,
      required: true
    },
    numero: {
      type: DataTypes.STRING,
      required: true
    },
    claveRegion: {
      type: DataTypes.STRING
    },
    lada: {
      type: DataTypes.STRING
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Telefono.belongsTo( models.Usuario, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'telefonos'
  } );

  return Telefono;
};
