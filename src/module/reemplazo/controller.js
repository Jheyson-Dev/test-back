const tabla = 'reemplazo';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    async function getAll() {
        try {
            const reemplazos = await db.obtenerTodosReemplazos();
            return reemplazos;
        } catch (error) {
            throw new Error('Error al obtener todos los reemplazos');
        }
    }
    async function getById(id) {
        try {
            const reemplazo = await db.obtenerReemplazoPorId(id);
            return reemplazo;
        } catch (error) {
            throw new Error('Error al obtener el reemplazo por ID');
        }
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

    return{
        getAll,
        getById,
        add,
        update,
        remove
    }
    
}