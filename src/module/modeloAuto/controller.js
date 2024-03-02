const tabla = 'modelo_auto';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    async function getAll() {
        try {
            const modelosAuto = await db.obtenerModeloAutoConMarca();
            return modelosAuto;
        } catch (error) {
            throw new Error('Error al obtener todos los modelos de auto');
        }
    }
    
    async function getById(id) {
        try {
            const modeloAuto = await db.obtenerModeloAutoPorId(id);
            return modeloAuto;
        } catch (error) {
            throw new Error('Error al obtener el modelo de auto por su ID');
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