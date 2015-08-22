"use strict";

module.exports = function(sequelize, DataTypes) {
  var Paciente = sequelize.define("Paciente", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    fechaNac: {type : DataTypes.DATE},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true},
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
    tableName: 'pacientes'
  });

  return Paciente;
};
