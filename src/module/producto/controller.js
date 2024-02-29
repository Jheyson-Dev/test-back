const tabla = 'producto';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

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

    function getDestacadosByConsulta() {
        return db.getDestacadosByConsulta(); // Asume que existe un método en tu db que implementa esta lógica
    }

    return{
        getAll,
        getById,
        add,
        update,
        remove,
        getDestacadosByConsulta 
    }
    
}