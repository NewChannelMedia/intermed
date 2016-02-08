"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedFavColegas = sequelize.define( "MedFavColegas", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: { type: DataTypes.BIGINT},
    paciente_id: { type: DataTypes.BIGINT },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    aprobado: { type: DataTypes.INTEGER }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedFavColegas.belongsTo( models.Medico )
        MedFavColegas.belongsTo( models.Paciente )
        MedFavColegas.belongsTo( models.Usuario )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medfavcolegas'
  } );

  return MedFavColegas;
};
