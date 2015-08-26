"use strict";

module.exports = function(sequelize, DataTypes) {
  var Padecimiento = sequelize.define("Padecimiento", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    padecimiento: {type: DataTypes.STRING}
  }, {
    classMethods: {
      associate: function(models) {
        //User.hasOne(models.Medico)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'padecimientos'
  });

  return Padecimiento;
};
