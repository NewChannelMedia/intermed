  "use strict";
  module.exports = function( sequelize, DataTypes ){
      var Alergias = sequelize.define('Alergias',{
          id:{ type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
          alergia:{ type: DataTypes.STRING, required: true}
      },{
          classMethods:{
              associate: function(models){
                  Alergias.hasMany(models.PacienteAlergia);
              }
          },
          timestamps: false,
          paranoid: true,
          underscored: true,
          freezeTableName: true,
          tableName: 'alergias'
      });
      return Alergias;
  }
