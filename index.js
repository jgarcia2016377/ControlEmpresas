'use strict'

var mongoose = require('mongoose');
var port = 3200;
var app = require('./app');
var admin = require('./controllers/empresas.controller');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/ControlEmpresas2016377', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a la db');
        admin.createInit();
        app.listen(port, ()=>{
            console.log('Servidor de express corriendo');
        });
    })
    .catch((error)=>{
        console.log('Error al conectar al conectar a la db', error);
    }
);
