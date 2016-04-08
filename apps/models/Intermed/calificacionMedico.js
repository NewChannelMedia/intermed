"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var CalificacionMedico = sequelize.define( "CalificacionMedico", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    medico_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        CalificacionMedico.belongsTo( models.Usuario )
        CalificacionMedico.belongsTo( models.Medico )
        CalificacionMedico.hasOne( models.PreguntasMedico, {
          foreignKey: 'calificacionmedico_id'
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'calificacionmedico'
  } );

  return CalificacionMedico;
};
