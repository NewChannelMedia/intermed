"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var PreguntasMedico = sequelize.define( "PreguntasMedico", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: {
      type: DataTypes.INTEGER
    },
    calificacioncita_id: {
      type: DataTypes.INTEGER
    },
    calificacionmedico_id: {
      type: DataTypes.INTEGER
    },
    fecha: {
      type: DataTypes.DATE
    },
    higiene: {
      type: DataTypes.INTEGER
    },
    puntualidad: {
      type: DataTypes.INTEGER
    },
    instalaciones: {
      type: DataTypes.INTEGER
    },
    tratoPersonal: {
      type: DataTypes.INTEGER
    },
    satisfaccionGeneral: {
      type: DataTypes.INTEGER
    },
    costo: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        PreguntasMedico.belongsTo( models.Medico,{foreignKey:{
          name: 'medico_id',
          field: 'medico_id'
        }})
          PreguntasMedico.belongsTo( models.CalificacionCita,{foreignKey:{
            name: 'calificacioncita_id',
            field: 'calificacioncita_id'
          }})
        PreguntasMedico.belongsTo( models.CalificacionMedico,{foreignKey:{
          name: 'calificacionmedico_id',
          field: 'calificacionmedico_id'
        }})
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'preguntas-medico'
  } );

  return PreguntasMedico;
};
