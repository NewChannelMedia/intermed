"use strict";

module.exports = function(sequelize, DataTypes) {
  var Medico = sequelize.define("Medico", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    cedula: {type: DataTypes.STRING , unique:true},
    curp: {type: DataTypes.STRING , unique:true},
    token: {type: DataTypes.STRING , unique:true},
    tokenMaestro: {type: DataTypes.STRING},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true}
  }, {
    classMethods: {
      associate: function(models) {
        Medico.hasMany(models.ComentariosMedicos)
        Medico.hasMany(models.MedicoEspecialidad)
        Medico.belongsToMany(models.Padecimiento,  {through: models.MedicoPadecimiento})
        Medico.belongsTo(models.Usuario, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    },
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'medicos'
  });

  return Medico;
};
