'use strict'

var bcryct = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Empresa = require('../models/empresas.model');
var pdf = require('html-pdf');

function createInit(req, res){
    Empresa.findOne({username : 'admin'}, (err, empresaEncontrada)=>{
        if(err){
            console.log('Error general al guardar');
        }else if(empresaEncontrada){
            console.log('La empresa Admin ya fue encontrada');
        }else{
            bcryct.hash('12345', null, null, (err, passwordHash)=>{
                if(err){
                    console.log('No se pudo encriptar la contraseña admin');
                }else if(passwordHash){
                    let empresa = new Empresa();
                    empresa.nombre = "Admin";
                    empresa.password = passwordHash;
                    empresa.username = 'admin';
                    empresa.role = 'ROLE_ADMIN';
                    empresa.save((err, EmpresaSave)=>{
                        if(err){
                            console.log('No se pudo crear la empresa admin');
                        }else if(EmpresaSave){
                            console.log('Empresa admin fue creada');
                        }else{
                            console.log('La empresa no fue creada');
                        }
                    });
                }else{
                    console.log('No se pudo encriptar la contraseña');
                }
                    
            });
        }
    });

}

//Para el login:
//Los parametros para obtener el token es: "getToken" los otros estan igual que como se trabajaron en clase.
function login(req, res){
    var params = req.body;
    
    if(params.password && params.username){
        Empresa.findOne({username : params.username.toLowerCase()}, (err, empresaFind)=>{
            if(err){
                res.status(500).send({mensaje: 'Error general'});              
            }else if(empresaFind){
                bcryct.compare(params.password, empresaFind.password, (err, checkPassword)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error al desencriptar la contraseña'});
                    }else if(checkPassword){
                        if(params.getToken){
                            return res.send({token : jwt.createToken(empresaFind)});
                        }else{
                            res.send({mensaje: ' Usuario logueado'});   
                        }
                    }else{
                        return res.status(404).send({mensaje: 'La contraseña es incorrecta'});
                    }                    
                });
            }else{
                res.send({mensaje: ' Usuario no encontrado'});   
            }
        });
    }else{
        return res.status(404).send({mensaje: 'Ingrese los parametros minimos'});
    }
}
//res.status(500).send({mensaje: 'Error generall '});
//res.send({mensaje: ' '});
//return res.status(404).send({mensaje: 'La contraseña es incorrecta'});

function saveEmpresa(req, res){
    var empresa = new Empresa();
    var params = req.body;

    if(params.nombre && params.password && params.email && params.username){
        Empresa.findOne({username : params.username}, (err, EmpresaFind)=>{
            if(err){
                res.status(500).send({mensaje: 'Error generall en el sistema'});
            }else if(EmpresaFind){
                res.send({mensaje: 'El username de la empresa ya esta en uso, intente otro'});
            }else{
                bcryct.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error al momento de guardar la contraseña'});
                    }else if(passwordHash){
                        empresa.nombre = params.nombre;
                        empresa.password = passwordHash;
                        empresa.direccion = params.direccion;
                        empresa.telefono = params.telefono;
                        empresa.nit = params.nit;
                        empresa.username = params.username.toLowerCase();
                        empresa.email = params.email.toLowerCase();
                        empresa.tipo = params.tipo;
                        empresa.role = 'ROLE_EMPRESA';

                        empresa.save((err, EmpresaSave)=>{
                            if(err){
                                res.status(500).send({mensaje: 'Error al guardar la empresa'});
                            }else if(EmpresaSave){
                                res.send({mensaje: 'La empresa se guardo con exito', EmpresaSave});
                            }else{
                                return res.status(404).send({mensaje: 'La empresa no se pudo guardar'});   
                            }
                        });
                    }else{
                        return res.status(404).send({mensaje: 'La contraseña no se pudo encriptar'});
                    }
                })
            }
        });
    }else{
        return res.status(404).send({mensaje: 'Por favor ingresa los datos minimos'});   
    }
}

