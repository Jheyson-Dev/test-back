const db = require('../../db/mysql')

const tabla = 'persona';

function getAll() {
    return db.obtenerTodos(tabla);
}
function getById(id) {
    return db.obtenerPorId(tabla, id);
}
function add(body) {
    return db.agregar(tabla, body);
}
function update(id, newData) {
    return db.actualizar(tabla, id, newData);
}
function remove(id) {
    return db.eliminar(tabla, id);
}

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
}