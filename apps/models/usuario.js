"use strict";

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    id: {type : DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    correo: {type : DataTypes.STRING },
    usuario: {type: DataTypes.STRING},
    fbId: {type : DataTypes.STRING },
    urlFotoPerfil: {type : DataTypes.STRING },
    password: {type : DataTypes.STRING},
    tipoUsuario: {type: DataTypes.STRING, required: true},
    tipoRegistro: {type: DataTypes.STRING, required: true},
    estatusActivacion: {type: DataTypes.INTEGER, required: true},
    token: {type: DataTypes.STRING }
  }, {
    classMethods: {
      // asociaciones con otras tablas
      associate: function(models) {
        Usuario.hasOne(models.Medico)
        Usuario.hasOne(models.Paciente)
        Usuario.hasOne(models.DatosGenerales)
        Usuario.hasMany(models.Direccion)
        Usuario.hasMany(models.Telefono)
        Usuario.hasOne(models.Biometrico)
        //Usuario.hasMany(models.Biometrico);
        Usuario.hasMany(models.ComentariosMedicos)
        Usuario.hasMany(models.CalificacionMedico)
        Usuario.hasMany(models.Secretaria)
        Usuario.hasMany(models.Agenda)
        Usuario.hasMany(models.CatalogoServicios)
        Usuario.hasOne(models.DatosFacturacion)
        Usuario.hasOne(models.Proveedor)
        Usuario.hasMany(models.Contacto)
        Usuario.hasMany(models.MedicoFavorito)
      }
    },
   timestamps: false,  //elimina los campos de crated_at, update_at y remove_at
   paranoid: true,
   underscored: true,
   freezeTableName: true,  // forza a que se tome minúsculas el nomde de tabla
   tableName: 'usuarios'  // se especifica el nombre  real en la base de datos
  });

  return Usuario;
};
