"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Secretaria = sequelize.define( "Secretaria", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    estado_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    municipio_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Secretaria.belongsTo( models.Usuario )
        Secretaria.hasMany( models.MedicoSecretaria, {
          foreignKey: 'secretaria_id'
        } )
        Secretaria.belongsTo(models.Municipio);
        Secretaria.belongsTo(models.Estado);
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'secretarias'
  } );

  return Secretaria;
};
