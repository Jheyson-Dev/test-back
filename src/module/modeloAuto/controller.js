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
    async function getById(idModeloAuto) {
        try {
            const modeloAutoYProductosConImagenes = await db.obtenerModeloAutoYProductosConImagenesPorIDModelo(idModeloAuto);
            return modeloAutoYProductosConImagenes;
        } catch (error) {
            throw new Error('Error al obtener modelo auto y productos con imágenes por ID de modelo');
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