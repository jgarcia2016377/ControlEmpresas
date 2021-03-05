'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptacion-2016377@';

exports.createToken = (empresa)=>{
    var payload = {
        sub : empresa._id,
        nombre : empresa.nombre,
        role : empresa.role,
        email : empresa.email,
        telefono : empresa.telefono,
        iat : moment().unix(),
        exp : moment().add(4, 'hours').unix()
    }
    return jwt.encode(payload, secretKey);
}