"use strict";

module.exports = function(sequelize, DataTypes) {
  var MedicoFavorito = sequelize.define("MedicoFavorito", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    medico_id: {type : DataTypes.BIGINT, allowNull:false},
    usuario_id: {type: DataTypes.INTEGER, allowNull:false}
  }, {
    classMethods: {
      associate: function(models) {

      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medFavColegas'
  });

  return MedicoFavorito;
};
