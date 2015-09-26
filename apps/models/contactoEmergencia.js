"use strict";
module.exports = function ( sequelize, DataTypes ) {
  var ContactoEmergencia = sequelize.define( 'ContactoEmergencia', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING
    },
    tel: {
      type: DataTypes.STRING
    },
    medico: {
      type: DataTypes.INTEGER
    },
    usuario_id: {
      type: DataTypes.INTEGER
    },
    paciente_id: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        ContactoEmergencia.belongsTo( models.Usuario );
        ContactoEmergencia.belongsTo( models.Paciente );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'contactoEmergencia'
  } );
  return ContactoEmergencia;
}
