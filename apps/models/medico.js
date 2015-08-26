"use strict";

module.exports = function(sequelize, DataTypes) {
  var Medico = sequelize.define("Medico", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    cedula: {type: DataTypes.STRING , required: true, unique:true},
    curp: {type: DataTypes.STRING , required: true, unique:true},
    token: {type: DataTypes.STRING , required: true, unique:true},
    tokenMaestro: {type: DataTypes.STRING , required: true, unique:true},
    usuario_id: {type : DataTypes.BIGINT, allowNull:false, unique:true}
  }, {
    classMethods: {
      associate: function(models) {
      //  Medico.hasMany(models.Especialidad,  {through: 'MedicoEspecialidad'});
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
