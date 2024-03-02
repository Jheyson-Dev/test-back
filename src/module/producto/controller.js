const tabla = 'producto';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    function getAll() {
        return db.obtenerProductosConCategoria();
    }
    async function getById(id) {
        try {
            const producto = await db.obtenerProductoConCategoriaPorId(id);
            return producto;
        } catch (error) {
            throw new Error('Error al obtener el producto por ID');
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
        remove, 
    }
    
}