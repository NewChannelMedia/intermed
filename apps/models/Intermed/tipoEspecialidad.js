"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var TipoEspecialidad = sequelize.define( "TipoEspecialidad", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        //TipoEspecialidad.hasMany(models.Especialidad)
        TipoEspecialidad.hasMany( models.Especialidad, {
          foreignKey: {
            name: 'tipoEspecialidad_id',
            field: 'tipoEspecialidad_id'
          }
        } )
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tipoespecialidad'
  } );

  return TipoEspecialidad;
};
