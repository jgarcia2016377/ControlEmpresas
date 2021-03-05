'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = Schema({
    nombre : String,
    direccion : String,
    telefono : Number,
    nit : String,
    password : String,
    username : String,
    email : String,
    tipo : String,
    role : String,
    empleados : [{type : Schema.ObjectId, ref: 'empleado'}]
});

module.exports = mongoose.model('empresa', empresaSchema);