function updateEmpresa (req, res){
    let empresaId = req.params.id;
    let update = req.body;
    
    if(empresaId == req.empresa.sub){
        if(update.password){
            return res.status(404).send({mensaje: 'No puedes cambiar este parametro aqui'});   
        }else{
            if(update.username){
                Empresa.findOne({username : update.username.toLowerCase()}, (err, empresaFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(empresaFind){
                        return res.send({message: 'El usuario ya esta en uso, intenta otro'});
                    }else{
                        Empresa.findByIdAndUpdate(empresaId, update, {new : true}, (err, empresaUpdated)=>{
                            if(err){
                                res.status(500).send({mensaje: 'Error general al actualizar'});
                            }else if (empresaUpdated){
                                res.send({mensaje: 'Empresa actualizada', empresaUpdated});
                            }else{
                                return res.status(404).send({mensaje: 'La empresa no fue actualizada'});
                            }
                        });
                    }
                });
            }else{
                Empresa.findByIdAndUpdate(empresaId, update, {new : true}, (err, empresaUpdated)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error general al actualizar'});
                    }else if (empresaUpdated){
                        res.send({mensaje: 'Empresa actualizada', empresaUpdated});
                    }else{
                        return res.status(404).send({mensaje: 'La empresa no fue actualizada'});
                    }
                });
            }
        }
    }else if(req.empresa.role == 'ROLE_ADMIN'){
        if(update.password){
            return res.status(404).send({mensaje: 'No puedes cambiar este parametro aqui'});   
        }else{
            if(update.username){
                Empresa.findOne({username : update.username.toLowerCase()}, (err, empresaFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(empresaFind){
                        return res.send({message: 'El usuario ya esta en uso, intenta otro'});
                    }else{
                        Empresa.findByIdAndUpdate(empresaId, update, {new : true}, (err, empresaUpdated)=>{
                            if(err){
                                res.status(500).send({mensaje: 'Error general al actualizar'});
                            }else if (empresaUpdated){
                                res.send({mensaje: 'Empresa actualizada', empresaUpdated});
                            }else{
                                return res.status(404).send({mensaje: 'La empresa no fue actualizada'});
                            }
                        });
                    }
                });
            }else{
                Empresa.findByIdAndUpdate(empresaId, update, {new : true}, (err, empresaUpdated)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error general al actualizar'});
                    }else if (empresaUpdated){
                        res.send({mensaje: 'Empresa actualizada', empresaUpdated});
                    }else{
                        return res.status(404).send({mensaje: 'La empresa no fue actualizada'});
                    }
                });
            }
        }
    }else{
        return res.status(404).send({mensaje: 'No puedes actualizar la empresa'});
    }
}

function removeEmpresa(req, res){
    let empresaId = req.params.id;
    let params = req.body;

    if(empresaId == req.empresa.sub){
        Empresa.findOne({_id : empresaId}, (err, empresaFind)=>{
            if(err){
                res.status(500).send({mensaje: 'Error general al encontrar la empresa'});
            }else if(empresaFind){
                bcryct.compare(params.password, empresaFind.password, (err, checkPassword)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error general al revisar la contraseña'});
                    }else if(checkPassword){
                        Empresa.findByIdAndRemove(empresaId, (err, empresaRemove)=>{
                            if(err){
                                res.status(500).send({mensaje: 'Error general al eliminar'});
                            }else if(empresaRemove){
                                res.send({mensaje: 'La empresa ha sido eliminada'});
                            }else{
                                return res.status(404).send({mensaje: 'No se pudo eliminar la empresa'});
                            }
                        });
                    }else{
                        return res.status(404).send({mensaje: 'No puedes eliminar la empresa sin la contraseña'});
                    }
                });
            }else{
                return res.status(404).send({mensaje: 'Usuario no eliminado'});              
            }
        });
    }else if(req.empresa.role == 'ROLE_ADMIN'){
        Empresa.findOne({_id : empresaId}, (err, empresaFind)=>{
            if(err){
                res.status(500).send({mensaje: 'Error general al encontrar la empresa'});
            }else if(empresaFind){
                bcryct.compare(params.password, empresaFind.password, (err, checkPassword)=>{
                    if(err){
                        res.status(500).send({mensaje: 'Error general al revisar la contraseña'});
                    }else if(checkPassword){
                        Empresa.findByIdAndRemove(empresaId, (err, empresaRemove)=>{
                            if(err){
                                res.status(500).send({mensaje: 'Error general al eliminar'});
                            }else if(empresaRemove){
                                res.send({mensaje: 'La empresa ha sido eliminada'});
                            }else{
                                return res.status(404).send({mensaje: 'No se pudo eliminar la empresa'});
                            }
                        });
                    }else{
                        return res.status(404).send({mensaje: 'No puedes eliminar la empresa sin la contraseña'});
                    }
                });
            }else{
                return res.status(404).send({mensaje: 'Usuario no eliminado'});              
            }
        });
    }else{
        return res.status(404).send({mensaje: 'No tienes permisos para acceder a eliminar otra empresa'});
    }
}

