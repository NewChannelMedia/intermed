"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Institucion = sequelize.define( "Institucion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    micrositio: {
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
        Institucion.hasOne( models.Direccion )
        Institucion.hasOne( models.Hospital )
        Institucion.hasOne( models.Colegio )
        Institucion.belongsTo( models.Usuario )
        Institucion.hasOne( models.MedicoExperiencia )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'instituciones'
  } );

  return Institucion;
};
