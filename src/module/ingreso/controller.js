const tabla = 'ingreso';

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
    async function add(body) {
        try {
            const nuevoRegistro = body;
            const resultado = await db.agregar(tabla, nuevoRegistro);
            await db.actualizarStockAdd(nuevoRegistro.id_tienda_producto, nuevoRegistro.cantidad);

            return resultado;
        } catch (error) {
            throw error;
        }
    }
    function update(id, newData) {
        return db.actualizarConStock(tabla, id, newData);
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