function getEmpresas(req, res){
    Empresa.find({}).populate('empleados').exec((err, empresas)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'})
        }else if(empresas){
            return res.send({message: 'Todas las empresas', empresas})
        }else{
            return res.status(404).send({mensaje: 'No se encontraron empresas'});
        }
    });
}

function search(req, res){
    var params = req.body;
    
    if(params.search){
        Empresa.find({$or:[{nombre: params.search},
                    {_id: params.search},
                    {puesto: params.search},
                    {departamento : params.search}]}, (err, resultados)=>{
            if(err){
                return res.status(500).send({mensaje: 'Error general en servidor para buscar', err});
            }else if(resultados){
                return res.send({mensaje: 'Coincidencias:', resultados});
            }else{
                return res.status(404).send({mensaje: 'No se encontraron coincidencias'});              
            }
        });
    }

}

function reportePDF(req, res){
    //Ya no me dio tiempo de aplicarle estilo
    let empresaId = req.params.id;

    Empresa.findById(empresaId).populate('empleados').exec((err, empresaFind)=>{
        if(err){
            return res.status(500).send({mensaje: 'Error general al buscar la empresa'});         
        }else if(empresaFind){
            let empleados = empresaFind.empleados;
            let empleadosFinded = [];

            empleados.forEach(round=>{
                empleadosFinded.push(round)
            });
            let content = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Lista de empleados</title>
            </head>
            <body>
                <table>
                    <caption>Lista de empleados</caption>
                    <tr>
                        <th>Nombre</th>
                        <th>Puesto</th>
                        <th>Departamento</th>
                    </tr>
                    ${empleadosFinded.map(empleados => `<tr>
                        <td>${empleados.nombre}</td>
                        <td>${empleados.puesto}</td>
                        <td>${empleados.departamento}</td>
                    </tr>`).join('')}
                </table>
            </body>
            <footer>
                <p> Jefferson García 2016-377</p>
            </footer>
            </html>
            `; 
            
            pdf.create(content).toFile('./pdf/Empleados' + empresaFind.nombre+'.pdf', (err, res)=>{
                if(err){
                    console.log(res);
                }else if(res){
                    console.log(res);
                }
            })
             res.send({mensaje: 'Se ha creado el pdf'});
        }else{
            res.status(404).send({mensaje: 'No se encontro la empresa'});          
        }
    });
}
// return res.status(500).send({mensaje: 'Error general'});
//return res.send({mensaje: ' '});
//return res.status(404).send({mensaje: ' '});

module.exports = {
    createInit,
    saveEmpresa,                //admin
    login,                      //--misma empresa y admin
    updateEmpresa,              //--misma empresa y admin
    removeEmpresa,              //--misma empresa y admin
    getEmpresas,                //solo admin
    search,                     //solo empresas
    reportePDF                  //solo empresas    
}