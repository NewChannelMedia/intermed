"use strict";

module.exports = function(sequelize, DataTypes) {
  var Contacto = sequelize.define("Contacto", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    paciente_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type: DataTypes.INTEGER, allowNull:false}
  },{
      classMethods: {
        associate: function(models) {
          Contacto.belongsTo(models.Paciente)
          Contacto.belongsTo(models.Usuario)
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'contactos'
  });

  return Contacto;
};
