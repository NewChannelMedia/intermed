"use strict";

module.exports = function(sequelize, DataTypes) {
    var Municipio = sequelize.define("Municipio", {
        id: {type: DataTypes.BIGINT, primaryKey: true },
        municipio_id:{ type: DataTypes.BIGINT},
        municipio: {type: DataTypes.STRING,required: true},
        estado_id: {type: DataTypes.BIGINT,required: true}
    }, {
        classMethods: {
            associate: function(models) {
                Municipio.belongsTo(models.Estado);
              //  Municipio.hasMany(models.Ciudad);
              //  Municipio.hasMany(models.Localidad);
                Municipio.hasMany(models.Direccion);
            }
        },
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'municipios'
    });

    return Municipio;
};
