  "use strict";
  module.exports = function ( sequelize, DataTypes ) {
    var Alergias = sequelize.define( 'Alergias', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      alergia: {
        type: DataTypes.STRING,
        required: true
      }
    }, {
      classMethods: {
        associate: function ( models ) {
          //Alergia.hasMany(models.Paciente);
        }
      },
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'alergias'
    } );
    return Alergias;
  }
