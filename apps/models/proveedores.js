"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Proveedor = sequelize.define( "Proveedor", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    micrositio: {
      type: DataTypes.STRING
    },
    categoria: {
      type: DataTypes.STRING
    },
    razonSocial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Proveedor.belongsTo( models.Usuario )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'proveedores'
  } );

  return Proveedor;
};
