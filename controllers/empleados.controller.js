'use strict'

var Empleado = require('../models/empleados.model');
var Empresa = require('../models/empresas.model');

function setEmpleado(req, res){
    var empresaId = req.params.id;
    var params = req.body;
    var empleado = new Empleado();

    if(empresaId != req.empresa.sub){
        return res.status(500).send({mensaje: 'No tienes permisos para acceder a esta función'});
    }else{
        if(params.nombre && params.dpi && params.puesto && params.email){
            Empresa.findById(empresaId, (err, empresaFind)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error general en el sistema'});
                }else if(empresaFind){
                    empleado.nombre = params.nombre;
                    empleado.apellido = params.apellido;
                    empleado.telefono = params.telefono;
                    empleado.dpi = params.dpi;
                    empleado.departamento = params.departamento;
                    empleado.puesto = params.puesto;
                    empleado.email = params.email.toLowerCase();

                    empleado.save((err, empleadoSave)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error general al guardar'});
                        }else if(empleadoSave){
                            Empresa.findByIdAndUpdate(empresaId, {$push:{empleados: empleadoSave._id}}, {new : true}, (err, empleadoPush)=>{
                                if(err){
                                    return res.status(500).send({mensaje: 'Error general al guardar el empleado'});
                                }else if(empleadoPush){
                                    return res.send({mensaje: 'Empleado agregado', empleadoPush});
                                }else{
                                    return res.status(404).send({mensaje: 'Error al guardar el empleado'});
                                }
                            });
                        }else{
                            return res.status(404).send({mensaje: 'No se pudo guardar el empleado'});
                        }
                    });
                }else{
                    return res.status(404).send({mensaje: 'No se encontro ninguna empresa para el empleado'});
                }
            }).populate('empleados');
        }else{
            return res.status(404).send({mensaje: 'Ingresa los datos minimos'});
        }
    }
}

function updateEmpleado(req, res){
    let empresaId = req.params.id;
    let empleadoId = req.params.idE;
    let update = req.body;

    if(empresaId != req.empresa.sub){
        return res.status(500).send({mensaje: 'No puedes ingresar a esta función'});
    }else{
        if(update.nombre || update.telefono || update.departamento || update.puesto){
            Empleado.findById(empleadoId, (err, empleadoFind)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error general al actualizar el empleado'});
                }else if(empleadoFind){
                    Empresa.findOne({_id: empresaId, empleados: empleadoId}, (err, empresaFind)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error general al encontrar la empresa'});
                        }else if(empresaFind){
                            Empleado.findByIdAndUpdate(empleadoId, update, {new : true}, (err, empleadoUpdated)=>{
                                if(err){
                                    return res.status(500).send({mensaje: 'Error general al actualizar'});
                                }else if(empleadoUpdated){
                                    return res.send({mensaje: 'Contacto actualizado', empleadoUpdated});
                                }else{
                                    return res.status(404).send({mensaje: 'El contacto no se pudo actualizar'});   
                                }
                            });
                        }else{
                            return res.status(404).send({mensaje: 'La empresa no tiene registrado este contacto'});
                        }
                    }).populate('empleados');
                }else{
                    return res.status(404).send({mensaje: 'No se encontro el empleado a editar'});
                }
            });
        }else{
            return res.status(404).send({mensaje: 'Ingresa los datos minimos'});           
        }
    }
}

function removeEmpleado(req, res){
    let empresaId = req.params.id;
    let empleadoId = req.params.idE;

    if(empresaId != req.empresa.sub){
        return res.status(500).send({mensaje: 'No puedes acceder a esta función'});
    }else{
        Empresa.findOneAndUpdate({_id: empresaId, empleados: empleadoId}, 
            {$pull:{empleados: empleadoId}}, {new : true}, (err, empleadoPull)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error en el servidor al buscar la empresa'});
                }else if (empleadoPull){
                    Empleado.findByIdAndRemove(empleadoId, (err, empleadoRemove)=>{
                        if(err){
                            return res.status(500).send({mensaje: 'Error general al eliminar el empleado'});
                        }else if(empleadoRemove){
                            return res.send({mensaje: 'Empleado eliminado'});
                        }else{
                            return res.status(404).send({mensaje: 'No se pudo eliminar el empleado'});
                        }
                    })
                }else{
                    return res.status(404).send({mensaje: 'No se pudo eliminar el empleado'});
                }
            }).populate('empleados');
    }
}



// return res.status(500).send({mensaje: 'Error general'});
//return res.send({mensaje: ' '});
//return res.status(404).send({mensaje: ' '});

module.exports = {
    setEmpleado,           //solo empresas: ROLE_EMPRESA
    updateEmpleado,        //solo empresas: ROLE_EMPRESA
    removeEmpleado
}