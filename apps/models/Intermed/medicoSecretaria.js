"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoSecretaria = sequelize.define( "MedicoSecretaria", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    secretaria_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE
    },
    activo: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoSecretaria.belongsTo( models.Medico )
        MedicoSecretaria.belongsTo( models.Secretaria, {
          foreignKey: 'secretaria_id'
        } )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medico-secretaria'
  } );

  return MedicoSecretaria;
};
