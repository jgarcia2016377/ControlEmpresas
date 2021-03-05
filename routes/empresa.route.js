'use strict'

var express = require('express');
var empresaController = require('../controllers/empresas.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.post('/loginEmpresa', empresaController.login);
api.post('/saveEmpresa', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  empresaController.saveEmpresa);
api.put('/updateEmpresa/:id', mdAuth.ensureAuth, empresaController.updateEmpresa);
api.delete('/removeEmpresa/:id', mdAuth.ensureAuth, empresaController.removeEmpresa);
api.get('/getEmpresas', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], empresaController.getEmpresas);
api.post('/search', [mdAuth.ensureAuth, mdAuth.ensureAuthEmpresa], empresaController.search);
api.post('/reportePDF/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthEmpresa], empresaController.reportePDF);


module.exports = api;