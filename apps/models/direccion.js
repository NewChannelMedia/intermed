"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Direccion = sequelize.define( "Direccion", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    ubicacionGM: {
      type: DataTypes.STRING
    },
    calle: {
      type: DataTypes.STRING,
      required: true
    },
    numero: {
      type: DataTypes.STRING,
      required: true
    },
    calle1: {
      type: DataTypes.STRING
    },
    calle2: {
      type: DataTypes.STRING
    },
    principal: {
      type: DataTypes.INTEGER
    },
    nombre: {
      type: DataTypes.STRING
    },
    horaInicio: {
      type: DataTypes.STRING
    },
    horaFin: {
      type: DataTypes.STRING
    },
    dias: {
      type: DataTypes.STRING
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    institucion_id: {
      type: DataTypes.INTEGER
    },
    localidad_id: {
      type: DataTypes.INTEGER
    },
    municipio_id: {
      type: DataTypes.INTEGER
    },
    latitud: {
        type:DataTypes.STRING
    },
    longitud: {
        type:DataTypes.STRING
    }
    //estado_id: {type: DataTypes.INTEGER, required: true}
  }, {
    classMethods: {
      associate: function ( models ) {
        Direccion.belongsTo( models.Usuario );
        Direccion.belongsTo(models.Municipio);        
          //Direccion.belongsTo(models.Estado)
        Direccion.belongsTo( models.Localidad );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'direcciones'
  } );

  return Direccion;
};
