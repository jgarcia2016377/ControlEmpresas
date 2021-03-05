'use strict'

var express = require('express');
var empleadoController = require('../controllers/empleados.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/setEmpleado/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthEmpresa],empleadoController.setEmpleado);
api.put('/:id/updateEmpleado/:idE', [mdAuth.ensureAuth, mdAuth.ensureAuthEmpresa], empleadoController.updateEmpleado);
api.delete('/:id/removeEmpleado/:idE', [mdAuth.ensureAuth, mdAuth.ensureAuthEmpresa], empleadoController.removeEmpleado);

module.exports = api;