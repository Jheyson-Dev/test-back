const tabla = 'categoria';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    function getAll() {
        return db.obtenerTodos(tabla);
    }
    async function getById(idCategoria) {
        try {
            const productosConImagenes = await db.obtenerProductosConImagenesYCategoriaPorIDCategoria(idCategoria);
            return productosConImagenes;
        } catch (error) {
            throw new Error('Error al obtener productos con imágenes y categoría por ID de categoría');
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