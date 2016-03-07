"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var MedicoSecretariaPermisos = sequelize.define( "MedicoSecretariaPermisos", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    secretaria_permiso_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    medico_secretarias_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    permiso: {
      type: DataTypes.INTEGER,
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        MedicoSecretariaPermisos.belongsTo( models.MedicoSecretaria, {
          foreignKey: 'medico_secretarias_id'
        }  );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medico-secretaria-permisos'
  } );

  return MedicoSecretariaPermisos;
};
