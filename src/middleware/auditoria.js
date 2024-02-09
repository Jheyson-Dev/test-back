const db = require('../db/mysql');
const error = require('./errors');

function registrarAccion(req, res, next) {
    try {
        const idUsuario = req.user.usuarioId;
        const accion = req.method;
        const detalle_accion = req.originalUrl;
        const fecha_hora = new Date();
        const ip_usuario = req.ip;

        // Insert
        const auditoriaData = { id_usuario: idUsuario, accion, detalle_accion, fecha_hora, ip_usuario };
        db.agregar('auditoria', auditoriaData);

        next();
    } catch (err) {
        throw error('Error al registrar la acción en la auditoría', 500);
    }
}

module.exports = registrarAccion;