'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empleadoSchema = Schema({
    nombre : String,
    apellido : String,
    telefono : Number,
    dpi : Number,
    email : String,
    departamento: String,
    puesto : String
});

module.exports = mongoose.model('empleado', empleadoSchema);