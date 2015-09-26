"use strict";

module.exports = function ( sequelize, DataTypes ) {
  var Medico = sequelize.define( "Medico", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    cedula: {
      type: DataTypes.STRING,
      unique: true
    },
    curp: {
      type: DataTypes.STRING,
      unique: true
    },
    token: {
      type: DataTypes.STRING,
      unique: true
    },
    tokenMaestro: {
      type: DataTypes.STRING
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    calificacion: {
      type: DataTypes.DECIMAL
    },
    pago: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function ( models ) {
        Medico.hasOne( models.Hospital )
        Medico.hasOne( models.CalificacionCita )
        Medico.hasMany( models.ComentariosMedicos )
        Medico.hasMany( models.Aseguradora )
        Medico.hasMany( models.CalificacionMedico )
        Medico.belongsToMany( models.Especialidad, {
          through: models.MedicoEspecialidad
        } )
        Medico.belongsToMany( models.Padecimiento, {
          through: models.MedicoPadecimiento
        } )
        Medico.hasMany( models.MedicoEspecialidad )
        Medico.hasMany( models.MedicoFormacion )
        Medico.hasMany( models.MedicoExperiencia )
        Medico.hasMany( models.Colegio )
        Medico.hasMany( models.MedicoFavorito )

        Medico.belongsTo( models.Usuario, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        } );
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicos'
  } );

  return Medico;
};
