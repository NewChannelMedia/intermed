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
    lada: {
      type: DataTypes.INTEGER
    },
    claveRegion: {
      type: DataTypes.INTEGER
    },
    numero: {
      type: DataTypes.STRING,
      required: true
    },
    ext: {
      type: DataTypes.STRING
    },
    direccion_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Telefono.belongsTo( models.Direccion, {
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
