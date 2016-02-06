"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoPadecimiento = sequelize.define( "MedicoPadecimiento", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    padecimiento_id: {
      type: DataTypes.INTEGER,
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
    tableName: 'medicosPadecimientos'
  } );

  return MedicoPadecimiento;
};
