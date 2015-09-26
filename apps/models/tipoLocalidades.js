"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var TipoLocalidad = sequelize.define( "TipoLocalidad", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function ( models ) {
        TipoLocalidad.hasMany( models.Localidad );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tipoLocalidad'
  } );

  return TipoLocalidad;
};
