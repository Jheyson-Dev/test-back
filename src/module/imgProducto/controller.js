const tabla = 'img_producto';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }
    function getAll() {
        return db.obtenerImagenesConCodigoInterno();
    }
    async function getById(id) {
        try {
            const imagen = await db.obtenerImagenesConCInternoPorId(id);
            return imagen;
        } catch (error) {
            throw new Error('Error al obtener la imagen por ID');
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