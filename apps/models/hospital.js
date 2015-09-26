"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Hospital = sequelize.define( "Hospital", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    institucion_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Hospital.belongsTo( models.Institucion )
        Hospital.belongsTo( models.Medico )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'hospClinicas'
  } );

  return Hospital;
};
