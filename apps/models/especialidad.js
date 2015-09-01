"use strict";

module.exports = function(sequelize, DataTypes) {
  var Especialidad = sequelize.define("Especialidad", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    especialidad: {type : DataTypes.STRING, required: true},
    descripcion: {type : DataTypes.STRING, required: true},
    //tipoEspecialidad_id: {type : DataTypes.BIGINT, required: true}
  }, {
    classMethods: {
      associate: function(models) {
        Especialidad.belongsToMany(models.Medico,  {through: models.MedicoEspecialidad})
        Especialidad.belongsTo(models.TipoEspecialidad, {foreignKey: {
          name: 'tipoEspecialidad_id',
          field: 'tipoEspecialidad_id'
        }})
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'especialidades'
  });

  return Especialidad;
};
